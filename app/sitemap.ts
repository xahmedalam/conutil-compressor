import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://conutil.com"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-06-13"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/legal`,
      lastModified: new Date("2026-06-13"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
