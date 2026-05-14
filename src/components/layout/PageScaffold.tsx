import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PageScaffoldProps {
  pretitle?: string;
  title: string;
  subtitle?: string;
  weekBadge?: string;
  /** Override theme on this section. Defaults to dark. */
  theme?: 'dark' | 'light';
  children?: ReactNode;
}

/**
 * Placeholder section used by all routes during W1.
 * Renders the master-prompt section claim with display typography
 * so we can verify Fraunces / Switzer / JetBrains Mono all load + token classes apply.
 * Real W2+ implementations replace each route's contents — this stays as a fallback.
 */
export function PageScaffold({
  pretitle,
  title,
  subtitle,
  weekBadge,
  theme = 'dark',
  children,
}: PageScaffoldProps) {
  return (
    <section
      data-theme={theme}
      className={cn(
        'min-h-screen px-s4 pb-s7 pt-s9 sm:px-s5',
        theme === 'dark' ? 'bg-ink text-bone' : 'bg-paper text-ink-soft',
      )}
    >
      <div className="mx-auto max-w-6xl">
        {pretitle ? (
          <p
            className={cn(
              'font-mono text-caption uppercase tracking-caption',
              theme === 'dark' ? 'text-bone-muted' : 'text-ink-faded',
            )}
          >
            {pretitle}
          </p>
        ) : null}
        <h1 className="mt-s4 text-balance font-display text-display-section">{title}</h1>
        {subtitle ? (
          <p
            className={cn(
              'mt-s5 max-w-3xl text-body-l',
              theme === 'dark' ? 'text-bone-muted' : 'text-ink-faded',
            )}
          >
            {subtitle}
          </p>
        ) : null}
        {weekBadge ? (
          <p
            className={cn(
              'mt-s5 inline-block border-l-2 pl-s3 font-mono text-data-label uppercase tracking-data',
              theme === 'dark' ? 'border-accent text-accent' : 'border-accent text-accent',
            )}
          >
            {weekBadge}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
