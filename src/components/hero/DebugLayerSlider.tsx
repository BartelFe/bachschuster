import { useEffect, useState, type MutableRefObject } from 'react';

interface DebugLayerSliderProps {
  morphRef: MutableRefObject<number>;
}

const LAYER_LABELS = [
  'Gebaute Struktur',
  'Energieflüsse',
  'Mobilität',
  'Soziale Cluster',
  'Konflikte',
] as const;

const POLL_INTERVAL_MS = 50; // 20 Hz — enough for visual feedback, near-zero overhead.

/**
 * Dev-only overlay that drives `uMorph` directly.
 *
 *  · Dragging the slider writes to `morphRef.current` (no React re-render).
 *  · Independently, a 20 Hz polling effect reads `morphRef.current` so the
 *    display value tracks scroll-driven changes too. When the user releases
 *    the slider and starts scrolling, the slider thumb "catches up".
 *  · ←/→ step by 0.1, Shift+arrow steps by 0.5.
 *
 * Tree-shaken out of production by `import.meta.env.DEV`.
 */
export function DebugLayerSlider({ morphRef }: DebugLayerSliderProps) {
  const [display, setDisplay] = useState(0);

  // Poll the ref so the slider thumb tracks scroll-driven updates.
  useEffect(() => {
    const id = window.setInterval(() => {
      const v = morphRef.current;
      // setState only when the change is meaningful — React still bails on
      // identical primitives but this saves the comparison work.
      setDisplay((prev) => (Math.abs(prev - v) > 0.005 ? v : prev));
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [morphRef]);

  // Keyboard shortcuts for fine control.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.target instanceof HTMLTextAreaElement) return;
      const step = e.shiftKey ? 0.5 : 0.1;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setValue(Math.min(morphRef.current + step, 4));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setValue(Math.max(morphRef.current - step, 0));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morphRef]);

  function setValue(v: number) {
    morphRef.current = v;
    setDisplay(v);
  }

  if (!import.meta.env.DEV) return null;

  const low = Math.min(Math.floor(display), 4);
  const high = Math.min(low + 1, 4);
  const t = Math.min(Math.max(display - low, 0), 1);

  return (
    <div className="pointer-events-auto fixed left-s4 top-s7 z-50 w-[260px] border border-border-strong bg-ink/85 p-s3 font-mono text-bone-muted backdrop-blur-sm sm:left-s5">
      <div className="flex items-baseline justify-between">
        <p className="text-data-label uppercase tracking-data text-bone">Debug · uMorph</p>
        <p className="text-data-label uppercase tracking-data text-accent">{display.toFixed(2)}</p>
      </div>

      <input
        type="range"
        min="0"
        max="4"
        step="0.01"
        value={display}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-s2 w-full"
        style={{ accentColor: '#75C9D9' }}
        aria-label="Layer-Morph zwischen 0 (Gebaute Struktur) und 4 (Konflikte)"
        data-cursor="link"
      />

      <div className="mt-s2 flex items-baseline justify-between text-[10px] leading-tight">
        <span className="text-bone">
          {low} · {LAYER_LABELS[low]}
        </span>
        {low !== high ? (
          <span className="text-bone-muted">
            {Math.round(t * 100)}% → {LAYER_LABELS[high]}
          </span>
        ) : (
          <span className="text-bone-muted">·</span>
        )}
      </div>

      <p className="mt-s2 text-[9px] tracking-wide text-bone-faint">
        Scrolle für die Live-Choreografie · Slider override jederzeit · ←/→ 0.1 · Shift = 0.5
      </p>
    </div>
  );
}
