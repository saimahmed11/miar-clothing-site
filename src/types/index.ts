export type Language = 'en' | 'ur';

export type Category = 'all' | 'pret' | 'unstitched' | 'mens' | 'festive';

export type ProductBadge = 'new' | 'few_left' | 'sale' | 'bestseller';

export interface ProductReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  sizeBought: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  titleEn: string;
  titleUr: string;
  taglineEn: string;
  taglineUr: string;
  category: 'pret' | 'unstitched' | 'mens' | 'festive';
  type: 'stitched' | 'unstitched';
  pieces: '1pc' | '2pc' | '3pc';
  price: number;
  originalPrice?: number;
  badge?: ProductBadge;
  fabricEn: string;
  fabricUr: string;
  colorEn: string;
  colorUr: string;
  colorHex: string;
  images: string[];
  sizes: {
    size: string;
    stock: number;
  }[];
  modelInfoEn: string;
  modelInfoUr: string;
  descriptionEn: string;
  descriptionUr: string;
  careEn: string[];
  careUr: string[];
  fabricSpecsEn?: string[];
  fabricSpecsUr?: string[];
  bestSellerRank?: number;
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: string;
  selectedPieces?: '2pc' | '3pc';
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'card';
export type Courier = 'Trax' | 'TCS' | 'Leopards' | 'PostEx';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  area: string;
  address: string;
  landmark: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryMethod: 'standard' | 'express_karachi';
  discountAmount: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  courier?: Courier;
  trackingNumber?: string;
  trackingUrl?: string;
  confirmedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}
