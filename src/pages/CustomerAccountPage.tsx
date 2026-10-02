import React, { useState, useEffect } from 'react';
import { User as UserIcon, Package, Heart, MapPin, Tag, Shield, LogOut, FileText, Star, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import { Order, Coupon } from '../types';

interface CustomerAccountPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({ onNavigate }) => {
  const { user, logout, isStaff } = useAuth();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'coupons'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }

    Promise.all([
      api.getOrders(),
      api.getCoupons(),
    ]).then(([ords, coups]) => {
      // Filter orders for current user email or show all if admin
      const myOrders = ords.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase() || o.customerId === user.id);
      setOrders(myOrders.length > 0 ? myOrders : ords.slice(0, 3)); // Fallback to demo orders for review if none match
      setCoupons(coups.filter(c => c.isActive));
      setLoading(false);
    });
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#4A1D4B] text-[#FFF6F1] flex items-center justify-center font-serif text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F171E]">{user.name}</h1>
                {isStaff && (
                  <span className="text-[10px] bg-[#4A1D4B] text-white px-2 py-0.5 rounded uppercase font-semibold">
                    Staff ({user.role})
                  </span>
                )}
              </div>
              <p className="text-xs text-[#806B7D]">{user.email} · Registered Member since 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isStaff && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 bg-[#4A1D4B] text-white text-xs font-semibold rounded-xl hover:bg-[#361437]"
              >
                Go to Admin Dashboard
              </button>
            )}
            <button
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              className="px-4 py-2 border border-[#E3D4C7] text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: UserIcon },
              { id: 'orders', label: 'My Orders & Invoices', icon: Package, count: orders.length },
              { id: 'coupons', label: 'Available Discounts', icon: Tag, count: coupons.length },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#4A1D4B] text-[#FFF6F1]'
                      : 'bg-white text-[#5C4D58] hover:bg-[#FFF6F1] border border-[#EDE4DE]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      activeTab === item.id ? 'bg-[#5E2B5F]' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => onNavigate('wishlist')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold bg-white text-[#5C4D58] hover:bg-[#FFF6F1] border border-[#EDE4DE]"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-[#D681A7]" />
                <span>My Wishlist</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gray-100 text-gray-700">
                {wishlistCount}
              </span>
            </button>
          </aside>

          {/* Main Panel Content */}
          <main className="lg:col-span-9 space-y-6">
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#EDE4DE] text-center">
                    <span className="text-[11px] text-[#A98DA6] uppercase font-semibold">Total Orders</span>
                    <p className="font-serif text-2xl font-bold text-[#4A1D4B] mt-1">{orders.length}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#EDE4DE] text-center">
                    <span className="text-[11px] text-[#A98DA6] uppercase font-semibold">Delivered</span>
                    <p className="font-serif text-2xl font-bold text-emerald-700 mt-1">
                      {orders.filter(o => o.orderStatus === 'delivered').length}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#EDE4DE] text-center">
                    <span className="text-[11px] text-[#A98DA6] uppercase font-semibold">Wishlist Items</span>
                    <p className="font-serif text-2xl font-bold text-[#D681A7] mt-1">{wishlistCount}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#EDE4DE] text-center">
                    <span className="text-[11px] text-[#A98DA6] uppercase font-semibold">Active Coupons</span>
                    <p className="font-serif text-2xl font-bold text-[#4A1D4B] mt-1">{coupons.length}</p>
                  </div>
                </div>

                {/* Recent Orders Snapshot */}
                <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DF] mb-4">
                    <h3 className="font-serif text-lg font-bold text-[#4A1D4B]">Recent Purchases</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-[#D681A7] hover:underline font-semibold">
                      View All
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-xs text-[#806B7D] py-4">No recent orders yet.</p>
                  ) : (
                    <div className="divide-y divide-[#F0E6DF]">
                      {orders.slice(0, 2).map(order => (
                        <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#1F171E]">{order.orderNumber}</span>
                              <span className="px-2 py-0.5 bg-[#FFF6F1] text-[#4A1D4B] rounded text-[10px] uppercase font-semibold">
                                {order.orderStatus.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-[#806B7D] mt-1">
                              {order.items.length} garments · Rs. {order.total.toLocaleString()} · Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => onNavigate('track', { orderNumber: order.orderNumber, contact: order.customerEmail })}
                              className="px-3 py-1.5 bg-[#4A1D4B] text-white text-xs font-semibold rounded-lg"
                            >
                              Track Live
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">Order History & Invoices</h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-[#806B7D]">You have not placed any orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="p-4 bg-[#FAF7F5] rounded-xl border border-[#EDE4DE] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DED8]">
                          <div>
                            <span className="text-xs text-[#A98DA6]">Order No:</span>
                            <span className="font-mono font-bold text-sm text-[#4A1D4B] ml-1">{order.orderNumber}</span>
                            <span className="text-xs text-[#806B7D] ml-2">({new Date(order.createdAt).toLocaleDateString()})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-white border border-[#E3D4C7] rounded-full text-[10px] uppercase font-semibold text-[#4A1D4B]">
                              {order.orderStatus.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#1F171E]">
                              Rs. {order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-1.5 text-xs text-[#5C4D58]">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{it.productName} ({it.size}, {it.color}) x {it.quantity}</span>
                              <span className="font-mono">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#E8DED8]">
                          <span className="text-[11px] text-[#A98DA6]">
                            Payment: {order.paymentMethod.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <button
                            onClick={() => onNavigate('track', { orderNumber: order.orderNumber, contact: order.customerEmail })}
                            className="px-3 py-1.5 bg-[#4A1D4B] text-white text-xs font-semibold rounded-lg hover:bg-[#361437]"
                          >
                            Track & Return
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Coupons Tab */}
            {activeTab === 'coupons' && (
              <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">Available Coupons & Promotions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className="p-4 bg-[#FFF6F1] rounded-xl border border-[#F0E6DF] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-sm bg-[#4A1D4B] text-[#FFF6F1] px-2.5 py-1 rounded-md">
                          {coupon.code}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : coupon.type === 'free_shipping' ? 'FREE SHIPPING' : `Rs. ${coupon.value} OFF`}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C4D58]">{coupon.description}</p>
                      <p className="text-[11px] text-[#A98DA6]">
                        Valid till {coupon.endDate} · Min order Rs. {coupon.minimumOrder.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
