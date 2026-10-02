import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';

interface CatalogPageProps {
  products: Product[];
  initialCategory?: string;
  initialSearch?: string;
  initialFabric?: string;
  initialBadge?: string;
  onOpenQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  initialCategory,
  initialSearch,
  initialFabric,
  initialBadge,
  onOpenQuickView,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedFabric, setSelectedFabric] = useState<string>(initialFabric || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['All', 'Unstitched', 'Stitched', 'Pret Wear', 'Winter Collection', 'Formal', 'Sale'];
  const fabrics = ['All', 'Lawn', 'Cotton', 'Chiffon', 'Velvet', 'Linen'];

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'All') {
          if (selectedCategory === 'Sale') {
            if (p.badge !== 'Sale' && (!p.compareAtPrice || p.compareAtPrice <= p.price)) {
              return false;
            }
          } else if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }
        // Fabric filter
        if (selectedFabric !== 'All' && p.fabric.toLowerCase() !== selectedFabric.toLowerCase()) {
          return false;
        }
        // Badge filter (e.g. New)
        if (initialBadge && p.badge !== initialBadge) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.fabric.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q));
          if (!match) return false;
        }
        // Price filter
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, selectedFabric, searchQuery, sortBy, maxPrice, initialBadge]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFabric('All');
    setSearchQuery('');
    setMaxPrice(30000);
    setSortBy('newest');
  };

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8 pb-4 border-b border-[#E8DED8]">
          <div className="flex items-center gap-2 text-xs text-[#A98DA6] mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Catalog</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#4A1D4B] font-medium">{selectedCategory}</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A1D4B]">
                {selectedCategory === 'All' ? 'Women’s Garment Collection' : `${selectedCategory}`}
              </h1>
              <p className="text-xs text-[#806B7D] mt-1">
                Showing {filteredProducts.length} handcrafted outfits
              </p>
            </div>

            {/* Mobile Filter Toggle & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-white border border-[#E3D4C7] rounded-xl text-xs font-semibold text-[#4A1D4B] flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A98DA6] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#E3D4C7] rounded-xl text-xs font-medium text-[#1F171E] focus:outline-none focus:border-[#4A1D4B]"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 p-6 bg-white rounded-2xl border border-[#EDE4DE] shadow-xs self-start">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DF]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#4A1D4B]">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter Collection</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#A98DA6] hover:text-[#4A1D4B] flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-xs font-semibold text-[#1F171E] block mb-2">Search Within Catalog</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Lawn, Velvet, Shawl..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-lg focus:outline-none focus:border-[#4A1D4B]"
                />
                <Search className="w-3.5 h-3.5 text-[#A98DA6] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-[#1F171E] block mb-3 uppercase tracking-wider">
                Category
              </label>
              <div className="space-y-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#4A1D4B] text-[#FFF6F1] font-semibold'
                        : 'text-[#5C4D58] hover:bg-[#FFF6F1] hover:text-[#4A1D4B]'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat === 'Sale' && <span className="text-[10px] text-red-500 font-bold uppercase">Sale</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Filter */}
            <div>
              <label className="text-xs font-semibold text-[#1F171E] block mb-3 uppercase tracking-wider">
                Fabric Material
              </label>
              <div className="space-y-1.5">
                {fabrics.map(fab => (
                  <button
                    key={fab}
                    onClick={() => setSelectedFabric(fab)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      selectedFabric === fab
                        ? 'bg-[#4A1D4B] text-[#FFF6F1] font-semibold'
                        : 'text-[#5C4D58] hover:bg-[#FFF6F1] hover:text-[#4A1D4B]'
                    }`}
                  >
                    {fab}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1F171E] uppercase tracking-wider">
                  Max Price
                </label>
                <span className="text-xs font-mono font-semibold text-[#4A1D4B]">
                  Rs. {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="4000"
                max="30000"
                step="500"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#4A1D4B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A98DA6] mt-1 font-mono">
                <span>Rs. 4,000</span>
                <span>Rs. 30,000</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EDE4DE] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF6F1] mx-auto flex items-center justify-center text-[#A98DA6]">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#1F171E]">
                  No matching garments found
                </h3>
                <p className="text-xs text-[#806B7D] max-w-sm mx-auto">
                  We couldn't find any items matching your active filter criteria. Try adjusting the category, fabric, or price range.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#4A1D4B] text-[#FFF6F1] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenQuickView={onOpenQuickView}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
                <h3 className="font-serif text-lg font-semibold text-[#4A1D4B]">Filter Products</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-semibold text-[#1F171E] block mb-2">Category</label>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg ${
                        selectedCategory === cat ? 'bg-[#4A1D4B] text-white font-medium' : 'text-[#5C4D58]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div>
                <label className="text-xs font-semibold text-[#1F171E] block mb-2">Fabric</label>
                <div className="space-y-1">
                  {fabrics.map(fab => (
                    <button
                      key={fab}
                      onClick={() => setSelectedFabric(fab)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg ${
                        selectedFabric === fab ? 'bg-[#4A1D4B] text-white font-medium' : 'text-[#5C4D58]'
                      }`}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full py-3 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
