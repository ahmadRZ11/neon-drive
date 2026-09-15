/**
 * Seeded PRNG. Procedural art on this site must be deterministic: the server
 * and the client have to produce identical markup or React reports a
 * hydration mismatch. Math.random() cannot be used for anything rendered.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A star field expressed as stacked radial-gradients — one paint, no DOM. */
export function buildStarField(seed: number, count: number, maxY = 64) {
  const rand = mulberry32(seed);
  const layers: string[] = [];

  for (let i = 0; i < count; i++) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * maxY).toFixed(2);
    const size = rand() > 0.88 ? 1.7 : 1;
    const opacity = (0.3 + rand() * 0.7).toFixed(2);
    layers.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgb(244 236 230 / ${opacity}), transparent)`
    );
  }

  return layers.join(",");
}
