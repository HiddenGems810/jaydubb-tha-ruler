import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "jaydubbtharuler.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: "JayDubb Tha Ruler | Official Website, Music, Videos, Shows & Merch",
    description:
      "Official website for JayDubb Tha Ruler. Stream new music, watch official videos, find live updates, shop The 7 merch, and book appearances.",
    openGraph: {
      type: "website",
      title: "JayDubb Tha Ruler | Official Site",
      description: "New music, official videos, live updates, merch, and booking.",
      url: base,
      siteName: "JayDubb Tha Ruler",
      images: [
        {
          url: socialImage,
          width: 1732,
          height: 909,
          alt: "JayDubb Tha Ruler — Colorado-rooted, catalog-built",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "JayDubb Tha Ruler | Official Site",
      description: "New music, official videos, live updates, merch, and booking.",
      images: [socialImage],
    },
    icons: {
      icon: "/images/jay-dubb/profile-moody.jpg",
      shortcut: "/images/jay-dubb/profile-moody.jpg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
