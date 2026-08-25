import type { Metadata } from "next";
import type { JournalEntryWithMedia } from "@/lib/journal/queries";
import { journalContentToPlainText, parseJournalContent } from "@/lib/journal/contracts";

export const SITE_URL = "https://jaydubbtharuler.com";

export function journalEntryMetadata(entry: JournalEntryWithMedia): Metadata {
  const title = entry.seo_title || entry.title;
  let description = entry.seo_description || entry.excerpt || "";
  if (!description) {
    try { description = journalContentToPlainText(parseJournalContent(entry.content)).slice(0, 180); } catch { description = "A Journal entry from JayDubb Tha Ruler."; }
  }
  const imageId = entry.og_media_id || entry.cover_media_id;
  const image = imageId ? `${SITE_URL}/journal/media/${imageId}` : `${SITE_URL}/og.png`;
  const url = `${SITE_URL}/journal/${entry.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, publishedTime: entry.published_at ?? undefined, modifiedTime: entry.updated_at, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function journalArticleJsonLd(entry: JournalEntryWithMedia) {
  const imageId = entry.og_media_id || entry.cover_media_id;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.seo_description || entry.excerpt || undefined,
    datePublished: entry.published_at,
    dateModified: entry.updated_at,
    mainEntityOfPage: `${SITE_URL}/journal/${entry.slug}`,
    image: imageId ? `${SITE_URL}/journal/media/${imageId}` : undefined,
    author: { "@type": "Person", name: "JayDubb Tha Ruler", url: SITE_URL },
    publisher: { "@type": "Organization", name: "The 7 / KSTG ENT", url: SITE_URL },
  };
}

export function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[character] ?? character);
}
