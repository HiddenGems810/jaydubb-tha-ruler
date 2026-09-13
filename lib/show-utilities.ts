export interface ShareableShow {
  title: string;
  venueName: string;
  address?: string | null;
  city: string;
  stateRegion: string;
  country: string;
  timezone: string;
  eventDate: string;
  ticketUrl?: string | null;
  supportingText?: string | null;
}

const SITE_URL = "https://jaydubbtharuler.com";

function formatCalendarInstant(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function formatLocation(show: ShareableShow) {
  return [
    show.venueName,
    show.address,
    `${show.city}, ${show.stateRegion}`,
    show.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function buildGoogleCalendarUrl(show: ShareableShow) {
  const start = new Date(show.eventDate);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const ticketUrl = show.ticketUrl || SITE_URL;
  const details = [
    show.supportingText,
    `Tickets: ${ticketUrl}`,
    `Artist: ${SITE_URL}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: show.title || `JayDubb Tha Ruler at ${show.venueName}`,
    dates: `${formatCalendarInstant(start)}/${formatCalendarInstant(end)}`,
    details,
    location: formatLocation(show),
    ctz: show.timezone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildShowSharePayload(show: ShareableShow) {
  const eventDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: show.timezone,
  }).format(new Date(show.eventDate));
  const url = show.ticketUrl || `${SITE_URL}/#shows`;
  const location = `${show.city}, ${show.stateRegion}`;

  return {
    title: `JayDubb Tha Ruler - ${show.venueName}`,
    text: `${show.title} at ${show.venueName} in ${location} on ${eventDate}. Tickets: ${url}`,
    url,
  };
}
