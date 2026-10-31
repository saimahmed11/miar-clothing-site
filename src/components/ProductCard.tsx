import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  const { language, t } = useLanguage();
  const { addToCart, recentlyAddedId } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || '');
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const title = language === 'ur' ? product.titleUr : product.titleEn;
  const fabric = language === 'ur' ? product.fabricUr : product.fabricEn;
  const hasMultipleImages = product.images.length > 1;
  const isRecentlyAdded = recentlyAddedId === product.id;

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setIsQuickAdding(true);
    addToCart(product, size);
    setTimeout(() => setIsQuickAdding(false), 1200);
  };

  return (
    <div
      onClick={() => onViewProduct(product)}
      className="group flex flex-col bg-[#FAF6F0] rounded-lg overflow-hidden border border-[#14110F]/8 hover:border-[#14110F]/20 hover:shadow-md transition-all duration-300 cursor-pointer text-start"
    >
      {/* Product Image Area with 4:5 aspect ratio */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#E8DFD0]"
        onMouseEnter={() => hasMultipleImages && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
          referrerPolicy="no-referrer"
        />

        {/* Badges: single subtle clean tag, not pill spam */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 z-10">
            {product.badge === 'new' && (
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#0E5A6B] text-white px-2 py-0.5 rounded-sm">
                {t.product.new}
              </span>
            )}
            {product.badge === 'few_left' && (
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#B5543A] text-white px-2 py-0.5 rounded-sm">
                {t.product.fewLeft}
              </span>
            )}
            {product.badge === 'sale' && product.originalPrice && (
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#D99A2B] text-[#14110F] px-2 py-0.5 rounded-sm">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
              </span>
            )}
            {product.badge === 'bestseller' && (
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#14110F] text-white px-2 py-0.5 rounded-sm">
                Best Seller
              </span>
            )}
          </div>
        )}

        {/* Desktop Quick-View Overlay Action */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(product);
            }}
            className="w-full py-2 px-3 text-xs font-semibold text-[#14110F] bg-white/95 hover:bg-white backdrop-blur-xs rounded shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#0E5A6B]" />
            <span>{t.product.viewDetails}</span>
          </button>
        </div>
      </div>

      {/* Card Info Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: unboxed clean text with bullet separators */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#14110F]/60 truncate mb-1">
            <span className="capitalize">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.pieces}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{fabric}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-[#14110F] line-clamp-1 group-hover:text-[#0E5A6B] transition-colors">
            {title}
          </h3>

          {/* Price baseline: Western digits formatted with tabular-nums as per spec */}
          <div className="mt-1.5 flex items-baseline gap-2 tabular-nums">
            <span className="text-sm sm:text-base font-bold text-[#0E5A6B]">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#14110F]/45 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Quick-add size chips */}
        <div className="mt-3 pt-2.5 border-t border-[#14110F]/8">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#14110F]/50">
              {product.type === 'unstitched' ? 'Type' : 'Sizes'}
            </span>
            <span className="text-[10px] text-[#0E5A6B] font-medium hidden sm:inline">
              Quick Add
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.sizes.map((s) => {
              const isOutOfStock = s.stock <= 0;
              const isSelected = selectedSize === s.size;
              return (
                <button
                  key={s.size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={(e) => {
                    setSelectedSize(s.size);
                    handleQuickAdd(e, s.size);
                  }}
                  className={`text-[10px] font-medium px-2 py-1 rounded transition-colors ${
                    isOutOfStock
                      ? 'text-[#14110F]/30 bg-[#14110F]/5 line-through cursor-not-allowed'
                      : isSelected && isRecentlyAdded
                      ? 'bg-[#0E5A6B] text-white font-semibold'
                      : 'bg-white hover:bg-[#0E5A6B] hover:text-white text-[#14110F]/80 border border-[#14110F]/10'
                  }`}
                  title={isOutOfStock ? 'Sold out' : `Add ${s.size} to bag`}
                >
                  {s.size}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
