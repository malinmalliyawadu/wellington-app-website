import type { Metadata } from "next";
import { connection } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapPlace, mapEvent } from "@/lib/mappers";
import { MapClient } from "./MapClient";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Explore Wellington's best cafes, restaurants, bars, parks, and more on an interactive map.",
};

export default async function MapPage() {
  await connection();
  const today = new Date().toISOString().split("T")[0];

  const [{ data: placeData }, { data: eventData }] = await Promise.all([
    supabase
      .from("places")
      .select("id, name, category, address, latitude, longitude")
      .order("name"),
    supabase
      .from("events")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true }),
  ]);

  const places = (placeData ?? []).map(mapPlace);
  const events = (eventData ?? []).map(mapEvent);

  return <MapClient places={places} events={events} />;
}
