import { notFound } from "next/navigation";
import { productsService } from "@/lib/services/products";
import { categoriesService } from "@/lib/services/categories";
import { buildMetadata } from "@/lib/utils/seo";
import ProductCard from "@/components/ui/ProductCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await categoriesService.getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Category Not Found", noIndex: true });
  return buildMetadata({
    title: category.name,
    description: category.description ?? `Browse our ${category.name} collection.`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    categoriesService.getCategoryBySlug(slug),
    productsService.getProductsByCategory(slug).catch(() => []),
  ]);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#0a0a0a] tracking-tight">
          {category.name.toUpperCase()}
        </h1>
        {category.description && (
          <p className="mt-3 max-w-xl mx-auto text-gray-500">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-400">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center text-gray-400">
          No products found in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
