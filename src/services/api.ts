import {
  Product,
  Order,
  User,
  Coupon,
  Review,
  SiteSettings,
  InventoryLog,
  AuditLog,
  ReturnRequest,
  ContactMessage,
} from '../types';

export const api = {
  // Products
  async getProducts(params?: { category?: string; fabric?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.fabric) searchParams.set('fabric', params.fabric);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params?.sort) searchParams.set('sort', params.sort);

    const res = await fetch(`/api/products?${searchParams.toString()}`);
    const data = await res.json();
    return data.products || [];
  },

  async getProduct(slug: string): Promise<{ product: Product; reviews: Review[]; related: Product[] }> {
    const res = await fetch(`/api/products/${slug}`);
    return res.json();
  },

  async saveProduct(product: Partial<Product>, adminName: string = 'Super Admin'): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-name': adminName,
      },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return data.product;
  },

  async deleteProduct(id: string, adminName: string = 'Super Admin'): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-name': adminName },
    });
    const data = await res.json();
    return data.success;
  },

  // Inventory
  async adjustInventory(payload: { productId: string; variantId: string; adjustment: number; reason: string; adminUser: string }) {
    const res = await fetch('/api/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getInventoryLogs(): Promise<InventoryLog[]> {
    const res = await fetch('/api/inventory/logs');
    const data = await res.json();
    return data.logs || [];
  },

  // Orders
  async createOrder(orderPayload: any): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to place order');
    return data.order;
  },

  async getOrders(params?: { status?: string; search?: string }): Promise<Order[]> {
    const q = new URLSearchParams(params as any).toString();
    const res = await fetch(`/api/orders?${q}`);
    const data = await res.json();
    return data.orders || [];
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    const data = await res.json();
    return data.order;
  },

  async trackOrder(orderNumber: string, contact: string): Promise<Order> {
    const res = await fetch('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, contact }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Order not found');
    return data.order;
  },

  async updateOrderStatus(id: string, payload: { status: string; courierName?: string; trackingNumber?: string; adminName?: string }): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.order;
  },

  async submitReturn(payload: { orderNumber: string; customerName: string; customerEmail: string; customerPhone: string; reason: string; description: string }) {
    const res = await fetch(`/api/orders/${payload.orderNumber}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getReturns(): Promise<ReturnRequest[]> {
    const res = await fetch('/api/returns');
    const data = await res.json();
    return data.returns || [];
  },

  async updateReturnStatus(id: string, status: string, adminName: string = 'Super Admin') {
    const res = await fetch(`/api/returns/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminName }),
    });
    return res.json();
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string; coupon?: Coupon }> {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return res.json();
  },

  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch('/api/coupons');
    const data = await res.json();
    return data.coupons || [];
  },

  async saveCoupon(coupon: Partial<Coupon>, adminName: string = 'Super Admin'): Promise<Coupon> {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-name': adminName,
      },
      body: JSON.stringify(coupon),
    });
    const data = await res.json();
    return data.coupon;
  },

  // Reviews
  async getAllReviews(): Promise<Review[]> {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    return data.reviews || [];
  },

  async submitReview(reviewPayload: any): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewPayload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to submit review');
    return data.review;
  },

  async updateReviewStatus(id: string, status: string, adminName: string = 'Super Admin') {
    const res = await fetch(`/api/reviews/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminName }),
    });
    return res.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(userData: any): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    const data = await res.json();
    return data.users || [];
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Partial<SiteSettings>, adminName: string = 'Super Admin'): Promise<SiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-name': adminName,
      },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    return data.settings;
  },

  // Admin Dashboard & Audit
  async getAdminDashboard(): Promise<any> {
    const res = await fetch('/api/admin/dashboard');
    const data = await res.json();
    return data.stats;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/admin/audit-logs');
    const data = await res.json();
    return data.logs || [];
  },

  // Contact & Newsletter
  async submitContact(payload: { name: string; email: string; phone?: string; subject?: string; message: string }) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/contact');
    const data = await res.json();
    return data.messages || [];
  },

  async subscribeNewsletter(email: string) {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },
};
