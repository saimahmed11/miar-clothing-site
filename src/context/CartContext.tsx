import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  hasFreeShipping: boolean;
  promoCode: string | null;
  discountAmount: number;
  isCartOpen: boolean;
  recentlyAddedId: string | null;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: string, pieces?: '2pc' | '3pc', quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  generateWhatsAppOrderUrl: (customerName?: string, city?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_LIMIT = 6500;
const WHATSAPP_STUDIO_PHONE = '923001234567'; // Karachi Studio WhatsApp

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('miar_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('miar_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_LIMIT || promoCode === 'MIARSHIP';

  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedPieces?: '2pc' | '3pc',
    quantity: number = 1
  ) => {
    // Generate unique ID per product + size + pieces combination
    const id = `${product.id}-${selectedSize}${selectedPieces ? `-${selectedPieces}` : ''}`;

    // Price adjustment for 2pc vs 3pc if applicable
    let unitPrice = product.price;
    if (product.type === 'unstitched' && selectedSize.includes('2-Piece')) {
      unitPrice = Math.round(product.price * 0.78);
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id,
          productId: product.id,
          product,
          selectedSize,
          selectedPieces,
          quantity,
          unitPrice,
        },
      ];
    });

    setRecentlyAddedId(product.id);
    setIsCartOpen(true);
    setTimeout(() => setRecentlyAddedId(null), 3000);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setDiscountAmount(0);
  };

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KARACHI10') {
      const discount = Math.round(subtotal * 0.1);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return { success: true, message: '10% Karachi Welcome discount applied!' };
    }
    if (clean === 'PEHLIKHARIDARI') {
      const discount = Math.min(500, subtotal);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return { success: true, message: 'Rs. 500 first order discount applied!' };
    }
    if (clean === 'MIARSHIP') {
      setPromoCode(clean);
      setDiscountAmount(0);
      return { success: true, message: 'Free express shipping coupon unlocked!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try KARACHI10' };
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscountAmount(0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const generateWhatsAppOrderUrl = (customerName?: string, city?: string): string => {
    const itemList = items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.product.titleEn} (${i.selectedSize}) - Rs. ${(
            i.unitPrice * i.quantity
          ).toLocaleString()}`
      )
      .join('\n');

    const message = `Salaam Miar (میار) Karachi Studio!\n\nI would like to place an order directly on WhatsApp:\n\n${itemList}\n\nSubtotal: Rs. ${subtotal.toLocaleString()}${
      discountAmount > 0 ? `\nDiscount: -Rs. ${discountAmount.toLocaleString()}` : ''
    }\nShipping: ${hasFreeShipping ? 'FREE' : 'Rs. 250'}\nEstimated Total: Rs. ${(
      subtotal - discountAmount + (hasFreeShipping ? 0 : 250)
    ).toLocaleString()}${
      customerName ? `\n\nName: ${customerName}` : ''
    }${city ? `\nCity: ${city}` : ''}\n\nPlease confirm availability and delivery booking. Shukriya!`;

    return `https://wa.me/${WHATSAPP_STUDIO_PHONE}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_LIMIT,
        remainingForFreeShipping,
        hasFreeShipping,
        promoCode,
        discountAmount,
        isCartOpen,
        recentlyAddedId,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
