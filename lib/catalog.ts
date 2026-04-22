import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/types";

const prefixBanks = [
  ["Orbit", "Nova", "Aero", "Pulse", "Halo", "Vector"],
  ["Luma", "Harbor", "Nest", "Bloom", "Vista", "Serene"],
  ["Mode", "Verve", "Luxe", "Aster", "Rue", "Velour"],
  ["Aura", "Radiant", "Pure", "Silk", "Rose", "Velvet"],
  ["Summit", "Stride", "Elevate", "Core", "Sprint", "Drift"],
  ["Harvest", "Daily", "Golden", "Green", "Sunrise", "Purely"],
  ["Atlas", "Beacon", "Story", "Script", "Quill", "Chapter"],
  ["Spark", "Wonder", "Play", "Rocket", "Joy", "Pixel"],
  ["Opal", "Crown", "Silver", "Aurora", "Gleam", "Gem"],
  ["Prime", "Studio", "Modern", "Select", "Elite", "Signature"]
] as const;

const materialBank = [
  "Aluminum finish",
  "Soft-touch composite",
  "Premium woven fabric",
  "Tempered glass",
  "Recycled polymer shell",
  "Matte ceramic blend"
] as const;

const colorBank = [
  "Sand",
  "Cloud White",
  "Ocean Blue",
  "Forest Green",
  "Graphite",
  "Sunrise Gold"
] as const;

const descriptorBank = [
  "crafted for fast-moving modern households",
  "built for premium convenience and everyday delight",
  "designed to elevate your routine with polished utility",
  "tuned for comfort, confidence, and long-term value",
  "engineered with thoughtful details and vibrant performance",
  "made to feel polished on day one and dependable over time"
] as const;

type MediaKey =
  | "electronics"
  | "home"
  | "fashion"
  | "beauty"
  | "sports"
  | "grocery"
  | "books"
  | "play"
  | "luxury"
  | "office"
  | "outdoor";

