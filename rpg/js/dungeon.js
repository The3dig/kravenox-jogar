'use strict';
// Masmorras em primeira pessoa no estilo Phantasy Star.
(function () {
  const VEC = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N L S O
  const DIRNAME = ['N', 'L', 'S', 'O'];
  const HZ = 116, CX = 160;
  const Dun = G.Dungeon = { map: null, id: null, x: 1, y: 1, dir: 1, anim: null, steps: 0, dialogTop: true };

  Dun.raw = function (x, y) { const r = this.map.grid[y]; return r ? (r[x] || '#') : '#'; };
  Dun.isWall = function (x, y) {
    const c = this.raw(x, y);
    if (c === '#' || (c >= '0' && c <= '9')) return true;
    if (c === 'G' && !G.state.flags[this.map.gate]) return true;
    return false;
  };
  Dun.chestIndex = function (x, y) {
    let n = 0;
    for (let yy = 0; yy < this.map.grid.length; yy++) for (let xx = 0; xx < this.map.grid[yy].length; xx++) {
      if (this.map.grid[yy][xx] === 'C') { if (xx === x && yy === y) return n; n++; }
    }
    return -1;
  };
  Dun.chestOpen = function (x, y) { return !!G.state.chests[this.id + ':' + x + ',' + y]; };
  Dun.visit = function () {
    const v = G.state.visited[this.id] || (G.state.visited[this.id] = []);
    const k = this.x + ',' + this.y; if (!v.includes(k)) v.push(k);
  };

  G.enterDungeon = function (id, x, y, dir) {
    const m = G.MAPS[id];
    if (x == null) { for (let yy = 0; yy < m.grid.length; yy++) { const i = m.grid[yy].indexOf('S'); if (i >= 0) { x = i; y = yy; } } }
    Dun.map = m; Dun.id = id; Dun.x = x; Dun.y = y; Dun.dir = dir == null ? 1 : dir; Dun.anim = null; Dun.steps = 0;
    // vira para um corredor aberto se estiver de frente para a parede
    for (let i = 0; i < 4 && Dun.isWall(x + VEC[Dun.dir][0], y + VEC[Dun.dir][1]); i++) Dun.dir = (Dun.dir + 1) % 4;
    G.state.loc = { mode: 'dungeon', map: id, x, y, dir: Dun.dir };
    G.scene = Dun; Dun.visit();
    Dun.banner = 150;
    G.Audio.play(m.music);
  };

  Dun.control = function () {
    if (this.anim) return;
    const I = G.Input;
    if (I.pressed.b) { G.run(() => G.fieldMenu()); return; }
    if (I.pressed.a) {
      const [dx, dy] = VEC[this.dir];
      const c = this.raw(this.x + dx, this.y + dy);
      if (c >= '1' && c <= '9' && this.map.voices) { G.run(() => G.story.voz(this.map.voices[c])); return; }
      if (c === 'G' && this.isWall(this.x + dx, this.y + dy)) { G.run(() => G.story.portaoFechado(this.id)); return; }
      if (c === '#') { G.run(() => G.say(null, G.pick(['Pedra fria.', 'Apenas a parede.', 'Nada além de escuridão.']))); return; }
      return;
    }
    if (I.nav('left')) { this.dir = (this.dir + 3) % 4; this.anim = { type: 'turn', t: 0, s: -1 }; G.Audio.sfx('step'); }
    else if (I.nav('right')) { this.dir = (this.dir + 1) % 4; this.anim = { type: 'turn', t: 0, s: 1 }; G.Audio.sfx('step'); }
    else if (I.pressed.down) { this.dir = (this.dir + 2) % 4; this.anim = { type: 'turn', t: 0, s: 1 }; G.Audio.sfx('step'); }
    else if (I.down('up') || I.pressed.up) {
      const [dx, dy] = VEC[this.dir];
      if (this.isWall(this.x + dx, this.y + dy)) { if (I.pressed.up) { G.Audio.sfx('bump'); G.shake = 4; } }
      else { this.anim = { type: 'move', t: 0 }; G.Audio.sfx('step'); }
    }
  };
  Dun.tick = function () {
    if (this.banner > 0) this.banner--;
    const a = this.anim; if (!a) return;
    a.t += a.type === 'move' ? 0.125 : 0.25;
    if (a.t >= 1) {
      this.anim = null;
      if (a.type === 'move') { const [dx, dy] = VEC[this.dir]; this.x += dx; this.y += dy; this.onStep(); }
      G.state.loc.x = this.x; G.state.loc.y = this.y; G.state.loc.dir = this.dir;
    }
  };
  Dun.onStep = function () {
    this.visit(); this.steps++;
    const c = this.raw(this.x, this.y);
    const ev = this.map.ev[c];
    if (ev && G.story[ev]) { G.run(() => G.story[ev](this.x, this.y)); return; }
    if (c === 'C' && !this.chestOpen(this.x, this.y)) { G.run(() => G.story.bau(this.id, this.x, this.y, this.map.chests[this.chestIndex(this.x, this.y)])); return; }
    if (c === 'H') { G.run(() => G.story.cristalDescanso()); return; }
    if (this.steps > 3 && !G.debug.noEnc && Math.random() < 1 / this.map.rate) {
      this.steps = 0;
      G.run(() => G.randomBattle(this.map.enc(this.x, this.y), this.map.bg));
    }
  };

  // ---------- Renderização ----------
  const sc = k => 1 / (0.5 + 0.85 * Math.max(k, -0.5));
  const hw = k => 150 * sc(k);
  const hh = k => 112 * sc(k);
  const sx = (L, k) => CX + L * 2 * hw(k);
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgb(' + Math.round(r * f) + ',' + Math.round(g * f) + ',' + Math.round(b * f) + ')';
  }
  const fogF = k => G.clamp(1.25 - k * 0.19, 0.16, 1.15);

  function front(ctx, col, L, k, kind) {
    const x0 = sx(L - 0.5, k), x1 = sx(L + 0.5, k), y0 = HZ - hh(k), y1 = HZ + hh(k);
    const f = fogF(k);
    ctx.fillStyle = shade(kind === 'gate' ? '#3a2a10' : col.wall, f); ctx.fillRect(x0, y0, x1 - x0 + 0.5, y1 - y0);
    ctx.strokeStyle = shade(col.line, f); ctx.lineWidth = Math.max(0.5, sc(k) * 1.2);
    ctx.beginPath();
    const rows = 5;
    for (let i = 1; i < rows; i++) { const y = y0 + (y1 - y0) * i / rows; ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
    for (let i = 0; i < rows; i++) { const ya = y0 + (y1 - y0) * i / rows, yb = y0 + (y1 - y0) * (i + 1) / rows; const off = (i % 2) ? 0.25 : 0.75; const x = x0 + (x1 - x0) * off; ctx.moveTo(x, ya); ctx.lineTo(x, yb); }
    ctx.stroke();
    ctx.fillStyle = shade(col.wallD, f); ctx.fillRect(x0, y1 - (y1 - y0) * 0.04, x1 - x0, (y1 - y0) * 0.04);
    // veios de cor do tema
    ctx.strokeStyle = col.acc; ctx.globalAlpha = 0.18 * f; ctx.lineWidth = Math.max(0.5, sc(k));
    ctx.beginPath(); const vx = x0 + (x1 - x0) * 0.62; ctx.moveTo(vx, y0); ctx.lineTo(vx - (x1 - x0) * 0.1, y0 + (y1 - y0) * 0.4); ctx.lineTo(vx + (x1 - x0) * 0.05, y1); ctx.stroke(); ctx.globalAlpha = 1;
    if (kind === 'voice') {
      const cx = (x0 + x1) / 2, cy = HZ - hh(k) * 0.1, s = sc(k) * 14;
      G.gfx.glow(ctx, cx, cy, s * 2.2, col.acc, (0.5 + 0.3 * Math.sin(G.time / 12)) * f);
      ctx.fillStyle = shade('#ffffff', f * 0.9); ctx.beginPath(); ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s * 0.4, cy); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s * 0.4, cy); ctx.fill();
    }
    if (kind === 'gate') {
      ctx.strokeStyle = shade('#120806', f); ctx.lineWidth = Math.max(1, sc(k) * 4);
      ctx.beginPath(); for (let i = 0; i < 6; i++) { const xx = x0 + (x1 - x0) * (i + 0.5) / 6; ctx.moveTo(xx, y0); ctx.bezierCurveTo(xx + 10 * sc(k), HZ - 20 * sc(k), xx - 10 * sc(k), HZ + 20 * sc(k), xx, y1); } ctx.stroke();
      G.gfx.glow(ctx, (x0 + x1) / 2, HZ, hh(k) * 0.6, col.acc, 0.25 * f);
    }
  }
  function side(ctx, col, L, k0, k1, kind) {
    const f0 = fogF(k0), f1 = fogF(k1), f = (f0 + f1) / 2 * 0.78;
    const xa = sx(L, k0), xb = sx(L, k1);
    ctx.fillStyle = shade(kind === 'gate' ? '#3a2a10' : col.wall, f);
    ctx.beginPath(); ctx.moveTo(xa, HZ - hh(k0)); ctx.lineTo(xb, HZ - hh(k1)); ctx.lineTo(xb, HZ + hh(k1)); ctx.lineTo(xa, HZ + hh(k0)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = shade(col.line, f); ctx.lineWidth = Math.max(0.5, sc(k0) * 1.1);
    ctx.beginPath();
    for (let i = 1; i < 5; i++) { const t = i / 5; ctx.moveTo(xa, HZ - hh(k0) + 2 * hh(k0) * t); ctx.lineTo(xb, HZ - hh(k1) + 2 * hh(k1) * t); }
    const km = (k0 + k1) / 2, xm = sx(L, km);
    ctx.moveTo(xm, HZ - hh(km)); ctx.lineTo(xm, HZ + hh(km));
    ctx.stroke();
    if (kind === 'voice') G.gfx.glow(ctx, xm, HZ - hh(km) * 0.1, sc(km) * 22, col.acc, 0.4 * f);
  }
  function objectAt(ctx, col, c, k, x, y) {
    const s = sc(k), f = fogF(k), cx = CX, by = HZ + hh(k) * 0.98;
    if (c === 'C') {
      const open = Dun.chestOpen(x, y);
      const w = 70 * s, h = 40 * s;
      ctx.fillStyle = shade('#4a2e1a', f); ctx.fillRect(cx - w / 2, by - h, w, h);
      ctx.fillStyle = shade('#2e1c10', f); ctx.fillRect(cx - w / 2, by - h * 0.55, w, h * 0.08);
      ctx.fillStyle = shade('#c9a24a', f); ctx.fillRect(cx - w * 0.08, by - h * 0.62, w * 0.16, h * 0.22);
      if (open) { ctx.fillStyle = shade('#1a1008', f); ctx.fillRect(cx - w / 2, by - h * 1.25, w, h * 0.3); }
      else { ctx.fillStyle = shade('#5a3a20', f); ctx.beginPath(); ctx.ellipse(cx, by - h, w / 2, h * 0.35, 0, Math.PI, 0); ctx.fill(); }
    } else if (c === 'H') {
      const yy = HZ - hh(k) * 0.15 + Math.sin(G.time / 20) * 6 * s, r = 22 * s;
      G.gfx.glow(ctx, cx, yy, r * 3, 'rgba(255,220,120,0.9)', 0.5 * f);
      ctx.fillStyle = shade('#ffe08a', f); ctx.beginPath(); ctx.moveTo(cx, yy - r * 1.4); ctx.lineTo(cx + r * 0.6, yy); ctx.lineTo(cx, yy + r * 1.4); ctx.lineTo(cx - r * 0.6, yy); ctx.fill();
      ctx.fillStyle = shade('#ffffff', f); ctx.fillRect(cx - 1, yy - r, 2 * s, r * 0.9);
    } else if (c === 'U') {
      G.gfx.glow(ctx, cx, HZ - hh(k) * 0.9, hh(k) * 1.2, 'rgba(255,120,80,0.7)', 0.6 * f);
      for (let i = 0; i < 6; i++) { const w = 120 * s * (1 - i * 0.08), yy = by - i * 14 * s; ctx.fillStyle = shade('#5a4a4a', f * (1 - i * 0.08)); ctx.fillRect(cx - w / 2, yy - 6 * s, w, 6 * s); }
    } else if (c === 'b' || c === 'f') {
      const yy = HZ;
      G.gfx.glow(ctx, cx, yy, hh(k) * 0.9, c === 'f' ? 'rgba(255,224,138,0.8)' : 'rgba(120,0,30,0.9)', (0.35 + 0.15 * Math.sin(G.time / 15)) * f);
    } else if ('aelrd'.includes(c)) {
      for (let i = 0; i < 5; i++) { const a = G.time / 30 + i * 1.3; ctx.fillStyle = col.acc; ctx.globalAlpha = 0.6 * f; ctx.fillRect(cx + Math.cos(a) * 30 * s, HZ + Math.sin(a * 1.3) * 30 * s, 2 * s + 0.5, 2 * s + 0.5); }
      ctx.globalAlpha = 1;
    }
  }

  Dun.draw = function (ctx) {
    const col = this.map.col;
    // céu e chão
    let gr = ctx.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, col.ceil); gr.addColorStop(1, '#000'); ctx.fillStyle = gr; ctx.fillRect(0, 0, G.W, HZ);
    gr = ctx.createLinearGradient(0, HZ, 0, G.H); gr.addColorStop(0, '#000'); gr.addColorStop(1, col.floor); ctx.fillStyle = gr; ctx.fillRect(0, HZ, G.W, G.H - HZ);
    let off = 0, dir = this.dir;
    const a = this.anim;
    if (a && a.type === 'move') off = a.t;
    const [fx, fy] = VEC[dir], [rx, ry] = VEC[(dir + 1) % 4];
    const cell = (i, j) => [this.x + fx * i + rx * j, this.y + fy * i + ry * j];
    const kindOf = (x, y) => { const c = this.raw(x, y); if (c >= '1' && c <= '9') return 'voice'; if (c === 'G') return 'gate'; return 'wall'; };
    // linhas do chão
    ctx.strokeStyle = shade(col.line, 0.6); ctx.lineWidth = 0.6;
    ctx.beginPath(); for (let k = 1; k < 7; k++) { const y = HZ + hh(k - off); ctx.moveTo(0, y); ctx.lineTo(G.W, y); } ctx.stroke();
    // profundidade máxima visível
    let maxD = 6;
    for (let i = 1; i < 6; i++) { const [x, y] = cell(i, 0); if (this.isWall(x, y)) { maxD = i; break; } }
    for (let i = maxD; i >= 0; i--) {
      const k0 = i - off, k1 = i + 1 - off;
      for (const j of [-3, 3, -2, 2, -1, 1]) {
        const [x, y] = cell(i, j);
        if (!this.isWall(x, y)) continue;
        if (i >= 1) front(ctx, col, j, k0, kindOf(x, y));
        const L = j < 0 ? j + 0.5 : j - 0.5;
        // face lateral só é visível se a célula vizinha (mais ao centro) estiver aberta
        const [nx, ny] = cell(i, j < 0 ? j + 1 : j - 1);
        if (!this.isWall(nx, ny) && i < maxD) side(ctx, col, L, k0, k1, kindOf(x, y));
      }
      const [x, y] = cell(i, 0);
      if (i >= 1 && this.isWall(x, y)) { front(ctx, col, 0, k0, kindOf(x, y)); continue; }
      const c = this.raw(x, y);
      if (i >= 1 && (c === 'C' || c === 'H' || c === 'U' || c === 'b' || c === 'f' || 'aelrd'.includes(c))) {
        const done = c !== 'C' && c !== 'H' && c !== 'U' && G.story.evDone && G.story.evDone(this.id, c);
        if (!done) objectAt(ctx, col, c, i + 0.5 - off, x, y);
      }
    }
    if (a && a.type === 'turn') { ctx.fillStyle = 'rgba(0,0,0,' + (0.6 * (1 - a.t)) + ')'; ctx.fillRect(0, 0, G.W, G.H); }
    G.vignette(ctx);
    this.drawHUD(ctx);
  };
  Dun.drawHUD = function (ctx) {
    // bússola
    G.win(ctx, CX - 13, 4, 26, 15);
    G.text(ctx, DIRNAME[this.dir], CX, 7, '#ffcf6a', 8, 'center', true);
    // minimapa
    const v = G.state.visited[this.id] || [];
    const g = this.map.grid, s = 3, mw = g[0].length * s, mh = g.length * s;
    const ox = G.W - mw - 6, oy = 4;
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(ox - 2, oy - 2, mw + 4, mh + 4);
    const seen = new Set(v);
    for (const k of v) {
      const [x, y] = k.split(',').map(Number);
      ctx.fillStyle = 'rgba(200,170,140,0.55)'; ctx.fillRect(ox + x * s, oy + y * s, s, s);
      for (const [dx, dy] of VEC) { const nx = x + dx, ny = y + dy; if (!seen.has(nx + ',' + ny) && this.isWall(nx, ny)) { ctx.fillStyle = 'rgba(120,90,80,0.8)'; ctx.fillRect(ox + nx * s, oy + ny * s, s, s); } }
      const c = this.raw(x, y);
      if (c === 'H') { ctx.fillStyle = '#ffe08a'; ctx.fillRect(ox + x * s, oy + y * s, s, s); }
      if (c === 'U') { ctx.fillStyle = '#ff7a50'; ctx.fillRect(ox + x * s, oy + y * s, s, s); }
    }
    if ((G.time >> 3) & 1 || true) {
      ctx.fillStyle = '#ff3a2a'; ctx.fillRect(ox + this.x * s, oy + this.y * s, s, s);
      const [dx, dy] = VEC[this.dir]; ctx.fillStyle = '#fff'; ctx.fillRect(ox + this.x * s + 1 + dx, oy + this.y * s + 1 + dy, 1, 1);
    }
    if (this.banner > 0) {
      ctx.globalAlpha = Math.min(1, this.banner / 30);
      G.win(ctx, 8, 4, 120, 17); G.text(ctx, this.map.name, 14, 8, '#efe3cf', 8);
      ctx.globalAlpha = 1;
    }
  };
})();
