'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { orderService } from '@/services/orderService';
import { useToast } from '@/context/ToastContext';
import { ReturnRequest } from '@/types';
import { RotateCcw, Check, RefreshCw } from 'lucide-react';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const rets = await orderService.getReturns();
      setReturns(rets);
    }
    load();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ReturnRequest['status']) => {
    const updated = await orderService.updateReturnStatus(id, newStatus);
    if (updated) {
      setReturns(returns.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      showToast(`Updated request to "${newStatus}"`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="RETURNS & SIZE EXCHANGE LOGISTICS"
          subtitle="7-Day Doorstep Reverse Pickups & Replacements"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">Type & Order</th>
                  <th className="p-3.5">Product & Requested Size</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-900/40">
                    <td className="p-3.5">
                      <span className="font-bold text-white uppercase">{r.requestType}</span>
                      <p className="text-[10px] text-zinc-500 font-mono">Order #{r.orderNumber}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-white uppercase">{r.productName}</p>
                      <p className="text-[10px] text-zinc-400">
                        Current: {r.size} {r.exchangeSize && `→ New Exchange Size: ${r.exchangeSize}`}
                      </p>
                    </td>
                    <td className="p-3.5 text-zinc-300">{r.reason}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white uppercase">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateStatus(r.id, e.target.value as any)}
                        className="bg-black border border-zinc-700 text-[10px] text-white px-2 py-1 uppercase font-bold"
                      >
                        <option value="Requested">Requested</option>
                        <option value="Approved">Approved</option>
                        <option value="Pickup Scheduled">Pickup Scheduled</option>
                        <option value="Item Received">Item Received</option>
                        <option value="Replacement Dispatched">Replacement Dispatched</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
