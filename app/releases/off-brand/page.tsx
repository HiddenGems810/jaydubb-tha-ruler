import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Off Brand (feat. WESTSIDE BOOGIE) | JayDubb Tha Ruler",
  description:
    "Listen to 'Off Brand' by JayDubb Tha Ruler featuring Compton rapper WESTSIDE BOOGIE. Critically acclaimed single reviewed by Westword and 303 Magazine.",
  alternates: {
    canonical: "https://jaydubbtharuler.com/releases/off-brand",
  },
  openGraph: {
    type: "music.song",
    title: "JayDubb Tha Ruler — Off Brand (feat. WESTSIDE BOOGIE)",
    description: "Stream 'Off Brand' on Apple Music, Spotify, and YouTube.",
    url: "https://jaydubbtharuler.com/releases/off-brand",
    siteName: "JayDubb Tha Ruler",
    images: [
      {
        url: "https://jaydubbtharuler.com/images/jay-dubb/profile-moody.jpg",
        width: 1200,
        height: 800,
        alt: "JayDubb Tha Ruler - Off Brand feat. WESTSIDE BOOGIE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Off Brand (feat. WESTSIDE BOOGIE) — JayDubb Tha Ruler",
    description: "Acclaimed collaboration between JayDubb Tha Ruler and WESTSIDE BOOGIE.",
    images: ["https://jaydubbtharuler.com/images/jay-dubb/profile-moody.jpg"],
  },
};

const releaseSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicRecording",
      "@id": "https://jaydubbtharuler.com/releases/off-brand#recording",
      name: "Off Brand",
      datePublished: "2022",
      byArtist: {
        "@type": "MusicGroup",
        name: "JayDubb Tha Ruler",
        url: "https://jaydubbtharuler.com",
      },
      contributor: {
        "@type": "Person",
        name: "WESTSIDE BOOGIE",
      },
      genre: "Hip-Hop/Rap",
      url: "https://jaydubbtharuler.com/releases/off-brand",
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
          name: "Off Brand",
          item: "https://jaydubbtharuler.com/releases/off-brand",
        },
      ],
    },
  ],
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function OffBrandPage() {
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
              <span aria-current="page">Off Brand</span>
            </nav>
            <p className="eyebrow">Collaboration Single · feat. WESTSIDE BOOGIE</p>
            <h1 id="release-title">Off Brand</h1>
            <p className="hero-deck">
              A pivotal union between Colorado Springs and Compton. Introspective lyricism celebrating self-worth, authenticity, and staying true to the craft.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="https://music.apple.com/za/album/off-brand-single-feat-westside-boogie-single/1617966879"
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

        <section className="manifesto section-paper" aria-labelledby="press-heading">
          <div className="section-marker">
            <span>01</span>
            <span>Critical Acclaim</span>
          </div>
          <div className="manifesto-grid">
            <h2 id="press-heading">
              Two coastlines.
              <br />
              <span>One unified standard.</span>
            </h2>
            <div className="manifesto-copy">
              <p>
                Covered extensively by publications like <strong>Westword</strong> and <strong>303 Magazine</strong>, <em>Off Brand</em> marked a defining crossover moment—pairing JayDubb Tha Ruler&apos;s composed flow with Shady Records signee WESTSIDE BOOGIE.
              </p>
              <p>
                The record urged listeners to celebrate self-worth, reject surface trends, and double down on pure substance.
              </p>
              <div className="release-meta-table">
                <div>
                  <span>Collaboration</span>
                  <strong>WESTSIDE BOOGIE</strong>
                </div>
                <div>
                  <span>Coverage</span>
                  <strong>Westword, 303 Magazine</strong>
                </div>
                <div>
                  <span>Hometown</span>
                  <strong>Colorado Springs, CO</strong>
                </div>
                <div>
                  <span>Movement</span>
                  <strong>Never Off Brand</strong>
                </div>
              </div>
            </div>
            <figure className="manifesto-photo">
              <Image
                src="/images/jay-dubb/profile-moody.jpg"
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
              View All <Arrow />
            </Link>
          </div>
          <div className="releases-grid">
            <Link href="/releases/shake-it-bae" className="release-card">
              <span className="release-tag">2026 Single</span>
              <h3>Shake It Bae</h3>
              <p>feat. LLzMusik</p>
              <span className="card-link">Stream Track <Arrow /></span>
            </Link>
            <Link href="/releases/aquarium-floors" className="release-card">
              <span className="release-tag">Official Visual</span>
              <h3>Aquarium Floors</h3>
              <p>Landmark music video & single</p>
              <span className="card-link">Watch & Stream <Arrow /></span>
            </Link>
            <Link href="/releases/dont-forget-the-bag" className="release-card">
              <span className="release-tag">2025 Album</span>
              <h3>Don&apos;t Forget the Bag</h3>
              <p>Full-length studio album</p>
              <span className="card-link">Listen Album <Arrow /></span>
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
          <p>Colorado Springs, CO</p>
          <nav aria-label="Social links">
            <a href="https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l" target="_blank" rel="noreferrer">Spotify</a>
            <a href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897" target="_blank" rel="noreferrer">Apple Music</a>
            <a href="https://www.youtube.com/@jaydubbtharuler" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.instagram.com/jaydubbtharuler/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://x.com/JayDubbThaRuler" target="_blank" rel="noreferrer">X</a>
          </nav>
          <p>© {new Date().getFullYear()} JayDubb Tha Ruler</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(releaseSchema) }}
      />
    </>
  );
}
