'use client';

import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { POSReceipt } from '@/services/posService';
import { Printer, Check, Download } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: POSReceipt | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt
}) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="POS TRANSACTION COMPLETED"
      subtitle={`Receipt #${receipt.receiptId} • Physical Store Billing`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Printable Thermal Receipt Box */}
        <div
          id="printable-receipt"
          className="bg-white text-black font-mono text-xs p-6 shadow-md border border-zinc-300 rounded-none select-text"
        >
          {/* Header */}
          <div className="text-center pb-4 border-b border-dashed border-zinc-400 space-y-1">
            <h3 className="font-black text-sm uppercase tracking-widest">{receipt.storeName}</h3>
            <p className="text-[10px] text-zinc-600 leading-tight">{receipt.storeAddress}</p>
            <p className="text-[10px] text-zinc-600">GSTIN: {receipt.storeGstin}</p>
            <p className="text-[10px] text-zinc-600 mt-1 font-sans font-bold">RETAIL TAX INVOICE</p>
          </div>

          {/* Meta Info */}
          <div className="py-3 border-b border-dashed border-zinc-400 text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span>Receipt: <strong>{receipt.receiptId}</strong></span>
              <span>Time: {receipt.dateTime.split(',')[1] || receipt.dateTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier: {receipt.cashierName}</span>
              <span>Date: {receipt.dateTime.split(',')[0]}</span>
            </div>
            {receipt.customerMobile && (
              <div className="flex justify-between text-zinc-700">
                <span>Customer: {receipt.customerName || 'Walk-in'}</span>
                <span>Mob: {receipt.customerMobile}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-zinc-400">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-zinc-300 text-zinc-600 font-bold uppercase text-[9px]">
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Price</th>
                  <th className="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {receipt.items.map((item, i) => (
                  <tr key={i} className="py-1">
                    <td className="py-1.5 font-bold">
                      <div className="line-clamp-1">{item.name}</div>
                      <div className="text-[9px] text-zinc-500 font-normal">
                        Size: {item.size} • {item.color}
                      </div>
                    </td>
                    <td className="py-1.5 text-center">{item.quantity}</td>
                    <td className="py-1.5 text-right">₹{item.price}</td>
                    <td className="py-1.5 text-right font-bold">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="py-3 border-b border-dashed border-zinc-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{receipt.subtotal}</span>
            </div>
            {receipt.discountAmount > 0 && (
              <div className="flex justify-between text-zinc-700 font-bold">
                <span>Store Discount:</span>
                <span>-₹{receipt.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Included GST (5%):</span>
              <span>₹{receipt.taxAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-black border-t border-zinc-300 pt-1 mt-1">
              <span>NET AMOUNT:</span>
              <span>₹{receipt.netTotal}</span>
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="py-3 border-b border-dashed border-zinc-400 text-[11px] space-y-0.5">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Tendered Amount:</span>
              <span>₹{receipt.amountPaid}</span>
            </div>
            {receipt.changeGiven > 0 && (
              <div className="flex justify-between font-bold text-zinc-800">
                <span>Change Returned:</span>
                <span>₹{receipt.changeGiven}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 text-[9px] text-zinc-500 space-y-1">
            <p className="font-bold uppercase text-zinc-700">Thank you for visiting SPORTS MENS WEAR!</p>
            <p>7-day in-store exchange with this physical receipt.</p>
            <p className="tracking-widest">WWW.SPORTSMENSWEAR.COM</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            size="md"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            PRINT THERMAL RECEIPT
          </Button>
          <Button
            variant="primary"
            fullWidth
            size="md"
            onClick={onClose}
            leftIcon={<Check className="w-4 h-4" />}
          >
            DONE / NEXT CUSTOMER
          </Button>
        </div>
      </div>
    </Modal>
  );
};
