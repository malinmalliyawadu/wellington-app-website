"use client";

import { useMapStore } from "@/store/map-store";
import { ThemeToggle } from "@/components/ThemeToggle";

type MapStyleId = "default" | "streets" | "outdoors" | "satellite";

const mapStyles: { id: MapStyleId; name: string; description: string }[] = [
  { id: "default", name: "Default", description: "Follows theme" },
  { id: "streets", name: "Streets", description: "Detailed roads" },
  { id: "outdoors", name: "Outdoors", description: "Terrain & trails" },
  { id: "satellite", name: "Satellite", description: "Aerial view" },
];

// Wellington, NZ center
const WELLINGTON_CENTER = { lat: -41.2924, lng: 174.7787 };

export function MapControls() {
  const {
    mapZoom,
    setMapZoom,
    setMapCenter,
    setUserLocation,
    userLocation,
    mapStyle,
    setMapStyle,
  } = useMapStore();

  const handleZoomIn = () => setMapZoom(Math.min(mapZoom + 1, 18));
  const handleZoomOut = () => setMapZoom(Math.max(mapZoom - 1, 3));

  const handleResetView = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(13);
    } else {
      setMapCenter(WELLINGTON_CENTER);
      setMapZoom(13);
    }
  };

  const handleLocate = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(15);
      return;
    }

    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setMapCenter(location);
        setMapZoom(15);
      },
      () => {
        // Geolocation denied — stay on Wellington
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  };

  return (
    <>
      {/* Top-right controls: map style + theme */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <div className="relative">
          <details className="map-style-dropdown group">
            <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
              {mapStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={(e) => {
                    setMapStyle(style.id);
                    const details = (e.target as HTMLElement).closest("details");
                    if (details instanceof HTMLDetailsElement)
                      details.open = false;
                  }}
                  className={`flex w-full items-start gap-3 px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    mapStyle === style.id
                      ? "bg-gray-50 dark:bg-gray-800"
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {style.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {style.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </details>
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <ThemeToggle />
        </div>
      </div>

      {/* Bottom-right controls: locate, reset, zoom */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          className="flex size-11 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={handleLocate}
          title="My location"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
        <button
          className="flex size-11 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          onClick={handleResetView}
          title="Reset view"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </button>
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <button
            className="flex size-11 items-center justify-center border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            onClick={handleZoomIn}
            title="Zoom in"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <button
            className="flex size-11 items-center justify-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
