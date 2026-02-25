import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapGuide } from "@/lib/mappers";
import { GuidesTable } from "@/components/admin/guides/GuidesTable";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  const { data } = await supabaseAdmin
    .from("guides")
    .select("*")
    .order("created_at", { ascending: false });

  const guides = (data ?? []).map(mapGuide);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Guides</h1>
      <GuidesTable guides={guides} />
    </div>
  );
}
