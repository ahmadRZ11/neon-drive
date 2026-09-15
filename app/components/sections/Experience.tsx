"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { EXPERIENCE } from "../../data/experience";
import { useNearViewport } from "../../lib/hooks";
import { History } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import { Badge } from "../ui/badge";

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const ready = useNearViewport(root);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      // The spine draws itself as the section scrolls past.
      gsap.fromTo(
        "[data-xp='spine']",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: "[data-xp='track']",
            start: "top 70%",
            end: "bottom 75%",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-xp='entry']").forEach((entry) => {
        gsap.fromTo(
          entry,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: entry, start: "top 80%", once: true },
          }
        );

        gsap.fromTo(
          entry.querySelector("[data-xp='node']"),
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: { trigger: entry, start: "top 78%", once: true },
          }
        );
      });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section ref={root} id="record" className="relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1560px]">
        <SectionHeader
          num="04"
          label="Record"
          icon={History}
          title={
            <>
              Career
              <br />
              <span className="type-outline-magenta">Record</span>
            </>
          }
          note="The short version: two years of getting progressively more particular about how interfaces behave — and about who decides."
        />

        <div data-xp="track" className="relative mt-20 lg:mt-28">
          {/* spine */}
          <div className="absolute top-2 bottom-2 left-[7px] w-px bg-bone/12 lg:left-[calc(16.666%+7px)]">
            <div
              data-xp="spine"
              className="absolute inset-0 origin-top bg-linear-to-b from-magenta via-pink to-cyan"
            />
          </div>

          <ol className="flex flex-col gap-16 lg:gap-24">
            {EXPERIENCE.map((item) => (
              <li
                key={item.year}
                data-xp="entry"
                className="relative grid gap-5 pl-10 lg:grid-cols-12 lg:gap-12 lg:pl-0"
              >
                {/* node */}
                <span
                  data-xp="node"
                  className="absolute top-1.5 left-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-magenta bg-ink lg:left-[16.666%]"
                >
                  <span className="block h-1.5 w-1.5 rounded-full bg-magenta" />
                </span>

                <div className="lg:col-span-2">
                  <span className="display text-[clamp(2rem,4vw,3.4rem)] text-bone/80">
                    {item.year}
                  </span>
                </div>

                <div className="lg:col-span-9 lg:col-start-4">
                  <h3 className="display text-[clamp(1.4rem,2.4vw,2rem)] text-bone">
                    {item.title}
                  </h3>
                  <p className="hud mt-2 text-hud text-magenta">{item.org}</p>
                  <p className="text-body mt-4 max-w-2xl text-ash">{item.summary}</p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag}>
                        <Badge>{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
