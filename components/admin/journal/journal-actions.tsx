"use client";

import { useState } from "react";

export function JournalActions({ entryId, slug, status, publishedAt, onStatus }: { entryId: string; slug: string; status: string; publishedAt: string | null; onStatus: (status: string, publishedAt: string | null) => void }) {
  const [scheduledAt, setScheduledAt] = useState(publishedAt ? new Date(publishedAt).toISOString().slice(0, 16) : "");
  const [busy, setBusy] = useState(false);
  async function transition(nextStatus: string, featured = false) {
    if (nextStatus === "archived" && !confirm("Archive this entry? It will disappear from the public Journal.")) return;
    setBusy(true);
    const nextPublishedAt = nextStatus === "scheduled" ? new Date(scheduledAt).toISOString() : nextStatus === "published" ? (publishedAt ?? new Date().toISOString()) : null;
    const response = await fetch(`/api/admin/journal/${entryId}/publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus, published_at: nextPublishedAt, featured }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) return alert(result.error ?? "Publication change failed");
    onStatus(result.entry.status, result.entry.published_at);
  }
  return <aside className="journal-publish-panel"><div><span>Publication</span><strong className={`status-badge ${status}`}>{status}</strong></div><label>Schedule date and time<input className="admin-input" type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /></label><div className="journal-publish-actions"><button className="btn btn-primary" type="button" disabled={busy} onClick={() => transition("published")}>Publish now</button><button className="btn btn-secondary" type="button" disabled={busy || !scheduledAt} onClick={() => transition("scheduled")}>Schedule</button><button className="btn btn-secondary" type="button" disabled={busy || status !== "published"} onClick={() => transition("published", true)}>Feature</button><button className="btn btn-secondary" type="button" disabled={busy} onClick={() => transition("draft")}>Unpublish</button><button className="btn btn-danger" type="button" disabled={busy} onClick={() => transition("archived")}>Archive</button></div>{status === "published" ? <a className="btn btn-secondary" href={`/journal/${slug}`} target="_blank" rel="noreferrer">View live ↗</a> : null}</aside>;
}
