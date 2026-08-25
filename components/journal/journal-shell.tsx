import Image from "next/image";
import Link from "next/link";

export function JournalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="journal-site">
      <a className="journal-skip" href="#journal-main">Skip to Journal</a>
      <header className="journal-header">
        <Link href="/" className="journal-brand" aria-label="JayDubb Tha Ruler home">
          <Image src="/images/brand/main-white-logo.webp" alt="JayDubb Tha Ruler" width={210} height={86} priority unoptimized />
        </Link>
        <nav aria-label="Journal navigation">
          <Link href="/">Home</Link>
          <Link href="/journal" aria-current="page">Journal</Link>
          <Link href="/#music">Music</Link>
          <Link href="/#shows">Shows</Link>
          <Link href="/#contact">Booking</Link>
        </nav>
      </header>
      <main id="journal-main">{children}</main>
      <footer className="journal-footer">
        <p>JayDubb Tha Ruler — Colorado to worldwide.</p>
        <div><Link href="/journal">Archive</Link><Link href="/journal/rss.xml">RSS</Link><Link href="/">Main site</Link></div>
      </footer>
    </div>
  );
}
