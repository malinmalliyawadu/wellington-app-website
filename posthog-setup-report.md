# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Welly website. `posthog-js` was installed and initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+). A reverse proxy was configured in `next.config.ts` to route PostHog requests through `/ingest`, reducing the chance of events being blocked by ad trackers. Environment variables were written to `.env.local`. Six client-side events were instrumented across five files, covering the primary conversion and engagement actions on the site.

| Event | Description | File |
|---|---|---|
| `open_in_app_clicked` | User clicked the "Open in Welly" deep-link button | `src/components/OpenInAppButton.tsx` |
| `app_store_download_clicked` | User clicked "Download the App" in the App Store banner | `src/components/AppStoreBanner.tsx` |
| `homepage_app_store_clicked` | User clicked a "Download for iOS" CTA on the landing page | `src/app/page.tsx` (via `AppStoreLink` component) |
| `event_ticket_link_clicked` | User clicked "Get Tickets" on an event detail page | `src/app/event/[eventId]/EventCTALinks.tsx` |
| `event_volunteer_link_clicked` | User clicked "Sign Up to Volunteer" on an Everybody Eats event page | `src/app/event/[eventId]/EventCTALinks.tsx` |
| `instagram_auth_redirected` | User was redirected through the Instagram OAuth callback | `src/app/auth/instagram/callback/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/337644/dashboard/1347294
- **App Download CTAs (all sources)**: https://us.posthog.com/project/337644/insights/B9ZQdLcv
- **Web-to-App Conversion Funnel**: https://us.posthog.com/project/337644/insights/TexQMmzf
- **Event Engagement: Tickets & Volunteering**: https://us.posthog.com/project/337644/insights/AhAs9v9R
- **Daily Active Users (Unique Visitors)**: https://us.posthog.com/project/337644/insights/KjUopV1N
- **Top Navigation Paths**: https://us.posthog.com/project/337644/insights/DqB8hQen

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
