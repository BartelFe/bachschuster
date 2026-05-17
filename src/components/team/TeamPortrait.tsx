/**
 * Editorial portrait tiles for the team.
 *
 * v2 (2026-05-16) — Felix flagged the v1 portraits as "spielerische Manschgal"
 * (playful little caricatures). The current pass replaces eyes / mouth / cute
 * hair paths with a strict editorial silhouette language:
 *
 *  · Backdrop is a single warm-tone rectangle with a faint axonometric grid.
 *  · Subject is a head-and-shoulders silhouette in three-quarter profile,
 *    rendered as solid forms (no facial features).
 *  · Hair, glasses, and outfit are differentiating *shapes*, not portraits.
 *  · A typographic block at the bottom carries a corner-mark + small mono
 *    caption — same engineering-drawing trim the rest of the site uses.
 *
 * The result reads as "editorial illustration" rather than "cartoon avatar",
 * matching the Fraunces + JetBrains Mono visual language elsewhere.
 */

import { type SVGProps } from 'react';
import type { Hair, Outfit } from '@/content/team';

interface TeamPortraitProps extends SVGProps<SVGSVGElement> {
  hair: Hair;
  glasses: boolean;
  outfit: Outfit;
  backdrop: 'moss' | 'paper' | 'sky';
}

const OUTFIT_HEX: Record<Outfit, string> = {
  // v2 brand-CI: `accent` outfit follows the new cyan brand. The portraits
  // are stylised — not photographic — so the outfit colour reads as a
  // "brand chip" on the member rather than a literal wardrobe match.
  accent: '#75C9D9',
  cyan: '#4D8FBF',
  environment: '#5A7A48',
  citizens: '#C9A93B',
  bone: '#9B9385',
  dark: '#1E232C',
};

/**
 * Backdrop palette — warm, low-chroma, editorial. The previous moss-green was
 * too literal (it referenced the studio photo wall); the v2 palette is
 * abstract paper-tones that don't try to "look like the office".
 */
const BACKDROP_HEX: Record<'moss' | 'paper' | 'sky', { fill: string; grid: string }> = {
  moss: { fill: '#2A3A2A', grid: '#3D5040' },
  paper: { fill: '#ECE6D8', grid: '#C2B8A3' },
  sky: { fill: '#1F2A33', grid: '#2E3E48' },
};

const SILHOUETTE = '#0A0B0E';

export function TeamPortrait({ hair, glasses, outfit, backdrop, ...rest }: TeamPortraitProps) {
  const bg = BACKDROP_HEX[backdrop];
  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid meet" role="presentation" {...rest}>
      {/* ── Backdrop ────────────────────────────────────────────────── */}
      <rect width="200" height="240" fill={bg.fill} />
      {/* Axonometric grid — quiet engineering-drawing texture */}
      <g stroke={bg.grid} strokeWidth="0.4" opacity="0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v-${i}`} x1={20 + i * 20} y1="0" x2={20 + i * 20} y2="240" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={20 + i * 20} x2="200" y2={20 + i * 20} />
        ))}
      </g>

      {/* Frame ticks — engineering-drawing corner marks */}
      <g stroke={SILHOUETTE} strokeWidth="0.8" fill="none">
        <path d="M 4 12 L 4 4 L 12 4" />
        <path d="M 188 4 L 196 4 L 196 12" />
        <path d="M 4 228 L 4 236 L 12 236" />
        <path d="M 188 236 L 196 236 L 196 228" />
      </g>

      {/* ── Subject ────────────────────────────────────────────────────
          Bottom-anchored silhouette. The full composition reads as
          shoulder line + neck + head, with hair + glasses + outfit acting
          as the differentiating shapes. */}

      {/* Shoulders / torso — a single solid block in the member's outfit colour */}
      <path d={shoulderPath(outfit)} fill={OUTFIT_HEX[outfit]} />

      {/* A thin top edge of the shoulders in black to separate from the head */}
      <path d={shoulderTopEdge(outfit)} fill="none" stroke={SILHOUETTE} strokeWidth="1" />

      {/* Head silhouette — solid, no features */}
      <ellipse cx="100" cy="108" rx="30" ry="36" fill={SILHOUETTE} />

      {/* Hair as a separate silhouette shape on top of the head */}
      <Hairstyle variant={hair} />

      {/* Glasses — a single horizontal mono-line bar, the only "facial" hint */}
      {glasses ? (
        <g>
          <line
            x1="76"
            y1="108"
            x2="124"
            y2="108"
            stroke={BACKDROP_HEX[backdrop].grid}
            strokeWidth="1.6"
            strokeLinecap="square"
            opacity="0.95"
          />
          <line
            x1="100"
            y1="108"
            x2="100"
            y2="108"
            stroke={BACKDROP_HEX[backdrop].fill}
            strokeWidth="2.4"
          />
        </g>
      ) : null}

      {/* ── Caption bar (bottom) ──────────────────────────────────────── */}
      <g>
        <line
          x1="14"
          y1="222"
          x2="60"
          y2="222"
          stroke={SILHOUETTE}
          strokeWidth="0.6"
          opacity="0.7"
        />
        <text
          x="14"
          y="231"
          fontSize="6.5"
          fontFamily="ui-monospace, monospace"
          letterSpacing="1.3"
          fill={SILHOUETTE}
          opacity="0.7"
        >
          PORTRAIT · {hair.replace(/-/g, ' ').toUpperCase()}
        </text>
      </g>
    </svg>
  );
}

