/**
 * Motion language — easing + duration tokens.
 * Mirrors master prompt § 3.4. Single source of truth shared by:
 *  · GSAP timelines (use `eases.cinematicCss` string form)
 *  · Framer Motion (use the tuple form, e.g. `eases.cinematic`)
 *  · Lenis smooth-scroll (use the function form, e.g. `easeFns.cinematic`)
 *  · Tailwind transition utilities (mirrored in tailwind.config.ts under transitionTimingFunction)
 */

/** Cubic-bezier control points, as tuples (Framer Motion / CSS-friendly). */
export const eases = {
  cinematic: [0.16, 1, 0.3, 1] as const,
  punchy: [0.65, 0, 0.35, 1] as const,
  inertial: [0.22, 1.61, 0.36, 1] as const,
} as const;

/** Same eases as cubic-bezier strings — usable by GSAP `ease: eases.cinematicCss`. */
export const easesCss = {
  cinematic: `cubic-bezier(${eases.cinematic.join(', ')})`,
  punchy: `cubic-bezier(${eases.punchy.join(', ')})`,
  inertial: `cubic-bezier(${eases.inertial.join(', ')})`,
} as const;

/**
 * Function approximations for libraries that need a `(t) => number` easing.
 *  · cinematic: quartic-out — slow approach, decisive arrival
 *  · punchy: ease-in-out cubic — quick UI feel
 *  · inertial: spring with overshoot
 */
export const easeFns = {
  cinematic: (t: number): number => 1 - Math.pow(1 - t, 4),
  punchy: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inertial: (t: number): number => {
    const c = 1.61;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
} as const;

/** Spring presets (Framer Motion `transition={...}`). */
export const springs = {
  default: { mass: 1, tension: 280, friction: 26, type: 'spring' as const },
} as const;

/** Durations (ms). */
export const durations = {
  hover: 220,
  reveal: 1200,
  scroll: 1400,
  routeTransition: 900,
} as const;
