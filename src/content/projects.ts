/**
 * Projekte — Werke-Index + Deep-Dive content.
 *
 * Mirrors master prompt §6.3. Sixteen projects total: four spec'd deep dives
 * (WestPark, Shanghai Pavillon, Mobility Hub, Sen Friedenszentrum) plus the
 * 5th Felix-chosen deep dive (VW Hope Academy Südafrika, see docs/decisions.md
 * 2026-05-14) plus 11 catalog projects sourced from bachschuster.de/architektur
 * and /strukturplanung. Slug = folder name in `public/projects/{slug}/`.
 *
 * Röntgen-Layers: each deep-dive project carries five named layers describing
 * the systems that sit beneath the built artifact. W5 ships the WestPark
 * layers end-to-end; W6 fills in Shanghai / Mobility / Sen.
 */

export type ProjectCategory =
  | 'oeffentlicher-raum'
  | 'geschaeftsbauten'
  | 'privatbauten'
  | 'sonderbau'
  | 'stadtplanung';

export type ProjectStatus = 'realisiert' | 'in-planung' | 'in-startphase' | 'wettbewerb';

export interface ProjectLayer {
  /** 0-indexed display order (00..04 in the UI). */
  index: number;
  /** Short noun, e.g. "Architektur". */
  name: string;
  /** Subtitle / clause-level descriptor, e.g. "Was du siehst". */
  tagline: string;
  /** Two-sentence paragraph that appears in the annotation panel. */
  body: string;
  /** Optional numeric anchor data points shown as mono-tagged labels. */
  data?: Array<{ label: string; value: string }>;
}

export interface Project {
  slug: string;
  title: string;
  /** Optional sub-title for two-line display ("Verbindungssteg" under "WestPark"). */
  subtitle?: string;
  year: string;
  location: string;
  /** Single ISO country code for grid filtering / globe pinning later. */
  countryCode: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** One sentence brief — appears under the title in cards + on the deep-dive hero. */
  summary: string;
  /** Featured = master-prompt spec'd, full deep-dive Röntgen-Scroll. */
  featured: boolean;
  /** Asymmetric-grid weight: 1=small, 2=med, 3=wide, 4=hero. */
  gridSpan: 1 | 2 | 3 | 4;
  /** Image filename in `public/projects/{slug}/`. */
  images: string[];
  /** Optional Röntgen-Layer set, present only when `featured`. */
  layers?: ProjectLayer[];
}

const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  'oeffentlicher-raum': 'Öffentlicher Raum',
  geschaeftsbauten: 'Geschäftsbauten',
  privatbauten: 'Privatbauten',
  sonderbau: 'Sonderbau',
  stadtplanung: 'Stadtplanung',
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  realisiert: 'Realisiert',
  'in-planung': 'In Planung',
  'in-startphase': 'In Startphase',
  wettbewerb: 'Wettbewerb',
};

export function categoryLabel(c: ProjectCategory): string {
  return CATEGORY_LABEL[c];
}

export function statusLabel(s: ProjectStatus): string {
  return STATUS_LABEL[s];
}

/* ───────────────────────────────────────────────────────────────────────── */
/* The Five Featured Deep Dives — master prompt §6.3                         */
/* ───────────────────────────────────────────────────────────────────────── */

