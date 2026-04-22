"use client";

import { BellRing } from "lucide-react";

import { Card } from "@/components/ui/card";
import { usePlatform } from "@/components/providers/platform-provider";
import { formatDate } from "@/lib/utils";

export const NotificationPanel = () => {
  const { notifications, locale, markNotificationRead } = usePlatform();

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">Realtime alerts</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Operations inbox</h3>
        </div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <BellRing className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {notifications.slice(0, 5).map((notification) => (
          <button
            key={notification.id}
            type="button"
            onClick={() => markNotificationRead(notification.id)}
            className="flex w-full items-start justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-brand-100 hover:bg-brand-50/40"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {formatDate(notification.createdAt, locale)}
              </p>
              {notification.unread ? (
                <span className="mt-2 inline-flex rounded-full bg-brand-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                  New
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
