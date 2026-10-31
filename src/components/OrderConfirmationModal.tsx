import React from 'react';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MiarWordmark } from './MiarWordmark';
import {
  CheckCircle2,
  PackageCheck,
  MessageCircle,
  Printer,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
  onViewPackingSlip: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder,
  onViewPackingSlip,
}) => {
  const { language, t } = useLanguage();

  if (!order) return null;

  const generateWhatsAppConfirmationUrl = () => {
    const text = `Salaam Miar Karachi Studio! My order has just been placed on the site.\nOrder Number: *${order.orderNumber}*\nName: ${order.customer.fullName}\nCity: ${order.customer.city}\nAmount Due: Rs. ${order.total.toLocaleString()} (${order.paymentMethod.toUpperCase()})\n\nPlease share dispatch updates here on this WhatsApp. Shukriya!`;
    return `https://wa.me/923001234567?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FAF6F0] rounded-xl shadow-2xl z-10 max-h-[92vh] overflow-y-auto p-6 sm:p-8 text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1.5 rounded text-[#14110F]/60 hover:text-[#14110F]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Wordmark in Order Confirmation */}
        <div className="mb-4 flex justify-center">
          <MiarWordmark size="md" color="#0E5A6B" />
        </div>

        {/* Success Icon */}
        <div className="w-14 h-14 rounded-full bg-[#0E5A6B]/10 text-[#0E5A6B] flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-garamond font-bold text-[#14110F]">
          {t.orderConfirmation.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#14110F]/70 mt-1 max-w-md mx-auto">
          {t.orderConfirmation.tagline}
        </p>

        {/* Order Number Box */}
        <div className="my-6 p-4 rounded-lg bg-[#E8DFD0]/60 border border-[#14110F]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#14110F]/60 font-semibold block">
              {t.orderConfirmation.orderNumber}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-[#0E5A6B]">
              {order.orderNumber}
            </span>
          </div>

          <div className="text-xs text-end sm:text-right">
            <span className="text-[#14110F]/60 block">Total Payable:</span>
            <span className="text-lg font-bold text-[#14110F] tabular-nums">
              Rs. {order.total.toLocaleString()} ({order.paymentMethod.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Customer Address Recap */}
        <div className="p-4 bg-white rounded-lg border border-[#14110F]/10 text-xs text-start space-y-1 mb-6">
          <p className="font-bold text-[#14110F]">{order.customer.fullName}</p>
          <p className="text-[#14110F]/80">
            {order.customer.phone} · {order.customer.city}
          </p>
          <p className="text-[#14110F]/70">
            {order.customer.address}, {order.customer.area}
          </p>
          <p className="text-[#0E5A6B] font-medium">Landmark: {order.customer.landmark}</p>
        </div>

        {/* WhatsApp message alert */}
        <div className="p-3.5 rounded-lg bg-[#0E5A6B]/10 text-xs text-[#0E5A6B] text-start mb-6 flex items-start gap-2.5">
          <MessageCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.orderConfirmation.whatsAppNotice}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onTrackOrder(order.orderNumber)}
            className="py-3 px-4 bg-[#0E5A6B] hover:bg-[#083742] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <PackageCheck className="w-4 h-4" />
            <span>{t.orderConfirmation.trackOrderCta}</span>
          </button>

          <a
            href={generateWhatsAppConfirmationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-white border border-[#14110F]/20 hover:border-[#0E5A6B] text-[#14110F] hover:text-[#0E5A6B] text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-[#0E5A6B]" />
            <span>Confirm via WhatsApp</span>
          </a>

          <button
            onClick={() => onViewPackingSlip(order)}
            className="py-3 px-4 bg-[#E8DFD0] hover:bg-[#D5C8B5] text-[#14110F] text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t.orderConfirmation.printReceipt}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
