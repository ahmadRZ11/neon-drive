import type { Media } from "./media";
import { SHOTS } from "./media";

/**
 * `image` picks a cover from the media catalogue in ./media.ts. Set it to
 * null and the project falls back to its generated `motif` artwork.
 *
 * Every project now carries a real screenshot of the shipped thing, so the
 * generated artwork is a fallback rather than a design choice — set `image`
 * to null and the `motif` cover takes over.
 */
export type CoverMotif = "grid" | "rain" | "wave" | "orbit" | "static" | "sun";

export type Project = {
  id: string;
  num: string;
  title: string;
  category: string;
  role: string;
  /** Omitted where the shipping date is not known. */
  year?: string;
  stack: string[];
  description: string;
  /** Live deployment. "#" renders the link disabled. */
  live: string;
  /** Source repository. "#" renders the link disabled. */
  code: string;
  /** null falls back to the generated `motif` cover. */
  image: Media | null;
  motif: CoverMotif;
  /** Tailwind token names used by the generated cover. */
  accent: { from: string; to: string };
};

const GH = "https://github.com/ahmadRZ11";

export const PROJECTS: Project[] = [
  {
    id: "portfolio-os",
    num: "01",
    title: "PortfolioOS",
    category: "Interactive Portfolio",
    role: "Design & Build",
    year: "2025",
    stack: ["Next.js", "Supabase", "TypeScript"],
    description:
      "A portfolio disguised as a desktop operating system — eleven projects, a resume and a working command prompt, all behind draggable windows and persistent state.",
    live: "https://xp-portfolio-ivory.vercel.app/",
    code: "#",
    image: SHOTS["portfolio-os"],
    motif: "grid",
    accent: { from: "cyan", to: "electric" },
  },
  {
    id: "matrix",
    num: "02",
    title: "Matrix Portfolio",
    category: "Experimental",
    role: "Design & Build",
    year: "2025",
    stack: ["Next.js", "Canvas", "TypeScript"],
    description:
      "A terminal you can actually type into, behind a canvas rain field tuned to stay readable. Commands resolve to real portfolio content.",
    live: "https://matrix-portfolio-kappa.vercel.app/",
    code: `${GH}/matrix-portfolio`,
    image: SHOTS["matrix"],
    motif: "rain",
    accent: { from: "aqua", to: "violet" },
  },
  {
    id: "ocean",
    num: "03",
    title: "Ocean Portfolio",
    category: "Design Portfolio",
    role: "Design & Build",
    year: "2025",
    stack: ["Next.js", "TypeScript"],
    description:
      "Selected design work across branding, digital, print and visual communication — presented as an underwater dive rather than a grid of thumbnails.",
    live: "https://ocean-portfolio-seven.vercel.app/",
    code: `${GH}/ocean-portfolio`,
    image: SHOTS["ocean"],
    motif: "wave",
    accent: { from: "cyan", to: "navy" },
  },
  {
    id: "aria-os",
    num: "04",
    title: "ARIA.OS",
    category: "Motion Interface",
    role: "Design & Build",
    year: "2026",
    stack: ["Next.js", "Motion", "TypeScript"],
    description:
      "A heads-up display portfolio — concentric readouts, live telemetry panels, and a boot sequence built entirely from layout animation.",
    live: "https://aria-os-mauve.vercel.app/",
    code: `${GH}/aria-os`,
    image: SHOTS["aria-os"],
    motif: "orbit",
    accent: { from: "electric", to: "magenta" },
  },
  {
    id: "the-altar",
    num: "05",
    title: "The Altar",
    category: "Audio Experience",
    role: "Design & Build",
    year: "2026",
    stack: ["Next.js", "Web Audio", "Canvas"],
    description:
      "An immersive, room-by-room horror piece scored with the Web Audio API, where proximity drives the mix. Tension is built with sound design, not jump scares.",
    live: "https://horror-site-nine.vercel.app/",
    code: `${GH}/horror-site`,
    image: SHOTS["the-altar"],
    motif: "static",
    accent: { from: "magenta", to: "violet" },
  },
  {
    id: "catch-me",
    num: "06",
    title: "Catch Me If You Can",
    category: "Micro-Interaction",
    role: "Design & Build",
    year: "2024",
    stack: ["JavaScript", "CSS"],
    description:
      "A login form whose submit button dodges the cursor — a small study in easing curves, hit-testing, and knowing when to finally let the user win.",
    live: "https://runaway-form.vercel.app/",
    code: `${GH}/runaway-form`,
    image: SHOTS["catch-me"],
    motif: "sun",
    accent: { from: "orange", to: "magenta" },
  },

  {
    id: "cachely",
    num: "07",
    title: "Cachely",
    category: "Storefront",
    role: "Design & Build",
    stack: ["React 19", "TanStack Query", "shadcn/ui"],
    description:
      "A storefront built to get server state right: TanStack Query v5 for caching and invalidation, with the UI layer kept deliberately dumb.",
    live: "https://cachely.vercel.app/",
    code: `${GH}/yt-react-query-before`,
    image: SHOTS["cachely"],
    motif: "grid",
    accent: { from: "cyan", to: "electric" },
  },
  {
    id: "dispatch",
    num: "08",
    title: "Dispatch",
    category: "Editorial",
    role: "Design & Build",
    stack: ["React", "TanStack Query", "Tailwind CSS"],
    description:
      "A reading-first editorial front end — typography and measure decided before anything else, with data fetching kept out of the way.",
    live: "https://dispatch-tan-xi.vercel.app/",
    code: "#",
    image: SHOTS["dispatch"],
    motif: "static",
    accent: { from: "peach", to: "magenta" },
  },
  {
    id: "sapros-quest",
    num: "09",
    title: "Sapros Quest",
    category: "Dashboard",
    role: "Frontend",
    stack: ["Next.js", "React"],
    description:
      "A user dashboard for the Sapros Quest platform — account state, activity and settings in one console.",
    live: "https://adsparo-user-dashboard.vercel.app/",
    code: `${GH}/adsparo-user-dashboard`,
    image: SHOTS["sapros-quest"],
    motif: "orbit",
    accent: { from: "electric", to: "cyan" },
  },
  {
    id: "event-console",
    num: "10",
    title: "Event Console",
    category: "Admin Tool",
    role: "Frontend",
    stack: ["Next.js", "React"],
    description:
      "An operations console for managing event inquiries, locations, users and attributes — dense tables, filters, and forms that stay usable at volume.",
    live: "https://ondigitalocean-app-main.vercel.app/",
    code: `${GH}/ondigitalocean.app-main`,
    image: SHOTS["event-console"],
    motif: "grid",
    accent: { from: "cyan", to: "violet" },
  },
  {
    id: "tech-people",
    num: "11",
    title: "TechPeople",
    category: "Publication",
    role: "Design & Build",
    stack: ["Astro"],
    description:
      "A blog about hardware, web security, VR and developer tooling. Astro because a reading site should ship almost no JavaScript.",
    live: "https://tech-people-astro-js.vercel.app/",
    code: "#",
    image: SHOTS["tech-people"],
    motif: "rain",
    accent: { from: "aqua", to: "navy" },
  },
  {
    id: "frau-katrina",
    num: "12",
    title: "Frau Katrina",
    category: "Client Site",
    role: "Design & Build",
    stack: ["Astro"],
    description:
      "A content site built on Astro, with the editorial layout and the blog sharing one component system.",
    live: "https://frau-katrina-blog-astro-js-project.vercel.app/",
    code: `${GH}/Frau-Katrina-Blog-Astro-Js-Project`,
    image: SHOTS["frau-katrina"],
    motif: "wave",
    accent: { from: "peach", to: "violet" },
  },
  {
    id: "ecommerce",
    num: "13",
    title: "Online Store",
    category: "E-commerce",
    role: "Frontend",
    stack: ["React"],
    description:
      "A storefront covering the full path — catalogue, product detail, cart and checkout — built to practise state that spans routes.",
    live: "https://online-ecommerce-store-ruddy.vercel.app/",
    code: `${GH}/online_ecommerce_store`,
    image: SHOTS["ecommerce"],
    motif: "sun",
    accent: { from: "orange", to: "gold" },
  },
  {
    id: "todays-list",
    num: "14",
    title: "Today's List",
    category: "Utility",
    role: "Design & Build",
    stack: ["JavaScript"],
    description:
      "A to-do app kept deliberately small: no framework, persistent state, and every interaction reachable from the keyboard.",
    live: "https://to-do-list-drab-five-70.vercel.app/",
    code: "#",
    image: SHOTS["todays-list"],
    motif: "static",
    accent: { from: "cyan", to: "magenta" },
  },
];
