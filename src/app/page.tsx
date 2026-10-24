'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Rating } from '@/components/common/Rating';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Product, Category } from '@/types';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Flame,
  Sparkles,
  Droplets,
  Wind,
  Layers,
  Store,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [collection699, setCollection699] = useState<Product[]>([]);
  const [featuredGear, setFeaturedGear] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, best, news, under699, feat] = await Promise.all([
          categoryService.getCategories(),
          productService.getBestSellers(4),
          productService.getNewArrivals(4),
          productService.get699Collection(4),
          productService.getFeaturedProducts(4)
        ]);
        setCategories(cats);
        setBestSellers(best);
        setNewArrivals(news);
        setCollection699(under699);
        setFeaturedGear(feat);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* ============================================================ */}
        {/* 1. HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 border-b border-zinc-800">
          {/* Background Sport Image with Athletic Lighting Gradient */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2000&auto=format&fit=crop"
              alt="SPORTS MENS WEAR Hero"
              fill
              priority
              className="object-cover object-center filter brightness-45 contrast-125 scale-105 animate-in fade-in duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
            {/* Top Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono uppercase tracking-widest2 mb-6">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Direct-to-Athlete Sportswear • Tamil Nadu</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none font-sans max-w-5xl">
              BUILT FOR <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">MOVEMENT.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl font-medium leading-relaxed">
              Premium men&apos;s sportswear and athletic apparel engineered for superior comfort, all-day movement, and modern streetwear styling at honest ₹699 direct pricing.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="xl" variant="primary" fullWidth className="px-10" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  SHOP NOW
                </Button>
              </Link>
              <Link href="/shop?collection=699" className="w-full sm:w-auto">
                <Button size="xl" variant="outline" fullWidth className="px-8 border-white/40">
                  ₹699 SIGNATURE COLLECTION
                </Button>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-14 grid grid-cols-3 gap-6 sm:gap-12 border-t border-white/15 pt-8 text-center max-w-2xl w-full">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">5,000+</p>
                <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Products Capacity</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">₹699</p>
                <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Core Price Point</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">24-48 HR</p>
                <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Tamil Nadu Dispatch</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. SHOP BY CATEGORY */}
        {/* ============================================================ */}
        <section className="py-20 bg-black border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-white" />
                  <span>Men's Apparel Collections</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  SHOP BY CATEGORY
                </h2>
              </div>
              <Link
                href="/categories"
                className="text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-400 flex items-center gap-1 transition-colors"
              >
                <span>View All 10 Categories</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-[4/5] bg-zinc-900 overflow-hidden border border-zinc-800 hover:border-white transition-all duration-300 flex flex-col justify-end p-4"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-75 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="relative z-10">
                    <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
                      {cat.itemCount}+ Styles
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-white group-hover:translate-x-0.5 transition-transform">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. ₹699 SIGNATURE COLLECTION SPOTLIGHT */}
        {/* ============================================================ */}
        <section className="py-20 bg-zinc-950 border-b border-zinc-800 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-black border border-zinc-700 p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white text-black font-black text-[10px] uppercase tracking-widest">
                  <Flame className="w-3 h-3 text-black" />
                  SIGNATURE VALUE TIER
                </div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
                  THE ₹699 COLLECTION
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
                  Seamless tees, collared polos, 2-in-1 shorts, and tech joggers. Uncompromising sportswear durability at a flat, accessible price.
                </p>
              </div>

              <Link href="/shop?collection=699">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  EXPLORE ALL ₹699 GEAR
                </Button>
              </Link>
            </div>

            <ProductGrid products={collection699} isLoading={isLoading} columns={4} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. BEST SELLERS */}
        {/* ============================================================ */}
        <section className="py-20 bg-black border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                  <span>Athlete Favorites</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  BEST SELLERS
                </h2>
              </div>
              <Link
                href="/shop?filter=bestseller"
                className="text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-400 flex items-center gap-1 transition-colors"
              >
                <span>View All Best Sellers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <ProductGrid products={bestSellers} isLoading={isLoading} columns={4} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. NEW ARRIVALS */}
        {/* ============================================================ */}
        <section className="py-20 bg-zinc-950 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Fresh Drops</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                  NEW ARRIVALS
                </h2>
              </div>
              <Link
                href="/shop?filter=new"
                className="text-xs font-bold uppercase tracking-wider text-white hover:text-zinc-400 flex items-center gap-1 transition-colors"
              >
                <span>View All New Drops</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <ProductGrid products={newArrivals} isLoading={isLoading} columns={4} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. FEATURED COMPRESSION & HIGH-PERFORMANCE TECH */}
        {/* ============================================================ */}
        <section className="py-20 bg-black border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
                  <Award className="w-4 h-4 text-white" />
                  <span>Biomechanical Fit</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
                  COMPRESSION & MUSCLE RECOVERY
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Engineered with graduated pressure mapping that stimulates blood circulation, limits muscle oscillation, and keeps you explosive through all sets.
                </p>
                <div className="pt-2">
                  <Link href="/category/compression-wear">
                    <Button variant="outline" size="md" rightIcon={<ChevronRight className="w-4 h-4" />}>
                      SHOP COMPRESSION SERIES
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ProductGrid products={featuredGear} isLoading={isLoading} columns={2} />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. WHY SPORTS MENS WEAR (Athletic Engineering Pillars) */}
        {/* ============================================================ */}
        <section className="py-20 bg-zinc-950 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono uppercase tracking-widest2 text-zinc-400 block mb-2">
                FABRIC TECHNOLOGY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
                WHY SPORTS MENS WEAR?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Every stitch is engineered for durability, sweat management, and unrestricted mobility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-black border border-zinc-800 space-y-3">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white font-sans">
                  AEROTECH DRY-FIT
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Micro-channel yarn pulls perspiration off your skin to the fabric exterior for rapid evaporation in humid Tamil Nadu weather.
                </p>
              </div>

              <div className="p-6 bg-black border border-zinc-800 space-y-3">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                  <Wind className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white font-sans">
                  4-WAY MECHANICAL STRETCH
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Spandex-infused weaves recover shape after heavy squats, box jumps, and high-stride sprints without sagging.
                </p>
              </div>

              <div className="p-6 bg-black border border-zinc-800 space-y-3">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white font-sans">
                  ANTI-ODOR BIO-SHIELD
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Embedded silver-ion treatments neutralize odor-causing bacteria so your apparel stays fresh through 2-hour workout sessions.
                </p>
              </div>

              <div className="p-6 bg-black border border-zinc-800 space-y-3">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white font-sans">
                  FLATLOCK BONDED SEAMS
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero abrasive inner stitches prevent chest and inner-thigh friction burns during marathons and heavy lifting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. VERIFIED CUSTOMER REVIEWS */}
        {/* ============================================================ */}
        <section className="py-20 bg-black border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="flex justify-center mb-2">
                <Rating rating={4.9} reviewCount={1240} size="md" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                TESTED BY ATHLETES ACROSS TAMIL NADU
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between">
                <div>
                  <Rating rating={5} showCount={false} size="sm" />
                  <h4 className="font-bold text-sm text-white mt-2">
                    &ldquo;Best ₹699 performance t-shirt in India&rdquo;
                  </h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    &ldquo;The fit on the AeroTech tee is insane. Arms are tapered, shoulder seams sit properly, and zero sweat marks even in humid Chennai weather.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white uppercase">Vignesh Sundaram</p>
                    <p className="text-zinc-500 text-[10px]">Chennai, TN</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                </div>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between">
                <div>
                  <Rating rating={5} showCount={false} size="sm" />
                  <h4 className="font-bold text-sm text-white mt-2">
                    &ldquo;Jogger zip pockets actually hold large phones&rdquo;
                  </h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    &ldquo;Core Velocity joggers are so comfortable. The ankle grip doesn&apos;t ride up and the zipper quality feels premium like 2k brands.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white uppercase">Dinesh Kumar M</p>
                    <p className="text-zinc-500 text-[10px]">Coimbatore, TN</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                </div>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between">
                <div>
                  <Rating rating={5} showCount={false} size="sm" />
                  <h4 className="font-bold text-sm text-white mt-2">
                    &ldquo;2-in-1 shorts liner changed my squat sessions&rdquo;
                  </h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    &ldquo;No thigh chafing, zero ride-up, and the phone stays tightly secured in the inner compression pocket. 10/10 recommend.&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white uppercase">Arjun Balaji</p>
                    <p className="text-zinc-500 text-[10px]">Salem, TN</p>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. PHYSICAL STORE SHOWCASE */}
        {/* ============================================================ */}
        <section className="py-20 bg-zinc-950 border-b border-zinc-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-black border border-zinc-800 p-8 sm:p-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-white text-[11px] font-mono uppercase tracking-wider">
                  <Store className="w-3.5 h-3.5 text-white" />
                  <span>Online + Physical Retail Experience</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
                  EXPERIENCE SPORTS MENS WEAR IN-STORE
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Touch the fabrics, test athletic sizes with our smart trial mirrors, and experience instant POS checkout at our flagship stores in Chennai and Coimbatore.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="p-3 bg-zinc-900/60 border border-zinc-800">
                    <p className="font-bold text-white uppercase">Chennai Flagship</p>
                    <p className="text-zinc-400 text-[11px]">T. Nagar (Open 7 Days)</p>
                  </div>
                  <div className="p-3 bg-zinc-900/60 border border-zinc-800">
                    <p className="font-bold text-white uppercase">Coimbatore Hub</p>
                    <p className="text-zinc-400 text-[11px]">RS Puram (Open 7 Days)</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/contact">
                    <Button size="lg" variant="white" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      VISIT OUR STORES
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Store Visual Showcase */}
              <div className="relative aspect-[4/3] bg-zinc-900 border border-zinc-800 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop"
                  alt="SPORTS MENS WEAR Physical Retail Store Interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 border border-zinc-700 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white uppercase">5,000+ Styles Available</span>
                    <p className="text-[10px] text-zinc-400">Integrated with Live POS Terminal</p>
                  </div>
                  <Link href="/admin/pos" className="text-[11px] font-bold text-white underline">
                    Open POS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
