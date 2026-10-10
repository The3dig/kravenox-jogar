// Roda uma cena isolada do Livro II e mostra onde ela para. Uso: node tools/cena_l2.js <cena> [flags-json] [segundos]
const { chromium } = require('playwright');
(async () => {
  const [scene, flags, secs] = [process.argv[2], JSON.parse(process.argv[3] || '{}'), +(process.argv[4] || 60)];
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message + '\n' + e.stack));
  await p.goto('http://localhost:8765/rpg/?debug'); await p.waitForTimeout(1500);
  await p.evaluate(([scene, flags]) => { const G = window.__G, D = G.data; G.overlays.length = 0; G.debug.auto = true; G.debug.fast = true; G.book = 2; G.state = D.newState2(); Object.assign(G.state.flags, flags); G.titleScreen = () => {};
    const t = window.__t = []; const os = G.say; G.say = async (...a) => { t.push('say ' + a[0] + ': ' + String(a[1]).slice(0, 50)); return os.apply(G, a); };
    window.__done = false; G.run(async () => { try { await G.story[scene](); } catch (e) { t.push('ERR ' + e.message + e.stack); } window.__done = true; }); }, [scene, flags]);
  for (let i = 0; i < secs; i++) { await p.waitForTimeout(1000); if (await p.evaluate(() => window.__done)) break; }
  const r = await p.evaluate(() => { const G = window.__G; return { done: window.__done, scene: G.scene === G.Cine ? 'cine' : G.scene === G.Field ? 'field' : '?', tail: window.__t.slice(-6), lastErr: G.lastError && G.lastError.message, cine: G.Cine && { cap: G.Cine.cap, bg: G.Cine.bg } }; });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.join('\n') || 'no page errors'); await b.close();
})();
