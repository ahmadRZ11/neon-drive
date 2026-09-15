import Image from "next/image";
import { mulberry32 } from "../../lib/rand";
import { HEX } from "../../lib/palette";
import type { CoverMotif, Project } from "../../data/projects";

const VB = { w: 800, h: 500 };

/* --------------------------------------------------------------------------
   Motifs. Each project gets its own composition so the grid reads as six
   art-directed covers rather than six tinted rectangles. All are seeded, so
   server and client render identical markup.
-------------------------------------------------------------------------- */

function GridMotif({ seed, a, b }: { seed: number; a: string; b: string }) {
  const rand = mulberry32(seed);
  const windows = [0, 1, 2].map((i) => ({
    x: 90 + i * 118,
    y: 110 + i * 62,
    w: 330,
    h: 210,
    o: 0.9 - i * 0.22,
  }));

  return (
    <g>
      {/* floor grid running to a vanishing point */}
      {Array.from({ length: 16 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 53}
          y1={VB.h}
          x2={VB.w / 2 + (i * 53 - VB.w / 2) * 0.22}
          y2={300}
          stroke={a}
          strokeOpacity={0.14}
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => {
        const t = i / 6;
        const y = 300 + Math.pow(t, 2.1) * 200;
        return (
          <line key={`h${i}`} x1="0" y1={y} x2={VB.w} y2={y} stroke={a} strokeOpacity={0.14} />
        );
      })}

      {/* stacked OS windows */}
      {windows.map((win, i) => (
        <g key={i} opacity={win.o}>
          <rect
            x={win.x}
            y={win.y}
            width={win.w}
            height={win.h}
            fill="#05050c"
            fillOpacity="0.72"
            stroke={i === 0 ? b : a}
            strokeOpacity="0.55"
          />
          <rect x={win.x} y={win.y} width={win.w} height="22" fill={i === 0 ? b : a} fillOpacity="0.28" />
          {[0, 1, 2].map((d) => (
            <circle key={d} cx={win.x + 14 + d * 13} cy={win.y + 11} r="3.2" fill={b} fillOpacity="0.8" />
          ))}
          {Array.from({ length: 5 }, (_, r) => (
            <rect
              key={r}
              x={win.x + 16}
              y={win.y + 42 + r * 18}
              width={(0.3 + rand() * 0.6) * (win.w - 32)}
              height="5"
              fill={a}
              fillOpacity="0.3"
            />
          ))}
        </g>
      ))}
    </g>
  );
}

function RainMotif({ seed, a, b }: { seed: number; a: string; b: string }) {
  const rand = mulberry32(seed);
  return (
    <g>
      {Array.from({ length: 54 }, (_, i) => {
        const x = 8 + i * 14.8;
        const len = 40 + rand() * 300;
        const y = rand() * (VB.h - 60);
        return (
          <g key={i}>
            <rect x={x} y={y} width="3" height={len} fill={a} fillOpacity={0.1 + rand() * 0.3} />
            <rect x={x} y={y + len - 16} width="3" height="16" fill={b} fillOpacity={0.55 + rand() * 0.4} />
          </g>
        );
      })}
    </g>
  );
}

function WaveMotif({ seed, a, b }: { seed: number; a: string; b: string }) {
  const rand = mulberry32(seed);
  return (
    <g>
      {Array.from({ length: 20 }, (_, i) => {
        const y = 60 + i * 22;
        const amp = 10 + rand() * 26;
        const phase = rand() * 6.28;
        let d = `M0,${y}`;
        for (let x = 0; x <= VB.w; x += 40) {
          d += ` Q${x + 20},${y + Math.sin(x / 90 + phase) * amp} ${x + 40},${y}`;
        }
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i % 4 === 0 ? b : a}
            strokeOpacity={0.12 + (i / 20) * 0.4}
            strokeWidth={i % 4 === 0 ? 1.6 : 1}
          />
        );
      })}
    </g>
  );
}

function OrbitMotif({ a, b }: { seed: number; a: string; b: string }) {
  const cx = VB.w / 2;
  const cy = VB.h / 2;
  return (
    <g>
      {[60, 106, 152, 198].map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={i % 2 ? b : a}
          strokeOpacity={0.42 - i * 0.07}
          strokeDasharray={i === 1 ? "4 10" : i === 3 ? "1 7" : undefined}
        />
      ))}

      {/* sweeping arcs */}
      <path
        d={`M ${cx - 152} ${cy} A 152 152 0 0 1 ${cx} ${cy - 152}`}
        fill="none"
        stroke={b}
        strokeOpacity="0.85"
        strokeWidth="2"
      />
      <path
        d={`M ${cx + 198} ${cy} A 198 198 0 0 1 ${cx + 60} ${cy + 188}`}
        fill="none"
        stroke={a}
        strokeOpacity="0.6"
        strokeWidth="2"
      />

      {/* tick ring */}
      {Array.from({ length: 48 }, (_, i) => {
        const angle = (i / 48) * Math.PI * 2;
        const inner = i % 4 === 0 ? 212 : 220;
        return (
          <line
            key={i}
            x1={cx + Math.cos(angle) * inner}
            y1={cy + Math.sin(angle) * inner}
            x2={cx + Math.cos(angle) * 228}
            y2={cy + Math.sin(angle) * 228}
            stroke={a}
            strokeOpacity={i % 4 === 0 ? 0.6 : 0.25}
          />
        );
      })}

      <circle cx={cx} cy={cy} r="5" fill={b} />
      <circle cx={cx + 106} cy={cy} r="7" fill="none" stroke={b} strokeWidth="2" />
    </g>
  );
}

