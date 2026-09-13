import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./shop.css";

export const metadata: Metadata = {
  title: "Official Merch | JayDubb Tha Ruler",
  description: "Official JayDubb Tha Ruler merchandise and launch access.",
  robots: { index: false, follow: false },
};

export default function ShopPage() {
  return (
    <main className="shop-page">
      <a className="skip-link" href="#shop-content">Skip to shop content</a>
      <header className="shop-header">
        <Link href="/" className="shop-wordmark" aria-label="Return to JayDubb Tha Ruler home">JAYDUBB THA RULER</Link>
        <nav aria-label="Shop navigation" className="shop-nav"><Link href="/">Main site</Link><Link href="/#vip">VIP</Link></nav>
      </header>
      <section id="shop-content" className="shop-hero" aria-labelledby="shop-title">
        <div className="shop-hero-copy">
          <p className="shop-kicker">Official JayDubb Tha Ruler merchandise</p>
          <h1 id="shop-title">Wear the <span>7.</span></h1>
          <p className="shop-lede">The first collection is being built around the music, the live show, and the people who have been here from the start.</p>
          <Link className="shop-action" href="/#vip">Join the launch list</Link>
        </div>
        <div className="shop-hero-image" aria-hidden="true">
          <Image src="/images/jay-dubb/city-shirt.jpg" alt="" fill priority sizes="(max-width: 800px) 100vw, 48vw" />
          <div className="shop-image-mark">THE 7</div>
        </div>
      </section>
      <section className="shop-manifesto" aria-labelledby="manifesto-title">
        <p className="shop-kicker">The approach</p>
        <h2 id="manifesto-title">Merch that belongs in the rotation.</h2>
        <p>Every piece starts with the brand, then earns its place through fit, finish, and fulfillment. The collection opens once those details are right.</p>
      </section>
      <section className="shop-launch" aria-labelledby="launch-title">
        <div><p className="shop-kicker">First release</p><h2 id="launch-title">Get the drop before it disappears.</h2></div>
        <div className="shop-launch-detail"><p>VIP members hear first when products, sizing, and checkout go live.</p><Link className="shop-text-link" href="/#vip">Join the VIP list</Link></div>
      </section>
      <footer className="shop-footer"><span>THE 7 / KSTG ENT</span><Link href="/">Back to JayDubbThaRuler.com</Link></footer>
    </main>
  );
}
