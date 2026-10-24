import { WishlistItem } from '@/types';

export const wishlistService = {
  getWishlist(): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zyphor_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveWishlist(items: WishlistItem[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zyphor_wishlist', JSON.stringify(items));
    }
  },

  toggleWishlist(item: WishlistItem): { items: WishlistItem[]; isAdded: boolean } {
    const list = this.getWishlist();
    const index = list.findIndex((w) => w.productId === item.productId);
    let isAdded = false;

    if (index > -1) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.push(item);
      isAdded = true;
    }
    this.saveWishlist(list);
    return { items: list, isAdded };
  },

  isInWishlist(productId: string): boolean {
    const list = this.getWishlist();
    return list.some((w) => w.productId === productId);
  },

  removeFromWishlist(productId: string): WishlistItem[] {
    const list = this.getWishlist().filter((w) => w.productId !== productId);
    this.saveWishlist(list);
    return list;
  }
};
