'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BarChart3, TrendingUp, Download, PieChart, DollarSign } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="SALES ANALYTICS & PERFORMANCE REPORTS"
          subtitle="Revenue by Category • Channel Velocity • District Performance"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs uppercase font-bold text-zinc-400">AVERAGE ORDER VALUE (AOV)</span>
              <p className="text-3xl font-black text-white font-mono">₹1,340</p>
              <p className="text-xs text-emerald-400">+12% increase from multi-item bundle additions</p>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs uppercase font-bold text-zinc-400">TOP SELLING CATEGORY</span>
              <p className="text-3xl font-black text-white">T-SHIRTS</p>
              <p className="text-xs text-zinc-400">AeroTech Seamless Tee (384 units this month)</p>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs uppercase font-bold text-zinc-400">₹699 COLLECTION VOLUME</span>
              <p className="text-3xl font-black text-white font-mono">62.8%</p>
              <p className="text-xs text-zinc-400">Of total customer orders</p>
            </div>
          </div>

          {/* District Breakdown */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-white">
              TAMIL NADU DISTRICT DELIVERY PERFORMANCE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { district: 'Chennai', share: '38%', orders: 1280 },
                { district: 'Coimbatore', share: '24%', orders: 810 },
                { district: 'Madurai', share: '14%', orders: 470 },
                { district: 'Salem & Tiruppur', share: '12%', orders: 405 },
              ].map((d) => (
                <div key={d.district} className="p-4 bg-zinc-900/60 border border-zinc-800 text-xs space-y-1">
                  <p className="font-bold text-white uppercase">{d.district}</p>
                  <p className="text-lg font-black text-white font-mono">{d.share}</p>
                  <p className="text-zinc-500 text-[10px]">{d.orders} orders fulfilled</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