const westpark: Project = {
  slug: 'westpark-verbindungssteg',
  title: 'WestPark',
  subtitle: 'Verbindungssteg',
  year: '2020',
  location: 'Ingolstadt, Deutschland',
  countryCode: 'DE',
  category: 'oeffentlicher-raum',
  status: 'realisiert',
  summary:
    'Ein Steg, der mehr verbindet als zwei Ufer — Stadtteile, Generationen, Geh- und Fahrradlogiken. Vor dem Bauwerk stand das System.',
  featured: true,
  gridSpan: 4,
  images: ['01.avif', '02.avif', '03.avif'],
  layers: [
    {
      index: 0,
      name: 'Architektur',
      tagline: 'Was du siehst.',
      body: 'Ein 92 m langer Fußgänger- und Radsteg in Stahlfachwerk, schwebend über Bahntrasse und Schutter. Die sichtbare Form ist Schluss­folgerung, nicht Ausgangspunkt — gerippte Brüstung, austarierte Auflager, kein Pfeiler im Wasser.',
      data: [
        { label: 'Länge', value: '92 m' },
        { label: 'Spannweite', value: '54 m' },
        { label: 'Profil', value: 'Stahl­fachwerk' },
      ],
    },
    {
      index: 1,
      name: 'Tragstruktur',
      tagline: 'Was die Last trägt.',
      body: 'Ein Vierendeel-Träger als Hauptachse, gekreuzte Diagonalen für seitliche Stabilität, zwei Auflager links und rechts der Bahn. Die Statik diktiert die Geometrie — die schräge Brüstung ist nicht Dekor, sondern Aussteifung.',
      data: [
        { label: 'Eigenlast', value: '420 t' },
        { label: 'Verkehrslast', value: 'DIN 1072-A' },
        { label: 'Auflager', value: '2 × Wider­lager' },
      ],
    },
    {
      index: 2,
      name: 'Mobilität',
      tagline: 'Was sich bewegt.',
      body: 'Geteilte Fläche: 2,5 m Rad­spur, 1,8 m Fußgänger­band, klar getrennt. Anschluss an die Radschnell­verbindung Ingolstadt–Manching. Kreuzungsfrei über Bahn und Schutter — minus 4 min für jede Fahrt zwischen West und Zentrum.',
      data: [
        { label: 'Frequenz', value: '4 200 / Tag' },
        { label: 'Radspur', value: '2,5 m' },
        { label: 'Zeit­ersparnis', value: '−4 min' },
      ],
    },
    {
      index: 3,
      name: 'Sichtachsen',
      tagline: 'Was den Raum öffnet.',
      body: 'Aussichts­plattform mittig — Blick stromaufwärts zur Schutter­mündung, stromabwärts zum Klenze­park. Die Brüstungshöhe ist auf die Sitz­position abgestimmt; im Stehen rahmen die Gurte den Horizont, im Fahren verschwindet die Struktur peripher.',
      data: [
        { label: 'Brüstung', value: '1,30 m' },
        { label: 'Plattform­tiefe', value: '3,5 m' },
        { label: 'Sicht­winkel', value: '270°' },
      ],
    },
    {
      index: 4,
      name: 'Strukturplanung',
      tagline: 'Was den Konflikt löst.',
      body: 'Bahn AG wollte Schnell­bau, Anwohner wollten Lärmschutz, Stadt brauchte ein Klima-Statement, Radlobby drängte auf Vorrang. Die Strukturplanung verband alle vier zu einem Auflagen­katalog — der Steg ist die Materialisierung dieses Vertrags.',
      data: [
        { label: 'Stakeholder', value: '5 Gruppen' },
        { label: 'Vorlauf', value: '14 Monate' },
        { label: 'Konsens', value: '100 %' },
      ],
    },
  ],
};

const shanghaiPavillon: Project = {
  slug: 'shanghai-pavillion-of-innovation',
  title: 'Pavillon of Innovation',
  subtitle: 'Shanghai EXPO 2010',
  year: '2010',
  location: 'Shanghai, China',
  countryCode: 'CN',
  category: 'sonderbau',
  status: 'realisiert',
  summary:
    'Ein temporärer Welt­ausstellungs­pavillon, der die Idee „Better City, Better Life" als räumliche Erzählung übersetzte.',
  featured: true,
  gridSpan: 3,
  // Bilder noch nicht im Public-Folder (siehe MAPPING.md). Fallback: methode/strukturplan-diagram.avif.
  images: [],
  layers: [
    {
      index: 0,
      name: 'Architektur',
      tagline: 'Was du siehst.',
      body: 'Eine temporäre Hülle für 184 Tage Welt­ausstellung. Geschwungene Dachfläche aus recycelbarem Aluminium, transparente Polycarbonat-Membran, demontierbar in 28 Tagen. Form folgt Zeitlichkeit — nicht Dauer­haftigkeit war Programm, sondern Reversibilität.',
      data: [
        { label: 'Dauer', value: '184 Tage' },
        { label: 'Demontage', value: '28 Tage' },
        { label: 'Materialien', value: '94 % recycelt' },
      ],
    },
    {
      index: 1,
      name: 'Materialfluss',
      tagline: 'Was sich verbraucht.',
      body: 'Jedes Bauteil mit Pass: Herkunft, Lebens­zyklus, Re-Use-Adresse. 94 % der Trag­struktur ging nach Wuhan zurück, 6 % in die Forschung. Material­fluss als Architektur-Prinzip — Cradle-to-Cradle, bevor das Wort Marketing wurde.',
      data: [
        { label: 'Wiederverwertet', value: '94 %' },
        { label: 'Forschung', value: '6 %' },
        { label: 'CO₂-Bilanz', value: '−40 % vs. Standard' },
      ],
    },
    {
      index: 2,
      name: 'Programm',
      tagline: 'Was darin geschieht.',
      body: 'Tag 1: leere Halle. Tag 14: Eröffnung mit 12 000 Besuchern. Spitzentag: 38 000 Querungen, 4-Spuren-Wege­system mit gestaffelter Eintritts­logik. Ausstellung, Café, Bühne, Innovation-Lab — vier Zonen, ein Strom.',
      data: [
        { label: 'Spitzentag', value: '38 000' },
        { label: 'Ø / Tag', value: '21 400' },
        { label: 'Zonen', value: '4 × verflochten' },
      ],
    },
    {
      index: 3,
      name: 'Strukturplanung',
      tagline: 'Was den Konflikt löst.',
      body: 'Drei staatliche Akteure, zwei Universitäten, ein Privat­sponsor, ein deutsches Architektur­büro. Bachschuster moderierte die Schnitt­stellen, die Strukturplanung gab den Rahmen: Wer entscheidet, wer haftet, wer trägt nach 184 Tagen — und was bleibt.',
      data: [
        { label: 'Stakeholder', value: '7 Gruppen' },
        { label: 'Vorlauf', value: '22 Monate' },
        { label: 'Konsens', value: 'Vertrag 2008' },
      ],
    },
  ],
};

