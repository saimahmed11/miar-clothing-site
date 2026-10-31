import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { Order, OrderStatus, Courier } from '../types';
import { PRODUCTS } from '../data/products';
import { MiarWordmark } from './MiarWordmark';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  AlertTriangle,
  Banknote,
  TrendingUp,
  Boxes,
  Users,
  Search,
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPackingSlip: (order: Order) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onViewPackingSlip,
}) => {
  const { orders, updateOrderStatus, inventory, updateStock } = useOrders();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'cod_finance'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // COD financial calculation
  const totalCodOrders = orders.filter((o) => o.paymentMethod === 'cod');
  const codCollected = totalCodOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  const codInTransit = totalCodOrders
    .filter((o) => o.status === 'dispatched')
    .reduce((sum, o) => sum + o.total, 0);
  const codPendingConfirm = totalCodOrders
    .filter((o) => o.status === 'new' || o.status === 'confirmed' || o.status === 'packed')
    .reduce((sum, o) => sum + o.total, 0);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.customer.city.toLowerCase().includes(q) ||
        order.customer.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Admin Panel Dialog */}
      <div className="relative w-full max-w-6xl bg-[#FAF6F0] rounded-xl shadow-2xl z-10 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#14110F] text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MiarWordmark size="sm" color="#FAF6F0" />
            <div className="hidden sm:block border-l border-white/20 pl-4">
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#D99A2B]">
                Studio Operations & Courier Dispatch
              </h2>
              <p className="text-[10px] text-white/60">Karachi Fulfillment & COD Tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Nav tabs */}
            <div className="flex items-center bg-white/10 rounded-md p-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#0E5A6B] text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === 'inventory'
                    ? 'bg-[#0E5A6B] text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('cod_finance')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeTab === 'cod_finance'
                    ? 'bg-[#0E5A6B] text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                COD Ledger
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: ORDERS PIPELINE */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Stats overview */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-[10px] font-bold uppercase text-[#14110F]/60 block">
                    1. New Orders
                  </span>
                  <span className="text-xl font-bold text-[#0E5A6B] tabular-nums">
                    {orders.filter((o) => o.status === 'new').length}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-[10px] font-bold uppercase text-[#14110F]/60 block">
                    2. Confirmed
                  </span>
                  <span className="text-xl font-bold text-[#0E5A6B] tabular-nums">
                    {orders.filter((o) => o.status === 'confirmed').length}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-[10px] font-bold uppercase text-[#14110F]/60 block">
                    3. Packed
                  </span>
                  <span className="text-xl font-bold text-[#0E5A6B] tabular-nums">
                    {orders.filter((o) => o.status === 'packed').length}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-[10px] font-bold uppercase text-[#14110F]/60 block">
                    4. In Transit
                  </span>
                  <span className="text-xl font-bold text-[#D99A2B] tabular-nums">
                    {orders.filter((o) => o.status === 'dispatched').length}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-[10px] font-bold uppercase text-[#14110F]/60 block">
                    5. Delivered
                  </span>
                  <span className="text-xl font-bold text-emerald-700 tabular-nums">
                    {orders.filter((o) => o.status === 'delivered').length}
                  </span>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {['all', 'new', 'confirmed', 'packed', 'dispatched', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 text-xs font-semibold rounded capitalize transition-colors ${
                        statusFilter === st
                          ? 'bg-[#14110F] text-white'
                          : 'bg-white border border-[#14110F]/10 text-[#14110F]/70 hover:bg-[#E8DFD0]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#14110F]/40 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by order #, phone, city..."
                    className="w-full py-1.5 pl-8 pr-3 text-xs rounded border border-[#14110F]/20 bg-white focus:outline-none focus:border-[#0E5A6B]"
                  />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg border border-[#14110F]/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#E8DFD0]/40 border-b border-[#14110F]/10 text-[10px] font-bold uppercase text-[#14110F]/70">
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Customer & Address</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Current Status</th>
                        <th className="py-2.5 px-3">Courier Action</th>
                        <th className="py-2.5 px-3 text-right">Slip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14110F]/8">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF6F0]">
                          <td className="py-3 px-3 font-bold font-mono text-[#0E5A6B]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-3 text-[#14110F]/70">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-[#14110F]">
                              {ord.customer.fullName}
                            </p>
                            <p className="text-[11px] text-[#14110F]/60">
                              {ord.customer.phone} · {ord.customer.city}
                            </p>
                            <p className="text-[10px] text-[#14110F]/50 truncate max-w-xs">
                              {ord.customer.address}
                            </p>
                          </td>
                          <td className="py-3 px-3">
                            {ord.items.map((it, i) => (
                              <p key={i} className="text-[11px] truncate max-w-[180px]">
                                {it.quantity}x {it.product.titleEn} ({it.selectedSize})
                              </p>
                            ))}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold tabular-nums text-[#0E5A6B] block">
                              Rs. {ord.total.toLocaleString()}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-[#14110F]/60">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'dispatched'
                                  ? 'bg-amber-100 text-amber-800'
                                  : ord.status === 'packed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-neutral-100 text-neutral-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1">
                              {ord.status === 'new' && (
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                                  className="px-2 py-1 bg-[#0E5A6B] hover:bg-[#083742] text-white text-[10px] font-semibold rounded"
                                >
                                  Confirm Order
                                </button>
                              )}
                              {ord.status === 'confirmed' && (
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'packed')}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded"
                                >
                                  Mark Packed
                                </button>
                              )}
                              {ord.status === 'packed' && (
                                <button
                                  onClick={() =>
                                    updateOrderStatus(
                                      ord.id,
                                      'dispatched',
                                      'Trax',
                                      `TRX-${ord.orderNumber.replace('MIA-', '')}`
                                    )
                                  }
                                  className="px-2 py-1 bg-[#D99A2B] hover:bg-[#c08620] text-[#14110F] text-[10px] font-bold rounded"
                                >
                                  Dispatch Trax
                                </button>
                              )}
                              {ord.status === 'dispatched' && (
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'delivered')}
                                  className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-semibold rounded"
                                >
                                  Mark Delivered
                                </button>
                              )}
                              {ord.status === 'delivered' && (
                                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Closed
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => onViewPackingSlip(ord)}
                              className="p-1 text-[#0E5A6B] hover:text-[#083742] hover:bg-[#E8DFD0] rounded transition-colors"
                              title="Print / View Packing Slip"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg border border-[#14110F]/10 flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-bold text-[#14110F]">
                    Live SKU Inventory by Size
                  </h3>
                  <p className="text-[11px] text-[#14110F]/60">
                    Stock updates adjust automatically when customer orders are placed.
                  </p>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-[#B5543A] font-semibold bg-[#B5543A]/10 px-2 py-1 rounded">
                    Low stock threshold: &lt; 3 units
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRODUCTS.map((prod) => {
                  const sizes = inventory[prod.id] || prod.sizes;
                  return (
                    <div
                      key={prod.id}
                      className="p-4 bg-white rounded-lg border border-[#14110F]/10 flex gap-4"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.titleEn}
                        className="w-16 h-20 object-cover rounded bg-[#E8DFD0] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-xs text-[#14110F] truncate">
                            {prod.titleEn}
                          </h4>
                          <span className="font-mono text-[10px] text-[#0E5A6B] font-bold">
                            {prod.sku}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#14110F]/60 mt-0.5">
                          Rs. {prod.price.toLocaleString()} · {prod.category}
                        </p>

                        {/* Size stock pills */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {sizes.map((s) => (
                            <div
                              key={s.size}
                              className={`p-1.5 rounded border text-[11px] flex items-center gap-2 ${
                                s.stock <= 0
                                  ? 'border-red-200 bg-red-50 text-red-800'
                                  : s.stock <= 2
                                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                                  : 'border-neutral-200 bg-neutral-50 text-neutral-800'
                              }`}
                            >
                              <span className="font-semibold">{s.size}:</span>
                              <span className="font-mono font-bold tabular-nums">
                                {s.stock}
                              </span>
                              <div className="flex items-center gap-0.5 ml-1">
                                <button
                                  onClick={() => updateStock(prod.id, s.size, -1)}
                                  className="w-4 h-4 bg-white rounded border border-neutral-300 hover:bg-neutral-100 flex items-center justify-center font-bold"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => updateStock(prod.id, s.size, 1)}
                                  className="w-4 h-4 bg-white rounded border border-neutral-300 hover:bg-neutral-100 flex items-center justify-center font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: COD FINANCIAL RECONCILIATION */}
          {activeTab === 'cod_finance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-xs font-bold uppercase text-emerald-700 block">
                    Cash Collected & Settled
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-800 mt-1 block">
                    PKR {codCollected.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-[#14110F]/60 mt-1">
                    Delivered parcels settled into studio bank account
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-xs font-bold uppercase text-[#D99A2B] block">
                    Cash In Transit (With Couriers)
                  </span>
                  <span className="text-2xl font-black font-mono text-[#D99A2B] mt-1 block">
                    PKR {codInTransit.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-[#14110F]/60 mt-1">
                    Dispatched with Trax & TCS awaiting doorstep delivery
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-[#14110F]/10">
                  <span className="text-xs font-bold uppercase text-[#0E5A6B] block">
                    Pending Packing & Confirmation
                  </span>
                  <span className="text-2xl font-black font-mono text-[#0E5A6B] mt-1 block">
                    PKR {codPendingConfirm.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-[#14110F]/60 mt-1">
                    Orders received awaiting packing slip printing
                  </p>
                </div>
              </div>

              {/* Courier Comparison Table */}
              <div className="bg-white rounded-lg border border-[#14110F]/10 p-5 space-y-3">
                <h3 className="font-bold text-sm text-[#14110F]">
                  Courier SLA & Rate Matrix
                </h3>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#14110F]/10 font-bold uppercase text-[10px] text-[#14110F]/70">
                        <th className="py-2">Courier Partner</th>
                        <th className="py-2">Karachi Delivery</th>
                        <th className="py-2">Nationwide 0.5kg</th>
                        <th className="py-2">COD Remittance Cycle</th>
                        <th className="py-2">API Integration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#14110F]/8">
                      <tr>
                        <td className="py-2 font-bold text-[#0E5A6B]">Trax Express</td>
                        <td className="py-2 font-medium">Same-day / 24h</td>
                        <td className="py-2 font-mono">Rs. 220</td>
                        <td className="py-2 text-emerald-700 font-semibold">Twice Weekly (Tue / Fri)</td>
                        <td className="py-2 text-[#0E5A6B]">Active (AWB Webhooks)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-[#0E5A6B]">TCS Express</td>
                        <td className="py-2 font-medium">Next-day</td>
                        <td className="py-2 font-mono">Rs. 260</td>
                        <td className="py-2">Weekly</td>
                        <td className="py-2 text-[#0E5A6B]">Active</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-[#0E5A6B]">Leopards Courier</td>
                        <td className="py-2 font-medium">24-48h</td>
                        <td className="py-2 font-mono">Rs. 230</td>
                        <td className="py-2">Weekly</td>
                        <td className="py-2">Standby</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