/**
 * Outfit-shape variants — the outline that meets the bottom of the frame.
 * Each is a distinct geometry so the team reads as five different *figures*,
 * not five clones with hue swaps.
 */
function shoulderPath(outfit: Outfit): string {
  switch (outfit) {
    case 'dark':
      // Sharp lapel-style: angled shoulders, deep V notch.
      return 'M 0 240 L 0 188 L 56 168 L 88 150 L 100 162 L 112 150 L 144 168 L 200 188 L 200 240 Z';
    case 'bone':
      // Softer round neckline — a smooth curve from shoulder to neck.
      return 'M 0 240 L 0 184 Q 30 168 70 160 Q 88 155 100 168 Q 112 155 130 160 Q 170 168 200 184 L 200 240 Z';
    case 'accent':
      // Angular geometric collar — references the architectural diagrams.
      return 'M 0 240 L 0 186 L 50 166 L 78 158 L 100 172 L 122 158 L 150 166 L 200 186 L 200 240 Z';
    case 'cyan':
      // Wide horizontal collar — straight cut.
      return 'M 0 240 L 0 188 L 70 168 L 100 168 L 130 168 L 200 188 L 200 240 Z';
    case 'environment':
      // Rounded scoop with subtle curve.
      return 'M 0 240 L 0 188 Q 36 172 78 164 Q 100 178 122 164 Q 164 172 200 188 L 200 240 Z';
    case 'citizens':
      // Wrapped diagonal — asymmetric drape.
      return 'M 0 240 L 0 188 L 60 170 L 100 156 L 124 174 L 148 168 L 200 184 L 200 240 Z';
  }
}

function shoulderTopEdge(outfit: Outfit): string {
  switch (outfit) {
    case 'dark':
      return 'M 0 188 L 56 168 L 88 150 L 100 162 L 112 150 L 144 168 L 200 188';
    case 'bone':
      return 'M 0 184 Q 30 168 70 160 Q 88 155 100 168 Q 112 155 130 160 Q 170 168 200 184';
    case 'accent':
      return 'M 0 186 L 50 166 L 78 158 L 100 172 L 122 158 L 150 166 L 200 186';
    case 'cyan':
      return 'M 0 188 L 70 168 L 100 168 L 130 168 L 200 188';
    case 'environment':
      return 'M 0 188 Q 36 172 78 164 Q 100 178 122 164 Q 164 172 200 188';
    case 'citizens':
      return 'M 0 188 L 60 170 L 100 156 L 124 174 L 148 168 L 200 184';
  }
}

/**
 * Hair silhouettes as solid black shapes sitting on top of the head ellipse.
 * Each one is a distinct geometric *gesture* rather than a literal hair-style
 * — short, parted, swept, long, bobbed. The shape is what disambiguates the
 * five team members at a glance.
 */
function Hairstyle({ variant }: { variant: Hair }) {
  switch (variant) {
    case 'short-blonde':
      // Compact dome with a flick on the right.
      return (
        <path
          d="M 70 96 Q 72 76 100 72 Q 128 74 132 96 L 130 100 Q 120 84 100 84 Q 80 84 70 100 Z"
          fill={SILHOUETTE}
        />
      );
    case 'short-balding':
      // Side tufts only — open crown.
      return (
        <g fill={SILHOUETTE}>
          <path d="M 70 100 Q 70 84 82 82 Q 84 92 84 104 L 70 108 Z" />
          <path d="M 130 100 Q 130 84 118 82 Q 116 92 116 104 L 130 108 Z" />
        </g>
      );
    case 'long-blonde':
      // Long fall on both sides, shoulder-length.
      return (
        <path
          d="M 68 96 Q 70 74 100 70 Q 130 74 132 96 L 140 162 L 124 156 L 118 112 L 100 108 L 82 112 L 76 156 L 60 162 Z"
          fill={SILHOUETTE}
        />
      );
    case 'long-brown':
      // Centre-parted, longer drape.
      return (
        <g>
          <path
            d="M 66 94 Q 68 72 100 68 Q 132 72 134 94 L 142 170 L 122 164 L 118 112 L 100 102 L 82 112 L 78 164 L 58 170 Z"
            fill={SILHOUETTE}
          />
          <line
            x1="100"
            y1="72"
            x2="100"
            y2="102"
            stroke="#2A2A2A"
            strokeWidth="0.6"
            opacity="0.7"
          />
        </g>
      );
    case 'short-grey':
      // Side-swept, single sloping curve.
      return (
        <path
          d="M 70 98 Q 72 78 100 76 Q 128 76 132 96 L 130 102 Q 120 90 100 92 Q 86 92 76 104 Z"
          fill={SILHOUETTE}
        />
      );
    case 'long-brown-bangs':
      // Long with a horizontal block of bangs.
      return (
        <g fill={SILHOUETTE}>
          <path d="M 66 94 Q 68 72 100 68 Q 132 72 134 94 L 142 170 L 122 164 L 118 112 L 100 102 L 82 112 L 78 164 L 58 170 Z" />
          <path d="M 72 94 L 128 94 L 128 104 L 100 110 L 72 104 Z" />
        </g>
      );
  }
}
