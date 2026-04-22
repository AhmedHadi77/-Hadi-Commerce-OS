import { CATALOG } from "@/lib/catalog";
import { uniqueId } from "@/lib/utils";
import type {
  AppNotification,
  Order,
  OrderItem,
  PlatformUser,
  Product,
  Promotion
} from "@/lib/types";

export const INITIAL_USERS: PlatformUser[] = [
  {
    id: "user-admin",
    email: "admin@hadi.demo",
    fullName: "Hadi Admin",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80",
    joinedAt: "2025-01-04T08:00:00.000Z",
    totalOrders: 0,
    totalSpent: 0,
    status: "active",
    region: "Kuala Lumpur",
    phone: "+60 12-700 1000",
    addressLine1: "18 Jalan Ampang",
    addressLine2: "Level 14",
    city: "Kuala Lumpur",
    state: "Kuala Lumpur",
    postalCode: "50450",
    country: "Malaysia",
    preferredLanguage: "English",
    marketingOptIn: true,
    deliveryNotes: "Reception desk during office hours."
  },
  {
    id: "user-1",
    email: "sara@hadi.demo",
    fullName: "Sara Abdullah",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    joinedAt: "2025-02-11T10:30:00.000Z",
    totalOrders: 6,
    totalSpent: 2140,
    status: "active",
    region: "Dubai",
    phone: "+971 50-450 8820",
    addressLine1: "Palm Jumeirah Residence 12",
    addressLine2: "Apartment 804",
    city: "Dubai",
    state: "Dubai",
    postalCode: "00000",
    country: "United Arab Emirates",
    preferredLanguage: "English",
    marketingOptIn: true,
    deliveryNotes: "Call before delivery."
  },
  {
    id: "user-2",
    email: "omar@hadi.demo",
    fullName: "Omar Hassan",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    joinedAt: "2025-03-08T09:20:00.000Z",
    totalOrders: 4,
    totalSpent: 1320,
    status: "active",
    region: "Riyadh",
    phone: "+966 55-390 1201",
    addressLine1: "King Fahd Road",
    addressLine2: "Building 7",
    city: "Riyadh",
    state: "Riyadh Province",
    postalCode: "12214",
    country: "Saudi Arabia",
    preferredLanguage: "Arabic",
    marketingOptIn: false,
    deliveryNotes: "Leave package with concierge if unavailable."
  }
];

const buildOrderItems = (orderId: string, products: Product[]): OrderItem[] =>
  products.map((product, index) => ({
    id: uniqueId("item"),
    orderId,
    productId: product.id,
    quantity: index + 1,
    unitPrice: product.price
  }));

export const INITIAL_ORDERS: Order[] = Array.from({ length: 14 }, (_, index) => {
  const orderId = `order-${index + 1}`;
  const userId = index % 3 === 0 ? "user-2" : "user-1";
  const products = CATALOG.slice(index, index + 3);
  const items = buildOrderItems(orderId, products);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return {
    id: orderId,
    userId,
    totalPrice,
    status: ["processing", "paid", "packed", "delivered"][index % 4] as Order["status"],
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    items,
    shippingAddress: "18 Jalan Ampang, Kuala Lumpur",
    paymentMethod: index % 2 === 0 ? "Card" : "Cash on delivery",
    couponCode: index % 3 === 0 ? "HADI10" : undefined
  };
});

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo-1",
    code: "HADI10",
    label: "10% off for first-time customers",
    type: "percent",
    value: 10,
    minimumSpend: 80,
    active: true,
    expiresAt: "2026-12-31T23:59:59.000Z"
  },
  {
    id: "promo-2",
    code: "SAVE25",
    label: "Flat $25 premium basket boost",
    type: "fixed",
    value: 25,
    minimumSpend: 180,
    active: true,
    expiresAt: "2026-11-10T23:59:59.000Z"
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notification-1",
    title: "Realtime commerce is live",
    message: "New order alerts and stock health now update in the dashboard.",
    type: "system",
    createdAt: new Date().toISOString(),
    unread: true
  },
  {
    id: "notification-2",
    title: "Top product crossing threshold",
    message: "Orbit Speaker 4 has fewer than 10 units left in stock.",
    type: "stock",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    unread: true
  }
];
