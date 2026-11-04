import { OG_SIZE, renderOgImage } from "../../lib/og";
import { getProgram, PROGRAMS } from "../../lib/programs";

export const alt = "A Loons Club program for school students";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const program = getProgram((await params).slug);
  return renderOgImage({
    eyebrow: program ? `${program.eyebrow} · Class 6 to 12` : "Loons Club program",
    title: program?.title ?? "Loons Club",
    subtitle: program?.body ?? "Entrepreneurship program for school students.",
  });
}
