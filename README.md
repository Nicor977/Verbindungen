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

## Hosting mit GitHub Pages
Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.

## Aufs Handy
Seite im Browser öffnen, dann „Zum Home-Bildschirm“ (iPhone: Teilen-Menü in Safari, Android: Chrome-Menü).

## Hinweise
- Transitous erlaubt nur nicht kommerzielle Open-Source-Nutzung; Daten-Quellen: https://transitous.org/sources/
- Favoriten werden nur im Browser des Geräts gespeichert.
