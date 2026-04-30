"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import Badge from "@/components/ui/Badge";
import { OrderStatus } from "@/types";
import type { Order } from "@/types";

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  [OrderStatus.PENDING]: { label: "Pending", variant: "warning" },
  [OrderStatus.CONFIRMED]: { label: "Confirmed", variant: "info" },
  [OrderStatus.PROCESSING]: { label: "Processing", variant: "info" },
  [OrderStatus.SHIPPED]: { label: "Shipped", variant: "default" },
  [OrderStatus.OUT_FOR_DELIVERY]: { label: "Out for Delivery", variant: "default" },
  [OrderStatus.DELIVERED]: { label: "Delivered", variant: "success" },
  [OrderStatus.CANCELLED]: { label: "Cancelled", variant: "danger" },
  [OrderStatus.REFUNDED]: { label: "Refunded", variant: "danger" },
};

interface OrderTableProps {
  orders: Order[];
  showStatusUpdate?: boolean;
}

export default function OrderTable({
  orders,
  showStatusUpdate = false,
}: OrderTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState(orders);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setLocalOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  if (localOrders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="pb-3 font-medium text-gray-500 uppercase text-xs tracking-wide pr-4">
              Order ID
            </th>
            <th className="pb-3 font-medium text-gray-500 uppercase text-xs tracking-wide pr-4">
              Customer
            </th>
            <th className="pb-3 font-medium text-gray-500 uppercase text-xs tracking-wide pr-4">
              Date
            </th>
            <th className="pb-3 font-medium text-gray-500 uppercase text-xs tracking-wide pr-4">
              Total
            </th>
            <th className="pb-3 font-medium text-gray-500 uppercase text-xs tracking-wide pr-4">
              Status
            </th>
            <th className="pb-3 font-medium text-gray-500 uppercase text-xs tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {localOrders.map((order) => {
            const statusInfo = STATUS_BADGE[order.status] ?? {
              label: order.status,
              variant: "default" as const,
            };

            return (
              <tr key={order.id} className="hover:bg-[#f5f4f2]/50 transition-colors">
                <td className="py-4 pr-4">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="font-mono text-xs font-semibold text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
                  >
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="py-4 pr-4 text-gray-600">
                  {(order.shipping_address as { full_name?: string })?.full_name ?? "—"}
                </td>
                <td className="py-4 pr-4 text-gray-500 whitespace-nowrap">
                  {formatDate(order.created_at)}
                </td>
                <td className="py-4 pr-4 font-semibold text-[#0a0a0a]">
                  {formatCurrency(order.total)}
                </td>
                <td className="py-4 pr-4">
                  {showStatusUpdate ? (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      disabled={updatingId === order.id}
                      className="border border-gray-200 text-xs px-2 py-1 focus:border-[#0a0a0a] focus:outline-none disabled:opacity-50"
                    >
                      {Object.values(OrderStatus).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_BADGE[s]?.label ?? s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  )}
                </td>
                <td className="py-4">
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-xs font-medium text-[#0a0a0a] underline underline-offset-2 hover:text-[#c9a84c] transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
