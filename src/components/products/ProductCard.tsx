"use client";

import Image from "next/image";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = product.variants.reduce(
    (min, v) => (v.price < min ? v.price : min),
    product.variants[0]?.price ?? 0,
  );

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const materials = [...new Set(product.variants.map((v) => v.material))].join(
    ", ",
  );

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      {/* Product image */}
      <div className="relative h-52 w-full bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {totalStock === 0 && (
          <span className="absolute top-2 right-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Out of stock
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {product.brand}
          </span>
        )}

        <h3 className="text-base font-semibold text-gray-900 leading-tight">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Variant chips */}
        <div className="mt-1 flex flex-wrap gap-1">
          {[...new Set(product.variants.map((v) => v.ageRange))].map((age) => (
            <span
              key={age}
              className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
            >
              {age}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-400">Material: {materials}</p>

        {/* Price & CTA */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-gray-900">
            From £{lowestPrice.toFixed(2)}
          </span>
          <button
            type="button"
            disabled={totalStock === 0}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {totalStock > 0 ? "Add to Bag" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
