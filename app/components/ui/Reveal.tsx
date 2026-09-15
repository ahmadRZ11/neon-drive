"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, CINE, prefersReducedMotion } from "../../lib/gsap";
import { useNearViewport } from "../../lib/hooks";

/**
 * GSAP scroll reveal. Any descendant carrying `.will-reveal` animates in on a
 * stagger when the container reaches the viewport.
 *
 * The hidden start state is a CSS utility, not an inline GSAP `set()`, so
 * nothing flashes between first paint and hydration — and the reduce-motion
 * media query un-hides it for users who never receive the animation.
 */
export default function Reveal({
  children,
  className,
  stagger = 0.09,
  y = 34,
  start = "top 84%",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  start?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(root);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      const targets = gsap.utils.toArray<HTMLElement>(".will-reveal", root.current);
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: CINE,
          stagger,
          scrollTrigger: { trigger: root.current, start, once: true },
        }
      );
    },
    { scope: root, dependencies: [ready, stagger, y, start] }
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/**
 * Wipes a heading in line by line behind a clip-path. Reads more cinematic
 * than a fade for large display type.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(root);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      gsap.fromTo(
        root.current,
        { clipPath: "inset(0 0 100% 0)", y: 24 },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 1.2,
          delay,
          ease: CINE,
          scrollTrigger: { trigger: root.current, start: "top 86%", once: true },
        }
      );
    },
    { scope: root, dependencies: [ready, delay] }
  );

  return (
    <div ref={root} className={`will-reveal-clip ${className ?? ""}`}>
      {children}
    </div>
  );
}
