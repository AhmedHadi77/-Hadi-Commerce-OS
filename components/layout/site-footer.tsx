import Link from "next/link";

export const SiteFooter = () => (
  <footer className="border-t border-white/70 bg-white/80">
    <div className="section-shell grid gap-8 py-10 md:grid-cols-[1.3fr,1fr,1fr]">
      <div>
        <h3 className="font-display text-2xl font-semibold text-slate-900">Hadi Platform</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
          A full commerce operating system for storefront browsing, admin management, analytics, promotions,
          and AI-guided merchandising.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Platform</h4>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
          <Link href="/products">Products</Link>
          <Link href="/dashboard">Customer dashboard</Link>
          <Link href="/admin">Admin suite</Link>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Deployment</h4>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
          <span>Supabase Auth + Storage</span>
          <span>Realtime alerts + analytics</span>
          <span>Deploy to Vercel with `.env` keys</span>
        </div>
      </div>
    </div>
  </footer>
);
