# MoinPlan live stellen

Alles ist gebaut. Für den Livegang fehlen nur noch Daten und Konten.

## 1. Betreiberdaten eintragen
Datei `betreiber.json` öffnen und ausfüllen:

| Feld | Beispiel | Hinweis |
| --- | --- | --- |
| name | Muster UG (haftungsbeschränkt) | Person oder Firma mit Rechtsform |
| strasse, plz, ort | Musterweg 1, 20095, Hamburg | ladungsfähige Anschrift |
| email | kontakt@moinplan.de | erscheint in Impressum, Datenschutz, Widerruf |
| email_widerruf | widerruf@moinplan.de | leer lassen = gleiche wie email |
| telefon | 040 1234567 | |
| kleinunternehmer | true oder false | steuert alle Steuertexte und den Hinweis am Preis |
| ust_id | DE123456789 | nur wenn kein Kleinunternehmer |
| wirtschafts_id, register | "" | "" = gibt es nicht, Zeile verschwindet |
| zahlung_anbieter | Stripe Payments Europe Ltd., Dublin, Irland | für Datenschutz |
| zahlung_arten | Stripe (Karte, Apple Pay, Google Pay) | für AGB |
| stand | 1. Februar 2027 | Datum der Freigabe der Rechtstexte |
| domain | https://moinplan.de/ | beim Umzug ändern (Google, Vorschaubild, Sitemap) |

`null` = noch offen, erscheint orange als Platzhalter.

## 2. Bauen und ins Repo schreiben
```
python3 -I build.py /pfad/zum/repo
```
Schreibt index.html, 404-Seite, Icons, Vorschaubild, robots.txt, sitemap.xml, 3D-Bibliothek (cesium/) und alle Rechtsseiten.
Am Ende steht, welche Angaben noch offen sind.

## 3. Domain moinplan.de
1. Im Repo eine Datei `CNAME` mit dem Inhalt `moinplan.de` anlegen.
2. Beim Domain-Anbieter: A-Einträge für `moinplan.de` auf 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; `www` als CNAME auf `<github-konto>.github.io`.
3. GitHub: Settings > Pages > Custom domain `moinplan.de`, dann „Enforce HTTPS“.
4. GoatCounter: in den Einstellungen die neue Domain erlauben.

## 4. Noch offen (braucht Konten oder Entscheidungen)
- Zahlungsanbieter (z. B. Stripe) und ein kleiner Server, der den Kauf prüft und den Bericht freischaltet. Heute schaltet der Browser selbst frei (Vorschau).
- Mail-Dienst für die Bestätigungsmail (Entwurf: vorschau/bestaetigungsmail/).
- Fachanwalt IT-Recht prüft AGB, Widerruf, Datenschutz.
- Erst danach in `src/index.html` `PRO.bezahlung` auf `true` setzen.
