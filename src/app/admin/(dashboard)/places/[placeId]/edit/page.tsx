import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapPlace } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { PlaceForm } from "@/components/admin/places/PlaceForm";
import { updatePlaceAction } from "../../actions";

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { placeId } = await params;

  const { data } = await supabaseAdmin
    .from("places")
    .select("*")
    .eq("id", placeId)
    .single();

  if (!data) notFound();

  const place = mapPlace(data);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/places">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Place</h1>
      </div>
      <PlaceForm place={place} action={updatePlaceAction} />
    </div>
  );
}
