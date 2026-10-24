'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../common/Logo';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES } from '@/data/categories';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  ChevronRight,
  Store,
  Tag,
  Flame,
  ShieldAlert,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string; badge?: string }[];
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  isOpen,
  onClose,
  navLinks
}) => {
  const { user, setIsAuthModalOpen } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-zinc-950 border-r border-zinc-800 text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-black">
          <Logo size="sm" isLink={true} />
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Strip */}
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black font-black flex items-center justify-center text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-xs">
                <p className="font-bold text-white uppercase">{user.name || 'Athlete Member'}</p>
                <p className="text-zinc-500 text-[10px]">{user.mobile || 'Tamil Nadu Account'}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                setIsAuthModalOpen(true);
              }}
              className="w-full bg-white text-black py-2 text-xs font-bold uppercase tracking-wider"
            >
              Sign In / Register
            </button>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Main Primary Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Navigation
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-none transition-colors"
              >
                <span>{link.name}</span>
                {link.badge ? (
                  <span className="bg-white text-black text-[9px] font-extrabold px-1.5 py-0.5">
                    {link.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                )}
              </Link>
            ))}
          </div>

          {/* Categories Drilldown */}
          <div className="space-y-1 pt-2 border-t border-zinc-900">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Shop By Sport Category
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="px-2.5 py-2 text-[11px] font-medium bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 truncate block transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Account & Orders */}
          <div className="space-y-1 pt-2 border-t border-zinc-900">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Customer Services
            </p>
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2.5 py-2 px-3 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
            >
              <User className="w-4 h-4 text-zinc-400" />
              <span>My Orders & Live Tracking</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center gap-2.5 py-2 px-3 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
            >
              <Heart className="w-4 h-4 text-zinc-400" />
              <span>Saved Wishlist</span>
            </Link>
            <Link
              href="/offers"
              onClick={onClose}
              className="flex items-center gap-2.5 py-2 px-3 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
            >
              <Tag className="w-4 h-4 text-zinc-400" />
              <span>Coupons & Deals</span>
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center gap-2.5 py-2 px-3 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900"
            >
              <Store className="w-4 h-4 text-zinc-400" />
              <span>Tamil Nadu Retail Stores</span>
            </Link>
          </div>

          {/* Admin & POS Quick Switcher */}
          <div className="space-y-1 pt-2 border-t border-zinc-900">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Retail Operations
            </p>
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900/30 border border-zinc-800"
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-white" /> Admin Dashboard
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/pos"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900/30 border border-zinc-800"
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-white" /> Store POS Billing
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-800 text-[11px] text-zinc-500 text-center">
          SPORTS MENS WEAR • BUILT FOR MOVEMENT
        </div>
      </div>
    </div>
  );
};
