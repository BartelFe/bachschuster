/**
 * Five Röntgen-Layer diagrams for Mobility Hub Ingolstadt.
 *
 * Visual identity: cyan/teal palette + warm accent for soft program elements,
 * urban section-view as repeating motif, mode-color-coded flow arrows on
 * layer 01.
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
      strokeWidth="0.5"
      opacity="0.10"
    />
    <line
      x1="1400"
      y1="100"
      x2="1400"
      y2="800"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.10"
    />
  </g>
);

/* ───────────────────────────────────────────────────────────────────────── */
/* 00 — Hülle                                                                */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Section through the six-storey hybrid wood building. Tiefgarage (UG),
 * Erdgeschoss social, Geschosse 1–5 program, lamellated façade hint right.
 */
export function HubHuelle(props: SVGProps<SVGSVGElement>) {
  const floors = [
    { y: 720, label: 'UG · Tiefgarage' },
    { y: 640, label: 'EG · Quartiers­wohnzimmer' },
    { y: 560, label: '1. OG · PKW' },
    { y: 480, label: '2. OG · PKW' },
    { y: 400, label: '3. OG · Rad / Scooter' },
    { y: 320, label: '4. OG · Bus-Hub' },
    { y: 240, label: '5. OG · Energie' },
  ];
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/80" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Outer envelope */}
        <rect x="300" y="220" width="1000" height="600" strokeWidth="2.4" data-draw="true" />
        {/* Floor slabs */}
        {floors.map((f) => (
          <line
            key={`floor-${f.y}`}
            x1="300"
            y1={f.y}
            x2="1300"
            y2={f.y}
            strokeWidth="1.2"
            data-draw="true"
          />
        ))}
        {/* PV roof + dachform */}
        <path d="M 300 220 L 800 180 L 1300 220" strokeWidth="1.8" data-draw="true" />
        {/* PV-Felder (Layer 02 will show these emphasized) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 320 + i * 96;
          return (
            <line
              key={`pv-${i}`}
              x1={x}
              y1={220 - Math.abs(i - 4.5) * 2}
              x2={x + 80}
              y2={220 - Math.abs(i - 4.5) * 2}
              strokeWidth="0.6"
              opacity="0.5"
              data-draw="true"
            />
          );
        })}
        {/* Aluminium-Lamellen-Façade hint (right side) */}
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 240 + i * 40;
          return (
            <line
              key={`lam-${i}`}
              x1="1300"
              y1={y}
              x2="1340"
              y2={y + 10}
              strokeWidth="0.6"
              opacity="0.5"
              data-draw="true"
            />
          );
        })}
        {/* Ground line */}
        <line x1="100" y1="820" x2="1500" y2="820" strokeWidth="0.8" opacity="0.4" />
      </g>
      {/* Floor labels */}
      <g stroke="none" fill="currentColor" className="text-bone-muted">
        {floors.map((f) => (
          <text
            key={`lbl-${f.y}`}
            x="1320"
            y={f.y - 6}
            fontSize="10"
            letterSpacing="1.5"
            className="font-mono"
            opacity="0.75"
          >
            {f.label}
          </text>
        ))}
      </g>
      {/* Height marker */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        <line x1="240" y1="220" x2="240" y2="820" strokeWidth="0.8" data-draw="true" />
        <line x1="232" y1="220" x2="248" y2="220" strokeWidth="0.8" />
        <line x1="232" y1="820" x2="248" y2="820" strokeWidth="0.8" />
        <text
          x="220"
          y="540"
          fontSize="11"
          letterSpacing="1.6"
          textAnchor="end"
          className="font-mono"
        >
          32 m
        </text>
      </g>
      <text
        x="800"
        y="870"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="2"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        SCHNITT · HOLZ-HYBRID · 14 200 m²
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 01 — Mobilitätsströme                                                     */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Top-down plan with five mode flows weaving in/out of the hub. Each mode
 * has a distinct color drawn from the stakeholder palette.
 */
export function HubMobilitaetsstroeme(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Hub footprint */}
        <rect
          x="600"
          y="320"
          width="400"
          height="280"
          strokeWidth="1.4"
          opacity="0.7"
          data-draw="true"
        />
        <text
          x="800"
          y="480"
          textAnchor="middle"
          fontSize="15"
          letterSpacing="2"
          fill="currentColor"
          className="font-mono"
          opacity="0.8"
        >
          HUB
        </text>
      </g>
      {/* PKW — terrakotta, thick */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        <path
          d="M 100 200 C 350 200 450 350 600 380"
          strokeWidth="2.4"
          fill="none"
          data-draw="true"
        />
        <polygon points="600,375 614,380 600,385" />
        <text x="120" y="190" fontSize="11" letterSpacing="1.6" className="font-mono">
          PKW · 320 Plätze
        </text>
      </g>
      {/* Räder — cyan, thinner */}
      <g className="text-data-cyan" stroke="currentColor" fill="currentColor">
        <path
          d="M 100 460 C 300 460 480 420 600 460"
          strokeWidth="1.6"
          fill="none"
          data-draw="true"
        />
        <polygon points="600,455 614,460 600,465" />
        <text x="120" y="450" fontSize="11" letterSpacing="1.6" className="font-mono">
          RAD · 240 Stellplätze
        </text>
      </g>
      {/* E-Scooter — citizens yellow */}
      <g className="text-stk-citizens" stroke="currentColor" fill="currentColor">
        <path
          d="M 100 540 C 250 540 460 510 600 540"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="6 3"
          data-draw="true"
        />
        <polygon points="600,535 614,540 600,545" />
        <text x="120" y="530" fontSize="11" letterSpacing="1.6" className="font-mono">
          SCOOTER · 80
        </text>
      </g>
      {/* Bus — environment */}
      <g className="text-stk-environment" stroke="currentColor" fill="currentColor">
        <path
          d="M 1500 280 C 1300 280 1100 360 1000 380"
          strokeWidth="2.2"
          fill="none"
          data-draw="true"
        />
        <polygon points="1000,375 986,380 1000,385" />
        <text
          x="1430"
          y="270"
          textAnchor="end"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono"
        >
          BUS · Wendeschleife
        </text>
      </g>
      {/* Fußgänger — institutional grey, dotted */}
      <g className="text-stk-institutional" stroke="currentColor" fill="currentColor">
        <path
          d="M 1500 620 C 1300 620 1080 600 1000 560"
          strokeWidth="1"
          fill="none"
          strokeDasharray="2 3"
          data-draw="true"
        />
        <polygon points="1000,555 986,560 1000,565" />
        <text
          x="1430"
          y="640"
          textAnchor="end"
          fontSize="11"
          letterSpacing="1.6"
          className="font-mono"
        >
          FUSS · Plaza
        </text>
      </g>
      {/* Mode-switch indicator inside the hub */}
      <g className="text-bone" stroke="currentColor" fill="currentColor">
        <circle cx="800" cy="460" r="28" fill="none" strokeWidth="0.8" data-draw="true" />
        <text
          x="800"
          y="465"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          className="font-mono"
        >
          Ø 4 min
        </text>
        <text
          x="800"
          y="510"
          textAnchor="middle"
          fontSize="9"
          letterSpacing="2"
          className="font-mono text-bone-muted"
          opacity="0.6"
        >
          MODUS-WECHSEL
        </text>
      </g>
      <text
        x="800"
        y="870"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="2"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        GRUNDRISS · 5 MODI · GEKOPPELT
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 02 — Energiekonzept                                                       */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Energy schematic: PV roof → battery → heat pump → ground water loop →
 * net-positive arrow exporting to the Quartier.
 */
export function HubEnergie(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <Scaffold />
        {/* Building outline reference */}
        <rect x="500" y="280" width="600" height="440" strokeWidth="0.8" opacity="0.4" />
      </g>
      {/* PV-Dach */}
      <g className="text-stk-citizens" stroke="currentColor" fill="currentColor">
        <path d="M 480 280 L 800 200 L 1120 280" strokeWidth="2" fill="none" data-draw="true" />
        {Array.from({ length: 16 }).map((_, i) => {
          const lx = 480 + i * 40;
          const ly = 280 - Math.abs(i - 8) * 10;
          return (
            <rect key={`pv-${i}`} x={lx} y={ly - 4} width="32" height="6" fillOpacity="0.65" />
          );
        })}
        <text
          x="800"
          y="180"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          className="font-mono"
        >
          PV · 2 800 m²
        </text>
      </g>
      {/* Battery — center of building */}
      <g className="text-accent" stroke="currentColor" fill="currentColor">
        <rect
          x="720"
          y="580"
          width="160"
          height="80"
          fill="none"
          strokeWidth="1.4"
          data-draw="true"
        />
        <rect x="730" y="592" width="22" height="58" fillOpacity="0.4" />
        <rect x="760" y="592" width="22" height="58" fillOpacity="0.6" />
        <rect x="790" y="592" width="22" height="58" fillOpacity="0.8" />
        <rect x="820" y="592" width="22" height="58" fillOpacity="0.6" />
        <rect x="850" y="592" width="22" height="58" fillOpacity="0.4" />
        <text
          x="800"
          y="700"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          className="font-mono"
        >
          800 kWh
        </text>
      </g>
      {/* Heat pump */}
      <g className="text-data-cyan" stroke="currentColor" fill="currentColor">
        <circle cx="560" cy="480" r="32" fill="none" strokeWidth="1.4" data-draw="true" />
        <path d="M 540 480 L 580 480 M 560 460 L 560 500" strokeWidth="1.2" />
        <text
          x="560"
          y="540"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          className="font-mono"
        >
          WP · Grundwasser
        </text>
      </g>
      {/* Ground water loop */}
      <g className="text-data-teal" stroke="currentColor" fill="none">
        <path
          d="M 560 540 Q 560 760 280 760"
          strokeWidth="1.2"
          strokeDasharray="6 4"
          data-draw="true"
        />
        <text
          x="280"
          y="780"
          fontSize="10"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono"
          opacity="0.8"
        >
          GRUNDWASSER · 11 m
        </text>
      </g>
      {/* Flow arrows: PV → Battery → Quartier */}
      <g className="text-bone" stroke="currentColor" fill="currentColor">
        <path d="M 800 300 L 800 580" strokeWidth="1.2" data-draw="true" />
        <polygon points="795,575 800,592 805,575" />
        <path d="M 880 620 L 1280 620" strokeWidth="1.4" data-draw="true" />
        <polygon points="1275,615 1295,620 1275,625" />
        <text x="1300" y="615" fontSize="11" letterSpacing="1.8" className="font-mono">
          QUARTIER · +12 %
        </text>
      </g>
      <text
        x="800"
        y="870"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="2"
        fill="currentColor"
        className="font-mono text-bone/60"
        opacity="0.7"
      >
        SCHEMA · NETTO POSITIV ENERGIE
      </text>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 03 — Sozialer Raum                                                        */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Ground-floor plan + 500 m catchment ring. Soft program tiles inside the
 * ground slab; outside a population density ring showing +960 residents.
 */
export function HubSozial(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} preserveAspectRatio="xMidYMid meet" {...props}>
      <g className="text-bone/40" stroke="currentColor" fill="none">
        <Scaffold />
      </g>
      {/* 500 m catchment ring */}
      <g className="text-stk-environment" stroke="currentColor" fill="none">
        <circle
          cx="800"
          cy="460"
          r="280"
          strokeWidth="0.6"
          strokeDasharray="3 4"
          opacity="0.6"
          data-draw="true"
        />
        <text
          x="800"
          y="170"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.8"
          fill="currentColor"
          className="font-mono"
        >
          500 m KATCHEMENT
        </text>
        {/* Resident dots scattered around the ring */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i / 36) * Math.PI * 2;
          const r = 200 + (i % 7) * 12;
          const x = 800 + Math.cos(angle) * r;
          const y = 460 + Math.sin(angle) * r;
          return <circle key={`p-${i}`} cx={x} cy={y} r="2.4" fill="currentColor" opacity="0.5" />;
        })}
      </g>
      {/* Hub footprint */}
      <g className="text-bone/70" stroke="currentColor" fill="none">
        <rect x="640" y="360" width="320" height="220" strokeWidth="1.4" data-draw="true" />
      </g>
      {/* Soft program tiles */}
      <g fill="currentColor" stroke="none">
        <rect
          x="660"
          y="380"
          width="120"
          height="60"
          className="text-accent"
          fillOpacity="0.32"
          data-draw="true"
        />
        <text
          x="720"
          y="416"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono text-bone"
        >
          CAFÉ
        </text>
        <rect
          x="800"
          y="380"
          width="140"
          height="60"
          className="text-stk-citizens"
          fillOpacity="0.3"
          data-draw="true"
        />
        <text
          x="870"
          y="416"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono text-bone"
        >
          CO-WORKING · 28
        </text>
        <rect
          x="660"
          y="460"
          width="160"
          height="100"
          className="text-stk-environment"
          fillOpacity="0.3"
          data-draw="true"
        />
        <text
          x="740"
          y="510"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono text-bone"
        >
          KITA-AUSLAUF
        </text>
        <rect
          x="840"
          y="460"
          width="100"
          height="100"
          className="text-data-cyan"
          fillOpacity="0.3"
          data-draw="true"
        />
        <text
          x="890"
          y="510"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="1.6"
          fill="currentColor"
          className="font-mono text-bone"
        >
          REPAIR
        </text>
      </g>
      {/* Catchment population label */}
      <g className="text-bone" stroke="none" fill="currentColor">
        <text
          x="800"
          y="800"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="2"
          className="font-mono"
        >
          +960 BEWOHNER IM 500 m UMKREIS
        </text>
      </g>
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* 04 — Strukturplanung                                                      */
/* ───────────────────────────────────────────────────────────────────────── */
/**
 * Six stakeholder nodes around the central mediator. Edges are weighted by
 * conflict-intensity (thicker line = more friction needed to bridge).
 */
