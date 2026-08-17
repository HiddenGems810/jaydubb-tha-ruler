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

    // 3. Magnetic Hover for Buttons on Pointer Devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const magneticElements = document.querySelectorAll<HTMLElement>(
      ".button, .contact-email, .header-cta"
    );
    const cleanups: Array<() => void> = [];

    if (!isTouch && window.innerWidth > 980) {
      magneticElements.forEach((el) => {
        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          el.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
        };

        const onMouseLeave = () => {
          el.style.transform = "translate3d(0, 0, 0)";
        };

        el.addEventListener("mousemove", onMouseMove);
        el.addEventListener("mouseleave", onMouseLeave);

        cleanups.push(() => {
          el.removeEventListener("mousemove", onMouseMove);
          el.removeEventListener("mouseleave", onMouseLeave);
        });
      });
    }

    // 4. Parallax zoom-out for .story-logo
    const storyLogo = document.querySelector<HTMLElement>(".story-logo");
    const storySection = storyLogo?.closest<HTMLElement>("section");
    let rafId: number | null = null;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (storyLogo && storySection && !prefersReducedMotion) {
      const SCALE_START = 1.35;
      const SCALE_END = 1.0;
      const ROTATION = -5; // preserve the existing rotation

      const onScroll = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          const rect = storySection.getBoundingClientRect();
          const viewH = window.innerHeight;

          // Progress: 0 when section top enters viewport bottom, 1 when section bottom exits viewport top
          const totalTravel = rect.height + viewH;
          const traveled = viewH - rect.top;
          const progress = Math.max(0, Math.min(1, traveled / totalTravel));

          const scale = SCALE_START + (SCALE_END - SCALE_START) * progress;
          storyLogo.style.transform = `rotate(${ROTATION}deg) scale(${scale})`;
        });
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll(); // set initial state

      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      });
    }

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
