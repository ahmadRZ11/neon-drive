export type GalleryImage = {
  /**
   * Path under /public. Referenced as a string rather than a static import on
   * purpose: a missing static import fails the build, whereas a missing path
   * just fails to load and the tile falls back to generated artwork. That is
   * what keeps the grid from ever looking broken while you swap images.
   */
  src: string;
  /** Shown as the lightbox caption. */
  title: string;
  alt: string;
  /** Theme token names used by the fallback tile when the file is missing. */
  accent: { from: string; to: string };
};

/**
 * Swap these freely — drop a file in /public/images and point `src` at it.
 * Anything that fails to load renders a neon placeholder with its title.
 */
export const GALLERY: GalleryImage[] = [
  {
    src: "/images/neon-skyline-sun.jpg",
    title: "Sundown Over the Bay",
    alt: "Neon city skyline silhouetted against an oversized magenta sun",
    accent: { from: "magenta", to: "electric" },
  },
  {
    src: "/images/neon-street-night.jpg",
    title: "Ocean Drive, 2AM",
    alt: "Empty street at night lit by neon storefronts",
    accent: { from: "cyan", to: "violet" },
  },
  {
    src: "/images/outrun-car-sun.jpg",
    title: "Outrun",
    alt: "Retro car on an open road heading toward a low, oversized sun",
    accent: { from: "orange", to: "magenta" },
  },
  {
    src: "/images/causeway-water-dusk.jpg",
    title: "The Causeway",
    alt: "Causeway crossing still water at dusk, city lights reflected below",
    accent: { from: "cyan", to: "navy" },
  },
  {
    src: "/images/vector-city-night.jpg",
    title: "Downtown, Moonlit",
    alt: "Illustrated waterfront skyline at night under a full moon",
    accent: { from: "electric", to: "cyan" },
  },
  {
    src: "/images/hazy-city-magenta.jpg",
    title: "Heat Haze",
    alt: "Cityscape dissolving into heavy magenta haze",
    accent: { from: "magenta", to: "violet" },
  },
  {
    src: "/images/palms-grid-dusk.jpg",
    title: "Palms at Dusk",
    alt: "Palm silhouettes against a deep violet dusk sky",
    accent: { from: "violet", to: "peach" },
  },
  {
    src: "/images/strip-yellow-car.jpg",
    title: "The Strip",
    alt: "Yellow sports car on a palm-lined strip at golden hour",
    accent: { from: "gold", to: "orange" },
  },
];
