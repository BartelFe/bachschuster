/**
 * Procedural ambient soundscape — fully synthesised, no audio files needed.
 *
 * Three layers, all sharing the same AudioContext:
 *
 *   1. `heroDrone` — deep three-osc + LP filter + slow LFO (the W3 layer).
 *      Provides the constant low end across all sections that have a
 *      non-zero entry in `DRONE_VOLUME_BY_SECTION`.
 *
 *   2. `paperRustle` — pink-ish noise filtered through a bandpass at 1.8 kHz
 *      with slow random amplitude modulation. Reads as paper-leafing on the
 *      Manifest section.
 *
 *   3. `methodeTicks` — a sparse, randomly-timed click train (decay-only
 *      envelope, ~120 Hz transients). Hints at mechanical, mediation-room
 *      audio under the Methode force-graph + Strukturplanung layers.
 *
 * Each layer exposes the same `AmbientLayer` interface — `setVolume(value,
 * fadeSeconds)`, `resume()`, `suspend()`, `dispose()`. The SoundProvider
 * mixes them per section via the maps at the bottom of this file.
 *
 * Browsers require a user gesture before any AudioContext can produce sound;
 * the caller (SoundProvider) is responsible for `resume()`-ing after the
 * sound toggle is enabled.
 */

export interface AmbientLayer {
  /** Ramp master gain to `value` over `fadeSeconds`. */
  setVolume(value: number, fadeSeconds?: number): void;
  resume(): Promise<void>;
  suspend(): Promise<void>;
  dispose(): void;
}

/* ── Internal helper ──────────────────────────────────────────────────── */

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  return new AC();
}

/* ── Layer 1: hero drone (unchanged from W3) ─────────────────────────── */

export function createHeroDrone(): AmbientLayer | null {
  const ctx = getAudioCtx();
  if (!ctx) return null;

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

  return wrapLayer(ctx, masterGain, [osc1, osc2, osc3, lfo]);
}

/* ── Layer 2: paper rustle (Manifest) ─────────────────────────────────── */

/**
 * White noise → bandpass filtered to mid-high range → sub-audio LFO on gain
 * (random walk in volume) to mimic a hand turning paper.
 */
export function createPaperRustle(): AmbientLayer | null {
  const ctx = getAudioCtx();
  if (!ctx) return null;

  // 2-second white-noise buffer, looped — cheap source.
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Bandpass on the mid-high "paper" frequency range
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1800;
  bp.Q.value = 1.4;

  // Random-walk gain via a slow chaotic LFO
  const lfoA = ctx.createOscillator();
  lfoA.frequency.value = 0.41;
  lfoA.type = 'sine';
  const lfoB = ctx.createOscillator();
  lfoB.frequency.value = 0.77;
  lfoB.type = 'triangle';
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.35;
  lfoA.connect(lfoGain);
  lfoB.connect(lfoGain);

  const envGain = ctx.createGain();
  envGain.gain.value = 0.5;
  lfoGain.connect(envGain.gain);

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;

  source.connect(bp).connect(envGain).connect(masterGain);
  masterGain.connect(ctx.destination);

  source.start();
  lfoA.start();
  lfoB.start();

  return wrapLayer(ctx, masterGain, [source, lfoA, lfoB]);
}

/* ── Layer 3: methode ticks (Methode + Strukturplanung) ──────────────── */

/**
 * Sparse mechanical-tick generator. Schedules ~1 tick per 1.5–4 seconds via
 * setTimeout-based scheduling (audio-thread accurate enough at this density).
 * Each tick is a 30-ms exponential decay on a 120 Hz square through a
 * highpass — sounds like a relay click.
 */
export function createMethodeTicks(): AmbientLayer | null {
  const ctx = getAudioCtx();
  if (!ctx) return null;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  let timer: number | null = null;
  let disposed = false;

  const tick = () => {
    if (disposed) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 120 + Math.random() * 80;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 800;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.4, t + 0.002);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
    osc.connect(hp).connect(env).connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.05);

    const nextDelay = 1500 + Math.random() * 2500;
    timer = window.setTimeout(tick, nextDelay);
  };

  // Kick off the tick scheduler.
  timer = window.setTimeout(tick, 1500);

  return {
    setVolume(value, fadeSeconds = 1.2) {
      const now = ctx.currentTime;
      const safe = Math.max(0, Math.min(value, 1));
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(safe, now + fadeSeconds);
    },
    async resume() {
      if (ctx.state !== 'running') await ctx.resume();
    },
    async suspend() {
      if (ctx.state === 'running') await ctx.suspend();
    },
    dispose() {
      disposed = true;
      if (timer) window.clearTimeout(timer);
      ctx.close().catch(() => {
        /* ignore */
      });
    },
  };
}

/* ── Layer wrapper ───────────────────────────────────────────────────── */

/**
 * Shared lifecycle wrapper for synth layers. Returns the AmbientLayer API
 * pointing at the master gain + a dispose-all routine for the source nodes.
 */
function wrapLayer(
  ctx: AudioContext,
  masterGain: GainNode,
  sources: Array<AudioScheduledSourceNode>,
): AmbientLayer {
  return {
    setVolume(value, fadeSeconds = 1.2) {
      const now = ctx.currentTime;
      const safe = Math.max(0, Math.min(value, 1));
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(safe, now + fadeSeconds);
    },
    async resume() {
      if (ctx.state !== 'running') await ctx.resume();
    },
    async suspend() {
      if (ctx.state === 'running') await ctx.suspend();
    },
    dispose() {
      try {
        sources.forEach((s) => s.stop());
      } catch {
        /* already stopped */
      }
      ctx.close().catch(() => {
        /* ignore */
      });
    },
  };
}

/* ── Per-section mix tables ──────────────────────────────────────────── */

/**
 * Drone volume per section — the deep low-end layer that's always available.
 */
export const DRONE_VOLUME_BY_SECTION: Record<string, number> = {
  hero: 0.35,
  'hero-exit': 0.12,
  manifest: 0,
  methode: 0.18,
  'werke-teaser': 0.12,
  werke: 0.2,
  'werk-roentgen': 0.3,
  'netzwerk-teaser': 0.16,
  netzwerk: 0.28,
  'stimmen-teaser': 0.1,
  stimmen: 0.14,
  team: 0.08,
  kontakt: 0,
};

/**
 * Paper-rustle volume — Manifest section primarily (the original brief said
 * "fast still, nur Papier-Rascheln"). Mild trace on Stimmen + Team (both
 * have editorial / paper-craft DNA).
 */
export const PAPER_VOLUME_BY_SECTION: Record<string, number> = {
  manifest: 0.32,
  stimmen: 0.08,
  team: 0.06,
};

/**
 * Mechanical-tick volume — Methode (relay-tick under the force graph) and
 * any project's Strukturplanung-layer (Röntgen-Scroll's last layer).
 */
export const TICK_VOLUME_BY_SECTION: Record<string, number> = {
  methode: 0.18,
  'werk-roentgen': 0.12,
};

export function droneVolumeFor(section: string | null): number {
  if (!section) return 0;
  return DRONE_VOLUME_BY_SECTION[section] ?? 0;
}

export function paperVolumeFor(section: string | null): number {
  if (!section) return 0;
  return PAPER_VOLUME_BY_SECTION[section] ?? 0;
}

export function tickVolumeFor(section: string | null): number {
  if (!section) return 0;
  return TICK_VOLUME_BY_SECTION[section] ?? 0;
}
