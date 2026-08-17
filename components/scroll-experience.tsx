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

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
