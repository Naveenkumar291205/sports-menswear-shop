'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ReceiptModal } from '@/components/admin/ReceiptModal';
import { productService } from '@/services/productService';
import { posService, POSReceipt } from '@/services/posService';
import { useToast } from '@/context/ToastContext';
import { Product, POSBillItem } from '@/types';
import {
  Store,
  Search,
  Barcode,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  QrCode,
  User,
  Phone,
  Printer,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AdminPOSPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<POSBillItem[]>([]);
  const [customerName, setCustomerName] = useState('Karthik Raja');
  const [customerMobile, setCustomerMobile] = useState('+91 9876543210');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Variant selection modal for product clicked
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('Onyx Black');

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [completedReceipt, setCompletedReceipt] = useState<POSReceipt | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await productService.getProducts({ limit: 50 });
      setProducts(res.products);
    }
    load();
  }, []);

  const filteredCatalog = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenVariantPicker = (product: Product) => {
    setSelectedProductForVariant(product);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Black');
  };

  const handleAddVariantToBill = () => {
    if (!selectedProductForVariant) return;

    const existingIndex = billItems.findIndex(
      (bi) =>
        bi.productId === selectedProductForVariant.id &&
        bi.size === selectedSize &&
        bi.color === selectedColor
    );

    if (existingIndex > -1) {
      const updated = [...billItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price;
      setBillItems(updated);
    } else {
      const newItem: POSBillItem = {
        productId: selectedProductForVariant.id,
        name: selectedProductForVariant.name,
        sku: `${selectedProductForVariant.sku}-${selectedSize}`,
        size: selectedSize,
        color: selectedColor,
        price: selectedProductForVariant.price,
        quantity: 1,
        discount: 0,
        total: selectedProductForVariant.price
      };
      setBillItems([newItem, ...billItems]);
    }

    setSelectedProductForVariant(null);
    showToast(`Added ${selectedProductForVariant.name} (${selectedSize}) to bill`, 'success');
  };

  const handleUpdateQty = (idx: number, delta: number) => {
    const updated = [...billItems];
    const newQty = updated[idx].quantity + delta;
    if (newQty <= 0) {
      updated.splice(idx, 1);
    } else {
      updated[idx].quantity = newQty;
      updated[idx].total = newQty * updated[idx].price;
    }
    setBillItems(updated);
  };

  const handleRemoveBillItem = (idx: number) => {
    const updated = [...billItems];
    updated.splice(idx, 1);
    setBillItems(updated);
  };

  const subtotal = billItems.reduce((acc, i) => acc + i.total, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const netTotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((netTotal * 0.05) * 100) / 100; // 5% GST included

  const handleProcessPayment = async () => {
    if (billItems.length === 0) {
      showToast('Bill is empty. Add products to proceed.', 'error');
      return;
    }

    const receipt = await posService.generateReceipt({
      cashierName: 'Sundaram (POS-01)',
      customerName: customerName.trim() || 'Walk-in Athlete',
      customerMobile: customerMobile.trim() || undefined,
      items: billItems,
      subtotal,
      taxAmount,
      discountAmount,
      netTotal,
      paymentMethod: paymentMode,
      amountPaid: paymentMode === 'Cash' ? (cashTendered || netTotal) : netTotal,
      changeGiven: paymentMode === 'Cash' ? Math.max(0, (cashTendered || netTotal) - netTotal) : 0
    });

    setCompletedReceipt(receipt);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);
    setBillItems([]);
    setDiscountPercent(0);
    showToast('POS sale completed! Printable receipt generated.', 'success');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* POS Header Bar */}
        <header className="bg-zinc-950 border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-black font-black flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-white">
                FLAGSHIP STORE POS TERMINAL
              </h1>
              <p className="text-[10px] text-zinc-400">
                Chennai T. Nagar Hub • Register #01 • Direct 5,000 SKU Barcode Scanner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
              Cashier: <strong>Sundaram</strong>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </header>

        {/* POS Split View: Left Catalog Scanner | Right Active Bill */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
          {/* Left: Product Catalog & Quick Scanner (7 Cols) */}
          <div className="lg:col-span-7 bg-black border-r border-zinc-800 flex flex-col h-full overflow-hidden">
            {/* Search / Barcode input */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-950">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Scan Barcode or Search SKU / Product Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-zinc-700 text-xs pl-9 pr-4 py-2.5 text-white font-mono placeholder-zinc-500 focus:border-white focus:outline-none"
                />
                <Barcode className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredCatalog.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleOpenVariantPicker(product)}
                    className="p-3 bg-zinc-950 border border-zinc-800 hover:border-white cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-[3/4] bg-zinc-900 mb-2 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="160px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 font-bold">
                        {product.sku}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-[11px] uppercase line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="font-bold text-white font-mono">₹{product.price}</span>
                        <span className="text-[10px] text-zinc-500">{product.sizes.length} Sizes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Active Customer Bill & Checkout Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-zinc-950 flex flex-col h-full overflow-hidden">
            {/* Customer Lookup Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Athlete"
                  className="w-full bg-black border border-zinc-700 px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Phone (for SMS Receipt)
                </label>
                <input
                  type="tel"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-black border border-zinc-700 px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            {/* Bill Line Items Table */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-zinc-800/60">
              {billItems.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 space-y-2">
                  <Barcode className="w-10 h-10 mx-auto text-zinc-600" />
                  <p className="text-xs uppercase font-bold tracking-wider">Bill is Empty</p>
                  <p className="text-[11px]">Click or scan items on the left catalog to add.</p>
                </div>
              ) : (
                billItems.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white uppercase truncate">{item.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Size: <strong className="text-white">{item.size}</strong> • {item.color}
                      </p>
                      <p className="font-mono text-zinc-300 font-bold mt-0.5">
                        ₹{item.price} each
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-zinc-700 bg-black">
                      <button
                        onClick={() => handleUpdateQty(idx, -1)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono font-bold text-white text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(idx, 1)}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="font-mono font-black text-white text-sm w-16 text-right">
                      ₹{item.total}
                    </span>

                    <button
                      onClick={() => handleRemoveBillItem(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bill Summary & Payment Footer */}
            <div className="p-5 border-t border-zinc-800 bg-black space-y-4 flex-shrink-0">
              {/* Discount Quick Buttons */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400 font-bold uppercase">Store Discount:</span>
                <div className="flex gap-1">
                  {[0, 5, 10, 15].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDiscountPercent(d)}
                      className={`px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                        discountPercent === d
                          ? 'bg-white text-black border-white'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {d === 0 ? 'None' : `${d}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-900 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-white">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500 text-[10px]">
                  <span>GST Included (5%)</span>
                  <span className="font-mono">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>NET TOTAL PAYABLE</span>
                  <span className="font-mono text-xl text-white">₹{netTotal}</span>
                </div>
              </div>

              {/* Tender Payment CTA */}
              <Button
                size="xl"
                variant="primary"
                fullWidth
                disabled={billItems.length === 0}
                onClick={() => {
                  setCashTendered(netTotal);
                  setIsPaymentModalOpen(true);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                PAY ₹{netTotal} / GENERATE BILL
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Variant Selector Modal */}
      <Modal
        isOpen={Boolean(selectedProductForVariant)}
        onClose={() => setSelectedProductForVariant(null)}
        title="CHOOSE ATHLETIC VARIANT"
        subtitle={selectedProductForVariant?.name}
        maxWidth="md"
      >
        <div className="space-y-6 text-xs">
          {/* Size */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-2">
              Select Size
            </label>
            <div className="grid grid-cols-5 gap-2">
              {selectedProductForVariant?.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 font-bold uppercase border text-xs transition-colors ${
                    selectedSize === s
                      ? 'bg-white text-black border-white ring-2 ring-white/20'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-zinc-400 mb-2">
              Select Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {selectedProductForVariant?.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 p-2.5 border text-xs transition-colors ${
                    selectedColor === c.name
                      ? 'border-white bg-zinc-900 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-zinc-600 inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onClick={handleAddVariantToBill}
            >
              ADD VARIANT TO POS BILL
            </Button>
          </div>
        </div>
      </Modal>

      {/* POS Payment Tender Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="SELECT TENDER PAYMENT"
        subtitle={`Bill Total: ₹${netTotal} • ${customerName}`}
        maxWidth="md"
      >
        <div className="space-y-6 text-xs">
          {/* Tender Mode Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { mode: 'UPI', label: 'UPI QR', icon: <QrCode className="w-4 h-4" /> },
              { mode: 'Cash', label: 'Cash Tender', icon: <Banknote className="w-4 h-4" /> },
              { mode: 'Card', label: 'EDC Card Terminal', icon: <CreditCard className="w-4 h-4" /> },
            ].map((p) => (
              <button
                key={p.mode}
                onClick={() => setPaymentMode(p.mode as any)}
                className={`p-3 border flex flex-col items-center gap-2 text-center transition-colors ${
                  paymentMode === p.mode
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                }`}
              >
                {p.icon}
                <span className="text-[11px] uppercase font-bold">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Cash Change Calculator */}
          {paymentMode === 'Cash' && (
            <div className="p-4 bg-zinc-900 border border-zinc-800 space-y-3">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase">
                Cash Tendered By Customer (₹)
              </label>
              <input
                type="number"
                value={cashTendered || ''}
                onChange={(e) => setCashTendered(Number(e.target.value))}
                placeholder={`${netTotal}`}
                className="w-full bg-black border border-zinc-700 px-3 py-2 text-lg font-mono font-bold text-white focus:border-white focus:outline-none"
              />
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-zinc-400">Change Return Amount:</span>
                <span className="font-mono text-base font-black text-emerald-400">
                  ₹{Math.max(0, cashTendered - netTotal)}
                </span>
              </div>
            </div>
          )}

          {/* UPI Simulator */}
          {paymentMode === 'UPI' && (
            <div className="p-4 bg-zinc-900 border border-zinc-800 text-center space-y-2">
              <QrCode className="w-16 h-16 mx-auto text-white" />
              <p className="font-bold text-white uppercase text-xs">Scan Store Dynamic QR Code</p>
              <p className="text-[10px] text-zinc-400 font-mono">
                Amount: ₹{netTotal} • Store ID: ZZ-CHN-POS1
              </p>
            </div>
          )}

          {/* Card Simulator */}
          {paymentMode === 'Card' && (
            <div className="p-4 bg-zinc-900 border border-zinc-800 text-center space-y-2">
              <CreditCard className="w-12 h-12 mx-auto text-white" />
              <p className="font-bold text-white uppercase text-xs">Swipe / Tap on POS EDC Terminal</p>
              <p className="text-[10px] text-zinc-400 font-mono">
                Terminal ID: ZZ-HDFC-991 • Status: Ready
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
            <Button variant="ghost" size="md" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="lg"
              variant="primary"
              onClick={handleProcessPayment}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              RECORD PAYMENT & PRINT
            </Button>
          </div>
        </div>
      </Modal>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receipt={completedReceipt}
      />
    </div>
  );
}
