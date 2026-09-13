"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function EpkViewTracker() {
  useEffect(() => {
    const details = { event: "epk_view", path: window.location.pathname };
    window.dataLayer?.push(details);
    window.gtag?.("event", "epk_view", { path: window.location.pathname });
  }, []);

  return null;
}
