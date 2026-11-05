// Kravenox Plataforma: guarda o jogo no aparelho para abrir rápido e jogar sem internet.
// Página: busca primeiro a versão nova na rede (para atualizar sozinho) e usa a cópia guardada se estiver offline.
// Músicas, ícones e a biblioteca 3D: usa a cópia guardada e só baixa da rede na primeira vez.
const CACHE = 'kravenox-plataforma-' + (new URL(location.href).searchParams.get('v') || 'v1');
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
// Ao ativar uma versão nova: apaga o cache antigo e, se havia uma versão anterior aberta,
// recarrega as janelas do app para que o ícone da Tela de Início já mostre o jogo novo.
self.addEventListener('activate', e => { e.waitUntil((async () => {
  const old = (await caches.keys()).filter(k => k.startsWith('kravenox-plataforma-') && k !== CACHE);
  await Promise.all(old.map(k => caches.delete(k)));
  await self.clients.claim();
  if (old.length) for (const c of await self.clients.matchAll({ type: 'window' })) { try { c.navigate(c.url.split('?')[0] + '?u=' + Date.now()); } catch (err) {} }
})()); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/plataforma/') || url.pathname.endsWith('/plataforma/index.html');
  if (isPage) {
    // da internet quando ela responde rápido; lenta (franquia acabada) ou cortada, a cópia guardada em 2,5 s
    const rede = fetch(req, { cache: 'no-store' }).then(async r => { if (r.ok) await (await caches.open(CACHE)).put(req, r.clone()); return r; });
    e.waitUntil(rede.then(() => {}, () => {}));
    e.respondWith((async () => {
      const guardada = (await caches.match(req)) || (await caches.match('index.html')) || (await caches.match('./'));
      if (!guardada) { try { return await rede; } catch (err) { return Response.error(); } }
      const prazo = new Promise(res => setTimeout(() => res(null), 2500));
      try { const r = await Promise.race([rede, prazo]); return (r && r.ok) ? r : guardada; } catch (err) { return guardada; }
    })());
    return;
  }
  if (url.pathname.endsWith('version.json')) return;
  const mine = url.origin === location.origin && (url.pathname.includes('/plataforma/') || url.pathname.includes('/rpg/music/'));
  const lib = url.hostname === 'cdnjs.cloudflare.com' || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com');
  if (!mine && !lib) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; })));
});
