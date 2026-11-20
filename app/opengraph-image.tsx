import { ImageResponse } from "next/og";

export const alt =
  "Just Zole — For Honor scripts and hacks. Video previews and support on Discord.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0b0b0e",
        color: "#ffffff",
        borderLeft: "16px solid #e63950",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#e63950",
          fontSize: 28,
          letterSpacing: 8,
          marginBottom: 40,
        }}
      >
        JUST ZOLE
      </div>
      <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>
        FOR HONOR
      </div>
      <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
        SCRIPTS & HACKS.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 27,
          color: "#b6b6bf",
          marginTop: 40,
        }}
      >
        Video previews. Product details. Support on Discord.
      </div>
    </div>,
    size,
  );
}
