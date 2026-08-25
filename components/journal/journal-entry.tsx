import type { ReactNode } from "react";
import { parseInlineText, parseJournalContent, toVideoEmbedUrl } from "@/lib/journal/contracts";
import type { JournalEntryWithMedia } from "@/lib/journal/queries";
import { JournalFigure } from "@/components/journal/journal-media";

function InlineText({ text }: { text: string }) {
  return parseInlineText(text).map((token, index): ReactNode => {
    if (token.type === "strong") return <strong key={index}>{token.value}</strong>;
    if (token.type === "em") return <em key={index}>{token.value}</em>;
    if (token.type === "link") return <a key={index} href={token.url} target="_blank" rel="noreferrer">{token.value}</a>;
    return token.value;
  });
}

export function JournalEntryBody({ entry, mediaBasePath }: { entry: JournalEntryWithMedia; mediaBasePath?: string }) {
  let content;
  try {
    content = parseJournalContent(entry.content);
  } catch (error) {
    console.error("Invalid Journal content", { entryId: entry.id, error: error instanceof Error ? error.message : "unknown" });
    return <p className="journal-unavailable">This entry is temporarily unavailable.</p>;
  }
  const media = new Map(entry.media.map((item) => [item.id, item]));
  const figure = (id: string, className = "") => {
    const item = media.get(id);
    return item ? <JournalFigure media={item} className={className} mediaBasePath={mediaBasePath} /> : null;
  };

  return <div className="journal-body">{content.blocks.map((block) => {
    switch (block.type) {
      case "paragraph": return <p key={block.id}><InlineText text={block.text} /></p>;
      case "heading": return block.level === 2 ? <h2 key={block.id}>{block.text}</h2> : <h3 key={block.id}>{block.text}</h3>;
      case "quote": return <blockquote key={block.id}><p><InlineText text={block.text} /></p>{block.attribution ? <cite>— {block.attribution}</cite> : null}</blockquote>;
      case "pull_quote": return <aside className="journal-pull" key={block.id}><InlineText text={block.text} /></aside>;
      case "image": return <div className={`journal-media-block is-${block.mode}`} key={block.id}>{figure(block.mediaId)}</div>;
      case "full_width_media": return <div className="journal-media-block is-full" key={block.id}>{figure(block.mediaId)}</div>;
      case "image_pair": return <figure className="journal-pair" key={block.id}><div>{block.mediaIds.map((id) => figure(id))}</div>{block.caption ? <figcaption>{block.caption}</figcaption> : null}</figure>;
      case "gallery": return <div className={`journal-gallery is-${block.layout}`} key={block.id}>{block.mediaIds.map((id) => figure(id))}</div>;
      case "video_embed": return <figure className="journal-embed" key={block.id}><iframe src={toVideoEmbedUrl(block.url)} title={block.caption ?? "Journal video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />{block.caption ? <figcaption>{block.caption}</figcaption> : null}</figure>;
      case "link": return <a className="journal-link-card" href={block.url} target="_blank" rel="noreferrer" key={block.id}><span>{block.label}</span>{block.description ? <small>{block.description}</small> : null}<b aria-hidden="true">↗</b></a>;
    }
  })}</div>;
}
