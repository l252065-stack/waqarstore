import { Suspense } from "react";
import { productsService } from "@/lib/services/products";
import { categoriesService } from "@/lib/services/categories";
import ProductCard from "@/components/ui/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { buildMetadata } from "@/lib/utils/seo";
import type { ProductFilters } from "@/types";

export const metadata = buildMetadata({
  title: "All Products",
  description: "Browse our full collection of premium men's clothing.",
  path: "/products",
});

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "best_selling", label: "Best Selling" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRICE_RANGES = [
  { label: "Under PKR 2,000", min: 0, max: 2000 },
  { label: "PKR 2,000 – 4,000", min: 2000, max: 4000 },
  { label: "PKR 4,000 – 7,000", min: 4000, max: 7000 },
  { label: "Over PKR 7,000", min: 7000, max: undefined },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const filters: ProductFilters = {
    category: params.category,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    sizes: params.size ? [params.size] : undefined,
    sortBy:
      (params.sort as ProductFilters["sortBy"]) ??
      (params.sort === "sale" ? "price_asc" : "newest"),
    search: params.search,
    page: params.page ? parseInt(params.page) : 1,
    pageSize: 20,
  };

  const [{ data: products, total, page, totalPages }, categories] =
    await Promise.all([
      productsService.getProducts(filters).catch(() => ({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
      })),
      categoriesService.getRootCategories().catch(() => []),
    ]);

  const currentPage = page ?? 1;

  function buildUrl(newParams: Record<string, string | undefined>) {
    const merged = { ...params, ...newParams };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v) qs.set(k, v);
    }
    return `/products?${qs.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0a0a0a] tracking-tight">
            {params.search ? `Search: "${params.search}"` : "All Products"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Sort dropdown */}
        <form method="get" action="/products">
          {Object.entries(params)
            .filter(([k]) => k !== "sort")
            .map(([k, v]) =>
              v ? <input key={k} type="hidden" name={k} value={v} /> : null
            )}
          <select
            name="sort"
            defaultValue={params.sort ?? "newest"}
            onChange={(e) => {
              const form = e.target.form;
              if (form) form.submit();
            }}
            className="border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#0a0a0a] focus:border-[#0a0a0a] focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0a0a0a] mb-3">
              Category
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href={buildUrl({ category: undefined })}
                  className={`block text-sm py-1 transition-colors ${
                    !params.category
                      ? "font-semibold text-[#0a0a0a]"
                      : "text-gray-500 hover:text-[#0a0a0a]"
                  }`}
                >
                  All
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={buildUrl({ category: cat.slug })}
                    className={`block text-sm py-1 transition-colors ${
                      params.category === cat.slug
                        ? "font-semibold text-[#0a0a0a]"
                        : "text-gray-500 hover:text-[#0a0a0a]"
                    }`}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0a0a0a] mb-3">
              Price Range
            </h3>
            <ul className="space-y-1">
              {PRICE_RANGES.map((range) => {
                const isActive =
                  params.minPrice === String(range.min) &&
                  (range.max === undefined
                    ? !params.maxPrice
                    : params.maxPrice === String(range.max));

                return (
                  <li key={range.label}>
                    <a
                      href={buildUrl({
                        minPrice: String(range.min),
                        maxPrice: range.max ? String(range.max) : undefined,
                      })}
                      className={`block text-sm py-1 transition-colors ${
                        isActive
                          ? "font-semibold text-[#0a0a0a]"
                          : "text-gray-500 hover:text-[#0a0a0a]"
                      }`}
                    >
                      {range.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0a0a0a] mb-3">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <a
                  key={size}
                  href={buildUrl({ size: params.size === size ? undefined : size })}
                  className={`flex h-9 w-12 items-center justify-center border text-xs font-medium transition-colors ${
                    params.size === size
                      ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                      : "border-gray-200 text-gray-600 hover:border-[#0a0a0a]"
                  }`}
                >
                  {size}
                </a>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {(params.category || params.minPrice || params.size || params.search) && (
            <a
              href="/products"
              className="text-xs text-red-600 underline underline-offset-2 hover:text-red-700"
            >
              Clear all filters
            </a>
          )}
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium text-[#0a0a0a]">
                No products found
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try adjusting your filters or search terms.
              </p>
              <a
                href="/products"
                className="mt-4 text-sm font-medium text-[#0a0a0a] underline underline-offset-2 hover:text-[#c9a84c]"
              >
                Clear filters
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 3} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <a
                        key={p}
                        href={buildUrl({ page: String(p) })}
                        className={`flex h-9 w-9 items-center justify-center text-sm font-medium transition-colors ${
                          p === currentPage
                            ? "bg-[#0a0a0a] text-white"
                            : "border border-gray-200 text-[#0a0a0a] hover:border-[#0a0a0a]"
                        }`}
                      >
                        {p}
                      </a>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