const mobilityHub: Project = {
  slug: 'mobility-hub-ingolstadt',
  title: 'Mobility Hub',
  subtitle: 'Ingolstadt',
  year: '2023',
  location: 'Ingolstadt, Deutschland',
  countryCode: 'DE',
  category: 'stadtplanung',
  status: 'in-planung',
  summary:
    'Ein Quartier, das Mobilität nicht als Anhängsel denkt, sondern als Rückgrat — Energie, Soziales, Logistik in einer Hülle.',
  featured: true,
  gridSpan: 3,
  images: ['01.avif', '02.avif', '03.avif'],
  layers: [
    {
      index: 0,
      name: 'Hülle',
      tagline: 'Was du siehst.',
      body: 'Sechs Geschosse, 32 m hoch, holz­basierter Hybridbau auf Tiefgarage. Die Fassade aus profilierten Aluminium-Lamellen filtert Lärm der B16 und reagiert auf Sonnenstand — heller Norden, geschlossener Süden. Bauwerk als Klimamembran, nicht als Statement.',
      data: [
        { label: 'Höhe', value: '32 m' },
        { label: 'Fläche', value: '14 200 m²' },
        { label: 'Konstruktion', value: 'Holz-Hybrid' },
      ],
    },
    {
      index: 1,
      name: 'Mobilitätsströme',
      tagline: 'Was sich bewegt.',
      body: 'Fünf Modi getrennt geführt und doch gekoppelt: 320 Stellplätze PKW, 80 E-Scooter, 240 Räder, eine Bus-Wende­schleife, ein Fußgänger-Plaza. Die Wechsel zwischen Modi sind das eigentliche Programm — 4 Minuten von Auto zu Bus.',
      data: [
        { label: 'PKW', value: '320' },
        { label: 'Räder', value: '240' },
        { label: 'Modus-Wechsel', value: 'Ø 4 min' },
      ],
    },
    {
      index: 2,
      name: 'Energiekonzept',
      tagline: 'Was die Stadt antreibt.',
      body: 'PV auf 2 800 m² Dach, Wärme­pumpe gekoppelt an die Grundwasser­schicht, Speicher­zelle im UG mit 800 kWh Kapazität. Netto positiv im Jahr — der Hub speist mehr ins Quartier ein als er entnimmt.',
      data: [
        { label: 'PV', value: '2 800 m²' },
        { label: 'Speicher', value: '800 kWh' },
        { label: 'Bilanz', value: '+12 % netto' },
      ],
    },
    {
      index: 3,
      name: 'Sozialer Raum',
      tagline: 'Was bleibt zwischen den Strömen.',
      body: 'Erdgeschoss als Quartiers­wohnzimmer: Café, Co-Working für 28 Plätze, Repair-Werkstatt, Kita-Auslauf. Nicht das Parken bezahlt das Gebäude — der soziale Sockel hält die Rentabilität.',
      data: [
        { label: 'Co-Working', value: '28 Plätze' },
        { label: 'Café', value: 'Ganztag' },
        { label: 'Quartier (500 m)', value: '+960 Bewohner' },
      ],
    },
    {
      index: 4,
      name: 'Strukturplanung',
      tagline: 'Was den Konflikt löst.',
      body: 'Stadt Ingolstadt + IFG + zwei Verkehrs­operator + Bürger­initiative + Klimarat. Sechs Stakeholder, ein gemeinsamer Auftrag: das Quartier nicht ersticken am Verkehr, sondern öffnen durch Mobilität.',
      data: [
        { label: 'Stakeholder', value: '6 Gruppen' },
        { label: 'Workshops', value: '14' },
        { label: 'Auflagen', value: '27 erfüllt' },
      ],
    },
  ],
};

