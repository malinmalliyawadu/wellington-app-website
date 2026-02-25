import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapProfile } from "@/lib/mappers";
import { UsersTable } from "@/components/admin/users/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("username");

  const users = (data ?? []).map(mapProfile);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <UsersTable users={users} />
    </div>
  );
}
