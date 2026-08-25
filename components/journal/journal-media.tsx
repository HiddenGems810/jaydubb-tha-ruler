import Image from "next/image";
import type { JournalMediaRow } from "@/lib/journal/queries";

export function JournalMedia({ media, priority = false, className = "", mediaBasePath = "/journal/media" }: {
  media: JournalMediaRow;
  priority?: boolean;
  className?: string;
  mediaBasePath?: string;
}) {
  const width = media.width ?? 1600;
  const height = media.height ?? 1200;
  if (media.kind === "video") {
    return <video className={className} controls preload="metadata" playsInline aria-label={media.alt_text ?? "Journal video"}><source src={`${mediaBasePath}/${media.id}`} type={media.mime_type} /></video>;
  }
  return (
    <Image
      className={className}
      src={`${mediaBasePath}/${media.id}`}
      alt={media.alt_text ?? ""}
      width={width}
      height={height}
      sizes="(max-width: 720px) 100vw, (max-width: 1200px) 88vw, 1200px"
      priority={priority}
      placeholder={media.blur_data_url ? "blur" : "empty"}
      blurDataURL={media.blur_data_url ?? undefined}
      unoptimized
    />
  );
}

export function JournalFigure({ media, priority = false, className = "", mediaBasePath }: {
  media: JournalMediaRow;
  priority?: boolean;
  className?: string;
  mediaBasePath?: string;
}) {
  return (
    <figure className={`journal-figure ${className}`}>
      <JournalMedia media={media} priority={priority} mediaBasePath={mediaBasePath} />
      {media.caption || media.credit ? <figcaption>{media.caption}{media.credit ? <span>Photo: {media.credit}</span> : null}</figcaption> : null}
    </figure>
  );
}
