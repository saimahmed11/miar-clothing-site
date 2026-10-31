import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { PAKISTAN_CITIES } from '../data/cities';
import {
  X,
  Ruler,
  MessageCircle,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
  onSelectProduct,
  allProducts,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedPieces, setSelectedPieces] = useState<'2pc' | '3pc'>('3pc');
  const [cityInput, setCityInput] = useState('Karachi');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  if (!product) return null;

  // Set default size
  const defaultSize = selectedSize || product.sizes[0]?.size || '';
  const currentSizeObj = product.sizes.find((s) => s.size === defaultSize);
  const isOutOfStock = currentSizeObj ? currentSizeObj.stock <= 0 : false;

  const title = language === 'ur' ? product.titleUr : product.titleEn;
  const tagline = language === 'ur' ? product.taglineUr : product.taglineEn;
  const description = language === 'ur' ? product.descriptionUr : product.descriptionEn;
  const fabric = language === 'ur' ? product.fabricUr : product.fabricEn;
  const color = language === 'ur' ? product.colorUr : product.colorEn;
  const modelInfo = language === 'ur' ? product.modelInfoUr : product.modelInfoEn;
  const care = language === 'ur' ? product.careUr : product.careEn;
  const specs = language === 'ur' ? product.fabricSpecsUr : product.fabricSpecsEn;

  // Delivery estimation logic
  const matchedCity =
    PAKISTAN_CITIES.find(
      (c) =>
        c.nameEn.toLowerCase() === cityInput.toLowerCase() ||
        c.nameUr === cityInput
    ) || PAKISTAN_CITIES[0];

  const handleAddToCart = () => {
    addToCart(product, defaultSize, product.type === 'unstitched' ? selectedPieces : undefined);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  // WhatsApp Ask/Order URL
  const generateProductWhatsAppUrl = () => {
    const text = `Salaam Miar Karachi Studio!\n\nI am interested in:\n*${product.titleEn}*\nSKU: ${product.sku}\nSelected Size: ${defaultSize}\nPrice: Rs. ${product.price.toLocaleString()}\nLink: https://miar.pk/products/${product.id}\n\nCould you please let me know availability and how soon it can be delivered to ${cityInput}?`;
    return `https://wa.me/923001234567?text=${encodeURIComponent(text)}`;
  };

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog Body */}
      <div className="relative w-full max-w-5xl bg-[#FAF6F0] rounded-xl shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#14110F]/10 bg-[#F4EDE2]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0E5A6B] uppercase tracking-wider">
            <span>{product.sku}</span>
            <span aria-hidden="true">·</span>
            <span>{product.type === 'unstitched' ? t.filters.unstitched : t.filters.pret}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#14110F]/70 hover:text-[#14110F] hover:bg-[#E8DFD0]/70 transition-colors"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Gallery (7 Cols on LG) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Featured Photo */}
              <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-[#E8DFD0] border border-[#14110F]/8">
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Badges */}
                {product.badge && (
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="text-xs font-semibold tracking-wider uppercase bg-[#0E5A6B] text-white px-2.5 py-1 rounded-sm shadow-xs">
                      {product.badge === 'new'
                        ? t.product.new
                        : product.badge === 'few_left'
                        ? t.product.fewLeft
                        : product.badge === 'sale'
                        ? t.product.sale
                        : 'Featured'}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 aspect-[4/5] rounded overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx
                        ? 'border-[#0E5A6B] shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>

              {/* Model Info Note */}
              <div className="p-3 bg-[#E8DFD0]/40 rounded text-xs text-[#14110F]/80 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#0E5A6B] shrink-0" />
                <span>
                  <strong className="font-semibold text-[#14110F]">
                    {t.product.modelStats}:{' '}
                  </strong>
                  {modelInfo}
                </span>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module (5 Cols on LG) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Title and Tagline */}
                <h2 className="text-2xl sm:text-3xl font-garamond font-bold text-[#14110F]">
                  {title}
                </h2>
                <p className="mt-1 text-xs text-[#14110F]/70 italic">{tagline}</p>

                {/* Price and COD Badge */}
                <div className="mt-4 flex items-center justify-between pb-4 border-b border-[#14110F]/10">
                  <div className="flex items-baseline gap-2.5 tabular-nums">
                    <span className="text-2xl font-bold text-[#0E5A6B]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#14110F]/40 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Cash on delivery guarantee badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E5A6B] bg-[#0E5A6B]/10 px-2.5 py-1 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>COD Guaranteed</span>
                  </span>
                </div>

                {/* Unstitched 2pc / 3pc Selector OR Size Selector */}
                {product.type === 'unstitched' ? (
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#14110F]">
                        {t.product.suitType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPieces('3pc')}
                        className={`p-2.5 text-xs font-medium rounded border text-start transition-all ${
                          selectedPieces === '3pc'
                            ? 'border-[#0E5A6B] bg-[#0E5A6B]/5 text-[#0E5A6B] font-bold shadow-xs'
                            : 'border-[#14110F]/15 hover:border-[#14110F]/40 text-[#14110F]'
                        }`}
                      >
                        <p className="font-semibold">3-Piece Full Suit</p>
                        <p className="text-[11px] text-[#14110F]/60 mt-0.5">
                          Shirt + Trouser + Silk Dupatta
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPieces('2pc')}
                        className={`p-2.5 text-xs font-medium rounded border text-start transition-all ${
                          selectedPieces === '2pc'
                            ? 'border-[#0E5A6B] bg-[#0E5A6B]/5 text-[#0E5A6B] font-bold shadow-xs'
                            : 'border-[#14110F]/15 hover:border-[#14110F]/40 text-[#14110F]'
                        }`}
                      >
                        <p className="font-semibold">2-Piece Suit</p>
                        <p className="text-[11px] text-[#14110F]/60 mt-0.5">
                          Shirt + Cambric Trouser
                        </p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#14110F]">
                        {t.product.size}:{' '}
                        <span className="font-bold text-[#0E5A6B]">{defaultSize}</span>
                      </span>

                      <button
                        type="button"
                        onClick={onOpenSizeGuide}
                        className="inline-flex items-center gap-1 text-xs text-[#0E5A6B] hover:underline font-medium"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>{t.product.sizeGuide}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {product.sizes.map((s) => {
                        const isSold = s.stock <= 0;
                        const isSelected = defaultSize === s.size;
                        return (
                          <button
                            key={s.size}
                            type="button"
                            disabled={isSold}
                            onClick={() => setSelectedSize(s.size)}
                            className={`py-2 px-1 text-xs font-semibold rounded border transition-all text-center ${
                              isSold
                                ? 'border-dashed border-[#14110F]/20 text-[#14110F]/30 bg-[#14110F]/5 line-through cursor-not-allowed'
                                : isSelected
                                ? 'border-[#0E5A6B] bg-[#0E5A6B] text-white shadow-xs'
                                : 'border-[#14110F]/20 hover:border-[#0E5A6B] text-[#14110F]'
                            }`}
                          >
                            <span>{s.size}</span>
                            {s.stock > 0 && s.stock <= 3 && (
                              <span className="block text-[8px] font-normal mt-0.5 text-[#B5543A]">
                                {s.stock} left
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`w-full py-3.5 px-6 rounded-md font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-[#14110F]/20 text-[#14110F]/40 cursor-not-allowed'
                        : isAddedFeedback
                        ? 'bg-[#083742] text-white'
                        : 'bg-[#0E5A6B] hover:bg-[#083742] text-white'
                    }`}
                  >
                    {isAddedFeedback ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{t.product.addedToCart}</span>
                      </>
                    ) : (
                      <span>
                        {isOutOfStock ? t.product.soldOut : t.product.addToCart}
                      </span>
                    )}
                  </button>

                  {/* Ask / Order on WhatsApp button */}
                  <a
                    href={generateProductWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-md border border-[#14110F]/20 hover:border-[#0E5A6B] bg-white text-[#14110F] hover:text-[#0E5A6B] font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-[#0E5A6B]" />
                    <span>{t.product.orderOnWhatsApp} (Under 60s)</span>
                  </a>
                </div>

                {/* City Delivery Estimator */}
                <div className="mt-6 p-3.5 rounded-lg border border-[#14110F]/10 bg-[#E8DFD0]/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14110F]">
                    <Truck className="w-4 h-4 text-[#0E5A6B]" />
                    <span>{t.product.deliveryEstimate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      className="flex-1 py-1.5 px-2.5 text-xs rounded border border-[#14110F]/20 bg-white text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.nameEn} value={c.nameEn}>
                          {language === 'ur' ? c.nameUr : c.nameEn} (
                          {c.isKarachi ? 'Express 24h' : '2-3 days'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-[#0E5A6B] font-medium">
                    {language === 'ur' ? matchedCity.estimateUr : matchedCity.estimateEn}
                  </p>
                </div>

                {/* Description & Fabric Details */}
                <div className="mt-6 pt-5 border-t border-[#14110F]/10 space-y-4 text-xs text-[#14110F]/80">
                  <div>
                    <h4 className="font-bold text-[#14110F] uppercase tracking-wider mb-1 text-[11px]">
                      The Silhouette
                    </h4>
                    <p className="leading-relaxed">{description}</p>
                  </div>

                  {specs && (
                    <div>
                      <h4 className="font-bold text-[#14110F] uppercase tracking-wider mb-1 text-[11px]">
                        {t.product.specs}
                      </h4>
                      <ul className="list-disc list-inside space-y-0.5 text-[#14110F]/75">
                        {specs.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {care && (
                    <div>
                      <h4 className="font-bold text-[#14110F] uppercase tracking-wider mb-1 text-[11px]">
                        {t.product.care}
                      </h4>
                      <ul className="list-disc list-inside space-y-0.5 text-[#14110F]/75">
                        {care.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews for this Product */}
          <div className="mt-12 pt-8 border-t border-[#14110F]/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-garamond font-bold text-[#14110F]">
                  {t.product.reviews}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex text-[#D99A2B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D99A2B]" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#14110F]">5.0</span>
                  <span className="text-xs text-[#14110F]/50">
                    ({product.reviews.length} Karachi verified reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-lg bg-[#E8DFD0]/30 border border-[#14110F]/8 text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#14110F]">{rev.name}</span>
                    <span className="text-[10px] text-[#14110F]/50">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#0E5A6B] mb-2 font-medium">
                    <span>{rev.city}</span>
                    <span>·</span>
                    <span>Size: {rev.sizeBought}</span>
                  </div>
                  <p className="text-[#14110F]/80 leading-relaxed italic">
                    “{rev.comment}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Complete The Look / Suggestions */}
          <div className="mt-12 pt-8 border-t border-[#14110F]/10">
            <h3 className="text-lg font-garamond font-bold text-[#14110F] mb-4">
              {t.product.completeLook}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#14110F]/8 hover:border-[#0E5A6B] cursor-pointer transition-colors"
                >
                  <div className="w-16 h-20 rounded overflow-hidden bg-[#E8DFD0] shrink-0">
                    <img
                      src={rel.images[0]}
                      alt={rel.titleEn}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-[#14110F] truncate">
                      {language === 'ur' ? rel.titleUr : rel.titleEn}
                    </h5>
                    <p className="text-xs font-bold text-[#0E5A6B] mt-0.5 tabular-nums">
                      Rs. {rel.price.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-[#14110F]/50 mt-1 block">
                      {rel.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sticky Add to Cart Bar */}
        <div className="lg:hidden p-3 bg-[#FAF6F0] border-t border-[#14110F]/10 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[11px] text-[#14110F]/60 block">Price</span>
            <span className="text-base font-bold text-[#0E5A6B] tabular-nums">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded font-semibold text-xs transition-colors shadow-xs ${
              isOutOfStock
                ? 'bg-[#14110F]/20 text-[#14110F]/40 cursor-not-allowed'
                : 'bg-[#0E5A6B] text-white hover:bg-[#083742]'
            }`}
          >
            {isOutOfStock ? t.product.soldOut : t.product.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};
