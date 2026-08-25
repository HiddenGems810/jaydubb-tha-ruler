import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Don't Forget the Bag (Album) | JayDubb Tha Ruler",
  description:
    "Stream 'Don't Forget the Bag', the full-length 2025 hip-hop studio album by Colorado artist JayDubb Tha Ruler. Tracklist, credits, and streaming links.",
  alternates: {
    canonical: "https://jaydubbtharuler.com/releases/dont-forget-the-bag",
  },
  openGraph: {
    type: "music.album",
    title: "JayDubb Tha Ruler - Don't Forget the Bag (Full Album)",
    description: "Stream 'Don't Forget the Bag' on Apple Music, Spotify, and YouTube.",
    url: "https://jaydubbtharuler.com/releases/dont-forget-the-bag",
    siteName: "JayDubb Tha Ruler",
    images: [
      {
        url: "https://jaydubbtharuler.com/images/jay-dubb/city-shirt.jpg",
        width: 1200,
        height: 800,
        alt: "JayDubb Tha Ruler - Don't Forget the Bag",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Don't Forget the Bag (Album) - JayDubb Tha Ruler",
    description: "Full-length 2025 studio album by JayDubb Tha Ruler.",
    images: ["https://jaydubbtharuler.com/images/jay-dubb/city-shirt.jpg"],
  },
};

const releaseSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicAlbum",
      "@id": "https://jaydubbtharuler.com/releases/dont-forget-the-bag#album",
      name: "Don't Forget the Bag",
      datePublished: "2025",
      byArtist: {
        "@type": "MusicGroup",
        name: "JayDubb Tha Ruler",
        url: "https://jaydubbtharuler.com",
      },
      numTracks: 10,
      genre: "Hip-Hop/Rap",
      url: "https://jaydubbtharuler.com/releases/dont-forget-the-bag",
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
          name: "Don't Forget the Bag",
          item: "https://jaydubbtharuler.com/releases/dont-forget-the-bag",
        },
      ],
    },
  ],
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function DontForgetTheBagPage() {
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
              <span aria-current="page">Don&apos;t Forget the Bag</span>
            </nav>
            <p className="eyebrow">2025 Studio Album · Full Project</p>
            <h1 id="release-title">Don&apos;t Forget the Bag</h1>
            <p className="hero-deck">
              A comprehensive statement on independent longevity, financial discipline, and unmatched Colorado hip-hop craftsmanship.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="https://music.apple.com/us/album/dont-forget-the-bag/1820728789"
                target="_blank"
                rel="noreferrer"
                data-fan-event="stream_platform"
                data-platform="apple_music"
              >
                Stream on Apple Music <Arrow />
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

        <section className="manifesto section-paper" aria-labelledby="overview-heading">
          <div className="section-marker">
            <span>01</span>
            <span>Album Overview</span>
          </div>
          <div className="manifesto-grid">
            <h2 id="overview-heading">
              A masterclass in
              <br />
              <span>independent focus.</span>
            </h2>
            <div className="manifesto-copy">
              <p>
                Released in 2025, <strong>Don&apos;t Forget the Bag</strong> serves as JayDubb Tha Ruler&apos;s definitive album of the era, chronicling the grind, the business, and the standard required to maintain creative independence.
              </p>
              <p>
                From intricate storytelling to anthemic production, the record reinforces why he remains one of Colorado&apos;s most consistent independent forces.
              </p>
              <div className="release-meta-table">
                <div>
                  <span>Format</span>
                  <strong>Studio Album</strong>
                </div>
                <div>
                  <span>Release Year</span>
                  <strong>2025</strong>
                </div>
                <div>
                  <span>Origin</span>
                  <strong>Colorado Springs, CO</strong>
                </div>
                <div>
                  <span>Culture</span>
                  <strong>The 7</strong>
                </div>
              </div>
            </div>
            <figure className="manifesto-photo">
              <Image
                src="/images/jay-dubb/city-shirt.jpg"
                alt="JayDubb Tha Ruler portrait in front of cityscape"
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
              <p>feat. LLzMusik · New club and street anthem</p>
              <span className="card-link">Stream Track <Arrow /></span>
            </Link>
            <Link href="/releases/aquarium-floors" className="release-card">
              <span className="release-tag">Official Visual</span>
              <h3>Aquarium Floors</h3>
              <p>Landmark music video & atmospheric single</p>
              <span className="card-link">Watch & Stream <Arrow /></span>
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
