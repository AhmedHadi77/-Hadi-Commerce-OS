import type { Locale } from "@/lib/types";

export const messages = {
  en: {
    brandTag: "Premium commerce operating system",
    heroTitle: "Run shopping, analytics, admin, and AI from one bright control room.",
    heroBody:
      "Hadi combines an elegant storefront, a Shopify-grade admin surface, and live operational insight for scaling product teams.",
    explore: "Explore catalog",
    adminView: "Open admin suite",
    trending: "Trending now",
    featured: "Featured products",
    categories: "Categories",
    dashboard: "Dashboard",
    products: "Products",
    cart: "Cart",
    admin: "Admin",
    profile: "Profile",
    login: "Login",
    register: "Register",
    welcomeBack: "Welcome back",
    createAccount: "Create your Hadi account",
    searchPlaceholder: "Search premium products, collections, and ideas...",
    aiGreeting: "Need a quick recommendation? Ask Hadi AI."
  },
  ar: {
    brandTag: "منصة تجارة وتشغيل ذكية",
    heroTitle: "أدر المتجر والتحليلات والإدارة والذكاء الاصطناعي من مكان واحد.",
    heroBody:
      "هادي يجمع بين متجر حديث ولوحة إدارة احترافية وتحليلات حية لتجربة تشبه المنصات العالمية.",
    explore: "استعرض المنتجات",
    adminView: "افتح لوحة الإدارة",
    trending: "الأكثر رواجاً",
    featured: "منتجات مميزة",
    categories: "الفئات",
    dashboard: "اللوحة",
    products: "المنتجات",
    cart: "السلة",
    admin: "الإدارة",
    profile: "الملف الشخصي",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    welcomeBack: "مرحباً بعودتك",
    createAccount: "أنشئ حساب هادي",
    searchPlaceholder: "ابحث عن منتجات ومجموعات وأفكار مميزة...",
    aiGreeting: "هل تحتاج اقتراحاً سريعاً؟ اسأل هادي AI."
  }
} as const;

export const getDirection = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");
