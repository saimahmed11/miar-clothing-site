import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { language, t } = useLanguage();
  const {
    items,
    itemCount,
    subtotal,
    remainingForFreeShipping,
    hasFreeShipping,
    promoCode,
    discountAmount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{
    msg: string;
    isError: boolean;
  } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback({ msg: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
    setTimeout(() => setPromoFeedback(null), 3500);
  };

  const deliveryFee = hasFreeShipping ? 0 : items.length > 0 ? 250 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / 6500) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#14110F]/10 flex items-center justify-between bg-[#F4EDE2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0E5A6B]" />
              <h3 className="text-lg font-garamond font-bold text-[#14110F]">
                {t.cart.title}
              </h3>
              <span className="text-xs text-[#14110F]/60">
                ({itemCount}{' '}
                {itemCount === 1 ? t.cart.itemCount.replace('{count} ', '') : t.cart.itemCountPlural.replace('{count} ', '')})
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-md text-[#14110F]/60 hover:text-[#14110F] hover:bg-[#E8DFD0]/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-3.5 bg-[#E8DFD0]/60 border-b border-[#14110F]/8 text-xs">
            {hasFreeShipping ? (
              <p className="text-[#0E5A6B] font-semibold text-center">
                {t.cart.freeDeliveryUnlocked}
              </p>
            ) : (
              <div>
                <p className="text-[#14110F]/80 text-center mb-1.5 font-medium">
                  {t.cart.freeDeliveryThreshold.replace(
                    '{amount}',
                    remainingForFreeShipping.toLocaleString()
                  )}
                </p>
                <div className="w-full bg-[#14110F]/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#0E5A6B] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#14110F]/8">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8DFD0] text-[#0E5A6B] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-[#14110F]">
                  {t.cart.emptyTitle}
                </h4>
                <p className="text-xs text-[#14110F]/60 max-w-xs mx-auto">
                  {t.cart.emptyDesc}
                </p>
                <button
                  onClick={closeCart}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0E5A6B] rounded-md hover:bg-[#083742] transition-colors"
                >
                  <span>{t.cart.startShopping}</span>
                </button>
              </div>
            ) : (
              items.map((item) => {
                const title = language === 'ur' ? item.product.titleUr : item.product.titleEn;
                return (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                    {/* Item Thumbnail */}
                    <div className="w-20 aspect-[4/5] rounded overflow-hidden bg-[#E8DFD0] shrink-0 border border-[#14110F]/10">
                      <img
                        src={item.product.images[0]}
                        alt={title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#14110F] line-clamp-1">
                            {title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#14110F]/40 hover:text-[#B5543A] p-1 transition-colors"
                            title={t.cart.remove}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-[#14110F]/60">
                          <span>
                            {item.product.type === 'unstitched' ? 'Cut' : 'Size'}:{' '}
                            <strong className="text-[#0E5A6B] font-semibold">
                              {item.selectedSize}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector & Price */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center border border-[#14110F]/15 rounded bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[#14110F]/70 hover:text-[#14110F] hover:bg-[#E8DFD0]/50"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold tabular-nums text-[#14110F]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#14110F]/70 hover:text-[#14110F] hover:bg-[#E8DFD0]/50"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-[#0E5A6B] tabular-nums">
                          Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#14110F]/10 bg-[#F4EDE2] space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={t.cart.promoPlaceholder}
                  className="flex-1 py-1.5 px-3 text-xs rounded border border-[#14110F]/20 bg-white text-[#14110F] uppercase placeholder:normal-case focus:border-[#0E5A6B] focus:outline-none"
                />
                <button
                  type="submit"
                  className="py-1.5 px-3 bg-[#14110F] hover:bg-[#0E5A6B] text-white text-xs font-medium rounded transition-colors"
                >
                  {t.cart.applyPromo}
                </button>
              </form>

              {promoFeedback && (
                <p
                  className={`text-[11px] ${
                    promoFeedback.isError ? 'text-[#B5543A]' : 'text-[#0E5A6B]'
                  }`}
                >
                  {promoFeedback.msg}
                </p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between text-xs text-[#0E5A6B] bg-[#0E5A6B]/10 px-2.5 py-1 rounded">
                  <span className="font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {promoCode} Applied
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-[#B5543A] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#14110F]/80 pt-1">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="tabular-nums font-medium text-[#14110F]">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#0E5A6B]">
                    <span>{t.cart.discount}</span>
                    <span className="tabular-nums font-medium">
                      -Rs. {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.cart.delivery}</span>
                  <span className="tabular-nums font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-[#0E5A6B] font-semibold">{t.cart.free}</span>
                    ) : (
                      `Rs. ${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-bold text-[#14110F] pt-2 border-t border-[#14110F]/10">
                  <span>{t.cart.total}</span>
                  <span className="text-[#0E5A6B] tabular-nums">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Proceed to 1-Minute Checkout */}
                <button
                  onClick={() => {
                    closeCart();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-4 bg-[#0E5A6B] hover:bg-[#083742] text-white rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>{t.cart.checkoutBtn}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>

                {/* 2. Order on WhatsApp with cart filled in */}
                <a
                  href={generateWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-white hover:bg-[#E8DFD0]/40 text-[#14110F] hover:text-[#0E5A6B] border border-[#14110F]/20 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#0E5A6B]" />
                  <span>{t.cart.orderViaWhatsApp}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
