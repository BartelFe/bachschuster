/**
 * Force configuration per Methode mode.
 *
 * Each mode defines how the d3-force simulation behaves in three dimensions:
 *  · physics — repulsion / link / center / cluster strengths
 *  · visibility — how visible each edge type is + how prominent the mediator is
 *  · narrative — how the section's narrative copy reads at this mode
 *
 * Modes are continuous: GSAP timelines lerp between them via `lerpModes()` so
 * a scroll progress 0..1 across the three modes lands on a smooth force-blend
 * mid-transition. The simulation re-energises (alpha bumped) on each mode
 * crossing so nodes physically respond.
 */

export type ModeId = 'chaos' | 'mediation' | 'struktur';

export interface ModeForces {
  /** Repulsion strength (negative = nodes push each other apart). */
  manyBody: number;
  /** Edge strength for "conflict" links (negative → pulls antagonists together). */
  conflictLink: number;
  /** Edge strength for "synergy" links (positive → cohesive). */
  synergyLink: number;
  /** Edge strength for the Bachschuster mediator's links. */
  mediationLink: number;
  /** How strongly each node is drawn toward its stakeholder cluster centre. */
  clusterStrength: number;
  /** How strongly all nodes are drawn toward viewport centre. */
  centerStrength: number;
}

export interface ModeVisuals {
  /** 0..1 — how opaque each edge type is rendered. */
  conflictOpacity: number;
  synergyOpacity: number;
  mediationOpacity: number;
  /** Visibility of the Bachschuster mediator node. */
  mediatorOpacity: number;
  /** Background tint applied to the canvas (subtle). */
  backgroundShade: number;
}

export interface ModeNarrative {
  pretitle: string;
  title: string;
  body: string;
}

export interface ModeSpec {
  id: ModeId;
  forces: ModeForces;
  visuals: ModeVisuals;
  narrative: ModeNarrative;
}

export const MODES: Record<ModeId, ModeSpec> = {
  chaos: {
    id: 'chaos',
    forces: {
      manyBody: -340,
      conflictLink: 0.55, // strong but short — antagonists yanked too close
      synergyLink: 0.05,
      mediationLink: 0,
      clusterStrength: 0.08,
      centerStrength: 0.04,
    },
    visuals: {
      conflictOpacity: 0.78,
      synergyOpacity: 0.05,
      mediationOpacity: 0,
      mediatorOpacity: 0,
      backgroundShade: 0,
    },
    narrative: {
      pretitle: '01 · Chaos',
      title: 'Jeder zieht in seine Richtung.',
      body: 'Verkehr, Umweltschutz, Architektur, Wirtschaft, Bürgerinitiativen — fünf Anspruchsgruppen, die im klassischen Planungsverfahren übereinander hinweg verhandeln. Konflikt-Linien spannen sich zwischen Akteuren, die dieselben Ressourcen beanspruchen. Niemand hört dem anderen zu.',
    },
  },
  mediation: {
    id: 'mediation',
    forces: {
      manyBody: -260,
      conflictLink: 0.25,
      synergyLink: 0.2,
      mediationLink: 0.45,
      clusterStrength: 0.16,
      centerStrength: 0.08,
    },
    visuals: {
      conflictOpacity: 0.4,
      synergyOpacity: 0.35,
      mediationOpacity: 0.85,
      mediatorOpacity: 1,
      backgroundShade: 0.04,
    },
    narrative: {
      pretitle: '02 · Mediation',
      title: 'Strukturplanung tritt ein.',
      body: 'Bachschuster wird zum kulturellen Übersetzer zwischen den Lagern. Konflikt-Linien werden in Beziehungen umgedeutet, Synergien sichtbar gemacht. Der Mediator-Knoten bündelt — die Stakeholder rücken näher zusammen, nicht weil sie nachgegeben hätten, sondern weil sie einander erst jetzt richtig verstehen.',
    },
  },
  struktur: {
    id: 'struktur',
    forces: {
      manyBody: -180,
      conflictLink: 0.05,
      synergyLink: 0.7,
      mediationLink: 0.5,
      clusterStrength: 0.32,
      centerStrength: 0.14,
    },
    visuals: {
      conflictOpacity: 0.04,
      synergyOpacity: 0.92,
      mediationOpacity: 0.6,
      mediatorOpacity: 1,
      backgroundShade: 0.06,
    },
    narrative: {
      pretitle: '03 · Struktur',
      title: 'Ein funktionierender Gesamtorganismus.',
      body: 'Konflikte sind gelöst, Synergien aktiviert. Die fünf Stakeholder-Gruppen halten produktive Beziehungen — sichtbar als grün-goldene Linien zwischen Knoten. Strukturplanung steht VOR Stadtplanung und Architektur, weil sie das System entwirft, das die einzelnen Gebäude erst möglich macht.',
    },
  },
};