const categorySeeds = [
  {
    name: "Electronics",
    badge: "Best Seller",
    mediaKey: "electronics" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Speaker", "Watch", "Laptop", "Headset", "Keyboard", "Camera"]
  },
  {
    name: "Home Living",
    badge: "Editor Pick",
    mediaKey: "home" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Lamp", "Sofa", "Chair", "Planter", "Table", "Mirror"]
  },
  {
    name: "Fashion",
    badge: "Hot Drop",
    mediaKey: "fashion" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Jacket", "Sneaker", "Tote", "Dress", "Shirt", "Scarf"]
  },
  {
    name: "Beauty",
    badge: "Glow Lab",
    mediaKey: "beauty" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Serum", "Palette", "Cream", "Mist", "Cleanser", "Oil"]
  },
  {
    name: "Sports",
    badge: "Peak Energy",
    mediaKey: "sports" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Bottle", "Backpack", "Mat", "Trainer", "Band", "Helmet"]
  },
  {
    name: "Groceries",
    badge: "Fresh Weekly",
    mediaKey: "grocery" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Bundle", "Box", "Pack", "Selection", "Treat", "Blend"]
  },
  {
    name: "Books",
    badge: "Reader Favorite",
    mediaKey: "books" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Novel", "Guide", "Journal", "Anthology", "Manual", "Collection"]
  },
  {
    name: "Toys",
    badge: "Play Pick",
    mediaKey: "play" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Puzzle", "Robot", "Set", "Doll", "Game", "Builder"]
  },
  {
    name: "Jewelry",
    badge: "Gift Ready",
    mediaKey: "luxury" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Ring", "Bracelet", "Necklace", "Charm", "Pendant", "Earring"]
  },
  {
    name: "Furniture",
    badge: "Studio Select",
    mediaKey: "home" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Desk", "Cabinet", "Bench", "Shelf", "Ottoman", "Console"]
  },
  {
    name: "Office",
    badge: "Work Smart",
    mediaKey: "office" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Chair", "Planner", "Organizer", "Stand", "Tray", "Station"]
  },
  {
    name: "Gaming",
    badge: "Top Rated",
    mediaKey: "electronics" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Console", "Controller", "Mouse", "Headset", "Display", "Deskpad"]
  },
  {
    name: "Pet Care",
    badge: "Tail Wag",
    mediaKey: "outdoor" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Bed", "Toy", "Leash", "Feeder", "Treat", "Carrier"]
  },
  {
    name: "Baby",
    badge: "Parent Choice",
    mediaKey: "play" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Blanket", "Bottle", "Stroller", "Toy", "Monitor", "Carrier"]
  },
  {
    name: "Health",
    badge: "Daily Care",
    mediaKey: "beauty" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Kit", "Tracker", "Supplement", "Mask", "Monitor", "Wrap"]
  },
  {
    name: "Kitchen",
    badge: "Chef Pick",
    mediaKey: "home" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Pan", "Mixer", "Knife", "Board", "Kettle", "Set"]
  },
  {
    name: "Automotive",
    badge: "Road Ready",
    mediaKey: "outdoor" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Charger", "Mount", "Cleaner", "Cover", "Compressor", "Toolkit"]
  },
  {
    name: "Garden",
    badge: "Outdoor Pick",
    mediaKey: "outdoor" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Planter", "Hose", "Shovel", "Bench", "Lantern", "Pot"]
  },
  {
    name: "Travel",
    badge: "Carry On",
    mediaKey: "outdoor" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Suitcase", "Pillow", "Organizer", "Bottle", "Wallet", "Adapter"]
  },
  {
    name: "Music",
    badge: "Stage Pick",
    mediaKey: "books" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Guitar", "Keyboard", "Mic", "Stand", "Pedal", "Mixer"]
  },
  {
    name: "Photography",
    badge: "Creator Gear",
    mediaKey: "electronics" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Lens", "Tripod", "Bag", "Light", "Monitor", "Drone"]
  },
  {
    name: "Watches",
    badge: "Timeless",
    mediaKey: "luxury" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Chronograph", "Band", "Case", "Dial", "Edition", "Tracker"]
  },
  {
    name: "Footwear",
    badge: "Fast Seller",
    mediaKey: "fashion" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Runner", "Boot", "Slipon", "Trainer", "Sandal", "Loafer"]
  },
  {
    name: "Outdoor",
    badge: "Trail Ready",
    mediaKey: "outdoor" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Tent", "Chair", "Lantern", "Cooler", "Pack", "Hammock"]
  },
  {
    name: "Smart Home",
    badge: "Connected",
    mediaKey: "electronics" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Sensor", "Hub", "Bulb", "Lock", "Cam", "Thermostat"]
  },
  {
    name: "Wellness",
    badge: "Balance Pick",
    mediaKey: "beauty" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Mat", "Diffuser", "Roller", "Pillow", "Candle", "Journal"]
  },
  {
    name: "Stationery",
    badge: "Desk Joy",
    mediaKey: "office" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Notebook", "Pen", "Marker", "Folder", "Stamp", "Set"]
  },
  {
    name: "Art Decor",
    badge: "Gallery Pick",
    mediaKey: "home" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Canvas", "Print", "Vase", "Frame", "Sculpture", "Accent"]
  },
  {
    name: "Fitness Tech",
    badge: "Performance",
    mediaKey: "sports" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Tracker", "Scale", "Sensor", "Band", "Watch", "Bike"]
  },
  {
    name: "Luxury Gifts",
    badge: "Premium Box",
    mediaKey: "luxury" as MediaKey,
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
    nouns: ["Hamper", "Box", "Set", "Collection", "Edition", "Bundle"]
  }
] as const;

const categoryImageMap = Object.fromEntries(
  categorySeeds.map((seed) => [seed.name, seed.image])
) as Record<string, string>;

