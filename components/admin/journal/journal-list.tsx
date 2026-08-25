"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type JournalListItem = { id: string; entry_number: number; slug: string; title: string; entry_type: string; status: string; published_at: string | null; featured_at: string | null; updated_at: string };

export function JournalList({ initialEntries }: { initialEntries: JournalListItem[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => entries.filter((entry) => (status === "all" || entry.status === status) && (!query || `${entry.title} ${entry.slug}`.toLowerCase().includes(query.toLowerCase()))), [entries, query, status]);

  async function duplicate(entry: JournalListItem) {
    const response = await fetch(`/api/admin/journal/${entry.id}/duplicate`, { method: "POST" });
    const result = await response.json();
    if (!response.ok) return alert(result.error ?? "Unable to duplicate entry");
    router.push(`/admin/journal/${result.entry.id}`);
  }

  async function remove(entry: JournalListItem) {
    if (!confirm(`Permanently delete “${entry.title}” and its uploaded media?`)) return;
    const response = await fetch(`/api/admin/journal/${entry.id}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json(); return alert(result.error ?? "Unable to delete entry"); }
    setEntries((current) => current.filter((item) => item.id !== entry.id));
  }

  return <div className="admin-card">
    <div className="admin-card-header"><div className="admin-card-actions"><input className="admin-input search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entries…" aria-label="Search Journal entries" /><select className="admin-select journal-filter" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="all">All statuses</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option></select></div><span className="admin-badge">{filtered.length} ENTRIES</span></div>
    <div className="admin-table-container">{filtered.length ? <table className="admin-table"><thead><tr><th>No.</th><th>Entry</th><th>Type</th><th>Status</th><th>Publish date</th><th>Actions</th></tr></thead><tbody>{filtered.map((entry) => <tr key={entry.id}><td>JTR/{String(entry.entry_number).padStart(3, "0")}</td><td><strong>{entry.title}</strong><div className="journal-admin-slug">/{entry.slug}</div></td><td>{entry.entry_type.replaceAll("_", " ")}</td><td><span className={`status-badge ${entry.status}`}>{entry.featured_at ? "featured · " : ""}{entry.status}</span></td><td>{entry.published_at ? new Date(entry.published_at).toLocaleString() : "-"}</td><td><div className="journal-row-actions"><Link className="btn btn-secondary btn-sm" href={`/admin/journal/${entry.id}`}>Edit</Link><Link className="btn btn-secondary btn-sm" href={`/admin/journal/${entry.id}/preview`} target="_blank">Preview</Link><button className="btn btn-secondary btn-sm" type="button" onClick={() => duplicate(entry)}>Duplicate</button><button className="btn btn-danger btn-sm" type="button" onClick={() => remove(entry)}>Delete</button></div></td></tr>)}</tbody></table> : <div className="admin-empty-state"><h3>No entries found</h3><p>Change the filters or create a new Journal entry.</p><Link href="/admin/journal/new" className="btn btn-primary">Create entry</Link></div>}</div>
  </div>;
}
