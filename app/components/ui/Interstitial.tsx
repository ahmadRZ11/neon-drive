"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { useNearViewport } from "../../lib/hooks";
import type { Media } from "../../data/media";

/**
 * A full-bleed image band between sections — the page stops talking for a
 * moment and just shows you the city.
 *
 * The plate is oversized vertically and drifts on scroll, so the crop moves
 * inside a fixed frame rather than the whole block sliding.
 */
export default function Interstitial({
  media,
  label,
  caption,
}: {
  media: Media;
  label: string;
  caption: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(root);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      gsap.fromTo(
        "[data-inter='plate']",
        { yPercent: -9 },
        {
          yPercent: 9,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        "[data-inter='caption'] > *",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        }
      );
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <div
      ref={root}
      className="relative my-4 h-[46vh] min-h-[300px] overflow-hidden border-y border-bone/10 lg:h-[64vh]"
    >
      {/* Oversized so the parallax never exposes an edge */}
      <div data-inter="plate" className="absolute inset-x-0 -inset-y-[12%]">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="100vw"
          placeholder="blur"
          quality={58}
          className="object-cover"
        />
      </div>

      {/* film treatment, matched to the rest of the page */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgb(5 5 12 / 0.82) 0%, rgb(5 5 12 / 0.4) 42%, transparent 78%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgb(5 5 12 / 0.7) 0%, transparent 45%, rgb(5 5 12 / 0.45) 100%)",
        }}
      />
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />

      <div
        data-inter="caption"
        className="absolute inset-x-0 bottom-0 px-6 pb-8 lg:px-12 lg:pb-12"
      >
        <p className="hud text-hud text-magenta">{label}</p>
        <p className="display mt-3 max-w-2xl text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[0.88] text-bone">
          {caption}
        </p>
      </div>
    </div>
  );
}
