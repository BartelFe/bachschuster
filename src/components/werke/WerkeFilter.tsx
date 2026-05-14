import { FILTERS, type ProjectCategory } from '@/content/projects';
import { cn } from '@/lib/cn';

interface WerkeFilterProps {
  active: 'all' | ProjectCategory;
  onChange: (next: 'all' | ProjectCategory) => void;
  counts: Record<'all' | ProjectCategory, number>;
}

/**
 * Editorial filter row. Mono-style chips with terrakotta underline on active.
 * Each chip carries its count so the user sees the filter weight before clicking.
 */
export function WerkeFilter({ active, onChange, counts }: WerkeFilterProps) {
  return (
    <nav
      aria-label="Werke filtern"
      className="flex flex-wrap items-baseline gap-x-s5 gap-y-s3 border-y border-border-subtle py-s4"
    >
      {FILTERS.map((f) => {
        const isActive = f.id === active;
        const count = counts[f.id] ?? 0;
        return (
          <button
            key={f.id}
            type="button"
            data-cursor="link"
            data-magnetic
            onClick={() => onChange(f.id)}
            className={cn(
              'group inline-flex items-baseline gap-s2 font-mono text-caption uppercase tracking-caption transition-colors duration-hover ease-cinematic',
              isActive ? 'text-bone' : 'text-bone-faint hover:text-bone-muted',
            )}
          >
            <span
              className={cn(
                'relative pb-[2px] after:absolute after:inset-x-0 after:-bottom-[1px] after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-hover after:ease-cinematic',
                isActive && 'after:scale-x-100',
                !isActive && 'group-hover:after:scale-x-100 group-hover:after:bg-bone-faint',
              )}
            >
              {f.label}
            </span>
            <span
              className={cn(
                'font-mono text-[9px] tracking-data',
                isActive ? 'text-accent' : 'text-bone-faint/60',
              )}
              aria-hidden="true"
            >
              {String(count).padStart(2, '0')}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
