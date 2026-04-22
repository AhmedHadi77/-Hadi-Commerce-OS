"use client";

import { BarChart3, Gift, LayoutDashboard, PackageSearch, ShieldBan, Warehouse } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

import { usePlatform } from "@/components/providers/platform-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: PackageSearch },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/users", label: "Users", icon: ShieldBan },
  { href: "/admin/promotions", label: "Promotions", icon: Gift }
];

export const AdminShell = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const { currentUser } = usePlatform();

  if (!currentUser) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="Admin sign-in required" description="Login with an admin account to access the SaaS dashboard." />
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="section-shell py-16">
        <EmptyState
          title="Admin access only"
          description="Your current account is a customer account. Switch to admin@hadi.demo to open the management suite."
        />
      </div>
    );
  }

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 xl:grid-cols-[280px,1fr]">
        <Card className="h-fit">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Admin suite</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hadi control room</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Shopify-style operations panel for revenue, merchandising, stock, promotions, and user control.
          </p>

          <nav className="mt-8 space-y-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  pathname === link.href
                    ? "bg-brand-500 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/products" className="mt-6 block">
            <Button variant="secondary" fullWidth>
              <BarChart3 className="h-4 w-4" />
              View storefront
            </Button>
          </Link>
        </Card>

        <div>{children}</div>
      </div>
    </div>
  );
};
