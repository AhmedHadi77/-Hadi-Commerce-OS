"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePlatform } from "@/components/providers/platform-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import type { CartItem, Product } from "@/lib/types";

export const CheckoutPage = () => {
  const router = useRouter();
  const { currentUser, cart, products, promotions, placeOrder, cartSubtotal, currency, locale } =
    usePlatform();
  const [shippingAddress, setShippingAddress] = useState("18 Jalan Ampang, Kuala Lumpur");
  const [paymentMethod, setPaymentMethod] = useState("Visa ending 4242");
  const [couponCode, setCouponCode] = useState("HADI10");
  const [feedback, setFeedback] = useState<string | null>(null);

  const items = cart
    .map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is CartItem & { product: Product } => Boolean(item));

  if (!currentUser) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="Login required" description="Sign in before completing a checkout flow." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="No items to checkout" description="Add products to your cart first." />
      </div>
    );
  }

  const submit = () => {
    const result = placeOrder({
      shippingAddress,
      paymentMethod,
      couponCode
    });

    setFeedback(result.message);
    if (result.ok && result.orderId) {
      router.push(`/orders/${result.orderId}`);
    }
  };

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 xl:grid-cols-[1.05fr,0.95fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Secure UI checkout</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Fake payment experience</h1>

          <div className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Shipping address
              <textarea
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Payment method
              <input
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Coupon code
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>

            <div className="rounded-3xl bg-accent-50 p-4 text-sm leading-6 text-accent-700">
              Available promotions: {promotions.map((promotion) => promotion.code).join(", ")}
            </div>

            {feedback ? (
              <div className="rounded-3xl bg-brand-50 px-4 py-3 text-sm leading-6 text-brand-700">{feedback}</div>
            ) : null}

            <Button onClick={submit} fullWidth>
              Confirm fake payment
            </Button>
          </div>
        </Card>

        <Card className="h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Items in this order</h2>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.product.name}</p>
                  <p className="text-sm text-slate-500">
                    Qty {item.quantity} x {formatMoney(item.product.price, currency, locale)}
                  </p>
                </div>
                <p className="font-semibold text-slate-900">
                  {formatMoney(item.quantity * item.product.price, currency, locale)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatMoney(cartSubtotal, currency, locale)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
