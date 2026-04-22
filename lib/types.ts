export type Role = "user" | "admin";
export type Locale = "en" | "ar";
export type Currency = "USD" | "EUR" | "AED";
export type OrderStatus = "processing" | "paid" | "packed" | "delivered";
export type NotificationType = "order" | "stock" | "promo" | "system";

export interface PlatformUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatar: string;
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "banned";
  region: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  preferredLanguage?: string;
  marketingOptIn?: boolean;
  deliveryNotes?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  gallery: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
  badge: string;
  tags: string[];
  brand: string;
  seller: string;
  deliveryEstimate: string;
  highlights: string[];
  specifications: Array<{
    label: string;
    value: string;
  }>;
  featured: boolean;
  trending: boolean;
  sku: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  couponCode?: string;
}

export interface Promotion {
  id: string;
  code: string;
  label: string;
  type: "percent" | "fixed";
  value: number;
  minimumSpend: number;
  active: boolean;
  expiresAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  unread: boolean;
}

export interface SearchEvent {
  id: string;
  query: string;
  productIds: string[];
  createdAt: string;
}

export interface CheckoutPayload {
  shippingAddress: string;
  paymentMethod: string;
  couponCode?: string;
}

export interface AnalyticsSeriesPoint {
  label: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface RecommendationResult {
  headline: string;
  products: Product[];
}
