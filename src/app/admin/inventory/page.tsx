import { buildMetadata } from "@/lib/utils/seo";
import { inventoryService } from "@/lib/services/inventory";
import InventoryTable from "@/components/admin/InventoryTable";

export const metadata = buildMetadata({ title: "Inventory | Admin", noIndex: true });

export default async function AdminInventoryPage() {
  const inventory = await inventoryService.getInventory().catch(() => []);
  const lowStockCount = inventory.filter((i) => i.stock_quantity <= 10 && i.stock_quantity > 0).length;
  const outOfStockCount = inventory.filter((i) => i.stock_quantity === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
          Inventory
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and update stock levels across all product variants.
        </p>
      </div>

      {/* Alerts */}
      {(outOfStockCount > 0 || lowStockCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {outOfStockCount > 0 && (
            <div className="bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
              ⚠️ <strong>{outOfStockCount}</strong> variant{outOfStockCount !== 1 ? "s" : ""} out of stock
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-700">
              ⚡ <strong>{lowStockCount}</strong> variant{lowStockCount !== 1 ? "s" : ""} low on stock
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-100 p-6">
        <InventoryTable items={inventory} lowStockThreshold={10} />
      </div>
    </div>
  );
}
