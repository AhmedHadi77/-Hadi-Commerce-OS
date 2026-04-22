import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export const Pill = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700",
      className
    )}
    {...props}
  >
    {children}
  </span>
);
