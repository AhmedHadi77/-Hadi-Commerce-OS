"use client";

import { Heart, ShieldCheck, ShoppingCart, Star, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/products/product-card";
import { usePlatform } from "@/components/providers/platform-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildRecommendations } from "@/lib/ai";
import { findCatalogProductBySlug } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
  const { products, addToCart, toggleWishlist, wishlist, currency, locale } = usePlatform();
  const product =
    products.find((candidate) => candidate.slug === slug) ?? findCatalogProductBySlug(slug, products);
  const [selectedImage, setSelectedImage] = useState(0);

  const gallery = useMemo(() => product?.gallery ?? [], [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [slug]);

  if (!product) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="Product not found" description="Try browsing the catalog to discover another item." />
      </div>
    );
  }

  const recommendations = buildRecommendations({
    products: products.filter((candidate) => candidate.id !== product.id),
    searchQuery: product.category
  }).products.slice(0, 4);

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="grid gap-4 lg:grid-cols-[110px,1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
            {gallery.map((image, index) => (
              <button
                key={`${product.id}-gallery-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`relative h-24 min-w-24 overflow-hidden rounded-3xl border transition ${
                  selectedImage === index ? "border-brand-400 ring-2 ring-brand-200" : "border-slate-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>

          <div className="order-1 rounded-[2.5rem] bg-white p-4 shadow-soft lg:order-2">
            <div className="relative aspect-square overflow-hidden rounded-[2rem]">
              <Image
                src={gallery[selectedImage] ?? product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {gallery.slice(0, 3).map((image, index) => (
                <div key={`${product.id}-preview-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image src={image} alt={`${product.name} preview ${index + 1}`} fill className="object-cover" sizes="20vw" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                {product.category}
              </span>
              <span className="rounded-full bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-600">
                {product.badge}
              </span>
            </div>
            <h1 className="font-display text-4xl font-semibold text-slate-900 sm:text-5xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 font-semibold text-amber-600">
                <Star className="h-4 w-4 fill-current" />
                {product.rating}
              </span>
              <span className="text-slate-500">{product.reviewCount} reviews</span>
              <span className="text-slate-500">SKU {product.sku}</span>
            </div>
            <p className="text-base leading-8 text-slate-600">{product.description}</p>
          </div>

          <Card className="bg-gradient-to-br from-white to-brand-50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-4xl font-bold text-slate-900">{formatMoney(product.price, currency, locale)}</p>
                <p className="mt-2 text-sm text-slate-500">{product.deliveryEstimate}</p>
              </div>
              <div className="space-y-2 text-right text-sm text-slate-600">
                <p>Brand: {product.brand}</p>
                <p>Seller: {product.seller}</p>
                <p>Stock: {product.stock} available</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => addToCart(product.id, 1, product)}>
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </Button>
              <Button variant="secondary" onClick={() => toggleWishlist(product.id)}>
                <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current text-rose-500" : ""}`} />
                Wishlist
              </Button>
            </div>

            <Link href="/checkout" className="mt-3 block">
              <Button fullWidth>Buy now</Button>
            </Link>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Truck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">Fast delivery</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.deliveryEstimate}</p>
            </Card>
            <Card>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Store className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">Seller</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.seller}</p>
            </Card>
            <Card>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">Buyer confidence</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Structured specs, multiple photos, and clear stock information.</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 xl:grid-cols-[1fr,1fr]">
        <Card>
          <h2 className="text-2xl font-semibold text-slate-900">About this item</h2>
          <ul className="mt-6 space-y-4">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                {highlight}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-slate-900">Product details</h2>
          <div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-100">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[150px,1fr] gap-4 bg-white px-4 py-4 text-sm">
                <span className="font-semibold text-slate-500">{spec.label}</span>
                <span className="text-slate-700">{spec.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-slate-900">More product photos</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {gallery.map((image, index) => (
            <div key={`${product.id}-gallery-panel-${index}`} className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image src={image} alt={`${product.name} gallery view ${index + 1}`} fill className="object-cover" sizes="20vw" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-900">You may also like</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {recommendations.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
