'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { AddressFormModal } from '@/components/checkout/AddressFormModal';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { couponService } from '@/services/couponService';
import { useToast } from '@/context/ToastContext';
import { Order, ReturnRequest, UserAddress, Coupon } from '@/types';
import {
  User,
  ShoppingBag,
  Truck,
  MapPin,
  RotateCcw,
  Tag,
  Bell,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  Copy,
} from 'lucide-react';


function AccountInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const { user, logout, updateProfile, saveAddress, deleteAddress } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  // Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  // Returns request state
  const [returnOrderId, setReturnOrderId] = useState('');
  const [returnItemName, setReturnItemName] = useState('');
  const [returnType, setReturnType] = useState<'Return' | 'Exchange'>('Exchange');
  const [returnReason, setReturnReason] = useState<ReturnRequest['reason']>('Wrong Size');
  const [returnComments, setReturnComments] = useState('');
  const [exchangeSize, setExchangeSize] = useState('L');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  useEffect(() => {
    async function load() {
      const [allOrders, allReturns, allCoupons] = await Promise.all([
        orderService.getOrders(),
        orderService.getReturns(),
        couponService.getCoupons()
      ]);
      setOrders(allOrders);
      setReturns(allReturns);
      setCoupons(allCoupons);
      if (allOrders.length > 0) {
        setSelectedOrderForTracking(allOrders[0]);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code ${code} copied!`, 'success');
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId || !returnItemName) {
      showToast('Please select an order and item for return/exchange', 'error');
      return;
    }

    setIsSubmittingReturn(true);
    const targetOrder = orders.find((o) => o.id === returnOrderId || o.orderNumber === returnOrderId);
    const newReq = await orderService.submitReturn({
      orderId: targetOrder?.id || 'ord-sample',
      orderNumber: targetOrder?.orderNumber || returnOrderId,
      requestType: returnType,
      productId: 'prod-001',
      productName: returnItemName,
      productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      size: 'M',
      exchangeSize: returnType === 'Exchange' ? exchangeSize : undefined,
      reason: returnReason,
      comments: returnComments
    });

    setReturns([newReq, ...returns]);
    setIsSubmittingReturn(false);
    showToast('Your exchange/return request has been scheduled for doorstep pickup!', 'success');
    setReturnItemName('');
    setReturnComments('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Account Title Banner */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white text-black font-black text-xl flex items-center justify-center shadow-glow">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase text-white">
                  {user.name || 'Athlete Guest'}
                </h1>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-[10px] uppercase font-bold text-zinc-300">
                  {user.isLoggedIn ? 'Athlete Member' : 'Guest'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {user.mobile || 'No mobile linked'}{user.email ? ` • ${user.email}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/wishlist">
              <Button size="sm" variant="outline">Wishlist</Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={logout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Horizontal Scrollable Tab Bar */}
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
          {[
            { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
            { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, count: orders.length },
            { id: 'tracking', label: 'Tracking', icon: <Truck className="w-4 h-4" /> },
            { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" />, count: user.addresses.length },
            { id: 'returns', label: 'Returns', icon: <RotateCcw className="w-4 h-4" /> },
            { id: 'coupons', label: 'Coupons', icon: <Tag className="w-4 h-4" />, count: coupons.length },
            { id: 'notifications', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-black font-black shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 ${
                    activeTab === tab.id ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar for Desktop */}
          <aside className="hidden lg:block lg:col-span-3 space-y-1">
            {[
              { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
              { id: 'orders', label: 'Order History', icon: <ShoppingBag className="w-4 h-4" />, count: orders.length },
              { id: 'tracking', label: 'Live Order Tracking', icon: <Truck className="w-4 h-4" /> },
              { id: 'addresses', label: 'Delivery Addresses', icon: <MapPin className="w-4 h-4" />, count: user.addresses.length },
              { id: 'returns', label: 'Returns & Exchanges', icon: <RotateCcw className="w-4 h-4" /> },
              { id: 'coupons', label: 'Coupons & Deals', icon: <Tag className="w-4 h-4" />, count: coupons.length },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-white text-black font-extrabold shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 ${
                      activeTab === tab.id ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </aside>

          {/* Right Tab Content */}
          <div className="lg:col-span-9 bg-zinc-950 border border-zinc-800 p-6 sm:p-8">
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-base font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                  ATHLETE PROFILE & MEASUREMENTS
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.name || ''}
                      placeholder="Not set"
                      className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.mobile || ''}
                      placeholder="Not set"
                      className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email || ''}
                      placeholder="Not set"
                      className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                      Primary Fitness Discipline
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.primarySport || 'Strength Training & Gym'}
                      className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-white"
                    />
                  </div>
                </div>


              </div>
            )}

            {/* 2. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    ORDER HISTORY ({orders.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 text-xs">
                        <div>
                          <span className="font-mono font-bold text-white text-sm">#{ord.orderNumber}</span>
                          <span className="text-zinc-500 ml-2">Placed on {ord.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : ord.status === 'Shipped'
                                ? 'bg-white text-black font-black'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                          <span className="font-mono font-bold text-white">₹{ord.totalAmount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-12 bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-white uppercase">{item.name}</p>
                                <p className="text-[11px] text-zinc-400">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-zinc-300">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 pt-2 border-t border-zinc-900">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrderForTracking(ord);
                            setActiveTab('tracking');
                          }}
                          leftIcon={<Truck className="w-3.5 h-3.5" />}
                        >
                          LIVE TRACKING
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TRACKING TIMELINE TAB */}
            {activeTab === 'tracking' && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-3">
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    LIVE ORDER TRACKING
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Order ID: <strong>{selectedOrderForTracking?.orderNumber || 'ZZ100001'}</strong> • Tracking AWB:{' '}
                    <strong>{selectedOrderForTracking?.trackingNumber || 'DELHIVERY-ZZ-992819'}</strong>
                  </p>
                </div>

                {selectedOrderForTracking ? (
                  <div className="space-y-8">
                    {/* Visual Vertical Timeline */}
                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
                      {selectedOrderForTracking.trackingTimeline.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 text-xs">
                          {/* Dot / Check Icon */}
                          <div
                            className={`absolute -left-6 sm:-left-8 w-5 h-5 sm:w-7 sm:h-7 rounded-none flex items-center justify-center font-bold text-xs ${
                              step.completed
                                ? 'bg-white text-black shadow-glow'
                                : step.current
                                ? 'bg-emerald-500 text-black animate-pulse'
                                : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                            }`}
                          >
                            {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>

                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white uppercase text-xs sm:text-sm">
                                {step.status}
                              </h4>
                              {step.date && (
                                <span className="text-[10px] text-zinc-400 font-mono">{step.date}</span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination Snapshot */}
                    <div className="p-4 bg-zinc-900/60 border border-zinc-800 text-xs space-y-1">
                      <p className="font-bold text-white uppercase">Destination Address:</p>
                      <p className="text-zinc-300">
                        {selectedOrderForTracking.shippingAddress.fullName} —{' '}
                        {selectedOrderForTracking.shippingAddress.doorNo},{' '}
                        {selectedOrderForTracking.shippingAddress.street},{' '}
                        {selectedOrderForTracking.shippingAddress.city},{' '}
                        {selectedOrderForTracking.shippingAddress.state} ({selectedOrderForTracking.shippingAddress.pincode})
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* 4. ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    SAVED ADDRESSES ({user.addresses.length})
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="p-5 bg-zinc-900/40 border border-zinc-800 text-xs space-y-3 relative">
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 text-[9px] font-bold uppercase bg-white text-black px-2 py-0.5">
                          Default Address
                        </span>
                      )}
                      <div>
                        <p className="font-bold text-white uppercase text-sm">{addr.fullName}</p>
                        <p className="text-zinc-400 mt-1">{addr.doorNo}, {addr.street}</p>
                        <p className="text-zinc-400">{addr.area}, {addr.city}</p>
                        <p className="text-zinc-300 font-mono">{addr.state} — {addr.pincode}</p>
                        <p className="text-zinc-400 font-mono text-[11px] pt-1">Mobile: {addr.mobile}</p>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                        <button
                          onClick={() => {
                            setEditingAddress(addr);
                            setIsAddressModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. RETURNS & EXCHANGES TAB */}
            {activeTab === 'returns' && (
              <div className="space-y-8">
                <div className="border-b border-zinc-800 pb-3">
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    RETURNS & SIZE EXCHANGES
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Hassle-free 7-day doorstep exchange across Tamil Nadu
                  </p>
                </div>

                {/* Submit New Request Form */}
                <form onSubmit={handleReturnSubmit} className="p-5 bg-zinc-900/60 border border-zinc-800 space-y-4 text-xs">
                  <h3 className="font-bold uppercase text-white">Create Return or Size Exchange Request</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                        Select Order
                      </label>
                      <select
                        value={returnOrderId}
                        onChange={(e) => {
                          setReturnOrderId(e.target.value);
                          const ord = orders.find((o) => o.id === e.target.value || o.orderNumber === e.target.value);
                          if (ord && ord.items[0]) {
                            setReturnItemName(ord.items[0].name);
                          }
                        }}
                        className="w-full bg-black border border-zinc-700 px-3 py-2 text-white"
                      >
                        <option value="">-- Choose Order --</option>
                        {orders.map((o) => (
                          <option key={o.id} value={o.orderNumber}>
                            #{o.orderNumber} - {o.date} (₹{o.totalAmount})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                        Request Type
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setReturnType('Exchange')}
                          className={`flex-1 py-2 font-bold uppercase border transition-colors ${
                            returnType === 'Exchange'
                              ? 'bg-white text-black border-white'
                              : 'bg-black text-zinc-400 border-zinc-700'
                          }`}
                        >
                          Size Exchange
                        </button>
                        <button
                          type="button"
                          onClick={() => setReturnType('Return')}
                          className={`flex-1 py-2 font-bold uppercase border transition-colors ${
                            returnType === 'Return'
                              ? 'bg-white text-black border-white'
                              : 'bg-black text-zinc-400 border-zinc-700'
                          }`}
                        >
                          Return & Refund
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                        Reason For Request *
                      </label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value as ReturnRequest['reason'])}
                        className="w-full bg-black border border-zinc-700 px-3 py-2 text-white"
                      >
                        <option value="Wrong Size">Wrong Size (Need different fit)</option>
                        <option value="Wrong Product">Wrong Product Received</option>
                        <option value="Damaged Product">Damaged / Defective</option>
                        <option value="Quality Issue">Fabric / Stitch Quality Issue</option>
                        <option value="Different Product Received">Different Item</option>
                        <option value="Other">Other Reason</option>
                      </select>
                    </div>

                    {returnType === 'Exchange' && (
                      <div>
                        <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                          Required New Size
                        </label>
                        <select
                          value={exchangeSize}
                          onChange={(e) => setExchangeSize(e.target.value)}
                          className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-bold"
                        >
                          <option value="S">S (Small)</option>
                          <option value="M">M (Medium)</option>
                          <option value="L">L (Large)</option>
                          <option value="XL">XL (Extra Large)</option>
                          <option value="XXL">XXL (Double XL)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                      Notes / Comments
                    </label>
                    <textarea
                      rows={2}
                      value={returnComments}
                      onChange={(e) => setReturnComments(e.target.value)}
                      placeholder="Specify fit feedback or reason..."
                      className="w-full bg-black border border-zinc-700 p-2.5 text-white placeholder-zinc-500"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md" isLoading={isSubmittingReturn}>
                    SCHEDULE REVERSE PICKUP
                  </Button>
                </form>

                {/* Existing Requests List */}
                <div className="space-y-3">
                  <h3 className="font-bold uppercase text-white text-xs">Past Requests</h3>
                  {returns.map((ret) => (
                    <div key={ret.id} className="p-4 bg-zinc-900/30 border border-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase">{ret.requestType}: {ret.productName}</span>
                          <span className="px-2 py-0.5 bg-zinc-800 text-[10px] text-zinc-300 font-bold uppercase">
                            {ret.status}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          Order: #{ret.orderNumber} • Reason: {ret.reason} {ret.exchangeSize && `(New Size: ${ret.exchangeSize})`}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{ret.createdAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="border-b border-zinc-800 pb-3">
                  <h2 className="text-base font-bold uppercase tracking-wider text-white">
                    ACTIVE ATHLETE PROMO CODES
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Click copy code and apply during bag checkout
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div key={c.code} className="p-5 bg-zinc-900/40 border border-zinc-800 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="px-3 py-1 bg-white text-black font-mono font-black text-sm tracking-wider">
                          {c.code}
                        </div>
                        <button
                          onClick={() => handleCopyCoupon(c.code)}
                          className="flex items-center gap-1 text-[11px] font-bold text-zinc-300 hover:text-white uppercase"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-medium">{c.description}</p>
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-800">
                        <span>Min Order: ₹{c.minOrderValue}</span>
                        <span>Valid till: {c.expiresAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                  NOTIFICATIONS & LOGISTICS ALERTS
                </h2>
                <div className="p-6 text-center text-xs text-zinc-500">
                  No notifications yet.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Address modal */}
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={(addr) => {
          saveAddress(addr);
        }}
        initialAddress={editingAddress}
      />

      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8">Loading account...</div>}>
      <AccountInner />
    </Suspense>
  );
}
