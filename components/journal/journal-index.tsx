import Link from "next/link";
import type { JournalEntryWithMedia } from "@/lib/journal/queries";
import { JournalMedia } from "@/components/journal/journal-media";

const typeLabels: Record<string, string> = {
  journal: "Journal", photo_dump: "Photo dump", on_the_road: "On the road", studio: "Studio",
  release_notes: "Release notes", behind_the_scenes: "Behind the scenes", personal: "Personal", milestone: "Milestone",
};

function dateLabel(value: string | null) {
  if (!value) return "Unpublished";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function EntryCard({ entry, index }: { entry: JournalEntryWithMedia; index: number }) {
  const cover = entry.media.find((item) => item.id === entry.cover_media_id) ?? entry.media[0];
  return (
    <article className={`journal-card card-${index % 4}`}>
      <Link href={`/journal/${entry.slug}`} aria-label={`Read ${entry.title}`}>
        {cover ? <div className="journal-card-image"><JournalMedia media={cover} /></div> : <div className="journal-card-image journal-card-placeholder"><span>JTR / {String(entry.entry_number).padStart(3, "0")}</span></div>}
        <div className="journal-card-meta"><span>{typeLabels[entry.entry_type]}</span><time dateTime={entry.published_at ?? undefined}>{dateLabel(entry.published_at)}</time></div>
        <h3>{entry.title}</h3>
        {entry.excerpt ? <p>{entry.excerpt}</p> : null}
        <span className="journal-read">Read entry <b aria-hidden="true">↗</b></span>
      </Link>
    </article>
  );
}

export function JournalIndex({ entries }: { entries: JournalEntryWithMedia[] }) {
  if (entries.length === 0) {
    return <section className="journal-empty"><span>Archive 000</span><h2>The first page is being written.</h2><p>Studio notes, road photos, release stories, and the work behind the work will live here.</p><Link href="/">Return to the music</Link></section>;
  }
  const featured = entries.find((entry) => entry.featured_at) ?? entries[0];
  const cover = featured.media.find((item) => item.id === featured.cover_media_id) ?? featured.media[0];
  const byYear = Map.groupBy(entries.filter((entry) => entry.id !== featured.id), (entry) => new Date(entry.published_at ?? 0).getUTCFullYear());
  return <>
    <section className="journal-feature">
      <div className="journal-feature-copy"><span className="journal-kicker">Featured / {typeLabels[featured.entry_type]}</span><h2>{featured.title}</h2>{featured.excerpt ? <p>{featured.excerpt}</p> : null}<Link href={`/journal/${featured.slug}`}>Enter story <b aria-hidden="true">↗</b></Link></div>
      <Link href={`/journal/${featured.slug}`} className="journal-feature-media" aria-label={`Read ${featured.title}`}>{cover ? <JournalMedia media={cover} priority /> : <div className="journal-feature-placeholder">JTR / {String(featured.entry_number).padStart(3, "0")}</div>}</Link>
    </section>
    {[...byYear.entries()].sort(([a], [b]) => b - a).map(([year, yearEntries]) => <section className="journal-year" key={year}><div className="journal-year-heading"><span>{year}</span><h2>Archive</h2><small>{String(yearEntries.length).padStart(2, "0")} entries</small></div><div className="journal-grid">{yearEntries.map((entry, index) => <EntryCard entry={entry} index={index} key={entry.id} />)}</div></section>)}
  </>;
}
