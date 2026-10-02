import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Shipping',
      question: 'What are the delivery charges and timelines across Pakistan?',
      answer: 'We provide Free Express Shipping across all cities in Pakistan for orders above Rs. 5,000. For orders below this threshold, a flat shipping fee of Rs. 290 applies. Deliveries inside Lahore take 24–48 hours; major cities (Karachi, Islamabad, Rawalpindi, Faisalabad) take 2–3 business days via TCS or Leopards Courier.',
    },
    {
      category: 'Payments',
      question: 'Do you offer Cash on Delivery (COD)?',
      answer: 'Yes, Cash on Delivery is available for all nationwide orders up to Rs. 40,000. You pay the rider upon physical parcel delivery. For orders exceeding Rs. 40,000, advance bank transfer or online card payment is requested.',
    },
    {
      category: 'Returns',
      question: 'What is Comfort’s return and exchange policy?',
      answer: 'We offer an easy 7-day return and exchange policy from the date of delivery. If there is a sizing issue or fabric defect, you can request an exchange through your customer portal or by tracking your order. Garments must be unworn with all tags and original packaging intact.',
    },
    {
      category: 'Products',
      question: 'Are unstitched fabrics sufficient for larger sizes?',
      answer: 'Yes! All Comfort unstitched suits include generous fabric lengths (minimum 3.0 to 3.25 meters of shirt length and 2.5 meters for trousers) that easily accommodate sizes up to XL/XXL with bespoke flare and loose tailoring.',
    },
    {
      category: 'Orders',
      question: 'How do I track my order once placed?',
      answer: 'You will receive an instant SMS and email with your unique order number (e.g., COM-2026-001240). You can enter this order number anytime on our “Track Order” page alongside your phone number or email to view live courier status.',
    },
    {
      category: 'Sizing',
      question: 'How do I choose the correct pret size?',
      answer: 'Please refer to the size guide available on every product page. Our pret kurtis feature standard chest measurements: Small (38 inches), Medium (41 inches), and Large (44 inches). If you prefer a loose relaxed silhouette, we recommend choosing your regular size.',
    },
  ];

  const categories = ['All', 'Shipping', 'Payments', 'Returns', 'Products', 'Orders', 'Sizing'];

  const filteredFaqs = faqs.filter(f => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch =
      !searchQuery.trim() ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF6F1] mx-auto flex items-center justify-center text-[#4A1D4B]">
            <HelpCircle className="w-6 h-6 text-[#D681A7]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A1D4B]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#806B7D] max-w-md mx-auto">
            Everything you need to know regarding order tracking, deliveries, authentic fabrics, and returns.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <input
              type="text"
              placeholder="Search questions (e.g. COD, returns, sizing)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#E3D4C7] rounded-xl focus:border-[#4A1D4B] shadow-xs"
            />
            <Search className="w-4 h-4 text-[#A98DA6] absolute left-3 top-1/2 -translate-y-1/2 mt-1 pointer-events-none" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === c
                  ? 'bg-[#4A1D4B] text-[#FFF6F1]'
                  : 'bg-white text-[#5C4D58] hover:bg-[#FFF6F1] border border-[#EDE4DE]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="bg-white rounded-2xl border border-[#EDE4DE] divide-y divide-[#F0E6DF] shadow-xs overflow-hidden">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#806B7D]">
              No questions found matching your query.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div key={idx} className="p-5">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 text-xs font-semibold text-[#1F171E] hover:text-[#4A1D4B] transition-colors"
                >
                  <span className="text-sm font-serif font-bold text-[#4A1D4B]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A98DA6] transition-transform duration-200 shrink-0 ${
                      openIndex === idx ? 'rotate-180 text-[#4A1D4B]' : ''
                    }`}
                  />
                </button>

                {openIndex === idx && (
                  <p className="mt-3 text-xs text-[#5C4D58] leading-relaxed animate-in fade-in">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
