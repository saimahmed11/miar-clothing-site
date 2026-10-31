import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase().trim();
        return (
          p.titleEn.toLowerCase().includes(q) ||
          p.titleUr.includes(q) ||
          p.fabricEn.toLowerCase().includes(q) ||
          p.fabricUr.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.colorEn.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative max-w-2xl mx-auto mt-16 px-4 z-10">
        <div className="bg-[#FAF6F0] rounded-xl shadow-2xl overflow-hidden border border-[#14110F]/15">
          {/* Search Input Bar */}
          <div className="p-4 bg-white flex items-center gap-3 border-b border-[#14110F]/10">
            <Search className="w-5 h-5 text-[#0E5A6B] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, fabric (e.g. linen, lawn, silk) or SKU..."
              className="w-full text-sm bg-transparent border-none focus:outline-none text-[#14110F] placeholder:text-[#14110F]/40"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-[#14110F]/40 hover:text-[#14110F] px-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-[#14110F]/60 hover:text-[#14110F] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick suggestions tags */}
          {!query && (
            <div className="p-4 text-xs text-[#14110F]/70 border-b border-[#14110F]/8 bg-[#F4EDE2]/50">
              <span className="font-semibold text-[#14110F] block mb-2">
                Popular Searches:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Clifton Linen', 'Unstitched Festive Lawn', 'Mens Kurta', 'Saddar Raw Silk'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 rounded bg-white border border-[#14110F]/10 text-[#0E5A6B] hover:border-[#0E5A6B] transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-2">
            {query && filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#14110F]/60">
                No matching pieces found for "{query}". Try "linen", "unstitched", or "pret".
              </div>
            ) : (
              filtered.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleSelect(prod)}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white hover:bg-[#E8DFD0]/40 border border-[#14110F]/6 cursor-pointer transition-colors"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.titleEn}
                    className="w-14 h-16 object-cover rounded bg-[#E8DFD0] shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-start">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#14110F] truncate">
                      {language === 'ur' ? prod.titleUr : prod.titleEn}
                    </h4>
                    <p className="text-[11px] text-[#14110F]/60">
                      {prod.category} · {language === 'ur' ? prod.fabricUr : prod.fabricEn}
                    </p>
                    <span className="text-xs font-bold text-[#0E5A6B] tabular-nums mt-0.5 block">
                      Rs. {prod.price.toLocaleString()}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0E5A6B] shrink-0 rtl:rotate-180" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
