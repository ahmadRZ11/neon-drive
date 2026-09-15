"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { Diamond, type LucideIcon } from "lucide-react";
import { useNearViewport } from "../../lib/hooks";

/**
 * Seamless GSAP marquee. The track holds the item list twice and loops by
 * exactly -50%, so the seam is never visible. Scroll velocity feeds the
 * tween's timeScale, so the strip accelerates and reverses with the page —
 * the detail that stops it reading as a CSS ticker.
 */
export default function Marquee({
  items,
  className = "",
  duration = 28,
  separator: Separator = Diamond,
}: {
  items: readonly string[];
  className?: string;
  duration?: number;
  /** Glyph between items. */
  separator?: LucideIcon;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(root);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      if (!track.current) return;

      const loop = gsap.to(track.current, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });

      let direction = 1;
      const settle = gsap.delayedCall(0.55, () => {
        gsap.to(loop, { timeScale: direction, duration: 0.9, overwrite: true });
      });

      // A repeat:-1 tween keeps the ticker busy for the life of the page.
      // Park it whenever the strip is not on screen.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          direction = velocity < 0 ? -1 : 1;
          const boost = gsap.utils.clamp(1, 5, Math.abs(velocity) / 420 + 1);

          gsap.to(loop, {
            timeScale: direction * boost,
            duration: 0.3,
            overwrite: true,
          });
          settle.restart(true);
        },
      });
    },
    { scope: root, dependencies: [ready, duration] }
  );

  const doubled = [...items, ...items];

  return (
    <div ref={root} aria-hidden className={`edge-fade-x overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max items-center">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center">
            <span className="display px-6 text-[clamp(1.6rem,4vw,3.2rem)] text-bone/12">
              {item}
            </span>
            <Separator aria-hidden className="size-3 shrink-0 text-magenta/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
