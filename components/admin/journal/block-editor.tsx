"use client";

import type { JournalBlock, JournalContent } from "@/lib/journal/contracts";

const id = () => crypto.randomUUID();

export function BlockEditor({ content, onChange }: { content: JournalContent; onChange: (content: JournalContent) => void }) {
  const update = (index: number, patch: Partial<JournalBlock>) => onChange({ version: 1, blocks: content.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } as JournalBlock : block) });
  const remove = (index: number) => onChange({ version: 1, blocks: content.blocks.filter((_, blockIndex) => blockIndex !== index) });
  const move = (index: number, direction: -1 | 1) => { const blocks = [...content.blocks]; const target = index + direction; if (target < 0 || target >= blocks.length) return; [blocks[index], blocks[target]] = [blocks[target], blocks[index]]; onChange({ version: 1, blocks }); };
  const add = (type: "paragraph" | "heading" | "quote" | "pull_quote" | "image" | "video_embed" | "link") => {
    const base = { id: id(), type };
    const block: JournalBlock = type === "heading" ? { ...base, type, level: 2, text: "New section" } : type === "image" ? { ...base, type, mediaId: "", mode: "wide" } : type === "video_embed" ? { ...base, type, url: "https://www.youtube.com/watch?v=" } : type === "link" ? { ...base, type, url: "https://", label: "Link title" } : { ...base, type, text: "" } as JournalBlock;
    onChange({ version: 1, blocks: [...content.blocks, block] });
  };

  return <section className="journal-editor-section"><div className="journal-editor-heading"><div><p className="journal-editor-kicker">Story structure</p><h2>Story blocks</h2></div><div className="journal-block-add">{(["paragraph", "heading", "quote", "pull_quote", "image", "video_embed", "link"] as const).map((type) => <button className="btn btn-secondary btn-sm" type="button" onClick={() => add(type)} key={type}>+ {type.replace("_", " ")}</button>)}</div></div>
    <div className="journal-block-list">{content.blocks.length === 0 ? <p className="journal-editor-help">Start with a paragraph, then add images, headings, quotes, video, or links.</p> : content.blocks.map((block, index) => <div className="journal-block" key={block.id}><div className="journal-block-toolbar"><strong>{String(index + 1).padStart(2, "0")} · {block.type.replace("_", " ")}</strong><div><button type="button" onClick={() => move(index, -1)} aria-label="Move block up">↑</button><button type="button" onClick={() => move(index, 1)} aria-label="Move block down">↓</button><button type="button" onClick={() => remove(index)} aria-label="Remove block">Remove</button></div></div>
      {"text" in block ? <textarea className="admin-textarea" rows={block.type === "paragraph" ? 6 : 3} value={block.text} onChange={(event) => update(index, { text: event.target.value } as Partial<JournalBlock>)} /> : null}
      {block.type === "heading" ? <select className="admin-select" value={block.level} onChange={(event) => update(index, { level: Number(event.target.value) as 2 | 3 })}><option value="2">Section heading</option><option value="3">Subheading</option></select> : null}
      {block.type === "image" ? <div className="form-grid-2"><input className="admin-input" value={block.mediaId} onChange={(event) => update(index, { mediaId: event.target.value })} placeholder="Media UUID from the library below" /><select className="admin-select" value={block.mode} onChange={(event) => update(index, { mode: event.target.value as "column" | "wide" })}><option value="column">Text column</option><option value="wide">Wide</option></select></div> : null}
      {block.type === "video_embed" ? <input className="admin-input" type="url" value={block.url} onChange={(event) => update(index, { url: event.target.value })} aria-label="YouTube or Vimeo URL" /> : null}
      {block.type === "link" ? <div className="form-grid-2"><input className="admin-input" value={block.label} onChange={(event) => update(index, { label: event.target.value })} placeholder="Link title" /><input className="admin-input" type="url" value={block.url} onChange={(event) => update(index, { url: event.target.value })} placeholder="https://" /></div> : null}
    </div>)}</div>
  </section>;
}
