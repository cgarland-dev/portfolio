import { ImageResponse } from "next/og";

export const alt = "Christopher Garland — Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060a14",
          color: "#e8eef7",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#0c1426",
              border: "1px solid #1e2a44",
              color: "#38bdf8",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            CG
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#94a3b8" }}>
            github.com/cgarland-dev
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800 }}>
            Christopher Garland
          </div>
          <div
            style={{
              display: "flex",
              width: 120,
              height: 6,
              background: "#38bdf8",
              borderRadius: 3,
              marginTop: 24,
              marginBottom: 24,
            }}
          />
          <div style={{ display: "flex", fontSize: 40, color: "#38bdf8" }}>
            Software Developer · Technical Systems &amp; Tooling
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 27, color: "#94a3b8" }}>
          Python · Scala · SQL · Parsing · Tooling · Data-center systems
        </div>
      </div>
    ),
    { ...size },
  );
}
