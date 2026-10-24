import { InventoryItem } from '@/types';
import { INITIAL_INVENTORY } from '@/data/inventory';

let inMemoryInventory = [...INITIAL_INVENTORY];

export const inventoryService = {
  async getInventory(): Promise<InventoryItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return inMemoryInventory;
  },

  async updateStock(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const item = inMemoryInventory.find((i) => i.id === id);
    if (!item) return null;

    Object.assign(item, updates);
    item.totalStock = item.storeStock + item.onlineStock + item.reservedStock;
    item.status = item.totalStock === 0 ? 'Out of Stock' : item.totalStock <= item.lowStockThreshold ? 'Low Stock' : 'In Stock';
    return item;
  },

  async bulkUpdateInventory(items: InventoryItem[]): Promise<void> {
    inMemoryInventory = items;
  }
};
