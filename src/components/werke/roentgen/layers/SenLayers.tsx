/**
 * Four Röntgen-Layer diagrams for Sen Friedenszentrum Thái Bình.
 *
 * Visual identity: warm gold (citizens) + bone + accent, lotus + sacred-
 * geometry as recurring motif, no engineering grid (this is a sacred building
 * — the scaffold convention is replaced by concentric circles).
 *
 * The three lotus petals at 120° intervals appear across all four layers
 * with progressive abstraction: silhouette → geometric proportions → program
 * cells → stakeholder spheres.
 */

import { type SVGProps } from 'react';

const VIEW_BOX = '0 0 1600 900';

const SacredScaffold = () => (
  <g aria-hidden="true">
    <circle
      cx="800"
      cy="460"
      r="380"
      stroke="currentColor"
      strokeWidth="0.4"
      opacity="0.10"
      fill="none"
    />
    <circle
      cx="800"
      cy="460"
      r="280"
      stroke="currentColor"
      strokeWidth="0.4"
      opacity="0.10"
      fill="none"
    />
    <circle
      cx="800"
      cy="460"
      r="180"
      stroke="currentColor"
      strokeWidth="0.4"
      opacity="0.10"
      fill="none"
    />
    <line
      x1="800"
      y1="80"
      x2="800"
      y2="840"
      stroke="currentColor"
      strokeWidth="0.4"
      opacity="0.10"
    />
  </g>
);

/** Returns the three lotus-petal paths (centroids at 90°, 210°, 330°). */
function lotusPetals(
  cx: number,
  cy: number,
  R: number,
  opts: {
    fill?: string;
    stroke?: string;
    fillOpacity?: number;
    strokeWidth?: number;
    draw?: boolean;
  },
) {
  const petalAngles = [-90, 30, 150];
  return petalAngles.map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    const tx = cx + Math.cos(a) * R * 0.4;
    const ty = cy + Math.sin(a) * R * 0.4;
    // Petal as a teardrop ellipse, oriented toward centroid
    const rotateDeg = deg + 90;
    return (
      <g key={`petal-${i}`} transform={`translate(${tx} ${ty}) rotate(${rotateDeg})`}>
        <ellipse
          cx="0"
          cy="0"
          rx={R * 0.6}
          ry={R * 0.32}
          fill={opts.fill ?? 'none'}
          fillOpacity={opts.fillOpacity ?? 1}
          stroke={opts.stroke ?? 'currentColor'}
          strokeWidth={opts.strokeWidth ?? 1.2}
          data-draw={opts.draw ? 'true' : undefined}
        />
      </g>
    );
  });
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 00 — Symbolik                                                             */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Three lotus petals at 120° — the central symbol. Stylized outline only,
 * with labels "Vergangenheit · Gegenwart · Zukunft" at petal tips.
 */
