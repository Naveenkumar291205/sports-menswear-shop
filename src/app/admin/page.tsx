'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { inventoryService } from '@/services/inventoryService';
import { Order, Product, InventoryItem } from '@/types';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  RotateCcw,
  ArrowUpRight,
  Store,
  FileSpreadsheet,
  Plus
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [o, p, inv] = await Promise.all([
        orderService.getOrders(),
        productService.getProducts({ limit: 100 }),
        inventoryService.getInventory()
      ]);
      setOrders(o);
      setProducts(p.products);
      setInventory(inv);
      setIsLoading(false);
    }
    load();
  }, []);

  const totalSales = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Placed' || o.status === 'Processing').length;
  const lowStockCount = inventory.filter((i) => i.status === 'Low Stock').length;

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="EXECUTIVE DASHBOARD"
          subtitle="Real-time Metrics • 5,000 Catalog Capacity • Omnichannel Sales"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">TOTAL SALES</span>
              <p className="text-xl font-black text-white font-mono">₹{totalSales.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-0.5">
                Live Revenue
              </span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">TOTAL ORDERS</span>
              <p className="text-xl font-black text-white font-mono">{orders.length}</p>
              <span className="text-[10px] text-zinc-500 font-mono">Active Orders</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">CUSTOMERS</span>
              <p className="text-xl font-black text-white font-mono">0</p>
              <span className="text-[10px] text-zinc-500">Registered Athletes</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">ACTIVE PRODUCTS</span>
              <p className="text-xl font-black text-white font-mono">{products.length}</p>
              <span className="text-[10px] text-zinc-500">In Catalog</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">PENDING ORDERS</span>
              <p className="text-xl font-black text-amber-400 font-mono">{pendingOrders}</p>
              <span className="text-[10px] text-zinc-500">In Fulfillment</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">LOW STOCK</span>
              <p className="text-xl font-black text-red-400 font-mono">{lowStockCount}</p>
              <span className="text-[10px] text-zinc-500">Needs Reorder</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400">RETURNS</span>
              <p className="text-xl font-black text-white font-mono">0</p>
              <span className="text-[10px] text-zinc-500">Open Requests</span>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-white">
              <span>Quick Operations:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/admin/pos">
                <Button size="sm" variant="white" leftIcon={<Store className="w-3.5 h-3.5" />}>
                  Open Physical Store POS
                </Button>
              </Link>
              <Link href="/admin/products/import">
                <Button size="sm" variant="outline" leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}>
                  Bulk CSV Import (5,000 SKUs)
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Sales Performance Chart (Visual High-Tech Bar Simulation) */}
          <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase text-white">
                  TAMIL NADU REVENUE & VOLUME BREAKDOWN
                </h3>
                <p className="text-xs text-zinc-400">Daily sales velocity (Chennai, Coimbatore, Madurai & Online)</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-zinc-900 text-[10px] font-bold text-white border border-zinc-800">
                  Online: 68%
                </span>
                <span className="px-2 py-0.5 bg-zinc-900 text-[10px] font-bold text-zinc-400 border border-zinc-800">
                  Retail POS: 32%
                </span>
              </div>
            </div>

            {/* Weekly Bar Graph Matrix */}
            <div className="grid grid-cols-7 gap-3 sm:gap-6 pt-6 pb-2 items-end h-48 border-b border-zinc-800">
              {[
                { day: 'Mon', height: '60%', amount: '₹42.5k' },
                { day: 'Tue', height: '75%', amount: '₹58.2k' },
                { day: 'Wed', height: '65%', amount: '₹49.8k' },
                { day: 'Thu', height: '85%', amount: '₹64.0k' },
                { day: 'Fri', height: '95%', amount: '₹76.4k' },
                { day: 'Sat', height: '100%', amount: '₹89.2k' },
                { day: 'Sun', height: '90%', amount: '₹71.1k' },
              ].map((bar) => (
                <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-zinc-500 group-hover:text-white transition-colors">
                    {bar.amount}
                  </span>
                  <div
                    className="w-full max-w-[48px] bg-zinc-800 group-hover:bg-white transition-all shadow-glow"
                    style={{ height: bar.height }}
                  />
                  <span className="text-xs font-bold uppercase text-zinc-400 mt-1">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dual Tables: Recent Orders & Low Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  RECENT ORDERS FEED
                </h3>
                <Link href="/admin/orders" className="text-[11px] font-bold text-zinc-400 hover:text-white uppercase">
                  View All Orders →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No orders placed yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-zinc-500 uppercase text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="pb-2">Order</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-900/50">
                          <td className="py-2.5 font-mono font-bold text-white">#{ord.orderNumber}</td>
                          <td className="py-2.5">{ord.shippingAddress.fullName}</td>
                          <td className="py-2.5 font-mono font-bold text-white">₹{ord.totalAmount}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : ord.status === 'Shipped'
                                  ? 'bg-white text-black font-black'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Low Stock Alerts */}
            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>LOW INVENTORY ALERTS</span>
                </h3>
                <Link href="/admin/inventory" className="text-[11px] font-bold text-zinc-400 hover:text-white uppercase">
                  Matrix →
                </Link>
              </div>

              {inventory.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No inventory alerts. All stock counts normal.
                </div>
              ) : (
                <div className="space-y-3">
                  {inventory.slice(0, 4).map((inv) => (
                    <div key={inv.id} className="p-3 bg-zinc-900/40 border border-zinc-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white uppercase">{inv.productName}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          SKU: {inv.sku} • Size: {inv.size} ({inv.color})
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white font-mono">{inv.totalStock} Units</span>
                        <p className="text-[9px] text-zinc-500">Threshold: {inv.lowStockThreshold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
