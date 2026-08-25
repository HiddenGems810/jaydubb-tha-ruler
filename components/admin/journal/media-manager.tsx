"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { JournalMediaRow } from "@/lib/journal/queries";

export function MediaManager({ entryId, media, onChange }: { entryId: string; media: JournalMediaRow[]; onChange: (media: JournalMediaRow[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setError("");
    const form = new FormData(); Array.from(files).forEach((file) => form.append("files", file));
    const response = await fetch(`/api/admin/journal/${entryId}/media`, { method: "POST", body: form });
    const result = await response.json(); setUploading(false);
    if (!response.ok) return setError(result.error ?? "Upload failed");
    onChange([...media, ...result.media]); if (inputRef.current) inputRef.current.value = "";
  }
  async function save(item: JournalMediaRow, patch: Partial<JournalMediaRow>) {
    const response = await fetch(`/api/admin/journal/${entryId}/media/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (response.ok) onChange(media.map((current) => current.id === item.id ? { ...current, ...patch } : current));
  }
  async function remove(item: JournalMediaRow) {
    if (!confirm("Delete this media file? Blocks using it will need to be updated.")) return;
    const response = await fetch(`/api/admin/journal/${entryId}/media/${item.id}`, { method: "DELETE" });
    if (response.ok) onChange(media.filter((current) => current.id !== item.id));
  }
  async function move(index: number, direction: -1 | 1) {
    const target = index + direction; if (target < 0 || target >= media.length) return;
    const next = [...media]; [next[index], next[target]] = [next[target], next[index]]; onChange(next);
    const response = await fetch(`/api/admin/journal/${entryId}/media/reorder`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((item) => item.id) }) });
    if (!response.ok) onChange(media);
  }
  const mediaBase = `/api/admin/journal/${entryId}/media`;
  return <section className="journal-editor-section"><div className="journal-editor-heading"><div><span>03</span><h2>Media library</h2></div><label className="btn btn-primary"><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4" multiple onChange={(event) => upload(event.target.files)} hidden />{uploading ? "Uploading…" : "+ Upload media"}</label></div>{error ? <p className="journal-admin-error" role="alert">{error}</p> : null}<p className="journal-editor-help">Images require meaningful alt text before publication. Copy a media ID into an image block above.</p><div className="journal-media-admin-grid">{media.map((item, index) => <article className="journal-media-admin-card" key={item.id}><div className="journal-media-admin-preview">{item.kind === "image" ? <Image src={`${mediaBase}/${item.id}/file`} alt="" fill sizes="240px" unoptimized /> : <video src={`${mediaBase}/${item.id}/file`} controls />}</div><code>{item.id}</code><label>Alt text<input className="admin-input" defaultValue={item.alt_text ?? ""} onBlur={(event) => save(item, { alt_text: event.target.value || null })} /></label><label>Caption<input className="admin-input" defaultValue={item.caption ?? ""} onBlur={(event) => save(item, { caption: event.target.value || null })} /></label><div className="journal-media-actions"><button type="button" onClick={() => move(index, -1)}>↑</button><button type="button" onClick={() => move(index, 1)}>↓</button><button type="button" onClick={() => remove(item)}>Delete</button></div></article>)}</div></section>;
}
