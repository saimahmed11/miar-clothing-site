import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MiarWordmark } from './MiarWordmark';
import {
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
  Check,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface FooterProps {
  onOpenTrack: () => void;
  onOpenSizeGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTrack,
  onOpenSizeGuide,
  onOpenAdmin,
}) => {
  const { language, t } = useLanguage();
  const [phoneInput, setPhoneInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setSubscribed(true);
    setPhoneInput('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#14110F] text-[#FAF6F0] pt-14 pb-8 border-t border-[#FAF6F0]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand Wordmark & Story (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-start">
            <MiarWordmark size="md" color="#FAF6F0" />
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>
            <div className="space-y-1.5 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D99A2B]" />
                <span>Marine Drive, Clifton Block 4, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0E5A6B]" />
                <span>+92 300 1234567 (Mon-Sat, 11 AM - 8 PM PKT)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0E5A6B]" />
                <span>atelier@miar.pk</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-start">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99A2B]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  {t.nav.newArrivals}
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  {t.nav.stitchedPret}
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  {t.nav.unstitched}
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  {t.nav.menswear}
                </a>
              </li>
              <li>
                <a href="#lookbook" className="hover:text-white transition-colors">
                  {t.nav.lookbook}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-start">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99A2B]">
              {t.footer.help}
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={onOpenTrack}
                  className="hover:text-white transition-colors text-start"
                >
                  {t.nav.trackOrder}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSizeGuide}
                  className="hover:text-white transition-colors text-start"
                >
                  {t.footer.sizeChart}
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/923001234567?text=Salaam%20Miar!%20I%20have%20an%20inquiry%20about%20exchanges."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t.footer.exchangePolicy}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#D99A2B] transition-colors text-start text-[11px] text-white/40"
                >
                  Store Admin Ops
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: VIP WhatsApp Drop List (4 cols) */}
          <div className="lg:col-span-4 space-y-3 text-start">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D99A2B]">
              {t.footer.whatsappVip}
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              {t.footer.vipDesc}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  className="flex-1 py-2 px-3 text-xs rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#0E5A6B]"
                />
                <button
                  type="submit"
                  className="py-2 px-3.5 bg-[#0E5A6B] hover:bg-[#18778C] text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
                >
                  {t.footer.subscribeBtn}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.footer.subscribedMsg}</span>
                </p>
              )}
            </form>

            <div className="pt-2 flex items-center gap-3 text-white/60">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment & Logistics Badges */}
        <div className="pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px]">
            <span className="font-semibold text-white/80">Payments:</span>
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>JazzCash</span>
            <span>·</span>
            <span>Easypaisa</span>
            <span>·</span>
            <span>Raast Instant</span>
            <span>·</span>
            <span>Visa / Mastercard</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px]">
            <span className="font-semibold text-white/80">Courier Partners:</span>
            <span className="text-[#FAF6F0]">Trax Express</span>
            <span>·</span>
            <span className="text-[#FAF6F0]">TCS</span>
            <span>·</span>
            <span className="text-[#FAF6F0]">Leopards</span>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} Miar (میار). {t.footer.rights}</p>
          <p>Karachi ka andaaz · Karachi dressing up</p>
        </div>
      </div>
    </footer>
  );
};
