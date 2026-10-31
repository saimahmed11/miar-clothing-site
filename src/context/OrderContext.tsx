import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, Courier } from '../types';
import { PRODUCTS } from '../data/products';

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  getOrder: (orderNumber: string, phone?: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, courier?: Courier, trackingNumber?: string) => void;
  inventory: Record<string, { size: string; stock: number }[]>;
  updateStock: (productId: string, size: string, change: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initial sample orders so tracking and admin works out of the box
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'MIA-8492',
    createdAt: '2026-10-30T14:22:00.000Z',
    customer: {
      fullName: 'Ayesha Mansoor',
      phone: '03008273641',
      email: 'ayesha.m@gmail.com',
      city: 'Karachi',
      area: 'Clifton, Block 2',
      address: 'House 44-B, Sunset Boulevard Near Marine Drive',
      landmark: 'Opposite Bilawal House',
      notes: 'Please call before ring bell',
    },
    items: [
      {
        id: 'miar-clifton-sea-linen-M',
        productId: 'miar-clifton-sea-linen',
        product: PRODUCTS[0],
        selectedSize: 'M',
        quantity: 1,
        unitPrice: 8450,
      },
    ],
    subtotal: 8450,
    deliveryFee: 0,
    deliveryMethod: 'express_karachi',
    discountAmount: 0,
    total: 8450,
    paymentMethod: 'cod',
    status: 'dispatched',
    courier: 'Trax',
    trackingNumber: 'TRX-KHI-948201',
    trackingUrl: 'https://trax.pk/tracking?awb=TRX-KHI-948201',
    confirmedAt: '2026-10-30T15:00:00.000Z',
    dispatchedAt: '2026-10-31T09:30:00.000Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'MIA-8491',
    createdAt: '2026-10-29T11:10:00.000Z',
    customer: {
      fullName: 'Hamza Farooq',
      phone: '03219876543',
      city: 'Lahore',
      area: 'DHA Phase 5',
      address: 'Sector G, Street 9, House 12',
      landmark: 'Near Jalal Sons',
    },
    items: [
      {
        id: 'miar-karachi-dusk-mens-kurta-L',
        productId: 'miar-karachi-dusk-mens-kurta',
        product: PRODUCTS[3],
        selectedSize: 'L',
        quantity: 1,
        unitPrice: 6450,
      },
    ],
    subtotal: 6450,
    deliveryFee: 250,
    deliveryMethod: 'standard',
    discountAmount: 0,
    total: 6700,
    paymentMethod: 'cod',
    status: 'delivered',
    courier: 'TCS',
    trackingNumber: 'TCS-LHR-772910',
    trackingUrl: 'https://www.tcsexpress.com/track/TCS-LHR-772910',
    confirmedAt: '2026-10-29T12:00:00.000Z',
    dispatchedAt: '2026-10-29T16:00:00.000Z',
    deliveredAt: '2026-10-31T12:00:00.000Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'MIA-8490',
    createdAt: '2026-10-31T08:15:00.000Z',
    customer: {
      fullName: 'Nida Jawaid',
      phone: '03332145879',
      city: 'Karachi',
      area: 'Saddar / Lines Area',
      address: 'Flat 304, Noor Heights, Mansfield Street',
      landmark: 'Near St. Patrick Cathedral',
    },
    items: [
      {
        id: 'miar-coastal-twilight-unstitched-3pc',
        productId: 'miar-coastal-twilight-unstitched',
        product: PRODUCTS[2],
        selectedSize: '3-Piece Full Suit',
        quantity: 1,
        unitPrice: 7650,
      },
    ],
    subtotal: 7650,
    deliveryFee: 0,
    deliveryMethod: 'standard',
    discountAmount: 765,
    discountCode: 'KARACHI10',
    total: 6885,
    paymentMethod: 'cod',
    status: 'confirmed',
    courier: 'Trax',
    confirmedAt: '2026-10-31T09:00:00.000Z',
  },
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('miar_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  // Track inventory state
  const [inventory, setInventory] = useState<Record<string, { size: string; stock: number }[]>>(() => {
    try {
      const saved = localStorage.getItem('miar_inventory');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    const initial: Record<string, { size: string; stock: number }[]> = {};
    PRODUCTS.forEach((p) => {
      initial[p.id] = [...p.sizes];
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem('miar_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('miar_inventory', JSON.stringify(inventory));
    } catch {
      // ignore
    }
  }, [inventory]);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MIA-${randomSuffix}`;
    const id = `ord-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt,
      status: 'new',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock
    newOrder.items.forEach((item) => {
      updateStock(item.productId, item.selectedSize, -item.quantity);
    });

    return newOrder;
  };

  const getOrder = (orderNumber: string, phone?: string): Order | undefined => {
    const cleanNum = orderNumber.trim().toUpperCase();
    return orders.find((o) => {
      const matchesNum = o.orderNumber.toUpperCase() === cleanNum;
      if (!matchesNum) return false;
      if (phone) {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const orderPhone = o.customer.phone.replace(/[^0-9]/g, '');
        return orderPhone.endsWith(cleanPhone.slice(-7));
      }
      return true;
    });
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    courier?: Courier,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const now = new Date().toISOString();
        return {
          ...ord,
          status,
          courier: courier || ord.courier,
          trackingNumber: trackingNumber || ord.trackingNumber,
          trackingUrl:
            trackingNumber && courier === 'Trax'
              ? `https://trax.pk/tracking?awb=${trackingNumber}`
              : trackingNumber && courier === 'TCS'
              ? `https://www.tcsexpress.com/track/${trackingNumber}`
              : ord.trackingUrl,
          confirmedAt: status === 'confirmed' ? now : ord.confirmedAt,
          dispatchedAt: status === 'dispatched' ? now : ord.dispatchedAt,
          deliveredAt: status === 'delivered' ? now : ord.deliveredAt,
        };
      })
    );
  };

  const updateStock = (productId: string, size: string, change: number) => {
    setInventory((prev) => {
      const current = prev[productId] || [];
      const updated = current.map((s) =>
        s.size === size ? { ...s, stock: Math.max(0, s.stock + change) } : s
      );
      return { ...prev, [productId]: updated };
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrder,
        updateOrderStatus,
        inventory,
        updateStock,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
