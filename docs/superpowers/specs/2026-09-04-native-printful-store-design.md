# Native Printful Store Design

## Objective

Add a customer-facing merch store to `jaydubbtharuler.com` without WordPress or new GoDaddy hosting. Customers pay JayDubb through PayPal; Printful fulfills paid orders through a dedicated Manual Order/API store.

## Scope

The initial release provides the production-ready foundation for a small Printful catalog, PayPal sandbox checkout, secure fulfillment submission, and order-status synchronization. Until actual product artwork and configured Printful variants exist, the shop exposes an honest empty catalog state and no purchasable placeholder merchandise.

## Architecture

```text
Browser (/shop)
  -> server-rendered catalog from Supabase
  -> PayPal JavaScript SDK
  -> server-side create/capture endpoints
  -> durable Supabase order record
  -> Printful Manual Order/API store
  -> Printful webhook -> order and tracking updates
```

### Catalog

Supabase is authoritative for public product names, descriptions, media, retail prices, visibility, and permitted variants. Each sellable variant stores the associated Printful sync-variant ID. Browser requests carry only the selected local variant IDs and quantities; prices and Printful identifiers are never trusted from client input.

### Payments and fulfillment

1. The server validates the requested cart against published variants and calculates the full USD total.
2. The server creates a PayPal Orders API order using that calculated total.
3. After buyer approval, the server captures the PayPal order and verifies its completed state and amount.
4. The server persists a single order keyed by the PayPal order ID, then creates a Printful order using that ID as `external_id`.
5. The Printful order is submitted only once. Retry paths reuse the existing order record and Printful external ID.
6. Printful webhooks update fulfillment, shipment, tracking, and failure state. Customer-facing status pages reveal only the authenticated order's safe delivery information.

## Security and privacy

- `PRINTFUL_API_TOKEN`, `PAYPAL_CLIENT_SECRET`, and webhook verification material are server-only environment variables.
- Use a Printful token restricted to the single Manual Order/API store with only required product and order scopes.
- Do not expose PayPal client secret, Printful token, product costs, or internal Printful identifiers to clients.
- Validate fulfillment destination data server-side before creating an order.
- Enforce webhook authenticity before mutating order state; persist delivery IDs to make webhook processing idempotent.
- Store only the order data needed for fulfillment, support, refunds, and tax/accounting obligations. Do not store raw payment credentials or card data.

## UX

- Add a prominent `Shop` route and update existing merch CTAs to point to it.
- Preserve the established JayDubb visual system, responsive behavior, keyboard navigation, focus treatment, and image alt text.
- The shop supports catalog, product detail, variant selection, cart, checkout, confirmation, error, and empty states.
- Customer-facing messaging distinguishes a failed payment from a successful payment whose fulfillment submission needs review.

## Rollout

1. Add database schema, typed data access, shop routes, and catalog/admin workflow.
2. Create the Printful Manual Order/API store and configure a restricted token.
3. Add launch designs and publish Printful sync products; map only approved variants into the local catalog.
4. Configure PayPal sandbox credentials and complete successful + declined test payments.
5. Configure webhook delivery and verify shipment-status synchronization.
6. Create a PayPal live application, add production secrets, and complete a controlled launch verification.

## Acceptance criteria

- The shop works in local development without secrets and displays an explicit unavailable state rather than a broken checkout.
- A browser cannot change server-authoritative prices or submit arbitrary Printful product IDs.
- Sandbox purchase creates exactly one internal order and no more than one Printful order for the same PayPal payment.
- Fulfillment failures are visible to an administrator and are never shown as successful purchases to customers.
- Store UI remains usable on mobile and by keyboard.
- Existing site pages and Supabase functionality continue working unchanged.

## Non-goals

- No WordPress, WooCommerce, GoDaddy hosting purchase, or GoDaddy DNS change is part of this release.
- No recurring subscriptions, discount engine, customer accounts, multi-currency pricing, or customer self-service returns in the first release.
- No production credentials, live payments, or live Printful fulfillment before sandbox verification passes.

## Decisions and open operational inputs

- The store currency is USD.
- The first catalog starts empty; actual products require JayDubb-approved artwork, retail price, and Printful configuration.
- A PayPal Business account is required for the merchant checkout integration.
- Printful's normal billing flow remains separate: customers pay JayDubb at checkout, and Printful charges its saved billing method for fulfillment.
