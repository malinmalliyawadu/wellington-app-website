# Welly Website

Web companion for the [Welly](https://welly.nz) mobile app — a map-based social discovery platform for Wellington, New Zealand.

The website serves as a landing page and shareable content hub. Users share posts, events, trails, and guides about Wellington spots, and the website makes these discoverable via web links with deep linking back to the mobile app.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **OG Images**: Vercel OG for dynamic social sharing images
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Then fill in your Supabase credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `NEXT_PUBLIC_SITE_URL` | Site URL (e.g. `https://welly.nz`) |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/post/[postId]` | Individual post/recommendation |
| `/place/[placeId]` | Place details with posts and reviews |
| `/event/[eventId]` | Event details |
| `/user/[userId]` | User profile |
| `/trail/[trailId]` | Trail details (difficulty, distance, elevation) |
| `/guide/[guideId]` | Curated place guide |
| `/privacy` | Privacy policy |
| `/support` | Support & FAQ |
| `/api/og` | Dynamic OG image generation |

## Project Structure

```
src/
  app/           # Pages and API routes (Next.js App Router)
  components/    # Reusable React components
  lib/           # Utilities, types, Supabase client, constants
public/          # Static assets
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```
