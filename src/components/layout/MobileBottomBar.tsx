'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Home, Compass, Search, Heart, ShoppingBag, User } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, setIsAuthModalOpen } = useAuth();

  // Hide on admin routes or checkout
  if (pathname.startsWith('/admin') || pathname === '/checkout') {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="w-5 h-5" />,
      isActive: pathname === '/'
    },
    {
      label: 'Shop',
      href: '/shop',
      icon: <Compass className="w-5 h-5" />,
      isActive: pathname.startsWith('/shop') || pathname.startsWith('/category')
    },
    {
      label: 'Search',
      href: '/search',
      icon: <Search className="w-5 h-5" />,
      isActive: pathname === '/search'
    },
    {
      label: 'Wishlist',
      href: '/wishlist',
      icon: <Heart className="w-5 h-5" />,
      badge: wishlistCount > 0 ? wishlistCount : null,
      isActive: pathname === '/wishlist'
    }
  ];

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!user.isLoggedIn) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-t border-zinc-800/90 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center justify-center h-full py-1 text-center transition-colors ${
              item.isActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== null && item.badge !== undefined && (
                <span className="absolute -top-1 -right-2.5 bg-white text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider mt-1 font-medium">
              {item.label}
            </span>
            {item.isActive && (
              <span className="absolute bottom-1 w-6 h-0.5 bg-white rounded-full" />
            )}
          </Link>
        ))}

        {/* Bag Button (Opens CartDrawer) */}
        <button
          type="button"
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center h-full py-1 text-center text-zinc-400 hover:text-white transition-colors"
          aria-label="Open Cart Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-white text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-glow">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-wider mt-1 font-bold text-white">
            Bag
          </span>
        </button>
      </div>
    </nav>
  );
};
