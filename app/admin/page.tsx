import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminShell } from "@/components/admin/admin-shell";

export default function Page() {
  return (
    <AdminShell>
      <AdminOverview />
    </AdminShell>
  );
}
