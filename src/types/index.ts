export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  is699Collection?: boolean;
  inStock: boolean;
  stockCount: number;
  images: string[];
  colors: { name: string; hex: string; inStock?: boolean }[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  material: string;
  fabricFeatures: string[];
  careInstructions: string[];
  fit: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  subCategories?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: { name: string; hex: string };
  quantity: number;
  sku: string;
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
  rating: number;
  inStock: boolean;
  colors: { name: string; hex: string }[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
}

export interface UserAddress {
  id: string;
  fullName: string;
  mobile: string;
  doorNo: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
  type: 'home' | 'work' | 'other';
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export interface TrackingStep {
  status: OrderStatus;
  date?: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  paymentStatus: 'Paid' | 'Pending' | 'COD' | 'Refunded';
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery' | 'POS Cash';
  totalAmount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  items: OrderItem[];
  shippingAddress: UserAddress;
  estimatedDelivery: string;
  trackingNumber?: string;
  courierPartner?: string;
  trackingTimeline: TrackingStep[];
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  requestType: 'Return' | 'Exchange';
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  exchangeSize?: string;
  reason: 'Wrong Size' | 'Wrong Product' | 'Damaged Product' | 'Quality Issue' | 'Different Product Received' | 'Other';
  comments?: string;
  status: 'Requested' | 'Approved' | 'Pickup Scheduled' | 'Item Received' | 'Refunded' | 'Replacement Dispatched';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  description: string;
  expiresAt: string;
  applicableCategories?: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userLocation: string;
  rating: number;
  date: string;
  verifiedPurchase: boolean;
  title: string;
  comment: string;
  helpfulCount: number;
  userImage?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  size: string;
  color: string;
  storeStock: number;
  onlineStock: number;
  reservedStock: number;
  totalStock: number;
  lowStockThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface POSBillItem {
  productId: string;
  name: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}
