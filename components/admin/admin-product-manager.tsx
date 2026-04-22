"use client";

import { useMemo, useState } from "react";

import { usePlatform } from "@/components/providers/platform-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";

const emptyForm = {
  id: "",
  name: "",
  category: "Electronics",
  price: 199,
  stock: 24,
  rating: 4.8,
  imageUrl:
    "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
  description: "Premium item added from the Hadi admin panel."
};

export const AdminProductManager = () => {
  const { products, upsertProduct, deleteProduct, currency, locale } = usePlatform();
  const [form, setForm] = useState(emptyForm);

  const featuredProducts = useMemo(() => products.slice(0, 10), [products]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <Card className="h-fit">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Product management</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create or edit products</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use this panel to add new products, update existing details, and prepare image URLs for Supabase Storage-backed assets.
        </p>

        <div className="mt-6 space-y-4">
          {(
            [
              ["name", "Name"],
              ["category", "Category"],
              ["imageUrl", "Image URL"]
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm font-medium text-slate-700">
              {label}
              <input
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
          ))}

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium text-slate-700">
              Price
              <input
                type="number"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Stock
              <input
                type="number"
                value={form.stock}
                onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Rating
              <input
                type="number"
                min={1}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              upsertProduct({
                id: form.id || undefined,
                name: form.name,
                category: form.category,
                price: form.price,
                stock: form.stock,
                rating: form.rating,
                imageUrl: form.imageUrl,
                description: form.description,
                featured: true,
                tags: [form.category, "Admin Upload"]
              });
              setForm(emptyForm);
            }}
          >
            {form.id ? "Update product" : "Add product"}
          </Button>
          <Button variant="secondary" onClick={() => setForm(emptyForm)}>
            Reset form
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Catalog table</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent products</h2>
        <div className="mt-6 space-y-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="rounded-3xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">
                    {product.category} • {product.sku} • {formatMoney(product.price, currency, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setForm({
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        price: product.price,
                        stock: product.stock,
                        rating: product.rating,
                        imageUrl: product.imageUrl,
                        description: product.description
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteProduct(product.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
