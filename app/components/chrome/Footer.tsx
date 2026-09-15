import { SITE } from "../../data/site";
import { ArrowUp } from "lucide-react";
import { SOCIAL_ICONS } from "../../lib/social-icons";
import Marquee from "../ui/Marquee";
import { Button } from "../ui/button";

const WORDS = [
  "Miami",
  "Neon",
  "Sunset",
  "Interfaces",
  "Motion",
  "After Dark",
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative">
      <Marquee items={WORDS} className="border-y border-bone/10 py-6" duration={34} />

      <div className="mx-auto flex max-w-[1560px] flex-col gap-8 px-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div>
          <p className="signature text-[2.6rem] leading-none text-bone">
            {SITE.firstName} {SITE.lastName}
          </p>
          <p className="hud mt-2 text-hud text-magenta">{SITE.roleFull}</p>
        </div>

        <nav aria-label="Social" className="flex gap-8">
          {SITE.socials.map((social) => {
            const Icon = SOCIAL_ICONS[social.icon];
            return social.href === "#" ? (
              <span
                key={social.label}
                className="hud flex items-center gap-2 text-hud text-dim"
              >
                <Icon aria-hidden className="size-3.5" />
                {social.label}
              </span>
            ) : (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hud flex items-center gap-2 text-hud text-ash transition-colors hover:text-magenta"
              >
                <Icon aria-hidden className="size-3.5" />
                {social.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hud text-hud text-dim">
            &copy; {year} &mdash; All rights reserved
          </span>
          <Button asChild variant="outline" size="sm" className="border-bone/12 text-ash">
            <a href="#index">
              <ArrowUp aria-hidden />
              Top
            </a>
          </Button>
        </div>
      </div>

      {/* closing hairline, tuned to the horizon line in the atmosphere */}
      <div
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(255 45 149 / 0.5), rgb(34 224 255 / 0.4), transparent)",
        }}
      />
    </footer>
  );
}
