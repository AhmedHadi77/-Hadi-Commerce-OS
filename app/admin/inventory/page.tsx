import { AdminInventory } from "@/components/admin/admin-inventory";
import { AdminShell } from "@/components/admin/admin-shell";

export default function Page() {
  return (
    <AdminShell>
      <AdminInventory />
    </AdminShell>
  );
}
