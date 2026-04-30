import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { buildMetadata } from "@/lib/utils/seo";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = buildMetadata({ title: "Edit Product | Admin", noIndex: true });

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
          Edit Product
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-mono">{product.slug}</p>
      </div>

      <div className="bg-white border border-gray-100 p-8">
        <ProductForm
          mode="edit"
          productId={id}
          categories={categories ?? []}
          initialData={{
            name: product.name,
            slug: product.slug,
            description: product.description ?? "",
            price: String(product.price),
            compare_at_price: product.compare_at_price
              ? String(product.compare_at_price)
              : "",
            category_id: product.category_id,
            is_active: product.is_active,
            is_featured: product.is_featured,
          }}
        />
      </div>
    </div>
  );
}
