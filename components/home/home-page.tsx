"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

import { AIChatWidget } from "@/components/shared/ai-chat-widget";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeading } from "@/components/ui/section-heading";
import { CATEGORY_CARDS } from "@/lib/catalog";
import { messages } from "@/lib/i18n";
import { usePlatform } from "@/components/providers/platform-provider";

export const HomePage = () => {
  const { products, locale, currentUser } = usePlatform();
  const copy = messages[locale];
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const trending = products.filter((product) => product.trending).slice(0, 8);
  const stats = [
    { label: "Products", value: `${products.length}+` },
    { label: "Categories", value: `${CATEGORY_CARDS.length}+` },
    { label: "Per category feed", value: "540+" }
  ];

  return (
    <div className="pb-16">
      <section className="section-shell pt-10 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.5rem] bg-hero-glow bg-soft-grid bg-[size:22px_22px] p-8 sm:p-12"
          >
            <Pill>{copy.brandTag}</Pill>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-tight text-slate-900 sm:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{copy.heroBody}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products">
                <Button>
                  {copy.explore}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={currentUser?.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="secondary">{copy.adminView}</Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-white/80 p-5 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              {
                icon: TrendingUp,
                title: "Realtime revenue pulse",
                body: "Track daily sales, top categories, and operational signals without leaving the dashboard."
              },
              {
                icon: Sparkles,
                title: "AI product concierge",
                body: "Help shoppers discover better baskets with suggestion flows, gifting logic, and trend-aware picks."
              },
              {
                icon: ShieldCheck,
                title: "Supabase-ready auth",
                body: "JWT sessions, role routing, and password recovery flow are already wired for deployment."
              },
              {
                icon: Zap,
                title: "Admin speed tools",
                body: "Merchandising, coupons, inventory, and user control live in one polished SaaS control surface."
              }
            ].map((item) => (
              <Card key={item.title} className="bg-white/90">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <SectionHeading
          eyebrow={copy.categories}
          title="Curated departments with premium merchandising"
          description="Thirty category lanes are available, and each one can open a much deeper product stream on the products page."
          actionHref="/products"
          actionLabel="Open full catalog"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CATEGORY_CARDS.slice(0, 6).map((category) => (
            <Card key={category.id} className="bg-gradient-to-br from-white to-brand-50">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{category.productCount}+ products</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Premium discovery layout with bright visuals, personalized merchandising, and category-depth browsing.
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <SectionHeading
          eyebrow={copy.featured}
          title="Featured products that feel launch-ready"
          description="High-rated, in-demand picks surface first to mirror a real conversion-optimized storefront."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <SectionHeading
          eyebrow={copy.trending}
          title="Trending products shoppers are moving on now"
          description="The seeded catalog is larger now, and the product page opens 540-item infinite feeds for each category lane."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {trending.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <AIChatWidget />
        </div>
      </section>
    </div>
  );
};
