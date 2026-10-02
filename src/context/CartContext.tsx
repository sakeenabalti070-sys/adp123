import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, Coupon } from '../types';
import { api } from '../services/api';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  freeShippingRemaining: number;
  total: number;
  coupon: Coupon | null;
  couponCode: string;
  couponMessage: string;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_FEE = 290;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('comfort_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('comfort_cart', JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recalculate coupon discount if items change
  useEffect(() => {
    if (coupon) {
      api.validateCoupon(coupon.code, subtotal).then(res => {
        if (res.valid) {
          setDiscount(res.discount);
          setCouponMessage(res.message);
        } else {
          // Invalidate coupon if subtotal fell below requirement
          setCoupon(null);
          setCouponCode('');
          setDiscount(0);
          setCouponMessage(res.message);
        }
      });
    } else {
      setDiscount(0);
    }
  }, [subtotal, coupon]);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || coupon?.type === 'free_shipping';
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discount + shippingFee);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const currentQty = next[existingIndex].quantity;
        const newQty = Math.min(variant.stock, currentQty + quantity);
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          variantId: variant.id,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          price: variant.salePrice || variant.price || product.price,
          image: variant.image || product.thumbnail,
          quantity: Math.min(variant.stock, quantity),
          maxStock: variant.stock,
        };
        return [...prev, newItem];
      }
    });

    setIsOpen(true);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const clamped = Math.min(item.maxStock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid && res.coupon) {
        setCoupon(res.coupon);
        setCouponCode(res.coupon.code);
        setDiscount(res.discount);
        setCouponMessage(res.message);
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || 'Invalid coupon' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode('');
    setDiscount(0);
    setCouponMessage('');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        freeShippingRemaining,
        total,
        coupon,
        couponCode,
        couponMessage,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
