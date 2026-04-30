"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { InventoryItem } from "@/types";

interface InventoryTableProps {
  items: InventoryItem[];
  lowStockThreshold?: number;
}

export default function InventoryTable({
  items,
  lowStockThreshold = 10,
}: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState(items);

  function startEdit(item: InventoryItem) {
    setEditingId(item.variant_id);
    setEditQty(item.stock_quantity);
  }

  async function saveEdit(variantId: string) {
    setSavingId(variantId);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: variantId, stock_quantity: editQty }),
      });

      if (!res.ok) throw new Error("Failed to update stock");

      setLocalItems((prev) =>
        prev.map((item) =>
          item.variant_id === variantId
            ? { ...item, stock_quantity: editQty }
            : item
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Stock update failed:", error);
    } finally {
      setSavingId(null);
    }
  }

  if (localItems.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No inventory data found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            {["Product", "SKU", "Size", "Color", "Stock", "Status", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  className="pb-3 pr-4 font-medium text-gray-500 uppercase text-xs tracking-wide"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {localItems.map((item) => {
            const isLow = item.stock_quantity <= lowStockThreshold;
            const isOut = item.stock_quantity === 0;
            const isEditing = editingId === item.variant_id;

            return (
              <tr
                key={item.variant_id}
                className={cn(
                  "transition-colors",
                  isOut
                    ? "bg-red-50/50"
                    : isLow
                    ? "bg-yellow-50/50"
                    : "hover:bg-[#f5f4f2]/50"
                )}
              >
                <td className="py-4 pr-4 font-medium text-[#0a0a0a] max-w-[200px]">
                  <span className="line-clamp-1">{item.product_name}</span>
                </td>
                <td className="py-4 pr-4 font-mono text-xs text-gray-500">
                  {item.sku}
                </td>
                <td className="py-4 pr-4 text-gray-600">{item.size}</td>
                <td className="py-4 pr-4 text-gray-600">{item.color ?? "—"}</td>
                <td className="py-4 pr-4">
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      value={editQty}
                      onChange={(e) => setEditQty(Number(e.target.value))}
                      className="w-20 border border-gray-300 px-2 py-1 text-sm focus:border-[#0a0a0a] focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={cn(
                        "font-semibold",
                        isOut
                          ? "text-red-600"
                          : isLow
                          ? "text-yellow-600"
                          : "text-[#0a0a0a]"
                      )}
                    >
                      {item.stock_quantity}
                    </span>
                  )}
                </td>
                <td className="py-4 pr-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                      isOut
                        ? "bg-red-100 text-red-700"
                        : isLow
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    )}
                  >
                    {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                  </span>
                </td>
                <td className="py-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(item.variant_id)}
                        disabled={savingId === item.variant_id}
                        className="text-xs font-medium text-green-700 hover:underline disabled:opacity-50"
                      >
                        {savingId === item.variant_id ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-medium text-gray-400 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(item)}
                      className="text-xs font-medium text-[#0a0a0a] underline underline-offset-2 hover:text-[#c9a84c] transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
