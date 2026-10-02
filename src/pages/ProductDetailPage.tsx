import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  Check,
  MapPin,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Product, ProductVariant, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onSelectProduct,
  onOpenQuickView,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      sku: product.sku,
      size: 'Standard',
      color: 'Default',
      price: product.price,
      stock: product.totalStock,
    }
  );

  const [selectedImage, setSelectedImage] = useState<string>(product.thumbnail);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'size' | 'delivery' | 'care'>('desc');
  const [added, setAdded] = useState(false);
  const [cityEstimator, setCityEstimator] = useState('Lahore');
  const [estimatedDate, setEstimatedDate] = useState('2-3 Business Days');
  const [copySuccess, setCopySuccess] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedVariant(product.variants[0]);
    setSelectedImage(product.thumbnail);

    api.getProduct(product.slug).then(res => {
      if (res && res.reviews) setReviews(res.reviews);
      if (res && res.related) setRelatedProducts(res.related);
    });
  }, [product]);

  const handleEstimateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const city = cityEstimator.toLowerCase().trim();
    if (city.includes('lahore')) {
      setEstimatedDate('Next Day Delivery (24 Hours)');
    } else if (city.includes('karachi') || city.includes('islamabad') || city.includes('rawalpindi')) {
      setEstimatedDate('2-3 Business Days via TCS Express');
    } else {
      setEstimatedDate('3-4 Business Days via Leopards Express');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    onNavigate('checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewSubmitting(true);
    try {
      const newRev = await api.submitReview({
        productId: product.id,
        productName: product.name,
        customerName: reviewName,
        customerEmail: reviewEmail || 'verified@comfort.pk',
        rating: reviewRating,
        title: `${reviewRating} Star Review`,
        comment: reviewComment,
      });
      setReviews(prev => [newRev, ...prev]);
      setReviewSuccess(true);
      setReviewComment('');
      setReviewFormOpen(false);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = selectedVariant.salePrice || selectedVariant.price || product.price;

  return (
    <div className="bg-[#FAF7F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#A98DA6] mb-8">
          <button onClick={() => onNavigate('home')} className="hover:text-[#4A1D4B]">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('catalog', { category: product.category })} className="hover:text-[#4A1D4B]">
            {product.category}
          </button>
          <span>/</span>
          <span className="text-[#4A1D4B] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Contiguous Purchase Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0 pb-2 md:pb-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImage === img ? 'border-[#4A1D4B] shadow-sm' : 'border-[#EDE4DE] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-3/4 rounded-2xl overflow-hidden bg-white border border-[#EDE4DE] shadow-md">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-all duration-300"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider px-3 py-1 bg-[#4A1D4B] text-[#FFF6F1] rounded-xs shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Collection */}
              <div className="flex items-center justify-between text-xs text-[#A98DA6] mb-2">
                <span>{product.category} · {product.collection}</span>
                <span className="font-mono">SKU: {selectedVariant.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1F171E] leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Share */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DED8]">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#1F171E]">{product.rating}</span>
                  <span className="text-xs text-[#A98DA6]">({product.reviewCount} customer reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      isWishlisted ? 'bg-[#D681A7] text-white border-[#D681A7]' : 'border-[#E3D4C7] text-[#4A1D4B] hover:bg-white'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border border-[#E3D4C7] text-[#4A1D4B] hover:bg-white transition-colors relative"
                    title="Share outfit link"
                  >
                    <Share2 className="w-4 h-4" />
                    {copySuccess && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#4A1D4B] text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="py-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold text-[#4A1D4B] tabular-nums">
                    Rs. {currentPrice.toLocaleString()}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                    <span className="text-base text-[#A98DA6] line-through font-mono tabular-nums">
                      Rs. {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#806B7D] mt-1">
                  Tax included. Free express shipping nationwide on orders above Rs. 5,000.
                </p>
              </div>

              {/* Variants Selection: Size & Color */}
              <div className="space-y-4 py-4 border-t border-[#E8DED8]">
                {/* Size options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#1F171E] uppercase tracking-wider">
                      Size: <span className="font-normal text-[#A98DA6]">{selectedVariant.size}</span>
                    </label>
                    <button
                      onClick={() => setActiveTab('size')}
                      className="text-xs text-[#4A1D4B] underline hover:text-[#D681A7]"
                    >
                      View Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          selectedVariant.id === v.id
                            ? 'border-[#4A1D4B] bg-[#4A1D4B] text-[#FFF6F1] shadow-xs'
                            : 'border-[#E3D4C7] bg-white text-[#1F171E] hover:border-[#A98DA6]'
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color option */}
                {selectedVariant.color && (
                  <div>
                    <label className="text-xs font-semibold text-[#1F171E] block mb-2 uppercase tracking-wider">
                      Color Shade: <span className="font-normal text-[#A98DA6]">{selectedVariant.color}</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {product.variants.map(v => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`w-7 h-7 rounded-full border transition-all ${
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

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 text-xs font-medium py-1">
                {selectedVariant.stock > 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({selectedVariant.stock} garments available)
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Currently Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E3D4C7] rounded-xl bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-3 text-sm text-[#4A1D4B] hover:bg-[#FFF6F1] rounded-l-xl transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                      className="px-3.5 py-3 text-sm text-[#4A1D4B] hover:bg-[#FFF6F1] rounded-r-xl transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={selectedVariant.stock <= 0}
                    className={`flex-1 py-4 px-6 rounded-xl font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
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
                        <span>Added to Wardrobe Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={selectedVariant.stock <= 0}
                  className="w-full py-3.5 px-6 rounded-xl border border-[#4A1D4B] bg-[#FFF6F1] text-[#4A1D4B] hover:bg-[#4A1D4B] hover:text-[#FFF6F1] font-semibold text-xs tracking-widest uppercase transition-all shadow-xs"
                >
                  Buy It Now (Direct Checkout)
                </button>
              </div>

              {/* Delivery Estimator */}
              <div className="mt-6 p-4 bg-white rounded-xl border border-[#EDE4DE] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4A1D4B]">
                  <Truck className="w-4 h-4 text-[#D681A7]" />
                  <span>Check Delivery Timeline in Your City</span>
                </div>
                <form onSubmit={handleEstimateDelivery} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Karachi, Islamabad..."
                      value={cityEstimator}
                      onChange={e => setCityEstimator(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F5] border border-[#E3D4C7] rounded-lg focus:outline-none focus:border-[#4A1D4B]"
                    />
                    <MapPin className="w-3.5 h-3.5 text-[#A98DA6] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#4A1D4B] text-[#FFF6F1] text-xs font-medium rounded-lg hover:bg-[#361437]"
                  >
                    Check
                  </button>
                </form>
                <p className="text-xs text-emerald-700 font-medium">
                  {estimatedDate}
                </p>
              </div>
            </div>

            {/* Trust Micro-Grid */}
            <div className="pt-4 border-t border-[#E8DED8] grid grid-cols-2 gap-3 text-xs text-[#5C4D58]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D681A7]" />
                <span>100% Original Pakistani Fabric</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#D681A7]" />
                <span>7-Day Return / Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Product Accordions */}
        <div className="mt-16 bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-10 shadow-xs">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-4 border-b border-[#F0E6DF] pb-4 mb-6">
            {[
              { id: 'desc', label: 'Description & Fabric' },
              { id: 'specs', label: 'Specifications' },
              { id: 'size', label: 'Size Guide' },
              { id: 'delivery', label: 'Delivery & Shipping' },
              { id: 'care', label: 'Care & Wash Instructions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[18px] ${
                  activeTab === tab.id
                    ? 'border-[#4A1D4B] text-[#4A1D4B]'
                    : 'border-transparent text-[#806B7D] hover:text-[#4A1D4B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="text-xs sm:text-sm text-[#5C4D58] leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="p-4 bg-[#FFF6F1] rounded-xl border border-[#F0E6DF] space-y-2">
                  <h4 className="font-serif font-bold text-[#4A1D4B]">Signature Artisan Notes</h4>
                  <p>
                    Every thread is meticulously chosen from long-staple combed cotton, authentic Pakistani crinkle chiffon, or royal micro velvet. Hand-finished with delicate organza scalloping and antique tilla threadwork.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#FAF7F5] rounded-lg">
                  <span className="text-[#A98DA6] block text-xs">Fabric Canvas</span>
                  <span className="font-semibold text-[#1F171E]">{product.fabric}</span>
                </div>
                <div className="p-3 bg-[#FAF7F5] rounded-lg">
                  <span className="text-[#A98DA6] block text-xs">Collection</span>
                  <span className="font-semibold text-[#1F171E]">{product.collection}</span>
                </div>
                <div className="p-3 bg-[#FAF7F5] rounded-lg">
                  <span className="text-[#A98DA6] block text-xs">Season</span>
                  <span className="font-semibold text-[#1F171E]">{product.season}</span>
                </div>
                <div className="p-3 bg-[#FAF7F5] rounded-lg">
                  <span className="text-[#A98DA6] block text-xs">Origin</span>
                  <span className="font-semibold text-[#1F171E]">Crafted in Pakistan</span>
                </div>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-4">
                <p>All measurements are in inches. Standard Pakistani pret sizing chart:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7F5] text-xs font-semibold text-[#4A1D4B]">
                        <th className="p-3 border border-[#EDE4DE]">Size</th>
                        <th className="p-3 border border-[#EDE4DE]">Chest / Bust</th>
                        <th className="p-3 border border-[#EDE4DE]">Shirt Length</th>
                        <th className="p-3 border border-[#EDE4DE]">Shoulder</th>
                        <th className="p-3 border border-[#EDE4DE]">Trouser Waist</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr>
                        <td className="p-3 border border-[#EDE4DE] font-semibold">Small (S)</td>
                        <td className="p-3 border border-[#EDE4DE]">38"</td>
                        <td className="p-3 border border-[#EDE4DE]">42"</td>
                        <td className="p-3 border border-[#EDE4DE]">14.5"</td>
                        <td className="p-3 border border-[#EDE4DE]">28" - 32"</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-[#EDE4DE] font-semibold">Medium (M)</td>
                        <td className="p-3 border border-[#EDE4DE]">41"</td>
                        <td className="p-3 border border-[#EDE4DE]">43"</td>
                        <td className="p-3 border border-[#EDE4DE]">15.5"</td>
                        <td className="p-3 border border-[#EDE4DE]">32" - 36"</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-[#EDE4DE] font-semibold">Large (L)</td>
                        <td className="p-3 border border-[#EDE4DE]">44"</td>
                        <td className="p-3 border border-[#EDE4DE]">44"</td>
                        <td className="p-3 border border-[#EDE4DE]">16.5"</td>
                        <td className="p-3 border border-[#EDE4DE]">36" - 40"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-3">
                <p>
                  <strong>Standard Delivery:</strong> Orders dispatched within 24 hours. Delivered across Pakistan in 2-4 working days via TCS / Leopards Courier.
                </p>
                <p>
                  <strong>Shipping Fee:</strong> Free for orders exceeding Rs. 5,000. Flat Rs. 290 for other orders.
                </p>
                <p>
                  <strong>Returns & Exchange:</strong> 7 days return policy from delivery date. Garments must be unwashed, unworn, and with original tags intact.
                </p>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-2">
                <p>• {product.careInstructions || 'Dry clean recommended for formal and embroidered outfits.'}</p>
                <p>• {product.washInstructions || 'Wash dark colors separately. Iron on reverse side.'}</p>
                <p>• Store in dry, cool conditions away from direct sunlight.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0E6DF] gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#4A1D4B]">Customer Reviews & Ratings</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#1F171E]">{product.rating} out of 5</span>
                <span className="text-xs text-[#A98DA6]">Based on {reviews.length || product.reviewCount} reviews</span>
              </div>
            </div>

            <button
              onClick={() => setReviewFormOpen(!reviewFormOpen)}
              className="px-5 py-2.5 bg-[#4A1D4B] text-[#FFF6F1] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437] transition-colors self-start sm:self-auto flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{reviewFormOpen ? 'Close Form' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Review Submission Form */}
          {reviewFormOpen && (
            <form onSubmit={handleReviewSubmit} className="my-6 p-6 bg-[#FAF7F5] rounded-xl border border-[#E3D4C7] space-y-4 animate-in fade-in">
              <h4 className="font-serif text-base font-semibold text-[#4A1D4B]">Share Your Experience</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#1F171E] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E3D4C7] rounded-lg"
                    placeholder="e.g. Zainab Tariq"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1F171E] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={reviewEmail}
                    onChange={e => setReviewEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E3D4C7] rounded-lg"
                    placeholder="zainab@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#1F171E] block mb-1">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#1F171E] block mb-1">Your Review *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E3D4C7] rounded-lg"
                  placeholder="Tell us about the fabric texture, stitching, sizing, and comfort..."
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-6 py-2.5 bg-[#4A1D4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#361437] transition-colors"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>
          )}

          {reviewSuccess && (
            <div className="my-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your verified review has been published.</span>
            </div>
          )}

          {/* Reviews List */}
          <div className="divide-y divide-[#F0E6DF] mt-6">
            {reviews.length === 0 ? (
              <p className="text-xs text-[#806B7D] py-4">
                Be the first to review this elegant outfit.
              </p>
            ) : (
              reviews.map(rev => (
                <div key={rev.id} className="py-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-[#1F171E]">{rev.customerName}</span>
                      {rev.isVerifiedBuyer && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#A98DA6]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#1F171E]">{rev.title}</h4>
                  <p className="text-xs text-[#5C4D58] leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-bold text-[#4A1D4B] mb-6">
              Complete the Look · Complementary Styles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard
                  key={rp.id}
                  product={rp}
                  onOpenQuickView={onOpenQuickView}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
