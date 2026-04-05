import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Verhuurplanner — beschikbaarheidskalender voor vakantieverhuurders";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f2d4a 0%, #1d6fa4 50%, #0f2d4a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Calendar icon */}
        <div style={{ display: "flex", marginBottom: "24px" }}>
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" />
            <path d="M3 9h18" stroke="white" strokeWidth="1.5" />
            <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="7" y="13" width="3" height="3" rx="0.5" fill="white" />
            <rect x="11" y="13" width="3" height="3" rx="0.5" fill="#60a5fa" />
            <rect x="15" y="13" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Verhuurplanner
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            marginTop: "16px",
            maxWidth: "800px",
          }}
        >
          Beschikbaarheidskalender voor vakantieverhuurders
        </div>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
            fontSize: 16,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span>Eenvoudig beheer</span>
          <span>·</span>
          <span>Reservaties bijhouden</span>
          <span>·</span>
          <span>Gratis starten</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
