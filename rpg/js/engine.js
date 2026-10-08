'use strict';
// Núcleo: laço do jogo, entrada, janelas, diálogo, menus e utilidades.
const G = window.G = {};
G.W = 320; G.H = 240; G.S = 3;
G.time = 0;
G.overlays = [];
G.waiters = [];
G.fx = [];
G.lock = 0;          // > 0 enquanto um roteiro está rodando
G.fadeA = 0;         // 0 = visível, 1 = preto
G.fadeColor = '#000';
G.flashA = 0; G.flashColor = '#fff';
G.shake = 0;
G.scene = null;      // cena base: {draw, tick, control}
G.debug = { auto: false, menuPick: null };
G.ABORT = { abort: true };
G.FONT = '"Pixelify Sans", monospace';

G.font = (sz, bold) => (bold ? '600 ' : '') + sz + 'px ' + G.FONT;
G.rand = (a, b) => a + Math.random() * (b - a);
G.irand = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
G.pick = arr => arr[Math.floor(Math.random() * arr.length)];
G.clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- Entrada ----------
const Input = G.Input = { held: {}, prev: {}, pressed: {}, rep: {}, latch: {}, touchDir: null, any: false };
Input.hit = function (k) { this.held[k] = true; this.latch[k] = true; };
const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  KeyZ: 'a', Enter: 'a', Space: 'a', KeyJ: 'a', KeyX: 'b', Escape: 'b', Backspace: 'b', KeyK: 'b',
};
addEventListener('keydown', e => {
  const k = KEYMAP[e.code]; if (!k) return;
  e.preventDefault(); if (!e.repeat) Input.latch[k] = true; Input.held[k] = true; Input.any = true; G.Audio && G.Audio.unlock();
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) { Input.held[k] = false; e.preventDefault(); } });
addEventListener('blur', () => { Input.held = {}; });
Input.update = function () {
  for (const k of ['up', 'down', 'left', 'right', 'a', 'b']) {
    const h = !!(this.held[k] || (k === this.touchDir));
    this.pressed[k] = (h && !this.prev[k]) || !!this.latch[k];
    this.latch[k] = false;
    if (h) this.rep[k] = (this.rep[k] || 0) + 1; else this.rep[k] = 0;
    this.prev[k] = h;
  }
};
Input.down = function (k) { return !!(this.held[k] || this.touchDir === k); };
// pressionou, ou está segurando (com repetição) — para navegar em menus
Input.nav = function (k) {
  if (this.pressed[k]) return true;
  const r = this.rep[k] || 0;
  return r > 16 && (r - 16) % 5 === 0;
};
Input.dirPressed = function () {
  for (const k of ['up', 'down', 'left', 'right']) if (this.nav(k)) return k;
  return null;
};
Input.consume = function () { for (const k in this.pressed) this.pressed[k] = false; };

// ---------- Promessas de tempo ----------
G.wait = n => new Promise(r => G.waiters.push({ t: Math.max(1, n | 0), r }));
G.fade = (to, frames = 20, color = '#000') => new Promise(r => {
  G.fadeColor = color; const from = G.fadeA; let t = 0; if (G.debug.fast) frames = 1;
  G.fx.push({ upd() { t++; G.fadeA = from + (to - from) * Math.min(1, t / frames); if (t >= frames) { r(); return false; } return true; } });
});
G.flash = (color = '#fff', a = 0.8) => { G.flashColor = color; G.flashA = a; };

// ---------- Janelas ----------
G.win = function (ctx, x, y, w, h, opt = {}) {
  ctx.save();
  ctx.fillStyle = opt.bg || 'rgba(10,6,14,0.94)';
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = opt.border || '#c9a24a';
  ctx.fillRect(x + 2, y, w - 4, 1); ctx.fillRect(x + 2, y + h - 1, w - 4, 1);
  ctx.fillRect(x, y + 2, 1, h - 4); ctx.fillRect(x + w - 1, y + 2, 1, h - 4);
  ctx.fillRect(x + 1, y + 1, 1, 1); ctx.fillRect(x + w - 2, y + 1, 1, 1);
  ctx.fillRect(x + 1, y + h - 2, 1, 1); ctx.fillRect(x + w - 2, y + h - 2, 1, 1);
  ctx.fillStyle = opt.inner || 'rgba(140,40,50,0.55)';
  ctx.fillRect(x + 3, y + 2, w - 6, 1);
  ctx.restore();
};
G.text = function (ctx, s, x, y, color = '#efe3cf', size = 8, align = 'left', bold = false) {
  ctx.font = G.font(size, bold); ctx.textAlign = align; ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillText(s, x + 0.5, y + 0.6);
  ctx.fillStyle = color; ctx.fillText(s, x, y);
};
G.wrap = function (ctx, text, maxW, size) {
  ctx.font = G.font(size);
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(' '); let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out;
};
G.cursor = function (ctx, x, y) {
  const o = (G.time >> 4) & 1;
  ctx.fillStyle = '#ffcf6a';
  ctx.beginPath(); ctx.moveTo(x + o, y); ctx.lineTo(x + 5 + o, y + 3.5); ctx.lineTo(x + o, y + 7); ctx.fill();
};

