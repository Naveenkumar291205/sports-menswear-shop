'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types';
import { cartService } from '@/services/cartService';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCouponCode: (code: string, discount: number) => void;
  removeCouponCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const items = cartService.getCart();
    setCart(items);
    setIsLoaded(true);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  // Free delivery for orders above ₹999 across Tamil Nadu, else ₹60
  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 60;
  const total = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const addToCart = (itemData: Omit<CartItem, 'id'>) => {
    const id = `${itemData.productId}-${itemData.size}-${itemData.color.name}`;
    const fullItem: CartItem = { ...itemData, id };
    const updated = cartService.addToCart(fullItem);
    setCart([...updated]);
    showToast(`Added "${itemData.name}" (${itemData.size}) to cart!`, 'success');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const updated = cartService.updateQuantity(itemId, quantity);
    setCart([...updated]);
  };

  const removeFromCart = (itemId: string) => {
    const updated = cartService.removeFromCart(itemId);
    setCart([...updated]);
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    cartService.clearCart();
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const applyCouponCode = (code: string, discount: number) => {
    setAppliedCoupon(code);
    setCouponDiscount(discount);
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discount: couponDiscount,
        deliveryFee,
        total,
        appliedCoupon,
        couponDiscount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        removeCouponCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
