# MoinPlan-Zähler mit GoatCounter einrichten

Gezählt wird (je Planart: bplan, baustufenplan, keinplan):
- `suche-…` Suchergebnis angezeigt
- `kaufdialog-…` Angebot für den Bericht geöffnet
- `kauf-…` Bericht gekauft
- `pdf-…` Bericht als PDF gespeichert

Jedes Ereignis zählt höchstens einmal je Suche. Keine Cookies, keine Adresse. Seitenaufrufe werden nicht gezählt.

## Was Michel tun muss
1. Auf goatcounter.com „Sign up“: Code wählen (z. B. `moinplan`, ergibt moinplan.goatcounter.com), E-Mail, Passwort.
2. Den gewählten Code an Claude schicken. Claude trägt ihn in `CFG.goatcounter` ein und schaltet die Datenschutzerklärung im selben Schritt um.
3. In GoatCounter unter „Settings“ prüfen: „Collect“ → keine Referrer/Screen-Größe nötig (kann aus bleiben).

Hinweis: Der kostenlose Tarif ist laut GoatCounter für nicht-kommerzielle Seiten gedacht. Sobald MoinPlan echt verkauft, auf der Preisseite den günstigsten erlaubten Tarif prüfen.

## Auswertung
Im GoatCounter-Dashboard stehen die Ereignisse als eigene Zeilen. Kaufquote = `kauf-…` geteilt durch `suche-…`. Export als CSV: „Settings“ → „Export“.
