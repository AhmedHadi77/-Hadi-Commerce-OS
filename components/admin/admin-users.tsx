"use client";

import { usePlatform } from "@/components/providers/platform-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatMoney } from "@/lib/utils";

export const AdminUsers = () => {
  const { users, orders, currency, locale, banUser } = usePlatform();
  const customerUsers = users.filter((user) => user.role === "user");

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">User management</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">View and moderate customers</h2>
      <div className="mt-6 space-y-4">
        {customerUsers.map((user) => {
          const userOrders = orders.filter((order) => order.userId === user.id);
          return (
            <div key={user.id} className="rounded-3xl bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{user.fullName}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Joined {formatDate(user.joinedAt, locale)} • {userOrders.length} orders • {formatMoney(user.totalSpent, currency, locale)}
                  </p>
                </div>
                <Button variant={user.status === "active" ? "danger" : "secondary"} onClick={() => banUser(user.id)}>
                  {user.status === "active" ? "Ban user" : "Restore user"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
