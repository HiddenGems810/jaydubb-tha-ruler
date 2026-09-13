import assert from "node:assert/strict";
import test from "node:test";

const blackSheepShow = {
  title: "Bravo the Bagchaser & Peysoh Live at The Black Sheep",
  venueName: "The Black Sheep",
  address: "2106 E. Platte Ave.",
  city: "Colorado Springs",
  stateRegion: "CO",
  country: "USA",
  timezone: "America/Denver",
  eventDate: "2026-09-19T20:00:00-06:00",
  ticketUrl:
    "https://www.ticketweb.com/event/bravo-the-bagchaser-peysoh-black-sheep-tickets/14252334",
  supportingText: "Hometown Colorado Springs Showcase · All Ages · JayDubb Tha Ruler Live",
};

test("buildGoogleCalendarUrl preserves the show instant, timezone, location, and ticket link", async () => {
  const { buildGoogleCalendarUrl } = await import("../lib/show-utilities.ts");
  const url = new URL(buildGoogleCalendarUrl(blackSheepShow));

  assert.equal(url.origin, "https://calendar.google.com");
  assert.equal(url.pathname, "/calendar/render");
  assert.equal(url.searchParams.get("action"), "TEMPLATE");
  assert.equal(url.searchParams.get("dates"), "20260920T020000Z/20260920T040000Z");
  assert.equal(url.searchParams.get("ctz"), "America/Denver");
  assert.match(url.searchParams.get("location") ?? "", /The Black Sheep/);
  assert.match(url.searchParams.get("details") ?? "", /ticketweb\.com/);
  assert.match(url.searchParams.get("details") ?? "", /jaydubbtharuler\.com/);
});

test("buildShowSharePayload uses the ticket URL and formats the date in the event timezone", async () => {
  const { buildShowSharePayload } = await import("../lib/show-utilities.ts");
  const payload = buildShowSharePayload(blackSheepShow);

  assert.equal(payload.title, "JayDubb Tha Ruler - The Black Sheep");
  assert.equal(payload.url, blackSheepShow.ticketUrl);
  assert.match(payload.text, /Colorado Springs, CO/);
  assert.match(payload.text, /September 19, 2026/);
  assert.match(payload.text, /ticketweb\.com/);
});
