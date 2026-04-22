"use client";

import { Bot, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { usePlatform } from "@/components/providers/platform-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ChatResponse {
  message: string;
  suggestions: Array<{ id: string; name: string; slug: string }>;
}

export const AIChatWidget = () => {
  const [message, setMessage] = useState("Find me a good gift under budget.");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { locale } = usePlatform();

  const submit = async () => {
    setLoading(true);
    try {
      const result = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, locale })
      });
      const payload = (await result.json()) as ChatResponse;
      setResponse(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-brand-50 via-white to-accent-50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">AI concierge</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Hadi AI assistant</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Ask for budget picks, gifting ideas, fast comparisons, or low-stock alerts.
          </p>
        </div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft">
          <Bot className="h-5 w-5" />
        </div>
      </div>

      <label className="mt-6 block text-sm font-medium text-slate-700">
        Ask Hadi AI
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-3 min-h-28 w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />
      </label>

      <div className="mt-4 flex gap-3">
        <Button onClick={submit} disabled={loading}>
          <Sparkles className="h-4 w-4" />
          {loading ? "Thinking..." : "Generate advice"}
        </Button>
      </div>

      {response ? (
        <div className="mt-6 rounded-3xl border border-white/60 bg-white/90 p-5">
          <p className="text-sm leading-7 text-slate-700">{response.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {response.suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                {product.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
};