function StaticMotif({ seed, a, b }: { seed: number; a: string; b: string }) {
  const rand = mulberry32(seed);
  return (
    <g>
      {Array.from({ length: 26 }, (_, i) => {
        const y = i * 19 + rand() * 6;
        const h = 3 + rand() * 13;
        const x = rand() * 240 - 120;
        const w = 300 + rand() * 620;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={rand() > 0.82 ? b : a}
            fillOpacity={0.05 + rand() * 0.24}
          />
        );
      })}
      {/* torn displacement slice */}
      <rect x="0" y="228" width={VB.w} height="26" fill={b} fillOpacity="0.5" />
      <rect x="-40" y="254" width={VB.w} height="10" fill="#05050c" fillOpacity="0.85" />
    </g>
  );
}

function SunMotif({ a, b }: { seed: number; a: string; b: string }) {
  const cx = VB.w / 2;
  const cy = 250;
  return (
    <g>
      <defs>
        <linearGradient id="sun-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={b} />
          <stop offset="100%" stopColor={a} />
        </linearGradient>
        <mask id="sun-stripes">
          <rect x="0" y="0" width={VB.w} height={VB.h} fill="#fff" />
          {Array.from({ length: 11 }, (_, i) => (
            <rect
              key={i}
              x="0"
              y={cy + 8 + i * 15}
              width={VB.w}
              height={4 + i * 1.1}
              fill="#000"
            />
          ))}
        </mask>
      </defs>

      <circle cx={cx} cy={cy} r="150" fill="url(#sun-fill)" mask="url(#sun-stripes)" />

      {/* horizon + receding grid */}
      <line x1="0" y1="400" x2={VB.w} y2="400" stroke={b} strokeOpacity="0.7" />
      {Array.from({ length: 6 }, (_, i) => {
        const t = i / 5;
        const y = 400 + Math.pow(t, 2) * 100;
        return <line key={i} x1="0" y1={y} x2={VB.w} y2={y} stroke={a} strokeOpacity="0.22" />;
      })}
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={cx + (i - 6) * 30}
          y1="400"
          x2={cx + (i - 6) * 190}
          y2={VB.h}
          stroke={a}
          strokeOpacity="0.22"
        />
      ))}
    </g>
  );
}

const MOTIFS: Record<
  CoverMotif,
  (p: { seed: number; a: string; b: string }) => JSX.Element
> = {
  grid: GridMotif,
  rain: RainMotif,
  wave: WaveMotif,
  orbit: OrbitMotif,
  static: StaticMotif,
  sun: SunMotif,
};

/** Stable numeric seed from the project id. */
function seedFrom(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Renders the project's real image when one exists, and generated cover art
 * when it does not — so the section is fully designed before any asset is
 * dropped into /public.
 */
export default function ProjectCover({ project }: { project: Project }) {
  const a = HEX[project.accent.from] ?? HEX.cyan;
  const b = HEX[project.accent.to] ?? HEX.magenta;

  if (project.image) {
    return (
      <div className="absolute inset-0">
        <Image
          src={project.image.src}
          /* These are screenshots of the shipped work, not decoration, so
             they carry a real description rather than an empty alt. */
          alt={project.image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          placeholder="blur"
          quality={78}
          className="object-cover"
        />

        {/*
          Film treatment, dialled well back from what the decorative plates
          used. These covers have a job — showing the interface — so the wash
          only has to tie them to the palette and stop light screenshots
          glaring against a near-black page. Any heavier and the UI stops
          being readable, which defeats the point of showing it.
        */}
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ background: `linear-gradient(142deg, ${a}, transparent 55%, ${b})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgb(5 5 12 / 0.42) 0%, transparent 45%)",
          }}
        />
        <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 92% 84% at 50% 50%, transparent 56%, rgb(5 5 12 / 0.34) 100%)",
          }}
        />
      </div>
    );
  }

  const Motif = MOTIFS[project.motif];

  return (
    <div className="absolute inset-0" role="img" aria-label={`${project.title} cover artwork`}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(142deg, ${a}4d 0%, #0a0a1c 46%, #05050c 62%, ${b}59 100%)`,
        }}
      />

      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <Motif seed={seedFrom(project.id)} a={a} b={b} />
      </svg>

      {/* film treatment ties the generated art to the rest of the page */}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 42%, rgb(5 5 12 / 0.55) 100%)",
        }}
      />
    </div>
  );
}
