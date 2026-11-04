import { OG_SIZE, renderOgImage } from "./lib/og";

export const alt = "Loons Club: entrepreneurship program for school students (Class 6 to 12) in Chennai";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "For students · Class 6 to 12 · Chennai",
    title: "Entrepreneurship program for school students",
    subtitle: "Find a real problem, build an MVP and take a startup to market, mentored by founders.",
  });
}
