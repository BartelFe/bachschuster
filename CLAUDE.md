# BACHSCHUSTER ARCHITEKTUR — CLAUDE.md

**This is the permanent context for every Claude Code session on this repo. Read it fully before doing anything.**

The full master build prompt (with the 11-week plan, week-specific tasks, and Awwwards quality bar) lives at:
`C:\Users\felix\Downloads\bachschuster-master-prompt (1).md`

This file mirrors sections 1–6 of that master prompt. When a new week starts, Felix will paste the corresponding § 7 week block into chat.

---

## 0 · GOLDEN RULES

- Keine Abkürzungen. Wenn etwas drei Tage braucht statt einen, dann drei Tage.
- Keine generischen Lösungen. Jede Komponente muss spezifisch für Bachschuster sein.
- Keine "best practices"-Ausreden, die zu langweiligen Resultaten führen. Wir bauen Awwwards Site of the Day, nicht Bootstrap-Bullshit.
- **60fps oder es ist nicht fertig.**
- Vor jedem Major-Build erst Konzept als Pseudo-Code zeigen, dann implementieren, dann Demo, dann nächster Schritt.
- Wenn etwas im Master Prompt unklar ist → fragen statt raten.

---

## 1 · VISION

Wir bauen für **Bachschuster Architektur** (Ingolstadt, Shanghai, Johannesburg, Linz) eine Website, die **Awwwards Site of the Day** gewinnen kann und gleichzeitig die strategische Differenzierung des Büros — **Strukturplanung als Methode vor Architektur** — als interaktives Erlebnis kommuniziert.

Dies ist eine **Pitch-Site v1**, die zwei Ziele erfüllt:

1. Bachschuster als bezahlten Kunden gewinnen (Folge-Auftrag)
2. Awwwards-Recognition für unser Portfolio

**Die zentrale These der Site:** Strukturplanung wird nicht erklärt — sie wird demonstriert. Jede Interaktion verkörpert das Versprechen: **„Vor dem Gebäude, das System."**

**Die Latte:**

- Awwwards Site of the Day Standard
- Performance: 60fps durchgehend, Lighthouse Performance 85+, Best Practices/SEO/A11y 95+
- Visuelle Komplexität auf Active-Theory / Lusion / Locomotive Niveau
- Originalität: Wir referenzieren, wir kopieren nicht.

---

## 2 · POSITIONIERUNG & STORY

**Headline-Claim (Hero):** Vor dem Gebäude, das System.
**Alternative:** Wir entwerfen das Unsichtbare zuerst.
**Manifest (Original von Bachschuster):** „Das Bestmögliche tun und das Unmögliche denken."
**Strukturplanung-Slogan:** „Strukturplanung heißt Schritte gehen, nicht nur Schritte reden."

**Was Bachschuster ist:**

- International tätiges Architektur-, Stadt- und Strukturplanungsbüro
- 25+ Jahre Erfahrung (seit 1993)
- Standorte: Ingolstadt (Hauptsitz), Shanghai, Johannesburg, Linz
- Erfinder der Methode „Strukturplanung" — ganzheitliche Vorplanung, die VOR Stadtplanung und Architektur kommt
- Mitgründer des **iiRD** (Institut für interdisziplinäre Regionalentwicklung) zusammen mit TUM Heilbronn
- Spezialisten für Konfliktlösung zwischen Städten, Unternehmen, Bürgern, Umwelt
- Themen: Smart Cities, Mobilität, Kreislaufwirtschaft, klimagerechtes Bauen

**Das Anti-Statement:**

> „Traditionelle Masterplanung sieht Verkehr, Umweltschutz, Architektur, Zukunft und Stadträume als separate Instanzen. Diese Art zu planen ist längst überholt. Strukturplanung integriert sie zu einem funktionierenden Gesamtorganismus."

**Tonalität:**

- Selbstbewusst, nicht überheblich
- Intellektuell, nicht akademisch
- Editorial, nicht korporativ
- Deutsch, präzise, kein Marketing-Sprech

---

## 3 · DESIGN SYSTEM

### 3.1 Farben

**Editorial Dark als Default Mode.** Editorial Light für Manifest & Methode-Sektionen (Wechsel passiert nahtlos im Scroll, kein User-Toggle).

