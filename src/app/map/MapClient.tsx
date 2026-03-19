"use client";

import * as React from "react";
import { useMapStore } from "@/store/map-store";
import { MapView } from "@/components/map/MapView";
import { MapPanel } from "@/components/map/MapPanel";
import { MapControls } from "@/components/map/MapControls";
import type { Place, Event } from "@/lib/types";

interface MapClientProps {
  places: Place[];
  events: Event[];
}

export function MapClient({ places, events }: MapClientProps) {
  const setPlaces = useMapStore((s) => s.setPlaces);
  const setEvents = useMapStore((s) => s.setEvents);

  React.useEffect(() => {
    setPlaces(places);
  }, [places, setPlaces]);

  React.useEffect(() => {
    setEvents(events);
  }, [events, setEvents]);

  return (
    <div className="relative h-[calc(100dvh-57px)] w-full overflow-hidden">
      <MapView />
      <MapPanel />
      <MapControls />
    </div>
  );
}
