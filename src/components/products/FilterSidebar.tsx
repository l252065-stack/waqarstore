"use client";

import type { CatalogFilters } from "@/types/product";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSidebarProps {
  filters: CatalogFilters;
  ageRangeOptions: FilterOption[];
  waistSizeOptions: FilterOption[];
  lengthOptions: FilterOption[];
  materialOptions: FilterOption[];
  onChange: (updated: Partial<CatalogFilters>) => void;
  onReset: () => void;
  totalResults: number;
}

function SelectFilter({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  ageRangeOptions,
  waistSizeOptions,
  lengthOptions,
  materialOptions,
  onChange,
  onReset,
  totalResults,
}: FilterSidebarProps) {
  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-indigo-600 hover:underline"
        >
          Reset all
        </button>
      </div>

      <p className="text-xs text-gray-400">{totalResults} product(s) found</p>

      {/* Price range */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700">Price (£)</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <SelectFilter
        id="ageRange"
        label="Age Range"
        value={filters.ageRange}
        options={ageRangeOptions}
        onChange={(v) => onChange({ ageRange: v })}
      />

      <SelectFilter
        id="waistSize"
        label="Waist Size"
        value={filters.waistSize}
        options={waistSizeOptions}
        onChange={(v) => onChange({ waistSize: v })}
      />

      <SelectFilter
        id="length"
        label="Length"
        value={filters.length}
        options={lengthOptions}
        onChange={(v) => onChange({ length: v })}
      />

      <SelectFilter
        id="material"
        label="Material"
        value={filters.material}
        options={materialOptions}
        onChange={(v) => onChange({ material: v })}
      />
    </aside>
  );
}
