export const JOURNAL_ENTRY_TYPES = [
  "journal",
  "photo_dump",
  "on_the_road",
  "studio",
  "release_notes",
  "behind_the_scenes",
  "personal",
  "milestone",
] as const;

export const JOURNAL_STATUSES = ["draft", "scheduled", "published", "archived"] as const;

export type JournalEntryType = (typeof JOURNAL_ENTRY_TYPES)[number];
export type JournalStatus = (typeof JOURNAL_STATUSES)[number];

export type JournalBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level: 2 | 3; text: string }
  | { id: string; type: "quote"; text: string; attribution?: string }
  | { id: string; type: "pull_quote"; text: string }
  | { id: string; type: "image"; mediaId: string; mode: "column" | "wide" }
  | { id: string; type: "image_pair"; mediaIds: [string, string]; caption?: string }
  | { id: string; type: "gallery"; mediaIds: string[]; layout: "contact" | "sequence" }
  | { id: string; type: "full_width_media"; mediaId: string }
  | { id: string; type: "video_embed"; url: string; caption?: string }
  | { id: string; type: "link"; url: string; label: string; description?: string };

export type JournalContent = {
  version: 1;
  blocks: JournalBlock[];
};

export type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong" | "em"; value: string }
  | { type: "link"; value: string; url: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BLOCK_ID_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;
const MAX_BLOCKS = 120;
const MAX_GALLERY_ITEMS = 80;

export class JournalValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JournalValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new JournalValidationError(`${label} must be an object`);
  return value;
}

function stringValue(
  source: Record<string, unknown>,
  key: string,
  options: { max: number; min?: number; optional?: boolean } = { max: 10_000 },
): string | undefined {
  const value = source[key];
  if ((value === undefined || value === null) && options.optional) return undefined;
  if (typeof value !== "string") throw new JournalValidationError(`${key} must be a string`);
  const normalized = value.trim();
  const minimum = options.min ?? (options.optional ? 0 : 1);
  if (normalized.length < minimum) throw new JournalValidationError(`${key} is required`);
  if (normalized.length > options.max) {
    throw new JournalValidationError(`${key} must be ${options.max} characters or fewer`);
  }
  return normalized || undefined;
}

function blockId(source: Record<string, unknown>): string {
  const id = stringValue(source, "id", { max: 80 });
  if (!id || !BLOCK_ID_PATTERN.test(id)) {
    throw new JournalValidationError("Block id must contain only letters, numbers, underscores, or hyphens");
  }
  return id;
}

function mediaId(value: unknown): string {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new JournalValidationError("Media id must be a valid UUID");
  }
  return value.toLowerCase();
}

function mediaIds(value: unknown, options: { exact?: number; max?: number } = {}): string[] {
  if (!Array.isArray(value)) throw new JournalValidationError("mediaIds must be an array");
  if (options.exact !== undefined && value.length !== options.exact) {
    throw new JournalValidationError(`mediaIds must contain exactly ${options.exact} items`);
  }
  if (value.length === 0 || value.length > (options.max ?? MAX_GALLERY_ITEMS)) {
    throw new JournalValidationError(`mediaIds must contain between 1 and ${options.max ?? MAX_GALLERY_ITEMS} items`);
  }
  const parsed = value.map(mediaId);
  if (new Set(parsed).size !== parsed.length) {
    throw new JournalValidationError("Duplicate media id in block");
  }
  return parsed;
}

export function normalizeJournalSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function safeHttpsUrl(value: unknown): string {
  if (typeof value !== "string" || !isSafeHttpsUrl(value)) {
    throw new JournalValidationError("External URL must use HTTPS");
  }
  return new URL(value).toString();
}

export function toVideoEmbedUrl(value: string): string {
  if (!isSafeHttpsUrl(value)) throw new JournalValidationError("Video URL must use HTTPS");

  const url = new URL(value);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  let videoId = "";

  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
  } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") videoId = url.searchParams.get("v") ?? "";
    if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/").filter(Boolean)[1] ?? "";
    }
  }

  if (/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const segments = url.pathname.split("/").filter(Boolean);
    const vimeoId = segments.at(-1) ?? "";
    if (/^\d{6,12}$/.test(vimeoId)) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }

  throw new JournalValidationError("Video URL must be a supported YouTube or Vimeo URL");
}

