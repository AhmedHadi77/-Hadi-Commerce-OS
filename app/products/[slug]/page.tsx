import { ProductDetailPage } from "@/components/products/product-detail-page";

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductDetailPage slug={params.slug} />;
}
