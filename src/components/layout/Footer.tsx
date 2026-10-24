'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';
import { useToast } from '@/context/ToastContext';
import {
  ShieldCheck,
  RefreshCw,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for joining the SPORTS MENS WEAR Athlete Circle! Check your inbox for ₹150 OFF coupon.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-white border-t border-zinc-800 pt-16 pb-8">
      {/* 4-Pillar Athletic Trust Guarantee Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-zinc-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-white flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">TN Priority Delivery</h4>
              <p className="text-[11px] text-zinc-400 mt-1">24-48 hr fast dispatch across Chennai, Kovai & all TN districts.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-white flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">7-Day Easy Exchanges</h4>
              <p className="text-[11px] text-zinc-400 mt-1">Hassle-free size exchanges with doorstep reverse pickup.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-white flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">100% High-Grade Fabric</h4>
              <p className="text-[11px] text-zinc-400 mt-1">Tested for moisture wicking, 4-way stretch & durability.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-zinc-900 border border-zinc-800 text-white flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Safe & Secure Payments</h4>
              <p className="text-[11px] text-zinc-400 mt-1">UPI (GPay, PhonePe), Cards, NetBanking, & COD supported.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" showTagline={true} />
            <p className="text-xs text-zinc-400 leading-relaxed pr-6 max-w-md">
              SPORTS MENS WEAR is built for movement. We engineer premium athletic wear that bridges the gap between raw gym performance and sleek modern streetwear at transparent direct-to-consumer prices.
            </p>

            <div className="pt-2">
              <p className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white" /> Join The Athlete Circle
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-zinc-900 border border-zinc-700 text-white text-xs px-4 py-2.5 flex-1 focus:border-white focus:outline-none placeholder-zinc-500"
                />
                <Button type="submit" size="sm" className="px-5 border-l-0">
                  SUBSCRIBE
                </Button>
              </form>
              <p className="text-[10px] text-zinc-500 mt-1.5">
                Receive exclusive product drops, training guides & special coupon codes.
              </p>
            </div>
          </div>

          {/* Column 2: Sport Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Categories</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/category/t-shirts" className="hover:text-white transition-colors">
                  T-Shirts & Oversized
                </Link>
              </li>
              <li>
                <Link href="/category/polos" className="hover:text-white transition-colors">
                  Polos & Collars
                </Link>
              </li>
              <li>
                <Link href="/category/joggers" className="hover:text-white transition-colors">
                  Tapered Joggers
                </Link>
              </li>
              <li>
                <Link href="/category/track-pants" className="hover:text-white transition-colors">
                  Track Pants
                </Link>
              </li>
              <li>
                <Link href="/category/shorts" className="hover:text-white transition-colors">
                  2-in-1 Active Shorts
                </Link>
              </li>
              <li>
                <Link href="/category/compression-wear" className="hover:text-white transition-colors">
                  Compression Gear
                </Link>
              </li>
              <li>
                <Link href="/category/tanks-vests" className="hover:text-white transition-colors">
                  Tanks & Vests
                </Link>
              </li>
              <li>
                <Link href="/category/jackets" className="hover:text-white transition-colors">
                  Jackets & Windbreakers
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=699" className="text-white font-bold hover:underline transition-colors flex items-center gap-1">
                  <span>₹699 Spotlight Zone</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Customer Support</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account?tab=returns" className="hover:text-white transition-colors">
                  Initiate Return / Exchange
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition-colors">
                  Active Promo Coupons
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Brand Story & Tech
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Store Locator & Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link href="/admin/pos" className="text-zinc-500 hover:text-white transition-colors">
                  Retail POS Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Physical Retail Stores */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Retail Locations</h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <div>
                <p className="font-bold text-white uppercase text-[11px]">Chennai Flagship</p>
                <p className="text-[11px] text-zinc-400">Usman Road, T. Nagar, Chennai</p>
              </div>
              <div>
                <p className="font-bold text-white uppercase text-[11px]">Coimbatore Hub</p>
                <p className="text-[11px] text-zinc-400">DB Road, RS Puram, Coimbatore</p>
              </div>
              <div>
                <p className="font-bold text-white uppercase text-[11px]">Madurai Studio</p>
                <p className="text-[11px] text-zinc-400">80 Feet Road, KK Nagar, Madurai</p>
              </div>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-white uppercase tracking-wider hover:underline"
                >
                  <span>View All Stores</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & ZyphorZone Attribution */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <span>© {new Date().getFullYear()} SPORTS MENS WEAR. All Rights Reserved.</span>
            <span className="hidden sm:inline-block text-zinc-700">•</span>
            <span className="text-zinc-400 flex items-center gap-1">
              Application created & developed by <strong className="text-white font-mono tracking-wider">ZYPHOR ZONE</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-xs">
            <span className="font-medium hidden lg:inline">Direct Delivery across 38 Districts in TN</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">UPI</span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">VISA / MC</span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