```css
/* ─── Dark Mode (Default) ──────────────────────────── */
--bg-ink: #0a0b0e; /* base, near black with warm undertone */
--bg-surface: #11141a; /* raised surfaces, cards */
--bg-elevated: #1a1f28; /* tooltips, dropdowns */
--border-subtle: #1e232c;
--border-strong: #2a303b;

--text-primary: #f2ede2; /* warm bone white */
--text-secondary: #9b9385; /* muted warm gray */
--text-tertiary: #5c5a55;
--text-inverse: #0a0b0e;

/* ─── Light Mode (Manifest + Methode) ──────────────── */
--bg-paper: #ece6d8; /* slightly tinted paper */
--bg-paper-raised: #f4efe3;
--text-primary-light: #1a1612;
--text-secondary-light: #4a453d;

/* ─── Accent: Terrakotta / Clay ────────────────────── */
--accent-primary: #b85c2e;
--accent-glow: #d97648;
--accent-shadow: #7a3a1c;

/* ─── Data Layer: Architectural Blueprint ──────────── */
--data-cyan: #4d8fbf;
--data-teal: #2d6878;

/* ─── Stakeholder Colors (Force Graph) ─────────────── */
--stk-city: #4d8fbf; /* Stadt/Kommune — kühles Blau */
--stk-business: #b85c2e; /* Wirtschaft — Terrakotta */
--stk-citizens: #e8c547; /* Bürger — Sodium-Gelb */
--stk-environment: #7ba659; /* Umwelt — Moos */
--stk-institutional: #c2b8a3; /* Institutionen — Stein */
```

### 3.2 Typografie

**Display Serif:** **Fraunces** (Google Fonts, OFL — komplett kostenlos, auch commercial). Variable Weight mit SOFT- und WONK-Achse für echten Italic-Angle, plus Optical Sizing.

- Hero-Display: clamp(120px, 14vw, 280px), weight 300, italic angle 6°, kerning -0.04em
- Section-Display: clamp(80px, 8vw, 160px), weight 400
- Pull-Quote: clamp(40px, 3.5vw, 72px), weight 380, italic

**Body Sans:** **Switzer** (Fontshare, free für commercial use). Variable Weight, Swiss-Style. Fallback: General Sans (Fontshare) oder Inter Display Variable (Google Fonts).

- Body L: 18px / 1.6
- Body M: 16px / 1.55
- Body S: 13px / 1.5
- Caption: 11px tracking +0.06em uppercase

**Mono (Daten):** JetBrains Mono Variable.

- Data Label: 10px tracking +0.08em uppercase
- Coordinates: 11px

**Type-Tricks:**

- Bei großen Headlines: SplitText auf Glyph-Level + leichter y-Wiggle pro Buchstabe beim In-Scroll
- Variable-Weight-Sweep auf Hover (300 → 500) bei wichtigen Worten
- Optical Sizing aktivieren (font-optical-sizing: auto)
- Stylistic Sets nutzen falls die Schrift welche hat

### 3.3 Spacing & Layout

