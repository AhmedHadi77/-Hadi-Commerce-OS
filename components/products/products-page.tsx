"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductCard } from "@/components/products/product-card";
import { usePlatform } from "@/components/providers/platform-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  CATEGORY_CARDS,
  CATEGORY_ENDLESS_PRODUCT_COUNT,
  getCategoryProductFeed
} from "@/lib/catalog";
import { messages } from "@/lib/i18n";
import type { Product } from "@/lib/types";

const DEFAULT_ALL_VISIBLE = 60;
const DEFAULT_CATEGORY_VISIBLE = 100;

const matchesCatalogFilters = ({
  product,
  normalizedQuery,
  selectedCategory,
  minimumRating,
  priceRange
}: {
  product: Product;
  normalizedQuery: string;
  selectedCategory: string;
  minimumRating: number;
  priceRange: [number, number];
}) => {
  const matchesQuery =
    normalizedQuery.length === 0 ||
    product.name.toLowerCase().includes(normalizedQuery) ||
    product.description.toLowerCase().includes(normalizedQuery) ||
    product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
  const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
  const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
  const matchesRating = product.rating >= minimumRating;

  return matchesQuery && matchesCategory && matchesPrice && matchesRating;
};

export const ProductsPage = () => {
  const { products, recordSearch, locale } = usePlatform();
  const copy = messages[locale];
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minimumRating, setMinimumRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_ALL_VISIBLE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebouncedValue(query, 250);
  const normalizedQuery = debouncedQuery.toLowerCase();

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set([
          ...CATEGORY_CARDS.map((category) => category.title),
          ...products.map((product) => product.category)
        ])
      )
    ],
    [products]
  );

  const categoryCards = useMemo(
    () => CATEGORY_CARDS.filter((card) => categories.includes(card.title)),
    [categories]
  );

  const filtered = useMemo(
    () =>
      products.filter((product) =>
        matchesCatalogFilters({
          product,
          normalizedQuery,
          selectedCategory,
          minimumRating,
          priceRange
        })
      ),
    [products, normalizedQuery, selectedCategory, minimumRating, priceRange]
  );

  const endlessFeed = useMemo(() => {
    if (selectedCategory === "All") {
      return [];
    }

    return getCategoryProductFeed(selectedCategory, CATEGORY_ENDLESS_PRODUCT_COUNT).filter((product) =>
      matchesCatalogFilters({
        product,
        normalizedQuery,
        selectedCategory,
        minimumRating,
        priceRange
      })
    );
  }, [selectedCategory, normalizedQuery, minimumRating, priceRange]);

  const suggestions = useMemo(
    () =>
      products
        .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6),
    [products, query]
  );

  useEffect(() => {
    setVisibleCount(selectedCategory === "All" ? DEFAULT_ALL_VISIBLE : DEFAULT_CATEGORY_VISIBLE);
  }, [selectedCategory, debouncedQuery, minimumRating, priceRange]);

  useEffect(() => {
    if (selectedCategory === "All" || visibleCount >= endlessFeed.length) {
      return;
    }

    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 24, endlessFeed.length));
        }
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [endlessFeed.length, selectedCategory, visibleCount]);

  const openCategory = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    setVisibleCount(categoryTitle === "All" ? DEFAULT_ALL_VISIBLE : DEFAULT_CATEGORY_VISIBLE);
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const submitSearch = (value: string) => {
    setQuery(value);
    const source = selectedCategory === "All" ? filtered : endlessFeed;
    const resultIds = source.slice(0, 12).map((product) => product.id);
    recordSearch(value, resultIds);
  };

  return (
    <div className="section-shell py-12 sm:py-16">
      <Card className="overflow-visible border-white/80 bg-white/90">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => query && submitSearch(query)}
            placeholder={copy.searchPlaceholder}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
          {query ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 rounded-3xl border border-slate-100 bg-white p-3 shadow-soft">
              {suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onMouseDown={() => submitSearch(product.name)}
                    className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm text-slate-700 transition hover:bg-brand-50"
                  >
                    <span>{product.name}</span>
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {product.category}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-slate-500">No quick suggestions yet.</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Categories</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Start with search, then jump into a category
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Every category card has its own image, and opening one unlocks a deeper product feed with at
              least 100 products visible first and more loading as you continue scrolling.
            </p>
          </div>
          <Button variant="secondary" onClick={() => openCategory("All")}>
            Show all
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categoryCards.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => openCategory(category.title)}
              className={`group overflow-hidden rounded-[1.75rem] border text-left transition ${
                selectedCategory === category.title
                  ? "border-brand-300 ring-2 ring-brand-200"
                  : "border-white/70 hover:border-brand-200"
              }`}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={category.imageUrl}
                  alt={category.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
                    Category
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{category.title}</h2>
                  <p className="mt-2 text-sm text-white/80">{category.productCount}+ products</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div ref={resultsRef} className="mt-10 space-y-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Filters</p>
              <h2 className="text-xl font-semibold text-slate-900">Refine products</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr,0.8fr,0.8fr,auto] xl:items-end">
            <div>
              <p className="text-sm font-medium text-slate-700">Category</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => openCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-brand-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Minimum rating</label>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minimumRating}
                onChange={(event) => setMinimumRating(Number(event.target.value))}
                className="mt-3 w-full accent-brand-500"
              />
              <p className="mt-2 text-sm text-slate-500">{minimumRating.toFixed(1)} stars and above</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Min price
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(event) => setPriceRange([Number(event.target.value), priceRange[1]])}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Max price
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setSelectedCategory("All");
                setMinimumRating(0);
                setPriceRange([0, 500]);
                setQuery("");
                setVisibleCount(DEFAULT_ALL_VISIBLE);
              }}
              fullWidth
            >
              <X className="h-4 w-4" />
              Reset filters
            </Button>
          </div>
        </Card>

        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Results</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                {selectedCategory === "All" ? filtered.length : endlessFeed.length} products found
              </h3>
            </div>
            <p className="text-sm text-slate-500">
              {selectedCategory === "All"
                ? "Browse the mixed storefront catalog"
                : `${selectedCategory} feed with ${CATEGORY_ENDLESS_PRODUCT_COUNT}+ marketplace-style products`}
            </p>
          </div>

          {selectedCategory === "All" ? (
            <>
              <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                Search first or click a category card above to open a deeper feed. The all-products view shows
                a lighter storefront mix, while category browsing opens a larger marketplace-style listing.
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {filtered.slice(0, DEFAULT_ALL_VISIBLE).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div id="category-feed">
              <div className="mt-4 rounded-3xl bg-brand-50 p-4 text-sm leading-7 text-brand-700">
                Browsing <strong>{selectedCategory}</strong>. The first 100 products are available right away,
                with more continuing to load below as you scroll.
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {endlessFeed.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div ref={sentinelRef} className="h-10" />

              {visibleCount < endlessFeed.length ? (
                <div className="mt-2 flex justify-center">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setVisibleCount((current) => Math.min(current + 24, endlessFeed.length))
                    }
                  >
                    Load more products
                  </Button>
                </div>
              ) : (
                <p className="mt-6 text-center text-sm text-slate-500">
                  You reached the end of the {selectedCategory} feed.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
