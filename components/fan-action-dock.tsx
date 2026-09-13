"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const actions = [
  {
    label: "LISTEN",
    href: "https://music.apple.com/us/album/shake-it-bae-feat-llzmusik-single/1877512143",
    event: "dock_listen",
    external: true,
  },
  { label: "TICKETS", href: "/#shows", event: "dock_tickets", external: false },
  {
    label: "THE 7",
    href: "https://www.the7even.co/",
    event: "dock_merch",
    external: true,
  },
  { label: "BOOK", href: "/#contact", event: "dock_booking", external: false },
] as const;

export function FanActionDock() {
  const pathname = usePathname();
  const [heroVisible, setHeroVisible] = useState(true);
  const [blockedRegions, setBlockedRegions] = useState(0);
  const restrictedRoute = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  const visible = !restrictedRoute && !heroVisible && blockedRegions === 0;

  useEffect(() => {
    if (restrictedRoute) return;

    const hero = document.querySelector<HTMLElement>("#top");
    const missingHeroTimer = hero
      ? null
      : window.setTimeout(() => setHeroVisible(false), 0);

    const heroObserver = hero
      ? new IntersectionObserver(
          ([entry]) => setHeroVisible(entry.isIntersecting),
          { threshold: 0 },
        )
      : null;
    if (hero && heroObserver) heroObserver.observe(hero);

    const blockingElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".vip-fan-section, .contact-section, .epk-booking, footer",
      ),
    );
    const visibleBlocks = new Set<Element>();
    const blockingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleBlocks.add(entry.target);
          else visibleBlocks.delete(entry.target);
        });
        setBlockedRegions(visibleBlocks.size);
      },
      { threshold: 0.05 },
    );
    blockingElements.forEach((element) => blockingObserver.observe(element));

    return () => {
      if (missingHeroTimer) window.clearTimeout(missingHeroTimer);
      heroObserver?.disconnect();
      blockingObserver.disconnect();
    };
  }, [pathname, restrictedRoute]);

  if (restrictedRoute) return null;

  return (
    <nav
      className={`fan-action-dock${visible ? " fan-action-dock-visible" : ""}`}
      aria-label="Quick fan actions"
      aria-hidden={!visible}
    >
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noreferrer" : undefined}
          tabIndex={visible ? 0 : -1}
          data-fan-event={action.event}
        >
          {action.label}
        </a>
      ))}
    </nav>
  );
}
