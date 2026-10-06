'use strict';
// Tela título, novo jogo, carregar, créditos e inicialização.
(function () {
  const D = G.data;

  const Title = {
    draw(ctx) {
      const t = G.time;
      const gr = ctx.createLinearGradient(0, 0, 0, G.H); gr.addColorStop(0, '#12030a'); gr.addColorStop(0.6, '#3a0a10'); gr.addColorStop(1, '#0a0204'); ctx.fillStyle = gr; ctx.fillRect(0, 0, G.W, G.H);
      // montanhas quebradas
      ctx.fillStyle = '#0a0406'; ctx.beginPath(); ctx.moveTo(0, 170);
      for (let x = 0; x <= G.W; x += 16) ctx.lineTo(x, 150 + Math.sin(x * 0.07) * 14 + ((x * 37) % 23));
      ctx.lineTo(G.W, G.H); ctx.lineTo(0, G.H); ctx.fill();
      // torre partida
      ctx.fillStyle = '#06020a'; ctx.fillRect(250, 96, 12, 70); ctx.beginPath(); ctx.moveTo(250, 96); ctx.lineTo(253, 86); ctx.lineTo(256, 92); ctx.lineTo(262, 96); ctx.fill();
      // cristal negro pulsando
      const cx = 160, cy = 124 + Math.sin(t / 40) * 3, pulse = 0.5 + 0.5 * Math.sin(t / 25);
      G.gfx.glow(ctx, cx, cy, 70, 'rgba(200,30,40,0.55)', 0.5 + pulse * 0.4);
      ctx.fillStyle = '#05020a'; ctx.beginPath(); ctx.moveTo(cx, cy - 40); ctx.lineTo(cx + 18, cy); ctx.lineTo(cx, cy + 40); ctx.lineTo(cx - 18, cy); ctx.fill();
      ctx.strokeStyle = 'rgba(255,60,50,' + (0.4 + pulse * 0.6) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - 3, cy - 30); ctx.lineTo(cx + 4, cy - 8); ctx.lineTo(cx - 2, cy + 6); ctx.lineTo(cx + 3, cy + 26); ctx.stroke();
      // espinhos entrelaçados
      ctx.strokeStyle = '#c9a24a'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - 34, cy + 34); ctx.lineTo(cx + 34, cy - 34); ctx.moveTo(cx + 34, cy + 34); ctx.lineTo(cx - 34, cy - 34); ctx.stroke(); ctx.globalAlpha = 1;
      // brasas
      for (let i = 0; i < 30; i++) { const x = (i * 71 + t * (0.2 + (i % 5) * 0.08)) % G.W, y = G.H - ((i * 43 + t * (0.3 + (i % 3) * 0.2)) % G.H); ctx.fillStyle = i % 3 ? '#ff5a2a' : '#ffcf6a'; ctx.globalAlpha = 0.5; ctx.fillRect(x, y, 1, 1); }
      ctx.globalAlpha = 1;
      G.text(ctx, 'KRAVENOX', G.W / 2, 22, '#e8d8c0', 30, 'center', true);
      G.text(ctx, 'O REINO QUEBRADO', G.W / 2, 56, '#c9a24a', 12, 'center', true);
      G.text(ctx, 'Parte 1 — A Fonte', G.W / 2, 71, '#a07a6a', 8, 'center');
      G.text(ctx, 'baseado no romance "Reino Quebrado — A Lenda dos Irmãos Espinhos"', G.W / 2, G.H - 11, '#5a3a40', 6.5, 'center');
    },
  };

  G.titleScreen = async function () {
    G.overlays.length = 0; G.lock = 0;
    G.scene = Title; G.fadeA = 0; G.Audio.play('title');
    for (;;) {
      const has = D.hasSave();
      const i = await G.menu({ x: G.W / 2 - 50, y: 160, w: 100, items: [{ label: 'Novo jogo' }, { label: 'Continuar', disabled: !has }], index: has ? 1 : 0, cancel: false });
      if (i === 0) {
        if (has) { const c = await G.choose('Começar de novo apaga o registro atual. Tem certeza?', ['Não', 'Sim']); if (c !== 1) continue; }
        G.newGame(); return;
      }
      if (i === 1) { G.loadGame(); return; }
    }
  };
  G.newGame = function () {
    G.state = D.newState();
    G.run(async () => {
      G.fadeA = 1;
      await G.story.prologo();
      G.enterDungeon('abismo');
      await G.story.despertar();
    });
  };
  G.loadGame = function () {
    const st = D.load();
    if (!st) { G.newGame(); return; }
    G.state = st;
    G.overlays.length = 0;
    const l = st.loc;
    G.fadeA = 1;
    if (l.mode === 'dungeon') G.enterDungeon(l.map, l.x, l.y, l.dir); else G.enterField(l.map, l.x, l.y, l.dir);
    G.run(() => G.fade(0, 30));
  };
  G.credits = async function () {
    const lines = [
      ['FIM DA PARTE 1', '#ffcf6a', 16],
      ['Kravenox: O Reino Quebrado', '#e8d8c0', 11],
      ['', '', 8],
      ['Capítulos 1 a 13 de', '#a89a8a', 8],
      ['"Reino Quebrado — A Lenda dos Irmãos Espinhos"', '#e8d8c0', 9],
      ['', '', 8],
      ['A história continua na Parte 2:', '#a89a8a', 8],
      ['O Reino em Guerra', '#c9a24a', 12],
      ['Valdora · Seraphyne · A Primeira Cidade · O Rei do Vazio', '#8a7a8a', 8],
      ['', '', 8],
      ['"Algumas verdades serão reveladas.', '#c9bfd8', 8],
      ['Outras permanecerão escondidas até que seja tarde demais."', '#c9bfd8', 8],
    ];
    const ov = { t: 0, update() { this.t++; if (G.debug.auto) { G.pop(ov); ov.done(); return; } if (this.t > 200 && (G.Input.pressed.a || G.Input.pressed.b)) { G.pop(ov); ov.done(); } }, draw(ctx) {
      ctx.fillStyle = '#05020a'; ctx.fillRect(0, 0, G.W, G.H);
      G.gfx.glow(ctx, G.W / 2, 60, 120, 'rgba(220,230,255,0.15)');
      let y = 28;
      lines.forEach(([s, c, sz], i) => { ctx.globalAlpha = G.clamp((this.t - i * 14) / 30, 0, 1); if (s) G.text(ctx, s, G.W / 2, y, c, sz, 'center', i === 0); y += sz + 7; });
      ctx.globalAlpha = 1;
      if (this.t > 200) G.text(ctx, 'A: voltar ao título', G.W / 2, G.H - 14, '#5a4a5a', 7, 'center');
    } };
    G.fadeA = 0;
    await new Promise(r => { ov.done = r; G.push(ov); });
    G.titleScreen();
  };

  // contador de tempo de jogo
  setInterval(() => { if (G.state && G.scene !== Title) G.state.time += 60; }, 1000);
  // salva ao fechar/ocultar (só se já houver jogo em andamento fora de roteiros)
  addEventListener('visibilitychange', () => { if (document.hidden && G.state && G.lock === 0 && G.scene !== Title && G.scene !== G.Battle) D.save(); });

  function boot() {
    G.start();
    G.setupTouch();
    if (location.search.includes('debug')) { window.__G = G; G.debug.showPos = true; }
    G.titleScreen();
  }
  const ready = document.fonts && document.fonts.load ? Promise.race([document.fonts.load('10px "Pixelify Sans"'), new Promise(r => setTimeout(r, 1500))]) : Promise.resolve();
  ready.then(boot, boot);
})();
