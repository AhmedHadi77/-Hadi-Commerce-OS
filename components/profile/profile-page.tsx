"use client";

import { Bell, MapPin, Phone, ShieldCheck, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { usePlatform } from "@/components/providers/platform-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatMoney } from "@/lib/utils";

export const ProfilePage = () => {
  const { currentUser, orders, currency, locale, updateProfile } = usePlatform();
  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
  const [region, setRegion] = useState(currentUser?.region ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [addressLine1, setAddressLine1] = useState(currentUser?.addressLine1 ?? "");
  const [addressLine2, setAddressLine2] = useState(currentUser?.addressLine2 ?? "");
  const [city, setCity] = useState(currentUser?.city ?? "");
  const [state, setState] = useState(currentUser?.state ?? "");
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode ?? "");
  const [country, setCountry] = useState(currentUser?.country ?? "");
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser?.preferredLanguage ?? "English");
  const [deliveryNotes, setDeliveryNotes] = useState(currentUser?.deliveryNotes ?? "");
  const [marketingOptIn, setMarketingOptIn] = useState(currentUser?.marketingOptIn ?? false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setFullName(currentUser.fullName ?? "");
    setRegion(currentUser.region ?? "");
    setPhone(currentUser.phone ?? "");
    setAddressLine1(currentUser.addressLine1 ?? "");
    setAddressLine2(currentUser.addressLine2 ?? "");
    setCity(currentUser.city ?? "");
    setState(currentUser.state ?? "");
    setPostalCode(currentUser.postalCode ?? "");
    setCountry(currentUser.country ?? "");
    setPreferredLanguage(currentUser.preferredLanguage ?? "English");
    setDeliveryNotes(currentUser.deliveryNotes ?? "");
    setMarketingOptIn(currentUser.marketingOptIn ?? false);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="section-shell py-16">
        <EmptyState title="Login required" description="Sign in to view order history and account settings." />
      </div>
    );
  }

  const userOrders = orders.filter((order) => order.userId === currentUser.id);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="section-shell py-12 sm:py-16">
      <div className="grid gap-8 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-brand-600 to-brand-500 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">My account</p>
            <h1 className="mt-2 text-4xl font-semibold">{currentUser.fullName}</h1>
            <p className="mt-3 text-sm leading-7 text-white/85">{currentUser.email}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/12 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">Orders</p>
                <p className="mt-2 text-3xl font-semibold">{userOrders.length}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">Spent</p>
                <p className="mt-2 text-3xl font-semibold">{formatMoney(totalSpent, currency, locale)}</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">Region</p>
                <p className="mt-2 text-2xl font-semibold">{region || "Add location"}</p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Shopee-style account center</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Phone, title: "Contact details", body: phone || "Add your phone number for delivery updates." },
                { icon: MapPin, title: "Saved address", body: addressLine1 || "Add a shipping address for faster checkout." },
                { icon: ShieldCheck, title: "Account security", body: "Email-based login is ready through Supabase Auth." },
                { icon: Bell, title: "Marketplace alerts", body: marketingOptIn ? "Marketing and promo alerts are enabled." : "Promo alerts are currently off." }
              ].map((item) => (
                <div key={item.title} className="rounded-3xl bg-slate-50 p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Order history</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Recent purchases</h2>
                <p className="text-sm text-slate-500">A marketplace-style history panel for tracking your orders.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="rounded-3xl bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-500">{formatDate(order.createdAt, locale)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{order.status}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {formatMoney(order.totalPrice, currency, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Profile settings</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Contact, location, and delivery details</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Manage the same basics shoppers expect from Shopee-style account pages: phone, address, language, and delivery preferences.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email login</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{currentUser.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Role</p>
              <p className="mt-2 text-sm font-medium capitalize text-slate-900">{currentUser.role}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Account status</p>
              <p className="mt-2 text-sm font-medium capitalize text-slate-900">{currentUser.status}</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Phone number
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Region
                <input
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Preferred language
                <select
                  value={preferredLanguage}
                  onChange={(event) => setPreferredLanguage(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                >
                  <option>English</option>
                  <option>Arabic</option>
                </select>
              </label>
            </div>

            <div className="space-y-4 rounded-3xl bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Shipping address</h3>
              <label className="block text-sm font-medium text-slate-700">
                Address line 1
                <input
                  value={addressLine1}
                  onChange={(event) => setAddressLine1(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Address line 2
                <input
                  value={addressLine2}
                  onChange={(event) => setAddressLine2(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  City
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  State / province
                  <input
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Postal code
                  <input
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Country
                  <input
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Delivery notes
                <textarea
                  value={deliveryNotes}
                  onChange={(event) => setDeliveryNotes(event.target.value)}
                  className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-brand-500"
                />
                Receive promotion, order, and campaign updates like a marketplace account center
              </label>
            </div>
          </div>

          {feedback ? (
            <div className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">{feedback}</div>
          ) : null}

          <Button
            className="mt-6"
            onClick={async () => {
              setSaving(true);
              try {
                const result = await updateProfile({
                  fullName,
                  region,
                  phone,
                  addressLine1,
                  addressLine2,
                  city,
                  state,
                  postalCode,
                  country,
                  preferredLanguage,
                  marketingOptIn,
                  deliveryNotes
                });
                setFeedback(result.message);
              } finally {
                setSaving(false);
              }
            }}
            fullWidth
            disabled={saving}
          >
            {saving ? "Saving..." : "Save account settings"}
          </Button>
        </Card>
      </div>
    </div>
  );
};
