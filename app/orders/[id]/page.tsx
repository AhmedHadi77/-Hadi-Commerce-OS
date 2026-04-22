import { OrderDetailsPage } from "@/components/orders/order-details-page";

export default function Page({ params }: { params: { id: string } }) {
  return <OrderDetailsPage orderId={params.id} />;
}
