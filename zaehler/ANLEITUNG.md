# MoinPlan-Zähler einrichten (Cloudflare, kostenlos)

Was gezählt wird (je Tag und Planart): angezeigte Suchergebnisse, geöffneter Kaufdialog, Kauf, PDF gespeichert.
Nicht gespeichert: IP-Adresse, gesuchte Adresse, Kennung, Cookies. Jedes Ereignis zählt höchstens einmal je Suchergebnis.

Kosten: 0 € (Cloudflare Workers Free: 100.000 Aufrufe am Tag, D1 Free: 100.000 Schreibvorgänge am Tag). Keine Kreditkarte nötig.

1. Konto anlegen auf dash.cloudflare.com (E-Mail reicht).
2. Links „Storage & Databases“ → „D1“ → „Create“, Name `moinplan-zaehler`. In der Datenbank „Console“ öffnen und den Inhalt von `schema.sql` einfügen und ausführen.
3. Links „Workers & Pages“ → „Create“ → „Worker“ → Name `moinplan-zaehler` → „Deploy“. Dann „Edit code“, alles löschen, `worker.js` einfügen, „Deploy“.
4. Im Worker „Settings“ → „Bindings“ → „Add“ → „D1 database“: Variablenname `DB`, Datenbank `moinplan-zaehler`.
5. „Settings“ → „Variables and Secrets“ → „Add“, Typ „Secret“, Name `SCHLUESSEL`, Wert: ein langes Passwort nur für die Auswertung.
6. Die Adresse des Workers (z. B. `https://moinplan-zaehler.<name>.workers.dev/`) an Claude geben. Claude trägt sie in `CFG.zaehler` ein und ergänzt die Datenschutzerklärung (`datenschutz-absatz.html`).

Auswertung: `https://moinplan-zaehler.<name>.workers.dev/?k=<SCHLUESSEL>`, Log-Datei: `…/log.csv?k=<SCHLUESSEL>` (CSV, öffnet in Excel/Numbers).

Eigene Domain später: in `worker.js` die Domain in `ERLAUBT` ergänzen. Kommt der eigene Server für die Planauslese, kann der Zähler dorthin umziehen (nur die Adresse in `CFG.zaehler` ändern).
