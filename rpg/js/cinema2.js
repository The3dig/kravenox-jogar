'use strict';
// Cenários das cenas da Parte 2 (caps. 14–25).
(function () {
  const C = G.Cine, X = G.gfx, BGS = C.BGS, cache = C.cache;
  const W = G.W, H = G.H;
  function once(key, paint) { if (!cache[key]) { const [c, g] = X.canvas(W, H); paint(g, X.rng(key.length * 77)); cache[key] = X.dither(c, 16); } return cache[key]; }
  function grad(g, stops) { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function city(g, r, base, col, hz) {
    for (let i = 0; i < 16; i++) { const x = i * 21 + r() * 10 - 5, hh = 14 + r() * 30; g.fillStyle = col; g.fillRect(x, hz - hh, 18 + r() * 6, hh);
      for (let k = 0; k < 3; k++) g.fillRect(x + r() * 16, hz - hh - 3 - r() * 5, 2, 6); }
    g.fillStyle = col; g.fillRect(150, hz - 70, 20, 70); g.beginPath(); g.moveTo(148, hz - 70); g.lineTo(160, hz - 90); g.lineTo(172, hz - 70); g.fill();   // torre central
    g.fillStyle = base; g.fillRect(0, hz, W, H - hz);
  }
  function fires(ctx, t, pts) {
    for (const [x, y, s] of pts) { const f = Math.sin(t / 3 + x) * 1.5;
      ctx.fillStyle = '#ff6a1a'; ctx.beginPath(); ctx.moveTo(x - 3 * s, y); ctx.lineTo(x + f, y - 9 * s - Math.abs(f)); ctx.lineTo(x + 3 * s, y); ctx.fill();
      ctx.fillStyle = '#ffd060'; ctx.beginPath(); ctx.moveTo(x - 1.5 * s, y); ctx.lineTo(x + f * 0.5, y - 4 * s); ctx.lineTo(x + 1.5 * s, y); ctx.fill();
      X.glow(ctx, x, y - 4, 14 * s, 'rgba(255,120,40,0.35)', 0.8); }
  }
  // Valdora vista da colina: cidade em chamas e o símbolo de três espinhos desenhado com sangue
  BGS.valdoraColina = function (ctx, t) {
    ctx.drawImage(once('valdoraColina', (g, r) => {
      grad(g, ['#120404', '#4a1208', '#8a3010', '#2a1210']);
      g.fillStyle = 'rgba(0,0,0,0.35)'; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(r() * W, 30 + r() * 60, 40 + r() * 40, 8, 0, 0, 7); g.fill(); }
      city(g, r, '#1a1010', '#0e0808', 150);
      g.strokeStyle = '#8a0a10'; g.lineWidth = 3; g.lineCap = 'round';
      for (const a of [-0.5, 0, 0.5]) { g.beginPath(); g.moveTo(160, 182); g.lineTo(160 + Math.sin(a) * 40, 182 - Math.cos(a) * 26); g.stroke(); }
      g.fillStyle = '#2a1a1a'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 200); g.quadraticCurveTo(160, 186, W, 204); g.lineTo(W, H); g.fill();
    }), 0, 0, W, H);
    fires(ctx, t, [[40, 140, 1], [96, 132, 0.8], [210, 138, 1.1], [268, 128, 0.9], [130, 146, 0.7]]);
    for (let i = 0; i < 26; i++) { const x = (i * 53 + t * 0.4) % W, y = (H - ((i * 37 + t * 0.6) % H)); ctx.fillStyle = i % 3 ? 'rgba(255,120,50,0.7)' : 'rgba(180,170,170,0.5)'; ctx.fillRect(x, y, 1, 1); }
  };
  // a sala do pai: uma plataforma no centro de uma sala gigantesca
  BGS.camaraPai = function (ctx, t) {
    ctx.drawImage(once('camaraPai', (g, r) => {
      grad(g, ['#0a0604', '#1e140a', '#2a1c10', '#0a0604']);
      g.fillStyle = '#140c06'; for (let i = 0; i < 6; i++) { const x = 10 + i * 58; g.fillRect(x, 20, 16, 170); g.fillStyle = '#20140a'; g.fillRect(x, 20, 4, 170); g.fillStyle = '#140c06'; }
      g.fillStyle = 'rgba(255,190,90,0.18)'; for (let i = 0; i < 60; i++) g.fillRect(r() * W, 20 + r() * 150, 2, 1);
      g.fillStyle = '#3a2a18'; g.beginPath(); g.ellipse(160, 176, 70, 14, 0, 0, 7); g.fill(); g.fillStyle = '#2a1e10'; g.fillRect(90, 176, 140, 12); g.fillStyle = '#4a3820'; g.beginPath(); g.ellipse(160, 174, 66, 11, 0, 0, 7); g.fill();
    }), 0, 0, W, H);
    X.glow(ctx, 160, 120, 90, 'rgba(255,200,110,0.2)', 0.6 + 0.15 * Math.sin(t / 30));
  };
  // o teto explode: no céu, um olho imenso e dourado
  BGS.olhoCeu = function (ctx, t) {
    ctx.drawImage(once('olhoCeu', (g, r) => {
      grad(g, ['#1a0606', '#5a1a0a', '#2a0e08', '#0a0404']);
      g.fillStyle = '#0a0606'; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, 40); for (let x = W; x >= 0; x -= 12) g.lineTo(x, 30 + r() * 30); g.closePath(); g.fill();
      g.fillStyle = '#0a0606'; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 14) g.lineTo(x, 170 + r() * 26); g.lineTo(W, H); g.fill();
    }), 0, 0, W, H);
    const open = C.eyeOpen == null ? 1 : C.eyeOpen, cx = 160, cy = 96;
    X.glow(ctx, cx, cy, 120, 'rgba(255,190,60,0.35)', 0.5 + 0.2 * Math.sin(t / 20) * open);
    ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, 92, 40 * open + 0.5, 0, 0, 7); ctx.clip();
    ctx.fillStyle = '#f0e2b0'; ctx.fillRect(cx - 92, cy - 40, 184, 80);
    ctx.fillStyle = '#e09a20'; ctx.beginPath(); ctx.arc(cx + Math.sin(t / 70) * 6, cy, 30, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffd860'; ctx.beginPath(); ctx.arc(cx + Math.sin(t / 70) * 6, cy, 20, 0, 7); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(cx + Math.sin(t / 70) * 6, cy, 5, 26, 0, 0, 7); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#2a0a04'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy, 92, 40 * open + 0.5, 0, 0, 7); ctx.stroke();
  };
  // a chuva de cristais negros e a cúpula prateada sobre Valdora
  BGS.cupula = function (ctx, t) {
    ctx.drawImage(once('cupula', (g, r) => { grad(g, ['#04020a', '#1a0a20', '#3a1018', '#140808']); city(g, r, '#140c0e', '#0a0608', 160); }), 0, 0, W, H);
    fires(ctx, t, [[60, 160, 0.8], [230, 160, 1], [290, 160, 0.7]]);
    const k = C.dome || 0;
    for (let i = 0; i < 70; i++) {
      const x = (i * 97) % W, y = ((i * 41 + t * (2 + i % 3)) % (H + 40)) - 20;
      const R = 150 * k, d = Math.hypot(x - 160, (y - 170) * 1.3);
      if (k > 0 && d > R - 4 && d < R + 4) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 1, 3, 3); continue; }
      if (k > 0 && d < R) continue;
      ctx.fillStyle = '#1a0a2a'; ctx.fillRect(x, y, 2, 5); ctx.fillStyle = '#b26bff'; ctx.fillRect(x, y + 4, 1, 1);
    }
    if (k > 0) {
      ctx.globalCompositeOperation = 'lighter';
      for (const [lw, al] of [[6, 0.12], [2, 0.5], [1, 0.9]]) { ctx.strokeStyle = C.domeColor || '#dfe8ff'; ctx.globalAlpha = al * Math.min(1, k * 2); ctx.lineWidth = lw; ctx.beginPath(); ctx.ellipse(160, 170, 150 * k, 115 * k, 0, Math.PI, 0); ctx.stroke(); }
      ctx.globalAlpha = 0.08 * Math.min(1, k * 2); ctx.fillStyle = C.domeColor || '#dfe8ff'; ctx.beginPath(); ctx.ellipse(160, 170, 150 * k, 115 * k, 0, Math.PI, 0); ctx.fill();
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
  };
  // a câmara do coração do Primeiro
  BGS.coracao = function (ctx, t) {
    ctx.drawImage(once('coracao', (g, r) => {
      grad(g, ['#000000', '#0a0410', '#120818', '#000000']);
      g.strokeStyle = '#140a10'; for (let i = 0; i < 22; i++) { g.lineWidth = 1 + r() * 4; g.beginPath(); g.moveTo(160, 100); g.bezierCurveTo(r() * W, r() * H, r() * W, r() * H, r() < 0.5 ? 0 : W, r() * H); g.stroke(); }
    }), 0, 0, W, H);
    const beat = Math.pow(Math.max(0, Math.sin(t / 22)), 12);
    X.glow(ctx, 160, 100, 120, 'rgba(200,30,60,0.4)', 0.3 + 0.5 * beat);
  };
  // a imensidão branca onde Kravenox encontra a si mesmo
  BGS.branco = function (ctx, t) {
    ctx.fillStyle = '#f4f2ee'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 30; i++) { ctx.fillStyle = 'rgba(200,196,190,0.25)'; ctx.fillRect((i * 67 + t * 0.2) % W, (i * 31) % H, 1, 1); }
  };
  // a esfera negra sobre Valdora, vista da torre
  BGS.esfera = function (ctx, t) {
    ctx.drawImage(once('esfera', (g, r) => {
      grad(g, ['#000000', '#1a0408', '#5a1408', '#1a0a08']); city(g, r, '#120a0a', '#0a0606', 190);
      g.fillStyle = '#1e1a20'; g.beginPath(); g.ellipse(160, 236, 120, 26, 0, 0, 7); g.fill(); g.fillStyle = '#2a2630'; g.beginPath(); g.ellipse(160, 232, 112, 20, 0, 0, 7); g.fill();
    }), 0, 0, W, H);
    fires(ctx, t, [[30, 190, 1], [90, 186, 0.8], [250, 190, 1], [300, 186, 0.8]]);
    const R = C.sphereR == null ? 34 : C.sphereR;
    if (R > 0) {
      X.glow(ctx, 160, 64, R * 2.4, 'rgba(120,20,160,0.5)', 0.6 + 0.2 * Math.sin(t / 8));
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(160 + (C.sphereShake ? (Math.random() - 0.5) * C.sphereShake : 0), 64, R, 0, 7); ctx.fill();
      ctx.strokeStyle = '#6a2a9a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(160, 64, R, 0, 7); ctx.stroke();
      if (C.sphereCrack) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 6 * C.sphereCrack; i++) { const a = i * 1.1; ctx.moveTo(160, 64); ctx.lineTo(160 + Math.cos(a) * R, 64 + Math.sin(a) * R); } ctx.stroke(); }
    }
  };
  // o salão do trono na Fortaleza dos Guardiões; centenas de olhos brancos se abrem
  BGS.trono = function (ctx, t) {
    ctx.drawImage(once('trono', (g, r) => {
      grad(g, ['#020308', '#080c18', '#0e1424', '#020308']);
      g.fillStyle = '#0a0e1a'; for (let i = 0; i < 7; i++) g.fillRect(8 + i * 48, 10, 14, 200);
      g.fillStyle = '#141a2a'; g.fillRect(120, 150, 80, 8); g.fillRect(130, 142, 60, 8); g.fillRect(140, 134, 40, 8);
      g.fillStyle = '#0c101c'; g.fillRect(146, 70, 28, 66); g.beginPath(); g.moveTo(146, 70); g.lineTo(160, 46); g.lineTo(174, 70); g.fill();
    }), 0, 0, W, H);
    for (let i = 0; i < 6; i++) X.glow(ctx, 14 + i * 58, 40, 16, 'rgba(110,180,255,0.4)', 0.6 + 0.3 * Math.sin(t / 15 + i));
    const n = C.eyes || 0;
    for (let i = 0; i < n; i++) { const x = (i * 73) % W, y = 20 + (i * 47) % 150; if (Math.abs(x - 160) < 40 && y > 40) continue; const bl = ((t + i * 37) % 200) < 6;
      if (!bl) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, 2, 1); ctx.fillRect(x + 5, y, 2, 1); } }
  };
  // a árvore de cristal branco onde a mãe está presa
  BGS.arvoreBranca = function (ctx, t) {
    ctx.drawImage(once('arvoreBranca', (g, r) => {
      grad(g, ['#000000', '#0a0a0e', '#14141a', '#050505']);
      g.strokeStyle = '#c8ccd8'; g.lineCap = 'round';
      for (let i = 0; i < 18; i++) { g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(160, 40); g.quadraticCurveTo(160 + (r() - 0.5) * 200, 20 - r() * 20, r() * W, r() * 30); g.stroke(); }
      for (let i = 0; i < 16; i++) { g.lineWidth = 1 + r() * 4; g.beginPath(); g.moveTo(160, 190); g.bezierCurveTo(160 + (r() - 0.5) * 200, 200, r() * W, 220, r() * W, H); g.stroke(); }
      g.fillStyle = '#d8dce8'; g.beginPath(); g.moveTo(126, 196); g.lineTo(138, 36); g.lineTo(182, 36); g.lineTo(194, 196); g.fill();
      g.fillStyle = '#eef0f8'; g.beginPath(); g.moveTo(140, 190); g.lineTo(148, 44); g.lineTo(156, 44); g.lineTo(152, 190); g.fill();
      g.fillStyle = 'rgba(160,170,200,0.5)'; g.beginPath(); g.ellipse(160, 118, 24, 46, 0, 0, 7); g.fill();
    }), 0, 0, W, H);
    X.glow(ctx, 160, 110, 100, 'rgba(230,236,255,0.25)', 0.5 + 0.2 * Math.sin(t / 35));
  };
  // a Fonte: árvore de luz com milhares de pequenas vidas flutuando
  BGS.fonteViva = function (ctx, t) {
    ctx.drawImage(once('fonteViva', (g, r) => {
      grad(g, ['#04060a', '#0e1220', '#1a1a20', '#06060a']);
      g.strokeStyle = '#3a3420'; g.lineCap = 'round';
      for (let i = 0; i < 20; i++) { g.lineWidth = 2 + r() * 5; g.beginPath(); g.moveTo(160, 170); g.bezierCurveTo(160 + (r() - 0.5) * 260, 180, r() * W, 210, r() * W, H); g.stroke(); }
      g.fillStyle = '#fff4c8'; g.beginPath(); g.moveTo(140, 180); g.lineTo(150, 20); g.lineTo(170, 20); g.lineTo(180, 180); g.fill();
      g.strokeStyle = '#ffeaa0'; for (let i = 0; i < 14; i++) { g.lineWidth = 1 + r() * 3; const y = 20 + r() * 70; g.beginPath(); g.moveTo(160, y + 20); g.quadraticCurveTo(160 + (r() - 0.5) * 120, y, 160 + (r() - 0.5) * 300, y - 20 - r() * 20); g.stroke(); }
    }), 0, 0, W, H);
    const dim = C.dim || 0;
    X.glow(ctx, 160, 90, 140, 'rgba(255,236,170,0.45)', (0.6 + 0.2 * Math.sin(t / 25)) * (1 - dim * 0.7));
    for (let i = 0; i < 90; i++) { const x = (i * 53 + Math.sin(t / 50 + i) * 8) % W, y = (i * 29 + Math.cos(t / 40 + i) * 6) % 190; const off = dim > 0 && (i % 10) < dim * 10;
      ctx.fillStyle = off ? 'rgba(40,40,50,0.6)' : 'rgba(255,240,190,0.9)'; ctx.fillRect(x, y, 1, 1); if (!off && i % 4 === 0) X.glow(ctx, x, y, 4, 'rgba(255,240,190,0.3)', 0.8); }
    if (dim > 0) { ctx.fillStyle = `rgba(0,0,0,${dim * 0.35})`; ctx.fillRect(0, 0, W, H); }
  };
  // dentro da Essência: milhares de mundos, de vidas, de possibilidades
  BGS.essencia = function (ctx, t) {
    ctx.fillStyle = '#05040a'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 140; i++) { const a = i * 2.39996, d = ((i * 7 + t * 0.6) % 220); const x = 160 + Math.cos(a) * d, y = 110 + Math.sin(a) * d * 0.7;
      ctx.fillStyle = i % 5 === 0 ? '#ffe08a' : i % 3 === 0 ? '#b26bff' : '#dfe8ff'; ctx.globalAlpha = Math.min(1, d / 60); ctx.fillRect(x, y, d > 120 ? 2 : 1, d > 120 ? 2 : 1); }
    ctx.globalAlpha = 1; X.glow(ctx, 160, 110, 60, 'rgba(255,255,255,0.4)', 0.6 + 0.2 * Math.sin(t / 20));
  };
  // o céu do Reino fica azul pela primeira vez em séculos
  BGS.ceuAzul = function (ctx, t) {
    const k = C.blue == null ? 1 : C.blue;
    const hills = (g, r) => {
      g.fillStyle = '#141018'; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 16) g.lineTo(x, 150 + r() * 30); g.lineTo(W, H); g.fill();
      g.fillStyle = '#0a080c'; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 10) g.lineTo(x, 180 + r() * 20); g.lineTo(W, H); g.fill();
    };
    ctx.drawImage(once('ceuVermelho', (g, r) => { grad(g, ['#2a0606', '#6a1a10', '#3a1a1a', '#141014']); hills(g, X.rng(5)); }), 0, 0, W, H);
    ctx.globalAlpha = k; ctx.drawImage(once('ceuAzul', (g, r) => { grad(g, ['#0a1a3a', '#2a5a9a', '#9ab8d8', '#2a2a30']); hills(g, X.rng(5)); }), 0, 0, W, H); ctx.globalAlpha = 1;
    X.glow(ctx, 250, 60, 50, 'rgba(255,250,220,0.5)', k * (0.7 + 0.1 * Math.sin(t / 30)));
  };
})();
