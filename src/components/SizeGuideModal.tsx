import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  const sizeDataInches = [
    { size: 'XS', bust: '36', waist: '32', hips: '38', length: '44', shoulder: '14' },
    { size: 'S', bust: '38', waist: '34', hips: '40', length: '45', shoulder: '14.5' },
    { size: 'M', bust: '40', waist: '36', hips: '42', length: '46', shoulder: '15' },
    { size: 'L', bust: '43', waist: '39', hips: '45', length: '46', shoulder: '15.5' },
    { size: 'XL', bust: '46', waist: '42', hips: '48', length: '47', shoulder: '16.5' },
  ];

  const sizeDataCm = sizeDataInches.map((row) => ({
    size: row.size,
    bust: (parseFloat(row.bust) * 2.54).toFixed(0),
    waist: (parseFloat(row.waist) * 2.54).toFixed(0),
    hips: (parseFloat(row.hips) * 2.54).toFixed(0),
    length: (parseFloat(row.length) * 2.54).toFixed(0),
    shoulder: (parseFloat(row.shoulder) * 2.54).toFixed(1),
  }));

  const activeData = unit === 'inches' ? sizeDataInches : sizeDataCm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FAF6F0] rounded-xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#14110F]/10">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#0E5A6B]" />
            <h3 className="text-xl font-garamond font-bold text-[#14110F]">
              {t.sizeGuide.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#14110F]/60 hover:text-[#14110F] hover:bg-[#E8DFD0]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle: Inches vs Centimeters */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#14110F]/70 max-w-sm">
            {t.sizeGuide.note}
          </p>

          <div className="flex items-center p-1 bg-[#E8DFD0] rounded-md shrink-0">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                unit === 'inches'
                  ? 'bg-white text-[#0E5A6B] shadow-xs'
                  : 'text-[#14110F]/70 hover:text-[#14110F]'
              }`}
            >
              {t.sizeGuide.unitInches}
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                unit === 'cm'
                  ? 'bg-white text-[#0E5A6B] shadow-xs'
                  : 'text-[#14110F]/70 hover:text-[#14110F]'
              }`}
            >
              {t.sizeGuide.unitCm}
            </button>
          </div>
        </div>

        {/* Table of measurements */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#14110F]/15 text-xs uppercase tracking-wider text-[#14110F]/60 font-semibold bg-[#E8DFD0]/40">
                <th className="py-2.5 px-3">{t.sizeGuide.columns.size}</th>
                <th className="py-2.5 px-3">{t.sizeGuide.columns.bust}</th>
                <th className="py-2.5 px-3">{t.sizeGuide.columns.waist}</th>
                <th className="py-2.5 px-3">{t.sizeGuide.columns.hips}</th>
                <th className="py-2.5 px-3">{t.sizeGuide.columns.length}</th>
                <th className="py-2.5 px-3">{t.sizeGuide.columns.shoulder}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14110F]/10 tabular-nums">
              {activeData.map((row) => (
                <tr key={row.size} className="hover:bg-[#E8DFD0]/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#0E5A6B]">{row.size}</td>
                  <td className="py-3 px-3">{row.bust}</td>
                  <td className="py-3 px-3">{row.waist}</td>
                  <td className="py-3 px-3">{row.hips}</td>
                  <td className="py-3 px-3">{row.length}</td>
                  <td className="py-3 px-3">{row.shoulder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="mt-6 p-4 rounded-lg bg-[#E8DFD0]/50 text-xs text-[#14110F]/80 space-y-1.5">
          <p className="font-semibold text-[#14110F]">Tailoring Tip for Karachi Heat:</p>
          <p>
            Miar prêt pieces are tailored with a relaxed Pakistani standard fit. If you prefer a tailored slim silhouette, consider sizing one size down. All stitched trousers include soft elastic waistbands and interior drawstrings.
          </p>
        </div>
      </div>
    </div>
  );
};
