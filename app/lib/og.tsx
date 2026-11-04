import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// Brand fonts from /public, read once per server instance
const fonts = Promise.all([
  readFile(join(process.cwd(), "public/Clamp-Light-BF6a4db666a34da.otf")),
  readFile(join(process.cwd(), "public/moonlit-flow.italic.otf")),
]);

// The shared social card: brand mark, a headline and a supporting line on the site's purple gradient
export async function renderOgImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const [clamp, moonlit] = await fonts;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "Clamp",
          background: "linear-gradient(135deg, #24124a 0%, #3b1f73 55%, #7c3aed 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ fontFamily: "Moonlit", fontSize: 64, color: "#c4b5fd" }}>Loons</span>
          <span style={{ opacity: 0.75 }}>loonsclub.com</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#c4b5fd" }}>{eyebrow}</span>
          <span style={{ marginTop: 20, fontSize: 72, lineHeight: 1.05, letterSpacing: -1.5 }}>{title}</span>
          <span style={{ marginTop: 28, fontSize: 32, lineHeight: 1.35, opacity: 0.8, maxWidth: 940 }}>{subtitle}</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Clamp", data: clamp, weight: 300, style: "normal" },
        { name: "Moonlit", data: moonlit, weight: 400, style: "italic" },
      ],
    },
  );
}
