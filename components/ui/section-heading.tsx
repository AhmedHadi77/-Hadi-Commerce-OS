import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  className
}: SectionHeadingProps) => (
  <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-700">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{description}</p>
    </div>
    {actionHref && actionLabel ? (
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
      >
        {actionLabel}
        <ChevronRight className="h-4 w-4" />
      </Link>
    ) : null}
  </div>
);
