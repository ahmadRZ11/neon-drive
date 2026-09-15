"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { useNearViewport } from "../../lib/hooks";

const SEGMENTS = 20;

/**
 * A segmented readout instead of a progress bar — it reads as instrumentation
 * rather than a download, which is the whole difference between this looking
 * art-directed and looking like a CV template.
 */
export default function SegmentMeter({
  label,
  value,
  tone = "magenta",
}: {
  label: string;
  value: number;
  tone?: "magenta" | "cyan";
}) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(root);
  const filled = Math.round((value / 100) * SEGMENTS);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-seg='on']",
        { opacity: 0, scaleY: 0.3 },
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.45,
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 90%", once: true },
        }
      );
    },
    { scope: root, dependencies: [ready, value] }
  );

  const onColor = tone === "cyan" ? "bg-cyan" : "bg-magenta";

  return (
    <div ref={root}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="hud text-hud text-bone">{label}</span>
        <span className="hud text-hud text-dim tabular-nums">{value}</span>
      </div>

      <div
        className="mt-2.5 flex gap-1"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const on = i < filled;
          return (
            <span
              key={i}
              data-seg={on ? "on" : "off"}
              className={`h-4 flex-1 origin-bottom ${on ? onColor : "bg-bone/10"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
