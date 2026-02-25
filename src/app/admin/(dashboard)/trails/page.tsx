import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapTrail } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { TrailsTable } from "@/components/admin/trails/TrailsTable";

export const dynamic = "force-dynamic";

export default async function AdminTrailsPage() {
  const { data, error } = await supabaseAdmin
    .from("trails")
    .select("*")
    .order("name");

  if (error) {
    console.error("Failed to fetch trails:", error.message);
  }

  const trails = (data ?? []).map(mapTrail);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trails</h1>
        <Button asChild>
          <Link href="/admin/trails/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trail
          </Link>
        </Button>
      </div>
      <TrailsTable trails={trails} />
    </div>
  );
}
