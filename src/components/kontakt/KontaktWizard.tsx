import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useUIStore } from '@/lib/store';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { brand } from '@/content/brand';
import { cn } from '@/lib/cn';

/**
 * Kontakt — five-step briefing wizard.
 *
 * The wizard collects the minimum context the office needs to qualify a new
 * brief without the user having to write a long-form email cold:
 *   1. Was bringt Sie? (Vorhaben)
 *   2. Wo? (Ort / Region)
 *   3. Wann? (Zeitfenster)
 *   4. Wer? (Name, Firma, E-Mail)
 *   5. Erzählen Sie kurz (freier Text)
 *
 * On submit the wizard composes a mailto: URL to brand.email pre-filling the
 * subject + body so the user lands in their mail client one click away from
 * sending. No backend, no captcha — keeps the pitch self-contained.
 *
 * UX:
 *   · Progress dots top, current step name underneath.
 *   · Display-typography prompt centred, options or input below.
 *   · "Zurück" / "Weiter" footer, magnetic-cursor + accent border.
 *   · Submit screen with mailto: link + reset button.
 *   · ScrollTrigger sets currentSection = 'kontakt' for the drone fade.
 */

type Vorhaben = 'architektur' | 'stadtplanung' | 'sonderbau' | 'strukturplanung-beratung';
type Zeitfenster = 'sofort' | '3-6-monate' | '6-12-monate' | 'laenger';
type Region = 'deutschland' | 'europa' | 'weltweit';

interface FormState {
  vorhaben: Vorhaben | null;
  region: Region | null;
  ortFrei: string;
  zeitfenster: Zeitfenster | null;
  name: string;
  firma: string;
  email: string;
  brief: string;
}

const STEPS = [
  { id: 1, label: 'Vorhaben' },
  { id: 2, label: 'Ort' },
  { id: 3, label: 'Zeitfenster' },
  { id: 4, label: 'Kontakt' },
  { id: 5, label: 'Briefing' },
] as const;

