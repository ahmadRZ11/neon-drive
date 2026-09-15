# Ahmad Raza — Frontend Developer

A portfolio art-directed as **1980s Miami at night**: a layered sunset-to-midnight
sky, a procedural skyline, palm silhouettes, WebGL embers, and a HUD-inspired
interface language, with photographic plates carrying the project covers and
section breaks.

> Original work. No Rockstar/GTA logos, characters, UI or assets are used —
> the era and atmosphere are the reference, the identity is your own.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

## Stack

| Tech | Version | Role here |
| --- | --- | --- |
| Next.js | 14 (App Router) | Framework; the page is fully static |
| Tailwind CSS | 4 | All styling, CSS-first `@theme` — no config file |
| Motion | 13 | State- and pointer-driven UI animation |
| GSAP | 3 | Scroll choreography, SplitText, timelines |
| Three.js + R3F | r186 / v8 | Hero ember field |
| Lenis | 1 | Smooth scrolling, synced to the GSAP ticker |
| sharp | 0.35 | Image optimisation (Next requires it in production) |
| shadcn/ui | — | Button, Card, Badge, Separator — copied in, not a dependency |
| lucide-react | 1 | Every icon on the page |
| yet-another-react-lightbox | 3 | Gallery preview, with Zoom/Thumbnails/Captions |

**Type:** Pricedown (display), Rage Italic + Signature (script accents), Bebas
Neue (HUD labels), Space Grotesk (body). See `public/fonts/README.md` — it
covers the metrics, the minifier trap, and a licensing flag on Rage Italic.

## Layout

```
app/
  layout.tsx            next/font — 3 local display faces + 2 Google text faces
  page.tsx              composition
  globals.css           design tokens, custom @utility, the sky system
  data/
    gallery.ts          the gallery images, as swappable paths
    media.ts            every image, statically imported with alt text
    site.ts             name, role, location, socials
    projects.ts         the projects, their links and their covers
    experience.ts       career timeline
    skills.ts           technologies, levels, related projects
  lib/
    utils.ts            cn() — tailwind-merge taught about the custom scale
    palette.ts          theme token -> hex, for SVG and generated gradients
    lenis.ts            handle on the scroller, so overlays can park it
    gsap.ts             one-time plugin registration + reduce-motion helper
    hooks.ts            media queries, scroll spy, the heavy-effects gate
    rand.ts             seeded PRNG (procedural art must be deterministic)
    skyline.ts          skyline + palm frond geometry generators
  components/
    atmosphere/         Atmosphere, Skyline, Palms, DrivingCar, SpeedLines,
                        HeroScene (R3F), mount gate
    chrome/             Nav, Footer, Film, Boot
    providers/          SmoothScroll (Lenis ↔ GSAP ↔ ScrollTrigger)
    sections/           Hero, About, Work, ProjectRow, ProjectCover, Gallery,
                        Experience, Skills, Contact
    ui/                 shadcn primitives (button, card, badge, separator)
                        + MagneticButton, Reveal, SectionHeader, Counter,
                        SegmentMeter, Marquee, LiveClock, Interstitial
```

## The ideas worth knowing

**One number drives the whole page.** `--dusk` goes 0 → 1 over the first ~1.2
viewports, taking the sky from Miami sunset to deep night. The sun sinks, stars
arrive, the horizon cools, and a scrim recedes the entire backdrop so body copy
always has contrast to sit on. Everything time-of-day reads that one variable in
CSS rather than being animated separately.

**The libraries do not overlap.** They each own a lane:
Tailwind owns every style; Motion owns state/pointer interaction (nav, cursor,
magnetic buttons, the skills panel); GSAP owns anything tied to scroll position
or needing a sequence; Three.js owns the hero ember field only and never touches
layout.

**Covers are screenshots of the shipped work.** All fourteen, at the exact
aspect ratio of the frame so nothing is cropped. The film treatment on them is
much lighter than on the decorative plates — a cover whose job is to show an
interface has to stay readable.

**Photographs sit inside the palette, not on top of it.** The atmospheric
plates — hero clouds, interstitials, contact backdrop — get an accent gradient
on overlay, a darkening ramp, grain and a vignette, so they read as
art-directed rather than dropped in.

**The generated art is still there as the fallback.** The skyline and palms are
always procedural, and any project whose `image` is null falls back to its own
generated motif (stacked OS windows, code rain, ripples, an orbital HUD, torn
static, a striped sun). All of it is seeded with a fixed PRNG, because server
and client must produce identical markup or React reports a hydration mismatch.

**The display face does all the talking; two others keep it readable.**
Pricedown carries every headline, but it is unusable below ~16px, so Bebas Neue
holds the HUD micro-labels and Space Grotesk holds body copy. The two brush
scripts appear exactly three times between them.

