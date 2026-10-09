'use strict';
// Masmorra em primeira pessoa com texturas: paredes de pedra, chão de lajotas,
// teto abobadado, tochas, escuridão com a distância e movimento suave.
(function () {
  const Dun = G.Dungeon, X = G.gfx;
  const W = G.W, H = G.H, TS = 64;
  const VEC = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  // ---------- Texturas procedurais (pixel art 64x64) ----------
  const THEMES = {
    abismo: { stone: [72, 68, 74], stoneVar: 0.22, mortar: [16, 14, 18], floor: [48, 45, 50], ceil: [26, 24, 28], acc: [255, 70, 40], kind: 'veias', light: [225, 215, 210] },
    templo: { stone: [116, 90, 60], stoneVar: 0.2, mortar: [40, 28, 16], floor: [84, 66, 44], ceil: [54, 40, 26], acc: [235, 200, 100], kind: 'raizes', light: [255, 200, 130] },
    caverna: { stone: [64, 46, 92], stoneVar: 0.25, mortar: [16, 10, 26], floor: [42, 32, 58], ceil: [26, 18, 38], acc: [190, 120, 255], kind: 'cristais', light: [210, 170, 255] },
    submersa: { stone: [44, 84, 92], stoneVar: 0.2, mortar: [8, 24, 28], floor: [30, 58, 64], ceil: [14, 34, 40], acc: [110, 240, 224], kind: 'algas', light: [150, 240, 230] },
    // Parte 2
    escadaria: { stone: [104, 92, 78], stoneVar: 0.18, mortar: [30, 22, 16], floor: [76, 64, 52], ceil: [40, 30, 22], acc: [255, 196, 90], kind: 'veias', light: [255, 190, 120] },
    passagem: { stone: [46, 44, 52], stoneVar: 0.16, mortar: [8, 8, 12], floor: [30, 28, 34], ceil: [12, 12, 16], acc: [235, 235, 255], kind: 'veias', light: [200, 205, 225] },
    fortaleza: { stone: [40, 46, 62], stoneVar: 0.2, mortar: [10, 12, 20], floor: [30, 34, 46], ceil: [14, 16, 24], acc: [110, 180, 255], kind: 'cristais', light: [150, 190, 255] },
    raizes: { stone: [150, 146, 136], stoneVar: 0.14, mortar: [60, 54, 44], floor: [64, 54, 40], ceil: [30, 26, 20], acc: [255, 236, 170], kind: 'raizes', light: [255, 240, 200] },
  };
  const themeOf = id => (THEMES[id] ? id : 'abismo');
  const rgba = (r, g, b) => (255 << 24) | (Math.max(0, Math.min(255, b | 0)) << 16) | (Math.max(0, Math.min(255, g | 0)) << 8) | Math.max(0, Math.min(255, r | 0));
  const mul = (c, f) => [c[0] * f, c[1] * f, c[2] * f];

  function newTex() { return new Uint32Array(TS * TS); }
  // parede de blocos irregulares
  function wallTex(T, seed, extra) {
    const t = newTex(), r = X.rng(seed);
    const rowH = 16;
    for (let row = 0; row < TS / rowH; row++) {
      let x = -((r() * 20) | 0);
      while (x < TS) {
        const bw = 18 + ((r() * 16) | 0), tone = 1 + (r() - 0.5) * 2 * T.stoneVar, warm = (r() - 0.5) * 0.08;
        const base = [T.stone[0] * tone * (1 + warm), T.stone[1] * tone, T.stone[2] * tone * (1 - warm)];
        for (let yy = 0; yy < rowH; yy++) for (let xx = 0; xx < bw; xx++) {
          const px = x + xx, py = row * rowH + yy; if (px < 0 || px >= TS) continue;
          let c;
          if (yy === 0 || xx === 0) c = T.mortar;                                   // rejunte
          else {
            let f = 1;
            if (yy === 1 || xx === 1) f = 1.28;                                      // aresta iluminada
            else if (yy === rowH - 1 || xx === bw - 1) f = 0.7;                     // aresta em sombra
            f *= 0.9 + r() * 0.2;                                                    // granulado
            if (((px * 7 + py * 13) % 11) === 0) f *= 0.8;                           // poros
            c = mul(base, f);
          }
          t[py * TS + px] = rgba(c[0], c[1], c[2]);
        }
        // rachadura ocasional
        if (r() < 0.35) { let cx = x + 3 + ((r() * (bw - 6)) | 0), cy = row * rowH + 2; for (let k = 0; k < 10; k++) { if (cx >= 0 && cx < TS && cy < TS) t[cy * TS + cx] = rgba(...mul(T.mortar, 1.4)); cy++; cx += ((r() * 3) | 0) - 1; } }
        x += bw;
      }
    }
    // detalhes do tema
    const accent = (px, py, c) => { if (px >= 0 && px < TS && py >= 0 && py < TS) t[py * TS + px] = rgba(c[0], c[1], c[2]); };
    if (T.kind === 'veias' && r() < 0.7) { let x = (r() * TS) | 0; for (let y = 0; y < TS; y++) { accent(x, y, mul(T.acc, 0.55 + 0.3 * Math.sin(y / 3))); if (r() < 0.3) x += r() < 0.5 ? -1 : 1; } }
    if (T.kind === 'raizes') for (let k = 0; k < 2; k++) { let x = (r() * TS) | 0; for (let y = 0; y < TS; y++) { accent(x, y, [30, 20, 12]); accent(x + 1, y, [52, 36, 20]); if (r() < 0.25) x += r() < 0.5 ? -1 : 1; } }
    if (T.kind === 'algas') for (let k = 0; k < 12; k++) { const x = (r() * TS) | 0; const len = 4 + ((r() * 14) | 0); for (let y = 0; y < len; y++) accent(x + (y % 3 === 0 ? 1 : 0), y, [30, 90 + r() * 40, 50]); }
    if (T.kind === 'cristais' && r() < 0.6) { const cx = 8 + ((r() * 48) | 0), cy = 20 + ((r() * 30) | 0); for (let y = -8; y < 8; y++) for (let x = -3; x <= 3; x++) if (Math.abs(x) * 3 < 8 - Math.abs(y)) accent(cx + x, cy + y, x < 0 ? T.acc : mul(T.acc, 0.6)); }
    if (extra) extra(t, accent, r);
    return t;
  }
  // tocha: halo quente nas pedras, suporte de ferro e chama (dois quadros que se alternam)
  const torch = frame => (t, accent) => {
    for (let y = 0; y < TS; y++) for (let x = 0; x < TS; x++) {
      const d = Math.hypot(x - 32, (y - 22) * 1.1), k = Math.max(0, 1 - d / 30);
      if (k <= 0) continue;
      const c = t[y * TS + x], r = c & 255, g = (c >> 8) & 255, b = (c >> 16) & 255, f = 1 + k * 1.1;
      t[y * TS + x] = rgba(r * f + k * 60, g * f + k * 30, b * (1 + k * 0.3));
    }
    for (let y = 28; y < 48; y++) { accent(30, y, [36, 28, 24]); accent(31, y, [62, 50, 40]); accent(32, y, [86, 70, 54]); accent(33, y, [40, 32, 26]); }
    for (let x = 26; x < 38; x++) { accent(x, 47, [70, 60, 56]); accent(x, 48, [36, 30, 28]); }
    for (let x = 28; x < 36; x++) accent(x, 28, [90, 80, 74]);
    const sh = frame ? 1 : -1;
    const flame = [[2, [255, 250, 210]], [3, [255, 236, 150]], [4, [255, 200, 80]], [5, [255, 160, 50]], [4, [255, 120, 40]], [3, [240, 90, 30]], [2, [210, 60, 20]], [1, [170, 40, 16]]];
    flame.forEach(([w, c], i) => { const y = 27 - i, cx = 32 + (i > 3 ? sh * ((i - 3) >> 1) : 0); for (let x = -w + 1; x < w; x++) accent(cx + x, y, c); });
  };
  // ---------- decorações de parede ----------
  const DECO = {
    correntes: T => (t, accent, r) => {               // correntes penduradas com argola
      for (const cx of [20, 44]) { const len = 26 + ((r() * 14) | 0);
        for (let y = 0; y < len; y++) { const lk = (y >> 2) & 1; accent(cx + (lk ? 0 : -1), y, [70, 66, 72]); accent(cx + (lk ? 1 : 0), y, lk ? [120, 116, 124] : [40, 38, 44]); }
        for (let a = 0; a < 6.28; a += 0.3) accent(cx + Math.round(Math.cos(a) * 4), len + 3 + Math.round(Math.sin(a) * 4), [96, 92, 100]); }
    },
    ossos: T => (t, accent, r) => {                   // nicho com crânio e ossos
      for (let y = 30; y < 52; y++) for (let x = 18; x < 46; x++) { const top = 30 + Math.round(6 - Math.sqrt(Math.max(0, 36 - ((x - 32) / 2.3) ** 2))); if (y >= top) accent(x, y, [10, 8, 10]); }
      for (let y = 38; y < 47; y++) for (let x = 27; x < 37; x++) if (((x - 32) / 5) ** 2 + ((y - 42) / 4.5) ** 2 < 1) accent(x, y, [200, 190, 170]);
      accent(29, 42, [20, 14, 14]); accent(30, 42, [20, 14, 14]); accent(34, 42, [20, 14, 14]); accent(35, 42, [20, 14, 14]); accent(32, 45, [40, 30, 30]);
      for (let x = 29; x < 36; x += 2) accent(x, 47, [190, 180, 160]);
      for (let k = 0; k < 2; k++) for (let i = 0; i < 12; i++) accent(20 + i + k * 2, 50 - (k ? 12 - i : i) / 4, [176, 168, 150]);
    },
    porta: T => (t) => {                              // porta de ferro trancada
      for (let y = 10; y < TS; y++) for (let x = 16; x < 48; x++) {
        const arch = y < 22 && ((x - 32) / 16) ** 2 + ((y - 22) / 12) ** 2 > 1; if (arch) continue;
        let c = [52, 50, 58]; if (x === 16 || x === 47 || y === 10) c = [24, 22, 28];
        if (x % 8 === 0) c = [36, 34, 42]; if (y === 30 || y === 50) c = [70, 68, 78]; if ((y === 30 || y === 50) && x % 8 === 4) c = [140, 136, 150];
        if (x >= 40 && x <= 42 && y >= 38 && y <= 41) c = [180, 150, 70];
        t[y * TS + x] = rgba(...mul(c, 0.9 + ((x * 7 + y * 3) % 5) / 25));
      }
    },
    runas: T => (t, accent, r) => {                   // inscrição que brilha
      const g = [[0, 0, 0, 4], [0, 0, 3, 0], [3, 0, 3, 4], [0, 2, 3, 2], [0, 4, 3, 0], [1, 0, 1, 4]];
      for (let i = 0; i < 6; i++) { const ox = 12 + i * 7, oy = 26 + (i % 2) * 2; const [x0, y0, x1, y1] = g[(r() * g.length) | 0];
        const n = 6; for (let k = 0; k <= n; k++) accent(ox + Math.round(x0 + (x1 - x0) * k / n), oy + Math.round(y0 + (y1 - y0) * k / n) * 2, T.acc);
        accent(ox + 1, oy + 4, T.acc); }
    },
    estandarte: T => (t, accent, r) => {              // estandarte rasgado
      for (let x = 20; x < 45; x++) accent(x, 8, [90, 70, 40]);
      for (let y = 9; y < 50; y++) for (let x = 22; x < 43; x++) { const torn = y > 40 && ((x * 7) % 5) * 3 + 40 < y; if (torn) continue; const c = mul([110, 24, 34], 0.8 + ((x + y) % 3) * 0.08); accent(x, y, c); }
      for (let y = 18; y < 32; y++) { accent(32, y, [200, 160, 70]); } for (let x = 26; x < 39; x++) accent(x, 24, [200, 160, 70]);
    },
  };
  function crystalWall(T) { return (t, accent) => { for (let y = 14; y < 50; y++) for (let x = -7; x <= 7; x++) if (Math.abs(x) * 2.6 < 18 - Math.abs(y - 32)) accent(32 + x, y, x < -2 ? [255, 255, 255] : x < 2 ? T.acc : mul(T.acc, 0.6)); }; }
  function gateTex(T) {
    const t = newTex();
    for (let y = 0; y < TS; y++) for (let x = 0; x < TS; x++) {
      const plank = (x >> 3) & 1, base = plank ? [70, 48, 30] : [60, 40, 24], f = 0.85 + ((x * 31 + y * 17) % 7) / 30;
      let c = mul(base, f);
      if (x % 8 === 0) c = [30, 20, 12];
      if (y > 10 && y < 15 || y > 48 && y < 53) c = [46, 46, 54];                    // cintas de ferro
      if ((y === 12 || y === 50) && x % 8 === 4) c = [120, 120, 130];                 // rebites
      t[y * TS + x] = rgba(...c);
    }
    // raízes por cima (portão selado)
    const r = X.rng(99);
    for (let k = 0; k < 6; k++) { let x = (r() * TS) | 0; for (let y = 0; y < TS; y++) { const c = [24, 14, 10]; t[y * TS + Math.max(0, Math.min(63, x))] = rgba(...c); if (r() < 0.3) x += r() < 0.5 ? -1 : 1; } }
    return t;
  }
  function floorTex(T, seed, ceil) {
    const t = newTex(), r = X.rng(seed), base = ceil ? T.ceil : T.floor;
    const S = 32;
    for (let by = 0; by < 2; by++) for (let bx = 0; bx < 2; bx++) {
      const tone = 0.85 + r() * 0.3;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        let c;
        if (x === 0 || y === 0) c = mul(base, 0.45);
        else { let f = tone * (0.9 + r() * 0.2); if (x === 1 || y === 1) f *= 1.15; if (x === S - 1 || y === S - 1) f *= 0.75; c = mul(base, f); }
        t[(by * S + y) * TS + bx * S + x] = rgba(...c);
      }
    }
    if (ceil) { // vigas do teto
      for (let x = 0; x < TS; x++) for (const y of [0, 1, 2, 3, 4, 5]) t[y * TS + x] = rgba(...mul([base[0] * 1.5 + 20, base[1] * 1.3 + 12, base[2] * 1.1 + 6], y === 5 ? 0.35 : y === 0 ? 1.2 : 0.8 + (x % 9 === 0 ? -0.3 : 0)));
    } else if (T.kind === 'algas' || T.kind === 'veias') {
      for (let k = 0; k < 20; k++) { const x = (r() * TS) | 0, y = (r() * TS) | 0; t[y * TS + x] = rgba(...mul(T.kind === 'veias' ? T.acc : [40, 110, 70], 0.6)); }
    }
    return t;
  }
  function puddleFloor(T, seed) { const t = floorTex(T, seed), r = X.rng(seed);   // poça de água escura
    for (let y = 0; y < TS; y++) for (let x = 0; x < TS; x++) { const d = ((x - 30) / 22) ** 2 + ((y - 34) / 16) ** 2 + (r() - 0.5) * 0.08; if (d < 1) t[y * TS + x] = rgba(...(d > 0.85 ? mul(T.floor, 0.5) : [10 + T.floor[0] * 0.2, 12 + T.floor[1] * 0.25, 18 + T.floor[2] * 0.35])); }
    return t; }
  function debrisFloor(T, seed) { const t = floorTex(T, seed), r = X.rng(seed);    // entulho e ossos
    for (let k = 0; k < 7; k++) { const x0 = 6 + r() * 50, y0 = 6 + r() * 50, s = 2 + r() * 4; for (let y = -s; y < s; y++) for (let x = -s; x < s; x++) if (x * x + y * y < s * s) { const px = (x0 + x) | 0, py = (y0 + y) | 0; if (px >= 0 && px < TS && py >= 0 && py < TS) t[py * TS + px] = rgba(...mul(T.stone, 0.7 + (y < 0 ? 0.3 : 0))); } }
    for (let i = 0; i < 10; i++) { const px = 20 + i, py = 44 - (i >> 1); t[py * TS + px] = rgba(190, 180, 160); }
    return t; }
  const TEX = {};
  function texSet(theme) {
    if (TEX[theme]) return TEX[theme];
    const T = THEMES[theme];
    const set = { deco: Object.keys(DECO).map((k, i) => wallTex(T, 300 + i * 17, DECO[k](T))), floors: [floorTex(T, 3), puddleFloor(T, 21), debrisFloor(T, 33)], walls: [0, 1, 2, 3].map(i => wallTex(T, i * 101 + theme.length)), torches: [wallTex(T, 777, torch(0)), wallTex(T, 777, torch(1))], voice: wallTex(T, 555, crystalWall(T)), gate: gateTex(T), floor: floorTex(T, 3), ceil: floorTex(T, 9, true), T };
    return (TEX[theme] = set);
  }

  // ---------- Sprites (baú, cristal, escada, auras) ----------
  const SPR = {};
  function sprite(name, draw, w = 32, h = 32) {
    if (SPR[name]) return SPR[name];
    const [c, g] = X.canvas(w, h); draw(g, w, h);
    const d = new Uint32Array(g.getImageData(0, 0, w, h).data.buffer);
    return (SPR[name] = { w, h, d });
  }
  const chestSpr = open => sprite('chest' + open, (g) => {
    g.fillStyle = '#2a170c'; g.fillRect(4, 14, 24, 16); g.fillStyle = '#5a361c'; g.fillRect(5, 15, 22, 14);
    g.fillStyle = '#6e4424'; for (let x = 5; x < 27; x += 4) g.fillRect(x, 15, 1, 14);
    g.fillStyle = '#9a9aa6'; g.fillRect(4, 18, 24, 2); g.fillRect(4, 26, 24, 2);
    if (open) { g.fillStyle = '#1a0e06'; g.fillRect(5, 9, 22, 6); g.fillStyle = '#5a361c'; g.fillRect(4, 4, 24, 6); g.fillStyle = '#ffd860'; g.fillRect(8, 14, 16, 2); }
    else { g.fillStyle = '#6e4424'; g.beginPath(); g.ellipse(16, 15, 12, 6, 0, Math.PI, 0); g.fill(); g.fillStyle = '#9a9aa6'; g.fillRect(4, 13, 24, 2); g.fillStyle = '#e0c060'; g.fillRect(14, 15, 4, 5); g.fillStyle = '#3a2a10'; g.fillRect(15, 17, 2, 2); }
  });
  const crystalSpr = () => sprite('cristal', (g) => {
    const gr = g.createRadialGradient(16, 14, 1, 16, 14, 15); gr.addColorStop(0, 'rgba(255,230,140,0.9)'); gr.addColorStop(1, 'rgba(255,200,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#c99a2a'; g.beginPath(); g.moveTo(16, 2); g.lineTo(23, 14); g.lineTo(16, 28); g.lineTo(9, 14); g.fill();
    g.fillStyle = '#ffe08a'; g.beginPath(); g.moveTo(16, 2); g.lineTo(16, 28); g.lineTo(9, 14); g.fill();
    g.fillStyle = '#fff'; g.fillRect(13, 8, 2, 8);
  });
  const stairSpr = () => sprite('escada', (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 32); gr.addColorStop(0, 'rgba(255,140,90,0.9)'); gr.addColorStop(1, 'rgba(255,90,60,0)'); g.fillStyle = gr; g.fillRect(6, 0, 20, 12);
    for (let i = 0; i < 7; i++) { const w = 28 - i * 3, y = 30 - i * 4; g.fillStyle = i % 2 ? '#5a4a48' : '#6a5856'; g.fillRect(16 - w / 2, y - 3, w, 3); g.fillStyle = '#2a2020'; g.fillRect(16 - w / 2, y, w, 1); }
  });
  const shardsSpr = () => sprite('estilhacos', (g) => {
    const r = X.rng(42);
    const gr = g.createRadialGradient(16, 26, 1, 16, 26, 14); gr.addColorStop(0, 'rgba(255,40,20,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 12, 32, 20);
    for (let i = 0; i < 9; i++) { const x = 3 + r() * 26, h = 3 + r() * 10, w = 1.5 + r() * 2.5; g.fillStyle = '#0c0812'; g.beginPath(); g.moveTo(x - w, 31); g.lineTo(x + (r() - 0.5) * 3, 31 - h); g.lineTo(x + w, 31); g.fill(); g.fillStyle = '#6a2a3a'; g.fillRect(x, 31 - h + 1, 1, Math.max(1, h - 3)); }
    g.fillStyle = '#ff3a2a'; g.fillRect(12, 29, 1, 1); g.fillRect(20, 30, 1, 1);
  });
  const auraSpr = (color) => sprite('aura' + color, (g) => {
    const gr = g.createRadialGradient(16, 16, 1, 16, 16, 16); gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
    g.fillStyle = '#fff'; for (const [x, y] of [[10, 12], [20, 8], [16, 20], [24, 18], [8, 22]]) g.fillRect(x, y, 1, 1);
  });

  // ---------- Renderização por raios ----------
  let cv = null, cg = null, img = null, buf = null;
  const zbuf = new Float32Array(W);
  function ensure() {
    if (cv) return;
    [cv, cg] = X.canvas(W, H);
    img = cg.createImageData(W, H); buf = new Uint32Array(img.data.buffer);
  }
  // luz: tom do tema x distância (escuridão) x tochas próximas
  function shadePix(c, f, tint) {
    const r = (c & 255) * f * tint[0], g = ((c >> 8) & 255) * f * tint[1], b = ((c >> 16) & 255) * f * tint[2];
    return (255 << 24) | (Math.min(255, b) << 16) | (Math.min(255, g) << 8) | Math.min(255, r);
  }

  Dun.draw = function (ctx) {
    ensure();
    const map = this.map, set = texSet(themeOf(this.id)), T = set.T;
    const target = (this.dir - 1) * Math.PI / 2 + (this.look || 0);
    if (this.ra == null || this._snapId !== this.id) { this.ra = target; this._snapId = this.id; }
    let d = target - this.ra; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    this.ra += Math.abs(d) < 0.01 ? d : d * (this.lookSpeed || 0.3);
    const a = this.anim;
    let px = this.x + 0.5, py = this.y + 0.5;
    if (a && a.type === 'move') { const [dx, dy] = VEC[this.dir]; px += dx * a.t; py += dy * a.t; }
    const dirX = Math.cos(this.ra), dirY = Math.sin(this.ra), plX = -dirY * 0.7, plY = dirX * 0.7;
    const flick = 1 + 0.05 * Math.sin(G.time / 5) + 0.03 * Math.sin(G.time / 2.3);
    const light = 4.2 * flick;                             // raio de luz da tocha do grupo (em células)
    const tint = [T.light[0] / 255, T.light[1] / 255, T.light[2] / 255];
    const fog = dist => Math.max(0, Math.min(1.15, 1.25 - dist / light));
    const half = H / 2;
    // chão e teto
    const rx0 = dirX - plX, ry0 = dirY - plY, rx1 = dirX + plX, ry1 = dirY + plY;
    for (let y = 0; y < half; y++) {
      const p = half - y, rowDist = (0.5 * H) / p;
      const stepX = rowDist * (rx1 - rx0) / W, stepY = rowDist * (ry1 - ry0) / W;
      let fx = px + rowDist * rx0, fy = py + rowDist * ry0;
      const f = fog(rowDist), fc = f * 0.95;
      const yF = H - 1 - y, oC = y * W, oF = yF * W;
      for (let x = 0; x < W; x++) {
        const cxF = Math.floor(fx), cyF = Math.floor(fy);
        const tx = ((fx - cxF) * TS) | 0, ty = ((fy - cyF) * TS) | 0, k = (ty & 63) * TS + (tx & 63);
        const hv = X.hash(cxF * 5 + 1, cyF * 11 + 3) % 11, ft = hv === 0 ? set.floors[1] : hv === 5 ? set.floors[2] : set.floor;
        let fp = f > 0.01 ? shadePix(ft[k], f, tint) : 0xff000000;
        if (hv === 0 && f > 0.05 && ((ft[k] >> 16) & 255) < T.floor[2] * 0.5 + 22 && ((tx * 7 + ty * 3 + (G.time >> 2)) % 23) === 0) fp = shadePix(0xffb0d8f0, f * 0.9, tint);   // reflexo da tocha na água
        buf[oF + x] = fp;
        buf[oC + x] = fc > 0.01 ? shadePix(set.ceil[k], fc, tint) : 0xff000000;
        fx += stepX; fy += stepY;
      }
    }
    // paredes
    for (let x = 0; x < W; x++) {
      const cam = 2 * x / W - 1, rdx = dirX + plX * cam, rdy = dirY + plY * cam;
      let mx = Math.floor(px), my = Math.floor(py);
      const ddx = Math.abs(1 / rdx), ddy = Math.abs(1 / rdy);
      let sx, sy, sdx, sdy;
      if (rdx < 0) { sx = -1; sdx = (px - mx) * ddx; } else { sx = 1; sdx = (mx + 1 - px) * ddx; }
      if (rdy < 0) { sy = -1; sdy = (py - my) * ddy; } else { sy = 1; sdy = (my + 1 - py) * ddy; }
      let side = 0, hit = false, n = 0;
      while (!hit && n++ < 24) {
        if (sdx < sdy) { sdx += ddx; mx += sx; side = 0; } else { sdy += ddy; my += sy; side = 1; }
        if (this.isWall(mx, my)) hit = true;
      }
      const dist = side === 0 ? sdx - ddx : sdy - ddy;
      zbuf[x] = dist;
      if (!hit) continue;
      const lh = (H / dist) | 0;
      let y0 = -lh / 2 + half, y1 = lh / 2 + half;
      let wx = side === 0 ? py + dist * rdy : px + dist * rdx; wx -= Math.floor(wx);
      let tx = (wx * TS) | 0; if ((side === 0 && rdx > 0) || (side === 1 && rdy < 0)) tx = TS - tx - 1;
      const c = this.raw(mx, my);
      let tex;
      if (c >= '1' && c <= '9') tex = set.voice;
      else if (c === 'G') tex = set.gate;
      else { const hsh = X.hash(mx * 3 + side, my * 7); tex = (hsh % 9 === 0) ? set.torches[(G.time >> 3) & 1] : (hsh % 7 === 3) ? set.deco[(hsh >>> 3) % set.deco.length] : set.walls[hsh % 4]; }
      const isTorch = tex === set.torches[0] || tex === set.torches[1];
      let f = fog(dist) * (side === 1 ? 0.78 : 1);
      if (isTorch) f = Math.min(1.35, f * 1.3 + 0.25);
      const step = TS / lh;
      let tpos = (Math.max(0, y0) - y0) * step;
      const ya = Math.max(0, y0 | 0), yb = Math.min(H, y1 | 0);
      for (let y = ya; y < yb; y++) {
        const ty = (tpos | 0) & 63; tpos += step;
        const col = tex[ty * TS + tx];
        // a chama da tocha brilha mesmo no escuro
        const bright = isTorch && ty >= 19 && ty <= 28 && tx >= 27 && tx <= 37 && ((tex[ty * TS + tx] & 255) > 150);
        buf[y * W + x] = bright ? col : shadePix(col, f, tint);
      }
    }
    // objetos (sprites) ordenados do mais longe ao mais perto
    const objs = [];
    const g = map.grid;
    for (let yy = Math.max(0, this.y - 7); yy < Math.min(g.length, this.y + 8); yy++) for (let xx = Math.max(0, this.x - 7); xx < Math.min(g[0].length, this.x + 8); xx++) {
      const c = g[yy][xx];
      let s = null, size = 0.55, lift = 0, glow = false;
      if (this.id === 'abismo' && ((xx === 1 && yy === 2) || (xx === 2 && yy === 1) || (xx === 1 && yy === 3))) { objs.push({ x: xx + 0.5, y: yy + 0.5, s: shardsSpr(), size: 0.3, lift: 0, glow: false, d: (xx + 0.5 - px) ** 2 + (yy + 0.5 - py) ** 2 }); }
      if (c === 'C') s = chestSpr(this.chestOpen(xx, yy));
      else if (c === 'H') { s = crystalSpr(); size = 0.36; lift = 0.28 + Math.sin(G.time / 20) * 0.04; glow = true; }
      else if (c === 'U') { s = stairSpr(); size = 0.9; }
      else if ((c === 'b' || c === 'f') && !(G.story.evDone && G.story.evDone(this.id, c))) { s = auraSpr(c === 'f' ? 'rgba(255,224,138,0.9)' : 'rgba(150,0,40,0.9)'); size = 0.9; lift = 0.1; glow = true; }
      else if ('aelrd'.includes(c) && !(G.story.evDone && G.story.evDone(this.id, c))) { s = auraSpr('rgba(' + T.acc.join(',') + ',0.85)'); size = 0.45; lift = 0.15 + Math.sin(G.time / 25 + xx) * 0.05; glow = true; }
      if (s) objs.push({ x: xx + 0.5, y: yy + 0.5, s, size, lift, glow, d: (xx + 0.5 - px) ** 2 + (yy + 0.5 - py) ** 2 });
    }
    objs.sort((a, b) => b.d - a.d);
    const inv = 1 / (plX * dirY - dirX * plY);
    for (const o of objs) {
      const rx = o.x - px, ry = o.y - py;
      const tX = inv * (dirY * rx - dirX * ry), tY = inv * (-plY * rx + plX * ry);
      if (tY <= 0.2) continue;
      const scx = (W / 2) * (1 + tX / tY);
      const sh = Math.abs(H / tY) * o.size, sw = sh * o.s.w / o.s.h;
      const floorY = half + (H / tY) / 2, sy0 = floorY - sh - o.lift * (H / tY);
      const x0 = Math.floor(scx - sw / 2), x1 = Math.floor(scx + sw / 2);
      const f = fog(Math.sqrt(o.d)) * (o.glow ? 1.6 : 1);
      for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
        if (tY >= zbuf[x]) continue;
        const tx = (((x - x0) / sw) * o.s.w) | 0;
        for (let y = Math.max(0, sy0 | 0); y < Math.min(H, (sy0 + sh) | 0); y++) {
          const ty = (((y - sy0) / sh) * o.s.h) | 0;
          const col = o.s.d[ty * o.s.w + tx];
          const al = (col >>> 24) & 255;
          if (al < 60) continue;
          if (o.glow && al < 250) { // brilho aditivo
            const k = y * W + x, dst = buf[k], aa = al / 255;
            const r = Math.min(255, (dst & 255) + (col & 255) * aa), gg = Math.min(255, ((dst >> 8) & 255) + ((col >> 8) & 255) * aa), b = Math.min(255, ((dst >> 16) & 255) + ((col >> 16) & 255) * aa);
            buf[k] = (255 << 24) | (b << 16) | (gg << 8) | r;
          } else buf[y * W + x] = o.glow ? col : shadePix(col, f, tint);
        }
      }
    }
    cg.putImageData(img, 0, 0);
    ctx.drawImage(cv, 0, 0);
    // olhos no fundo dos corredores escuros (só atmosfera)
    if (zbuf[W >> 1] > 4.5 && (X.hash(this.x * 13, this.y * 17) % 5) === 0) {
      const blink = ((G.time + this.x * 40) % 260) < 8; if (!blink) { const ex = W / 2 + Math.sin(G.time / 90) * 6, ey = half - 2; ctx.fillStyle = 'rgba(255,40,40,0.75)'; ctx.fillRect(ex - 4, ey, 2, 1); ctx.fillRect(ex + 2, ey, 2, 1); }
    }
    // gotas d'água caindo do teto e poeira no ar
    for (let i = 0; i < 6; i++) {
      const per = 70 + i * 13, ph = (G.time + i * 41) % per, gx = (X.hash(i, (G.time / per) | 0) % (W - 20)) + 10;
      if (ph < 40) { ctx.fillStyle = 'rgba(170,200,220,0.55)'; ctx.fillRect(gx, ph * 4.5, 1, 3); }
      else if (ph < 46) { ctx.fillStyle = 'rgba(170,200,220,0.4)'; ctx.fillRect(gx - (ph - 40), 182, 1, 1); ctx.fillRect(gx + (ph - 40), 182, 1, 1); }
    }
    for (let i = 0; i < 14; i++) { const x = (i * 71 + G.time * 0.13 * (1 + i % 3)) % W, y = (i * 37 + Math.sin(G.time / 60 + i) * 12 + 40) % H; ctx.fillStyle = 'rgba(255,230,190,0.18)'; ctx.fillRect(x | 0, y | 0, 1, 1); }
    G.vignette(ctx);
    if (!this.noHud) this.drawHUD(ctx);
  };
  // reinicia o ângulo ao entrar numa masmorra
  const enter = G.enterDungeon;
  G.enterDungeon = function (...args) { const r = enter.apply(this, args); Dun.ra = null; return r; };
})();
