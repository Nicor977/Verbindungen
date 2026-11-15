# Architektur – Verbindungen Rhein-Main (IDEA-023)

Stand: 2026-11-15 · Quelle: GitHub `Nicor977/Verbindungen`, Branch `main`, Commit `e7ebfdd`
Nicht belegte Angaben sind mit (unverifiziert) markiert.

## Zweck
Handy-Web-App (PWA) für ÖPNV-Verbindungen im Rhein-Main-Gebiet. Favoriten-Strecken
mit einem Tipp, Echtzeit-Verspätungen, Abfahrten an der Starthaltestelle und
offizielle RMV-Störungsmeldungen (z. B. Ersatzverkehr). Für den privaten Gebrauch.

## Überblick
```
Handy-Browser (index.html, PWA)
   ├── direkt ──────────────► Transitous API (api.transitous.org, ohne Schlüssel)
   │                           Verbindungen, Haltestellensuche, Abfahrten, Echtzeit
   └── fetch ─► Cloudflare Worker (rmv-proxy…workers.dev) ─► RMV HAPI (www.rmv.de/hapi)
                 Secret RMV_KEY, nur Lese-Dienste, nur eigene Herkunft
sw.js: speichert nur die App-Hülle (offline-Start), Daten immer frisch aus dem Netz
```
Kein eigener Server, keine Datenbank. Hosting: GitHub Pages (`main`, Root).

## Module
| Pfad | Verantwortung | Abhängig von |
|---|---|---|
| `index.html` | Gesamte App: HTML, CSS und JavaScript in einer Datei (~750 Zeilen). Suche, Favoriten, Darstellung, RMV-Abgleich | Transitous API, RMV-Proxy, localStorage |
| `sw.js` | Service Worker: App-Hülle cachen (`verbindungen-v2`), network-first mit `cache: "no-cache"` | – |
| `manifest.webmanifest`, `icon*.png`, `icon.svg` | PWA-Metadaten und Icons („Zum Home-Bildschirm“) | – |
| `worker/worker.js` | Cloudflare Worker als RMV-Proxy: CORS, Whitelist der Dienste, Schlüssel anhängen | Cloudflare, RMV HAPI |
| `start-verbindungen.bat` | Lokaler Start unter Windows: entpackt ggf. Zip, startet `python -m http.server 8765` | Python |
| `README.md` | Bedienung und Hosting | – |

## Datenfluss
1. Nutzer wählt Von/Nach (Haltestellensuche über Transitous) oder tippt eine Favoriten-Strecke.
2. `search()` → `api()` → Transitous `/plan` (Modi bei „Nur Deutschlandticket“ auf `DTICKET_MODES` beschränkt).
3. Parallel: `rmvMessages()` / `rmvTrip()` → Worker `/trip` mit Koordinaten → RMV-Meldungen je Abschnitt, per Linie zugeordnet; `applyRmvRealtime()` ergänzt Verspätungen, wo Transitous keine Echtzeit hat.
4. Zusätzlich: abgefahrene Verbindungen (`renderPast`), direkte Fahrten (`renderDirect`) und alle Abfahrten (`departures`, `renderAllDeps`).
5. Ausgabe als HTML-Strings über `innerHTML`; Fremdtexte laufen durch `esc()`.
6. Favoriten und Einstellungen in `localStorage` (`favs`, `stations`, Umsteigezeit u. a.).

## Externe Abhängigkeiten
| System/Dienst | Wofür | Wo im Code |
|---|---|---|
| Transitous (MOTIS 2), `https://api.transitous.org/api` | Verbindungen, Haltestellen, Abfahrten, Echtzeit. Nur nicht kommerziell/Open Source, Quellenangabe nötig | `index.html`: `API`, `api()` |
| RMV HAPI über Cloudflare Worker `https://rmv-proxy.nico-regente-projekte.workers.dev` | Störungsmeldungen, Echtzeit-Ergänzung | `index.html`: `RMV_PROXY`, `rmvTrip()`; `worker/worker.js` |
| GitHub Pages | Hosting `https://nicor977.github.io/Verbindungen/` | Repo-Einstellungen |

## Kritische Bereiche (beim Review besonders genau prüfen)
- `worker/worker.js`: Schlüssel-Schutz (`RMV_KEY` nur als Secret, `accessId` aus der Anfrage wird verworfen), Whitelist `ERLAUBTE_DIENSTE` und `ERLAUBTE_HERKUNFT`. Jede Lockerung kann den Schlüssel für Dritte nutzbar machen.
- `index.html`, alle `innerHTML`-Stellen (13): Texte aus Transitous/RMV müssen durch `esc()` bzw. `htmlToText()` laufen (XSS).
- `index.html`, Zeit- und Zeitzonenlogik (`berlinParts`, `hm`, `minutes`, `TZ`): Fehler wirken sich auf alle angezeigten Zeiten aus, besonders um Mitternacht und bei Zeitumstellung.
- `index.html`, Zuordnung RMV ↔ Transitous (`rmvForLeg`, `applyRmvRealtime`, `tripKey`): falsche Zuordnung zeigt falsche Verspätungen oder Meldungen.
- `sw.js`: Cache-Name und Strategie entscheiden, ob Updates beim Nutzer ankommen.

## Offene Fragen
- Es gibt keine Versions-Tags und kein Changelog; die einzige Versionsmarke ist der Cache-Name `verbindungen-v2` in `sw.js`.
- Branches `rmv-worker` und `rmv-probe` liegen noch auf GitHub; ob sie vollständig in `main` aufgegangen sind, ist (unverifiziert).
- Wie der Worker deployt wird (Dashboard oder Wrangler), ist im Repo nicht beschrieben (unverifiziert).
