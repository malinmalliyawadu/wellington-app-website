"use client";

import posthog from "posthog-js";
import { APP_STORE_URL } from "@/lib/constants";

export function AppStoreLink({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={APP_STORE_URL}
      onClick={() => posthog.capture("homepage_app_store_clicked")}
      className={className}
    >
      {children}
    </a>
  );
}
