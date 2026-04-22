"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { buildCategorySales, buildRevenueSeries, getCommerceSnapshot, getTopProducts } from "@/lib/analytics";
import { usePlatform } from "@/components/providers/platform-provider";
import { NotificationPanel } from "@/components/dashboard/notification-panel";
import { Card } from "@/components/ui/card";
import { formatMoney, formatDate } from "@/lib/utils";

const pieColors = ["#14b8a6", "#2dd4bf", "#fb923c", "#f97316", "#38bdf8", "#facc15"];

export const AdminOverview = () => {
  const { products, users, orders, currency, locale, searchEvents } = usePlatform();
  const snapshot = getCommerceSnapshot(products, orders, users);
  const revenueSeries = buildRevenueSeries(orders);
  const categorySeries = buildCategorySales(products, orders);
  const topProducts = getTopProducts(products, orders);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-brand-600 to-brand-500 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Realtime commerce analytics</p>
        <h2 className="mt-2 text-4xl font-semibold">Hadi SaaS dashboard</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85">
          Revenue, customer activity, stock health, user behavior, and top-performing products are consolidated here for fast operational decisions.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white/12 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Revenue</p>
            <p className="mt-2 text-3xl font-semibold">{formatMoney(snapshot.revenue, currency, locale)}</p>
          </div>
          <div className="rounded-3xl bg-white/12 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Orders</p>
            <p className="mt-2 text-3xl font-semibold">{snapshot.orders}</p>
          </div>
          <div className="rounded-3xl bg-white/12 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Users</p>
            <p className="mt-2 text-3xl font-semibold">{snapshot.users}</p>
          </div>
          <div className="rounded-3xl bg-white/12 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Low stock</p>
            <p className="mt-2 text-3xl font-semibold">{snapshot.lowStock}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.25fr,0.75fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Revenue trend</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Daily performance pulse</h3>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" fill="#99f6e4" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <NotificationPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Sales mix</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Category contribution</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySeries} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {categorySeries.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">User behavior</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Recent search intent</h3>
          <div className="mt-6 space-y-3">
            {searchEvents.slice(0, 6).map((event) => (
              <div key={event.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{event.query}</p>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {formatDate(event.createdAt, locale)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{event.productIds.length} matching products were surfaced.</p>
              </div>
            ))}
            {searchEvents.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Shopper search behavior will appear here after storefront queries are performed.
              </p>
            ) : null}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Top products</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Best performing SKUs</h3>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <XAxis dataKey="name" tick={false} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" fill="#fb923c" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Leaderboard</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Products with the strongest conversion signal</h3>
          <div className="mt-6 space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-700">{product.sold} sold</p>
                    <p className="text-sm text-slate-500">{formatMoney(product.price, currency, locale)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
