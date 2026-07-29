import Image from "next/image";

const releases = [
  {
    year: "2026",
    title: "Shake It Bae",
    detail: "Single · feat. LLzMusik",
    href: "https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143",
  },
  {
    year: "2025",
    title: "Don't Forget the Bag",
    detail: "Album",
    href: "https://music.apple.com/us/album/dont-forget-the-bag/1820728789",
  },
  {
    year: "2025",
    title: "Plain Jane",
    detail: "Single",
    href: "https://music.apple.com/us/album/plain-jane-single/1824313063",
  },
  {
    year: "2025",
    title: "Wyd",
    detail: "Single",
    href: "https://music.apple.com/us/album/wyd-single/1794084583",
  },
  {
    year: "2024",
    title: "Did It My Way",
    detail: "Single · feat. Skeme",
    href: "https://music.apple.com/in/album/did-it-my-way-feat-skeme-single/1768614095",
  },
  {
    year: "2023",
    title: "Get Back to It",
    detail: "EP",
    href: "https://music.apple.com/ng/album/get-back-to-it-ep/1694204547",
  },
  {
    year: "2022",
    title: "Off Brand",
    detail: "Single · feat. Westside Boogie",
    href: "https://music.apple.com/za/album/off-brand-single-feat-westside-boogie-single/1617966879",
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

const artistSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "JayDubb Tha Ruler",
  alternateName: "JayDubbThaRuler",
  url: "https://jaydubbtharuler.com",
  image: "https://jaydubbtharuler.com/images/jay-dubb/blue-hands.jpg",
  genre: "Hip-Hop/Rap",
  foundingLocation: {
    "@type": "Place",
    name: "Colorado Springs, Colorado",
  },
  sameAs: socials.map(([, href]) => href),
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="JayDubb Tha Ruler home">
          <Image
            src="/images/brand/main-white-logo.webp"
            alt=""
            width={420}
            height={172}
            priority
            unoptimized
          />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#music">Music</a>
          <a href="#video">Video</a>
          <a href="#story">Story</a>
          <a href="#live">Live</a>
          <a href="#press">Press</a>
        </nav>
        <a className="header-cta" href="mailto:booking@jaydubbtharuler.com">
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
              Colorado Springs · Independent hip-hop · The 7
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
              >
                Listen now <Arrow />
              </a>
              <a className="button button-ghost" href="#video">
                Watch
              </a>
              <a
                className="button button-ghost"
                href="https://www.the7even.co/"
                target="_blank"
                rel="noreferrer"
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

        <aside className="release-strip" aria-label="Latest release">
          <span>Now streaming</span>
          <strong>Shake It Bae</strong>
          <span>feat. LLzMusik · 2026</span>
          <a
            href="https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143"
            target="_blank"
            rel="noreferrer"
          >
            Play the record <Arrow />
          </a>
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
                JayDubb Tha Ruler is a Colorado rap artist building a catalog
                around sharp writing, versatile delivery and a brand-first
                independent approach.
              </p>
              <p>
                Albums. EPs. Singles. International stages. Collaborations with
                Westside Boogie, Skeme, Caskey, T-Rell, City Hollow, LLzMusik
                and AM.Wav. This is motion with a point of view.
              </p>
              <a className="text-link" href="#story">
                Read the story <Arrow />
              </a>
            </div>
            <figure className="manifesto-photo">
              <Image
                src="/images/jay-dubb/blue-profile.jpg"
                alt="JayDubb Tha Ruler in a blue cap and jacket"
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
              <p className="eyebrow">Selected discography · 2022—2026</p>
              <h2 id="music-title">Built in public.</h2>
            </div>
            <a
              className="text-link"
              href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897"
              target="_blank"
              rel="noreferrer"
            >
              Full catalog <Arrow />
            </a>
          </div>
          <ol className="release-list">
            {releases.map((release, index) => (
              <li key={release.title}>
                <a href={release.href} target="_blank" rel="noreferrer">
                  <span className="release-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="release-year">{release.year}</span>
                  <span className="release-title">{release.title}</span>
                  <span className="release-detail">{release.detail}</span>
                  <Arrow />
                </a>
              </li>
            ))}
          </ol>
          <div className="platform-row">
            <p>Choose your platform</p>
            <div>
              <a
                href="https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l"
                target="_blank"
                rel="noreferrer"
              >
                Spotify <Arrow />
              </a>
              <a
                href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897"
                target="_blank"
                rel="noreferrer"
              >
                Apple Music <Arrow />
              </a>
              <a
                href="https://www.youtube.com/@jaydubbtharuler"
                target="_blank"
                rel="noreferrer"
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
            <a
              className="text-link"
              href="https://www.youtube.com/@jaydubbtharuler/videos"
              target="_blank"
              rel="noreferrer"
            >
              All videos <Arrow />
            </a>
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

        <section className="live-section section-dark" id="live" aria-labelledby="live-title">
          <div className="section-heading">
            <div className="section-marker">
              <span>04</span>
              <span>Live</span>
            </div>
            <div>
              <p className="eyebrow">Colorado · Florida · Germany</p>
              <h2 id="live-title">The room moves.</h2>
            </div>
            <a className="text-link" href="mailto:booking@jaydubbtharuler.com">
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
                Wap · YBN Nahmir · YFN Lucci
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
            <span>05</span>
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
                Ruler found his way into rap through poetry at thirteen, drawn
                first to Edgar Allan Poe and Langston Hughes.
              </p>
              <p>
                After losing a close friend during his senior year, music
                became more than a hobby. It became a way to cope, focus and
                build something that could outlast the moment.
              </p>
              <p>
                His first true project, <em>The Year of the 7</em>, arrived in
                2018. Since then he has built a deep independent catalog and
                carried it from Colorado to Florida and Germany.
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
              <span>06</span>
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
                <a href={item.href} target="_blank" rel="noreferrer">
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
              <span>07</span>
              <span>The brand</span>
            </div>
            <p className="eyebrow">Artist-owned culture</p>
            <h2 id="seven-title">The 7.</h2>
            <p>
              The music and the merchandise move together. Shop the artist-led
              brand at The 7.
            </p>
            <a
              className="button button-primary"
              href="https://www.the7even.co/"
              target="_blank"
              rel="noreferrer"
            >
              Shop The 7 <Arrow />
            </a>
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
            <p className="eyebrow">Booking · Press · Brand</p>
            <h2 id="contact-title">
              Bring the
              <br />
              room to life.
            </h2>
            <a
              className="contact-email"
              href="mailto:booking@jaydubbtharuler.com"
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
          <p>Colorado Springs, CO</p>
          <nav aria-label="Social links">
            {socials.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} JayDubb Tha Ruler</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
      />
    </>
  );
}
