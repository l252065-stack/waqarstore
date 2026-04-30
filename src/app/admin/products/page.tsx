import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { buildMetadata } from "@/lib/utils/seo";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";

export const metadata = buildMetadata({ title: "Products | Admin", noIndex: true });

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name),
      images:product_images(url, is_primary)
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2.5 text-sm font-medium hover:bg-[#c9a84c] transition-colors"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left bg-[#f5f4f2]">
                {["Product", "Category", "Price", "Status", "Created", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products as Product[] ?? []).map((product) => {
                const primaryImage = product.images?.find((i) => i.is_primary);
                return (
                  <tr key={product.id} className="hover:bg-[#f5f4f2]/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 bg-[#f5f4f2] overflow-hidden">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#0a0a0a] line-clamp-1 max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-[#0a0a0a]">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          {formatCurrency(product.compare_at_price)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          product.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex items-center gap-1 text-xs font-medium text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil size={13} />
                          Edit
                        </Link>
                        <form
                          action={`/api/products/${product.id}`}
                          method="DELETE"
                          onSubmit={(e) => {
                            if (!confirm(`Delete "${product.name}"?`)) e.preventDefault();
                          }}
                        >
                          <button
                            type="submit"
                            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!products || products.length === 0) && (
            <div className="py-16 text-center text-gray-400 text-sm">
              No products yet.{" "}
              <Link
                href="/admin/products/new"
                className="text-[#0a0a0a] underline underline-offset-2 hover:text-[#c9a84c]"
              >
                Add your first product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
