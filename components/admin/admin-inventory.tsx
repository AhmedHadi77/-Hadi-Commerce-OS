"use client";

import { usePlatform } from "@/components/providers/platform-provider";
import { Card } from "@/components/ui/card";

export const AdminInventory = () => {
  const { products, updateStock } = usePlatform();
  const lowStock = products.filter((product) => product.stock < 20).slice(0, 16);

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Inventory control</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Track and update stock</h2>
      <div className="mt-6 space-y-4">
        {lowStock.map((product) => (
          <div key={product.id} className="rounded-3xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-500">{product.category}</p>
              </div>
              <label className="flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft">
                Stock
                <input
                  type="number"
                  value={product.stock}
                  onChange={(event) => updateStock(product.id, Number(event.target.value))}
                  className="w-20 bg-transparent text-right outline-none"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
