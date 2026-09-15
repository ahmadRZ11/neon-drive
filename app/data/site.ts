/**
 * `icon` is a key, not a component, so this file stays plain data. The
 * components map it to a Lucide icon — Lucide v1 dropped brand marks, so
 * those are semantic stand-ins rather than the real logos.
 *
 * Typed explicitly rather than inferred: with `as const` the hrefs become
 * literal types and TypeScript decides the `href === "#"` placeholder branch
 * is unreachable, which breaks the moment you add a link you do not have yet.
 */
export type Social = {
  label: string;
  /** "#" renders as plain text instead of a dead link. */
  href: string;
  handle: string;
  icon: "github" | "figma" | "linkedin";
};

const SOCIALS: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/ahmadRZ11",
    handle: "@ahmadRZ11",
    icon: "github",
  },
  {
    label: "Figma",
    href: "https://www.figma.com/files/team/908008780829111391/user/1354775796732053835?fuid=1354775796732053835",
    handle: "Design files",
    icon: "figma",
  },
];

export const SITE = {
  firstName: "AHMAD",
  lastName: "RAZA",

  /** Short form — used where space is tight, like the hero label. */
  role: "Design Engineer",
  /** Long form — metadata, the dossier and the footer. */
  roleFull: "Design Engineer & Frontend Developer",

  tagline: "Building digital worlds",
  email: "mirzaahmad7000@gmail.com",

  /** Shown in the hero HUD. */
  location: {
    city: "Miami",
    region: "FL",
    coords: "25.7617° N, 80.1918° W",
    /** IANA zone used by the live clock. */
    timeZone: "America/New_York",
  },

  availability: {
    open: true,
    label: "Available for work",
  },

  intro:
    "Design engineer and frontend developer with 2+ years building responsive, component-driven web apps in React, Next.js and TypeScript. I work at the seam between design and code — turning interface decisions into something fast, accessible, and alive in the details.",

  socials: SOCIALS,
} as const;

export const SECTIONS = [
  { id: "index", label: "Index", num: "00" },
  { id: "profile", label: "Profile", num: "01" },
  { id: "work", label: "Work", num: "02" },
  { id: "gallery", label: "Gallery", num: "03" },
  { id: "record", label: "Record", num: "04" },
  { id: "arsenal", label: "Arsenal", num: "05" },
  { id: "contact", label: "Contact", num: "06" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
