import { createClient } from "@/lib/supabase/server";
import { ordersService } from "@/lib/services/orders";
import StatsCard from "@/components/admin/StatsCard";
import OrderTable from "@/components/admin/OrderTable";
import { buildMetadata } from "@/lib/utils/seo";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Admin Dashboard",
  noIndex: true,
});

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch all required stats in parallel
  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalCustomers },
    { data: recentOrdersRaw },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
    supabase
      .from("orders")
      .select("id, user_id, status, total, shipping_address, payment_method, payment_status, created_at, updated_at, subtotal, discount, shipping")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("orders")
      .select("total")
      .eq("payment_status", "paid"),
  ]);

  const totalRevenue = (revenueData ?? []).reduce(
    (sum, o) => sum + (o.total ?? 0),
    0
  );

  const recentOrders = (recentOrdersRaw ?? []) as Parameters<typeof OrderTable>[0]["orders"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, here&apos;s what&apos;s happening at Waqar Store.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={totalRevenue}
          format="currency"
          icon={DollarSign}
          change={12}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders ?? 0}
          format="number"
          icon={ShoppingCart}
          change={8}
        />
        <StatsCard
          title="Active Products"
          value={totalProducts ?? 0}
          format="number"
          icon={Package}
          change={3}
        />
        <StatsCard
          title="Total Customers"
          value={totalCustomers ?? 0}
          format="number"
          icon={Users}
          change={15}
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-[#0a0a0a]">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-[#c9a84c]"
          >
            View all
          </a>
        </div>
        <OrderTable orders={recentOrders} showStatusUpdate />
      </div>
    </div>
  );
}
