import { mulberry32 } from "./rand";

/**
 * Deterministic generators for the skyline silhouettes.
 *
 * Seeded on purpose: the server and the client must produce byte-identical
 * markup or React throws a hydration mismatch. Math.random() would.
 */


export type Tower = {
  x: number;
  w: number;
  h: number;
  /** Art-deco stepped crown, needle antenna, or a flat slab. */
  cap: "step" | "spire" | "flat";
  windows: { x: number; y: number; w: number; h: number; o: number }[];
};

type Options = {
  seed: number;
  width: number;
  height: number;
  count: number;
  minH: number;
  maxH: number;
  /** 0 = no lit windows (far layer), 1 = fully lit (near layer). */
  litness: number;
};

export function buildSkyline({
  seed,
  width,
  height,
  count,
  minH,
  maxH,
  litness,
}: Options): Tower[] {
  const rand = mulberry32(seed);
  const towers: Tower[] = [];

  // Walk left to right with slight overlap so the block reads as a city
  // mass rather than a row of separated teeth.
  let x = -20;
  for (let i = 0; i < count; i++) {
    const w = 34 + rand() * 78;
    const h = minH + rand() * (maxH - minH);
    const capRoll = rand();
    const cap: Tower["cap"] = capRoll > 0.82 ? "spire" : capRoll > 0.5 ? "step" : "flat";

    const windows: Tower["windows"] = [];
    if (litness > 0) {
      const cols = Math.max(2, Math.floor(w / 15));
      const rows = Math.max(3, Math.floor(h / 22));
      const cw = 5;
      const ch = 7;
      const padX = (w - cols * 11) / 2;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Lights thin out toward the top: upper floors read as emptier.
          const heightFactor = 0.45 + (r / rows) * 0.55;
          if (rand() > litness * heightFactor) continue;
          windows.push({
            x: x + padX + c * 11 + 3,
            y: height - h + 14 + r * 18,
            w: cw,
            h: ch,
            o: 0.25 + rand() * 0.75,
          });
        }
      }
    }

    towers.push({ x, w, h, cap, windows });
    x += w - 4 - rand() * 10;
    if (x > width) break;
  }

  return towers;
}

/** Union of every tower body as one path string — keeps the DOM tiny. */
export function towersToPath(towers: Tower[], baseY: number): string {
  let d = "";

  for (const t of towers) {
    const top = baseY - t.h;

    if (t.cap === "step") {
      const inset = t.w * 0.18;
      const step = 14;
      d +=
        `M${t.x},${baseY} L${t.x},${top + step * 2} ` +
        `L${t.x + inset},${top + step * 2} L${t.x + inset},${top + step} ` +
        `L${t.x + inset * 1.5},${top + step} L${t.x + inset * 1.5},${top} ` +
        `L${t.x + t.w - inset * 1.5},${top} L${t.x + t.w - inset * 1.5},${top + step} ` +
        `L${t.x + t.w - inset},${top + step} L${t.x + t.w - inset},${top + step * 2} ` +
        `L${t.x + t.w},${top + step * 2} L${t.x + t.w},${baseY} Z `;
    } else if (t.cap === "spire") {
      const mid = t.x + t.w / 2;
      d +=
        `M${t.x},${baseY} L${t.x},${top} L${mid - 3},${top} ` +
        `L${mid - 3},${top - 34} L${mid - 1},${top - 52} L${mid + 1},${top - 52} ` +
        `L${mid + 3},${top - 34} L${mid + 3},${top} ` +
        `L${t.x + t.w},${top} L${t.x + t.w},${baseY} Z `;
    } else {
      d += `M${t.x},${baseY} L${t.x},${top} L${t.x + t.w},${top} L${t.x + t.w},${baseY} Z `;
    }
  }

  return d.trim();
}

/**
 * A palm frond drawn as a closed curve — out along the top edge, back along
 * the underside. `droop` bends the tip down; `span` is its thickness.
 */
export function frondPath(length: number, span: number, droop: number): string {
  return (
    `M0,0 ` +
    `C${length * 0.3},${-span * 0.85} ${length * 0.72},${-span * 0.6} ${length},${droop} ` +
    `C${length * 0.74},${droop - span * 0.12} ${length * 0.36},${span * 0.42} 0,0 Z`
  );
}

export const FROND_ANGLES = [-168, -140, -112, -84, -56, -28, -4, 22, 48] as const;
