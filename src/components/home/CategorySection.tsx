import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategorySectionProps {
  onSelectCategory: (category: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      title: 'UNSTITCHED',
      subtitle: 'Create Your Own Style',
      category: 'Unstitched',
      image: '/src/assets/images/category_unstitched_lawn_1790830562546.jpg',
      count: '3-Piece & 2-Piece',
    },
    {
      title: 'STITCHED',
      subtitle: 'Ready to Wear',
      category: 'Stitched',
      image: '/src/assets/images/category_stitched_pret_1790830575163.jpg',
      count: 'Flawlessly Tailored',
    },
    {
      title: 'PRET WEAR',
      subtitle: 'Everyday Elegance',
      category: 'Pret Wear',
      image: '/src/assets/images/product_pret_kurti_1790830651076.jpg',
      count: 'Kurtis & Sets',
    },
    {
      title: 'WINTER COLLECTION',
      subtitle: 'Stay Warm, Stay Stylish',
      category: 'Winter Collection',
      image: '/src/assets/images/category_winter_velvet_1790830588259.jpg',
      count: 'Micro Velvet & Shawls',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8DED8]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A98DA6]">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A1D4B] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#4A1D4B] hover:text-[#D681A7] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All Collections</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.title}
              onClick={() => onSelectCategory(cat.category)}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Scrim Overlay per frontend design rules */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A1D4B]/90 via-[#4A1D4B]/30 to-transparent transition-opacity duration-300 group-hover:from-[#4A1D4B]/95" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-medium tracking-widest uppercase text-[#F8D7E3] mb-1">
                  {cat.count}
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-wide text-white group-hover:text-[#F8D7E3] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#E3D4C7] mt-1 font-light">
                  {cat.subtitle}
                </p>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white">
                  <span>Discover Pieces</span>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#D681A7] transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