G.push = function (ov) { G.overlays.push(ov); Input.consume(); return ov; };
G.pop = function (ov) { const i = G.overlays.indexOf(ov); if (i >= 0) G.overlays.splice(i, 1); Input.consume(); };

// ---------- Diálogo ----------
// G.say(nome, texto, {portrait}) — nome null = narração
G.say = function (name, text, opt = {}) {
  return new Promise(resolve => {
    const ctx = G.ctx;
    const portrait = opt.portrait !== undefined ? opt.portrait : (name && G.portraitFor ? G.portraitFor(name) : null);
    const px = portrait ? 58 : 12;
    const lines = G.wrap(ctx, text, G.W - px - 14, 9);
    const pages = []; for (let i = 0; i < lines.length; i += 4) pages.push(lines.slice(i, i + 4));
    const top = opt.top || (G.scene && G.scene.dialogTop);
    const ov = {
      page: 0, chars: 0,
      update() {
        const total = pages[this.page].join('').length;
        if (this.chars < total) this.chars += (Input.down('a') || Input.down('b')) ? 4 : 1.25;
        if (G.debug.auto) this.chars = total + 1;
        if (Input.pressed.a || Input.pressed.b || G.debug.auto) {
          if (this.chars < total) this.chars = total;
          else if (this.page < pages.length - 1) { this.page++; this.chars = 0; G.Audio.sfx('blip'); }
          else { G.pop(ov); resolve(); }
        }
      },
      draw(ctx) {
        const h = 62, y = top ? 6 : G.H - h - 6, x = 6, w = G.W - 12;
        G.win(ctx, x, y, w, h);
        if (portrait) {
          ctx.fillStyle = '#05030a'; ctx.fillRect(x + 6, y + 7, 48, 48);
          portrait(ctx, x + 6, y + 7, G.time);
          ctx.strokeStyle = '#6d4a2a'; ctx.lineWidth = 1; ctx.strokeRect(x + 5.5, y + 6.5, 49, 49);
        }
        let ty = y + 8;
        if (name) { G.text(ctx, name, x + px - 4, y + 5, '#ffcf6a', 8, 'left', true); ty = y + 17; }
        let left = Math.floor(this.chars);
        const col = name ? '#f1e6d2' : '#c9bfd8';
        for (const ln of pages[this.page]) {
          const s = ln.slice(0, Math.max(0, left)); left -= ln.length;
          G.text(ctx, s, x + px - 4, ty, col, 9); ty += 11;
        }
        if (this.chars >= pages[this.page].join('').length && ((G.time >> 4) & 1)) {
          ctx.fillStyle = '#ffcf6a'; ctx.fillRect(x + w - 12, y + h - 9, 5, 3); ctx.fillRect(x + w - 11, y + h - 6, 3, 2);
        }
      },
    };
    G.push(ov);
  });
};
// Narração em tela cheia (prólogo, visões)
G.narrate = function (lines, opt = {}) {
  return new Promise(resolve => {
    let i = 0, a = 0, phase = 0, hold = 0;
    const color = opt.color || '#e7d9c4';
    const ov = {
      update() {
        if (G.debug.auto) { G.pop(ov); resolve(); return; }
        if (phase === 0) { a += 0.05; if (a >= 1) { a = 1; phase = 1; hold = 0; } }
        else if (phase === 1) { hold++; if (Input.pressed.a || hold > (opt.hold || 150)) phase = 2; }
        else { a -= 0.06; if (a <= 0) { a = 0; i++; phase = 0; if (i >= lines.length) { G.pop(ov); resolve(); } } }
        if (Input.pressed.b) { G.pop(ov); resolve(); }
      },
      draw(ctx) {
        ctx.fillStyle = opt.bg || '#000'; ctx.fillRect(0, 0, G.W, G.H);
        if (opt.backdrop) opt.backdrop(ctx, G.time);
        if (i >= lines.length) return;
        ctx.globalAlpha = a;
        const ls = G.wrap(ctx, lines[i], G.W - 50, 10);
        let y = G.H / 2 - ls.length * 7;
        for (const l of ls) { G.text(ctx, l, G.W / 2, y, color, 10, 'center'); y += 14; }
        ctx.globalAlpha = 1;
        G.text(ctx, 'A: avançar   B: pular', G.W - 6, G.H - 12, '#4d3f4a', 7, 'right');
      },
    };
    G.push(ov);
  });
};