export function KontaktWizard() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepBodyRef = useRef<HTMLDivElement>(null);
  const setCurrentSection = useUIStore((s) => s.setCurrentSection);

  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>({
    vorhaben: null,
    region: null,
    ortFrei: '',
    zeitfenster: null,
    name: '',
    firma: '',
    email: '',
    brief: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // A11y: when the step advances, move keyboard focus to the first input
  // or option button inside the new step. Avoids the user having to Shift+
  // Tab back from the "Weiter" button after each click.
  useEffect(() => {
    if (submitted) return;
    const body = stepBodyRef.current;
    if (!body) return;
    // Defer to next frame so the step's children are mounted.
    const id = window.requestAnimationFrame(() => {
      const first = body.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled])',
      );
      first?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [step, submitted]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setCurrentSection('kontakt'),
        onEnterBack: () => setCurrentSection('kontakt'),
      });
    }, section);
    return () => ctx.revert();
  }, [setCurrentSection]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  const canAdvance: Record<number, boolean> = {
    1: state.vorhaben != null,
    2: state.region != null,
    3: state.zeitfenster != null,
    4: state.name.trim().length > 0 && /.+@.+\..+/.test(state.email),
    5: state.brief.trim().length >= 10,
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    const subject = encodeURIComponent(
      `Briefing · ${vorhabenLabel(state.vorhaben)} · ${state.name}${state.firma ? ' / ' + state.firma : ''}`,
    );
    const lines = [
      `Hallo Bachschuster Team,`,
      ``,
      `Vorhaben: ${vorhabenLabel(state.vorhaben)}`,
      `Region: ${regionLabel(state.region)}${state.ortFrei ? ' · ' + state.ortFrei : ''}`,
      `Zeitfenster: ${zeitfensterLabel(state.zeitfenster)}`,
      `Absender: ${state.name}${state.firma ? ` (${state.firma})` : ''}`,
      `E-Mail: ${state.email}`,
      ``,
      `Briefing:`,
      state.brief,
      ``,
      `— gesendet via bachschuster.vercel.app`,
    ];
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      data-section="kontakt"
      className="relative min-h-screen bg-ink px-s4 pb-s9 pt-s9 text-bone sm:px-s5"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-s7">
        {/* ── Header ────────────────────────────────────────────────── */}
        <header>
          <p className="font-mono text-caption uppercase tracking-caption text-bone-muted">
            Kontakt · Briefing-Wizard
          </p>
          <h1
            className="mt-s3 font-display text-display-section text-bone"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            <span>Sagen Sie uns,</span>
            <br />
            <span
              className="italic text-accent"
              style={{ fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 80' }}
            >
              wovor das Gebäude steht.
            </span>
          </h1>
          <p className="mt-s5 max-w-2xl text-body-l text-bone-muted">
            Fünf kurze Fragen. Am Ende sind Sie einen Klick vom Senden entfernt — wir antworten
            innerhalb eines Werktags.
          </p>
        </header>

        {/* ── Progress ─────────────────────────────────────────────── */}
        <ProgressBar step={step} />

        {/* ── Step body ────────────────────────────────────────────── */}
        {!submitted ? (
          <div
            ref={stepBodyRef}
            role="group"
            aria-label={`Schritt ${step} von ${STEPS.length}: ${STEPS[step - 1]?.label}`}
            className="min-h-[40vh] border-t border-border-subtle pt-s6"
          >
            {step === 1 && (
              <StepWrap pretitle="01 · Vorhaben" prompt="Worum geht es?">
                <OptionGrid
                  options={
                    [
                      {
                        id: 'architektur',
                        label: 'Architektur',
                        body: 'Gebäude, Sonderlösung, Neubau / Umbau.',
                      },
                      {
                        id: 'stadtplanung',
                        label: 'Stadtplanung',
                        body: 'Quartier, Bebauungsplan, Standort­entwicklung.',
                      },
                      {
                        id: 'sonderbau',
                        label: 'Sonderbau',
                        body: 'Sakral, Sport, Messe, Pavillon.',
                      },
                      {
                        id: 'strukturplanung-beratung',
                        label: 'Strukturplanung',
                        body: 'Beratung VOR Architektur und Stadtplanung.',
                      },
                    ] as Array<{ id: Vorhaben; label: string; body: string }>
                  }
                  selected={state.vorhaben}
                  onSelect={(id) => update('vorhaben', id)}
                />
              </StepWrap>
            )}

            {step === 2 && (
              <StepWrap pretitle="02 · Ort" prompt="Wo soll es entstehen?">
                <OptionGrid
                  options={
                    [
                      { id: 'deutschland', label: 'Deutschland' },
                      { id: 'europa', label: 'Europa' },
                      { id: 'weltweit', label: 'Weltweit' },
                    ] as Array<{ id: Region; label: string }>
                  }
                  selected={state.region}
                  onSelect={(id) => update('region', id)}
                />
                <div className="mt-s5">
                  <label
                    htmlFor="kontakt-ortfrei"
                    className="font-mono text-data-label uppercase tracking-data text-bone-faint"
                  >
                    Optional · Stadt / Region
                  </label>
                  <input
                    id="kontakt-ortfrei"
                    type="text"
                    value={state.ortFrei}
                    onChange={(e) => update('ortFrei', e.target.value)}
                    placeholder="z. B. Heilbronn, Nairobi, Linz"
                    className="mt-s2 w-full border-b-2 border-border-strong bg-transparent py-s2 font-display text-2xl text-bone outline-none transition-colors duration-hover focus:border-accent"
                  />
                </div>
              </StepWrap>
            )}

            {step === 3 && (
              <StepWrap pretitle="03 · Zeitfenster" prompt="Wann brauchen Sie uns?">
                <OptionGrid
                  options={
                    [
                      {
                        id: 'sofort',
                        label: 'Sofort',
                        body: 'Wir starten in den nächsten Wochen.',
                      },
                      {
                        id: '3-6-monate',
                        label: '3–6 Monate',
                        body: 'Konzept jetzt, Start mittelfristig.',
                      },
                      { id: '6-12-monate', label: '6–12 Monate', body: 'Strategische Vorplanung.' },
                      { id: 'laenger', label: 'Länger', body: 'Wir haben noch Zeit.' },
                    ] as Array<{ id: Zeitfenster; label: string; body: string }>
                  }
                  selected={state.zeitfenster}
                  onSelect={(id) => update('zeitfenster', id)}
                />
              </StepWrap>
            )}

            {step === 4 && (
              <StepWrap pretitle="04 · Kontakt" prompt="Wer sind Sie?">
                <div className="grid gap-s4 sm:grid-cols-2">
                  <Field
                    id="kontakt-name"
                    label="Name *"
                    value={state.name}
                    onChange={(v) => update('name', v)}
                    placeholder="Vor- und Nachname"
                  />
                  <Field
                    id="kontakt-firma"
                    label="Organisation"
                    value={state.firma}
                    onChange={(v) => update('firma', v)}
                    placeholder="Optional · Firma / Stadt / Institut"
                  />
                  <Field
                    id="kontakt-email"
                    label="E-Mail *"
                    type="email"
                    value={state.email}
                    onChange={(v) => update('email', v)}
                    placeholder="you@example.com"
                    className="sm:col-span-2"
                  />
                </div>
              </StepWrap>
            )}

            {step === 5 && (
              <StepWrap pretitle="05 · Briefing" prompt="Erzählen Sie uns kurz vom Vorhaben.">
                <label
                  htmlFor="kontakt-brief"
                  className="font-mono text-data-label uppercase tracking-data text-bone-faint"
                >
                  Worum geht es im Kern? (mind. 10 Zeichen)
                </label>
                <textarea
                  id="kontakt-brief"
                  rows={8}
                  value={state.brief}
                  onChange={(e) => update('brief', e.target.value)}
                  placeholder="z. B. Wir entwickeln ein 14-ha-Quartier am Bahnhof Heilbronn und brauchen einen Strukturplan vor dem Bebauungsplan…"
                  className="mt-s2 w-full resize-none border-2 border-border-strong bg-surface p-s3 text-body-l text-bone outline-none transition-colors duration-hover focus:border-accent"
                />
                <Summary state={state} />
              </StepWrap>
            )}

            {/* ── Footer nav ─────────────────────────────────────────── */}
            <footer className="mt-s7 flex items-center justify-between gap-s3 border-t border-border-subtle pt-s5">
              <button
                type="button"
                onClick={back}
                disabled={step === 1}
                data-cursor={step === 1 ? undefined : 'link'}
                className={cn(
                  'font-mono text-data-label uppercase tracking-data transition-colors duration-hover ease-cinematic',
                  step === 1 ? 'text-bone-faint/40' : 'text-bone-muted hover:text-bone',
                )}
              >
                ← Zurück
              </button>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canAdvance[step]}
                  data-cursor={canAdvance[step] ? 'link' : undefined}
                  data-magnetic
                  className={cn(
                    'inline-flex items-center gap-s2 border-l-2 pl-s3 font-mono text-data-label uppercase tracking-data transition-colors duration-hover ease-cinematic',
                    canAdvance[step]
                      ? 'border-accent text-accent hover:text-accent-glow'
                      : 'border-bone-faint/40 text-bone-faint/40',
                  )}
                >
                  Weiter
                  <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canAdvance[step]}
                  data-cursor={canAdvance[step] ? 'link' : undefined}
                  data-magnetic
                  className={cn(
                    'inline-flex items-center gap-s2 border-l-2 pl-s3 font-mono text-data-label uppercase tracking-data transition-colors duration-hover ease-cinematic',
                    canAdvance[step]
                      ? 'border-accent text-accent hover:text-accent-glow'
                      : 'border-bone-faint/40 text-bone-faint/40',
                  )}
                >
                  Briefing senden
                  <span aria-hidden="true">↗</span>
                </button>
              )}
            </footer>
          </div>
        ) : (
          <SubmittedScreen
            email={state.email}
            onReset={() => {
              setSubmitted(false);
              setStep(1);
              setState({
                vorhaben: null,
                region: null,
                ortFrei: '',
                zeitfenster: null,
                name: '',
                firma: '',
                email: '',
                brief: '',
              });
            }}
          />
        )}
      </div>
    </section>
  );
}

