'use strict';
// Cenários das cenas da Parte 3 (caps. 26–35).
(function () {
  const C = G.Cine, X = G.gfx, BGS = C.BGS, cache = C.cache;
  const W = G.W, H = G.H;
  function once(key, paint) { if (!cache[key]) { const [c, g] = X.canvas(W, H); paint(g, X.rng(key.length * 131)); cache[key] = X.dither(c, 16); } return cache[key]; }
  function grad(g, stops) { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function stars(g, r, n, col) { g.fillStyle = col || 'rgba(230,235,255,0.8)'; for (let i = 0; i < n; i++) g.fillRect(r() * W, r() * H * 0.6, r() < 0.15 ? 2 : 1, 1); }
  function hills(g, r, y0, col) { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 14) g.lineTo(x, y0 + r() * 26); g.lineTo(W, H); g.fill(); }
  const draw = (ctx, key, paint) => ctx.drawImage(once(key, paint), 0, 0, W, H);

  // do alto da colina: fogueiras no Reino e uma estrela negra no céu
  BGS.estrelaNegra = function (ctx, t) {
    draw(ctx, 'estrelaNegra', (g, r) => { grad(g, ['#04060e', '#0e1430', '#2a2a44', '#0a0a10']); stars(g, r, 90); hills(g, r, 150, '#0e0e16'); hills(g, r, 180, '#08080c'); });
    for (let i = 0; i < 14; i++) { const x = (i * 47) % W, y = 165 + (i * 13) % 40; X.glow(ctx, x, y, 6, 'rgba(255,170,80,0.6)', 0.6 + 0.3 * Math.sin(t / 9 + i)); ctx.fillStyle = '#ffb050'; ctx.fillRect(x, y, 1, 1); }
    const p = 0.6 + 0.4 * Math.sin(t / 40);
    X.glow(ctx, 230, 50, 26, 'rgba(160,80,255,0.35)', p); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(230, 50, 6, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a5ad0'; ctx.lineWidth = 1; ctx.stroke();
  };
  // um lugar sem estrelas, sem luz, sem tempo: alguém sentado num trono antigo
  BGS.tronoAntigo = function (ctx, t) {
    draw(ctx, 'tronoAntigo', (g, r) => { grad(g, ['#000000', '#05050a', '#0a0a12', '#000000']);
      g.fillStyle = '#14141c'; g.fillRect(130, 70, 60, 110); g.beginPath(); g.moveTo(130, 70); g.lineTo(160, 30); g.lineTo(190, 70); g.fill();
      g.fillStyle = '#1e1e28'; g.fillRect(120, 180, 80, 10); g.fillRect(110, 190, 100, 10); });
    X.glow(ctx, 160, 120, 60, 'rgba(230,230,255,0.12)', 0.7);
  };
  // o grande muro: "Aqui termina o Reino"
  BGS.portaoFim = function (ctx, t) {
    draw(ctx, 'portaoFim', (g, r) => { grad(g, ['#1a2030', '#4a5a6a', '#6a6a6a', '#2a2a2a']);
      g.fillStyle = '#3a3a40'; g.fillRect(0, 70, W, 130); g.fillStyle = '#2a2a30'; for (let x = 0; x < W; x += 18) g.fillRect(x, 70, 16, 6);
      g.fillStyle = '#4a4a52'; for (let y = 82; y < 200; y += 12) for (let x = (y / 12 % 2) * 10; x < W; x += 20) g.fillRect(x, y, 18, 1);
      g.fillStyle = '#141418'; g.fillRect(130, 110, 60, 90); g.beginPath(); g.arc(160, 110, 30, Math.PI, 0); g.fill();
      g.fillStyle = '#c8b890'; g.fillRect(118, 78, 84, 8); g.fillStyle = '#3a3020'; for (let x = 122; x < 198; x += 6) g.fillRect(x, 80, 3, 4);
      g.fillStyle = '#2a2a2a'; g.fillRect(0, 200, W, 40); });
    if (C.gateOpen) { const k = C.gateOpen; ctx.fillStyle = `rgba(20,30,60,${k})`; ctx.fillRect(130, 80, 60, 120); X.glow(ctx, 160, 150, 40 * k, 'rgba(150,180,255,0.4)', k); }
  };
  // o oceano negro e as três luas
  BGS.tresLuas = function (ctx, t) {
    draw(ctx, 'tresLuas', (g, r) => { grad(g, ['#02030a', '#0a1022', '#141a30', '#02030a']); stars(g, r, 70);
      for (const [x, y, rr] of [[70, 40, 12], [170, 26, 18], [262, 52, 9]]) { g.fillStyle = 'rgba(200,210,240,0.12)'; g.beginPath(); g.arc(x, y, rr * 2.3, 0, 7); g.fill(); g.fillStyle = '#dfe4f0'; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); g.fillStyle = '#bfc6d6'; g.beginPath(); g.arc(x + rr * 0.3, y + rr * 0.1, rr * 0.35, 0, 7); g.fill(); }
      g.fillStyle = '#03050c'; g.fillRect(0, 120, W, 120); });
    for (let i = 0; i < 50; i++) { const y = 124 + (i % 12) * 9, x = ((i * 53 + t * (0.3 + (i % 3) * 0.1)) % (W + 30)) - 15; ctx.fillStyle = 'rgba(140,160,220,0.35)'; ctx.fillRect(x, y, 6 + (i % 4) * 3, 1); }
    if (C.city) { ctx.globalAlpha = C.city; for (let i = 0; i < 9; i++) { const x = 100 + i * 14, hh = 30 + (i * 37) % 50; ctx.fillStyle = '#c8ccd8'; ctx.fillRect(x, 120 - hh, 9, hh); ctx.fillStyle = '#ffe8a0'; ctx.fillRect(x + 4, 120 - hh + 6, 1, 2); } ctx.globalAlpha = 1; }
  };
  // a Primeira Cidade vazia; o pai na torre
  BGS.torreTopo = function (ctx, t) {
    draw(ctx, 'torreTopo', (g, r) => { grad(g, ['#0a0a12', '#1a1a26', '#2a2a36', '#0a0a10']);
      g.fillStyle = '#3a3a48'; g.fillRect(0, 170, W, 70); g.fillStyle = '#2a2a36'; for (let i = 0; i < 5; i++) g.fillRect(10 + i * 70, 20, 14, 150);
      g.fillStyle = '#06080e'; g.fillRect(240, 40, 60, 90); g.fillStyle = '#0c1424'; g.fillRect(244, 44, 52, 82);
      g.fillStyle = '#2a2a36'; g.fillRect(140, 120, 40, 50); g.fillRect(146, 100, 28, 22); });
    const d = C.door || 0; if (d) { ctx.fillStyle = '#000'; ctx.fillRect(160 - 24 * d, 40, 48 * d, 130); X.glow(ctx, 160, 100, 50 * d, 'rgba(60,30,90,0.4)', d); }
  };
  // o mundo que deveria ter existido: céu branco, montanhas flutuando, uma árvore negra
  BGS.mundoAntigo = function (ctx, t) {
    draw(ctx, 'mundoAntigo', (g, r) => { grad(g, ['#f4f2ee', '#e0dcd4', '#c8c4ba', '#a8a49a']);
      for (let i = 0; i < 7; i++) { const x = r() * W, y = 30 + r() * 80, w0 = 20 + r() * 30; g.fillStyle = '#6a6458'; g.beginPath(); g.moveTo(x - w0, y); g.lineTo(x, y - w0 * 0.6); g.lineTo(x + w0, y); g.lineTo(x, y + w0 * 0.8); g.fill(); }
      g.strokeStyle = '#1a1414'; g.lineCap = 'round'; for (let i = 0; i < 12; i++) { g.lineWidth = 2 + r() * 3; g.beginPath(); g.moveTo(160, 120); g.quadraticCurveTo(160 + (r() - 0.5) * 120, 70, 160 + (r() - 0.5) * 200, 40 - r() * 20); g.stroke(); }
      g.fillStyle = '#140e0e'; g.fillRect(152, 110, 16, 90); g.fillStyle = '#5a5448'; g.fillRect(0, 200, W, 40); });
    const ruin = C.ruin || 0;
    if (ruin) { ctx.fillStyle = `rgba(20,0,0,${ruin * 0.7})`; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 30 * ruin; i++) { ctx.fillStyle = '#000'; ctx.fillRect((i * 83) % W, (i * 41 + t) % H, 2, 6); } }
  };
  // o céu se abre como uma ferida: o primeiro Devorador
  BGS.ceuFerido = function (ctx, t) {
    draw(ctx, 'ceuFerido', (g, r) => { grad(g, ['#1a0204', '#5a0a10', '#2a0608', '#0a0204']);
      for (let i = 0; i < 9; i++) { const x = 10 + i * 36 + r() * 10, w0 = 10 + r() * 10, hh = 40 + r() * 60; g.fillStyle = '#20202a'; g.fillRect(x, 200 - hh, w0, hh); g.beginPath(); g.moveTo(x - 2, 200 - hh); g.lineTo(x + w0 / 2, 186 - hh); g.lineTo(x + w0 + 2, 200 - hh); g.fill(); }
      g.fillStyle = '#100c10'; g.fillRect(0, 200, W, 40); });
    const k = C.rift == null ? 1 : C.rift;
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(160, 40, 120 * k, 14 * k + 1, -0.05, 0, 7); ctx.fill();
    X.glow(ctx, 160, 40, 130 * k, 'rgba(255,40,40,0.25)', 0.6 + 0.2 * Math.sin(t / 12));
  };
  // a planície negra: milhares presos por correntes e a torre que pulsa como um coração
  BGS.colheita = function (ctx, t) {
    draw(ctx, 'colheita', (g, r) => { grad(g, ['#000000', '#120206', '#1a0a0e', '#050304']);
      g.fillStyle = '#060406'; g.fillRect(146, 0, 28, 200); g.fillStyle = '#100c10'; g.fillRect(0, 196, W, 44);
      for (let i = 0; i < 60; i++) { const x = r() * W, y = 170 + r() * 50; g.fillStyle = '#2a2026'; g.fillRect(x, y, 2, 5); g.fillStyle = '#5a1418'; g.fillRect(x, y - 30 - r() * 20, 1, 30); } });
    const beat = Math.pow(Math.max(0, Math.sin(t / 18)), 10);
    X.glow(ctx, 160, 90, 60, 'rgba(255,20,40,0.5)', 0.3 + 0.6 * beat);
    for (let y = 10; y < 200; y += 18) { ctx.fillStyle = `rgba(255,${30 + beat * 80},40,${0.5 + beat * 0.5})`; ctx.fillRect(158, y, 4, 2); }
  };
  // o núcleo: um cristal negro com milhares de rostos dentro
  BGS.nucleo = function (ctx, t) {
    draw(ctx, 'nucleo', (g, r) => { grad(g, ['#000000', '#0a0408', '#140810', '#000000']);
      g.fillStyle = '#0c060c'; g.beginPath(); g.moveTo(160, 20); g.lineTo(220, 110); g.lineTo(160, 200); g.lineTo(100, 110); g.fill();
      g.strokeStyle = '#3a1a2a'; g.lineWidth = 1; g.stroke(); });
    const open = C.release || 0;
    for (let i = 0; i < 40; i++) { const x = 120 + (i * 37) % 80, y = 50 + (i * 23) % 120; const a = 0.3 + 0.3 * Math.sin(t / 20 + i);
      if (open) { const k = Math.min(1, open * 1.5); const yy = y - k * (y + 20) * ((i % 7) / 7 + 0.3); ctx.fillStyle = `rgba(255,240,200,${0.9 * (1 - open * 0.3)})`; ctx.fillRect(x, yy, 2, 2); X.glow(ctx, x, yy, 5, 'rgba(255,240,200,0.4)', 0.8); }
      else { ctx.fillStyle = `rgba(200,180,200,${a})`; ctx.fillRect(x, y, 2, 1); ctx.fillRect(x, y + 2, 1, 1); ctx.fillRect(x + 2, y + 2, 1, 1); } }
  };
  // um mundo morto: o trono do Rei dos Espinhos sobre milhões de corpos
  BGS.mundoMorto = function (ctx, t) {
    draw(ctx, 'mundoMorto', (g, r) => { grad(g, ['#1a0606', '#5a1a10', '#3a1410', '#0a0404']);
      g.fillStyle = '#0a0606'; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 6) g.lineTo(x, 180 + r() * 14); g.lineTo(W, H); g.fill();
      for (let i = 0; i < 200; i++) { g.fillStyle = r() < 0.5 ? '#1a1210' : '#241a16'; g.fillRect(r() * W, 180 + r() * 60, 3, 1); }
      g.fillStyle = '#140808'; g.fillRect(140, 110, 40, 74); g.beginPath(); g.moveTo(140, 110); g.lineTo(148, 90); g.lineTo(156, 108); g.lineTo(164, 86); g.lineTo(172, 108); g.lineTo(180, 110); g.fill(); });
    X.glow(ctx, 160, 140, 40, 'rgba(255,30,20,0.25)', 0.5 + 0.2 * Math.sin(t / 20));
  };
  // a passagem entre os dois mundos
  BGS.passagemMundos = function (ctx, t) {
    draw(ctx, 'passagemMundos', (g, r) => { grad(g, ['#05040a', '#120a1a', '#1a1220', '#05040a']); hills(g, r, 190, '#0a080c'); });
    const k = C.portal == null ? 1 : C.portal;
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = i % 2 ? '#ffe8a0' : '#b26bff'; ctx.globalAlpha = 0.25 + 0.1 * i; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(160, 110, (70 - i * 8) * k, (90 - i * 10) * k, Math.sin(t / 60 + i) * 0.2, 0, 7); ctx.stroke(); }
    ctx.globalAlpha = 1; X.glow(ctx, 160, 110, 70 * k, 'rgba(160,190,255,0.35)', 0.7);
    for (let i = 0; i < 40; i++) { const p = ((t * 0.6 + i * 13) % 100) / 100; ctx.fillStyle = 'rgba(255,240,210,0.8)'; ctx.fillRect(60 + (i * 41) % 200, 230 - p * 130, 1, 2); }
  };
  // quatro portas na mente de Kravenox: dourada, negra, branca e vazia
  BGS.quatroPortas = function (ctx, t) {
    ctx.fillStyle = '#e8e6e0'; ctx.fillRect(0, 0, W, H);
    const cols = ['#e0b040', '#100c10', '#ffffff', null];
    cols.forEach((c, i) => { const x = 40 + i * 72; if (C.doorsGone && i < C.doorsGone) return;
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x + 4, 74, 44, 100);
      if (c) { ctx.fillStyle = c; ctx.fillRect(x, 70, 44, 100); ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 1; ctx.strokeRect(x, 70, 44, 100); }
      else { ctx.setLineDash([3, 3]); ctx.strokeStyle = '#8a8a8a'; ctx.strokeRect(x, 70, 44, 100); ctx.setLineDash([]); } });
  };
  // o novo Reino: céu azul e violeta, duas luas, a cidade cercada por raízes negras
  BGS.novoReino = function (ctx, t) {
    draw(ctx, 'novoReino', (g, r) => { grad(g, ['#1a1440', '#3a3a8a', '#7a6ab0', '#2a2440']); stars(g, r, 30, 'rgba(255,255,255,0.6)');
      for (const [x, y, rr] of [[70, 50, 14], [250, 36, 9]]) { g.fillStyle = 'rgba(230,220,255,0.15)'; g.beginPath(); g.arc(x, y, rr * 2.2, 0, 7); g.fill(); g.fillStyle = '#efe8ff'; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
      hills(g, r, 150, '#1e2a24'); g.fillStyle = '#c8ccd8'; for (let i = 0; i < 7; i++) { const x = 200 + i * 12, hh = 20 + (i * 17) % 30; g.fillRect(x, 160 - hh, 8, hh); }
      g.strokeStyle = '#0a0606'; g.lineWidth = 2; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(190 + i * 13, 165); g.quadraticCurveTo(200 + i * 10, 150, 205 + i * 12, 130); g.stroke(); }
      hills(g, r, 185, '#121a16');
      for (let i = 0; i < 40; i++) { g.fillStyle = i % 2 ? '#8af0ff' : '#c8a8ff'; g.fillRect(r() * W, 190 + r() * 40, 1, 1); } });
    X.glow(ctx, 70, 50, 30, 'rgba(240,230,255,0.4)', 0.6 + 0.1 * Math.sin(t / 30));
  };
  // a árvore que ninguém plantou: quatro marcas e uma quinta, de algo que ainda vai nascer
  BGS.arvoreMarcas = function (ctx, t) {
    draw(ctx, 'arvoreMarcas', (g, r) => { grad(g, ['#0a0a14', '#1a1a30', '#2a2438', '#0a0a10']);
      g.fillStyle = '#121a16'; g.fillRect(0, 196, W, 44);
      g.fillStyle = '#0a0606'; g.fillRect(150, 70, 20, 130); g.strokeStyle = '#0a0606'; g.lineCap = 'round';
      for (let i = 0; i < 10; i++) { g.lineWidth = 2 + r() * 2; g.beginPath(); g.moveTo(160, 90); g.lineTo(160 + (r() - 0.5) * 140, 30 + r() * 50); g.stroke(); }
      for (let i = 0; i < 16; i++) { const x = 160 + (r() - 0.5) * 120, y = 30 + r() * 60; g.fillStyle = '#0a0606'; g.beginPath(); g.moveTo(x, y - 6); g.lineTo(x + 2, y); g.lineTo(x - 2, y); g.fill(); } });
    const m = [['#ffe08a', 155, 110], ['#100c10', 165, 110], ['#9fd8ff', 155, 124], ['#ffffff', 165, 124]];
    for (const [c, x, y] of m) { ctx.fillStyle = c; ctx.fillRect(x - 2, y - 2, 4, 4); if (c === '#100c10') { ctx.strokeStyle = '#6a5a7a'; ctx.strokeRect(x - 2, y - 2, 4, 4); } }
    const f = C.fifth || 0; if (f) { X.glow(ctx, 160, 140, 14 * f, 'rgba(120,255,160,0.6)', f * (0.6 + 0.3 * Math.sin(t / 10))); ctx.fillStyle = '#8affb0'; ctx.fillRect(158, 138, 4, 4); }
  };
})();
