import React from 'react';
import { Order } from '../types';
import { MiarWordmark } from './MiarWordmark';
import { X, Printer, Package, ShieldCheck } from 'lucide-react';

interface PackingSlipModalProps {
  order: Order | null;
  onClose: () => void;
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs" onClick={onClose} />

      {/* Slip Sheet Container */}
      <div className="relative w-full max-w-2xl bg-white text-[#14110F] rounded-lg shadow-2xl z-10 max-h-[94vh] overflow-y-auto p-6 sm:p-10 border border-neutral-300 font-sans print:p-0 print:border-none print:shadow-none">
        {/* Screen Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200 print:hidden">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Miar Dispatch Manifest & Airway Bill
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-[#0E5A6B] hover:bg-[#083742] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Packing Slip Area */}
        <div className="space-y-6">
          {/* Header with Nastaliq Wordmark and Courier Lockup */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-neutral-800">
            <div>
              <MiarWordmark size="md" color="#14110F" />
              <p className="text-[11px] text-neutral-600 mt-1 font-medium">
                Atelier Karachi · Clifton Coast · Est. 2026
              </p>
              <p className="text-[10px] text-neutral-500">
                Careline / WhatsApp: +92 300 1234567 · info@miar.pk
              </p>
            </div>

            <div className="text-end">
              <span className="text-xs uppercase font-bold tracking-widest text-neutral-500 block">
                Airway Bill / Packing Slip
              </span>
              <span className="text-xl font-bold font-mono tracking-wider text-[#0E5A6B]">
                {order.orderNumber}
              </span>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>

          {/* Courier & Tracking Bar */}
          <div className="p-3 bg-neutral-100 rounded border border-neutral-300 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                Designated Courier Partner
              </span>
              <span className="font-bold text-neutral-900 text-sm">
                {order.courier || 'Trax Express Karachi'}
              </span>
            </div>

            <div className="text-end">
              <span className="text-[10px] text-neutral-500 uppercase block font-semibold">
                AWB Tracking Number
              </span>
              <span className="font-mono font-bold text-neutral-900">
                {order.trackingNumber || `TRX-KHI-${order.orderNumber.replace('MIA-', '')}`}
              </span>
            </div>
          </div>

          {/* Shipper vs Consignee Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Shipper */}
            <div className="p-3 border border-neutral-200 rounded">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                From (Shipper):
              </span>
              <p className="font-bold text-neutral-900">Miar Logistics Studio</p>
              <p className="text-neutral-700">Suite 402, Marine Drive</p>
              <p className="text-neutral-700">Clifton Block 4, Karachi</p>
              <p className="text-neutral-700">Pakistan</p>
            </div>

            {/* Consignee */}
            <div className="p-3 border border-neutral-300 bg-neutral-50 rounded">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                To (Consignee):
              </span>
              <p className="font-bold text-neutral-900">{order.customer.fullName}</p>
              <p className="font-mono text-neutral-800">{order.customer.phone}</p>
              <p className="text-neutral-700">
                {order.customer.address}, {order.customer.area}
              </p>
              <p className="font-semibold text-neutral-900">
                {order.customer.city}, Pakistan
              </p>
              <p className="text-[11px] text-[#0E5A6B] mt-1 font-medium">
                Landmark: {order.customer.landmark}
              </p>
            </div>
          </div>

          {/* Packing Items Table */}
          <div>
            <table className="w-full text-left text-xs border border-neutral-300">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 font-bold uppercase text-[10px] text-neutral-700">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3">Size / Type</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 tabular-nums">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-neutral-900">
                        {item.product.titleEn}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        SKU: {item.product.sku} · {item.product.fabricEn}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 font-medium">{item.selectedSize}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right">
                      Rs. {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold">
                      Rs. {(item.unitPrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Banner: Cash on Delivery or Prepaid */}
          <div className="p-4 rounded border-2 border-neutral-900 bg-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                Payment Type
              </span>
              <span className="font-bold text-neutral-900 text-base uppercase">
                {order.paymentMethod === 'cod' ? 'CASH ON DELIVERY (COD)' : order.paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="text-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                CASH TO COLLECT BY RIDER
              </span>
              <span className="text-2xl font-black text-neutral-950 font-mono">
                {order.paymentMethod === 'cod'
                  ? `PKR ${order.total.toLocaleString()}`
                  : 'PKR 0.00 (PREPAID)'}
              </span>
            </div>
          </div>

          {/* Packing & Inspection Sign-off */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
            <div>
              <span>Quality Inspected by: Miar Quality Desk Karachi</span>
              <span className="mx-2">·</span>
              <span>7-Day Hassle-Free Exchange Guaranteed</span>
            </div>
            <div className="font-mono">Checked & Packed ✓</div>
          </div>
        </div>
      </div>
    </div>
  );
};
