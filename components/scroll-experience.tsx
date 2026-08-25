"use client";

import { useEffect } from "react";

export function ScrollExperience() {
  useEffect(() => {
    // 1. Tag elements with reveal data-attributes dynamically if not present
    const sections = document.querySelectorAll<HTMLElement>("section");
    sections.forEach((sec) => {
      if (!sec.hasAttribute("data-reveal")) {
        sec.setAttribute("data-reveal", "section");
      }
    });

    const images = document.querySelectorAll<HTMLElement>(
      ".manifesto-photo, .video-frame, .live-image, .seven-image, .contact-image"
    );
    images.forEach((img) => {
      img.setAttribute("data-reveal", "image");
    });

    const staggerLists = document.querySelectorAll<HTMLElement>(
      ".release-list, .press-list, .shows-list"
    );
    staggerLists.forEach((list) => {
      list.setAttribute("data-reveal", "stagger");
    });

    // 2. IntersectionObserver with single-shot trigger
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.05,
    };

    const handleIntersect: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          // Once revealed, unobserve so it remains 100% visible permanently
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elementsToReveal = document.querySelectorAll<HTMLElement>("[data-reveal]");
    elementsToReveal.forEach((el) => {
      // If already in viewport on load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("is-inview");
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
