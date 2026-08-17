import Image from "next/image";
import Link from "next/link";
import { getAllPublishedShows } from "@/lib/supabase/queries";
import { ShowsSection } from "@/components/shows-section";
import { VipForm } from "@/components/vip-form";
import { BookingForm } from "@/components/booking-form";
import { ScrollAnimator } from "@/components/scroll-animator";

const releases = [
  {
    year: "2026",
    title: "Shake It Bae",
    detail: "Single · feat. LLzMusik",
    href: "https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143",
    slug: "/releases/shake-it-bae",
    hasPage: true,
  },
  {
    year: "2025",
    title: "Don't Forget the Bag",
    detail: "Studio Album",
    href: "https://music.apple.com/us/album/dont-forget-the-bag/1820728789",
    slug: "/releases/dont-forget-the-bag",
    hasPage: true,
  },
  {
    year: "2025",
    title: "Plain Jane",
    detail: "Single",
    href: "https://music.apple.com/us/album/plain-jane-single/1824313063",
    slug: null,
    hasPage: false,
  },
  {
    year: "2025",
    title: "Wyd",
    detail: "Single",
    href: "https://music.apple.com/us/album/wyd-single/1794084583",
    slug: null,
    hasPage: false,
  },
  {
    year: "2024",
    title: "Did It My Way",
    detail: "Single · feat. Skeme",
    href: "https://music.apple.com/in/album/did-it-my-way-feat-skeme-single/1768614095",
    slug: null,
    hasPage: false,
  },
  {
    year: "2023",
    title: "Get Back to It",
    detail: "EP",
    href: "https://music.apple.com/ng/album/get-back-to-it-ep/1694204547",
    slug: null,
    hasPage: false,
  },
  {
    year: "2022",
    title: "Off Brand",
    detail: "Single · feat. Westside Boogie",
    href: "https://music.apple.com/za/album/off-brand-single-feat-westside-boogie-single/1617966879",
    slug: "/releases/off-brand",
    hasPage: true,
  },
];

const press = [
  {
    source: "Westword",
    title: "JayDubb Tha Ruler teams up with Westside Boogie",
    href: "https://www.westword.com/music/denver-rap-jaydubb-tharuler-westside-boogie-13972187/",
  },
  {
    source: "303 Magazine",
    title: "Consistency, versatility and the making of Off Brand",
    href: "https://303magazine.com/2022/05/jaydubbtharuler-review/",
  },
  {
    source: "VoyageDenver",
    title: "Meet JayDubb Tha Ruler of KSTG ENT",
    href: "https://voyagedenver.com/interview/meet-jaydubb-tharuler-kstg-ent-colorado-springs/",
  },
];

const socials = [
  ["Instagram", "https://www.instagram.com/jaydubbtharuler/"],
  ["Facebook", "https://www.facebook.com/jaydubbtharuler/"],
  ["YouTube", "https://www.youtube.com/@jaydubbtharuler"],
  ["Spotify", "https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l"],
  ["Apple Music", "https://music.apple.com/us/artist/jaydubbtharuler/1439373897"],
  ["X", "https://x.com/JayDubbThaRuler"],
];

const structuredDataGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://jaydubbtharuler.com/#website",
      url: "https://jaydubbtharuler.com",
      name: "JayDubb Tha Ruler | Official Artist Website",
      description:
        "Official website for JayDubb Tha Ruler: music, videos, live tour dates, merch, and booking.",
      publisher: {
        "@id": "https://jaydubbtharuler.com/#artist",
      },
      inLanguage: "en-US",
    },
    {
      "@type": ["MusicGroup", "Person"],
      "@id": "https://jaydubbtharuler.com/#artist",
      name: "JayDubb Tha Ruler",
      alternateName: ["JayDubb", "JayDubbThaRuler", "Justin Wallace"],
      url: "https://jaydubbtharuler.com",
      image: "https://jaydubbtharuler.com/images/jay-dubb/blue-hands.jpg",
      genre: ["Hip-Hop", "Rap", "Independent Hip-Hop"],
      birthPlace: {
        "@type": "Place",
        name: "Colorado Springs, Colorado",
      },
      foundingLocation: {
        "@type": "Place",
        name: "Colorado Springs, Colorado",
      },
      sameAs: socials.map(([, href]) => href),
      album: [
        {
          "@type": "MusicAlbum",
          name: "Don't Forget the Bag",
          datePublished: "2025",
          url: "https://jaydubbtharuler.com/releases/dont-forget-the-bag",
        },
        {
          "@type": "MusicAlbum",
          name: "The Year of the 7",
          datePublished: "2018",
        },
        {
          "@type": "MusicAlbum",
          name: "Get Back to It",
          datePublished: "2023",
        },
      ],
      track: [
        {
          "@type": "MusicRecording",
          name: "Shake It Bae",
          datePublished: "2026",
          url: "https://jaydubbtharuler.com/releases/shake-it-bae",
        },
        {
          "@type": "MusicRecording",
          name: "Aquarium Floors",
          url: "https://jaydubbtharuler.com/releases/aquarium-floors",
        },
        {
          "@type": "MusicRecording",
          name: "Off Brand",
          datePublished: "2022",
          url: "https://jaydubbtharuler.com/releases/off-brand",
        },
        {
          "@type": "MusicRecording",
          name: "Plain Jane",
          datePublished: "2025",
        },
        {
          "@type": "MusicRecording",
          name: "Wyd",
          datePublished: "2025",
        },
        {
          "@type": "MusicRecording",
          name: "Did It My Way",
          datePublished: "2024",
        },
      ],
      knowsAbout: [
        "Hip-Hop Music",
        "Colorado Hip-Hop Scene",
        "Poetry and Lyricism",
        "Independent Music Production",
      ],
    },
    {
      "@type": "VideoObject",
      "@id": "https://jaydubbtharuler.com/#video-aquarium",
      name: "JayDubb Tha Ruler - Aquarium Floors (Official Music Video)",
      description:
        "Official music video for Aquarium Floors by Colorado Springs rapper JayDubb Tha Ruler.",
      thumbnailUrl: [
        "https://jaydubbtharuler.com/images/jay-dubb/live-wide.jpg",
        "https://i.ytimg.com/vi/i5QQmQqv6og/hqdefault.jpg",
      ],
      uploadDate: "2024-01-01T00:00:00+00:00",
      embedUrl: "https://www.youtube-nocookie.com/embed/i5QQmQqv6og",
      contentUrl: "https://www.youtube.com/watch?v=i5QQmQqv6og",
      author: {
        "@id": "https://jaydubbtharuler.com/#artist",
      },
    },
  ],
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default async function Home() {
  const shows = await getAllPublishedShows();
  return (
    <>
      <ScrollAnimator />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="JayDubb Tha Ruler home">
          <Image
            src="/images/brand/main-white-logo.webp"
            alt="JayDubb Tha Ruler official logo"
            width={420}
            height={172}
            priority
            unoptimized
          />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#music">Music</a>
          <a href="#video">Video</a>
          <a href="#shows">Shows</a>
          <a href="#story">Story</a>
          <a href="#press">Press</a>
          <a href="#the-7">The 7</a>
          <a href="#vip">VIP</a>
        </nav>
        <a
          className="header-cta"
          href="#contact"
          data-fan-event="booking_inquiry"
        >
          Book JayDubb <Arrow />
        </a>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-image">
            <Image
              src="/images/jay-dubb/blue-hands.jpg"
              alt="JayDubb Tha Ruler adjusts a blue The 7 cap in a studio portrait"
              fill
              priority
              unoptimized
              sizes="(max-width: 900px) 100vw, 68vw"
            />
          </div>
          <div className="hero-scrim" />
          <div className="hero-copy">
            <p className="eyebrow">
              Colorado Springs · Independent Hip-Hop · The 7
            </p>
            <h1 id="hero-title">
              <span>JayDubb</span>
              <span>Tha Ruler</span>
            </h1>
            <p className="hero-deck">
              Colorado-rooted. Catalog-built.
              <br />
              Never off brand.
            </p>
            <div className="hero-actions" aria-label="Primary actions">
              <a
                className="button button-primary"
                href="https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_latest"
                data-platform="apple_music"
              >
                Listen Now <Arrow />
              </a>
              <a
                className="button button-ghost"
                href="#video"
                data-fan-event="scroll_to_video"
              >
                Watch Video
              </a>
              <a
                className="button button-ghost"
                href="https://www.the7even.co/"
                target="_blank"
                rel="noreferrer"
                data-fan-event="shop_merch"
                data-platform="the7"
              >
                Shop The 7 <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">
            <span>JTR / 026</span>
            <span>Colorado → Worldwide</span>
          </div>
          <p className="hero-side" aria-hidden="true">
            Disciplined · Versatile · Self-directed
          </p>
        </section>

        <aside className="release-strip" aria-label="Latest release banner">
          <span>Now streaming</span>
          <strong>Shake It Bae</strong>
          <span>feat. LLzMusik · 2026</span>
          <div className="release-strip-links">
            <Link
              href="/releases/shake-it-bae"
              className="release-strip-btn"
              data-fan-event="view_release_page"
            >
              Release Details <Arrow />
            </Link>
            <a
              href="https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143"
              target="_blank"
              rel="noreferrer"
              data-fan-event="stream_latest"
              data-platform="apple_music"
            >
              Play Record <Arrow />
            </a>
          </div>
        </aside>

        <section className="manifesto section-paper" aria-labelledby="manifesto-title">
          <div className="section-marker">
            <span>01</span>
            <span>Position</span>
          </div>
          <div className="manifesto-grid">
            <h2 id="manifesto-title">
              Not local.
              <br />
              <span>Rooted.</span>
            </h2>
            <div className="manifesto-copy">
              <p>
                JayDubb Tha Ruler is a Colorado rap artist building an enduring catalog
                around sharp writing, versatile delivery, and a brand-first
                independent standard.
              </p>
              <p>
                Studio albums, anthemic singles, international performance stages, and defining
                collaborations with WESTSIDE BOOGIE, Skeme, Caskey, T-Rell, City Hollow, LLzMusik,
                and AM.Wav. This is momentum built on substance.
              </p>
              <a className="text-link" href="#story">
                Read the story <Arrow />
              </a>
            </div>
            <figure className="manifesto-photo">
              <Image
                src="/images/jay-dubb/blue-profile.jpg"
                alt="JayDubb Tha Ruler profile portrait in blue cap and jacket"
                fill
                unoptimized
                sizes="(max-width: 700px) 88vw, 31vw"
              />
            </figure>
          </div>
        </section>

        <section className="music-index section-dark" id="music" aria-labelledby="music-title">
          <div className="section-heading">
            <div className="section-marker">
              <span>02</span>
              <span>Catalog</span>
            </div>
            <div>
              <p className="eyebrow">Selected discography · 2018—2026</p>
              <h2 id="music-title">Built in public.</h2>
            </div>
            <a
              className="text-link"
              href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897"
              target="_blank"
              rel="noreferrer"
              data-fan-event="stream_full_catalog"
              data-platform="apple_music"
            >
              Full catalog <Arrow />
            </a>
          </div>
          <ol className="release-list">
            {releases.map((release, index) => (
              <li key={release.title}>
                {release.hasPage ? (
                  <Link
                    href={release.slug!}
                    data-fan-event="release_item_click"
                    data-release={release.title}
                  >
                    <span className="release-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="release-year">{release.year}</span>
                    <span className="release-title">{release.title}</span>
                    <span className="release-detail">{release.detail}</span>
                    <Arrow />
                  </Link>
                ) : (
                  <a
                    href={release.href}
                    target="_blank"
                    rel="noreferrer"
                    data-fan-event="release_stream_click"
                    data-release={release.title}
                  >
                    <span className="release-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="release-year">{release.year}</span>
                    <span className="release-title">{release.title}</span>
                    <span className="release-detail">{release.detail}</span>
                    <Arrow />
                  </a>
                )}
              </li>
            ))}
          </ol>
          <div className="platform-row">
            <p>Choose your streaming platform</p>
            <div>
              <a
                href="https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="spotify"
              >
                Spotify <Arrow />
              </a>
              <a
                href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="apple_music"
              >
                Apple Music <Arrow />
              </a>
              <a
                href="https://www.youtube.com/@jaydubbtharuler"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="youtube"
              >
                YouTube <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="video-section" id="video" aria-labelledby="video-title">
          <div className="section-heading section-heading-light">
            <div className="section-marker">
              <span>03</span>
              <span>Motion</span>
            </div>
            <div>
              <p className="eyebrow">Official visual</p>
              <h2 id="video-title">Aquarium Floors</h2>
            </div>
            <div className="video-heading-links">
              <Link
                className="text-link"
                href="/releases/aquarium-floors"
                data-fan-event="view_video_details"
              >
                Video Notes <Arrow />
              </Link>
              <a
                className="text-link"
                href="https://www.youtube.com/@jaydubbtharuler/videos"
                target="_blank"
                rel="noreferrer"
                data-fan-event="youtube_channel_visit"
              >
                All videos <Arrow />
              </a>
            </div>
          </div>
          <div className="video-frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/i5QQmQqv6og"
              title="JayDubb Tha Ruler - Aquarium Floors official video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="video-notes">
            <span>Official video</span>
            <span>JayDubb Tha Ruler</span>
            <span>Watch in full screen</span>
          </div>
        </section>

        {/* Dynamic Database-Backed Shows Section */}
        <ShowsSection shows={shows} />

        <section className="live-section section-dark" id="live" aria-labelledby="live-title">
          <div className="section-heading">
            <div className="section-marker">
              <span>05</span>
              <span>Live</span>
            </div>
            <div>
              <p className="eyebrow">Colorado · Florida · Germany</p>
              <h2 id="live-title">The room moves.</h2>
            </div>
            <a
              className="text-link"
              href="mailto:booking@jaydubbtharuler.com?subject=Live%20Show%20Booking%20-%20JayDubb%20Tha%20Ruler"
              data-fan-event="booking_inquiry"
            >
              Book a show <Arrow />
            </a>
          </div>
          <div className="live-collage">
            <figure className="live-image live-image-wide">
              <Image
                src="/images/jay-dubb/live-wide.jpg"
                alt="JayDubb Tha Ruler performs beneath blue stage lights and smoke"
                fill
                unoptimized
                sizes="(max-width: 700px) 100vw, 62vw"
              />
            </figure>
            <figure className="live-image live-image-close">
              <Image
                src="/images/jay-dubb/live-close.jpg"
                alt="JayDubb Tha Ruler performs with a microphone under blue lights"
                fill
                unoptimized
                sizes="(max-width: 700px) 100vw, 38vw"
              />
            </figure>
            <figure className="live-image live-image-back">
              <Image
                src="/images/jay-dubb/live-back.jpg"
                alt="JayDubb Tha Ruler faces the crowd from the stage"
                fill
                unoptimized
                sizes="(max-width: 700px) 100vw, 38vw"
              />
            </figure>
            <div className="live-stat">
              <span>Opened for</span>
              <p>
                Kid Ink · Kirko Bangz · Paul Wall · Baby Bash · Caskey · Fetty
                Wap · YBN Nahmir · YFN Lucci · Trev Rich · T-Rell
              </p>
            </div>
          </div>
        </section>

        <section className="story-section" id="story" aria-labelledby="story-title">
          <div className="story-logo" aria-hidden="true">
            <Image
              src="/images/brand/main-white-logo.webp"
              alt=""
              width={1080}
              height={440}
              unoptimized
            />
          </div>
          <div className="section-marker">
            <span>06</span>
            <span>Origin</span>
          </div>
          <div className="story-grid">
            <h2 id="story-title">
              Poetry became
              <br />
              a way through.
            </h2>
            <div className="story-copy">
              <p>
                Born Justin Wallace and raised in Colorado Springs, JayDubb Tha
                Ruler found his way into hip-hop through poetry at thirteen, drawn
                first to the rhythmic precision of Edgar Allan Poe and Langston Hughes
                (famously reworking &quot;Harlem&quot; into his original piece &quot;What Happens to a Love Concealed&quot;).
              </p>
              <p>
                After losing a close friend during his senior year of high school, music
                transformed from an idle hobby into a vital outlet to cope with grief, focus intent,
                and build a legacy that outlasts the moment.
              </p>
              <p>
                His first true milestone, <em>The Year of the 7</em>, dropped in
                2018. Since then, he has built a deep independent catalog spanning studio albums,
                EPs, and international tour stages across Colorado, Florida, and Germany.
              </p>
            </div>
          </div>
          <blockquote>
            <p>Independent rap, built with intention.</p>
          </blockquote>
        </section>

        <section className="press-section section-paper" id="press" aria-labelledby="press-title">
          <div className="section-heading section-heading-light">
            <div className="section-marker">
              <span>07</span>
              <span>Coverage</span>
            </div>
            <div>
              <p className="eyebrow">Selected press</p>
              <h2 id="press-title">On record.</h2>
            </div>
          </div>
          <ul className="press-list">
            {press.map((item) => (
              <li key={item.source}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-fan-event="press_click"
                  data-source={item.source}
                >
                  <span>{item.source}</span>
                  <strong>{item.title}</strong>
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="seven-section" id="the-7" aria-labelledby="seven-title">
          <div className="seven-image">
            <Image
              src="/images/jay-dubb/blue-jacket.jpg"
              alt="JayDubb Tha Ruler wearing a blue jacket and The 7 shirt"
              fill
              unoptimized
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="seven-copy">
            <div className="section-marker">
              <span>08</span>
              <span>The brand</span>
            </div>
            <p className="eyebrow">Artist-owned culture</p>
            <h2 id="seven-title">The 7.</h2>
            <p>
              The music and the merchandise move together. Shop the official
              artist-led apparel and streetwear at The 7.
            </p>
            <a
              className="button button-primary"
              href="https://www.the7even.co/"
              target="_blank"
              rel="noreferrer"
              data-fan-event="shop_merch"
              data-platform="the7"
            >
              Shop The 7 <Arrow />
            </a>
          </div>
        </section>

        <section className="vip-fan-section section-dark" id="vip" aria-labelledby="vip-title">
          <div className="vip-container">
            <div className="section-marker">
              <span>09</span>
              <span>Inner Circle</span>
            </div>
            <div className="vip-grid">
              <div>
                <p className="eyebrow">Fan Acquisition & VIP Access</p>
                <h2 id="vip-title">Join The 7 VIP Fan Club.</h2>
                <p className="vip-description">
                  Direct line to JayDubb Tha Ruler. Get early tour ticket links, unreleased track snippets, private merch discount codes, and live stream notifications.
                </p>
              </div>
              <VipForm />
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-image">
            <Image
              src="/images/jay-dubb/stage-mic.jpg"
              alt="JayDubb Tha Ruler holding a microphone under blue stage lights"
              fill
              unoptimized
              sizes="(max-width: 800px) 100vw, 42vw"
            />
          </div>
          <div className="contact-copy">
            <div className="section-marker">
              <span>10</span>
              <span>Booking</span>
            </div>
            <p className="eyebrow" style={{ marginTop: "1rem" }}>Booking · Press · Brand Partnerships</p>
            <h2 id="contact-title">
              Bring the
              <br />
              room to life.
            </h2>
            <a
              className="contact-email"
              href="mailto:booking@jaydubbtharuler.com?subject=Booking%20Inquiry%20-%20JayDubb%20Tha%20Ruler"
              data-fan-event="booking_inquiry"
            >
              booking@jaydubbtharuler.com <Arrow />
            </a>
            <BookingForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-logo">
          <Image
            src="/images/brand/main-white-logo.webp"
            alt="JayDubb Tha Ruler"
            width={980}
            height={400}
            unoptimized
          />
        </div>
        <div className="footer-grid">
          <p className="footer-origin">Colorado Springs, CO</p>
          <nav aria-label="Social links" className="footer-nav">
            {socials.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                data-fan-event="social_profile_click"
                data-platform={label.toLowerCase()}
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="footer-brand-tag">The 7 · Independent</p>
        </div>
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} JayDubb Tha Ruler</p>
          <p className="footer-designer">
            Website Designed &amp; Developed by{" "}
            <a
              href="https://gerquiaabner.com"
              target="_blank"
              rel="noreferrer"
            >
              Ger&apos;Quia Abner <Arrow />
            </a>
          </p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataGraph),
        }}
      />
    </>
  );
}
