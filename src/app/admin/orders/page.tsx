'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { orderService } from '@/services/orderService';
import { useToast } from '@/context/ToastContext';
import { Order, OrderStatus } from '@/types';
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  FileText
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const all = await orderService.getOrders();
      setOrders(all);
    }
    load();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      if (viewingOrder?.id === orderId) {
        setViewingOrder({ ...viewingOrder, status: newStatus });
      }
      showToast(`Order status updated to ${newStatus}`, 'success');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="ORDER FULFILLMENT & DISPATCH"
          subtitle="Direct Delivery across all 38 Districts in Tamil Nadu"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search by Order #, Customer, or City..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs pl-8 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-xs text-white px-3 py-2 uppercase font-bold focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Customer & City</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-white">#{ord.orderNumber}</td>
                    <td className="p-3.5 text-zinc-400 font-mono text-[11px]">{ord.date}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-white uppercase">{ord.shippingAddress.fullName}</p>
                      <p className="text-[10px] text-zinc-500">{ord.shippingAddress.city}, TN</p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-white">{ord.items.length} Items</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">₹{ord.totalAmount}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-extrabold uppercase px-2 py-1 bg-black border focus:outline-none ${
                          ord.status === 'Delivered'
                            ? 'border-emerald-700 text-emerald-400'
                            : ord.status === 'Shipped'
                            ? 'border-white text-white'
                            : 'border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewingOrder(ord)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Order Detail Inspector Modal */}
      <Modal
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        title={`INSPECT ORDER #${viewingOrder?.orderNumber}`}
        subtitle={`Placed on ${viewingOrder?.date} • Courier: ${viewingOrder?.courierPartner || 'Delhivery Express'}`}
        maxWidth="2xl"
      >
        {viewingOrder && (
          <div className="space-y-6 text-xs">
            {/* Status Picker */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-bold">Update Tracking Status:</span>
                <p className="text-white font-bold uppercase mt-0.5">{viewingOrder.status}</p>
              </div>
              <div className="flex gap-1.5">
                {(['Processing', 'Packed', 'Shipped', 'Delivered'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(viewingOrder.id, st)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-colors ${
                      viewingOrder.status === st
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-zinc-400 border-zinc-700 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px]">Items in Package</h4>
              <div className="divide-y divide-zinc-800 border border-zinc-800 p-3 bg-black">
                {viewingOrder.items.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-10 bg-zinc-900 overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="32px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white uppercase">{item.name}</p>
                        <p className="text-[10px] text-zinc-500">Size: {item.size} • Color: {item.color}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">Qty: {item.quantity} (₹{item.price * item.quantity})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Address */}
            <div className="p-4 bg-black border border-zinc-800 space-y-1">
              <h4 className="font-bold text-white uppercase text-[11px] mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white" /> Shipping Destination (Tamil Nadu)
              </h4>
              <p className="font-bold text-white">{viewingOrder.shippingAddress.fullName}</p>
              <p className="text-zinc-400">{viewingOrder.shippingAddress.doorNo}, {viewingOrder.shippingAddress.street}</p>
              <p className="text-zinc-400">{viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.state} — {viewingOrder.shippingAddress.pincode}</p>
              <p className="text-zinc-400 font-mono">Mobile: {viewingOrder.shippingAddress.mobile}</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="md" variant="primary" onClick={() => setViewingOrder(null)}>
                DONE
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
