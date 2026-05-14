/**
 * Procedural ambient drone built directly with the Web Audio API — no audio
 * files needed. Sits underneath the hero as a deep, slow-breathing tone.
 *
 *  · 3 oscillators (low A, slightly-flat octave, near-fifth) layered into
 *    a 320 Hz low-pass filter with mild resonance.
 *  · A 0.08 Hz LFO modulates the filter cutoff for slow breathing.
 *  · A master gain ramps in/out via `setVolume(target, fadeSeconds)`.
 *
 * Browsers require a user gesture before AudioContext can produce sound.
 * The caller is responsible for calling `resume()` from within a click /
 * scroll / keypress handler.
 */

export interface AmbientLayer {
  /** Ramp master gain to `value` over `fadeSeconds`. */
  setVolume(value: number, fadeSeconds?: number): void;
  resume(): Promise<void>;
  suspend(): Promise<void>;
  dispose(): void;
}

export function createHeroDrone(): AmbientLayer | null {
  if (typeof window === 'undefined') return null;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;

  const ctx = new AC();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;
  filter.Q.value = 0.6;

  const osc1 = ctx.createOscillator();
  osc1.frequency.value = 55; // low A1
  osc1.type = 'sine';

  const osc2 = ctx.createOscillator();
  osc2.frequency.value = 110.5; // slightly-flat A2 → chorus shimmer
  osc2.type = 'triangle';
  const osc2Gain = ctx.createGain();
  osc2Gain.gain.value = 0.32;

  const osc3 = ctx.createOscillator();
  osc3.frequency.value = 82.5; // near-fifth
  osc3.type = 'sine';
  const osc3Gain = ctx.createGain();
  osc3Gain.gain.value = 0.22;

  // LFO breathes the filter cutoff (~6 Hz of swing around 320 Hz).
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.08;
  lfo.type = 'sine';
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 60;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  osc1.connect(filter);
  osc2.connect(osc2Gain).connect(filter);
  osc3.connect(osc3Gain).connect(filter);
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start();
  osc2.start();
  osc3.start();
  lfo.start();

  // The AudioContext starts suspended on most browsers (autoplay policy).
  // `resume()` from a user gesture unsticks it.

  return {
    setVolume(value, fadeSeconds = 1.2) {
      const now = ctx.currentTime;
      const safeValue = Math.max(0, Math.min(value, 1));
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(safeValue, now + fadeSeconds);
    },
    async resume() {
      if (ctx.state !== 'running') await ctx.resume();
    },
    async suspend() {
      if (ctx.state === 'running') await ctx.suspend();
    },
    dispose() {
      try {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        lfo.stop();
      } catch {
        /* already stopped */
      }
      ctx.close().catch(() => {
        /* ignore */
      });
    },
  };
}

/** Maps a logical section id to the drone master volume it should hold. */
export const DRONE_VOLUME_BY_SECTION: Record<string, number> = {
  hero: 0.35,
  'hero-exit': 0.12,
  manifest: 0,
  methode: 0.18,
  'werke-teaser': 0.12,
  werke: 0.2,
  'werk-roentgen': 0.3,
  netzwerk: 0.28,
  stimmen: 0,
  team: 0,
  kontakt: 0,
};

export function droneVolumeFor(section: string | null): number {
  if (!section) return 0;
  return DRONE_VOLUME_BY_SECTION[section] ?? 0;
}