**Particles cost one draw call.** Drift, wrap and twinkle happen in the vertex
shader, so the CPU never touches a position.

## Gallery

`sections/Gallery.tsx` — a Motion grid over
[`app/data/gallery.ts`](app/data/gallery.ts), with
yet-another-react-lightbox for the full-size preview (Zoom, Thumbnails and
Captions plugins; keyboard, swipe, Esc and backdrop-close come built in).

Two things worth knowing:

**The image paths are strings, not static imports.** Everywhere else in this
project images are statically imported, which is better — but a missing static
import fails the build. Here a missing file just fails to load, `onError`
catches it, and the tile falls back to generated neon artwork with the title on
it. That is what lets you swap images in `gallery.ts` without ever breaking the
page. Failed images are also dropped from the lightbox slides, so you can never
page into a broken frame.

**The lightbox has to park Lenis.** It locks the body itself, but Lenis drives
scrolling from its own rAF loop and would keep moving the page behind the
backdrop. `lib/lenis.ts` holds the instance so the gallery can stop and start
it around the overlay.

Theming lives in `globals.css` under `.yarl__root.neon-lightbox`. The doubled
selector is deliberate: the library's stylesheet is imported from a component,
so it lands after globals and a single class would lose on source order.

## The drive

Two pieces give the backdrop its motion, and both are in
[`components/atmosphere/`](app/components/atmosphere/).

**`DrivingCar`** is a causeway running to the horizon with a car on it, seen
from behind. The road is one element: deck, both kerbs and the centre dashes
are background layers on a single box laid flat with `rotateX(80deg)`, and all
of them tile on the same 46px period — so the road "runs" by translating the
plane exactly one period, forever, with no seam and nothing to repaint.

The perspective is arithmetic rather than art direction. A plane rotated by θ
converges at `p · cot(θ)` above its origin, so `perspective: 62.4vh` with
`rotateX(80deg)` puts the vanishing point on `bottom: 11vh` — exactly where
`Atmosphere` draws its horizon line — at every viewport height, with no resize
listener and no measurement.

The car is drawn, not photographed: an eighties wedge silhouette in plain SVG,
with radial-gradient glows rather than SVG filters, because a filter on a layer
that animates repaints every frame and a gradient rasterises once. It bobs by
1.5px and its lamps breathe on a different cycle to the underglow, which is
about as much as a shape that size can take before it looks like a boat.

It is drawn *after* the haze, unlike the rest of the scene. The haze is 85%
black along the bottom edge, which is precisely where the road is, and
underneath it the whole thing was a smudge. Being past the night scrim too, it
reads `--dusk` itself to fade out as the page turns to night.

**`SpeedLines`** is ten thin streaks that show up in proportion to how fast the
page is moving. Scroll velocity goes through a spring — raw velocity is spiky
enough that a single wheel notch reads as a few thousand px/s for one frame —
and the result drives opacity and `scaleY` as Motion values, so scrolling never
re-renders a component; it writes transforms straight to the compositor. A
horizontal mask keeps the middle 20% of the screen clear so body copy is never
read through a moving streak.

It mounts after hydration on purpose. Motion writes the transform inline, the
scroll may already have moved by the time React hydrates, and `useReducedMotion`
only resolves on the client — all three are hydration mismatches, and none of it
belongs in the initial HTML when the streaks are invisible at rest anyway.

Under reduce-motion the streaks do not render at all and every car keyframe
parks on a resting frame, so the scene is still there, just still.

## Zoom and resize

Browser zoom changes the CSS viewport width, which used to cross the
`min-width: 1024px` check behind the WebGL gate — unmounting the R3F canvas
and destroying its context, then rebuilding it on the way back. Repeated
context creation is what froze the page while zooming.

Three things keep it smooth now:

- **The heavy-effects gate is sticky.** `useCanRunHeavyEffects` can turn on
  (a genuinely resized window should get the scene) but never off, so zoom
  cannot tear the canvas down. Reduce-motion is the one exception, because
  that is a deliberate user action.
- **ScrollTrigger no longer auto-refreshes on resize.** Sixty triggers
  recalculating on every intermediate zoom step is wasted work;
  `SmoothScroll` runs a single debounced refresh once the burst settles.
- **Expensive paint work is switched off mid-resize.** `html.is-resizing`
  drops the backdrop-filters, the grain animation, the road and car
  animations, the speed lines and the compositor promotions while the burst is
  in flight, so nothing re-rasterises at every intermediate scale.

One deliberate exception: the car keeps painting during a resize, it just stops
animating. Hiding it outright measured as noise against simply stopping the
animation — and a resize is not only zoom. A mobile URL bar sliding away fires
one too, and blinking the car out of the scene for 220ms is a worse artefact
than the frame it saves.

