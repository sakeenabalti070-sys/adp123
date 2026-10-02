import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';

import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { PolicyModal } from './components/common/PolicyModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';

import { HeroSection } from './components/home/HeroSection';
import { CategorySection } from './components/home/CategorySection';
import { SpecialOfferSection } from './components/home/SpecialOfferSection';
import { ProductCard } from './components/common/ProductCard';

import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { AdminPage } from './pages/AdminPage';

import { api } from './services/api';
import { Product } from './types';
import { Sparkles, ArrowRight } from 'lucide-react';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navParams, setNavParams] = useState<any>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading catalog products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trending / Featured products for Homepage
  const trendingProducts = products.slice(0, 4);

  // If Admin panel is open, render standalone full-screen admin console
  if (currentPage === 'admin') {
    return <AdminPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-[#1F171E] selection:bg-[#F8D7E3] selection:text-[#4A1D4B]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Header & Navigation */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* 3. Page Routing View */}
      <div className="flex-1">
        {currentPage === 'home' && (
          <main>
            {/* Hero Section */}
            <HeroSection
              onShopNow={() => handleNavigate('catalog')}
              onExploreCategory={(cat) => handleNavigate('catalog', { category: cat })}
            />

            {/* Category Cards Section */}
            <CategorySection
              onSelectCategory={(cat) => handleNavigate('catalog', { category: cat })}
            />

            {/* Trending Now Showcase */}
            <section className="py-16 md:py-24 bg-white border-y border-[#EDE4DE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#F0E6DF]">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A98DA6]">
                      <Sparkles className="w-3.5 h-3.5 text-[#D681A7]" />
                      <span>Most Loved Styles</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#4A1D4B] mt-1">
                      Trending Now
                    </h2>
                    <p className="text-xs text-[#806B7D] mt-1">
                      Finest hand-embroidered lawn, festive formals, and ready-to-wear silhouettes.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('catalog')}
                    className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-wider text-[#4A1D4B] hover:text-[#D681A7] flex items-center gap-1.5 transition-colors group"
                  >
                    <span>View All Outfits</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="aspect-3/4 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpenQuickView={setQuickViewProduct}
                        onSelectProduct={handleSelectProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Special Mid-Season Offer Banner */}
            <SpecialOfferSection
              onShopSale={() => handleNavigate('catalog', { category: 'Sale' })}
            />
          </main>
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            products={products}
            initialCategory={navParams.category}
            initialSearch={navParams.search}
            initialFabric={navParams.fabric}
            initialBadge={navParams.badge}
            onOpenQuickView={setQuickViewProduct}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onOpenQuickView={setQuickViewProduct}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'track' && (
          <OrderTrackingPage
            initialOrderNumber={navParams.orderNumber}
            initialContact={navParams.contact}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'account' && (
          <CustomerAccountPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onOpenQuickView={setQuickViewProduct}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            adminIntent={navParams.adminIntent}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'faq' && (
          <FAQPage />
        )}
      </div>

      {/* 4. Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicyModal={setActivePolicy}
      />

      {/* Global Modals & Drawers */}
      <CartDrawer onNavigate={handleNavigate} />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenProductPage={handleSelectProduct}
      />

      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
