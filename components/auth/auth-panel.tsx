"use client";

import { ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { usePlatform } from "@/components/providers/platform-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { messages } from "@/lib/i18n";

type AuthMode = "login" | "register" | "forgot";

interface AuthPanelProps {
  mode: AuthMode;
}

export const AuthPanel = ({ mode }: AuthPanelProps) => {
  const router = useRouter();
  const { currentUser, login, register, resetPassword, demoMode, locale } = usePlatform();
  const copy = messages[locale];
  const [fullName, setFullName] = useState(demoMode ? "Ahmed Hadi" : "");
  const [email, setEmail] = useState(
    demoMode ? (mode === "login" ? "admin@hadi.demo" : "ahmed@hadi.demo") : ""
  );
  const [password, setPassword] = useState(demoMode ? "123456" : "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    router.push(currentUser.role === "admin" ? "/admin" : "/dashboard");
  }, [currentUser, router]);

  const submit = async () => {
    setBusy(true);
    try {
      const result =
        mode === "login"
          ? await login(email, password)
          : mode === "register"
            ? await register(fullName, email, password)
            : await resetPassword(email);

      setFeedback(result.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="section-shell py-14 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-accent-400 p-8 text-white shadow-float sm:p-10">
          <Pill className="bg-white/15 text-white">Hadi Access</Pill>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {mode === "login"
              ? copy.welcomeBack
              : mode === "register"
                ? copy.createAccount
                : "Recover access without friction"}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
            Sign into a premium storefront plus admin workspace built with Supabase-ready authentication and role-based routing.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/12 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-white/75">Customer demo</p>
              <p className="mt-2 text-sm leading-6 text-white">Use `sara@hadi.demo` to explore the customer flow.</p>
            </div>
            <div className="rounded-3xl bg-white/12 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-white/75">Admin demo</p>
              <p className="mt-2 text-sm leading-6 text-white">Use `admin@hadi.demo` to open the full SaaS dashboard.</p>
            </div>
          </div>
        </div>

        <Card className="self-center p-8 sm:p-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
                {mode === "forgot" ? "Recovery" : "Authentication"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                {mode === "login" ? copy.login : mode === "register" ? copy.register : "Forgot password"}
              </h2>
            </div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <KeyRound className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {mode === "register" ? (
              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                />
              </label>
            ) : null}

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              />
            </label>

            {mode !== "forgot" ? (
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                />
              </label>
            ) : null}
          </div>

          {feedback ? (
            <div className="mt-5 rounded-2xl bg-brand-50 px-4 py-3 text-sm leading-6 text-brand-700">{feedback}</div>
          ) : null}

          {demoMode ? (
            <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
              Demo auth is active until Supabase environment variables are configured.
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
              Real email and password authentication is active through Supabase Auth.
            </div>
          )}

          <Button className="mt-6" onClick={submit} fullWidth disabled={busy}>
            {busy ? "Working..." : mode === "forgot" ? "Send recovery email" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            {mode !== "login" ? <Link href="/auth/login">Login</Link> : null}
            {mode !== "register" ? <Link href="/auth/register">Register</Link> : null}
            {mode !== "forgot" ? <Link href="/auth/forgot-password">Forgot password</Link> : null}
          </div>
        </Card>
      </div>
    </div>
  );
};
