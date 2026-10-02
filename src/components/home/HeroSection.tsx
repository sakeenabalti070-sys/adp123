import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onShopNow: () => void;
  onExploreCategory: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow, onExploreCategory }) => {
  return (
    <section className="relative bg-[#FFF6F1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 z-10">
            {/* Lead Tag without pill slop */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#4A1D4B]">
              <Sparkles className="w-3.5 h-3.5 text-[#D681A7]" />
              <span>Spring / Summer 2026 Edition</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#4A1D4B] leading-[1.12] text-balance">
              Style Meets <span className="italic font-medium">COMFORT</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C4D58] font-normal leading-relaxed max-w-lg">
              Premium Ladies Garments for Every Mood, Every Moment. Handcrafted luxury lawn, regal micro velvet, and contemporary ready-to-wear silhouettes tailored for graceful confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="px-8 py-4 bg-[#4A1D4B] hover:bg-[#361437] text-[#FFF6F1] text-xs font-semibold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Shop New Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onExploreCategory('Unstitched')}
                className="px-6 py-4 border border-[#4A1D4B] text-[#4A1D4B] hover:bg-[#4A1D4B] hover:text-[#FFF6F1] text-xs font-semibold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                Explore Unstitched
              </button>
            </div>

            {/* Micro proof line */}
            <div className="pt-6 border-t border-[#E8DED8]/80 flex items-center gap-6 text-xs text-[#806B7D]">
              <div>
                <span className="font-serif text-lg font-bold text-[#4A1D4B] block leading-none">100%</span>
                <span>Pure Combed Fabric</span>
              </div>
              <div className="h-7 w-px bg-[#E8DED8]" />
              <div>
                <span className="font-serif text-lg font-bold text-[#4A1D4B] block leading-none">FREE</span>
                <span>Nationwide Express</span>
              </div>
              <div className="h-7 w-px bg-[#E8DED8]" />
              <div>
                <span className="font-serif text-lg font-bold text-[#4A1D4B] block leading-none">7 Days</span>
                <span>Hassle-Free Exchange</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            {/* Background luxury frame accent */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#D681A7]/20 via-[#F8D7E3]/30 to-transparent rounded-3xl -rotate-1 transform blur-xs" />

            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 bg-[#F4EFEB]">
              <img
                src="/src/assets/images/hero_comfort_luxury_fashion_1790830549277.jpg"
                alt="Comfort Luxury Ladies Garments Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />

              {/* Atmospheric overlay with visual copy */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A1D4B]/70 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-1">
                  <span className="text-[11px] tracking-widest uppercase font-semibold text-[#F8D7E3]">
                    The Heritage Atelier
                  </span>
                  <p className="font-serif text-2xl sm:text-3xl font-light italic">
                    “Feel Beautiful Everyday”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
