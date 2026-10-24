'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { ShieldCheck, Zap, Droplets, ArrowRight, Award, Target, Flame } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Brand Mission Hero */}
        <section className="relative py-24 bg-zinc-950 border-b border-zinc-800 text-center px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white font-mono text-xs uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 text-white" />
              <span>THE SPORTS MENS WEAR STORY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-sans">
              ENGINEERED FOR RAW MOVEMENT.
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              We founded SPORTS MENS WEAR with a straightforward conviction: Indian athletes deserve elite high-performance sportswear engineered for tropical humidity without paying 400% inflated brand markups.
            </p>
          </div>
        </section>

        {/* Brand Philosophy Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white">
                Biomechanical Design
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We craft our garments based on dynamic kinetic movement. Muscle taper cuts across the upper chest and biceps, combined with zero-restriction 4-way mechanical stretch around joints.
              </p>
            </div>

            <div className="p-8 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white">
                Tropical Sweat-Wicking
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tested across Chennai and Coimbatore humidity. Our AeroTech micro-mesh filaments evaporate sweat 3x faster than standard combed cotton, keeping you dry during heavy deadlifts.
              </p>
            </div>

            <div className="p-8 bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white">
                Direct ₹699 Value
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                By designing in-house and operating both our online platform and physical flagship store directly, we deliver luxury sportswear materials at transparent ₹699 prices.
              </p>
            </div>
          </div>
        </section>

        {/* Dual Retail & Online Model */}
        <section className="py-16 bg-zinc-950 border-t border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              5,000+ CATALOG CAPACITY • OMNICHANNEL COMMERCE
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Whether you shop online with fast 24-48 hr dispatch across all 38 districts of Tamil Nadu or visit our experience centers in Chennai and Coimbatore, SPORTS MENS WEAR delivers consistency in fit and performance.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/shop">
                <Button size="lg" variant="primary">SHOP ONLINE CATALOG</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">VIEW STORE LOCATIONS</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
