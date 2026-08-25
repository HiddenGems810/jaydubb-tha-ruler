# Journal / Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, art-directed Journal archive and mobile-capable publishing workflow inside the existing JayDubb artist site and Supabase CMS.

**Architecture:** Store entry metadata and versioned structured content in `journal_entries`, ordered media in `journal_media`, and source files in a private `journal-media` bucket. Public Server Components query only published/due records through RLS; stable application media routes authorize visibility before issuing short-lived storage redirects. Admin pages use authenticated server route handlers and focused client editors rather than direct privileged browser mutations.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Vinext, Supabase PostgreSQL/Auth/Storage, CSS, Node test runner, npm.

**Execution policy:** Work inline in the current checkout. Do not commit, deploy, rotate credentials, or run a remote production migration without explicit authorization. Review the diff at every checkpoint.

---

## File Map

### Domain and data

- Create `lib/journal/contracts.ts`: entry/media/block types, runtime validation, slug and URL helpers.
- Create `lib/journal/queries.ts`: public/admin read models and visibility-scoped queries.
- Create `lib/journal/metadata.ts`: metadata, JSON-LD, RSS helpers.
- Create `lib/supabase/env.ts`: fail-closed environment accessors.
- Create `lib/supabase/require-admin.ts`: server-side admin authorization helper.
- Modify `lib/supabase/admin.ts`, `client.ts`, `server.ts`, `queries.ts`, `proxy.ts`, `app/auth/callback/route.ts`: remove hardcoded fallbacks and use environment helpers.
- Create `supabase/migrations/20260823000002_journal_journey.sql`: enums, tables, constraints, functions, RLS, storage bucket/policies.
- Modify `types/database.ts`: add generated-equivalent Journal types and enums.

### Public experience

- Create `app/journal/layout.tsx`: Journal metadata shell and scoped stylesheet.
- Create `app/journal/journal.css`: index, entry, block, photo-dump, responsive, focus, and reduced-motion styles.
- Create `app/journal/page.tsx`: featured story and chronological archive.
- Create `app/journal/[slug]/page.tsx`: entry rendering, metadata, JSON-LD, adjacent links, 404 behavior.
- Create `app/journal/media/[id]/route.ts`: stable authorized media delivery route.
- Create `app/journal/rss.xml/route.ts`: published-entry RSS feed.
- Create `app/sitemap.ts`: dynamic core and Journal sitemap.
- Delete `public/sitemap.xml`: remove route conflict with dynamic sitemap.
- Create `components/journal/journal-shell.tsx`: Journal header/footer and archive framing.
- Create `components/journal/journal-index.tsx`: featured and archive compositions.
- Create `components/journal/journal-entry.tsx`: typed content renderer.
- Create `components/journal/journal-media.tsx`: responsive media and gallery primitives.

### Admin API and UI

- Create `app/api/admin/journal/route.ts`: list/create.
- Create `app/api/admin/journal/[id]/route.ts`: read/update/delete.
- Create `app/api/admin/journal/[id]/duplicate/route.ts`: duplicate entry and media metadata safely.
- Create `app/api/admin/journal/[id]/publish/route.ts`: publish/schedule/unpublish/archive/feature transitions.
- Create `app/api/admin/journal/[id]/media/route.ts`: validated multi-file upload.
- Create `app/api/admin/journal/[id]/media/[mediaId]/route.ts`: media metadata/order/delete.
- Create `app/admin/(dashboard)/journal/page.tsx`: Journal manager shell.
- Create `app/admin/(dashboard)/journal/new/page.tsx`: new-entry editor.
- Create `app/admin/(dashboard)/journal/[id]/page.tsx`: edit-entry editor.
- Create `app/admin/(dashboard)/journal/[id]/preview/page.tsx`: authenticated noindex preview.
- Create `components/admin/journal/journal-list.tsx`: filterable manager.
- Create `components/admin/journal/journal-editor.tsx`: entry form and state orchestration.
- Create `components/admin/journal/block-editor.tsx`: finite block composer.
- Create `components/admin/journal/media-manager.tsx`: upload, progress, metadata, and ordering.
- Create `components/admin/journal/journal-actions.tsx`: publication lifecycle controls.
- Modify `app/admin/(dashboard)/layout.tsx`: add Journal navigation.
- Modify `app/admin/(dashboard)/page.tsx`: add Journal metric/action.
- Modify `app/admin/admin.css`: responsive Journal editor/list styles.

