# Review-Log – Verbindungen Rhein-Main (IDEA-023)

Neueste oben. Dient für Nachprüfungen, ohne Diffs erneut abzurufen.

## Gesamt-Review (kein PR) – Code-Stand `main`
- Datum: 2026-11-15 · Geprüfter Stand: `e7ebfdd` (index.html, sw.js, worker/worker.js, start-verbindungen.bat)
- Empfehlung: 🟡 nutzbar; die drei wichtigen Befunde sind behoben (Test lokal im Browser, 2026-11-15), offen sind nur 🔵-Punkte
- Offene Befunde:
  - [x] 🟠 `index.html` `search()`: kein Schutz gegen parallele Läufe (doppelte oder gemischte Liste). Behoben am 2026-11-15: Laufnummer `state.searchSeq`, veraltete Antworten werden verworfen.
  - [x] 🟠 `worker/worker.js`: Herkunftsprüfung per curl fälschbar, kein Rate-Limit. Entschärft am 2026-11-15: Grenze von 40 Anfragen je IP und Minute im Worker (einfacher Schutz im Arbeitsspeicher). Der Worker muss noch bei Cloudflare neu eingespielt werden.
  - [x] 🟠 `index.html` Stop-ID mit Feed-Namen `…Reference-Data-2026…`. Behoben am 2026-11-15: bei 4xx sucht `refreshPlace()` die Haltestelle über den Namen neu und speichert die neue ID in Favoriten und Stationen.
  - Kein Befund (Entscheidung Nico, 2026-11-15): „Direkt ab“ holt nur 200 Ankünfte rückwärts ab Start+150 min. Das ist bewusst nur ein Fallback für Fahrten, die der Routenplaner nicht zeigt; an großen Zielen darf der Kasten leer bleiben.
  - [ ] 🔵 `index.html:521`: `await rmvMessages` vor der Anzeige; hängt der Worker, erscheinen die Verbindungen bis zu 8 s später.
  - [ ] 🔵 `index.html:505`: leeres Zeitfeld bei „Ab“/„An“ → `toISOString()` wirft vor dem `try`, Tipp auf „Suchen“ tut scheinbar nichts.
  - [ ] 🔵 `index.html:560-622`: „Direkt ab“ und „Alle Abfahrten“ ignorieren „Nur Deutschlandticket“ (ICE erscheint, ggf. als „neu“).
  - [ ] 🔵 `index.html:535`: Minuten-Aktualisierung läuft bei verstecktem Tab weiter und endet nach einem Fehler oder nach „Spätere Verbindungen“.
- Geprüft ohne Befund: alle `innerHTML`-Stellen laufen durch `esc()`/`htmlToText()`; `accessId` aus der Anfrage wird im Worker verworfen; kein Schlüssel im Repo.
- Nach IMPROVEMENTS.md verschoben: I-001 bis I-007
