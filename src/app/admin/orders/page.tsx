import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/utils/seo";
import OrderTable from "@/components/admin/OrderTable";
import type { Order } from "@/types";

export const metadata = buildMetadata({ title: "Orders | Admin", noIndex: true });

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, user_id, status, total, shipping_address, payment_method, payment_status, created_at, updated_at, subtotal, discount, shipping")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
          Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and update customer orders.
        </p>
      </div>

      <div className="bg-white border border-gray-100 p-6">
        <OrderTable
          orders={(orders as Order[]) ?? []}
          showStatusUpdate
        />
      </div>
    </div>
  );
}
