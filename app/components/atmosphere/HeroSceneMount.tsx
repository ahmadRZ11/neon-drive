"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useCanRunHeavyEffects } from "../../lib/hooks";

/* Code-split: three + R3F never enter the initial bundle, and never load at
   all on phones or for reduce-motion users. */
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** If WebGL is unavailable or the context dies, drop the layer silently —
    the CSS atmosphere underneath is a complete picture on its own. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroSceneMount({ watch = "index" }: { watch?: string }) {
  const canRun = useCanRunHeavyEffects();
  const [active, setActive] = useState(true);
  /**
   * three.js is ~100 kB to parse and its shaders take a while to compile.
   * Doing that during hydration blocks the main thread while the page is
   * still trying to become interactive, so the scene waits for an idle frame
   * (with a ceiling, so it always arrives).
   */
  const [idle, setIdle] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!canRun) return;

    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(id);
  }, [canRun]);

  useEffect(() => {
    if (!canRun) return;

    const target = document.getElementById(watch);
    if (!target) return;

    mounted.current = true;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [canRun, watch]);

  if (!canRun || !idle) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-1 transition-opacity duration-700"
      style={{ opacity: active ? 1 : 0 }}
    >
      <SceneBoundary>
        <HeroScene active={active} />
      </SceneBoundary>
    </div>
  );
}
