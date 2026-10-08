'use strict';
// Gráficos procedurais: tiles, personagens, retratos e cenários de batalha.
(function () {
  const X = G.gfx = {};
  X.rng = function (seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  X.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; };
  const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
  X.hash = hash;

  // Paletas por tema
  const PAL = {
    reino: { g: ['#4a4451', '#433d4a', '#55505e', '#3c3743'], tuft: '#6a6c5c', road: ['#5c4f45', '#665649', '#514439'], dark: '#2a2430' },
    vale: { g: ['#46515e', '#3f4955', '#53606d', '#38414c'], tuft: '#6c7a86', road: ['#55596a', '#60657a', '#4b4f5e'], dark: '#2a3038' },
    vila: { g: ['#4a4451', '#433d4a', '#55505e', '#3c3743'], tuft: '#6a6c5c', road: ['#5a5458', '#645d62', '#4f4a4e'], dark: '#2a2430' },
    casa: { g: ['#3b2c25', '#35271f', '#43322a', '#2e221c'], tuft: '#5a4030', road: ['#3b2c25', '#35271f', '#43322a'], dark: '#1c140f' },
  };
  X.PAL = PAL;

  function speckle(g, rnd, cols, n) { for (let i = 0; i < n; i++) { g.fillStyle = cols[(rnd() * cols.length) | 0]; g.fillRect((rnd() * 16) | 0, (rnd() * 16) | 0, 1, 1); } }
  function ground(g, P, rnd) { g.fillStyle = P.g[0]; g.fillRect(0, 0, 16, 16); speckle(g, rnd, P.g, 40); }

  const TILE = {}; // definição: solid, tall, draw
  const def = (chs, o) => { for (const c of chs) TILE[c] = o; };
  X.TILE = TILE;

  def('.', { draw(g, P, r) { ground(g, P, r); } });
  def(',', { draw(g, P, r) { ground(g, P, r); g.fillStyle = P.tuft; for (let i = 0; i < 4; i++) { const x = (r() * 13) | 0, y = 3 + (r() * 11) | 0; g.fillRect(x, y, 1, 2); g.fillRect(x + 2, y - 1, 1, 3); g.fillRect(x + 1, y + 1, 1, 1); } } });
  def('=', { draw(g, P, r) { g.fillStyle = P.road[0]; g.fillRect(0, 0, 16, 16); speckle(g, r, P.road, 30); g.fillStyle = 'rgba(0,0,0,0.18)'; for (let i = 0; i < 3; i++) g.fillRect((r() * 14) | 0, (r() * 14) | 0, 2, 1); } });
  def('p', { draw(g, P, r) { g.fillStyle = '#3d383c'; g.fillRect(0, 0, 16, 16); for (let y = 0; y < 16; y += 4) for (let x = (y / 4 % 2) * 2; x < 16; x += 4) { g.fillStyle = P.road[(r() * 3) | 0]; g.fillRect(x, y, 3, 3); } } });
  def('f', { draw(g, P, r) { g.fillStyle = '#2b2730'; g.fillRect(0, 0, 16, 16); speckle(g, r, ['#26222b', '#332e38', '#221e26'], 40); g.strokeStyle = '#1b161c'; g.lineWidth = 1; g.beginPath(); const y = 2 + r() * 12; g.moveTo(0, y); g.bezierCurveTo(5, y + r() * 6 - 3, 10, y + r() * 6 - 3, 16, y + r() * 4 - 2); g.stroke(); } });
  def('r', { draw(g, P, r) { ground(g, P, r); g.strokeStyle = '#1a1318'; g.lineWidth = 1.4; for (let i = 0; i < 2; i++) { g.beginPath(); const y = r() * 16; g.moveTo(-1, y); g.quadraticCurveTo(8, y + r() * 10 - 5, 17, r() * 16); g.stroke(); } } });
  def('m', { draw(g, P, r) { ground(g, P, r); g.fillStyle = 'rgba(200,215,230,0.06)'; g.fillRect(0, (r() * 10) | 0, 16, 4); } });
  def('F', { draw(g, P, r) { g.fillStyle = '#4a3428'; g.fillRect(0, 0, 16, 16); g.fillStyle = '#3a281e'; for (let y = 3; y < 16; y += 4) g.fillRect(0, y, 16, 1); g.fillStyle = '#563e30'; for (let i = 0; i < 4; i++) g.fillRect((r() * 15) | 0, ((r() * 4) | 0) * 4, 1, 3); } });

  def('^', { solid: true, draw(g, P, r) {
    ground(g, P, r);
    const peak = (cx, h, w) => { g.fillStyle = '#2c2631'; g.beginPath(); g.moveTo(cx - w, 16); g.lineTo(cx, 16 - h); g.lineTo(cx + w, 16); g.fill();
      g.fillStyle = '#4b3f52'; g.beginPath(); g.moveTo(cx, 16 - h); g.lineTo(cx - w * 0.6, 16); g.lineTo(cx - 1, 16); g.fill();
      g.fillStyle = '#7a3a40'; g.fillRect(cx - 1, 16 - h, 2, 2); };
    peak(5 + r() * 2, 13, 6); peak(11 + r() * 2, 10 + r() * 4, 6);
  } });
  def('T', { solid: true, tall: 8, draw(g, P, r) { if (P === PAL.reino && r() < 2) { } ground(g, P, r); } });
  def('*', { solid: true, draw(g, P, r) {
    ground(g, P, r);
    const shard = (x, h, w) => { g.fillStyle = '#120d18'; g.beginPath(); g.moveTo(x - w, 15); g.lineTo(x, 15 - h); g.lineTo(x + w, 15); g.fill(); g.fillStyle = '#6b3f9c'; g.fillRect(x, 15 - h + 1, 1, Math.max(1, h - 4)); g.fillStyle = '#c18bff'; g.fillRect(x, 15 - h, 1, 1); };
    shard(5, 9 + r() * 4, 3); shard(10, 12 + r() * 3, 3); shard(13, 6, 2);
  } });
  def('~', { solid: true, anim: 2, draw(g, P, r, f) {
    g.fillStyle = '#0a0608'; g.fillRect(0, 0, 16, 16);
    for (let i = 0; i < 6; i++) { g.fillStyle = f ? '#3a0a10' : '#2a070c'; g.fillRect((r() * 15) | 0, (r() * 15) | 0, 2, 1); }
    g.fillStyle = f ? 'rgba(160,20,30,0.18)' : 'rgba(160,20,30,0.1)'; g.fillRect(0, 0, 16, 16);
  } });
  def('A', { draw(g, P, r, f) {
    ground(g, P, r);
    g.fillStyle = '#2c2631'; g.beginPath(); g.moveTo(0, 16); g.lineTo(3, 3); g.lineTo(8, 0); g.lineTo(13, 3); g.lineTo(16, 16); g.fill();
    g.fillStyle = '#0a0406'; g.beginPath(); g.moveTo(4, 16); g.lineTo(5, 8); g.lineTo(8, 5); g.lineTo(11, 8); g.lineTo(12, 16); g.fill();
    g.fillStyle = f ? '#a01826' : '#701018'; g.fillRect(6, 13, 4, 3); g.fillStyle = '#ff4a3a'; g.fillRect(7, 14, 2, 2);
  }, anim: 2 });
  def('V', { draw(g, P, r) {
    ground(g, P, r);
    const house = (x, y) => { g.fillStyle = '#3e2f2a'; g.fillRect(x, y + 3, 6, 4); g.fillStyle = '#5a2830'; g.beginPath(); g.moveTo(x - 1, y + 3); g.lineTo(x + 3, y); g.lineTo(x + 7, y + 3); g.fill(); g.fillStyle = '#ffcf6a'; g.fillRect(x + 2, y + 5, 1, 2); };
    house(1, 2); house(9, 4); house(4, 9);
    g.strokeStyle = '#1a1318'; g.beginPath(); g.moveTo(0, 15); g.quadraticCurveTo(8, 11, 16, 15); g.stroke();
  } });
  def('R', { draw(g, P, r, f) {
    g.fillStyle = '#3a3036'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#2a2228'; for (let y = 0; y < 16; y += 4) g.fillRect(0, y, 16, 1);
    for (let y = 0; y < 16; y += 4) for (let x = (y / 4 % 2) * 4; x < 16; x += 8) g.fillRect(x, y, 1, 4);
    g.strokeStyle = f ? '#e0c060' : '#9a7a40'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(4, 13); g.lineTo(11, 3); g.moveTo(12, 13); g.lineTo(5, 3); g.stroke();
  }, anim: 2 });
  def('X', { solid: true, draw(g, P, r) {
    ground(g, P, r);
    g.strokeStyle = '#120c10'; g.lineWidth = 2;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(r() * 16, 16); g.bezierCurveTo(r() * 16, 8, r() * 16, 6, r() * 16, -1); g.stroke(); }
    g.fillStyle = '#3a1a24'; for (let i = 0; i < 6; i++) g.fillRect((r() * 15) | 0, (r() * 15) | 0, 1, 2);
  } });
  def('g', { solid: true, draw(g, P, r) {
    ground(g, P, r);
    g.fillStyle = '#2f3640'; g.beginPath(); g.ellipse(8, 13, 7, 3, 0, 0, 7); g.fill();
    g.fillStyle = '#7d8592'; g.fillRect(6, 4, 4, 9); g.fillRect(5, 5, 6, 2); g.fillStyle = '#5d6470'; g.fillRect(9, 4, 1, 9);
    g.fillStyle = '#3d434d'; g.fillRect(7, 7, 2, 1);
  } });
  def('B', { draw(g, P, r) {
    g.fillStyle = '#05070a'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#b8b2a4'; for (let y = 0; y < 16; y += 3) { g.fillRect(2, y, 12, 2); }
    g.fillStyle = '#7d776c'; g.fillRect(2, 0, 1, 16); g.fillRect(13, 0, 1, 16);
    g.fillStyle = '#8f897c'; for (let y = 1; y < 16; y += 3) g.fillRect(3 + ((r() * 9) | 0), y, 2, 1);
  } });
  def('S', { draw(g, P, r, f) {
    ground(g, P, r);
    g.fillStyle = '#6f6650'; g.beginPath(); g.arc(8, 9, 6, 0, 7); g.fill();
    g.fillStyle = '#4b4434'; g.beginPath(); g.arc(8, 9, 4, 0, 7); g.fill();
    g.fillStyle = f ? '#ffe9a0' : '#e8c060'; g.fillRect(7, 5, 2, 7); g.fillRect(6, 7, 4, 2);
  }, anim: 2 });
  def('W', { solid: true, tall: 40, draw(g, P, r) { ground(g, P, r); } });
  def('s', { solid: true, tall: 24, draw(g, P, r) { def_p(g, P, r); } });
  function def_p(g, P, r) { TILE.p.draw(g, P, r); }
  def('h', { solid: true, draw(g, P, r) {
    g.fillStyle = '#4a3a33'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#3b2e28'; for (let y = 3; y < 16; y += 5) g.fillRect(0, y, 16, 1);
    g.fillStyle = '#56453c'; for (let i = 0; i < 6; i++) g.fillRect((r() * 15) | 0, (r() * 15) | 0, 2, 1);
    if (r() < 0.6) { g.strokeStyle = '#1a1214'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(r() * 16, 16); g.bezierCurveTo(r() * 16, 10, r() * 16, 5, r() * 16, 0); g.stroke(); }
  } });
  def('o', { solid: true, draw(g, P, r) {
    g.fillStyle = '#4a1f28'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#3a161e'; for (let y = 1; y < 16; y += 3) g.fillRect(0, y, 16, 1);
    g.fillStyle = '#5c2832'; for (let y = 0; y < 16; y += 3) for (let x = (y % 2) * 3; x < 16; x += 6) g.fillRect(x, y, 3, 1);
  } });
  def('d', { draw(g, P, r, f) {
    TILE.h.draw(g, P, X.rng(9));
    g.fillStyle = '#1e120c'; g.fillRect(4, 3, 8, 13); g.fillStyle = '#2e1c12'; g.fillRect(5, 4, 6, 12);
    g.fillStyle = '#c9a24a'; g.fillRect(9, 10, 1, 1);
  } });
  def('D', { draw(g, P, r, f) { // porta com luz dourada
    TILE.h.draw(g, P, X.rng(9));
    g.fillStyle = '#1e120c'; g.fillRect(4, 3, 8, 13); g.fillStyle = f ? '#ffd26a' : '#d8a840'; g.fillRect(5, 4, 6, 12);
    g.fillStyle = 'rgba(255,220,120,0.5)'; g.fillRect(3, 2, 10, 14);
  }, anim: 2 });
  def('w', { solid: true, draw(g, P, r) {
    ground(g, P, r);
    g.fillStyle = '#2c2422'; g.fillRect(0, 6, 16, 3); g.fillRect(1, 3, 2, 12); g.fillRect(13, 3, 2, 12);
    g.fillStyle = '#3e3330'; g.fillRect(0, 6, 16, 1);
  } });
  def('H', { solid: true, draw(g, P, r) {
    g.fillStyle = '#2a1e1a'; g.fillRect(0, 0, 16, 16); g.fillStyle = '#3a2a24'; g.fillRect(0, 10, 16, 6);
    g.fillStyle = '#22180f'; g.fillRect(0, 10, 16, 1);
    g.strokeStyle = '#120c0a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(r() * 16, 0); g.bezierCurveTo(r() * 16, 6, r() * 16, 10, r() * 16, 16); g.stroke();
  } });
  def('q', { solid: true, draw(g, P, r, f) {
    TILE.F.draw(g, P, r);
    g.fillStyle = '#2a1a12'; g.fillRect(2, 7, 12, 6); g.fillStyle = '#4a3020'; g.fillRect(2, 6, 12, 2);
    g.fillStyle = f ? '#fff0a0' : '#ffd060'; g.fillRect(7, 3, 2, 4); g.fillStyle = 'rgba(255,210,100,0.35)'; g.fillRect(4, 1, 8, 8);
  }, anim: 2 });
  def('Y', { solid: true, draw(g, P, r) {
    TILE.F.draw(g, P, r);
    g.strokeStyle = '#140c0c'; g.lineWidth = 2;
    for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(r() * 16, -1); g.bezierCurveTo(r() * 16, 6, r() * 16, 10, r() * 16, 17); g.stroke(); }
  } });
  def('k', { solid: true, draw(g, P, r) { // poço / fogueira do mascate
    TILE.p.draw(g, P, r);
    g.fillStyle = '#2a2224'; g.beginPath(); g.arc(8, 9, 6, 0, 7); g.fill(); g.fillStyle = '#0a0608'; g.beginPath(); g.arc(8, 9, 4, 0, 7); g.fill();
    g.fillStyle = '#5a4a46'; g.fillRect(2, 8, 12, 1);
  } });
  def('c', { solid: true, anim: 2, draw(g, P, r, f) { // fogueira
    ground(g, P, r);
    g.fillStyle = '#3a2418'; g.fillRect(3, 12, 10, 2); g.fillRect(5, 11, 6, 1);
    g.fillStyle = f ? '#ff9a2a' : '#ff7a1a'; g.beginPath(); g.moveTo(4, 12); g.lineTo(8, f ? 3 : 4); g.lineTo(12, 12); g.fill();
    g.fillStyle = '#ffe07a'; g.beginPath(); g.moveTo(6, 12); g.lineTo(8, f ? 7 : 6); g.lineTo(10, 12); g.fill();
  } });

  const cache = {};
  X.tileImg = function (ch, theme, x, y, frame) {
    const T = TILE[ch] || TILE['.'];
    const v = hash(x, y) % 4, f = T.anim ? frame % T.anim : 0;
    const key = ch + theme + v + f;
    if (cache[key]) return cache[key];
    const [c, g] = X.canvas(16, 16);
    T.draw(g, PAL[theme] || PAL.reino, X.rng(v * 977 + ch.charCodeAt(0) * 31), f);
    return (cache[key] = c);
  };

  // Objetos altos (desenhados acima do chão, ordenados por y)
  X.drawTall = function (ctx, ch, sx, sy, x, y, theme) {
    const r = X.rng(hash(x, y));
    if (ch === 'T') {
      const key = 'tree' + theme + (hash(x, y) % 3);
      if (!cache[key]) {
        const [c, g] = X.canvas(24, 26);
        const rr = X.rng(hash(x, y) % 3 + 5);
        g.strokeStyle = theme === 'vale' ? '#20252c' : '#211a20'; g.lineCap = 'round';
        g.lineWidth = 3; g.beginPath(); g.moveTo(12, 25); g.lineTo(12, 12); g.stroke();
        g.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) { g.beginPath(); const yy = 8 + rr() * 8; g.moveTo(12, yy + 4); const dx = (rr() - 0.5) * 22; g.quadraticCurveTo(12 + dx * 0.4, yy, 12 + dx, yy - 4 - rr() * 6); g.stroke(); }
        g.lineWidth = 1; g.beginPath(); g.moveTo(12, 12); g.lineTo(12, 1); g.stroke();
        g.fillStyle = '#4a2a5a'; if (rr() < 0.5) g.fillRect(14, 16, 2, 2);
        g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(12, 25, 6, 1.5, 0, 0, 7); g.fill();
        cache[key] = c;
      }
      ctx.drawImage(cache[key], sx - 4, sy - 10);
    } else if (ch === 'W') {
      if (!cache.tower) {
        const [c, g] = X.canvas(20, 56);
        g.fillStyle = '#2a2430'; g.fillRect(4, 10, 12, 46);
        g.fillStyle = '#3a3242'; g.fillRect(4, 10, 4, 46);
        g.fillStyle = '#1a1520'; for (let y = 14; y < 56; y += 6) g.fillRect(4, y, 12, 1);
        g.fillStyle = '#2a2430'; g.beginPath(); g.moveTo(4, 10); g.lineTo(6, 2); g.lineTo(9, 7); g.lineTo(12, 0); g.lineTo(14, 6); g.lineTo(16, 10); g.fill();
        g.fillStyle = '#ff5a3a'; g.fillRect(9, 20, 2, 3);
        g.fillStyle = '#0a0608'; g.fillRect(8, 34, 4, 6);
        cache.tower = c;
      }
      ctx.drawImage(cache.tower, sx - 2, sy - 40);
      // olho na janela da torre (alguém observava)
      if ((G.time >> 5) % 5 === 0) { ctx.fillStyle = '#ffcf6a'; ctx.fillRect(sx + 7, sy - 20, 2, 1); }
    } else if (ch === 's') {
      if (!cache.statue) {
        const [c, g] = X.canvas(16, 30);
        g.fillStyle = '#5c565a'; g.fillRect(1, 22, 14, 8); g.fillStyle = '#4a4448'; g.fillRect(1, 28, 14, 2);
        const fig = (x, wand) => { g.fillStyle = '#7a7378'; g.fillRect(x, 10, 5, 12); g.fillRect(x + 1, 5, 3, 5); g.fillStyle = '#5e585c'; g.fillRect(x + 1, 6, 3, 3); g.fillRect(x + 4, 10, 1, 12);
          g.fillStyle = '#8a8388'; if (wand) g.fillRect(x - 1, 1, 1, 20); else { g.fillRect(x + 5, 6, 1, 12); g.fillRect(x + 4, 7, 3, 1); } };
        fig(2, false); fig(9, true);
        g.fillStyle = '#c9a24a'; g.fillRect(4, 25, 8, 1);
        cache.statue = c;
      }
      ctx.drawImage(cache.statue, sx, sy - 14);
    }
  };

  // ---------- Personagens ----------
  X.SPEC = {
    kravenox: { body: '#1b1420', bodyD: '#0e0a12', skin: '#2e2632', hair: '#141016', hairD: '#0b080d', eye: '#ff5a2a', spikes: '#090608', spikeHi: '#6a1a24', outline: '#000' },
    kravenoxP: { body: '#26222e', bodyD: '#16131c', skin: '#3a3440', hair: '#20192a', hairD: '#121016', eye: '#e8f0ff', spikes: '#b8c4d8', spikeHi: '#ffffff', outline: '#000' },
    thornox: { body: '#3b3a58', bodyD: '#27263c', skin: '#5a4a3a', hair: '#6a5a3a', hairD: '#4a3e28', eye: '#ffe08a', spikes: '#e8c46a', spikeHi: '#fff2b0', staff: true, outline: '#0b0710' },
    lyra: { body: '#e6e0d4', bodyD: '#b6ae9e', skin: '#e6c8b0', hair: '#d8dbe6', hairD: '#a8acbb', eye: '#e8b040', longHair: true, dress: true, small: true, roots: true, outline: '#1a1418' },
    lira: { body: '#2a2a36', bodyD: '#1a1a24', skin: '#c8c0c8', hair: '#121018', hairD: '#0a080e', eye: '#000000', small: true, marks: '#6af0e0', outline: '#000' },
    lira2: { body: '#f0d070', bodyD: '#c0a040', skin: '#ffe8a0', hair: '#ffe080', hairD: '#d0b050', eye: '#fff', small: true, outline: '#4a3010' },
    ancia: { body: '#5a5560', bodyD: '#45404a', skin: '#d8d4dc', hair: '#e8e4ec', hairD: '#b8b4bc', eye: '#3a3a4a', longHair: true, dress: true, roots: true, outline: '#0b0710' },
    sentinela: { body: '#24212c', bodyD: '#15131b', skin: '#24212c', hair: '#2e2a38', hairD: '#1a1820', eye: '#b26bff', helmet: true, sword: true, outline: '#000' },
    guardiao: { body: '#d8d4cc', bodyD: '#a8a49c', skin: '#e8e4dc', hair: '#e8e4dc', hairD: '#b8b4ac', eye: '#202020', helmet: true, mask: true, lance: true, outline: '#2a2630' },
    mascate: { body: '#5a4030', bodyD: '#3e2c20', skin: '#8a7060', hair: '#4a3424', hairD: '#3a2818', eye: '#ffcf6a', hood: true, lantern: true, outline: '#0b0710' },
    espirito: { body: '#7ab0d8', bodyD: '#5a88b0', skin: '#b8e0ff', hair: '#9ac8f0', hairD: '#7aa8d0', eye: '#ffffff', hood: true, ghost: true, outline: '#1a3050' },
    arauto: { body: '#120e18', bodyD: '#08060c', skin: '#1a1424', hair: '#1a1424', hairD: '#0a080e', eye: '#ff3a5a', helmet: true, outline: '#4a2a5a' },
  };
  function drawChar(g, s, dir, frame) {
    const p = (x, y, c) => { g.fillStyle = c; g.fillRect(x, y, 1, 1); };
    const r = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const oy = s.small ? 3 : 0;
    const swing = frame === 1 ? 1 : frame === 2 ? -1 : 0;
    // pernas
    if (!s.dress && !s.ghost) {
      const lc = s.bodyD;
      if (dir === 'down' || dir === 'up') {
        r(5, 16, 2, 3 - (swing > 0 ? 1 : 0), lc); r(9, 16, 2, 3 - (swing < 0 ? 1 : 0), lc);
      } else {
        r(6 + swing, 16, 2, 3, lc); r(8 - swing, 16, 2, 3, s.body);
      }
    } else if (s.dress) {
      r(4, 14 + (oy ? 1 : 0), 8, 4 - (oy ? 1 : 0), s.body); r(4, 17, 8, 1, s.bodyD);
      if (s.roots) { p(5, 17, '#1a1214'); p(9, 16, '#1a1214'); p(10, 17, '#1a1214'); }
      if (frame) { p(5 + (swing > 0 ? 0 : 5), 18, s.skin); }
    } else { // fantasma
      r(5, 15, 6, 2, s.body); p(5, 17, s.body); p(8, 17, s.body); p(10, 17, s.body);
    }
    // corpo
    const by = 10 + oy, bh = 6 - (oy ? 2 : 0) + (s.dress ? 0 : 0);
    if (dir === 'down' || dir === 'up') {
      r(4, by, 8, bh, s.body); r(4, by, 1, bh, s.bodyD); r(11, by, 1, bh, s.bodyD);
      r(3, by + 1 + (swing > 0 ? 1 : 0), 1, 4, s.bodyD); r(12, by + 1 + (swing < 0 ? 1 : 0), 1, 4, s.bodyD);
      p(3, by + 5 + (swing > 0 ? 1 : 0), s.skin); p(12, by + 5 + (swing < 0 ? 1 : 0), s.skin);
    } else {
      r(5, by, 6, bh, s.body); r(5, by, 1, bh, s.bodyD);
      r(7 + swing, by + 1, 2, 4, s.bodyD); p(7 + swing, by + 5, s.skin);
    }
    if (s.marks) { p(6, by + 2, s.marks); p(9, by + 3, s.marks); }
    if (s.roots && !s.dress) { p(5, by + 2, '#1a1214'); p(10, by + 3, '#1a1214'); }
    // cabeça
    const hy = 3 + oy;
    if (s.hood) {
      r(4, hy - 1, 8, 8, s.body); r(4, hy - 1, 1, 8, s.bodyD); r(11, hy - 1, 1, 8, s.bodyD);
      if (dir === 'down') { r(5, hy + 2, 6, 4, '#0d0a0c'); p(6, hy + 4, s.eye); p(9, hy + 4, s.eye); }
      else if (dir === 'left') { r(4, hy + 2, 4, 4, '#0d0a0c'); p(5, hy + 4, s.eye); }
      else if (dir === 'right') { r(8, hy + 2, 4, 4, '#0d0a0c'); p(10, hy + 4, s.eye); }
      r(3, by, 10, 2, s.body);
    } else {
      r(5, hy, 6, 7, s.hair); r(4, hy + 1, 8, 5, s.hair);
      if (dir === 'down') {
        r(5, hy + 2, 6, 4, s.skin); r(5, hy + 2, 6, 1, s.hairD);
        if (s.mask) { r(5, hy + 2, 6, 4, '#f4f0e8'); p(6, hy + 4, '#202020'); p(9, hy + 4, '#202020'); r(7, hy + 2, 2, 4, '#c9a24a'); }
        else { p(6, hy + 4, s.eye); p(9, hy + 4, s.eye); }
        if (s.helmet && !s.mask) { r(5, hy + 2, 6, 4, '#0a080c'); r(6, hy + 4, 1, 1, s.eye); r(9, hy + 4, 1, 1, s.eye); r(7, hy + 1, 2, 5, s.hair); }
      } else if (dir === 'left' || dir === 'right') {
        const fx = dir === 'left' ? 4 : 8;
        r(fx, hy + 2, 4, 4, s.skin);
        if (s.helmet && !s.mask) r(fx, hy + 2, 4, 4, '#0a080c');
        if (s.mask) r(fx, hy + 2, 4, 4, '#f4f0e8');
        p(dir === 'left' ? 5 : 10, hy + 4, s.mask ? '#202020' : s.eye);
      }
      if (s.longHair) {
        if (dir === 'down') { r(4, hy + 2, 1, 8, s.hair); r(11, hy + 2, 1, 8, s.hair); }
        else if (dir === 'up') { r(4, hy + 2, 8, 8, s.hair); r(5, hy + 7, 6, 1, s.hairD); }
        else { const bx = dir === 'left' ? 8 : 4; r(bx, hy + 2, 4, 8, s.hair); }
      }
    }
    // espinhos
    if (s.spikes) {
      const sp = [[5, hy - 1], [6, hy - 2], [8, hy - 3], [8, hy - 2], [10, hy - 2], [11, hy - 1], [3, by - 1], [12, by - 1], [2, by - 2], [13, by - 2]];
      if (dir === 'up') sp.push([6, by + 1], [9, by + 2], [7, by + 3], [10, by + 4], [5, by + 4]);
      if (dir === 'left') sp.push([11, by], [12, by + 1], [12, hy + 2], [13, hy + 1]);
      if (dir === 'right') sp.push([4, by], [3, by + 1], [3, hy + 2], [2, hy + 1]);
      for (const [x, y] of sp) p(x, y, s.spikes);
      p(8, hy - 3, s.spikeHi); p(2, by - 2, s.spikeHi); p(13, by - 2, s.spikeHi);
    }
    // armas
    const wx = dir === 'left' ? 2 : 13;
    if (s.staff && dir !== 'up') { r(wx, 4 + oy, 1, 15, '#6a4a2a'); r(wx - 1, 2 + oy, 3, 3, '#ffe08a'); p(wx, 3 + oy, '#fff'); }
    if (s.lance && dir !== 'up') { r(wx, 0, 1, 19, '#c8c0b0'); r(wx - 1, 0, 3, 3, '#f0f0ff'); }
    if (s.sword && dir !== 'up') { r(wx, by + 1, 1, 7, '#5a5a66'); p(wx, by, '#8a8a96'); }
    if (s.lantern && dir !== 'up') { r(wx - 1, by + 3, 3, 3, '#ffcf6a'); p(wx, by + 2, '#3a2a1a'); }
  }
  function outline(c, col) {
    const g = c.getContext('2d'); const w = c.width, h = c.height;
    const d = g.getImageData(0, 0, w, h); const a = d.data; const o = new Uint8ClampedArray(a);
    const rgb = [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4; if (a[i + 3]) continue;
      const n = (xx, yy) => xx >= 0 && yy >= 0 && xx < w && yy < h && a[(yy * w + xx) * 4 + 3] > 0;
      if (n(x - 1, y) || n(x + 1, y) || n(x, y - 1) || n(x, y + 1)) { o[i] = rgb[0]; o[i + 1] = rgb[1]; o[i + 2] = rgb[2]; o[i + 3] = 255; }
    }
    d.data.set(o); g.putImageData(d, 0, 0);
  }
  // Imagens desenhadas à mão (Kravenox)
  X.imgs = {};
  X.loadImages = function () {
    const names = ['titulo', 'k_portrait', 'kp_portrait', 't_portrait', 'desenho', 'k_furia', 't_furia', 'fx_garra1', 'fx_garra2', 'fx_orbe', 'fx_raio', 'fx_explosao', 'fx_espinhos', 'fx_espinhos2', 'e_sentinela', 'e_sentinela1', 'cratera', 'k_futuro', 'thornox_fig'];
    for (const p of ['k', 't']) for (const d of ['left', 'right']) for (let i = 0; i < 4; i++) names.push(p + '_' + d + '_w' + i);
    for (const n of ['afogado', 'coisa', 'cristalizado', 'eco', 'ecoGrande', 'fragmento', 'lembranca', 'maoNevoa', 'raizPetra', 'raizRast', 'raizVazio', 'sentinelaN', 'sombra', 'voz']) names.push('e_' + n);
    for (const n of ['lyra', 'ancia', 'mascate', 'espirito', 'lira', 'lira2']) for (const d of ['down', 'up', 'left', 'right']) for (const f of [0, 1]) names.push('s_' + n + '_' + d + '_' + f);
    for (const n of ['lyra', 'lira', 'lira2', 'ancia', 'guardiao', 'guardiao2', 'sentinela', 'semrosto', 'mascate', 'espirito', 'figura', 'arauto', 'mae', 'primeira', 'guerreiro']) names.push('p_' + n);
    for (const p of ['k', 'kp', 't']) for (const d of ['down', 'up', 'left', 'right']) for (const f of [0, 1]) names.push(p + '_' + d + '_' + f);
    return Promise.all(names.map(n => new Promise(res => { const im = new Image(); im.onload = () => { X.imgs[n] = im; res(); }; im.onerror = () => res(); im.src = 'img/' + n + '.png?v=' + (window.KRAVENOX_V || ''); })));
  };
  X.sprite = function (name, dir, frame, step) {
    // Kravenox de lado: 4 quadros de passo vindos da Cratera do Cisma
    // Thornox é o gêmeo: o mesmo corpo do Kravenox, em azul e dourado
    if ((name === 'kravenox' || name === 'thornox') && (dir === 'left' || dir === 'right') && step != null) {
      const im = X.imgs[(name === 'thornox' ? 't_' : 'k_') + dir + '_w' + (step < 0 ? 0 : step)];
      if (im) return im;
    }
    if (name === 'kravenox' || name === 'kravenoxP' || name === 'thornox') {
      const im = X.imgs[(name === 'kravenoxP' ? 'kp_' : name === 'thornox' ? 't_' : 'k_') + dir + '_' + (frame ? 1 : 0)];
      if (im) return im;
    }
    { const im = X.imgs['s_' + name + '_' + dir + '_' + (frame ? 1 : 0)]; if (im) return im; }   // personagens desenhados no estilo dos irmãos
    const key = 'spr' + name + dir + frame;
    if (cache[key]) return cache[key];
    const s = X.SPEC[name] || X.SPEC.mascate;
    const [c, g] = X.canvas(18, 22);
    g.translate(1, 1);
    const real = dir === 'right' ? 'left' : dir;
    drawChar(g, s, dir, frame);
    void real;
    outline(c, s.outline || '#000');
    return (cache[key] = c);
  };
  X.drawShadow = function (ctx, x, y) { ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x + 8, y + 15, 5, 2, 0, 0, 7); ctx.fill(); };

  // ---------- Retratos (48x48) ----------
  const P = {};
  function portrait(key, fn) {
    P[key] = function (ctx, x, y, t) {
      const ck = 'por' + key;
      if (!cache[ck]) { const [c, g] = X.canvas(48, 48); fn(g); cache[ck] = c; }
      ctx.drawImage(cache[ck], x, y);
      const e = P[key].anim; if (e) e(ctx, x, y, t);
    };
  }
  function bust(g, o) {
    // fundo
    const gr = g.createLinearGradient(0, 0, 0, 48); gr.addColorStop(0, o.bg1); gr.addColorStop(1, o.bg2); g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
    // ombros
    g.fillStyle = o.body; g.beginPath(); g.moveTo(4, 48); g.quadraticCurveTo(8, 34, 24, 33); g.quadraticCurveTo(40, 34, 44, 48); g.fill();
    // cabelo atrás
    if (o.hairBack) { g.fillStyle = o.hair; g.beginPath(); g.ellipse(24, 26, 14, 18, 0, 0, 7); g.fill(); }
    // pescoço e rosto
    g.fillStyle = o.skinD || o.skin; g.fillRect(20, 28, 8, 8);
    g.fillStyle = o.skin; g.beginPath(); g.ellipse(24, 22, 10, 12, 0, 0, 7); g.fill();
    g.fillStyle = o.skinD || 'rgba(0,0,0,0.2)'; g.beginPath(); g.ellipse(28, 24, 6, 10, 0, 0, 7); g.globalAlpha = 0.35; g.fill(); g.globalAlpha = 1;
    // cabelo frente
    if (o.hair) { g.fillStyle = o.hair; g.beginPath(); g.ellipse(24, 14, 11, 7, 0, Math.PI, 0); g.fill(); g.fillRect(13, 13, 22, 3); }
    // olhos
    g.fillStyle = o.eyeBg || '#000'; g.fillRect(18, 21, 4, 2); g.fillRect(26, 21, 4, 2);
    g.fillStyle = o.eye; g.fillRect(19, 21, 2, 2); g.fillRect(27, 21, 2, 2);
    // boca
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(22, 29, 4, 1);
  }
  portrait('kravenox', g => {
    bust(g, { bg1: '#2a0a10', bg2: '#0a0406', body: '#140e18', skin: '#2e2632', skinD: '#1a141e', hair: '#110c14', eye: '#ff5a2a', eyeBg: '#3a0a08' });
    g.fillStyle = '#0a070c';
    const sp = [[14, 12, 6, 0], [18, 8, 2, -10], [24, 6, 0, -12], [30, 8, -2, -10], [34, 12, -6, 0], [10, 38, -8, -6], [38, 38, 8, -6], [6, 44, -6, -4], [42, 44, 6, -4]];
    for (const [x, y, dx, dy] of sp) { g.beginPath(); g.moveTo(x - 3, y + 2); g.lineTo(x + dx, y + dy - 3); g.lineTo(x + 3, y + 2); g.fill(); }
    g.fillStyle = '#6a1a24'; g.fillRect(23, 0, 1, 3);
    g.fillStyle = 'rgba(255,90,42,0.25)'; g.fillRect(16, 20, 16, 4);
  });
  portrait('kravenoxP', g => {
    bust(g, { bg1: '#1a2030', bg2: '#06080c', body: '#1e1a26', skin: '#3a3440', skinD: '#24202a', hair: '#1a1520', eye: '#e8f4ff', eyeBg: '#2a3a4a' });
    g.fillStyle = '#c8d4e8';
    const sp = [[14, 12, 6, 0], [18, 8, 2, -10], [24, 6, 0, -12], [30, 8, -2, -10], [34, 12, -6, 0], [10, 38, -8, -6], [38, 38, 8, -6]];
    for (const [x, y, dx, dy] of sp) { g.beginPath(); g.moveTo(x - 3, y + 2); g.lineTo(x + dx, y + dy - 3); g.lineTo(x + 3, y + 2); g.fill(); }
  });
  portrait('thornox', g => {
    bust(g, { bg1: '#3a3010', bg2: '#0e0a04', body: '#3b3a58', skin: '#7a6448', skinD: '#5a4a34', hair: '#5a4a2a', eye: '#ffe08a', eyeBg: '#3a2a08' });
    g.fillStyle = '#f0d27a';
    const sp = [[15, 12, 5, -2], [20, 8, 1, -9], [26, 7, 0, -10], [32, 10, -3, -7], [10, 38, -7, -5], [38, 38, 7, -5]];
    for (const [x, y, dx, dy] of sp) { g.beginPath(); g.moveTo(x - 2, y + 2); g.lineTo(x + dx, y + dy - 2); g.lineTo(x + 2, y + 2); g.fill(); }
    g.fillStyle = 'rgba(255,230,140,0.18)'; g.beginPath(); g.arc(24, 18, 22, 0, 7); g.fill();
    g.fillStyle = '#6a4a2a'; g.fillRect(42, 10, 2, 38); g.fillStyle = '#ffe08a'; g.beginPath(); g.arc(43, 9, 3, 0, 7); g.fill();
  });
  portrait('lyra', g => {
    bust(g, { bg1: '#2a2a3a', bg2: '#0a0a12', body: '#e6e0d4', skin: '#e8ccb4', skinD: '#c8a890', hair: '#dcdfe8', hairBack: true, eye: '#e8b040', eyeBg: '#4a3010' });
    g.strokeStyle = '#1a1214'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(8, 48); g.bezierCurveTo(12, 40, 16, 42, 20, 36); g.moveTo(40, 48); g.bezierCurveTo(36, 42, 34, 44, 30, 37); g.stroke();
    g.fillStyle = '#ffd860'; g.beginPath(); g.moveTo(24, 38); g.lineTo(27, 43); g.lineTo(24, 48); g.lineTo(21, 43); g.fill();
  });
  portrait('lira', g => {
    bust(g, { bg1: '#10202a', bg2: '#04080a', body: '#2a2a36', skin: '#c8c0c8', skinD: '#a098a8', hair: '#121018', eye: '#000', eyeBg: '#000' });
    g.fillStyle = '#000'; g.fillRect(17, 20, 6, 4); g.fillRect(25, 20, 6, 4);
    g.fillStyle = '#6af0e0'; [[16, 28], [31, 26], [20, 34], [28, 36], [14, 40], [34, 42]].forEach(([x, y]) => g.fillRect(x, y, 2, 1));
  });
  portrait('lira2', g => {
    bust(g, { bg1: '#4a3a10', bg2: '#1a1004', body: '#f0d070', skin: '#ffe8a8', skinD: '#e0c080', hair: '#ffe080', eye: '#fff', eyeBg: '#c09030' });
    g.fillStyle = 'rgba(255,240,160,0.3)'; g.beginPath(); g.arc(24, 22, 22, 0, 7); g.fill();
  });
  portrait('ancia', g => {
    bust(g, { bg1: '#2a2010', bg2: '#0a0806', body: '#4a4550', skin: '#dcd8e0', skinD: '#b8b4c0', hair: '#eeeaf2', hairBack: true, eye: '#5a5a6a', eyeBg: '#2a2a3a' });
    g.strokeStyle = '#1a1214'; g.lineWidth = 2; g.beginPath(); g.moveTo(6, 48); g.bezierCurveTo(10, 36, 14, 40, 18, 30); g.moveTo(42, 48); g.bezierCurveTo(38, 38, 36, 42, 31, 31); g.stroke();
    g.fillStyle = 'rgba(255,210,100,0.25)'; g.fillRect(0, 40, 48, 8);
  });
  portrait('guardiao', g => {
    bust(g, { bg1: '#2a2a30', bg2: '#08080a', body: '#d8d4cc', skin: '#f2eee6', skinD: '#c8c4bc', hair: '#e0dcd4', eye: '#101010', eyeBg: '#101010' });
    g.fillStyle = '#c9a24a'; g.fillRect(23, 10, 2, 24); g.fillRect(17, 16, 14, 1);
    g.strokeStyle = '#6a6460'; g.lineWidth = 1; g.beginPath(); g.moveTo(30, 12); g.lineTo(27, 20); g.lineTo(31, 26); g.stroke();
    g.fillStyle = '#c8c0b0'; g.fillRect(42, 0, 2, 48); g.fillStyle = '#f0f0ff'; g.beginPath(); g.moveTo(43, 0); g.lineTo(46, 6); g.lineTo(40, 6); g.fill();
  });
  portrait('guardiao2', g => { // sem máscara: velho com cicatrizes
    bust(g, { bg1: '#2a2a30', bg2: '#08080a', body: '#d8d4cc', skin: '#b8a898', skinD: '#8a7a6a', hair: '#e8e8e8', hairBack: true, eye: '#c0d8ff', eyeBg: '#202830' });
    g.strokeStyle = '#6a3a3a'; g.lineWidth = 1; g.beginPath(); g.moveTo(16, 14); g.lineTo(21, 30); g.moveTo(30, 15); g.lineTo(27, 24); g.moveTo(25, 30); g.lineTo(31, 32); g.stroke();
  });
  portrait('sentinela', g => {
    bust(g, { bg1: '#1a0a2a', bg2: '#06020a', body: '#24212c', skin: '#2e2a38', skinD: '#1a1820', hair: '#2e2a38', eye: '#b26bff', eyeBg: '#0a0610' });
    g.fillStyle = '#0a080c'; g.fillRect(15, 18, 18, 8); g.fillStyle = '#b26bff'; g.fillRect(18, 21, 3, 2); g.fillRect(27, 21, 3, 2);
    g.fillStyle = '#3a3646'; g.fillRect(23, 8, 2, 20);
  });
  portrait('semrosto', g => {
    bust(g, { bg1: '#1a0a2a', bg2: '#06020a', body: '#24212c', skin: '#100a18', skinD: '#100a18', hair: null, eye: '#100a18', eyeBg: '#100a18' });
    g.fillStyle = '#3a1a5a'; g.beginPath(); g.ellipse(24, 22, 9, 11, 0, 0, 7); g.fill();
    g.fillStyle = '#7a3ac0'; for (let i = 0; i < 9; i++) g.fillRect(17 + (i * 7) % 14, 14 + (i * 5) % 16, 2, 2);
  });
  P.semrosto.anim = (ctx, x, y, t) => { ctx.globalAlpha = 0.3 + 0.25 * Math.sin(t / 8); ctx.fillStyle = '#b26bff'; ctx.beginPath(); ctx.ellipse(x + 24, y + 22, 7, 9, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; };
  portrait('mascate', g => {
    bust(g, { bg1: '#2a1a0a', bg2: '#0a0604', body: '#5a4030', skin: '#5a4030', skinD: '#3e2c20', hair: null, eye: '#ffcf6a', eyeBg: '#0d0a0c' });
    g.fillStyle = '#5a4030'; g.beginPath(); g.moveTo(8, 40); g.quadraticCurveTo(10, 4, 24, 3); g.quadraticCurveTo(38, 4, 40, 40); g.fill();
    g.fillStyle = '#0d0a0c'; g.beginPath(); g.ellipse(24, 24, 9, 11, 0, 0, 7); g.fill();
    g.fillStyle = '#ffcf6a'; g.fillRect(19, 22, 3, 2); g.fillRect(27, 22, 3, 2);
  });
  portrait('espirito', g => {
    bust(g, { bg1: '#0a1a2a', bg2: '#02060a', body: '#7ab0d8', skin: '#b8e0ff', skinD: '#8ab8e0', hair: null, eye: '#fff', eyeBg: '#3a6a9a' });
    g.fillStyle = 'rgba(160,210,255,0.6)'; g.beginPath(); g.moveTo(8, 40); g.quadraticCurveTo(10, 4, 24, 3); g.quadraticCurveTo(38, 4, 40, 40); g.fill();
  });
  portrait('arauto', g => {
    bust(g, { bg1: '#2a0a1a', bg2: '#06020a', body: '#120e18', skin: '#1a1424', skinD: '#0a080e', hair: '#0e0a14', eye: '#ff3a5a', eyeBg: '#000' });
    g.strokeStyle = '#4a2a5a'; g.lineWidth = 1; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(10 + i * 4, 34); g.lineTo(14 + i * 4, 48); g.stroke(); }
    g.fillStyle = '#ff3a5a'; g.fillRect(23, 38, 2, 8); g.fillRect(19, 41, 10, 1);
  });
  portrait('mae', g => {
    bust(g, { bg1: '#3a3020', bg2: '#0a0806', body: '#e8dcc0', skin: '#f0d8c0', skinD: '#d0b8a0', hair: '#c8b8e0', hairBack: true, eye: '#ffe0a0', eyeBg: '#4a3a20' });
    g.fillStyle = 'rgba(255,240,200,0.25)'; g.beginPath(); g.arc(24, 22, 22, 0, 7); g.fill();
  });
  portrait('primeira', g => {
    bust(g, { bg1: '#0a0408', bg2: '#000', body: '#08050a', skin: '#140a18', skinD: '#08040a', hair: '#0a060c', hairBack: true, eye: '#ffffff', eyeBg: '#5a0a20' });
    g.fillStyle = '#000'; const sp = [[14, 12, 6, 0], [20, 7, 1, -10], [28, 7, -1, -10], [34, 12, -6, 0]];
    for (const [x, y, dx, dy] of sp) { g.beginPath(); g.moveTo(x - 3, y + 2); g.lineTo(x + dx, y + dy - 3); g.lineTo(x + 3, y + 2); g.fill(); }
  });
  portrait('figura', g => {
    bust(g, { bg1: '#1a1a2a', bg2: '#04040a', body: '#1a1626', skin: '#1a1626', skinD: '#0e0a14', hair: null, eye: '#c0c8ff', eyeBg: '#0a0a14' });
    g.fillStyle = '#1a1626'; g.beginPath(); g.moveTo(8, 40); g.quadraticCurveTo(10, 4, 24, 3); g.quadraticCurveTo(38, 4, 40, 40); g.fill();
    g.fillStyle = '#0a0812'; g.beginPath(); g.ellipse(24, 24, 9, 11, 0, 0, 7); g.fill();
    g.fillStyle = '#dfe4f0'; g.fillRect(17, 26, 2, 12); g.fillRect(29, 26, 2, 12);
    g.fillStyle = '#c0c8ff'; g.fillRect(19, 22, 3, 2); g.fillRect(27, 22, 3, 2); g.fillStyle = '#8a4aff'; g.fillRect(23, 16, 2, 2);
  });
  portrait('guerreiro', g => {
    bust(g, { bg1: '#1a1030', bg2: '#06040a', body: '#4a4a6a', skin: '#b0a8c8', skinD: '#8a82a8', hair: '#3a3050', eye: '#202030', eyeBg: '#fff' });
    g.fillStyle = 'rgba(180,140,255,0.25)'; g.fillRect(0, 0, 48, 48);
  });
  for (const [k, img] of [['kravenox', 'k_portrait'], ['kravenoxP', 'kp_portrait'], ['thornox', 't_portrait']]) {
    const base = P[k];
    P[k] = function (ctx, x, y, t) {
      const im = X.imgs[img];
      if (!im) return base(ctx, x, y, t);
      const gr = ctx.createLinearGradient(0, y, 0, y + 48); gr.addColorStop(0, k === 'kravenox' ? '#3a0a10' : k === 'thornox' ? '#3a3010' : '#1a2030'); gr.addColorStop(1, '#050204');
      ctx.fillStyle = gr; ctx.fillRect(x, y, 48, 48);
      X.glow(ctx, x + 24, y + 22, 24, k === 'kravenox' ? 'rgba(255,60,30,0.35)' : k === 'thornox' ? 'rgba(255,224,138,0.4)' : 'rgba(200,220,255,0.3)', 0.6 + 0.25 * Math.sin(t / 25));
      ctx.drawImage(im, x, y);
    };
  }
  // retratos desenhados (img/p_*.png): fundo em degradê e brilho, como nos irmãos
  const PBG = { lyra: ['#2a2a3a', '#c8d8ff'], lira: ['#10202a', '#6af0e0'], lira2: ['#4a3a10', '#ffe080'], ancia: ['#2a2010', '#ffd890'], guardiao: ['#2a2a30', '#ffffff'],
    guardiao2: ['#2a2a30', '#c0d8ff'], sentinela: ['#1a0a2a', '#b26bff'], semrosto: ['#1a0a2a', '#b26bff'], mascate: ['#2a1a0a', '#ffcf6a'], espirito: ['#0a1a2a', '#bfe4ff'],
    figura: ['#1a1a2a', '#c0c8ff'], arauto: ['#2a0a1a', '#ff3a5a'], mae: ['#3a3020', '#fff0c0'], primeira: ['#1a0408', '#a01030'], guerreiro: ['#1a1030', '#c8a8ff'] };
  for (const k of Object.keys(PBG)) {
    const base = P[k];
    P[k] = function (ctx, x, y, t) {
      const im = X.imgs['p_' + k]; if (!im) return base && base(ctx, x, y, t);
      const [b0, gl] = PBG[k];
      const gr = ctx.createLinearGradient(0, y, 0, y + 48); gr.addColorStop(0, b0); gr.addColorStop(1, '#050204'); ctx.fillStyle = gr; ctx.fillRect(x, y, 48, 48);
      const r = parseInt(gl.slice(1, 3), 16), g2 = parseInt(gl.slice(3, 5), 16), b2 = parseInt(gl.slice(5, 7), 16);
      X.glow(ctx, x + 24, y + 22, 24, `rgba(${r},${g2},${b2},0.3)`, 0.6 + 0.25 * Math.sin(t / 25));
      ctx.drawImage(im, x, y);
      if (base && base.anim) base.anim(ctx, x, y, t);
    };
  }
  X.P = P;
  G.portraitFor = function (name) {
    const map = { 'Kravenox': G.state && G.state.flags.prata ? 'kravenoxP' : 'kravenox', 'Thornox': 'thornox', 'Lyra': 'lyra', 'Lira': G.state && G.state.flags.liraDourada ? 'lira2' : 'lira',
      'Mulher das Raízes': 'ancia', 'Guardião Branco': G.state && G.state.flags.semMascara ? 'guardiao2' : 'guardiao', 'Sentinela': 'sentinela', 'Sentinela sem Rosto': 'semrosto',
      'Mascate de Cinzas': 'mascate', 'Espírito do Santuário': 'espirito', 'Arauto': 'arauto', 'A Mãe': 'mae', '???': 'primeira', 'A Primeira Consciência': 'primeira',
      'Figura Encapuzada': 'figura', 'Guerreiro Cristalizado': 'guerreiro', 'O Velho': 'guardiao2' };
    const k = map[name];
    return k ? P[k] : null;
  };

  // ---------- Cenários de batalha ----------
  X.BG = {
    abismo: { sky: ['#141216', '#2a2630'], ground: ['#2a2830', '#121014'], deco: 'stalac', acc: '#ff3a2a' },
    planicie: { sky: ['#3a0a10', '#8a2a20'], ground: ['#3a3440', '#1e1a22'], deco: 'crystals', acc: '#c18bff' },
    vila: { sky: ['#2a0a14', '#6a1a1a'], ground: ['#3e383c', '#1e1a1e'], deco: 'houses', acc: '#ffcf6a' },
    floresta: { sky: ['#0a0a10', '#2a1a24'], ground: ['#241e24', '#0e0a0e'], deco: 'trees', acc: '#6a4a8a' },
    templo: { sky: ['#140c08', '#2a1c12'], ground: ['#2e2218', '#120c08'], deco: 'roots', acc: '#e0c060' },
    caverna: { sky: ['#0a0614', '#1e0e30'], ground: ['#1a1226', '#08060e'], deco: 'crystalwall', acc: '#b26bff' },
    vale: { sky: ['#2a3040', '#5a6478'], ground: ['#3a4250', '#1a1e26'], deco: 'graves', acc: '#c8d8f0' },
    ponte: { sky: ['#05070a', '#1a2030'], ground: ['#8f897c', '#2a2620'], deco: 'void', acc: '#f0f0ff' },
    submersa: { sky: ['#02080e', '#08283a'], ground: ['#0a2030', '#020a10'], deco: 'towers', acc: '#6af0e0' },
    fonte: { sky: ['#000000', '#1a1408'], ground: ['#14100a', '#000'], deco: 'tree', acc: '#ffe08a' },
  };
  X.drawBG = function (ctx, name, t, h = 150) {
    const B = X.BG[name] || X.BG.planicie;
    const key = 'bg' + name + h;
    if (!cache[key]) {
      const [c, g] = X.canvas(G.W, h);
      const hz = Math.floor(h * 0.62);
      let gr = g.createLinearGradient(0, 0, 0, hz); gr.addColorStop(0, B.sky[0]); gr.addColorStop(1, B.sky[1]); g.fillStyle = gr; g.fillRect(0, 0, G.W, hz);
      gr = g.createLinearGradient(0, hz, 0, h); gr.addColorStop(0, B.ground[0]); gr.addColorStop(1, B.ground[1]); g.fillStyle = gr; g.fillRect(0, hz, G.W, h - hz);
      const r = X.rng(name.length * 99);
      g.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 60; i++) g.fillRect(r() * G.W, hz + r() * (h - hz), 2 + r() * 6, 1);
      const sil = 'rgba(0,0,0,0.55)';
      switch (B.deco) {
        case 'stalac': g.fillStyle = '#0a0406'; for (let x = 0; x < G.W; x += 14) { const hh = 10 + r() * 40; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 7, hh); g.lineTo(x + 14, 0); g.fill(); }
          g.fillStyle = 'rgba(255,60,40,0.15)'; for (let i = 0; i < 20; i++) g.fillRect(r() * G.W, hz - 2 + r() * 30, 1, 1); break;
        case 'crystals': g.fillStyle = '#2a1e2e'; g.beginPath(); g.moveTo(0, hz); for (let x = 0; x <= G.W; x += 20) g.lineTo(x, hz - 10 - r() * 26); g.lineTo(G.W, hz); g.fill();
          for (let i = 0; i < 8; i++) { const x = r() * G.W, hh = 8 + r() * 20; g.fillStyle = '#120d18'; g.beginPath(); g.moveTo(x - 4, hz + 6); g.lineTo(x, hz + 6 - hh); g.lineTo(x + 4, hz + 6); g.fill(); g.fillStyle = '#6b3f9c'; g.fillRect(x, hz + 8 - hh, 1, hh - 6); }
          g.fillStyle = '#2a2430'; g.fillRect(250, hz - 60, 10, 60); g.beginPath(); g.moveTo(250, hz - 60); g.lineTo(253, hz - 70); g.lineTo(256, hz - 64); g.lineTo(260, hz - 60); g.fill(); break;
        case 'houses': for (let i = 0; i < 6; i++) { const x = i * 56 + r() * 20, hh = 20 + r() * 14; g.fillStyle = '#1e1418'; g.fillRect(x, hz - hh, 34, hh); g.beginPath(); g.moveTo(x - 4, hz - hh); g.lineTo(x + 17, hz - hh - 14); g.lineTo(x + 38, hz - hh); g.fill(); if (r() < 0.4) { g.fillStyle = '#ffcf6a'; g.fillRect(x + 14, hz - hh + 8, 4, 5); } } break;
        case 'trees': for (let i = 0; i < 16; i++) { const x = r() * G.W; g.strokeStyle = i < 8 ? '#14101a' : '#0a080e'; g.lineWidth = 3 + r() * 5; g.beginPath(); g.moveTo(x, h); g.lineTo(x + r() * 10 - 5, 0); g.stroke(); g.lineWidth = 1.5; for (let j = 0; j < 4; j++) { const y = 10 + r() * hz; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 50, y - 15); g.stroke(); } } break;
        case 'roots': g.strokeStyle = '#120a06'; for (let i = 0; i < 18; i++) { g.lineWidth = 2 + r() * 6; g.beginPath(); g.moveTo(r() * G.W, 0); g.bezierCurveTo(r() * G.W, hz * 0.5, r() * G.W, hz, r() * G.W, h); g.stroke(); }
          g.fillStyle = 'rgba(224,192,96,0.5)'; for (let i = 0; i < 30; i++) g.fillRect(r() * G.W, r() * hz, 1, 1); break;
        case 'crystalwall': for (let i = 0; i < 26; i++) { const x = r() * G.W, y = r() * hz, s = 6 + r() * 16; g.fillStyle = r() < 0.5 ? '#2a1a40' : '#1a1028'; g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * 0.5, y); g.lineTo(x, y + s); g.lineTo(x - s * 0.5, y); g.fill(); g.fillStyle = 'rgba(180,107,255,0.4)'; g.fillRect(x, y - s + 2, 1, s); } break;
        case 'graves': g.fillStyle = 'rgba(200,215,230,0.12)'; for (let i = 0; i < 5; i++) g.fillRect(0, hz - 30 + i * 8, G.W, 6);
          for (let i = 0; i < 18; i++) { const x = r() * G.W, y = hz + r() * (h - hz - 10); g.fillStyle = '#4a525e'; g.fillRect(x, y - 8, 4, 8); g.fillRect(x - 1, y - 7, 6, 2); } break;
        case 'void': g.fillStyle = '#05070a'; g.fillRect(0, hz, G.W, h - hz); g.fillStyle = '#8f897c'; g.beginPath(); g.moveTo(110, h); g.lineTo(150, hz); g.lineTo(170, hz); g.lineTo(210, h); g.fill();
          g.fillStyle = '#5d574c'; for (let y = hz; y < h; y += 5) { const k = (y - hz) / (h - hz); g.fillRect(150 - k * 40, y, 20 + k * 80, 1); }
          g.fillStyle = 'rgba(200,220,255,0.08)'; for (let i = 0; i < 6; i++) g.fillRect(0, r() * hz, G.W, 3); break;
        case 'towers': for (let i = 0; i < 9; i++) { const x = r() * G.W, y = 10 + r() * (hz - 20), w = 8 + r() * 14, hh = 20 + r() * 40; g.fillStyle = i < 4 ? '#06141e' : '#0a2232'; g.fillRect(x, y, w, hh); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w / 2, y - 8); g.lineTo(x + w, y); g.fill(); g.fillStyle = 'rgba(106,240,224,0.4)'; g.fillRect(x + w / 2, y + 6, 1, 3); }
          g.fillStyle = 'rgba(106,240,224,0.15)'; for (let i = 0; i < 40; i++) g.fillRect(r() * G.W, r() * h, 1, 1); break;
        case 'tree': g.strokeStyle = '#2a2010'; for (let i = 0; i < 10; i++) { g.lineWidth = 2 + r() * 4; g.beginPath(); g.moveTo(G.W / 2, hz); g.bezierCurveTo(G.W / 2 + (r() - 0.5) * 200, hz + 20, r() * G.W, h - 10, r() * G.W, h); g.stroke(); }
          g.fillStyle = '#3a3018'; g.fillRect(G.W / 2 - 12, 0, 24, hz);
          g.fillStyle = 'rgba(255,224,138,0.5)'; for (let i = 0; i < 40; i++) { const x = r() * G.W, y = r() * hz * 0.7; g.fillRect(x, y, 2, 1); } break;
      }
      void sil;
      cache[key] = X.dither(c, B.levels || 15);
    }
    ctx.drawImage(cache[key], 0, 0, G.W, h);
    // animação leve: partículas
    ctx.fillStyle = B.acc;
    for (let i = 0; i < 14; i++) {
      const x = (i * 53 + t * (0.2 + (i % 3) * 0.1)) % G.W, y = (i * 37 + Math.sin(t / 40 + i) * 10) % (h * 0.8);
      ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t / 20 + i); ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  };

  // ---------- Arena isométrica (batalha no estilo Super Mario RPG) ----------
  // Piso em losangos visto de cima e de lado; em lugares fechados, duas paredes formam o canto da sala.
  const ARENA = {
    abismo: { floor: [58, 55, 62], stone: [74, 70, 78], vein: [200, 40, 40], indoor: true },
    templo: { floor: [92, 76, 56], stone: [96, 80, 58], vein: [224, 192, 96], indoor: true },
    caverna: { floor: [44, 36, 60], stone: [52, 40, 72], vein: [178, 107, 255], indoor: true },
    submersa: { floor: [26, 56, 66], stone: [30, 62, 76], vein: [106, 240, 224], indoor: true },
    fonte: { floor: [58, 48, 30], stone: [60, 50, 30], vein: [255, 224, 138], indoor: true },
    planicie: { floor: [70, 62, 76], grass: [86, 80, 62] },
    vila: { floor: [74, 68, 72], cob: true },
    floresta: { floor: [42, 36, 44], grass: [60, 40, 46] },
    vale: { floor: [62, 72, 84], grass: [84, 98, 108] },
    ponte: { floor: [128, 110, 88], plank: true },
  };
  X.drawArena = function (ctx, name, t, h) {
    const A = ARENA[name] || ARENA.planicie;
    const key = 'arena' + name + h;
    if (!cache[key]) {
      const W = G.W, [c, g] = X.canvas(W, h);
      if (!A.indoor) { // cenário ao fundo, nos cantos de cima
        X.drawBG(g, name, 0, 118);
        const B0 = X.BG[name] || X.BG.planicie; g.fillStyle = B0.ground[1]; g.fillRect(0, 118, W, h - 118);
      }
      const im = g.getImageData(0, 0, W, h), d = im.data;
      const TX = 160, TY = 26;
      const hh = (a, b, s) => { let v = Math.imul(a, 374761393) + Math.imul(b, 668265263) + s * 1442695041 | 0; v = Math.imul(v ^ v >>> 13, 1274126177); return ((v ^ v >>> 16) >>> 0) / 4294967296; };
      const BY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
      const set = (i, col, k) => { d[i] = Math.min(255, col[0] * k); d[i + 1] = Math.min(255, col[1] * k); d[i + 2] = Math.min(255, col[2] * k); d[i + 3] = 255; };
      const q = (k, x, y) => Math.round(k * 10 + (BY[(y & 3) * 4 + (x & 3)] / 16 - 0.5)) / 10; // tons em degraus com pontilhado
      for (let y = 0; y < h; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const edgeY = TY + Math.abs(x - TX) * 0.5;
        if (y >= edgeY) {
          // piso: coordenadas isométricas
          const a = (x - TX) / 16, b = (y - TY) / 8, u = (b + a) / 2, v = (b - a) / 2;
          const ti = Math.floor(u), tj = Math.floor(v), fu = u - ti, fv = v - tj;
          const r = hh(ti, tj, 7);
          const dist = Math.hypot(x - 175, (y - 130) * 1.6) / 190;
          let k = 1.02 - dist * 0.55 + (r - 0.5) * 0.12 + ((ti + tj) & 1 ? 0.04 : -0.02);
          let col = A.floor;
          if (A.grass && hh(ti, tj, 9) < 0.45) col = A.grass;
          if (A.plank) { const pl = Math.floor(u * 3); k += (hh(pl, 0, 3) - 0.5) * 0.15; if ((u * 3) % 1 < 0.1) k *= 0.55; }
          else if (fu < 0.05 || fv < 0.05) k *= 0.62;          // rejunte
          else if (fu > 0.95 || fv > 0.95) k *= 0.8;
          else if (fu < 0.14 && fv > 0.1) k *= 1.12;           // aresta iluminada
          if (A.cob) { const gx = Math.floor(u * 2), gy = Math.floor(v * 2); if ((u * 2) % 1 < 0.08 || (v * 2) % 1 < 0.08) k *= 0.7; else k += (hh(gx, gy, 5) - 0.5) * 0.2; }
          if (hh(x, y, 11) < 0.03) k *= 0.85;
          if (A.vein && hh(ti, tj, 13) < 0.1 && fu > 0.2 && fu < 0.85 && Math.abs(fv - 0.5 - (fu - 0.5) * (hh(ti, tj, 14) - 0.5) * 1.6 - Math.sin(fu * 9) * 0.04) < 0.035) { set(i, A.vein, 0.6); continue; }
          if (y - edgeY < 1.5) k *= A.indoor ? 0.45 : 0.7;    // pé da parede / borda
          set(i, col, Math.max(0.15, q(k, x, y)));
        } else if (A.indoor) {
          // paredes de blocos que formam o canto da sala
          const left = x < TX, wu = Math.abs(x - TX), wv = edgeY - y;
          const row = Math.floor(wv / 7), col = Math.floor((wu * 1.12 + (row & 1) * 9) / 18);
          const r = hh(col, row, left ? 3 : 4);
          let k = (left ? 0.95 : 0.7) + (r - 0.5) * 0.18 - wv * 0.004;
          const mv = wv % 7, mu = (wu * 1.12 + (row & 1) * 9) % 18;
          if (mv < 1 || mu < 1.2) k *= 0.45;
          else if (mv > 5.8) k *= 0.8;
          else if (mv < 2) k *= 1.1;
          if (A.vein && r < 0.06 && Math.abs(mu - 9 - (mv - 3.5) * 1.3) < 0.8) { set(i, A.vein, 0.75); continue; }
          if (x === TX || x === TX - 1) k *= 0.5;           // quina
          set(i, A.stone, Math.max(0.12, q(k, x, y)));
        }
      }
      g.putImageData(im, 0, 0);
      if (A.indoor) { // tochas nas paredes
        for (const [tx, ty] of [[80, 34], [240, 34]]) { g.fillStyle = '#2a1e18'; g.fillRect(tx - 1, ty, 3, 9); g.fillStyle = '#4a3a30'; g.fillRect(tx - 2, ty, 5, 2); }
      }
      cache[key] = c;
    }
    ctx.drawImage(cache[key], 0, 0);
    if (A.indoor) {
      const ac = A.vein;
      for (const [tx, ty] of [[80, 34], [240, 34]]) {
        const f = 0.75 + 0.25 * Math.sin(t / 3 + tx) * Math.sin(t / 7.1);
        X.glow(ctx, tx + 0.5, ty - 3, 34, `rgba(${ac[0]},${Math.min(255, ac[1] + 80)},${ac[2]},0.35)`, f);
        ctx.fillStyle = '#ffd070'; ctx.fillRect(tx - 1, ty - 4 + ((t >> 3) & 1), 3, 4); ctx.fillStyle = '#fff2c0'; ctx.fillRect(tx, ty - 3, 1, 2);
      }
    }
    // poeira/brasas no ar
    const B0 = X.BG[name] || X.BG.planicie;
    ctx.fillStyle = B0.acc;
    for (let i = 0; i < 14; i++) {
      const x = (i * 53 + t * (0.2 + (i % 3) * 0.1)) % G.W, y = (i * 37 + Math.sin(t / 40 + i) * 10) % (h * 0.8);
      ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t / 20 + i); ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;
  };

  // Filtro de pixel art: alfa duro, cores reduzidas, luz de borda, sombra e contorno.
  X.pixelize = function (src, opt = {}) {
    const w = src.width + 2, h = src.height + 2;
    const [c, g] = X.canvas(w, h);
    g.drawImage(src, 1, 1);
    const d = g.getImageData(0, 0, w, h), a = d.data;
    const step = opt.step || 20;
    const op = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) op[i] = a[i * 4 + 3] >= (opt.alpha || 110) ? 1 : 0;
    const out = new Uint8ClampedArray(a.length);
    const at = (x, y) => x >= 0 && y >= 0 && x < w && y < h && op[y * w + x];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, k = i * 4;
      if (op[i]) {
        const r = a[k], gg = a[k + 1], b = a[k + 2];
        let f = 1;
        if (!at(x, y - 1) || !at(x - 1, y)) f = 1.35;           // luz vinda de cima/esquerda
        else if (!at(x, y + 1) || !at(x + 1, y)) f = 0.62;      // sombra embaixo/direita
        out[k] = Math.min(255, Math.round(r * f / step) * step);
        out[k + 1] = Math.min(255, Math.round(gg * f / step) * step);
        out[k + 2] = Math.min(255, Math.round(b * f / step) * step);
        out[k + 3] = 255;
      } else if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) {
        out[k] = 4; out[k + 1] = 2; out[k + 2] = 6; out[k + 3] = 255;   // contorno
      }
    }
    d.data.set(out); g.putImageData(d, 0, 0);
    return c;
  };
  // Cenário em meia resolução com pontilhado ordenado (Bayer 4x4), como nos 16 bits.
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  X.dither = function (src, levels = 6) {
    const w = src.width >> 1, h = src.height >> 1;
    const [c, g] = X.canvas(w, h);
    g.imageSmoothingEnabled = true; g.drawImage(src, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h), a = d.data, q = 255 / (levels - 1);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const k = (y * w + x) * 4, t = (BAYER[(y & 3) * 4 + (x & 3)] / 16 - 0.5) * q;
      for (let ch = 0; ch < 3; ch++) a[k + ch] = Math.max(0, Math.min(255, Math.round((a[k + ch] + t) / q) * q));
      a[k + 3] = 255;
    }
    g.putImageData(d, 0, 0);
    return c;
  };

  // Brilho radial simples
  X.glow = function (ctx, x, y, r, color, a = 1) {
    const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = a; ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1;
  };
})();
