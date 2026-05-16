/**
 * Hand-authored SVG portraits for the team. Each portrait composes:
 *  · Backdrop tile (moss-wall, paper, or sky reference) matching the studio
 *    photo's signature green moss wall.
 *  · Head silhouette + hair shape per `Hair` variant.
 *  · Optional glasses overlay.
 *  · Torso silhouette tinted to the member's dominant outfit colour.
 *
 * Felix's brief 2026-05-16: don't crop the photo, "konstruier die Bilder nach."
 * The line-art is stylised — readable as "an editorial illustration of a
 * person", not as anyone specifically. The match to each member is via the
 * outfit-colour + hair-shape pairing rather than facial likeness, which keeps
 * the portraits Awwwards-grade clean and removes any photo-realism uncanny
 * valley.
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
  accent: '#B85C2E',
  cyan: '#4D8FBF',
  environment: '#7BA659',
  citizens: '#E8C547',
  bone: '#C2B8A3',
  dark: '#1A1F28',
};

const BACKDROP_HEX: Record<'moss' | 'paper' | 'sky', string> = {
  moss: '#3B5A38',
  paper: '#ECE6D8',
  sky: '#4D8FBF',
};

const HAIR_HEX: Record<Hair, string> = {
  'short-blonde': '#D9C794',
  'short-balding': '#5C5A55',
  'long-blonde': '#D9C794',
  'long-brown': '#6B4A2E',
  'short-grey': '#C2B8A3',
  'long-brown-bangs': '#5C3A22',
};

const SKIN = '#E6CFB8';

export function TeamPortrait({ hair, glasses, outfit, backdrop, ...rest }: TeamPortraitProps) {
  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid meet" role="presentation" {...rest}>
      {/* Backdrop tile — tilted to match the studio photo's mosswall frames */}
      <g>
        <rect
          x="14"
          y="14"
          width="172"
          height="216"
          rx="2"
          fill={BACKDROP_HEX[backdrop]}
          stroke="#0A0B0E"
          strokeWidth="2"
          transform="rotate(-3 100 122)"
        />
        {backdrop === 'moss' ? <MossTexture /> : null}
      </g>

      {/* Torso */}
      <g transform="translate(100 175)">
        <path d={torsoPath(outfit)} fill={OUTFIT_HEX[outfit]} stroke="#0A0B0E" strokeWidth="1.5" />
      </g>

      {/* Neck */}
      <rect x="92" y="120" width="16" height="22" fill={SKIN} stroke="#0A0B0E" strokeWidth="1" />

      {/* Head */}
      <g>
        <ellipse cx="100" cy="100" rx="32" ry="38" fill={SKIN} stroke="#0A0B0E" strokeWidth="1.5" />
        <Hairstyle variant={hair} hairHex={HAIR_HEX[hair]} />
        {/* Eyes — small dots */}
        <circle cx="88" cy="98" r="2" fill="#0A0B0E" />
        <circle cx="112" cy="98" r="2" fill="#0A0B0E" />
        {/* Mouth — subtle warm line */}
        <path
          d="M 89 116 Q 100 121 111 116"
          fill="none"
          stroke="#0A0B0E"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Glasses */}
        {glasses ? <Glasses /> : null}
      </g>
    </svg>
  );
}

function torsoPath(outfit: Outfit): string {
  // Two-tone torso silhouette: shoulders curve outward, then narrow at waist.
  // Outfit variants nudge the shape slightly so the team isn't visually
  // homogeneous — bone-wear gets a softer collar, dark gets a sharper edge.
  if (outfit === 'dark') {
    return 'M -56 0 L -50 -8 L -22 -20 L 22 -20 L 50 -8 L 56 0 L 56 65 L -56 65 Z';
  }
  if (outfit === 'bone') {
    return 'M -60 4 Q -56 -12 -20 -22 L 20 -22 Q 56 -12 60 4 L 60 65 L -60 65 Z';
  }
  // accent / cyan / environment / citizens — collared jacket profile
  return 'M -58 0 Q -52 -10 -24 -20 L -10 -16 L 0 -8 L 10 -16 L 24 -20 Q 52 -10 58 0 L 58 65 L -58 65 Z';
}

