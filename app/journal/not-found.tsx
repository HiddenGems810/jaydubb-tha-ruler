import Link from "next/link";

export default function JournalNotFound() {
  return <section className="journal-empty"><span>404 / Off the record</span><h1>This page left the archive.</h1><p>The entry may be private, scheduled, or no longer available.</p><Link href="/journal">Return to the Journal</Link></section>;
}
