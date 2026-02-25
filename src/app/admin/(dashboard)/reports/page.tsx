import { supabaseAdmin } from "@/lib/supabase-admin";
import { ReportsTable } from "@/components/admin/reports/ReportsTable";

export default async function AdminReportsPage() {
  const { data } = await supabaseAdmin
    .from("reports")
    .select(
      "id, reporter_id, reported_user_id, content_type, content_id, reason, details, status, admin_notes, resolved_at, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  // Batch-fetch usernames for reporters and reported users
  const userIds = [
    ...new Set(rows.flatMap((r) => [r.reporter_id, r.reported_user_id])),
  ];

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, username")
    .in("id", userIds.length > 0 ? userIds : [""]);

  const userMap = new Map(
    (profiles ?? []).map((p) => [p.id, p.username as string])
  );

  const reports = rows.map((row) => ({
    id: row.id as string,
    reporterUsername: userMap.get(row.reporter_id) ?? "unknown",
    reportedUsername: userMap.get(row.reported_user_id) ?? "unknown",
    reportedUserId: row.reported_user_id as string,
    contentType: row.content_type as string,
    contentId: (row.content_id as string) ?? undefined,
    reason: row.reason as string,
    details: (row.details as string) ?? undefined,
    status: row.status as string,
    adminNotes: (row.admin_notes as string) ?? undefined,
    createdAt: row.created_at as string,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <ReportsTable reports={reports} />
    </div>
  );
}
