/**
 * Four Röntgen-Layer diagrams for VW Hope Academy Südafrika.
 *
 * Visual identity: warm earth (accent/clay) + moss green (environment) for
 * the schoolyard story, pavilion-courtyard plan as recurring motif. The five
 * Trakthäuser around a central Hof appear across all layers.
 */

import { type SVGProps } from 'react';

const VIEW_BOX = '0 0 1600 900';

const Scaffold = () => (
  <g aria-hidden="true">
    <line
      x1="0"
      y1="800"
      x2="1600"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.18"
    />
    <line
      x1="200"
      y1="100"
      x2="200"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.4"
      opacity="0.10"
    />
    <line
      x1="1400"
      y1="100"
      x2="1400"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.4"
      opacity="0.10"
    />
  </g>
);

/**
 * Returns the five-Trakthaus placements: top, right, bottom-right,
 * bottom-left, left around a central courtyard at (800, 460).
 */
const TRAKTS = [
  { x: 800, y: 280, w: 320, h: 100, label: 'KLASSEN-NORD' },
  { x: 1140, y: 460, w: 100, h: 320, label: 'WERKSTÄTTEN' },
  { x: 940, y: 640, w: 240, h: 100, label: 'MUSIK · THEATER' },
  { x: 660, y: 640, w: 240, h: 100, label: 'KLASSEN-SÜD' },
  { x: 360, y: 460, w: 100, h: 320, label: 'SPORT' },
] as const;

/* ───────────────────────────────────────────────────────────────────────── */
/* 00 — Architektur                                                          */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Top-down plan of the pavilion campus: five Trakthäuser as outlines with
 * brick-pattern hatching, central Schulhof, roof overhang annotations.
 */
