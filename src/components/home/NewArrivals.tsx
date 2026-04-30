import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c9a84c] mb-2">
            Just Landed
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0a0a0a] tracking-tight">
            NEW ARRIVALS
          </h2>
        </div>
        <Link
          href="/products?sort=newest"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#0a0a0a] underline underline-offset-4 hover:text-[#c9a84c] transition-colors"
        >
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          No products yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}

      {/* Mobile CTA */}
      <div className="mt-10 sm:hidden text-center">
        <Link
          href="/products?sort=newest"
          className="inline-flex items-center justify-center w-full max-w-xs border border-[#0a0a0a] px-8 py-3 text-sm font-semibold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors"
        >
          View All New Arrivals
        </Link>
      </div>
    </section>
  );
}
