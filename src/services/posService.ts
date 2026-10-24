import { POSBillItem } from '@/types';

export interface POSReceipt {
  receiptId: string;
  dateTime: string;
  storeName: string;
  storeAddress: string;
  storeGstin: string;
  cashierName: string;
  customerName?: string;
  customerMobile?: string;
  items: POSBillItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  netTotal: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Split';
  amountPaid: number;
  changeGiven: number;
}

export const posService = {
  async generateReceipt(data: Omit<POSReceipt, 'receiptId' | 'dateTime' | 'storeName' | 'storeAddress' | 'storeGstin'>): Promise<POSReceipt> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const receiptNum = `POS-${Date.now().toString().slice(-6)}`;
    return {
      receiptId: receiptNum,
      dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      storeName: 'SPORTS MENS WEAR FLAGSHIP RETAIL',
      storeAddress: '48 Usman Road, T. Nagar, Chennai, TN 600017',
      storeGstin: '33AABCZ9821Q1Z4',
      ...data
    };
  }
};
