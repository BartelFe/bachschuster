import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Constrain Tab / Shift+Tab cycling to the focusable elements inside `ref`.
 * Used by the Kontakt wizard so keyboard users don't tab out of the active
 * step into the Header / Footer mid-form.
 *
 *  · On mount: capture the previously-focused element, focus the first
 *    focusable inside the container.
 *  · On Tab / Shift+Tab: wrap focus around the container.
 *  · On unmount: restore focus to the previously-focused element.
 *  · `active` flag lets the caller turn the trap off (e.g. after submit, so
 *    the success-screen's "neues Briefing"-button still gets focus normally).
 *
 * No external dependency — focus-trap-react is ~6 KB and we only need the
 * basic Tab-wrap behaviour.
 */
export function useFocusTrap(ref: RefObject<HTMLElement>, active = true) {
  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the first focusable in the container on mount.
    const firstFocusable = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [ref, active]);
}
