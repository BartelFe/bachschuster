import { generateBuildings, generateRandoms } from './buildings';
import { generateEnergyFlows } from './energy-flows';
import { generateMobility } from './mobility';
import { generateSocialClusters } from './social-clusters';
import { generateConflicts } from './conflicts';

/** All per-particle attribute buffers needed by the hero shader, in one call. */
export function buildLayerAttributes(count: number, seed = 12345) {
  const conflicts = generateConflicts(count, seed + 4);
  return {
    target0: generateBuildings(count, seed + 0),
    target1: generateEnergyFlows(count, seed + 1),
    target2: generateMobility(count, seed + 2),
    target3: generateSocialClusters(count, seed + 3),
    target4: conflicts.positions,
    stakeholderColors: conflicts.colors,
    randoms: generateRandoms(count, seed + 5),
  };
}

export {
  generateBuildings,
  generateRandoms,
  generateEnergyFlows,
  generateMobility,
  generateSocialClusters,
  generateConflicts,
};
