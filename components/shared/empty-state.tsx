import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => (
  <Card className="flex min-h-52 flex-col items-center justify-center gap-4 border-dashed text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  </Card>
);
