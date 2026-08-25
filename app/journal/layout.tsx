import type { Metadata } from "next";
import { JournalShell } from "@/components/journal/journal-shell";
import "./journal.css";

export const metadata: Metadata = {
  title: "Journal",
  description: "Studio notes, road photos, release stories, and the work behind the work from JayDubb Tha Ruler.",
  alternates: { canonical: "https://jaydubbtharuler.com/journal", types: { "application/rss+xml": "https://jaydubbtharuler.com/journal/rss.xml" } },
  openGraph: { title: "Journal | JayDubb Tha Ruler", description: "Notes from the studio, the road, and everything between records.", url: "https://jaydubbtharuler.com/journal", type: "website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <JournalShell>{children}</JournalShell>;
}
