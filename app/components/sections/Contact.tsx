"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { gsap, useGSAP, SplitText, CINE, prefersReducedMotion } from "../../lib/gsap";
import Image from "next/image";
import { SITE } from "../../data/site";
import { MEDIA } from "../../data/media";
import { ArrowUpRight, Mail, MapPin, Send } from "lucide-react";
import { SOCIAL_ICONS } from "../../lib/social-icons";
import { useNearViewport } from "../../lib/hooks";
import MagneticButton from "../ui/MagneticButton";
import LiveClock from "../ui/LiveClock";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLSpanElement>(null);
  const ready = useNearViewport(root);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion() || !headline.current) return;

      const split = new SplitText(headline.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.09,
        ease: CINE,
        scrollTrigger: { trigger: root.current, start: "top 68%", once: true },
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      id="contact"
      className="relative px-6 pt-28 pb-20 lg:px-12 lg:pt-40"
    >
      {/* Closing backdrop. Sits behind the content inside <main>'s stacking
          context, so it never rides over the nav. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-1 overflow-hidden">
        <Image
          src={MEDIA.driverSunSilhouette.src}
          alt=""
          fill
          sizes="100vw"
          quality={58}
          placeholder="blur"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgb(5 5 12 / 0.94) 0%, rgb(5 5 12 / 0.72) 46%, rgb(5 5 12 / 0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgb(5 5 12 / 0.9) 0%, transparent 38%, rgb(5 5 12 / 0.85) 100%)",
          }}
        />
        <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      </div>

      <div className="relative mx-auto max-w-[1560px]">
        <div className="flex items-baseline gap-4">
          <span className="hud text-hud text-magenta">06</span>
          <Send aria-hidden className="icon-glow size-3.5 shrink-0 self-center text-cyan" />
          <span className="hud text-hud text-dim">Contact</span>
          <span className="h-px flex-1 bg-linear-to-r from-bone/25 to-transparent" />
        </div>

        <h2 className="mt-10">
          <span className="sr-only">
            The city never sleeps. Let&rsquo;s build something.
          </span>
          <span
            ref={headline}
            aria-hidden
            className="display block max-w-5xl text-[clamp(2.6rem,9vw,8rem)] leading-[0.86] text-bone"
          >
            The city never sleeps.{" "}
            <span className="type-outline-magenta">Let&rsquo;s build something.</span>
          </span>
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-body max-w-md text-ash">
              Open to frontend roles and freelance builds &mdash; especially the
              ones where the interaction design is the hard part. Tell me what
              you&rsquo;re making.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <MagneticButton
                href={`mailto:${SITE.email}`}
                variant="solid"
                icon={Send}
              >
                Start a project
              </MagneticButton>
            </div>

            <div className="mt-10 flex items-center gap-3 text-hud">
              <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-cyan" />
              <span className="hud flex items-center gap-1.5 text-ash">
                <MapPin aria-hidden className="size-3 text-cyan" />
                {SITE.location.city}, {SITE.location.countryCode} &mdash;{" "}
                <LiveClock className="text-cyan tabular-nums" />
              </span>
            </div>
          </div>

          {/* channels */}
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-bone/10">
              <Channel
                label="Email"
                value={SITE.email}
                href={`mailto:${SITE.email}`}
                icon={Mail}
              />
              {SITE.socials.map((social) => (
                <Channel
                  key={social.label}
                  label={social.label}
                  value={social.handle}
                  href={social.href}
                  icon={SOCIAL_ICONS[social.icon]}
                  external
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Channel({
  label,
  value,
  href,
  icon: Icon,
  external,
}: {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}) {
  // A "#" href means the real URL has not been filled in yet — render it as
  // plain text rather than a link that goes nowhere.
  const isPlaceholder = href === "#";

  const content = (
    <>
      <span className="hud flex items-center gap-2 text-hud text-dim">
        <Icon aria-hidden className="size-3.5" />
        {label}
      </span>
      <span className="flex items-center gap-3">
        <span
          className={`text-body-sm transition-colors ${
            isPlaceholder ? "text-dim" : "text-bone group-hover:text-magenta"
          }`}
        >
          {value}
        </span>
        {!isPlaceholder && (
          <ArrowUpRight
            aria-hidden
            className="size-4 text-magenta transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        )}
      </span>
    </>
  );

  return (
    <li className="border-b border-bone/10">
      {isPlaceholder ? (
        <div className="flex items-center justify-between gap-6 py-5">{content}</div>
      ) : (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="group flex items-center justify-between gap-6 py-5"
        >
          {content}
        </a>
      )}
    </li>
  );
}
