/**
 * TODO: replace these with real roles, companies and dates.
 *
 * They are written as career milestones rather than invented employers —
 * the repo contained no employment history, and a portfolio is the last place
 * to guess at one. Keep the shape, swap the content.
 */
export type Milestone = {
  year: string;
  title: string;
  org: string;
  summary: string;
  tags: string[];
};

export const EXPERIENCE: Milestone[] = [
  {
    year: "2024",
    title: "First Line Shipped",
    org: "Self-directed",
    summary:
      "Moved from tutorials to production habits: semantic markup, real accessibility passes, and component APIs designed to be used twice before being called reusable.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2025",
    title: "Frontend Development",
    org: "Client & product work",
    summary:
      "Building responsive, component-driven applications in React and Next.js. Translating design files into typed, testable interfaces — and owning the gap between a static mockup and a shipped screen.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    year: "2026",
    title: "Digital Experiences",
    org: "Creative engineering",
    summary:
      "Pushing into motion and real-time graphics: GSAP timelines, WebGL scenes, and interfaces where the animation carries meaning instead of decorating it.",
    tags: ["GSAP", "Three.js", "Motion", "GLSL"],
  },
];
