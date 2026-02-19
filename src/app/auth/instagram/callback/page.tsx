"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      window.location.href = `wellington://instagram-callback?code=${encodeURIComponent(code)}`;
    }
  }, [searchParams]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#666",
      }}
    >
      <p>Redirecting to Welly...</p>
    </div>
  );
}

export default function InstagramCallbackPage() {
  return (
    <Suspense>
      <CallbackRedirect />
    </Suspense>
  );
}
