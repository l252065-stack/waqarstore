import type { Product, CatalogFilters } from "@/types/product";

/**
 * Filter and search a list of boys' trousers products on the client side.
 * Matches across product name, brand, description, and all variant attributes.
 */
export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
): Product[] {
  const search = filters.search.trim().toLowerCase();
  const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : null;

  return products
    .map((product) => {
      // Text search across product-level fields
      if (search) {
        const haystack = [
          product.name,
          product.brand ?? "",
          product.description ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return null;
      }

      // Filter variants
      const matchingVariants = product.variants.filter((v) => {
        if (filters.ageRange && v.ageRange !== filters.ageRange) return false;
        if (filters.waistSize && v.waistSize !== filters.waistSize) return false;
        if (filters.length && v.length !== filters.length) return false;
        if (filters.material && v.material !== filters.material) return false;
        if (minPrice !== null && v.price < minPrice) return false;
        if (maxPrice !== null && v.price > maxPrice) return false;
        return true;
      });

      if (matchingVariants.length === 0) return null;
      return { ...product, variants: matchingVariants };
    })
    .filter((p): p is Product => p !== null);
}

/** Extract distinct values for a given variant field from a product list. */
export function getDistinctVariantValues(
  products: Product[],
  field: keyof Pick<
    Product["variants"][number],
    "ageRange" | "waistSize" | "length" | "material"
  >,
): string[] {
  const set = new Set<string>();
  for (const product of products) {
    for (const variant of product.variants) {
      const value = variant[field];
      if (value) set.add(value);
    }
  }
  return Array.from(set).sort();
}
