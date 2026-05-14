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
      body: 'Folge in W6.',
    },
    { index: 1, name: 'Materialfluss', tagline: 'Was sich verbraucht.', body: 'Folge in W6.' },
    { index: 2, name: 'Programm', tagline: 'Was darin geschieht.', body: 'Folge in W6.' },
    { index: 3, name: 'Strukturplanung', tagline: 'Was den Konflikt löst.', body: 'Folge in W6.' },
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
    { index: 0, name: 'Hülle', tagline: 'Was du siehst.', body: 'Folge in W6.' },
    {
      index: 1,
      name: 'Mobilitätsströme',
      tagline: 'Was sich bewegt.',
      body: 'Folge in W6.',
    },
    {
      index: 2,
      name: 'Energiekonzept',
      tagline: 'Was die Stadt antreibt.',
      body: 'Folge in W6.',
    },
    {
      index: 3,
      name: 'Sozialer Raum',
      tagline: 'Was bleibt zwischen den Strömen.',
      body: 'Folge in W6.',
    },
    {
      index: 4,
      name: 'Strukturplanung',
      tagline: 'Was den Konflikt löst.',
      body: 'Folge in W6.',
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
    { index: 0, name: 'Symbolik', tagline: 'Was du verstehst.', body: 'Folge in W6.' },
    { index: 1, name: 'Sakrale Geometrie', tagline: 'Was Maß gibt.', body: 'Folge in W6.' },
    {
      index: 2,
      name: 'Programmverflechtung',
      tagline: 'Was zusammenkommt.',
      body: 'Folge in W6.',
    },
    { index: 3, name: 'Strukturplanung', tagline: 'Was den Konflikt löst.', body: 'Folge in W6.' },
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
    { index: 0, name: 'Architektur', tagline: 'Was du siehst.', body: 'Folge in W6.' },
    { index: 1, name: 'Bildungsraum', tagline: 'Was lernen kann.', body: 'Folge in W6.' },
    { index: 2, name: 'Trägermodell', tagline: 'Was es ermöglicht.', body: 'Folge in W6.' },
    { index: 3, name: 'Strukturplanung', tagline: 'Was den Konflikt löst.', body: 'Folge in W6.' },
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
