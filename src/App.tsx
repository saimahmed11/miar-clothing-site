import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { PRODUCTS } from './data/products';
import { Product, Category, Order } from './types';

// Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryTiles } from './components/CategoryTiles';
import { ProductCard } from './components/ProductCard';
import { KarachiEditorialBand } from './components/KarachiEditorialBand';
import { TrustStrip } from './components/TrustStrip';
import { ReviewsSection } from './components/ReviewsSection';
import { WhatsAppOrderBanner } from './components/WhatsAppOrderBanner';
import { Footer } from './components/Footer';

// Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { PackingSlipModal } from './components/PackingSlipModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { SearchDrawer } from './components/SearchDrawer';

import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

function Storefront() {
  const { language, t } = useLanguage();

  // Active category filter & sorting
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'bestseller'>('newest');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Modals & overlays state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackedOrderNum, setTrackedOrderNum] = useState<string>('');
  const [slipOrder, setSlipOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'bestseller') return (a.bestSellerRank || 99) - (b.bestSellerRank || 99);
    return 0; // newest
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Best seller spotlight items (Rank 1 to 4)
  const bestSellers = [...PRODUCTS]
    .sort((a, b) => (a.bestSellerRank || 99) - (b.bestSellerRank || 99))
    .slice(0, 4);

  const handleShopNewArrivals = () => {
    setActiveCategory('all');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreLookbook = () => {
    const el = document.getElementById('lookbook');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
  };

  const handleTrackFromConfirmation = (orderNum: string) => {
    setConfirmedOrder(null);
    setTrackedOrderNum(orderNum);
    setIsTrackOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EDE2] text-[#14110F]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setVisibleCount(6);
        }}
      />

      <main className="flex-1">
        {/* 3. Hero Moment with Animated Nastaliq SVG Wordmark */}
        <Hero
          onShopClick={handleShopNewArrivals}
          onExploreLookbook={handleExploreLookbook}
        />

        {/* 4. Shop By Category Tiles */}
        <CategoryTiles
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setVisibleCount(6);
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. Main Catalog & Listing Section */}
        <section id="catalog-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header & Interactive Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#14110F]/10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0E5A6B]">
                Miar Collection 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-garamond font-bold text-[#14110F] mt-0.5">
                {activeCategory === 'pret'
                  ? t.categories.pretTitle
                  : activeCategory === 'unstitched'
                  ? t.categories.unstitchedTitle
                  : activeCategory === 'mens'
                  ? t.categories.mensTitle
                  : t.filters.all}
              </h2>
            </div>

            {/* Filter Tabs & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Segmented Buttons */}
              <div className="flex items-center p-1 bg-[#E8DFD0] rounded-lg">
                {[
                  { id: 'all' as Category, label: t.filters.all },
                  { id: 'pret' as Category, label: t.filters.pret },
                  { id: 'unstitched' as Category, label: t.filters.unstitched },
                  { id: 'mens' as Category, label: t.filters.mens },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setVisibleCount(6);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                      activeCategory === tab.id
                        ? 'bg-white text-[#0E5A6B] shadow-xs'
                        : 'text-[#14110F]/70 hover:text-[#14110F]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 text-xs bg-white border border-[#14110F]/15 rounded-lg px-2.5 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#0E5A6B]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none focus:outline-none text-[#14110F] font-medium cursor-pointer"
                >
                  <option value="newest">{t.filters.sortNewest}</option>
                  <option value="bestseller">{t.filters.sortPopular}</option>
                  <option value="price_asc">{t.filters.sortPriceAsc}</option>
                  <option value="price_desc">{t.filters.sortPriceDesc}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid: 2-column on mobile, 3/4-column on desktop as per spec */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>

          {/* Load More Button instead of infinite scroll so footer remains reachable */}
          {visibleCount < filteredProducts.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white hover:bg-[#FAF6F0] text-[#14110F] text-xs font-semibold border border-[#14110F]/20 rounded-md shadow-xs transition-colors"
              >
                <span>Load More Pieces</span>
                <span className="text-[#0E5A6B]">
                  ({filteredProducts.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}
        </section>

        {/* 6. Karachi Editorial Story Band */}
        <KarachiEditorialBand onExploreLookbook={handleExploreLookbook} />

        {/* 7. Best Sellers Strip */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#14110F]/10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0E5A6B]">
                Customer Favorites
              </span>
              <h3 className="text-xl sm:text-2xl font-garamond font-bold text-[#14110F] mt-0.5">
                Best Sellers in Karachi
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSortBy('bestseller');
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs text-[#0E5A6B] hover:underline font-semibold"
            >
              View All Ranked
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewProduct={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        </section>

        {/* 8. Trust Strip (COD, Exchange, Couriers, Support) */}
        <TrustStrip />

        {/* 9. Reviews & Real Karachi Community */}
        <ReviewsSection />

        {/* 10. Direct Order-on-WhatsApp Banner */}
        <WhatsAppOrderBanner />
      </main>

      {/* 11. Footer */}
      <Footer
        onOpenTrack={() => setIsTrackOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* OVERLAYS & MODALS */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        allProducts={PRODUCTS}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 1-Minute Frictionless Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleTrackFromConfirmation}
        onViewPackingSlip={(o) => {
          setConfirmedOrder(null);
          setSlipOrder(o);
        }}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        initialOrderNumber={trackedOrderNum}
        onClose={() => {
          setIsTrackOpen(false);
          setTrackedOrderNum('');
        }}
      />

      {/* Packing Slip / Airway Bill */}
      <PackingSlipModal
        order={slipOrder}
        onClose={() => setSlipOrder(null)}
      />

      {/* Admin Portal */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onViewPackingSlip={(o) => setSlipOrder(o)}
      />

      {/* Fast Search Drawer */}
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <OrderProvider>
          <Storefront />
        </OrderProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
