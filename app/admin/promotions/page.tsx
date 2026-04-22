import { AdminPromotions } from "@/components/admin/admin-promotions";
import { AdminShell } from "@/components/admin/admin-shell";

export default function Page() {
  return (
    <AdminShell>
      <AdminPromotions />
    </AdminShell>
  );
}
