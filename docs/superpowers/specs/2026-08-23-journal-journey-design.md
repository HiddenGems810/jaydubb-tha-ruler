# Journal / Journey Experience Design

**Date:** 2026-08-23
**Status:** Approved for implementation
**Risk class:** R2 — schema, storage, authorization, public routes, and admin workflow

## Objective

Create the running document of JayDubb Tha Ruler: a secure, art-directed archive where JayDubb can publish written entries and image-led photo dumps from the existing CMS, and where fans can browse the work as an intentional extension of the current artist site.

## Product Outcomes

- JayDubb can create, preview, save, publish, schedule, unpublish, duplicate, feature, and delete Journal entries from the current admin area on desktop or mobile.
- Photo dumps are a first-class, low-friction format that can be published with minimal writing.
- Written entries support a finite set of expressive content blocks without becoming a general-purpose page builder.
- Public Journal pages are server-rendered, indexable when published, visually authored, accessible, and performant with large image collections.
- Drafts, future scheduled entries, and unpublished media cannot be read by public users; scheduled entries become public automatically when their due time arrives.
- Production launches without fabricated entries. Automated tests use isolated, disposable fixtures.

## Repository Evidence and Constraints

- Runtime: Next.js 16.2, React 19.2, Vinext 0.0.50, Vite 8.1, Node 22+.
- Package manager: npm with `package-lock.json`.
- Routing: App Router under `app/`.
- Data/auth: Supabase SSR/Auth with `admin_users` membership and PostgreSQL RLS.
- Hosting: Vinext/Cloudflare-compatible build with OpenAI Sites configuration; a Vercel project is also linked.
- Visual system: Anton display type, Manrope body, IBM Plex Mono metadata, black/paper surfaces, blue photography, red actions, hard rules, editorial numbering, restrained motion.
- Current admin CRUD is primarily browser-driven. Journal mutations will improve the security boundary by using server-authorized handlers.
- The repository currently contains a tracked service-role fallback. Implementation must remove secret fallbacks and fail closed when required server configuration is missing. Credential rotation remains an external environment operation.

## Scope

### Public routes

- `/journal`
- `/journal/[slug]`
- `/journal/rss.xml`
- Dynamic sitemap entries through `app/sitemap.ts`
- Dynamic robots handling through `app/robots.ts` or equivalent framework metadata route
- Optional dynamic Journal Open Graph image route when supported by the installed runtime

### Admin routes

- `/admin/journal`
- `/admin/journal/new`
- `/admin/journal/[id]`
- `/admin/journal/[id]/preview`
- Server-authorized Journal CRUD, publication, duplication, ordering, and upload endpoints/actions

### Site integration

- Add Journal to desktop primary navigation.
- Add an always-visible Journal destination to the current compact mobile header.
- Render a restrained latest-entry homepage module only when published Journal content exists.
- Add Journal navigation to the footer where it improves discovery.

## Non-Goals

- Rebuilding the existing site or CMS.
- A general-purpose Notion-style editor.
- User accounts, comments, likes, or public submissions.
- Fabricated launch content, testimonials, statistics, or artist claims.
- A production deployment, secret rotation, or remote migration without explicit environment authorization.
- A new analytics, authentication, image-hosting, or CMS vendor.

## Information Architecture

### Journal index

The page opens as an archive, not a marketing landing page. A large editorial masthead establishes `JOURNAL`, archival notation, a concise voice-led description, entry count, and year range. When a featured entry exists it receives dominant visual authority. The remaining archive is grouped chronologically with year divisions and mixed editorial rows rather than uniform cards.

Entry types initially supported:

- `journal`
- `photo_dump`
- `on_the_road`
- `studio`
- `release_notes`
- `behind_the_scenes`
- `personal`
- `milestone`

These values provide useful organization without creating a separate category-management system. The public index can filter by a small subset only after enough content exists; initial implementation keeps the archive chronological and crawlable.

### Journal entry

Every entry has a shared masthead with archival entry number, type, title, event/content date, optional location, excerpt, and cover media. The body presentation branches by entry type:

- Written entries use a calm reading column with full-width breakout blocks.
- Photo dumps use sequence-driven mixed-aspect-ratio layouts, contact-sheet clusters, and occasional full-bleed media.
- Missing optional fields collapse cleanly without placeholder copy.

Previous/next published-entry links keep the archive explorable and create crawlable internal links.

## Visual System

- Reuse the installed brand fonts and global color tokens.
- Continue the site's archival notation with labels such as `JNL / 001`.
- Reserve red for actions and active states; let black, paper, white, and blue photography dominate.
- Use large typography, deliberate asymmetry, hard rules, negative space, and quiet mono metadata.
- Preserve original image aspect ratios. Cover treatments may use deliberate art-directed crops, but sequence media is not forced into identical rectangles.
- Use CSS-based transitions and the existing motion language. New client-side motion is limited to interactions that cannot be expressed accessibly with CSS.
- Respect `prefers-reduced-motion` and keep content visible without animation.

