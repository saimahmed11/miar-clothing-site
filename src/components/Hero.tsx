import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MiarWordmark } from './MiarWordmark';
import { ArrowRight, RotateCw, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onExploreLookbook: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onExploreLookbook }) => {
  const { language, t } = useLanguage();
  const [isDrawing, setIsDrawing] = useState(true);
  const [animKey, setAnimKey] = useState(1);

  const handleSkip = () => {
    setIsDrawing(false);
  };

  const handleReplay = () => {
    setIsDrawing(true);
    setAnimKey((k) => k + 1);
  };

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[680px] flex items-center justify-center overflow-hidden bg-[#14110F]">
      {/* Background Campaign Photography with measured gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_karachi_coastal_1793441562807.jpg"
          alt="Miar Clifton Beach Karachi Luxury Apparel Campaign"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.04]"
          referrerPolicy="no-referrer"
        />
        {/* Measured scrim to ensure 4.5:1 text contrast while preserving coastal sunlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/90 via-[#14110F]/45 to-black/30" />
      </div>

      {/* Floating subtle micro-control for animation skip/replay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {isDrawing ? (
          <button
            onClick={handleSkip}
            className="text-[11px] font-medium text-[#FAF6F0]/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded transition-colors"
          >
            {t.hero.skipAnimation}
          </button>
        ) : (
          <button
            onClick={handleReplay}
            className="flex items-center gap-1 text-[11px] font-medium text-[#FAF6F0]/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded transition-colors"
            title={t.hero.replayAnimation}
          >
            <RotateCw className="w-3 h-3" />
            <span className="hidden sm:inline">{t.hero.replayAnimation}</span>
          </button>
        )}
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center py-16 lg:py-24">
        {/* Small location/heritage note */}
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#D99A2B] mb-4">
          <Sparkles className="w-3 h-3 text-[#D99A2B]" />
          <span>Clifton Coast · Karachi 2026</span>
        </div>

        {/* The Hero Moment: Self-Drawing Outlined Nastaliq SVG Wordmark */}
        <div key={animKey} className="py-2 mb-2">
          <MiarWordmark
            size="hero"
            color="#FAF6F0"
            animated={isDrawing}
            showLatin={false}
            onAnimationEnd={() => setIsDrawing(false)}
          />
        </div>

        {/* Latin brand companion */}
        <div className="text-xs font-semibold tracking-[0.35em] text-[#FAF6F0]/75 uppercase mb-6">
          MIAR · EST. KARACHI
        </div>

        {/* Tagline & Subheading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-garamond text-white font-normal tracking-wide text-balance max-w-2xl">
          {t.hero.tagline}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-[#FAF6F0]/90 font-normal max-w-xl leading-relaxed text-balance">
          {t.hero.subheading}
        </p>

        {/* Action Button: 1 Primary CTA as per spec */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <button
            onClick={onShopClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-[#14110F] bg-[#FAF6F0] hover:bg-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>{t.hero.cta}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={onExploreLookbook}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-[#FAF6F0] hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/20 rounded-md transition-colors"
          >
            <span>{t.hero.exploreLookbook}</span>
          </button>
        </div>

        {/* Subtle trust pill in hero bottom */}
        <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6 text-xs text-[#FAF6F0]/75">
          <span>Cash on Delivery</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span>Same-Day Karachi</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span>Order in 60s</span>
        </div>
      </div>
    </section>
  );
};
