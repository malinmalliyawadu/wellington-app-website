import { create } from "zustand";
import type { Place, PlaceCategory, Event } from "@/lib/types";

type SortBy = "alpha-az" | "alpha-za" | "nearest";
type MapStyle = "default" | "streets" | "outdoors" | "satellite";

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface MapState {
  places: Place[];
  events: Event[];
  eventsByPlaceId: Map<string, Event[]>;
  selectedCategory: PlaceCategory | "all";
  searchQuery: string;
  sortBy: SortBy;
  selectedPlaceId: string | null;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  mapStyle: MapStyle;
  userLocation: { lat: number; lng: number } | null;
  isPanelVisible: boolean;
  routeDestinationId: string | null;
  setPlaces: (places: Place[]) => void;
  setEvents: (events: Event[]) => void;
  setSelectedCategory: (category: PlaceCategory | "all") => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortBy) => void;
  selectPlace: (placeId: string | null) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;
  setMapStyle: (style: MapStyle) => void;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  setPanelVisible: (visible: boolean) => void;
  setRouteDestination: (placeId: string | null) => void;
  clearRoute: () => void;
  getFilteredPlaces: () => Place[];
}

// Wellington, NZ center
const WELLINGTON_CENTER = { lat: -41.2924, lng: 174.7787 };

export const useMapStore = create<MapState>((set, get) => ({
  places: [],
  events: [],
  eventsByPlaceId: new Map(),
  selectedCategory: "all",
  searchQuery: "",
  sortBy: "alpha-az",
  selectedPlaceId: null,
  mapCenter: WELLINGTON_CENTER,
  mapZoom: 13,
  mapStyle: "default",
  userLocation: null,
  isPanelVisible: true,
  routeDestinationId: null,

  setPlaces: (places) => set({ places }),

  setEvents: (events) => {
    const grouped = new Map<string, Event[]>();
    for (const event of events) {
      const existing = grouped.get(event.placeId);
      if (existing) {
        existing.push(event);
      } else {
        grouped.set(event.placeId, [event]);
      }
    }
    set({ events, eventsByPlaceId: grouped });
  },

  setSelectedCategory: (category) => {
    const state = get();
    const updates: Partial<MapState> = { selectedCategory: category };
    if (state.selectedPlaceId) {
      const place = state.places.find((p) => p.id === state.selectedPlaceId);
      if (place && category !== "all" && place.category !== category) {
        updates.selectedPlaceId = null;
      }
    }
    set(updates);
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  selectPlace: (placeId) => set({ selectedPlaceId: placeId }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setMapStyle: (style) => set({ mapStyle: style }),
  setUserLocation: (location) => set({ userLocation: location }),
  setPanelVisible: (visible) => set({ isPanelVisible: visible }),
  setRouteDestination: (placeId) => set({ routeDestinationId: placeId }),
  clearRoute: () => set({ routeDestinationId: null }),

  getFilteredPlaces: () => {
    const state = get();
    let filtered = [...state.places];

    if (state.selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === state.selectedCategory);
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query)
      );
    }

    switch (state.sortBy) {
      case "nearest":
        if (state.userLocation) {
          filtered.sort((a, b) => {
            const distA = calculateDistance(
              state.userLocation!.lat,
              state.userLocation!.lng,
              a.latitude,
              a.longitude
            );
            const distB = calculateDistance(
              state.userLocation!.lat,
              state.userLocation!.lng,
              b.latitude,
              b.longitude
            );
            return distA - distB;
          });
        }
        break;
      case "alpha-az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alpha-za":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return filtered;
  },
}));
