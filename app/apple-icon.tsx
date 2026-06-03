import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#060a14",
          color: "#38bdf8",
          fontSize: 92,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        CG
      </div>
    ),
    { ...size },
  );
}
