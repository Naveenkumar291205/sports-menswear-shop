'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { couponService } from '@/services/couponService';
import { Coupon } from '@/types';
import { Tag, Plus, Trash2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    async function load() {
      const all = await couponService.getCoupons();
      setCoupons(all);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="PROMOTIONAL COUPONS & DISCOUNTS"
          subtitle="Configure discount rules and Tamil Nadu exclusive promos"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {coupons.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 p-12 text-center">
              <div className="w-16 h-16 bg-zinc-900 text-zinc-500 mx-auto flex items-center justify-center mb-4">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                No Active Promo Codes
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Promotional coupons and discount campaigns will appear here once created.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((c) => (
                <div key={c.code} className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white text-black font-mono font-black text-sm tracking-wider">
                      {c.code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">{c.description}</p>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-3 border-t border-zinc-900">
                    <span>Min: ₹{c.minOrderValue}</span>
                    <span>Expires: {c.expiresAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
