'use strict';
// Arte procedural dos inimigos (desenhada em baixa resolução e ampliada).
(function () {
  const X = G.gfx;
  const cache = {};
  const ART = {};
  X.ART = ART;

  function body(g, pts, fill) { g.fillStyle = fill; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fill(); }
  function glowDot(g, x, y, r, c) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }

  // Larvas da Essência (variações)
  // Larva da Essência: corpo segmentado verde-acinzentado que se ergue, bocarra cheia de dentes e olho vermelho
  ART.larva = (g, w, h, o) => {
    const r = X.rng(o.seed || 3);
    const segs = o.long ? 9 : 7;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs; // 0 = cauda, 1 = cabeça
      const x = w * (0.92 - 0.62 * t) + Math.sin(t * 5) * w * 0.03;
      const y = h * (0.9 - 0.52 * Math.sin(t * Math.PI * 0.62));
      pts.push([x, y, h * (0.07 + 0.13 * t)]);
    }
    for (let i = 0; i < pts.length - 1; i++) {
      const [x, y, rad] = pts[i];
      g.fillStyle = o.c1; g.beginPath(); g.ellipse(x, y, rad * 1.15, rad, -0.4, 0, 7); g.fill();
      g.fillStyle = o.c2; g.beginPath(); g.ellipse(x - rad * 0.3, y - rad * 0.35, rad * 0.55, rad * 0.32, -0.4, 0, 7); g.fill();
      g.strokeStyle = o.ring || 'rgba(20,26,18,0.7)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, rad * 1.15, rad, -0.4, 0.2, 2.2); g.stroke();
      glowDot(g, x, y + rad * 0.2, rad * 0.5, o.core);
      if (o.crystal && i % 2 === 0) { g.fillStyle = '#1a0f28'; g.beginPath(); g.moveTo(x - 3, y - rad + 2); g.lineTo(x + 1, y - rad - 8 - r() * 6); g.lineTo(x + 4, y - rad + 2); g.fill(); g.fillStyle = '#c18bff'; g.fillRect(x, y - rad - 5, 1, 4); }
      if (o.armor && i % 2 === 1) { g.fillStyle = '#3a3640'; g.beginPath(); g.ellipse(x, y - rad * 0.4, rad * 1.1, rad * 0.55, -0.4, Math.PI, 0); g.fill(); g.fillStyle = '#6a6670'; g.fillRect(x - rad * 0.8, y - rad * 0.9, rad * 1.6, 1); }
      if (o.long) { g.strokeStyle = o.c1; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y + rad * 0.8); g.lineTo(x - 4, y + rad + 6); g.moveTo(x + 2, y + rad * 0.8); g.lineTo(x + 6, y + rad + 5); g.stroke(); }
    }
    // cabeça com a bocarra
    const [hx, hy, hr] = pts[pts.length - 1];
    g.fillStyle = o.c1; g.beginPath(); g.ellipse(hx, hy, hr * 1.15, hr * 1.05, -0.3, 0, 7); g.fill();
    g.fillStyle = o.c2; g.beginPath(); g.ellipse(hx + hr * 0.1, hy - hr * 0.55, hr * 0.6, hr * 0.3, -0.3, 0, 7); g.fill();
    const mx = hx - hr * 0.35, my = hy + hr * 0.15, mw = hr * 0.78, mh = hr * 0.62;
    g.fillStyle = '#2a0608'; g.beginPath(); g.ellipse(mx, my, mw, mh, -0.3, 0, 7); g.fill();
    g.fillStyle = '#5a0e12'; g.beginPath(); g.ellipse(mx + 1, my + 1, mw * 0.6, mh * 0.55, -0.3, 0, 7); g.fill();
    g.fillStyle = o.teeth || '#e8dcc0';
    const n = 7;
    for (let k = 0; k < n; k++) {
      const a = Math.PI * (1.05 + 0.9 * k / (n - 1)), tx = mx + Math.cos(a) * mw, ty = my + Math.sin(a) * mh;
      g.beginPath(); g.moveTo(tx - 1.5, ty); g.lineTo(tx + 1.5, ty); g.lineTo(mx + Math.cos(a) * mw * 0.45, my + Math.sin(a) * mh * 0.45); g.fill();
      const b = Math.PI * (0.1 + 0.8 * k / (n - 1)), bx = mx + Math.cos(b) * mw, by = my + Math.sin(b) * mh;
      g.beginPath(); g.moveTo(bx - 1.5, by); g.lineTo(bx + 1.5, by); g.lineTo(mx + Math.cos(b) * mw * 0.5, my + Math.sin(b) * mh * 0.5); g.fill();
    }
    glowDot(g, hx + hr * 0.45, hy - hr * 0.35, hr * 0.35, 'rgba(255,40,20,0.9)');
    g.fillStyle = o.eye; g.fillRect(hx + hr * 0.4, hy - hr * 0.42, 2, 2);
  };
  // Eco / fantasma / lembrança
  ART.ghost = (g, w, h, o) => {
    const cx = w / 2;
    for (let i = 0; i < 3; i++) { g.globalAlpha = 0.25 + i * 0.2; g.fillStyle = o.c1; g.beginPath(); g.moveTo(cx - w * (0.3 - i * 0.05), h * 0.9); g.quadraticCurveTo(cx - w * 0.4, h * 0.2, cx, h * (0.1 + i * 0.03)); g.quadraticCurveTo(cx + w * 0.4, h * 0.2, cx + w * (0.3 - i * 0.05), h * 0.9);
      for (let k = 0; k < 5; k++) g.lineTo(cx + w * (0.3 - k * 0.15) - i, h * (0.8 + (k % 2) * 0.1)); g.fill(); }
    g.globalAlpha = 1;
    g.fillStyle = '#05030a'; g.beginPath(); g.ellipse(cx - 8, h * 0.35, 5, 7, 0, 0, 7); g.ellipse(cx + 8, h * 0.35, 5, 7, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(cx, h * 0.55, 6, o.mouth || 9, 0, 0, 7); g.fill();
    g.fillStyle = o.eye; g.fillRect(cx - 9, h * 0.35, 2, 2); g.fillRect(cx + 7, h * 0.35, 2, 2);
    if (o.crystal) { g.fillStyle = '#2a1a40'; body(g, [[cx - 20, h], [cx - 12, h * 0.55], [cx - 4, h]], '#2a1a40'); body(g, [[cx + 4, h], [cx + 14, h * 0.5], [cx + 22, h]], '#3a2050'); }
  };
  // Raiz rastejante / Raiz Negra
  ART.root = (g, w, h, o) => {
    const r = X.rng(o.seed || 7);
    g.lineCap = 'round';
    for (let i = 0; i < (o.n || 9); i++) {
      g.strokeStyle = i % 2 ? o.c1 : o.c2; g.lineWidth = (o.thick || 4) - i * 0.2;
      g.beginPath(); const sx = w * (0.2 + r() * 0.6); g.moveTo(sx, h);
      g.bezierCurveTo(w * r(), h * 0.6, w * r(), h * 0.3, w * (0.3 + r() * 0.4), h * (0.05 + r() * 0.2)); g.stroke();
    }
    // espinhos
    g.fillStyle = o.c2; for (let i = 0; i < 20; i++) { const x = w * (0.15 + r() * 0.7), y = h * (0.2 + r() * 0.7); g.fillRect(x, y, 1, 3); }
    if (o.eyes) for (let i = 0; i < o.eyes; i++) { const x = w * (0.3 + r() * 0.4), y = h * (0.25 + r() * 0.4); glowDot(g, x, y, 5, o.eye); g.fillStyle = '#fff'; g.fillRect(x, y, 1, 1); }
    if (o.mouth) { g.fillStyle = '#000'; g.beginPath(); g.ellipse(w / 2, h * 0.42, w * 0.12, h * 0.07, 0, 0, 7); g.fill(); g.fillStyle = '#e0d0c0'; for (let i = 0; i < 7; i++) g.fillRect(w / 2 - w * 0.1 + i * w * 0.03, h * 0.38, 1, 3); }
  };
  // Sentinela do Vazio
  ART.sentinel = (g, w, h, o) => {
    const cx = w / 2;
    // capa
    body(g, [[cx - 16, h * 0.3], [cx - 24, h * 0.98], [cx + 24, h * 0.98], [cx + 16, h * 0.3]], o.cape || '#120e16');
    // pernas
    g.fillStyle = o.c2; g.fillRect(cx - 11, h * 0.68, 8, h * 0.3); g.fillRect(cx + 3, h * 0.68, 8, h * 0.3);
    // tronco
    body(g, [[cx - 15, h * 0.3], [cx - 12, h * 0.7], [cx + 12, h * 0.7], [cx + 15, h * 0.3]], o.c1);
    g.fillStyle = o.c2; g.fillRect(cx - 12, h * 0.45, 24, 2); g.fillRect(cx - 1, h * 0.32, 2, h * 0.36);
    g.fillStyle = '#4a4458'; g.fillRect(cx - 14, h * 0.3, 28, 2);
    // runas apagadas
    g.fillStyle = 'rgba(178,107,255,0.35)'; g.fillRect(cx - 8, h * 0.52, 3, 3); g.fillRect(cx + 5, h * 0.56, 3, 3);
    // ombreiras
    g.fillStyle = o.c1; g.beginPath(); g.ellipse(cx - 17, h * 0.32, 8, 5, -0.3, 0, 7); g.ellipse(cx + 17, h * 0.32, 8, 5, 0.3, 0, 7); g.fill();
    // braço e espada
    g.fillStyle = o.c2; g.fillRect(cx + 18, h * 0.33, 5, h * 0.25);
    g.fillStyle = '#4a4650'; body(g, [[cx + 21, h * 0.6], [cx + 30, h * 0.05], [cx + 33, h * 0.07], [cx + 24, h * 0.62]], '#5a5462');
    g.fillStyle = '#2a2430'; g.fillRect(cx + 17, h * 0.58, 10, 3);
    g.fillStyle = '#6a4a3a'; g.fillRect(cx + 27, h * 0.2, 2, 3); g.fillRect(cx + 25, h * 0.35, 2, 2);
    g.fillStyle = o.c2; g.fillRect(cx - 23, h * 0.33, 5, h * 0.27);
    // elmo
    if (o.faceless) {
      g.fillStyle = '#0a0610'; g.beginPath(); g.ellipse(cx, h * 0.18, 10, 12, 0, 0, 7); g.fill();
      for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#3a1a5a' : '#6a2aaa'; const a = i * 0.7; g.fillRect(cx + Math.cos(a) * 6, h * 0.18 + Math.sin(a) * 7, 3, 3); }
      glowDot(g, cx, h * 0.18, 10, 'rgba(178,107,255,0.8)');
    } else {
      g.fillStyle = o.c1; g.beginPath(); g.ellipse(cx, h * 0.18, 10, 12, 0, 0, 7); g.fill();
      g.fillStyle = '#05030a'; g.fillRect(cx - 7, h * 0.16, 14, 5);
      g.fillStyle = o.eye; g.fillRect(cx - 5, h * 0.17, 3, 2); g.fillRect(cx + 2, h * 0.17, 3, 2);
      g.fillStyle = '#4a4458'; g.fillRect(cx - 1, h * 0.06, 2, 8);
    }
  };
  // Guardião Branco
  ART.guardian = (g, w, h, o) => {
    const cx = w / 2;
    body(g, [[cx - 14, h * 0.28], [cx - 22, h * 0.98], [cx + 22, h * 0.98], [cx + 14, h * 0.28]], '#8a8478');
    g.fillStyle = '#c8c2b6'; g.fillRect(cx - 10, h * 0.66, 8, h * 0.32); g.fillRect(cx + 2, h * 0.66, 8, h * 0.32);
    body(g, [[cx - 14, h * 0.28], [cx - 11, h * 0.68], [cx + 11, h * 0.68], [cx + 14, h * 0.28]], '#e2ddd2');
    g.strokeStyle = '#6a645a'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - 6, h * 0.32); g.lineTo(cx - 2, h * 0.45); g.lineTo(cx - 7, h * 0.55); g.moveTo(cx + 8, h * 0.4); g.lineTo(cx + 4, h * 0.5); g.stroke();
    g.fillStyle = '#c9a24a'; g.fillRect(cx - 1, h * 0.3, 2, h * 0.36); g.fillRect(cx - 8, h * 0.42, 16, 1);
    g.fillStyle = '#e2ddd2'; g.beginPath(); g.ellipse(cx - 16, h * 0.3, 7, 5, -0.3, 0, 7); g.ellipse(cx + 16, h * 0.3, 7, 5, 0.3, 0, 7); g.fill();
    g.fillStyle = '#d0cabe'; g.fillRect(cx - 21, h * 0.3, 5, h * 0.25); g.fillRect(cx + 16, h * 0.3, 5, h * 0.25);
    // lança
    g.fillStyle = '#b8b0a0'; g.fillRect(cx + 22, h * 0.02, 2, h * 0.96);
    body(g, [[cx + 23, 0], [cx + 28, h * 0.1], [cx + 23, h * 0.14], [cx + 18, h * 0.1]], '#f4f4ff');
    g.fillStyle = '#c9a24a'; g.fillRect(cx + 20, h * 0.14, 6, 2);
    // cabeça / máscara
    if (o.unmasked) {
      g.fillStyle = '#b8a898'; g.beginPath(); g.ellipse(cx, h * 0.16, 9, 11, 0, 0, 7); g.fill();
      g.fillStyle = '#eee'; g.beginPath(); g.ellipse(cx, h * 0.1, 10, 7, 0, Math.PI, 0); g.fill(); g.fillRect(cx - 10, h * 0.1, 3, 14); g.fillRect(cx + 7, h * 0.1, 3, 14);
      g.strokeStyle = '#6a3a3a'; g.beginPath(); g.moveTo(cx - 5, h * 0.1); g.lineTo(cx - 2, h * 0.24); g.stroke();
      g.fillStyle = '#c0d8ff'; g.fillRect(cx - 5, h * 0.16, 2, 2); g.fillRect(cx + 3, h * 0.16, 2, 2);
    } else {
      g.fillStyle = '#f4f0e8'; g.beginPath(); g.ellipse(cx, h * 0.16, 9, 11, 0, 0, 7); g.fill();
      g.fillStyle = '#c9a24a'; g.fillRect(cx - 1, h * 0.06, 2, h * 0.2);
      g.fillStyle = '#101010'; g.fillRect(cx - 6, h * 0.15, 4, 2); g.fillRect(cx + 2, h * 0.15, 4, 2);
      g.strokeStyle = '#7a746a'; g.beginPath(); g.moveTo(cx + 5, h * 0.08); g.lineTo(cx + 3, h * 0.13); g.lineTo(cx + 6, h * 0.2); g.stroke();
    }
  };
  // Arauto
  ART.herald = (g, w, h, o) => {
    const cx = w / 2;
    g.fillStyle = '#08060c'; g.fillRect(cx - 9, h * 0.66, 7, h * 0.33); g.fillRect(cx + 2, h * 0.66, 7, h * 0.33);
    body(g, [[cx - 16, h * 0.28], [cx - 12, h * 0.7], [cx + 12, h * 0.7], [cx + 16, h * 0.28]], '#120e18');
    const r = X.rng(11);
    for (let i = 0; i < 22; i++) { const x = cx - 14 + r() * 28, y = h * (0.28 + r() * 0.42); body(g, [[x, y], [x + 4, y - 5], [x + 7, y + 1], [x + 3, y + 5]], r() < 0.5 ? '#2a1a3a' : '#1a1028'); g.fillStyle = 'rgba(200,120,255,0.5)'; g.fillRect(x + 3, y - 3, 1, 3); }
    // símbolo: dois espinhos atravessados por uma linha vertical
    g.strokeStyle = '#ff3a5a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - 6, h * 0.56); g.lineTo(cx + 6, h * 0.4); g.moveTo(cx + 6, h * 0.56); g.lineTo(cx - 6, h * 0.4); g.moveTo(cx, h * 0.36); g.lineTo(cx, h * 0.6); g.stroke();
    g.fillStyle = '#120e18'; g.fillRect(cx - 24, h * 0.3, 8, h * 0.32); g.fillRect(cx + 16, h * 0.3, 8, h * 0.32);
    // mão erguida
    g.fillRect(cx + 18, h * 0.12, 5, h * 0.2); g.fillStyle = '#2a1a3a'; g.fillRect(cx + 16, h * 0.08, 9, 6);
    g.fillStyle = '#120e18'; g.beginPath(); g.ellipse(cx, h * 0.17, 10, 12, 0, 0, 7); g.fill();
    for (let i = 0; i < 6; i++) body(g, [[cx - 9 + i * 3.5, h * 0.08], [cx - 8 + i * 3.5, h * -0.02 + (i % 2) * 4], [cx - 6 + i * 3.5, h * 0.08]], '#1a1028');
    g.fillStyle = '#ff3a5a'; g.fillRect(cx - 6, h * 0.16, 4, 2); g.fillRect(cx + 2, h * 0.16, 4, 2);
  };
  // Mãos da névoa
  ART.hands = (g, w, h, o) => {
    const r = X.rng(o.seed || 5);
    g.fillStyle = 'rgba(200,215,230,0.18)'; g.fillRect(0, h * 0.75, w, h * 0.25);
    for (let i = 0; i < (o.n || 4); i++) {
      const x = w * (0.15 + i * 0.7 / (o.n || 4)) + r() * 8, top = h * (0.15 + r() * 0.35);
      g.fillStyle = o.c1; g.fillRect(x, top + 14, 7, h - top - 14);
      g.fillStyle = o.c2; g.fillRect(x + 5, top + 14, 2, h - top - 14);
      g.fillStyle = o.c1; g.fillRect(x - 1, top + 8, 9, 8);
      for (let f = 0; f < 4; f++) g.fillRect(x - 1 + f * 2.5, top + (f === 1 || f === 2 ? 0 : 3), 2, 9);
      g.fillRect(x + 8, top + 10, 3, 2);
    }
    g.fillStyle = 'rgba(220,230,240,0.25)'; for (let i = 0; i < 6; i++) g.fillRect(0, h * (0.6 + i * 0.07), w, 3);
  };
  // Guerreiro cristalizado
  ART.crystalman = (g, w, h, o) => {
    const cx = w / 2;
    body(g, [[cx, 0], [cx + w * 0.32, h * 0.25], [cx + w * 0.28, h], [cx - w * 0.28, h], [cx - w * 0.32, h * 0.25]], 'rgba(120,80,200,0.35)');
    g.fillStyle = '#5a5480'; g.fillRect(cx - 8, h * 0.3, 16, h * 0.4); g.fillRect(cx - 7, h * 0.7, 5, h * 0.28); g.fillRect(cx + 2, h * 0.7, 5, h * 0.28);
    g.fillStyle = '#b0a8c8'; g.beginPath(); g.ellipse(cx, h * 0.2, 7, 9, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.fillRect(cx - 4, h * 0.19, 2, 2); g.fillRect(cx + 2, h * 0.19, 2, 2);
    g.fillStyle = '#3a3460'; g.fillRect(cx - 14, h * 0.3, 6, h * 0.3); g.fillRect(cx + 8, h * 0.3, 6, h * 0.3);
    g.fillStyle = '#9a9ab0'; g.fillRect(cx + 12, h * 0.15, 2, h * 0.5);
    g.strokeStyle = 'rgba(220,190,255,0.7)'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - w * 0.25, h * 0.3); g.lineTo(cx - w * 0.1, h * 0.05); g.moveTo(cx + w * 0.2, h * 0.6); g.lineTo(cx + w * 0.3, h * 0.3); g.stroke();
  };
  // A Coisa que Dormia: pedra, sombra e raízes; boca vertical
  ART.colossus = (g, w, h, o) => {
    const cx = w / 2, r = X.rng(21);
    g.strokeStyle = '#1a120e'; g.lineCap = 'round';
    for (let i = 0; i < 14; i++) { g.lineWidth = 2 + r() * 4; g.beginPath(); g.moveTo(cx + (r() - 0.5) * w * 0.5, h * 0.4); g.bezierCurveTo(r() * w, h * 0.7, r() * w, h * 0.9, r() * w, h); g.stroke(); }
    body(g, [[cx - w * 0.3, h * 0.95], [cx - w * 0.38, h * 0.35], [cx - w * 0.2, h * 0.12], [cx + w * 0.2, h * 0.12], [cx + w * 0.38, h * 0.35], [cx + w * 0.3, h * 0.95]], '#2a2420');
    for (let i = 0; i < 30; i++) { g.fillStyle = r() < 0.5 ? '#3a322c' : '#1a1410'; g.fillRect(cx - w * 0.3 + r() * w * 0.6, h * (0.15 + r() * 0.75), 4 + r() * 6, 2 + r() * 4); }
    // braços com dedos de cristal
    g.fillStyle = '#221c18'; g.fillRect(cx - w * 0.48, h * 0.3, w * 0.12, h * 0.4); g.fillRect(cx + w * 0.36, h * 0.3, w * 0.12, h * 0.4);
    for (let f = 0; f < 4; f++) { body(g, [[cx - w * 0.48 + f * 4, h * 0.7], [cx - w * 0.47 + f * 4, h * 0.82], [cx - w * 0.45 + f * 4, h * 0.7]], '#6a3f9c'); body(g, [[cx + w * 0.36 + f * 4, h * 0.7], [cx + w * 0.37 + f * 4, h * 0.82], [cx + w * 0.39 + f * 4, h * 0.7]], '#6a3f9c'); }
    // cabeça sem rosto: abertura vertical
    g.fillStyle = '#1a1410'; g.beginPath(); g.ellipse(cx, h * 0.16, w * 0.14, h * 0.12, 0, 0, 7); g.fill();
    g.fillStyle = '#000'; g.beginPath(); g.ellipse(cx, h * 0.17, 3, h * 0.09, 0, 0, 7); g.fill();
    glowDot(g, cx, h * 0.17, 8, 'rgba(255,40,60,0.6)');
    g.fillStyle = 'rgba(0,0,0,0.5)'; for (let i = 0; i < 5; i++) { g.fillRect(cx - w * 0.3 + i * w * 0.15, h * 0.05, 3, h * 0.1); }
  };
  // Fragmento errante
  ART.shards = (g, w, h, o) => {
    const r = X.rng(o.seed || 31);
    for (let i = 0; i < 7; i++) { const x = w * (0.2 + r() * 0.6), y = h * (0.15 + r() * 0.6), s = 6 + r() * 12; body(g, [[x, y - s], [x + s * 0.4, y], [x, y + s * 0.7], [x - s * 0.4, y]], i % 2 ? o.c1 : o.c2); g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(x, y - s + 2, 1, s * 0.6); }
    glowDot(g, w / 2, h * 0.45, 14, o.core);
    g.fillStyle = '#fff'; g.fillRect(w / 2 - 1, h * 0.45 - 1, 2, 2);
  };
  // Primeira Consciência: sombra líquida com espinhos, forma de mulher
  ART.mother = (g, w, h, o) => {
    const cx = w / 2, r = X.rng(77);
    // raízes ao redor
    g.strokeStyle = o.golden ? '#8a6a20' : '#0a0408'; g.lineCap = 'round';
    for (let i = 0; i < 16; i++) { g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(cx, h * 0.5); g.bezierCurveTo(r() * w, r() * h, r() * w, h * (0.5 + r() * 0.5), r() * w, h); g.stroke(); }
    // corpo líquido
    body(g, [[cx - w * 0.12, h * 0.25], [cx - w * 0.28, h * 0.98], [cx + w * 0.28, h * 0.98], [cx + w * 0.12, h * 0.25]], o.golden ? '#3a2a10' : '#08050a');
    for (let i = 0; i < 12; i++) { g.fillStyle = o.golden ? 'rgba(255,220,120,0.2)' : 'rgba(80,20,60,0.35)'; g.beginPath(); g.ellipse(cx + (r() - 0.5) * w * 0.4, h * (0.4 + r() * 0.55), 3, 8, 0, 0, 7); g.fill(); }
    // braços abertos
    g.strokeStyle = o.golden ? '#3a2a10' : '#08050a'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(cx - w * 0.1, h * 0.3); g.quadraticCurveTo(cx - w * 0.3, h * 0.3, cx - w * 0.42, h * 0.15); g.moveTo(cx + w * 0.1, h * 0.3); g.quadraticCurveTo(cx + w * 0.3, h * 0.3, cx + w * 0.42, h * 0.15); g.stroke();
    // espinhos
    g.fillStyle = o.golden ? '#ffe08a' : '#000';
    for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + i * 0.1); body(g, [[cx + Math.cos(a) * 8 - 2, h * 0.15 + Math.sin(a) * 8], [cx + Math.cos(a) * 22, h * 0.15 + Math.sin(a) * 22], [cx + Math.cos(a) * 8 + 2, h * 0.15 + Math.sin(a) * 8]], g.fillStyle); }
    // cabeça
    g.fillStyle = o.golden ? '#f0d8c0' : '#140a18'; g.beginPath(); g.ellipse(cx, h * 0.15, 8, 10, 0, 0, 7); g.fill();
    g.fillStyle = o.golden ? '#c8b8e0' : '#0a060c'; g.beginPath(); g.ellipse(cx, h * 0.1, 9, 6, 0, Math.PI, 0); g.fill(); g.fillRect(cx - 9, h * 0.1, 3, h * 0.2); g.fillRect(cx + 6, h * 0.1, 3, h * 0.2);
    g.fillStyle = o.golden ? '#ffe0a0' : '#fff'; g.fillRect(cx - 4, h * 0.15, 2, 2); g.fillRect(cx + 2, h * 0.15, 2, 2);
    glowDot(g, cx, h * 0.45, 10, o.golden ? 'rgba(255,240,180,0.8)' : 'rgba(180,20,60,0.6)');
  };
  // Enxame (várias larvas pequenas)
  ART.swarm = (g, w, h, o) => {
    const r = X.rng(2);
    for (let i = 0; i < 9; i++) { const x = w * (0.1 + r() * 0.8), y = h * (0.45 + r() * 0.45), s = 4 + r() * 5; g.fillStyle = o.c1; g.beginPath(); g.ellipse(x, y, s * 1.4, s, 0, 0, 7); g.fill(); glowDot(g, x, y, s, o.core); g.fillStyle = o.eye; g.fillRect(x - s, y - 2, 1, 1); }
    // larva-mãe ao centro
    ART.larva(g, w, h * 0.9, { ...o, long: true, seed: 9 });
  };

  X.enemyImg = function (e) {
    const key = e.id;
    if (cache[key]) return cache[key];
    // arte pronta do autor (pixel art), usada como está, com contorno de 1 px
    if (e.o && e.o.img && X.imgs[e.o.img]) {
      const im = X.imgs[e.o.img]; const [c, g] = X.canvas(im.width + 2, im.height + 2); g.drawImage(im, 1, 1);
      return (cache[key] = c);
    }
    const [c, g] = X.canvas(e.w, e.h);
    ART[e.art](g, e.w, e.h, e.o || {});
    return (cache[key] = X.pixelize(c, { step: e.o && e.o.step || 18 }));
  };
})();
