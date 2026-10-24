'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { inventoryService } from '@/services/inventoryService';
import { useToast } from '@/context/ToastContext';
import { InventoryItem } from '@/types';
import {
  Boxes,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  RefreshCw,
  Store,
  Globe,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Low Stock' | 'In Stock'>('all');
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const items = await inventoryService.getInventory();
      setInventory(items);
    }
    load();
  }, []);

  const handleAdjustStock = async (id: string, field: 'storeStock' | 'onlineStock', delta: number) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;

    const newStore = field === 'storeStock' ? Math.max(0, item.storeStock + delta) : item.storeStock;
    const newOnline = field === 'onlineStock' ? Math.max(0, item.onlineStock + delta) : item.onlineStock;

    const updated = await inventoryService.updateStock(id, {
      storeStock: newStore,
      onlineStock: newOnline
    });

    if (updated) {
      setInventory(inventory.map((i) => (i.id === id ? updated : i)));
      showToast(`Updated stock for ${item.productName} (${item.size})`, 'info');
    }
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="INVENTORY MATRIX & CHANNEL ALLOCATION"
          subtitle="Physical Store Stock (Chennai / CBE) vs Online Fulfillment"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search by SKU, Product or Size..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs pl-8 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-xs text-white px-3 py-2 uppercase font-bold focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Joggers">Joggers</option>
                <option value="Shorts">Shorts</option>
                <option value="Jackets">Jackets</option>
                <option value="Sweatshirts">Sweatshirts</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-700 text-xs text-white px-3 py-2 uppercase font-bold focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">Product & Variant</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5 text-center">Store Stock (Retail)</th>
                  <th className="p-3.5 text-center">Online Stock (Web)</th>
                  <th className="p-3.5 text-center">Reserved</th>
                  <th className="p-3.5 text-center">Total Stock</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-zinc-500">
                      No inventory records found. Add stock or import catalog to begin tracking.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-white uppercase text-xs">{item.productName}</p>
                      <p className="text-[10px] text-zinc-500">
                        Size: <strong className="text-zinc-300">{item.size}</strong> • Color:{' '}
                        <strong className="text-zinc-300">{item.color}</strong>
                      </p>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-400 font-bold">{item.sku}</td>

                    {/* Store Stock Stepper */}
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(item.id, 'storeStock', -1)}
                          className="w-6 h-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-mono font-bold text-white text-xs">
                          {item.storeStock}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(item.id, 'storeStock', 1)}
                          className="w-6 h-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Online Stock Stepper */}
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(item.id, 'onlineStock', -1)}
                          className="w-6 h-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-mono font-bold text-white text-xs">
                          {item.onlineStock}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(item.id, 'onlineStock', 1)}
                          className="w-6 h-6 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 text-center font-mono text-zinc-500">{item.reservedStock}</td>
                    <td className="p-3.5 text-center font-mono font-black text-white text-sm">
                      {item.totalStock}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          item.status === 'Low Stock'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
