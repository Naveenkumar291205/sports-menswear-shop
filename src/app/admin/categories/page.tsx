'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';
import { Plus, Edit2, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="CATEGORY TAXONOMY"
          subtitle="10 Core Men's Sportswear Sport Disciplines"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div key={c.id} className="bg-zinc-950 border border-zinc-800 p-5 space-y-4">
                <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
                  <Image src={c.image} alt={c.name} fill sizes="300px" className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white uppercase text-sm">{c.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-400 font-bold">
                      {c.itemCount} SKUs
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{c.tagline}</p>
                </div>
                {c.subCategories && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-900">
                    {c.subCategories.map((sub, i) => (
                      <span key={i} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
