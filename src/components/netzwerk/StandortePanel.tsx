import { useEffect, useState } from 'react';
import { formatLocalTime, standorte, type Standort } from '@/content/standorte';
import { cn } from '@/lib/cn';

interface StandortePanelProps {
  activeIndex: number;
  onSelect: (i: number) => void;
}

/**
 * Side panel listing the 4 standorte with live local times.
 *
 *  · Each row: city · country · role · local time · "since" year.
 *  · The active row pumps to bone, others sit at bone-muted; magnetic-cursor
 *    target on hover.
 *  · Time ticker re-renders every 30 s (cheaper than 1 s and visually
 *    indistinguishable at minute-precision).
 *  · "Bachschuster" (Hauptsitz) gets a small ◉ glyph to mark it as origin.
 */
export function StandortePanel({ activeIndex, onSelect }: StandortePanelProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const active = activeIndex >= 0 ? standorte[activeIndex] : null;

  return (
    <aside className="pointer-events-auto flex h-full max-h-full flex-col gap-s5 bg-ink/60 p-s4 backdrop-blur-sm sm:p-s5">
      <header>
        <p className="font-mono text-data-label uppercase tracking-data text-accent">
          Netzwerk · {String(standorte.length).padStart(2, '0')} Standorte
        </p>
        <h2
          className="mt-s2 font-display text-3xl leading-[0.95] text-bone sm:text-4xl"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
        >
          Die Strukturplanung kennt
          <br />
          <span
            className="italic text-accent"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
          >
            keine Grenze.
          </span>
        </h2>
        <p className="mt-s3 max-w-md text-body-s text-bone-muted">
          Vier Standorte auf drei Kontinenten — verbunden durch ein einziges Planungs­prinzip, nicht
          durch Filialen einer Marke.
        </p>
      </header>

      <ol className="flex flex-1 flex-col divide-y divide-border-subtle border-y border-border-subtle">
        {standorte.map((s, i) => (
          <li key={s.city}>
            <button
              type="button"
              data-cursor="link"
              data-magnetic
              onClick={() => onSelect(i === activeIndex ? -1 : i)}
              className={cn(
                'group flex w-full items-baseline justify-between gap-s3 py-s4 text-left transition-colors duration-hover ease-cinematic',
                i === activeIndex ? 'text-bone' : 'text-bone-muted hover:text-bone',
              )}
            >
              <div className="flex flex-col gap-s1">
                <span className="flex items-baseline gap-s2 font-display text-2xl">
                  {s.kind === 'hauptsitz' ? (
                    <span aria-hidden="true" className="text-accent">
                      ◉
                    </span>
                  ) : null}
                  {s.city}
                  {i === activeIndex ? (
                    <span className="font-mono text-data-label uppercase tracking-data text-accent">
                      Aktiv
                    </span>
                  ) : null}
                </span>
                <span className="font-mono text-caption uppercase tracking-caption text-bone-faint">
                  {s.country} · {s.role}
                </span>
              </div>
              <div className="flex flex-col items-end gap-s1">
                <LiveTime tz={s.tz} key={`t-${i}-${tick}`} />
                <span className="font-mono text-data-label uppercase tracking-data text-bone-faint">
                  seit {s.since}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ol>

      {/* Active-standort detail block — only renders when a standort is locked. */}
      {active ? <ActiveDetail standort={active} /> : <NoSelection />}
    </aside>
  );
}

function ActiveDetail({ standort }: { standort: Standort }) {
  return (
    <section className="border-l-2 border-accent pl-s3">
      <p className="font-mono text-data-label uppercase tracking-data text-accent">
        {standort.city} · {standort.lat.toFixed(2)}°, {standort.lng.toFixed(2)}°
      </p>
      <p className="mt-s2 text-body-m text-bone">{standort.summary}</p>
    </section>
  );
}

function NoSelection() {
  return (
    <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">
      Tippe einen Standort an, um den Globus zu drehen.
    </p>
  );
}

function LiveTime({ tz }: { tz: string }) {
  return <span className="font-display text-xl leading-none text-bone">{formatLocalTime(tz)}</span>;
}
