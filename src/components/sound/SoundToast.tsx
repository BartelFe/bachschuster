import { useEffect, useState } from 'react';
import { useUIStore } from '@/lib/store';
import { useSound } from './use-sound';

const AUTO_DISMISS_MS = 9_000;
const SCROLL_TRIGGER_PX = 64;

/**
 * One-shot toast that nudges first-time visitors to enable sound. Appears
 * after the first 64 px of scroll, sticks for 9 s or until the user clicks
 * either button. Marks `hasShownSoundToast` in the UI store so re-entering
 * the page within a session doesn't re-show it.
 *
 * Tasteful copy + small mono caption, anchored bottom-center, mix-blend-
 * difference so it reads on both dark hero and light manifest backgrounds.
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
      className="pointer-events-auto fixed bottom-s5 left-1/2 z-50 -translate-x-1/2 animate-toast-in"
    >
      <div className="flex items-center gap-s4 border border-border-strong bg-ink/90 px-s4 py-s3 font-mono shadow-2xl backdrop-blur-sm">
        <p className="text-caption uppercase tracking-caption text-bone">
          Sound an für das volle Erlebnis.
        </p>
        <div className="flex items-center gap-s2">
          <button
            type="button"
            onClick={enableAndDismiss}
            data-magnetic
            data-cursor="link"
            className="border-l border-border-strong pl-s3 text-data-label uppercase tracking-data text-accent transition-colors duration-hover ease-cinematic hover:text-accent-glow"
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
            verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
