/* Cérebro médico: funciona sem internet com a última versão que abriu.
   Página e dados: rede primeiro (para receber as atualizações da madrugada), cópia guardada se estiver offline.
   Bibliotecas, ícones e fontes: cópia guardada primeiro. GitHub API e Drive passam direto. */
const V = "cm-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "vendor/d3.min.js", "vendor/qrcode.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png",
  "data/manifest.json", "data/base.json", "data/materials.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const timeout = (p, ms) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error("timeout")), ms); p.then(v => { clearTimeout(t); res(v) }, e => { clearTimeout(t); rej(e) }) });

async function networkFirst(req, key) {
  const c = await caches.open(V);
  try {
    const r = await timeout(fetch(req), 6000);
    if (r && r.ok) c.put(key || req, r.clone());
    return r;
  } catch (e) {
    const hit = await c.match(key || req, { ignoreSearch: true });
    if (hit) return hit;
    throw e;
  }
}
async function cacheFirst(req) {
  const c = await caches.open(V);
  const hit = await c.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const r = await fetch(req);
  if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone());
  return r;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin === self.location.origin) {
    const base = new URL(self.registration.scope);
    if (!u.pathname.startsWith(base.pathname)) return;
    const rel = u.pathname.slice(base.pathname.length);
    if (req.mode === "navigate" || rel === "" || rel === "index.html") {
      e.respondWith(networkFirst(req, new URL("index.html", base).href));
    } else if (rel.startsWith("vendor/") || rel.startsWith("icons/")) {
      e.respondWith(cacheFirst(req));
    } else {
      e.respondWith(networkFirst(req, u.origin + u.pathname));
    }
    return;
  }
  if (u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com") e.respondWith(cacheFirst(req));
});