/** Linear interpolation between two ModeForces objects. */
export function lerpForces(a: ModeForces, b: ModeForces, t: number): ModeForces {
  const k = Math.max(0, Math.min(t, 1));
  return {
    manyBody: a.manyBody + (b.manyBody - a.manyBody) * k,
    conflictLink: a.conflictLink + (b.conflictLink - a.conflictLink) * k,
    synergyLink: a.synergyLink + (b.synergyLink - a.synergyLink) * k,
    mediationLink: a.mediationLink + (b.mediationLink - a.mediationLink) * k,
    clusterStrength: a.clusterStrength + (b.clusterStrength - a.clusterStrength) * k,
    centerStrength: a.centerStrength + (b.centerStrength - a.centerStrength) * k,
  };
}

export function lerpVisuals(a: ModeVisuals, b: ModeVisuals, t: number): ModeVisuals {
  const k = Math.max(0, Math.min(t, 1));
  return {
    conflictOpacity: a.conflictOpacity + (b.conflictOpacity - a.conflictOpacity) * k,
    synergyOpacity: a.synergyOpacity + (b.synergyOpacity - a.synergyOpacity) * k,
    mediationOpacity: a.mediationOpacity + (b.mediationOpacity - a.mediationOpacity) * k,
    mediatorOpacity: a.mediatorOpacity + (b.mediatorOpacity - a.mediatorOpacity) * k,
    backgroundShade: a.backgroundShade + (b.backgroundShade - a.backgroundShade) * k,
  };
}

/**
 * Map a continuous progress 0..1 spanning all three modes to an interpolated
 * mode state. Used by ScrollTrigger to drive the simulation smoothly.
 *
 *  · 0.0–0.45 → lerp(chaos, mediation, t/0.45)
 *  · 0.45–1.0 → lerp(mediation, struktur, (t-0.45)/0.55)
 */
export function modeAtProgress(progress: number): {
  forces: ModeForces;
  visuals: ModeVisuals;
  narrative: ModeNarrative;
  dominantMode: ModeId;
} {
  const p = Math.max(0, Math.min(progress, 1));
  if (p < 0.45) {
    const k = p / 0.45;
    return {
      forces: lerpForces(MODES.chaos.forces, MODES.mediation.forces, k),
      visuals: lerpVisuals(MODES.chaos.visuals, MODES.mediation.visuals, k),
      narrative: k < 0.5 ? MODES.chaos.narrative : MODES.mediation.narrative,
      dominantMode: k < 0.5 ? 'chaos' : 'mediation',
    };
  }
  const k = (p - 0.45) / 0.55;
  return {
    forces: lerpForces(MODES.mediation.forces, MODES.struktur.forces, k),
    visuals: lerpVisuals(MODES.mediation.visuals, MODES.struktur.visuals, k),
    narrative: k < 0.5 ? MODES.mediation.narrative : MODES.struktur.narrative,
    dominantMode: k < 0.5 ? 'mediation' : 'struktur',
  };
}