### Mobile art direction

- Use edge-to-edge photography with safe text insets.
- Recompose archive rows into intentional alternating sequences rather than mechanically stacking desktop columns.
- Keep reading measure comfortable and metadata scannable.
- Clamp or wrap extremely long titles without clipping or overlap.
- Provide minimum 44px touch targets for primary editor and public controls.
- Avoid horizontal overflow across mixed-aspect galleries.

## Data Model

### Enums

`journal_entry_type`:

- `journal`
- `photo_dump`
- `on_the_road`
- `studio`
- `release_notes`
- `behind_the_scenes`
- `personal`
- `milestone`

`journal_status`:

- `draft`
- `scheduled`
- `published`
- `archived`

`journal_media_kind`:

- `image`
- `video`

### `journal_entries`

- `id uuid primary key`
- `slug text unique not null`
- `title text not null`
- `excerpt text`
- `entry_type journal_entry_type not null`
- `status journal_status not null default 'draft'`
- `content jsonb not null default '[]'`
- `event_date date`
- `location text`
- `published_at timestamptz`
- `featured_at timestamptz`
- `cover_media_id uuid` added after media table creation
- `seo_title text`
- `seo_description text`
- `og_media_id uuid` added after media table creation
- `created_by uuid references auth.users`
- `updated_by uuid references auth.users`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints and indexes:

- Slug format and case-normalization checks.
- Title, excerpt, SEO title, description, and location length limits.
- `published` requires `published_at`.
- `scheduled` requires a future `published_at`.
- Partial unique index allowing only one currently featured public entry.
- Public archive index on status, publication date, and entry type.
- GIN or JSON index is omitted until a demonstrated query requires it.

### `journal_media`

