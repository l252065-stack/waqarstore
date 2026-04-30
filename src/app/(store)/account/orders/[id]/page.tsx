import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ordersService } from "@/lib/services/orders";
import { buildMetadata } from "@/lib/utils/seo";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import OrderStatusTimeline from "@/components/ui/OrderStatusTimeline";
import Badge from "@/components/ui/Badge";
import { OrderStatus } from "@/types";
import Image from "next/image";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = buildMetadata({ title: "Order Details", noIndex: true });

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const order = await ordersService.getOrderById(id);
  if (!order || order.user_id !== user.id) notFound();

  const shippingAddress = order.shipping_address as {
    full_name?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country?: string;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400">
        <Link href="/account" className="hover:text-[#0a0a0a]">Account</Link>
        <ChevronRight size={12} />
        <span className="text-[#0a0a0a] font-medium">
          Order #{id.slice(0, 8).toUpperCase()}
        </span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">
            Order #{id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <Badge
          variant={
            order.status === OrderStatus.DELIVERED
              ? "success"
              : order.status === OrderStatus.CANCELLED
              ? "danger"
              : "info"
          }
          className="self-start sm:self-auto"
        >
          {order.status.replace(/_/g, " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="md:col-span-1">
          <h2 className="text-sm font-semibold text-[#0a0a0a] uppercase tracking-wide mb-4">
            Order Status
          </h2>
          <OrderStatusTimeline
            currentStatus={order.status}
            createdAt={order.created_at}
          />
        </div>

        {/* Items + Summary */}
        <div className="md:col-span-2 space-y-8">
          {/* Items */}
          <div>
            <h2 className="text-sm font-semibold text-[#0a0a0a] uppercase tracking-wide mb-4">
              Items Ordered
            </h2>
            <div className="border border-gray-100 divide-y divide-gray-100">
              {(order.items ?? []).map((item) => {
                const imageUrl =
                  item.product?.images?.find((i) => i.is_primary)?.url ??
                  "/placeholder-product.jpg";
                return (
                  <div key={item.id} className="flex gap-4 p-4">
                    <div className="relative h-20 w-16 shrink-0 bg-[#f5f4f2] overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={item.product?.name ?? "Product"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#0a0a0a] text-sm line-clamp-2">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Size: {item.variant?.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#0a0a0a] shrink-0">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-[#f5f4f2] p-6 space-y-3">
            <h2 className="text-sm font-semibold text-[#0a0a0a] uppercase tracking-wide mb-2">
              Order Summary
            </h2>
            {[
              { label: "Subtotal", value: order.subtotal },
              { label: "Shipping", value: order.shipping },
              { label: "Discount", value: -order.discount },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className={`font-medium ${value < 0 ? "text-green-600" : "text-[#0a0a0a]"}`}>
                  {value < 0 ? `-${formatCurrency(-value)}` : formatCurrency(value)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-[#0a0a0a]">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="text-xs text-gray-400 pt-1">
              Payment: {order.payment_method.toUpperCase()} ·{" "}
              <span
                className={
                  order.payment_status === "paid" ? "text-green-600" : "text-orange-500"
                }
              >
                {order.payment_status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Shipping address */}
          <div>
            <h2 className="text-sm font-semibold text-[#0a0a0a] uppercase tracking-wide mb-3">
              Shipping Address
            </h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-[#0a0a0a]">{shippingAddress.full_name}</p>
              <p>{shippingAddress.phone}</p>
              <p>{shippingAddress.address_line1}</p>
              {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.province}{" "}
                {shippingAddress.postal_code}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
