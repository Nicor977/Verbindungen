# Verbindungen Rhein-Main (IDEA-023)

Kleine Web-App fürs Handy: ÖPNV-Verbindungen suchen, Favoriten-Strecken mit einem Tipp, Echtzeit und Hinweise auf Ersatzverkehr.
Läuft komplett im Browser und fragt direkt die [Transitous](https://transitous.org)-API ab (kein Server, kein API-Schlüssel).

## Favoriten
- **Stationen:** Beim Tippen ins Von- oder Nach-Feld erscheinen „Meine Stationen“. Mit ☆ in der Vorschlagsliste merkst du eine Station, mit ★ entfernst du sie.
- **Strecken:** Von und Nach wählen, dann „☆ Strecke merken“. Strecken stehen oben als Knöpfe; zweimal auf × tippen entfernt sie.

## Umsteigezeit
Im Feld „Umst.“ legst du fest, wie viele Minuten ein Umstieg mindestens dauern soll. Die Einstellung wird gemerkt.

## Deutschlandticket
„Nur Deutschlandticket“ (standardmäßig an) blendet Fernverkehr (ICE/IC/EC) und Fernbusse aus. Sonderfälle, in denen einzelne IC-Abschnitte mit dem Deutschlandticket erlaubt sind, werden nicht berücksichtigt.

## RMV-Meldungen
Die App holt zusätzlich die offiziellen RMV-Störungsmeldungen (z. B. „Busse statt Bahnen“) für die gesuchte Strecke. Weil die RMV-API keine Abfragen direkt aus dem Browser erlaubt und der Schlüssel geheim bleiben muss, läuft das über einen kleinen Cloudflare Worker (`worker/worker.js`). Der Schlüssel liegt dort als Secret `RMV_KEY`, nie im Code. Der Worker nimmt nur Anfragen von dieser Seite und nur für Lese-Dienste an. Fällt RMV aus, funktioniert die App trotzdem, nur ohne Meldungen.

## Verspätungen auf einen Blick
- Bei „Jetzt“ zeigt die App oben bis zu drei Verbindungen, die in den letzten 45 Minuten abgefahren sind, mit ihren Verspätungen.
- Jede Verbindung hat links einen Farbbalken: grün = pünktlich (bis 1 min), gelb = 2–5 min, rot = über 5 min, grau = keine Echtzeit.
- Wo Transitous keine Echtzeit hat (z. B. Ersatzbusse), ergänzt die App die Verspätung von RMV.

## Hosting mit GitHub Pages
Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.

## Aufs Handy
Seite im Browser öffnen, dann „Zum Home-Bildschirm“ (iPhone: Teilen-Menü in Safari, Android: Chrome-Menü).

## Hinweise
- Transitous erlaubt nur nicht kommerzielle Open-Source-Nutzung; Daten-Quellen: https://transitous.org/sources/
- Favoriten werden nur im Browser des Geräts gespeichert.
