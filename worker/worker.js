// Cloudflare Worker: leitet Anfragen der Web-App an die RMV-API weiter.
// Der RMV-Schlüssel liegt nur als Secret RMV_KEY bei Cloudflare, nie im Code.
// Erlaubt sind nur Lese-Abfragen bestimmter Dienste und nur von der eigenen Seite.

const RMV = "https://www.rmv.de/hapi/";
const ERLAUBTE_DIENSTE = new Set([
  "location.name",   // Haltestellen suchen
  "trip",            // Verbindungen
  "departureBoard",  // Abfahrten
  "arrivalBoard",    // Ankünfte
  "himsearch",       // Störungsmeldungen
  "journeyDetail",   // Fahrtverlauf
]);
const ERLAUBTE_HERKUNFT = [
  "https://nicor977.github.io",
  "http://localhost:8765", // lokales Testen
];

// Anfragegrenze je IP-Adresse und Minute. Die Herkunftsprüfung lässt sich außerhalb des Browsers
// umgehen; die Grenze schützt das RMV-Kontingent. Der Zähler liegt nur im Arbeitsspeicher des Workers
// (je Cloudflare-Standort, nach Neustart leer), ist also ein einfacher Schutz und keine harte Sperre.
const MAX_PRO_MINUTE = 40; // die App braucht etwa 2 Anfragen je Suche
const zaehler = new Map();
function zuVieleAnfragen(ip) {
  const minute = Math.floor(Date.now() / 60000);
  if (zaehler.size > 5000) zaehler.clear();
  const e = zaehler.get(ip);
  if (!e || e.minute !== minute) { zaehler.set(ip, { minute, n: 1 }); return false; }
  return ++e.n > MAX_PRO_MINUTE;
}

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const erlaubt = ERLAUBTE_HERKUNFT.includes(origin);
    const kopf = erlaubt ? cors(origin) : {};

    if (request.method === "OPTIONS") return new Response(null, { status: erlaubt ? 204 : 403, headers: kopf });
    if (request.method !== "GET") return new Response("Nur GET erlaubt", { status: 405, headers: kopf });
    if (!erlaubt) return new Response("Herkunft nicht erlaubt", { status: 403 });
    if (zuVieleAnfragen(request.headers.get("CF-Connecting-IP") || "?"))
      return new Response("Zu viele Anfragen, bitte kurz warten", { status: 429, headers: { ...kopf, "Retry-After": "60" } });
    if (!env.RMV_KEY) return new Response("RMV_KEY fehlt", { status: 500, headers: kopf });

    const url = new URL(request.url);
    const dienst = url.pathname.replace(/^\/+/, "");
    if (!ERLAUBTE_DIENSTE.has(dienst)) return new Response("Dienst nicht erlaubt", { status: 404, headers: kopf });

    const ziel = new URL(RMV + dienst);
    for (const [k, v] of url.searchParams) if (k !== "accessId") ziel.searchParams.set(k, v);
    ziel.searchParams.set("accessId", env.RMV_KEY);
    if (!ziel.searchParams.has("format")) ziel.searchParams.set("format", "json");

    const antwort = await fetch(ziel, { headers: { Accept: "application/json" }, cf: { cacheTtl: 20 } });
    const body = await antwort.text();
    return new Response(body, {
      status: antwort.status,
      headers: { ...kopf, "Content-Type": antwort.headers.get("Content-Type") || "application/json", "Cache-Control": "no-store" },
    });
  },
};
