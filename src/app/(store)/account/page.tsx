import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ordersService } from "@/lib/services/orders";
import { buildMetadata } from "@/lib/utils/seo";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import Badge from "@/components/ui/Badge";
import { OrderStatus } from "@/types";

export const metadata = buildMetadata({
  title: "My Account",
  path: "/account",
  noIndex: true,
});

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

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as { full_name?: string | null; phone?: string | null } | null;

  const orders = await ordersService.getOrdersByUser(user.id).catch(() => []);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-[#0a0a0a] tracking-tight">
        My Account
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile card */}
        <aside className="md:col-span-1">
          <div className="bg-[#f5f4f2] p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white text-xl font-bold">
                {(profile?.full_name ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#0a0a0a]">
                  {profile?.full_name ?? "Customer"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              {profile?.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {profile.phone}
                </p>
              )}
              <p className="text-gray-500 text-xs">
                Member since {formatDate(user.created_at ?? "")}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/account/profile"
                className="text-sm font-medium text-[#0a0a0a] underline underline-offset-2 hover:text-[#c9a84c] transition-colors"
              >
                Edit Profile
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-[#0a0a0a]">{orders.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Orders</p>
            </div>
            <div className="bg-white border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-[#0a0a0a]">
                {orders.filter((o) => o.status === OrderStatus.DELIVERED).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Delivered</p>
            </div>
          </div>
        </aside>

        {/* Orders */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0a0a0a]">Recent Orders</h2>
            {orders.length > 5 && (
              <Link
                href="/account/orders"
                className="text-sm text-gray-500 underline underline-offset-2 hover:text-[#c9a84c]"
              >
                View all
              </Link>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-[#f5f4f2] p-8 text-center">
              <p className="text-gray-500 text-sm">No orders yet.</p>
              <Link
                href="/products"
                className="mt-3 inline-block text-sm font-medium text-[#0a0a0a] underline underline-offset-2 hover:text-[#c9a84c]"
              >
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const statusInfo = STATUS_BADGE[order.status] ?? {
                  label: order.status,
                  variant: "default" as const,
                };
                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="block bg-white border border-gray-100 p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs font-semibold text-[#0a0a0a]">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#0a0a0a]">
                          {formatCurrency(order.total)}
                        </p>
                        <Badge variant={statusInfo.variant} className="mt-1">
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
