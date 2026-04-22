"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { buildRecommendations } from "@/lib/ai";
import { usePlatform } from "@/components/providers/platform-provider";
import { AIChatWidget } from "@/components/shared/ai-chat-widget";
import { NotificationPanel } from "@/components/dashboard/notification-panel";
import { ProductCard } from "@/components/products/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";

export const UserDashboard = () => {
  const { currentUser, orders, products, wishlist, currency, locale, searchEvents } = usePlatform();

  if (!currentUser) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="Login required" description="Sign in to open your personalized dashboard." />
      </div>
    );
  }

  const myOrders = orders.filter((order) => order.userId === currentUser.id);
  const recentSeries = myOrders
    .slice()
    .reverse()
    .map((order, index) => ({
      label: `Order ${index + 1}`,
      total: order.totalPrice
    }));
  const recommendations = buildRecommendations({
    products,
    wishlistProductIds: wishlist,
    searchQuery: searchEvents[0]?.query
  }).products.slice(0, 4);

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-brand-600 to-brand-500 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Customer dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold">{currentUser.fullName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
              Track your order history, wishlist momentum, and AI-guided recommendations from a premium user panel.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/12 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">Orders</p>
                <p className="mt-2 text-3xl font-semibold">{myOrders.length}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">Wishlist</p>
                <p className="mt-2 text-3xl font-semibold">{wishlist.length}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">Spent</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatMoney(myOrders.reduce((sum, order) => sum + order.totalPrice, 0), currency, locale)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Spending trend</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order value over time</h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentSeries}>
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Recommended for you</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <NotificationPanel />
          <AIChatWidget />
        </div>
      </div>
    </div>
  );
};
