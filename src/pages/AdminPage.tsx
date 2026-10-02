import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  RotateCcw,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  AlertTriangle,
  Clock,
  Printer,
  X,
  TrendingUp,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Product,
  Order,
  User,
  Coupon,
  Review,
  ReturnRequest,
  InventoryLog,
  AuditLog,
  SiteSettings,
  OrderStatus,
  ProductVariant,
} from '../types';

interface AdminPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, isStaff, switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'inventory' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'returns' | 'settings' | 'logs'
  >('dashboard');

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Search and filter states
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [inventoryTarget, setInventoryTarget] = useState<{ productId: string; variantId: string; sku: string; currentStock: number } | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Restock');

  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [assignedCourier, setAssignedCourier] = useState('TCS Express');
  const [assignedTracking, setAssignedTracking] = useState('');

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    type: 'percentage',
    value: 10,
    minimumOrder: 5000,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '2026-12-31',
    usageLimit: 1000,
    isActive: true,
    description: '',
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        dashStats,
        allProds,
        allOrds,
        allUsers,
        allCoups,
        allRevs,
        allRets,
        invLogs,
        audLogs,
        settings,
      ] = await Promise.all([
        api.getAdminDashboard(),
        api.getProducts(),
        api.getOrders(),
        api.getUsers(),
        api.getCoupons(),
        api.getAllReviews(),
        api.getReturns(),
        api.getInventoryLogs(),
        api.getAuditLogs(),
        api.getSettings(),
      ]);

      setStats(dashStats);
      setProducts(allProds);
      setOrders(allOrds);
      setCustomers(allUsers);
      setCoupons(allCoups);
      setReviews(allRevs);
      setReturns(allRets);
      setInventoryLogs(invLogs);
      setAuditLogs(audLogs);
      setSiteSettings(settings);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: '',
      slug: '',
      sku: `COM-LAWN-${Date.now().toString().slice(-4)}`,
      category: 'Unstitched',
      subcategory: '3 Piece',
      collection: 'Summer Lawn 2026',
      fabric: 'Lawn',
      season: 'Summer',
      price: 8500,
      compareAtPrice: 9500,
      totalStock: 30,
      lowStockThreshold: 10,
      shortDescription: '',
      description: '',
      badge: 'New',
      images: ['/src/assets/images/product_lawn_suit_1790830622925.jpg'],
      thumbnail: '/src/assets/images/product_lawn_suit_1790830622925.jpg',
      rating: 5.0,
      reviewCount: 1,
      isPublished: true,
      isFeatured: false,
      tags: ['Lawn', 'Summer', '3 Piece'],
      variants: [
        {
          id: `var-${Date.now()}-un`,
          sku: `COM-LAWN-${Date.now().toString().slice(-4)}-UN`,
          size: 'Unstitched',
          color: 'Dusty Rose',
          colorCode: '#D681A7',
          price: 8500,
          stock: 30,
        },
      ],
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;
    const prodToSave: Product = {
      ...(editingProduct as Product),
      slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      id: editingProduct.id || `prod-${Date.now()}`,
      createdAt: editingProduct.createdAt || new Date().toISOString(),
    };
    await api.saveProduct(prodToSave, user?.name || 'Super Admin');
    setProductModalOpen(false);
    loadAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id, user?.name || 'Super Admin');
      loadAllData();
    }
  };

  // Handlers for Inventory
  const handleOpenAdjustInventory = (product: Product, variant: ProductVariant) => {
    setInventoryTarget({
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      currentStock: variant.stock,
    });
    setStockAdjustment(10);
    setAdjustmentReason('Restock');
    setInventoryModalOpen(true);
  };

  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryTarget) return;
    await api.adjustInventory({
      productId: inventoryTarget.productId,
      variantId: inventoryTarget.variantId,
      adjustment: Number(stockAdjustment),
      reason: adjustmentReason,
      adminUser: user?.name || 'Inventory Admin',
    });
    setInventoryModalOpen(false);
    loadAllData();
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await api.updateOrderStatus(orderId, {
      status,
      courierName: assignedCourier,
      trackingNumber: assignedTracking || undefined,
      adminName: user?.name || 'Order Manager',
    });
    if (selectedOrder && selectedOrder.id === orderId) {
      const refreshed = await api.getOrder(orderId);
      setSelectedOrder(refreshed);
    }
    loadAllData();
  };

  // Handlers for Coupons
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) return;
    await api.saveCoupon(newCoupon, user?.name || 'Marketing Admin');
    setCouponModalOpen(false);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 10,
      minimumOrder: 5000,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '2026-12-31',
      usageLimit: 1000,
      isActive: true,
      description: '',
    });
    loadAllData();
  };

  // Handlers for Reviews
  const handleReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    await api.updateReviewStatus(id, status, user?.name || 'Support Agent');
    loadAllData();
  };

  // Handlers for Returns
  const handleReturnStatus = async (id: string, status: ReturnRequest['status']) => {
    await api.updateReturnStatus(id, status, user?.name || 'Order Manager');
    loadAllData();
  };

  // Handlers for Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    await api.updateSettings(siteSettings, user?.name || 'Super Admin');
    alert('Site settings updated successfully!');
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-[#1F171E] text-[#FFF6F1] flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#361437] border-b border-[#4A1D4B] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <img
              src="/comfort_logo.png"
              alt="Comfort Logo"
              className="h-9 w-auto object-contain bg-white/95 rounded-lg p-1"
            />
            <span className="text-[10px] bg-[#D681A7] text-[#4A1D4B] font-bold px-2 py-0.5 rounded uppercase">
              Commerce Engine
            </span>
          </div>
          <div className="h-6 w-px bg-[#4A1D4B] hidden sm:block" />
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-[#D9C3A7] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Live Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Staff Role Switcher & Profile info */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-[#A98DA6]">Test Role:</span>
            <select
              value={user?.role || 'super_admin'}
              onChange={e => switchRole(e.target.value as any)}
              className="bg-[#4A1D4B] text-white border border-[#5E2B5F] rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="super_admin">Super Admin (Full Access)</option>
              <option value="inventory_manager">Inventory Manager</option>
              <option value="order_manager">Order & Logistics Manager</option>
              <option value="marketing_manager">Marketing & Discounts</option>
              <option value="support_agent">Support & Reviews Agent</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#4A1D4B] text-[#D681A7] flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-semibold leading-none">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-[#A98DA6] mt-0.5 capitalize">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#2A152B] border-r border-[#3D1E3E] p-4 flex md:flex-col justify-between overflow-x-auto md:overflow-x-visible shrink-0">
          <nav className="flex md:flex-col gap-1 w-full">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders & Logistics', icon: ShoppingBag, badge: orders.filter(o => o.orderStatus === 'order_placed').length },
              { id: 'products', label: 'Product Catalog', icon: Package, badge: products.length },
              { id: 'inventory', label: 'Inventory & Stock', icon: FileSpreadsheet, badge: products.filter(p => p.totalStock <= p.lowStockThreshold).length },
              { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
              { id: 'coupons', label: 'Discounts & Promos', icon: Tag },
              { id: 'reviews', label: 'Reviews Moderation', icon: Star, badge: reviews.filter(r => r.status === 'pending').length },
              { id: 'returns', label: 'Return Requests', icon: RotateCcw, badge: returns.filter(r => r.status === 'requested').length },
              { id: 'settings', label: 'Store Settings', icon: Settings },
              { id: 'logs', label: 'Audit Trail', icon: ShieldCheck },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 md:shrink ${
                    isActive
                      ? 'bg-[#4A1D4B] text-white shadow-xs'
                      : 'text-[#D9C3A7] hover:bg-[#361437] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#D681A7]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#5E2B5F] text-[#FFF6F1]">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Export CSV Shortcuts at bottom */}
          <div className="hidden md:block pt-6 border-t border-[#3D1E3E] space-y-2">
            <span className="text-[10px] text-[#A98DA6] uppercase font-bold tracking-wider block">One-Click CSV Exports</span>
            <div className="flex flex-col gap-1.5 text-xs">
              <a
                href="/api/admin/export/orders"
                download
                className="px-3 py-1.5 bg-[#361437] hover:bg-[#4A1D4B] text-[#D9C3A7] rounded-lg flex items-center justify-between transition-colors"
              >
                <span>Export Orders</span>
                <Download className="w-3.5 h-3.5" />
              </a>
              <a
                href="/api/admin/export/products"
                download
                className="px-3 py-1.5 bg-[#361437] hover:bg-[#4A1D4B] text-[#D9C3A7] rounded-lg flex items-center justify-between transition-colors"
              >
                <span>Export Products</span>
                <Download className="w-3.5 h-3.5" />
              </a>
              <a
                href="/api/admin/export/inventory"
                download
                className="px-3 py-1.5 bg-[#361437] hover:bg-[#4A1D4B] text-[#D9C3A7] rounded-lg flex items-center justify-between transition-colors"
              >
                <span>Export Inventory</span>
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </aside>

        {/* Admin Content Canvas */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {/* 1. Dashboard Overview */}
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Store Overview</h2>
                  <p className="text-xs text-[#A98DA6] mt-0.5">Real-time performance analytics across Pakistan</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#D9C3A7] bg-[#361437] px-3 py-1.5 rounded-xl border border-[#4A1D4B]">
                    Currency: Pakistani Rupee (PKR)
                  </span>
                </div>
              </div>

              {/* 8 Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#2A152B] rounded-2xl border border-[#3D1E3E] space-y-1">
                  <span className="text-xs text-[#A98DA6]">Gross Sales (All Time)</span>
                  <p className="font-mono text-2xl font-bold text-emerald-400">
                    Rs. {stats.totalSales.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Real orders verified
                  </span>
                </div>

                <div className="p-5 bg-[#2A152B] rounded-2xl border border-[#3D1E3E] space-y-1">
                  <span className="text-xs text-[#A98DA6]">Total Orders</span>
                  <p className="font-mono text-2xl font-bold text-[#FFF6F1]">{stats.totalOrders}</p>
                  <span className="text-[10px] text-[#A98DA6]">{stats.deliveredOrders} Delivered</span>
                </div>

                <div className="p-5 bg-[#2A152B] rounded-2xl border border-[#3D1E3E] space-y-1">
                  <span className="text-xs text-[#A98DA6]">Pending Verification</span>
                  <p className="font-mono text-2xl font-bold text-amber-400">{stats.pendingOrders}</p>
                  <span className="text-[10px] text-amber-400">Requires Courier Dispatch</span>
                </div>

                <div className="p-5 bg-[#2A152B] rounded-2xl border border-[#3D1E3E] space-y-1">
                  <span className="text-xs text-[#A98DA6]">Low Stock Alerts</span>
                  <p className="font-mono text-2xl font-bold text-rose-400">{stats.lowStockCount}</p>
                  <span className="text-[10px] text-rose-400">Below minimum threshold</span>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#3D1E3E]">
                  <h3 className="font-serif text-lg font-bold text-[#FFF6F1]">Recent Inbound Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#D681A7] hover:underline font-semibold">
                    Manage All Orders
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#A98DA6] border-b border-[#3D1E3E] pb-2">
                        <th className="pb-3 font-semibold">Order No</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">City</th>
                        <th className="pb-3 font-semibold">Payment</th>
                        <th className="pb-3 font-semibold">Total Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3D1E3E]/60">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-[#361437]/50">
                          <td className="py-3 font-mono font-bold text-[#D681A7]">{o.orderNumber}</td>
                          <td className="py-3 text-white font-medium">{o.customerName}</td>
                          <td className="py-3 text-[#D9C3A7]">{o.shippingAddress.city}</td>
                          <td className="py-3 text-[#A98DA6] uppercase">{o.paymentMethod.replace(/_/g, ' ')}</td>
                          <td className="py-3 font-mono font-bold text-emerald-400">Rs. {o.total.toLocaleString()}</td>
                          <td className="py-3">
                            <span className="px-2.5 py-1 bg-[#4A1D4B] text-[#FFF6F1] rounded-full text-[10px] uppercase font-semibold">
                              {o.orderStatus.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. Product Management */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Product Management</h2>
                  <p className="text-xs text-[#A98DA6]">{products.length} outfits listed across categories</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-5 py-2.5 bg-[#D681A7] hover:bg-[#c46e96] text-[#4A1D4B] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Outfit</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#A98DA6] border-b border-[#3D1E3E]">
                      <th className="pb-3 font-semibold">Garment Outfit</th>
                      <th className="pb-3 font-semibold">SKU</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Fabric</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Total Stock</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D1E3E]/60">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-[#361437]/50">
                        <td className="py-3 flex items-center gap-3">
                          <img
                            src={p.thumbnail}
                            alt=""
                            className="w-10 h-12 rounded object-cover bg-[#361437] shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-white">{p.name}</p>
                            <span className="text-[10px] text-[#A98DA6]">{p.collection}</span>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-[#D9C3A7]">{p.sku}</td>
                        <td className="py-3">{p.category}</td>
                        <td className="py-3 text-[#D681A7]">{p.fabric}</td>
                        <td className="py-3 font-mono font-bold text-emerald-400">Rs. {p.price.toLocaleString()}</td>
                        <td className="py-3 font-mono">
                          <span className={p.totalStock <= p.lowStockThreshold ? 'text-rose-400 font-bold' : 'text-white'}>
                            {p.totalStock} units
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductModalOpen(true);
                            }}
                            className="p-1.5 bg-[#361437] hover:bg-[#4A1D4B] text-white rounded-lg"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 bg-[#361437] hover:bg-rose-900 text-rose-300 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Inventory Management */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Inventory & Stock Control</h2>
                  <p className="text-xs text-[#A98DA6]">Real-time variant quantity control and restock logs</p>
                </div>
              </div>

              {/* Variant Stock Table */}
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 shadow-sm overflow-x-auto space-y-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#A98DA6] border-b border-[#3D1E3E]">
                      <th className="pb-3 font-semibold">Garment / Outfit</th>
                      <th className="pb-3 font-semibold">Variant SKU</th>
                      <th className="pb-3 font-semibold">Size</th>
                      <th className="pb-3 font-semibold">Color</th>
                      <th className="pb-3 font-semibold">Current Quantity</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D1E3E]/60">
                    {products.flatMap(p =>
                      p.variants.map(v => (
                        <tr key={v.id} className="hover:bg-[#361437]/50">
                          <td className="py-3 font-medium text-white">{p.name}</td>
                          <td className="py-3 font-mono text-[#D9C3A7]">{v.sku}</td>
                          <td className="py-3 font-semibold text-[#D681A7]">{v.size}</td>
                          <td className="py-3">{v.color}</td>
                          <td className="py-3 font-mono font-bold text-base text-white">{v.stock}</td>
                          <td className="py-3">
                            {v.stock === 0 ? (
                              <span className="px-2 py-0.5 bg-rose-950 text-rose-300 rounded text-[10px] font-bold">SOLD OUT</span>
                            ) : v.stock <= 8 ? (
                              <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded text-[10px] font-bold">LOW STOCK</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded text-[10px] font-bold">IN STOCK</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleOpenAdjustInventory(p, v)}
                              className="px-3 py-1 bg-[#4A1D4B] hover:bg-[#5E2B5F] text-white rounded-lg text-xs font-semibold"
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Inventory Change Logs */}
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#FFF6F1]">Inventory Adjustment Audit Logs</h3>
                <div className="divide-y divide-[#3D1E3E]/60 text-xs">
                  {inventoryLogs.slice(0, 8).map(log => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{log.productName}</span>
                        <span className="text-[#A98DA6] ml-2">({log.sku})</span>
                        <p className="text-[11px] text-[#D9C3A7] mt-0.5">
                          {log.reason} by {log.adminUser} · From {log.previousQuantity} to {log.newQuantity} ({log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment})
                        </p>
                      </div>
                      <span className="text-[11px] text-[#A98DA6] font-mono">
                        {new Date(log.date).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Orders Management */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Orders & Dispatch Fulfillment</h2>
                  <p className="text-xs text-[#A98DA6]">{orders.length} total orders recorded</p>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#A98DA6] border-b border-[#3D1E3E]">
                      <th className="pb-3 font-semibold">Order Number</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">City</th>
                      <th className="pb-3 font-semibold">Payment Mode</th>
                      <th className="pb-3 font-semibold">Total Amount</th>
                      <th className="pb-3 font-semibold">Fulfillment Status</th>
                      <th className="pb-3 font-semibold text-right">Inspect & Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D1E3E]/60">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-[#361437]/50">
                        <td className="py-3 font-mono font-bold text-[#D681A7]">{order.orderNumber}</td>
                        <td className="py-3 text-[#A98DA6]">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 text-white font-medium">{order.customerName}</td>
                        <td className="py-3 text-[#D9C3A7]">{order.shippingAddress.city}</td>
                        <td className="py-3 uppercase text-[#A98DA6]">{order.paymentMethod.replace(/_/g, ' ')}</td>
                        <td className="py-3 font-mono font-bold text-emerald-400">Rs. {order.total.toLocaleString()}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 bg-[#4A1D4B] text-white rounded-full text-[10px] uppercase font-semibold">
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setAssignedCourier(order.courierName || 'TCS Express');
                              setAssignedTracking(order.trackingNumber || '');
                              setOrderDrawerOpen(true);
                            }}
                            className="px-3 py-1.5 bg-[#4A1D4B] hover:bg-[#5E2B5F] text-white rounded-lg text-xs font-semibold"
                          >
                            Open Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Customer Directory</h2>
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#A98DA6] border-b border-[#3D1E3E]">
                      <th className="pb-3 font-semibold">Customer Name</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Phone</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Orders Count</th>
                      <th className="pb-3 font-semibold">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D1E3E]/60">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-[#361437]/50">
                        <td className="py-3 font-semibold text-white">{c.name}</td>
                        <td className="py-3 text-[#D9C3A7]">{c.email}</td>
                        <td className="py-3 text-[#A98DA6]">{c.phone || 'N/A'}</td>
                        <td className="py-3 capitalize">{c.role.replace('_', ' ')}</td>
                        <td className="py-3 font-mono">{c.totalOrders || 0}</td>
                        <td className="py-3 font-mono font-bold text-emerald-400">
                          Rs. {(c.totalSpent || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Coupons & Discounts */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Marketing Promo Codes</h2>
                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="px-4 py-2 bg-[#D681A7] text-[#4A1D4B] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {coupons.map(c => (
                  <div key={c.id} className="bg-[#2A152B] p-5 rounded-2xl border border-[#3D1E3E] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-base font-bold text-[#D681A7] bg-[#361437] px-3 py-1 rounded-md">
                        {c.code}
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded">
                        {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-xs text-[#D9C3A7]">{c.description}</p>
                    <div className="text-[11px] text-[#A98DA6] space-y-1">
                      <p>Type: <strong className="text-white capitalize">{c.type.replace('_', ' ')}</strong> ({c.value} {c.type === 'percentage' ? '%' : 'Rs'})</p>
                      <p>Min Order: Rs. {c.minimumOrder.toLocaleString()}</p>
                      <p>Used: {c.usedCount} / {c.usageLimit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Reviews Moderation */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Customer Reviews Moderation</h2>
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 space-y-4">
                <div className="divide-y divide-[#3D1E3E]/60 text-xs">
                  {reviews.map(rev => (
                    <div key={rev.id} className="py-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-sm">{rev.productName}</p>
                          <p className="text-[#A98DA6]">By {rev.customerName} ({rev.customerEmail}) · {rev.rating} Stars</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          rev.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-[#D9C3A7] italic">"{rev.comment}"</p>
                      <div className="flex gap-2 pt-2">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleReviewStatus(rev.id, 'approved')}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs"
                          >
                            Approve
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => handleReviewStatus(rev.id, 'rejected')}
                            className="px-3 py-1 bg-rose-900 text-white rounded-lg text-xs"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. Returns & Exchanges */}
          {activeTab === 'returns' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Return & Exchange Requests</h2>
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 space-y-4">
                {returns.length === 0 ? (
                  <p className="text-xs text-[#A98DA6]">No pending customer return requests.</p>
                ) : (
                  <div className="divide-y divide-[#3D1E3E]/60 text-xs">
                    {returns.map(ret => (
                      <div key={ret.id} className="py-4 space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <span className="font-mono font-bold text-white text-sm">{ret.orderNumber}</span>
                            <span className="text-[#A98DA6] ml-2">Customer: {ret.customerName} ({ret.customerPhone})</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 uppercase font-bold text-[10px]">
                            {ret.status}
                          </span>
                        </div>
                        <p className="text-[#D9C3A7]">Reason: <strong>{ret.reason}</strong></p>
                        <p className="text-white bg-[#361437] p-3 rounded-lg">{ret.description}</p>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleReturnStatus(ret.id, 'approved')}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs"
                          >
                            Approve & Schedule Pickup
                          </button>
                          <button
                            onClick={() => handleReturnStatus(ret.id, 'rejected')}
                            className="px-3 py-1 bg-rose-900 text-white rounded-lg text-xs"
                          >
                            Reject Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. Site Settings */}
          {activeTab === 'settings' && siteSettings && (
            <div className="space-y-6 animate-in fade-in max-w-3xl">
              <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Store Configuration & Policies</h2>
              <form onSubmit={handleSaveSettings} className="bg-[#2A152B] p-6 rounded-2xl border border-[#3D1E3E] space-y-6 text-xs">
                {/* Announcement Bar */}
                <div className="space-y-3">
                  <h4 className="font-serif text-base font-bold text-[#D681A7]">Top Announcement Bar</h4>
                  <div>
                    <label className="block text-[#A98DA6] mb-1">Banner Announcement Text</label>
                    <input
                      type="text"
                      value={siteSettings.announcementBar.text}
                      onChange={e => setSiteSettings({
                        ...siteSettings,
                        announcementBar: { ...siteSettings.announcementBar, text: e.target.value },
                      })}
                      className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Shipping Thresholds */}
                <div className="space-y-3 pt-4 border-t border-[#3D1E3E]">
                  <h4 className="font-serif text-base font-bold text-[#D681A7]">Shipping Rates (PKR)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A98DA6] mb-1">Free Shipping Order Minimum (Rs.)</label>
                      <input
                        type="number"
                        value={siteSettings.shipping.freeShippingThreshold}
                        onChange={e => setSiteSettings({
                          ...siteSettings,
                          shipping: { ...siteSettings.shipping, freeShippingThreshold: Number(e.target.value) },
                        })}
                        className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A98DA6] mb-1">Standard Shipping Flat Fee (Rs.)</label>
                      <input
                        type="number"
                        value={siteSettings.shipping.standardShippingFee}
                        onChange={e => setSiteSettings({
                          ...siteSettings,
                          shipping: { ...siteSettings.shipping, standardShippingFee: Number(e.target.value) },
                        })}
                        className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="space-y-3 pt-4 border-t border-[#3D1E3E]">
                  <h4 className="font-serif text-base font-bold text-[#D681A7]">Customer Support Channels</h4>
                  <div>
                    <label className="block text-[#A98DA6] mb-1">WhatsApp Business Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings.whatsappSupport.phoneNumber}
                      onChange={e => setSiteSettings({
                        ...siteSettings,
                        whatsappSupport: { ...siteSettings.whatsappSupport, phoneNumber: e.target.value },
                      })}
                      className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D681A7] text-[#4A1D4B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#c46e96]"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}

          {/* 10. Audit Trail */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Administrative Audit Trail</h2>
              <div className="bg-[#2A152B] rounded-2xl border border-[#3D1E3E] p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#A98DA6] border-b border-[#3D1E3E]">
                      <th className="pb-3 font-semibold">Timestamp</th>
                      <th className="pb-3 font-semibold">Admin User</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Action</th>
                      <th className="pb-3 font-semibold">Resource</th>
                      <th className="pb-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D1E3E]/60">
                    {auditLogs.map(l => (
                      <tr key={l.id} className="hover:bg-[#361437]/50">
                        <td className="py-2.5 font-mono text-[#A98DA6]">{new Date(l.timestamp).toLocaleString()}</td>
                        <td className="py-2.5 text-white font-medium">{l.adminName}</td>
                        <td className="py-2.5 capitalize">{l.adminRole}</td>
                        <td className="py-2.5 font-mono text-[#D681A7] font-semibold">{l.action}</td>
                        <td className="py-2.5">{l.resource}</td>
                        <td className="py-2.5 text-[#D9C3A7]">{l.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Create/Edit Modal */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#2A152B] border border-[#4A1D4B] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto text-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D1E3E]">
              <h3 className="font-serif text-xl font-bold text-[#FFF6F1]">
                {editingProduct.id ? 'Edit Garment Outfit' : 'Create New Ladies Garment'}
              </h3>
              <button onClick={() => setProductModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-[#A98DA6] mb-1 font-semibold">Outfit Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Pari Mahal Embroidered Velvet Suit"
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A98DA6] mb-1 font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A98DA6] mb-1 font-semibold">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl text-white"
                  >
                    <option value="Unstitched">Unstitched</option>
                    <option value="Stitched">Stitched</option>
                    <option value="Pret Wear">Pret Wear</option>
                    <option value="Winter Collection">Winter Collection</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#A98DA6] mb-1 font-semibold">Retail Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A98DA6] mb-1 font-semibold">Compare-at Price</label>
                  <input
                    type="number"
                    value={editingProduct.compareAtPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, compareAtPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#A98DA6] mb-1 font-semibold">Fabric</label>
                  <input
                    type="text"
                    value={editingProduct.fabric || 'Lawn'}
                    onChange={e => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A98DA6] mb-1 font-semibold">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-[#A98DA6] mb-1 font-semibold">Full Description & Sizing</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#3D1E3E]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-[#4A1D4B] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D681A7] text-[#4A1D4B] font-bold rounded-xl"
                >
                  Save Outfit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Inventory Modal */}
      {inventoryModalOpen && inventoryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#2A152B] border border-[#4A1D4B] rounded-2xl max-w-md w-full p-6 space-y-4 text-xs text-white">
            <h3 className="font-serif text-lg font-bold">Adjust Variant Stock</h3>
            <p className="text-[#A98DA6]">SKU: {inventoryTarget.sku} · Current: {inventoryTarget.currentStock} units</p>
            <form onSubmit={handleSaveInventory} className="space-y-4">
              <div>
                <label className="block text-[#A98DA6] mb-1">Adjustment Units (+ or -)</label>
                <input
                  type="number"
                  required
                  value={stockAdjustment}
                  onChange={e => setStockAdjustment(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg font-mono text-white"
                />
                <p className="text-[10px] text-[#D9C3A7] mt-1">
                  New stock will be: <strong>{Math.max(0, inventoryTarget.currentStock + Number(stockAdjustment))}</strong>
                </p>
              </div>

              <div>
                <label className="block text-[#A98DA6] mb-1">Reason for Adjustment</label>
                <select
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg text-white"
                >
                  <option value="Restock">Warehouse Restock / Inward Arrival</option>
                  <option value="Manual Audit">Physical Store Manual Audit</option>
                  <option value="Damage / Defect">Damage / Defect Isolation</option>
                  <option value="Order Cancellation Restock">Order Cancellation Restock</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInventoryModalOpen(false)}
                  className="px-4 py-2 border border-[#4A1D4B] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D681A7] text-[#4A1D4B] font-bold rounded-lg"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Drawer */}
      {orderDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-[#2A152B] w-full max-w-lg h-full p-6 sm:p-8 space-y-6 overflow-y-auto border-l border-[#4A1D4B] text-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D1E3E]">
              <div>
                <span className="text-[#A98DA6]">Order Inspection</span>
                <h3 className="font-serif text-xl font-bold text-[#D681A7] font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setOrderDrawerOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Quick status change buttons */}
            <div className="p-4 bg-[#361437] rounded-xl space-y-3">
              <span className="font-semibold text-white block">Advance Fulfillment Status:</span>
              <div className="flex flex-wrap gap-2">
                {(['processing', 'packed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                      selectedOrder.orderStatus === st
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#4A1D4B] text-[#D9C3A7] hover:text-white'
                    }`}
                  >
                    Mark {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Courier Tracking Dispatch Form */}
            <div className="p-4 bg-[#361437] rounded-xl space-y-3">
              <span className="font-semibold text-white block">Assign Courier & Tracking Code:</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Courier (TCS / Leopards)"
                  value={assignedCourier}
                  onChange={e => setAssignedCourier(e.target.value)}
                  className="px-3 py-2 bg-[#2A152B] border border-[#4A1D4B] rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Tracking Number"
                  value={assignedTracking}
                  onChange={e => setAssignedTracking(e.target.value)}
                  className="px-3 py-2 bg-[#2A152B] border border-[#4A1D4B] rounded-lg text-white font-mono"
                />
              </div>
              <button
                onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped')}
                className="w-full py-2 bg-[#4A1D4B] hover:bg-[#5E2B5F] text-white font-semibold rounded-lg"
              >
                Save Dispatch & Notify Customer
              </button>
            </div>

            {/* Items in order */}
            <div className="space-y-2">
              <span className="font-semibold text-[#A98DA6] uppercase tracking-wider block">Ordered Garments:</span>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-[#3D1E3E]">
                  <div>
                    <p className="font-semibold text-white">{it.productName}</p>
                    <p className="text-[#A98DA6]">{it.size} · {it.color} · Qty {it.quantity}</p>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    Rs. {(it.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping address details */}
            <div className="space-y-1.5 p-4 bg-[#361437] rounded-xl">
              <span className="font-semibold text-[#D681A7] block">Delivery Destination:</span>
              <p>{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
              <p>{selectedOrder.shippingAddress.street}</p>
              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}</p>
              <p className="text-[#A98DA6]">Payment: {selectedOrder.paymentMethod.toUpperCase()}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 border border-[#4A1D4B] text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#361437]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Creator Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#2A152B] border border-[#4A1D4B] rounded-2xl max-w-md w-full p-6 space-y-4 text-xs text-white">
            <h3 className="font-serif text-lg font-bold">Create Marketing Promo Code</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-[#A98DA6] mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EIDLUXE20"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg font-mono uppercase text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A98DA6] mb-1">Type</label>
                  <select
                    value={newCoupon.type}
                    onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (Rs)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A98DA6] mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.value}
                    onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A98DA6] mb-1">Minimum Order Amount (Rs.)</label>
                <input
                  type="number"
                  value={newCoupon.minimumOrder}
                  onChange={e => setNewCoupon({ ...newCoupon, minimumOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-[#A98DA6] mb-1">Description / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Special 10% discount on summer lawn"
                  value={newCoupon.description}
                  onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#361437] border border-[#4A1D4B] rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 border border-[#4A1D4B] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D681A7] text-[#4A1D4B] font-bold rounded-lg"
                >
                  Save Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
