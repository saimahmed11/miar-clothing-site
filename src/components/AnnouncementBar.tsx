import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#0E5A6B] text-[#FAF6F0] text-xs font-medium py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="w-6 hidden sm:block" />
        <div className="flex-1 text-center truncate tracking-wide">
          <span>{t.announcement}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#FAF6F0]/70 hover:text-white p-1 rounded transition-colors focus-visible:outline-none"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
