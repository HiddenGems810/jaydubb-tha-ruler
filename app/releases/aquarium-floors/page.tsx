import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aquarium Floors (Official Video & Single) | JayDubb Tha Ruler",
  description:
    "Watch the official music video and stream 'Aquarium Floors' by Colorado Springs hip-hop artist JayDubb Tha Ruler. Directed visual, credits, and streaming links.",
  alternates: {
    canonical: "https://jaydubbtharuler.com/releases/aquarium-floors",
  },
  openGraph: {
    type: "video.other",
    title: "JayDubb Tha Ruler — Aquarium Floors (Official Music Video)",
    description:
      "Stream and watch 'Aquarium Floors' by JayDubb Tha Ruler. Official video, track details, and streaming platforms.",
    url: "https://jaydubbtharuler.com/releases/aquarium-floors",
    siteName: "JayDubb Tha Ruler",
    images: [
      {
        url: "https://jaydubbtharuler.com/images/jay-dubb/live-wide.jpg",
        width: 1200,
        height: 675,
        alt: "JayDubb Tha Ruler - Aquarium Floors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JayDubb Tha Ruler — Aquarium Floors (Official Video)",
    description: "Watch the official video for Aquarium Floors by JayDubb Tha Ruler.",
    images: ["https://jaydubbtharuler.com/images/jay-dubb/live-wide.jpg"],
  },
};

const releaseSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicRecording",
      "@id": "https://jaydubbtharuler.com/releases/aquarium-floors#recording",
      name: "Aquarium Floors",
      url: "https://jaydubbtharuler.com/releases/aquarium-floors",
      byArtist: {
        "@type": "MusicGroup",
        name: "JayDubb Tha Ruler",
        url: "https://jaydubbtharuler.com",
      },
      genre: "Hip-Hop/Rap",
      inLanguage: "en-US",
    },
    {
      "@type": "VideoObject",
      "@id": "https://jaydubbtharuler.com/releases/aquarium-floors#video",
      name: "JayDubb Tha Ruler - Aquarium Floors (Official Music Video)",
      description:
        "Official music video for 'Aquarium Floors' by Colorado rap artist JayDubb Tha Ruler.",
      thumbnailUrl: [
        "https://jaydubbtharuler.com/images/jay-dubb/live-wide.jpg",
        "https://i.ytimg.com/vi/i5QQmQqv6og/hqdefault.jpg",
      ],
      uploadDate: "2024-01-01T00:00:00+00:00",
      embedUrl: "https://www.youtube-nocookie.com/embed/i5QQmQqv6og",
      contentUrl: "https://www.youtube.com/watch?v=i5QQmQqv6og",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://jaydubbtharuler.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Releases",
          item: "https://jaydubbtharuler.com/#music",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Aquarium Floors",
          item: "https://jaydubbtharuler.com/releases/aquarium-floors",
        },
      ],
    },
  ],
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function AquariumFloorsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <Link className="brand" href="/" aria-label="JayDubb Tha Ruler home">
          <Image
            src="/images/brand/main-white-logo.webp"
            alt="JayDubb Tha Ruler"
            width={420}
            height={172}
            priority
            unoptimized
          />
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#music">Music</Link>
          <Link href="/#video">Video</Link>
          <Link href="/#story">Story</Link>
          <Link href="/#live">Live</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <a className="header-cta" href="mailto:booking@jaydubbtharuler.com">
          Book JayDubb <Arrow />
        </a>
      </header>

      <main id="main" className="release-page">
        <section className="release-hero section-dark" aria-labelledby="release-title">
          <div className="release-hero-content">
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/#music">Catalog</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Aquarium Floors</span>
            </nav>
            <p className="eyebrow">Official Visual & Single · Hip-Hop/Rap</p>
            <h1 id="release-title">Aquarium Floors</h1>
            <p className="hero-deck">
              Visual clarity, atmospheric production, and disciplined lyricism. The definitive music video experience from JayDubb Tha Ruler.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="https://www.youtube.com/watch?v=i5QQmQqv6og"
                target="_blank"
                rel="noreferrer"
                data-fan-event="video_watch"
                data-platform="youtube"
              >
                Watch on YouTube <Arrow />
              </a>
              <a
                className="button button-ghost"
                href="https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="spotify"
              >
                Spotify <Arrow />
              </a>
              <a
                className="button button-ghost"
                href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="apple_music"
              >
                Apple Music <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="video-section" aria-labelledby="visual-heading">
          <div className="section-heading section-heading-light">
            <div>
              <p className="eyebrow">Full Screen Visual</p>
              <h2 id="visual-heading">Stream the Official Music Video</h2>
            </div>
          </div>
          <div className="video-frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/i5QQmQqv6og"
              title="JayDubb Tha Ruler - Aquarium Floors official video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <section className="manifesto section-paper" aria-labelledby="details-heading">
          <div className="section-marker">
            <span>01</span>
            <span>Context</span>
          </div>
          <div className="manifesto-grid">
            <h2 id="details-heading">
              A landmark visual
              <br />
              <span>in the catalog.</span>
            </h2>
            <div className="manifesto-copy">
              <p>
                <strong>Aquarium Floors</strong> represents JayDubb Tha Ruler’s sonic trademark: moody, layered soundscapes paired with intricate rhyme schemes and personal introspection.
              </p>
              <p>
                Rooted in Colorado Springs and forged through years of independent grit, the track underscores his poetic foundation and deliberate craftsmanship.
              </p>
              <div className="release-meta-table">
                <div>
                  <span>Artist</span>
                  <strong>JayDubb Tha Ruler</strong>
                </div>
                <div>
                  <span>Format</span>
                  <strong>Official Music Video / Single</strong>
                </div>
                <div>
                  <span>Hometown</span>
                  <strong>Colorado Springs, CO</strong>
                </div>
                <div>
                  <span>Brand</span>
                  <strong>The 7 / KSTG ENT</strong>
                </div>
              </div>
            </div>
            <figure className="manifesto-photo">
              <Image
                src="/images/jay-dubb/live-close.jpg"
                alt="JayDubb Tha Ruler performing under stage lighting"
                fill
                unoptimized
                sizes="(max-width: 700px) 88vw, 31vw"
              />
            </figure>
          </div>
        </section>

        <section className="more-releases section-dark" aria-labelledby="more-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalog Navigation</p>
              <h2 id="more-heading">Explore Key Releases</h2>
            </div>
            <Link className="text-link" href="/#music">
              View All <Arrow />
            </Link>
          </div>
          <div className="releases-grid">
            <Link href="/releases/shake-it-bae" className="release-card">
              <span className="release-tag">2026 Single</span>
              <h3>Shake It Bae</h3>
              <p>feat. LLzMusik · High energy club & street anthem</p>
              <span className="card-link">Stream Track <Arrow /></span>
            </Link>
            <Link href="/releases/dont-forget-the-bag" className="release-card">
              <span className="release-tag">2025 Album</span>
              <h3>Don&apos;t Forget the Bag</h3>
              <p>Full length independent studio project</p>
              <span className="card-link">Listen Album <Arrow /></span>
            </Link>
            <Link href="/releases/off-brand" className="release-card">
              <span className="release-tag">2022 Single</span>
              <h3>Off Brand</h3>
              <p>feat. WESTSIDE BOOGIE · Critically acclaimed collaboration</p>
              <span className="card-link">Explore Release <Arrow /></span>
            </Link>
          </div>
        </section>

        <section className="contact-section" id="booking" aria-labelledby="booking-heading">
          <div className="contact-copy">
            <p className="eyebrow">Inquiries · Shows · Press</p>
            <h2 id="booking-heading">Book JayDubb Tha Ruler</h2>
            <p>For festival bookings, venue dates, media coverage, and feature inquiries.</p>
            <a
              className="contact-email"
              href="mailto:booking@jaydubbtharuler.com?subject=Booking%20Inquiry%20-%20JayDubb%20Tha%20Ruler"
              data-fan-event="booking_inquiry"
            >
              booking@jaydubbtharuler.com <Arrow />
            </a>
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
            <a href="https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l" target="_blank" rel="noreferrer">Spotify</a>
            <a href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897" target="_blank" rel="noreferrer">Apple Music</a>
            <a href="https://www.youtube.com/@jaydubbtharuler" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.instagram.com/jaydubbtharuler/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://x.com/JayDubbThaRuler" target="_blank" rel="noreferrer">X</a>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(releaseSchema) }}
      />
    </>
  );
}
