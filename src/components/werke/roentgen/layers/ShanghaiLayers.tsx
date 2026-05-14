/**
 * Four Röntgen-Layer diagrams for the Shanghai Pavillon of Innovation (EXPO 2010).
 *
 * Visual identity: warm-red + cyan undertone (EXPO context), curved roofline as
 * recurring motif, lifecycle / flow / stakeholder diagrams in editorial mode.
 *
 * All layers share the 1600 × 900 viewBox so cross-fade stays aligned.
 */

import { type SVGProps } from 'react';

const VIEW_BOX = '0 0 1600 900';

const Scaffold = () => (
  <g aria-hidden="true">
    <line
      x1="0"
      y1="600"
      x2="1600"
      y2="600"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.18"
    />
    <line
      x1="200"
      y1="200"
      x2="200"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.10"
    />
    <line
      x1="1400"
      y1="200"
      x2="1400"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.10"
    />
  </g>
);

/* ───────────────────────────────────────────────────────────────────────── */
/* 00 — Architektur                                                          */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Section through the pavilion: curving roof (single sweeping arc), columns,
 * floor slab, demountable connector annotations.
 */
export function PavilionArchitektur(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/80" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Sweeping aluminium roof — single arc */}
        <path d="M 250 460 Q 800 200 1350 460" strokeWidth="2.4" data-draw="true" />
        {/* Roof underside (membrane gap) */}
        <path
          d="M 260 490 Q 800 240 1340 490"
          strokeWidth="0.8"
          opacity="0.5"
          strokeDasharray="4 4"
          data-draw="true"
        />
        {/* Floor slab */}
        <line x1="250" y1="600" x2="1350" y2="600" strokeWidth="3" data-draw="true" />
        <line x1="250" y1="610" x2="1350" y2="610" strokeWidth="0.6" opacity="0.5" />
        {/* Columns (V-shaped, demountable) */}
        {Array.from({ length: 5 }).map((_, i) => {
          const x = 380 + i * 220;
          return (
            <g key={`col-${i}`}>
              <line x1={x - 12} y1="460" x2={x} y2="600" strokeWidth="1.6" data-draw="true" />
              <line x1={x + 12} y1="460" x2={x} y2="600" strokeWidth="1.6" data-draw="true" />
              {/* Demountable joint marker */}
              <circle cx={x} cy="600" r="3" fill="currentColor" stroke="none" />
              <circle cx={x - 12} cy="460" r="2.2" fill="currentColor" stroke="none" />
              <circle cx={x + 12} cy="460" r="2.2" fill="currentColor" stroke="none" />
            </g>
          );
        })}
      </g>
      {/* Membrane annotation */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        <line x1="800" y1="240" x2="800" y2="170" strokeWidth="0.8" data-draw="true" />
        <text
          x="800"
          y="158"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="2"
          className="font-mono"
        >
          POLYCARBONAT-MEMBRAN
        </text>
        <line x1="500" y1="600" x2="500" y2="700" strokeWidth="0.8" data-draw="true" />
        <text
          x="500"
          y="720"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="2"
          className="font-mono"
        >
          V-STÜTZE · DEMONTIERBAR
        </text>
      </g>
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
        SCHNITT · 184 TAGE · DEMONTIERBAR IN 28 TAGEN
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 01 — Materialfluss                                                        */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Sankey-style ribbon diagram. Bauteil-Eingänge links → Aufbau → Betrieb →
 * Demontage → Wiederverwertung / Forschung rechts. Thickness encodes mass %.
 */
export function PavilionMaterialfluss(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/60" stroke="currentColor" fill="none">
        <Scaffold />
      </g>
      {/* Inputs on left */}
      <g stroke="none" fill="currentColor" className="text-bone/70">
        <text x="180" y="320" fontSize="13" letterSpacing="1.6" className="font-mono">
          ALUMINIUM
        </text>
        <text x="180" y="460" fontSize="13" letterSpacing="1.6" className="font-mono">
          STAHL
        </text>
        <text x="180" y="560" fontSize="13" letterSpacing="1.6" className="font-mono">
          POLYCARBONAT
        </text>
        <text x="180" y="640" fontSize="13" letterSpacing="1.6" className="font-mono">
          HOLZ
        </text>
      </g>
      {/* Mid-point: 184 Tage Betrieb */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        <rect x="700" y="380" width="200" height="140" fillOpacity="0.12" strokeWidth="1" />
        <text
          x="800"
          y="420"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          className="font-mono"
        >
          BETRIEB
        </text>
        <text
          x="800"
          y="445"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono"
          opacity="0.7"
        >
          184 TAGE
        </text>
        <text
          x="800"
          y="500"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono"
          opacity="0.7"
        >
          SHANGHAI 2010
        </text>
      </g>
      {/* Ribbons in */}
      <g fill="currentColor">
        <path
          d="M 270 310 C 500 310 500 405 700 405 L 700 425 C 500 425 500 330 270 330 Z"
          className="text-bone/40"
          opacity="0.6"
          data-draw="true"
        />
        <path
          d="M 270 450 C 500 450 500 435 700 435 L 700 455 C 500 455 500 470 270 470 Z"
          className="text-bone/40"
          opacity="0.55"
          data-draw="true"
        />
        <path
          d="M 270 550 C 500 550 500 470 700 470 L 700 490 C 500 490 500 570 270 570 Z"
          className="text-bone/40"
          opacity="0.5"
          data-draw="true"
        />
        <path
          d="M 270 630 C 500 630 500 495 700 495 L 700 510 C 500 510 500 650 270 650 Z"
          className="text-bone/40"
          opacity="0.45"
          data-draw="true"
        />
      </g>
      {/* Ribbons out — 94% wiederverwertet, 6% Forschung */}
      <g fill="currentColor">
        <path
          d="M 900 405 C 1100 405 1100 360 1340 360 L 1340 480 C 1100 480 1100 480 900 480 Z"
          className="text-stk-environment"
          opacity="0.5"
          data-draw="true"
        />
        <path
          d="M 900 495 C 1100 495 1100 580 1340 580 L 1340 610 C 1100 610 1100 510 900 510 Z"
          className="text-stk-citizens"
          opacity="0.55"
          data-draw="true"
        />
      </g>
      {/* Output labels */}
      <g stroke="none" fill="currentColor" className="text-bone">
        <text x="1360" y="425" fontSize="13" letterSpacing="1.6" className="font-mono">
          94 % WUHAN
        </text>
        <text
          x="1360"
          y="450"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono text-bone/60"
          opacity="0.7"
        >
          RE-USE
        </text>
        <text x="1360" y="600" fontSize="13" letterSpacing="1.6" className="font-mono">
          6 % TONGJI
        </text>
        <text
          x="1360"
          y="625"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono text-bone/60"
          opacity="0.7"
        >
          FORSCHUNG
        </text>
      </g>
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
        SANKEY · MATERIAL-PASS PRO BAUTEIL
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 02 — Programm                                                             */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Floor plan: four interlocking program zones inside an organic outline.
 * Visitor-flow arrows + frequency ticker (peak 38k).
 */
export function PavilionProgramm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/60" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Pavilion outline — organic blob */}
        <path
          d="M 350 350 Q 400 200 700 220 Q 1000 220 1100 200 Q 1300 200 1300 400 Q 1320 600 1100 650 Q 900 700 700 680 Q 400 700 360 540 Z"
          strokeWidth="1.6"
          opacity="0.7"
          data-draw="true"
        />
      </g>
      {/* Four program zones as colored fills */}
      <g stroke="none" fill="currentColor">
        <path
          d="M 380 360 Q 420 240 660 250 Q 690 320 680 420 Q 540 460 420 440 Z"
          className="text-data-cyan"
          opacity="0.2"
          data-draw="true"
        />
        <path
          d="M 700 240 Q 940 240 1050 230 Q 1080 340 1020 430 Q 880 440 720 430 Q 700 340 700 270 Z"
          className="text-accent"
          opacity="0.22"
          data-draw="true"
        />
        <path
          d="M 1080 250 Q 1280 240 1290 420 Q 1240 510 1080 510 Q 1060 410 1080 280 Z"
          className="text-stk-citizens"
          opacity="0.22"
          data-draw="true"
        />
        <path
          d="M 420 470 Q 600 480 820 460 Q 1010 460 1140 530 Q 1080 660 880 670 Q 580 670 400 590 Z"
          className="text-stk-environment"
          opacity="0.18"
          data-draw="true"
        />
      </g>
      {/* Zone labels */}
      <g stroke="none" fill="currentColor" className="text-bone">
        <text
          x="520"
          y="360"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          className="font-mono"
        >
          AUSSTELLUNG
        </text>
        <text
          x="870"
          y="340"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          className="font-mono"
        >
          BÜHNE
        </text>
        <text
          x="1180"
          y="380"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          className="font-mono"
        >
          CAFÉ
        </text>
        <text
          x="780"
          y="570"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          className="font-mono"
        >
          INNOVATION-LAB
        </text>
      </g>
      {/* Visitor flow arrows */}
      <g className="text-bone-muted" stroke="currentColor" fill="currentColor">
        <path
          d="M 300 460 C 450 470 600 500 720 500"
          strokeWidth="1.4"
          fill="none"
          data-draw="true"
        />
        <polygon points="720,495 736,500 720,505" />
        <text x="280" y="450" fontSize="11" letterSpacing="1.6" className="font-mono">
          EINGANG
        </text>
        <path
          d="M 1100 540 C 1250 540 1320 500 1380 460"
          strokeWidth="1.4"
          fill="none"
          data-draw="true"
        />
        <polygon points="1380,455 1395,448 1390,468" />
        <text x="1400" y="450" fontSize="11" letterSpacing="1.6" className="font-mono">
          AUSGANG
        </text>
      </g>
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
        GRUNDRISS · 4 ZONEN · SPITZE 38 000 / TAG
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 03 — Strukturplanung                                                      */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Seven-node stakeholder diagram with the master facilitator (Bachschuster)
 * at the centre. Concentric reading: outer sponsor, middle institutional,
 * inner planning.
 */
export function PavilionStrukturplanung(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 480;
  const ring = [
    { id: 'expo', label: 'EXPO-Komitee', x: cx, y: 180, hex: '#B85C2E' },
    { id: 'state', label: 'Stadt Shanghai', x: 1180, y: 280, hex: '#4D8FBF' },
    { id: 'tongji', label: 'Tongji Univ.', x: 1240, y: 580, hex: '#4D8FBF' },
    { id: 'tum', label: 'TUM', x: 980, y: 780, hex: '#4D8FBF' },
    { id: 'sponsor', label: 'Privat­sponsor', x: 620, y: 780, hex: '#E8C547' },
    { id: 'wuhan', label: 'Wuhan-Konsortium', x: 360, y: 580, hex: '#7BA659' },
    { id: 'press', label: 'Presse / Public', x: 420, y: 280, hex: '#C2B8A3' },
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
          PAVILLON · 184 TAGE
        </text>
      </g>
      {/* Hub edges */}
      <g stroke="none">
        {ring.map((n) => (
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
      {/* Perimeter dashed */}
      <g stroke="currentColor" fill="none">
        {ring.map((n, i) => {
          const next = ring[(i + 1) % ring.length];
          if (!next) return null;
          return (
            <line
              key={`peri-${n.id}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
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
        {ring.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="32" fill={n.hex} fillOpacity="0.14" />
            <circle cx={n.x} cy={n.y} r="12" fill={n.hex} />
            <text
              x={n.x}
              y={n.y + 54}
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
        {/* Mediator: Bachschuster Strukturplanung */}
        <circle cx={cx} cy={cy} r="46" fill="#B85C2E" fillOpacity="0.12" />
        <circle cx={cx} cy={cy} r="22" fill="#B85C2E" />
        <circle cx={cx} cy={cy} r="7" fill="#0A0B0E" />
        <text
          x={cx}
          y={cy - 64}
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
