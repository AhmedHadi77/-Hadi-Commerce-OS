"use client";

import {
  Globe2,
  Heart,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  ShoppingCart,
  UserCircle2,
  X
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { messages } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePlatform } from "@/components/providers/platform-provider";

const navItems = [
  { href: "/", key: "dashboard", label: "Home" },
  { href: "/products", key: "products", label: "Products" },
  { href: "/dashboard", key: "dashboard", label: "Dashboard" },
  { href: "/cart", key: "cart", label: "Cart" },
  { href: "/admin", key: "admin", label: "Admin" }
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const {
    cartCount,
    wishlist,
    currentUser,
    locale,
    currency,
    setLocale,
    setCurrency,
    logout
  } = usePlatform();
  const copy = messages[locale];
  const rightLabel = useMemo(
    () => (locale === "ar" ? "EN" : "AR"),
    [locale]
  );

  const links = (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
          onClick={() => setOpen(false)}
        >
          {item.href === "/" ? "Home" : copy[item.key as keyof typeof copy] ?? item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/80 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">{links}</nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition hover:bg-brand-100"
          >
            <Globe2 className="h-5 w-5" />
            <span className="sr-only">Switch language</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrency(currency === "USD" ? "AED" : currency === "AED" ? "EUR" : "USD")}
            className="rounded-full bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-600 transition hover:bg-accent-100"
          >
            {currency}
          </button>
          <span className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500">
            {rightLabel}
          </span>
          <Link
            href="/profile"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <UserCircle2 className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
              {cartCount}
            </span>
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-500">
            <Heart className="h-4 w-4 fill-current" />
            {wishlist.length}
          </span>
          {currentUser ? (
            <Button variant="secondary" onClick={() => void logout()}>
              {currentUser.fullName}
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button>{copy.login}</Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/60 bg-white/90 transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-[32rem]" : "max-h-0"
        )}
      >
        <div className="section-shell flex flex-col gap-3 py-4">
          <nav className="flex flex-col gap-1">{links}</nav>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/cart" className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">
              <div className="mb-2 inline-flex rounded-full bg-white p-2">
                <ShoppingBag className="h-4 w-4" />
              </div>
              Cart ({cartCount})
            </Link>
            <Link href="/dashboard" className="rounded-2xl bg-brand-50 p-4 text-sm font-semibold text-brand-700">
              <div className="mb-2 inline-flex rounded-full bg-white p-2">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              Dashboard
            </Link>
          </div>
          {currentUser ? (
            <Button variant="secondary" onClick={() => void logout()} fullWidth>
              {currentUser.fullName}
            </Button>
          ) : (
            <Link href="/auth/login" className="w-full">
              <Button fullWidth>{copy.login}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
