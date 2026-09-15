/**
 * The film layer: grain, vignette and a chromatic edge fringe over everything.
 *
 * Deliberately restrained — the point is to unify the palette and take the
 * digital edge off the gradients, not to look like broken VHS. CRT scanlines
 * used to be part of this and are not any more: a full-screen layer at z-90
 * puts them on the type as much as on the artwork, and striped headlines is
 * not the effect anyone wants.
 */
export default function Film() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-90">
      {/* Grain is the only blended layer left, and it now jitters ~2x a
          second instead of ~6x. Each step re-blends the whole viewport. */}
      <div className="absolute -inset-[6%] overflow-hidden">
        <div className="grain animate-grain absolute inset-0 opacity-5 mix-blend-overlay" />
      </div>

      {/* Vignette and the chromatic edge fringe stacked as backgrounds on one
          element — same picture, one composited layer instead of three. */}
      <div className="film-optics absolute inset-0" />
    </div>
  );
}
