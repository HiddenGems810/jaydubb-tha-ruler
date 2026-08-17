"use client";

import { useEffect } from "react";

export function ScrollExperience() {
  useEffect(() => {
    // 1. Intersection Observer for Awwwards-grade Staggered Section Reveals
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.08,
    };

    const handleIntersect: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elementsToReveal = document.querySelectorAll(
      "section, .catalog-table tr, .press-list li, .live-image, .release-strip, .hero-copy, .section-heading, .footer-grid, .footer-logo"
    );

    elementsToReveal.forEach((el) => observer.observe(el));

    // 2. Magnetic Pull Interaction for Interactive CTA Buttons
    const magneticButtons = document.querySelectorAll<HTMLElement>(".button, .contact-email, .hero-side");
    const mouseMoveHandlers = new Map<HTMLElement, (e: MouseEvent) => void>();
    const mouseLeaveHandlers = new Map<HTMLElement, () => void>();

    magneticButtons.forEach((btn) => {
      const onMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
        btn.style.transition = "transform 150ms cubic-bezier(0.16, 1, 0.3, 1)";
      };

      const onMouseLeave = () => {
        btn.style.transform = "translate3d(0, 0, 0)";
        btn.style.transition = "transform 450ms cubic-bezier(0.16, 1, 0.3, 1)";
      };

      mouseMoveHandlers.set(btn, onMouseMove);
      mouseLeaveHandlers.set(btn, onMouseLeave);

      btn.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);
    });

    // 3. Smooth Parallax on Background Watermarks & Images
    let animationFrameId = 0;
    const storyLogo = document.querySelector<HTMLElement>("section#story .story-logo");
    const heroImage = document.querySelector<HTMLElement>(".hero-media img");

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        if (storyLogo) {
          const storyRect = storyLogo.getBoundingClientRect();
          if (storyRect.top < window.innerHeight && storyRect.bottom > 0) {
            const offset = (window.innerHeight - storyRect.top) * 0.08;
            storyLogo.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
          }
        }

        if (heroImage && scrollY < window.innerHeight) {
          heroImage.style.transform = `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.08}px)`;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      magneticButtons.forEach((btn) => {
        const moveHandler = mouseMoveHandlers.get(btn);
        const leaveHandler = mouseLeaveHandlers.get(btn);
        if (moveHandler) btn.removeEventListener("mousemove", moveHandler);
        if (leaveHandler) btn.removeEventListener("mouseleave", leaveHandler);
      });
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
}
