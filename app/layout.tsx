import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "./data/site";

/* ---------------------------------------------------------------------------
   Display + script faces, self-hosted from /public/fonts.
   Converted from the supplied TTFs to WOFF2 (277 kB -> 114 kB).

   `adjustFontFallback` is off on all three: these are display faces with
   metrics nothing like Arial, and letting Next synthesise a metric-matched
   fallback distorts the headline more than the swap itself does.
--------------------------------------------------------------------------- */
const pricedown = localFont({
  src: "../public/fonts/pricedown-bl.woff2",
  variable: "--font-pricedown",
  display: "swap",
  adjustFontFallback: false,
  // NB: do not put "Arial Black" here. The CSS minifier parses the word
  // "Black" as a colour and emits `Arial #000`, which makes the whole
  // font-family declaration invalid — the headline then silently inherits the
  // body font instead of using Pricedown. Quoted names in globals.css are safe.
  fallback: ["Impact", "Haettenschweiler", "sans-serif"],
});

const rage = localFont({
  src: "../public/fonts/rage-italic.woff2",
  variable: "--font-rage",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Brush Script MT", "cursive"],
});

const signature = localFont({
  src: "../public/fonts/signatur.woff2",
  variable: "--font-signatur",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Brush Script MT", "cursive"],
});

/* ---------------------------------------------------------------------------
   Text faces. Pricedown collapses into mush below ~16px (its chamfers need
   room), so the micro-labels and body copy keep readable companions.
--------------------------------------------------------------------------- */
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const title = `${SITE.firstName} ${SITE.lastName} — ${SITE.roleFull}`;
const description = `${SITE.tagline}. ${SITE.intro}`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05050c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pricedown.variable} ${rage.variable} ${signature.variable} ${bebas.variable} ${grotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
