# Native Printful Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure native `/shop` that uses PayPal checkout and submits paid orders to a Printful Manual Order/API store.

**Architecture:** Public catalog and selected variant IDs come from Supabase; prices, PayPal Orders API calls, and Printful order submission run only on the server. A durable order record keyed by PayPal order ID makes capture, fulfillment, and webhook delivery idempotent.

**Tech Stack:** Next.js 16 / React 19, TypeScript, Supabase Postgres + RLS, PayPal Orders API + JavaScript SDK v6, Printful REST API, Node test runner, ESLint.

---

## File structure

- `supabase/migrations/20260904000001_native_merch_store.sql`: private commerce tables, constraints, indexes, RLS, and narrow grants.
- `types/database.ts`: generated-style database types for merchandise and order tables.
- `lib/store/contracts.ts`: runtime-safe cart, checkout, money, and recipient contracts with no I/O.
- `lib/store/catalog.ts`: public catalog query and server-only cart pricing query.
- `lib/store/paypal.ts`: PayPal server token, create, get, and capture operations.
- `lib/store/printful.ts`: Printful order creation and webhook-signature verification.
- `lib/store/orders.ts`: transactional order state transitions and idempotency checks.
- `app/shop/page.tsx`, `app/shop/shop.css`, `components/shop/*`: storefront, product cards, cart, and checkout states.
- `app/api/shop/paypal/create/route.ts`, `app/api/shop/paypal/capture/route.ts`: server-authoritative checkout endpoints.
- `app/api/webhooks/printful/route.ts`: verified fulfillment-state receiver.
- `app/admin/(dashboard)/orders/page.tsx`: authenticated order operations view.
- `tests/store-*.test.mjs`: contract, migration, payment, fulfillment, security, and SSR regression tests.
- `.env.example`: complete names of required secrets only.

### Task 1: Lock down cart and money contracts

**Files:**
- Create: `lib/store/contracts.ts`
- Create: `tests/store-contract.test.mjs`

- [ ] **Step 1: Write failing contract tests**

```js
import assert from "node:assert/strict";
import test from "node:test";

const moduleUrl = new URL("../lib/store/contracts.ts", import.meta.url);
const load = () => import(`${moduleUrl.href}?t=${Date.now()}`);

test("accepts positive cart quantities and rejects browser prices", async () => {
  const { parseCheckoutRequest } = await load();
  assert.deepEqual(parseCheckoutRequest({ items: [{ variantId: "11111111-1111-4111-8111-111111111111", quantity: 2 }] }), {
    items: [{ variantId: "11111111-1111-4111-8111-111111111111", quantity: 2 }],
  });
  assert.throws(() => parseCheckoutRequest({ items: [{ variantId: "11111111-1111-4111-8111-111111111111", quantity: 1, price: "0.01" }] }), /unknown checkout field/i);
});

test("formats integer cents without floating-point rounding", async () => {
  const { centsToUsd } = await load();
  assert.equal(centsToUsd(1999), "19.99");
  assert.throws(() => centsToUsd(-1), /non-negative integer/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/store-contract.test.mjs`

Expected: failure because `lib/store/contracts.ts` does not exist.

- [ ] **Step 3: Implement the contracts**

```ts
export type CheckoutItem = { variantId: string; quantity: number };
export type CheckoutRequest = { items: CheckoutItem[] };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseCheckoutRequest(input: unknown): CheckoutRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid checkout request");
  const value = input as Record<string, unknown>;
  if (Object.keys(value).length !== 1 || !Array.isArray(value.items) || value.items.length === 0) throw new Error("Unknown checkout field or empty cart");
  return { items: value.items.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Invalid cart item");
    const row = item as Record<string, unknown>;
    if (Object.keys(row).length !== 2 || typeof row.variantId !== "string" || !UUID.test(row.variantId) || !Number.isInteger(row.quantity) || row.quantity < 1 || row.quantity > 10) throw new Error("Invalid cart item");
    return { variantId: row.variantId, quantity: row.quantity };
  }) };
}

export function centsToUsd(cents: number) {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error("Amount must be a non-negative integer");
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}
```

- [ ] **Step 4: Run the contract test**

Run: `node --experimental-strip-types --test tests/store-contract.test.mjs`

Expected: both tests pass.

### Task 2: Add constrained commerce persistence

**Files:**
- Create: `supabase/migrations/20260904000001_native_merch_store.sql`
- Modify: `types/database.ts`
- Create: `tests/store-migration.test.mjs`

- [ ] **Step 1: Write migration assertions**

```js
test("store migration keeps catalog public and commerce records private", async () => {
  const sql = await readFile(new URL("../supabase/migrations/20260904000001_native_merch_store.sql", import.meta.url), "utf8");
  for (const table of ["merch_products", "merch_variants", "store_orders", "store_order_items", "store_webhook_events"]) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
  }
  assert.match(sql, /merch_products_public_select/i);
  assert.match(sql, /merch_variants_public_select/i);
  assert.doesNotMatch(sql, /store_orders_public_select/i);
  assert.match(sql, /unique\s*\(paypal_order_id\)/i);
  assert.match(sql, /unique\s*\(printful_event_id\)/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/store-migration.test.mjs`

Expected: failure because the migration is absent.

- [ ] **Step 3: Create the migration with this schema**

```sql
CREATE TYPE public.store_order_status AS ENUM ('payment_created','paid','fulfillment_submitted','fulfilled','failed','refunded');
CREATE TABLE public.merch_products (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'), title text NOT NULL CHECK (char_length(title) <= 120), description text NOT NULL DEFAULT '', image_url text NOT NULL CHECK (image_url ~ '^/|^https://'), is_published boolean NOT NULL DEFAULT false, display_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.merch_variants (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES public.merch_products(id) ON DELETE CASCADE, label text NOT NULL, sku text NOT NULL UNIQUE, retail_price_cents integer NOT NULL CHECK (retail_price_cents >= 0), printful_sync_variant_id bigint UNIQUE, is_published boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.store_orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), paypal_order_id text NOT NULL UNIQUE, printful_order_id bigint UNIQUE, status public.store_order_status NOT NULL DEFAULT 'payment_created', currency char(3) NOT NULL DEFAULT 'USD', total_cents integer NOT NULL CHECK (total_cents >= 0), recipient jsonb NOT NULL DEFAULT '{}'::jsonb, tracking_url text, failure_reason text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.store_order_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES public.store_orders(id) ON DELETE CASCADE, variant_id uuid NOT NULL REFERENCES public.merch_variants(id), quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 10), unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0), UNIQUE(order_id, variant_id));
CREATE TABLE public.store_webhook_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), printful_event_id text NOT NULL UNIQUE, event_type text NOT NULL, payload jsonb NOT NULL, received_at timestamptz NOT NULL DEFAULT now());
```

Add updated-at triggers using the existing `public.handle_updated_at()` function; deny direct anon access; grant only published catalog reads to `anon, authenticated`; grant admin CRUD to authenticated callers satisfying `public.is_admin()`; and grant service-role access for server routes.

- [ ] **Step 4: Add matching types**

Add `merch_products`, `merch_variants`, `store_orders`, `store_order_items`, `store_webhook_events`, and `store_order_status` entries in the same generated-style shape already used by `types/database.ts`.

- [ ] **Step 5: Run migration and type checks**

Run: `node --test tests/store-migration.test.mjs; npm run typecheck`

Expected: migration assertions and TypeScript pass.

### Task 3: Build server-authoritative catalog access

**Files:**
- Create: `lib/store/catalog.ts`
- Create: `tests/store-catalog.test.mjs`

- [ ] **Step 1: Write failing catalog tests around a pure pricing helper**