const senFriedenszentrum: Project = {
  slug: 'sen-friedenszentrum-thai-binh',
  title: 'Sen Friedenszentrum',
  subtitle: 'Thái Bình',
  year: '2025',
  location: 'Thái Bình, Vietnam',
  countryCode: 'VN',
  category: 'sonderbau',
  status: 'in-startphase',
  summary:
    'Ein Ort der Erinnerung und der Versöhnung — sakrale Geometrie als Programm, nicht als Schmuck.',
  featured: true,
  gridSpan: 2,
  images: [],
  layers: [
    {
      index: 0,
      name: 'Symbolik',
      tagline: 'Was du verstehst.',
      body: 'Sen heißt Lotus. Drei Blüten­blätter als Grundriss­geometrie — Vergangenheit, Gegenwart, Zukunft. Der Lotus wächst aus dem Schlamm und bleibt rein: das Bild für das Friedens­zentrum als Ort der Versöhnung über drei Generationen Vietnam­krieg.',
      data: [
        { label: 'Blätter', value: '3 × 120°' },
        { label: 'Geste', value: 'Lotus' },
        { label: 'Achse', value: 'Nord / Süd' },
      ],
    },
    {
      index: 1,
      name: 'Sakrale Geometrie',
      tagline: 'Was Maß gibt.',
      body: 'Goldener Schnitt in Aufriss und Grundriss. Der zentrale Andachts­raum sitzt auf der Schwerpunkt­linie, die drei Blüten­blätter berühren sich tangential im Umkreis von 24 m. Maß­linien aus der traditionellen vietnamesischen Tempel­bau­lehre — und aus dem Cádence von Bach.',
      data: [
        { label: 'Umkreis', value: '24 m' },
        { label: 'Höhe', value: '16,8 m' },
        { label: 'Verhältnis', value: 'φ 1 : 1,618' },
      ],
    },
    {
      index: 2,
      name: 'Programmverflechtung',
      tagline: 'Was zusammenkommt.',
      body: 'Meditations­halle, Bibliothek, Memorial, vier Garten­höfe — kein Korridor, jeder Raum öffnet zwei. Die Programme verflechten sich, weil Versöhnung sich nicht räumlich segregieren lässt: Wer schweigt, sieht den Lesenden, wer liest, hört das Wasser.',
      data: [
        { label: 'Räume', value: '11' },
        { label: 'Höfe', value: '4' },
        { label: 'Übergänge', value: 'ohne Tür' },
      ],
    },
    {
      index: 3,
      name: 'Strukturplanung',
      tagline: 'Was den Konflikt löst.',
      body: 'Buddhistischer Sangha, vietnamesischer Staat, deutscher Versöhnungs­verein, UNESCO-Berater. Vier Sphären, die sich nicht von selbst sprechen — die Strukturplanung schuf das Protokoll: Wann betet wer, wann finanziert wer, wann führt wer.',
      data: [
        { label: 'Stakeholder', value: '4 Sphären' },
        { label: 'Protokolle', value: '37' },
        { label: 'Eröffnung', value: 'geplant 2027' },
      ],
    },
  ],
};

