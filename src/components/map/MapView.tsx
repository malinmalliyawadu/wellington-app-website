"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "@/store/map-store";
import {
  CATEGORY_LABELS,
  PLACE_CATEGORY_COLORS,
} from "@/lib/constants";

// Lucide icon SVG inner content for map markers (24x24 viewBox)
const MARKER_ICON_SVG: Record<string, string> = {
  cafe: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  restaurant: '<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>',
  bar: '<path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>',
  attraction: '<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/>',
  park: '<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/>',
  venue: '<path d="M2 10s3-3 3-8"/><path d="M22 10s-3-3-3-8"/><path d="M10 2c0 4.4-3.6 8-8 8"/><path d="M14 2c0 4.4 3.6 8 8 8"/><path d="M2 10s2 2 2 5"/><path d="M22 10s-2 2-2 5"/><path d="M8 15h8"/><path d="M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/><path d="M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/>',
  trail: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
};

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  streets: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  outdoors: "https://tiles.stadiamaps.com/styles/outdoors.json",
  satellite: "https://tiles.stadiamaps.com/styles/alidade_satellite.json",
};

export function MapView() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<Map<string, maplibregl.Marker>>(new Map());
  const userMarkerRef = React.useRef<maplibregl.Marker | null>(null);
  const popupRef = React.useRef<maplibregl.Popup | null>(null);
  const isAnimatingRef = React.useRef(false);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isHoveringPopupRef = React.useRef(false);

  const routeDataRef = React.useRef<{
    coordinates: [number, number][];
    bounds: maplibregl.LngLatBounds;
  } | null>(null);

  const {
    mapCenter,
    mapZoom,
    mapStyle,
    setMapCenter,
    setMapZoom,
    selectPlace,
    selectedPlaceId,
    userLocation,
    routeDestinationId,
    places: allPlaces,
    eventsByPlaceId,
    getFilteredPlaces,
  } = useMapStore();

  const getMapStyleUrl = React.useCallback(() => {
    if (mapStyle === "default") {
      const isDark = document.documentElement.classList.contains("dark");
      return isDark ? MAP_STYLES.dark : MAP_STYLES.light;
    }
    return MAP_STYLES[mapStyle];
  }, [mapStyle]);

  const places = getFilteredPlaces();

  const closePopup = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringPopupRef.current && popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    }, 150);
  }, []);

  // Initialize map
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleUrl(),
      center: [mapCenter.lng, mapCenter.lat],
      zoom: mapZoom,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("moveend", () => {
      if (isAnimatingRef.current) {
        isAnimatingRef.current = false;
        return;
      }
      const center = map.getCenter();
      const zoom = map.getZoom();
      setMapCenter({ lat: center.lat, lng: center.lng });
      setMapZoom(zoom);
    });

    mapRef.current = map;

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map style
  React.useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getMapStyleUrl());
  }, [mapStyle, getMapStyleUrl]);

  // Listen for theme changes to update map style
  React.useEffect(() => {
    if (mapStyle !== "default") return;

    const observer = new MutationObserver(() => {
      if (mapRef.current) {
        mapRef.current.setStyle(getMapStyleUrl());
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [mapStyle, getMapStyleUrl]);

  // User location marker
  React.useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      return;
    }

    const el = document.createElement("div");
    el.innerHTML = `
      <div class="relative">
        <div class="w-4 h-4 rounded-full bg-[#00A5E0] border-2 border-white shadow-lg"></div>
        <div class="absolute inset-0 w-4 h-4 rounded-full bg-[#00A5E0]/50 animate-ping"></div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(mapRef.current);

    userMarkerRef.current = marker;
  }, [userLocation]);

  // Place markers
  React.useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    places.forEach((place) => {
      const color = PLACE_CATEGORY_COLORS[place.category] ?? "#6b7280";
      const isSelected = selectedPlaceId === place.id;
      const isRouteDestination = routeDestinationId === place.id;
      const placeEvents = eventsByPlaceId.get(place.id);
      const eventCount = placeEvents?.length ?? 0;

      const el = document.createElement("div");
      el.className = "marker-container";
      const pinColor = isRouteDestination ? "#22c55e" : isSelected ? "#00A5E0" : color;
      const iconSvg = MARKER_ICON_SVG[place.category] ?? '';

      el.innerHTML = `
        <div class="relative cursor-pointer transition-transform ${
          isSelected || isRouteDestination ? "scale-125" : "hover:scale-110"
        }">
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 44 18 44C18 44 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="${pinColor}"/>
            <circle cx="18" cy="16" r="10" fill="white"/>
            <g transform="translate(10, 8) scale(0.667)" fill="none" stroke="${pinColor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</g>
          </svg>
          ${
            isSelected
              ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00A5E0]/30 animate-ping"></div>'
              : ""
          }
          ${
            isRouteDestination
              ? '<div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>'
              : ""
          }
          ${
            eventCount > 0 && !isRouteDestination
              ? `<div class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold flex items-center justify-center shadow-md px-1">${eventCount}</div>`
              : ""
          }
        </div>
      `;

      el.addEventListener("click", () => {
        selectPlace(place.id);
      });

      const categoryLabel = CATEGORY_LABELS[place.category] ?? place.category;

      el.addEventListener("mouseenter", () => {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }

        if (popupRef.current) {
          popupRef.current.remove();
        }

        const categoryIconSvg = MARKER_ICON_SVG[place.category] ?? '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>';
        const eventBadge = eventCount > 0
          ? `<span class="popup-event-badge">${eventCount} event${eventCount !== 1 ? "s" : ""}</span>`
          : "";

        const popupContent = `
          <div class="place-popup" data-popup-hover="true">
            <div class="popup-header">
              <div class="popup-icon" style="background-color: ${color}15;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${categoryIconSvg}</svg>
              </div>
              <div class="popup-title-section">
                <h3 class="popup-title">${place.name}</h3>
                <div class="popup-meta">
                  <span class="popup-category-badge" style="background-color: ${color}15; color: ${color};">${categoryLabel}</span>
                  ${eventBadge}
                </div>
              </div>
            </div>
            <p class="popup-address">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${place.address}
            </p>
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: [0, -40],
          closeButton: false,
          closeOnClick: false,
          className: "place-hover-popup",
          maxWidth: "320px",
        })
          .setLngLat([place.longitude, place.latitude])
          .setHTML(popupContent)
          .addTo(mapRef.current!);

        const popupElement = popup.getElement();
        if (popupElement) {
          popupElement.addEventListener("mouseenter", () => {
            isHoveringPopupRef.current = true;
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
            }
          });
          popupElement.addEventListener("mouseleave", () => {
            isHoveringPopupRef.current = false;
            closePopup();
          });
          popupElement.addEventListener("click", () => {
            selectPlace(place.id);
            popup.remove();
            popupRef.current = null;
          });
        }

        popupRef.current = popup;
      });

      el.addEventListener("mouseleave", () => {
        closePopup();
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([place.longitude, place.latitude])
        .addTo(mapRef.current!);

      markersRef.current.set(place.id, marker);
    });
  }, [places, selectedPlaceId, routeDestinationId, eventsByPlaceId, selectPlace, closePopup]);

  // Draw route line helper
  const drawRoute = React.useCallback(
    (map: maplibregl.Map, coordinates: [number, number][]) => {
      if (map.getLayer("route-line")) map.removeLayer("route-line");
      if (map.getLayer("route-line-outline"))
        map.removeLayer("route-line-outline");
      if (map.getSource("route")) map.removeSource("route");

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });

      map.addLayer({
        id: "route-line-outline",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#0086B8",
          "line-width": 8,
          "line-opacity": 0.4,
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#00A5E0",
          "line-width": 4,
          "line-opacity": 1,
        },
      });
    },
    []
  );

  // Fetch and draw route when destination is set
  React.useEffect(() => {
    if (!routeDestinationId || !userLocation) {
      routeDataRef.current = null;
      return;
    }

    const destination = allPlaces.find((p) => p.id === routeDestinationId);
    if (!destination) {
      routeDataRef.current = null;
      return;
    }

    const fetchRoute = async () => {
      const start = `${userLocation.lng},${userLocation.lat}`;
      const end = `${destination.longitude},${destination.latitude}`;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes?.[0]) {
          const coordinates = data.routes[0].geometry
            .coordinates as [number, number][];
          const bounds = new maplibregl.LngLatBounds();
          bounds.extend([userLocation.lng, userLocation.lat]);
          bounds.extend([destination.longitude, destination.latitude]);
          coordinates.forEach((coord) => bounds.extend(coord));

          routeDataRef.current = { coordinates, bounds };

          const map = mapRef.current;
          if (map) {
            drawRoute(map, coordinates);
            isAnimatingRef.current = true;
            map.fitBounds(bounds, { padding: 80 });
          }
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [routeDestinationId, userLocation, allPlaces, drawRoute]);

  // Clear route line when destination is removed
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || routeDestinationId) return;

    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getLayer("route-line-outline"))
      map.removeLayer("route-line-outline");
    if (map.getSource("route")) map.removeSource("route");
  }, [routeDestinationId]);

  // Redraw route after style change
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleStyleLoad = () => {
      if (routeDataRef.current && routeDestinationId) {
        drawRoute(map, routeDataRef.current.coordinates);
      }
    };

    map.on("style.load", handleStyleLoad);
    return () => {
      map.off("style.load", handleStyleLoad);
    };
  }, [drawRoute, routeDestinationId]);

  // Fly to selected place
  React.useEffect(() => {
    if (!mapRef.current || !selectedPlaceId) return;
    if (routeDestinationId) return; // Don't fly when route is active

    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [place.longitude, place.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 15),
        essential: true,
      });
    }
  }, [selectedPlaceId, places, routeDestinationId]);

  // Sync external center/zoom changes to map
  const lastCenterRef = React.useRef({
    lat: mapCenter.lat,
    lng: mapCenter.lng,
  });
  const lastZoomRef = React.useRef(mapZoom);

  React.useEffect(() => {
    if (!mapRef.current) return;

    const centerChanged =
      Math.abs(lastCenterRef.current.lat - mapCenter.lat) > 0.0001 ||
      Math.abs(lastCenterRef.current.lng - mapCenter.lng) > 0.0001;
    const zoomChanged = Math.abs(lastZoomRef.current - mapZoom) > 0.1;

    if (centerChanged || zoomChanged) {
      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [mapCenter.lng, mapCenter.lat],
        zoom: mapZoom,
        essential: true,
      });
      lastCenterRef.current = { lat: mapCenter.lat, lng: mapCenter.lng };
      lastZoomRef.current = mapZoom;
    }
  }, [mapCenter, mapZoom]);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
}