export function HubStrukturplanung(props: SVGProps<SVGSVGElement>) {
  const cx = 800;
  const cy = 480;
  const nodes = [
    { id: 'city', label: 'Stadt Ingolstadt', x: cx, y: 200, hex: '#4D8FBF', weight: 2.4 },
    { id: 'ifg', label: 'IFG', x: 1240, y: 320, hex: '#4D8FBF', weight: 1.2 },
    { id: 'operator', label: 'Verkehrs-Operator', x: 1240, y: 640, hex: '#B85C2E', weight: 2.0 },
    { id: 'citizens', label: 'Bürgerinitiative', x: cx, y: 780, hex: '#E8C547', weight: 2.8 },
    { id: 'climate', label: 'Klimarat', x: 360, y: 640, hex: '#7BA659', weight: 1.4 },
    { id: 'commuter', label: 'Pendler', x: 360, y: 320, hex: '#C2B8A3', weight: 1.6 },
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
          QUARTIER · MOBILITY HUB
        </text>
      </g>
      {/* Hub edges */}
      <g stroke="none">
        {nodes.map((n) => (
          <line
            key={`hub-${n.id}`}
            x1={n.x}
            y1={n.y}
            x2={cx}
            y2={cy}
            stroke={n.hex}
            strokeWidth={n.weight * 0.6}
            strokeOpacity="0.65"
            data-draw="true"
          />
        ))}
      </g>
      {/* Perimeter dashed */}
      <g stroke="currentColor" fill="none">
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
              strokeWidth="0.5"
              opacity="0.16"
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
            <circle cx={n.x} cy={n.y} r="34" fill={n.hex} fillOpacity="0.14" />
            <circle cx={n.x} cy={n.y} r="13" fill={n.hex} />
            <text
              x={n.x}
              y={n.y + 56}
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