const vwHopeAcademy: Project = {
  slug: 'vw-hope-academy-suedafrika',
  title: 'VW Hope Academy',
  subtitle: 'Südafrika',
  year: '2006–2009',
  location: 'Pretoria-Region, Südafrika',
  countryCode: 'ZA',
  category: 'sonderbau',
  status: 'realisiert',
  summary:
    'Schule für talentierte Kinder aus benachteiligten Familien. Strukturplanung zwischen Industrie, Bildungs­ministerium und Gemeinden.',
  featured: true,
  gridSpan: 2,
  images: ['01.avif', '02.avif', '03.avif'],
  layers: [
    {
      index: 0,
      name: 'Architektur',
      tagline: 'Was du siehst.',
      body: 'Pavillon-Bauweise, fünf Trakt­häuser um einen Schul­hof, Backstein­wände in lokaler Brennweise, Holz­dächer mit Vor­dächern für die Subtropen-Sonne. Die Schule sieht aus wie eine Schule — und nicht wie ein Industrie­geschenk.',
      data: [
        { label: 'Trakte', value: '5' },
        { label: 'Schüler­plätze', value: '240' },
        { label: 'Baustoffe', value: '78 % lokal' },
      ],
    },
    {
      index: 1,
      name: 'Bildungsraum',
      tagline: 'Was lernen kann.',
      body: 'Klassen­räume mit Sicht­achse zum Hof. Musik­saal, Theater­bühne, drei Werk­stätten, Sporthalle für 12 Sport­arten. Das Programm bevorzugt Talent statt Note: musisch, motorisch, künstlerisch — Mathe und Lesen kommen mit.',
      data: [
        { label: 'Klassen­räume', value: '16' },
        { label: 'Werk­stätten', value: '3' },
        { label: 'Sport­arten', value: '12' },
      ],
    },
    {
      index: 2,
      name: 'Trägermodell',
      tagline: 'Was es ermöglicht.',
      body: 'Volkswagen Konzern­stiftung baut, südafrikanisches Bildungs­ministerium betreibt, lokale Community-Trust verwaltet das Stipendien­programm. Drei Träger, ein Mandat: 240 Plätze pro Jahr für Kinder ohne Schul­zugang.',
      data: [
        { label: 'Bauträger', value: 'VW-Stiftung' },
        { label: 'Betrieb', value: 'DBE' },
        { label: 'Stipendien', value: '240 / Jahr' },
      ],
    },
    {
      index: 3,
      name: 'Strukturplanung',
      tagline: 'Was den Konflikt löst.',
      body: 'Industrie + Staat + Gemeinde + Schul­leiter: vier Akteure, die in Südafrika 2006 nicht oft an einem Tisch saßen. Die Strukturplanung machte den Tisch möglich — das Schul­gebäude ist die Materialisierung des Tisch­gesprächs.',
      data: [
        { label: 'Stakeholder', value: '4 Gruppen' },
        { label: 'Vorlauf', value: '16 Monate' },
        { label: 'Eröffnung', value: '2009 fertig' },
      ],
    },
  ],
};

/* ───────────────────────────────────────────────────────────────────────── */
/* Catalog projects — index-grid only, no deep dive in W5/6.                 */
/* ───────────────────────────────────────────────────────────────────────── */

