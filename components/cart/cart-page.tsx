"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { usePlatform } from "@/components/providers/platform-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import type { CartItem, Product } from "@/lib/types";

export const CartPage = () => {
  const {
    cart,
    products,
    promotions,
    currency,
    locale,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity
  } = usePlatform();

  const items = cart
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartItem & { product: Product } => Boolean(item));

  if (items.length === 0) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="Your cart is empty" description="Add products from the catalog to start building an order." />
      </div>
    );
  }

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 xl:grid-cols-[1.45fr,0.75fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="grid gap-4 sm:grid-cols-[160px,1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{item.product.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.product.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                    <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xl font-bold text-slate-900">
                    {formatMoney(item.product.price * item.quantity, currency, locale)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Checkout preview</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(cartSubtotal, currency, locale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Eligible coupon</span>
              <span>{promotions[0]?.code ?? "None"}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-900">
              <span>Estimated total</span>
              <span>{formatMoney(cartSubtotal, currency, locale)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-brand-50 p-4 text-sm leading-6 text-brand-700">
            Use `HADI10` or `SAVE25` during checkout to test the promotions engine.
          </div>

          <Link href="/checkout" className="mt-6 block">
            <Button fullWidth>Proceed to fake payment</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
