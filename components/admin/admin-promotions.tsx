"use client";

import { useState } from "react";

import { usePlatform } from "@/components/providers/platform-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const AdminPromotions = () => {
  const { promotions, savePromotion, locale } = usePlatform();
  const [code, setCode] = useState("SPRING20");
  const [label, setLabel] = useState("Seasonal launch promotion");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState(20);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <Card className="h-fit">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Promotions</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create discounts and coupons</h2>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Coupon code
            <input value={code} onChange={(event) => setCode(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Label
            <input value={label} onChange={(event) => setLabel(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Type
              <select value={type} onChange={(event) => setType(event.target.value as "percent" | "fixed")} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Value
              <input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
            </label>
          </div>
        </div>

        <Button
          className="mt-6"
          onClick={() =>
            savePromotion({
              code,
              label,
              type,
              value,
              minimumSpend: 80,
              active: true
            })
          }
          fullWidth
        >
          Create promotion
        </Button>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Coupon board</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Active offers</h2>
        <div className="mt-6 space-y-4">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="rounded-3xl bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{promotion.code}</p>
                  <p className="text-sm text-slate-500">{promotion.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-700">
                    {promotion.type === "percent" ? `${promotion.value}% off` : `$${promotion.value} off`}
                  </p>
                  <p className="text-sm text-slate-500">Expires {formatDate(promotion.expiresAt, locale)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
