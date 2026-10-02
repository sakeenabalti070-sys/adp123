import React, { useState } from 'react';
import { Check, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Printer, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order, PaymentMethod } from '../types';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, subtotal, discount, shippingFee, total, couponCode, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Lahore');
  const [province, setProvince] = useState(user?.addresses?.[0]?.province || 'Punjab');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '54000');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'urgent'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F5]">
        <h2 className="font-serif text-2xl font-bold text-[#4A1D4B] mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-[#806B7D] mb-6">Please select garments to proceed to checkout.</p>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-6 py-3 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      const orderPayload = {
        customerId: user?.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName,
          phone,
          street,
          city,
          province,
          postalCode,
        },
        deliveryNotes,
        items,
        paymentMethod,
        couponCode: couponCode || undefined,
      };

      const order = await api.createOrder(orderPayload);
      setPlacedOrder(order);
      clearCart();
      setStep(6);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating order. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Step 6: Confirmation View
  if (step === 6 && placedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#EDE4DE] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3 pb-6 border-b border-[#F0E6DF]">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#4A1D4B]">Order Confirmed</h1>
            <p className="text-xs text-[#5C4D58]">
              Thank you, <strong>{placedOrder.customerName}</strong>! We have received your order and sent a confirmation to <strong>{placedOrder.customerEmail}</strong>.
            </p>
            <div className="inline-block px-4 py-2 bg-[#FFF6F1] border border-[#F0E6DF] rounded-xl text-sm font-mono font-bold text-[#4A1D4B]">
              Order Number: {placedOrder.orderNumber}
            </div>
          </div>

          {/* Order Snapshot */}
          <div className="space-y-4 text-xs text-[#5C4D58]">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#F0E6DF]">
              <div>
                <span className="text-[#A98DA6] block">Shipping Address:</span>
                <p className="font-medium text-[#1F171E] mt-0.5">
                  {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.province}
                </p>
                <p>Phone: {placedOrder.customerPhone}</p>
              </div>
              <div>
                <span className="text-[#A98DA6] block">Payment Method:</span>
                <p className="font-medium text-[#1F171E] capitalize mt-0.5">
                  {placedOrder.paymentMethod.replace(/_/g, ' ')}
                </p>
                <span className="text-emerald-700 font-semibold block mt-1">Status: {placedOrder.paymentStatus.toUpperCase()}</span>
              </div>
            </div>

            {/* Purchased Items */}
            <div className="space-y-3">
              <span className="text-[#A98DA6] block uppercase tracking-wider font-semibold">Ordered Outfits:</span>
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-[#F0E6DF]">
                  <div>
                    <p className="font-semibold text-[#1F171E]">{it.productName}</p>
                    <p className="text-[#806B7D]">Size: {it.size} · Color: {it.color} · Qty: {it.quantity}</p>
                  </div>
                  <span className="font-mono font-semibold text-[#4A1D4B]">
                    Rs. {(it.price * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="pt-2 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {placedOrder.subtotal.toLocaleString()}</span>
              </div>
              {placedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-Rs. {placedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{placedOrder.shippingFee === 0 ? 'FREE' : `Rs. ${placedOrder.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#4A1D4B] pt-2 border-t border-[#F0E6DF]">
                <span>Total Amount:</span>
                <span>Rs. {placedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {placedOrder.paymentMethod === 'bank_transfer' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-900">
                <p className="font-bold">Meezan Bank Transfer Instructions:</p>
                <p>Account Title: Comfort Garments Private Limited</p>
                <p>IBAN: PK64MEZN0001089201948201</p>
                <p>Branch: Gulberg Galleria, Lahore</p>
                <p className="text-[11px]">Please WhatsApp your transfer screenshot to +92 300 1234567 along with order number <strong>{placedOrder.orderNumber}</strong>.</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#F0E6DF]">
            <button
              onClick={() => onNavigate('track', { orderNumber: placedOrder.orderNumber, contact: placedOrder.customerEmail })}
              className="flex-1 py-3 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl text-center hover:bg-[#361437]"
            >
              Track This Order Live
            </button>
            <button
              onClick={handlePrint}
              className="py-3 px-4 border border-[#E3D4C7] text-[#4A1D4B] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="py-3 px-4 border border-[#4A1D4B] text-[#4A1D4B] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#FFF6F1]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-[#4A1D4B] mb-2 text-center">
          Secure Luxury Checkout
        </h1>
        <p className="text-xs text-center text-[#806B7D] mb-8">
          Express Nationwide Delivery · Easy 7-Day Returns
        </p>

        {/* Steps indicator */}
        <div className="max-w-xl mx-auto flex items-center justify-between mb-10 px-4">
          {['Details', 'Shipping', 'Delivery', 'Payment', 'Review'].map((stepLabel, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={stepLabel} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#4A1D4B] text-white'
                      : 'bg-white border border-[#E3D4C7] text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span className={`text-xs hidden md:inline font-medium ${isCurrent ? 'text-[#4A1D4B]' : 'text-gray-400'}`}>
                  {stepLabel}
                </span>
                {idx < 4 && <div className="w-6 sm:w-10 h-px bg-[#E3D4C7] mx-1" />}
              </div>
            );
          })}
        </div>

        {errorMessage && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Form Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs">
            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">1. Customer Information</h3>
                <div>
                  <label className="text-xs font-medium text-[#1F171E] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Malik"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1F171E] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ayesha@example.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1F171E] block mb-1">Phone Number (Pakistan) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!fullName || !email || !phone}
                  onClick={() => setStep(2)}
                  className="mt-6 w-full py-3.5 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437] disabled:opacity-50"
                >
                  Continue to Shipping Address
                </button>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">2. Shipping Address</h3>
                <div>
                  <label className="text-xs font-medium text-[#1F171E] block mb-1">Street Address / House / Flat *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="House 42, Street 8, Phase 5 DHA"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1F171E] block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Lahore / Karachi"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#1F171E] block mb-1">Province *</label>
                    <select
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad Capital">Islamabad Capital</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#1F171E] block mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="54000"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1F171E] block mb-1">Delivery Instructions / Landmarks (Optional)</label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={e => setDeliveryNotes(e.target.value)}
                    placeholder="Near round-about, deliver after 2 PM, etc."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-5 border border-[#E3D4C7] text-[#4A1D4B] text-xs font-semibold uppercase tracking-wider rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!street || !city}
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437] disabled:opacity-50"
                  >
                    Continue to Delivery Method
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Delivery Method */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">3. Delivery Method</h3>
                <div className="space-y-3">
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      deliveryMethod === 'standard' ? 'border-[#4A1D4B] bg-[#FFF6F1]' : 'border-[#EDE4DE] bg-[#FAF7F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#4A1D4B]" />
                      <div>
                        <p className="text-xs font-semibold text-[#1F171E]">Standard Express (TCS / Leopards)</p>
                        <p className="text-[11px] text-[#806B7D]">2 - 4 business days nationwide</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#4A1D4B]">
                      {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-5 border border-[#E3D4C7] text-[#4A1D4B] text-xs font-semibold uppercase tracking-wider rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex-1 py-3 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437]"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Payment Method */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">4. Payment Method</h3>
                <div className="space-y-3">
                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'cash_on_delivery' ? 'border-[#4A1D4B] bg-[#FFF6F1]' : 'border-[#EDE4DE] bg-[#FAF7F5]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#4A1D4B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1F171E]">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-[#806B7D]">
                        Pay in cash upon physical receipt of package from the courier rider.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'bank_transfer' ? 'border-[#4A1D4B] bg-[#FFF6F1]' : 'border-[#EDE4DE] bg-[#FAF7F5]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#4A1D4B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1F171E]">Direct Bank Transfer (Meezan Bank)</p>
                      <p className="text-[11px] text-[#806B7D]">
                        Transfer directly to Comfort IBAN. Your order will be confirmed upon receiving receipt.
                      </p>
                    </div>
                  </label>

                  {/* JazzCash / Easypaisa */}
                  <label
                    onClick={() => setPaymentMethod('jazzcash_easypaisa')}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'jazzcash_easypaisa' ? 'border-[#4A1D4B] bg-[#FFF6F1]' : 'border-[#EDE4DE] bg-[#FAF7F5]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#4A1D4B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1F171E]">JazzCash / Easypaisa Mobile Wallet</p>
                      <p className="text-[11px] text-[#806B7D]">
                        Instant mobile account debit or voucher payment.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="py-3 px-5 border border-[#E3D4C7] text-[#4A1D4B] text-xs font-semibold uppercase tracking-wider rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="flex-1 py-3 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437]"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Order Review & Final Placement */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">5. Review & Confirm Order</h3>
                <div className="p-4 bg-[#FAF7F5] rounded-xl border border-[#EDE4DE] space-y-2 text-xs text-[#5C4D58]">
                  <p><strong>Customer:</strong> {fullName} ({phone})</p>
                  <p><strong>Delivery Address:</strong> {street}, {city}, {province}</p>
                  <p><strong>Payment Mode:</strong> <span className="capitalize">{paymentMethod.replace(/_/g, ' ')}</span></p>
                </div>

                <p className="text-xs text-[#806B7D]">
                  By placing this order, you confirm acceptance of Comfort Garments' 7-day exchange policy and terms.
                </p>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="py-3 px-5 border border-[#E3D4C7] text-[#4A1D4B] text-xs font-semibold uppercase tracking-wider rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handlePlaceOrder}
                    className="flex-1 py-4 bg-[#4A1D4B] hover:bg-[#361437] text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>{submitting ? 'Placing Order...' : `Place Order (Rs. ${total.toLocaleString()})`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EDE4DE] p-6 shadow-xs h-fit space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#4A1D4B] pb-3 border-b border-[#F0E6DF]">
              Order Summary ({items.length} garments)
            </h3>

            {/* Item list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-[#F0E6DF]">
              {items.map(it => (
                <div key={it.id} className="pt-2 flex gap-3 text-xs">
                  <img
                    src={it.image}
                    alt={it.productName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-16 object-cover object-top rounded-lg bg-[#FAF7F5]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-[#1F171E] line-clamp-1">{it.productName}</p>
                      <p className="text-[#806B7D]">
                        {it.size} · {it.color} · Qty: {it.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-semibold text-[#4A1D4B]">
                      Rs. {(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="pt-4 border-t border-[#F0E6DF] space-y-1.5 text-xs font-mono text-[#5C4D58]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-[#1F171E]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount:</span>
                  <span>-Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-sans">FREE</strong> : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#4A1D4B] pt-2 border-t border-[#F0E6DF]">
                <span>Total Due:</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust note */}
            <div className="pt-3 border-t border-[#F0E6DF] flex items-center gap-2 text-xs text-[#806B7D]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe & Encrypted 256-bit Connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
