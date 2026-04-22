import type { AnalyticsSeriesPoint, Order, PlatformUser, Product } from "@/lib/types";

export const buildRevenueSeries = (orders: Order[]): AnalyticsSeriesPoint[] =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const label = date.toLocaleDateString("en-US", { weekday: "short" });
    const matchingOrders = orders.filter((order) => {
      const created = new Date(order.createdAt);
      return created.toDateString() === date.toDateString();
    });

    return {
      label,
      revenue: matchingOrders.reduce((sum, order) => sum + order.totalPrice, 0),
      orders: matchingOrders.length,
      customers: new Set(matchingOrders.map((order) => order.userId)).size
    };
  });

export const buildCategorySales = (products: Product[], orders: Order[]) => {
  const map = new Map<string, number>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) {
        return;
      }

      map.set(product.category, (map.get(product.category) ?? 0) + item.quantity * item.unitPrice);
    });
  });

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
};

export const getTopProducts = (products: Product[], orders: Order[]) =>
  products
    .map((product) => {
      const sold = orders.reduce((sum, order) => {
        const match = order.items.find((item) => item.productId === product.id);
        return sum + (match ? match.quantity : 0);
      }, 0);

      return { ...product, sold };
    })
    .sort((left, right) => right.sold - left.sold)
    .slice(0, 6);

export const getCommerceSnapshot = (
  products: Product[],
  orders: Order[],
  users: PlatformUser[]
) => ({
  revenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
  orders: orders.length,
  users: users.filter((user) => user.role === "user").length,
  lowStock: products.filter((product) => product.stock < 12).length
});
