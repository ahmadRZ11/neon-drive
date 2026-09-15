"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Expand, Images, ImageOff } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { GALLERY, type GalleryImage } from "../../data/gallery";
import { hex } from "../../lib/palette";
import { lockScroll, unlockScroll } from "../../lib/lenis";
import SectionHeader from "../ui/SectionHeader";

/* Cascade: the container staggers, each tile fades and scales up. */
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};

const tile: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Gallery() {
  const reduced = useReducedMotion();

  /** Index into `available`, or -1 when the lightbox is closed. */
  const [index, setIndex] = useState(-1);
  /** Sources that failed to load, so their tiles fall back to artwork. */
  const [failed, setFailed] = useState<string[]>([]);

  // Only offer working images to the lightbox — a slide that cannot load is
  // worse than one that is not there.
  const available = GALLERY.filter((image) => !failed.includes(image.src));
  const open = index >= 0;

  /**
   * Lenis has to be parked while the lightbox is open. The lightbox locks the
   * body itself, but Lenis drives scrolling with its own rAF loop and would
   * happily keep moving the page behind the backdrop.
   */
  useEffect(() => {
    if (!open) return;
    lockScroll();
    return () => unlockScroll();
  }, [open]);

  function openImage(src: string) {
    const position = available.findIndex((image) => image.src === src);
    if (position >= 0) setIndex(position);
  }

  return (
    <section id="gallery" className="relative px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1560px]">
        <SectionHeader
          num="03"
          label="The City"
          icon={Images}
          title={
            <>
              The
              <br />
              <span className="type-outline-cyan">Gallery</span>
            </>
          }
          note="The reference board this whole thing was built from. Click any frame to open it full size."
        />

        <motion.ul
          variants={grid}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3"
        >
          {GALLERY.map((image) => (
            <GalleryTile
              key={image.src}
              image={image}
              failed={failed.includes(image.src)}
              reduced={Boolean(reduced)}
              onFail={() =>
                setFailed((prev) =>
                  prev.includes(image.src) ? prev : [...prev, image.src]
                )
              }
              onOpen={() => openImage(image.src)}
            />
          ))}
        </motion.ul>
      </div>

      <Lightbox
        open={open}
        close={() => setIndex(-1)}
        index={open ? index : 0}
        slides={available.map((image) => ({
          src: image.src,
          alt: image.alt,
          title: image.title,
        }))}
        plugins={[Zoom, Thumbnails, Captions]}
        className="neon-lightbox"
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: false, padding: "28px" }}
        // Esc, arrow keys and swipe are built in; this only tunes the timing.
        animation={reduced ? { fade: 0, swipe: 0 } : { fade: 260, swipe: 420 }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        thumbnails={{ width: 112, height: 70, gap: 10, border: 1, borderRadius: 0 }}
        captions={{ showToggle: false, descriptionTextAlign: "center" }}
        styles={{
          container: { backgroundColor: "rgba(5, 5, 12, 0.94)" },
          thumbnailsContainer: { backgroundColor: "rgba(5, 5, 12, 0.94)" },
        }}
      />
    </section>
  );
}

function GalleryTile({
  image,
  failed,
  reduced,
  onFail,
  onOpen,
}: {
  image: GalleryImage;
  failed: boolean;
  reduced: boolean;
  onFail: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.li
      variants={tile}
      whileHover={reduced ? undefined : { y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="list-none"
    >
      <button
        type="button"
        onClick={onOpen}
        disabled={failed}
        aria-label={failed ? `${image.title} (image unavailable)` : `Open ${image.title} full size`}
        className="group relative block w-full cursor-pointer overflow-hidden border border-bone/12 transition-[border-color,box-shadow] duration-500 hover:border-magenta/60 hover:shadow-[0_0_34px_-8px_var(--color-magenta)] focus-visible:border-cyan disabled:cursor-default disabled:hover:border-bone/12 disabled:hover:shadow-none"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-midnight">
          {failed ? (
            <FallbackTile image={image} />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={72}
              onError={onFail}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />
          )}

          {/* retro treatment, matched to the rest of the page */}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgb(5 5 12 / 0.72) 0%, transparent 52%)",
            }}
          />

          {/* neon sweep on hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-linear-to-r from-transparent via-cyan/20 to-transparent transition-all duration-1000 group-hover:left-[115%]" />
          </div>

          {!failed && (
            <span className="pointer-events-none absolute top-3 right-3 flex size-8 items-center justify-center border border-cyan/50 bg-ink/70 text-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Expand aria-hidden className="size-3.5" />
            </span>
          )}
        </div>

        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-3.5">
          <span className="hud text-hud text-bone">{image.title}</span>
          {failed && (
            <span className="hud flex items-center gap-1.5 text-hud-sm text-dim">
              <ImageOff aria-hidden className="size-3" />
              Missing
            </span>
          )}
        </span>
      </button>
    </motion.li>
  );
}

/**
 * Stands in when a file is missing. Deliberately designed rather than a grey
 * box — a gap in the grid should still look like part of the same page.
 */
function FallbackTile({ image }: { image: GalleryImage }) {
  const from = hex(image.accent.from);
  const to = hex(image.accent.to);

  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{ background: `linear-gradient(142deg, ${from}59, #0a0a1c 55%, ${to}59)` }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1="0"
            y1={60 + i * 40}
            x2="400"
            y2={60 + i * 40}
            stroke={i % 2 ? to : from}
            strokeOpacity={0.22}
          />
        ))}
        <circle cx="200" cy="150" r="58" fill="none" stroke={to} strokeOpacity="0.5" />
        <circle
          cx="200"
          cy="150"
          r="82"
          fill="none"
          stroke={from}
          strokeOpacity="0.3"
          strokeDasharray="4 9"
        />
      </svg>
    </div>
  );
}
