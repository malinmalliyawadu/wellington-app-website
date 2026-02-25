import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mapEvent, mapPlace } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/admin/events/EventForm";
import { updateEventAction } from "../../actions";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const [{ data: eventData }, { data: placesData }] = await Promise.all([
    supabaseAdmin.from("events").select("*").eq("id", eventId).single(),
    supabaseAdmin.from("places").select("*").order("name"),
  ]);

  if (!eventData) notFound();

  const event = mapEvent(eventData);
  const places = (placesData ?? []).map(mapPlace);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Event</h1>
      </div>
      <EventForm event={event} places={places} action={updateEventAction} />
    </div>
  );
}
