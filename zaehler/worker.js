// MoinPlan-Zähler: zählt anonym, wie oft gesucht, der Kaufdialog geöffnet und gekauft wird.
// Gespeichert wird nur: Tag, Ereignis, Planart, Anzahl. Keine IP-Adresse, keine Adresse, keine Kennung.
// Läuft als Cloudflare Worker (kostenlos) mit einer D1-Datenbank namens DB, siehe ANLEITUNG.md.
const EREIGNISSE = ["ergebnis", "kaufdialog", "kauf", "pdf"];
const ARTEN = ["", "bplan", "baustufenplan", "keinplan"];
const ERLAUBT = ["https://michelbalke.github.io"]; // Seiten, von denen gezählt wird (eigene Domain hier ergänzen)

const tag = () => new Date().toLocaleDateString("sv-SE", {timeZone: "Europe/Berlin"}); // JJJJ-MM-TT

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === "POST") {
      if (!ERLAUBT.includes(req.headers.get("Origin") || "")) return new Response(null, {status: 204});
      const [ereignis, art = ""] = (await req.text()).slice(0, 40).split(":");
      if (EREIGNISSE.includes(ereignis) && ARTEN.includes(art))
        await env.DB.prepare("INSERT INTO zaehler (tag, ereignis, art, anzahl) VALUES (?1, ?2, ?3, 1) ON CONFLICT (tag, ereignis, art) DO UPDATE SET anzahl = anzahl + 1")
          .bind(tag(), ereignis, art).run();
      return new Response(null, {status: 204});
    }
    if (!env.SCHLUESSEL || url.searchParams.get("k") !== env.SCHLUESSEL) return new Response("Nicht gefunden", {status: 404});
    const {results} = await env.DB.prepare("SELECT tag, ereignis, art, anzahl FROM zaehler ORDER BY tag DESC, ereignis, art").all();
    if (url.pathname === "/log.csv")
      return new Response("tag;ereignis;planart;anzahl\n" + results.map(r => [r.tag, r.ereignis, r.art, r.anzahl].join(";")).join("\n") + "\n",
        {headers: {"Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=moinplan-zaehler.csv"}});
    return new Response(seite(results, url.searchParams.get("k")), {headers: {"Content-Type": "text/html; charset=utf-8"}});
  }
};

// Auswertung: je Tag und gesamt, mit Anteil Kaufdialog und Kauf an den Suchen
function seite(rows, k) {
  const tage = {}, summe = {ergebnis: 0, kaufdialog: 0, kauf: 0, pdf: 0}, jeArt = {};
  for (const r of rows) {
    (tage[r.tag] ??= {ergebnis: 0, kaufdialog: 0, kauf: 0, pdf: 0})[r.ereignis] += r.anzahl;
    summe[r.ereignis] += r.anzahl;
    (jeArt[r.art || "?"] ??= {ergebnis: 0, kaufdialog: 0, kauf: 0, pdf: 0})[r.ereignis] += r.anzahl;
  }
  const pz = (a, b) => b ? (100 * a / b).toFixed(1).replace(".", ",") + " %" : "–";
  const zeile = (name, z) => `<tr><td>${name}</td><td>${z.ergebnis}</td><td>${z.kaufdialog}</td><td>${z.kauf}</td><td>${z.pdf}</td><td>${z.ergebnis - z.kauf}</td><td>${pz(z.kaufdialog, z.ergebnis)}</td><td>${pz(z.kauf, z.ergebnis)}</td></tr>`;
  const kopf = `<tr><th></th><th>Suchen</th><th>Kaufdialog</th><th>Käufe</th><th>PDF</th><th>ohne Kauf</th><th>Dialog/Suche</th><th>Kauf/Suche</th></tr>`;
  const namen = {bplan: "Bebauungsplan", baustufenplan: "Baustufenplan", keinplan: "kein Plan", "?": "unbekannt"};
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MoinPlan Zähler</title>
<style>body{font:15px -apple-system,system-ui,sans-serif;margin:16px;color:#111}table{border-collapse:collapse;margin:8px 0 24px}td,th{padding:5px 10px;border-bottom:1px solid #ddd;text-align:right}td:first-child,th:first-child{text-align:left}</style>
<h1>MoinPlan Zähler</h1><p>Anonyme Zählung. „Suchen“ = angezeigte Suchergebnisse, „Kaufdialog“ = Angebot geöffnet. <a href="log.csv?k=${encodeURIComponent(k)}">Als CSV laden</a></p>
<h2>Gesamt</h2><table>${kopf}${zeile("Gesamt", summe)}</table>
<h2>Nach Planart</h2><table>${kopf}${Object.entries(jeArt).map(([a, z]) => zeile(namen[a] || a, z)).join("")}</table>
<h2>Nach Tag</h2><table>${kopf}${Object.entries(tage).map(([t, z]) => zeile(t, z)).join("")}</table>`;
}
