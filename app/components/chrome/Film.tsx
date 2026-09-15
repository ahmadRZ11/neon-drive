/**
 * The film layer: grain, scanlines and vignette over everything.
 *
 * Deliberately restrained — the point is to unify the palette and take the
 * digital edge off the gradients, not to look like broken VHS.
 *
 * Two layers, not four: grain is blended and therefore animated as slowly as
 * it can be while still reading as film, and the scanlines, vignette and
 * chromatic edge fringe are stacked backgrounds on a single element.
 */
export default function Film() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-90">
      {/* Grain is the only blended layer left, and it now jitters ~2x a
          second instead of ~6x. Each step re-blends the whole viewport. */}
      <div className="absolute -inset-[6%] overflow-hidden">
        <div className="grain animate-grain absolute inset-0 opacity-5 mix-blend-overlay" />
      </div>

      {/* Scanlines, vignette and the chromatic edge fringe stacked as three
          backgrounds on one element — same picture, one composited layer
          instead of three. */}
      <div className="film-optics absolute inset-0" />
    </div>
  );
}
