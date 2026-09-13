import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { EpkViewTracker } from "@/components/epk-view-tracker";

export const metadata: Metadata = {
  title: "JayDubb Tha Ruler EPK | Press Kit, Music, Photos & Booking",
  description:
    "Official JayDubb Tha Ruler electronic press kit with artist bio, music, video, press photography, coverage, credentials, and booking contact.",
  alternates: { canonical: "/epk" },
  openGraph: {
    type: "profile",
    url: "/epk",
    title: "JayDubb Tha Ruler EPK",
    description:
      "Official artist bio, music, video, press photography, credentials, and booking contact.",
    images: [
      {
        url: "/og.png",
        width: 1732,
        height: 909,
        alt: "JayDubb Tha Ruler official electronic press kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JayDubb Tha Ruler EPK",
    description: "Official press kit, music, photos, credentials, and booking contact.",
    images: ["/og.png"],
  },
};

const shortBio = `JayDubb Tha Ruler is an independent hip-hop artist from Colorado Springs, Colorado. He entered writing through poetry at thirteen, then turned music into a focused creative outlet and long-term body of work. Since releasing The Year of the 7 in 2018, JayDubb has built a catalog of albums, EPs, and singles, collaborated with artists including WESTSIDE BOOGIE, Skeme, Caskey, T-Rell, City Hollow, LLzMusik, and AM.Wav, and performed across Colorado, Florida, and Germany. His music and artist-owned brand, The 7, share one independent vision.`;

const extendedBio = `Born Justin Wallace and raised in Colorado Springs, JayDubb Tha Ruler found his first creative language in poetry at thirteen. The rhythmic precision of writers including Edgar Allan Poe and Langston Hughes helped shape the way he heard cadence, structure, and the weight of a line. After losing a close friend during his senior year of high school, music became more than an idle pursuit. It became a way to process grief, focus intent, and build something that could outlast the moment.

JayDubb released The Year of the 7 in 2018, an early milestone that established the independent foundation he has continued to develop. His catalog now spans studio albums, EPs, and singles, moving between direct street narrative, introspection, and records made to move a room. Collaborations with WESTSIDE BOOGIE, Skeme, Caskey, T-Rell, City Hollow, LLzMusik, and AM.Wav reflect that range without separating it from his Colorado roots.

Onstage, JayDubb has performed across Colorado, Florida, and Germany. He has opened for Kid Ink, Kirko Bangz, Paul Wall, Baby Bash, Trev Rich, Caskey, Fetty Wap, T-Rell, YBN Nahmir, and YFN Lucci. Each appearance sits within a larger independent practice: recording, releasing, performing, and building a direct relationship with listeners.

The same approach extends to The 7, JayDubb's artist-owned brand. Music and merchandise are treated as parts of one culture rather than disconnected products. With Shake It Bae featuring LLzMusik leading the current release cycle, JayDubb Tha Ruler continues to expand a catalog built with intention while carrying Colorado Springs into every new room.`;

const press = [
  {
    outlet: "Westword",
    title: "JayDubb Tha Ruler teams up with Westside Boogie",
    href: "https://www.westword.com/music/denver-rap-jaydubb-tharuler-westside-boogie-13972187/",
  },
  {
    outlet: "303 Magazine",
    title: "Consistency, versatility and the making of Off Brand",
    href: "https://303magazine.com/2022/05/jaydubbtharuler-review/",
  },
  {
    outlet: "VoyageDenver",
    title: "Meet JayDubb Tha Ruler of KSTG ENT",
    href: "https://voyagedenver.com/interview/meet-jaydubb-tharuler-kstg-ent-colorado-springs/",
  },
];

const photos = [
  {
    src: "/images/jay-dubb/blue-hands.jpg",
    label: "Studio portrait / blue hands",
    downloadName: "jaydubb-blue-hands.jpg",
    alt: "JayDubb Tha Ruler adjusts a blue The 7 cap in a studio portrait",
  },
  {
    src: "/images/jay-dubb/blue-profile.jpg",
    label: "Studio portrait / profile",
    downloadName: "jaydubb-blue-profile.jpg",
    alt: "Profile portrait of JayDubb Tha Ruler in blue light",
  },
  {
    src: "/images/jay-dubb/blue-jacket.jpg",
    label: "Studio portrait / The 7",
    downloadName: "jaydubb-blue-jacket.jpg",
    alt: "JayDubb Tha Ruler wearing a blue jacket and The 7 shirt",
  },
  {
    src: "/images/jay-dubb/live-wide.jpg",
    label: "Live performance / wide",
    downloadName: "jaydubb-live-wide.jpg",
    alt: "JayDubb Tha Ruler performing onstage under concert lighting",
  },
  {
    src: "/images/jay-dubb/live-close.jpg",
    label: "Live performance / close",
    downloadName: "jaydubb-live-close.jpg",
    alt: "Close view of JayDubb Tha Ruler performing live",
  },
  {
    src: "/images/jay-dubb/live-back.jpg",
    label: "Live performance / stage",
    downloadName: "jaydubb-live-back.jpg",
    alt: "JayDubb Tha Ruler seen from behind while performing for a crowd",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://jaydubbtharuler.com/epk#webpage",
  url: "https://jaydubbtharuler.com/epk",
  name: "JayDubb Tha Ruler Electronic Press Kit",
  about: { "@id": "https://jaydubbtharuler.com/#artist" },
  mainEntity: { "@id": "https://jaydubbtharuler.com/#artist" },
  isPartOf: { "@id": "https://jaydubbtharuler.com/#website" },
};

function NorthEastArrow() {
  return <span aria-hidden="true">{"\u2197"}</span>;
}

export default function EpkPage() {
  return (
    <>
      <EpkViewTracker />
      <a className="skip-link" href="#epk-main">
        Skip to press kit
      </a>

      <header className="epk-header">
        <Link href="/" className="epk-brand" aria-label="JayDubb Tha Ruler home">
          <Image
            src="/images/brand/main-white-logo.webp"
            alt="JayDubb Tha Ruler"
            width={420}
            height={172}
            priority
            unoptimized
          />
        </Link>
        <nav aria-label="Press kit navigation">
          <a href="#bio">Bio</a>
          <a href="#music">Music</a>
          <a href="#press-photos">Photos</a>
        </nav>
        <Link className="epk-header-action" href="/#contact" data-fan-event="epk_booking_click">
          Book JayDubb <NorthEastArrow />
        </Link>
      </header>

      <main id="epk-main" className="epk-page">
        <section className="epk-hero" id="top" aria-labelledby="epk-title">
          <div className="epk-hero-image">
            <Image
              src="/images/jay-dubb/blue-profile.jpg"
              alt="JayDubb Tha Ruler in a blue-lit studio portrait"
              fill
              priority
              unoptimized
              sizes="(max-width: 760px) 100vw, 54vw"
            />
          </div>
          <div className="epk-hero-copy">
            <p className="epk-document-line">Electronic Press Kit / Colorado Springs &rarr; Worldwide</p>
            <h1 id="epk-title">JayDubb<br />Tha Ruler</h1>
            <div className="epk-hero-actions" aria-label="Press kit actions">
              <div className="epk-primary-actions">
                <Link className="button button-primary" href="/#contact" data-fan-event="epk_booking_click">
                  Book JayDubb <NorthEastArrow />
                </Link>
                <a
                  className="button button-ghost"
                  href="https://music.apple.com/us/artist/jaydubbtharuler/1439373897"
                  target="_blank"
                  rel="noreferrer"
                  data-fan-event="epk_stream_click"
                  data-platform="apple_music"
                >
                  Stream Music <NorthEastArrow />
                </a>
              </div>
              <div className="epk-utility-actions">
                <a className="epk-inline-action" href="#press-photos">
                  Download press photos &darr;
                </a>
                <span className="epk-action-divider" aria-hidden="true">/</span>
                <CopyButton
                  value="https://jaydubbtharuler.com"
                  label="Copy artist URL"
                  eventName="epk_artist_url_copy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="epk-snapshot" aria-label="Artist snapshot">
          <dl>
            <div><dt>Based</dt><dd>Colorado Springs, CO</dd></div>
            <div><dt>Genre</dt><dd>Hip-Hop / Rap</dd></div>
            <div><dt>Active</dt><dd>Independent</dd></div>
            <div><dt>Brand</dt><dd>The 7</dd></div>
            <div><dt>Booking</dt><dd><a href="mailto:booking@jaydubbtharuler.com">booking@jaydubbtharuler.com</a></dd></div>
          </dl>
        </section>

        <section className="epk-bio" id="bio" aria-labelledby="bio-title">
          <div className="epk-section-heading">
            <h2 id="bio-title">Artist Bio</h2>
            <span>Approved copy / 2026</span>
          </div>
          <article className="epk-bio-block">
            <div className="epk-bio-label">
              <h3>Short Bio</h3>
              <CopyButton value={shortBio} label="Copy Bio" eventName="epk_short_bio_copy" />
            </div>
            <p>{shortBio}</p>
          </article>
          <article className="epk-bio-block epk-bio-extended">
            <div className="epk-bio-label">
              <h3>Extended Bio</h3>
              <CopyButton value={extendedBio} label="Copy Bio" eventName="epk_extended_bio_copy" />
            </div>
            <div className="epk-long-copy">
              {extendedBio.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        </section>

        <section className="epk-credentials" aria-labelledby="credentials-title">
          <div className="epk-section-heading">
            <h2 id="credentials-title">Key Credentials</h2>
            <span>Verified project history</span>
          </div>
          <div className="epk-credentials-grid">
            <article>
              <h3>Select Collaborations</h3>
              <p>WESTSIDE BOOGIE / Skeme / Caskey / T-Rell / City Hollow / LLzMusik / AM.Wav</p>
            </article>
            <article>
              <h3>Opened For</h3>
              <p>Kid Ink / Kirko Bangz / Paul Wall / Baby Bash / Trev Rich / Caskey / Fetty Wap / T-Rell / YBN Nahmir / YFN Lucci</p>
            </article>
            <article>
              <h3>Performance Reach</h3>
              <p>Colorado / Florida / Germany</p>
            </article>
          </div>
        </section>

        <section className="epk-music" id="music" aria-labelledby="music-title">
          <div className="epk-section-heading">
            <h2 id="music-title">Music</h2>
            <span>Current and selected releases</span>
          </div>
          <div className="epk-current-release">
            <div>
              <p>Current release / 2026</p>
              <h3>Shake It Bae</h3>
              <span>feat. LLzMusik</span>
            </div>
            <nav aria-label="Shake It Bae links">
              <a href="https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143" target="_blank" rel="noreferrer" data-fan-event="epk_music_click" data-platform="apple_music">Apple Music <NorthEastArrow /></a>
              <a href="https://open.spotify.com/artist/7IlXxo9gPXLZz2oWpTwS4l" target="_blank" rel="noreferrer" data-fan-event="epk_music_click" data-platform="spotify">Spotify <NorthEastArrow /></a>
              <a href="https://www.youtube.com/@jaydubbtharuler" target="_blank" rel="noreferrer" data-fan-event="epk_music_click" data-platform="youtube">YouTube <NorthEastArrow /></a>
              <Link href="/releases/shake-it-bae" data-fan-event="epk_release_detail">Release Details &rarr;</Link>
            </nav>
          </div>
          <ol className="epk-release-list">
            <li><span>2025</span><Link href="/releases/dont-forget-the-bag">Don&apos;t Forget the Bag</Link><em>Studio Album</em></li>
            <li><span>2024</span><a href="https://music.apple.com/in/album/did-it-my-way-feat-skeme-single/1768614095" target="_blank" rel="noreferrer">Did It My Way feat. Skeme</a><em>Single</em></li>
            <li><span>2023</span><a href="https://music.apple.com/ng/album/get-back-to-it-ep/1694204547" target="_blank" rel="noreferrer">Get Back to It</a><em>EP</em></li>
            <li><span>2022</span><Link href="/releases/off-brand">Off Brand feat. WESTSIDE BOOGIE</Link><em>Single</em></li>
          </ol>
        </section>

        <section className="epk-video" aria-labelledby="video-title">
          <div className="epk-section-heading">
            <h2 id="video-title">Official Video</h2>
            <a href="https://www.youtube.com/watch?v=i5QQmQqv6og" target="_blank" rel="noreferrer">Watch on YouTube <NorthEastArrow /></a>
          </div>
          <div className="epk-video-frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/i5QQmQqv6og"
              title="JayDubb Tha Ruler - Aquarium Floors official music video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="epk-video-caption"><strong>Aquarium Floors</strong> / JayDubb Tha Ruler / Official Music Video</p>
        </section>

        <section className="epk-press" aria-labelledby="press-title">
          <div className="epk-section-heading">
            <h2 id="press-title">Press Coverage</h2>
            <span>Selected editorial citations</span>
          </div>
          <ul>
            {press.map((item) => (
              <li key={item.outlet}>
                <a href={item.href} target="_blank" rel="noreferrer" data-fan-event="epk_press_click" data-platform={item.outlet}>
                  <span>{item.outlet}</span><strong>{item.title}</strong><NorthEastArrow />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="epk-photos" id="press-photos" aria-labelledby="photos-title">
          <div className="epk-section-heading">
            <h2 id="photos-title">Press Photos</h2>
            <span>Approved source photography / JPG</span>
          </div>
          <div className="epk-photo-grid">
            {photos.map((photo) => (
              <figure key={photo.src}>
                <div className="epk-photo-preview">
                  <Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" />
                </div>
                <figcaption>
                  <span>{photo.label}</span>
                  <a href={photo.src} download={photo.downloadName} data-fan-event="epk_photo_download">Download JPG &darr;</a>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="epk-brand-asset">
            <div>
              <span>Official Logo</span>
              <Image src="/images/brand/main-white-logo.webp" alt="JayDubb Tha Ruler official logo" width={420} height={172} unoptimized />
            </div>
            <a href="/images/brand/main-white-logo.png" download="jaydubb-tha-ruler-official-logo.png" data-fan-event="epk_logo_download">Download Logo &darr;</a>
          </div>
        </section>

        <section className="epk-booking" aria-labelledby="booking-title">
          <p>Booking / Press / Brand Partnerships</p>
          <h2 id="booking-title">Bring JayDubb<br />to the room.</h2>
          <a className="epk-booking-email" href="mailto:booking@jaydubbtharuler.com?subject=JayDubb%20Tha%20Ruler%20Inquiry" data-fan-event="epk_email_click">booking@jaydubbtharuler.com <NorthEastArrow /></a>
          <Link className="button button-primary" href="/#contact" data-fan-event="epk_booking_click">Book JayDubb <NorthEastArrow /></Link>
        </section>
      </main>

      <footer className="epk-footer">
        <Link href="/">Official Site</Link>
        <span>JayDubb Tha Ruler / The 7 / Colorado Springs</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
