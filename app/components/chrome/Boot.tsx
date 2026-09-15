/**
 * The opening cut.
 *
 * Driven entirely by CSS keyframes, deliberately: an opaque full-screen veil
 * that waits on JavaScript is a single point of failure that can leave the
 * whole site as a black rectangle. This clears itself even if no script ever
 * runs, and the global reduce-motion rule collapses it to ~0ms.
 */
export default function Boot() {
  return (
    <div aria-hidden className="boot-veil pointer-events-none fixed inset-0 z-110 bg-ink">
      <div className="boot-mark absolute inset-0 flex flex-col items-center justify-center gap-4">
        <span className="hud text-hud text-magenta">Entering</span>
        <span className="display text-4xl text-bone">Ahmad Raza</span>
        <span className="boot-bar block h-px w-28 origin-left bg-linear-to-r from-magenta to-cyan" />
      </div>
    </div>
  );
}
