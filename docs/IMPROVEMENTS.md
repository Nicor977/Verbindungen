# Verbesserungen – Verbindungen Rhein-Main (IDEA-023)

Punkte aus Reviews, die keinen PR blockieren. Neueste oben.
Priorität: H = hoch · M = mittel · N = niedrig

## Offen
| ID | Prio | Bereich | Beschreibung | Gefunden in | Aufwand |
|---|---|---|---|---|---|
| I-007 | N | `index.html` (`setMode`, `search`) | Zeitfeld „Ab/An“ wird in der Zeitzone des Geräts gelesen, nicht in Europe/Berlin (nur im Ausland relevant) | Gesamt-Review, 2026-11-15 | S |
| I-006 | N | `index.html` (`search`) | Fehlertext nennt immer „Internetverbindung prüfen“, auch bei Serverfehlern (4xx/5xx) | Gesamt-Review, 2026-11-15 | S |
| I-005 | N | `sw.js` | `cache.put` ohne `e.waitUntil`; der Browser kann den Worker beenden, bevor die neue Fassung gespeichert ist | Gesamt-Review, 2026-11-15 | S |
| I-004 | N | `start-verbindungen.bat` | `http.server` lauscht auf allen Netzwerkkarten; `--bind 127.0.0.1` beschränkt auf den eigenen PC | Gesamt-Review, 2026-11-15 | S |
| I-003 | M | `index.html` (`search`) | Minuten-Aktualisierung: bei verstecktem Tab pausieren, nach Fehler und nach „Spätere Verbindungen“ wieder aufnehmen | Gesamt-Review, 2026-11-15 | S |
| I-002 | M | `index.html` (`renderDirect`, `renderAllDeps`) | „Nur Deutschlandticket“ auch auf „Direkt ab“ und „Alle Abfahrten“ anwenden (nach `mode` filtern) | Gesamt-Review, 2026-11-15 | S |
| I-001 | M | `index.html` (`search`) | RMV-Abfrage nicht abwarten: Verbindungen sofort zeigen, Meldungen und RMV-Echtzeit nachträglich einblenden | Gesamt-Review, 2026-11-15 | M |

## Erledigt
| ID | Erledigt durch | Datum |
|---|---|---|