const mediaBanks: Record<MediaKey, string[]> = {
  electronics: [
    categoryImageMap.Electronics,
    categoryImageMap.Gaming,
    categoryImageMap.Photography,
    categoryImageMap["Smart Home"],
    categoryImageMap.Office,
    categoryImageMap.Watches
  ],
  home: [
    categoryImageMap["Home Living"],
    categoryImageMap.Furniture,
    categoryImageMap.Kitchen,
    categoryImageMap.Garden,
    categoryImageMap["Art Decor"],
    categoryImageMap.Wellness
  ],
  fashion: [
    categoryImageMap.Fashion,
    categoryImageMap.Footwear,
    categoryImageMap.Travel,
    categoryImageMap["Luxury Gifts"],
    categoryImageMap.Jewelry,
    categoryImageMap.Watches
  ],
  beauty: [
    categoryImageMap.Beauty,
    categoryImageMap.Health,
    categoryImageMap.Wellness,
    categoryImageMap["Luxury Gifts"],
    categoryImageMap.Jewelry,
    categoryImageMap.Fashion
  ],
  sports: [
    categoryImageMap.Sports,
    categoryImageMap["Fitness Tech"],
    categoryImageMap.Outdoor,
    categoryImageMap.Travel,
    categoryImageMap.Automotive,
    categoryImageMap["Pet Care"]
  ],
  grocery: [
    categoryImageMap.Groceries,
    categoryImageMap.Kitchen,
    categoryImageMap.Health,
    categoryImageMap["Home Living"],
    categoryImageMap.Wellness,
    categoryImageMap.Garden
  ],
  books: [
    categoryImageMap.Books,
    categoryImageMap.Stationery,
    categoryImageMap.Office,
    categoryImageMap.Music,
    categoryImageMap.Photography,
    categoryImageMap.Toys
  ],
  play: [
    categoryImageMap.Toys,
    categoryImageMap.Baby,
    categoryImageMap.Books,
    categoryImageMap.Gaming,
    categoryImageMap.Music,
    categoryImageMap["Pet Care"]
  ],
  luxury: [
    categoryImageMap.Jewelry,
    categoryImageMap["Luxury Gifts"],
    categoryImageMap.Watches,
    categoryImageMap.Fashion,
    categoryImageMap.Beauty,
    categoryImageMap["Art Decor"]
  ],
  office: [
    categoryImageMap.Office,
    categoryImageMap.Stationery,
    categoryImageMap.Books,
    categoryImageMap.Electronics,
    categoryImageMap["Smart Home"],
    categoryImageMap.Photography
  ],
  outdoor: [
    categoryImageMap.Outdoor,
    categoryImageMap.Travel,
    categoryImageMap.Garden,
    categoryImageMap.Automotive,
    categoryImageMap.Sports,
    categoryImageMap["Pet Care"]
  ]
};

const categories = categorySeeds.map((category, index) => ({
  ...category,
  names: prefixBanks[index % prefixBanks.length]
}));

export const BASE_PRODUCTS_PER_CATEGORY = 24;
export const CATEGORY_ENDLESS_PRODUCT_COUNT = 540;

export const CATEGORY_CARDS = categories.map((category, index) => ({
  id: `category-${index + 1}`,
  title: category.name,
  imageUrl: category.image,
  productCount: CATEGORY_ENDLESS_PRODUCT_COUNT
}));

const getCategoryIndex = (categoryName: string) =>
  categories.findIndex(
    (category) => category.name.toLowerCase() === categoryName.trim().toLowerCase()
  );

const buildProductImage = ({
  categoryName,
  prefix,
  noun,
  serial,
  variant
}: {
  categoryName: string;
  prefix: string;
  noun: string;
  serial: number;
  variant: number;
}) => {
  const seed = slugify(`hadi-${categoryName}-${prefix}-${noun}-${serial}-${variant}`);
  return `https://picsum.photos/seed/${seed}/1200/1200`;
};

const buildGallery = ({
  categoryIndex,
  categoryName,
  prefix,
  noun,
  serial
}: {
  categoryIndex: number;
  categoryName: string;
  prefix: string;
  noun: string;
  serial: number;
}) => {
  const mediaKey = categories[categoryIndex].mediaKey;
  const categoryImage = mediaBanks[mediaKey][(serial + categoryIndex) % mediaBanks[mediaKey].length];

  return [
    buildProductImage({ categoryName, prefix, noun, serial, variant: 1 }),
    buildProductImage({ categoryName, prefix, noun, serial, variant: 2 }),
    buildProductImage({ categoryName, prefix, noun, serial, variant: 3 }),
    buildProductImage({ categoryName, prefix, noun, serial, variant: 4 }),
    categoryImage
  ];
};

const buildHighlights = (categoryName: string, noun: string, prefix: string, stock: number) => [
  `${prefix} ${noun} is tuned for ${categoryName.toLowerCase()} shoppers who want premium presentation and strong everyday usability.`,
  `Ships with polished fit-and-finish details, rich visual styling, and faster browsing context for marketplace-style shopping.`,
  `Stock visibility is live in the interface, with ${stock} units currently available for this generated listing.`,
  "Supports a richer product page layout with gallery photos, structured specs, and a clean buy box experience."
];

