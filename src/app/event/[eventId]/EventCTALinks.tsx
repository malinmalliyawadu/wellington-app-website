"use client";

import posthog from "posthog-js";

export function TicketLink({
  href,
  style,
  children,
}: {
  href: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        posthog.capture("event_ticket_link_clicked", { ticket_url: href })
      }
      className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
      style={style}
    >
      {children}
    </a>
  );
}

export function VolunteerLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        posthog.capture("event_volunteer_link_clicked", {
          volunteer_url: href,
        })
      }
      className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#16A34A" }}
    >
      {children}
    </a>
  );
}
