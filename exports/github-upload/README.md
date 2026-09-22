# S-ART — Sharyar Azhdari

Eigenständiger deutscher Website-Entwurf für die Kunst- und Kultur-Galerie S-ART in Essen. Originalwerke, dunkle Graffiti-Collagen, raue Brush-Typografie und Pink/Cyan-Akzente. Inhaltlich auf S-ART aufgebaut, in Präsenz und Bewegung von No Art inspiriert.

## Lokal öffnen

Im Projektordner `npm run dev` ausführen und http://127.0.0.1:4178 öffnen. Alternativ `python3 -m http.server 4178 --bind 127.0.0.1`. Node 22+ wird nur für Prüfung und Export-Build benötigt; die Website selbst besteht aus HTML, CSS und JavaScript. Keine Paketinstallation erforderlich.

- `npm run check`: JavaScript-Syntax, lokale Dateien, Anker, Werkdatensätze und Quellennachweise prüfen.
- `npm run build`: deploybare Website nach `dist/` kopieren.
- `npm run export`: sauberen GitHub-Uploadordner und ZIP unter `exports/` erstellen.

## GitHub-Upload

1. Ein eigenes Repository für S-ART anlegen.
2. **Den Inhalt** von `exports/github-upload/` ins Repository-Hauptverzeichnis laden, inklusive `.github/`, `.gitignore` und `.nojekyll`. Nicht das gesamte WEBDESIGNBYAF-Verzeichnis hochladen.
3. Standardbranch `main` verwenden. In **Settings → Pages → Source** `GitHub Actions` auswählen.
4. Der mitgelieferte Workflow prüft die Dateien, erstellt `dist/` und veröffentlicht auf GitHub Pages. Alle Asset-Pfade sind relativ und funktionieren auch unter einem Repository-Unterpfad.

Alternativ den Inhalt von `dist/` bei einem statischen Hoster hochladen. Es sind keine Zugangsdaten, Umgebungsvariablen oder laufenden Server nötig. Dieses Projekt wurde nur lokal erstellt und noch nicht zu GitHub hochgeladen oder öffentlich veröffentlicht.

## Inhalt und Funktionen

- Animierter Hero mit aus Originalkunst gefülltem S-ART-Schriftzug, zwei schrägen Kunstbildern, gestaffeltem Auftritt, sanftem Schweben und Maus-Parallax. Zwei manuell wählbare Hintergrundmotive.
- Bewegung pausierbar; Systempräferenz für reduzierte Bewegung wird respektiert. Laufende Hero-Animationen pausieren außerhalb des Bildschirms oder bei verborgenem Tab.
- Sechs ausgewählte Werke mit zugänglichem Detaildialog, vollständiger Bildansicht, Format, Anfrage-Link und Verweis zum jeweiligen bestehenden Shopprodukt.
- Künstlerbiografie, Galerie-Statement, vier Veranstaltungsrückblicke und Kontakt.
- Shary & Friends: sechs Originalfotos mit Kontext, Namen, Fotocredits und Großansicht; danach neun Marken-/Medienpartner.
- Vollbildmenü, Tastaturbedienung, Escape zum Schließen, Fokusführung, native Event-Akkordeons, reduzierte Bewegung nach Systemeinstellung.
- Responsive Darstellung; lokale WebP-Bilder und lokal eingebundene freie Schriften.
- Keine Tracker, eingebetteten Drittanbieter, Cookies, Formulardatenbanken oder simulierte Kaufabwicklung. Externe Links öffnen mit `noopener`.

## Quellen und redaktionelle Hinweise

Stand der Übernahme: 22.09.2026.

- Inhalte, Kontaktdaten und Galerie: https://s-art.work/
- Biografie, Arbeitsweise und internationale Präsenz: https://s-art.work/ueber-s-art.html
- Werkdaten: jeweilige Produktseiten unter https://s-art.work/shop/
- Rückblicke und Fotocredits: https://s-art.work/veranstaltungen/
- Partner: https://s-art.work/partner.html
- Gestalterische Referenz: https://www.noartmusic.com/ (keine Assets oder Quellcodes übernommen).
- Sämtliche lokalen Bild- und Schriftquellen: `assets/sources.json`. Road Rage und Space Grotesk stehen unter SIL Open Font License; Permanent Marker unter Apache License 2.0. Lizenztexte liegen bei den Schriften.

Die Kunstwerke und Fotos wurden für den Kundenentwurf von der bestehenden S-ART-Website übernommen; die Rechte verbleiben bei ihren jeweiligen Rechteinhabern. Keine generierten oder nachgebauten Kunstwerke. Die Bildansichten einzelner Werke enthalten bereits auf der Quelle vorhandene Raumvisualisierungen. Produktpreise werden bewusst direkt im bestehenden Shop abgerufen, da z. B. Start- und Produktseite bei Money Icon unterschiedliche Preise zeigen.

Shop, ausführliche Biografie, Veranstaltungsprogramm, Presse sowie Impressum, Datenschutzerklärung und Widerrufsbelehrung verweisen aktuell auf die bestehende Website. Vor einem Ersatz der Originaldomain müssen Shopintegration und Rechtstexte auf das gewählte Hosting abgestimmt werden. Veranstaltungen aus 2025 sind ausdrücklich Rückblicke; neue Termine wurden nicht erfunden. Bestehende Öffnungszeiten wurden unverändert übernommen.

## Dateien

`index.html`: Inhalte · `styles.css`: Gestaltung und Responsive-Regeln · `app.js`: Interaktionen und Werkdaten · `assets/`: Originalbilder, Schriften und Quellen · `.github/workflows/pages.yml`: GitHub-Pages-Veröffentlichung. `exports/` und `dist/` sind erzeugte Ausgaben, keine Arbeitsquellen.
