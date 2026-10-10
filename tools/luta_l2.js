// Repete uma luta do Livro II várias vezes e mostra a taxa de vitória. Uso: node tools/luta_l2.js <nivel> <ids,sep> [solo-heroi] [N] [setup-js]
const { chromium } = require('playwright');
(async () => {
  const [lv, ids, solo, N, setup] = [+process.argv[2], process.argv[3].split(','), process.argv[4] || '', +(process.argv[5] || 10), process.argv[6] || ''];
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/rpg/?debug'); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([lv, ids, solo, N, setup]) => {
    const G = window.__G, D = G.data; G.overlays.length = 0; G.debug.auto = true; G.debug.fast = true; G.book = 2;
    let res = [], lost = 0;
    G.gameOver = async () => { lost++; };
    for (let n = 0; n < N; n++) {
      G.state = D.newState2();
      for (const h of G.state.party) { h.lv = lv; h.xp = D.xpTotal(lv); D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; }
      G.state.inv = { paoReino: 4, cristalEsc: 3, folha: 2 };
      if (solo) G.state.party = G.state.party.filter(h => h.id === solo);
      G.debug.battlePick = (h, B) => { const T = D.TECHS, has = k => D.techsOf(h).includes(k) && h.ep >= T[k].ep; const en = B.enemies.filter(e => e.alive); if (h.hp < h.maxhp * 0.3 && G.state.inv.paoReino > 0) return { type: 'item', item: 'paoReino', target: h };
        for (const k of ['asas', 'toqueOrigem', 'luzPropria', 'lamina', 'rajada', 'espinhos']) if (has(k)) return { type: 'tech', tech: k, target: en[0] }; return { type: 'atk', target: en[0] }; };
      const before = lost; let rounds = 0;
      try { await G.run(async () => { await G.battle(ids, { noEscape: true, setup: setup ? eval(setup) : undefined }); rounds = G.Battle.round; }); } catch (e) {}
      res.push((lost > before ? 'L' : 'W') + rounds);
    }
    const h = D.newHero(solo || 'kravenox', lv); h.weapon = 'garraEscolha'; h.armor = 'cotaReino'; D.recalc(h);
    return { res: res.join(' '), stats: { hp: h.maxhp, atk: h.atk, def: h.def, mag: h.mag, ep: h.mep } };
  }, [lv, ids, solo, N, setup]);
  console.log(JSON.stringify(r)); await b.close();
})();