const catalog: Project[] = [
  {
    slug: 'kunst-kultur-donau-ingolstadt',
    title: 'Kunst und Kultur an der Donau',
    year: '2019',
    location: 'Ingolstadt',
    countryCode: 'DE',
    category: 'oeffentlicher-raum',
    status: 'realisiert',
    summary: 'Kultur­platz und Uferband — die Stadt findet zurück zum Wasser.',
    featured: false,
    gridSpan: 2,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'exhibition-center-chongming-shanghai',
    title: 'Exhibition Center Chongming Island',
    year: '2012',
    location: 'Shanghai, China',
    countryCode: 'CN',
    category: 'oeffentlicher-raum',
    status: 'realisiert',
    summary: 'Ausstellungs­halle auf der grünen Insel — Klima als Programm.',
    featured: false,
    gridSpan: 2,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'mobile-space-deutschlandjahr-indien',
    title: 'Mobile Space',
    subtitle: 'Deutschlandjahr Indien',
    year: '2012',
    location: 'Mumbai · Delhi · Pune',
    countryCode: 'IN',
    category: 'oeffentlicher-raum',
    status: 'realisiert',
    summary:
      'Reisender Pavillon, sechs Städte in 12 Monaten — Kultur­export als modulare Struktur.',
    featured: false,
    gridSpan: 2,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'vereinsgebaeude-ruderclub',
    title: 'Vereinsgebäude Ruderclub',
    year: '2023',
    location: 'Ingolstadt',
    countryCode: 'DE',
    category: 'oeffentlicher-raum',
    status: 'realisiert',
    summary: 'Boot­shaus am Donauufer — drei Generationen, ein Gebäude.',
    featured: false,
    gridSpan: 1,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'edeka-markt-eichenau',
    title: 'Edeka Markt Eichenau',
    year: '2019',
    location: 'Eichenau, Bayern',
    countryCode: 'DE',
    category: 'geschaeftsbauten',
    status: 'realisiert',
    summary: 'Holzkonstruktion mit Photovoltaik­dach — Nahversorgung trifft Klima­bilanz.',
    featured: false,
    gridSpan: 1,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'buero-entwicklung-ingolstadt-2022',
    title: 'Büro Entwicklung & Verwaltung',
    subtitle: 'LEED Gold',
    year: '2022',
    location: 'Ingolstadt',
    countryCode: 'DE',
    category: 'geschaeftsbauten',
    status: 'realisiert',
    summary: 'Verwaltungs­neubau in LEED-Gold — energetisch, sozial, geometrisch.',
    featured: false,
    gridSpan: 2,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'autohaus-dollnstein',
    title: 'Autohaus Dollnstein',
    year: '2000',
    location: 'Dollnstein, Bayern',
    countryCode: 'DE',
    category: 'geschaeftsbauten',
    status: 'realisiert',
    summary: 'Showroom und Werkstatt — Maßstab Altmühltal, Programm 2000.',
    featured: false,
    gridSpan: 1,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'forsthaus-bettbrunn',
    title: 'Forsthaus Bettbrunn',
    subtitle: 'Holzbau, −45 % Energie',
    year: '2023',
    location: 'Bettbrunn, Bayern',
    countryCode: 'DE',
    category: 'privatbauten',
    status: 'realisiert',
    summary: 'Wald­wohnhaus aus regionalem Holz — Energiebedarf halbiert.',
    featured: false,
    gridSpan: 2,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'einfamilienhaus-ingolstadt-2023',
    title: 'EFH Ingolstadt',
    subtitle: 'Heimkino · Spa · Weinkeller',
    year: '2023',
    location: 'Ingolstadt',
    countryCode: 'DE',
    category: 'privatbauten',
    status: 'realisiert',
    summary: 'Privatwohnhaus mit drei Untergeschossen — Programm verteilt sich vertikal.',
    featured: false,
    gridSpan: 1,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'einfamilienhaus-ingolstadt-2020',
    title: 'EFH Ingolstadt',
    year: '2020',
    location: 'Ingolstadt',
    countryCode: 'DE',
    category: 'privatbauten',
    status: 'realisiert',
    summary: 'Stadt­villa mit Innenhof — Privatheit im urbanen Raster.',
    featured: false,
    gridSpan: 1,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'einfamilienhaus-ingolstadt-2016',
    title: 'EFH Ingolstadt',
    year: '2016',
    location: 'Ingolstadt',
    countryCode: 'DE',
    category: 'privatbauten',
    status: 'realisiert',
    summary: 'Garten­seitig geöffnetes Haus — Sichtbeton, Eiche, Stille.',
    featured: false,
    gridSpan: 1,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'bebauungsplanung-log-homes-berlin',
    title: 'Bebauungsplanung Log Homes Berlin',
    subtitle: '32 ha',
    year: '2011–2015',
    location: 'Berlin',
    countryCode: 'DE',
    category: 'stadtplanung',
    status: 'realisiert',
    summary: 'Quartier­planung auf 32 ha — Holzbau in Serie, Mobilität in Quartiers­ketten.',
    featured: false,
    gridSpan: 2,
    images: ['01.avif', '02.avif', '03.avif'],
  },
  {
    slug: 'schwimmwettkampfarena-shandong',
    title: 'Wettbewerb Schwimm­wettkampfarena Shandong',
    year: '2008',
    location: 'Shandong, China',
    countryCode: 'CN',
    category: 'sonderbau',
    status: 'wettbewerb',
    summary: 'Sport­arena für regionale Meisterschaften — Tribüne und Becken in einer Geometrie.',
    featured: false,
    gridSpan: 1,
    images: ['01.avif', '02.avif', '03.avif'],
  },
];

/** Display order in the Werke-Index grid — featured first, then catalog by year desc. */
export const projects: Project[] = [
  westpark,
  shanghaiPavillon,
  mobilityHub,
  vwHopeAcademy,
  senFriedenszentrum,
  ...catalog,
];

export function findProject(slug: string | undefined): Project | undefined {
  if (!slug) return undefined;
  return projects.find((p) => p.slug === slug);
}

export const FILTERS: Array<{ id: 'all' | ProjectCategory; label: string }> = [
  { id: 'all', label: 'Alle' },
  { id: 'oeffentlicher-raum', label: 'Öffentlicher Raum' },
  { id: 'geschaeftsbauten', label: 'Geschäftsbauten' },
  { id: 'privatbauten', label: 'Privatbauten' },
  { id: 'sonderbau', label: 'Sonderbau' },
  { id: 'stadtplanung', label: 'Stadtplanung' },
];
