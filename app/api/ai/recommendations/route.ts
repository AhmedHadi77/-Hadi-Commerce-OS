import { NextResponse } from "next/server";

import { buildRecommendations } from "@/lib/ai";
import { CATALOG } from "@/lib/catalog";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    query?: string;
    cartProductIds?: string[];
    wishlistProductIds?: string[];
  };

  const result = buildRecommendations({
    products: CATALOG,
    searchQuery: body.query,
    cartProductIds: body.cartProductIds,
    wishlistProductIds: body.wishlistProductIds
  });

  return NextResponse.json({
    headline: result.headline,
    suggestions: result.products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category
    }))
  });
}
