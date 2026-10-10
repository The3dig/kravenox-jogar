// Kravenox offline: guarda o jogo inteiro no aparelho para jogar sem internet.
// Cada versão publicada ganha um cache novo; o antigo é apagado quando o novo fica pronto.
const V = new URL(location.href).searchParams.get('v') || 'dev';
const CACHE = 'kravenox-' + V;
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const list = await (await fetch('precache.json?v=' + V, { cache: 'no-store' })).json();
    const c = await caches.open(CACHE);
    // baixa em pequenos grupos para não engasgar a conexão do celular
    for (let i = 0; i < list.length; i += 6) await Promise.all(list.slice(i, i + 6).map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('kravenox-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    for (const cl of await self.clients.matchAll()) cl.postMessage({ offline: V });
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || req.headers.get('range')) return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const fresh = req.mode === 'navigate' || url.pathname.endsWith('version.json') || url.pathname.endsWith('precache.json');
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    if (fresh) {   // página e versão: tenta a internet primeiro; sem internet, usa a cópia guardada
      try { const r = await fetch(req); if (r.ok) c.put(req.mode === 'navigate' ? 'index.html' : req, r.clone()); return r; }
      catch (err) { return (await c.match(req.mode === 'navigate' ? 'index.html' : req, { ignoreSearch: true })) || (await caches.match('index.html', { ignoreSearch: true })) || Response.error(); }
    }
    const hit = await c.match(req, { ignoreSearch: true }) || await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try { const r = await fetch(req); if (r.ok && !req.headers.get('range')) c.put(req, r.clone()); return r; } catch (err) { return Response.error(); }
  })());
});
