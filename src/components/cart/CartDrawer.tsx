'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { CartItemRow } from './CartItemRow';
import { useCart } from '@/context/CartContext';
import { couponService } from '@/services/couponService';
import { useToast } from '@/context/ToastContext';
import { ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    appliedCoupon,
    couponDiscount,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
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

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    router.push('/checkout');
  };

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={() => setIsCartDrawerOpen(false)}
      title="YOUR SHOPPING BAG"
      subtitle={`${cartCount} ${cartCount === 1 ? 'Item' : 'Items'} selected`}
      width="md"
      footer={
        cart.length > 0 ? (
          <div className="space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{subtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tamil Nadu Express Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-white uppercase font-black">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                <span>ESTIMATED TOTAL</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleProceedCheckout}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                PROCEED TO CHECKOUT
              </Button>
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="block text-center text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white py-1"
              >
                View Full Cart Details
              </Link>
            </div>
          </div>
        ) : null
      }
    >
      {cart.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 bg-zinc-900 mx-auto flex items-center justify-center mb-4 border border-zinc-800">
            <ShoppingBag className="w-7 h-7 text-zinc-500" />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
            Your Bag is Empty
          </h4>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs mx-auto">
            Discover our high-performance sportswear and ₹699 essentials built for movement.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsCartDrawerOpen(false);
              router.push('/shop');
            }}
          >
            START SHOPPING
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Free Shipping Progress Bar */}
          <div className="bg-zinc-900 p-3 border border-zinc-800">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Truck className="w-3.5 h-3.5 text-white" />
                {remainingForFreeDelivery === 0 ? (
                  <strong className="text-white font-bold">You unlocked FREE Tamil Nadu Delivery!</strong>
                ) : (
                  <span>Add <strong>₹{remainingForFreeDelivery}</strong> more for FREE Delivery</span>
                )}
              </span>
              <span className="font-mono text-zinc-400 text-[10px]">₹{subtotal} / ₹999</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 shadow-glow"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item Rows */}
          <div className="divide-y divide-zinc-800/40">
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                compact={true}
              />
            ))}
          </div>

          {/* Promo Code Applicator */}
          <div className="pt-2">
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono font-bold text-white">{appliedCoupon}</span>
                  <span className="text-emerald-400 text-[11px]">(-₹{couponDiscount})</span>
                </div>
                <button
                  onClick={removeCouponCode}
                  className="text-zinc-400 hover:text-red-400 text-[10px] uppercase font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. SPORTS10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-xs px-3 py-2 flex-1 text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  isLoading={couponLoading}
                  className="px-4"
                >
                  APPLY
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};
