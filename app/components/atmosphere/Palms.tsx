import { FROND_ANGLES, frondPath } from "../../lib/skyline";

type PalmProps = {
  /** Trunk lean in degrees; negative leans left. */
  lean?: number;
  height?: number;
  frondLength?: number;
  className?: string;
};

/**
 * Builds one palm as a markup string.
 *
 * Same reasoning as the skyline: a palm is ~22 nodes of pure decoration, and
 * four of them on a client-rendered backdrop is ~90 nodes React would
 * otherwise hydrate for something that never changes. Every value here comes
 * from our own geometry helpers — there is no external input in this string.
 */
function palmMarkup(lean: number, height: number, frondLength: number) {
  const crownX = 26;
  const crownY = 40;

  const trunk =
    `M-10,${height} C-5,${height * 0.66} 8,${height * 0.36} ${crownX - 8},${crownY + 6} ` +
    `L${crownX + 9},${crownY + 10} C${crownX - 2},${height * 0.4} 8,${height * 0.7} 8,${height} Z`;

  // Trunk rings — barely visible, but they kill the "flat vector" look
  let rings = "";
  for (let i = 0; i < 9; i++) {
    const t = 0.28 + i * 0.075;
    rings +=
      `<ellipse cx="${(crownX * t + 2).toFixed(2)}" ` +
      `cy="${(height - (height - crownY) * t).toFixed(2)}" ` +
      `rx="${(7 - t * 2).toFixed(2)}" ry="1.6" fill="#05050c" opacity="0.25"/>`;
  }

  let fronds = "";
  FROND_ANGLES.forEach((angle, i) => {
    const scale = i % 2 === 0 ? 1 : 0.84;
    fronds +=
      `<path d="${frondPath(frondLength * scale, 26 * scale, 30 + (i % 3) * 9)}" ` +
      `fill="currentColor" transform="rotate(${angle})"/>`;
  });

  return (
    `<g transform="rotate(${lean} 0 ${height})">` +
    `<path d="${trunk}" fill="currentColor"/>` +
    rings +
    `<g transform="translate(${crownX} ${crownY})">` +
    fronds +
    `<circle cx="2" cy="6" r="4" fill="currentColor"/>` +
    `<circle cx="9" cy="9" r="3.4" fill="currentColor"/>` +
    `</g></g>`
  );
}

/**
 * A palm silhouette built from curves rather than an image file — it stays
 * crisp at any size, costs no request, and recolours with `currentColor`.
 */
function Palm({ lean = 6, height = 300, frondLength = 96, className = "" }: PalmProps) {
  return (
    <svg
      viewBox={`-140 0 300 ${height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      className={className}
      dangerouslySetInnerHTML={{ __html: palmMarkup(lean, height, frondLength) }}
    />
  );
}

/**
 * Foreground palms. Near-black so they sit in front of the city glow, one on
 * each side, pared back on small screens where they would crowd the content.
 */
export default function Palms() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-3 h-[32vh]">
      <Palm
        lean={-9}
        height={320}
        frondLength={104}
        className="absolute bottom-0 left-[-7%] h-[88%] w-auto text-ink opacity-95 max-md:left-[-18%] max-md:h-[62%]"
      />
      <Palm
        lean={7}
        height={300}
        frondLength={88}
        className="absolute bottom-0 left-[9%] hidden h-[58%] w-auto text-ink opacity-75 lg:block"
      />
      <Palm
        lean={9}
        height={330}
        frondLength={110}
        className="absolute bottom-0 right-[-12%] h-[80%] w-auto -scale-x-100 text-ink opacity-95 max-md:right-[-22%] max-md:h-[60%]"
      />
      <Palm
        lean={-6}
        height={290}
        frondLength={84}
        className="absolute bottom-0 right-[11%] hidden h-[54%] w-auto -scale-x-100 text-ink opacity-75 lg:block"
      />
    </div>
  );
}
