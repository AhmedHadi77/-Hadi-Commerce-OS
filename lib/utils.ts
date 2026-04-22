import { clsx } from "clsx";

import type { Currency, Locale } from "@/lib/types";

export const cn = (...inputs: Array<string | false | null | undefined>) =>
  clsx(inputs);

const currencyConfig: Record<Currency, { currency: string; rate: number }> = {
  USD: { currency: "USD", rate: 1 },
  EUR: { currency: "EUR", rate: 0.92 },
  AED: { currency: "AED", rate: 3.67 }
};

export const formatMoney = (amount: number, currency: Currency, locale: Locale) => {
  const config = currencyConfig[currency];
  const converted = amount * config.rate;

  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-US", {
    style: "currency",
    currency: config.currency,
    maximumFractionDigits: 0
  }).format(converted);
};

export const formatDate = (value: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ar" ? "ar-AE" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));

export const percent = (value: number) => `${Math.round(value)}%`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const uniqueId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
