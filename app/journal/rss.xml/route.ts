import { escapeXml, SITE_URL } from "@/lib/journal/metadata";
import { getJournalRssEntries } from "@/lib/journal/queries";

export const revalidate = 300;

export async function GET() {
  const entries = await getJournalRssEntries();
  const items = entries.map((entry) => `<item><title>${escapeXml(entry.title)}</title><link>${SITE_URL}/journal/${escapeXml(entry.slug)}</link><guid isPermaLink="true">${SITE_URL}/journal/${escapeXml(entry.slug)}</guid><description>${escapeXml(entry.excerpt ?? "")}</description><pubDate>${new Date(entry.published_at ?? entry.updated_at).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>JayDubb Tha Ruler — Journal</title><link>${SITE_URL}/journal</link><description>Studio notes, road photos, release stories, and the work behind the work.</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600" } });
}
