import type { MetadataRoute } from "next";
import { PROGRAMS } from "./lib/programs";
import { absoluteUrl } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...PROGRAMS.map((p) => ({
      url: absoluteUrl(p.href),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
