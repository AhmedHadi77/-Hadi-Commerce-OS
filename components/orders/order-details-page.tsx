"use client";

import Link from "next/link";

import { usePlatform } from "@/components/providers/platform-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatMoney } from "@/lib/utils";

interface OrderDetailsPageProps {
  orderId: string;
}

export const OrderDetailsPage = ({ orderId }: OrderDetailsPageProps) => {
  const { orders, products, currency, locale } = usePlatform();
  const order = orders.find((candidate) => candidate.id === orderId);

  if (!order) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="Order not found" description="Place a new order to generate a confirmation page." />
      </div>
    );
  }

  return (
    <div className="section-shell py-12 sm:py-16">
      <Card className="bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Order confirmed</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Thank you for shopping with Hadi</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Your fake checkout flow completed successfully. This confirmation page is ready for assignment screenshots.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-5 shadow-soft">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Order ID</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{order.id}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-soft">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Placed on</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{formatDate(order.createdAt, locale)}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-soft">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{formatMoney(order.totalPrice, currency, locale)}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => {
                const product = products.find((candidate) => candidate.id === item.productId);
                return (
                  <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{product?.name ?? "Removed product"}</p>
                      <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatMoney(item.unitPrice * item.quantity, currency, locale)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/dashboard">
            <Button>Open dashboard</Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary">Continue shopping</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