The WebGL scene also stops rendering entirely in a hidden tab, and debounces
its own drawing-buffer resize.

## Typography

Every size on the page comes from one scale defined in `globals.css`:
three body steps (`text-lead` / `text-body` / `text-body-sm`), three HUD steps
for the condensed labels, and `text-nav`. The ad-hoc `text-[9px]` values that
had accumulated are gone.

Buttons are the exception to the HUD face. Bebas Neue ships a single 400
weight, and at 10–12px with 0.22em tracking its labels read as hairline —
`font-synthesis-weight` is off globally, so `font-bold` cannot rescue it. The
`btn-label` utility uses Space Grotesk at 600 (it is variable, 300–700, so
that is real weight) with tighter tracking. The project-row CTAs use it too,
since they are buttons in everything but markup.

Note that `cn()` extends tailwind-merge with that scale — without it,
tailwind-merge reads `text-hud` or `text-btn` as a colour and silently drops
it when a caller also passes `text-magenta`. Any new size token has to be
registered there.

## Performance

The page is animation-heavy by design, so the budget is spent deliberately.
Measured with Lighthouse (desktop preset, 4x CPU throttle) against `next start`:

| | before | after |
| --- | --- | --- |
| Total Blocking Time | 2028 ms | ~600 ms |
| Longest single task | 736 ms | 325 ms |
| Transferred | 1.11 MB | 0.79 MB |

The four things that mattered:

**Scroll setup is built as you approach it, not all at once.** Every section
used to create its GSAP timelines during hydration, which put the whole page's
scroll choreography into one ~700 ms task. `useNearViewport` (see
`lib/hooks.ts`) gates each one behind an IntersectionObserver with a 900 px
margin, so the work is spread across the scroll and always ready before the
section is seen.

**WebGL waits for an idle frame.** three.js is ~100 kB to parse plus shader
compilation; doing that while React is still hydrating blocked the page from
becoming interactive. It now mounts on `requestIdleCallback` (with a ceiling).

**Blended full-screen layers are expensive.** Every `mix-blend` layer forces
the browser to re-blend the viewport whenever anything underneath repaints.
The film overlay went from four such layers to two, and the grain — the only
one still blended — jitters 2x a second instead of 6x.

**~490 decorative SVG nodes left the hydration path.** The skyline windows and
palm fronds are generated, static, and never interactive, so they are emitted
as markup strings and React treats each as one opaque node.

Also: source images capped at 2560px and re-encoded per request as AVIF/WebP,
quality tuned per use (plates that sit under heavy gradients do not need 82),
fonts self-hosted as WOFF2, and `sharp` installed so Next never falls back to
its much slower WASM optimiser.

### Other measures

- three + R3F are `dynamic({ ssr: false })` — they never enter the initial
  bundle, and never load at all on touch devices or under reduce-motion.
  First Load JS is **218 kB**.
- The WebGL canvas stops rendering (`frameloop="never"`) once the hero scrolls
  out of view, and drops itself entirely if the context fails.
- Fonts are self-hosted by `next/font` — no render-blocking request, no FOUT.
- Source images are capped at 2560px (32 MB -> 4.9 MB) and served as AVIF/WebP
  at the size actually requested. Static imports supply blur placeholders, so
  plates fade up instead of popping in.
- The skyline is two `<path>` elements plus flat rects, built once at module
  scope, so the generators run at build time rather than per render.

## Accessibility

- `prefers-reduced-motion` is honoured in all five layers: GSAP timelines are
  never created, Motion skips its `initial` state, Lenis never initialises,
  WebGL never loads, and CSS animation is cut to `0.01ms`.
- The pointer is a native CSS cursor — no JavaScript, so it never lags, works
  before hydration, and respects whatever the OS does with cursor size.
- Split display type is `aria-hidden` with a visually-hidden real heading
  alongside, so screen readers get sentences rather than letters.
- Skills are real `<button>`s driven by `onFocus` as well as hover, so the
  section is fully keyboard-operable. Visible focus ring, skip link, semantic
  landmarks.
- Placeholder links render as plain text instead of anchors that go nowhere.

## Before you publish

Every live and code link is wired and was checked end to end. Two things are
still open:

1. **`app/data/experience.ts`** — written as generic career milestones because
   the repo contained no employment history. Replace with real roles and dates.
2. **Four projects have no public repo**, so their `code` stays `#` and renders
   as plain text rather than a dead link: PortfolioOS, Dispatch, TechPeople and
   Today's List.

Note also that the Figma link points at a private team workspace
(`figma.com/files/team/…`), so visitors will hit a permission wall. A public
profile or a published community file would work better.

See `public/README.md` for the full image map, the two files left unused on
trademark grounds, and how to add a portrait.

## Deploy

Push to GitHub → import to Vercel (zero config).

---

The city never sleeps.
