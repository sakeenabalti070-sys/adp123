import React from 'react';
import { Sparkles, Heart, ShieldCheck, Gem } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FAF7F5] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#4A1D4B]">
            <Sparkles className="w-3.5 h-3.5 text-[#D681A7]" />
            <span>The Heritage Story</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#4A1D4B] leading-tight">
            “Wear Your Comfort”
          </h1>
          <p className="text-sm sm:text-base text-[#5C4D58] leading-relaxed">
            Comfort was founded on a simple truth: true luxury is effortless ease. We craft timeless garments that empower Pakistani women to look breathtaking without compromising on gentle softness.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl aspect-16/9 bg-[#F4EFEB]">
          <img
            src="/src/assets/images/hero_comfort_luxury_fashion_1790830549277.jpg"
            alt="Comfort Luxury Atelier"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#EDE4DE] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF6F1] flex items-center justify-center text-[#4A1D4B]">
              <Gem className="w-6 h-6 text-[#D681A7]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">100% Purity in Every Yarn</h3>
            <p className="text-xs text-[#5C4D58] leading-relaxed">
              We weave only from fine-combed natural fibers—long-staple 80/80 Egyptian and Pakistani lawn, pure crinkle silk chiffon, and genuine micro velvet with zero synthetic harshness.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#EDE4DE] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF6F1] flex items-center justify-center text-[#4A1D4B]">
              <Heart className="w-6 h-6 text-[#D681A7]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">Honoring Artisans</h3>
            <p className="text-xs text-[#5C4D58] leading-relaxed">
              From Multani embroidery to Kashmiri aari threadwork and hand-carved block prints, every ensemble celebrates master craftswomen and indigenous heritage.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#EDE4DE] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF6F1] flex items-center justify-center text-[#4A1D4B]">
              <ShieldCheck className="w-6 h-6 text-[#D681A7]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#4A1D4B]">Flawless Confidence</h3>
            <p className="text-xs text-[#5C4D58] leading-relaxed">
              Our silhouettes are tested on diverse body structures to ensure generous drape, modesty, and breathable ease all day long.
            </p>
          </div>
        </div>

        {/* Studios */}
        <div className="p-8 sm:p-12 bg-[#4A1D4B] rounded-3xl text-white space-y-6">
          <h2 className="font-serif text-3xl font-bold text-[#FFF6F1]">Visit Our Flagship Studios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-[#E3D4C7]">
            <div className="space-y-1.5">
              <h4 className="font-serif text-lg font-semibold text-white">Lahore Flagship</h4>
              <p>Shop 14, Ground Floor, Gulberg Galleria Mall</p>
              <p>Main Boulevard Gulberg, Lahore</p>
              <p className="text-[#D681A7]">Hours: 11:00 AM – 10:00 PM (Daily)</p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-serif text-lg font-semibold text-white">Karachi Studio</h4>
              <p>Level 2, Fashion Avenue, Dolmen Mall Clifton</p>
              <p>Marine Drive, Block 4 Clifton, Karachi</p>
              <p className="text-[#D681A7]">Hours: 11:30 AM – 11:00 PM (Daily)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
