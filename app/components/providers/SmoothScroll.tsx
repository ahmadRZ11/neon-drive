"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { registerLenis } from "../../lib/lenis";

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so there is exactly one
 * rAF loop on the page and ScrollTrigger stays in lockstep with it.
 *
 * Skipped entirely under reduce-motion: hijacking the scroll is precisely
 * what that setting is asking us not to do.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  /**
   * Resize guard. Zoom emits a burst of resize events, and every one of them
   * forces the compositor to re-rasterise the full-screen backdrop layers,
   * the backdrop-filters and the grain. While the burst is in flight we mark
   * the document and let CSS switch that work off, then do one refresh when
   * it settles.
   *
   * Runs for everyone, including reduce-motion users — it is purely about
   * not thrashing during resize.
   */
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;

    const onResize = () => {
      root.classList.add("is-resizing");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        root.classList.remove("is-resizing");
        ScrollTrigger.refresh();
      }, 220);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      root.classList.remove("is-resizing");
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Leave touch scrolling native: momentum there is the OS's job.
      syncTouch: false,
    });

    registerLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // lagSmoothing would make Lenis skip during long frames.
    gsap.ticker.lagSmoothing(0);

    // In-page anchors must go through Lenis, or the browser's own jump
    // fights the smooth scroller.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.2 });
      // Keep the URL and the keyboard focus target honest.
      history.replaceState(null, "", `#${id}`);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onClick);

    // The browser's own hash jump happens before Lenis exists, and Lenis
    // then resets to its own origin — so a shared /#work link would land on
    // the hero. Re-apply it once Lenis is in charge.
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        requestAnimationFrame(() =>
          lenis.scrollTo(target, { offset: -72, immediate: true })
        );
      }
    }

    // Recompute trigger positions once fonts and images have settled, so a
    // page opened directly at #work still reveals that section.
    const refresh = () => ScrollTrigger.refresh();
    const raf1 = requestAnimationFrame(() => requestAnimationFrame(refresh));
    window.addEventListener("load", refresh);
    if ("fonts" in document) void document.fonts.ready.then(refresh).catch(() => {});

    return () => {
      cancelAnimationFrame(raf1);
      window.removeEventListener("load", refresh);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
