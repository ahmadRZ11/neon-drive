import SmoothScroll from "./components/providers/SmoothScroll";
import Atmosphere from "./components/atmosphere/Atmosphere";
import HeroSceneMount from "./components/atmosphere/HeroSceneMount";
import SpeedLines from "./components/atmosphere/SpeedLines";
import Film from "./components/chrome/Film";
import Boot from "./components/chrome/Boot";
import Nav from "./components/chrome/Nav";
import Footer from "./components/chrome/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Work from "./components/sections/Work";
import Gallery from "./components/sections/Gallery";
import Experience from "./components/sections/Experience";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";
import Marquee from "./components/ui/Marquee";
import Interstitial from "./components/ui/Interstitial";
import { MEDIA } from "./data/media";

const BANNER = [
  "Building digital worlds",
  "Frontend development",
  "Interfaces that behave",
] as const;

export default function Page() {
  return (
    <SmoothScroll>
      {/* ─── fixed layers ───────────────────────────────────── */}
      <Atmosphere />
      <HeroSceneMount />
      <SpeedLines />
      <Film />
      <Boot />

      <a
        href="#profile"
        className="hud sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-120 focus:bg-magenta focus:px-4 focus:py-3 focus:text-hud-lg focus:text-ink"
      >
        Skip to content
      </a>

      <Nav />

      {/* ─── page ───────────────────────────────────────────── */}
      <main id="main" className="relative z-10">
        <Hero />

        <Marquee
          items={BANNER}
          className="border-y border-bone/10 py-7"
          duration={30}
        />

        <About />

        <Interstitial
          media={MEDIA.miamiBaysideSunset}
          label="The city"
          caption="Every build starts as a question about what a browser can be talked into doing."
        />

        <Work />
        <Gallery />
        <Experience />

        <Interstitial
          media={MEDIA.supercarOverlook}
          label="The road"
          caption="Tools only get interesting once you know exactly why you reached for them."
        />

        <Skills />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </SmoothScroll>
  );
}
