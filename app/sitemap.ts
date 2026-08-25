import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/journal/metadata";
import { getJournalSitemapEntries } from "@/lib/journal/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getJournalSitemapEntries();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.8 },
    ...["aquarium-floors", "shake-it-bae", "dont-forget-the-bag", "off-brand"].map((slug) => ({ url: `${SITE_URL}/releases/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...entries.map((entry) => ({ url: `${SITE_URL}/journal/${entry.slug}`, lastModified: entry.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
