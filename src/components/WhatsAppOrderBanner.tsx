import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { MessageCircle, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export const WhatsAppOrderBanner: React.FC = () => {
  const { t } = useLanguage();
  const { generateWhatsAppOrderUrl } = useCart();

  return (
    <section className="py-12 bg-[#0E5A6B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#083742] rounded-xl p-6 sm:p-10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-start max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/10 text-xs font-semibold text-[#D99A2B]">
              <Clock className="w-3.5 h-3.5" />
              <span>Response in &lt; 5 minutes</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-garamond font-bold text-white">
              {t.whatsappBanner.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {t.whatsappBanner.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={generateWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-md bg-[#FAF6F0] hover:bg-white text-[#14110F] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#0E5A6B]" />
              <span>{t.whatsappBanner.btn}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
