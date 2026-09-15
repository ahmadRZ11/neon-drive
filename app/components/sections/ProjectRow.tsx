"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import type { Project } from "../../data/projects";
import { useNearViewport } from "../../lib/hooks";
import { Code2, ExternalLink, TimerOff } from "lucide-react";
import { Badge } from "../ui/badge";
import ProjectCover from "./ProjectCover";

export default function ProjectRow({
  project,
  index,
  onEnter,
}: {
  project: Project;
  index: number;
  onEnter: (index: number) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(root);

  const hasLive = project.live !== "#";
  const hasCode = project.code !== "#";

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;

      // Cover reveal: a clip wipe rather than a fade — it keeps the image
      // feeling like a physical plate sliding into frame.
      gsap.fromTo(
        media.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
        }
      );

      // No parallax on the plate. It needed the image to overflow the frame,
      // which cropped the sides and clipped headings in the screenshots — and
      // a cover that cuts off the page title is worse than one that does not
      // drift. The clip-wipe reveal and the hover scale still carry motion.

      gsap.fromTo(
        "[data-row='meta'] > *",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
        }
      );

      // Feeds the sticky index in the left rail.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => onEnter(index),
        onEnterBack: () => onEnter(index),
      });
    },
    { scope: root, dependencies: [ready, index] }
  );

  const flip = index % 2 === 1;

  return (
    <article
      ref={root}
      className={`group grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${
        flip ? "" : ""
      }`}
    >
      {/* ── cover ─────────────────────────────────────────────── */}
      <div
        ref={media}
        className={`relative aspect-video overflow-hidden lg:col-span-7 ${
          flip ? "lg:order-2 lg:col-start-6" : "lg:order-1"
        }`}
      >
        <div
          data-row="inner"
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        >
          <ProjectCover project={project} />
        </div>

        {/* hairline frame */}
        <div className="pointer-events-none absolute inset-0 border border-bone/12" />

        {/* chromatic sweep on hover */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-linear-to-r from-transparent via-cyan/25 to-transparent transition-all duration-1000 group-hover:left-[110%]" />
        </div>

        {/* corner ticks */}
        <Corner className="top-0 left-0 border-t border-l" />
        <Corner className="top-0 right-0 border-t border-r" />
        <Corner className="bottom-0 left-0 border-b border-l" />
        <Corner className="bottom-0 right-0 border-b border-r" />

        {project.year && (
          <span className="hud absolute top-4 left-4 text-hud text-bone/70">
            {project.year}
          </span>
        )}
      </div>

      {/* ── meta ──────────────────────────────────────────────── */}
      <div
        data-row="meta"
        className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:order-2"}`}
      >
        <div className="flex items-baseline gap-3">
          <span className="hud text-hud text-magenta">{project.num}</span>
          <span className="hud text-hud text-dim">{project.category}</span>
        </div>

        <h3 className="display mt-4 text-[clamp(2rem,4.2vw,3.4rem)] text-bone transition-transform duration-500 group-hover:translate-x-2">
          {project.title}
        </h3>

        <p className="text-body mt-4 max-w-md text-ash">{project.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-bone/10 pt-5">
          <div>
            <dt className="hud text-hud-sm text-dim">Role</dt>
            <dd className="text-body-sm mt-1.5 text-bone">{project.role}</dd>
          </div>
          <div>
            <dt className="hud text-hud-sm text-dim">Stack</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap items-center gap-6">
          {hasLive ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-label group/link inline-flex items-center gap-2 border-b border-magenta/50 pb-1.5 text-btn-sm text-magenta transition-colors hover:border-magenta hover:text-pink"
            >
              View project
              <ExternalLink
                aria-hidden
                className="size-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </a>
          ) : (
            <span className="btn-label inline-flex items-center gap-2 border-b border-bone/15 pb-1.5 text-btn-sm text-dim">
              <TimerOff aria-hidden className="size-3.5" />
              Link coming soon
            </span>
          )}

          {hasCode && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-label inline-flex items-center gap-2 text-btn-sm text-ash transition-colors hover:text-bone"
            >
              <Code2 aria-hidden className="size-3.5" />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-5 w-5 border-magenta/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${className}`}
    />
  );
}
