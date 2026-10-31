import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrderContext';
import { Order, OrderStatus } from '../types';
import {
  X,
  Search,
  PackageCheck,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  initialOrderNumber?: string;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  initialOrderNumber = '',
  onClose,
}) => {
  const { language, t } = useLanguage();
  const { getOrder } = useOrders();

  const [orderNumInput, setOrderNumInput] = useState(initialOrderNumber || 'MIA-8492');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    return initialOrderNumber ? getOrder(initialOrderNumber) || null : getOrder('MIA-8492') || null;
  });
  const [searched, setSearched] = useState(true);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumInput.trim()) return;
    const found = getOrder(orderNumInput, phoneInput || undefined);
    setSearchedOrder(found || null);
    setSearched(true);
  };

  const pipelineStages: {
    key: OrderStatus;
    title: string;
    desc: string;
  }[] = [
    {
      key: 'new',
      title: t.track.pipeline.new,
      desc: t.track.pipeline.newDesc,
    },
    {
      key: 'confirmed',
      title: t.track.pipeline.confirmed,
      desc: t.track.pipeline.confirmedDesc,
    },
    {
      key: 'packed',
      title: t.track.pipeline.packed,
      desc: t.track.pipeline.packedDesc,
    },
    {
      key: 'dispatched',
      title: t.track.pipeline.dispatched,
      desc: t.track.pipeline.dispatchedDesc,
    },
    {
      key: 'delivered',
      title: t.track.pipeline.delivered,
      desc: t.track.pipeline.deliveredDesc,
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 0;
      case 'confirmed':
        return 1;
      case 'packed':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.status) : -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FAF6F0] rounded-xl shadow-2xl z-10 max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#14110F]/10">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#0E5A6B]" />
            <h3 className="text-xl font-garamond font-bold text-[#14110F]">
              {t.track.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#14110F]/60 hover:text-[#14110F] hover:bg-[#E8DFD0]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#14110F]/70 mt-3">{t.track.subtitle}</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-4 p-4 rounded-lg bg-white border border-[#14110F]/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#14110F] mb-1">
                {t.track.orderNumberLabel}
              </label>
              <input
                type="text"
                value={orderNumInput}
                onChange={(e) => setOrderNumInput(e.target.value)}
                placeholder="MIA-8492"
                className="w-full py-2 px-3 text-xs rounded border border-[#14110F]/20 uppercase focus:border-[#0E5A6B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#14110F] mb-1">
                {t.track.phoneLabel} (Optional)
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="0300 8273641"
                className="w-full py-2 px-3 text-xs rounded border border-[#14110F]/20 focus:border-[#0E5A6B] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#0E5A6B] hover:bg-[#083742] text-white text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.track.trackBtn}</span>
          </button>
        </form>

        {/* Search Results */}
        {searched && (
          <div className="mt-6">
            {searchedOrder ? (
              <div className="space-y-6">
                {/* Order Summary Strip */}
                <div className="p-4 rounded-lg bg-[#E8DFD0]/50 border border-[#14110F]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <div>
                    <span className="font-bold text-[#0E5A6B] text-sm">
                      {searchedOrder.orderNumber}
                    </span>
                    <span className="text-[#14110F]/60 ml-2">
                      ({searchedOrder.customer.city})
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="font-semibold text-[#14110F]">
                      Amount: Rs. {searchedOrder.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#14110F]/60 ml-2 uppercase">
                      [{searchedOrder.paymentMethod}]
                    </span>
                  </div>
                </div>

                {/* Vertical Step Timeline */}
                <div className="space-y-4">
                  {pipelineStages.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.key} className="flex gap-4 items-start relative">
                        {/* Connecting Line */}
                        {idx < pipelineStages.length - 1 && (
                          <div
                            className={`absolute top-6 left-3.5 rtl:left-auto rtl:right-3.5 w-0.5 h-10 transition-colors ${
                              idx < currentStageIndex ? 'bg-[#0E5A6B]' : 'bg-[#14110F]/15'
                            }`}
                          />
                        )}

                        {/* Step Icon */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                            isCompleted
                              ? 'bg-[#0E5A6B] text-white'
                              : 'bg-[#14110F]/10 text-[#14110F]/40'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-xs sm:text-sm font-bold ${
                                isCurrent
                                  ? 'text-[#0E5A6B]'
                                  : isCompleted
                                  ? 'text-[#14110F]'
                                  : 'text-[#14110F]/50'
                              }`}
                            >
                              {stage.title}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] uppercase font-semibold text-[#0E5A6B] bg-[#0E5A6B]/10 px-1.5 py-0.2 rounded">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#14110F]/70 mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Courier Info Box if Dispatched */}
                {searchedOrder.courier && searchedOrder.trackingNumber && (
                  <div className="p-4 rounded-lg bg-white border border-[#14110F]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#14110F]">
                        <Truck className="w-4 h-4 text-[#0E5A6B]" />
                        <span>{t.track.courierInfo}: {searchedOrder.courier}</span>
                      </div>
                      <p className="text-[11px] text-[#14110F]/70 mt-0.5">
                        {t.track.trackingNumber}:{' '}
                        <strong className="font-mono text-[#0E5A6B]">
                          {searchedOrder.trackingNumber}
                        </strong>
                      </p>
                    </div>

                    {searchedOrder.trackingUrl && (
                      <a
                        href={searchedOrder.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E5A6B] hover:bg-[#083742] text-white rounded text-xs font-semibold transition-colors"
                      >
                        <span>{t.track.courierLink}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* WhatsApp Support Prompt */}
                <div className="p-3.5 bg-[#FAF6F0] rounded border border-[#14110F]/10 text-xs flex items-center justify-between gap-2">
                  <span className="text-[#14110F]/80">
                    {t.track.supportPrompt}
                  </span>
                  <a
                    href={`https://wa.me/923001234567?text=Salaam%20Miar!%20Inquiry%20regarding%20Order%20${searchedOrder.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0E5A6B] hover:underline font-semibold shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Studio</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-[#14110F]/10 p-6 space-y-2">
                <AlertCircle className="w-8 h-8 text-[#B5543A] mx-auto" />
                <h4 className="text-sm font-bold text-[#14110F]">
                  No order found with number "{orderNumInput}"
                </h4>
                <p className="text-xs text-[#14110F]/65 max-w-sm mx-auto">
                  Please verify your order number in your confirmation SMS or WhatsApp message (e.g. MIA-8492).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
