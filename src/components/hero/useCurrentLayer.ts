import { useEffect, useState, type MutableRefObject } from 'react';

export interface LayerInfo {
  index: 0 | 1 | 2 | 3 | 4;
  name: string;
  /**
   * Three-to-five-word italic phrase shown beneath the layer name in the
   * prominent hero label. Designed to read in the same beat as the layer
   * name, so the user sees "what this layer *is*" without parsing prose.
   */
  tagline: string;
  /** Long-form description — used by accessibility tooling and by smaller UI. */
  description: string;
}

const LAYERS: readonly LayerInfo[] = [
  {
    index: 0,
    name: 'Gebaute Struktur',
    tagline: 'Was sichtbar ist.',
    description: 'Gebäude als sichtbare Schicht — was steht, ist nur die Antwort.',
  },
  {
    index: 1,
    name: 'Energieflüsse',
    tagline: 'Was zirkuliert.',
    description: 'Strom, Wärme, Daten — was zwischen den Gebäuden zirkuliert.',
  },
  {
    index: 2,
    name: 'Mobilität',
    tagline: 'Was sich bewegt.',
    description: 'Wege, Spuren, Bewegung — wie sich der Organismus bewegt.',
  },
  {
    index: 3,
    name: 'Soziale Cluster',
    tagline: 'Wer dort lebt.',
    description: 'Menschen, Nachbarschaften, Zugehörigkeit — wo Leben sich verdichtet.',
  },
  {
    index: 4,
    name: 'Konflikte',
    tagline: 'Was die Methode löst.',
    description: 'Stadt · Wirtschaft · Bürger · Umwelt · Institutionen. Strukturplanung mediiert.',
  },
] as const;

/**
 * Hook that maps the morphRef value (0..4) to the currently-dominant layer.
 * Polls the ref at 10 Hz — frequent enough that subtitles change instantly,
 * cheap enough that we don't burn React renders.
 */
export function useCurrentLayer(morphRef: MutableRefObject<number>): LayerInfo {
  const [layer, setLayer] = useState<LayerInfo>(LAYERS[0]!);

  useEffect(() => {
    const id = window.setInterval(() => {
      const m = morphRef.current;
      // Round-half-up so the label flips at midpoints, not at integer crossings.
      const i = Math.min(Math.max(Math.round(m), 0), 4) as 0 | 1 | 2 | 3 | 4;
      setLayer((prev) => (prev.index === i ? prev : LAYERS[i]!));
    }, 100);
    return () => window.clearInterval(id);
  }, [morphRef]);

  return layer;
}

export const LAYER_COUNT = LAYERS.length;
