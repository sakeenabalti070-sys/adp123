import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';

interface SpecialOfferSectionProps {
  onShopSale: () => void;
}

export const SpecialOfferSection: React.FC<SpecialOfferSectionProps> = ({ onShopSale }) => {
  return (
    <section className="py-12 md:py-20 bg-[#FAF7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#4A1D4B] min-h-[380px] flex items-center">
          {/* Background image with plum gradient overlay */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/banner_special_offer_campaign_1790830607101.jpg"
              alt="Comfort Seasonal Special Offer"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-right opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D4B] via-[#4A1D4B]/90 to-transparent" />
          </div>

          {/* Offer Content */}
          <div className="relative z-10 p-8 sm:p-14 max-w-xl text-white space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#F8D7E3]">
              <Tag className="w-3.5 h-3.5 text-[#D681A7]" />
              <span>Special Mid-Season Offer</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#FFF6F1] leading-none">
              UP TO 40% OFF
            </h2>

            <p className="text-sm sm:text-base text-[#E3D4C7] leading-relaxed">
              On Selected Luxury Styles | Limited Time Only. Experience signature embroidered lawn and festive pret wear crafted with comforting softness.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={onShopSale}
                className="px-8 py-3.5 bg-[#D681A7] hover:bg-[#c46e96] text-[#4A1D4B] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <span>Shop the Sale</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-[#F8D7E3] font-mono">
                Use code <strong>COMFORT10</strong> for extra 10% off
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
