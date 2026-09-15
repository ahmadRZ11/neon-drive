"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, SplitText, CINE, prefersReducedMotion } from "../../lib/gsap";
import { SITE } from "../../data/site";
import { PROJECTS } from "../../data/projects";
import { ChevronsDown, Clock3, MapPin, Radio, Send, Sparkles } from "lucide-react";
import MagneticButton from "../ui/MagneticButton";
import LiveClock from "../ui/LiveClock";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);

  // SplitText measures glyph boxes — splitting before Anton loads would
  // capture fallback metrics and jump when the real face arrives.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const done = () => alive && setFontsReady(true);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(done).catch(done);
    } else {
      done();
    }
    return () => {
      alive = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!fontsReady || prefersReducedMotion()) return;
      if (!firstRef.current || !lastRef.current) return;

      // `mask: "chars"` wraps every glyph in its own overflow-hidden box, so
      // the letters rise out from behind a clean edge instead of fading.
      const first = new SplitText(firstRef.current, { type: "chars", mask: "chars" });
      const last = new SplitText(lastRef.current, { type: "chars", mask: "chars" });

      const tl = gsap.timeline({ delay: 0.75 });

      tl.from("[data-hero='hud'] > *", {
        opacity: 0,
        y: -12,
        duration: 0.7,
        stagger: 0.07,
        ease: CINE,
      })
        .from(
          "[data-hero='label']",
          { opacity: 0, x: -24, duration: 0.7, ease: CINE },
          "-=0.4"
        )
        .from(
          first.chars,
          { yPercent: 115, duration: 1.05, stagger: 0.045, ease: CINE },
          "-=0.35"
        )
        .from(
          last.chars,
          { yPercent: 115, duration: 1.05, stagger: 0.045, ease: CINE },
          "-=0.85"
        )
        .from(
          "[data-hero='role']",
          { opacity: 0, x: 34, duration: 0.8, ease: CINE },
          "-=0.6"
        )
        .from(
          "[data-hero='rule']",
          { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: CINE },
          "-=0.75"
        )
        .from(
          "[data-hero='intro']",
          { opacity: 0, y: 22, duration: 0.8, ease: CINE },
          "-=0.5"
        )
        .from(
          "[data-hero='cta'] > *",
          { opacity: 0, y: 22, duration: 0.7, stagger: 0.09, ease: CINE },
          "-=0.45"
        )
        .from(
          "[data-hero='foot'] > *",
          { opacity: 0, y: 16, duration: 0.6, stagger: 0.07, ease: CINE },
          "-=0.4"
        );

      // Drift the hero out of the way instead of letting it just scroll off.
      gsap.to("[data-hero='stack']", {
        yPercent: 16,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        first.revert();
        last.revert();
      };
    },
    { scope: root, dependencies: [fontsReady] }
  );

  return (
    <section
      ref={root}
      id="index"
      className="relative flex min-h-[100svh] flex-col justify-between px-6 pt-24 pb-8 lg:px-12"
    >
      {/*
        Legibility scrim. The backdrop is at its busiest exactly where the
        headline sits, so the type gets a gradient to sit on rather than
        fighting the skyline for contrast. Negative z keeps it behind the
        hero content but still inside <main>, so it never covers the nav.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-1"
        style={{
          background:
            "linear-gradient(104deg, rgb(5 5 12 / 0.86) 0%, rgb(5 5 12 / 0.62) 34%, rgb(5 5 12 / 0.12) 66%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-1 h-40"
        style={{
          background:
            "linear-gradient(0deg, rgb(5 5 12 / 0.9) 0%, transparent 100%)",
        }}
      />

      {/* ── top HUD ───────────────────────────────────────────── */}
      <div
        data-hero="hud"
        className="flex items-start justify-between gap-6 text-hud text-dim"
      >
        <div className="hud flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-ash">
            <MapPin aria-hidden className="size-3 text-cyan" />
            {SITE.location.city} / {SITE.location.region}
          </span>
          <span className="tabular-nums">{SITE.location.coords}</span>
        </div>

        <div className="hud hidden flex-col items-center gap-1.5 sm:flex">
          <span className="flex items-center gap-1.5 text-ash">
            <Clock3 aria-hidden className="size-3 text-cyan" />
            Local time
          </span>
          <LiveClock className="tabular-nums text-cyan" />
        </div>

        <div className="hud flex flex-col items-end gap-1.5">
          <span className="flex items-center gap-1.5 text-ash">
            <Radio aria-hidden className="size-3 text-cyan" />
            Status
          </span>
          <span className="flex items-center gap-2 text-bone">
            <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-cyan" />
            {SITE.availability.open ? "Available" : "Booked"}
          </span>
        </div>
      </div>

      {/* ── title stack ───────────────────────────────────────── */}
      <div data-hero="stack" className="relative py-10">
        <p data-hero="label" className="hud mb-6 flex items-center gap-2 text-hud text-magenta">
          <Sparkles aria-hidden className="icon-glow size-3.5" />
          Portfolio &mdash; Vol. 01
        </p>

        <h1>
          <span className="sr-only">
            {SITE.firstName} {SITE.lastName} &mdash; {SITE.roleFull}. {SITE.tagline}.
          </span>

          <span aria-hidden className="block">
            <span
              ref={firstRef}
              className="display block text-[clamp(3.6rem,18vw,16rem)] text-bone"
            >
              {SITE.firstName}
            </span>

            <span className="mt-1 flex flex-wrap items-end gap-x-8 gap-y-4 lg:mt-0 lg:pl-[7vw]">
              <span
                ref={lastRef}
                className="display type-outline-magenta block text-[clamp(3.6rem,18vw,16rem)]"
              >
                {SITE.lastName}
              </span>

              <span className="flex w-full items-center gap-4 sm:w-auto sm:flex-1 sm:justify-end sm:pb-[clamp(0.6rem,2vw,2.4rem)]">
                <span
                  data-hero="rule"
                  className="hidden h-px max-w-[16vw] flex-1 bg-linear-to-r from-transparent to-cyan/70 sm:block"
                />
                <span
                  data-hero="role"
                  className="hud shrink-0 text-[clamp(0.6rem,1vw,0.8rem)] text-cyan"
                >
                  {SITE.role}
                </span>
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div
            data-hero="intro"
            className="max-w-md lg:col-span-5 lg:col-start-1"
          >
            <p className="script text-[clamp(1.7rem,2.8vw,2.4rem)] text-bone">
              {SITE.tagline}.
            </p>
            <p className="text-body mt-4 text-ash">{SITE.intro}</p>
          </div>

          <div
            data-hero="cta"
            className="flex flex-wrap items-center gap-3 lg:col-span-6 lg:col-start-7 lg:justify-end"
          >
            <MagneticButton href="#work" variant="solid">
              Enter portfolio
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline" icon={Send}>
              Get in touch
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ── bottom HUD ────────────────────────────────────────── */}
      <div
        data-hero="foot"
        className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-bone/10 pt-5"
      >
        <a
          href="#profile"
          className="hud group flex items-center gap-3 text-hud text-ash transition-colors hover:text-bone"
        >
          <ChevronsDown
            aria-hidden
            className="size-4 text-magenta transition-transform duration-500 group-hover:translate-y-1"
          />
          Scroll
        </a>

        <dl className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-12">
          <Stat label="Experience" value="2+ yrs" />
          <Stat label="Projects" value={String(PROJECTS.length).padStart(2, "0")} />
          <Stat label="Focus" value="Interfaces" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <dt className="hud text-hud-sm text-dim">{label}</dt>
      <dd className="hud mt-1.5 text-hud-lg text-bone">{value}</dd>
    </div>
  );
}
