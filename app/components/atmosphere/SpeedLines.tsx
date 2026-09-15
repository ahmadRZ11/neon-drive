"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";

/**
 * Velocity streaks. The faster the page moves, the more of them you see; stop
 * scrolling and they are gone within a beat.
 *
 * Driven entirely by Motion values, which means the whole thing lives outside
 * React's render loop — scrolling never re-renders a component, it just writes
 * `transform` and `opacity` onto eleven promoted divs on the compositor.
 * Nothing here reads layout, so nothing here can cause a reflow.
 */

/** Scroll speed, in px/s, at which the streaks reach full strength. */
const FULL_TILT = 2400;

type Line = {
  /** Horizontal position, in viewport width. */
  x: number;
  /** Vertical centre, in viewport height. */
  y: number;
  /** Resting length, in viewport height. */
  len: number;
  /** Opacity at full tilt. Varied so they do not read as a comb. */
  peak: number;
  /** How far this one slides against the scroll, in px. */
  drift: number;
  tint: "magenta" | "cyan" | "bone";
  /** Dropped on small screens, where there is less room either side. */
  wide?: boolean;
};

/*
  Deliberately clustered toward the edges. The mask below already protects the
  reading column, but keeping the streaks out there too means the mask never has
  to do much work and the text is never competing with a moving object.
*/
const LINES: Line[] = [
  { x: 3, y: 26, len: 16, peak: 0.5, drift: 70, tint: "magenta" },
  { x: 7, y: 62, len: 24, peak: 0.34, drift: 96, tint: "cyan" },
  { x: 12, y: 14, len: 12, peak: 0.42, drift: 58, tint: "bone", wide: true },
  { x: 17, y: 78, len: 19, peak: 0.28, drift: 84, tint: "magenta", wide: true },
  { x: 24, y: 40, len: 14, peak: 0.22, drift: 66, tint: "cyan", wide: true },
  { x: 76, y: 32, len: 21, peak: 0.3, drift: 90, tint: "magenta", wide: true },
  { x: 82, y: 70, len: 13, peak: 0.24, drift: 62, tint: "bone", wide: true },
  { x: 88, y: 20, len: 18, peak: 0.44, drift: 78, tint: "cyan" },
  { x: 93, y: 55, len: 26, peak: 0.36, drift: 102, tint: "magenta" },
  { x: 97, y: 86, len: 15, peak: 0.3, drift: 54, tint: "cyan" },
];

const TINTS: Record<Line["tint"], string> = {
  magenta: "rgb(255 45 149)",
  cyan: "rgb(34 224 255)",
  bone: "rgb(244 236 230)",
};

/* Leaves the middle of the screen alone so body copy is never read through a
   moving streak. */
const MASK =
  "linear-gradient(90deg, #000 0%, #000 24%, transparent 40%, transparent 60%, #000 76%, #000 100%)";

export default function SpeedLines() {
  const reduced = useReducedMotion();

  /**
   * Mounted after hydration, deliberately. Two things made the server's markup
   * and the client's first render disagree otherwise: Motion writes the
   * streaks' transform inline, and by the time React hydrates the scroll may
   * already have moved — and `useReducedMotion` resolves on the client, so a
   * reduce-motion visitor got ten spans from the server and none from the
   * client. Both are hydration mismatches, and both cost the whole root a
   * re-render. Nothing here belongs in the initial HTML anyway: at rest these
   * are invisible.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  /* Raw velocity is spiky — a wheel notch reads as a few thousand px/s for one
     frame. The spring turns it into something with weight, which is also what
     gives the streaks their fade-out when you stop. */
  const smooth = useSpring(velocity, {
    stiffness: 280,
    damping: 44,
    mass: 0.3,
    restDelta: 2,
  });

  /* 0 at rest, 1 at full tilt, direction-agnostic. */
  const intensity = useTransform(smooth, (v) =>
    Math.min(Math.abs(v) / FULL_TILT, 1)
  );
  /* -1..1, so the streaks slide against the scroll rather than with it. */
  const drift = useTransform(smooth, (v) =>
    Math.max(-1, Math.min(1, -v / FULL_TILT))
  );

  // Hooks above the bail-out: the rules of hooks do not care that we are about
  // to render nothing, and this component never remounts.
  if (reduced || !mounted) return null;

  return (
    <div
      aria-hidden
      className="speed-lines pointer-events-none fixed inset-0 z-20 overflow-hidden"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      {LINES.map((line) => (
        <Streak
          key={`${line.x}-${line.y}`}
          line={line}
          intensity={intensity}
          drift={drift}
        />
      ))}
    </div>
  );
}

function Streak({
  line,
  intensity,
  drift,
}: {
  line: Line;
  intensity: MotionValue<number>;
  drift: MotionValue<number>;
}) {
  // Short and faint at a crawl, full length and full strength at speed.
  const opacity = useTransform(intensity, [0, 1], [0, line.peak]);
  const scaleY = useTransform(intensity, [0, 1], [0.2, 1]);
  const y = useTransform(drift, (d) => d * line.drift);

  const tint = TINTS[line.tint];

  return (
    <motion.span
      style={{
        opacity,
        scaleY,
        y,
        left: `${line.x}vw`,
        // Centred on `y` by arithmetic rather than a translate utility, so
        // Motion owns the transform outright and nothing can fight over it.
        top: `${line.y - line.len / 2}vh`,
        height: `${line.len}vh`,
        background: `linear-gradient(180deg, transparent, ${tint}, transparent)`,
        willChange: "transform, opacity",
      }}
      className={`absolute w-px ${line.wide ? "hidden sm:block" : ""}`}
    />
  );
}
