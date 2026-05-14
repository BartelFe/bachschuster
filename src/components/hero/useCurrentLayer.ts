import { useEffect, useState, type MutableRefObject } from 'react';

export interface LayerInfo {
  index: 0 | 1 | 2 | 3 | 4;
  name: string;
  description: string;
}

const LAYERS: readonly LayerInfo[] = [
  {
    index: 0,
    name: 'Gebaute Struktur',
    description: 'Gebäude als sichtbare Schicht — was steht, ist nur die Antwort.',
  },
  {
    index: 1,
    name: 'Energieflüsse',
    description: 'Strom, Wärme, Daten — was zwischen den Gebäuden zirkuliert.',
  },
  {
    index: 2,
    name: 'Mobilität',
    description: 'Wege, Spuren, Bewegung — wie sich der Organismus bewegt.',
  },
  {
    index: 3,
    name: 'Soziale Cluster',
    description: 'Menschen, Nachbarschaften, Zugehörigkeit — wo Leben sich verdichtet.',
  },
  {
    index: 4,
    name: 'Konflikte',
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
