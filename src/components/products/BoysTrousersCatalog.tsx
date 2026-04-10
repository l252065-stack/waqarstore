"use client";

import { useState, useMemo } from "react";
import type { Product, CatalogFilters } from "@/types/product";
import { filterProducts, getDistinctVariantValues } from "@/lib/filterProducts";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";

const EMPTY_FILTERS: CatalogFilters = {
  search: "",
  ageRange: "",
  waistSize: "",
  length: "",
  material: "",
  minPrice: "",
  maxPrice: "",
};

interface BoysTrousersCatalogProps {
  initialProducts: Product[];
}

export default function BoysTrousersCatalog({
  initialProducts,
}: BoysTrousersCatalogProps) {
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);

  // Derive distinct option lists from the full dataset (unfiltered)
  const ageRangeOptions = useMemo(
    () =>
      getDistinctVariantValues(initialProducts, "ageRange").map((v) => ({
        value: v,
        label: v,
      })),
    [initialProducts],
  );
  const waistSizeOptions = useMemo(
    () =>
      getDistinctVariantValues(initialProducts, "waistSize").map((v) => ({
        value: v,
        label: v,
      })),
    [initialProducts],
  );
  const lengthOptions = useMemo(
    () =>
      getDistinctVariantValues(initialProducts, "length").map((v) => ({
        value: v,
        label: v,
      })),
    [initialProducts],
  );
  const materialOptions = useMemo(
    () =>
      getDistinctVariantValues(initialProducts, "material").map((v) => ({
        value: v,
        label: v,
      })),
    [initialProducts],
  );

  // Apply filters + search
  const filtered = useMemo(
    () => filterProducts(initialProducts, filters),
    [initialProducts, filters],
  );

  const handleFilterChange = (updated: Partial<CatalogFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <header className="bg-indigo-700 py-10 text-center text-white">
        <h1 className="text-3xl font-bold tracking-tight">Boys&apos; Trousers</h1>
        <p className="mt-2 text-indigo-200">
          Ages 2–13 · School, Casual &amp; Smart styles
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search boys' trousers…"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-64 lg:shrink-0">
            <FilterSidebar
              filters={filters}
              ageRangeOptions={ageRangeOptions}
              waistSizeOptions={waistSizeOptions}
              lengthOptions={lengthOptions}
              materialOptions={materialOptions}
              onChange={handleFilterChange}
              onReset={handleReset}
              totalResults={filtered.length}
            />
          </div>

          {/* Product grid */}
          <section className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-lg font-medium">No products match your filters.</p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
