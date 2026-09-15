/**
 * `related` holds project ids from projects.ts — the Arsenal section resolves
 * them to titles so the two data sets stay in sync.
 */
export type Skill = {
  name: string;
  level: number;
  group: "Core" | "Interface" | "Data" | "Motion" | "Craft";
  /** Shown in the detail panel on hover/focus. */
  use: string;
  related: string[];
};

export const SKILLS: Skill[] = [
  {
    name: "React",
    level: 90,
    group: "Core",
    use: "Component architecture, state boundaries, and keeping re-renders where they belong.",
    related: ["portfolio-os", "aria-os"],
  },
  {
    name: "Next.js",
    level: 88,
    group: "Core",
    use: "App Router, server components, and the routing/rendering split that keeps bundles small.",
    related: ["portfolio-os", "ocean"],
  },
  {
    name: "TypeScript",
    level: 84,
    group: "Core",
    use: "Typed data layers and component contracts — catching the bug before the browser does.",
    related: ["aria-os", "matrix"],
  },
  {
    name: "JavaScript",
    level: 90,
    group: "Core",
    use: "The fundamentals everything else sits on: the event loop, the DOM, and canvas.",
    related: ["catch-me", "matrix"],
  },
  {
    name: "Tailwind CSS",
    level: 92,
    group: "Interface",
    use: "Design tokens as a system. v4's CSS-first theme is what this site is built on.",
    related: ["portfolio-os", "aria-os"],
  },
  {
    name: "shadcn/ui",
    level: 80,
    group: "Interface",
    use: "Accessible primitives worth owning in-repo rather than importing and fighting.",
    related: ["portfolio-os"],
  },
  {
    name: "Figma",
    level: 78,
    group: "Craft",
    use: "Reading design intent — spacing rhythm, type scale, and what the file meant to say.",
    related: ["ocean", "the-altar"],
  },
  {
    name: "TanStack Query",
    level: 76,
    group: "Data",
    use: "Server state, caching and invalidation — kept well away from UI state.",
    related: ["portfolio-os"],
  },
  {
    name: "Zustand",
    level: 78,
    group: "Data",
    use: "Small, explicit client stores for the state that genuinely has to be global.",
    related: ["portfolio-os", "aria-os"],
  },
  {
    name: "GraphQL",
    level: 70,
    group: "Data",
    use: "Typed queries and schema-driven data fetching against real backends.",
    related: [],
  },
  {
    name: "GSAP",
    level: 85,
    group: "Motion",
    use: "ScrollTrigger timelines and sequencing — the scroll choreography on this page.",
    related: ["aria-os", "the-altar"],
  },
  {
    name: "Three.js",
    level: 72,
    group: "Motion",
    use: "Real-time scenes and shader work, budgeted so they never cost the main thread.",
    related: ["ocean"],
  },
];

export const SKILL_GROUPS = ["Core", "Interface", "Data", "Motion", "Craft"] as const;
