'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../common/Logo';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { MobileNavbar } from './MobileNavbar';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  Sparkles,
  Flame,
  Tag,
  ShieldAlert
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, setIsAuthModalOpen } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: '₹699 Zone', href: '/shop?collection=699', badge: 'Popular', icon: <Flame className="w-3 h-3 text-white" /> },
    { name: 'New Arrivals', href: '/shop?filter=new', icon: <Sparkles className="w-3 h-3 text-zinc-400" /> },
    { name: 'Best Sellers', href: '/shop?filter=bestseller' },
    { name: 'Offers', href: '/offers', icon: <Tag className="w-3 h-3 text-white" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-zinc-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Left: Mobile Menu Trigger + Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Logo size="lg" showTagline={false} />
            </div>

            {/* Middle: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.2 uppercase tracking-tight">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-white shadow-glow" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Account, Wishlist, Cart, Admin Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Quick Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center relative w-48 xl:w-60"
              >
                <input
                  type="text"
                  placeholder="Search gear, tees, joggers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-zinc-900/90 text-white text-xs pl-9 pr-3 py-2 border border-zinc-800 focus:border-white focus:outline-none placeholder-zinc-500 transition-colors"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
              </form>

              {/* Mobile Search Button */}
              <Link
                href="/search"
                className="md:hidden p-2.5 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Account Dropdown / Button */}
              <div className="relative group">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                  aria-label="My Account"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline-block text-xs font-bold uppercase tracking-wider" suppressHydrationWarning>
                    {user.isLoggedIn && user.name?.trim() ? user.name.trim().split(' ')[0] : 'Account'}
                  </span>
                </Link>

                {/* Account Hover Preview */}
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50 w-56">
                  <div className="bg-zinc-950 border border-zinc-800 shadow-2xl p-4 text-xs space-y-3">
                    {user.isLoggedIn ? (
                      <>
                        <div className="border-b border-zinc-800 pb-2">
                          <p className="font-bold text-white uppercase">{user.name}</p>
                          <p className="text-zinc-500 text-[11px] truncate">{user.email}</p>
                        </div>
                        <Link href="/account" className="block text-zinc-300 hover:text-white font-medium py-1">
                          My Profile & Orders
                        </Link>
                        <Link href="/account?tab=tracking" className="block text-zinc-300 hover:text-white font-medium py-1">
                          Live Order Tracking
                        </Link>
                        <Link href="/account?tab=addresses" className="block text-zinc-300 hover:text-white font-medium py-1">
                          Manage Addresses (TN)
                        </Link>
                        <Link href="/account?tab=returns" className="block text-zinc-300 hover:text-white font-medium py-1">
                          Returns & Exchanges
                        </Link>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-zinc-400 mb-3">Sign in for order tracking & faster checkout</p>
                        <button
                          onClick={() => setIsAuthModalOpen(true)}
                          className="w-full bg-white text-black py-2 font-bold uppercase tracking-wider text-xs hover:bg-zinc-200"
                        >
                          LOGIN / SIGN UP
                        </button>
                      </div>
                    )}
                    <div className="border-t border-zinc-800 pt-2 flex justify-between items-center text-[10px] text-zinc-400">
                      <Link href="/admin" className="text-zinc-400 hover:text-white flex items-center gap-1 font-bold">
                        <ShieldAlert className="w-3 h-3 text-white" /> Admin Panel
                      </Link>
                      <Link href="/admin/pos" className="text-zinc-400 hover:text-white font-bold">
                        POS Terminal
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[10px] font-black rounded-none flex items-center justify-center border border-black shadow-glow animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 bg-white text-black px-3.5 py-2 hover:bg-zinc-200 transition-all font-bold text-xs uppercase tracking-wider relative shadow-md shadow-white/5 active:scale-95"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span className="hidden sm:inline-block">Bag</span>
                <span className="bg-black text-white px-1.5 py-0.2 text-[11px] font-black">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNavbar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
};
