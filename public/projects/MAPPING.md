# Projekt-Bild-Mapping

**Stand: 2026-05-14 (W1, Block 5).** 50 AVIF-Thumbnails (311×233, eine in 474×375)
aus dem bachschuster.de-Bild-CDN sind jetzt vollständig auf 16 Projekte +
ein generisches Methode-Asset + ein Logo verteilt.

## Quellen

Die Bilder stammen aus zwei verschiedenen Bereichen auf bachschuster.de:

1. **`/architektur`** — 18 Architektur-Projekte in den Kategorien Privatbauten,
   Geschäftsbauten und Öffentlicher Raum. **Auto-Match per Hash:** 36 von 50
   Bildern für 12 Projekte.
2. **`/strukturplanung`** (Tab „Projekte") — 5+ Strukturplanungs-Projekte.
   **Manuelle Zuordnung durch Felix:** 12 Bilder für 4 Projekte. Plus
   ein eigenständiges Strukturplan-Diagramm (kein Projekt).

Insgesamt **16 Projekte mit je 3 Galerie-Bildern**. Die Cover-Hero-Bilder
(eines pro Projekt) sind in diesem Batch jeweils noch nicht enthalten.

## Master-Prompt-Projekte (§6.3) — Bilder-Status

| Master-Prompt-Projekt | Folder | Bilder | Status |
|---|---|---|---|
| WestPark Verbindungssteg | `westpark-verbindungssteg/` | 3 ✓ | Cover fehlt |
| Pavillion of Innovation (Shanghai EXPO 2010) | — | **0** | komplett fehlend |
| **Mobility Hub Ingolstadt** | `mobility-hub-ingolstadt/` | 3 ✓ | **NEU verfügbar dank Felix' Sort** |
| Sen Friedenszentrum Thái Bình | — | **0** | komplett fehlend |
| 5. Projekt (Felix-Wahl, idealerweise Johannesburg/Dubai/Indien/Brasilien) | `vw-hope-academy-suedafrika/` oder `mobile-space-deutschlandjahr-indien/` | 3 ✓ | **Beide Kandidaten verfügbar** |

→ Für W2-Hero brauchen wir keine Projekt-Bilder (Particle-System ist abstrakt).
→ Für W5 (Werke Index + WestPark Deep Dive) reicht der Bestand teilweise.
→ Für W6 (Shanghai Pavillon + Sen Friedenszentrum Deep Dive): **kritische Lücke**.

## Komplette Folder-Liste

### Aus `/architektur` (Auto-Match per Hash)

| Slug | Projekt | Jahr | Kategorie |
|---|---|---|---|
| `westpark-verbindungssteg` | WestPark Verbindungssteg | 2021 | Öffentlicher Raum |
| `kunst-kultur-donau-ingolstadt` | Kunst und Kultur an der Donau | 2019 | Öffentlicher Raum |
| `exhibition-center-chongming-shanghai` | Exhibition Center Chongming Island | 2012/2013 | Öffentlicher Raum |
| `mobile-space-deutschlandjahr-indien` | Mobile Space — Deutschlandjahr Indien | 2012/2013 | Öffentlicher Raum |
| `vereinsgebaeude-ruderclub` | Vereinsgebäude Ruderclub | 2023 | Öffentlicher Raum |
| `edeka-markt-eichenau` | Edeka Markt Eichenau | 2019 | Geschäftsbauten |
| `buero-entwicklung-ingolstadt-2022` | Büro/Entwicklung/Verwaltung Ingolstadt (LEED Gold) | 2022 | Geschäftsbauten |
| `autohaus-dollnstein` | Autohaus Dollnstein | 2000 | Geschäftsbauten |
| `forsthaus-bettbrunn` | Forsthaus Bettbrunn (Holzbau, –45 % Energie) | 2023 | Privatbauten |
| `einfamilienhaus-ingolstadt-2023` | EFH Ingolstadt (Heimkino, Spa, Weinkeller) | 2023 | Privatbauten |
| `einfamilienhaus-ingolstadt-2020` | EFH Ingolstadt | 2020 | Privatbauten |
| `einfamilienhaus-ingolstadt-2016` | EFH Ingolstadt | 2016 | Privatbauten |

### Aus `/strukturplanung` (manuelle Felix-Zuordnung)

| Slug | Projekt | Jahr | Kontinent |
|---|---|---|---|
| `mobility-hub-ingolstadt` | Mobility Hub Ingolstadt | 2020 | Europa |
| `bebauungsplanung-log-homes-berlin` | Bebauungsplanung Log Homes Berlin (32 ha) | 2011–2015 | Europa |
| `vw-hope-academy-suedafrika` | VW Hope Academy Südafrika | 2006–2009 | **Afrika** |
| `schwimmwettkampfarena-shandong` | Wettbewerb Schwimmwettkampfarena Shandong | 2008 | **Asien** |

### Weitere Drive-Assets (nicht in `public/projects/`)

| Pfad | Bild | Verwendung |
|---|---|---|
| `public/brand/logo.avif` | Bachschuster-Logo | Header (W2) |
| `public/methode/strukturplan-diagram.avif` | Generisches Strukturplan-Diagramm | Methode-Sektion (W4) — kann als Sub-Element neben dem Force-Graph dienen |

## Datei-Schema pro Projekt-Folder

```
public/projects/{slug}/
├── 01.avif      ← erste Galerie-Aufnahme
├── 02.avif      ← zweite Galerie-Aufnahme
└── 03.avif      ← dritte Galerie-Aufnahme
```

VW Hope Academy hat in den Original-Dateinamen `_1` und `_3` (kein `_2`),
wurde aber für sauberes Numbering auf `01/02/03` normalisiert.

## Auflösungs-Limit

Alle Bilder sind **311×233 px CDN-Thumbnails**. Brauchbar für:
- ✓ Werke-Index-Grid-Cards (W5) — perfekte Größe
- ✓ Hover-Previews und kleine Embeds
- ✗ Hero-Sektionen und Röntgen-Scroll (W5–W6) — **brauchen Full-Res 2000–3000 px**

→ Für Deep Dives in W5–W6 bitte rechtzeitig die Originale aus dem Drive
beschaffen und in den jeweiligen Projektordner kopieren. Empfehlung:
parallel `original/` Subfolder, z.B. `westpark-verbindungssteg/original/01.jpg`.

## Was noch fehlt

- [ ] **Sen Friedenszentrum Thái Bình** — komplett, Master-Prompt-Projekt §6.3 #4
- [ ] **Shanghai Pavillion of Innovation (EXPO 2010)** — komplett, Master-Prompt-Projekt §6.3 #2
- [ ] **Cover-Hero-Bilder** für alle 16 Projekte (1 pro Projekt, Format 16:9 oder 4:3 für die Index-Grid-Cards)
- [ ] **Full-Res-Originale** für mindestens die 4 Master-Prompt-Deep-Dives (WestPark, Shanghai, Mobility Hub, Sen)
- [ ] **Peter-Bachschuster-Portrait** für Team-Sektion (W8)
- [ ] **Field-Recordings** pro Sektion (W3+) — Stock-Quellen falls keine Originale vorhanden