/* ── Step-internal components ─────────────────────────────────────────── */

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-s2">
      {STEPS.map((s) => (
        <div key={s.id} className="flex flex-1 flex-col gap-s1">
          <div
            className={cn(
              'h-px w-full transition-colors duration-hover ease-cinematic',
              s.id < step ? 'bg-accent' : s.id === step ? 'bg-bone' : 'bg-border-strong',
            )}
          />
          <p
            className={cn(
              'font-mono text-data-label uppercase tracking-data transition-colors duration-hover ease-cinematic',
              s.id === step ? 'text-accent' : s.id < step ? 'text-bone-muted' : 'text-bone-faint',
            )}
          >
            {String(s.id).padStart(2, '0')} · {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function StepWrap({
  pretitle,
  prompt,
  children,
}: {
  pretitle: string;
  prompt: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-data-label uppercase tracking-data text-accent">{pretitle}</p>
      <h2
        className="mt-s2 font-display text-3xl leading-tight text-bone sm:text-4xl"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
      >
        {prompt}
      </h2>
      <div className="mt-s5">{children}</div>
    </div>
  );
}

function OptionGrid<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: Array<{ id: T; label: string; body?: string }>;
  selected: T | null;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="grid gap-s3 sm:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          data-cursor="link"
          data-magnetic
          onClick={() => onSelect(o.id)}
          className={cn(
            'flex flex-col items-start gap-s2 border-2 p-s4 text-left transition-all duration-hover ease-cinematic',
            selected === o.id
              ? 'border-accent bg-surface text-bone'
              : 'border-border-subtle bg-ink text-bone-muted hover:border-border-strong hover:text-bone',
          )}
        >
          <span
            className="font-display text-2xl"
            style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
          >
            {o.label}
          </span>
          {o.body ? <span className="text-body-s text-bone-muted">{o.body}</span> : null}
        </button>
      ))}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email';
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="font-mono text-data-label uppercase tracking-data text-bone-faint"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-s2 w-full border-b-2 border-border-strong bg-transparent py-s2 font-display text-2xl text-bone outline-none transition-colors duration-hover focus:border-accent"
      />
    </div>
  );
}

