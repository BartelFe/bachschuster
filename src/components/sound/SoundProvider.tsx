import { useCallback, useMemo, type ReactNode } from 'react';
import { useUIStore } from '@/lib/store';
import { SoundContext, type SoundContextValue } from './sound-context';

/**
 * Sound API — stable surface backed by a no-op stub in W1.
 *
 * In W3 we wire Howler.js underneath: `register` will allocate Howl instances,
 * `play`/`stop` will trigger them, and section-crossfade logic listens to
 * `useUIStore.currentSection` to swap ambient beds.
 *
 * Consumers should call `register` once per section/UI sound at mount,
 * then `play(name)` / `stop(name)` on cue. If sound is globally disabled
 * (`isEnabled === false`), all `play` calls are silently dropped.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const isEnabled = useUIStore((s) => s.isSoundEnabled);
  const toggleSound = useUIStore((s) => s.toggleSound);

  const register = useCallback<SoundContextValue['register']>(() => {
    // No-op stub. W3 will hydrate a Howl registry here.
  }, []);

  const play = useCallback<SoundContextValue['play']>(() => {
    // No-op stub. W3 will look up by name in the registry and call `.play()`.
  }, []);

  const stop = useCallback<SoundContextValue['stop']>(() => {
    // No-op stub.
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({ isEnabled, toggle: toggleSound, register, play, stop }),
    [isEnabled, toggleSound, register, play, stop],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
