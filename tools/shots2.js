const { chromium } = require('playwright');
const OUT = '/tmp/claude-0/-home-user-kravenox-jogar/9dd476db-c39d-5e6e-9ef6-11785eb3e704/scratchpad/shots2/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 960, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:8765/rpg/?debug'); await p.waitForTimeout(1500);
  await p.evaluate(() => { const G = window.__G; G.overlays.length = 0; G.state = G.data.newState(); const D = G.data; G.state.flags.prata = 1; D.addHero('thornox'); D.addHero('lyra'); D.addHero('seraphyne'); G.state.flags.seraJunta = 1; for (const h of G.state.party) { h.lv = 22; D.recalc(h); h.hp = h.maxhp; } G.debug.noEnc = true; });
  const shot = async (n) => { await p.waitForTimeout(400); const c = await p.$('canvas'); await c.screenshot({ path: OUT + n + '.png' }); };
  const fields = [['valdora', 17, 8]];
  for (const [m, x, y] of fields) { await p.evaluate(([m, x, y]) => { const G = window.__G; G.state.flags.refugiados = 1; G.enterField(m, x, y, 'down'); G.fadeA = 0; }, [m, x, y]); await shot('f_' + m + '_' + x); }
  for (const m of []) { await p.evaluate((m) => { const G = window.__G; G.enterDungeon(m); G.Dungeon.banner = 0; G.fadeA = 0; }, m); await p.waitForTimeout(600); await shot('d_' + m); }
  const battles = [];
  for (const [ids, bg] of battles) {
    await p.evaluate(([ids, bg]) => { const G = window.__G; G.debug.auto = false; G.state.flags.desperto = ids[0] === 'primeiro' ? 1 : 0; G.run(() => G.battle(ids, { bg, noTransition: true })); }, [ids, bg]);
    await p.waitForTimeout(1500); await shot('b_' + ids[0]);
    await p.evaluate(() => { const G = window.__G; G.overlays.length = 0; G.Battle.enemies.forEach(e => { e.alive = false; e.hp = 0; }); });
    await p.keyboard.press('KeyZ'); await p.waitForTimeout(300); await p.keyboard.press('Escape');
    await p.evaluate(() => { const G = window.__G; G.lock = 0; G.overlays.length = 0; G.enterField('guerra', 6, 12, 'down'); });
  }
  const cines = ['ceuAzul'];
  for (const c of cines) {
    await p.evaluate((c) => { const G = window.__G; const C = G.Cine; G.overlays.length = 0; C.begin(c); C.dome = 1; C.eyes = 40; C.eyeOpen = 1; C.sphereR = 34;
      if (c === 'camaraPai') { C.actor('pai', { img: () => G.gfx.imgs.p_pai, x: 160, y: 166, scale: 2, glow: 'rgba(255,200,90,0.9)', glowA: 0.35 }); C.actor('k', { img: () => G.gfx.sprite('kravenoxP', 'up', 0), x: 160, y: 230, z: 6, scale: 1.25, silhouette: '#dfe8ff' }); C.roots = [[-40, -60, 0, 30, -20], [40, -60, 320, 40, 20]].map(([ox, oy, ex, ey, bend]) => ({ on: 'pai', ox, oy, ex, ey, bend, w: 2, color: '#5a5048' })); }
      if (c === 'arvoreBranca') C.actor('mae', { img: () => G.gfx.imgs.p_mae, x: 160, y: 150, scale: 1.3, alpha: 0.85 });
      if (c === 'trono') C.actor('fut', { img: () => G.gfx.imgs.e_kfuturo, x: 160, y: 158, scale: 1.4 });
      if (c === 'coracao') C.actor('h', { img: () => G.gfx.imgs.e_coracao, x: 160, y: 150, scale: 1.1 });
      if (c === 'valdoraColina') C.actor('s', { img: () => G.gfx.imgs.e_seraphyne, x: 160, y: 88, scale: 0.42 });
      C.cap = { text: 'Legenda de teste para conferir o enquadramento.', t: 30 }; }, c);
    await p.waitForTimeout(900); await shot('c_' + c);
  }
  console.log(errs.join('\n') || 'no errors'); await b.close();
})();
