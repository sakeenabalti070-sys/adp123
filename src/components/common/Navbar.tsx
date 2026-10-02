import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { itemCount, setIsOpen: setCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isStaff, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { search: searchQuery.trim() });
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'New Arrivals', page: 'catalog', params: { badge: 'New' } },
    {
      label: 'Women',
      page: 'catalog',
      params: { category: 'All' },
      dropdown: [
        { label: 'All Women Collection', params: { category: 'All' } },
        { label: 'Luxury Lawn', params: { fabric: 'Lawn' } },
        { label: 'Spun Cotton', params: { fabric: 'Cotton' } },
        { label: 'Karandi Linen', params: { fabric: 'Linen' } },
        { label: 'Crinkle Chiffon', params: { fabric: 'Chiffon' } },
        { label: 'Embroidered Suits', params: { search: 'Embroidered' } },
        { label: 'Printed Essentials', params: { search: 'Printed' } },
        { label: 'Festive & Formal', params: { category: 'Formal' } },
      ],
    },
    {
      label: 'Unstitched',
      page: 'catalog',
      params: { category: 'Unstitched' },
      dropdown: [
        { label: 'All Unstitched', params: { category: 'Unstitched' } },
        { label: '3-Piece Embroidered Lawn', params: { category: 'Unstitched', search: '3-Piece' } },
        { label: '2-Piece Printed Suits', params: { category: 'Unstitched', search: 'Printed' } },
        { label: 'Pure Chiffon Dupattas', params: { fabric: 'Chiffon' } },
        { label: 'Swiss Lawn & Cotton', params: { fabric: 'Lawn' } },
      ],
    },
    {
      label: 'Stitched',
      page: 'catalog',
      params: { category: 'Stitched' },
      dropdown: [
        { label: 'All Stitched', params: { category: 'Stitched' } },
        { label: '1-Piece Kurtis', params: { search: 'Kurti' } },
        { label: '2-Piece Co-ord Sets', params: { search: '2-Piece' } },
        { label: '3-Piece Ready to Wear', params: { search: '3-Piece' } },
      ],
    },
    { label: 'Pret Wear', page: 'catalog', params: { category: 'Pret Wear' } },
    {
      label: 'Winter Collection',
      page: 'catalog',
      params: { category: 'Winter Collection' },
      dropdown: [
        { label: 'Royal Micro Velvet', params: { fabric: 'Velvet' } },
        { label: 'Pashmina & Kashmiri Shawls', params: { search: 'Shawl' } },
        { label: 'Warm Karandi Linen', params: { fabric: 'Linen' } },
      ],
    },
    { label: 'Sale', page: 'catalog', params: { category: 'Sale' }, isSale: true },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-[#E8DED8] transition-all">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile hamburger & Search input */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4A1D4B] hover:text-[#D681A7] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Search input */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-72">
              <input
                type="text"
                placeholder="Search outfits, lawn, velvet..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white/80 border border-[#E3D4C7] rounded-full focus:outline-none focus:border-[#4A1D4B] focus:bg-white text-[#1F171E] placeholder:text-[#A98DA6] transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-[#A98DA6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex flex-col items-center justify-center shrink-0 cursor-pointer py-1" onClick={() => onNavigate('home')}>
            <img
              src="/comfort_logo.png"
              alt="Comfort Ladies Garments"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-200 hover:scale-105"
            />
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
            {/* Admin Switcher indicator / shortcut */}
            {isStaff ? (
              <button
                onClick={() => onNavigate('admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A1D4B] text-[#FFF6F1] rounded-full text-xs font-medium hover:bg-[#361437] transition-colors shadow-xs"
                title="Enter Admin Commerce Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D681A7]" />
                <span>Admin Console</span>
              </button>
            ) : null}

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 text-[#4A1D4B] hover:text-[#D681A7] transition-colors relative"
                aria-label="Account menu"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E8DED8] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#F0E6DF]">
                        <p className="text-xs text-[#A98DA6]">Signed in as</p>
                        <p className="text-sm font-semibold text-[#4A1D4B] truncate">{user.name}</p>
                        <p className="text-xs text-[#806B7D] capitalize">{user.role.replace('_', ' ')}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('account');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#1F171E] hover:bg-[#FFF6F1] transition-colors"
                      >
                        My Account & Orders
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('track');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#1F171E] hover:bg-[#FFF6F1] transition-colors"
                      >
                        Track Order
                      </button>
                      {isStaff && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-[#4A1D4B] hover:bg-[#FFF6F1] transition-colors flex items-center justify-between"
                        >
                          <span>Store Administration</span>
                          <span className="text-[10px] bg-[#D681A7]/20 text-[#4A1D4B] px-1.5 py-0.5 rounded">STAFF</span>
                        </button>
                      )}
                      <div className="border-t border-[#F0E6DF] mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            onNavigate('home');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-[#F0E6DF]">
                        <p className="text-xs text-[#A98DA6]">Welcome to Comfort</p>
                        <p className="text-sm font-medium text-[#1F171E]">Access your wardrobe & orders</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('login');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#4A1D4B] font-medium hover:bg-[#FFF6F1] transition-colors"
                      >
                        Customer Sign In / Register
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('track');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#1F171E] hover:bg-[#FFF6F1] transition-colors"
                      >
                        Track Order (Guest)
                      </button>
                      <div className="border-t border-[#F0E6DF] mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('login', { adminIntent: true });
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-[#A98DA6] hover:text-[#4A1D4B] hover:bg-[#FFF6F1] transition-colors flex items-center justify-between"
                        >
                          <span>Staff Portal Login</span>
                          <span className="text-[10px] font-mono">admin@comfort.pk</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-[#4A1D4B] hover:text-[#D681A7] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D681A7] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 text-[#4A1D4B] hover:text-[#D681A7] transition-colors relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#4A1D4B] text-[#FFF6F1] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Category Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-center gap-7 py-3 border-t border-[#E8DED8]/60 text-sm font-medium text-[#4A1D4B]">
          {navItems.map(item => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => onNavigate(item.page, item.params)}
                className={`flex items-center gap-1 transition-colors py-1 hover:text-[#D681A7] ${
                  item.isSale ? 'text-[#C53030] font-semibold' : ''
                } ${currentPage === item.page ? 'text-[#D681A7]' : ''}`}
              >
                <span>{item.label}</span>
                {item.dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180" />}
              </button>

              {/* Dropdown Menu */}
              {item.dropdown && activeDropdown === item.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 min-w-56">
                  <div className="bg-white border border-[#E8DED8] rounded-xl shadow-xl py-2 overflow-hidden animate-in fade-in">
                    {item.dropdown.map(sub => (
                      <button
                        key={sub.label}
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate('catalog', sub.params);
                        }}
                        className="w-full text-left px-5 py-2.5 text-xs text-[#1F171E] hover:bg-[#FFF6F1] hover:text-[#4A1D4B] transition-colors flex items-center justify-between"
                      >
                        <span>{sub.label}</span>
                        <ArrowRight className="w-3 h-3 text-[#A98DA6] opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F5] h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DED8]">
              <div className="cursor-pointer" onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>
                <img
                  src="/comfort_logo.png"
                  alt="Comfort Ladies Garments"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#4A1D4B]">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <input
                type="text"
                placeholder="Search dresses, lawn, shawls..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E8DED8] rounded-lg focus:outline-none focus:border-[#4A1D4B]"
              />
              <Search className="w-4 h-4 text-[#A98DA6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Mobile Navigation Links */}
            <div className="mt-6 flex flex-col divide-y divide-[#E8DED8]/60 text-sm">
              {navItems.map(item => (
                <div key={item.label} className="py-2.5">
                  <button
                    onClick={() => {
                      onNavigate(item.page, item.params);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left font-medium flex items-center justify-between ${
                      item.isSale ? 'text-red-700 font-semibold' : 'text-[#4A1D4B]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A98DA6]" />
                  </button>
                </div>
              ))}
            </div>

            {/* Mobile Footer Links */}
            <div className="mt-auto pt-6 border-t border-[#E8DED8] space-y-3">
              <button
                onClick={() => {
                  onNavigate('track');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-medium text-[#4A1D4B] border border-[#4A1D4B] rounded-lg"
              >
                Track Your Order
              </button>
              {isStaff ? (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-medium bg-[#4A1D4B] text-[#FFF6F1] rounded-lg flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Commerce Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-medium bg-[#4A1D4B] text-[#FFF6F1] rounded-lg"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
