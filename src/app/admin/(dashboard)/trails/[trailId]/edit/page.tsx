import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapTrail } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { TrailForm } from "@/components/admin/trails/TrailForm";
import { updateTrailAction } from "../../actions";

export default async function EditTrailPage({
  params,
}: {
  params: Promise<{ trailId: string }>;
}) {
  const { trailId } = await params;

  const { data } = await supabaseAdmin
    .from("trails")
    .select("*")
    .eq("id", trailId)
    .single();

  if (!data) notFound();

  const trail = mapTrail(data);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/trails">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Trail</h1>
      </div>
      <TrailForm trail={trail} action={updateTrailAction} />
    </div>
  );
}
