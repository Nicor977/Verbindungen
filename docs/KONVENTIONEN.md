# Konventionen – Verbindungen Rhein-Main (IDEA-023)

Stand: 2026-11-15

## Tech-Stack
- Sprache/Version: HTML, CSS, JavaScript (ES2020+, `async/await`, Module-Syntax nur im Worker), kein TypeScript
- Frameworks: keine; kein Build-Schritt, keine npm-Abhängigkeiten
- Datenbank: keine; Gerätespeicher `localStorage`
- Laufzeit: Browser (PWA mit Service Worker), Cloudflare Workers für den RMV-Proxy
- Build/CI: keine CI; Auslieferung direkt über GitHub Pages aus `main`

## Automatisch geprüft (nicht im Review anmerken)
- Linter/Formatter: keiner eingerichtet
- Typprüfung: keine

## Regeln
- Fehlerbehandlung: Ausfälle von RMV dürfen die App nicht blockieren (App läuft ohne Meldungen weiter). Fehler von Transitous werden dem Nutzer als Text gezeigt.
- Sicherheit: Keine Schlüssel im Code oder Repo. Der RMV-Schlüssel liegt nur als Cloudflare-Secret `RMV_KEY`. Neue RMV-Dienste nur bewusst in `ERLAUBTE_DIENSTE` aufnehmen.
- Ausgabe: Alle Fremdtexte vor `innerHTML` durch `esc()` (bzw. `htmlToText()` für RMV-HTML).
- Speicher: Zugriffe auf `localStorage` nur über `load()`/`save()` (mit try/catch).
- Benennung/Struktur: Kommentare, UI-Texte und Teile der Bezeichner auf Deutsch (z. B. `ERLAUBTE_DIENSTE`, `kopf`). Alles in `index.html`, Abschnitte mit `// ---------- … ----------` getrennt.
- Service Worker: Bei Änderungen an der Liste `SHELL` oder an der Cache-Strategie den Cache-Namen hochzählen.
- Zeiten: Immer in `Europe/Berlin` (`TZ`) anzeigen.
- GitHub: Änderungen eines Arbeitstags nur lokal committen und als Bundle sichern; Push und EIN Pull Request erst, wenn Nico sagt, dass für heute Schluss ist.

## Tests
- Framework: keines; keine automatisierten Tests
- Erwartung: Änderungen manuell im Browser prüfen (lokal mit `start-verbindungen.bat` unter `http://localhost:8765`, das ist auch im Worker als Herkunft erlaubt). Bei Logikänderungen an Zeiten oder RMV-Zuordnung konkrete Testverbindungen nennen (z. B. Hattersheim → Frankfurt Hbf).

## Bewusste Ausnahmen
- Alles in einer Datei `index.html` ohne Build und ohne Framework (einfaches Hosting auf GitHub Pages).
- Keine automatisierten Tests und kein Linter.
- Deutsche Bezeichner und Kommentare.
- Transitous wird direkt aus dem Browser abgefragt; ein eigener User-Agent lässt sich dort nicht setzen.
- „Nur Deutschlandticket“ berücksichtigt keine IC-Sonderfreigaben (steht so im README).