export function SenSymbolik(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 460;
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/60">
        <SacredScaffold />
      </g>
      {/* Petal outlines */}
      <g className="text-stk-citizens" stroke="currentColor" fill="none">
        {lotusPetals(cx, cy, 320, { strokeWidth: 2, draw: true })}
      </g>
      {/* Inner glow petals */}
      <g className="text-stk-citizens" stroke="none" fill="currentColor">
        {lotusPetals(cx, cy, 320, { fill: '#E8C547', fillOpacity: 0.07 })}
      </g>
      {/* Central seed */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        <circle cx={cx} cy={cy} r="14" fill="currentColor" />
        <circle cx={cx} cy={cy} r="32" fill="none" strokeWidth="0.8" opacity="0.5" />
      </g>
      {/* Petal-tip labels */}
      <g stroke="none" fill="currentColor" className="text-bone">
        <text
          x={cx}
          y={cy - 320}
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2.5"
          className="font-display italic"
        >
          Vergangenheit
        </text>
        <text
          x={cx + 280}
          y={cy + 200}
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2.5"
          className="font-display italic"
        >
          Gegenwart
        </text>
        <text
          x={cx - 280}
          y={cy + 200}
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2.5"
          className="font-display italic"
        >
          Zukunft
        </text>
      </g>
      <text
        x="800"
        y="820"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="3"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        SEN · LOTUS · 3 BLÄTTER · 120°
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 01 — Sakrale Geometrie                                                    */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * The petals re-drawn as geometric construction: enclosing circle (Umkreis 24m),
 * inscribed equilateral triangle, golden-ratio rectangle in elevation, axis lines.
 */
export function SenSakraleGeometrie(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 460;
  const R = 320;
  // Equilateral triangle vertices at 90°, 210°, 330°
  const triPts = [-90, 30, 150].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
  });
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/60">
        <SacredScaffold />
      </g>
      {/* Inscribing circle */}
      <g className="text-data-cyan" stroke="currentColor" fill="none">
        <circle cx={cx} cy={cy} r={R} strokeWidth="1.4" data-draw="true" />
        {/* Radius marker */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + R}
          y2={cy}
          strokeWidth="0.6"
          opacity="0.6"
          data-draw="true"
        />
        <text
          x={cx + R * 0.55}
          y={cy - 8}
          fontSize="11"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono"
        >
          R = 12 m
        </text>
      </g>
      {/* Equilateral triangle */}
      <g className="text-accent" stroke="currentColor" fill="none">
        {triPts.map((p, i) => {
          const next = triPts[(i + 1) % triPts.length];
          if (!next || !p) return null;
          return (
            <line
              key={`tri-${i}`}
              x1={p[0]}
              y1={p[1]}
              x2={next[0]}
              y2={next[1]}
              strokeWidth="1.4"
              data-draw="true"
            />
          );
        })}
      </g>
      {/* Lotus petals as faint reference */}
      <g className="text-stk-citizens" stroke="currentColor" fill="none" opacity="0.35">
        {lotusPetals(cx, cy, R, { strokeWidth: 0.8 })}
      </g>
      {/* Golden ratio rectangle (1 : 1.618) — height 16.8m → ratio reference */}
      <g className="text-bone/70" stroke="currentColor" fill="none">
        <rect x={cx - 240} y="700" width="480" height="60" strokeWidth="0.8" data-draw="true" />
        <line x1={cx + 60} y1="700" x2={cx + 60} y2="760" strokeWidth="0.6" strokeDasharray="3 3" />
        <text
          x={cx - 180}
          y="735"
          fontSize="11"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono"
          opacity="0.75"
        >
          1
        </text>
        <text
          x={cx + 150}
          y="735"
          fontSize="11"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono"
          opacity="0.75"
        >
          φ = 1,618
        </text>
        <text
          x={cx}
          y="790"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono"
          opacity="0.6"
        >
          AUFRISS-VERHÄLTNIS · 1 : φ
        </text>
      </g>
      {/* Central node */}
      <g className="text-accent" stroke="none" fill="currentColor">
        <circle cx={cx} cy={cy} r="6" />
      </g>
      <text
        x="800"
        y="840"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="3"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        KONSTRUKTION · UMKREIS 24 m · GOLDENER SCHNITT
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 02 — Programmverflechtung                                                 */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Each of the three petals filled with program cells. Meditation in petal 1,
 * Library + Memorial in petal 2, four garden courts in petal 3. Cells overlap
 * at petal tangents — that overlap IS the "ohne Tür" concept.
 */
export function SenProgramm(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 460;
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/60">
        <SacredScaffold />
      </g>
      {/* Faint petal outlines */}
      <g className="text-stk-citizens" stroke="currentColor" fill="none" opacity="0.4">
        {lotusPetals(cx, cy, 320, { strokeWidth: 1 })}
      </g>
      {/* Program: Meditation petal (top) */}
      <g transform={`translate(${cx} ${cy - 130}) rotate(0)`}>
        <ellipse
          cx="0"
          cy="0"
          rx="170"
          ry="80"
          fill="#E8C547"
          fillOpacity="0.18"
          stroke="#E8C547"
          strokeWidth="1"
          data-draw="true"
        />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono text-bone"
        >
          MEDITATIONSHALLE
        </text>
      </g>
      {/* Program: Bibliothek + Memorial petal (lower-right) */}
      <g transform={`translate(${cx + 110} ${cy + 75})`}>
        <ellipse
          cx="0"
          cy="-25"
          rx="100"
          ry="40"
          fill="#75C9D9"
          fillOpacity="0.22"
          stroke="#75C9D9"
          strokeWidth="1"
          data-draw="true"
        />
        <text
          x="0"
          y="-20"
          textAnchor="middle"
          fontSize="12"
          letterSpacing="1.8"
          fill="currentColor"
          className="font-mono text-bone"
        >
          BIBLIOTHEK
        </text>
        <ellipse
          cx="0"
          cy="35"
          rx="100"
          ry="40"
          fill="#4D8FBF"
          fillOpacity="0.22"
          stroke="#4D8FBF"
          strokeWidth="1"
          data-draw="true"
        />
        <text
          x="0"
          y="40"
          textAnchor="middle"
          fontSize="12"
          letterSpacing="1.8"
          fill="currentColor"
          className="font-mono text-bone"
        >
          MEMORIAL
        </text>
      </g>
      {/* Program: 4 garden courts in lower-left petal */}
      <g transform={`translate(${cx - 110} ${cy + 75})`}>
        <ellipse
          cx="-40"
          cy="-30"
          rx="40"
          ry="25"
          fill="#7BA659"
          fillOpacity="0.3"
          stroke="#7BA659"
          strokeWidth="1"
          data-draw="true"
        />
        <text
          x="-40"
          y="-26"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="1.4"
          fill="currentColor"
          className="font-mono"
        >
          HOF 1
        </text>
        <ellipse
          cx="40"
          cy="-30"
          rx="40"
          ry="25"
          fill="#7BA659"
          fillOpacity="0.3"
          stroke="#7BA659"
          strokeWidth="1"
          data-draw="true"
        />
        <text
          x="40"
          y="-26"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="1.4"
          fill="currentColor"
          className="font-mono"
        >
          HOF 2
        </text>
        <ellipse
          cx="-40"
          cy="30"
          rx="40"
          ry="25"
          fill="#7BA659"
          fillOpacity="0.3"
          stroke="#7BA659"
          strokeWidth="1"
          data-draw="true"
        />
        <text
          x="-40"
          y="34"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="1.4"
          fill="currentColor"
          className="font-mono"
        >
          HOF 3
        </text>
        <ellipse
          cx="40"
          cy="30"
          rx="40"
          ry="25"
          fill="#7BA659"
          fillOpacity="0.3"
          stroke="#7BA659"
          strokeWidth="1"
          data-draw="true"
        />
        <text
          x="40"
          y="34"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="1.4"
          fill="currentColor"
          className="font-mono"
        >
          HOF 4
        </text>
      </g>
      {/* Central seed: Schwerpunkt */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        <circle cx={cx} cy={cy} r="10" />
        <text
          x={cx + 18}
          y={cy + 4}
          fontSize="10"
          letterSpacing="2"
          className="font-mono text-bone-muted"
          opacity="0.7"
        >
          SCHWERPUNKT
        </text>
      </g>
      {/* Tangent connection lines (the "ohne Tür" overlaps) */}
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <path
          d={`M ${cx + 30} ${cy - 60} L ${cx + 60} ${cy + 30}`}
          strokeWidth="0.8"
          strokeDasharray="3 3"
          data-draw="true"
        />
        <path
          d={`M ${cx - 30} ${cy - 60} L ${cx - 60} ${cy + 30}`}
          strokeWidth="0.8"
          strokeDasharray="3 3"
          data-draw="true"
        />
        <path
          d={`M ${cx - 50} ${cy + 75} L ${cx + 50} ${cy + 75}`}
          strokeWidth="0.8"
          strokeDasharray="3 3"
          data-draw="true"
        />
      </g>
      <text
        x="800"
        y="840"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="3"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        11 RÄUME · 4 HÖFE · KEIN KORRIDOR
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 03 — Strukturplanung                                                      */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Four stakeholder spheres aligned to a tetrahedral / petal symmetry. The
 * Sangha sits at the top (spiritual axis), state opposite, with German &
 * UNESCO across.
 */
export function SenStrukturplanung(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 460;
  const nodes = [
    { id: 'sangha', label: 'Buddhistischer Sangha', x: cx, y: 180, hex: '#E8C547' },
    { id: 'state', label: 'Vietnam-Staat', x: 1180, y: 580, hex: '#4D8FBF' },
    { id: 'reconciliation', label: 'Versöhnungs­verein', x: cx, y: 800, hex: '#B85C2E' },
    { id: 'unesco', label: 'UNESCO-Berater', x: 420, y: 580, hex: '#C2B8A3' },
  ];
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40">
        <SacredScaffold />
      </g>
      {/* Faint petal trace */}
      <g className="text-stk-citizens" stroke="currentColor" fill="none" opacity="0.25">
        {lotusPetals(cx, cy, 280, { strokeWidth: 0.8 })}
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
      {/* Diagonal perimeter (showing the rare cross-stakeholder pairings) */}
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
