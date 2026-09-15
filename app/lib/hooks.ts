"use client";

import { useEffect, useState } from "react";

/** SSR-safe matchMedia subscription. */
export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True for pointer-coarse devices. Drives the custom cursor and the WebGL
 * gate — a phone gets neither.
 */
export function useIsTouch() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * Gate for anything expensive (WebGL, magnetic buttons, heavy parallax).
 *
 * Deliberately sticky. Browser zoom changes the CSS viewport width, so a live
 * `min-width: 1024px` check flips as you zoom — which unmounted the R3F
 * <Canvas> and destroyed its WebGL context, then rebuilt it on the way back.
 * Repeated context creation is what made zooming freeze the page.
 *
 * So: this can turn on (a genuinely resized window should get the scene) but
 * never off. The one exception is reduce-motion, which is a deliberate user
 * action and must take effect immediately.
 */
export function useCanRunHeavyEffects() {
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    if (capable) return;

    const check = () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (finePointer && window.innerWidth >= 1024) setCapable(true);
    };

    check();

    // Debounced, because zoom emits a burst of resize events.
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(check, 250);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [capable]);

  return capable && !reduced;
}

/**
 * Scroll spy for the nav. Uses one IntersectionObserver over all sections
 * rather than a scroll listener doing getBoundingClientRect per frame.
 */
export function useSectionSpy(ids: readonly string[], initial = ids[0]) {
  const [active, setActive] = useState<string>(initial ?? "");

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (!nodes.length) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { threshold: [0.15, 0.35, 0.6], rootMargin: "-20% 0px -35% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/**
 * True once the element is within `rootMargin` of the viewport, then stays
 * true.
 *
 * Every section used to build its GSAP timelines during hydration, which put
 * the scroll setup for the whole page into a single ~700ms task. Gating on
 * this spreads that work out as the reader scrolls, and the margin is wide
 * enough that the animation is always ready before the section is seen.
 */
export function useNearViewport<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "900px"
) {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}

/** Locks body scroll while the mobile menu is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
