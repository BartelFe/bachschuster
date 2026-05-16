import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useUIStore } from '@/lib/store';
import {
  createHeroDrone,
  createMethodeTicks,
  createPaperRustle,
  droneVolumeFor,
  paperVolumeFor,
  tickVolumeFor,
  type AmbientLayer,
} from '@/lib/audio';
import { SoundContext, type SoundContextValue } from './sound-context';

/**
 * Sound API — three procedural ambient layers, mixed per section.
 *
 *  · `drone` — deep low-end (W3).
 *  · `paper` — paper-rustle bandpass-filtered noise (W9, Manifest).
 *  · `ticks` — sparse mechanical clicks (W9, Methode + Strukturplanung).
 *
 * Each layer fades to its section-specific volume whenever
 * `useUIStore.currentSection` changes; layers that aren't relevant for a
 * section simply fade to 0.
 *
 * `register/play/stop` are still no-ops — they reserve the API surface for
 * a future Howler-backed sample registry (W10+), without breaking the
 * call-sites that already consume the context.
 *
 * AudioContext only initialises after the user toggles sound on (browser
 * autoplay policy compliance).
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const isEnabled = useUIStore((s) => s.isSoundEnabled);
  const toggleStore = useUIStore((s) => s.toggleSound);
  const currentSection = useUIStore((s) => s.currentSection);

  const droneRef = useRef<AmbientLayer | null>(null);
  const paperRef = useRef<AmbientLayer | null>(null);
  const ticksRef = useRef<AmbientLayer | null>(null);

  // ── Lifecycle ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isEnabled) {
        if (!droneRef.current) droneRef.current = createHeroDrone();
        if (!paperRef.current) paperRef.current = createPaperRustle();
        if (!ticksRef.current) ticksRef.current = createMethodeTicks();
        if (cancelled) return;

        await Promise.all([
          droneRef.current?.resume(),
          paperRef.current?.resume(),
          ticksRef.current?.resume(),
        ]);

        const sec = currentSection ?? 'hero';
        droneRef.current?.setVolume(droneVolumeFor(sec), 0.8);
        paperRef.current?.setVolume(paperVolumeFor(sec), 0.8);
        ticksRef.current?.setVolume(tickVolumeFor(sec), 0.8);
      } else {
        droneRef.current?.setVolume(0, 0.5);
        paperRef.current?.setVolume(0, 0.5);
        ticksRef.current?.setVolume(0, 0.5);
        window.setTimeout(() => {
          droneRef.current?.suspend();
          paperRef.current?.suspend();
          ticksRef.current?.suspend();
        }, 600);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEnabled, currentSection]);

  // Section-aware crossfade — fires whenever currentSection changes while
  // sound is enabled.
  useEffect(() => {
    if (!isEnabled) return;
    droneRef.current?.setVolume(droneVolumeFor(currentSection), 1.2);
    paperRef.current?.setVolume(paperVolumeFor(currentSection), 1.2);
    ticksRef.current?.setVolume(tickVolumeFor(currentSection), 1.2);
  }, [isEnabled, currentSection]);

  // Dispose all layers on unmount (e.g. SoundProvider remount during HMR).
  useEffect(() => {
    return () => {
      droneRef.current?.dispose();
      paperRef.current?.dispose();
      ticksRef.current?.dispose();
      droneRef.current = null;
      paperRef.current = null;
      ticksRef.current = null;
    };
  }, []);

  // ── Public API ───────────────────────────────────────────────────────
  const toggle = useCallback(() => {
    toggleStore();
  }, [toggleStore]);

  const register = useCallback<SoundContextValue['register']>(() => {
    // No-op — placeholder for Howler-backed sample registry (W10+).
  }, []);

  const play = useCallback<SoundContextValue['play']>(() => {
    // No-op — placeholder.
  }, []);

  const stop = useCallback<SoundContextValue['stop']>(() => {
    // No-op — placeholder.
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({ isEnabled, toggle, register, play, stop }),
    [isEnabled, toggle, register, play, stop],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
