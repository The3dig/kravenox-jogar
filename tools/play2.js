const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 760 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message + '\n' + e.stack));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto('http://localhost:8765/rpg/?debug');
  await p.waitForTimeout(1500);
  const LV = +(process.env.LV || 40);
  const out = await p.evaluate(async (LV) => {
    const G = window.__G; const log = []; G.overlays.length = 0;
    G.debug.auto = true; G.debug.fast = true; G.debug.noEnc = true;
    G.state = G.data.newState(); const D = G.data;
    try { localStorage.clear(); } catch (e) {}
    G.state.flags.fim = 1; G.state.flags.prata = 1; D.addHero('thornox'); D.addHero('lyra');
    const S = G.story; const process_gear = true;
    const origBattle = G.battle; G.battle = async (ids, o) => { const r = await origBattle(ids, o); log.push('   battle ' + ids.join('+') + ' rounds=' + G.Battle.round + ' hp=' + G.state.party.map(h => h.hp + '/' + h.maxhp).join(' ')); return r; };
    const boost = (lv) => { for (const h of G.state.party) { h.lv = lv; h.xp = D.xpTotal(lv); D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; } };
    const steps = [
      ['parte2', () => S.parte2()],
      ['refugiados', () => S.refugiados()], ['estrada', () => S.conversaEstrada()], ['mascateG', () => S.mascateGuerra()], ['refugiada', () => S.refugiada()], ['menino', () => S.menino()],
      ['torreBandeira', () => S.torreBandeira()], ['colina', () => S.colinaValdora()], ['refugiado', () => S.refugiado()], ['entrarValdora', () => S.entrarValdora()],
      ['portao', () => S.portaoValdora()], ['casa', () => S.casaQueimada()], ['estatuaPai', () => S.estatuaPai()],
      ['portaTres', () => S.portaTresMaos()], ['salaDoPai', () => S.salaDoPai()], ['estatua2', () => S.estatuaPai()],
      ['entrarPassagem', () => S.entrarPassagem()], ['simbolos', () => S.simbolosAntigos()], ['criatura', () => S.criaturaOlhos()], ['confronto', () => S.confrontoSeraphyne()],
      ['portaCoracao', () => S.portaDoCoracao()], ['coracao', () => S.coracaoPrimeiro()],
      ['torreAntes', () => S.torrePonte()], ['beco', () => S.becoCriancas()], ['torrePonte', () => S.torrePonte()],
      ['mascateCeus', () => S.mascateCeus()], ['nuvens', () => S.olharNuvens()], ['servos', () => S.batalhaServos()], ['fimPonte', () => S.fimDaPonte()],
      ['entremAntes', () => S.portaEntrem()], ['memParede', () => S.memoriaParede()], ['entrem', () => S.portaEntrem()], ['trono', () => S.tronoFuturo()], ['descer', () => S.descerRaizes()],
      ['portaAntes', () => S.portaCircularEv()], ['arvoreMae', () => S.arvoreMae()], ['portaCircular', () => S.portaCircularEv()], ['escolhidos', () => S.escolhidosPonte()], ['raizQ', () => S.raizQuebra()],
      ['aFonte', () => S.aFonte()],
    ];
    G.state.inv = { elixir: 6, nectar: 8, cristalM: 6, raiz: 3, seiva: 5 };
    const T = D.TECHS, lost = {};
    G.debug.battlePick = (h, B) => {
      const P = G.state.party, al = P.filter(x => x.alive), en = B.enemies.filter(e => e.alive);
      const has = k => D.techsOf(h).includes(k) && h.ep >= T[k].ep;
      const low = al.filter(x => x.hp < x.maxhp * 0.5), dead = P.filter(x => !x.alive);
      const boss = en.slice().sort((a, b) => b.hp - a.hp)[0];
      if (dead.length && has('eco')) return { type: 'tech', tech: 'eco', target: dead[0] };
      if (dead.length && G.state.inv.raiz > 0 && h.id !== 'kravenox') { G.state.inv.raiz; return { type: 'item', item: 'raiz', target: dead[0] }; }
      if (low.length >= 2 && has('aurora')) return { type: 'tech', tech: 'aurora', target: 'all' };
      if (low.length >= 2 && has('memoria')) return { type: 'tech', tech: 'memoria', target: 'all' };
      if (low.length && has('luz')) return { type: 'tech', tech: 'luz', target: low[0] };
      if (h.hp < h.maxhp * 0.3 && G.state.inv.elixir > 0) return { type: 'item', item: 'elixir', target: h };
      if (h.ep < 8 && G.state.inv.cristalM > 0 && Math.random() < 0.3) return { type: 'item', item: 'cristalM', target: h };
      for (const k of ['quarta', 'quatro', 'silencioV', 'milMemorias', 'onda', 'lamina', 'lembranca', 'absorver', 'toque', 'rajada', 'espinhos'])
        if (has(k)) { const tg = T[k].target === 'inimigos' ? 'all' : boss; if (T[k].target === 'inimigos' && en.length === 1 && ['onda', 'milMemorias'].includes(k) && has('lembranca')) continue; return { type: 'tech', tech: k, target: tg }; }
      return { type: 'atk', target: boss };
    };
    G.debug.menuPick = (o, items) => { if (items.length && items[items.length-1].label === 'Sair') return items.length-1; if (o.title === 'Mercadorias') return -1; const i = items.findIndex(it => !it.disabled); return i < 0 ? 0 : i; };
    for (const [n, f] of steps) {
      boost(LV); G.state.inv = { elixir: 2, nectar: 4, cristalM: 2, raiz: 1 };
      const GEAR = { kravenox: ['garraPrata', 'cotaValdora'], thornox: ['cajadoValdora', 'cotaValdora'], lyra: ['cristalLuz', 'cotaValdora'], seraphyne: ['laminaSilencio', 'cotaValdora'] };
      if (process_gear) for (const h of G.state.party) { const g = GEAR[h.id]; h.weapon = g[0]; h.armor = g[1]; D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; }
      const t0 = performance.now();
      try { await Promise.race([G.run(f), new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 150000))]); } catch (e) { log.push('ERR ' + n + ' ' + e.message); }
      if (G.lastError) { log.push('LASTERR ' + n + ' ' + G.lastError.message + ' ' + G.lastError.stack); G.lastError = null; }
      log.push(n + ' ' + Math.round(performance.now() - t0) + 'ms scene=' + (G.scene === G.Field ? 'field:' + G.Field.id : G.scene === G.Dungeon ? 'dun:' + G.Dungeon.id : G.scene === G.Battle ? 'battle' : G.scene === G.Cine ? 'cine' : 'other') + ' party=' + G.state.party.map(h => h.id).join(','));
    }
    log.push('flags ' + Object.keys(G.state.flags).join(','));
    return log;
  }, LV);
  console.log(out.join('\n'));
  console.log(errs.join('\n') || 'no errors');
  await b.close();
})();