### Site integration and verification

- Modify `app/page.tsx`: add Journal navigation and conditional latest-entry module.
- Modify `app/globals.css`: minimal homepage Journal integration styles.
- Modify `next.config.ts`: allow the exact Supabase storage host if framework image routing needs it.
- Modify `package.json`: add `typecheck`, `test:journal`, and safe test orchestration scripts.
- Modify `tests/supabase-security.test.mjs`: require explicit test-project credentials and skip destructive coverage otherwise.
- Create `tests/journal-contract.test.mjs`: contract/slug/URL tests.
- Create `tests/journal-rendered-html.test.mjs`: SSR, metadata, RSS, sitemap, and 404 tests.
- Create `tests/journal-security.test.mjs`: opt-in RLS/storage integration tests against an explicit disposable project.

---

### Task 1: Secure environment baseline and safe test boundary

**Files:**
- Create: `lib/supabase/env.ts`
- Modify: `lib/supabase/admin.ts`
- Modify: `lib/supabase/client.ts`
- Modify: `lib/supabase/server.ts`
- Modify: `lib/supabase/queries.ts`
- Modify: `proxy.ts`
- Modify: `app/auth/callback/route.ts`
- Modify: `scripts/seed-admins.mjs`
- Modify: `tests/supabase-security.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add fail-closed environment helpers**

Create a small module that distinguishes public and server-only values and never supplies a privileged fallback:

```ts
const required = (name: string, value: string | undefined) => {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const getSupabasePublicEnv = () => ({
  url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  anonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
});

export const getSupabaseServiceEnv = () => ({
  ...getSupabasePublicEnv(),
  serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),
});
```

- [ ] **Step 2: Replace tracked key fallbacks**

Update every Supabase client constructor to call the helper. In `.mjs` scripts/tests, require environment variables directly and do not import TypeScript application modules.

```js
const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};
```

- [ ] **Step 3: Make destructive integration tests opt-in**

Use `SUPABASE_TEST_URL`, `SUPABASE_TEST_ANON_KEY`, and `SUPABASE_TEST_SERVICE_ROLE_KEY`. Skip mutation tests when absent; never fall back to the production-looking project values.

```js
const testUrl = process.env.SUPABASE_TEST_URL;
const hasTestProject = Boolean(
  testUrl &&
  process.env.SUPABASE_TEST_ANON_KEY &&
  process.env.SUPABASE_TEST_SERVICE_ROLE_KEY,
);

test("service role fixture lifecycle", { skip: !hasTestProject }, async () => {
  // insert disposable fixture, assert, delete in finally
});
```

- [ ] **Step 4: Add authoritative scripts**

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test:journal": "node --experimental-strip-types --test tests/journal-contract.test.mjs",
    "test:security": "node --test tests/supabase-security.test.mjs tests/journal-security.test.mjs"
  }
}
```

- [ ] **Step 5: Verify the baseline**

Run:

```powershell
rg -n "sb_secret|SUPABASE_SERVICE_ROLE_KEY\s*\|\||NEXT_PUBLIC_SUPABASE_.*\|\|" --glob '!node_modules/**' --glob '!.next/**' .
npm run typecheck
npm run lint
```

Expected: no tracked secret/fallback matches; typecheck and lint exit 0.

- [ ] **Step 6: Review checkpoint**

Run `git diff --check` and inspect only the environment/test-boundary diff. Do not commit.

### Task 2: Journal contracts and validation

**Files:**
- Create: `lib/journal/contracts.ts`
- Create: `tests/journal-contract.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing contract tests**

Cover valid entries, unknown blocks, unsafe URLs, duplicate media IDs, invalid heading levels, slug normalization, limits, and plain-text extraction:

```js
import {
  normalizeJournalSlug,
  parseJournalContent,
  journalContentToPlainText,
} from "../lib/journal/contracts.ts";

