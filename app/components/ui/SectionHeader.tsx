import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

/**
 * Shared section masthead: index number, HUD label, hairline rule, oversized
 * display heading, and an optional note in the right column.
 *
 * The rule + number pairing is what keeps the page feeling like one system
 * rather than six unrelated screens.
 */
export default function SectionHeader({
  num,
  label,
  title,
  note,
  icon: Icon,
  align = "left",
}: {
  num: string;
  label: string;
  title: ReactNode;
  note?: ReactNode;
  icon?: LucideIcon;
  align?: "left" | "center";
}) {
  return (
    <Reveal className="w-full">
      <div
        className={`flex items-baseline gap-4 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="will-reveal hud text-hud text-magenta">{num}</span>
        {Icon && (
          <Icon aria-hidden className="will-reveal icon-glow size-3.5 shrink-0 text-cyan" />
        )}
        <span className="will-reveal hud text-hud text-dim">{label}</span>
        <span className="will-reveal h-px flex-1 bg-linear-to-r from-bone/25 to-transparent" />
      </div>

      <div
        className={`mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ${
          align === "center" ? "items-center text-center lg:justify-center" : ""
        }`}
      >
        <h2 className="will-reveal display text-[clamp(2.6rem,7.5vw,6.5rem)] text-bone">
          {title}
        </h2>

        {note && (
          <p className="will-reveal text-body-sm max-w-sm text-ash lg:text-right">
            {note}
          </p>
        )}
      </div>
    </Reveal>
  );
}
