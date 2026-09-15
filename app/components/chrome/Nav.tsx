"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import {
  History,
  Images,
  Layers,
  Menu,
  Send,
  Swords,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { SECTIONS, SITE } from "../../data/site";
import { useScrollLock, useSectionSpy } from "../../lib/hooks";
import { Button } from "../ui/button";

const IDS = SECTIONS.map((s) => s.id);

/** One icon per section, carried through the nav and the mobile menu. */
const SECTION_ICONS: Record<string, LucideIcon> = {
  profile: User,
  work: Layers,
  gallery: Images,
  record: History,
  arsenal: Swords,
  contact: Send,
};

export default function Nav() {
  const { scrollYProgress, scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  const active = useSectionSpy(IDS);
  useScrollLock(open);

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (y) => setCondensed(y > 60));

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
        className="fixed inset-x-0 top-0 z-80"
      >
        {/* page progress — the thinnest possible piece of feedback */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-left bg-linear-to-r from-magenta via-pink to-cyan"
          style={{ scaleX: progress }}
        />

        <div
          className={`transition-colors duration-500 ${
            condensed
              ? "nav-surface border-b border-bone/10 bg-ink/80 backdrop-blur-md"
              : "border-b border-transparent"
          }`}
        >
          <div
            className={`mx-auto flex max-w-[1560px] items-center justify-between gap-6 px-6 transition-all duration-500 lg:px-12 ${
              condensed ? "h-16" : "h-22"
            }`}
          >
            {/* ── wordmark ─────────────────────────────────── */}
            <a href="#index" className="group flex items-baseline gap-2.5">
              <span className="display text-[1.6rem] tracking-[0.04em] text-bone transition-[text-shadow] duration-300 group-hover:text-glow">
                {SITE.firstName}
              </span>
              <span className="hud text-hud-sm text-magenta">{"// DEV"}</span>
            </a>

            {/* ── desktop links ────────────────────────────── */}
            <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
              {SECTIONS.slice(1).map((section) => {
                const Icon = SECTION_ICONS[section.id];
                const isActive = active === section.id;

                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className="group relative flex items-center gap-2 py-2.5"
                  >
                    {Icon && (
                      <Icon
                        aria-hidden
                        className={`size-[15px] transition-colors duration-300 ${
                          isActive
                            ? "icon-glow text-magenta"
                            : "text-dim group-hover:text-cyan"
                        }`}
                      />
                    )}
                    <span
                      className={`nav-link text-nav transition-colors duration-300 ${
                        isActive
                          ? "neon-magenta"
                          : "text-ash group-hover:text-bone group-hover:text-glow"
                      }`}
                    >
                      {section.label}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-magenta shadow-[0_0_10px_var(--color-magenta)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                );
              })}

              <Button asChild variant="outline" size="sm" className="border-magenta/45 text-magenta">
                <a href="#contact">
                  Start a project
                  <Send aria-hidden />
                </a>
              </Button>
            </nav>

            {/* ── mobile trigger ───────────────────────────── */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="px-0 text-bone md:hidden"
            >
              Menu
              <Menu aria-hidden />
            </Button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-90 flex flex-col bg-ink/97 backdrop-blur-2xl md:hidden"
        >
          <div className="flex h-22 items-center justify-between px-6">
            <span className="hud text-hud text-dim">Navigation</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="px-0 text-magenta">
              Close
              <X aria-hidden />
            </Button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-6">
            {SECTIONS.slice(1).map((section, i) => {
              const Icon = SECTION_ICONS[section.id];
              const isActive = active === section.id;

              return (
                <motion.a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={onClose}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.18 + i * 0.07,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center gap-4 border-b border-bone/10 py-5"
                >
                  {Icon && (
                    <Icon
                      aria-hidden
                      className={`size-5 ${isActive ? "icon-glow text-magenta" : "text-dim"}`}
                    />
                  )}
                  <span className={`display text-4xl ${isActive ? "neon-magenta" : "text-ash"}`}>
                    {section.label}
                  </span>
                  <span className="hud ml-auto text-hud-sm text-dim">{section.num}</span>
                </motion.a>
              );
            })}
          </nav>

          <div className="px-6 pb-10">
            <Button
              asChild
              variant="outline"
              size="md"
              className="w-full border-magenta/45 text-magenta"
            >
              <a href={`mailto:${SITE.email}`}>
                {SITE.email}
                <Send aria-hidden />
              </a>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