const buildSpecifications = ({
  prefix,
  noun,
  serial,
  categoryName,
  stock,
  categoryIndex
}: {
  prefix: string;
  noun: string;
  serial: number;
  categoryName: string;
  stock: number;
  categoryIndex: number;
}) => [
  { label: "Brand", value: `${prefix} Studio` },
  { label: "Model", value: `${noun}-${String(serial).padStart(4, "0")}` },
  { label: "Category", value: categoryName },
  { label: "Material", value: materialBank[(serial + categoryIndex) % materialBank.length] },
  { label: "Color", value: colorBank[(serial + categoryIndex * 2) % colorBank.length] },
  { label: "Availability", value: `${stock} in stock` },
  { label: "Warranty", value: "12 months seller warranty" },
  { label: "Shipping", value: "Standard delivery in 2-5 business days" }
];

const createProduct = (categoryIndex: number, itemIndex: number): Product => {
  const category = categories[categoryIndex];
  const prefix = category.names[itemIndex % category.names.length];
  const noun = category.nouns[Math.floor(itemIndex / category.names.length) % category.nouns.length];
  const serial = itemIndex + 1;
  const gallery = buildGallery({
    categoryIndex,
    categoryName: category.name,
    prefix,
    noun,
    serial
  });
  const name = `${prefix} ${noun} ${serial}`;
  const price = 28 + categoryIndex * 6 + (itemIndex % 20) * 7;
  const stock = 10 + ((itemIndex * 11 + categoryIndex * 5) % 180);
  const rating = Number((4 + ((itemIndex + categoryIndex) % 10) / 20).toFixed(1));
  const reviewCount = 120 + ((itemIndex * 19 + categoryIndex * 31) % 3600);

  return {
    id: `product-${categoryIndex + 1}-${serial}`,
    slug: slugify(`${name}-${category.name}`),
    name,
    price,
    imageUrl: gallery[0],
    gallery,
    category: category.name,
    stock,
    rating,
    reviewCount,
    description: `${name} is ${descriptorBank[(itemIndex + categoryIndex) % descriptorBank.length]}. The listing is generated to feel closer to a large marketplace, with multiple images, full details, and a stronger buying context for shoppers comparing many products.`,
    badge: category.badge,
    tags: [category.name, prefix, noun, serial > 400 ? "Deep Catalog" : "In Demand"],
    brand: `${prefix} Studio`,
    seller: `${prefix} Official Store`,
    deliveryEstimate: itemIndex % 3 === 0 ? "Arrives tomorrow" : "Arrives in 2-5 days",
    highlights: buildHighlights(category.name, noun, prefix, stock),
    specifications: buildSpecifications({
      prefix,
      noun,
      serial,
      categoryName: category.name,
      stock,
      categoryIndex
    }),
    featured: itemIndex < 4,
    trending: itemIndex % 9 === 0,
    sku: `HADI-${String(categoryIndex + 1).padStart(2, "0")}${String(serial).padStart(4, "0")}`
  };
};

export const CATALOG: Product[] = categories.flatMap((_, categoryIndex) =>
  Array.from({ length: BASE_PRODUCTS_PER_CATEGORY }, (_value, itemIndex) =>
    createProduct(categoryIndex, itemIndex)
  )
);

export const getCategoryNames = () => categories.map((category) => category.name);

export const getCategoryProductFeed = (
  categoryName: string,
  count = CATEGORY_ENDLESS_PRODUCT_COUNT
) => {
  const categoryIndex = getCategoryIndex(categoryName);

  if (categoryIndex === -1) {
    return [];
  }

  return Array.from({ length: count }, (_value, itemIndex) =>
    createProduct(categoryIndex, itemIndex)
  );
};

export const findCatalogProductBySlug = (slug: string, products: Product[] = CATALOG) => {
  const existing = products.find((product) => product.slug === slug);
  if (existing) {
    return existing;
  }

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex += 1) {
    for (let itemIndex = 0; itemIndex < CATEGORY_ENDLESS_PRODUCT_COUNT; itemIndex += 1) {
      const candidate = createProduct(categoryIndex, itemIndex);
      if (candidate.slug === slug) {
        return candidate;
      }
    }
  }

  return undefined;
};
