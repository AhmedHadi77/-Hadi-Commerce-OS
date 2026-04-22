import { AdminUsers } from "@/components/admin/admin-users";
import { AdminShell } from "@/components/admin/admin-shell";

export default function Page() {
  return (
    <AdminShell>
      <AdminUsers />
    </AdminShell>
  );
}
