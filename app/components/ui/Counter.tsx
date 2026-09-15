"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { useNearViewport } from "../../lib/hooks";

/**
 * Counts up when it scrolls into view.
 *
 * The final value is rendered on the server, so the correct number is in the
 * HTML for search engines and for anyone the animation never reaches — GSAP
 * only takes over once the trigger actually fires.
 */
export default function Counter({
  value,
  decimals = 0,
  suffix = "",
  className = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const ready = useNearViewport(ref);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      const node = ref.current;
      if (!node) return;

      const state = { value: 0 };

      gsap.to(state, {
        value,
        duration: 1.7,
        ease: "power2.out",
        onUpdate: () => {
          node.textContent = state.value.toFixed(decimals) + suffix;
        },
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          once: true,
          // Only blank the rendered value at the moment the count begins.
          onEnter: () => {
            node.textContent = (0).toFixed(decimals) + suffix;
          },
        },
      });
    },
    { dependencies: [ready, value, decimals, suffix] }
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