- `id uuid primary key`
- `entry_id uuid not null references journal_entries on delete cascade`
- `storage_path text unique not null`
- `kind journal_media_kind not null default 'image'`
- `mime_type text not null`
- `width integer`
- `height integer`
- `file_size_bytes bigint`
- `blur_data_url text`
- `alt_text text`
- `caption text`
- `credit text`
- `sort_order integer not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints and indexes:

- Positive width, height, size, and non-negative ordering.
- Unique `(entry_id, sort_order)`.
- Index on `entry_id, sort_order`.
- Image publication requires non-empty alt text unless explicitly marked decorative; Journal editorial media is expected to be descriptive by default.

## Content Block Contract

`journal_entries.content` stores a versioned array of a finite discriminated union. It is validated at every server mutation boundary and parsed defensively during rendering.

Initial block types:

- `paragraph`: rich text limited to safe inline marks and links.
- `heading`: levels 2 or 3 only.
- `quote`: quote text and optional attribution.
- `pull_quote`: display emphasis separate from semantic quotation.
- `image`: one media ID and presentation mode.
- `image_pair`: two media IDs and optional shared caption.
- `gallery`: ordered media IDs and layout preference.
- `full_width_media`: one media ID.
- `video_embed`: validated HTTPS URL from an allowlisted provider and optional caption.
- `link`: validated HTTPS destination, label, and optional description.

Arbitrary HTML, scripts, styles, iframes, and unvalidated URLs are not accepted. A `version` field provides a future migration path without speculative complexity.

## Admin Experience

### Journal list

- Search title, slug, location, and excerpt.
- Filter by status and type.
- Show publication/event dates, featured state, and last update.
- Actions: edit, preview, duplicate, publish/schedule, unpublish, feature/unfeature, archive, delete.
- Empty, loading, error, and success states are explicit.

### Entry creation

The first choice is `Write an Entry` or `Create a Photo Dump`.

Photo dump fields:

- Title
- Optional excerpt/introduction
- Optional date and location
- Cover selection
- Multi-image upload
- Ordering
- Alt text and optional captions
- Optional closing note

Written entry fields:

- Title and generated/editable slug
- Type, excerpt, date, and location
- Cover image
- Finite content block composer
- SEO overrides in a collapsed advanced panel

### Save and publication behavior

- Explicit Save Draft, Preview, Publish, Schedule, Unpublish, Duplicate, Feature, Archive, and Delete actions.
- Publication confirmation summarizes title, slug, publish time, image/alt-text readiness, and metadata.
- Preview lives behind authenticated admin authorization and is `noindex`.
- Unsaved changes trigger a navigation warning.
- Slug conflicts are checked early and enforced by the database.
- Scheduling relies on public query conditions (`published_at <= now()`), not a cron job.
- Only one entry can be featured; featuring a new entry atomically clears the previous feature.

### Upload behavior

- Validate MIME type, extension, file size, and decoded image dimensions.
- Generate collision-resistant storage paths owned by the entry.
- Display per-file pending/uploading/success/error state.
- Limit upload concurrency to protect mobile networks.
- Allow retry and explicit removal after partial failure.
- Preserve successful uploads when another file fails.
- Capture width, height, byte size, alt text, caption, and order.
- Reorder with pointer interaction on desktop plus visible keyboard/touch move controls everywhere.

## Security Design

### Authorization

- Every Journal mutation verifies the Supabase user server-side and confirms membership in `admin_users`.
- Client rendering and sidebar visibility are usability only, never authorization.
- Service-role access is restricted to server-only modules and used only when RLS-safe user-scoped operations are insufficient.
- Server environment access fails closed when required values are absent.
- Hardcoded secret-key fallbacks are removed from source, tests, and scripts.

### RLS

Public `SELECT` on `journal_entries` is limited to:

- `status in ('published', 'scheduled')`
- `published_at is not null`
- `published_at <= now()`

Public `SELECT` on `journal_media` is limited through an `EXISTS` relationship to a publicly readable parent entry. Authenticated administrators receive CRUD policies through the existing `is_admin()` helper.

### Storage

- Create a dedicated `journal-media` bucket.
- Limit accepted MIME types to JPEG, PNG, WebP, and AVIF where platform support is verified.
- Apply a proportionate source-file limit and enforce validation in both storage policy and server upload handling.
- Public reads are limited to object paths associated with publicly visible entries.
- Admin writes require `is_admin()` and entry-owned path conventions.
- Deleting an entry removes related database rows; storage cleanup is explicit and retryable so a transient storage failure does not corrupt database state silently.

### Input and output safety

- Validate all request bodies and content blocks at runtime.
- Normalize and validate slugs and external URLs.
- Allowlist video providers and construct embed URLs server-side.
- Render content from typed components rather than `dangerouslySetInnerHTML`.
- Avoid logging tokens, secrets, full storage URLs with signed parameters, or sensitive account data.
- Return user-safe errors and retain developer-useful server diagnostics.

## Public Data Access and Caching

- Public queries request only fields needed by each route.
- The index uses bounded pagination/progressive loading suitable for hundreds of entries.
- Entry pages query by exact normalized slug and public visibility constraints.
- Public routes use server rendering with a conservative revalidation policy matching the existing site.
- Admin routes remain dynamic and uncached.
- Publication mutations revalidate the Journal index, entry route, homepage, sitemap, and RSS feed.
- Unknown, draft, archived, or future slugs return the same 404 behavior to avoid leaking existence.

## Image Pipeline

- Use the installed framework image component where compatible with Vinext.
- Configure the Supabase storage host explicitly rather than allowing broad remote hosts.
- Store intrinsic dimensions and set width/height or stable aspect ratios to prevent layout shift.
- Supply accurate responsive `sizes` per layout.
- Prioritize only the above-the-fold featured/cover image.
- Lazy-load below-fold sequence media.
- Preserve professional source quality while choosing bounded delivery widths and proportionate quality.
- Use blur placeholders only when they can be generated reliably without bloating database rows or markup.
- Do not request full-resolution originals for archive thumbnails.
- Paginate or progressively reveal very large photo dumps while retaining crawlable content and no-JavaScript access.

## SEO and Sharing

- Generate unique title, description, canonical, Open Graph, and X metadata for every public entry.
- Default descriptions derive from the explicit SEO override, excerpt, or a safely truncated plain-text body—not generic filler.
- Use cover or OG override media with correct dimensions and alt text.
- Emit `Article` or `BlogPosting` JSON-LD only when semantically valid, including headline, author, canonical URL, dates, and images.
- Add published Journal URLs to a dynamic sitemap with modification dates.
- Keep admin, preview, draft, archived, and future content out of metadata surfaces and indexes.
- Expose `/journal/rss.xml` with published entries in reverse chronology.
- Add crawlable previous/next links and a Journal link in primary navigation.
- Return correct 200/404 behavior without soft-404 pages.

## Accessibility

- One visible H1 per route and ordered H2/H3 structure.
- Semantic `article`, `time`, `figure`, `figcaption`, lists, navigation, links, and buttons.
- Meaningful alternative text required before publication for informative images.
- Visible focus using the existing focus language.
- Keyboard and touch access for all editor functions, reorder controls, dialogs, and confirmations.
- Accessible status announcements for saves and uploads.
- Dialog focus management, escape handling, labelling, and focus return.
- Color contrast checked across black, paper, blue, muted, and red states.
- Reduced-motion behavior prevents transforms or opacity from hiding content.
- No auto-playing audio or video.

## Error and Edge-Case Design

- Zero entries: authored archive introduction with no fabricated cards.
- One entry/no featured entry: promote the single newest entry without invalid feature metadata.
- Missing/deleted cover: typography-led fallback treatment.
- Invalid/draft/future slug: 404 with no existence leak.
- Duplicate slug: inline conflict before save and database rejection fallback.
- Huge photo dump: bounded upload concurrency, stable reordering, progressive public rendering.
- Failed/partial upload: per-item retry/remove; successful files remain intact.
- Unsupported/corrupt file: reject before durable association.
- Bad network: preserve editor state and show retryable failure.
- Long title/missing optional text: layout-safe wrapping and graceful omission.
- Malformed external URL: reject at validation boundary.
- Database failure: public safe error boundary; admin actionable failure without false success.
- Unauthorized mutation/upload: 401/403 and no state change.
- Stale cache: explicit path/tag revalidation after publication mutations.

## Testing and Verification

### Static and unit coverage

- Content block runtime parser accepts valid blocks and rejects malformed/untrusted blocks.
- Slug normalization and URL validation tests.
- Metadata, JSON-LD, RSS, and sitemap serialization tests.
- Public visibility predicate tests for draft, scheduled, published, archived, and future entries.
- Admin authorization negative tests.

### Database and storage coverage

- Migration applies cleanly to a disposable/local Supabase environment where available.
- Anonymous users can read only published, due entries and their media.
- Anonymous users cannot read drafts, future scheduled entries, archived entries, or orphaned media.
- Non-admin authenticated users cannot create, update, delete, feature, publish, or upload.
- Admin users can perform the authorized lifecycle.
- Feature uniqueness and slug constraints are verified.
- Security tests must not mutate production; tests use an explicitly configured test project or a transactionally isolated local environment.

### Browser coverage

Public viewports:

- Desktop
- Laptop
- Tablet
- iPhone-sized
- Android-sized

Routes and states:

- Journal index with zero, one, and multiple entries
- Written entry
- Photo dump with mixed aspect ratios
- Invalid/unpublished/future slug
- Homepage and navigation integration

Admin lifecycle:

- Authenticate
- Create draft
- Upload mixed-aspect images
- Reorder images with pointer and keyboard/touch controls
- Edit and preview
- Publish and verify public appearance
- Edit published entry
- Unpublish and verify disappearance
- Delete disposable test content

Inspect console errors, failed requests, hydration warnings, overflow, focus order, server logs, metadata, RLS behavior, reduced motion, and layout stability.

### Repository commands

- `npm run lint`
- `npx tsc --noEmit`
- Targeted Node tests
- `npm run build`
- `npm test` only after its production-mutating security test is isolated or replaced
- `git diff --check`
- `git status --short`

## Migration and Rollback

- Add a new forward-only migration; do not rewrite the existing initial migration.
- The change is additive: new enums, tables, indexes, policies, and bucket.
- Public navigation can ship safely with an empty archive.
- Rollback at application level removes navigation/routes while leaving additive tables intact to preserve authored content.
- A destructive database rollback is not required and must not be run against production without explicit authorization.
- If a migration has shipped and needs correction, use a forward-fix migration.

## Acceptance Criteria

- [ ] JayDubb can complete the full draft-to-publish lifecycle from a phone-sized viewport.
- [ ] Photo dumps support mixed aspect ratios, ordered media, optional writing, cover choice, captions, and alt text.
- [ ] Written entries render all supported content blocks without raw HTML execution.
- [ ] `/journal` and `/journal/[slug]` match the established brand and remain usable across target viewports.
- [ ] Only published, due entries and related media are publicly readable.
- [ ] Drafts, previews, archived entries, and future entries are not indexable or publicly discoverable.
- [ ] Navigation, optional homepage module, sitemap, RSS, canonical, Open Graph, X, and structured metadata are correct.
- [ ] Empty, error, missing-media, invalid-slug, duplicate-slug, long-title, and partial-upload states are handled.
- [ ] Keyboard, focus, semantic, alt-text, contrast, and reduced-motion requirements pass manual/browser verification.
- [ ] Responsive image sizing, intrinsic dimensions, lazy loading, bounded queries, and pagination/progressive rendering are implemented.
- [ ] No hardcoded secret or privileged browser credential remains.
- [ ] Relevant lint, type, targeted tests, production build, browser checks, and diff hygiene checks pass or are reported with exact blockers.
- [ ] Existing routes and unrelated site behavior remain intact.

## Readiness Target

The local implementation may be classified **Review-Ready** after relevant repository, database, browser, accessibility, and security checks pass. It cannot be classified Production Verified without an authorized production migration/deployment, secret rotation, and production smoke test.
