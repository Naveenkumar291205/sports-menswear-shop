'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';
import { ChevronRight, Layers } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cats = await categoryService.getCategories();
      setCategories(cats);
      setIsLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="border-b border-zinc-800 pb-6 mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
            <Layers className="w-3.5 h-3.5 text-white" />
            <span>ATHLETIC CATEGORIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
            SHOP BY SPORT DISCIPLINE
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Explore specialized technical apparel engineered for lifting, running, CrossFit, and everyday recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[4/3] bg-zinc-950 border border-zinc-800 hover:border-white transition-all overflow-hidden flex flex-col justify-end p-6"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-70 group-hover:brightness-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  {cat.itemCount}+ High-Performance Items
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
