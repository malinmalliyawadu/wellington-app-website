import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapPlace } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { PlacesTable } from "@/components/admin/places/PlacesTable";

export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const { data } = await supabaseAdmin
    .from("places")
    .select("*")
    .order("name");

  const places = (data ?? []).map(mapPlace);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Places</h1>
        <Button asChild>
          <Link href="/admin/places/new">
            <Plus className="mr-2 h-4 w-4" />
            New Place
          </Link>
        </Button>
      </div>
      <PlacesTable places={places} />
    </div>
  );
}
