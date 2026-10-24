'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { CheckoutStepper, CheckoutStep } from '@/components/checkout/CheckoutStepper';
import { AddressFormModal } from '@/components/checkout/AddressFormModal';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { couponService } from '@/services/couponService';
import { useToast } from '@/context/ToastContext';
import { UserAddress, Order } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Plus,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  ArrowRight,
  ChevronLeft,
  Tag,
  Lock
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, deliveryFee, total, appliedCoupon, clearCart, applyCouponCode, removeCouponCode } = useCart();
  const { user, saveAddress } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(user.addresses[0]?.id || '');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'store'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Card form state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // UPI VPA state
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (cart.length === 0) {
      // Don't bounce immediately if user is already placing an order
      // but if directly visiting empty checkout:
      // router.push('/cart');
    }
    if (user.addresses.length > 0 && !selectedAddressId) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [cart, user, selectedAddressId, router]);

  const selectedAddress = user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];

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

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select or add a shipping address', 'error');
      setStep('address');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderItems = cart.map((ci) => ({
        productId: ci.productId,
        name: ci.name,
        slug: ci.slug,
        image: ci.image,
        price: ci.price,
        size: ci.size,
        color: ci.color.name,
        quantity: ci.quantity
      }));

      const newOrder = await orderService.placeOrder({
        items: orderItems,
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        subtotal,
        discount,
        deliveryFee,
        totalAmount: total
      });

      clearCart();
      showToast('Order confirmed successfully!', 'success');
      router.push(`/order-success/${newOrder.orderNumber}`);
    } catch (err) {
      console.error(err);
      showToast('Could not place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <Logo size="lg" isLink={true} />
        <h2 className="text-xl font-bold uppercase tracking-wider mt-8 mb-2">No Items In Checkout</h2>
        <p className="text-xs text-zinc-400 mb-6">Your shopping bag is empty.</p>
        <Link href="/shop">
          <Button variant="primary" size="md">EXPLORE SPORT CATALOG</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top Minimal Checkout Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Logo size="md" isLink={true} />
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">256-BIT ENCRYPTED CHECKOUT</span>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <CheckoutStepper
        currentStep={step}
        onStepClick={(st) => setStep(st)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Stepper Form Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* STEP 1: ADDRESS SELECTION */}
            {step === 'address' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-white" />
                    <span>Select Delivery Address (Tamil Nadu)</span>
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddressModalOpen(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-5 bg-zinc-950 border cursor-pointer transition-all relative ${
                          isSelected
                            ? 'border-white ring-1 ring-white'
                            : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 text-[9px] font-bold uppercase bg-zinc-800 text-white px-2 py-0.5">
                            Default
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                              isSelected ? 'border-white bg-white' : 'border-zinc-600'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                          <div className="space-y-1 text-xs">
                            <p className="font-bold text-white uppercase text-sm">
                              {addr.fullName}
                            </p>
                            <p className="text-zinc-400">{addr.doorNo}, {addr.street}</p>
                            <p className="text-zinc-400">{addr.area}, {addr.city}</p>
                            <p className="text-zinc-300 font-mono">{addr.state} — {addr.pincode}</p>
                            <p className="text-zinc-400 font-mono text-[11px] pt-1">
                              Mobile: {addr.mobile}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => setStep('delivery')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    CONTINUE TO SHIPPING METHOD
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {step === 'delivery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-white" />
                    <span>Choose Shipping Speed</span>
                  </h2>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`flex items-center justify-between p-4 bg-zinc-950 border cursor-pointer transition-colors ${
                      deliveryMethod === 'standard'
                        ? 'border-white bg-zinc-900/60 ring-1 ring-white'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'standard'}
                        onChange={() => setDeliveryMethod('standard')}
                        className="accent-white cursor-pointer"
                      />
                      <div>
                        <p className="font-bold uppercase text-xs text-white">
                          Tamil Nadu Express Surface
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Estimated delivery: 24 - 48 Hours via Delhivery Surface
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`flex items-center justify-between p-4 bg-zinc-950 border cursor-pointer transition-colors ${
                      deliveryMethod === 'express'
                        ? 'border-white bg-zinc-900/60 ring-1 ring-white'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="accent-white cursor-pointer"
                      />
                      <div>
                        <p className="font-bold uppercase text-xs text-white">
                          Chennai & Coimbatore Same-Day Priority Courier
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Dispatched immediately from local flagship hub (Delivery today)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">₹99</span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('store')}
                    className={`flex items-center justify-between p-4 bg-zinc-950 border cursor-pointer transition-colors ${
                      deliveryMethod === 'store'
                        ? 'border-white bg-zinc-900/60 ring-1 ring-white'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === 'store'}
                        onChange={() => setDeliveryMethod('store')}
                        className="accent-white cursor-pointer"
                      />
                      <div>
                        <p className="font-bold uppercase text-xs text-white">
                          In-Store Pickup (Click & Collect)
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Ready for pickup in 2 hours at Chennai Flagship or Coimbatore Hub
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">FREE</span>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" size="md" onClick={() => setStep('address')}>
                    Back to Address
                  </Button>
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => setStep('payment')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    CONTINUE TO PAYMENT
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT UI */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-white" />
                    <span>Select Payment Method</span>
                  </h2>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { key: 'UPI', label: 'UPI (GPay / PhonePe)', icon: <QrCode className="w-4 h-4" /> },
                    { key: 'Credit Card', label: 'Credit Card', icon: <CreditCard className="w-4 h-4" /> },
                    { key: 'Debit Card', label: 'Debit Card', icon: <CreditCard className="w-4 h-4" /> },
                    { key: 'Net Banking', label: 'Net Banking', icon: <Building className="w-4 h-4" /> },
                    { key: 'Cash on Delivery', label: 'Cash on Delivery', icon: <Banknote className="w-4 h-4" /> },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPaymentMethod(p.key as Order['paymentMethod'])}
                      className={`p-3 text-left border flex flex-col justify-between gap-3 text-xs transition-colors ${
                        paymentMethod === p.key
                          ? 'border-white bg-zinc-900 text-white font-bold ring-1 ring-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-white">{p.icon}</div>
                      <span className="text-[11px] uppercase tracking-tight">{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Specific Payment Input UI */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-4 text-xs">
                      <p className="font-bold text-white uppercase text-xs flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-white" /> Instant UPI Payment
                      </p>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank / yourname@paytm"
                          className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Supports Google Pay, PhonePe, Paytm, CRED UPI, BHIM & all Indian banking apps.
                      </p>
                    </div>
                  )}

                  {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="4532 •••• •••• 8910"
                          className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            placeholder="KARTHIK RAJA"
                            className="w-full bg-black border border-zinc-700 px-3 py-2 text-white uppercase"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                            Expiry / CVV
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="MM/YY"
                              className="w-1/2 bg-black border border-zinc-700 px-2 py-2 text-white text-center font-mono"
                            />
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="CVV"
                              className="w-1/2 bg-black border border-zinc-700 px-2 py-2 text-white text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div className="space-y-3 text-xs">
                      <p className="font-bold text-white uppercase">Select Your Bank</p>
                      <select className="w-full bg-black border border-zinc-700 px-3 py-2 text-white">
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Indian Overseas Bank (IOB)</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-white uppercase">Cash on Delivery (COD)</p>
                      <p className="text-zinc-400">
                        Pay with cash or UPI QR scanner to the courier agent upon doorstep delivery.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button variant="ghost" size="md" onClick={() => setStep('delivery')}>
                    Back to Shipping
                  </Button>
                  <Button
                    size="xl"
                    variant="primary"
                    isLoading={isPlacingOrder}
                    onClick={handlePlaceOrder}
                    rightIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    PAY ₹{total} & CONFIRM ORDER
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                ORDER REVIEW ({cart.length} ITEMS)
              </h3>

              {/* Mini Item List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-zinc-900">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pt-2">
                    <div className="relative w-12 h-14 bg-zinc-900 flex-shrink-0 border border-zinc-800 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-white uppercase truncate">{item.name}</p>
                      <p className="text-[11px] text-zinc-400">
                        {item.size} • {item.color.name} • Qty: {item.quantity}
                      </p>
                      <p className="font-mono text-white font-bold mt-0.5">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Applicator */}
              <div className="pt-2 border-t border-zinc-800">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs">
                    <span className="font-mono text-white font-bold">{appliedCoupon} applied</span>
                    <button
                      onClick={removeCouponCode}
                      className="text-[10px] uppercase font-bold text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (SPORTS10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-black border border-zinc-700 px-3 py-1.5 text-xs text-white uppercase flex-1 focus:border-white focus:outline-none"
                    />
                    <Button type="submit" size="sm" variant="outline" isLoading={couponLoading}>
                      APPLY
                    </Button>
                  </form>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{deliveryFee === 0 ? <strong className="text-white">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white border-t border-zinc-800 pt-3">
                  <span>TOTAL PAYABLE</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {selectedAddress && (
                <div className="p-3 bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1">
                  <span className="font-bold text-white uppercase">Delivering to:</span>
                  <p className="text-zinc-300">{selectedAddress.fullName}, {selectedAddress.city} ({selectedAddress.pincode})</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={(newAddr) => {
          saveAddress(newAddr);
        }}
      />
    </div>
  );
}