12-Column-Grid mit asymmetrischen Templates pro Sektion. **Keine standardisierten Section-Paddings** — jede Sektion definiert ihre eigene Geometrie.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 16px;
--space-4: 24px;
--space-5: 40px;
--space-6: 64px;
--space-7: 96px;
--space-8: 144px;
--space-9: 220px;
--space-10: 340px;
```

### 3.4 Motion Language

```ts
export const ease = {
  cinematic: [0.16, 1, 0.3, 1], // langsam ausklingend, für Reveals
  punchy: [0.65, 0, 0.35, 1], // schnell, für UI
  spring: { mass: 1, tension: 280, friction: 26 },
  inertial: [0.22, 1.61, 0.36, 1], // leichter Overshoot
};
```

**Regeln:**

- Default Reveal-Dauer: 1.2s mit `ease.cinematic`
- Hover-Reaktionen: 220ms max
- Scroll-Distanz für volle Animation: mindestens 80vh — **niemals** "Snap to Animation"
- Niemand spürt Easing aktiv, aber jeder spürt, wenn es fehlt

### 3.5 Cursor

Custom Cursor, kontextuell:

- **Default:** kleiner Dot (4px) + Trailing-Ring (24px), dezenter Magnetismus zu interaktiven Elementen
- **Über Projekt-Karten:** Lupe mit dynamischem Label ("ÖFFNEN", "ROTATE", "DRAG")
- **Über Daten-Viz:** Crosshair mit Live-Datenpoint
- **Über Body Text:** invisible (Browser-Cursor reicht)
- **Audio-Toggle Hover:** Wave-Form Animation

Implementation: GSAP Quick-To für 60fps, **kein React-State pro Frame**.

### 3.6 Sound

Default ausgeschaltet, Hinweis-Toast „Sound an für das volle Erlebnis" beim ersten Scroll-Trigger.

**Sound-Layer:**

1. **Ambient Field Recordings** pro Sektion:
   - Hero: tiefes Synthie-Drone + leise Stadtgeräusche, gemorpht
   - Manifest: fast still, nur Papier-Rascheln
   - Methode: subtile mechanische Ticks bei Knoten-Bewegung
   - Werke pro Projekt: ortsbezogen (Shanghai-Straße, WestPark-Vögel, Vietnam-Glocken)
   - Globe: tiefes Brummen + bei Standort-Hover lokales Soundbed
2. **UI-Sounds** — fast unhörbar: Hover-Tick, Click-Thump, Transition-Whoosh
3. **Howler.js** für Mixing, Volume-Crossfade zwischen Sektionen
4. **Sound-Toggle:** minimalistischer EQ-Bar oben rechts, animiert zu Wave wenn aktiv

---

## 4 · TECH STACK

**Core:**

- Vite 5 + React 18 + TypeScript 5 (strict mode + noUncheckedIndexedAccess)
- Vercel Deployment, Domain: `bachschuster.vercel.app`

**Routing & State:**

- React Router 6.4+ (Data Router Mode)
- Zustand für globalen State (Sound, current section, cursor mode)

**Styling:**

- Tailwind CSS 3.x + Custom Theme Extension (alle Tokens aus 3.1)
- CSS-Module für komplexere Sektionen (`.module.css`)
- PostCSS + autoprefixer
- `@/styles/globals.css` für Type-Setup + Reset

**Animation:**

- GSAP 3.13+ inkl. **ALLE Plugins** (SplitText, DrawSVG, MorphSVG, Physics2D, Flip, Inertia, CustomEase, MotionPath). Seit Webflow's Acquisition (Mai 2025) komplett kostenlos für jeden, auch commercial — **kein Club-Account nötig**. Standard `npm i gsap` reicht.
- Lenis (smooth scroll, lockstep mit ScrollTrigger)
- Framer Motion **nur** für Route-Mount/Unmount-Transitions
- Optional: Theatre.js für komplexe Keyframe-Sequenzen

**3D / WebGL:**

- three.js 0.16x
- @react-three/fiber + @react-three/drei + @react-three/postprocessing
- vite-plugin-glsl für Shader-Imports (.glsl, .vert, .frag)

**Daten-Viz:**

- d3-force für Force-Graph (Methode-Sektion)
- d3-geo für Globe-Hilfsfunktionen
- Eigene Canvas-Renderer, **keine fertigen Chart-Libs**

**Audio:**

- Howler.js + eigene SoundContext-Komponente
- Web Audio API für FFT falls Visualisierung nötig

**Assets:**

- Bilder: AVIF + WebP fallback via vite-imagetools
- Fonts: WOFF2 + subsetting auf Latin-Glyphen
- 3D-Models: GLB mit DRACO + KTX2-Texturen

**Quality Gates:**

- ESLint + Prettier + Husky pre-commit
- Vitest für Utility-Tests
- Lighthouse CI in der Pipeline
- Performance-Budget: JS < 250kb gzipped (excl. WebGL chunks)

---

## 5 · SITE MAP & ROUTING

```
/                          → Homepage (Hero → Manifest → Methode-Teaser → Werke-Teaser → Globe-Teaser → Stimmen-Teaser → Kontakt)
/methode                   → Methode Deep Dive (Force Graph full-screen + Case-Studies)
/werke                     → Werke Index (asymmetrisches Grid)
/werke/westpark            → Project Deep Dive
/werke/shanghai-pavillion  → Project Deep Dive
/werke/mobility-hub        → Project Deep Dive
/werke/sen-friedenszentrum → Project Deep Dive
/werke/[5th-slug]          → Project Deep Dive (Felix wählt aus Drive)
/netzwerk                  → Globe Deep Dive
/stimmen                   → Vorträge / Publikationen / Awards / Jury
/team                      → Team + Peter Bachschuster Profil
/kontakt                   → Briefing-Wizard
/impressum
/datenschutz
```

**Page-Transitions:**

- Default: cinematic Curtain-Wipe (1.2s) mit Color-Bleed der nächsten Sektion
- Werke → Werk-Detail: Bild zoomt fullscreen, Layout baut sich darum auf
- Homepage → Methode: Hero-Particles „fließen" in den Force-Graph

---

## 6 · INHALTE (HARDCODED — `src/content/*.ts`)

Alle Inhalte als TypeScript-Objekte, strikt typisiert. Wachsen organisch — Pitch v1 darf Lücken haben, solange Hero/Methode/3 Projekte/Globe stehen.

### 6.1 Brand

```ts
export const brand = {
  name: 'Bachschuster Architektur',
  shortName: 'Bachschuster',
  claim: 'Vor dem Gebäude, das System.',
  manifesto: 'Das Bestmögliche tun und das Unmögliche denken.',
  founded: 1993,
  yearsActive: 32,
  legalName: 'Bachschuster Architektur GmbH',
  address: {
    street: 'Brodmühlweg 4',
    zip: '85049',
    city: 'Ingolstadt',
    country: 'Deutschland',
  },
  phone: '+49 841 938 33 00',
  email: 'info@bachschuster.de',
} as const;
```

### 6.2 Strukturplanung — Die Methode

```ts
export const methode = {
  pretitle: 'DIE METHODE',
  title: 'Strukturplanung heißt Schritte gehen, nicht nur Schritte reden.',
  intro:
    'Traditionelle Masterplanung sieht Verkehr, Umweltschutz, Architektur, Zukunft und Stadträume als separate Instanzen. Diese Art zu planen ist längst überholt. Strukturplanung integriert sie zu einem funktionierenden Gesamtorganismus — Synergien werden genutzt, Beeinträchtigungen vermieden. Die Strukturplanung steht vor den Bereichen Stadtplanung und Architektur.',

  stakeholders: [
    { id: 'city', label: 'Stadt & Kommunen', color: 'stk-city' },
    { id: 'business', label: 'Wirtschaftliche Akteure', color: 'stk-business' },
    { id: 'citizens', label: 'Bürger & Anwohner', color: 'stk-citizens' },
    { id: 'environment', label: 'Umwelt & Klima', color: 'stk-environment' },
    { id: 'institutional', label: 'Institutionen & Wissenschaft', color: 'stk-institutional' },
  ],

  iiRD: {
    name: 'Institut für interdisziplinäre Regionalentwicklung',
    short: 'iiRD',
    description:
      'Zusammenschluss aus TUM Heilbronn und Bachschuster Architektur. Weltweit erstes Institut für ganzheitliche Planung von Städten, Regionen und Unternehmen als sozioökonomische Funktion.',
    focusAreas: ['Mobilität', 'Smart Cities', 'Kreislaufwirtschaft', 'Klimagerechtes Bauen'],
  },
};
```

### 6.3 Projekte — Top 5 Deep Dives

Vier Projekte vollständig spezifiziert. **Fünftes Projekt:** Felix wählt aus den Drive-Assets (idealerweise eines aus Johannesburg, Dubai, Indien oder Brasilien für globale Range). Die vier feststehenden:

1. **WestPark Verbindungssteg** — Ingolstadt, 2020, Öffentlicher Raum, Realisiert. Röntgen-Layers: Architektur · Tragstruktur · Mobilität · Sichtachsen · Strukturplanung.
2. **Pavillion of Innovation** — Shanghai EXPO 2010, Sonderbau, Realisiert. Layers: Architektur · Materialfluss · Programm · Strukturplanung.
3. **Mobility Hub Ingolstadt** — 2023, Stadtplanung, In Planung. Layers: Hülle · Mobilitätsströme · Energiekonzept · Sozialer Raum · Strukturplanung.
4. **Sen Friedenszentrum** — Thái Bình Vietnam, 2025, Sonderbau, In Startphase. Layers: Symbolik · Sakrale Geometrie · Programmverflechtung · Strukturplanung.

Vollständige Röntgen-Layer-Beschreibungen siehe Master Prompt § 6.3.

### 6.4 Standorte

```ts
export const standorte = [
  {
    city: 'Ingolstadt',
    country: 'Deutschland',
    role: 'Hauptsitz',
    lat: 48.7665,
    lng: 11.4258,
    tz: 'Europe/Berlin',
  },
  {
    city: 'Shanghai',
    country: 'China',
    role: 'Asien-Operations',
    lat: 31.2304,
    lng: 121.4737,
    tz: 'Asia/Shanghai',
  },
  {
    city: 'Johannesburg',
    country: 'Südafrika',
    role: 'Afrika-Operations',
    lat: -26.2041,
    lng: 28.0473,
    tz: 'Africa/Johannesburg',
  },
  {
    city: 'Linz',
    country: 'Österreich',
    role: 'DACH-Partner',
    lat: 48.3069,
    lng: 14.2858,
    tz: 'Europe/Vienna',
  },
] as const;
```

### 6.5 Team

```ts
export const team = {
  principal: {
    name: 'Peter Bachschuster',
    role: 'Gründer & Geschäftsführer',
    bio: 'Architekt und Stadtplaner. Erfinder der Strukturplanung. Seit 1993 international tätig. Moderator und Berater für Städte, Kommunen, Unternehmen, Banken und Institute in komplexen Standort- und Planungssituationen. Internationale Referenzen in China, Dubai, Indien, Südafrika, Brasilien. Mitgründer des iiRD.',
  },
  // weitere Member: tba — Felix befüllt aus Drive falls vorhanden
};
```

### 6.6 Stimmen

Stub — Felix recherchiert/befüllt: Vorträge, Publikationen, Jury-Tätigkeiten, Awards. Bis Pitch v1: 5–10 Einträge reichen.

---

## Decisions log

Material decisions outside the master prompt go in `/docs/decisions.md`. If the master prompt doesn't answer a question and Felix isn't available, decide, document, continue.
