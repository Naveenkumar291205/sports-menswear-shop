import { CartItem } from '@/types';

export const cartService = {
  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('zyphor_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zyphor_cart', JSON.stringify(items));
    }
  },

  addToCart(item: CartItem): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (ci) => ci.productId === item.productId && ci.size === item.size && ci.color.name === item.color.name
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.saveCart(cart);
    return cart;
  },

  updateQuantity(itemId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((item) => item.id !== itemId);
    } else {
      cart = cart.map((item) => (item.id === itemId ? { ...item, quantity } : item));
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(itemId: string): CartItem[] {
    const cart = this.getCart().filter((item) => item.id !== itemId);
    this.saveCart(cart);
    return cart;
  },

  clearCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zyphor_cart');
    }
  }
};