// Mostra uma imagem emoldurada com legenda e espera A
G.showImage = function (img, caption) {
  return new Promise(resolve => {
    let t = 0;
    const ov = {
      update() { t++; if (G.debug.auto || (t > 20 && (Input.pressed.a || Input.pressed.b))) { G.pop(ov); resolve(); } },
      draw(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, G.W, G.H);
        const a = Math.min(1, t / 20); ctx.globalAlpha = a;
        const s = Math.min(170 / img.height, 280 / img.width), w = img.width * s, h = img.height * s, x = (G.W - w) / 2, y = 12;
        ctx.fillStyle = '#c9a24a'; ctx.fillRect(x - 3, y - 3, w + 6, h + 6); ctx.fillStyle = '#000'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(img, x, y, w, h); ctx.imageSmoothingEnabled = false;
        if (caption) { const ls = G.wrap(ctx, caption, G.W - 30, 9); let yy = y + h + 10; for (const l of ls) { G.text(ctx, l, G.W / 2, yy, '#e7d9c4', 9, 'center'); yy += 11; } }
        ctx.globalAlpha = 1;
      },
    };
    G.push(ov);
  });
};

// ---------- Menu genérico ----------
// items: string | {label, right, disabled, color}
G.menu = function (o) {
  return new Promise(resolve => {
    const items = o.items.map(it => typeof it === 'string' ? { label: it } : it);
    let idx = Math.min(o.index || 0, items.length - 1);
    const lh = o.lh || 12;
    const cols = o.cols || 1;
    const rows = Math.ceil(items.length / cols);
    const maxRows = o.maxRows || rows;
    let scroll = 0;
    const w = o.w || 100;
    const titleH = o.title ? 13 : 0;
    const h = o.h || (Math.min(rows, maxRows) * lh + 10 + titleH);
    const ov = {
      isMenu: true,
      update() {
        if (G.debug.auto) {
          let p = G.debug.menuPick; if (typeof p === 'function') p = p(o, items);
          if (p == null) p = 0;
          G.pop(ov); resolve(p); return;
        }
        const d = Input.dirPressed();
        if (d) {
          let n = idx;
          if (d === 'up') n -= cols; if (d === 'down') n += cols;
          if (cols > 1 && d === 'left') n -= 1; if (cols > 1 && d === 'right') n += 1;
          if (n < 0) n = (d === 'up' && cols === 1) ? items.length - 1 : idx;
          if (n >= items.length) n = (d === 'down' && cols === 1) ? 0 : idx;
          if (n !== idx) { idx = n; G.Audio.sfx('blip'); o.onMove && o.onMove(idx); }
        }
        const r = Math.floor(idx / cols);
        if (r < scroll) scroll = r; if (r >= scroll + maxRows) scroll = r - maxRows + 1;
        if (Input.pressed.a) {
          if (items[idx].disabled) { G.Audio.sfx('buzz'); return; }
          G.Audio.sfx('ok'); G.pop(ov); resolve(idx);
        } else if (Input.pressed.b && o.cancel !== false) { G.Audio.sfx('back'); G.pop(ov); resolve(-1); }
      },
      draw(ctx) {
        const x = o.x, y = o.y;
        G.win(ctx, x, y, w, h);
        if (o.title) G.text(ctx, o.title, x + 7, y + 4, '#ffcf6a', 8, 'left', true);
        const cw = (w - 12) / cols;
        for (let i = 0; i < items.length; i++) {
          const r = Math.floor(i / cols), c = i % cols;
          if (r < scroll || r >= scroll + maxRows) continue;
          const ix = x + 14 + c * cw, iy = y + 5 + titleH + (r - scroll) * lh;
          const it = items[i];
          G.text(ctx, it.label, ix, iy, it.disabled ? '#6a5d68' : (it.color || '#efe3cf'), 8);
          if (it.right != null) G.text(ctx, String(it.right), ix + cw - 16, iy, it.disabled ? '#6a5d68' : '#cdb7a0', 8, 'right');
          if (i === idx) G.cursor(ctx, ix - 9, iy + 1);
        }
        if (scroll > 0) G.text(ctx, '▲', x + w - 10, y + 3, '#c9a24a', 7);
        if (scroll + maxRows < rows) G.text(ctx, '▼', x + w - 10, y + h - 10, '#c9a24a', 7);
        if (o.help && items[idx]) {
          const t = o.help(idx); if (t) {
            G.win(ctx, 6, G.H - 30, G.W - 12, 24);
            G.text(ctx, t, 13, G.H - 22, '#cfc3b0', 8);
          }
        }
        o.drawExtra && o.drawExtra(ctx, idx);
      },
    };
    G.push(ov);
  });
};
G.choose = async function (question, options, opt = {}) {
  if (question) {
    // mostra a pergunta e mantém visível durante a escolha
    const lines = G.wrap(G.ctx, question, G.W - 30, 9);
    const q = { draw(ctx) { G.win(ctx, 6, G.H - 50, G.W - 12, 44); let y = G.H - 43; for (const l of lines.slice(0, 3)) { G.text(ctx, l, 14, y, '#f1e6d2', 9); y += 11; } }, update() {} };
    G.overlays.push(q);
    const w = opt.w || 130;
    const r = await G.menu({ x: G.W - w - 8, y: G.H - 56 - options.length * 12 - 10, w, items: options, cancel: opt.cancel === true });
    G.pop(q);
    return r;
  }
  return G.menu({ x: G.W / 2 - 65, y: 80, w: 130, items: options, cancel: opt.cancel === true });
};
G.toast = function (text, frames = 90) {
  let t = 0;
  G.fx.push({
    layer: 'top',
    upd() { return ++t < frames; },
    draw(ctx) {
      ctx.font = G.font(8); const w = Math.max(120, ctx.measureText(text).width + 20);
      const a = Math.min(1, t / 8, (frames - t) / 12); ctx.globalAlpha = a;
      G.win(ctx, G.W / 2 - w / 2, 8, w, 18); G.text(ctx, text, G.W / 2, 13, '#ffe0a0', 8, 'center');
      ctx.globalAlpha = 1;
    },
  });
};

