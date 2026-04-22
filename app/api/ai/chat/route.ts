import { NextResponse } from "next/server";

import { answerShoppingQuestion } from "@/lib/ai";
import { CATALOG } from "@/lib/catalog";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string };
  const question = body.message?.trim() || "Help me pick top products.";
  const answer = answerShoppingQuestion(question, CATALOG);
  const suggestions = CATALOG.filter((product) => answer.productIds.includes(product.id)).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug
  }));

  return NextResponse.json({
    message: answer.message,
    suggestions
  });
}
