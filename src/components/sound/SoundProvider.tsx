import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useUIStore } from '@/lib/store';
import { createHeroDrone, droneVolumeFor, type AmbientLayer } from '@/lib/audio';
import { SoundContext, type SoundContextValue } from './sound-context';

/**
 * Sound API — real Web Audio drone + Howler-ready registry surface.
 *
 *  · A procedural drone (3 osc + LP filter + LFO, see lib/audio.ts) provides
 *    ambient under-tone whenever the user enables sound. Volume cross-fades
 *    by section via `useUIStore.currentSection`.
 *  · The `register/play/stop` calls are still stubs in W3 — they reserve the
 *    API for the W3+ file-backed cues (paper rustle, project field
 *    recordings) once those assets land in `public/audio/`.
 *
 * AudioContext only initialises after the first toggle (user gesture) to
 * comply with the browser autoplay policy.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const isEnabled = useUIStore((s) => s.isSoundEnabled);
  const toggleStore = useUIStore((s) => s.toggleSound);
  const currentSection = useUIStore((s) => s.currentSection);

  const droneRef = useRef<AmbientLayer | null>(null);

  // ── Lifecycle ────────────────────────────────────────────────────────
  // First enable: create drone + resume context.
  // Disable: ramp to 0 + suspend (we keep the instance for fast re-enable).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isEnabled) {
        if (!droneRef.current) {
          droneRef.current = createHeroDrone();
        }
        if (cancelled || !droneRef.current) return;
        await droneRef.current.resume();
        droneRef.current.setVolume(droneVolumeFor(currentSection ?? 'hero'), 0.8);
      } else if (droneRef.current) {
        droneRef.current.setVolume(0, 0.5);
        // Suspend slightly after the fade-out completes.
        window.setTimeout(() => {
          droneRef.current?.suspend();
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
    if (!isEnabled || !droneRef.current) return;
    droneRef.current.setVolume(droneVolumeFor(currentSection), 1.2);
  }, [isEnabled, currentSection]);

  // Dispose drone on unmount (e.g. SoundProvider remount during HMR).
  useEffect(() => {
    return () => {
      droneRef.current?.dispose();
      droneRef.current = null;
    };
  }, []);

  // ── Public API ───────────────────────────────────────────────────────
  const toggle = useCallback(() => {
    toggleStore();
  }, [toggleStore]);

  const register = useCallback<SoundContextValue['register']>(() => {
    // No-op in W3. W5+ will hydrate a Howl registry keyed by `name`.
  }, []);

  const play = useCallback<SoundContextValue['play']>(() => {
    // No-op in W3.
  }, []);

  const stop = useCallback<SoundContextValue['stop']>(() => {
    // No-op in W3.
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({ isEnabled, toggle, register, play, stop }),
    [isEnabled, toggle, register, play, stop],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
