import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  cacheComponents: true,
  cacheLife: {
    frequent: { stale: 30, revalidate: 60, expire: 3600 },
    moderate: { stale: 60, revalidate: 300, expire: 86400 },
    infrequent: { stale: 300, revalidate: 3600, expire: 604800 },
  },
  experimental: {
    viewTransition: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kxxktfdzcjidewrzujoa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.eventfinda.co.nz",
      },
      {
        protocol: "https",
        hostname: "cdn.filestackcontent.com",
      },
      {
        protocol: "https",
        hostname: "volunteers.everybodyeats.nz",
      },
    ],
  },
  headers: async () => [
    {
      source: "/.well-known/apple-app-site-association",
      headers: [
        { key: "Content-Type", value: "application/json" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

export default nextConfig;
