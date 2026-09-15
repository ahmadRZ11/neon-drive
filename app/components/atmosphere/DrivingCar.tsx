/**
 * A car on the causeway, seen from behind, heading out toward the horizon.
 *
 * Geometry note, because the numbers look arbitrary otherwise. The road is a
 * single box laid flat with `rotateX(80deg)` about its own bottom edge. Under a
 * perspective of `p`, a plane rotated by θ converges at `p · cot(θ)` above its
 * origin — so with θ = 80° the vanishing point lands `0.1763p` up. The stage is
 * 11vh tall and sits on the bottom of the screen, which is exactly where
 * Atmosphere draws its horizon line, so `p = 11 / 0.1763 ≈ 62.4vh` puts the
 * vanishing point precisely on that line at every viewport height. Nothing here
 * needs a resize listener or a measurement.
 *
 * Everything animated is transform or opacity, and the animations are CSS, so
 * this costs the main thread nothing once the layers exist. `html.is-resizing`
 * switches all of it off while a zoom is in flight (see globals.css), and
 * reduce-motion parks each keyframe on a resting frame.
 */

/** Centre of the road, in viewport width. Kept clear of the sun at 66%. */
const ROAD_X = "42%";

/**
 * One tile of road. Every background layer shares this period, so the plane
 * loops by translating exactly this far and the seam is invisible.
 */
const TILE = "46px";

/**
 * The plane is only as wide as the road needs, not the whole viewport: 22%–62%,
 * centred on ROAD_X. It is 400vh tall, and at full width that is a texture the
 * size of four screens for a strip of road occupying a fifth of one. Narrowing
 * it cut the raster area by 60% for no visual difference at all.
 */
const PLANE_X = "22%";
const PLANE_W = "40%";

/* Deck and verges in one gradient: pink kerb on the left, cyan on the right,
   each with a soft bleed either side so they read as lit rather than drawn.
   Stops are in the plane's own width, so 50% here is ROAD_X on screen. */
const DECK =
  "linear-gradient(90deg," +
  "transparent 0 13.5%," +
  "rgb(255 92 157 / 0.16) 16%," +
  "rgb(255 92 157 / 0.95) 17.5%," +
  "rgb(255 92 157 / 0.16) 19%," +
  "rgb(30 20 54 / 0.75) 21.5%," +
  "rgb(30 20 54 / 0.75) 78.5%," +
  "rgb(34 224 255 / 0.16) 81%," +
  "rgb(34 224 255 / 0.95) 82.5%," +
  "rgb(34 224 255 / 0.16) 84%," +
  "transparent 86.5%)";

/** Centre line: lit for 12 of the 46px, dark for the rest. */
const DASH =
  "linear-gradient(180deg, rgb(244 236 230 / 0.85) 0 12px, transparent 12px)";

/**
 * Dissolves the far end into the horizon and the near end into the haze, so the
 * plane never shows an edge however tall the viewport is.
 */
const FADE =
  "linear-gradient(180deg, transparent 0%, rgb(0 0 0 / 0.12) 20%, #000 52%, #000 80%, transparent 100%)";

export default function DrivingCar() {
  return (
    <div
      aria-hidden
      className="dusk-layer pointer-events-none absolute inset-x-0 bottom-0 h-[24vh]"
      // Drawn past the night scrim, so it reads --dusk directly and goes with
      // the rest of the scene as the page turns to night.
      style={{ opacity: "calc(1 - var(--dusk) * 0.82)" }}
    >
      {/* ── the road ───────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[11vh] overflow-hidden opacity-90"
        style={{
          perspective: "62.4vh",
          perspectiveOrigin: `${ROAD_X} 100%`,
          maskImage: FADE,
          WebkitMaskImage: FADE,
        }}
      >
        <div
          className="road-plane absolute bottom-0 h-[400vh]"
          style={{
            left: PLANE_X,
            width: PLANE_W,
            transform: "rotateX(80deg)",
            backgroundImage: `${DASH},${DECK}`,
            backgroundSize: `6px ${TILE}, 100% ${TILE}`,
            backgroundPosition: "50% 0, 0 0",
            backgroundRepeat: "repeat-y",
          }}
        />

        {/* Oncoming headlights washing past and out of frame. */}
        <Streak left="40%" delay="0s" duration="5.4s" tint="rgb(255 179 138 / 0.85)" />
        <Streak left="44.5%" delay="2.6s" duration="6.2s" tint="rgb(34 224 255 / 0.75)" />
      </div>

      {/* ── the car ────────────────────────────────────────────────── */}
      <div
        className="car-rig absolute w-[clamp(92px,10.5vw,205px)]"
        style={{ left: ROAD_X, bottom: "7vh", transform: "translate3d(-50%,0,0)" }}
      >
        {/* Neon pooling on the road under the sills. Sits behind the body and
            breathes on its own cycle so it never beats with the tail lights. */}
        <div
          className="car-glow absolute inset-x-[-22%] bottom-[-14%] h-[42%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgb(255 45 149 / 0.55) 0%, rgb(139 61 255 / 0.28) 42%, rgb(34 224 255 / 0) 72%)",
          }}
        />
        <Car />
      </div>
    </div>
  );
}

