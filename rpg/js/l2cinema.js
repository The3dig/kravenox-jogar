'use strict';
// Cenários das cenas do Livro II.
(function () {
  const C = G.Cine, X = G.gfx, BGS = C.BGS, cache = C.cache;
  const W = G.W, H = G.H;
  // valores próprios das cenas do Livro II começam do zero em cada cena
  const KEYS = ['green', 'freed', 'head', 'grow', 'fall', 'bridge', 'k', 'sprout', 'lights'];
  const begin0 = C.begin;
  C.begin = function (bg, music) { for (const k of KEYS) C[k] = 0; return begin0(bg, music); };

  function once(key, paint) { if (!cache[key]) { const [c, g] = X.canvas(W, H); paint(g, X.rng(key.length * 977 + key.charCodeAt(0))); cache[key] = X.dither(c, 16); } return cache[key]; }
  function grad(g, stops) { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function stars(g, r, n, col, hmax = 0.6) { g.fillStyle = col || 'rgba(230,235,255,0.8)'; for (let i = 0; i < n; i++) g.fillRect(r() * W, r() * H * hmax, r() < 0.15 ? 2 : 1, 1); }
  function hills(g, r, y0, col, amp = 26) { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 14) g.lineTo(x, y0 + r() * amp); g.lineTo(W, H); g.fill(); }
  function moons(g, list) { for (const [x, y, rr, c] of list) { g.fillStyle = 'rgba(230,220,255,0.14)'; g.beginPath(); g.arc(x, y, rr * 2.2, 0, 7); g.fill(); g.fillStyle = c || '#efe8ff'; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); } }
  function towers(g, r, n, y0, col, win) { for (let i = 0; i < n; i++) { const x = r() * W, w0 = 8 + r() * 14, hh = 40 + r() * 90; g.fillStyle = col; g.fillRect(x, y0 - hh, w0, hh); g.beginPath(); g.moveTo(x - 2, y0 - hh); g.lineTo(x + w0 / 2, y0 - hh - 10 - r() * 14); g.lineTo(x + w0 + 2, y0 - hh); g.fill(); if (win) { g.fillStyle = win; for (let k = 0; k < 4; k++) g.fillRect(x + 2 + r() * (w0 - 4), y0 - hh + 8 + r() * (hh - 16), 1, 2); } } }
  function tree(g, r, cx, base, top, col, n = 12, spread = 160) { g.strokeStyle = col; g.lineCap = 'round'; g.lineWidth = 10; g.beginPath(); g.moveTo(cx, base); g.lineTo(cx, top + 30); g.stroke();
    for (let i = 0; i < n; i++) { g.lineWidth = 2 + r() * 4; g.beginPath(); g.moveTo(cx, top + 40 + r() * 30); g.quadraticCurveTo(cx + (r() - 0.5) * spread * 0.6, top + 10, cx + (r() - 0.5) * spread, top - 10 + r() * 40); g.stroke(); } }
  const draw = (ctx, key, paint) => ctx.drawImage(once(key, paint), 0, 0, W, H);
  const crowd = (ctx, y, n, col, t, seed = 1) => { for (let i = 0; i < n; i++) { const x = (i * 37 + seed * 13) % W, h0 = 7 + (i % 3) * 2, b = Math.sin(t / 20 + i) * 0.5; ctx.fillStyle = col; ctx.fillRect(x, y - h0 + b, 4, h0); ctx.fillRect(x + 1, y - h0 - 3 + b, 2, 3); } };

  // os portões da cidade em construção, a multidão, o céu violeta
  BGS.portoesEscolha = function (ctx, t) {
    draw(ctx, 'portoesEscolha', (g, r) => { grad(g, ['#1a1440', '#3a3a8a', '#7a6ab0', '#2a2440']); moons(g, [[60, 40, 12], [262, 30, 8]]);
      g.fillStyle = '#2a2638'; g.fillRect(0, 96, W, 80); g.fillStyle = '#3a3648'; for (let x = 0; x < W; x += 16) g.fillRect(x, 92, 12, 6);
      g.fillStyle = '#100c18'; g.fillRect(130, 110, 60, 66); g.beginPath(); g.arc(160, 110, 30, Math.PI, 0); g.fill();
      g.fillStyle = '#8a7a5a'; for (let i = 0; i < 6; i++) g.fillRect(20 + i * 52, 70, 2, 30);
      g.fillStyle = '#1e1a26'; g.fillRect(0, 176, W, 64); });
    crowd(ctx, 200, 40, '#0c0a12', t);
    X.glow(ctx, 160, 140, 40, 'rgba(255,220,140,0.25)', 0.5 + 0.2 * Math.sin(t / 30));
  };
  // a sala circular com a quinta marca
  BGS.salaErya = function (ctx, t) {
    draw(ctx, 'salaErya', (g, r) => { grad(g, ['#05060a', '#14161c', '#1a1c22', '#05060a']);
      g.strokeStyle = '#2a2c34'; g.lineWidth = 2; g.beginPath(); g.ellipse(160, 190, 140, 34, 0, 0, 7); g.stroke();
      g.fillStyle = '#3a3c44'; for (let i = 0; i < 40; i++) g.fillRect(r() * W, r() * 150, 3, 1); });
    for (let i = 0; i < 5; i++) { const x = 70 + i * 45, c = ['#ffe08a', '#100c10', '#c8d8ff', '#6a5a8a', '#8affb0'][i]; ctx.fillStyle = c; ctx.fillRect(x - 3, 60, 6, 6); }
    X.glow(ctx, 250, 63, 12, 'rgba(140,255,170,0.7)', 0.5 + 0.4 * Math.sin(t / 15));
  };
  // o sol negro entre as duas luas
  BGS.solNegro = function (ctx, t) {
    draw(ctx, 'solNegro', (g, r) => { grad(g, ['#0a0612', '#2a1a3a', '#4a3a5a', '#120c18']); moons(g, [[80, 50, 12], [240, 50, 12]]); hills(g, r, 180, '#0e0c14'); });
    X.glow(ctx, 160, 50, 40, 'rgba(160,80,255,0.35)', 0.6 + 0.3 * Math.sin(t / 25));
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(160, 50, 14, 0, 7); ctx.fill(); ctx.strokeStyle = '#a07aff'; ctx.lineWidth = 1; ctx.stroke();
  };
  // centenas de portais no céu, exércitos descendo
  BGS.portaisCeu = function (ctx, t) {
    draw(ctx, 'portaisCeu', (g, r) => { grad(g, ['#080410', '#2a103a', '#4a2a4a', '#100810']); hills(g, r, 170, '#100c14');
      g.fillStyle = '#1a1622'; g.fillRect(0, 180, W, 60); g.fillStyle = '#2a2632'; for (let x = 0; x < W; x += 16) g.fillRect(x, 176, 12, 6); });
    for (let i = 0; i < 18; i++) { const x = (i * 71) % W + 10, y = 20 + (i * 37) % 90, s = 0.6 + ((t / 90 + i * 0.3) % 1) * 0.4; ctx.strokeStyle = 'rgba(255,90,60,0.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, 8 * s, 12 * s, 0, 0, 7); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.beginPath(); ctx.ellipse(x, y, 6 * s, 10 * s, 0, 0, 7); ctx.fill();
      for (let k = 0; k < 3; k++) { const p = ((t * 0.5 + k * 30 + i * 11) % 90) / 90; ctx.fillStyle = '#1a0a10'; ctx.fillRect(x - 1, y + p * 60, 2, 3); } }
  };
  // a Rainha da Memória no campo de batalha
  BGS.rainhaMemoria = function (ctx, t) {
    draw(ctx, 'rainhaMemoria', (g, r) => { grad(g, ['#0a0a14', '#2a2a40', '#4a4a5a', '#141420']); hills(g, r, 178, '#121218');
      for (let i = 0; i < 30; i++) { g.fillStyle = '#1a1820'; g.fillRect(r() * W, 190 + r() * 40, 3, 6); } });
    for (let i = 0; i < 40; i++) { const p = ((t * 0.4 + i * 17) % 120) / 120; ctx.fillStyle = `rgba(230,230,255,${0.7 * (1 - p)})`; ctx.fillRect((i * 41) % W, 200 - p * 160, 1, 1); }
  };
  // a fissura que leva ao Primeiro Mundo
  BGS.fissuraMundo = function (ctx, t) {
    draw(ctx, 'fissuraMundo', (g, r) => { grad(g, ['#0c0814', '#24183a', '#30243a', '#0c0810']); hills(g, r, 186, '#0a0810'); });
    ctx.save(); ctx.beginPath(); ctx.moveTo(150, 40); ctx.lineTo(176, 70); ctx.lineTo(166, 120); ctx.lineTo(182, 190); ctx.lineTo(138, 190); ctx.lineTo(152, 120); ctx.lineTo(140, 70); ctx.closePath(); ctx.clip();
    ctx.fillStyle = '#c8c8d4'; ctx.fillRect(130, 40, 60, 160); ctx.fillStyle = '#6a6a7a'; for (let i = 0; i < 8; i++) ctx.fillRect(134 + i * 7, 90 + (i % 3) * 14, 5, 100); ctx.fillStyle = '#ffd860'; ctx.fillRect(156, 150, 8, 10); ctx.restore();
    X.glow(ctx, 160, 120, 50, 'rgba(200,180,255,0.3)', 0.6 + 0.2 * Math.sin(t / 20));
  };
  // o salão do trono do Primeiro Rei
  BGS.salaoTrono = function (ctx, t) {
    draw(ctx, 'salaoTrono', (g, r) => { grad(g, ['#140e04', '#3a2a10', '#4a3a1a', '#140e04']);
      g.fillStyle = '#2a2010'; for (let i = 0; i < 6; i++) g.fillRect(14 + i * 56, 10, 14, 180);
      g.fillStyle = '#6a5420'; g.fillRect(140, 100, 40, 70); g.beginPath(); g.moveTo(140, 100); g.lineTo(160, 70); g.lineTo(180, 100); g.fill();
      g.fillStyle = '#c8a040'; g.fillRect(150, 118, 20, 26); g.fillStyle = '#e0e0e0'; g.fillRect(159, 104, 2, 46);
      g.fillStyle = '#3a2c12'; g.fillRect(0, 190, W, 50); });
    for (let i = 0; i < 4; i++) X.glow(ctx, 154 + (i % 2) * 12, 124 + (i >> 1) * 4, 3, 'rgba(0,0,0,0.9)', 1);
  };
  // o Primeiro Mundo virando floresta
  BGS.mundoFloresta = function (ctx, t) {
    draw(ctx, 'mundoFloresta', (g, r) => { grad(g, ['#1a2a3a', '#4a6a7a', '#8aa8a0', '#2a3a30']); towers(g, r, 9, 190, '#5a6a6a');
      for (let i = 0; i < 14; i++) tree(g, r, r() * W, 200, 120 + r() * 40, '#1a2a1a', 6, 50);
      g.fillStyle = '#1a2a1a'; g.fillRect(0, 196, W, 44); });
    for (let i = 0; i < 30; i++) { const p = ((t * 0.3 + i * 23) % 140) / 140; ctx.fillStyle = `rgba(255,255,230,${0.8 * (1 - p)})`; ctx.fillRect((i * 53) % W, 190 - p * 170, 1, 1); }
  };
  // a cidade que construiu a si mesma
  BGS.cidadeAster = function (ctx, t) {
    draw(ctx, 'cidadeAster', (g, r) => { grad(g, ['#06040e', '#1a1030', '#2a1a4a', '#08060e']); stars(g, r, 50, 'rgba(200,180,255,0.7)');
      towers(g, r, 14, 200, '#0c0a14', '#c8b8ff'); g.fillStyle = '#100c18'; g.fillRect(0, 196, W, 44); });
    for (let i = 0; i < 6; i++) { const x = 40 + i * 50, p = ((t * 0.4 + i * 30) % 100) / 100; ctx.fillStyle = 'rgba(150,140,255,0.5)'; ctx.fillRect(x, 196 - p * 150, 2, 14); }
  };
  // a sala do mapa: centenas de esferas
  BGS.salaMapa = function (ctx, t) {
    draw(ctx, 'salaMapa', (g, r) => { grad(g, ['#04030a', '#100c1a', '#181424', '#04030a']); g.fillStyle = '#1a1626'; g.fillRect(60, 170, 200, 10); });
    for (let i = 0; i < 40; i++) { const x = 40 + (i * 53) % 240, y = 30 + (i * 31) % 120 + Math.sin(t / 30 + i) * 2, on = i % 3 !== 0; ctx.fillStyle = on ? '#a8a0d8' : '#2a2838'; ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, 7); ctx.fill(); }
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(160, 100, 8, 0, 7); ctx.fill(); ctx.strokeStyle = '#6a5a8a'; ctx.stroke();
    if (C.green) { X.glow(ctx, 160, 140, 24, 'rgba(100,255,150,0.6)', 0.8); ctx.fillStyle = '#4aff8a'; ctx.beginPath(); ctx.arc(160, 140, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#2a8a4a'; ctx.fillRect(155, 137, 6, 3); }
  };
  // a mão estendida ao Devorador: os mundos saem dele e sobem
  BGS.devoradorMao = function (ctx, t) {
    draw(ctx, 'devoradorMao', (g, r) => { grad(g, ['#0a0614', '#2a1830', '#3a2440', '#0a0610']); towers(g, r, 8, 210, '#0a0812');
      g.fillStyle = '#1a1420'; g.beginPath(); g.ellipse(160, 120, 90, 60, 0, 0, 7); g.fill(); g.fillStyle = '#2a3a1a'; g.fillRect(100, 80, 40, 14); g.fillStyle = '#3a2a1a'; g.fillRect(170, 70, 50, 20); });
    const f = C.freed || 0;
    for (let i = 0; i < 60; i++) { const p = Math.min(1, f * 1.4 - (i % 10) * 0.04); if (p <= 0) continue; const x = 100 + (i * 37) % 120, y = 140 - p * 150 - (i % 7) * 4; ctx.fillStyle = 'rgba(200,255,220,0.9)'; ctx.fillRect(x, y, 2, 2); X.glow(ctx, x, y, 4, 'rgba(180,255,210,0.4)', 0.8); }
    if (f > 0.5) { ctx.fillStyle = 'rgba(10,6,16,' + (f - 0.5) * 1.6 + ')'; ctx.fillRect(60, 60, 200, 120); }
  };
  // a casa quente dentro da mente de Kravenox
  BGS.casaMae = function (ctx, t) {
    draw(ctx, 'casaMae', (g, r) => { grad(g, ['#1a0e08', '#3a2414', '#2a1a10', '#100804']);
      g.fillStyle = '#4a3020'; g.fillRect(0, 170, W, 70); g.fillStyle = '#2a1a10'; for (let y = 170; y < H; y += 8) g.fillRect(0, y, W, 1);
      g.fillStyle = '#3a2a20'; g.fillRect(30, 90, 60, 80); g.fillStyle = '#100804'; g.fillRect(40, 120, 40, 50);
      g.fillStyle = '#5a3a24'; g.fillRect(200, 140, 90, 8); g.fillRect(208, 148, 6, 22); g.fillRect(276, 148, 6, 22); });
    X.glow(ctx, 60, 150, 40, 'rgba(255,150,60,0.45)', 0.6 + 0.2 * Math.sin(t / 5));
    ctx.fillStyle = '#ff9a3a'; ctx.beginPath(); ctx.moveTo(48, 168); ctx.lineTo(60, 140 + Math.sin(t / 4) * 3); ctx.lineTo(72, 168); ctx.fill();
  };
  // a transformação no Entre: as correntes ficam brancas
  BGS.transformacao = function (ctx, t) {
    ctx.fillStyle = '#04040a'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + t / 300; ctx.strokeStyle = i % 2 ? '#e8e8ff' : '#6a6a7a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(160, 120); ctx.lineTo(160 + Math.cos(a) * 220, 120 + Math.sin(a) * 220); ctx.stroke(); }
    X.glow(ctx, 160, 120, 60, 'rgba(255,255,255,0.5)', 0.6 + 0.3 * Math.sin(t / 10));
    for (const [c, dx] of [['#ffe08a', -30], ['#2a1a2a', 0], ['#8affb0', 30]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(160 + dx, 120 + Math.sin(t / 15 + dx) * 4, 6, 0, 7); ctx.fill(); }
  };
  // a criança da Primeira Origem: olhos com todas as estrelas
  BGS.origemEstrelas = function (ctx, t) {
    draw(ctx, 'origemEstrelas', (g, r) => { grad(g, ['#000004', '#04041a', '#0a0a2a', '#000004']); stars(g, r, 220, 'rgba(230,235,255,0.9)', 1); });
    for (let i = 0; i < 20; i++) { const a = i * 0.9 + t / 200, rr = 50 + (i % 5) * 18; X.glow(ctx, 160 + Math.cos(a) * rr, 110 + Math.sin(a) * rr * 0.5, 4, 'rgba(200,220,255,0.6)', 0.5 + 0.4 * Math.sin(t / 10 + i)); }
  };
  // Lyra fica, com o cristal erguido como uma lanterna
  BGS.lyraFica = function (ctx, t) {
    draw(ctx, 'lyraFica', (g, r) => { grad(g, ['#0a0818', '#2a1a4a', '#4a3a6a', '#100c18']); towers(g, r, 10, 200, '#0c0a14', '#c8b8ff'); g.fillStyle = '#100c18'; g.fillRect(0, 196, W, 44); });
    X.glow(ctx, 240, 110, 36, 'rgba(120,255,160,0.4)', 0.6 + 0.2 * Math.sin(t / 20));
    ctx.strokeStyle = '#8affb0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(240, 110, 20, 34, 0, 0, 7); ctx.stroke();
    X.glow(ctx, 160, 108, 14, 'rgba(200,220,255,0.8)', 0.7 + 0.3 * Math.sin(t / 8));
  };
  // a cidade na montanha, vista de longe; a estátua vira a cabeça
  BGS.cidadeEspinhosLonge = function (ctx, t) {
    draw(ctx, 'cidadeEspinhosLonge', (g, r) => { grad(g, ['#1a3a4a', '#4a8a8a', '#8ac8b0', '#1a3a2a']); moons(g, [[60, 40, 10], [90, 30, 6]]);
      g.fillStyle = '#3a4a3a'; g.beginPath(); g.moveTo(60, 200); g.lineTo(160, 70); g.lineTo(260, 200); g.fill();
      g.fillStyle = '#5a3a3a'; for (let i = 0; i < 14; i++) g.fillRect(120 + r() * 80, 100 + r() * 60, 6, 8);
      g.fillStyle = '#1a3a2a'; g.fillRect(0, 196, W, 44); });
    const hd = C.head || 0;
    ctx.fillStyle = '#8a7a6a'; ctx.fillRect(157, 62, 6, 16); ctx.beginPath(); ctx.arc(160 + hd * 2, 60, 4, 0, 7); ctx.fill();
    if (hd > 0.5) X.glow(ctx, 162, 60, 6, 'rgba(255,60,40,0.8)', hd);
  };
  // as pinturas do templo
  BGS.temploPinturas = function (ctx, t) {
    draw(ctx, 'temploPinturas', (g, r) => { grad(g, ['#140808', '#2a1410', '#3a2018', '#140808']);
      for (let i = 0; i < 4; i++) { const x = 18 + i * 76; g.fillStyle = '#4a3020'; g.fillRect(x, 50, 60, 80); g.fillStyle = '#c8b090'; g.fillRect(x + 4, 54, 52, 72);
        g.fillStyle = ['#2a2a4a', '#4a3a6a', '#3a2a1a', '#1a1a2a'][i]; g.fillRect(x + 8, 58, 44, 64);
        g.fillStyle = '#fff0c0'; if (i === 0) g.fillRect(x + 28, 96, 4, 10); if (i === 1) for (let k = 0; k < 8; k++) g.fillRect(x + 12 + r() * 36, 62 + r() * 50, 2, 2);
        if (i === 2) { g.fillStyle = '#ffe08a'; g.fillRect(x + 12, 96, 6, 12); g.fillStyle = '#100c10'; g.fillRect(x + 22, 96, 6, 12); g.fillStyle = '#8affb0'; g.fillRect(x + 32, 96, 6, 12); g.fillStyle = '#fff'; g.fillRect(x + 25, 110, 4, 6); }
        if (i === 3) { g.fillStyle = '#6a6a7a'; g.fillRect(x + 26, 70, 18, 40); g.fillStyle = '#fff'; g.fillRect(x + 14, 100, 3, 6); } }
      g.fillStyle = '#2a1a10'; g.fillRect(0, 180, W, 60); g.fillStyle = '#5a4030'; g.fillRect(140, 160, 40, 20); });
    X.glow(ctx, 160, 158, 14, 'rgba(255,220,140,0.5)', 0.6 + 0.3 * Math.sin(t / 12));
  };
  // o Reino Quebrado inteiro, vivo, com a árvore branca
  BGS.reinoIntacto = function (ctx, t) {
    draw(ctx, 'reinoIntacto', (g, r) => { grad(g, ['#3a6aa8', '#8ab8e0', '#c8e0d0', '#3a6a3a']); hills(g, r, 160, '#4a7a4a'); hills(g, r, 186, '#3a6a3a');
      tree(g, r, 160, 190, 50, '#f0f0f0', 16, 200); g.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(160 + (r() - 0.5) * 180, 50 + r() * 50, 6, 0, 7); g.fill(); } });
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, W, 18); ctx.fillRect(0, 222, W, 18);
  };
  // a cidade vira uma árvore branca
  BGS.arvoreBrancaNasce = function (ctx, t) {
    draw(ctx, 'arvoreBrancaNasce', (g, r) => { grad(g, ['#2a1a1a', '#5a3a3a', '#7a5a4a', '#1a1010']); g.fillStyle = '#3a2a2a'; g.beginPath(); g.moveTo(40, 220); g.lineTo(160, 120); g.lineTo(280, 220); g.fill(); });
    const gr = C.grow || 0; if (!gr) return;
    ctx.save(); ctx.globalAlpha = Math.min(1, gr * 1.5);
    ctx.strokeStyle = '#f0ece0'; ctx.lineCap = 'round'; ctx.lineWidth = 6 + gr * 10; ctx.beginPath(); ctx.moveTo(160, 220); ctx.lineTo(160, 220 - gr * 200); ctx.stroke();
    for (let i = 0; i < 10; i++) { const y = 220 - gr * (60 + i * 14); ctx.lineWidth = 2 + (10 - i) * 0.4; ctx.beginPath(); ctx.moveTo(160, y); ctx.lineTo(160 + (i % 2 ? 1 : -1) * gr * (30 + i * 6), y - 20); ctx.stroke(); }
    ctx.restore(); if (gr > 0.9) { ctx.fillStyle = '#fff'; ctx.fillRect(156, 14, 8, 12); X.glow(ctx, 160, 20, 14, 'rgba(255,255,255,0.8)', 0.8); }
  };
  // o trono de ossos de mundos mortos
  BGS.tronoOssos = function (ctx, t) {
    draw(ctx, 'tronoOssos', (g, r) => { grad(g, ['#1a0402', '#5a1a0a', '#8a2a10', '#1a0402']); stars(g, r, 40, 'rgba(255,200,160,0.6)', 0.4);
      for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(255,90,30,0.25)'; g.beginPath(); g.arc(r() * W, r() * 100, 4 + r() * 10, 0, 7); g.fill(); }
      g.fillStyle = '#d8ccb0'; for (let i = 0; i < 30; i++) g.fillRect(120 + r() * 80, 120 + r() * 70, 4, 1 + r() * 3);
      g.fillStyle = '#e0d4b8'; g.fillRect(140, 100, 40, 80); g.fillStyle = '#1a0c08'; g.fillRect(148, 110, 24, 60); g.fillStyle = '#100604'; g.fillRect(0, 190, W, 50); });
    for (let i = 0; i < 8; i++) { const x = (i * 43 + 20) % W, y = 10 + (i * 19) % 60; ctx.globalAlpha = 0.4 + 0.4 * Math.sin(t / 20 + i); ctx.fillStyle = '#fff'; ctx.fillRect(x, y, 1, 1); } ctx.globalAlpha = 1;
  };
  // a Fonte terminando: folhas viram estrelas, raízes viram rios
  BGS.fonteMorre = function (ctx, t) {
    draw(ctx, 'fonteMorre', (g, r) => { grad(g, ['#0a0a1a', '#2a2a4a', '#4a4a6a', '#0a0a14']); hills(g, r, 196, '#121222'); });
    const f = C.fall || 0;
    ctx.globalAlpha = 1 - f * 0.9; ctx.strokeStyle = '#f4f2ea'; ctx.lineCap = 'round'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(160, 210); ctx.lineTo(160, 70); ctx.stroke();
    for (let i = 0; i < 10; i++) { ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(160, 80 + i * 6); ctx.lineTo(160 + (i % 2 ? 1 : -1) * (50 + i * 6), 50 + i * 4); ctx.stroke(); }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 80; i++) { const p = ((t * 0.6 + i * 13) % 160) / 160, x = 100 + (i * 29) % 120 + Math.sin(p * 6 + i) * 10; const y = f > 0.3 ? 120 - p * 140 * f : 60 + p * 140;
      ctx.fillStyle = f > 0.3 ? `rgba(255,255,255,${0.9 * (1 - p)})` : 'rgba(250,250,240,0.8)'; ctx.fillRect(x, y, 1, 1); }
  };
  // a trilha de Seraphyne e Aster
  BGS.estradaPartida = function (ctx, t) {
    draw(ctx, 'estradaPartida', (g, r) => { grad(g, ['#2a3a5a', '#8a9ab0', '#d8c8a0', '#3a4a2a']); hills(g, r, 150, '#4a5a3a'); hills(g, r, 176, '#3a4a2a');
      g.fillStyle = '#6a5a40'; g.beginPath(); g.moveTo(140, H); g.lineTo(158, 150); g.lineTo(162, 150); g.lineTo(180, H); g.fill(); });
    for (let i = 0; i < 20; i++) { const y = 160 + i * 4; ctx.fillStyle = 'rgba(20,10,40,0.6)'; ctx.fillRect(160 + Math.sin(i + t / 30) * 2, y, 1, 2); }
    const k = Math.min(1, (t % 600) / 600); ctx.fillStyle = '#2a1a3a'; ctx.fillRect(157, 160 - k * 8, 2, 4); ctx.fillStyle = '#5a4a3a'; ctx.fillRect(161, 160 - k * 8, 2, 4);
  };
  // a biblioteca infinita
  BGS.bibliotecaInfinita = function (ctx, t) {
    draw(ctx, 'bibliotecaInfinita', (g, r) => { grad(g, ['#0a0604', '#2a1a0c', '#3a2614', '#0a0604']);
      for (let s = 0; s < 6; s++) { const x = s * 56 + 4; g.fillStyle = '#2a1a0c'; g.fillRect(x, 0, 46, 240); for (let y = 6; y < 240; y += 14) { g.fillStyle = '#1a1006'; g.fillRect(x, y + 10, 46, 3); for (let b = 0; b < 9; b++) { g.fillStyle = ['#6a2a1a', '#2a4a6a', '#5a5a2a', '#4a2a4a', '#8a6a3a'][(b + y + s) % 5]; g.fillRect(x + 2 + b * 5, y, 4, 10); } } } });
    X.glow(ctx, 160, 120, 60, 'rgba(255,210,140,0.18)', 0.7 + 0.2 * Math.sin(t / 30));
  };
  // o céu azul do Reino Livre
  BGS.ceuLivre = function (ctx, t) {
    draw(ctx, 'ceuLivre', (g, r) => { grad(g, ['#3a7ac8', '#8ac0f0', '#d8f0f8', '#4a8a4a']); hills(g, r, 150, '#5a9a5a'); hills(g, r, 176, '#4a8a4a');
      g.fillStyle = '#c8c0b0'; for (let i = 0; i < 6; i++) g.fillRect(200 + i * 10, 140 - (i % 3) * 8, 7, 20 + (i % 3) * 8);
      g.fillStyle = '#6a9ad8'; g.fillRect(0, 196, W, 3); });
    for (let i = 0; i < 5; i++) { const x = ((t * 0.1 + i * 70) % (W + 60)) - 30; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.ellipse(x, 30 + i * 8, 22, 6, 0, 0, 7); ctx.fill(); }
  };
  // o Primeiro Silêncio descendo sobre Auren
  BGS.silencioDesce = function (ctx, t) {
    draw(ctx, 'silencioDesce', (g, r) => { grad(g, ['#000000', '#05050a', '#14141c', '#04040a']); towers(g, r, 12, 210, '#0c0c12', '#3a3a20'); g.fillStyle = '#0a0a0e'; g.fillRect(0, 206, W, 34); });
    const p = 0.5 + 0.5 * Math.sin(t / 40);
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(160, 70, 90 + p * 10, 60, 0, 0, 7); ctx.fill();
    X.glow(ctx, 160, 70, 110, 'rgba(255,255,255,0.08)', 0.5 + 0.3 * p);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(130 + i * 20 + Math.sin(t / 7 + i) * 4, 60, 6, 2); }
  };
  // milhares de lanternas e luzes: as pessoas escolhem
  BGS.lanternasAuren = function (ctx, t) {
    draw(ctx, 'lanternasAuren', (g, r) => { grad(g, ['#02030a', '#0a1028', '#1a2040', '#04060c']); stars(g, r, 80); towers(g, r, 12, 210, '#0a0c14'); g.fillStyle = '#0a0c12'; g.fillRect(0, 206, W, 34); });
    const L = C.lights || 0;
    for (let i = 0; i < 160; i++) { if (i / 160 > L) break; const x = (i * 47) % W, y = 120 + (i * 29) % 100 - (i % 4) * 20; const a = 0.6 + 0.4 * Math.sin(t / 12 + i);
      X.glow(ctx, x, y, 4, i % 3 ? 'rgba(255,220,140,0.6)' : 'rgba(200,220,255,0.6)', a); ctx.fillStyle = i % 3 ? '#ffe0a0' : '#e0ecff'; ctx.fillRect(x, y, 1, 1); }
  };
  // a mãe: "Volte. Os dois."
  BGS.maeVolte = function (ctx, t) {
    draw(ctx, 'maeVolte', (g, r) => { grad(g, ['#2a3a5a', '#d8a880', '#f0d8a8', '#3a3a2a']); hills(g, r, 170, '#5a5a3a'); g.fillStyle = '#7a6a48'; g.beginPath(); g.moveTo(150, H); g.lineTo(310, 170); g.lineTo(320, 172); g.lineTo(200, H); g.fill(); });
    X.glow(ctx, 270, 160, 40, 'rgba(255,220,160,0.4)', 0.7);
  };
  // a última luz: os pais seguram as mãos dos filhos
  BGS.ultimaLuz = function (ctx, t) {
    draw(ctx, 'ultimaLuz', (g, r) => { grad(g, ['#e8e4f0', '#f4f0f8', '#ffffff', '#e8e4ec']); });
    X.glow(ctx, 160, 120, 120, 'rgba(255,240,200,0.4)', 0.6 + 0.2 * Math.sin(t / 20));
  };
  // a árvore dos nomes libertada vira ponte entre os mundos
  BGS.arvoreLiberta = function (ctx, t) {
    draw(ctx, 'arvoreLiberta', (g, r) => { grad(g, ['#f0f2f8', '#e0e6f0', '#c8d0e0', '#a8b0c0']); g.fillStyle = '#d8dce4'; g.fillRect(0, 196, W, 44); });
    const b = C.bridge || 0;
    ctx.globalAlpha = 1 - b; ctx.strokeStyle = '#5a5e68'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(160, 200); ctx.lineTo(160, 60); ctx.stroke(); ctx.globalAlpha = 1;
    for (let i = 0; i < 24; i++) { const x = 20 + (i * 53) % 280, y = 30 + (i * 23) % 140; ctx.fillStyle = '#3a4a6a'; ctx.fillRect(x, y, 8, 14); ctx.fillStyle = ['#ffe08a', '#8affb0', '#78b8ff', '#ff9a8a'][i % 4]; ctx.fillRect(x + 2, y + 2, 4, 10); }
    if (b) { ctx.strokeStyle = `rgba(255,240,200,${b})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 170); ctx.quadraticCurveTo(160, 60, W, 170); ctx.stroke(); for (let i = 0; i < 30; i++) { ctx.fillStyle = '#fff'; ctx.fillRect((i * 37 + t) % W, 20 + (i * 13) % 60, 1, 1); } }
  };
  // três luzes: dourada, negra e azul
  BGS.tresLuzes = function (ctx, t) {
    draw(ctx, 'tresLuzes', (g, r) => { grad(g, ['#02040e', '#0e1a3a', '#1a2a4a', '#04060e']); towers(g, r, 12, 210, '#0a1020', '#78b8ff'); g.fillStyle = '#0a1018'; g.fillRect(0, 206, W, 34); });
    const k = C.k || 0;
    X.glow(ctx, 120, 110, 30, 'rgba(255,220,120,0.8)', 0.8); X.glow(ctx, 200, 110, 30, 'rgba(60,40,80,0.9)', 0.8);
    ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(120, 110, 6, 0, 7); ctx.fill(); ctx.fillStyle = '#100c18'; ctx.beginPath(); ctx.arc(200, 110, 6, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a7aa8'; ctx.stroke();
    if (k) { X.glow(ctx, 160, 110, 40 * k, 'rgba(120,180,255,0.9)', k); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; ctx.strokeStyle = `rgba(120,180,255,${k * 0.6})`; ctx.beginPath(); ctx.moveTo(160, 110); ctx.lineTo(160 + Math.cos(a) * 200 * k, 110 + Math.sin(a) * 100 * k); ctx.stroke(); } }
  };
  // o broto
  BGS.broto = function (ctx, t) {
    draw(ctx, 'broto', (g, r) => { grad(g, ['#1a2a4a', '#4a6a9a', '#8aa8c8', '#2a3a2a']); g.fillStyle = '#3a2a1a'; g.fillRect(0, 170, W, 70); g.fillStyle = '#4a3624'; g.beginPath(); g.ellipse(160, 175, 30, 6, 0, 0, 7); g.fill(); });
    const s = C.sprout || 0;
    if (s > 0.3) { const h = (s - 0.3) * 30; ctx.fillStyle = '#6aff8a'; ctx.fillRect(159, 172 - h, 2, h); if (s > 0.8) { ctx.fillRect(155, 172 - h, 4, 2); ctx.fillRect(161, 170 - h, 4, 2); } }
    X.glow(ctx, 250, 40, 12 + s * 8, 'rgba(100,255,140,0.7)', 0.4 + s * 0.5); ctx.fillStyle = '#8affb0'; ctx.fillRect(249, 39, 3, 3);
  };
  // Seraphyne e Aster voltam pela estrada
  BGS.seraVolta = function (ctx, t) {
    draw(ctx, 'seraVolta', (g, r) => { grad(g, ['#0a1430', '#2a3a6a', '#6a6a9a', '#141a2a']); towers(g, r, 10, 200, '#0a1020', '#78b8ff'); g.fillStyle = '#1a2030'; g.fillRect(0, 196, W, 44); });
  };
  // Lyra sobe a estrada com a luz nas mãos
  BGS.lyraVolta = function (ctx, t) {
    draw(ctx, 'lyraVolta', (g, r) => { grad(g, ['#2a4a7a', '#8ab0d8', '#f0d8b0', '#4a6a3a']); hills(g, r, 160, '#5a7a4a'); g.fillStyle = '#7a6a4a'; g.beginPath(); g.moveTo(130, H); g.lineTo(156, 110); g.lineTo(164, 110); g.lineTo(190, H); g.fill(); });
    for (const [x, y, c] of [[60, 30, '#ffe08a'], [100, 22, '#14101a'], [220, 26, '#78b8ff'], [262, 34, '#8affb0']]) { X.glow(ctx, x, y, 6, 'rgba(255,255,255,0.4)', 0.6); ctx.fillStyle = c; ctx.fillRect(x - 1, y - 1, 3, 3); }
  };
  // a praça, à noite, com todos reunidos
  BGS.pracaFinal = function (ctx, t) {
    draw(ctx, 'pracaFinal', (g, r) => { grad(g, ['#04060e', '#141a3a', '#2a2a4a', '#0a0a10']); stars(g, r, 80);
      g.fillStyle = '#0e1018'; for (let i = 0; i < 6; i++) { const x = i * 58, w0 = 40; g.fillRect(x, 140, w0, 60); g.beginPath(); g.moveTo(x - 4, 140); g.lineTo(x + w0 / 2, 120); g.lineTo(x + w0 + 4, 140); g.fill(); }
      g.fillStyle = '#14161c'; g.fillRect(0, 196, W, 44); });
    for (const [x, y, c] of [[60, 30, '#ffe08a'], [100, 22, '#14101a'], [220, 26, '#78b8ff'], [262, 34, '#8affb0']]) { X.glow(ctx, x, y, 6, 'rgba(255,255,255,0.4)', 0.6 + 0.3 * Math.sin(t / 30 + x)); ctx.fillStyle = c; ctx.fillRect(x - 1, y - 1, 3, 3); }
    X.glow(ctx, 160, 200, 40, 'rgba(255,160,60,0.45)', 0.6 + 0.2 * Math.sin(t / 5));
    ctx.fillStyle = '#ff9a3a'; ctx.beginPath(); ctx.moveTo(152, 206); ctx.lineTo(160, 190 + Math.sin(t / 4) * 3); ctx.lineTo(168, 206); ctx.fill();
  };
})();
