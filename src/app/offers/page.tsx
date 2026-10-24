'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { couponService } from '@/services/couponService';
import { productService } from '@/services/productService';
import { useToast } from '@/context/ToastContext';
import { Coupon, Product } from '@/types';
import { Tag, Copy, Flame, Sparkles, Truck, Check, ArrowRight } from 'lucide-react';

export default function OffersPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const [c, d] = await Promise.all([
        couponService.getCoupons(),
        productService.get699Collection(8)
      ]);
      setCoupons(c);
      setDeals(d);
    }
    load();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied! Paste at checkout.`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-zinc-700 p-8 sm:p-12 mb-12 text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-black font-black text-xs uppercase tracking-widest">
            <Flame className="w-4 h-4 text-black" />
            EXCLUSIVE PROMOTIONS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
            ACTIVE DEALS & PROMO CODES
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
            Stack promo codes with our direct ₹699 sportswear tier for maximum training value across Tamil Nadu.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="mb-16">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-white" />
            <span>AVAILABLE COUPON CODES</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between space-y-4 hover:border-zinc-500 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white text-black font-mono font-black text-base tracking-wider">
                      {c.code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-900 space-y-3">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Min Order: ₹{c.minOrderValue}</span>
                    <span>Till: {c.expiresAt}</span>
                  </div>

                  <Button
                    size="sm"
                    variant={copiedCode === c.code ? 'white' : 'outline'}
                    fullWidth
                    onClick={() => handleCopy(c.code)}
                    leftIcon={copiedCode === c.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedCode === c.code ? 'COPIED TO CLIPBOARD' : 'COPY CODE'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ₹699 Collection Showcase */}
        <section className="border-t border-zinc-800 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white font-sans">
                ₹699 SPOTLIGHT DEALS
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Top rated performance t-shirts, collared polos, compression wear, and athletic shorts
              </p>
            </div>
            <Link href="/shop?collection=699">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          </div>

          <ProductGrid products={deals} columns={4} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
