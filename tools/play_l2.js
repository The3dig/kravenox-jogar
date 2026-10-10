// Joga o Livro II inteiro, do começo ao FIM, com progressão natural: lutas aleatórias em cada região,
// compras nas lojas, descanso nos santuários, e as escolhas certas nas batalhas de "Escolher".
// Uso: (servidor na porta 8765) NODE_PATH=/opt/node-tools/node_modules node tools/play_l2.js   [GRIND=5]
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 760 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message + '\n' + e.stack));
  p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
  await p.goto('http://localhost:8765/rpg/?debug');
  await p.waitForTimeout(2000);
  const GRIND = +(process.env.GRIND || 5);
  let shown = 0; const timer = setInterval(async () => { try { const l = await p.evaluate(() => window.__log || []); for (; shown < l.length; shown++) console.log(l[shown]); } catch (e) {} }, 3000);
  const out = await p.evaluate(async (GRIND) => {
    const G = window.__G, D = G.data, S = G.story, log = window.__log = [];
    G.overlays.length = 0; G.debug.auto = true; G.debug.fast = true; G.debug.noEnc = true;
    try { localStorage.clear(); } catch (e) {}
    G.book = 2; G.state = D.newState2(); G.titleScreen = () => { log.push('   (título)'); }; let gameovers = 0; G.gameOver = async () => { gameovers++; log.push('*** GAME OVER'); };
    const T = D.TECHS;
    let chooseTries = 0;
    const origBattle = G.battle;
    G.battle = async (ids, o) => { chooseTries = 0; const t0 = performance.now(); const r = await origBattle(ids, o); const boss = ids.some(i => D.ENEMIES[i].boss);
      log.push((boss ? ' ★ ' : '   ') + ids.join('+') + ' r=' + G.Battle.round + ' lv=' + G.state.party.map(h => h.id.slice(0, 3) + h.lv).join(',') + ' hp=' + G.state.party.map(h => Math.round(100 * h.hp / h.maxhp)).join('/') + '%'); return r; };
    G.debug.battlePick = (h, B) => {
      const P = G.state.party, al = P.filter(x => x.alive), en = B.enemies.filter(e => e.alive), inv = G.state.inv;
      const has = k => D.techsOf(h).includes(k) && h.ep >= T[k].ep;
      const ch = B.opt.choose; if (ch && (!ch.who || ch.who === h.id) && (!ch.when || ch.when(B)) && !(en[0] && en[0].immune === false && 0)) {
        const n = ch.options.length; const i = (n - 1 - (chooseTries % n) + n) % n; chooseTries++; if (chooseTries > 1 || B.round > 1 || true) return { type: 'choose', opt: i }; }
      const low = al.filter(x => x.hp < x.maxhp * 0.45), dead = P.filter(x => !x.alive);
      const boss = en.slice().sort((a, b) => b.hp - a.hp)[0];
      for (const k of ['novaPorta', 'eco', 'criar']) if (dead.length && has(k)) return { type: 'tech', tech: k, target: dead[0] };
      if (dead.length && inv.folha > 0) return { type: 'item', item: 'folha', target: dead[0] };
      if (dead.length && inv.raiz > 0) return { type: 'item', item: 'raiz', target: dead[0] };
      if (low.length >= 2) for (const k of ['paginaBranca', 'auroraMaior', 'lagrimaOrigem', 'aurora', 'voltem', 'memoriaColetiva', 'cristalMem', 'quintaMarca', 'memoria']) if (has(k)) return { type: 'tech', tech: k, target: 'all' };
      if (low.length) for (const k of ['abraco', 'luz']) if (has(k)) return { type: 'tech', tech: k, target: low[0] };
      if (h.hp < h.maxhp * 0.3) for (const it of ['orvalho', 'paoReino', 'agua', 'elixir']) if (inv[it] > 0) return { type: 'item', item: it, target: h };
      if (h.ep < 14) for (const it of ['cristalEsc', 'cristalG', 'cristalM']) if (inv[it] > 0 && Math.random() < 0.5) return { type: 'item', item: it, target: h };
      if (en.every(e => e.immune)) return { type: 'guard' };
      const multi = en.length > 1;
      const order = multi ? ['luzSombra', 'tresForcas', 'milEstrelas', 'luzCompleta', 'portaisGuerra', 'possibilidades', 'espinhosLivres', 'quatro', 'silencioV', 'onda', 'milMemorias', 'esmagamento']
        : ['toqueOrigem', 'asas', 'luzPropria', 'primeiraEstrela', 'laminaAntiga', 'lamina', 'espelho', 'lembranca', 'possibilidades', 'absorver', 'toque', 'rajada', 'espinhos'];
      for (const k of order) if (has(k)) return { type: 'tech', tech: k, target: T[k].target === 'inimigos' ? 'all' : boss };
      return { type: 'atk', target: boss };
    };
    const CORRECT = ['Acabar com o trono', 'Transformar', 'NÃO SEI', 'Continuar sendo Thornox', 'Ninguém', 'RECOMEÇAR', 'CONTINUAR', 'Não escrever nada'];
    G.debug.menuPick = (o, items) => {
      if (o.title === 'Mercadorias') return -1;
      if (items.length && items[items.length - 1].label === 'Sair') return items.length - 1;
      const cc = items.findIndex(it => it.label === 'CONTINUAR'); if (cc >= 0) return cc; const c = items.findIndex(it => CORRECT.includes(it.label)); if (c >= 0) return c;
      const i = items.findIndex(it => !it.disabled); return i < 0 ? 0 : i;
    };
    // compra o melhor equipamento que puder e alguns remédios
    const SHOPS = {
      escolha: ['garraEscolha', 'cajadoEscolha', 'cristalReino', 'laminaPortal', 'cotaReino'],
      espinhos: ['garraEspinhos', 'cajadoBranco', 'laminaFronteira', 'marcaViva', 'mantoEspinhos'],
      vila: ['garraEspinhos', 'cajadoBranco', 'marcaViva', 'mantoEspinhos', 'laminaAuren'],
      auren: ['garraLivre', 'cajadoLivro', 'marcaLivre', 'laminaAuren', 'mantoAuren'],
    };
    function shop(name, potions) {
      const st = G.state;
      for (const k of SHOPS[name]) { const e = D.EQUIP[k];
        for (const h of st.party) { if (e.who && e.who !== h.id) continue; const slot = e.slot === 'arma' ? 'weapon' : 'armor'; const cur = D.EQUIP[h[slot]] || {};
          const val = x => (x.atk || 0) + (x.mag || 0) + (x.def || 0);
          if (val(e) > val(cur) && st.fr >= e.price) { st.fr -= e.price; h[slot] = k; D.recalc(h); log.push('   compra ' + e.name + ' p/ ' + h.id); } } }
      for (const [it, n] of potions) { while ((st.inv[it] || 0) < n && st.fr >= D.ITEMS[it].price) { st.fr -= D.ITEMS[it].price; D.give(it); } }
    }
    const rest = () => { D.healAll(); };
    async function grind(table, bg, n = GRIND) { for (let i = 0; i < n; i++) { const grp = G.pick(D.ENC[table]); await G.battle(grp, { bg }); } }
    const pot1 = [['paoReino', 6], ['cristalEsc', 4], ['folha', 2]], pot2 = [['orvalho', 6], ['cristalEsc', 5], ['folha', 3]], pot3 = [['orvalho', 8], ['cristalEsc', 6], ['folha', 3], ['lanterna', 2]];
    const steps = [
      ['livro2', () => S.livro2()], ['chegada', () => S.portoesEscolha()], ['loja', () => shop('escolha', pot1)], ['grindE', () => grind('escolha', 'escolha', 3)],
      ['tuneis', () => S.entrarTuneis()], ['grindT', () => grind('tuneis', 'tuneis')], ['simbolos', () => S.simbolosTunel()], ['portaQuinta', () => S.portaQuinta()],
      ['loja2', () => { rest(); shop('escolha', pot1); }], ['guerra', () => S.portoesEscolha()], ['grindG', () => grind('guerraMundos', 'guerraMundos')], ['loja3', () => { rest(); shop('escolha', pot1); }],
      ['reiAsas', () => S.portoesEscolha()], ['grindPM', () => grind('primeiroMundo', 'primeiroMundo')], ['paiMem', () => S.encontroPaiMemoria()], ['palacio', () => S.entrarPalacio()],
      ['grindPal', () => grind('primeiroMundo', 'palacio')], ['descanso', rest], ['trono', () => S.tronoPrimeiroRei()],
      ['loja4', () => { rest(); shop('escolha', pot1); }], ['norte', () => S.sairNorteEscolha()], ['grindN', () => grind('norte', 'norte')], ['semEss', () => S.semEssencia()], ['coluna', () => S.colunaSozinha()],
      ['criatura', () => S.criaturaCinzenta()], ['cidade', () => S.cidadeAparece()], ['entrarCid', () => S.entrarCidadeAster()], ['descanso2', rest], ['aster', () => S.torreAster(16, 3)],
      ['loja5', () => { rest(); shop('escolha', pot1); }], ['prisao', () => S.torreAster(16, 3)], ['grindEntre', () => grind('entre', 'entre', 3)], ['irmao', () => S.irmaoCrianca()], ['mae', () => S.maeCorrentes()],
      // Parte 2 (começa sozinha pelos créditos)
      ['paiMuralha', () => S.paiNaMuralha()], ['portal', () => S.portalMundoNovo()], ['grindMN', () => grind('mundoNovo', 'mundoNovo')], ['pegadas', () => S.pegadasEstrada()], ['cidadeMont', () => S.cidadeMontanha()],
      ['espinhos', () => S.entrarEspinhos()], ['patrulha', () => S.estradaMontanha()], ['grindEsp', () => grind('espinhos', 'espinhos')], ['praca', () => S.pracaEspinhos()], ['loja6', () => { rest(); shop('espinhos', pot2); }],
      ['templo', () => S.temploEspinhos()], ['arvore', () => S.entrarArvoreBranca()], ['grindAB', () => grind('arvoreBranca', 'arvoreBranca')], ['descanso3', rest], ['portaUltimo', () => S.portaUltimoMundo()],
      ['sera', () => S.despedidaSeraphyne()], ['loja7', () => shop('vila', pot2)], ['noite', () => S.mulherVila()], ['torreBib', () => S.torreBiblioteca()], ['grindBib', () => grind('biblioteca', 'biblioteca')],
      ['livros', () => S.livrosIrmaos()], ['bibliotecario', () => S.bibliotecario()], ['livroK', () => S.livroKravenox()], ['descanso4', rest], ['leitor', () => S.primeiroLeitorChega()],
      // Parte 3
      ['loja8', () => shop('auren', pot3)], ['jantar', () => S.hospedaria()], ['cratera', () => S.crateraEstrela()], ['grindAur', () => grind('auren', 'auren')], ['banco', () => S.bancoLivro()], ['paiAuren', () => S.paiMuralhaAuren()],
      ['grindDest', () => grind('destino', 'destino', 2)], ['personagem', () => S.primeiroPersonagem()], ['memPais', () => S.memoriaPais()], ['memFonte', () => S.memoriaFonteK()], ['silencio', () => S.silencioChora()], ['escolhaT', () => S.escolhaThornox()],
      ['grindEst', () => grind('estrelas', 'estrelas')], ['portaFicar', () => S.portaFicar()], ['estatua', () => S.estatuaUltimo()], ['grindDentro', () => grind('dentroThornox', 'dentro')], ['bebes', () => S.doisBebes()],
      ['leitorExp', () => S.leitorExplica()], ['portaAbre', () => S.portaAbre()], ['grindSolo', () => grind('dentroSolo', 'dentro', 2)], ['fonte', () => S.luzFonte()], ['descanso5', rest], ['ajoelhado', () => S.thornoxAjoelhado()],
      ['loja9', () => { rest(); shop('auren', pot3); }], ['sairAuren', () => S.sairAuren()], ['grindCF', () => grind('caminhoFim', 'caminhoFim')], ['ponte', () => S.ponteRio()], ['casa', () => S.casaAbandonada()], ['descanso6', rest], ['pagina', () => S.ultimaPagina()],
      ['loja10', () => shop('auren', pot3)], ['estatuaLivro', () => S.estatuaLivro()], ['menina', () => S.meninaDesenho()], ['montanhas', () => S.irMontanhas()], ['grindMont', () => grind('montanhas', 'montanhas')], ['liora', () => S.lioraSegue()],
      ['descanso7', rest], ['montanha', () => S.montanhaAbre()], ['loja11', () => { rest(); shop('auren', pot3); }], ['senhora', () => S.casaSenhora()], ['grindAN', () => grind('arvoreNomes', 'arvoreNomes')], ['descanso8', rest], ['arvoreNomes', () => S.arvoreDosNomes()],
      ['grindCA', () => grind('chamasAzuis', 'chamasAzuis')], ['descanso9', rest], ['ultimo', () => S.ultimoInimigoAparece()], ['plantar', () => S.plantarSemente()], ['casa2', () => S.voltarParaCasa()], ['colina', () => S.colinaFinal()],
    ];
    // alcance: a partir da posição atual, todo NPC visível e todo gatilho do mapa precisa ser alcançável a pé
    const seenReach = new Set();
    function reach(n) {
      const bfs = (sx, sy, blocked, W, H) => { const ok = new Set([sx + ',' + sy]), q = [[sx, sy]];
        while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (nx < 0 || ny < 0 || nx >= W || ny >= H || ok.has(k) || blocked(nx, ny)) continue; ok.add(k); q.push([nx, ny]); } } return ok; };
      const bad = [];
      if (G.scene === G.Field) { const F = G.Field, m = F.map, H = m.tiles.length, W = Math.max(...m.tiles.map(r => r.length));
        const ok = bfs(F.px, F.py, (x, y) => F.solid(x, y), W, H);
        const adj = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => ok.has((x + dx) + ',' + (y + dy)));
        for (const npc of F.npcs()) if (npc.talk && !adj(npc.x, npc.y)) bad.push('npc ' + npc.id + '@' + npc.x + ',' + npc.y);
        for (let y = 0; y < H; y++) for (let x = 0; x < (m.tiles[y] || '').length; x++) { const raw = m.tiles[y][x]; if (m.step && m.step[raw] && !ok.has(x + ',' + y)) { const T = G.gfx.TILE[F.tile(x, y)]; if (!(T && T.solid)) bad.push('step ' + raw + '(' + m.step[raw] + ')@' + x + ',' + y); } }
        if (bad.length) { const k = F.id + bad.join(); if (!seenReach.has(k)) { seenReach.add(k); log.push('!! ALCANCE ' + n + ' field:' + F.id + ' de ' + F.px + ',' + F.py + ': ' + bad.join(' ')); } } }
      else if (G.scene === G.Dungeon) { const Dn = G.Dungeon, gr = Dn.map.grid, H = gr.length, W = Math.max(...gr.map(r => r.length));
        const ok = bfs(Dn.x, Dn.y, (x, y) => Dn.isWall(x, y), W, H);
        for (let y = 0; y < H; y++) for (let x = 0; x < gr[y].length; x++) { const c = gr[y][x]; if ((c === 'C' || c === 'S' || c === 'H' || (Dn.map.ev && Dn.map.ev[c])) && !ok.has(x + ',' + y)) bad.push(c + '@' + x + ',' + y); }
        if (bad.length) { const k = Dn.id + bad.join(); if (!seenReach.has(k)) { seenReach.add(k); log.push('!! ALCANCE ' + n + ' dun:' + Dn.id + ' de ' + Dn.x + ',' + Dn.y + ': ' + bad.join(' ')); } } }
    }
    for (const [n, f] of steps) {
      const t0 = performance.now();
      try { await Promise.race([G.run(f), new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 240000))]); } catch (e) { log.push('ERR ' + n + ' ' + (e && e.message || e)); }
      if (gameovers) { gameovers = 0; const pend = G.state.pend; log.push('   ...recarregando do ponto de retorno ' + pend); D.healAll(); if (pend && S[pend]) { try { await G.run(() => S[pend]()); } catch (e) {} if (gameovers) log.push('*** perdeu de novo'); gameovers = 0; } }
      if (G.lastError) { log.push('LASTERR ' + n + ' ' + G.lastError.message + ' ' + G.lastError.stack); G.lastError = null; }
      try { reach(n); } catch (e) { log.push('reachERR ' + e.message); }
      const sc = G.scene === G.Field ? 'field:' + G.Field.id : G.scene === G.Dungeon ? 'dun:' + G.Dungeon.id : G.scene === G.Battle ? 'battle' : G.scene === G.Cine ? 'cine' : 'other';
      log.push(n + ' ' + Math.round(performance.now() - t0) + 'ms ' + sc + ' party=' + G.state.party.map(h => h.id + h.lv).join(',') + ' fr=' + G.state.fr + (G.state.pend ? ' PEND=' + G.state.pend : ''));
    }
    const f = G.state.flags;
    log.push('FIM=' + !!f.l2fim + ' p1=' + !!f.l2p1fim + ' p2=' + !!f.l2p2fim + ' tempo(min)=' + Math.round(G.state.time / 60));
    return log;
  }, GRIND);
  clearInterval(timer); for (; shown < out.length; shown++) console.log(out[shown]);
  console.log(errs.join('\n') || 'no errors');
  await b.close();
})();
