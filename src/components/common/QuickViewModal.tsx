import React, { useState } from 'react';
import { X, Star, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenProductPage: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onOpenProductPage,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#E8DED8] max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-[#4A1D4B] rounded-full shadow-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 bg-[#F9F6F4] p-6 flex flex-col justify-between">
          <div className="aspect-3/4 rounded-xl overflow-hidden bg-white shadow-inner">
            <img
              src={selectedImage || product.thumbnail}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#4A1D4B]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase Module */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#A98DA6] mb-1">
              <span>{product.category}</span>
              <span>·</span>
              <span>SKU: {selectedVariant.sku}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#1F171E] leading-snug mb-2">
              {product.name}
            </h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1F171E]">{product.rating}</span>
              <span className="text-xs text-[#A98DA6]">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#4A1D4B] font-mono tabular-nums">
                Rs. {(selectedVariant.salePrice || selectedVariant.price || product.price).toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-[#A98DA6] line-through font-mono tabular-nums">
                  Rs. {product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-[#5C4D58] leading-relaxed line-clamp-3 mb-6">
              {product.shortDescription || product.description}
            </p>

            {/* Variant Options: Size & Color */}
            {product.variants.length > 1 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-[#1F171E] block mb-2">
                    Size / Variant: <span className="font-normal text-[#A98DA6]">{selectedVariant.size}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          selectedVariant.id === v.id
                            ? 'border-[#4A1D4B] bg-[#4A1D4B] text-[#FFF6F1]'
                            : 'border-[#E3D4C7] bg-white text-[#1F171E] hover:border-[#A98DA6]'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedVariant.color && (
                  <div>
                    <label className="text-xs font-semibold text-[#1F171E] block mb-2">
                      Color: <span className="font-normal text-[#A98DA6]">{selectedVariant.color}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {product.variants.map(v => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            selectedVariant.id === v.id ? 'ring-2 ring-[#4A1D4B] ring-offset-2' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: v.colorCode || '#D681A7' }}
                          title={v.color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Stepper & Add Button */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-[#E3D4C7] rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm text-[#4A1D4B] hover:bg-[#FFF6F1] rounded-l-lg transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-semibold text-[#1F171E] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                  className="px-3 py-2 text-sm text-[#4A1D4B] hover:bg-[#FFF6F1] rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={selectedVariant.stock <= 0}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : selectedVariant.stock > 0
                    ? 'bg-[#4A1D4B] text-[#FFF6F1] hover:bg-[#361437]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : selectedVariant.stock > 0 ? (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                ) : (
                  <span>Sold Out</span>
                )}
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-xs text-[#806B7D] pt-3 border-t border-[#F0E6DF]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Original Pakistani Fabric · 7-Day Hassle-Free Returns</span>
            </div>
          </div>

          {/* Full details link */}
          <div className="pt-4 mt-4 border-t border-[#F0E6DF]">
            <button
              onClick={() => {
                onClose();
                onOpenProductPage(product);
              }}
              className="text-xs font-semibold text-[#4A1D4B] hover:text-[#D681A7] flex items-center gap-1 transition-colors"
            >
              <span>View Complete Fabric & Sizing Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
