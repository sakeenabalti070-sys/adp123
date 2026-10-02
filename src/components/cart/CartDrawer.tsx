import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  onNavigate: (page: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    freeShippingRemaining,
    coupon,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setApplying(true);
    setErrorMsg('');
    const res = await applyCoupon(inputCode.trim());
    setApplying(false);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setInputCode('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsOpen(false);
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-[#E8DED8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4A1D4B]" />
              <h2 className="font-serif text-xl font-bold text-[#4A1D4B]">Your Wardrobe Bag</h2>
              <span className="text-xs bg-[#4A1D4B] text-[#FFF6F1] px-2 py-0.5 rounded-full font-mono">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-gray-500 hover:text-[#4A1D4B] hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FFF6F1] px-6 py-3 border-b border-[#F0E6DF]">
            <div className="flex items-center justify-between text-xs font-medium text-[#4A1D4B] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#D681A7]" />
                {freeShippingRemaining > 0 ? (
                  <>Add <strong className="font-mono">Rs. {freeShippingRemaining.toLocaleString()}</strong> more for FREE Nationwide Shipping</>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Congratulations! You unlocked Free Shipping
                  </span>
                )}
              </span>
              <span className="font-mono">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E8DED8] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#4A1D4B] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF6F1] flex items-center justify-center text-[#A98DA6]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1F171E]">Your bag is currently empty</h3>
                  <p className="text-xs text-[#806B7D] max-w-xs mt-1">
                    Discover our new arrivals in lawn, velvet, and ready-to-wear kurtis designed for effortless elegance.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('catalog');
                  }}
                  className="px-6 py-2.5 bg-[#4A1D4B] text-[#FFF6F1] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-[#EDE4DE] shadow-2xs transition-all hover:border-[#D681A7]/40"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover object-top rounded-lg bg-[#F4EFEB] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-[#1F171E] line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#A98DA6] hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#806B7D] mt-0.5">
                        {item.size} · {item.color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0E6DF]">
                      <div className="flex items-center border border-[#E3D4C7] rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#4A1D4B] hover:bg-[#FFF6F1]"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#4A1D4B] hover:bg-[#FFF6F1]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#4A1D4B] font-mono tabular-nums">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8DED8] space-y-4">
              {/* Promo Code Input */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{coupon.code}</strong> applied (-Rs. {discount.toLocaleString()})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. COMFORT10)"
                      value={inputCode}
                      onChange={e => setInputCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-lg focus:outline-none focus:border-[#4A1D4B] uppercase"
                    />
                    <button
                      type="submit"
                      disabled={applying || !inputCode.trim()}
                      className="px-4 py-2 bg-[#4A1D4B] text-[#FFF6F1] text-xs font-medium rounded-lg hover:bg-[#361437] transition-colors disabled:opacity-50"
                    >
                      {applying ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                )}
                {errorMsg && <p className="text-[11px] text-red-600 mt-1">{errorMsg}</p>}
                {couponMessage && !errorMsg && !coupon && (
                  <p className="text-[11px] text-amber-700 mt-1">{couponMessage}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5C4D58]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#1F171E]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-medium">FREE</span>
                    ) : (
                      `Rs. ${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#4A1D4B] pt-2 border-t border-[#F0E6DF]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#4A1D4B] hover:bg-[#361437] text-[#FFF6F1] font-semibold text-xs uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#806B7D]">
                Cash on Delivery & Bank Transfer available · 100% Secure
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
