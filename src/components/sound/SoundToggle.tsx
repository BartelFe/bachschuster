import { useEffect, useRef } from 'react';
import { useSound } from './use-sound';
import { cn } from '@/lib/cn';

/**
 * Minimalistic EQ-bar audio toggle.
 *  · Muted: 3 static low bars + dimmed
 *  · Active: 3 bars rise/fall via CSS animation (variable heights, staggered)
 *
 * Hover wave animation + actual Howler integration ships in W3.
 */
export function SoundToggle() {
  const { isEnabled, toggle } = useSound();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mark this element as cursor-magnetic for the Custom Cursor pull.
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    el.setAttribute('data-magnetic', '');
    el.setAttribute('data-cursor', 'audio');
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-pressed={isEnabled}
      aria-label={isEnabled ? 'Sound ausschalten' : 'Sound einschalten'}
      className={cn(
        'group flex items-center gap-s2 px-s2 py-s2 transition-colors duration-hover ease-cinematic',
        isEnabled ? 'text-bone' : 'text-bone-faint hover:text-bone-muted',
      )}
    >
      <span className="flex h-4 w-5 items-end gap-[2px]" aria-hidden="true">
        <Bar active={isEnabled} delay="0ms" />
        <Bar active={isEnabled} delay="120ms" />
        <Bar active={isEnabled} delay="240ms" />
      </span>
      <span className="font-mono text-data-label uppercase tracking-data">
        {isEnabled ? 'On' : 'Off'}
      </span>
    </button>
  );
}

function Bar({ active, delay }: { active: boolean; delay: string }) {
  return (
    <span
      className={cn(
        'block w-[2px] rounded-[1px] bg-current transition-all duration-hover ease-cinematic',
        active ? 'h-4 animate-eq' : 'h-1.5',
      )}
      style={{ animationDelay: delay }}
    />
  );
}
