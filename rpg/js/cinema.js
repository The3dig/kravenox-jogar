'use strict';
// Cenas cinematográficas: faixas de cinema, atores, feixes, raízes, partículas e legendas.
(function () {
  const X = G.gfx;
  const C = G.Cine = { dialogTop: true };

  function reset() {
    C.t = 0; C.bars = 0; C.actors = {}; C.beams = []; C.roots = []; C.parts = []; C.cap = null; C.white = 0; C.bg = null; C.tweens = [];
  }
  reset();

  const ease = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  C.tween = function (obj, to, frames) {
    return new Promise(res => {
      const from = {}; for (const k in to) from[k] = obj[k] == null ? 0 : obj[k];
      C.tweens.push({ obj, from, to, f: 0, n: Math.max(1, G.debug.fast ? 1 : frames), res });
    });
  };
  C.actor = function (id, props) { C.actors[id] = Object.assign(C.actors[id] || { alpha: 1, scale: 1, z: 0 }, props); return C.actors[id]; };
  C.wait = n => G.wait(n);

  C.begin = async function (bg, music) {
    C.prev = G.scene; reset(); C.bg = bg; G.scene = C;
    if (music) G.Audio.play(music);
    await C.tween(C, { bars: 1 }, 30);
  };
  C.end = async function () {
    C.cap = null;
    await C.tween(C, { bars: 0 }, 24);
    G.scene = C.prev;
  };
  // legenda dentro da faixa de baixo; espera A (ou some sozinha no modo automático)
  // texto longo vira páginas de duas linhas (cada página espera A)
  let measure = null;
  C.caption = async function (text, minFrames = 50) {
    if (!measure) measure = X.canvas(8, 8)[1];
    const ls = G.wrap(measure, text, G.W - 30, 8.5), pages = [];
    for (let i = 0; i < ls.length; i += 2) pages.push(ls.slice(i, i + 2).join('\n'));
    for (let p = 0; p < pages.length; p++) await capPage(pages[p], p < pages.length - 1 ? Math.min(minFrames, 40) : minFrames);
  };
  function capPage(text, minFrames) {
    return new Promise(res => {
      C.cap = { text, t: 0 };
      let t = 0;
      const ov = { update() { t++; if (G.debug.auto || (t > minFrames && (G.Input.pressed.a || G.Input.pressed.b)) || t > minFrames + 420) { G.pop(ov); if (C.cap && C.cap.text === text) C.cap = null; res(); } }, draw() {} };
      G.push(ov);
    });
  }
  C.burst = function (x, y, n, color, o = {}) {
    for (let i = 0; i < n; i++) {
      const a = o.up ? -Math.PI / 2 + (Math.random() - 0.5) * (o.spread || 1.2) : Math.random() * Math.PI * 2;
      const sp = (o.speed || 1.5) * (0.4 + Math.random());
      C.parts.push({ x: x + (Math.random() - 0.5) * (o.w || 0), y: y + (Math.random() - 0.5) * (o.h || 0), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: (o.life || 60) * (0.6 + Math.random() * 0.6), t: 0, color, size: o.size || 1, grav: o.grav || 0, drag: o.drag || 0.98 });
    }
  };

  C.tick = function () {
    C.t++;
    for (let i = C.tweens.length - 1; i >= 0; i--) {
      const w = C.tweens[i]; w.f++;
      const k = ease(Math.min(1, w.f / w.n));
      for (const key in w.to) w.obj[key] = w.from[key] + (w.to[key] - w.from[key]) * k;
      if (w.f >= w.n) { C.tweens.splice(i, 1); w.res(); }
    }
    for (const p of C.parts) { p.t++; p.x += p.vx; p.y += p.vy; p.vy += p.grav; p.vx *= p.drag; p.vy *= p.drag; if (p.target) { p.x += (p.target[0] - p.x) * 0.06; p.y += (p.target[1] - p.y) * 0.06; } }
    C.parts = C.parts.filter(p => p.t < p.life);
    if (C.cap) C.cap.t++;
    if (C.white > 0 && !C.holdWhite) C.white = Math.max(0, C.white - 0.02);
  };

  // ---------- cenários ----------
  const cache = {};
  const silCache = new Map();
  const BGS = {
    // A Fonte: árvore de cristal com milhares de olhos
    fonte(ctx, t) {
      if (!cache.fonte) {
        const [c, g] = X.canvas(G.W, G.H);
        let gr = g.createLinearGradient(0, 0, 0, G.H); gr.addColorStop(0, '#05030a'); gr.addColorStop(0.55, '#1a1206'); gr.addColorStop(1, '#050302'); g.fillStyle = gr; g.fillRect(0, 0, G.W, G.H);
        const r = X.rng(7);
        g.strokeStyle = '#2a1e08'; g.lineCap = 'round';
        for (let i = 0; i < 26; i++) { g.lineWidth = 1 + r() * 5; g.beginPath(); g.moveTo(160, 150); g.bezierCurveTo(160 + (r() - 0.5) * 260, 160 + r() * 30, r() * G.W, 190 + r() * 30, r() * G.W, G.H); g.stroke(); }
        // tronco de cristal
        g.fillStyle = '#3a2c10'; g.beginPath(); g.moveTo(140, 160); g.lineTo(150, 40); g.lineTo(170, 40); g.lineTo(180, 160); g.fill();
        g.fillStyle = '#6a5420'; g.beginPath(); g.moveTo(152, 150); g.lineTo(157, 46); g.lineTo(162, 46); g.lineTo(160, 150); g.fill();
        g.strokeStyle = '#4a3a14';
        for (let i = 0; i < 14; i++) { g.lineWidth = 1 + r() * 3; const y = 30 + r() * 60; g.beginPath(); g.moveTo(160, y + 20); g.quadraticCurveTo(160 + (r() - 0.5) * 120, y, 160 + (r() - 0.5) * 300, y - 20 - r() * 30); g.stroke(); }
        cache.fonte = X.dither(c, 16);
        // posições dos olhos
        cache.eyes = []; for (let i = 0; i < 70; i++) { const a = r() * Math.PI, d = 40 + r() * 120; cache.eyes.push([160 + Math.cos(a) * d * 1.3 * (r() < 0.5 ? -1 : 1), 70 - Math.sin(a) * d * 0.45 + r() * 20, r() * 100, 1 + (r() < 0.3 ? 1 : 0)]); }
      }
      ctx.drawImage(cache.fonte, 0, 0, G.W, G.H);
      // olhos que piscam
      for (const [x, y, ph, s] of cache.eyes) {
        const open = Math.max(0, Math.sin(t / 40 + ph)) > 0.15 ? 1 : 0.2;
        ctx.fillStyle = '#e8dcc0'; ctx.fillRect(x - s, y - open * s * 0.6, s * 2 + 1, Math.max(1, open * s * 1.2 + 1));
        if (open > 0.5) { ctx.fillStyle = '#1a0a06'; ctx.fillRect(x, y - 0.5, 1 + (s > 1 ? 1 : 0), 1 + (s > 1 ? 1 : 0)); }
      }
      X.glow(ctx, 160, 90, 110, 'rgba(255,214,120,0.35)', 0.5 + 0.15 * Math.sin(t / 25));
    },
  };

  C.BGS = BGS; C.cache = cache;

  // ---------- desenho ----------
  C.draw = function (ctx) {
    const t = C.t;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, G.H);
    if (C.bg && BGS[C.bg]) BGS[C.bg](ctx, t);
    // raízes / correntes presas ao ator principal
    for (const rt of C.roots) {
      const a = C.actors[rt.on]; if (!a) continue;
      const ax = a.x + rt.ox, ay = a.y + rt.oy;
      ctx.strokeStyle = rt.color || '#0c0604'; ctx.lineWidth = rt.w || 3; ctx.lineCap = 'round';
      if (rt.broken == null || rt.broken <= 0) {
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo((ax + rt.ex) / 2 + rt.bend, (ay + rt.ey) / 2, rt.ex, rt.ey); ctx.stroke();
      } else {
        const gap = rt.broken * 30, mx = (ax + rt.ex) / 2 + rt.bend * 0.5, my = (ay + rt.ey) / 2;
        const dx = rt.ex - ax, dy = rt.ey - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
        ctx.globalAlpha = Math.max(0, 1 - rt.broken);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mx - ux * gap, my - uy * gap + rt.broken * 20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + ux * gap, my + uy * gap + rt.broken * 20); ctx.lineTo(rt.ex, rt.ey); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    // atores
    const list = Object.values(C.actors).filter(a => a.img && a.alpha > 0).sort((a, b) => a.z - b.z);
    for (const a of list) {
      const im = typeof a.img === 'function' ? a.img() : a.img; if (!im) continue;
      const w = im.width * a.scale, h = im.height * a.scale;
      const x = Math.round(a.x - w / 2 + (a.shake ? (Math.random() - 0.5) * a.shake : 0)), y = Math.round(a.y - h + (a.bob ? Math.sin(t / 20) * a.bob : 0));
      if (a.glow) X.glow(ctx, a.x, a.y - h / 2, Math.max(w, h) * 0.8, a.glow, (a.glowA == null ? 0.6 : a.glowA) * a.alpha);
      ctx.globalAlpha = a.alpha;
      if (a.silhouette) {
        // silhueta escura com contorno colorido (personagens de costas para a câmera)
        let per = silCache.get(im); if (!per) { per = {}; silCache.set(im, per); }
        const key = a.silhouette;
        if (!per[key]) {
          const [c, g] = X.canvas(im.width + 4, im.height + 4);
          g.drawImage(im, 2, 2); g.globalCompositeOperation = 'source-in'; g.fillStyle = a.silhouette; g.fillRect(0, 0, c.width, c.height);
          const [c2, g2] = X.canvas(c.width, c.height);
          g2.drawImage(im, 2, 2); g2.globalCompositeOperation = 'source-atop'; g2.fillStyle = '#07050a'; g2.fillRect(0, 0, c.width, c.height);
          g2.globalCompositeOperation = 'destination-over';
          for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]) g2.drawImage(c, dx, dy);
          per[key] = c2;
        }
        ctx.drawImage(per[key], x - 2 * a.scale, y - 2 * a.scale, (im.width + 4) * a.scale, (im.height + 4) * a.scale);
      } else ctx.drawImage(im, x, y, w, h);
      ctx.globalAlpha = 1;
    }
    // feixes de luz convergindo
    ctx.globalCompositeOperation = 'lighter';
    for (const b of C.beams) {
      if (!b.a) continue;
      const wv = (b.w || 3) * (1 + 0.35 * Math.sin(t / 3 + (b.ph || 0)));
      for (const [lw, al] of [[wv * 3, 0.15], [wv, 0.5], [Math.max(1, wv / 3), 0.9]]) {
        ctx.strokeStyle = b.color; ctx.globalAlpha = al * b.a; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x1 + (b.x2 - b.x1) * (b.len == null ? 1 : b.len), b.y1 + (b.y2 - b.y1) * (b.len == null ? 1 : b.len)); ctx.stroke();
      }
    }
    for (const p of C.parts) { ctx.globalAlpha = Math.max(0, 1 - p.t / p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (C.white > 0) { ctx.globalAlpha = Math.min(1, C.white); ctx.fillStyle = C.whiteColor || '#fff'; ctx.fillRect(0, 0, G.W, G.H); ctx.globalAlpha = 1; }
    // faixas de cinema
    const bh = Math.round(30 * C.bars);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, bh); ctx.fillRect(0, G.H - bh, G.W, bh);
    if (C.cap && bh > 20) {
      const a = Math.min(1, C.cap.t / 15);
      ctx.globalAlpha = a;
      const ls = G.wrap(ctx, C.cap.text, G.W - 30, 8.5);
      let y = G.H - bh + 4 + (ls.length === 1 ? 6 : 0);
      for (const l of ls.slice(0, 2)) { G.text(ctx, l, G.W / 2, y, '#efe3cf', 8.5, 'center'); y += 11; }
      ctx.globalAlpha = 1;
    }
  };
})();
