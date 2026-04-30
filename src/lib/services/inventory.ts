import { createClient } from "@/lib/supabase/server";
import type { InventoryItem } from "@/types";

export class InventoryService {
  async getInventory(): Promise<InventoryItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product_variants")
      .select(
        `
        id,
        product_id,
        size,
        color,
        sku,
        stock_quantity,
        product:products(name)
      `
      )
      .order("stock_quantity", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row) => ({
      product_id: row.product_id,
      product_name: (row.product as { name: string } | null)?.name ?? "Unknown",
      variant_id: row.id,
      size: row.size,
      color: row.color,
      sku: row.sku,
      stock_quantity: row.stock_quantity,
      low_stock_threshold: 10,
    }));
  }

  async getLowStockItems(threshold = 10): Promise<InventoryItem[]> {
    const all = await this.getInventory();
    return all.filter((item) => item.stock_quantity <= threshold);
  }

  async updateStock(variantId: string, quantity: number): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("product_variants")
      .update({ stock_quantity: quantity })
      .eq("id", variantId);

    if (error) throw new Error(error.message);
  }

  async decrementStock(variantId: string, quantity: number): Promise<void> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", variantId)
      .single();

    if (error) throw new Error(error.message);

    const newQty = Math.max(0, (data.stock_quantity ?? 0) - quantity);
    await this.updateStock(variantId, newQty);
  }
}

export const inventoryService = new InventoryService();
