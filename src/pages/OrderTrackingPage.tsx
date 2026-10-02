import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Circle, Truck, Clock, AlertCircle, RotateCcw, PackageCheck } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  initialContact?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
  initialContact = '',
  onNavigate,
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [contact, setContact] = useState(initialContact);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  // Return modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size Fitting Issue');
  const [returnDescription, setReturnDescription] = useState('');
  const [returnSuccess, setReturnSuccess] = useState(false);

  const fetchTrack = async (ordNum: string, cnt: string) => {
    if (!ordNum.trim() || !cnt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.trackOrder(ordNum.trim(), cnt.trim());
      setOrder(res);
    } catch (err: any) {
      setError(err.message || 'No matching order found. Please verify your order number and contact details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialContact) {
      fetchTrack(initialOrderNumber, initialContact);
    }
  }, [initialOrderNumber, initialContact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(orderNumber, contact);
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    try {
      await api.submitReturn({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        reason: returnReason,
        description: returnDescription,
      });
      setReturnSuccess(true);
      setTimeout(() => {
        setReturnSuccess(false);
        setReturnModalOpen(false);
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Error creating return request');
    }
  };

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A1D4B]">
            Track Your Order
          </h1>
          <p className="text-xs text-[#806B7D] max-w-md mx-auto">
            Enter your Comfort order number and registered email or phone to view live status and dispatch updates.
          </p>
        </div>

        {/* Tracking Lookup Box */}
        <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="text-xs font-semibold text-[#1F171E] block mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. COM-2026-001240"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B] uppercase font-mono"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="text-xs font-semibold text-[#1F171E] block mb-1">
                Email Address or Phone *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ayesha@example.com or +92 321..."
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#4A1D4B] hover:bg-[#361437] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 h-[42px]"
              >
                {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Help */}
          <div className="mt-4 pt-3 border-t border-[#F0E6DF] flex flex-wrap items-center justify-between text-[11px] text-[#A98DA6]">
            <span>Try demo order:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setOrderNumber('COM-2026-001240');
                  setContact('ayesha.malik@gmail.com');
                  fetchTrack('COM-2026-001240', 'ayesha.malik@gmail.com');
                }}
                className="text-[#4A1D4B] underline font-mono"
              >
                COM-2026-001240 (Delivered)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setOrderNumber('COM-2026-001245');
                  setContact('fatima.zahra@hotmail.com');
                  fetchTrack('COM-2026-001245', 'fatima.zahra@hotmail.com');
                }}
                className="text-[#4A1D4B] underline font-mono"
              >
                COM-2026-001245 (In Transit)
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 mb-8">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details Results */}
        {order && (
          <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E6DF]">
              <div>
                <span className="text-xs text-[#A98DA6]">Order Tracking for</span>
                <h3 className="font-serif text-2xl font-bold text-[#4A1D4B] font-mono">
                  {order.orderNumber}
                </h3>
                <p className="text-xs text-[#806B7D]">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} · Customer: {order.customerName}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs text-[#A98DA6] block">Status:</span>
                <span className="inline-block px-3 py-1 bg-[#FFF6F1] text-[#4A1D4B] border border-[#E8DED8] rounded-full text-xs font-semibold uppercase tracking-wider mt-0.5">
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
                {order.courierName && (
                  <p className="text-xs text-[#5C4D58] mt-1">
                    Courier: <strong>{order.courierName}</strong> ({order.trackingNumber})
                  </p>
                )}
              </div>
            </div>

            {/* 6-Stage Timeline */}
            <div>
              <h4 className="font-serif text-lg font-bold text-[#4A1D4B] mb-6">
                Shipment Progress Timeline
              </h4>
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DED8]">
                {order.timeline.map((step, idx) => {
                  const isDelivered = step.status === 'delivered';
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Status circle */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ring-4 ring-white ${
                          step.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-400 border border-gray-300'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h5 className={`text-xs font-semibold ${step.completed ? 'text-[#1F171E]' : 'text-gray-400'}`}>
                            {step.label}
                          </h5>
                          {step.timestamp && (
                            <span className="text-[11px] text-[#A98DA6]">
                              {new Date(step.timestamp).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#806B7D] mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Tracking CTA if available */}
            {order.trackingUrl && (
              <div className="p-4 bg-[#FFF6F1] rounded-xl border border-[#F0E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#4A1D4B]" />
                  <div>
                    <p className="text-xs font-semibold text-[#4A1D4B]">Live Courier Dispatch</p>
                    <p className="text-xs text-[#806B7D]">Tracking Code: {order.trackingNumber}</p>
                  </div>
                </div>
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg text-center"
                >
                  Open Courier Portal
                </a>
              </div>
            )}

            {/* Order Items & Address Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#F0E6DF] text-xs">
              <div>
                <h5 className="font-semibold text-[#1F171E] mb-2 uppercase tracking-wider">Garments in Package:</h5>
                <div className="space-y-2">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-[#F0E6DF]">
                      <span>{it.productName} ({it.size}, {it.color}) x {it.quantity}</span>
                      <span className="font-mono font-semibold">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-[#1F171E] mb-2 uppercase tracking-wider">Destination:</h5>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                <p className="mt-2 text-[#806B7D]">Payment: {order.paymentMethod.replace(/_/g, ' ').toUpperCase()} ({order.paymentStatus})</p>
                <p className="font-mono font-bold text-sm text-[#4A1D4B] mt-1">Total: Rs. {order.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Return / Exchange eligibility button if delivered */}
            {order.orderStatus === 'delivered' && (
              <div className="pt-4 border-t border-[#F0E6DF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#806B7D]">
                  Need a size exchange or return? You are eligible within 7 days of delivery.
                </p>
                <button
                  onClick={() => setReturnModalOpen(true)}
                  className="px-4 py-2 border border-[#4A1D4B] text-[#4A1D4B] hover:bg-[#4A1D4B] hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Return / Exchange</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Return Request Modal */}
        {returnModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-[#EDE4DE]">
              <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">Return / Exchange Request</h3>
              <p className="text-xs text-[#806B7D]">
                For Order <strong>{order?.orderNumber}</strong>. Our team will arrange courier pickup from your address.
              </p>

              {returnSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-emerald-600" />
                  <span>Your return request has been registered! Support agent will call to schedule courier pickup.</span>
                </div>
              ) : (
                <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Reason for Return / Exchange *</label>
                    <select
                      value={returnReason}
                      onChange={e => setReturnReason(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-lg"
                    >
                      <option value="Size Fitting Issue">Size Fitting Issue (Exchange Required)</option>
                      <option value="Fabric / Color Preference">Fabric / Color Different than Expected</option>
                      <option value="Defect or Damage">Defect or Damage Observed</option>
                      <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Detailed Explanation *</label>
                    <textarea
                      rows={3}
                      required
                      value={returnDescription}
                      onChange={e => setReturnDescription(e.target.value)}
                      placeholder="Please mention the desired exchange size or refund preference..."
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#E3D4C7] rounded-lg"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setReturnModalOpen(false)}
                      className="py-2.5 px-4 border border-[#E3D4C7] text-gray-700 rounded-xl font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#4A1D4B] text-white rounded-xl font-semibold uppercase tracking-wider"
                    >
                      Submit Return Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
