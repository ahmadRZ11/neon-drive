"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PROJECTS } from "../../data/projects";
import { Layers } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import ProjectRow from "./ProjectRow";

export default function Work() {
  const [active, setActive] = useState(0);
  const handleEnter = useCallback((index: number) => setActive(index), []);

  const current = PROJECTS[active];

  return (
    <section id="work" className="relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1560px]">
        <SectionHeader
          num="02"
          label="Work"
          icon={Layers}
          title={
            <>
              Selected
              <br />
              <span className="type-outline-magenta">Missions</span>
            </>
          }
          note={`${PROJECTS.length} builds where the interface was the product. Each one started as a question about what a browser could be talked into doing.`}
        />

        <div className="mt-20 grid gap-16 lg:mt-28 lg:grid-cols-12 lg:gap-12">
          {/* ── sticky index: the number stays put while the work scrolls ── */}
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-[38vh]">
              <div className="relative h-28 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={current.num}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="display absolute inset-0 text-[7rem] leading-none text-bone/90"
                  >
                    {current.num}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="hud text-hud text-dim">
                  / {String(PROJECTS.length).padStart(2, "0")}
                </span>
              </div>

              {/* progress ladder */}
              <ol className="mt-8 flex flex-col gap-2.5">
                {PROJECTS.map((project, i) => (
                  <li key={project.id} className="flex items-center gap-3">
                    <span
                      className={`block h-px transition-all duration-500 ${
                        i === active ? "w-8 bg-magenta" : "w-4 bg-bone/20"
                      }`}
                    />
                    <span
                      className={`hud text-hud-sm transition-colors duration-500 ${
                        i === active ? "text-bone" : "text-dim"
                      }`}
                    >
                      {project.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* ── rows ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-24 lg:col-span-10 lg:gap-40">
            {PROJECTS.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={i}
                onEnter={handleEnter}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
