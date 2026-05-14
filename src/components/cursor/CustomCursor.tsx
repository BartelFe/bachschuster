import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useUIStore, type CursorMode } from '@/lib/store';
import { cn } from '@/lib/cn';

/**
 * Default-variant custom cursor: 4px dot + 24px trailing ring.
 *
 *  · Pointer dot: tracks pointer exactly via gsap.quickTo (no damping).
 *  · Trailing ring: lerps with ~0.18s damping for a cinematic trail.
 *  · Magnetism: elements with [data-magnetic] pull the ring within an
 *    80px radius (radial falloff). Ring scales 1.4× while magnetized.
 *  · Hover variants: elements with [data-cursor="link|media|data|audio|hidden"]
 *    set the cursorMode via Zustand. Mode-specific styles applied via
 *    data-attr on the cursor root.
 *  · Disabled when: touch device, prefers-reduced-motion, or coarse pointer.
 *
 * Project-card variants (lupe, ROTATE/DRAG labels) and full crosshair
 * for data-viz land in W5–W7 by extending CursorMode.
 */
const MAGNET_RADIUS = 80;
const MAGNET_PULL = 0.4;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorMode = useUIStore((s) => s.cursorMode);
  const setCursorMode = useUIStore((s) => s.setCursorMode);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;

    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // GSAP quickTo gives us cheap per-frame setters that batch with the ticker.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0, ease: 'none' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0, ease: 'none' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power3.out' });
    const ringScale = gsap.quickTo(ring, 'scale', { duration: 0.22, ease: 'power3.out' });

    let lastPointerX = 0;
    let lastPointerY = 0;

    const onMove = (e: PointerEvent) => {
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      dotX(lastPointerX);
      dotY(lastPointerY);

      // Magnetism: find nearest [data-magnetic] within radius, pull ring.
      let targetX = lastPointerX;
      let targetY = lastPointerY;
      let scale = 1;

      const el =
        e.target instanceof Element ? e.target.closest<HTMLElement>('[data-magnetic]') : null;
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - lastPointerX;
        const dy = cy - lastPointerY;
        const dist = Math.hypot(dx, dy);
        if (dist < MAGNET_RADIUS) {
          const falloff = 1 - dist / MAGNET_RADIUS;
          targetX = lastPointerX + dx * MAGNET_PULL * falloff;
          targetY = lastPointerY + dy * MAGNET_PULL * falloff;
          scale = 1 + 0.4 * falloff;
        }
      }

      ringX(targetX);
      ringY(targetY);
      ringScale(scale);

      // Cursor-mode propagation from [data-cursor] attribute on hovered element.
      const modeEl =
        e.target instanceof Element ? e.target.closest<HTMLElement>('[data-cursor]') : null;
      const mode = (modeEl?.dataset.cursor as CursorMode | undefined) ?? 'default';
      if (mode !== useUIStore.getState().cursorMode) {
        setCursorMode(mode);
      }
    };

    const onLeave = () => {
      // When pointer leaves the window — park cursor offscreen so it doesn't ghost.
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2, ease: 'power2.out' });
    };

    const onEnter = () => {
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2, ease: 'power2.out' });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [setCursorMode]);

  return (
    <div
      aria-hidden="true"
      data-cursor-mode={cursorMode}
      className={cn(
        'pointer-events-none fixed inset-0 z-[9999]',
        cursorMode === 'hidden' && 'opacity-0',
      )}
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 -ml-[12px] -mt-[12px] h-[24px] w-[24px] rounded-full border border-bone mix-blend-difference will-change-transform"
        style={{ transform: 'translate(-100px, -100px)' }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[2px] -mt-[2px] h-[4px] w-[4px] rounded-full bg-bone mix-blend-difference will-change-transform"
        style={{ transform: 'translate(-100px, -100px)' }}
      />
    </div>
  );
}
