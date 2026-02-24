# CLAUDE.md

## Project Overview

Welly website — web companion for the Welly mobile app (Wellington, NZ social discovery platform). Renders shareable pages for posts, places, events, users, trails, and guides with deep linking back to the `wellington://` app scheme.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (via PostCSS)
- Supabase (database, auth, storage)
- Vercel OG for dynamic Open Graph images
- Deployed on Vercel

## Key Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Landing page
    layout.tsx            # Root layout (fonts, metadata)
    post/[postId]/        # Post detail page
    place/[placeId]/      # Place detail page
    event/[eventId]/      # Event detail page
    user/[userId]/        # User profile page
    trail/[trailId]/      # Trail detail page
    guide/[guideId]/      # Guide detail page
    privacy/              # Privacy policy
    support/              # Support/FAQ
    auth/instagram/       # Instagram OAuth callback
    api/og/route.tsx      # Dynamic OG image generation
  components/
    OpenInAppButton.tsx   # Deep link button (client component)
    AppStoreBanner.tsx    # App download CTA banner
  lib/
    constants.ts          # App constants, labels, deep link helpers
    types.ts              # TypeScript type definitions
    supabase.ts           # Supabase client initialization
    mappers.ts            # DB row → TypeScript type mappers (snake_case → camelCase)
```

## Architecture Notes

- All dynamic pages are server components that fetch from Supabase at request time
- Revalidation caching: posts 60s, places/users/trails 300s, place grids 3600s
- DB schema uses snake_case; TypeScript types use camelCase — `lib/mappers.ts` handles conversion
- Deep link scheme: `wellington://` (e.g. `wellington://feed/post/[id]`)
- Public Supabase client (anon key) for read-only web access
- Mobile-first design: max-width 512px containers
- Brand color: #00A5E0
- Font: Plus Jakarta Sans (weights 400-800)

## Conventions

- Path alias: `@/*` maps to `src/*`
- Image sources allowed: Supabase storage + Unsplash
- Place categories: cafe, restaurant, bar, attraction, park, venue, trail
- Event categories: music, food, art, sports, community, nightlife, markets, comedy, theatre, film, other
- Trail difficulties: easy, moderate, hard