test("rejects javascript URLs", () => {
  assert.throws(() => parseJournalContent({
    version: 1,
    blocks: [{ id: "b1", type: "link", label: "bad", url: "javascript:alert(1)" }],
  }), /https/i);
});

test("normalizes a stable slug", () => {
  assert.equal(normalizeJournalSlug(" Los Angeles / Oct 23 "), "los-angeles-oct-23");
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run `npm run test:journal`.

Expected: FAIL because `lib/journal/contracts.ts` does not exist.

- [ ] **Step 3: Implement discriminated contracts**

Use transform-free TypeScript compatible with Node type stripping:

```ts
export const JOURNAL_ENTRY_TYPES = [
  "journal", "photo_dump", "on_the_road", "studio",
  "release_notes", "behind_the_scenes", "personal", "milestone",
] as const;

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

export type JournalContent = { version: 1; blocks: JournalBlock[] };
```

Implement explicit object/array/string guards, maximum lengths/counts, HTTPS URL validation, a YouTube/Vimeo allowlist, safe slug normalization, and plain-text extraction. Do not accept arbitrary keys as executable behavior.

- [ ] **Step 4: Implement safe inline-mark parsing**

Keep storage as plain text and expose a tokenizer for a small display-only subset: `**bold**`, `_emphasis_`, and `[label](https://url)`. Invalid syntax remains literal text. Return tokens; never HTML.

```ts
export type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong" | "em"; value: string }
  | { type: "link"; value: string; url: string };
```

- [ ] **Step 5: Run tests**

Run `npm run test:journal`.

Expected: all contract tests pass.

- [ ] **Step 6: Review checkpoint**

Run `npm run typecheck`, `git diff --check`, and inspect contract names against the approved design.

### Task 3: Additive Supabase migration and generated-equivalent types

**Files:**
- Create: `supabase/migrations/20260823000002_journal_journey.sql`
- Modify: `types/database.ts`
- Create: `tests/journal-security.test.mjs`

- [ ] **Step 1: Write opt-in RLS tests first**

The test file must skip unless explicit test-project credentials exist. Cover public published/due visibility, draft/future denial, orphan/draft-media denial, non-admin denial, admin lifecycle, unique slug, and single-feature invariants. Every inserted fixture is removed in `finally`.

```js
test("anon cannot read draft journal entries", { skip: !hasTestProject }, async () => {
  const { data, error } = await anon.from("journal_entries").select("id").eq("id", draftId);
  assert.equal(error, null);
  assert.deepEqual(data, []);
});
```

- [ ] **Step 2: Create enums and tables**

The migration creates the approved enums and tables with checks for lengths, slug format, publication requirements, positive dimensions/file size, unique storage paths, and unique media order.

```sql
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 180),
  excerpt text CHECK (char_length(excerpt) <= 500),
  entry_type journal_entry_type NOT NULL DEFAULT 'journal',
  status journal_status NOT NULL DEFAULT 'draft',
  content jsonb NOT NULL DEFAULT '{"version":1,"blocks":[]}'::jsonb,
  event_date date,
  location text CHECK (char_length(location) <= 160),
  published_at timestamptz,
  featured_at timestamptz,
  seo_title text CHECK (char_length(seo_title) <= 70),
  seo_description text CHECK (char_length(seo_description) <= 180),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status NOT IN ('published', 'scheduled') OR published_at IS NOT NULL)
);
```

- [ ] **Step 3: Add media table and cover/OG references**

Create `journal_media`, then add `cover_media_id` and `og_media_id` FKs with `ON DELETE SET NULL`. Add the approved indexes and one-feature partial unique index:

```sql
CREATE UNIQUE INDEX journal_entries_one_featured
ON public.journal_entries ((true))
WHERE featured_at IS NOT NULL AND status = 'published';
```

- [ ] **Step 4: Add update/feature functions**

Attach the existing `handle_updated_at()` trigger. Add `set_featured_journal_entry(target_id uuid)` as `SECURITY DEFINER`, explicitly check `public.is_admin()`, set a safe `search_path`, clear the prior featured row, and feature only a currently public entry.

- [ ] **Step 5: Add RLS**

```sql
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY journal_entries_public_select ON public.journal_entries
FOR SELECT TO anon, authenticated
USING (status = 'published' AND published_at <= now());

CREATE POLICY journal_media_public_select ON public.journal_media
FOR SELECT TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.journal_entries e
  WHERE e.id = journal_media.entry_id
    AND e.status = 'published'
    AND e.published_at <= now()
));
```

Add separate admin `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies using `public.is_admin()`.

- [ ] **Step 6: Create private storage bucket and policies**

Create `journal-media` with `public = false`, a bounded file-size limit, and verified MIME allowlist. Authenticated admin policies permit select/insert/update/delete only when `public.is_admin()`; no anonymous storage policy is added because public delivery goes through the application visibility route.

- [ ] **Step 7: Update TypeScript database types**

Mirror table Row/Insert/Update relationships and enums in `types/database.ts`. Preserve existing generated file shape exactly.

- [ ] **Step 8: Validate migration safely**

If a local/disposable Supabase CLI environment is available, apply/reset there and run `npm run test:security`. If it is not available, perform SQL review and typecheck, and report integration validation as unavailable—never apply to production implicitly.

- [ ] **Step 9: Review checkpoint**

Inspect the migration for destructive statements, public bucket exposure, overly broad policies, missing `WITH CHECK`, volatile index predicates, and unsafe `SECURITY DEFINER` search paths.

### Task 4: Query layer, admin authorization, and stable media delivery

**Files:**
- Create: `lib/supabase/require-admin.ts`
- Create: `lib/journal/queries.ts`
- Create: `app/journal/media/[id]/route.ts`

- [ ] **Step 1: Implement reusable admin authorization**

```ts
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AdminAuthError(401);
  const { data: admin } = await supabase.from("admin_users").select("id, role").eq("id", user.id).maybeSingle();
  if (!admin) throw new AdminAuthError(403);
  return { supabase, user, admin };
}
```

Expose a small error-to-response helper so every API handler returns consistent 401/403 responses without leaking internals.

- [ ] **Step 2: Implement public read models**

Add `getJournalIndexPage`, `getPublishedJournalEntryBySlug`, `getAdjacentPublishedEntries`, `getLatestJournalEntry`, `getJournalSitemapEntries`, and `getJournalRssEntries`. Select named columns and ordered media only; do not use `select('*')` for public paths.

- [ ] **Step 3: Implement admin reads**

Add `getAdminJournalEntries` and `getAdminJournalEntryById` using the authenticated client returned by `requireAdmin`.

- [ ] **Step 4: Implement stable public media route**

The route first queries `journal_media` through the anonymous/RLS-scoped public client. Only after visibility succeeds may a server-only client create a short-lived signed storage URL. Return 404 for missing/private media and a redirect with conservative cache headers for visible media.

```ts
return NextResponse.redirect(signedUrl, {
  headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
});
```

- [ ] **Step 5: Verify negative behavior**

Add rendered/integration checks proving draft media IDs return 404 and published media IDs redirect only in an explicitly configured test environment.

### Task 5: Public Journal renderer and art-directed routes

**Files:**
- Create: `app/journal/layout.tsx`
- Create: `app/journal/journal.css`
- Create: `app/journal/page.tsx`
- Create: `app/journal/[slug]/page.tsx`
- Create: `components/journal/journal-shell.tsx`
- Create: `components/journal/journal-index.tsx`
- Create: `components/journal/journal-entry.tsx`
- Create: `components/journal/journal-media.tsx`
- Create: `tests/journal-rendered-html.test.mjs`

- [ ] **Step 1: Add failing SSR tests**

Assert index/entry semantics, H1 hierarchy, archive labels, JSON-LD, canonical metadata, photo-dump figures/captions, previous/next links, empty state, and 404 behavior. Use deterministic query fixtures or an injectable test seam so tests do not depend on production content.

- [ ] **Step 2: Build shared Journal shell**

Use existing logo/assets/fonts/tokens. The Journal header links brand to `/`, includes Home, Journal, Music, Shows, and Booking destinations, and provides an always-visible mobile Journal/Home path with semantic navigation.

- [ ] **Step 3: Build archive compositions**

Render featured content only when present, group entries by publication year, and vary layout classes deterministically by type/index. Keep every entry a crawlable anchor and use semantic `article`/`time` markup.

- [ ] **Step 4: Build typed block renderer**

Parse content at the boundary, map every block variant explicitly, render inline tokens as React elements, and resolve media IDs through a map. Unknown/invalid content logs a server diagnostic and renders a safe unavailable block—not raw JSON or HTML.

- [ ] **Step 5: Build photo-dump renderer**

Use ordered `figure` elements with intrinsic aspect ratios, responsive `sizes`, optional captions, and stable classes for portrait/landscape/square media. The first justified image may be eager; all remaining images are lazy.

- [ ] **Step 6: Implement index and entry routes**

The index renders the authored empty state when no entries exist. The slug route calls `notFound()` for missing/private/future content, emits JSON-LD, and includes adjacent published links.

- [ ] **Step 7: Implement responsive and accessible CSS**

Use existing tokens and fonts. Cover desktop/laptop/tablet/390px breakpoints, long titles, missing images, focus-visible, 44px touch targets, reduced motion, safe reading width, and overflow prevention.

- [ ] **Step 8: Run SSR and static checks**

Run targeted Journal tests, `npm run typecheck`, and `npm run lint`. Expected: all pass.

### Task 6: Metadata, sitemap, RSS, and social sharing

**Files:**
- Create: `lib/journal/metadata.ts`
- Create: `app/journal/rss.xml/route.ts`
- Create: `app/sitemap.ts`
- Delete: `public/sitemap.xml`
- Modify: `public/robots.txt`
- Modify: `app/journal/[slug]/page.tsx`
- Modify: `tests/journal-contract.test.mjs`
- Modify: `tests/journal-rendered-html.test.mjs`

- [ ] **Step 1: Write serialization tests**

Cover XML escaping, canonical URL construction, fallback descriptions, future/draft exclusion, modification dates, and cover/OG selection.

- [ ] **Step 2: Implement metadata helpers**

```ts
export function buildJournalMetadata(entry: PublicJournalEntry): Metadata {
  const title = entry.seo_title || entry.title;
  const description = entry.seo_description || entry.excerpt || journalContentToPlainText(entry.content).slice(0, 170);
  const canonical = new URL(`/journal/${entry.slug}`, SITE_URL).toString();
  const image = entry.og_media_id || entry.cover_media_id;
  return { title, description, alternates: { canonical }, openGraph: { type: "article", title, description, url: canonical, images: image ? [`${SITE_URL}/journal/media/${image}`] : ["/og.png"] } };
}
```

- [ ] **Step 3: Implement JSON-LD**

Emit `BlogPosting` for written/personal/release entries and `Article` for image-led archive entries. Include only truthful visible data.

- [ ] **Step 4: Replace static sitemap with dynamic sitemap**

Include core routes, release routes, `/journal`, and published Journal entries. Delete the conflicting static asset and preserve the public URL `/sitemap.xml`.

- [ ] **Step 5: Implement RSS**

Return valid escaped RSS 2.0 XML with published entries, canonical links, GUIDs, publication dates, descriptions, and media enclosure only when safe/valid.

- [ ] **Step 6: Update robots**

Keep `/admin` disallowed, reference the dynamic sitemap, and avoid pretending robots rules secure drafts.

- [ ] **Step 7: Verify**

Run tests and inspect rendered `<head>`, JSON-LD, `/sitemap.xml`, `/journal/rss.xml`, draft 404 metadata, and response content types.

### Task 7: Server-authorized Journal CRUD and uploads

**Files:**
- Create: `app/api/admin/journal/route.ts`
- Create: `app/api/admin/journal/[id]/route.ts`
- Create: `app/api/admin/journal/[id]/duplicate/route.ts`
- Create: `app/api/admin/journal/[id]/publish/route.ts`
- Create: `app/api/admin/journal/[id]/media/route.ts`
- Create: `app/api/admin/journal/[id]/media/[mediaId]/route.ts`

- [ ] **Step 1: Add route-level negative tests**

Cover unauthenticated 401, authenticated non-admin 403, malformed JSON 400, invalid content 422, missing entry 404, duplicate slug 409, unsupported file 415, oversized file 413, and invalid lifecycle transitions 409.

- [ ] **Step 2: Implement list/create route**

Require admin, parse a bounded query/filter, validate create payload, normalize slug, set `created_by/updated_by`, and return a typed response. Default to draft; never accept a browser-supplied creator ID.

- [ ] **Step 3: Implement read/update/delete route**

Validate every patch field and content contract. For delete, remove storage objects first with a captured path list; if storage cleanup partially fails, return an actionable failure and retain the database entry so cleanup can be retried.

- [ ] **Step 4: Implement publication transitions**

Accept an explicit action union. Validate required title/slug/content/cover/alt text before publish. Schedule requires a future timestamp. Unpublish clears `featured_at`. Feature uses the atomic database function.

- [ ] **Step 5: Implement duplication**

Create a draft with a collision-free `-copy` slug, clear publication/feature fields, duplicate media metadata with new IDs only after copying storage objects, and remap content media IDs. Clean up copied objects on failure.

- [ ] **Step 6: Implement upload route**

Parse multipart data, cap file count, validate content type/extension/size and decoded dimensions, use collision-resistant paths under `${entryId}/`, upload to the private bucket, insert media metadata, and roll back the object when metadata insertion fails.

- [ ] **Step 7: Implement media update/delete route**

Validate alt/caption/credit/order changes. Reordering updates all affected rows without transient unique-order collisions (use offset or RPC). Delete storage first, then row; clear cover/OG references through FK behavior.

- [ ] **Step 8: Revalidate public surfaces**

After successful publication mutations, call `revalidatePath` for `/`, `/journal`, the affected slug, `/sitemap.xml`, and `/journal/rss.xml`.

- [ ] **Step 9: Review security boundary**

Search for direct client writes to Journal tables/storage and confirm every mutation path calls `requireAdmin` before constructing a service client.

### Task 8: Mobile-capable admin Journal experience

**Files:**
- Create: `app/admin/(dashboard)/journal/page.tsx`
- Create: `app/admin/(dashboard)/journal/new/page.tsx`
- Create: `app/admin/(dashboard)/journal/[id]/page.tsx`
- Create: `app/admin/(dashboard)/journal/[id]/preview/page.tsx`
- Create: `components/admin/journal/journal-list.tsx`
- Create: `components/admin/journal/journal-editor.tsx`
- Create: `components/admin/journal/block-editor.tsx`
- Create: `components/admin/journal/media-manager.tsx`
- Create: `components/admin/journal/journal-actions.tsx`
- Modify: `app/admin/(dashboard)/layout.tsx`
- Modify: `app/admin/(dashboard)/page.tsx`
- Modify: `app/admin/admin.css`

- [ ] **Step 1: Add Journal nav and dashboard metric**

Use the existing sidebar/button vocabulary. Add a Journal count/status summary fetched with the existing dashboard queries.

- [ ] **Step 2: Build manager list**

Client-side filters operate on the bounded server result; destructive actions require confirmation and update state only after a successful response. Use links for navigation and buttons for actions.

- [ ] **Step 3: Build entry-type start screen**

`/admin/journal/new` presents two clear actions: Write an Entry and Create a Photo Dump. The selected mode initializes only relevant fields and creates a server draft before uploads.

- [ ] **Step 4: Build editor state model**

Keep one reducer/state object with dirty tracking, server validation errors, saving state, and upload state. Warn on `beforeunload` only when dirty. Clear dirty state only after confirmed server success.

- [ ] **Step 5: Build finite block editor**

Render explicit editors for all block types. Provide add, duplicate, move up, move down, and remove buttons with accessible labels. Desktop pointer dragging is enhancement only; the buttons are authoritative.

- [ ] **Step 6: Build photo manager**

Limit concurrent uploads, show progress/error per file, create preview object URLs and revoke them, edit alt/caption/credit, select cover, and persist ordering. Do not hide partial failure.

- [ ] **Step 7: Build lifecycle actions**

Save Draft, Preview, Publish/Schedule, Unpublish, Duplicate, Feature, Archive, and Delete call the server routes. Publication confirmation lists unresolved accessibility/metadata issues and blocks invalid publish attempts.

- [ ] **Step 8: Build authenticated preview**

Reuse the public entry renderer with admin data, add a preview banner, set `robots: noindex,nofollow,nocache`, and keep route protection in the existing admin layout.

- [ ] **Step 9: Add responsive/admin accessibility CSS**

At narrow widths, replace fixed sidebar assumptions with a usable top/scroll navigation, stack form sections intentionally, keep actions reachable, prevent modal overflow, and provide visible focus/status announcements.

- [ ] **Step 10: Verify editor behavior**

Run typecheck/lint, then browser-test keyboard ordering, dirty warning, failure states, 390px editing, and preview navigation with disposable test data only.

### Task 9: Homepage/navigation integration and image configuration

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `next.config.ts`

- [ ] **Step 1: Add navigation links**

Add `/journal` to desktop primary nav and a visible compact mobile destination. Ensure anchor links to home sections remain valid when navigating from Journal routes.

- [ ] **Step 2: Add conditional latest-entry module**

Fetch the latest published entry in parallel with shows. Render nothing when absent. When present, add one restrained editorial band with entry number/type/date/title/excerpt/cover and a crawlable link.

- [ ] **Step 3: Add minimal integration styles**

Use existing tokens, rules, and breakpoints; avoid altering unrelated section layout.

- [ ] **Step 4: Configure exact image host**

If framework image delivery requires remote patterns, allow only the configured Supabase project HTTPS hostname/path. Do not add `hostname: '*'`.

- [ ] **Step 5: Regression check**

Browser-check hero, current anchor navigation, release links, shows, footer, mobile header, and page length with zero/one Journal entry.

### Task 10: Full verification, hardening, and handoff evidence

**Files:**
- Modify tests or implementation files only for failures attributable to this work.
- Update design/plan checkboxes as evidence is gathered.

- [ ] **Step 1: Run decisive static checks**

```powershell
npm run typecheck
npm run lint
npm run test:journal
```

Expected: exit 0.

- [ ] **Step 2: Run safe integration checks**

Run `npm run test:security` only with explicit disposable-project variables. Without them, verify tests report skips and do not mutate configured production data.

- [ ] **Step 3: Run production build and rendered tests**

```powershell
npm run build
node --test tests/rendered-html.test.mjs tests/journal-rendered-html.test.mjs
```

Expected: build and tests exit 0 with no feature-attributable warnings.

- [ ] **Step 4: Run browser matrix**

Use the real local production-equivalent build where practical. Check public index, written entry, photo dump, invalid slug, homepage, and admin lifecycle at desktop, laptop, tablet, iPhone, and Android-sized viewports. Capture screenshots under ignored `output/playwright/`.

- [ ] **Step 5: Inspect runtime diagnostics**

Check browser console, server output, requests, redirects, status codes, hydration, overflow, focus order, reduced motion, image dimensions, cache headers, and metadata.

- [ ] **Step 6: Run accessibility/performance checks**

Use browser accessibility inspection and Lighthouse where available. Fix feature-attributable critical/serious accessibility failures, CLS sources, excessive eager images, and unnecessary client JavaScript.

- [ ] **Step 7: Security negative pass**

Attempt anonymous draft/media access, non-admin mutations, invalid block/URL payloads, duplicate slugs, oversized/unsupported uploads, publication with missing alt text, and draft metadata discovery.

- [ ] **Step 8: Diff and repository hygiene**

```powershell
git diff --check
git status --short
git diff --stat
```

Inspect the full diff for unrelated changes, secrets, generated artifacts, debug output, broad config, dead imports, public API drift, migration hazards, and missing tests.

- [ ] **Step 9: Completion audit**

Map every acceptance criterion in `docs/superpowers/specs/2026-08-23-journal-journey-design.md` to direct file/test/browser evidence. Anything without evidence remains incomplete.

- [ ] **Step 10: Prepare engineering handoff**

Report what changed, route/schema/storage architecture, exact admin workflow, SEO/security controls, exact commands/checks and results, remaining external risks (including credential rotation or unapplied production migration), important files, migration name, and evidence-based readiness state.