function Streak({
  left,
  delay,
  duration,
  tint,
}: {
  left: string;
  delay: string;
  duration: string;
  tint: string;
}) {
  return (
    <div
      className="road-streak absolute bottom-[9.8vh] h-px w-[clamp(34px,4vw,74px)]"
      style={{
        left,
        animationDelay: delay,
        animationDuration: duration,
        background: `linear-gradient(90deg, transparent, ${tint}, transparent)`,
      }}
    />
  );
}

/**
 * The silhouette. An eighties wedge from behind — long tail, wide haunches,
 * full-width lamp cluster. Drawn from scratch: no marque, no badge, nothing
 * borrowed from a real car or a real game.
 *
 * Glows are radial-gradient fills, not SVG filters. A filter on a layer that
 * animates would force a repaint every frame; a gradient rasterises once.
 */
function Car() {
  return (
    <svg viewBox="0 0 200 110" className="relative block h-auto w-full">
      <defs>
        <linearGradient id="dcBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1b4e" />
          <stop offset="0.45" stopColor="#190c2b" />
          <stop offset="1" stopColor="#0a0518" />
        </linearGradient>
        <linearGradient id="dcGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a46a4" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1e0f30" stopOpacity="0.92" />
        </linearGradient>
        <radialGradient id="dcLamp">
          <stop offset="0" stopColor="#ff5c6e" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#ff2d3c" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff2d3c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tyres, just proud of the bodywork */}
      <path d="M30 96 V82 a11 10 0 0 1 22 0 V96 Z" fill="#07040f" />
      <path d="M148 96 V82 a11 10 0 0 1 22 0 V96 Z" fill="#07040f" />

      {/* cabin and rear glass */}
      <path d="M72 30 H128 L140 52 H60 Z" fill="url(#dcBody)" />
      <path d="M77 34 H123 L132 49 H68 Z" fill="url(#dcGlass)" />

      {/* spoiler */}
      <path d="M54 50 H146 V57 H54 Z" fill="#150a26" />
      <path d="M58 57 h5 v6 h-5 z M137 57 h5 v6 h-5 z" fill="#100720" />

      {/* body — flaring out toward the sills, the way a mid-engined car does */}
      <path
        d="M46 57 H154 L166 70 L170 88 Q170 93 165 93 H35 Q30 93 30 88 L34 70 Z"
        fill="url(#dcBody)"
      />

      {/* a single highlight along the shoulder keeps it from reading as a blob */}
      <path d="M48 58 H152 L154 61 H46 Z" fill="#ff5c9d" opacity="0.16" />

      <g className="tail-lamp">
        {/* bloom first, so the lamps sit inside their own light */}
        <ellipse cx="66" cy="71" rx="42" ry="17" fill="url(#dcLamp)" />
        <ellipse cx="134" cy="71" rx="42" ry="17" fill="url(#dcLamp)" />

        <rect x="44" y="67" width="44" height="8" rx="2" fill="#ff2d3c" />
        <rect x="112" y="67" width="44" height="8" rx="2" fill="#ff2d3c" />
        <rect x="46" y="69" width="40" height="3" rx="1.5" fill="#ff8a94" opacity="0.85" />
        <rect x="114" y="69" width="40" height="3" rx="1.5" fill="#ff8a94" opacity="0.85" />
        {/* the strip that joins them, dimmer than the clusters */}
        <rect x="88" y="69.5" width="24" height="3" rx="1.5" fill="#ff2d3c" opacity="0.45" />
      </g>

      {/* diffuser and exhausts */}
      <path d="M78 83 H122 V92 H78 Z" fill="#0a0518" />
      <path d="M85 85 h2 v6 h-2 z M99 85 h2 v6 h-2 z M113 85 h2 v6 h-2 z" fill="#2a1840" />
      <circle cx="90" cy="87" r="2.4" fill="#ff7a2f" opacity="0.55" />
      <circle cx="110" cy="87" r="2.4" fill="#ff7a2f" opacity="0.55" />

      {/* underbody strip — the cyan half of the underglow, on the car itself */}
      <path d="M36 91 H164 L166 94 H34 Z" fill="#22e0ff" opacity="0.42" />
    </svg>
  );
}
