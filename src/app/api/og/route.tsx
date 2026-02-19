import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const BRAND_COLOR = "#00A5E0";
const BRAND_DARK = "#0086B8";

const TYPE_COLORS: Record<string, { bg: string; accent: string }> = {
  post: { bg: "#FAFAFA", accent: BRAND_COLOR },
  event: { bg: "#FFF7ED", accent: "#E85D04" },
  place: { bg: "#F0FDF4", accent: "#2D6A4F" },
  user: { bg: "#EFF6FF", accent: "#0077B6" },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Welly";
  const subtitle = searchParams.get("subtitle") || "Discover Wellington";
  const type = searchParams.get("type") || "post";

  const colors = TYPE_COLORS[type] ?? TYPE_COLORS.post;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px 80px",
          backgroundColor: colors.bg,
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(to right, ${BRAND_COLOR}, ${BRAND_DARK})`,
            display: "flex",
          }}
        />

        {/* Logo / App Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: BRAND_COLOR,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            W
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#666",
            }}
          >
            Welly
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? 36 : 48,
            fontWeight: 800,
            color: "#1A1A1A",
            lineHeight: 1.2,
            maxWidth: 900,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: 24,
              color: "#666",
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.accent,
                display: "flex",
              }}
            />
            {subtitle}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            fontSize: 18,
            color: "#999",
            display: "flex",
          }}
        >
          welly.nz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
