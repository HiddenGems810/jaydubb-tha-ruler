"use client";

import { useEffect } from "react";

export function ScrollAnimator() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const selector = [
      ".section-marker",
      ".section-heading",
      ".section-heading > div",
      ".manifesto h2",
      ".manifesto-copy",
      ".manifesto-photo",
      ".release-list li",
      ".platform-row",
      ".video-frame",
      ".video-notes",
      ".shows-list .show-card",
      ".shows-empty-state",
      ".live-collage .live-image",
      ".live-stat",
      ".story-grid h2",
      ".story-copy",
      ".story-section blockquote",
      ".story-logo",
      ".press-list li",
      ".seven-image",
      ".seven-copy",
      ".seven-copy h2",
      ".seven-copy p",
      ".vip-container",
      ".vip-grid > div",
      ".vip-form",
      ".contact-image",
      ".contact-copy",
      ".contact-copy h2",
      ".contact-email",
      ".booking-form",
      ".footer-logo",
      ".footer-grid",
      ".footer-bottom-bar",
    ].join(", ");

    const elements = document.querySelectorAll(selector);

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "50px 0px -30px 0px",
        threshold: 0.04,
      }
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
        el.classList.add("in-view");
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
