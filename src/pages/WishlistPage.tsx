import React from 'react';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface WishlistPageProps {
  products: Product[];
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onOpenQuickView,
}) => {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8DED8]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A1D4B]">
              My Wishlist Wardrobe
            </h1>
            <p className="text-xs text-[#806B7D] mt-1">
              {wishlistedProducts.length} saved luxury garments
            </p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-[#4A1D4B] hover:text-[#D681A7] uppercase tracking-wider"
          >
            Continue Shopping
          </button>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EDE4DE] p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FFF6F1] mx-auto flex items-center justify-center text-[#D681A7]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1F171E]">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-[#806B7D]">
              Save your favorite luxury lawn, velvet, and ready-to-wear kurtis to review or order later.
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-3 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437]"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map(product => {
              const variant = product.variants[0];
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#EDE4DE] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-3/4 bg-[#F4EFEB] cursor-pointer" onClick={() => onSelectProduct(product)}>
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-600 transition-colors shadow-xs"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-[#A98DA6] uppercase">{product.category}</span>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-serif text-base font-semibold text-[#1F171E] hover:text-[#4A1D4B] cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <p className="font-mono text-base font-bold text-[#4A1D4B] mt-1">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, variant, 1);
                        removeFromWishlist(product.id);
                      }}
                      className="w-full py-2.5 px-3 bg-[#4A1D4B] hover:bg-[#361437] text-white text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
