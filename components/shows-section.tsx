import type { Show } from "@/lib/supabase/queries";
import { ShowUtilities } from "@/components/show-utilities";

interface ShowsSectionProps {
  shows: Show[];
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function formatShowDate(dateStr: string, timezone?: string) {
  try {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString("en-US", { month: "short", timeZone: timezone || "America/Denver" }).toUpperCase();
    const day = d.toLocaleDateString("en-US", { day: "2-digit", timeZone: timezone || "America/Denver" });
    const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: timezone || "America/Denver" });
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: timezone || "America/Denver" });
    return { month, day, year, time };
  } catch {
    return { month: "TBA", day: "--", year: "2026", time: "TBA" };
  }
}

export function ShowsSection({ shows }: ShowsSectionProps) {
  const upcomingShows = shows.filter(
    (s) => s.is_published && new Date(s.event_date) >= new Date()
  );

  // Generate Schema.org Event structured data
  const eventsSchema = upcomingShows.map((show) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: show.title || `JayDubb Tha Ruler Live at ${show.venue_name}`,
    startDate: show.event_date,
    doorTime: show.doors_time || undefined,
    eventStatus:
      show.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : show.status === "postponed"
        ? "https://schema.org/EventPostponed"
        : "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: show.venue_name,
      address: {
        "@type": "PostalAddress",
        streetAddress: show.address || undefined,
        addressLocality: show.city,
        addressRegion: show.state_region,
        addressCountry: show.country,
      },
    },
    performer: {
      "@type": "Person",
      "@id": "https://jaydubbtharuler.com/#artist",
      name: "JayDubb Tha Ruler",
      url: "https://jaydubbtharuler.com",
    },
    offers: show.ticket_url
      ? {
          "@type": "Offer",
          url: show.ticket_url,
          availability:
            show.status === "sold_out"
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
        }
      : undefined,
  }));

  return (
    <section className="shows-section section-dark" id="shows" aria-labelledby="shows-title">
      {eventsSchema.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
        />
      )}

      <div className="section-heading">
        <div className="section-marker">
          <span>04</span>
          <span>Tour</span>
        </div>
        <div>
          <p className="eyebrow">Upcoming shows &amp; appearances</p>
          <h2 id="shows-title">On stage.</h2>
        </div>
        <a href="#vip" className="text-link" data-fan-event="tour_alert_click">
          Get tour alerts <Arrow />
        </a>
      </div>

      {upcomingShows.length > 0 ? (
        <div className="shows-list">
          {upcomingShows.map((show) => {
            const { month, day, year, time } = formatShowDate(show.event_date, show.timezone);
            return (
              <div key={show.id} className={`show-card ${show.is_featured ? "show-featured" : ""}`}>
                <div className="show-date-badge">
                  <span className="show-month">{month}</span>
                  <strong className="show-day">{day}</strong>
                  <span className="show-year">{year}</span>
                </div>
                <div className="show-info">
                  <div className="show-header-row">
                    <span className="show-city">
                      {show.city}, {show.state_region}
                    </span>
                    {show.is_featured && <span className="show-tag">FEATURED EVENT</span>}
                  </div>
                  <h3 className="show-venue">{show.venue_name}</h3>
                  {show.title !== show.venue_name && <p className="show-title-text">{show.title}</p>}
                  <p className="show-time-meta">
                    Event: {time} {show.timezone ? `(${show.timezone.replace("_", " ")})` : ""}
                    {show.doors_time && ` · Doors: ${formatShowDate(show.doors_time, show.timezone).time}`}
                  </p>
                  {show.supporting_text && <p className="show-support">{show.supporting_text}</p>}
                </div>
                <div className="show-action">
                  {show.status === "sold_out" ? (
                    <span className="button-sold-out">SOLD OUT</span>
                  ) : show.ticket_url ? (
                    <a
                      href={show.ticket_url}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-primary"
                      data-fan-event="ticket_click"
                      data-platform={show.venue_name}
                    >
                      GET TICKETS <Arrow />
                    </a>
                  ) : (
                    <a
                      href="#vip"
                      className="button button-ghost"
                      data-fan-event="ticket_notify"
                    >
                      NOTIFY ME <Arrow />
                    </a>
                  )}
                  <ShowUtilities
                    show={{
                      title: show.title,
                      venueName: show.venue_name,
                      address: show.address,
                      city: show.city,
                      stateRegion: show.state_region,
                      country: show.country,
                      timezone: show.timezone,
                      eventDate: show.event_date,
                      ticketUrl: show.ticket_url,
                      supportingText: show.supporting_text,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="shows-empty-state">
          <div className="empty-state-content">
            <span className="empty-badge">LIVE ARCHIVE</span>
            <h3>NO UPCOMING DATES ANNOUNCED</h3>
            <p>
              New tour dates, festival appearances, and Colorado showcases for 2026 are currently in preparation.
              Join The 7 VIP Fan Club to receive instant pre-sale access and city announcements.
            </p>
            <a href="#vip" className="button button-primary" data-fan-event="empty_shows_vip_click">
              JOIN VIP TOUR LIST <Arrow />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
