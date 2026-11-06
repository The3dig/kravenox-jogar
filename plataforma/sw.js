// Kravenox Plataforma: guarda o jogo no aparelho para abrir sem internet e sem gastar dados.
// Segue o guia "Jogos do Kravenox sem internet":
// - Página: abre pela cópia guardada; a internet tem no máximo 2,5 s para entregar a versão nova.
// - Arquivos fixos (three.js, músicas, ícones, fontes): baixados uma vez só e guardados numa caixa
//   que NÃO é apagada quando sai versão nova. Versão nova baixa só a página (~100 KB).
const VERSAO = new URL(location.href).searchParams.get('v') || 'v1';
const PAGINA = 'kravenox-plataforma-' + VERSAO;          // muda a cada versão
const ARQUIVOS = 'kravenox-plataforma-arquivos-1';        // fica entre versões
const PAGINA_URLS = ['./', 'index.html'];
const ARQUIVOS_URLS = ['three.min.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  ...['title', 'abismo', 'vila', 'floresta', 'masmorra', 'vale', 'chefe', 'vitoria', 'gameover'].map(n => '../rpg/music/' + n + '.m4a')];
const FONTES = 'https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@500;700;800&display=swap';

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const pag = await caches.open(PAGINA);
    await Promise.all(PAGINA_URLS.map(u => fetch(u, { cache: 'no-store' }).then(r => r.ok && pag.put(u, r)).catch(() => {})));
    const arq = await caches.open(ARQUIVOS);
    // cada arquivo separado: se um falhar, os outros continuam; o que já está guardado não baixa de novo
    await Promise.all(ARQUIVOS_URLS.map(async u => { if (await arq.match(u)) return; try { await arq.add(u); } catch (err) {} }));
    try { if (!(await arq.match(FONTES))) await arq.put(FONTES, await fetch(new Request(FONTES, { mode: 'no-cors' }))); } catch (err) {}
  })());
  self.skipWaiting();
});

// Ao ativar uma versão nova: apaga só as páginas antigas (os arquivos grandes ficam) e recarrega o app aberto.
self.addEventListener('activate', e => { e.waitUntil((async () => {
  const velhas = (await caches.keys()).filter(k => k.startsWith('kravenox-plataforma-') && k !== PAGINA && k !== ARQUIVOS);
  const tinhaVersao = velhas.some(k => !k.startsWith('kravenox-plataforma-arquivos-'));
  await Promise.all(velhas.map(k => caches.delete(k)));
  await self.clients.claim();
  if (tinhaVersao) for (const c of await self.clients.matchAll({ type: 'window' })) { try { c.navigate(c.url.split('?')[0] + '?u=' + Date.now()); } catch (err) {} }
})()); });

const comPrazo = (p, ms) => Promise.race([p, new Promise(res => setTimeout(() => res(null), ms))]);

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/plataforma/') || url.pathname.endsWith('/plataforma/index.html');
  if (isPage) {
    // da internet quando ela responde rápido; lenta (franquia acabada) ou cortada, a cópia guardada em 2,5 s
    const rede = fetch(req, { cache: 'no-store' }).then(async r => { if (r.ok) { const c = await caches.open(PAGINA); await c.put('index.html', r.clone()); } return r; });
    e.waitUntil(rede.then(() => {}, () => {}));   // chamado na hora do evento, fora do async
    e.respondWith((async () => {
      const guardada = (await caches.match('index.html', { cacheName: PAGINA })) || (await caches.match('index.html')) || (await caches.match('./'));
      if (!guardada) { try { return await rede; } catch (err) { return Response.error(); } }
      try { const r = await comPrazo(rede, 2500); return (r && r.ok) ? r : guardada; } catch (err) { return guardada; }
    })());
    return;
  }
  if (url.pathname.endsWith('version.json')) return;   // a página já põe prazo nele
  const mine = url.origin === location.origin && (url.pathname.includes('/plataforma/') || url.pathname.includes('/rpg/music/'));
  const fonte = url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com');
  if (!mine && !fonte) return;
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: mine });
    if (hit) return hit;
    const rede = fetch(req).then(async r => { if (r.ok || r.type === 'opaque') { const c = await caches.open(ARQUIVOS); await c.put(req, r.clone()); } return r; });
    if (fonte) { const r = await comPrazo(rede.catch(() => null), 2500); return r || Response.error(); }  // fonte lenta não trava a tela
    try { return await rede; } catch (err) { return Response.error(); }
  })());
});
