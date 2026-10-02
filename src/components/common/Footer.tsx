import React, { useState } from 'react';
import { Send, Check, ShieldCheck, RefreshCw, Truck, HeartHandshake } from 'lucide-react';
import { api } from '../../services/api';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenPolicyModal?: (policyName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicyModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    await api.subscribeNewsletter(email);
    setSubmitting(false);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#4A1D4B] text-[#FFF6F1] pt-16 pb-12 border-t border-[#361437]">
      {/* 4 Trust Signals Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#5E2B5F]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5E2B5F] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#D681A7]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold">Free Express Shipping</h4>
              <p className="text-xs text-[#D9C3A7] mt-0.5">All over Pakistan on orders above Rs. 5,000</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5E2B5F] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-[#D681A7]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold">Easy 7-Day Returns</h4>
              <p className="text-xs text-[#D9C3A7] mt-0.5">Hassle-free exchange & refund guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5E2B5F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#D681A7]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold">100% Genuine Fabrics</h4>
              <p className="text-xs text-[#D9C3A7] mt-0.5">Finest combed lawn, silk & micro velvet</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5E2B5F] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-[#D681A7]" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold">Dedicated Care</h4>
              <p className="text-xs text-[#D9C3A7] mt-0.5">WhatsApp & phone styling assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/comfort_logo.png"
                alt="Comfort Ladies Garments"
                className="h-14 sm:h-16 w-auto object-contain bg-white/95 rounded-xl p-1.5 shadow-sm"
              />
            </div>
            <p className="text-xs tracking-widest text-[#D9C3A7] uppercase font-semibold">
              Ladies Garments · Wear Your Comfort
            </p>
            <p className="text-xs text-[#E3D4C7] leading-relaxed max-w-sm">
              Comfort is a luxury Pakistani womenswear atelier dedicated to refined silhouettes, bespoke craftsmanship, and premium organic textiles. Elegance in every thread.
            </p>
            <div className="pt-2 text-xs text-[#D9C3A7] space-y-1">
              <p>📍 Gulberg Galleria, Main Boulevard Gulberg, Lahore</p>
              <p>📍 Dolmen Mall Clifton, Karachi</p>
              <p>📞 +92 42 3578 9000 | ✉️ care@comfort.pk</p>
            </div>
          </div>

          {/* Quick Collections */}
          <div>
            <h5 className="font-serif text-base font-semibold mb-4 text-[#FFF6F1]">Collections</h5>
            <ul className="space-y-2.5 text-xs text-[#E3D4C7]">
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Unstitched' })} className="hover:text-[#D681A7] transition-colors">
                  Unstitched 3-Piece
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Stitched' })} className="hover:text-[#D681A7] transition-colors">
                  Ready to Wear Pret
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Winter Collection' })} className="hover:text-[#D681A7] transition-colors">
                  Winter Velvet & Shawls
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Formal' })} className="hover:text-[#D681A7] transition-colors">
                  Festive Formals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', { category: 'Sale' })} className="hover:text-[#D681A7] transition-colors text-[#F8D7E3]">
                  Seasonal Sale (Up to 40% Off)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-serif text-base font-semibold mb-4 text-[#FFF6F1]">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-[#E3D4C7]">
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-[#D681A7] transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-[#D681A7] transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D681A7] transition-colors">
                  Contact Customer Support
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicyModal ? onOpenPolicyModal('shipping') : onNavigate('contact')} className="hover:text-[#D681A7] transition-colors">
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicyModal ? onOpenPolicyModal('returns') : onNavigate('contact')} className="hover:text-[#D681A7] transition-colors">
                  Returns & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicyModal ? onOpenPolicyModal('privacy') : onNavigate('contact')} className="hover:text-[#D681A7] transition-colors">
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h5 className="font-serif text-base font-semibold mb-2 text-[#FFF6F1]">Join the Circle</h5>
            <p className="text-xs text-[#E3D4C7] leading-relaxed mb-4">
              Get the latest arrivals, exclusive Eid previews, and styling inspiration directly to your inbox.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#5E2B5F] rounded-xl border border-[#D681A7]/40 flex items-center gap-2 text-xs text-[#F8D7E3]">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! Welcome to the Comfort inner circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#361437] text-white text-xs rounded-xl border border-[#5E2B5F] focus:outline-none focus:border-[#D681A7] placeholder:text-[#A98DA6]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-[#D681A7] hover:bg-[#c46e96] text-white rounded-lg transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#A98DA6]">
                  By subscribing, you agree to receive Comfort communications. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#5E2B5F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D9C3A7]">
          <p>© 2026 COMFORT. All rights reserved. Registered trademark of Comfort Garments Ltd.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] opacity-80">We Accept: Cash on Delivery · Meezan Bank · JazzCash · Visa / Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
