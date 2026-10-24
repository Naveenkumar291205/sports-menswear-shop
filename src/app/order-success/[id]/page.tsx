'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ChevronRight,
  Printer,
  ShoppingBag
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      if (orderId) {
        const found = await orderService.getOrderById(orderId);
        if (found) {
          setOrder(found);
        }
      }
    }
    load();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Success Icon & Confirmation Headline */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-white text-black mx-auto flex items-center justify-center shadow-glow">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              PAYMENT & DISPATCH VERIFIED
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
              ORDER CONFIRMED
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Thank you for shopping with <strong className="text-white">SPORTS MENS WEAR</strong>. Your gear is being prepped in our Tamil Nadu fulfillment hub.
            </p>
          </div>

          <div className="inline-block bg-zinc-900 border border-zinc-700 px-4 py-2 text-xs font-mono text-white">
            Order Reference: <strong className="text-white uppercase font-bold">{orderId}</strong>
          </div>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6">
            {/* Quick Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 text-xs">
              <div>
                <p className="text-zinc-500 uppercase text-[10px]">Estimated Delivery</p>
                <p className="font-bold text-white text-sm">{order.estimatedDelivery} (24-48 hrs)</p>
              </div>
              <div>
                <p className="text-zinc-500 uppercase text-[10px]">Courier Partner</p>
                <p className="font-bold text-white">{order.courierPartner || 'Delhivery Surface'}</p>
              </div>
              <div>
                <p className="text-zinc-500 uppercase text-[10px]">Payment Method</p>
                <p className="font-bold text-white uppercase">{order.paymentMethod} ({order.paymentStatus})</p>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Ordered Items ({order.items.length})
              </h3>
              <div className="divide-y divide-zinc-900">
                {order.items.map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white uppercase line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t border-zinc-800 text-xs space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Delivery Address
              </h3>
              <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
              <p className="text-zinc-400">
                {order.shippingAddress.doorNo}, {order.shippingAddress.street}, {order.shippingAddress.area}
              </p>
              <p className="text-zinc-400">
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
              </p>
              <p className="text-zinc-400 font-mono">Mobile: {order.shippingAddress.mobile}</p>
            </div>

            {/* Total Cost Breakdown */}
            <div className="pt-4 border-t border-zinc-800 text-xs space-y-1.5 text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                <span>TOTAL PAID</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link href="/account?tab=orders" className="w-full sm:w-1/2">
            <Button size="xl" variant="primary" fullWidth leftIcon={<Truck className="w-4 h-4" />}>
              TRACK ORDER
            </Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-1/2">
            <Button size="xl" variant="outline" fullWidth leftIcon={<ShoppingBag className="w-4 h-4" />}>
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
