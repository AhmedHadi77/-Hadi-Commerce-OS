import type { Product, RecommendationResult } from "@/lib/types";

interface RecommendationInput {
  products: Product[];
  cartProductIds?: string[];
  wishlistProductIds?: string[];
  searchQuery?: string;
}

const scoreProduct = (
  product: Product,
  cartProductIds: string[],
  wishlistProductIds: string[],
  searchQuery: string
) => {
  let score = product.rating * 20;

  if (product.trending) {
    score += 18;
  }

  if (product.featured) {
    score += 14;
  }

  if (wishlistProductIds.includes(product.id)) {
    score += 12;
  }

  if (cartProductIds.includes(product.id)) {
    score += 16;
  }

  if (searchQuery) {
    const normalized = searchQuery.toLowerCase();
    if (product.name.toLowerCase().includes(normalized)) {
      score += 20;
    }
    if (product.category.toLowerCase().includes(normalized)) {
      score += 12;
    }
    if (product.tags.some((tag) => tag.toLowerCase().includes(normalized))) {
      score += 8;
    }
  }

  return score;
};

export const buildRecommendations = ({
  products,
  cartProductIds = [],
  wishlistProductIds = [],
  searchQuery = ""
}: RecommendationInput): RecommendationResult => {
  const ranked = [...products]
    .sort(
      (left, right) =>
        scoreProduct(right, cartProductIds, wishlistProductIds, searchQuery) -
        scoreProduct(left, cartProductIds, wishlistProductIds, searchQuery)
    )
    .slice(0, 8);

  const headline = searchQuery
    ? `Hadi AI found high-match picks for "${searchQuery}".`
    : "Hadi AI assembled a balanced mix of trending, high-rated, and premium-value picks.";

  return { headline, products: ranked };
};

export const answerShoppingQuestion = (question: string, products: Product[]) => {
  const lower = question.toLowerCase();
  const recommendations = buildRecommendations({
    products,
    searchQuery: question
  }).products;

  if (lower.includes("budget")) {
    return {
      message:
        "For a budget-focused basket, I’d prioritize highly rated items below $120 and keep one featured upgrade in reserve for the final checkout decision.",
      productIds: recommendations.slice(0, 3).map((product) => product.id)
    };
  }

  if (lower.includes("gift") || lower.includes("present")) {
    return {
      message:
        "Gift-ready choices usually combine strong ratings, premium packaging appeal, and a broad-use category like beauty, home, or electronics.",
      productIds: recommendations.slice(0, 4).map((product) => product.id)
    };
  }

  if (lower.includes("stock")) {
    return {
      message:
        "I checked current stock patterns and would recommend ordering trending products soon, especially items with fewer than 12 units remaining.",
      productIds: recommendations
        .filter((product) => product.stock < 12)
        .slice(0, 4)
        .map((product) => product.id)
    };
  }

  return {
    message:
      "I matched your question against category trends, product ratings, and shopper intent to surface a strong shortlist you can compare quickly.",
    productIds: recommendations.slice(0, 4).map((product) => product.id)
  };
};
