import type { StaticImageData } from "next/image";

/* ── atmosphere: the Miami plates behind the page ─────────────────────── */
import palmRoadSunset from "../../public/images/palm-road-sunset.jpg";
import miamiBaysideSunset from "../../public/images/miami-bayside-sunset.jpg";
import supercarOverlook from "../../public/images/supercar-overlook.jpg";
import driverSunSilhouette from "../../public/images/driver-sun-silhouette.jpg";
import oceanDriveDusk from "../../public/images/ocean-drive-dusk.jpg";

/* ── project screenshots: the actual work ─────────────────────────────── */
import portfolioOsShot from "../../public/projects/portfolio-os.jpg";
import matrixShot from "../../public/projects/matrix.jpg";
import oceanShot from "../../public/projects/ocean.jpg";
import ariaOsShot from "../../public/projects/aria-os.jpg";
import theAltarShot from "../../public/projects/the-altar.jpg";
import catchMeShot from "../../public/projects/catch-me.jpg";
import cachelyShot from "../../public/projects/cachely.jpg";
import dispatchShot from "../../public/projects/dispatch.jpg";
import saprosQuestShot from "../../public/projects/sapros-quest.png";
import eventConsoleShot from "../../public/projects/event-console.png";
import techPeopleShot from "../../public/projects/tech-people.jpg";
import frauKatrinaShot from "../../public/projects/frau-katrina.jpg";
import ecommerceShot from "../../public/projects/ecommerce.jpg";
import todaysListShot from "../../public/projects/todays-list.jpg";

/**
 * Every image the site renders, imported statically rather than referenced by
 * path. Static imports give Next the intrinsic dimensions (so nothing shifts
 * while loading) and a generated blurDataURL, which is what lets
 * `placeholder="blur"` work without hand-authoring one per file.
 *
 * `alt` lives here too, so the description travels with the asset instead of
 * being retyped at every call site.
 */
export type Media = { src: StaticImageData; alt: string };

/**
 * Atmospheric plates. These are decorative backdrops — the hero cloud bank,
 * the two section interstitials, the contact backdrop and the About dossier.
 *
 * The six Miami photographs that used to stand in as project covers were
 * dropped once real screenshots arrived; the files are still in
 * /public/images if you want them back.
 */
export const MEDIA = {
  palmRoadSunset: {
    src: palmRoadSunset,
    alt: "Palm-lined road under a burning pink and orange sunset",
  },
  miamiBaysideSunset: {
    src: miamiBaysideSunset,
    alt: "Miami waterfront promenade beneath a dramatic sunset sky",
  },
  supercarOverlook: {
    src: supercarOverlook,
    alt: "Sports car parked on a ridge overlooking a city at sunset",
  },
  driverSunSilhouette: {
    src: driverSunSilhouette,
    alt: "Figure walking toward a parked car, silhouetted against a low sun",
  },
  oceanDriveDusk: {
    src: oceanDriveDusk,
    alt: "Palm-lined art deco strip glowing at dusk",
  },
} as const satisfies Record<string, Media>;

export type MediaKey = keyof typeof MEDIA;

/**
 * Project covers. Keyed by project id so the mapping is impossible to get
 * wrong, and every one is a real screenshot of the shipped thing — these are
 * content, not decoration, so they carry descriptive alt text.
 */
export const SHOTS = {
  "portfolio-os": {
    src: portfolioOsShot,
    alt: "Screenshot: a Windows XP desktop with a Read Me window open over the classic hillside wallpaper",
  },
  matrix: {
    src: matrixShot,
    alt: "Screenshot: green digital rain behind an ASCII portrait and an interactive shell",
  },
  ocean: {
    src: oceanShot,
    alt: "Screenshot: an underwater portfolio title screen reading PORTFOLIO, available for hire",
  },
  "aria-os": {
    src: ariaOsShot,
    alt: "Screenshot: a cyan heads-up display with concentric readouts, skill meters and a project list",
  },
  "the-altar": {
    src: theAltarShot,
    alt: "Screenshot: the entry screen of a horror experience, a dripping red title on black",
  },
  "catch-me": {
    src: catchMeShot,
    alt: "Screenshot: a yellow sign-in screen warning that the button has trust issues with empty fields",
  },
  cachely: {
    src: cachelyShot,
    alt: "Screenshot: a storefront hero reading 'Nearly 200 products, one search box' above category chips",
  },
  dispatch: {
    src: dispatchShot,
    alt: "Screenshot: an editorial front page with a lead story, section filters and a story grid",
  },
  "sapros-quest": {
    src: saprosQuestShot,
    alt: "Screenshot: an account management page with profile fields beside a user details sidebar",
  },
  "event-console": {
    src: eventConsoleShot,
    alt: "Screenshot: a management dashboard with user, location and inquiry stat cards",
  },
  "tech-people": {
    src: techPeopleShot,
    alt: "Screenshot: a technology blog showing a grid of tagged article cards",
  },
  "frau-katrina": {
    src: frauKatrinaShot,
    alt: "Screenshot: a personal blog homepage with three linked cards and a featured posts list",
  },
  ecommerce: {
    src: ecommerceShot,
    alt: "Screenshot: an e-commerce homepage with a hero banner and shop navigation",
  },
  "todays-list": {
    src: todaysListShot,
    alt: "Screenshot: a dark to-do app with a completion progress bar and filter tabs",
  },
} as const satisfies Record<string, Media>;
