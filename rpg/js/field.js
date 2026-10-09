'use strict';
// Exploração vista de cima (mundo, vila, vale).
(function () {
  const X = G.gfx;
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  G.DIRS = DIRS;

  const Field = G.Field = {
    map: null, id: null, px: 0, py: 0, dir: 'down', mv: null, steps: 0, walkF: 0, dialogTop: false,
    raw(x, y) { const r = this.map.tiles[y]; if (!r || x < 0 || x >= r.length) return null; return r[x]; },
    tile(x, y) { const c = this.raw(x, y); if (c == null) return null; return this.map.sub ? this.map.sub(c) : c; },
    npcs() { return (this.map.npcs || []).filter(n => !n.cond || n.cond()); },
    npcAt(x, y) { return this.npcs().find(n => n.x === x && n.y === y); },
    solid(x, y) {
      const c = this.tile(x, y);
      if (c == null) return true;
      const T = X.TILE[c];
      if (T && T.solid) return true;
      if (this.npcAt(x, y)) return true;
      return false;
    },
  };

  G.enterField = function (id, x, y, dir) {
    const m = G.MAPS[id];
    Field.map = m; Field.id = id; Field.px = x; Field.py = y; Field.dir = dir || Field.dir || 'down'; Field.mv = null; Field.steps = 0;
    G.state.loc = { mode: 'field', map: id, x, y, dir: Field.dir };
    G.scene = Field;
    G.Audio.play(m.music);
  };

  Field.control = function () {
    if (this.mv) return;
    const I = G.Input;
    if (I.pressed.b) { G.run(() => G.fieldMenu()); return; }
    if (I.pressed.a) {
      const [dx, dy] = DIRS[this.dir];
      const tx = this.px + dx, ty = this.py + dy;
      const n = this.npcAt(tx, ty);
      if (n) {
        n.face = ({ up: 'down', down: 'up', left: 'right', right: 'left' })[this.dir];
        G.run(async () => { await G.story[n.talk](n); n.face = null; });
        return;
      }
      const raw = this.raw(tx, ty);
      const name = raw != null && this.map.look && this.map.look[raw];
      if (name && G.story[name]) { G.run(() => G.story[name](tx, ty)); return; }
      const here = this.map.look && this.map.look[this.raw(this.px, this.py)];
      if (here && G.story[here]) { G.run(() => G.story[here](this.px, this.py)); return; }
    }
    for (const d of ['up', 'down', 'left', 'right']) {
      if (I.down(d) || I.pressed[d]) {
        this.dir = d;
        const [dx, dy] = DIRS[d];
        const nx = this.px + dx, ny = this.py + dy;
        if (!this.solid(nx, ny)) { this.mv = { fx: this.px, fy: this.py, t: 0 }; this.px = nx; this.py = ny; }
        else if (I.pressed[d]) G.Audio.sfx('bump');
        break;
      }
    }
  };
  Field.tick = function () {
    if (!this.mv) return;
    this.mv.t += 2;
    if (this.mv.t % 8 === 0) this.walkF++;
    if (this.mv.t >= 16) { this.mv = null; this.onStep(); }
  };
  Field.onStep = function () {
    const st = G.state; st.loc.x = this.px; st.loc.y = this.py; st.loc.dir = this.dir;
    this.steps++;
    const raw = this.raw(this.px, this.py);
    const m = this.map;
    const ev = m.step && m.step[raw];
    if (ev && G.story[ev]) { G.run(() => G.story[ev](this.px, this.py)); return; }
    if (m.enc && m.enc[raw] && this.steps > 3 && !G.debug.noEnc) {
      const rate = (m.encRate && m.encRate[raw]) || m.defRate || 24;
      if (Math.random() < 1 / rate) {
        this.steps = 0;
        const bg = m.bg ? m.bg(raw) : 'planicie';
        G.run(() => G.randomBattle(m.enc[raw], bg));
      }
    }
  };

  Field.draw = function (ctx) {
    const m = this.map, T = 16;
    let fx = this.px, fy = this.py;
    if (this.mv) { const k = this.mv.t / 16; fx = this.mv.fx + (this.px - this.mv.fx) * k; fy = this.mv.fy + (this.py - this.mv.fy) * k; }
    const mw = m.tiles[0].length, mh = m.tiles.length;
    let cx = fx * T + 8 - G.W / 2, cy = fy * T + 8 - G.H / 2;
    cx = mw * T <= G.W ? (mw * T - G.W) / 2 : G.clamp(cx, 0, mw * T - G.W);
    cy = mh * T <= G.H ? (mh * T - G.H) / 2 : G.clamp(cy, 0, mh * T - G.H);
    cx = Math.round(cx); cy = Math.round(cy);
    this.cam = [cx, cy];
    const x0 = Math.floor(cx / T), y0 = Math.floor(cy / T);
    const frame = (G.time >> 5) & 1;
    const talls = [];
    const Wd = G.World, L = m.theme !== 'casa' ? Wd.layer(this) : null;
    if (L) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, G.H); ctx.drawImage(L.canvas, -cx, -cy); }
    for (let y = y0 - 1; y <= y0 + 16; y++) for (let x = x0 - 1; x <= x0 + 21; x++) {
      const c = this.tile(x, y);
      if (c == null) continue;
      if (L) {
        if (Wd.TALL[c]) talls.push({ y, draw: () => Wd.drawTall(ctx, c, x * T - cx, y * T - cy, x, y, m.theme) });
        continue;
      }
      ctx.drawImage(X.tileImg(c, m.theme, x, y, frame), x * T - cx, y * T - cy);
      if (X.TILE[c] && X.TILE[c].tall) talls.push({ y, draw: () => X.drawTall(ctx, c, x * T - cx, y * T - cy, x, y, m.theme) });
    }
    for (const n of this.npcs()) {
      talls.push({ y: n.y + 0.1, draw: () => { const sx = n.x * T - cx, sy = n.y * T - cy; X.drawShadow(ctx, sx, sy);
        const sp = X.SPEC[n.sprite];
        if (sp && sp.ghost) ctx.globalAlpha = 0.7 + 0.2 * Math.sin(G.time / 15);
        const im = X.sprite(n.sprite, n.face || n.dir, (G.time >> 5) & 1 && sp && sp.ghost ? 1 : 0); ctx.drawImage(im, sx + 8 - (im.width >> 1), sy + 15 - im.height + (sp && sp.ghost ? Math.sin(G.time / 20) * 1.5 - 2 : 0)); ctx.globalAlpha = 1; } });
    }
    const lead = G.state.party[0];
    const spr = G.state.flags.prata ? 'kravenoxP' : (lead ? G.data.HEROES[lead.id].sprite : 'kravenox');
    const wf = this.mv ? [1, 0, 2, 0][this.walkF & 3] : 0;
    talls.push({ y: fy + 0.2, draw: () => { const sx = Math.round(fx * T - cx), sy = Math.round(fy * T - cy); X.drawShadow(ctx, sx, sy); const im = X.sprite(spr, this.dir, wf, this.mv ? (this.walkF & 3) : -1); ctx.drawImage(im, sx + 8 - (im.width >> 1), sy + 15 - im.height); } });
    talls.sort((a, b) => a.y - b.y).forEach(t => t.draw());
    if (L) Wd.drawFx(ctx, L, cx, cy);
    // atmosfera
    if (m.theme === 'vale') {
      for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(210,220,235,0.07)'; const yy = ((i * 53 + G.time * 0.15) % (G.H + 40)) - 20; ctx.fillRect(0, yy, G.W, 14 + i * 3); }
    }
    const here = this.raw(this.px, this.py);
    if (m.theme === 'reino') {
      ctx.fillStyle = 'rgba(120,20,20,0.08)'; ctx.fillRect(0, 0, G.W, G.H);
      if (here === 'f' || here === '2' || here === '3') { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0, G.W, G.H); }
    }
    if (m.theme === 'guerra') { ctx.fillStyle = 'rgba(30,10,20,0.1)'; ctx.fillRect(0, 0, G.W, G.H); }
    if (m.theme === 'valdora') { ctx.fillStyle = `rgba(255,80,20,${0.06 + 0.03 * Math.sin(G.time / 9)})`; ctx.fillRect(0, 0, G.W, G.H); }
    if (L) Wd.lightning(ctx, this);
    vignette(ctx);
    if (G.debug.showPos) G.text(ctx, this.px + ',' + this.py, 4, 4, '#fff', 7);
  };
  let vig = null;
  function vignette(ctx) {
    if (!vig) {
      const [c, g] = X.canvas(G.W, G.H);
      const gr = g.createRadialGradient(G.W / 2, G.H / 2, G.H * 0.35, G.W / 2, G.H / 2, G.W * 0.65);
      gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.55)');
      g.fillStyle = gr; g.fillRect(0, 0, G.W, G.H); vig = c;
    }
    ctx.drawImage(vig, 0, 0);
  }
  G.vignette = vignette;
})();