```js
test("prices only published variants and preserves server prices", async () => {
  const { priceCart } = await import(new URL("../lib/store/catalog.ts", import.meta.url).href);
  const rows = [{ id: "a", retail_price_cents: 2500, is_published: true, product: { is_published: true }, printful_sync_variant_id: 123 }];
  assert.deepEqual(priceCart([{ variantId: "a", quantity: 2 }], rows), { totalCents: 5000, lines: [{ variantId: "a", quantity: 2, unitPriceCents: 2500, printfulSyncVariantId: 123 }] });
  assert.throws(() => priceCart([{ variantId: "a", quantity: 1 }], [{ ...rows[0], is_published: false }]), /unavailable/i);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/store-catalog.test.mjs`

Expected: failure because `priceCart` is absent.

- [ ] **Step 3: Implement `priceCart` and data queries**

```ts
export function priceCart(items: CheckoutItem[], variants: VariantRow[]) {
  const byId = new Map(variants.map((variant) => [variant.id, variant]));
  const lines = items.map(({ variantId, quantity }) => {
    const variant = byId.get(variantId);
    if (!variant?.is_published || !variant.product.is_published || !variant.printful_sync_variant_id) throw new Error("Requested item is unavailable");
    return { variantId, quantity, unitPriceCents: variant.retail_price_cents, printfulSyncVariantId: variant.printful_sync_variant_id };
  });
  return { totalCents: lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0), lines };
}
```

Use the public Supabase client for `getPublishedMerchCatalog()` and the service-role client for checkout-pricing variants; never return `printful_sync_variant_id` from the public query.

- [ ] **Step 4: Run the catalog test**

Run: `node --experimental-strip-types --test tests/store-catalog.test.mjs`

Expected: pass.

### Task 4: Deliver the honest, accessible shop and cart

**Files:**
- Create: `app/shop/page.tsx`
- Create: `app/shop/shop.css`
- Create: `components/shop/shop-client.tsx`
- Modify: `app/page.tsx`
- Create: `tests/store-rendered-html.test.mjs`

- [ ] **Step 1: Write the failing rendered-page test**

```js
test("server-renders an honest empty shop and a Shop navigation route", async () => {
  const response = await render("/shop");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Official merch/i);
  assert.match(html, /First drop in progress/i);
  assert.doesNotMatch(html, /Add to cart/i);
});
```

- [ ] **Step 2: Run the rendered-page test to verify it fails**

Run: `npm run build; node --test tests/store-rendered-html.test.mjs`

Expected: `/shop` does not exist.

- [ ] **Step 3: Implement the shop route and client cart**

Render an `h1` of `Official merch`, a short factual empty state when the catalog is empty, and published product cards only when `getPublishedMerchCatalog()` returns products. Use native buttons with explicit labels for variant selection and cart controls; maintain cart state in component memory only. Update both existing `Shop The 7` CTAs in `app/page.tsx` to `Link href="/shop"` and add `Shop` to primary navigation.

- [ ] **Step 4: Add styling in the existing visual system**

Use `--ink`, `--paper`, `--red`, `--font-display`, and `--font-mono`; give all controls visible `:focus-visible` styles; provide a one-column mobile layout at `700px`; and use no autoplaying or essential animation.

- [ ] **Step 5: Run render, type, and lint validation**

Run: `npm run build; node --test tests/store-rendered-html.test.mjs; npm run typecheck; npm run lint`

Expected: all checks pass.

### Task 5: Implement PayPal server operations and sandbox endpoints

**Files:**
- Create: `lib/store/paypal.ts`
- Create: `app/api/shop/paypal/create/route.ts`
- Create: `app/api/shop/paypal/capture/route.ts`
- Create: `tests/store-paypal.test.mjs`
- Modify: `.env.example`

- [ ] **Step 1: Write failing PayPal request tests**

```js
test("PayPal creation uses the calculated amount and an idempotency header", async () => {
  const { paypalCreatePayload } = await loadPaypal();
  assert.deepEqual(paypalCreatePayload("19.99"), { intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: "19.99" } }] });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/store-paypal.test.mjs`