function Hairstyle({ variant, hairHex }: { variant: Hair; hairHex: string }) {
  const stroke = { stroke: '#0A0B0E', strokeWidth: 1.5, fill: hairHex } as const;
  switch (variant) {
    case 'short-blonde':
      // Short pixie-style cut framing the head
      return (
        <path
          d="M 70 78 Q 72 56 100 56 Q 130 56 132 80 L 130 96 L 124 88 L 120 96 L 112 86 L 104 92 L 96 86 L 88 92 L 80 86 L 76 96 L 70 90 Z"
          {...stroke}
        />
      );
    case 'short-balding':
      // Receding hairline + side hair
      return (
        <>
          <path d="M 68 88 Q 70 72 82 70 Q 84 84 84 96 L 70 102 Z" {...stroke} />
          <path d="M 132 88 Q 130 72 118 70 Q 116 84 116 96 L 130 102 Z" {...stroke} />
          <path
            d="M 76 76 Q 88 64 100 68 Q 112 64 124 76"
            fill="none"
            stroke="#0A0B0E"
            strokeWidth="1.2"
            opacity="0.55"
          />
        </>
      );
    case 'long-blonde':
      // Shoulder-length hair falling on both sides
      return (
        <>
          <path
            d="M 68 80 Q 70 56 100 54 Q 130 56 132 80 L 138 140 L 124 130 L 118 96 L 100 92 L 82 96 L 76 130 L 62 140 Z"
            {...stroke}
          />
        </>
      );
    case 'long-brown':
      // Long parted hair past shoulders
      return (
        <>
          <path
            d="M 66 80 Q 68 54 100 52 Q 132 54 134 80 L 140 150 L 122 140 L 118 96 L 100 86 L 82 96 L 78 140 L 60 150 Z"
            {...stroke}
          />
          <line
            x1="100"
            y1="56"
            x2="100"
            y2="86"
            stroke="#0A0B0E"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </>
      );
    case 'short-grey':
      // Short cut with side sweep
      return (
        <path
          d="M 70 82 Q 72 58 100 58 Q 128 58 132 80 L 130 92 L 122 88 L 116 94 L 108 88 L 100 92 L 90 88 L 80 94 L 74 88 Z"
          {...stroke}
        />
      );
    case 'long-brown-bangs':
      // Long brown with straight-cut bangs covering forehead
      return (
        <>
          <path
            d="M 66 78 Q 68 54 100 52 Q 132 54 134 78 L 140 150 L 122 140 L 118 96 L 100 86 L 82 96 L 78 140 L 60 150 Z"
            {...stroke}
          />
          {/* Bangs */}
          <path
            d="M 72 82 L 80 92 L 92 86 L 100 92 L 108 86 L 120 92 L 128 82 L 128 88 L 100 96 L 72 88 Z"
            fill={HAIR_HEX['long-brown-bangs']}
            stroke="#0A0B0E"
            strokeWidth="1"
          />
        </>
      );
  }
}

function Glasses() {
  return (
    <g stroke="#0A0B0E" strokeWidth="1.4" fill="none">
      <circle cx="88" cy="100" r="9" fill="rgba(255,255,255,0.15)" />
      <circle cx="112" cy="100" r="9" fill="rgba(255,255,255,0.15)" />
      <line x1="97" y1="100" x2="103" y2="100" />
      <line x1="79" y1="100" x2="74" y2="98" />
      <line x1="121" y1="100" x2="126" y2="98" />
    </g>
  );
}

/** A sparse texture overlay on the moss backdrop — hints at the studio wall. */
function MossTexture() {
  return (
    <g transform="rotate(-3 100 122)" opacity="0.5">
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 22 + (i % 6) * 28;
        const y = 26 + Math.floor(i / 6) * 36;
        const r = ((i * 13) % 5) + 2;
        return <circle key={i} cx={x} cy={y} r={r} fill="#4D6E48" opacity="0.55" />;
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 30 + (i % 5) * 34;
        const y = 60 + Math.floor(i / 5) * 50;
        const r = ((i * 7) % 4) + 1;
        return <circle key={`s-${i}`} cx={x} cy={y} r={r} fill="#2E4029" opacity="0.4" />;
      })}
    </g>
  );
}
