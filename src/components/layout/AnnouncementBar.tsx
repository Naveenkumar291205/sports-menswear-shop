'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Tag, Store, ChevronRight, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white text-[11px] font-medium border-b border-zinc-800 tracking-wider relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-zinc-400">
          <Store className="w-3.5 h-3.5 text-white" />
          <span>Flagship Stores in <strong className="text-white">Chennai</strong> & <strong className="text-white">Coimbatore</strong></span>
        </div>

        {/* Center Banner Message */}
        <div className="flex-1 md:flex-initial flex items-center justify-center gap-2 text-center">
          <Truck className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="text-zinc-300">
            FREE EXPRESS SHIPPING across <strong className="text-white">Tamil Nadu</strong> on orders ₹999+
          </span>
          <span className="hidden sm:inline-block text-zinc-600">|</span>
          <Link
            href="/offers"
            className="hidden sm:inline-flex items-center gap-1 text-white font-bold hover:underline"
          >
            <Tag className="w-3 h-3" />
            Use Code: SPORTS10
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pos"
            className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 hover:text-white px-2 py-0.5 border border-zinc-800 hover:border-zinc-500 transition-colors hidden lg:inline-block"
          >
            Store POS Terminal
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="text-zinc-500 hover:text-white p-0.5 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
