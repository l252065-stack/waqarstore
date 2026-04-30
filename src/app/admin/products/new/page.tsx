import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({ title: "New Product | Admin", noIndex: true });

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
          New Product
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new product to your store.
        </p>
      </div>

      <div className="bg-white border border-gray-100 p-8">
        <ProductForm
          mode="create"
          categories={categories ?? []}
        />
      </div>
    </div>
  );
}
