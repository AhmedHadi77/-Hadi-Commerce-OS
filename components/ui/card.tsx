import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export const Card = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={cn(
      "ring-card rounded-4xl border border-white/70 bg-white/90 p-6 shadow-soft",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
