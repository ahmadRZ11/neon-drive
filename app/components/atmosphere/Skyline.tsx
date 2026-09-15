import { buildSkyline, towersToPath, type Tower } from "../../lib/skyline";

const W = 1600;
const H = 420;

/* Generated once at module scope — pure functions of their seed, so the work
   happens when the module is first evaluated and never again. */
const FAR = buildSkyline({
  seed: 20260915,
  width: W,
  height: H,
  count: 30,
  minH: 90,
  maxH: 250,
  litness: 0.12,
});

const NEAR = buildSkyline({
  seed: 77813,
  width: W,
  height: H,
  count: 18,
  minH: 150,
  maxH: 350,
  litness: 0.5,
});

/**
 * The lit windows are ~400 individual rects. As JSX they became ~400 nodes
 * React had to hydrate on every load, for decoration that never changes and
 * never responds to anything. Emitting them as one markup string means React
 * treats each skyline as a single opaque node: same pixels, ~400 fewer nodes
 * to hydrate.
 *
 * The content is built entirely by our own seeded generator — there is no
 * external input anywhere in this string.
 */
function windowRects(towers: Tower[], colour: (o: number) => string, scale: number) {
  let out = "";
  for (const tower of towers) {
    for (const win of tower.windows) {
      out +=
        `<rect x="${win.x.toFixed(1)}" y="${win.y.toFixed(1)}" ` +
        `width="${win.w}" height="${win.h}" fill="${colour(win.o)}" ` +
        `opacity="${(win.o * scale).toFixed(2)}"/>`;
    }
  }
  return out;
}

const FAR_MARKUP =
  `<defs><linearGradient id="far-body" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0%" stop-color="#1b1d42" stop-opacity="0.88"/>` +
  `<stop offset="100%" stop-color="#0a0a1c" stop-opacity="0.98"/>` +
  `</linearGradient></defs>` +
  `<path d="${towersToPath(FAR, H)}" fill="url(#far-body)"/>` +
  windowRects(FAR, () => "#6df3ff", 0.4);

const NEAR_MARKUP =
  `<defs>` +
  `<linearGradient id="near-body" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0%" stop-color="#0d0d22"/>` +
  `<stop offset="100%" stop-color="#05050c"/>` +
  `</linearGradient>` +
  // Magenta-to-cyan rim light along the rooftops, sold as a city glow
  `<linearGradient id="near-rim" x1="0" y1="0" x2="1" y2="0">` +
  `<stop offset="0%" stop-color="#ff2d95" stop-opacity="0"/>` +
  `<stop offset="35%" stop-color="#ff2d95" stop-opacity="0.55"/>` +
  `<stop offset="70%" stop-color="#22e0ff" stop-opacity="0.45"/>` +
  `<stop offset="100%" stop-color="#22e0ff" stop-opacity="0"/>` +
  `</linearGradient>` +
  `</defs>` +
  `<path d="${towersToPath(NEAR, H)}" fill="url(#near-body)"/>` +
  `<path d="${towersToPath(NEAR, H)}" fill="none" stroke="url(#near-rim)" ` +
  `stroke-width="1.5" vector-effect="non-scaling-stroke"/>` +
  windowRects(NEAR, (o) => (o > 0.75 ? "#ffd36e" : "#6df3ff"), 0.8);

/**
 * Two parallax skyline bands. `preserveAspectRatio="none"` lets them stretch
 * to any viewport width without letterboxing — they are silhouettes, so the
 * horizontal distortion is invisible and the alternative (cropping) would cut
 * towers off at the edges.
 */
export function SkylineFar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
      className={className}
      dangerouslySetInnerHTML={{ __html: FAR_MARKUP }}
    />
  );
}

export function SkylineNear({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
      className={className}
      dangerouslySetInnerHTML={{ __html: NEAR_MARKUP }}
    />
  );
}
