import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface KarachiEditorialBandProps {
  onExploreLookbook: () => void;
}

export const KarachiEditorialBand: React.FC<KarachiEditorialBandProps> = ({
  onExploreLookbook,
}) => {
  const { language, t } = useLanguage();

  return (
    <section id="lookbook" className="py-14 sm:py-20 bg-[#FAF6F0] border-y border-[#14110F]/8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Visual: Saddar heritage architecture */}
          <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-[#E8DFD0] aspect-[16/10] shadow-md group">
            <img
              src="/src/assets/images/karachi_editorial_story_1793441563481.jpg"
              alt="Old Karachi Saddar Colonial Stone Architecture at Golden Dusk"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex justify-between items-end">
              <div>
                <span className="font-semibold text-[#D99A2B] uppercase tracking-widest text-[10px]">
                  Karachi Heritage Campaign
                </span>
                <p className="font-medium text-white/90">
                  Mansfield Street, Saddar & The Clifton Seaboard
                </p>
              </div>
              <span className="text-[10px] text-white/70 font-mono">24.8607° N, 67.0011° E</span>
            </div>
          </div>

          {/* Brand Manifesto Prose */}
          <div className="lg:col-span-5 space-y-5 text-start">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0E5A6B]">
              <Sparkles className="w-3.5 h-3.5 text-[#0E5A6B]" />
              <span>{t.brandTagline}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-garamond font-normal text-[#14110F] leading-tight">
              {t.editorial.title}
            </h2>

            <blockquote className="text-sm sm:text-base text-[#14110F]/85 italic leading-relaxed pl-4 rtl:pl-0 rtl:pr-4 border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#0E5A6B]">
              {t.editorial.quote}
            </blockquote>

            <p className="text-xs text-[#14110F]/60 font-semibold tracking-wide uppercase">
              {t.editorial.author}
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreLookbook}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E5A6B] hover:bg-[#083742] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
              >
                <span>{t.editorial.exploreBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
