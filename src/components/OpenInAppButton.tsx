"use client";

import { APP_STORE_URL } from "@/lib/constants";

export function OpenInAppButton({ deepLink }: { deepLink: string }) {
  function handleClick() {
    // Try deep link first, fall back to App Store after timeout
    window.location.href = deepLink;
    setTimeout(() => {
      window.location.href = APP_STORE_URL;
    }, 1500);
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00A5E0] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0086B8]"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      Open in Welly
    </button>
  );
}
