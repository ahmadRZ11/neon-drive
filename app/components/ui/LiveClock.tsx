"use client";

import { useEffect, useState } from "react";
import { SITE } from "../../data/site";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: SITE.location.timeZone,
});

/**
 * Local time in the site's stated timezone.
 *
 * Renders a static placeholder on the server: a real clock would differ
 * between the server render and the first client render, which is a
 * guaranteed hydration mismatch.
 */
export default function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time ?? "--:--:--"}
    </span>
  );
}
