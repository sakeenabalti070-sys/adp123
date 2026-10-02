import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  onSelectProduct,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const displayImage = isHovered && product.images[1] ? product.images[1] : activeVariant.image || product.thumbnail;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants.length > 1 && !activeVariant) {
      onOpenQuickView(product);
    } else {
      addToCart(product, activeVariant, 1);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-white rounded-xl border border-[#EDE4DE] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Container */}
      <div
        className="relative aspect-3/4 w-full bg-[#F4EFEB] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badge - Minimal refined typography per frontend-design skill */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-[#4A1D4B] text-[#FFF6F1] rounded-xs shadow-xs">
              {product.badge}
            </span>
          </div>
        )}
        {discountPercent > 0 && !product.badge && (
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-[#C53030] text-white rounded-xs shadow-xs">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-200">
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
              isWishlisted
                ? 'bg-[#D681A7] text-white'
                : 'bg-white/80 text-[#4A1D4B] hover:bg-white hover:text-[#D681A7]'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="p-2 rounded-full bg-white/80 text-[#4A1D4B] hover:bg-white hover:text-[#4A1D4B] backdrop-blur-xs transition-colors shadow-xs hidden sm:flex"
            aria-label="Quick preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button Hover Slide-Up */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-4 bg-[#4A1D4B]/95 hover:bg-[#361437] text-[#FFF6F1] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.variants.length > 1 ? 'Select & Add' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Metadata clean text with dot separator */}
          <div className="flex items-center gap-2 text-xs text-[#A98DA6] mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.fabric}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-semibold text-[#1F171E] group-hover:text-[#4A1D4B] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-medium text-[#1F171E]">{product.rating}</span>
            <span className="text-xs text-[#A98DA6]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Color Swatches if multiple variants */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1" onClick={e => e.stopPropagation()}>
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(idx)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedVariantIndex === idx ? 'ring-2 ring-[#4A1D4B] ring-offset-1' : 'border-gray-300'
                }`}
                style={{ backgroundColor: v.colorCode || '#D681A7' }}
                title={`${v.color} (${v.size})`}
              />
            ))}
          </div>
        )}

        {/* Price Baseline */}
        <div className="flex items-baseline gap-2 pt-2 border-t border-[#F0E6DF] mt-1">
          <span className="text-base font-semibold text-[#4A1D4B] font-mono tabular-nums">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-[#A98DA6] line-through font-mono tabular-nums">
              Rs. {product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