function Summary({ state }: { state: FormState }) {
  return (
    <aside className="mt-s5 grid gap-s3 border-l-2 border-accent pl-s3 sm:grid-cols-2">
      <SummaryRow label="Vorhaben" value={vorhabenLabel(state.vorhaben)} />
      <SummaryRow
        label="Region"
        value={regionLabel(state.region) + (state.ortFrei ? ' · ' + state.ortFrei : '')}
      />
      <SummaryRow label="Zeitfenster" value={zeitfensterLabel(state.zeitfenster)} />
      <SummaryRow
        label="Absender"
        value={`${state.name || '—'}${state.firma ? ' · ' + state.firma : ''}`}
      />
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-data-label uppercase tracking-data text-bone-faint">{label}</p>
      <p className="mt-s1 font-display text-lg text-bone">{value}</p>
    </div>
  );
}

function SubmittedScreen({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="border-t border-border-subtle pt-s7 text-center">
      <p className="font-mono text-data-label uppercase tracking-data text-accent">
        Briefing gesendet
      </p>
      <h2
        className="mt-s3 font-display text-4xl leading-tight text-bone sm:text-5xl"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 380' }}
      >
        Danke — wir antworten an
        <br />
        <span className="italic text-accent">{email}</span>.
      </h2>
      <p className="mt-s5 text-body-l text-bone-muted">
        Ihr Mail-Programm hat sich geöffnet — bitte senden. Wir melden uns innerhalb eines Werktags.
      </p>
      <button
        type="button"
        onClick={onReset}
        data-cursor="link"
        className="mt-s7 inline-flex items-center gap-s2 font-mono text-data-label uppercase tracking-data text-bone-muted transition-colors duration-hover ease-cinematic hover:text-bone"
      >
        Neues Briefing starten
      </button>
    </div>
  );
}

/* ── Label maps for both display + mailto subject/body ───────────────── */

function vorhabenLabel(v: Vorhaben | null): string {
  if (!v) return '—';
  return {
    architektur: 'Architektur',
    stadtplanung: 'Stadtplanung',
    sonderbau: 'Sonderbau',
    'strukturplanung-beratung': 'Strukturplanung-Beratung',
  }[v];
}

function regionLabel(r: Region | null): string {
  if (!r) return '—';
  return { deutschland: 'Deutschland', europa: 'Europa', weltweit: 'Weltweit' }[r];
}

function zeitfensterLabel(z: Zeitfenster | null): string {
  if (!z) return '—';
  return {
    sofort: 'Sofort',
    '3-6-monate': '3–6 Monate',
    '6-12-monate': '6–12 Monate',
    laenger: 'Länger',
  }[z];
}
