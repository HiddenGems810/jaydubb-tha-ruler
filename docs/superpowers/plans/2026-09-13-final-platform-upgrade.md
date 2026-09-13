# Final Platform Upgrade Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with test-first vertical slices. Preserve unrelated uncommitted work in `app/page.tsx`, `app/globals.css`, and `app/shop/`.

**Goal:** Add a professional EPK, a persistent fan action dock, and native calendar/share utilities without redesigning the existing artist site.

**Architecture:** Keep pages as Server Components and isolate browser-only behavior in small Client Components. Reuse current content, assets, CSS tokens, analytics attributes, Supabase show records, and canonical structured-data identity. Put calendar/share formatting in a pure TypeScript helper so timezone and encoding behavior can be regression tested.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, native CSS, native Intersection Observer, Clipboard, and Web Share APIs.

---

### Task 1: Lock regression expectations

**Files:**
- Create: `tests/platform-upgrade.test.mjs`
- Modify: `package.json`

- [ ] Assert the homepage renders `ShowsSection` once and links to `/epk` from Press and the footer.
- [ ] Assert `/epk` renders its title, metadata, two bios, verified press, downloads, canonical artist identity, and booking action.
- [ ] Assert the dock source uses `IntersectionObserver`, never a scroll listener, and exposes the four required destinations.
- [ ] Assert calendar and share helpers encode a real offset timestamp, location, timezone, ticket URL, and fallback site URL.
- [ ] Run the focused test and confirm it fails because the upgrade files do not exist.

### Task 2: Add show utility domain helpers and client controls

**Files:**
- Create: `lib/show-utilities.ts`
- Create: `components/show-utilities.tsx`
- Modify: `components/shows-section.tsx`
- Modify: `app/globals.css`

- [ ] Implement `buildGoogleCalendarUrl` with UTC dates, the stored IANA timezone, venue/address, ticket link, and a conservative two-hour fallback duration.
- [ ] Implement `buildShowSharePayload` with venue, city/state, localized event date, and ticket-or-site URL.
- [ ] Add a client Share control that uses `navigator.share`, ignores user cancellation, falls back to `navigator.clipboard.writeText`, and announces `COPIED` or `UNAVAILABLE`.
- [ ] Keep `GET TICKETS` visually dominant; render calendar and share as secondary text utilities.
- [ ] Preserve sold-out and no-ticket behavior plus existing MusicEvent output.

### Task 3: Add the professional EPK

**Files:**
- Create: `app/epk/layout.tsx`
- Create: `app/epk/page.tsx`
- Create: `app/epk/epk.css`
- Create: `components/copy-button.tsx`
- Create: `components/epk-view-tracker.tsx`
- Modify: `app/sitemap.ts`

- [ ] Export static route metadata with the canonical `/epk` URL, Open Graph image, and Twitter card.
- [ ] Render the approved information architecture with only verified copy and existing official assets.
- [ ] Implement copy feedback through the Clipboard API and an `aria-live` status.
- [ ] Use same-origin direct downloads for official photos and logo assets, without duplicating heavy files.
- [ ] Reuse `youtube-nocookie.com`, current platform links, press URLs, booking anchor, and canonical artist `@id`.
- [ ] Add `/epk` to the existing sitemap architecture.

### Task 4: Add the public fan action dock

**Files:**
- Create: `components/fan-action-dock.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] Keep first paint hidden and observe `#top` with Intersection Observer.
- [ ] Show on public routes when the hero is substantially out of view; hide on admin/auth routes and around forms/footer.
- [ ] Add Listen, Tickets, The 7, and Book destinations with current analytics conventions.
- [ ] Make hidden links unfocusable, provide visible focus, use practical touch targets, and apply iOS safe-area spacing.
- [ ] Limit motion to opacity and 8px translation over 180ms, with a reduced-motion override.

### Task 5: Connect homepage discovery paths

**Files:**
- Modify: `app/page.tsx`

- [ ] Confirm exactly one `ShowsSection` instance remains.
- [ ] Add `VIEW EPK` beside the existing Press heading.
- [ ] Add `EPK` to footer navigation without adding another primary-header item.
- [ ] Preserve all unrelated `/shop` and Journal error-handling work already in the file.

### Task 6: Harden and verify

**Files:**
- Modify only files implicated by actual failures.

- [ ] Run focused unit/rendered tests, typecheck, scoped lint, full build, and `npm test`.
- [ ] Run `git diff --check`, inspect the actual diff, and verify no secret, generated artifact, duplicate schema, or unrelated refactor entered the change.
- [ ] Test `/`, `/epk`, `/journal`, and `/releases/shake-it-bae` in a real browser; inspect desktop and mobile layouts, console logs, keyboard paths, copy feedback, calendar URL, share fallback, downloads, and dock visibility.
- [ ] Run Impeccable detection once over changed UI targets, then one bounded polish/hardening pass and one confirmation pass.
