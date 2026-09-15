# Assets

All images live in `images/` and are wired up through **`app/data/media.ts`**,
not by path strings. That file statically imports each one, which is what gives
Next the intrinsic dimensions (so nothing shifts while loading) and a generated
`blurDataURL` for the blur-up placeholder.

## Adding an image

1. Drop the file in `public/images/`.
2. Import it in `app/data/media.ts` and add an entry with descriptive `alt`.
3. Reference it as `MEDIA.yourKey` wherever it is used.

## Where each one is used

| File | Used as |
| --- | --- |
| `palm-road-sunset.jpg` | Hero cloud layer (scaled, blurred, soft-light) |
| `miami-bayside-sunset.jpg` | Interstitial between About and Work |
| `supercar-overlook.jpg` | Interstitial between Experience and Skills |
| `driver-sun-silhouette.jpg` | Contact section backdrop |
| `ocean-drive-dusk.jpg` | About dossier plate, under the monogram |
| `neon-skyline-sun.jpg` | Cover — PortfolioOS |
| `neon-street-night.jpg` | Cover — Matrix Portfolio |
| `causeway-water-dusk.jpg` | Cover — Ocean Portfolio |
| `vector-city-night.jpg` | Cover — ARIA.OS |
| `hazy-city-magenta.jpg` | Cover — The Altar |
| `outrun-car-sun.jpg` | Cover — Catch Me If You Can |

## Present but not used

- **`vice-city-signage.jpg`** — the neon sign in frame reads "VICE CITY".
- **`vice-city-street.jpg`** — sourced from GTA Vice City.

Both carry Rockstar trademarks, which the brief for this site explicitly ruled
out. They are still here — import them in `media.ts` if you decide otherwise.

- **`palms-grid-dusk.jpg`** — the foreground object is off-concept.
- **`strip-yellow-car.jpg`** — near-duplicate of `neon-street-night.jpg`.

## Portrait

There is no photo of you in the set, so the About dossier uses an environment
plate with the monogram over it. To use a real portrait: add the file, import it
in `media.ts`, then in `app/components/sections/About.tsx` set

```ts
const PORTRAIT: Media | null = MEDIA.yourPortrait;
```

Portrait crop, roughly 4:5.

## A note on source size

The originals totalled 32 MB, with single files up to 5376px / 14 MB. They have
been resized to a 2560px cap at quality 84 — **32 MB → 4.9 MB** with no visible
difference at any size the page actually displays. Keep new additions at or
below 2560px on the long edge.

## Project covers

`public/projects/` holds one screenshot per project, named after its id in
`app/data/projects.ts`, and wired through the `SHOTS` map in
`app/data/media.ts`. Adding a project means dropping `<id>.jpg` in here,
importing it in `media.ts`, and pointing `image` at `SHOTS["<id>"]`.

All fourteen are 16:9, which is why the cover frame is `aspect-video` — it
matches the sources exactly, so nothing is cropped. That matters more than it
sounds: at 16:10 the frame shaved ~5% off each side and clipped the page
heading on the left-aligned dashboards.

The originals came in at 1917px / 10.7 MB total. They are resized to a 1600px
cap and encoded as whichever of PNG or JPEG came out smaller per file —
**10.7 MB → 1.4 MB**. Covers render at roughly 900px, so 1600 leaves 2x for
retina.

The treatment on them is deliberately light (see `ProjectCover.tsx`): enough
wash to tie them to the palette and stop the light screenshots glaring against
a near-black page, but not so much that the interface stops being readable.

## Atmospheric plates

`public/images/` holds the Miami photography used for the backdrop: the hero
cloud bank, the two section interstitials, the contact backdrop and the About
dossier plate.

Six of these used to stand in as project covers and are now unused:
`neon-skyline-sun`, `neon-street-night`, `causeway-water-dusk`,
`vector-city-night`, `hazy-city-magenta` and `outrun-car-sun`. The files are
still here; they are simply no longer imported in `media.ts`.

## Cursor

| File | Purpose |
| --- | --- |
| `cursor.png` | the original 128x128 artwork you supplied — kept as the source |
| `cursor-32.png` | the cursor at 1x |
| `cursor-64.png` | the same at 2x, for retina |

Wired up in `app/globals.css`:

```css
body {
  cursor: url("/cursor-32.png") 1 1, auto;
  cursor: image-set(url("/cursor-32.png") 1x, url("/cursor-64.png") 2x) 1 1, auto;
}
```

**It is a native CSS cursor, not a JS-positioned element.** A drawn pointer is
always a frame behind the real one; the OS composites a native cursor for free
and it is pixel-exact. There is no JavaScript involved in the cursor at all —
no component, no pointer listener, nothing on the main thread.

Notes:

- The hotspot is `1 1`, measured from the artwork's alpha channel: the tip
  sits in the very top-left corner of the 128px source.
- Browsers cap cursors at 128x128 and a 128px arrow is enormous on screen, so
  the 32/64px copies are generated from the original rather than used raw.
- Links and buttons get `cursor: inherit` — without it the UA stylesheet drops
  them back to the system hand. Text inputs keep `cursor: auto`.
- The rules live in `@layer base`, so any Tailwind `cursor-*` utility still
  wins if you need to override a specific element.

To replace it: drop in new artwork, regenerate the two sizes, and re-measure
the hotspot if the tip moves.
