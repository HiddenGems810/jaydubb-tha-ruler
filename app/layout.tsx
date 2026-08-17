import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jaydubbtharuler.com"),
  title: {
    default: "JayDubb Tha Ruler | Official Artist Website · Music, Videos & Shows",
    template: "%s | JayDubb Tha Ruler",
  },
  description:
    "Official website for JayDubb Tha Ruler, Colorado Springs independent hip-hop artist. Stream new music, watch Aquarium Floors, view live tour dates, shop The 7, and book appearances.",
  keywords: [
    "JayDubb Tha Ruler",
    "JayDubb",
    "JayDubbThaRuler",
    "Justin Wallace",
    "Aquarium Floors",
    "Shake It Bae",
    "Off Brand Westside Boogie",
    "Don't Forget the Bag",
    "Colorado Springs rap",
    "Colorado hip-hop artist",
    "The 7 merch",
    "independent hip-hop",
  ],
  authors: [{ name: "JayDubb Tha Ruler", url: "https://jaydubbtharuler.com" }],
  creator: "JayDubb Tha Ruler",
  publisher: "The 7 / KSTG ENT",
  alternates: {
    canonical: "https://jaydubbtharuler.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "profile",
    title: "JayDubb Tha Ruler | Official Artist Hub",
    description:
      "Colorado-rooted. Catalog-built. Never off brand. Official music, videos, live performance dates, and booking.",
    url: "https://jaydubbtharuler.com",
    siteName: "JayDubb Tha Ruler",
    locale: "en_US",
    images: [
      {
        url: "https://jaydubbtharuler.com/og.png",
        width: 1732,
        height: 909,
        alt: "JayDubb Tha Ruler — Official Artist Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JayDubb Tha Ruler | Official Site",
    description: "New music, official videos, live updates, merch, and booking.",
    creator: "@JayDubbThaRuler",
    site: "@JayDubbThaRuler",
    images: ["https://jaydubbtharuler.com/og.png"],
  },
  icons: {
    icon: "/images/jay-dubb/profile-moody.jpg",
    shortcut: "/images/jay-dubb/profile-moody.jpg",
    apple: "/images/brand/main-white-logo.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://open.spotify.com" />
        <link rel="preconnect" href="https://music.apple.com" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.addEventListener('click', function(e) {
                  var target = e.target.closest('[data-fan-event]');
                  if (!target) return;
                  var eventName = target.getAttribute('data-fan-event');
                  var platform = target.getAttribute('data-platform') || '';
                  var details = {
                    event: eventName,
                    platform: platform,
                    href: target.getAttribute('href') || '',
                    timestamp: new Date().toISOString()
                  };
                  if (window.dataLayer) {
                    window.dataLayer.push(details);
                  }
                  if (typeof window.gtag === 'function') {
                    window.gtag('event', eventName, { platform: platform });
                  }
                }, true);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
