"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlatform } from "@/components/providers/platform-provider";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, toggleWishlist, wishlist, currency, locale } = usePlatform();
  const liked = wishlist.includes(product.id);

  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
          {product.badge}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-soft transition hover:scale-105"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {product.category}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            {product.rating}
          </span>
        </div>
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-lg font-semibold text-slate-900 transition hover:text-brand-700">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-slate-900">
              {formatMoney(product.price, currency, locale)}
            </p>
            <p className="text-xs font-medium text-slate-500">{product.stock} items left</p>
          </div>
          <Button onClick={() => addToCart(product.id, 1, product)}>
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};
