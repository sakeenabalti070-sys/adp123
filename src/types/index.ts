export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'inventory_manager'
  | 'order_manager'
  | 'marketing_manager'
  | 'support_agent'
  | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  addresses?: Address[];
  totalOrders?: number;
  totalSpent?: number;
  status: 'active' | 'inactive';
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}

export type ProductCategory = 'Unstitched' | 'Stitched' | 'Pret Wear' | 'Winter Collection' | 'Formal' | 'Sale';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string; // e.g. "Small", "Medium", "Large", "Unstitched"
  color: string; // e.g. "Dusty Rose", "Deep Plum", "Champagne"
  colorCode?: string;
  price: number;
  salePrice?: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  costPrice?: number;
  category: ProductCategory;
  subcategory: string;
  collection: string;
  fabric: string; // e.g. "Lawn", "Chiffon", "Velvet", "Cotton", "Linen"
  season: 'Summer' | 'Winter' | 'Festive' | 'All Season';
  badge?: 'New' | 'Best Seller' | 'Sale' | 'Limited Stock' | 'Trending' | 'Featured';
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  variants: ProductVariant[];
  totalStock: number;
  lowStockThreshold: number;
  careInstructions?: string;
  washInstructions?: string;
  sizeGuide?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

export type OrderStatus =
  | 'order_placed'
  | 'payment_confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'cash_on_delivery' | 'bank_transfer' | 'online_card' | 'jazzcash_easypaisa';
export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. COM-2026-001245
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  timeline: OrderTimelineItem[];
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number; // e.g. 15 for 15% or 500 for Rs. 500
  minimumOrder: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reason: string;
  description: string;
  status: 'requested' | 'approved' | 'rejected' | 'pickup_scheduled' | 'received' | 'refunded' | 'completed';
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  date: string;
  productId: string;
  productName: string;
  sku: string;
  previousQuantity: number;
  newQuantity: number;
  adjustment: number;
  reason: 'Restock' | 'Order Deduction' | 'Order Cancellation Restock' | 'Damage / Defect' | 'Manual Audit';
  adminUser: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
}

export interface SiteSettings {
  announcementBar: {
    enabled: boolean;
    text: string;
    secondaryText: string;
    bgColor: string;
    textColor: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    expressShippingFee: number;
    estimatedDaysStandard: string;
    estimatedDaysExpress: string;
  };
  taxRatePercentage: number;
  currency: string;
  whatsappSupport: {
    enabled: boolean;
    phoneNumber: string;
    prefilledMessage: string;
  };
  storeInfo: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    flagshipStudio: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
}
