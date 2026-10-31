import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { PAKISTAN_CITIES } from '../data/cities';
import { PaymentMethod, Order } from '../types';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { language, t } = useLanguage();
  const {
    items,
    subtotal,
    discountAmount,
    promoCode,
    hasFreeShipping,
    clearCart,
  } = useCart();
  const { createOrder } = useOrders();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express_karachi'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Error validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Pakistani phone validation: e.g. 03001234567 or +923001234567
  const validatePhone = (num: string): boolean => {
    const cleaned = num.replace(/[\s-]/g, '');
    const regex = /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/;
    return regex.test(cleaned);
  };

  const deliveryFee =
    deliveryMethod === 'express_karachi'
      ? 400
      : hasFreeShipping
      ? 0
      : items.length > 0
      ? 250
      : 0;

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567)';
    }
    if (!address.trim() || address.trim().length < 8) {
      newErrors.address = 'Please provide complete house/street address for accurate courier delivery';
    }
    if (!area.trim()) {
      newErrors.area = 'Please mention your sector, area, or block';
    }
    if (!landmark.trim()) {
      newErrors.landmark = 'Nearest landmark helps prevent failed courier delivery attempts';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customer: {
          fullName,
          phone,
          email: email || undefined,
          city,
          area,
          address,
          landmark,
          notes: notes || undefined,
        },
        items,
        subtotal,
        deliveryFee,
        deliveryMethod,
        discountAmount,
        discountCode: promoCode || undefined,
        total,
        paymentMethod,
      });

      clearCart();
      setIsSubmitting(false);
      onOrderSuccess(order);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] rounded-xl shadow-2xl z-10 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#14110F]/10 bg-[#F4EDE2] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-garamond font-bold text-[#14110F]">
              {t.checkout.title}
            </h2>
            <p className="text-xs text-[#14110F]/65">{t.checkout.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#14110F]/60 hover:text-[#14110F] hover:bg-[#E8DFD0]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: The Input Steps */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Contact Information */}
              <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#14110F]/10 space-y-3.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E5A6B]">
                  {t.checkout.contactStep}
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-[#14110F] mb-1">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ayesha Mansoor"
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-[#B5543A] mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#14110F] mb-1">
                      {t.checkout.phone} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-[#B5543A] mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14110F] mb-1">
                      {t.checkout.emailOptional}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Details */}
              <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#14110F]/10 space-y-3.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E5A6B]">
                  {t.checkout.shippingStep}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#14110F] mb-1">
                      {t.checkout.city} *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.nameEn} value={c.nameEn}>
                          {language === 'ur' ? c.nameUr : c.nameEn} ({c.province})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14110F] mb-1">
                      Area / Sector *
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Clifton Block 4, DHA Phase 5"
                      className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                    />
                    {errors.area && (
                      <p className="text-[11px] text-[#B5543A] mt-1">{errors.area}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14110F] mb-1">
                    {t.checkout.address} *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Apartment #, Building Name, Street #"
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                  />
                  {errors.address && (
                    <p className="text-[11px] text-[#B5543A] mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14110F] mb-1">
                    {t.checkout.landmark} *
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Behind Ocean Mall, Near BBQ Tonight"
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                  />
                  {errors.landmark && (
                    <p className="text-[11px] text-[#B5543A] mt-1">{errors.landmark}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14110F] mb-1">
                    {t.checkout.deliveryNotes}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please deliver after 3pm or call upon arrival"
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded border border-[#14110F]/20 bg-[#FAF6F0] text-[#14110F] focus:border-[#0E5A6B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 3: Shipping Method */}
              <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#14110F]/10 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E5A6B]">
                  {t.checkout.deliveryStep}
                </h3>

                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      deliveryMethod === 'standard'
                        ? 'border-[#0E5A6B] bg-[#0E5A6B]/5'
                        : 'border-[#14110F]/15'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="mt-0.5 text-[#0E5A6B] focus:ring-[#0E5A6B]"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between font-semibold text-[#14110F]">
                        <span>Standard Courier (Trax / TCS / Leopards)</span>
                        <span>{hasFreeShipping ? 'FREE' : 'Rs. 250'}</span>
                      </div>
                      <p className="text-[#14110F]/65 mt-0.5">
                        2 to 4 business days nationwide. Free on orders above Rs. 6,500.
                      </p>
                    </div>
                  </label>

                  {city === 'Karachi' && (
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        deliveryMethod === 'express_karachi'
                          ? 'border-[#0E5A6B] bg-[#0E5A6B]/5'
                          : 'border-[#14110F]/15'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'express_karachi'}
                        onChange={() => setDeliveryMethod('express_karachi')}
                        className="mt-0.5 text-[#0E5A6B] focus:ring-[#0E5A6B]"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex justify-between font-semibold text-[#0E5A6B]">
                          <span>Karachi Express Same-Day / Next-Day</span>
                          <span>Rs. 400</span>
                        </div>
                        <p className="text-[#14110F]/65 mt-0.5">
                          Dispatched directly via dedicated rider across Clifton, DHA, PECHS, Gulshan & Saddar.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="bg-white p-4 sm:p-5 rounded-lg border border-[#14110F]/10 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E5A6B]">
                  {t.checkout.paymentStep}
                </h3>

                <div className="space-y-2.5">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#0E5A6B] bg-[#0E5A6B]/5 shadow-xs'
                        : 'border-[#14110F]/15'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#0E5A6B] focus:ring-[#0E5A6B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#0E5A6B]" />
                        <span className="text-xs sm:text-sm font-bold text-[#14110F]">
                          {t.checkout.cod} (Pre-selected)
                        </span>
                      </div>
                      <p className="text-xs text-[#14110F]/70 mt-1">{t.checkout.codDesc}</p>
                    </div>
                  </label>

                  {/* JazzCash / Easypaisa */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'jazzcash'
                        ? 'border-[#0E5A6B] bg-[#0E5A6B]/5 shadow-xs'
                        : 'border-[#14110F]/15'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="mt-1 text-[#0E5A6B] focus:ring-[#0E5A6B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#0E5A6B]" />
                        <span className="text-xs sm:text-sm font-bold text-[#14110F]">
                          {t.checkout.jazzcash}
                        </span>
                      </div>
                      <p className="text-xs text-[#14110F]/70 mt-1">{t.checkout.jazzcashDesc}</p>
                    </div>
                  </label>

                  {/* Direct Bank Transfer / Raast */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#0E5A6B] bg-[#0E5A6B]/5 shadow-xs'
                        : 'border-[#14110F]/15'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-1 text-[#0E5A6B] focus:ring-[#0E5A6B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#0E5A6B]" />
                        <span className="text-xs sm:text-sm font-bold text-[#14110F]">
                          {t.checkout.bankTransfer}
                        </span>
                      </div>
                      <p className="text-xs text-[#14110F]/70 mt-1">
                        {t.checkout.bankTransferDesc}
                      </p>
                    </div>
                  </label>

                  {/* Debit / Credit Card */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#0E5A6B] bg-[#0E5A6B]/5 shadow-xs'
                        : 'border-[#14110F]/15'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 text-[#0E5A6B] focus:ring-[#0E5A6B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#0E5A6B]" />
                        <span className="text-xs sm:text-sm font-bold text-[#14110F]">
                          {t.checkout.card}
                        </span>
                      </div>
                      <p className="text-xs text-[#14110F]/70 mt-1">{t.checkout.cardDesc}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Live Order Summary & Submit */}
            <div className="lg:col-span-5">
              <div className="sticky top-4 bg-[#F4EDE2] p-5 rounded-lg border border-[#14110F]/10 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#14110F]">
                  {t.checkout.orderSummary}
                </h3>

                {/* Compact item list */}
                <div className="max-h-56 overflow-y-auto divide-y divide-[#14110F]/8 text-xs">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.titleEn}
                        className="w-12 h-14 object-cover rounded bg-[#E8DFD0] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#14110F] truncate">
                          {language === 'ur' ? item.product.titleUr : item.product.titleEn}
                        </p>
                        <p className="text-[11px] text-[#14110F]/60">
                          Qty: {item.quantity} · {item.selectedSize}
                        </p>
                      </div>
                      <span className="font-bold text-[#0E5A6B] tabular-nums">
                        Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-[#14110F]/80 pt-3 border-t border-[#14110F]/10">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-medium tabular-nums text-[#14110F]">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#0E5A6B]">
                      <span>{t.cart.discount}</span>
                      <span className="tabular-nums">-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t.cart.delivery}</span>
                    <span className="tabular-nums font-medium">
                      {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#14110F] pt-2 border-t border-[#14110F]/10">
                    <span>Total Due</span>
                    <span className="text-[#0E5A6B] tabular-nums">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security and Terms notice */}
                <p className="text-[11px] text-[#14110F]/65 leading-relaxed bg-white/70 p-3 rounded">
                  {t.checkout.guaranteeNotice}
                </p>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#0E5A6B] hover:bg-[#083742] text-white font-bold text-sm rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>{t.checkout.placingOrder}</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {t.checkout.placeOrder} · Rs. {total.toLocaleString()}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
