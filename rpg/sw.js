// Kravenox offline: guarda o jogo inteiro no aparelho para jogar sem internet.
// Cada versão publicada ganha um cache novo. Para a versão nova entrar rápido, a instalação baixa só o
// essencial (código, fonte, ícones); o resto (imagens, músicas) é copiado do cache antigo quando não mudou
// (cada arquivo da lista tem ?h=<hash>) e o que mudou baixa em segundo plano. O cache antigo só é apagado
// quando o novo está completo — até lá ele serve de reserva para jogar sem internet.
const V = new URL(location.href).searchParams.get('v') || 'dev';
const CACHE = 'kravenox-' + V;
const CORE = u => /^(\.\/$|index\.html|js\/|fonts\/|manifest|icon-|music\/index\.json)/.test(u);
let list = null;
// espera a internet no máximo `ms`; lenta (franquia acabada) ou cortada, devolve null
const prazo = (p, ms = 2500) => Promise.race([p.catch(() => null), new Promise(res => setTimeout(() => res(null), ms))]);
// a lista de arquivos desta versão fica guardada: abrir o jogo de novo não baixa a lista outra vez
async function getList() {
  if (list) return list;
  const c = await caches.open(CACHE), key = 'lista-precache?v=' + V;
  let r = await c.match(key);
  if (!r) { r = await fetch('precache.json?v=' + V, { cache: 'no-store' }); if (!r.ok) throw new Error('lista'); await c.put(key, r.clone()); }
  list = await r.json();
  return list;
}
async function others() {
  const out = [];
  for (const k of await caches.keys()) if (k.startsWith('kravenox-') && k !== CACHE) out.push(await caches.open(k));
  return out;
}
async function fill(onlyCore) {
  const c = await caches.open(CACHE);
  if (!onlyCore && await c.match('completo')) return true;   // já guardou tudo: não gasta nada
  const all = await getList(), old = await others(), todo = [];
  for (const u of all) {
    if (onlyCore && !CORE(u)) continue;
    if (await c.match(u)) continue;
    let r = null;
    if (u.includes('?h=')) for (const o of old) { r = await o.match(u); if (r) break; }   // mesmo arquivo (mesmo hash)
    if (r) await c.put(u, r); else todo.push(u);
  }
  // baixa em pequenos grupos para não engasgar a conexão do celular
  for (let i = 0; i < todo.length; i += 6) await Promise.all(todo.slice(i, i + 6).map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
  for (const u of all) if (!(await c.match(u))) return false;
  if (!onlyCore) await c.put('completo', new Response('1'));
  return true;
}
let filling = null;
function fillAll() {
  if (!filling) filling = (async () => {
    try {
      if (!(await fill(false))) return;
      for (const k of await caches.keys()) if (k.startsWith('kravenox-') && k !== CACHE) await caches.delete(k);
      for (const cl of await self.clients.matchAll()) cl.postMessage({ offline: V });
    } catch (e) {} finally { filling = null; }
  })();
  return filling;
}
self.addEventListener('install', e => { e.waitUntil(fill(true).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim().then(() => { fillAll(); })); });
// a página pede para completar o download (caso o app tenha sido fechado no meio da última vez)
self.addEventListener('message', e => { if (e.data === 'fill') e.waitUntil(fillAll()); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || req.headers.get('range')) return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const fresh = req.mode === 'navigate' || url.pathname.endsWith('version.json') || url.pathname.endsWith('precache.json');
  if (fresh) {   // página e versão: da internet quando ela responde rápido; lenta ou cortada, a cópia guardada em 2,5 s
    const chave = req.mode === 'navigate' ? 'index.html' : req;
    const caixa = caches.open(CACHE);
    const rede = fetch(req, { cache: 'no-cache' }).then(async r => { if (r.ok) await (await caixa).put(chave, r.clone()); return r; });
    e.waitUntil(rede.then(() => {}, () => {}));
    e.respondWith((async () => {
      const c = await caixa;
      const guardada = (await c.match(chave, { ignoreSearch: true })) || (req.mode === 'navigate' ? await caches.match('index.html', { ignoreSearch: true }) : null);
      if (!guardada) { try { return await rede; } catch (err) { return Response.error(); } }
      const prazo = new Promise(res => setTimeout(() => res(null), 2500));
      try { const r = await Promise.race([rede, prazo]); return (r && r.ok) ? r : guardada; } catch (err) { return guardada; }
    })());
    return;
  }
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    // código de outra versão (?v= diferente deste cache): internet primeiro. Imagens e músicas quase nunca
    // mudam: essas continuam vindo do aparelho (a versão nova assume em segundos e recarrega a página)
    const qv = url.searchParams.get('v');
    if (qv && qv !== V && qv !== 'offline' && /\.(js|json)$/.test(url.pathname)) { const r = await prazo(fetch(req)); if (r && r.ok) return r; }
    const mine = await c.match(req, { ignoreSearch: true });
    if (mine) return mine;
    // mesmo arquivo (mesmo hash) guardado pela versão anterior: copia em vez de baixar
    try {
      const rel = url.pathname.slice(new URL('./', location.href).pathname.length);
      const lst = await prazo(getList()), key = lst && lst.find(u => u.split('?h=')[0] === rel);
      if (key && key.includes('?h=')) for (const o of await others()) { const r = await o.match(key); if (r) { c.put(key, r.clone()); return r; } }
    } catch (err) {}
    // ainda não está no cache novo: internet (e guarda); sem internet, o cache antigo
    const rede = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; });
    const antiga = await caches.match(req, { ignoreSearch: true });
    if (!antiga) { try { return await rede; } catch (err) { return Response.error(); } }
    const r = await prazo(rede); return (r && r.ok) ? r : antiga;
  })());
});
