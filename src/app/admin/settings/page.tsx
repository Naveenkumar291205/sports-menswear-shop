'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { useToast } from '@/context/ToastContext';
import { Settings, Save, Store, Server, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [djangoApiUrl, setDjangoApiUrl] = useState('http://localhost:8000/api/v1');
  const [storeGstin, setStoreGstin] = useState('33AABCZ9821Q1Z4');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Admin configuration saved successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="ADMIN & INTEGRATION SETTINGS"
          subtitle="Django Backend Configuration • Store GST • Logistics Thresholds"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Django API Backend Endpoint */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-sm border-b border-zinc-800 pb-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Python/Django Backend Connection</span>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                  Django REST Framework API Base URL
                </label>
                <input
                  type="text"
                  value={djangoApiUrl}
                  onChange={(e) => setDjangoApiUrl(e.target.value)}
                  className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  When Django server is running, all services in <code>@/services/*</code> will route to this endpoint.
                </p>
              </div>
            </div>

            {/* Store & Tax Details */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-sm border-b border-zinc-800 pb-2">
                <Store className="w-4 h-4 text-white" />
                <span>Store & Tax Configuration</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Store GSTIN Number (For POS Receipts)
                  </label>
                  <input
                    type="text"
                    value={storeGstin}
                    onChange={(e) => setStoreGstin(e.target.value)}
                    className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Free Tamil Nadu Delivery Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                SAVE SETTINGS
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
