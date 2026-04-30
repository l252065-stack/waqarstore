import { createClient } from "@/lib/supabase/server";
import type { Order, CreateOrderData, OrderStatus } from "@/types";

export class OrdersService {
  async createOrder(
    userId: string,
    data: CreateOrderData
  ): Promise<Order> {
    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        subtotal: data.subtotal,
        discount: data.discount,
        shipping: data.shipping,
        total: data.total,
        shipping_address: data.shipping_address as unknown as Record<string, unknown>,
        payment_method: data.payment_method,
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    return this.getOrderById(order.id) as Promise<Order>;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(
          *,
          product:products(*),
          variant:product_variants(*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data as unknown as Order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(
          *,
          product:products(*),
          variant:product_variants(*)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as unknown as Order[]) ?? [];
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as unknown as Order;
  }

  async getAllOrders(page = 1, pageSize = 20) {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;

    const { data, error, count } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(count)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    return {
      data: (data as unknown as Order[]) ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  }
}

export const ordersService = new OrdersService();
