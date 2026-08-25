"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor } from "@/components/admin/journal/block-editor";
import { JournalActions } from "@/components/admin/journal/journal-actions";
import { MediaManager } from "@/components/admin/journal/media-manager";
import { JOURNAL_ENTRY_TYPES, type JournalContent } from "@/lib/journal/contracts";
import type { JournalEntryWithMedia } from "@/lib/journal/queries";

const emptyContent: JournalContent = { version: 1, blocks: [] };

export function JournalEditor({ entryId }: { entryId?: string }) {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntryWithMedia | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", entry_type: "journal", event_date: "", location: "", seo_title: "", seo_description: "", content: emptyContent });
  const [loading, setLoading] = useState(Boolean(entryId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { if (!entryId) return; let active = true; fetch(`/api/admin/journal/${entryId}`).then(async (response) => ({ response, result: await response.json() })).then(({ response, result }) => { if (!active) return; if (!response.ok) throw new Error(result.error); setEntry(result.entry); setForm({ title: result.entry.title, slug: result.entry.slug, excerpt: result.entry.excerpt ?? "", entry_type: result.entry.entry_type, event_date: result.entry.event_date ?? "", location: result.entry.location ?? "", seo_title: result.entry.seo_title ?? "", seo_description: result.entry.seo_description ?? "", content: result.entry.content }); setLoading(false); }).catch((error) => { if (active) { setMessage(error.message); setLoading(false); } }); return () => { active = false; }; }, [entryId]);

  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setMessage("");
    const response = await fetch(entryId ? `/api/admin/journal/${entryId}` : "/api/admin/journal", { method: entryId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) return setMessage(result.error ?? "Unable to save entry");
    if (!entryId) return router.push(`/admin/journal/${result.entry.id}`);
    setEntry((current) => current ? { ...current, ...result.entry } : current); setMessage("Saved."); router.refresh();
  }

  if (loading) return <div className="admin-content"><p>Loading Journal entry…</p></div>;
  return <form onSubmit={save} className="journal-editor"><div className="journal-editor-main"><section className="journal-editor-section"><div className="journal-editor-heading"><div><span>01</span><h2>Entry details</h2></div><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : entryId ? "Save changes" : "Create draft"}</button></div>{message ? <p className={message === "Saved." ? "journal-admin-success" : "journal-admin-error"} role="status">{message}</p> : null}<div className="form-field"><label htmlFor="journal-title">Title *</label><input id="journal-title" className="admin-input journal-title-input" required maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div><div className="form-grid-2"><div className="form-field"><label htmlFor="journal-slug">URL slug</label><input id="journal-slug" className="admin-input" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="Generated from title" /></div><div className="form-field"><label htmlFor="journal-type">Entry type</label><select id="journal-type" className="admin-select" value={form.entry_type} onChange={(event) => setForm({ ...form, entry_type: event.target.value })}>{JOURNAL_ENTRY_TYPES.map((type) => <option value={type} key={type}>{type.replaceAll("_", " ")}</option>)}</select></div></div><div className="form-field"><label htmlFor="journal-excerpt">Archive excerpt</label><textarea id="journal-excerpt" className="admin-textarea" maxLength={500} rows={4} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} /></div><div className="form-grid-2"><div className="form-field"><label htmlFor="journal-date">Story date</label><input id="journal-date" className="admin-input" type="date" value={form.event_date} onChange={(event) => setForm({ ...form, event_date: event.target.value })} /></div><div className="form-field"><label htmlFor="journal-location">Location</label><input id="journal-location" className="admin-input" maxLength={160} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></div></div></section>{entryId ? <BlockEditor content={form.content} onChange={(content) => setForm({ ...form, content })} /> : <p className="journal-editor-help">Create the draft to unlock story blocks and media uploads.</p>}{entryId && entry ? <MediaManager entryId={entryId} media={entry.media} onChange={(media) => setEntry({ ...entry, media })} /> : null}<section className="journal-editor-section"><div className="journal-editor-heading"><div><span>04</span><h2>Search and sharing</h2></div></div><div className="form-field"><label>SEO title · 70 characters</label><input className="admin-input" maxLength={70} value={form.seo_title} onChange={(event) => setForm({ ...form, seo_title: event.target.value })} /></div><div className="form-field"><label>SEO description · 180 characters</label><textarea className="admin-textarea" maxLength={180} rows={3} value={form.seo_description} onChange={(event) => setForm({ ...form, seo_description: event.target.value })} /></div></section></div>{entryId && entry ? <JournalActions entryId={entryId} slug={form.slug} status={entry.status} publishedAt={entry.published_at} onStatus={(status, published_at) => setEntry({ ...entry, status: status as JournalEntryWithMedia["status"], published_at })} /> : null}</form>;
}
