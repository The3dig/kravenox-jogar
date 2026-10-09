const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 760 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message + '\n' + e.stack));
  p.on('console', m => { if (m.type() === 'error' || m.text().startsWith('LOG')) errs.push('CONSOLE ' + m.text()); });
  await p.goto('http://localhost:8765/rpg/?debug');
  await p.waitForTimeout(1500);
  const out = await p.evaluate(async () => {
    const G = window.__G; const log = []; G.overlays.length = 0;
    G.debug.auto = true; G.debug.fast = true; G.debug.noEnc = true;
    G.state = G.data.newState();
    try { localStorage.clear(); } catch (e) {}
    const S = G.story;
    const boost = (lv) => { for (const h of G.state.party) { h.lv = lv; h.xp = G.data.xpTotal(lv); G.data.recalc(h); h.hp = h.maxhp; h.ep = h.mep; } };
    const steps = [
      ['prologo', () => S.prologo()],
      ['enter abismo', async () => { G.enterDungeon('abismo'); }],
      ['despertar', () => S.despertar()],
      ['marca', () => S.abismoMarca()], ['enxame', () => S.abismoEnxame()], ['sairAbismo', () => S.sairAbismo()],
      ['memoria', () => S.memoriaEstrada()], ['torre', () => S.torre()],
      ['vila', () => S.entrarVila()], ['estatua', () => S.estatua()], ['mascate', () => S.mascate()],
      ['casa', () => S.entrarCasa()], ['ancia', () => S.ancia()], ['frag', () => S.fragmento()], ['sairCasa(sentinelas)', () => S.sairCasa()],
      ['sairVila', () => S.sairVila()], ['lira', () => S.florestaLira()], ['guardiao1', () => S.florestaGuardiao()],
      ['templo', () => S.entrarTemplo()], ['voz', () => S.voz('teste')], ['estatuaT', () => S.temploEstatua()], ['raizNegra', () => S.raizNegra()],
      ['arauto', () => S.arauto()], ['camara', () => S.camaraCristais()], ['coisa', () => S.coisaQueDormia()], ['sairCaverna', () => S.sairCaverna()],
      ['santuario', () => S.santuario()], ['espirito', () => S.espirito()], ['valeVoz', () => S.valeVoz()], ['ponte', () => S.ponteMortos()],
      ['lyra', () => S.encontraLyra()], ['rio', () => S.rioMemorias()], ['porta', () => S.portaTres()], ['fonte', () => S.fonte()],
    ];
    G.debug.menuPick = (o, items) => { if (items.length && items[items.length-1].label === 'Sair') return items.length-1; if (o.title === 'Mercadorias') return -1; const i = items.findIndex(it => !it.disabled); return i < 0 ? 0 : i; };
    for (const [n, f] of steps) {
      boost(40);
      const t0 = performance.now();
      try { await Promise.race([G.run(f), new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 20000))]); } catch (e) { log.push('ERR ' + n + ' ' + e.message); }
      if (G.lastError) { log.push('LASTERR ' + n + ' ' + G.lastError.message + ' ' + G.lastError.stack); G.lastError = null; }
      console.log('LOG ' + n); log.push(n + ' ok ' + Math.round(performance.now() - t0) + 'ms scene=' + (G.scene === G.Field ? 'field:' + G.Field.id : G.scene === G.Dungeon ? 'dun:' + G.Dungeon.id : G.scene === G.Battle ? 'battle' : 'other') + ' party=' + G.state.party.map(h => h.id).join(','));
    }
    log.push('flags ' + Object.keys(G.state.flags).join(','));
    return log;
  });
  console.log(out.join('\n'));
  console.log(errs.filter(e=>!e.startsWith('CONSOLE LOG')).join('\n') || 'no errors');
  await b.close();
})();
