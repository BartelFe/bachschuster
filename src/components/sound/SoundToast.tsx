import { useEffect, useState } from 'react';
import { useUIStore } from '@/lib/store';
import { useSound } from './use-sound';

// Auto-dismiss faster + appear later (W15 audit). The v1 fired at 64 px of
// scroll which often interrupted users while they were still landing on the
// hero. 280 px puts it after the user is meaningfully engaging with content,
// and 7 s gives them a beat to read without lingering.
const AUTO_DISMISS_MS = 7_000;
const SCROLL_TRIGGER_PX = 280;

/**
 * One-shot toast that nudges first-time visitors to enable sound.
 *
 * v2 (W15 audit-fix) — turned down a notch:
 *  · Higher scroll threshold (280 px instead of 64 px) so it doesn't pop
 *    while the user is still reading the hero.
 *  · Smaller paddings, mono-only text, no display-size emphasis.
 *  · Bottom-right anchor instead of bottom-centre — sits at the edge of
 *    peripheral vision rather than blocking the central reading line.
 *  · Faster auto-dismiss.
 *
 * Once dismissed (auto or click) the Zustand flag marks the toast as shown
 * for the session so re-navigating within the SPA doesn't re-trigger it.
 */
export function SoundToast() {
  const hasShown = useUIStore((s) => s.hasShownSoundToast);
  const markShown = useUIStore((s) => s.markSoundToastShown);
  const isEnabled = useUIStore((s) => s.isSoundEnabled);
  const { toggle } = useSound();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasShown || isEnabled) return;
    if (typeof window === 'undefined') return;

    let dismissTimer: number | undefined;

    function onScroll() {
      if (window.scrollY < SCROLL_TRIGGER_PX) return;
      window.removeEventListener('scroll', onScroll);
      setVisible(true);
      dismissTimer = window.setTimeout(() => {
        setVisible(false);
        markShown();
      }, AUTO_DISMISS_MS);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (dismissTimer) window.clearTimeout(dismissTimer);
    };
  }, [hasShown, isEnabled, markShown]);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    markShown();
  }

  function enableAndDismiss() {
    if (!isEnabled) toggle();
    dismiss();
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto fixed bottom-s4 right-s4 z-50 animate-toast-in sm:bottom-s5 sm:right-s5"
    >
      <div className="flex items-center gap-s3 border border-border-subtle bg-ink/80 px-s3 py-s2 font-mono shadow-lg backdrop-blur-sm">
        <p className="text-data-label uppercase tracking-data text-bone-muted">
          Sound an für das volle Erlebnis
        </p>
        <div className="flex items-center gap-s2">
          <button
            type="button"
            onClick={enableAndDismiss}
            data-magnetic
            data-cursor="link"
            className="border-l border-border-subtle pl-s2 text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
          >
            Anhören
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Hinweis schließen"
            data-cursor="link"
            className="text-data-label uppercase tracking-data text-bone-faint transition-colors duration-hover ease-cinematic hover:text-bone-muted"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
