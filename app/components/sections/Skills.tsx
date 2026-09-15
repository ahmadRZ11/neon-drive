"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SKILLS, SKILL_GROUPS } from "../../data/skills";
import { PROJECTS } from "../../data/projects";
import { Swords } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import { Badge } from "../ui/badge";
import SegmentMeter from "../ui/SegmentMeter";

const TITLE_BY_ID = new Map(PROJECTS.map((p) => [p.id, p.title]));

export default function Skills() {
  const [activeName, setActiveName] = useState(SKILLS[0].name);
  const active = SKILLS.find((s) => s.name === activeName) ?? SKILLS[0];

  return (
    <section id="arsenal" className="relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1560px]">
        <SectionHeader
          num="05"
          label="Arsenal"
          icon={Swords}
          title={
            <>
              The
              <br />
              <span className="type-outline-cyan">Arsenal</span>
            </>
          }
          note="Hover or tab through a technology to see where it actually gets used. Levels are honest, not aspirational."
        />

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* ── list ──────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            {SKILL_GROUPS.map((group) => {
              const items = SKILLS.filter((s) => s.group === group);
              if (!items.length) return null;

              return (
                <div key={group} className="mb-10 last:mb-0">
                  <p className="hud mb-3 text-hud-sm text-dim">{group}</p>

                  <ul className="border-t border-bone/10">
                    {items.map((skill) => {
                      const isActive = skill.name === activeName;
                      return (
                        <li key={skill.name}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveName(skill.name)}
                            onFocus={() => setActiveName(skill.name)}
                            onClick={() => setActiveName(skill.name)}
                            aria-pressed={isActive}
                            className="group flex w-full items-center justify-between gap-6 border-b border-bone/10 py-4 text-left"
                          >
                            <span className="flex items-center gap-4">
                              <span
                                className={`block h-px transition-all duration-500 ${
                                  isActive ? "w-10 bg-magenta" : "w-4 bg-bone/25"
                                }`}
                              />
                              <span
                                className={`display text-[clamp(1.2rem,2.2vw,1.9rem)] transition-colors duration-300 ${
                                  isActive
                                    ? "text-bone"
                                    : "text-ash group-hover:text-bone"
                                }`}
                              >
                                {skill.name}
                              </span>
                            </span>

                            <span
                              className={`hud text-hud tabular-nums transition-colors duration-300 ${
                                isActive ? "text-magenta" : "text-ash/70"
                              }`}
                            >
                              {skill.level}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* ── detail panel ──────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="panel panel-edge sticky top-28 p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="hud text-hud-sm text-dim">{active.group}</span>
                    <span className="hud text-hud-sm text-cyan">Proficiency</span>
                  </div>

                  <h3 className="display mt-3 text-[clamp(1.9rem,3.4vw,2.8rem)] text-bone">
                    {active.name}
                  </h3>

                  <p className="text-body mt-4 text-ash">{active.use}</p>

                  <div className="mt-7">
                    <SegmentMeter
                      key={active.name}
                      label="Level"
                      value={active.level}
                      tone="cyan"
                    />
                  </div>

                  <div className="mt-7 border-t border-bone/10 pt-5">
                    <p className="hud text-hud-sm text-dim">Used in</p>
                    {active.related.length ? (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {active.related.map((id) => (
                          <li key={id}>
                            <Badge asChild interactive>
                              <a href="#work">{TITLE_BY_ID.get(id) ?? id}</a>
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body-sm mt-3 text-dim">
                        Production work outside this portfolio.
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
