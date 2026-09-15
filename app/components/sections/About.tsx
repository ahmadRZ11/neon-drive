import Image from "next/image";
import { SITE } from "../../data/site";
import { MEDIA, type Media } from "../../data/media";
import { PROJECTS } from "../../data/projects";
import { SKILLS } from "../../data/skills";
import { BadgeCheck, User } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import Reveal from "../ui/Reveal";
import Counter from "../ui/Counter";
import SegmentMeter from "../ui/SegmentMeter";

/**
 * A real photo of you goes here — add it to /public/images, import it in
 * data/media.ts, and point PORTRAIT at it. Until then the dossier uses an
 * environment plate with the monogram over it, which reads as a deliberate ID
 * card rather than a missing avatar.
 */
const PORTRAIT: Media | null = null;
const PLATE: Media = MEDIA.oceanDriveDusk;

const FOCUS = [
  { label: "Frontend", value: 90 },
  { label: "UI / UX", value: 85 },
  { label: "Motion", value: 82 },
  { label: "Performance", value: 78 },
] as const;

export default function About() {
  return (
    <section id="profile" className="relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1560px]">
        <SectionHeader
          num="01"
          label="Profile"
          icon={User}
          title={
            <>
              The
              <br />
              <span className="type-outline-cyan">Player</span>
            </>
          }
          note="Design engineer and frontend developer, based wherever the work is interesting. Currently building interfaces that behave like software, not slideshows."
        />

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* ── bio ───────────────────────────────────────────── */}
          <Reveal className="lg:col-span-7">
            <p className="will-reveal display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15] text-bone">
              I design the interface, then build it so it feels{" "}
              <span className="script text-[1.45em] leading-[0.8] text-magenta">
                engineered
              </span>.
            </p>

            <p className="will-reveal mt-8 max-w-xl text-body text-ash">
              {SITE.intro}
            </p>

            <p className="will-reveal mt-5 max-w-xl text-body text-ash">
              Most of what I build lives in the gap between a static mockup and a
              shipped screen &mdash; the loading states, the empty states, the
              easing curve that makes a transition feel intentional instead of
              accidental. That gap is the job.
            </p>

            {/* stats */}
            <dl className="will-reveal mt-12 grid grid-cols-3 gap-6 border-t border-bone/10 pt-8">
              <Stat label="Years" >
                <Counter value={2} suffix="+" />
              </Stat>
              <Stat label="Projects">
                <Counter value={PROJECTS.length} suffix="" />
              </Stat>
              <Stat label="Technologies">
                <Counter value={SKILLS.length} suffix="" />
              </Stat>
            </dl>

            {/* focus meters */}
            <div className="will-reveal mt-12 grid gap-7 sm:grid-cols-2">
              {FOCUS.map((item, i) => (
                <SegmentMeter
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  tone={i % 2 === 0 ? "magenta" : "cyan"}
                />
              ))}
            </div>
          </Reveal>

          {/* ── dossier ───────────────────────────────────────── */}
          <Reveal className="lg:col-span-5" stagger={0.12}>
            <div className="will-reveal panel panel-edge relative">
              <div className="relative aspect-4/5 overflow-hidden">
                {PORTRAIT ? (
                  <Image
                    src={PORTRAIT.src}
                    alt={`${SITE.firstName} ${SITE.lastName}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    placeholder="blur"
                    className="object-cover"
                  />
                ) : (
                  <PortraitPlate plate={PLATE} />
                )}

                <span className="hud absolute top-4 left-4 text-hud-sm text-bone/70">
                  ID / 0001
                </span>
                <span className="hud absolute top-4 right-4 flex items-center gap-1.5 text-hud-sm text-cyan">
                  <BadgeCheck aria-hidden className="size-3.5" />
                  Verified
                </span>
              </div>

              <dl className="divide-y divide-bone/10 border-t border-bone/10">
                <Field label="Name" value={`${SITE.firstName} ${SITE.lastName}`} />
                <Field label="Role" value={SITE.roleFull} />
                <Field
                  label="Base"
                  value={`${SITE.location.city}, ${SITE.location.region}, ${SITE.location.country}`}
                />
                <Field label="Discipline" value="Design / Interfaces / Motion" />
                <Field
                  label="Status"
                  value={SITE.availability.label}
                  accent
                />
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="hud text-hud-sm text-dim">{label}</dt>
      <dd className="display mt-2 text-[clamp(1.8rem,3.4vw,3rem)] text-bone">
        {children}
      </dd>
    </div>
  );
}

function Field({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="hud text-hud-sm text-dim">{label}</dt>
      <dd
        className={`text-right text-xs ${
          accent ? "flex items-center gap-2 text-cyan" : "text-bone"
        }`}
      >
        {accent && (
          <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-cyan" />
        )}
        {value}
      </dd>
    </div>
  );
}

/**
 * The dossier plate: a location photograph under the scan rings and monogram.
 * Reads as an issued ID card rather than a missing avatar — and swaps out
 * cleanly the moment a real portrait is added.
 */
function PortraitPlate({ plate }: { plate: Media }) {
  return (
    <div className="absolute inset-0">
      <Image
        src={plate.src}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        placeholder="blur"
        quality={68}
        className="object-cover"
      />

      {/* Push the photograph back so the monogram stays the subject */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, rgb(139 61 255 / 0.42), rgb(5 5 12 / 0.86) 55%, rgb(255 45 149 / 0.38))",
        }}
      />

      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {[70, 108, 146, 184].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="215"
            r={r}
            fill="none"
            stroke={i % 2 ? "#22e0ff" : "#ff2d95"}
            strokeOpacity={0.3 - i * 0.05}
            strokeDasharray={i === 2 ? "3 9" : undefined}
          />
        ))}

        {Array.from({ length: 30 }, (_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 17 + 6}
            x2="400"
            y2={i * 17 + 6}
            stroke="#22e0ff"
            strokeOpacity="0.06"
          />
        ))}

        <text
          x="200"
          y="248"
          textAnchor="middle"
          className="display"
          fontSize="132"
          fill="none"
          stroke="#f4ece6"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        >
          AR
        </text>
      </svg>

      <div className="grain absolute inset-0 opacity-[0.08] mix-blend-overlay" />
    </div>
  );
}
