import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapGuide } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { GuideForm } from "@/components/admin/guides/GuideForm";
import { updateGuideAction } from "../../actions";

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ guideId: string }>;
}) {
  const { guideId } = await params;

  const { data } = await supabaseAdmin
    .from("guides")
    .select("*")
    .eq("id", guideId)
    .single();

  if (!data) notFound();

  const guide = mapGuide(data);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/guides">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Guide</h1>
      </div>
      <GuideForm guide={guide} action={updateGuideAction} />
    </div>
  );
}
