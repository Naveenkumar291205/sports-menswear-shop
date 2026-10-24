'use client';

import React, { useState } from 'react';
import { Store, Bell, Search, User, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const [selectedChannel, setSelectedChannel] = useState('All Channels (Online + Stores)');

  return (
    <header className="bg-black border-b border-zinc-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
      <div>
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-sans">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Channel Selector */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">
          <Store className="w-3.5 h-3.5 text-white" />
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All Channels (Online + Stores)" className="bg-zinc-950 text-white">
              All Channels (5,000 Capacity)
            </option>
            <option value="Online Direct (Tamil Nadu)" className="bg-zinc-950 text-white">
              Online Direct (Tamil Nadu)
            </option>
            <option value="Chennai Flagship POS" className="bg-zinc-950 text-white">
              Chennai Flagship Store (T. Nagar)
            </option>
            <option value="Coimbatore Hub POS" className="bg-zinc-950 text-white">
              Coimbatore Hub (RS Puram)
            </option>
          </select>
        </div>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Local Mode</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-7 h-7 bg-white text-black font-black text-xs flex items-center justify-center">
            ZZ
          </div>
          <span className="text-xs font-bold uppercase text-white hidden sm:inline">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};
