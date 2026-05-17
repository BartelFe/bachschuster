import type { Config } from 'tailwindcss';

/**
 * Bachschuster theme — derived from master prompt § 3.1–3.4.
 *
 * COLORS
 *  · Explicit dark palette: ink, surface, elevated, bone, bone-muted, bone-faint, border-subtle, border-strong
 *  · Explicit light palette: paper, paper-raised, ink-soft, ink-faded
 *  · Theme-aware semantic via CSS vars: canvas, canvas-raised, prose, prose-muted, prose-faint, rule
 *    (swap by toggling [data-theme="light"|"dark"] on an ancestor)
 *  · Functional constants: accent, data, stk (stakeholders)
 *
 * TYPOGRAPHY
 *  · font-display (Fraunces), font-sans (Switzer), font-mono (JetBrains Mono)
 *  · text-display-hero / display-section / pull-quote — clamp()-based with line-height + tracking + weight presets
 *  · text-body-l / body-m / body-s, text-caption (uppercase tracking), text-data-label, text-coordinates
 *
 * SPACING
 *  · s1..s10 extend the default scale (4 / 8 / 16 / 24 / 40 / 64 / 96 / 144 / 220 / 340 px)
 *
 * MOTION
 *  · ease-cinematic / ease-punchy / ease-inertial
 *  · duration-hover (220ms) / duration-reveal (1200ms)
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // ─── Explicit Dark Mode palette (§ 3.1) ───────────────
        ink: '#0A0B0E',
        surface: '#11141A',
        elevated: '#1A1F28',
        bone: '#F2EDE2',
        'bone-muted': '#9B9385',
        'bone-faint': '#5C5A55',
        'border-subtle': '#1E232C',
        'border-strong': '#2A303B',

        // ─── Explicit Light Mode palette (§ 3.1) ──────────────
        paper: '#ECE6D8',
        'paper-raised': '#F4EFE3',
        'ink-soft': '#1A1612',
        'ink-faded': '#4A453D',

        // ─── Accent: Aqua-Cyan / Architectural Blueprint ──────
        // v2 (2026-05-17 brand-CI refresh) — switched from terrakotta to
        // the existing bachschuster.de brand cyan. Felix specified
        // #75C9D9 primary + #4E8FCC nuance; #A4DEEB derived as the
        // lighter "glow" used by lit pin halos + particle layer-mid.
        // Stakeholder palette is intentionally untouched: `stk-business`
        // stays terrakotta so the force-graph stakeholder groups remain
        // visually distinguishable.
        accent: {
          DEFAULT: '#75C9D9',
          glow: '#A4DEEB',
          shadow: '#4E8FCC',
        },

        // ─── Data Layer: Architectural Blueprint ──────────────
        data: {
          cyan: '#4D8FBF',
          teal: '#2D6878',
        },

        // ─── Stakeholders (Force Graph) ───────────────────────
        stk: {
          city: '#4D8FBF',
          business: '#B85C2E',
          citizens: '#E8C547',
          environment: '#7BA659',
          institutional: '#C2B8A3',
        },

        // ─── Theme-aware semantic tokens (CSS vars) ───────────
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        'canvas-raised': 'rgb(var(--c-canvas-raised) / <alpha-value>)',
        prose: 'rgb(var(--c-prose) / <alpha-value>)',
        'prose-muted': 'rgb(var(--c-prose-muted) / <alpha-value>)',
        'prose-faint': 'rgb(var(--c-prose-faint) / <alpha-value>)',
        rule: 'rgb(var(--c-rule) / <alpha-value>)',
      },

      fontFamily: {
        display: ['"Fraunces Variable"', '"Fraunces"', '"Times New Roman"', 'serif'],
        sans: ['"Switzer"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: [
          '"JetBrains Mono Variable"',
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },

      fontSize: {
        // Display (serif) — clamp ranges from § 3.2.
        //
        // Hero upper bound history:
        //   v1 (master prompt)    → clamp(120, 14vw, 280)  too large, overlapped trim
        //   v2 (audit overlap-fix)→ clamp(112, 12vw, 220)  still too large at 1440
        //   v3 (live review fix)  → clamp(72, 9vw, 144)    current — leaves SectionTracker
        //                                                   and Intro-überspringen room
        // The 5-word German claim "Vor dem Gebäude, das System." is too long
        // to render at 200+ px without dominating the viewport and crowding
        // the chapter indicator. 144 px max is still monumental Fraunces
        // display type while letting the top-of-section overlays breathe.
        'display-hero': [
          'clamp(72px, 9vw, 144px)',
          { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '300' },
        ],
        'display-section': [
          'clamp(80px, 8vw, 160px)',
          { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '400' },
        ],
        'pull-quote': [
          'clamp(40px, 3.5vw, 72px)',
          { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '380' },
        ],

        // Body (sans)
        'body-l': ['18px', { lineHeight: '1.6' }],
        'body-m': ['16px', { lineHeight: '1.55' }],
        'body-s': ['13px', { lineHeight: '1.5' }],
        caption: ['11px', { lineHeight: '1.4', letterSpacing: '0.06em' }],

        // Mono
        'data-label': ['10px', { lineHeight: '1.3', letterSpacing: '0.08em' }],
        coordinates: ['11px', { lineHeight: '1.3' }],
      },

      letterSpacing: {
        caption: '0.06em',
        data: '0.08em',
        tight: '-0.04em',
      },

      spacing: {
        s1: '4px',
        s2: '8px',
        s3: '16px',
        s4: '24px',
        s5: '40px',
        s6: '64px',
        s7: '96px',
        s8: '144px',
        s9: '220px',
        s10: '340px',
      },

      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
        punchy: 'cubic-bezier(0.65, 0, 0.35, 1)',
        inertial: 'cubic-bezier(0.22, 1.61, 0.36, 1)',
      },

      transitionDuration: {
        hover: '220ms',
        reveal: '1200ms',
      },

      backgroundImage: {
        // Optional: subtle paper-texture noise overlay for the light-mode sections
        'paper-noise': 'radial-gradient(ellipse at top, rgba(0,0,0,0.02) 0%, transparent 60%)',
      },

      keyframes: {
        eq: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '16px' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        eq: 'eq 0.9s ease-in-out infinite',
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'toast-in': 'toastIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
