'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { Button } from '@/components/common/Button';
import { useCart } from '@/context/CartContext';
import { couponService } from '@/services/couponService';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    appliedCoupon,
    couponDiscount,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCouponCode,
    removeCouponCode
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const { showToast } = useToast();

  const freeDeliveryThreshold = 999;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    const res = await couponService.validateCoupon(couponInput, subtotal);
    setCouponLoading(false);

    if (res.valid && res.coupon) {
      applyCouponCode(res.coupon.code, res.discountAmount);
      showToast(res.message, 'success');
      setCouponInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
              SHOPPING BAG
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'} selected for checkout
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-zinc-500 hover:text-red-400 uppercase font-bold tracking-wider self-start sm:self-auto transition-colors"
            >
              Empty Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="border border-zinc-800 bg-zinc-950 p-16 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-zinc-900 mx-auto flex items-center justify-center mb-4 border border-zinc-800">
              <ShoppingBag className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-2">
              YOUR BAG IS EMPTY
            </h2>
            <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
              Explore our ₹699 collection, seamless athletic tees, and tapered training joggers.
            </p>
            <Link href="/shop">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                EXPLORE SPORT GEAR
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Delivery Bar */}
              <div className="bg-zinc-950 p-4 border border-zinc-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Truck className="w-4 h-4 text-white" />
                    {remainingForFreeDelivery === 0 ? (
                      <strong className="text-white">
                        ✓ Congratulations! You unlocked FREE Delivery across Tamil Nadu.
                      </strong>
                    ) : (
                      <span>
                        Add items worth <strong className="text-white font-bold">₹{remainingForFreeDelivery}</strong> more for FREE Shipping
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-bold text-zinc-400">
                    ₹{subtotal} / ₹999
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2">
                  <div
                    className="bg-white h-full transition-all duration-300 shadow-glow"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Rows */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 divide-y divide-zinc-800/60">
                {cart.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/shop"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                  ORDER SUMMARY
                </h3>

                {/* Coupon Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Promo Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono font-bold text-white">{appliedCoupon}</span>
                        <span className="text-emerald-400 text-xs">(-₹{couponDiscount})</span>
                      </div>
                      <button
                        onClick={removeCouponCode}
                        className="text-[10px] uppercase font-bold text-zinc-400 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. SPORTS10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="bg-black border border-zinc-700 px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase flex-1 focus:border-white focus:outline-none"
                      />
                      <Button type="submit" size="sm" variant="outline" isLoading={couponLoading}>
                        APPLY
                      </Button>
                    </form>
                  )}
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Try &ldquo;SPORTS10&rdquo; for 10% off orders ₹999+
                  </p>
                </div>

                {/* Calculations */}
                <div className="space-y-3 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-bold text-white">₹{subtotal}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tamil Nadu Express Shipping</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <strong className="text-white font-bold uppercase">FREE</strong>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white border-t border-zinc-800 pt-3">
                    <span>TOTAL AMOUNT</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  size="xl"
                  variant="primary"
                  fullWidth
                  onClick={() => router.push('/checkout')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  PROCEED TO CHECKOUT
                </Button>

                <div className="pt-2 text-[10px] text-zinc-500 text-center space-y-1">
                  <p>100% SECURE 256-BIT ENCRYPTION</p>
                  <p>UPI • CARDS • NETBANKING • CASH ON DELIVERY</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