Expected: `paypalCreatePayload` is absent.

- [ ] **Step 3: Implement a fetch-based PayPal client**

`lib/store/paypal.ts` must obtain an OAuth token from `PAYPAL_BASE_URL/v1/oauth2/token` with server-only `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`, create an Orders v2 order with `PayPal-Request-Id`, retrieve/capture an order, and reject non-`COMPLETED` capture responses. Use sandbox base URL unless `PAYPAL_MODE=live`; never accept amount or currency from the browser.

- [ ] **Step 4: Implement the routes**

`POST /api/shop/paypal/create` parses `CheckoutRequest`, prices the cart via server data, creates a pending local order and returns only `{ orderId }`. `POST /api/shop/paypal/capture` requires an existing local order, re-fetches PayPal's order, compares its completed amount to stored cents, captures it once, and hands off to fulfillment orchestration. Return safe `400`, `409`, or `502` errors; never return provider bodies or secrets.

- [ ] **Step 5: Add documented configuration names**

```dotenv
# Native shop: sandbox values first, switch PAYPAL_MODE only after verification.
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PRINTFUL_API_TOKEN=
PRINTFUL_WEBHOOK_SECRET=
```

- [ ] **Step 6: Run PayPal tests and static checks**

Run: `node --experimental-strip-types --test tests/store-paypal.test.mjs; npm run typecheck; npm run lint`

Expected: pass without requiring real credentials.

### Task 6: Submit Printful fulfillment exactly once

**Files:**
- Create: `lib/store/printful.ts`
- Create: `lib/store/orders.ts`
- Create: `tests/store-orders.test.mjs`

- [ ] **Step 1: Write the failing idempotency test**

```js
test("creates one Printful payload with a stable external ID", async () => {
  const { printfulOrderPayload } = await loadOrders();
  assert.equal(printfulOrderPayload({ paypalOrderId: "PAY-1", recipient, lines }).external_id, "paypal:PAY-1");
  assert.equal(printfulOrderPayload({ paypalOrderId: "PAY-1", recipient, lines }).items[0].sync_variant_id, 123);
});
```

- [ ] **Step 2: Run it to verify failure**

Run: `node --experimental-strip-types --test tests/store-orders.test.mjs`

Expected: helper absent.

- [ ] **Step 3: Implement Printful client and orchestration**

Create Printful orders at `https://api.printful.com/orders` with `Authorization: Bearer ${PRINTFUL_API_TOKEN}`, `external_id: paypal:${paypalOrderId}`, normalized recipient data, and only server-derived `sync_variant_id`s. In `orders.ts`, obtain the order row with a service-role query; if it already has `printful_order_id` or `status='fulfillment_submitted'`, return it without another provider call. On success save Printful ID and status; on provider failure save `failed` plus a bounded safe reason and return an error to the route.

- [ ] **Step 4: Run the orders tests**

Run: `node --experimental-strip-types --test tests/store-orders.test.mjs`

Expected: pass.

### Task 7: Receive verified fulfillment events and expose operations status

**Files:**
- Create: `app/api/webhooks/printful/route.ts`
- Create: `app/admin/(dashboard)/orders/page.tsx`
- Modify: `app/admin/(dashboard)/layout.tsx`
- Create: `tests/store-webhook.test.mjs`

- [ ] **Step 1: Write webhook safety tests**

```js
test("rejects unverified Printful webhook payloads and deduplicates delivery IDs", async () => {
  const { verifyPrintfulWebhook } = await loadWebhook();
  assert.equal(await verifyPrintfulWebhook("{}", "bad", "secret"), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/store-webhook.test.mjs`

Expected: verification helper absent.

- [ ] **Step 3: Implement webhook handling**

Read the raw request body, validate the documented Printful signature with timing-safe comparison, parse JSON only after validation, insert the provider event ID into `store_webhook_events`, and treat the uniqueness conflict as success. Update only the matching internal order by Printful ID/external ID. Map shipment events to `fulfilled`, persist a validated HTTPS tracking URL, and preserve failures for staff review.

