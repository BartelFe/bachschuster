/**
 * Five Röntgen-Layer diagrams for the WestPark Verbindungssteg.
 *
 * All layers share the same 1600 × 900 viewBox so the cross-fade stays
 * geometrically aligned. Each layer composes:
 *  · A subtle scaffold grid that persists across layers (visual continuity).
 *  · One or two prominent structural elements unique to that layer.
 *  · Annotation glyphs (small mono labels at meaningful coordinates).
 *
 * The DrawSVG plugin animates `strokeDasharray` on opted-in paths
 * (`data-draw="true"`) on layer-enter. Photo layer uses a separate render.
 */

import { type SVGProps } from 'react';

const VIEW_BOX = '0 0 1600 900';

const Scaffold = () => (
  <g aria-hidden="true">
    {/* Horizon line */}
    <line
      x1="0"
      y1="600"
      x2="1600"
      y2="600"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.18"
    />
    {/* Vertical pier reference lines */}
    <line
      x1="400"
      y1="200"
      x2="400"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.14"
    />
    <line
      x1="1200"
      y1="200"
      x2="1200"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.14"
    />
    {/* Soft 10-step grid for engineering feel */}
    {Array.from({ length: 8 }).map((_, i) => {
      const y = 600 + (i + 1) * 30;
      return (
        <line
          key={i}
          x1="0"
          y1={y}
          x2="1600"
          y2={y}
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.08"
        />
      );
    })}
  </g>
);

/* ───────────────────────────────────────────────────────────────────────── */
/* Layer 00 — Architektur                                                    */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * The visible bridge profile. A schematic elevation drawing — outer hull only,
 * no structural members. This is what a passer-by sees: silhouette and rail.
 */
