import { Coupon } from '@/types';
import { COUPONS } from '@/data/coupons';

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    return COUPONS;
  },

  async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const trimmed = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code.toUpperCase() === trimmed);

    if (!found) {
      return {
        valid: false,
        discountAmount: 0,
        message: 'Invalid promo code. Please check and try again.'
      };
    }

    if (subtotal < found.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Add items worth ₹${found.minOrderValue - subtotal} more to apply ${found.code}.`
      };
    }

    let discount = 0;
    if (found.discountType === 'percentage') {
      discount = Math.round((subtotal * found.discountValue) / 100);
    } else {
      discount = found.discountValue;
    }

    return {
      valid: true,
      coupon: found,
      discountAmount: discount,
      message: `Coupon ${found.code} applied successfully! You saved ₹${discount}.`
    };
  }
};