// Roda um roteiro assíncrono bloqueando o controle do campo.
G.run = async function (fn) {
  G.lock++;
  try { return await fn(); }
  catch (e) { if (e !== G.ABORT) { console.error(e); G.lastError = e; } }
  finally { G.lock--; Input.consume(); }
};

// ---------- Laço principal ----------
G.start = function () {
  const cv = G.canvas = document.getElementById('screen');
  const ctx = G.ctx = cv.getContext('2d');
  cv.width = G.W * G.S; cv.height = G.H * G.S;
  let last = performance.now(), acc = 0;
  const step = 1000 / 60;
  function frame(now) {
    acc += Math.min(100, now - last); last = now;
    let n = 0;
    while (acc >= step && n < 4) { G.update(); acc -= step; n++; }
    G.draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};
// Velocidade da batalha: em 1x a batalha anda na metade do ritmo; 2x é o ritmo rápido.
G.fastBattle = false; try { G.fastBattle = localStorage.getItem('kravenox_vel') === '2'; } catch (e) {}
G.update = function () {
  if (G.scene === G.Battle && !G.fastBattle && !G.debug.auto && !G.debug.fast) { G._half = !G._half; if (G._half) return; }
  G.time++;
  Input.update();
  if (G.scene && G.scene.tick) G.scene.tick();
  if (G.overlays.length) G.overlays[G.overlays.length - 1].update();
  else if (G.lock === 0 && G.scene && G.scene.control) G.scene.control();
  for (let i = G.waiters.length - 1; i >= 0; i--) {
    const w = G.waiters[i];
    if (--w.t <= 0 || (G.debug.auto && G.debug.fast)) { G.waiters.splice(i, 1); w.r(); }
  }
  G.fx = G.fx.filter(f => f.upd());
  if (G.flashA > 0) G.flashA = Math.max(0, G.flashA - 0.06);
  if (G.shake > 0) G.shake--;
};
G.draw = function () {
  const ctx = G.ctx;
  ctx.setTransform(G.S, 0, 0, G.S, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, G.H);
  ctx.save();
  if (G.shake > 0) ctx.translate(G.irand(-2, 2), G.irand(-2, 2));
  if (G.scene && G.scene.draw) G.scene.draw(ctx);
  for (const f of G.fx) if (f.draw && f.layer !== 'top') f.draw(ctx);
  ctx.restore();
  if (G.flashA > 0) { ctx.globalAlpha = G.flashA; ctx.fillStyle = G.flashColor; ctx.fillRect(0, 0, G.W, G.H); ctx.globalAlpha = 1; }
  if (G.fadeA > 0 && !G.fadeAboveUI) { ctx.globalAlpha = G.fadeA; ctx.fillStyle = G.fadeColor; ctx.fillRect(0, 0, G.W, G.H); ctx.globalAlpha = 1; }
  for (const o of G.overlays) o.draw(ctx);
  if (G.fadeA > 0 && G.fadeAboveUI) { ctx.globalAlpha = G.fadeA; ctx.fillStyle = G.fadeColor; ctx.fillRect(0, 0, G.W, G.H); ctx.globalAlpha = 1; }
  for (const f of G.fx) if (f.draw && f.layer === 'top') f.draw(ctx);
};

// ---------- Controles de toque ----------
G.setupTouch = function () {
  const touch = ('ontouchstart' in window) || matchMedia('(pointer: coarse)').matches;
  if (touch) document.body.classList.add('touch');
  const dpad = document.getElementById('dpad');
  const setDir = (d) => {
    Input.touchDir = d;
    dpad.className = d ? 'dir-' + d : '';
  };
  const dirFrom = (t) => {
    const r = dpad.getBoundingClientRect();
    const dx = t.clientX - (r.left + r.width / 2), dy = t.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < 12) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  };
  let dpadId = null;
  dpad.addEventListener('touchstart', e => { e.preventDefault(); G.Audio.unlock(); const t = e.changedTouches[0]; dpadId = t.identifier; const d = dirFrom(t); setDir(d); if (d) Input.latch[d] = true; }, { passive: false });
  dpad.addEventListener('touchmove', e => { e.preventDefault(); for (const t of e.changedTouches) if (t.identifier === dpadId) setDir(dirFrom(t)); }, { passive: false });
  const endD = e => { G.Audio.unlock(); for (const t of e.changedTouches) if (t.identifier === dpadId) { dpadId = null; setDir(null); } };
  dpad.addEventListener('touchend', endD); dpad.addEventListener('touchcancel', endD);
  for (const [id, k] of [['btnA', 'a'], ['btnB', 'b']]) {
    const el = document.getElementById(id);
    el.addEventListener('touchstart', e => { e.preventDefault(); G.Audio.unlock(); Input.hit(k); el.classList.add('on'); }, { passive: false });
    const up = e => { e.preventDefault(); G.Audio.unlock(); Input.held[k] = false; el.classList.remove('on'); };
    el.addEventListener('touchend', up); el.addEventListener('touchcancel', up);
    // mouse também (para testar no computador)
    el.addEventListener('mousedown', () => { Input.hit(k); el.classList.add('on'); });
    el.addEventListener('mouseup', () => { Input.held[k] = false; el.classList.remove('on'); });
  }
  // toque na tela = A (útil em diálogos)
  G.canvas.addEventListener('touchstart', e => { e.preventDefault(); G.Audio.unlock(); Input.hit('a'); }, { passive: false });
  G.canvas.addEventListener('touchend', e => { e.preventDefault(); G.Audio.unlock(); Input.held.a = false; }, { passive: false });
  G.canvas.addEventListener('mousedown', () => { G.Audio.unlock(); });
  const fit = () => {
    const land = innerWidth > innerHeight;
    document.body.classList.toggle('landscape', land);
    const padH = document.body.classList.contains('touch') ? (land ? 0 : 190) : 26;
    const availW = innerWidth - (land && touch ? 0 : 0), availH = innerHeight - padH - 4;
    const s = Math.min(availW / G.W, availH / G.H);
    G.canvas.style.width = Math.floor(G.W * s) + 'px';
    G.canvas.style.height = Math.floor(G.H * s) + 'px';
  };
  addEventListener('resize', fit); addEventListener('orientationchange', () => setTimeout(fit, 200)); fit();
};
