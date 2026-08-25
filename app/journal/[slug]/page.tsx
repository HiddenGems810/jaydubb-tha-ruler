import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalEntryBody } from "@/components/journal/journal-entry";
import { JournalMedia } from "@/components/journal/journal-media";
import { journalArticleJsonLd, journalEntryMetadata } from "@/lib/journal/metadata";
import { getAdjacentPublishedEntries, getPublishedJournalEntryBySlug } from "@/lib/journal/queries";

type Props = { params: Promise<{ slug: string }> };
const label = (value: string) => value.replaceAll("_", " ");
const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : "";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublishedJournalEntryBySlug(slug);
  return entry ? journalEntryMetadata(entry) : { title: "Entry not found", robots: { index: false, follow: false } };
}

export default async function JournalEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getPublishedJournalEntryBySlug(slug);
  if (!entry) notFound();
  const adjacentPromise = getAdjacentPublishedEntries(entry);
  const cover = entry.media.find((item) => item.id === entry.cover_media_id) ?? entry.media[0];
  const adjacent = await adjacentPromise;
  return <article className={`journal-entry type-${entry.entry_type}`}>
    <header className="journal-entry-header"><Link href="/journal" className="journal-back">← All entries</Link><div className="journal-entry-index"><span>JTR / {String(entry.entry_number).padStart(3, "0")}</span><span>{label(entry.entry_type)}</span></div><h1>{entry.title}</h1>{entry.excerpt ? <p>{entry.excerpt}</p> : null}<div className="journal-entry-meta"><time dateTime={entry.published_at ?? undefined}>{formatDate(entry.published_at)}</time>{entry.location ? <span>{entry.location}</span> : null}</div></header>
    {cover ? <figure className="journal-entry-cover"><JournalMedia media={cover} priority />{cover.caption ? <figcaption>{cover.caption}</figcaption> : null}</figure> : null}
    <JournalEntryBody entry={entry} />
    <nav className="journal-adjacent" aria-label="Adjacent Journal entries"><div>{adjacent.older ? <Link href={`/journal/${adjacent.older.slug}`}><span>Previous entry</span><b>{adjacent.older.title}</b></Link> : <span />}</div><div>{adjacent.newer ? <Link href={`/journal/${adjacent.newer.slug}`}><span>Next entry</span><b>{adjacent.newer.title}</b></Link> : <Link href="/journal"><span>End of entry</span><b>Back to archive</b></Link>}</div></nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(journalArticleJsonLd(entry)).replace(/</g, "\\u003c") }} />
  </article>;
}
