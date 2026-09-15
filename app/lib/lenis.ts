import type Lenis from "lenis";

/**
 * Module-level handle on the Lenis instance.
 *
 * Overlays that take over the viewport (the lightbox) have to stop smooth
 * scrolling while they are open, or Lenis keeps driving the page behind the
 * backdrop — its own rAF loop does not care that the body has overflow:hidden.
 * SmoothScroll registers the instance here; consumers just call lockScroll().
 */
let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function lockScroll() {
  instance?.stop();
}

export function unlockScroll() {
  instance?.start();
}