export function HopeArchitektur(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/60" stroke="currentColor" fill="none">
        <Scaffold />
      </g>
      {/* Trakts */}
      <g className="text-bone/85" stroke="currentColor" fill="none">
        {TRAKTS.map((t, i) => (
          <g key={`trakt-${i}`}>
            <rect
              x={t.x - t.w / 2}
              y={t.y - t.h / 2}
              width={t.w}
              height={t.h}
              strokeWidth="1.8"
              data-draw="true"
            />
            {/* Brick-pattern hatching */}
            {Array.from({ length: Math.ceil(t.w / 16) }).map((_, j) => {
              const dx = t.x - t.w / 2 + j * 16;
              return (
                <line
                  key={`brick-${i}-${j}`}
                  x1={dx}
                  y1={t.y - t.h / 2}
                  x2={dx}
                  y2={t.y + t.h / 2}
                  strokeWidth="0.3"
                  opacity="0.35"
                />
              );
            })}
            {/* Roof-overhang dashed outer */}
            <rect
              x={t.x - t.w / 2 - 12}
              y={t.y - t.h / 2 - 12}
              width={t.w + 24}
              height={t.h + 24}
              strokeWidth="0.6"
              strokeDasharray="4 4"
              opacity="0.5"
              data-draw="true"
            />
            <text
              x={t.x}
              y={t.y + 4}
              textAnchor="middle"
              fontSize="11"
              letterSpacing="1.6"
              fill="currentColor"
              className="font-mono text-bone-muted"
            >
              {t.label}
            </text>
          </g>
        ))}
      </g>
      {/* Schulhof (central courtyard) */}
      <g className="text-stk-environment" stroke="currentColor" fill="currentColor">
        <rect
          x="520"
          y="380"
          width="560"
          height="160"
          strokeWidth="1.2"
          fillOpacity="0.08"
          fill="currentColor"
          data-draw="true"
        />
        <text
          x="800"
          y="468"
          textAnchor="middle"
          fontSize="14"
          letterSpacing="3"
          className="font-mono text-bone"
          fill="currentColor"
        >
          SCHULHOF
        </text>
      </g>
      <text
        x="800"
        y="860"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="2"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        GRUNDRISS · 5 TRAKTE · BACKSTEIN · HOLZDACH
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 01 — Bildungsraum                                                         */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Same trakt outline, but each block is sub-divided into program cells:
 * 16 classrooms, 3 workshops, sports hall, music + theatre stage.
 * Lines radiate to the centre showing the sightline-to-hof concept.
 */
export function HopeBildungsraum(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <Scaffold />
      </g>
      {/* Trakt outlines (faint) */}
      <g className="text-bone/40" stroke="currentColor" fill="none">
        {TRAKTS.map((t, i) => (
          <rect
            key={`outline-${i}`}
            x={t.x - t.w / 2}
            y={t.y - t.h / 2}
            width={t.w}
            height={t.h}
            strokeWidth="0.8"
            opacity="0.6"
          />
        ))}
      </g>
      {/* Klassenzimmer (16 → 8 nord + 8 süd) */}
      <g className="text-data-cyan" stroke="currentColor" fill="currentColor">
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 660 + i * 36;
          return (
            <rect
              key={`cn-${i}`}
              x={x}
              y="240"
              width="28"
              height="80"
              fillOpacity="0.4"
              stroke="none"
              data-draw="true"
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 548 + i * 32;
          return (
            <rect
              key={`cs-${i}`}
              x={x}
              y="600"
              width="24"
              height="80"
              fillOpacity="0.4"
              stroke="none"
              data-draw="true"
            />
          );
        })}
        <text
          x="800"
          y="232"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono"
          fill="currentColor"
        >
          16 KLASSEN
        </text>
      </g>
      {/* Werkstätten (3) */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        {Array.from({ length: 3 }).map((_, i) => {
          const y = 320 + i * 86;
          return (
            <rect
              key={`w-${i}`}
              x="1098"
              y={y}
              width="84"
              height="74"
              fillOpacity="0.4"
              stroke="none"
              data-draw="true"
            />
          );
        })}
        <text
          x="1140"
          y="288"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono"
          fill="currentColor"
        >
          3 WERKSTÄTTEN
        </text>
      </g>
      {/* Sport */}
      <g className="text-stk-environment" stroke="currentColor" fill="currentColor">
        <rect
          x="320"
          y="320"
          width="80"
          height="280"
          fillOpacity="0.35"
          stroke="none"
          data-draw="true"
        />
        {/* Sport icons — 12 small markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const y = 340 + i * 22;
          return <circle key={`sp-${i}`} cx="360" cy={y} r="3" fill="currentColor" />;
        })}
        <text
          x="360"
          y="288"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono"
          fill="currentColor"
        >
          12 SPORTARTEN
        </text>
      </g>
      {/* Musik + Theater */}
      <g className="text-stk-citizens" stroke="currentColor" fill="currentColor">
        <rect
          x="830"
          y="600"
          width="220"
          height="80"
          fillOpacity="0.4"
          stroke="none"
          data-draw="true"
        />
        <text
          x="940"
          y="648"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono text-bone"
          fill="currentColor"
        >
          MUSIK + THEATER
        </text>
      </g>
      {/* Sichtachsen to courtyard centre */}
      <g className="text-bone/50" stroke="currentColor" fill="none">
        {[
          [800, 280],
          [1140, 460],
          [940, 640],
          [660, 640],
          [360, 460],
        ].map(([x, y], i) => (
          <line
            key={`sl-${i}`}
            x1={x}
            y1={y}
            x2="800"
            y2="460"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.7"
            data-draw="true"
          />
        ))}
        <circle cx="800" cy="460" r="6" fill="currentColor" stroke="none" />
        <text
          x="800"
          y="490"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono"
          opacity="0.6"
        >
          HOF · SICHTACHSE AUS JEDEM TRAKT
        </text>
      </g>
      <text
        x="800"
        y="860"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="2"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        PROGRAMM · TALENT VOR NOTE
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 02 — Trägermodell                                                         */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Three-bubble Venn-style diagram: VW-Stiftung (bauen), DBE (betreiben),
 * Community-Trust (Stipendien). Overlaps mark joint accountabilities.
 */
export function HopeTraegermodell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <Scaffold />
      </g>
      {/* Three circles */}
      <g stroke="currentColor" fill="currentColor">
        <circle
          cx="640"
          cy="380"
          r="200"
          fill="#B85C2E"
          fillOpacity="0.16"
          stroke="#B85C2E"
          strokeWidth="1.4"
          data-draw="true"
        />
        <circle
          cx="960"
          cy="380"
          r="200"
          fill="#4D8FBF"
          fillOpacity="0.16"
          stroke="#4D8FBF"
          strokeWidth="1.4"
          data-draw="true"
        />
        <circle
          cx="800"
          cy="600"
          r="200"
          fill="#7BA659"
          fillOpacity="0.16"
          stroke="#7BA659"
          strokeWidth="1.4"
          data-draw="true"
        />
      </g>
      {/* Labels */}
      <g stroke="none" fill="currentColor" className="text-bone">
        <text x="500" y="276" fontSize="13" letterSpacing="2" className="font-mono">
          VW-STIFTUNG
        </text>
        <text
          x="500"
          y="298"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono text-bone-muted"
          opacity="0.7"
        >
          BAUEN
        </text>
        <text x="1100" y="276" fontSize="13" letterSpacing="2" className="font-mono">
          DBE
        </text>
        <text
          x="1100"
          y="298"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono text-bone-muted"
          opacity="0.7"
        >
          BETREIBEN
        </text>
        <text
          x="800"
          y="780"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          className="font-mono"
        >
          COMMUNITY-TRUST
        </text>
        <text
          x="800"
          y="802"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono text-bone-muted"
          opacity="0.7"
        >
          STIPENDIEN · 240 / JAHR
        </text>
      </g>
      {/* Overlap labels */}
      <g stroke="none" fill="currentColor" className="text-accent">
        <text
          x="800"
          y="370"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          className="font-mono"
        >
          ÜBERGABE
        </text>
        <text
          x="710"
          y="500"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          className="font-mono"
        >
          AUSWAHL
        </text>
        <text
          x="890"
          y="500"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          className="font-mono"
        >
          MENTOR
        </text>
        <text
          x="800"
          y="490"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2.5"
          className="font-mono text-bone"
          fill="currentColor"
        >
          MANDAT
        </text>
      </g>
      <text
        x="800"
        y="860"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="2"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        VENN · 3 TRÄGER · GEMEINSAMES MANDAT
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 03 — Strukturplanung                                                      */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Four stakeholder nodes — Industrie, Staat, Gemeinde, Schulleiter — around
 * the central mediator. The bridge to the catalog deep-dive: the diagram
 * mirrors Sen's structure but with different stakeholders for a familiar
 * grammar across the four featured projects.
 */
export function HopeStrukturplanung(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 460;
  const nodes = [
    { id: 'industry', label: 'Industrie (VW)', x: cx, y: 200, hex: '#B85C2E' },
    { id: 'state', label: 'Staat (DBE)', x: 1200, y: 460, hex: '#4D8FBF' },
    { id: 'community', label: 'Gemeinde', x: cx, y: 780, hex: '#7BA659' },
    { id: 'principal', label: 'Schul­leitung', x: 400, y: 460, hex: '#E8C547' },
  ];
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <Scaffold />
        <text
          x="800"
          y="850"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono"
          opacity="0.5"
        >
          ACADEMY · 240 PLÄTZE / JAHR
        </text>
      </g>
      {/* Hub edges */}
      <g stroke="none" fill="none">
        {nodes.map((n) => (
          <line
            key={`hub-${n.id}`}
            x1={n.x}
            y1={n.y}
            x2={cx}
            y2={cy}
            stroke={n.hex}
            strokeWidth="0.9"
            strokeOpacity="0.6"
            data-draw="true"
          />
        ))}
      </g>
      {/* Diagonal perimeter */}
      <g stroke="currentColor" fill="none">
        <line
          x1={nodes[0]!.x}
          y1={nodes[0]!.y}
          x2={nodes[2]!.x}
          y2={nodes[2]!.y}
          strokeWidth="0.5"
          opacity="0.16"
          strokeDasharray="2 4"
          data-draw="true"
        />
        <line
          x1={nodes[1]!.x}
          y1={nodes[1]!.y}
          x2={nodes[3]!.x}
          y2={nodes[3]!.y}
          strokeWidth="0.5"
          opacity="0.16"
          strokeDasharray="2 4"
          data-draw="true"
        />
      </g>
      {/* Stakeholder nodes */}
      <g stroke="none">
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="40" fill={n.hex} fillOpacity="0.14" />
            <circle cx={n.x} cy={n.y} r="15" fill={n.hex} />
            <text
              x={n.x}
              y={n.y + 62}
              textAnchor="middle"
              fontSize="12"
              letterSpacing="1.6"
              fill="currentColor"
              className="font-mono text-bone"
            >
              {n.label.toUpperCase()}
            </text>
          </g>
        ))}
        {/* Mediator — brand cyan v2 */}
        <circle cx={cx} cy={cy} r="46" fill="#75C9D9" fillOpacity="0.12" />
        <circle cx={cx} cy={cy} r="22" fill="#75C9D9" />
        <circle cx={cx} cy={cy} r="7" fill="#0A0B0E" />
        <text
          x={cx}
          y={cy - 64}
          textAnchor="middle"
          fontSize="13"
          letterSpacing="3"
          fill="#A4DEEB"
          className="font-mono"
        >
          STRUKTURPLANUNG
        </text>
      </g>
    </svg>
  );
}
