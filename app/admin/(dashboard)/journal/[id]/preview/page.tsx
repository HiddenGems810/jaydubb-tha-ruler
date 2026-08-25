import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/journal/journal.css";
import { JournalEntryBody } from "@/components/journal/journal-entry";
import { JournalMedia } from "@/components/journal/journal-media";
import { getAdminJournalEntryById } from "@/lib/journal/queries";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const metadata: Metadata = { title: "Journal preview", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; await requireAdmin();
  const entry = await getAdminJournalEntryById(id); if (!entry) notFound();
  const mediaBasePath = `/api/admin/journal/${id}/media`;
  const cover = entry.media.find((item) => item.id === entry.cover_media_id) ?? entry.media[0];
  return <div className="journal-preview"><div className="journal-preview-bar">PRIVATE PREVIEW · {entry.status}</div><article className={`journal-entry type-${entry.entry_type}`}><header className="journal-entry-header"><div className="journal-entry-index"><span>JTR / {String(entry.entry_number).padStart(3, "0")}</span><span>{entry.entry_type.replaceAll("_", " ")}</span></div><h1>{entry.title}</h1>{entry.excerpt ? <p>{entry.excerpt}</p> : null}</header>{cover ? <figure className="journal-entry-cover"><JournalMedia media={cover} priority mediaBasePath={mediaBasePath} /></figure> : null}<JournalEntryBody entry={entry} mediaBasePath={mediaBasePath} /></article></div>;
}
