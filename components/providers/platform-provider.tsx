"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

import { CATALOG } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/env";
import { INITIAL_NOTIFICATIONS, INITIAL_ORDERS, INITIAL_PROMOTIONS, INITIAL_USERS } from "@/lib/mock-data";
import { getSupabaseClient, mapSupabaseUser } from "@/lib/supabase/client";
import { slugify, uniqueId } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type {
  AppNotification,
  CartItem,
  CheckoutPayload,
  Currency,
  Locale,
  Order,
  PlatformUser,
  Product,
  Promotion,
  SearchEvent
} from "@/lib/types";

type AuthResult = { ok: true; message: string } | { ok: false; message: string };
type ProfileUpdateInput = Partial<
  Pick<
    PlatformUser,
    | "fullName"
    | "region"
    | "avatar"
    | "phone"
    | "addressLine1"
    | "addressLine2"
    | "city"
    | "state"
    | "postalCode"
    | "country"
    | "preferredLanguage"
    | "marketingOptIn"
    | "deliveryNotes"
  >
>;

interface PlatformContextValue {
  ready: boolean;
  demoMode: boolean;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  products: Product[];
  users: PlatformUser[];
  orders: Order[];
  promotions: Promotion[];
  notifications: AppNotification[];
  searchEvents: SearchEvent[];
  cart: CartItem[];
  wishlist: string[];
  currentUser: PlatformUser | null;
  cartCount: number;
  cartSubtotal: number;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (fullName: string, email: string, password: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<AuthResult>;
  addToCart: (productId: string, quantity?: number, product?: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (payload: CheckoutPayload) => { ok: boolean; orderId?: string; message: string };
  upsertProduct: (product: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateStock: (productId: string, stock: number) => void;
  savePromotion: (promotion: Partial<Promotion>) => void;
  banUser: (userId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  recordSearch: (query: string, productIds: string[]) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const resolveDiscount = (subtotal: number, code: string | undefined, promotions: Promotion[]) => {
  if (!code) {
    return 0;
  }

  const match = promotions.find(
    (promotion) =>
      promotion.active &&
      promotion.code.toLowerCase() === code.toLowerCase() &&
      subtotal >= promotion.minimumSpend
  );

  if (!match) {
    return 0;
  }

  if (match.type === "fixed") {
    return Math.min(match.value, subtotal);
  }

  return subtotal * (match.value / 100);
};

export const PlatformProvider = ({ children }: PropsWithChildren) => {
  const demoMode = !isSupabaseConfigured;
  const supabase = useMemo(() => getSupabaseClient(), []);
  const { value: locale, setValue: setLocale, hydrated: localeHydrated } = useLocalStorage<Locale>(
    "hadi-locale",
    "en"
  );
  const { value: currency, setValue: setCurrency, hydrated: currencyHydrated } =
    useLocalStorage<Currency>("hadi-currency", "USD");
  const { value: products, setValue: setProducts, hydrated: productsHydrated } =
    useLocalStorage<Product[]>("hadi-products-v4", CATALOG);
  const { value: users, setValue: setUsers, hydrated: usersHydrated } = useLocalStorage<PlatformUser[]>(
    "hadi-users",
    INITIAL_USERS
  );
  const { value: orders, setValue: setOrders, hydrated: ordersHydrated } = useLocalStorage<Order[]>(
    "hadi-orders",
    INITIAL_ORDERS
  );
  const { value: promotions, setValue: setPromotions, hydrated: promotionsHydrated } =
    useLocalStorage<Promotion[]>("hadi-promotions", INITIAL_PROMOTIONS);
  const {
    value: notifications,
    setValue: setNotifications,
    hydrated: notificationsHydrated
  } = useLocalStorage<AppNotification[]>("hadi-notifications", INITIAL_NOTIFICATIONS);
  const { value: cart, setValue: setCart, hydrated: cartHydrated } = useLocalStorage<CartItem[]>(
    "hadi-cart",
    []
  );
  const { value: wishlist, setValue: setWishlist, hydrated: wishlistHydrated } = useLocalStorage<string[]>(
    "hadi-wishlist",
    []
  );
  const {
    value: sessionUserId,
    setValue: setSessionUserId,
    hydrated: sessionHydrated
  } = useLocalStorage<string | null>("hadi-session-user-id", null);
  const {
    value: searchEvents,
    setValue: setSearchEvents,
    hydrated: searchHydrated
  } = useLocalStorage<SearchEvent[]>("hadi-search-events", []);

  const [authReady, setAuthReady] = useState(demoMode);
  const [supabaseProfile, setSupabaseProfile] = useState<PlatformUser | null>(null);

  useEffect(() => {
    if (demoMode || !supabase) {
      setAuthReady(true);
      return;
    }

    let cancelled = false;

    const boot = async () => {
      const { data } = await supabase.auth.getUser();
      if (!cancelled) {
        setSupabaseProfile(data.user ? await mapSupabaseUser(data.user) : null);
        setAuthReady(true);
      }
    };

    void boot();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSupabaseProfile(session?.user ? await mapSupabaseUser(session.user) : null);
      setAuthReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [demoMode, supabase]);

  useEffect(() => {
    if (!productsHydrated) {
      return;
    }

    const categoryCount = new Set(products.map((product) => product.category)).size;

    const firstProduct = products[0];

    if (
      categoryCount < 30 ||
      products.length < CATALOG.length ||
      !firstProduct?.gallery ||
      !firstProduct?.specifications
    ) {
      setProducts(CATALOG);
    }
  }, [products, productsHydrated, setProducts]);

  const currentUser = demoMode
    ? users.find((user) => user.id === sessionUserId) ?? null
    : supabaseProfile;

  const cartSubtotal = cart.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const ready =
    localeHydrated &&
    currencyHydrated &&
    productsHydrated &&
    usersHydrated &&
    ordersHydrated &&
    promotionsHydrated &&
    notificationsHydrated &&
    cartHydrated &&
    wishlistHydrated &&
    sessionHydrated &&
    searchHydrated &&
    authReady;

  const addNotification = (notification: Omit<AppNotification, "id" | "createdAt">) => {
    setNotifications([
      {
        id: uniqueId("notification"),
        createdAt: new Date().toISOString(),
        ...notification
      },
      ...notifications
    ]);
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (demoMode || !supabase) {
      const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { ok: false, message: "No demo user found. Register first or use admin@hadi.demo." };
      }
      if (user.status === "banned") {
        return { ok: false, message: "This account has been suspended by an administrator." };
      }
      if (!password.trim()) {
        return { ok: false, message: "Please enter any password to continue in demo mode." };
      }

      setSessionUserId(user.id);
      addNotification({
        title: "Session started",
        message: `${user.fullName} signed into Hadi.`,
        type: "system",
        unread: true
      });
      return { ok: true, message: "Welcome back to Hadi." };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Authenticated with Supabase." };
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    if (demoMode || !supabase) {
      if (users.some((candidate) => candidate.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, message: "A user with this email already exists." };
      }

      const newUser: PlatformUser = {
        id: uniqueId("user"),
        email,
        fullName,
        role: "user",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        joinedAt: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        status: "active",
        region: "Online",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        preferredLanguage: "English",
        marketingOptIn: false,
        deliveryNotes: ""
      };

      setUsers([newUser, ...users]);
      setSessionUserId(newUser.id);
      addNotification({
        title: "New shopper onboarded",
        message: `${fullName} created a new demo account.`,
        type: "system",
        unread: true
      });
      return { ok: true, message: "Account created in demo mode." };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Registration complete. Check your inbox if email confirmation is enabled." };
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    if (demoMode || !supabase) {
      return {
        ok: true,
        message: `Password reset is mocked in demo mode for ${email}. Connect Supabase to enable real email recovery.`
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "Password reset email sent." };
  };

  const logout = async () => {
    if (demoMode || !supabase) {
      setSessionUserId(null);
      return;
    }
    await supabase.auth.signOut();
  };

  const updateProfile = async (input: ProfileUpdateInput): Promise<AuthResult> => {
    if (!currentUser) {
      return { ok: false, message: "Login is required before saving account settings." };
    }

    if (demoMode || !supabase) {
      setUsers(
        users.map((user) =>
          user.id === currentUser.id
            ? {
                ...user,
                ...input
              }
            : user
        )
      );

      return { ok: true, message: "Account settings saved locally in demo mode." };
    }

    const payload = Object.fromEntries(
      Object.entries({
        full_name: input.fullName,
        region: input.region,
        avatar_url: input.avatar,
        phone: input.phone,
        address_line_1: input.addressLine1,
        address_line_2: input.addressLine2,
        city: input.city,
        state: input.state,
        postal_code: input.postalCode,
        country: input.country,
        preferred_language: input.preferredLanguage,
        marketing_opt_in: input.marketingOptIn,
        delivery_notes: input.deliveryNotes
      }).filter(([, value]) => value !== undefined)
    );

    if (input.fullName !== undefined) {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: input.fullName
        }
      });

      if (authError) {
        return { ok: false, message: authError.message };
      }
    }

    const { error } = await supabase.from("users").upsert(
      {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        ...payload
      },
      { onConflict: "id" }
    );

    if (error) {
      return { ok: false, message: error.message };
    }

    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setSupabaseProfile(await mapSupabaseUser(data.user));
    }

    return { ok: true, message: "Account settings saved to Supabase." };
  };

  const addToCart = (productId: string, quantity = 1, incomingProduct?: Product) => {
    if (incomingProduct && !products.some((candidate) => candidate.id === productId)) {
      setProducts([incomingProduct, ...products]);
    }

    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
      return;
    }

    setCart([...cart, { productId, quantity }]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(
      wishlist.includes(productId)
        ? wishlist.filter((value) => value !== productId)
        : [productId, ...wishlist]
    );
  };

  const placeOrder = (payload: CheckoutPayload) => {
    if (!currentUser) {
      return { ok: false, message: "Please log in to place an order." };
    }

    if (cart.length === 0) {
      return { ok: false, message: "Your cart is empty." };
    }

    const items = cart
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        if (!product) {
          return null;
        }
        return {
          id: uniqueId("item"),
          orderId: "",
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price
        };
      })
      .filter(
        (
          item
        ): item is {
          id: string;
          orderId: string;
          productId: string;
          quantity: number;
          unitPrice: number;
        } => Boolean(item)
      );

    if (items.length === 0) {
      return { ok: false, message: "Unable to resolve cart items." };
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const discount = resolveDiscount(subtotal, payload.couponCode, promotions);
    const orderId = uniqueId("order");
    const order: Order = {
      id: orderId,
      userId: currentUser.id,
      totalPrice: subtotal - discount,
      status: "paid",
      createdAt: new Date().toISOString(),
      items: items.map((item) => ({ ...item, orderId })),
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      couponCode: payload.couponCode
    };

    setOrders([order, ...orders]);
    setCart([]);
    setProducts(
      products.map((product) => {
        const match = items.find((item) => item.productId === product.id);
        if (!match) {
          return product;
        }
        return { ...product, stock: Math.max(0, product.stock - match.quantity) };
      })
    );
    setUsers(
      users.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              totalOrders: user.totalOrders + 1,
              totalSpent: user.totalSpent + order.totalPrice
            }
          : user
      )
    );
    addNotification({
      title: "New paid order received",
      message: `Order ${orderId.toUpperCase()} was confirmed for ${currentUser.fullName}.`,
      type: "order",
      unread: true
    });

    return { ok: true, orderId, message: "Order confirmed." };
  };

  const upsertProduct = (input: Partial<Product>) => {
    if (input.id) {
      setProducts(
        products.map((product) =>
          product.id === input.id ? { ...product, ...input } as Product : product
        )
      );
      return;
    }

    const name = input.name ?? "Untitled Product";
    const product: Product = {
      id: uniqueId("product"),
      slug: slugify(name),
      name,
      price: input.price ?? 99,
      imageUrl:
        input.imageUrl ??
        "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
      gallery:
        input.gallery ??
        [
          input.imageUrl ??
            "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
        ],
      category: input.category ?? "General",
      stock: input.stock ?? 20,
      rating: input.rating ?? 4.6,
      reviewCount: input.reviewCount ?? 240,
      description:
        input.description ??
        "Freshly added through the Hadi admin console for premium merchandising workflows.",
      badge: input.badge ?? "New Arrival",
      tags: input.tags ?? ["New"],
      brand: input.brand ?? "Hadi Studio",
      seller: input.seller ?? "Hadi Official Store",
      deliveryEstimate: input.deliveryEstimate ?? "Arrives in 2-5 days",
      highlights:
        input.highlights ??
        [
          "Ready for a richer marketplace-style presentation with gallery photos and structured details.",
          "Built to look clean and premium in the storefront grid and detail page.",
          "Supports cart, wishlist, search, and category browsing immediately.",
          "Can be edited later from the Hadi admin product manager."
        ],
      specifications:
        input.specifications ??
        [
          { label: "Brand", value: "Hadi Studio" },
          { label: "Category", value: input.category ?? "General" },
          { label: "Availability", value: `${input.stock ?? 20} in stock` },
          { label: "Shipping", value: "Standard delivery in 2-5 business days" }
        ],
      featured: input.featured ?? false,
      trending: input.trending ?? false,
      sku: input.sku ?? `HADI-${Math.floor(Math.random() * 9000 + 1000)}`
    };
    setProducts([product, ...products]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
    setCart(cart.filter((item) => item.productId !== productId));
    setWishlist(wishlist.filter((value) => value !== productId));
  };

  const updateStock = (productId: string, stock: number) => {
    setProducts(
      products.map((product) => (product.id === productId ? { ...product, stock } : product))
    );
  };

  const savePromotion = (input: Partial<Promotion>) => {
    if (input.id) {
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === input.id ? { ...promotion, ...input } as Promotion : promotion
        )
      );
      return;
    }

    const promotion: Promotion = {
      id: uniqueId("promotion"),
      code: input.code ?? `SAVE${Math.floor(Math.random() * 40 + 10)}`,
      label: input.label ?? "New promotion",
      type: input.type ?? "percent",
      value: input.value ?? 10,
      minimumSpend: input.minimumSpend ?? 50,
      active: input.active ?? true,
      expiresAt: input.expiresAt ?? new Date(Date.now() + 30 * 86400000).toISOString()
    };

    setPromotions([promotion, ...promotions]);
  };

  const banUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "banned" : "active" } : user
      )
    );
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const recordSearch = (query: string, productIds: string[]) => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setSearchEvents([
      {
        id: uniqueId("search"),
        query: trimmed,
        productIds,
        createdAt: new Date().toISOString()
      },
      ...searchEvents
    ].slice(0, 30));
  };

  const value: PlatformContextValue = {
    ready,
    demoMode,
    locale,
    setLocale,
    currency,
    setCurrency,
    products,
    users,
    orders,
    promotions,
    notifications,
    searchEvents,
    cart,
    wishlist,
    currentUser,
    cartCount,
    cartSubtotal,
    login,
    register,
    resetPassword,
    logout,
    updateProfile,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    placeOrder,
    upsertProduct,
    deleteProduct,
    updateStock,
    savePromotion,
    banUser,
    markNotificationRead,
    recordSearch
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within PlatformProvider");
  }
  return context;
};
