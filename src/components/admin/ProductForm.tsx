"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_at_price: string;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories: Category[];
  productId?: string;
  mode: "create" | "edit";
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({
  initialData,
  categories,
  productId,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? "",
    compare_at_price: initialData?.compare_at_price ?? "",
    category_id: initialData?.category_id ?? "",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
  });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm((f) => ({
      ...f,
      name,
      slug: mode === "create" ? generateSlug(name) : f.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "create"
          ? "/api/products"
          : `/api/products/${productId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          compare_at_price: form.compare_at_price
            ? parseFloat(form.compare_at_price)
            : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Product Name *"
            value={form.name}
            onChange={handleNameChange}
            required
            placeholder="e.g. Classic Oxford Shirt"
          />
        </div>

        <Input
          label="Slug *"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          required
          placeholder="classic-oxford-shirt"
          hint="URL-friendly identifier"
        />

        <div>
          <label className="text-sm font-medium text-[#0a0a0a] block mb-1">
            Category *
          </label>
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, category_id: e.target.value }))
            }
            required
            className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#0a0a0a] focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a]"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Price (PKR) *"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          required
          placeholder="2499"
        />

        <Input
          label="Compare at Price (PKR)"
          type="number"
          min="0"
          step="0.01"
          value={form.compare_at_price}
          onChange={(e) =>
            setForm((f) => ({ ...f, compare_at_price: e.target.value }))
          }
          placeholder="3499"
          hint="Original price before discount"
        />

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-[#0a0a0a] block mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={4}
            placeholder="Product description…"
            className="w-full border border-gray-300 px-4 py-2.5 text-sm text-[#0a0a0a] focus:border-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] resize-none"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_active: e.target.checked }))
            }
            className="h-4 w-4 accent-[#c9a84c]"
          />
          <span className="text-sm font-medium text-[#0a0a0a]">Active</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_featured: e.target.checked }))
            }
            className="h-4 w-4 accent-[#c9a84c]"
          />
          <span className="text-sm font-medium text-[#0a0a0a]">Featured</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create Product" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