function parseBlock(value: unknown): JournalBlock {
  const source = record(value, "Block");
  const id = blockId(source);
  const type = source.type;
  if (typeof type !== "string") throw new JournalValidationError("Block type is required");

  switch (type) {
    case "paragraph":
      return { id, type, text: stringValue(source, "text", { max: 10_000 }) ?? "" };
    case "heading": {
      const level = source.level;
      if (level !== 2 && level !== 3) throw new JournalValidationError("Heading level must be 2 or 3");
      return { id, type, level, text: stringValue(source, "text", { max: 180 }) ?? "" };
    }
    case "quote": {
      const attribution = stringValue(source, "attribution", { max: 180, optional: true });
      return {
        id,
        type,
        text: stringValue(source, "text", { max: 2_000 }) ?? "",
        ...(attribution ? { attribution } : {}),
      };
    }
    case "pull_quote":
      return { id, type, text: stringValue(source, "text", { max: 800 }) ?? "" };
    case "image": {
      if (source.mode !== "column" && source.mode !== "wide") {
        throw new JournalValidationError("Image mode must be column or wide");
      }
      return { id, type, mediaId: mediaId(source.mediaId), mode: source.mode };
    }
    case "image_pair": {
      const parsedIds = mediaIds(source.mediaIds, { exact: 2 }) as [string, string];
      const caption = stringValue(source, "caption", { max: 500, optional: true });
      return { id, type, mediaIds: parsedIds, ...(caption ? { caption } : {}) };
    }
    case "gallery": {
      if (source.layout !== "contact" && source.layout !== "sequence") {
        throw new JournalValidationError("Gallery layout must be contact or sequence");
      }
      return {
        id,
        type,
        mediaIds: mediaIds(source.mediaIds, { max: MAX_GALLERY_ITEMS }),
        layout: source.layout,
      };
    }
    case "full_width_media":
      return { id, type, mediaId: mediaId(source.mediaId) };
    case "video_embed": {
      const url = safeHttpsUrl(source.url);
      toVideoEmbedUrl(url);
      const caption = stringValue(source, "caption", { max: 500, optional: true });
      return { id, type, url, ...(caption ? { caption } : {}) };
    }
    case "link": {
      const description = stringValue(source, "description", { max: 500, optional: true });
      return {
        id,
        type,
        url: safeHttpsUrl(source.url),
        label: stringValue(source, "label", { max: 200 }) ?? "",
        ...(description ? { description } : {}),
      };
    }
    default:
      throw new JournalValidationError(`Unsupported block type: ${type}`);
  }
}

export function parseJournalContent(value: unknown): JournalContent {
  const source = record(value, "Journal content");
  if (source.version !== 1) throw new JournalValidationError("Journal content version must be 1");
  if (!Array.isArray(source.blocks)) throw new JournalValidationError("Journal content blocks must be an array");
  if (source.blocks.length > MAX_BLOCKS) {
    throw new JournalValidationError(`Journal content cannot contain more than ${MAX_BLOCKS} blocks`);
  }

  const blocks = source.blocks.map(parseBlock);
  const ids = blocks.map((block) => block.id);
  if (new Set(ids).size !== ids.length) throw new JournalValidationError("Duplicate block id");
  return { version: 1, blocks };
}

export function parseInlineText(value: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /\*\*([^*\n]+)\*\*|_([^_\n]+)_|\[([^\]\n]+)\]\((https:\/\/[^)\s]+)\)/g;
  let cursor = 0;

  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ type: "text", value: value.slice(cursor, index) });
    if (match[1]) tokens.push({ type: "strong", value: match[1] });
    else if (match[2]) tokens.push({ type: "em", value: match[2] });
    else if (match[3] && match[4] && isSafeHttpsUrl(match[4])) {
      tokens.push({ type: "link", value: match[3], url: new URL(match[4]).toString() });
    } else {
      tokens.push({ type: "text", value: match[0] });
    }
    cursor = index + match[0].length;
  }

  if (cursor < value.length) tokens.push({ type: "text", value: value.slice(cursor) });
  return tokens.length > 0 ? tokens : [{ type: "text", value }];
}

function inlinePlainText(value: string): string {
  return parseInlineText(value).map((token) => token.value).join("");
}

export function journalContentToPlainText(content: JournalContent): string {
  const parts: string[] = [];
  for (const block of content.blocks) {
    switch (block.type) {
      case "paragraph":
      case "heading":
      case "pull_quote":
        parts.push(inlinePlainText(block.text));
        break;
      case "quote":
        parts.push(inlinePlainText(block.text));
        if (block.attribution) parts.push(block.attribution);
        break;
      case "link":
        parts.push(block.label);
        if (block.description) parts.push(block.description);
        break;
      case "video_embed":
        if (block.caption) parts.push(block.caption);
        break;
      case "image_pair":
        if (block.caption) parts.push(block.caption);
        break;
      case "image":
      case "gallery":
      case "full_width_media":
        break;
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
