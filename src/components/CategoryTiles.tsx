import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Category } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryTilesProps {
  onSelectCategory: (category: Category) => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ onSelectCategory }) => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'pret' as Category,
      title: t.categories.pretTitle,
      desc: t.categories.pretDesc,
      image: '/images/product_stitched_pret_saddar_1793441562289.jpg',
      aspect: 'aspect-3/4',
    },
    {
      id: 'unstitched' as Category,
      title: t.categories.unstitchedTitle,
      desc: t.categories.unstitchedDesc,
      image: '/images/product_unstitched_festive_lawn_1793441562659.jpg',
      aspect: 'aspect-3/4',
    },
    {
      id: 'mens' as Category,
      title: t.categories.mensTitle,
      desc: t.categories.mensDesc,
      image: '/images/product_mens_kurta_linen_1793441563559.jpg',
      aspect: 'aspect-3/4',
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#14110F]/10 gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0E5A6B]">
            Miar Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-garamond text-[#14110F] mt-1">
            {t.categories.heading}
          </h2>
        </div>
        <p className="text-xs text-[#14110F]/60 max-w-xs">
          Authentic Karachi silhouettes tailored for everyday ease and celebratory gatherings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#E8DFD0] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/90 via-[#14110F]/30 to-transparent pointer-events-none" />

            {/* Content overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white flex items-end justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-garamond font-medium text-white group-hover:text-[#FAF6F0] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#FAF6F0]/80 mt-1 line-clamp-2 max-w-[85%] font-light">
                  {cat.desc}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#0E5A6B] group-hover:text-white transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4 rtl:rotate-90" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
