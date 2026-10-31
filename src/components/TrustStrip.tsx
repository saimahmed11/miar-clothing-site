import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Banknote, RefreshCw, Truck, MessageCircle } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const { t } = useLanguage();

  const trustPromises = [
    {
      icon: Banknote,
      title: t.trust.codTitle,
      desc: t.trust.codDesc,
    },
    {
      icon: RefreshCw,
      title: t.trust.exchangeTitle,
      desc: t.trust.exchangeDesc,
    },
    {
      icon: Truck,
      title: t.trust.courierTitle,
      desc: t.trust.courierDesc,
    },
    {
      icon: MessageCircle,
      title: t.trust.supportTitle,
      desc: t.trust.supportDesc,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F4EDE2] border-b border-[#14110F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {trustPromises.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-lg bg-white/60 border border-[#14110F]/6 text-start"
              >
                <div className="p-2.5 rounded-md bg-[#0E5A6B]/10 text-[#0E5A6B] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#14110F]">{item.title}</h4>
                  <p className="text-xs text-[#14110F]/70 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
