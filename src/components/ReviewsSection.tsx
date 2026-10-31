import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star, CheckCircle, Instagram } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { t } = useLanguage();

  const customerTestimonials = [
    {
      name: 'Dr. Fatima Noor',
      city: 'Karachi (Gulshan-e-Iqbal)',
      piece: 'Clifton Sea Linen Pret Set · Medium',
      comment:
        'The fabric breathes effortlessly through Karachi humid summer afternoons. Ordered at 10 PM on WhatsApp, parcel arrived by 1 PM next afternoon with change ready for COD. Stitching is pure luxury.',
      rating: 5,
      date: '27 Oct 2026',
    },
    {
      name: 'Hamza Al-Karim',
      city: 'Islamabad (F-8/3)',
      piece: 'Karachi Dusk Mens Kurta · Large',
      comment:
        'Clean minimalist collar work without excessive bling. Raw khaddi cotton falls with a sharp drape. Trax delivery was fast and the packing box smelled like gentle jasmine attar.',
      rating: 5,
      date: '25 Oct 2026',
    },
    {
      name: 'Nida Jawaid',
      city: 'Karachi (PECHS Block 2)',
      piece: 'Coastal Twilight 3-Piece Unstitched',
      comment:
        'The woven jacquard texture and tissue silk dupatta were the highlight of our family dinner. The cut is very generous so my tailor had ample fabric for pleated balloon sleeves.',
      rating: 5,
      date: '22 Oct 2026',
    },
    {
      name: 'Sobia Tariq',
      city: 'Lahore (Model Town)',
      piece: 'Saddar Limestone Silk Suit · Small',
      comment:
        'The terracotta tone is stunning against candlelight. True to size according to their size chart. Will be ordering the festive collection drop next.',
      rating: 5,
      date: '18 Oct 2026',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF6F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#14110F]/10 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0E5A6B]">
              <Instagram className="w-3.5 h-3.5 text-[#0E5A6B]" />
              <span>@miar.official</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-garamond font-bold text-[#14110F] mt-1">
              {t.reviews.heading}
            </h2>
          </div>
          <p className="text-xs text-[#14110F]/65 max-w-sm">
            {t.reviews.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {customerTestimonials.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg bg-white border border-[#14110F]/8 flex flex-col justify-between text-start hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#D99A2B]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D99A2B]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#14110F]/45">{rev.date}</span>
                </div>

                <p className="text-xs text-[#14110F]/80 leading-relaxed italic mb-4">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-3 border-t border-[#14110F]/8">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#14110F]">{rev.name}</span>
                  <CheckCircle className="w-3 h-3 text-[#0E5A6B]" />
                </div>
                <p className="text-[11px] text-[#0E5A6B] font-medium mt-0.5">
                  {rev.city}
                </p>
                <p className="text-[10px] text-[#14110F]/55 mt-0.5 truncate">
                  {rev.piece}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
