import { AdminProductManager } from "@/components/admin/admin-product-manager";
import { AdminShell } from "@/components/admin/admin-shell";

export default function Page() {
  return (
    <AdminShell>
      <AdminProductManager />
    </AdminShell>
  );
}
