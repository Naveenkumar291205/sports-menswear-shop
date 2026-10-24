'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem } from '@/types';
import { wishlistService } from '@/services/wishlistService';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    setWishlist(wishlistService.getWishlist());
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlist.some((w) => w.productId === productId);
  };

  const toggleWishlist = (item: WishlistItem) => {
    const { items, isAdded } = wishlistService.toggleWishlist(item);
    setWishlist([...items]);
    if (isAdded) {
      showToast(`Added "${item.name}" to your wishlist!`, 'success');
    } else {
      showToast(`Removed from wishlist`, 'info');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const items = wishlistService.removeFromWishlist(productId);
    setWishlist([...items]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
