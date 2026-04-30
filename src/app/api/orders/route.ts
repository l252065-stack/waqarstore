import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ordersService } from "@/lib/services/orders";
import type { CreateOrderData } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Admins can see all orders; customers see only their own
    const orders =
      profile?.role === "admin"
        ? await ordersService.getAllOrders()
        : { data: await ordersService.getOrdersByUser(user.id), total: 0, page: 1, pageSize: 20, totalPages: 1 };

    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: CreateOrderData = await req.json();

    if (!body.items?.length || !body.shipping_address || !body.payment_method) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    const order = await ordersService.createOrder(user.id, body);
    return NextResponse.json({ data: order }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
