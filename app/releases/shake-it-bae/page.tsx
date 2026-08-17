import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shake It Bae (feat. LLzMusik) | JayDubb Tha Ruler (2026 Single)",
  description:
    "Listen to 'Shake It Bae' by JayDubb Tha Ruler featuring LLzMusik. Official 2026 hip-hop single, streaming platforms, and background.",
  alternates: {
    canonical: "https://jaydubbtharuler.com/releases/shake-it-bae",
  },
  openGraph: {
    type: "music.song",
    title: "JayDubb Tha Ruler — Shake It Bae (feat. LLzMusik)",
    description: "Stream 'Shake It Bae' on Apple Music, Spotify, and YouTube.",
    url: "https://jaydubbtharuler.com/releases/shake-it-bae",
    siteName: "JayDubb Tha Ruler",
    images: [
      {
        url: "https://jaydubbtharuler.com/images/jay-dubb/blue-hands.jpg",
        width: 1200,
        height: 800,
        alt: "JayDubb Tha Ruler - Shake It Bae",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shake It Bae (feat. LLzMusik) — JayDubb Tha Ruler",
    description: "New 2026 single from Colorado rap artist JayDubb Tha Ruler.",
    images: ["https://jaydubbtharuler.com/images/jay-dubb/blue-hands.jpg"],
  },
};

const releaseSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicRecording",
      "@id": "https://jaydubbtharuler.com/releases/shake-it-bae#recording",
      name: "Shake It Bae",
      datePublished: "2026",
      byArtist: {
        "@type": "MusicGroup",
        name: "JayDubb Tha Ruler",
        url: "https://jaydubbtharuler.com",
      },
      contributor: {
        "@type": "Person",
        name: "LLzMusik",
      },
      genre: "Hip-Hop/Rap",
      url: "https://jaydubbtharuler.com/releases/shake-it-bae",
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
          name: "Catalog",
          item: "https://jaydubbtharuler.com/#music",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Shake It Bae",
          item: "https://jaydubbtharuler.com/releases/shake-it-bae",
        },
      ],
    },
  ],
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function ShakeItBaePage() {
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
              <span aria-current="page">Shake It Bae</span>
            </nav>
            <p className="eyebrow">Latest 2026 Release · Single · feat. LLzMusik</p>
            <h1 id="release-title">Shake It Bae</h1>
            <p className="hero-deck">
              High-octane bounce meets razor-sharp Colorado rap delivery. Stream the newest anthem from JayDubb Tha Ruler across all major DSPs.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="apple_music"
              >
                Apple Music <Arrow />
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
                href="https://www.youtube.com/@jaydubbtharuler"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="youtube"
              >
                YouTube Music <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="manifesto section-paper" aria-labelledby="about-heading">
          <div className="section-marker">
            <span>01</span>
            <span>Release Notes</span>
          </div>
          <div className="manifesto-grid">
            <h2 id="about-heading">
              New rhythm.
              <br />
              <span>Unshakable cadence.</span>
            </h2>
            <div className="manifesto-copy">
              <p>
                Teaming up with LLzMusik, <strong>Shake It Bae</strong> showcases JayDubb Tha Ruler&apos;s versatility—seamlessly transitioning between heavy street narrative and infectious club energy without diluting lyricism.
              </p>
              <p>
                Representing the ongoing evolution of the independent Colorado rap movement, the single kicks off his 2026 release schedule with unmistakable momentum.
              </p>
              <div className="release-meta-table">
                <div>
                  <span>Featured Artist</span>
                  <strong>LLzMusik</strong>
                </div>
                <div>
                  <span>Year</span>
                  <strong>2026</strong>
                </div>
                <div>
                  <span>Genre</span>
                  <strong>Hip-Hop / Rap</strong>
                </div>
                <div>
                  <span>Label / Brand</span>
                  <strong>The 7 / Independent</strong>
                </div>
              </div>
            </div>
            <figure className="manifesto-photo">
              <Image
                src="/images/jay-dubb/blue-hands.jpg"
                alt="JayDubb Tha Ruler studio portrait"
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
              Full Discography <Arrow />
            </Link>
          </div>
          <div className="releases-grid">
            <Link href="/releases/aquarium-floors" className="release-card">
              <span className="release-tag">Official Visual</span>
              <h3>Aquarium Floors</h3>
              <p>Atmospheric lyricism & full-screen music video</p>
              <span className="card-link">Watch & Stream <Arrow /></span>
            </Link>
            <Link href="/releases/dont-forget-the-bag" className="release-card">
              <span className="release-tag">2025 Album</span>
              <h3>Don&apos;t Forget the Bag</h3>
              <p>Full-length studio album</p>
              <span className="card-link">Listen Album <Arrow /></span>
            </Link>
            <Link href="/releases/off-brand" className="release-card">
              <span className="release-tag">2022 Single</span>
              <h3>Off Brand</h3>
              <p>feat. WESTSIDE BOOGIE</p>
              <span className="card-link">Explore Single <Arrow /></span>
            </Link>
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
