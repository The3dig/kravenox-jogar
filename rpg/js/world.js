'use strict';
// Mundo detalhado: o terreno de cada mapa é pintado inteiro, pixel a pixel
// (relevo das montanhas, fendas com paredes, estradas de bordas irregulares,
// pedras de calçamento, casas montadas), e por cima vêm luzes, cinzas e névoa.
(function () {
  const X = G.gfx;
  const Wd = G.World = {};
  const T = 16;

  // ---------- ruído ----------
  function h2(x, y, s) { let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vn(x, y, sc, s, wrap) {
    const fx = x / sc, fy = y / sc; let ix = Math.floor(fx), iy = Math.floor(fy); const tx = fx - ix, ty = fy - iy;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    let ix1 = ix + 1, iy1 = iy + 1;
    if (wrap) { const P = wrap / sc; ix = ((ix % P) + P) % P; iy = ((iy % P) + P) % P; ix1 = (ix + 1) % P; iy1 = (iy + 1) % P; }
    const a = h2(ix, iy, s), b = h2(ix1, iy, s), c = h2(ix, iy1, s), d = h2(ix1, iy1, s);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }
  const fbm = (x, y, sc, s) => vn(x, y, sc, s) * 0.55 + vn(x, y, sc / 2, s + 7) * 0.3 + vn(x, y, sc / 4, s + 13) * 0.15;
  const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const bay = (x, y) => (B4[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
  const rgb = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const ramp = a => a.map(rgb);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const pick = (R, v, x, y) => R[clamp(Math.floor(v * (R.length - 1) + bay(x, y)), 0, R.length - 1)];

  // borrão em caixa (separável, bordas estendidas)
  function blur(src, w, h, r, passes) {
    let a = Float32Array.from(src), b = new Float32Array(w * h);
    const n = 2 * r + 1;
    for (let p = 0; p < passes; p++) {
      for (let y = 0; y < h; y++) {
        const o = y * w; let s = 0;
        for (let k = -r; k <= r; k++) s += a[o + clamp(k, 0, w - 1)];
        for (let x = 0; x < w; x++) { b[o + x] = s / n; s += a[o + clamp(x + r + 1, 0, w - 1)] - a[o + clamp(x - r, 0, w - 1)]; }
      }
      for (let x = 0; x < w; x++) {
        let s = 0;
        for (let k = -r; k <= r; k++) s += b[clamp(k, 0, h - 1) * w + x];
        for (let y = 0; y < h; y++) { a[y * w + x] = s / n; s += b[clamp(y + r + 1, 0, h - 1) * w + x] - b[clamp(y - r, 0, h - 1) * w + x]; }
      }
    }
    return a;
  }

  // ---------- temas ----------
  const TH = {
    reino: {
      ground: ramp(['#29242f', '#322c39', '#3c3544', '#463e4f', '#51485a']),
      grass: ramp(['#37352d', '#433f34', '#514b3d', '#5f5847', '#6e6652']),
      rock: ramp(['#0f0c13', '#18131d', '#221b28', '#2e2535', '#3b3043', '#4a3e53', '#5d4f66', '#74647c']),
      road: ramp(['#33281f', '#3e3127', '#4a3a2e', '#574536', '#64503f']),
      forest: ramp(['#16141a', '#1c1920', '#221e27', '#29242e', '#302a35']),
      leaves: ramp(['#3e1820', '#55212a', '#6a2c2e', '#3a2448', '#5a3a2a']),
      pitWall: ramp(['#130b10', '#1d1118', '#28171f', '#341e28']),
      pitDeep: ramp(['#030103', '#070206', '#0c0309', '#14040a', '#22060c', '#3a0a10']),
      rim: rgb('#6a5a6a'), vein: rgb('#7a1c22'),
      pit: 'fenda', ash: true,
    },
    vale: {
      ground: ramp(['#222a33', '#29323d', '#313b47', '#3a4552', '#44505e']),
      grass: ramp(['#34404a', '#3f4c57', '#4c5a65', '#5b6a75', '#6c7b86']),
      rock: ramp(['#0b0f14', '#12171e', '#1a2029', '#232b36', '#2e3744', '#3b4554', '#4c5767', '#62707f']),
      road: ramp(['#2e3138', '#383c44', '#434751', '#4f545e']),
      forest: ramp(['#151a20', '#1a2028', '#20272f', '#262e37']),
      leaves: ramp(['#2a3a44', '#36505a', '#4a6670']),
      pitWall: ramp(['#0c1016', '#121820', '#1a222c', '#222c38']),
      pitDeep: ramp(['#020305', '#05080c', '#080d13', '#0d151d', '#132029', '#1a2c38']),
      rim: rgb('#7a8a98'), vein: rgb('#2a4a5a'),
      pit: 'rio', mist: true,
    },
    vila: {
      ground: ramp(['#2a2527', '#332d2f', '#3d3638', '#474042', '#524a4b']),
      grass: ramp(['#363429', '#423f32', '#4f4b3b', '#5d5846', '#6b6552']),
      rock: ramp(['#100c12', '#19141b', '#231c25', '#2e2530']),
      road: ramp(['#34292a', '#3f3233', '#4b3d3d', '#584848']),
      forest: ramp(['#1a171c', '#211d23']),
      leaves: ramp(['#4a2026', '#5a2a2e']),
      stone: ramp(['#34303a', '#3e3944', '#48434e', '#534d59', '#5f5865', '#6b6471']),
      gap: rgb('#16121a'),
      pitWall: ramp(['#130b10', '#1d1118']), pitDeep: ramp(['#050206', '#0c0408']), rim: rgb('#6a5a6a'), vein: rgb('#7a1c22'),
    },
  };

  function material(c, theme) {
    if (c === '^' || c === 'A') return 'mtn';
    if (c === '~' || c === 'B') return 'pit';
    if (c === '=' || c === 'R') return theme === 'vila' ? 'cob' : 'road';
    if (c === 'f' || c === 'T' && theme === 'reino' || c === 'X') return 'forest';
    if (theme === 'vila' && (c === 'p' || c === 's' || c === 'k')) return 'cob';
    if (theme === 'vila' && (c === 'o' || c === 'h' || c === 'd' || c === 'D')) return 'house';
    return 'ground';
  }

  // ---------- montagem do mapa ----------
  const layers = {};
  Wd.signature = function (F) { let s = ''; const m = F.map; for (let y = 0; y < m.tiles.length; y++) for (let x = 0; x < m.tiles[y].length; x++) s += F.tile(x, y); return s; };
  Wd.layer = function (F) {
    const sig = Wd.signature(F), key = F.id;
    const L = layers[key];
    if (L && L.sig === sig) return L;
    return (layers[key] = build(F, sig));
  };

  function build(F, sig) {
    const m = F.map, th = TH[m.theme] || TH.reino, theme = m.theme;
    const cols = m.tiles[0].length, rows = m.tiles.length, w = cols * T, h = rows * T;
    const tl = (x, y) => sig[clamp(y, 0, rows - 1) * cols + clamp(x, 0, cols - 1)];
    const seed = theme.length * 31 + cols;
    const mat = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) mat.push(material(tl(x, y), theme));
    const mask = name => { const a = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mat[(y >> 4) * cols + (x >> 4)] === name) a[y * w + x] = 1; return a; };
    const has = name => mat.includes(name);

    const N = new Float32Array(w * h), N2 = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { N[y * w + x] = fbm(x, y, 22, seed); N2[y * w + x] = fbm(x, y, 9, seed + 5); }

    const mtn = has('mtn') ? mask('mtn') : null;
    const mShape = mtn && blur(mtn, w, h, 4, 2), mH = mtn && blur(mtn, w, h, 11, 2);
    const pit = has('pit') ? mask('pit') : null;
    const pShape = pit && blur(pit, w, h, 5, 2), pDeep = pit && blur(pit, w, h, 9, 2);
    const road = has('road') ? mask('road') : null, rShape = road && blur(road, w, h, 3, 2);
    const forest = has('forest') ? mask('forest') : null, fShape = forest && blur(forest, w, h, 5, 2);
    const cob = has('cob') ? mask('cob') : null, cShape = cob && blur(cob, w, h, 2, 2);
    const house = has('house') ? mask('house') : null;
    const aoSrc = new Float32Array(w * h);
    if (mtn) for (let i = 0; i < w * h; i++) aoSrc[i] = Math.max(aoSrc[i], mtn[i]);
    if (house) for (let i = 0; i < w * h; i++) aoSrc[i] = Math.max(aoSrc[i], house[i]);
    const ao = blur(aoSrc, w, h, 6, 2);

    const inM = new Uint8Array(w * h), inP = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const n = N2[i] - 0.5;
      if (mShape && mShape[i] + n * 0.32 > 0.5) inM[i] = 1;
      if (pShape && pShape[i] + n * 0.5 + (vn(i % w, (i / w) | 0, 4, 77) - 0.5) * 0.12 > 0.5) inP[i] = 1;
    }
    // altura das montanhas (para sombreamento)
    let Hm = null;
    if (mtn) {
      Hm = new Float32Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y * w + x; if (!inM[i]) continue;
        const ridge = 1 - Math.abs(2 * fbm(x, y, 14, seed + 21) - 1), crag = 1 - Math.abs(2 * vn(x, y, 5, seed + 22) - 1);
        Hm[i] = mH[i] * 0.6 + ridge * 0.5 + crag * 0.12;
      }
    }

    const [cv, g] = X.canvas(w, h);
    const img = g.createImageData(w, h), D = img.data;
    const put = (i, c, k = 1) => { D[i * 4] = c[0] * k; D[i * 4 + 1] = c[1] * k; D[i * 4 + 2] = c[2] * k; D[i * 4 + 3] = 255; };

    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, n = N[i], n2 = N2[i];
      // sombra projetada (luz vinda do noroeste)
      const sh = 1 - 0.42 * ao[clamp(y - 5, 0, h - 1) * w + clamp(x - 3, 0, w - 1)] * (inM[i] ? 0 : 1);
      if (inM[i]) {
        const edge = !inM[i - 1] || !inM[i + 1] || !inM[i - w] || !inM[i + w];
        if (edge) { put(i, th.rock[0]); continue; }
        // penhasco: a face sul da montanha, com camadas de rocha
        let cliff = 0;
        for (let k = 1; k <= 11; k++) { const yy = y + k; if (yy >= h) break; if (!inM[yy * w + x]) { cliff = k; break; } }
        if (cliff) {
          const band = ((y + Math.floor(N2[i] * 5)) % 4 === 0);
          const crack = h2(x, 0, 41) < 0.12 && cliff > 2;
          let v = 0.18 + (cliff / 11) * 0.22 + (band ? -0.12 : 0) + (N[i] - 0.5) * 0.35;
          if (cliff === 11 || (y > 0 && !inM[i - w])) v = 0.62;
          if (crack) v = 0.0;
          put(i, pick(th.rock, clamp(v, 0, 1), x, y));
          continue;
        }
        // pedregulhos: células com volume (luz do noroeste)
        const S = 12, gx = Math.floor(x / S), gy = Math.floor(y / S);
        let best = 1e9, sec = 1e9, bx = 0, by = 0, bid = 0;
        for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
          const qx = gx + ox, qy = gy + oy;
          const cx0 = qx * S + 1 + h2(qx, qy, 91) * (S - 2), cy0 = qy * S + 1 + h2(qx, qy, 92) * (S - 2);
          const dd = (x - cx0) * (x - cx0) + (y - cy0) * (y - cy0);
          if (dd < best) { sec = best; best = dd; bx = cx0; by = cy0; bid = h2(qx, qy, 93); } else if (dd < sec) sec = dd;
        }
        const gap = Math.sqrt(sec) - Math.sqrt(best);
        const rad = 8;
        const lx = (x - bx) / rad, ly = (y - by) / rad;
        let v = 0.4 + (-(lx + ly) * 0.28) + (Hm[i] - 0.6) * 0.45 + (bid - 0.5) * 0.18;
        if (gap < 1.1) v = 0.05 + (Hm[i] - 0.6) * 0.2;
        else if (gap < 2 && (lx + ly) > 0) v -= 0.15;
        if (lx + ly < -0.9 && gap > 2) v += 0.15;
        put(i, pick(th.rock, clamp(v, 0, 1), x, y));
        continue;
      }
      if (inP[i]) {
        // parede norte da fenda visível, depois a profundidade
        let wall = 0;
        for (let k = 1; k <= 13; k++) { const yy = y - k; if (yy < 0) break; if (!inP[yy * w + x]) { wall = k; break; } }
        if (wall) {
          const strata = ((y + Math.floor(n * 6)) % 3 === 0) ? 0 : 1;
          const v = clamp(0.95 - wall / 12 + strata * 0.15 + (n2 - 0.5) * 0.3, 0, 1);
          put(i, pick(th.pitWall, v, x, y));
        } else {
          const d = clamp((pDeep[i] - 0.55) * 2.2, 0, 1);
          let c = pick(th.pitDeep, clamp(d * d * d * 0.75 + (n - 0.5) * 0.25, 0, 1), x, y);
          if (d > 0.55 && h2(x, y, 3) < 0.012) c = th.pitDeep[th.pitDeep.length - 1];
          put(i, c);
        }
        continue;
      }
      // borda clara na beira da fenda
      if (pit && y + 1 < h && inP[i + w]) { put(i, th.rim, 0.85 + n2 * 0.2); continue; }
      if (pit && ((x > 0 && inP[i - 1]) || (x < w - 1 && inP[i + 1]))) { put(i, th.rim, 0.6); continue; }

      const tc = tl(x >> 4, y >> 4);
      // calçamento (pedras irregulares)
      if (cShape && cShape[i] + (n2 - 0.5) * 0.2 > 0.5) {
        const gx = Math.floor(x / 5), gy = Math.floor(y / 4);
        let best = 1e9, sec = 1e9, bid = 0;
        for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
          const cx = gx + ox, cy = gy + oy;
          const px = cx * 5 + 1 + h2(cx, cy, 71) * 3 + (cy & 1) * 2.5, py = cy * 4 + 1 + h2(cx, cy, 72) * 2;
          const dd = (x - px) * (x - px) + (y - py) * (y - py) * 1.4;
          if (dd < best) { sec = best; best = dd; bid = h2(cx, cy, 73); } else if (dd < sec) sec = dd;
        }
        if (Math.sqrt(sec) - Math.sqrt(best) < 0.9) put(i, th.gap);
        else { const top = Math.sqrt(best) < 1.2 ? 0.25 : 0; put(i, pick(th.stone, clamp(bid * 0.7 + top + (n - 0.5) * 0.3, 0, 1), x, y), sh); }
        continue;
      }
      if (rShape) {
        const rv = rShape[i] + (n2 - 0.5) * 0.26;
        if (rv > 0.5) {
          let v = 0.35 + (n - 0.5) * 0.9 + (h2(x, y, 9) < 0.04 ? 0.35 : 0);
          if (rv < 0.56) v -= 0.3; // borda
          // sulcos de carroça
          if (Math.abs(((x + y) % 7) - 3) === 0 && rv > 0.8 && h2(x >> 2, y >> 2, 4) < 0.6) v -= 0.25;
          put(i, pick(th.road, clamp(v, 0, 1), x, y), sh);
          continue;
        }
      }
      if (fShape && fShape[i] + (n2 - 0.5) * 0.3 > 0.5) {
        let v = 0.45 + (n - 0.5) * 1.1;
        const lf = h2(x, y, 17);
        if (lf < 0.05) { put(i, th.leaves[(h2(x, y, 18) * th.leaves.length) | 0], sh * 0.85); continue; }
        put(i, pick(th.forest, clamp(v, 0, 1), x, y), sh);
        continue;
      }
      // chão: terra + manchas de capim morto
      const grassy = fbm(x, y, 30, seed + 9) + (n2 - 0.5) * 0.25;
      let c;
      if (grassy > 0.56) c = pick(th.grass, clamp((n2 - 0.3) * 1.1 + (grassy - 0.56) * 0.8, 0, 0.8), x, y);
      else c = pick(th.ground, clamp(n * 1.1 - 0.05 + (n2 - 0.5) * 0.5, 0, 1), x, y);
      put(i, c, sh);
    }
    g.putImageData(img, 0, 0);

    // ---------- detalhes sobre o terreno ----------
    const lights = [];
    const r = X.rng(seed);
    const px = (x, y, c) => { g.fillStyle = c; g.fillRect(x, y, 1, 1); };
    const rc = (x, y, ww, hh, c) => { g.fillStyle = c; g.fillRect(x, y, ww, hh); };
    for (let ty = 0; ty < rows; ty++) for (let tx = 0; tx < cols; tx++) {
      const c = tl(tx, ty), M = mat[ty * cols + tx], X0 = tx * T, Y0 = ty * T, hv = h2(tx, ty, 5);
      if (M === 'ground' && c !== 'g' && c !== 'S' && c !== 'w' && c !== 'c') {
        const nd = c === ',' ? 5 : 2;
        for (let k = 0; k < nd; k++) { // tufos de capim seco
          const x = X0 + ((h2(tx, ty, 10 + k) * 14) | 0), y = Y0 + 3 + ((h2(tx, ty, 20 + k) * 12) | 0);
          const col = theme === 'vale' ? '#6c7b86' : '#6e6a52', dk = theme === 'vale' ? '#3c4852' : '#3e3b2c';
          px(x, y, col); px(x + 2, y - 1, col); px(x + 1, y + 1, dk); px(x - 1, y + 1, dk); px(x + 1, y, col);
        }
        if (hv < 0.18) { const x = X0 + 3 + ((h2(tx, ty, 31) * 10) | 0), y = Y0 + 4 + ((h2(tx, ty, 32) * 9) | 0); rc(x, y, 2, 1, '#5d5660'); px(x, y - 1, '#7a7480'); px(x + 2, y, '#1e1a20'); }
        if (hv > 0.93 && theme !== 'vila') { // ossos e um crânio de vez em quando
          const x = X0 + 4 + ((h2(tx, ty, 33) * 7) | 0), y = Y0 + 6 + ((h2(tx, ty, 34) * 6) | 0);
          if (h2(tx, ty, 35) < 0.4) { rc(x, y, 4, 3, '#b8b0a0'); rc(x + 1, y + 3, 2, 1, '#8a8274'); px(x + 1, y + 1, '#1a1418'); px(x + 3, y + 1, '#1a1418'); px(x, y, '#d8d0c0'); }
          else { rc(x, y, 5, 1, '#a8a090'); px(x - 1, y - 1, '#c8c0b0'); px(x + 5, y + 1, '#c8c0b0'); }
        }
        if (hv > 0.82 && hv <= 0.93) { // flores murchas
          const x = X0 + 2 + ((h2(tx, ty, 36) * 12) | 0), y = Y0 + 4 + ((h2(tx, ty, 37) * 10) | 0);
          const fc = theme === 'vale' ? '#a8c8e0' : ['#7a2a3a', '#6a3a7a', '#8a5a3a'][(h2(tx, ty, 38) * 3) | 0];
          px(x, y + 1, '#2a2a20'); px(x, y + 2, '#2a2a20'); px(x, y, fc); px(x + 3, y + 2, fc); px(x + 3, y + 3, '#2a2a20');
        }
      }
      if (M === 'forest' && c === 'f') {
        if (hv < 0.35) { // raízes expostas
          g.strokeStyle = '#0e0b10'; g.lineWidth = 1;
          const x = X0 + h2(tx, ty, 40) * 16, y = Y0 + h2(tx, ty, 41) * 16;
          for (let k = 0; k < 6; k++) px((x + k * 2) | 0, (y + Math.sin(k + hv * 9) * 2) | 0, '#0e0b10');
        }
        if (hv > 0.7) { // arbusto seco
          const x = X0 + 4 + ((h2(tx, ty, 42) * 8) | 0), y = Y0 + 8 + ((h2(tx, ty, 43) * 5) | 0);
          for (let k = -2; k <= 2; k++) { rc(x + k * 1.5 | 0, y - 3 + Math.abs(k), 1, 3 - Math.abs(k) + 1, '#120e14'); }
          px(x - 1, y - 3, th.leaves === TH.reino.leaves ? '#5a2a2e' : '#36505a');
        }
        if (theme === 'reino' && hv > 0.55 && hv < 0.6) { // cogumelos pálidos
          const x = X0 + 5 + ((h2(tx, ty, 44) * 6) | 0), y = Y0 + 10;
          rc(x, y, 3, 1, '#9a8aa8'); px(x + 1, y + 1, '#6a5a72'); rc(x + 4, y + 2, 2, 1, '#8a7a98'); px(x + 4, y + 3, '#5a4a62');
          lights.push({ x: x + 2, y: y, r: 7, col: 'rgba(180,140,255,0.35)', fl: 0.4 });
        }
      }
      if (c === 'r') { // rachaduras com raízes
        g.fillStyle = '#120c10';
        let x = X0 + h2(tx, ty, 50) * 4, y = Y0 + 2 + h2(tx, ty, 51) * 12;
        for (let k = 0; k < 18; k++) { g.fillRect(x | 0, y | 0, 1, 1); x += 0.9; y += Math.sin(k * 0.7 + hv * 6) * 0.8; if (h2(tx, ty, 52 + k) < 0.15) { g.fillRect(x | 0, (y + 1) | 0, 1, 2); } }
        px((X0 + 8) | 0, (Y0 + 9) | 0, '#3a1a24');
      }
    }

    // cada tipo especial
    for (let ty = 0; ty < rows; ty++) for (let tx = 0; tx < cols; tx++) {
      const c = tl(tx, ty), X0 = tx * T, Y0 = ty * T;
      if (c === 'A') cave(g, X0, Y0, theme, lights);
      else if (c === 'B') bridge(g, X0, Y0, tl(tx, ty - 1) === 'B' || tl(tx, ty - 1) === '6', tl(tx, ty + 1) === 'B' || tl(tx, ty + 1) === '6');
      else if (c === 'k') well(g, X0, Y0);
      else if (c === 'w') fence(g, X0, Y0, tl(tx - 1, ty) === 'w', tl(tx + 1, ty) === 'w', tl(tx, ty - 1) === 'w', tl(tx, ty + 1) === 'w');
      else if (c === 'S') sanctuary(g, X0, Y0);
      else if (c === 'c') { rc(X0 + 2, Y0 + 10, 12, 4, '#1a1214'); lights.push({ x: X0 + 8, y: Y0 + 9, r: 40, col: 'rgba(255,140,40,0.32)', fl: 1, fire: true }); }
      else if (c === '*') lights.push({ x: X0 + 8, y: Y0 + 6, r: 18, col: 'rgba(170,90,255,0.3)', fl: 0.5 });
      else if (c === 'R') lights.push({ x: X0 + 8, y: Y0 + 2, r: 26, col: 'rgba(240,200,100,0.25)', fl: 0.4 });
      else if (c === 'V') lights.push({ x: X0 + 8, y: Y0 + 4, r: 20, col: 'rgba(255,190,90,0.22)', fl: 0.6 });
      else if (c === 'W') lights.push({ x: X0 + 9, y: Y0 - 20, r: 8, col: 'rgba(255,190,90,0.4)', fl: 0.8 });
      else if (c === 'X') lights.push({ x: X0 + 8, y: Y0 + 6, r: 12, col: 'rgba(255,40,40,0.22)', fl: 0.7 });
    }
    // casas da vila
    const pits = [];
    if (house) houses(g, tl, cols, rows, lights);
    if (pit) {
      for (let ty = 0; ty < rows; ty++) for (let tx = 0; tx < cols; tx++) if (tl(tx, ty) === '~' && h2(tx, ty, 61) < 0.12) pits.push({ x: tx * T + 8, y: ty * T + 10 });
    }
    return { sig, canvas: cv, w, h, lights, pits, theme, th };
  }

  // ---------- peças especiais ----------
  function cave(g, x, y, theme, lights) {
    const dark = '#050204';
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(x - 2, y + 1, 20, 15);
    const arch = (ox, oy, ww, hh, col) => { g.fillStyle = col; for (let k = 0; k < hh; k++) { const t = k / hh; const half = Math.round(ww / 2 * Math.sqrt(1 - (1 - t) * (1 - t) * 0.85)); g.fillRect(ox + ww / 2 - half, oy + k, half * 2, 1); } };
    arch(x - 1, y + 1, 18, 15, '#3a3040');
    arch(x + 1, y + 3, 14, 13, '#1a1420');
    arch(x + 3, y + 5, 10, 11, dark);
    g.fillStyle = '#5a4a60'; g.fillRect(x + 1, y + 4, 1, 3); g.fillRect(x + 2, y + 2, 2, 1); g.fillRect(x + 13, y + 3, 1, 2);
    g.fillStyle = '#d8d0c0'; for (const [a, b] of [[4, 5], [6, 5], [9, 5], [11, 5]]) g.fillRect(x + a, y + b, 1, 2); // dentes de pedra
    lights.push({ x: x + 8, y: y + 12, r: 22, col: theme === 'vale' ? 'rgba(120,200,255,0.25)' : 'rgba(255,40,30,0.4)', fl: 1 });
  }
  function bridge(g, x, y, up, down) {
    g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(x + 3, y + 2, 12, 16);
    for (let k = 0; k < 16; k += 3) { g.fillStyle = (k / 3) % 2 ? '#6a5a48' : '#7a6a56'; g.fillRect(x + 2, y + k, 12, 2); g.fillStyle = '#3a3026'; g.fillRect(x + 2, y + k + 2, 12, 1); if ((x + k) % 5 === 0) { g.fillStyle = '#05070a'; g.fillRect(x + 6, y + k, 3, 2); } }
    g.fillStyle = '#4a3c30'; g.fillRect(x + 1, y, 1, 16); g.fillRect(x + 14, y, 1, 16);
    g.fillStyle = '#a89878'; for (let k = 1; k < 16; k += 4) { g.fillRect(x + 1, y + k, 1, 1); g.fillRect(x + 14, y + k, 1, 1); }
    if (!up || !down) { g.fillStyle = '#2a2018'; g.fillRect(x, y + (up ? 12 : 0), 2, 4); g.fillRect(x + 14, y + (up ? 12 : 0), 2, 4); }
  }
  function well(g, x, y) {
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(x + 9, y + 12, 7, 3, 0, 0, 7); g.fill();
    g.fillStyle = '#4a4650'; g.beginPath(); g.ellipse(x + 8, y + 9, 7, 5, 0, 0, 7); g.fill();
    g.fillStyle = '#6a6470'; for (let a = 0; a < 6.2; a += 0.7) g.fillRect(x + 8 + Math.cos(a) * 6 | 0, y + 9 + Math.sin(a) * 4 | 0, 2, 1);
    g.fillStyle = '#05040a'; g.beginPath(); g.ellipse(x + 8, y + 9, 4, 3, 0, 0, 7); g.fill();
    g.fillStyle = '#3a2a1e'; g.fillRect(x + 2, y + 1, 1, 9); g.fillRect(x + 13, y + 1, 1, 9); g.fillRect(x + 2, y + 1, 12, 1);
    g.fillStyle = '#7a6a5a'; g.fillRect(x + 7, y + 2, 1, 4); g.fillStyle = '#5a4030'; g.fillRect(x + 6, y + 5, 3, 2);
  }
  function fence(g, x, y, l, r, u, d) {
    g.fillStyle = 'rgba(0,0,0,0.3)';
    if (l || r) g.fillRect(x, y + 11, 16, 2); else g.fillRect(x + 8, y, 3, 16);
    const post = (px, py) => { g.fillStyle = '#2a201c'; g.fillRect(px, py, 3, 8); g.fillStyle = '#4a3a30'; g.fillRect(px, py, 1, 8); g.fillStyle = '#5a4a3e'; g.fillRect(px, py, 3, 1); };
    if (l || r) {
      g.fillStyle = '#3a2e28'; g.fillRect(x, y + 5, 16, 2); g.fillRect(x, y + 9, 16, 1);
      g.fillStyle = '#54443a'; g.fillRect(x, y + 5, 16, 1);
      post(x + 6, y + 3);
    }
    if (u || d) {
      g.fillStyle = '#3a2e28'; g.fillRect(x + 7, y, 2, 16); g.fillStyle = '#54443a'; g.fillRect(x + 7, y, 1, 16);
      post(x + 6, y + 4);
    }
  }
  function sanctuary(g, x, y) {
    g.fillStyle = '#3a4048'; g.beginPath(); g.ellipse(x + 8, y + 9, 9, 6, 0, 0, 7); g.fill();
    g.fillStyle = '#5a6270'; g.beginPath(); g.ellipse(x + 8, y + 8, 8, 5, 0, 0, 7); g.fill();
    g.fillStyle = '#2a3038'; g.beginPath(); g.ellipse(x + 8, y + 8, 5, 3, 0, 0, 7); g.fill();
    for (let a = 0; a < 6.28; a += 1.05) { const sx = x + 8 + Math.cos(a) * 8 | 0, sy = y + 8 + Math.sin(a) * 5 | 0; g.fillStyle = '#7a8290'; g.fillRect(sx - 1, sy - 4, 2, 4); g.fillStyle = '#4a5260'; g.fillRect(sx, sy - 4, 1, 4); }
  }
  function houses(g, tl, cols, rows, lights) {
    const seen = new Set();
    const isH = (x, y) => 'ohdD'.includes(tl(x, y)) && x >= 0 && y >= 0 && x < cols && y < rows;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (!isH(x, y) || seen.has(x + ',' + y)) continue;
      let x1 = x; while (isH(x1 + 1, y)) x1++;
      let y1 = y; while (isH(x, y1 + 1)) y1++;
      for (let yy = y; yy <= y1; yy++) for (let xx = x; xx <= x1; xx++) seen.add(xx + ',' + yy);
      let wallY = y1; // última fileira = parede
      const X0 = x * T, X1 = (x1 + 1) * T, RY0 = y * T - 4, RY1 = wallY * T + 2, WY = wallY * T;
      // parede de enxaimel
      g.fillStyle = '#5a4a40'; g.fillRect(X0 + 1, WY, X1 - X0 - 2, 16);
      g.fillStyle = '#4a3c34'; for (let k = WY + 1; k < WY + 16; k += 3) g.fillRect(X0 + 1, k, X1 - X0 - 2, 1);
      g.fillStyle = '#261a14'; g.fillRect(X0 + 1, WY + 14, X1 - X0 - 2, 2); g.fillRect(X0 + 1, WY, 2, 16); g.fillRect(X1 - 3, WY, 2, 16);
      for (let k = X0 + 12; k < X1 - 6; k += 12) { g.fillRect(k, WY, 2, 16); }
      for (let xx = x; xx <= x1; xx++) {
        const c = tl(xx, wallY), dx = xx * T;
        if (c === 'd' || c === 'D') {
          g.fillStyle = '#1a100a'; g.fillRect(dx + 3, WY + 2, 10, 14);
          g.fillStyle = c === 'D' ? '#e0b048' : '#3a2416'; g.fillRect(dx + 4, WY + 4, 8, 12);
          g.fillStyle = c === 'D' ? '#fff0b0' : '#4a3020'; g.fillRect(dx + 5, WY + 3, 6, 1);
          if (c === 'd') { g.fillStyle = '#2a1a10'; g.fillRect(dx + 8, WY + 4, 1, 12); g.fillStyle = '#c9a24a'; g.fillRect(dx + 10, WY + 10, 1, 1); }
          else lights.push({ x: dx + 8, y: WY + 10, r: 30, col: 'rgba(255,210,110,0.45)', fl: 0.6 });
        } else if (h2(xx, wallY, 81) < 0.7) {
          const lit = h2(xx, wallY, 82) < 0.35;
          g.fillStyle = '#1a120c'; g.fillRect(dx + 4, WY + 4, 8, 7);
          g.fillStyle = lit ? '#e8b050' : '#0a0808'; g.fillRect(dx + 5, WY + 5, 6, 5);
          g.fillStyle = '#1a120c'; g.fillRect(dx + 7, WY + 5, 1, 5); g.fillRect(dx + 5, WY + 7, 6, 1);
          g.fillStyle = '#3a2a1e'; g.fillRect(dx + 3, WY + 11, 10, 1);
          if (lit) lights.push({ x: dx + 8, y: WY + 8, r: 16, col: 'rgba(255,190,90,0.3)', fl: 0.5 });
        }
      }
      // telhado: duas águas, telhas em fileiras
      const ridge = RY0 + Math.round((RY1 - RY0) * 0.38);
      for (let yy = RY0; yy < RY1; yy++) {
        const back = yy < ridge;
        const row = Math.floor((yy - RY0) / 3);
        for (let xx = X0 - 2; xx < X1 + 2; xx++) {
          const off = (row & 1) * 3;
          const seam = (xx + off) % 6 === 0;
          const bottom = (yy - RY0) % 3 === 2;
          let col = back ? '#3a1820' : '#5a2430';
          if (bottom) col = back ? '#2a1016' : '#401a22';
          else if (seam) col = back ? '#2e1218' : '#4a1e28';
          else if (!back && (yy - RY0) % 3 === 0) col = '#6e3038';
          if (h2(xx, yy, 83) < 0.03) col = '#2a2a2a'; // telha faltando
          g.fillStyle = col; g.fillRect(xx, yy, 1, 1);
        }
      }
      g.fillStyle = '#8a4048'; g.fillRect(X0 - 2, ridge, X1 - X0 + 4, 1);
      g.fillStyle = '#1a0a0e'; g.fillRect(X0 - 2, RY1, X1 - X0 + 4, 2); // beiral
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(X0, RY1 + 2, X1 - X0, 3);
      // chaminé
      const chx = X0 + 6 + Math.floor(h2(x, y, 84) * (X1 - X0 - 16));
      g.fillStyle = '#3a3438'; g.fillRect(chx, RY0 - 3, 6, 8); g.fillStyle = '#5a5258'; g.fillRect(chx, RY0 - 3, 6, 1); g.fillRect(chx, RY0 - 3, 1, 8);
      g.fillStyle = '#0a0808'; g.fillRect(chx + 1, RY0 - 2, 4, 1);
      lights.push({ x: chx + 3, y: RY0 - 4, r: 0, smoke: true });
    }
  }

  // ---------- objetos altos (ordenados com os personagens) ----------
  const tc = {};
  function treeSprite(theme, v) {
    const key = 'tr' + theme + v; if (tc[key]) return tc[key];
    const [c, g] = X.canvas(36, 46);
    const rr = X.rng(v * 131 + theme.length);
    const vale = theme === 'vale';
    const bark = vale ? ['#0e1318', '#18202a', '#26303c', '#36424f'] : ['#0e0a10', '#1a141c', '#282028', '#3a2e36'];
    const leaf = vale ? ['#2a3a44', '#3a5260', '#56707c'] : ['#2e1018', '#4a1a24', '#6a2630', '#3a2048'];
    const blot = (x, y, s, col) => { g.fillStyle = col; g.fillRect(Math.round(x - s / 2), Math.round(y - s / 2), Math.max(1, Math.round(s)), Math.max(1, Math.round(s))); };
    const limb = (x0, y0, x1, y1, w0, w1) => {
      const L = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(L * 1.5);
      for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, s = w0 + (w1 - w0) * t; blot(x, y, s, bark[1]); }
      for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, s = w0 + (w1 - w0) * t; if (s > 1.6) blot(x - s * 0.25, y, s * 0.4, bark[2]); }
    };
    const ends = [];
    const branch = (x, y, a, len, w, d) => {
      const x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len;
      limb(x, y, x1, y1, w, Math.max(1, w * 0.62));
      if (d <= 0) { ends.push([x1, y1]); return; }
      const sp = 0.35 + rr() * 0.45;
      branch(x1, y1, a - sp, len * (0.62 + rr() * 0.2), w * 0.62, d - 1);
      branch(x1, y1, a + sp * (0.7 + rr() * 0.6), len * (0.6 + rr() * 0.2), w * 0.6, d - 1);
      if (rr() < 0.3) ends.push([x1, y1]);
    };
    // raízes
    limb(18, 43, 10, 45, 3, 1); limb(18, 43, 27, 45, 3, 1); limb(18, 43, 15, 46, 2, 1);
    const top = 22 + rr() * 4;
    limb(18, 44, 18 + (rr() - 0.5) * 4, top, 5, 3.5);
    branch(18 + (rr() - 0.5) * 3, top, -Math.PI / 2 + (rr() - 0.5) * 0.4, 9 + rr() * 3, 3.2, 3);
    branch(18, top + 6, -Math.PI / 2 - 0.9 - rr() * 0.3, 7, 2, 2);
    branch(18, top + 4, -Math.PI / 2 + 0.9 + rr() * 0.3, 7, 2, 2);
    // folhas murchas
    const lv = vale ? 0.4 : 0.6;
    for (const [x, y] of ends) {
      if (rr() > lv) continue;
      for (let k = 0; k < 9; k++) { const lx = x + (rr() - 0.5) * 7, ly = y + (rr() - 0.5) * 5; g.fillStyle = leaf[(rr() * leaf.length) | 0]; g.fillRect(lx | 0, ly | 0, 2, 1 + (rr() < 0.4)); }
      g.fillStyle = vale ? '#7a96a2' : '#8a3a40'; g.fillRect(x - 1 | 0, y - 2 | 0, 1, 1);
    }
    // contorno escuro
    const d = g.getImageData(0, 0, 36, 46), a = d.data, o = new Uint8ClampedArray(a);
    for (let y = 0; y < 46; y++) for (let x = 0; x < 36; x++) { const i = (y * 36 + x) * 4; if (a[i + 3]) continue; const nb = (xx, yy) => xx >= 0 && yy >= 0 && xx < 36 && yy < 46 && a[(yy * 36 + xx) * 4 + 3]; if (nb(x - 1, y) || nb(x + 1, y) || nb(x, y - 1) || nb(x, y + 1)) { o[i] = 4; o[i + 1] = 2; o[i + 2] = 6; o[i + 3] = 200; } }
    d.data.set(o); g.putImageData(d, 0, 0);
    return (tc[key] = c);
  }
  function crystalSprite(v) {
    const key = 'cr' + v; if (tc[key]) return tc[key];
    const [c, g] = X.canvas(18, 22); const rr = X.rng(v * 77 + 3);
    const shard = (x, hgt, w, lean) => {
      const tx = x + lean, ty = 21 - hgt;
      g.fillStyle = '#1a0e2a'; g.beginPath(); g.moveTo(x - w - 1, 21); g.lineTo(tx, ty - 1); g.lineTo(x + w + 1, 21); g.fill();
      g.fillStyle = '#3a1e5a'; g.beginPath(); g.moveTo(x - w, 21); g.lineTo(tx, ty); g.lineTo(x, 21); g.fill();
      g.fillStyle = '#6b3f9c'; g.beginPath(); g.moveTo(x, 21); g.lineTo(tx, ty); g.lineTo(x + w, 21); g.fill();
      g.fillStyle = '#b07ae8'; for (let k = 0; k < hgt - 3; k++) g.fillRect(Math.round(tx + (x - tx) * k / hgt), ty + k, 1, 1);
      g.fillStyle = '#f0d8ff'; g.fillRect(Math.round(tx), ty, 1, 2);
    };
    shard(5, 9 + rr() * 4, 2.5, -1); shard(13, 7 + rr() * 3, 2, 1.5); shard(9, 14 + rr() * 5, 3, (rr() - 0.5) * 2);
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(2, 20, 15, 2);
    return (tc[key] = c);
  }
  function rootsSprite(v) {
    const key = 'rt' + v; if (tc[key]) return tc[key];
    const [c, g] = X.canvas(22, 30); const rr = X.rng(v * 91 + 5);
    for (let k = 0; k < 7; k++) {
      let x = 2 + rr() * 18, y = 30; const dx = (rr() - 0.5) * 1.2; let w = 3 + rr() * 2;
      while (y > 2 + rr() * 8) { g.fillStyle = '#0c080c'; g.fillRect(x | 0, y | 0, w | 0, 2); g.fillStyle = '#2a1a22'; g.fillRect(x | 0, y | 0, 1, 2); x += dx + Math.sin(y / 3 + k) * 0.8; y -= 1.5; w = Math.max(1, w - 0.12);
        if (rr() < 0.08) { g.fillStyle = '#0c080c'; g.fillRect((x + w) | 0, (y - 1) | 0, 3, 1); g.fillStyle = '#c03040'; g.fillRect((x + w + 3) | 0, (y - 1) | 0, 1, 1); } }
    }
    return (tc[key] = c);
  }
  function graveSprite(v) {
    const key = 'gv' + v; if (tc[key]) return tc[key];
    const [c, g] = X.canvas(16, 22);
    g.fillStyle = '#1e2228'; g.beginPath(); g.ellipse(8, 19, 7, 3, 0, 0, 7); g.fill();
    g.fillStyle = '#2c3038'; g.beginPath(); g.ellipse(8, 18, 6, 2, 0, 0, 7); g.fill();
    if (v === 0) { // lápide arredondada
      g.fillStyle = '#5a626e'; g.fillRect(4, 6, 8, 12); g.beginPath(); g.arc(8, 7, 4, Math.PI, 0); g.fill();
      g.fillStyle = '#7a8290'; g.fillRect(4, 6, 2, 12); g.fillStyle = '#3a4048'; g.fillRect(11, 6, 1, 12);
      g.fillStyle = '#2e343c'; g.fillRect(7, 8, 2, 6); g.fillRect(6, 9, 4, 1);
    } else if (v === 1) { // cruz de madeira
      g.fillStyle = '#3a3028'; g.fillRect(7, 4, 3, 14); g.fillRect(4, 7, 9, 2);
      g.fillStyle = '#5a4a3a'; g.fillRect(7, 4, 1, 14); g.fillRect(4, 7, 9, 1);
    } else if (v === 2) { // lápide quebrada e torta
      g.fillStyle = '#525a66'; g.beginPath(); g.moveTo(4, 18); g.lineTo(5, 9); g.lineTo(8, 7); g.lineTo(10, 10); g.lineTo(12, 8); g.lineTo(12, 18); g.fill();
      g.fillStyle = '#727a88'; g.fillRect(5, 10, 1, 8); g.fillStyle = '#3a4250'; g.fillRect(9, 16, 4, 2);
    } else { // obelisco
      g.fillStyle = '#4a525e'; g.beginPath(); g.moveTo(5, 18); g.lineTo(7, 2); g.lineTo(9, 2); g.lineTo(11, 18); g.fill();
      g.fillStyle = '#6a7280'; g.fillRect(7, 3, 1, 15); g.fillStyle = '#9ab8c8'; g.fillRect(8, 6, 1, 1);
    }
    g.fillStyle = '#3a5a44'; g.fillRect(4, 16, 2, 1); g.fillRect(10, 17, 2, 1); // musgo
    return (tc[key] = c);
  }
  function villageSprite() {
    if (tc.vil) return tc.vil;
    const [c, g] = X.canvas(44, 34);
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(22, 27, 21, 6, 0, 0, 7); g.fill();
    const hs = (x, y, w) => {
      g.fillStyle = '#4a3c34'; g.fillRect(x, y + 5, w, 5); g.fillStyle = '#2a1e18'; g.fillRect(x, y + 9, w, 1);
      g.fillStyle = '#5a2430'; g.beginPath(); g.moveTo(x - 1, y + 6); g.lineTo(x + w / 2, y); g.lineTo(x + w + 1, y + 6); g.fill();
      g.fillStyle = '#7a3440'; g.beginPath(); g.moveTo(x - 1, y + 6); g.lineTo(x + w / 2, y); g.lineTo(x + w / 2, y + 6); g.fill();
      g.fillStyle = '#ffcf6a'; g.fillRect(x + 2, y + 7, 1, 2);
    };
    hs(6, 9, 9); hs(26, 7, 10); hs(15, 15, 11); hs(29, 17, 8);
    // paliçada
    for (let a = 0.15; a < Math.PI - 0.1; a += 0.13) { const x = 22 + Math.cos(a) * 20, y = 24 + Math.sin(a) * 6; g.fillStyle = '#2a1e18'; g.fillRect(x | 0, (y - 5) | 0, 2, 6); g.fillStyle = '#4a3a2e'; g.fillRect(x | 0, (y - 6) | 0, 1, 2); }
    g.fillStyle = '#100a0c'; g.fillRect(20, 26, 4, 4);
    return (tc.vil = c);
  }
  function templeSprite() {
    if (tc.tpl) return tc.tpl;
    const [c, g] = X.canvas(36, 38);
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(2, 33, 32, 4);
    for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? '#5a4a3a' : '#6a5a46'; g.fillRect(4 + k, 30 + k * 2 - 6, 28 - k * 2, 2); }
    g.fillStyle = '#2a2018'; g.fillRect(6, 12, 24, 14);
    g.fillStyle = '#0a0604'; g.fillRect(14, 15, 8, 11); g.beginPath(); g.arc(18, 15, 4, Math.PI, 0); g.fill();
    for (const x of [6, 26]) { g.fillStyle = '#8a7a62'; g.fillRect(x, 10, 4, 16); g.fillStyle = '#b0a080'; g.fillRect(x, 10, 1, 16); g.fillStyle = '#5a4a3a'; g.fillRect(x + 3, 10, 1, 16); }
    g.fillStyle = '#7a6a52'; g.beginPath(); g.moveTo(3, 11); g.lineTo(18, 2); g.lineTo(26, 6); g.lineTo(24, 8); g.lineTo(33, 11); g.fill(); // frontão quebrado
    g.fillStyle = '#a89878'; g.fillRect(3, 10, 30, 1);
    g.fillStyle = '#e0c060'; g.fillRect(17, 6, 2, 3); g.fillRect(16, 7, 4, 1);
    g.fillStyle = '#3a2030'; g.fillRect(9, 20, 1, 6); g.fillRect(27, 14, 1, 5); // raízes nas colunas
    return (tc.tpl = c);
  }
  function towerSprite() {
    if (tc.tow) return tc.tow;
    const [c, g] = X.canvas(24, 62);
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.beginPath(); g.ellipse(13, 59, 10, 3, 0, 0, 7); g.fill();
    g.fillStyle = '#26202c'; g.fillRect(5, 10, 14, 49);
    for (let y = 10; y < 59; y += 4) for (let x = 5 + ((y / 4) % 2) * 3; x < 19; x += 6) { g.fillStyle = h2(x, y, 3) < 0.5 ? '#332b3a' : '#2c2533'; g.fillRect(x, y, 5, 3); }
    g.fillStyle = '#4a4054'; g.fillRect(5, 10, 2, 49); g.fillStyle = '#150f18'; g.fillRect(17, 10, 2, 49);
    g.fillStyle = '#26202c'; g.beginPath(); g.moveTo(4, 11); g.lineTo(6, 3); g.lineTo(9, 8); g.lineTo(12, 0); g.lineTo(15, 7); g.lineTo(18, 4); g.lineTo(20, 11); g.fill();
    g.fillStyle = '#0a0608'; g.fillRect(10, 18, 4, 6); g.beginPath(); g.arc(12, 18, 2, Math.PI, 0); g.fill();
    g.fillStyle = '#0a0608'; g.fillRect(10, 47, 4, 12);
    g.fillStyle = '#1a0e14'; for (let y = 30; y < 58; y++) g.fillRect(6 + Math.sin(y / 4) * 2 | 0, y, 1, 1); // trepadeira
    return (tc.tow = c);
  }
  function peakSprite(theme, v) {
    const key = 'pk' + theme + v; if (tc[key]) return tc[key];
    const Wp = 30, Hp = 30; const [c, g] = X.canvas(Wp, Hp); const rr = X.rng(v * 57 + 11);
    const R = (TH[theme] || TH.reino).rock.map(a => `rgb(${a[0]},${a[1]},${a[2]})`);
    const vale = theme === 'vale';
    const base = Hp - 2;
    const bumps = []; const nb = 1 + ((rr() * 2.4) | 0);
    for (let k = 0; k < nb; k++) bumps.push({ ax: 8 + rr() * 14, h: (k ? 9 + rr() * 8 : 15 + rr() * 11), s: 0.9 + rr() * 0.6 });
    const top = [], who = [];
    for (let x = 0; x < Wp; x++) {
      let best = -1, bi = 0;
      bumps.forEach((bm, i) => { const hh = bm.h - Math.abs(x - bm.ax) * bm.s * (x < bm.ax ? 1.25 : 1.1); if (hh > best) { best = hh; bi = i; } });
      top.push(best < 2 ? 99 : base - best + (vn(x, v, 2.5, 19) - 0.5) * 3); who.push(bi);
    }
    for (let y = 0; y < Hp; y++) for (let x = 0; x < Wp; x++) {
      if (y < top[x] || y > base) continue;
      const bm = bumps[who[x]], lit = x < bm.ax + (y - (base - bm.h)) * 0.12;
      const t = (y - (base - bm.h)) / bm.h;
      let idx = lit ? 5 : 2;
      if (((x * (lit ? 1 : -1) + y * 2) % 7 + 7) % 7 === 0) idx -= 1;
      if (h2(x, y, v + 5) < 0.14) idx += lit ? 1 : -1;
      if (t > 0.7) idx -= 1;
      if (y - top[x] < 3 && t < 0.4 && h2(x, y, 9) < 0.8) { g.fillStyle = vale ? (lit ? '#b8c4cc' : '#7a8894') : (lit ? '#a89aa8' : '#6a5e6c'); g.fillRect(x, y, 1, 1); continue; }
      g.fillStyle = R[clamp(idx, 0, R.length - 1)]; g.fillRect(x, y, 1, 1);
    }
    const ax = bumps[0].ax, ay = base - bumps[0].h, hgt = bumps[0].h;
    // aresta iluminada e fissura vermelha
    for (let y = Math.ceil(ay) + 1; y < base - 2; y++) { const x = Math.round(ax + (y - ay) * 0.12); g.fillStyle = R[6]; if (h2(x, y, 3) < 0.6 && y >= top[x]) g.fillRect(x, y, 1, 1); }
    if (!vale && rr() < 0.5) { let x = ax + 3, y = ay + hgt * 0.45; g.fillStyle = '#8a2026'; for (let k = 0; k < 7; k++) { g.fillRect(x | 0, y | 0, 1, 1); x += rr() - 0.3; y += 1; } }
    // contorno
    const d = g.getImageData(0, 0, Wp, Hp), a = d.data, o = new Uint8ClampedArray(a);
    for (let y = 0; y < Hp; y++) for (let x = 0; x < Wp; x++) { const i = (y * Wp + x) * 4; if (a[i + 3]) continue; const nb = (xx, yy) => xx >= 0 && yy >= 0 && xx < Wp && yy < Hp && a[(yy * Wp + xx) * 4 + 3]; if (nb(x - 1, y) || nb(x + 1, y) || nb(x, y - 1)) { o[i] = 6; o[i + 1] = 4; o[i + 2] = 8; o[i + 3] = 255; } }
    d.data.set(o); g.putImageData(d, 0, 0);
    return (tc[key] = c);
  }
  // retorna true se desenhou algo alto para o tile
  Wd.TALL = { '^': 1, T: 1, W: 1, s: 1, g: 1, '*': 1, X: 1, V: 1, R: 1 };
  Wd.drawTall = function (ctx, ch, sx, sy, x, y, theme) {
    const v = h2(x, y, 9);
    if (ch === '^') { const F = G.Field; let nm = 0; for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) if (F.tile(x + ox, y + oy) === '^') nm++; if ((v < 0.5 || nm <= 5) && G.Field.tile(x, y + 1) !== 'A' && G.Field.tile(x - 1, y + 1) !== 'A' && G.Field.tile(x + 1, y + 1) !== 'A') ctx.drawImage(peakSprite(theme, (h2(x, y, 4) * 6) | 0), sx - 7 + ((h2(x, y, 6) * 6) | 0) - 3, sy - 14 + ((h2(x, y, 7) * 4) | 0)); }
    else if (ch === 'T') { const im = treeSprite(theme, (v * 4) | 0); ctx.drawImage(im, sx - 10 + ((h2(x, y, 2) * 4) | 0) - 2, sy - 30); }
    else if (ch === '*') ctx.drawImage(crystalSprite((v * 3) | 0), sx - 1, sy - 6);
    else if (ch === 'X') ctx.drawImage(rootsSprite((v * 3) | 0), sx - 3, sy - 14);
    else if (ch === 'g') ctx.drawImage(graveSprite((v * 4) | 0), sx, sy - 6);
    else if (ch === 'V') ctx.drawImage(villageSprite(), sx - 14, sy - 16);
    else if (ch === 'R') ctx.drawImage(templeSprite(), sx - 10, sy - 22);
    else if (ch === 'W') { ctx.drawImage(towerSprite(), sx - 4, sy - 46); if ((G.time >> 5) % 5 === 0) { ctx.fillStyle = '#ffcf6a'; ctx.fillRect(sx + 7, sy - 26, 2, 1); ctx.fillRect(sx + 10, sy - 26, 2, 1); } }
    else X.drawTall(ctx, ch, sx, sy, x, y, theme);
  };

  // ---------- camada viva (luz, fumaça, cinzas, nuvens) ----------
  let clouds = null;
  function cloudTex() {
    if (clouds) return clouds;
    const S = 128; const [c, g] = X.canvas(S, S); const im = g.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const v = vn(x, y, 32, 3, S) * 0.65 + vn(x, y, 16, 4, S) * 0.35;
      const a = clamp((v - 0.5) * 3, 0, 1);
      const i = (y * S + x) * 4; im.data[i + 3] = a * 255 * (bay(x, y) < 0.9 ? 1 : 0.8);
    }
    g.putImageData(im, 0, 0); return (clouds = c);
  }
  Wd.drawFx = function (ctx, L, cx, cy) {
    const t = G.time, W = G.W, H = G.H;
    // sombras de nuvens
    const cl = cloudTex();
    ctx.globalAlpha = L.theme === 'vila' ? 0.1 : 0.16;
    const ox = -((cx * 1 + t * 0.12) % 256 + 256) % 256, oy = -((cy * 1 + t * 0.05) % 256 + 256) % 256;
    for (let yy = oy; yy < H; yy += 256) for (let xx = ox; xx < W; xx += 256) ctx.drawImage(cl, xx, yy, 256, 256);
    ctx.globalAlpha = 1;
    // fumaça das chaminés
    for (const l of L.lights) if (l.smoke) {
      const bx = l.x - cx, by = l.y - cy; if (bx < -20 || bx > W + 20 || by < -40 || by > H + 10) continue;
      for (let k = 0; k < 6; k++) { const p = ((t * 0.4 + k * 17) % 100) / 100; ctx.fillStyle = `rgba(150,140,150,${0.28 * (1 - p)})`; const s = 2 + p * 5; ctx.fillRect(bx + Math.sin(p * 6 + k) * 3 + p * 8 - s / 2, by - p * 30 - s / 2, s, s); }
    }
    // luzes
    ctx.globalCompositeOperation = 'lighter';
    for (const l of L.lights) {
      if (!l.r) continue;
      const x = l.x - cx, y = l.y - cy; if (x < -l.r || y < -l.r || x > W + l.r || y > H + l.r) continue;
      const fl = 1 - l.fl * 0.25 + l.fl * 0.25 * Math.sin(t / (l.fire ? 3 : 25) + l.x) * (l.fire ? Math.sin(t / 7.3) : 1);
      X.glow(ctx, x, y, l.r * (0.92 + 0.08 * fl), l.col, fl);
    }
    // fendas: brilho que pulsa lá no fundo
    if (L.pits.length) {
      const red = L.theme !== 'vale';
      for (const p of L.pits) {
        const x = p.x - cx, y = p.y - cy; if (x < -30 || y < -30 || x > W + 30 || y > H + 30) continue;
        const a = 0.5 + 0.5 * Math.sin(t / 40 + p.x * 0.05);
        X.glow(ctx, x, y, 14, red ? 'rgba(200,20,30,0.08)' : 'rgba(80,160,200,0.1)', a);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // fogo
    for (const l of L.lights) if (l.fire) {
      const x = l.x - cx, y = l.y - cy; if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
      const f = (t >> 2) & 3;
      ctx.fillStyle = '#ff6a1a'; ctx.beginPath(); ctx.moveTo(x - 5, y + 4); ctx.lineTo(x - 1 + (f & 1), y - 7 - f); ctx.lineTo(x + 5, y + 4); ctx.fill();
      ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.moveTo(x - 2, y + 4); ctx.lineTo(x + (f >> 1), y - 2 - f); ctx.lineTo(x + 3, y + 4); ctx.fill();
      for (let k = 0; k < 3; k++) { const p = ((t * 0.8 + k * 33) % 60) / 60; ctx.fillStyle = `rgba(255,${150 + k * 30},60,${1 - p})`; ctx.fillRect(x + Math.sin(p * 9 + k) * 4, y - 6 - p * 22, 1, 1); }
    }
    // partículas
    if (L.th.ash) {
      for (let k = 0; k < 46; k++) {
        const sx = h2(k, 1, 7) * (W + 40), sy = h2(k, 2, 7) * (H + 40), sp = 0.15 + h2(k, 3, 7) * 0.25;
        const x = ((sx - cx * 1.05 + t * sp * 0.6 + Math.sin(t / 50 + k) * 6) % (W + 40) + W + 40) % (W + 40) - 20;
        const y = ((sy - cy * 1.05 + t * sp) % (H + 40) + H + 40) % (H + 40) - 20;
        ctx.fillStyle = k % 7 === 0 ? 'rgba(255,90,50,0.7)' : 'rgba(170,160,170,0.45)';
        ctx.fillRect(x | 0, y | 0, 1, 1);
      }
    }
    // brasas subindo das fendas
    if (L.pits.length) {
      for (const p of L.pits) {
        const x0 = p.x - cx, y0 = p.y - cy; if (x0 < -10 || y0 < -40 || x0 > W + 10 || y0 > H + 10) continue;
        for (let k = 0; k < 2; k++) {
          const ph = ((t * 0.35 + h2(p.x, p.y, k) * 100) % 100) / 100;
          ctx.fillStyle = L.theme === 'vale' ? `rgba(160,220,255,${0.6 * (1 - ph)})` : `rgba(255,${80 + k * 60},40,${0.8 * (1 - ph)})`;
          ctx.fillRect(x0 + Math.sin(ph * 7 + p.x) * 4 | 0, y0 - ph * 30 | 0, 1, 1);
        }
      }
    }
    // vagalumes pálidos / espíritos
    if (L.theme === 'vale' || L.theme === 'reino') {
      for (let k = 0; k < 10; k++) {
        const bx = h2(k, 9, 3) * L.w, by = h2(k, 10, 3) * L.h;
        const x = bx + Math.sin(t / 60 + k * 2) * 18 - cx, y = by + Math.cos(t / 47 + k) * 12 - cy;
        if (x < 0 || y < 0 || x > W || y > H) continue;
        const a = 0.4 + 0.4 * Math.sin(t / 15 + k * 3);
        ctx.fillStyle = L.theme === 'vale' ? `rgba(170,230,255,${a})` : `rgba(200,170,255,${a * 0.7})`;
        ctx.fillRect(x | 0, y | 0, 1, 1);
        X.glow(ctx, x, y, 4, L.theme === 'vale' ? 'rgba(170,230,255,0.25)' : 'rgba(200,170,255,0.18)', a);
      }
    }
  };
})();
