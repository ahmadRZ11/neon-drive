"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

/**
 * The one place GSAP plugins are registered. Always import gsap from here so
 * every consumer shares the same registered instance.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

/**
 * The page creates roughly sixty triggers. limitCallbacks collapses their
 * enter/leave callbacks to one per animation frame rather than one per scroll
 * event, and ignoreMobileResize stops the URL-bar show/hide on phones from
 * forcing a full recalculation mid-scroll.
 */
// Browser only: setting autoRefreshEvents makes ScrollTrigger bind listeners,
// and this module is evaluated on the server during prerender, where there is
// no document to bind to.
if (typeof window !== "undefined") {
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
    // "resize" is deliberately absent. Zoom fires a burst of resize events
    // and each auto-refresh recalculates every trigger on the page;
    // SmoothScroll runs a single debounced refresh once the burst settles.
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

/** Matches --ease-cine in globals.css. */
export const CINE = "power4.out";
export const POWER = "power2.inOut";

/**
 * Read once, synchronously, for imperative code paths (GSAP setup, the R3F
 * gate). React components should use useReducedMotion() from ./hooks instead
 * so they re-render if the OS setting changes mid-session.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP };
