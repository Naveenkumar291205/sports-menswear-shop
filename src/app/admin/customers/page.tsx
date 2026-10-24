'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Users } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const customers: CustomerRecord[] = [];

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="CUSTOMER BASE & ATHLETE ACCOUNTS"
          subtitle={`Total Registered Athletes: ${customers.length}`}
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {customers.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 p-12 text-center">
              <div className="w-16 h-16 bg-zinc-900 text-zinc-500 mx-auto flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                No Customer Accounts Found
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Customer records will automatically populate here as athletes register or place orders.
              </p>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                  <tr>
                    <th className="p-3.5">Athlete Name</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">City / District</th>
                    <th className="p-3.5 text-center">Orders</th>
                    <th className="p-3.5 text-right">Lifetime Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-900/40">
                      <td className="p-3.5">
                        <p className="font-bold text-white uppercase">{c.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: {c.id}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-mono text-[11px] text-white">{c.mobile}</p>
                        <p className="text-zinc-500 text-[10px]">{c.email}</p>
                      </td>
                      <td className="p-3.5">{c.city}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-white">{c.ordersCount}</td>
                      <td className="p-3.5 text-right font-mono font-black text-white">₹{c.totalSpent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
