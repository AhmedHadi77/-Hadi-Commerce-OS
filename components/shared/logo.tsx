import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="inline-flex items-center gap-3">
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-400 font-display text-lg font-bold text-white shadow-soft">
      H
    </span>
    <span>
      <span className="block font-display text-xl font-bold tracking-tight text-slate-900">Hadi</span>
      <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">Commerce OS</span>
    </span>
  </Link>
);
