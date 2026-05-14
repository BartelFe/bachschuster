/**
 * Force-graph data — 30 stakeholder nodes across the five §6.2 groups plus
 * a single "Bachschuster" mediator that only appears in Mediation + Struktur.
 *
 * Node names are deliberately concrete (Bauamt, NABU, TUM Heilbronn) rather
 * than generic ("Stakeholder A") so the simulation reads as a real planning
 * situation. Edges:
 *  · `conflict` — high-tension links that pull antagonistic nodes together
 *    only because they share a contested resource (e.g. Bauamt ↔ NABU
 *    over a development permit). In Chaos these dominate and visually
 *    draw red between the cluster centres.
 *  · `synergy` — productive links (e.g. iiRD ↔ Stadtwerke). Dim in Chaos,
 *    bloom green-gold in Struktur.
 *  · `mediation` — connect the Bachschuster mediator to every stakeholder
 *    cluster's representative. Visible only in Mediation + Struktur.
 *
 * All numeric IDs use kebab-case so they are stable across HMR.
 */

import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

export type StakeholderId =
  | 'city'
  | 'business'
  | 'citizens'
  | 'environment'
  | 'institutional'
  | 'mediator';

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  stakeholder: StakeholderId;
  label: string;
  /** Visual radius in pixels, before any hover/pulse scaling. */
  radius: number;
  /** Per-cluster index — used to bias initial position. */
  clusterIndex: number;
}

export interface GraphEdge extends SimulationLinkDatum<GraphNode> {
  /** d3-force overrides source/target to GraphNode after init. */
  source: string | GraphNode;
  target: string | GraphNode;
  kind: 'conflict' | 'synergy' | 'mediation';
}

/** Stakeholder hex colors mirror master prompt § 3.1 `stk-*` palette. */
export const STAKEHOLDER_COLOR: Record<StakeholderId, string> = {
  city: '#4D8FBF',
  business: '#B85C2E',
  citizens: '#E8C547',
  environment: '#7BA659',
  institutional: '#C2B8A3',
  mediator: '#F2EDE2',
};

export const STAKEHOLDER_LABEL: Record<StakeholderId, string> = {
  city: 'Stadt & Kommunen',
  business: 'Wirtschaftliche Akteure',
  citizens: 'Bürger & Anwohner',
  environment: 'Umwelt & Klima',
  institutional: 'Institutionen & Wissenschaft',
  mediator: 'Strukturplanung',
};

const CITY_NAMES = [
  'Bauamt',
  'Stadtwerke',
  'Verkehrsplanung',
  'Tiefbau',
  'Stadtmarketing',
  'Bürgermeisteramt',
];
const BUSINESS_NAMES = [
  'IHK',
  'Investoren',
  'Gewerbe-Verband',
  'Logistik',
  'Einzelhandel',
  'Bauindustrie',
];
const CITIZENS_NAMES = [
  'Anwohner-Beirat',
  'Eigentümer',
  'Mieter',
  'Familien-Initiative',
  'Senioren-Rat',
];
const ENVIRONMENT_NAMES = ['BUND', 'NABU', 'Klimarat', 'Wasserwirtschaft', 'Forstamt'];
const INSTITUTIONAL_NAMES = ['TUM Heilbronn', 'iiRD', 'Stadtsoziologie', 'Bauakademie'];

function buildCluster(
  stakeholder: StakeholderId,
  names: readonly string[],
  radiusRange: readonly [number, number],
): GraphNode[] {
  return names.map((label, i) => ({
    id: `${stakeholder}-${i}`,
    stakeholder,
    label,
    radius:
      radiusRange[0] +
      (Math.sin(i * 1.7 + stakeholder.length) * 0.5 + 0.5) * (radiusRange[1] - radiusRange[0]),
    clusterIndex: i,
  }));
}

export function buildNodes(): GraphNode[] {
  return [
    ...buildCluster('city', CITY_NAMES, [10, 16]),
    ...buildCluster('business', BUSINESS_NAMES, [9, 15]),
    ...buildCluster('citizens', CITIZENS_NAMES, [8, 13]),
    ...buildCluster('environment', ENVIRONMENT_NAMES, [9, 14]),
    ...buildCluster('institutional', INSTITUTIONAL_NAMES, [10, 14]),
    {
      id: 'mediator-bachschuster',
      stakeholder: 'mediator',
      label: 'Bachschuster',
      radius: 22,
      clusterIndex: 0,
    },
  ];
}

/** Pairs of stakeholder-types that historically clash over the same resource. */
const CONFLICT_PAIRS: ReadonlyArray<readonly [StakeholderId, StakeholderId]> = [
  ['city', 'environment'],
  ['business', 'environment'],
  ['business', 'citizens'],
  ['city', 'citizens'],
  ['city', 'business'],
];

/** Pairs that historically produce shared wins. */
const SYNERGY_PAIRS: ReadonlyArray<readonly [StakeholderId, StakeholderId]> = [
  ['institutional', 'city'],
  ['institutional', 'environment'],
  ['institutional', 'business'],
  ['citizens', 'environment'],
];

function pickNodes(nodes: GraphNode[], stakeholder: StakeholderId, n: number): GraphNode[] {
  const pool = nodes.filter((node) => node.stakeholder === stakeholder);
  // Deterministic-feeling selection — first N by clusterIndex.
  return pool.slice(0, n);
}

export function buildEdges(nodes: GraphNode[]): GraphEdge[] {
  const edges: GraphEdge[] = [];

  // Conflict edges — each pair creates 2-3 edges between specific representatives.
  for (const [a, b] of CONFLICT_PAIRS) {
    const sources = pickNodes(nodes, a, 3);
    const targets = pickNodes(nodes, b, 3);
    const count = Math.min(sources.length, targets.length);
    for (let i = 0; i < count; i++) {
      edges.push({ source: sources[i]!.id, target: targets[i]!.id, kind: 'conflict' });
    }
  }

  // Synergy edges — fewer but spanning the institutional bridge nodes.
  for (const [a, b] of SYNERGY_PAIRS) {
    const sources = pickNodes(nodes, a, 2);
    const targets = pickNodes(nodes, b, 2);
    const count = Math.min(sources.length, targets.length);
    for (let i = 0; i < count; i++) {
      edges.push({ source: sources[i]!.id, target: targets[i]!.id, kind: 'synergy' });
    }
  }

  // Mediator edges — Bachschuster connects to one node per stakeholder group.
  const mediator = nodes.find((n) => n.id === 'mediator-bachschuster');
  if (mediator) {
    const groups: StakeholderId[] = [
      'city',
      'business',
      'citizens',
      'environment',
      'institutional',
    ];
    for (const g of groups) {
      const target = pickNodes(nodes, g, 1)[0];
      if (target) {
        edges.push({ source: mediator.id, target: target.id, kind: 'mediation' });
      }
    }
  }

  return edges;
}