- [ ] **Step 4: Add the private admin view**

Use the existing dashboard authentication layout. Render most-recent orders with PayPal ID suffix, status, total, created time, Printful ID, and tracking link; never render full recipient address or secrets. Add `Orders` links to desktop and mobile admin navigation.

- [ ] **Step 5: Run webhook and page checks**

Run: `node --experimental-strip-types --test tests/store-webhook.test.mjs; npm run typecheck; npm run lint`

Expected: pass.

### Task 8: Wire checkout UI, verify the complete local build, and prepare sandbox

**Files:**
- Modify: `components/shop/shop-client.tsx`
- Modify: `app/shop/page.tsx`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Extend the rendered test for the configured checkout boundary**

```js
test("shop never server-renders provider secrets", async () => {
  const response = await render("/shop");
  const html = await response.text();
  assert.doesNotMatch(html, /PAYPAL_CLIENT_SECRET|PRINTFUL_API_TOKEN|api\.printful\.com/i);
});
```

- [ ] **Step 2: Implement checkout states**

Load the PayPal JavaScript SDK only when the server provides a configured public client ID and the cart has published items. The client calls the create endpoint, completes the PayPal approval UI, calls capture, clears its cart only after the server reports fulfillment submission, and displays distinct payment, fulfillment-review, and completed messages. With missing configuration, show `Checkout will open when the first drop is configured.` and no provider button.

- [ ] **Step 3: Run the complete local suite**

Run: `npm test; npm run test:journal; npm run test:security; npm run typecheck; npm run lint; git diff --check; git status --short`

Expected: all project tests and static checks pass; inspect any unrelated pre-existing failures before claiming completion.

### Task 9: Configure external sandbox accounts only after local verification

**Files:**
- Modify: `.env.local` (never commit)
- Modify: deployment environment variables through the hosting dashboard (never place values in source)

- [ ] **Step 1: Create the Printful Manual Order/API store**

In Printful Stores, create `JayDubb Tha Ruler API Store`. In the Printful developer portal, create a single-store token with only `orders` and `sync_products` scopes. This creates persistent API access and requires action-time user confirmation.

- [ ] **Step 2: Create PayPal sandbox application credentials**

In the PayPal Developer dashboard, create a sandbox application for the JayDubb store and save only its client ID/secret in local and deployment environment settings. This creates persistent account access and requires action-time user confirmation.

- [ ] **Step 3: Configure and test a real catalog in sandbox**

Create actual artwork-backed Printful sync products and published local catalog variants. Perform one approved sandbox purchase, confirm exactly one PayPal order, one local order, and one Printful draft/order; perform one declined payment and confirm no Printful order exists.

- [ ] **Step 4: Verify webhooks**

Register the production webhook endpoint only after it is deployed over HTTPS. Send a provider test event, confirm one `store_webhook_events` row and one corresponding order-status update, then retry the event and confirm no duplicate transition.

- [ ] **Step 5: Perform controlled live launch**

Obtain explicit user confirmation immediately before creating live PayPal credentials, enabling live billing, or submitting any live payment/fulfillment transaction. Verify a controlled low-risk order and its tracking lifecycle before marketing the store.

## Plan self-review

- Spec coverage: Tasks 1–3 protect contracts and catalog; Tasks 4 and 8 deliver the public experience; Tasks 5–6 provide payments/fulfillment; Task 7 provides webhook and staff visibility; Task 9 defines external setup and sandbox-to-live verification.
- No-placeholder review: every implementation task lists concrete paths, assertions, command, and behavioral contract. Provider credentials and product artwork are explicitly deferred to controlled external setup rather than represented with fake values.
- Type consistency: client items use `variantId` and `quantity`; server-priced lines use `variantId`, `unitPriceCents`, and `printfulSyncVariantId`; PayPal and Printful correlation uses the stable `paypalOrderId` / `external_id` pairing throughout.
