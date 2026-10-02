import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Check } from 'lucide-react';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order & Sizing Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitting(true);
    try {
      await api.submitContact({ name, email, phone, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A1D4B]">
            Get in Touch
          </h1>
          <p className="text-xs text-[#806B7D] max-w-md mx-auto">
            Have questions regarding sizing, custom stitching, or order status? Our client care concierge is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left contact info */}
          <div className="md:col-span-5 bg-[#4A1D4B] text-white rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold">Client Care Concierge</h3>
                <p className="text-xs text-[#E3D4C7] mt-1">Available Monday to Saturday, 9 AM – 9 PM PKT</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D681A7] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A98DA6] block">Phone Assistance</span>
                    <a href="tel:+924235789000" className="hover:underline">+92 42 3578 9000</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A98DA6] block">Instant WhatsApp</span>
                    <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="hover:underline text-emerald-300">
                      +92 300 1234567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#D681A7] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A98DA6] block">Email Inquiries</span>
                    <a href="mailto:care@comfort.pk" className="hover:underline">care@comfort.pk</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D681A7] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#A98DA6] block">Atelier Headquarters</span>
                    <p>Gulberg Galleria, Main Boulevard Gulberg, Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#361437] rounded-2xl text-[11px] text-[#D9C3A7] space-y-1">
              <p className="font-semibold text-white">Need Live Tracking?</p>
              <p>You can track your parcel dispatch status directly on our tracking portal with zero login required.</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-[#EDE4DE] p-8 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#4A1D4B] mb-4">Send a Message</h3>

            {success ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Message Received!</span>
                </div>
                <p>Thank you for reaching out. A Comfort concierge specialist will respond within 24 hours.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-xs font-semibold text-emerald-900 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#1F171E] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sara Ahmed"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-[#1F171E] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="sara@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#1F171E] block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+92 321 0000000"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#1F171E] block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl"
                  >
                    <option value="Order & Sizing Inquiry">Order & Sizing Inquiry</option>
                    <option value="Dispatch / Tracking Query">Dispatch / Tracking Query</option>
                    <option value="Exchange or Return Assistance">Exchange or Return Assistance</option>
                    <option value="Corporate / Bulk Order">Corporate / Bulk Order</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1F171E] block mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="How can we assist your wardrobe experience today?..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#E3D4C7] rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#4A1D4B] hover:bg-[#361437] text-white font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
