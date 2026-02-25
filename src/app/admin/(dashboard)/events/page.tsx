import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapEvent } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { EventsTable } from "@/components/admin/events/EventsTable";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const { data } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  const events = (data ?? []).map(mapEvent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>
      <EventsTable events={events} />
    </div>
  );
}
