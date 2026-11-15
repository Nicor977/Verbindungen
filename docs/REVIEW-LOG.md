# Review-Log – Verbindungen Rhein-Main (IDEA-023)

Neueste oben. Dient für Nachprüfungen, ohne Diffs erneut abzurufen.

## Gesamt-Review (kein PR) – Code-Stand `main`
- Datum: 2026-11-15 · Geprüfter Stand: `e7ebfdd` (index.html, sw.js, worker/worker.js, start-verbindungen.bat)
- Empfehlung: 🟡 nutzbar, vier wichtige Befunde offen
- Offene Befunde:
  - [ ] 🟠 `index.html:496-535`: `search()` ohne Schutz gegen parallele Läufe. Zwei Suchen kurz nacheinander (Favorit A, dann B; oder Rückkehr zur App: `visibilitychange` + fälliger Timer) hängen beide ihre Ergebnisse an → doppelte oder gemischte Liste, `state.rmv` der falschen Strecke.
  - [ ] 🟠 `index.html:567`: „Direkt ab“ holt 200 Ankünfte rückwärts ab Start+150 min. An großen Zielen reicht das nicht bis zur Startzeit zurück (Test 2026-11-15, Frankfurt Hbf: 201 Ankünfte decken nur Start+71 bis +150 min) → Kasten leer, „fährt zum Ziel“ fehlt.
  - [ ] 🟠 `worker/worker.js:33`: Herkunftsprüfung nur über den `Origin`-Header, per curl fälschbar; kein Rate-Limit. Schlüssel bleibt geheim, das RMV-Kontingent ist aber für Dritte nutzbar.
  - [ ] 🟠 `index.html:223,225,407`: Stop-ID mit Feed-Namen `…Reference-Data-2026…` fest im Code und in gespeicherten Favoriten. Benennt Transitous den Feed um (unverifiziert, Jahreszahl legt es nahe), schlagen alle Suchen mit dieser ID fehl.
  - [ ] 🔵 `index.html:521`: `await rmvMessages` vor der Anzeige; hängt der Worker, erscheinen die Verbindungen bis zu 8 s später.
  - [ ] 🔵 `index.html:505`: leeres Zeitfeld bei „Ab“/„An“ → `toISOString()` wirft vor dem `try`, Tipp auf „Suchen“ tut scheinbar nichts.
  - [ ] 🔵 `index.html:560-622`: „Direkt ab“ und „Alle Abfahrten“ ignorieren „Nur Deutschlandticket“ (ICE erscheint, ggf. als „neu“).
  - [ ] 🔵 `index.html:535`: Minuten-Aktualisierung läuft bei verstecktem Tab weiter und endet nach einem Fehler oder nach „Spätere Verbindungen“.
- Geprüft ohne Befund: alle `innerHTML`-Stellen laufen durch `esc()`/`htmlToText()`; `accessId` aus der Anfrage wird im Worker verworfen; kein Schlüssel im Repo.
- Nach IMPROVEMENTS.md verschoben: I-001 bis I-007
