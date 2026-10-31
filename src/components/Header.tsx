import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { MiarWordmark } from './MiarWordmark';
import { ShoppingBag, Search, MessageCircle, Menu, X, PackageCheck, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenTrack,
  onOpenAdmin,
  onSelectCategory,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.newArrivals, category: 'all' },
    { label: t.nav.stitchedPret, category: 'pret' },
    { label: t.nav.unstitched, category: 'unstitched' },
    { label: t.nav.menswear, category: 'mens' },
    { label: t.nav.lookbook, href: '#lookbook' },
  ];

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setMobileMenuOpen(false);
    if (link.category) {
      onSelectCategory(link.category);
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.href) {
      const el = document.querySelector(link.href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F4EDE2]/95 backdrop-blur-md border-b border-[#14110F]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 sm:gap-8">
          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -m-2 text-[#14110F] hover:text-[#0E5A6B] transition-colors focus-visible:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={onOpenSearch}
              className="p-2 -m-2 text-[#14110F] hover:text-[#0E5A6B] transition-colors focus-visible:outline-none"
              aria-label="Search collection"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Zone 1: Wordmark */}
          <a
            href="/"
            className="flex items-center focus-visible:outline-none group shrink-0"
            aria-label="Miar Home"
          >
            <MiarWordmark size="md" color="#0E5A6B" />
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-[#14110F]/80">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link)}
                className="whitespace-nowrap transition-colors hover:text-[#0E5A6B] relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-[#0E5A6B] after:transition-all"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Desktop Search */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-[#14110F]/80 hover:text-[#0E5A6B] hover:bg-[#E8DFD0]/50 transition-colors"
              aria-label="Search pieces"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
            </button>

            {/* Language Toggle: EN | اردو */}
            <button
              onClick={toggleLanguage}
              className="flex items-center px-2 py-1 rounded border border-[#14110F]/15 text-xs font-semibold hover:border-[#0E5A6B] hover:text-[#0E5A6B] transition-colors"
              aria-label="Switch language between English and Urdu"
              title="Switch language between English and Urdu"
            >
              <span className={language === 'en' ? 'text-[#0E5A6B]' : 'text-[#14110F]/50'}>
                EN
              </span>
              <span className="mx-1 text-[#14110F]/30">|</span>
              <span className={language === 'ur' ? 'text-[#0E5A6B]' : 'text-[#14110F]/50'}>
                اردو
              </span>
            </button>

            {/* WhatsApp direct order / query */}
            <a
              href="https://wa.me/923001234567?text=Salaam%20Miar%20Karachi!%20I%20have%20an%20inquiry%20about%20your%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#14110F]/80 hover:text-[#0E5A6B] hover:bg-[#E8DFD0]/50 rounded transition-colors"
              aria-label="Chat on WhatsApp"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </a>

            {/* Track Order trigger */}
            <button
              onClick={onOpenTrack}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#14110F]/80 hover:text-[#0E5A6B] transition-colors"
              title={t.nav.trackOrder}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">{t.nav.trackOrder}</span>
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center p-2 rounded-lg bg-[#0E5A6B] text-white hover:bg-[#083742] transition-colors shadow-xs"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D99A2B] text-[#14110F] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#F4EDE2]">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#F4EDE2] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#14110F]/10">
                <MiarWordmark size="sm" color="#0E5A6B" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#14110F]/70 hover:text-[#14110F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                {navLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(link)}
                    className="block w-full text-start py-2 text-base font-medium text-[#14110F] hover:text-[#0E5A6B] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}

                <div className="pt-4 border-t border-[#14110F]/10 space-y-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenTrack();
                    }}
                    className="flex items-center gap-2 w-full text-start py-2 text-sm text-[#14110F]/80 hover:text-[#0E5A6B]"
                  >
                    <PackageCheck className="w-4 h-4 text-[#0E5A6B]" />
                    <span>{t.nav.trackOrder}</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="flex items-center gap-2 w-full text-start py-2 text-sm text-[#14110F]/80 hover:text-[#0E5A6B]"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#0E5A6B]" />
                    <span>{t.nav.admin}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#14110F]/10 text-xs text-[#14110F]/60">
              <p className="font-medium text-[#14110F]">{t.brandTagline}</p>
              <p className="mt-1">{t.taglineSubtitle}</p>
              <p className="mt-2 text-[#0E5A6B]">Studio WhatsApp: +92 300 1234567</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
