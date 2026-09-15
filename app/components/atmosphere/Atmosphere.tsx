"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { MEDIA } from "../../data/media";
import { buildStarField } from "../../lib/rand";
import { SkylineFar, SkylineNear } from "./Skyline";
import Palms from "./Palms";
import DrivingCar from "./DrivingCar";

/* Built once at module scope from a fixed seed — SSR-safe and free at runtime. */
const STARS = buildStarField(31415, 90);
const STARS_SPARSE = buildStarField(27182, 40, 44);

/**
 * The fixed backdrop the whole page sits on.
 *
 * Seven stacked layers, and one number driving all of them: `--dusk` goes
 * 0 -> 1 across the first couple of viewports, taking the page from Miami
 * sunset to deep night. Everything that should react to time of day reads
 * that variable in CSS rather than being animated individually.
 */
export default function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        // Settle on an in-between sky: still characterful, completely static.
        el.style.setProperty("--dusk", "0.8");
        return;
      }

      gsap.to(el, {
        "--dusk": 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "+=120%",
          scrub: 1.1,
        },
      });

      // Parallax: the near band travels further, so the city gains depth as
      // the camera "rises" through the page.
      gsap.to(farRef.current, {
        yPercent: 9,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      gsap.to(nearRef.current, {
        yPercent: 22,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ ["--dusk" as string]: 0 }}
    >
      {/* 1 — night base, always present underneath */}
      <div className="sky-night absolute inset-0" />

      {/* 2 — sunset, dissolving into the night as you scroll */}
      <div
        className="sky-dusk dusk-layer absolute inset-0"
        style={{ opacity: "calc(1 - var(--dusk))" }}
      />

      {/*
        2b — a real cloud bank over the painted gradient. soft-light keeps the
        sky's own colour and borrows only the cloud structure, so the sunset
        gains photographic texture without turning into a wallpaper. Masked
        well above the horizon so the road and palms in the source never show,
        and gone entirely by the time night falls.
      */}
      <div
        className="dusk-layer absolute inset-x-0 top-0 h-[46vh] overflow-hidden"
        style={{
          opacity: "calc(0.6 - var(--dusk) * 0.6)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 38%, transparent 88%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 38%, transparent 88%)",
        }}
      >
        {/*
          Scaled up and softened on purpose. The source frame has its own palms
          and power lines near the edges, which fought the procedural palms at
          the bottom of the page and cut across the nav. Zooming past them and
          defocusing leaves only the cloud structure — texture, not a second
          picture competing with the first.
        */}
        <Image
          src={MEDIA.palmRoadSunset.src}
          alt=""
          fill
          sizes="70vw"
          priority
          quality={40}
          className="scale-[1.75] object-cover object-top blur-[3px] mix-blend-soft-light"
        />
      </div>

      {/* 3 — stars, arriving as the sun goes down */}
      <div
        className="dusk-layer absolute inset-x-0 top-0 h-[70vh]"
        style={{
          backgroundImage: `${STARS},${STARS_SPARSE}`,
          opacity: "var(--dusk)",
        }}
      />

      {/* 4 — the sun, sinking below the horizon */}
      <div
        className="dusk-layer absolute bottom-[15vh] left-[66%] aspect-square w-[clamp(190px,25vw,400px)]"
        style={{
          transform: "translateX(-50%) translateY(calc(var(--dusk) * 26vh))",
          opacity: "calc(1 - var(--dusk) * 0.85)",
        }}
      >
        <div className="sun-disc absolute inset-0" />
        {/* bloom */}
        <div
          className="absolute -inset-[60%] -z-1"
          style={{
            background:
              "radial-gradient(circle, rgb(255 122 47 / 0.42) 0%, rgb(255 45 149 / 0.18) 38%, transparent 68%)",
          }}
        />
      </div>

      {/* 5 — far skyline */}
      <div
        ref={farRef}
        className="absolute inset-x-0 bottom-[14vh] h-[25vh] will-change-transform"
      >
        <SkylineFar className="absolute inset-0 h-full w-full opacity-70" />
      </div>

      {/* 6 — near skyline */}
      <div
        ref={nearRef}
        className="absolute inset-x-0 bottom-[11vh] h-[31vh] will-change-transform"
      >
        <SkylineNear className="absolute inset-0 h-full w-full" />
      </div>

      {/* 7 — horizon line: the brightest 1px on the page */}
      <div
        className="absolute inset-x-0 bottom-[11vh] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(255 179 138 / 0.75) 25%, rgb(255 92 157 / 0.9) 50%, rgb(34 224 255 / 0.7) 75%, transparent)",
          opacity: "calc(1 - var(--dusk) * 0.45)",
        }}
      />

      {/* 8 — ocean */}
      <div className="ocean-band absolute inset-x-0 bottom-0 h-[11vh]">
        <div className="ocean-shimmer absolute inset-0 opacity-60" />
      </div>

      {/* 9 — foreground palms */}
      <Palms />

      {/* Keeps the nav and hero HUD legible against a busy sky */}
      <div
        className="absolute inset-x-0 top-0 h-44"
        style={{
          background:
            "linear-gradient(180deg, rgb(5 5 12 / 0.72) 0%, rgb(5 5 12 / 0.28) 55%, transparent 100%)",
        }}
      />

      {/*
        Night scrim. The full scene belongs to the hero; by the time the
        first section arrives this has dimmed it to atmosphere so body copy
        always has contrast to sit on.
      */}
      <div
        className="dusk-layer absolute inset-0 bg-ink"
        style={{ opacity: "calc(var(--dusk) * 0.82)" }}
      />

      {/* haze pooling at the horizon ties the layers together */}
      <div
        className="absolute inset-x-0 bottom-0 h-[44vh]"
        style={{
          background:
            "linear-gradient(0deg, rgb(5 5 12 / 0.85) 0%, rgb(5 5 12 / 0.25) 45%, transparent 100%)",
        }}
      />

      {/*
        The causeway, and a car on it heading for the vanishing point.

        Drawn after the haze rather than before it. The haze is at its heaviest
        exactly where the road is — 85% black along the bottom edge — and
        underneath it the car was a smudge. It still carries its own fade at
        both ends, so it dissolves into the horizon and into the dark without
        borrowing the haze to do it — and it reads `--dusk` itself to fade out
        with the rest of the scene, since it is now past the night scrim too.
      */}
      <DrivingCar />
    </div>
  );
}
