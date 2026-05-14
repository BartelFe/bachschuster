# Projekt-Bild-Mapping

Quelle: 50 AVIF-Thumbnails (311×233, eines mit 474×375) aus dem `tsimg.cloud`-CDN
von bachschuster.de. Felix hat sie initial in `public/` gedroppt.

Strategie: Cross-Referenz mit den Bildhash-URLs auf der **Architektur-Seite**
(https://bachschuster.de/architektur) und den jeweiligen Projekt-Galerien.

Methodik:
1. Raw HTML von `/architektur` gefetched
2. Aller 40-stelligen Hex-Hashes per Regex extrahiert (= Cover-Images, 18 Projekte)
3. WebFetch mit LLM zusätzlich für die Gallery-Hashes pro Projekt (3 weitere pro Projekt)
4. Meine AVIFs gegen die Gallery-Hashes gematcht — **36 von 50 zuordbar**

## Was wo liegt

| Slug | Projekt | Bilder | Hinweise |
|---|---|---|---|
| `westpark-verbindungssteg/` | WestPark Verbindungssteg (Ingolstadt, 2021) | 3 | **Master-Prompt-Projekt #1.** Cover (`b754f945…`) fehlt. |
| `exhibition-center-chongming-shanghai/` | Exhibition Center Resort Chongming Island Shanghai (2012/2013) | 3 | Cover (`f07010d0…`) fehlt. |
| `mobile-space-deutschlandjahr-indien/` | Mobile Space — Deutschlandjahr Indien (2012/2013) | 3 | Cover (`af821fff…`) fehlt. |
| `kunst-kultur-donau-ingolstadt/` | Kunst und Kultur an der Donau (Ingolstadt, 2019) | 3 | Cover (`bb54ad7f…`) fehlt. |
| `vereinsgebaeude-ruderclub/` | Vereinsgebäude Ruderclub (2023) | 3 | Cover (`8e29a8f5…`) fehlt. |
| `edeka-markt-eichenau/` | Edeka Markt Eichenau (2019) | 3 | Cover (`cf560655…`) fehlt. |
| `buero-entwicklung-ingolstadt-2022/` | Büro-/Entwicklungs-/Verwaltungsgebäude (Ingolstadt, 2022, LEED Gold) | 3 | Cover (`fe97d28e…`) fehlt. |
| `autohaus-dollnstein/` | Autohaus Dollnstein (2000) | 3 | Cover (`405f6b9e…`) fehlt. |
| `forsthaus-bettbrunn/` | Forsthaus Bettbrunn (2023, Holzbau, –45 % Energie) | 3 | Cover (`744e6e70…`) fehlt. |
| `einfamilienhaus-ingolstadt-2023/` | Einfamilienhaus Ingolstadt 2023 (Heimkino, Spa, Weinkeller) | 3 | Cover (`8aba2321…`) fehlt. |
| `einfamilienhaus-ingolstadt-2020/` | Einfamilienhaus Ingolstadt 2020 | 3 | Cover (`3d01377a…`) fehlt. |
| `einfamilienhaus-ingolstadt-2016/` | Einfamilienhaus Ingolstadt 2016 | 3 | Cover (`c295041e…`) fehlt. |
| `_unsorted/` | 13 unsortierte Bilder | 13 | s.u. |

## Verbleibende 13 unsortierte Hashes

Wahrscheinlich aus diesen sechs Projekten (deren Galerien wir nicht
vollständig parsen konnten):

- Einfamilienhaus Kirchdorf (2015) — 340 m² Hanggrundstück, Licht/Wasser-Elemente
- Bürogebäude Ingolstadt (2014) — fünfgeschossig, 2 750 m², Kammstruktur
- Büro- und Verwaltungszentrale Ingolstadt (2005) — –50 % Energie, PV + GW-Wärmepumpe
- Expo Pavillon Shanghai (2010) — **Master-Prompt-Projekt #2** „Pavillion of Innovation"
- Architektonische Präsentation Automobil-Markteinführung (2009)
- Wettbewerb Schwimmwettkampfarena Shandong (2008)

Eine Sonderform: **`cd81eec69e…_w474-h375-cc.avif`** ist mit 474×375 px größer
als die anderen — wirkt wie ein Hero-Banner, nicht wie ein Galerie-Thumbnail.
Vermutlich der Visual für eines der Projekte oben.

### Felix — Manuelle Sortierung der 13

Schnellster Weg: starte `pnpm dev`, öffne `http://localhost:5173/_unsorted.html`
(sobald wir die Helper-Page gebaut haben — passiert in Block 4 dieser Session
oder zu Beginn von W2). Dort werden alle 13 Thumbnails als Grid angezeigt,
du wählst per Dropdown die Projekt-Zuordnung, klickst Export → bekommst eine
Shell-Move-Liste die ich ausführe.

Falls du jetzt schon manuell willst: kopiere die Dateien selbst aus
`public/projects/_unsorted/` in die richtigen Projektordner.

## Master-Prompt-Projekte vs. bachschuster.de

Der Master-Prompt §6.3 spezifiziert vier Deep-Dive-Projekte für die Pitch-v1:

| Master-Prompt-Slug | Bachschuster.de-Pendant | Bild-Lage |
|---|---|---|
| `westpark` | WestPark Verbindungssteg (2021) | 3 Galerie-Bilder ✓, Cover fehlt |
| `shanghai-pavillion-of-innovation` | Expo Pavillon Shanghai (2010) | Cover bekannt, Galerie evtl. in `_unsorted/` |
| `mobility-hub` | Mobility Hub Ingolstadt (auf Homepage, **nicht** in /architektur) | **Keine Bilder in den 50 AVIFs** |
| `sen-friedenszentrum` | Sen Peace Center Thái Bình (auf Homepage, **nicht** in /architektur) | **Keine Bilder in den 50 AVIFs** |

→ Für W5–W6 (die Project Deep Dives) brauchen wir **Mobility Hub** und
**Sen Friedenszentrum** Bilder separat. Plus die Cover für die 12 sortierten.

## Auflösung-Limit

Alle AVIFs sind **311×233 px** (das eine 474×375 px), das sind
CDN-Thumbnails. Für Hero-Sektionen und Röntgen-Scroll brauchen wir
**Full-Res-Originale** — typischerweise 2 000–3 000 px Breite.
Felix sollte die jeweiligen Originale aus dem Drive-Ordner exportieren wenn
ein Projekt im Werke-Deep-Dive an die Reihe kommt (W5 für WestPark, W6 für
die anderen drei).

---

*Mapping erstellt: 2026-05-14 (W1), automatisch via WebFetch + Grep auf
bachschuster.de/architektur. Stand der Quell-Site: Mai 2026.*