export function LayerArchitektur(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/80" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Outer envelope: deck + railing + supports */}
        <path d="M 400 600 L 400 540 L 1200 540 L 1200 600" strokeWidth="2" data-draw="true" />
        {/* Deck (bottom edge) */}
        <line x1="400" y1="600" x2="1200" y2="600" strokeWidth="3" data-draw="true" />
        {/* Top railing line */}
        <line x1="400" y1="500" x2="1200" y2="500" strokeWidth="1.2" data-draw="true" />
        {/* Slight rake at ends (the actual structure has tapered support frames) */}
        <path d="M 400 600 L 380 700 L 360 800" strokeWidth="1.2" data-draw="true" />
        <path d="M 1200 600 L 1220 700 L 1240 800" strokeWidth="1.2" data-draw="true" />
        {/* End of bridge: abutment plinths */}
        <rect x="340" y="780" width="80" height="20" strokeWidth="1.2" data-draw="true" />
        <rect x="1180" y="780" width="80" height="20" strokeWidth="1.2" data-draw="true" />
        {/* People silhouettes (figures @ deck height) */}
        <g className="text-bone/60" fill="currentColor" stroke="none">
          <circle cx="700" cy="525" r="3" />
          <rect x="697" y="528" width="6" height="14" />
          <circle cx="850" cy="525" r="3" />
          <rect x="847" y="528" width="6" height="14" />
          <circle cx="980" cy="525" r="3" />
          <rect x="977" y="528" width="6" height="14" />
        </g>
        {/* Caption label */}
        <text
          x="800"
          y="450"
          textAnchor="middle"
          fontSize="14"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono"
          opacity="0.55"
        >
          ELEVATION · 92 m × 3,5 m
        </text>
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* Layer 01 — Tragstruktur                                                   */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * The truss is the load-bearing core. Vierendeel-cross-bracing diamonds along
 * the span, abutment forces marked as arrows, deflection trace as a faint
 * curve to suggest live-load behaviour.
 */
export function LayerTragstruktur(props: SVGProps<SVGSVGElement>) {
  const panelCount = 8;
  const panelWidth = 800 / panelCount; // span 400→1200
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-data-cyan" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Top + bottom chords */}
        <line x1="400" y1="500" x2="1200" y2="500" strokeWidth="2" data-draw="true" />
        <line x1="400" y1="600" x2="1200" y2="600" strokeWidth="2" data-draw="true" />
        {/* Vertical posts */}
        {Array.from({ length: panelCount + 1 }).map((_, i) => {
          const x = 400 + i * panelWidth;
          return (
            <line
              key={`post-${i}`}
              x1={x}
              y1="500"
              x2={x}
              y2="600"
              strokeWidth="1.4"
              data-draw="true"
            />
          );
        })}
        {/* Diagonal cross-bracing — alternating direction per panel */}
        {Array.from({ length: panelCount }).map((_, i) => {
          const x0 = 400 + i * panelWidth;
          const x1 = x0 + panelWidth;
          const goRight = i % 2 === 0;
          return (
            <g key={`diag-${i}`}>
              <line
                x1={x0}
                y1="500"
                x2={x1}
                y2="600"
                strokeWidth="0.9"
                opacity={goRight ? 1 : 0.55}
                data-draw="true"
              />
              <line
                x1={x0}
                y1="600"
                x2={x1}
                y2="500"
                strokeWidth="0.9"
                opacity={goRight ? 0.55 : 1}
                data-draw="true"
              />
            </g>
          );
        })}
        {/* Abutment reaction arrows */}
        <g className="text-accent" stroke="currentColor" strokeWidth="1.4" fill="currentColor">
          <line x1="400" y1="640" x2="400" y2="720" data-draw="true" />
          <polygon points="395,720 405,720 400,738" />
          <line x1="1200" y1="640" x2="1200" y2="720" data-draw="true" />
          <polygon points="1195,720 1205,720 1200,738" />
          <text x="408" y="730" fontSize="11" letterSpacing="1.5" className="font-mono">
            R₁ = 210 t
          </text>
          <text x="1130" y="730" fontSize="11" letterSpacing="1.5" className="font-mono">
            R₂ = 210 t
          </text>
        </g>
        {/* Deflection curve under load — exaggerated 8× for legibility */}
        <path
          d="M 400 550 Q 800 590 1200 550"
          strokeWidth="0.6"
          strokeDasharray="3 4"
          opacity="0.6"
          data-draw="true"
        />
        {/* Caption */}
        <text
          x="800"
          y="450"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono"
          opacity="0.7"
        >
          VIERENDEEL · 8 PANELS · CROSS-BRACED
        </text>
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* Layer 02 — Mobilität                                                      */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Flow diagram. The deck is now split into bike and pedestrian bands;
 * directional arrows show the dominant west→east commuter pulse plus return
 * traffic. A small density histogram below maps daily frequency.
 */
export function LayerMobilitaet(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/80" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Deck rectangle, split */}
        <rect x="400" y="520" width="800" height="80" strokeWidth="1.2" opacity="0.5" />
        <line
          x1="400"
          y1="560"
          x2="1200"
          y2="560"
          strokeWidth="0.6"
          opacity="0.6"
          strokeDasharray="6 4"
        />
      </g>
      {/* Bike flow — west → east, terrakotta */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        {Array.from({ length: 5 }).map((_, i) => {
          const startX = 410 + i * 160;
          return (
            <g key={`bike-${i}`}>
              <line
                x1={startX}
                y1="540"
                x2={startX + 140}
                y2="540"
                strokeWidth="1.2"
                data-draw="true"
              />
              <polygon points={`${startX + 140},535 ${startX + 156},540 ${startX + 140},545`} />
            </g>
          );
        })}
        <text x="410" y="528" fontSize="11" letterSpacing="1.6" className="font-mono">
          RAD · 2,5 m · → WEST → ZENTRUM
        </text>
      </g>
      {/* Pedestrian flow — bidirectional, cyan */}
      <g className="text-data-cyan" stroke="currentColor" fill="currentColor">
        {Array.from({ length: 4 }).map((_, i) => {
          const startX = 460 + i * 180;
          return (
            <g key={`ped-${i}`}>
              <line
                x1={startX}
                y1="580"
                x2={startX + 60}
                y2="580"
                strokeWidth="1"
                data-draw="true"
              />
              <polygon points={`${startX + 60},576 ${startX + 72},580 ${startX + 60},584`} />
              <line
                x1={startX + 80}
                y1="585"
                x2={startX + 140}
                y2="585"
                strokeWidth="1"
                data-draw="true"
              />
              <polygon points={`${startX + 80},581 ${startX + 68},585 ${startX + 80},589`} />
            </g>
          );
        })}
        <text x="410" y="612" fontSize="11" letterSpacing="1.6" className="font-mono">
          FUSS · 1,8 m · ↔ BEIDSEITIG
        </text>
      </g>
      {/* Frequency histogram below the deck */}
      <g className="text-bone/60" stroke="currentColor" fill="currentColor">
        {[12, 28, 65, 92, 78, 41, 33, 26, 38, 70, 88, 54, 22, 14].map((h, i) => {
          const x = 405 + i * 56;
          return (
            <rect
              key={`bar-${i}`}
              x={x}
              y={760 - h}
              width="36"
              height={h}
              opacity="0.45"
              data-draw="true"
            />
          );
        })}
        <line x1="400" y1="760" x2="1200" y2="760" strokeWidth="0.6" opacity="0.4" />
        <text x="400" y="785" fontSize="10" letterSpacing="1.5" className="font-mono" opacity="0.7">
          06h
        </text>
        <text x="780" y="785" fontSize="10" letterSpacing="1.5" className="font-mono" opacity="0.7">
          14h
        </text>
        <text
          x="1160"
          y="785"
          fontSize="10"
          letterSpacing="1.5"
          className="font-mono"
          opacity="0.7"
        >
          22h
        </text>
        <text
          x="800"
          y="750"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="2"
          className="font-mono"
          opacity="0.6"
        >
          QUERUNGEN / STUNDE · 4 200 / TAG
        </text>
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* Layer 03 — Sichtachsen                                                    */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Radial sight-lines emanating from the central viewing platform. Reaches
 * named landmarks upstream + downstream. A 270° fan visualises the unobstructed
 * field of view from the centre.
 */
export function LayerSichtachsen(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 540;
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/80" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Faint deck reference */}
        <rect x="400" y="520" width="800" height="80" strokeWidth="0.6" opacity="0.25" />
      </g>
      {/* Sight-fan: 270° sweep centred at platform */}
      <g className="text-data-cyan" stroke="currentColor" fill="currentColor">
        <path
          d="M 800 540 L 200 200 A 660 660 0 0 1 1400 200 Z"
          strokeWidth="0.6"
          fill="currentColor"
          fillOpacity="0.05"
          opacity="0.7"
          data-draw="true"
        />
        <circle cx={cx} cy={cy} r="6" fill="currentColor" />
        <circle cx={cx} cy={cy} r="14" fill="none" strokeWidth="0.8" opacity="0.6" />
        <text
          x={cx}
          y={cy + 32}
          textAnchor="middle"
          fontSize="11"
          letterSpacing="2"
          className="font-mono"
        >
          PLATTFORM
        </text>
      </g>
      {/* Sight rays to named landmarks */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        {[
          { x: 180, y: 200, label: 'KLENZEPARK' },
          { x: 480, y: 140, label: 'SCHUTTERMÜNDUNG' },
          { x: 1080, y: 120, label: 'NEUES SCHLOSS' },
          { x: 1380, y: 220, label: 'GLACIS' },
          { x: 1460, y: 480, label: 'AUDI-WERK' },
        ].map((s) => (
          <g key={s.label}>
            <line x1={cx} y1={cy} x2={s.x} y2={s.y} strokeWidth="0.7" data-draw="true" />
            <circle cx={s.x} cy={s.y} r="3" />
            <text
              x={s.x}
              y={s.y - 10}
              fontSize="10"
              letterSpacing="1.6"
              textAnchor={s.x < cx ? 'start' : 'end'}
              className="font-mono"
            >
              {s.label}
            </text>
          </g>
        ))}
      </g>
      {/* Caption */}
      <text
        x="800"
        y="800"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="2"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        SICHTWINKEL · 270° · 5 LANDMARKS
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* Layer 04 — Strukturplanung                                                */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * The five stakeholder nodes connected via a central mediator. The bridge
 * is reduced to a single horizontal line — context, not focus. The schema
 * shows that the visible form is a contract between conflicting interests.
 */
export function LayerStrukturplanung(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 480;
  const nodes = [
    { id: 'city', label: 'Stadt', tone: 'stk-city', x: cx, y: 200, hex: '#4D8FBF' },
    { id: 'business', label: 'Wirtschaft', tone: 'stk-business', x: 1280, y: 350, hex: '#B85C2E' },
    { id: 'citizens', label: 'Bürger', tone: 'stk-citizens', x: 1100, y: 760, hex: '#E8C547' },
    { id: 'environment', label: 'Umwelt', tone: 'stk-environment', x: 500, y: 760, hex: '#7BA659' },
    {
      id: 'institutional',
      label: 'Institutionen',
      tone: 'stk-institutional',
      x: 320,
      y: 350,
      hex: '#C2B8A3',
    },
  ];
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Bridge as flat reference line under the diagram */}
        <line x1="400" y1="820" x2="1200" y2="820" strokeWidth="1.4" opacity="0.5" />
        <text
          x="800"
          y="845"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono"
        >
          DAS GEBÄUDE
        </text>
      </g>
      {/* Edges — each stakeholder connects to mediator */}
      <g stroke="currentColor" fill="none">
        {nodes.map((n) => (
          <line
            key={`edge-${n.id}`}
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
        {/* Edges between adjacent stakeholders (the perimeter) */}
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length];
          if (!next) return null;
          return (
            <line
              key={`peri-${n.id}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.18"
              strokeDasharray="2 4"
              data-draw="true"
            />
          );
        })}
      </g>
      {/* Stakeholder nodes */}
      <g stroke="none">
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="36" fill={n.hex} fillOpacity="0.15" />
            <circle cx={n.x} cy={n.y} r="14" fill={n.hex} />
            <text
              x={n.x}
              y={n.y + 60}
              textAnchor="middle"
              fontSize="13"
              letterSpacing="2"
              fill="currentColor"
              className="font-mono text-bone"
            >
              {n.label.toUpperCase()}
            </text>
          </g>
        ))}
        {/* Mediator: the Strukturplanung itself */}
        <circle cx={cx} cy={cy} r="44" fill="#B85C2E" fillOpacity="0.12" />
        <circle cx={cx} cy={cy} r="20" fill="#B85C2E" />
        <circle cx={cx} cy={cy} r="6" fill="#0A0B0E" />
        <text
          x={cx}
          y={cy - 60}
          textAnchor="middle"
          fontSize="13"
          letterSpacing="3"
          fill="#D97648"
          className="font-mono"
        >
          STRUKTURPLANUNG
        </text>
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* Layer 00 photo overlay — composited above LayerArchitektur                */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * The bridge photo. Sits on top of LayerArchitektur at scroll progress 0,
 * dissolves out as the architecture diagram emerges. We deliberately compose
 * the photo + the elevation line-art together for the opening layer so the
 * cross-fade to Tragstruktur reads as "skin peeling to bone".
 */
export function PhotoArchitektur({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        style={{ filter: 'saturate(0.75) contrast(1.05) brightness(0.95)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10,11,14,0) 35%, rgba(10,11,14,0.85) 100%)',
        }}
      />
    </div>
  );
}
