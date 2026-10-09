'use strict';
// Tela título, novo jogo, carregar, créditos e inicialização.
(function () {
  const D = G.data;

  const Title = {
    draw(ctx) {
      const t = G.time;
      const art = G.gfx.imgs.titulo;
      if (art) {
        ctx.imageSmoothingEnabled = true; ctx.drawImage(art, 0, -24, 320, 320); ctx.imageSmoothingEnabled = false;
        const pulse = 0.5 + 0.5 * Math.sin(t / 18);
        for (const [ex, ey] of [[132, 80], [174, 80]]) G.gfx.glow(ctx, ex, ey, 12, 'rgba(255,50,20,0.9)', 0.25 + pulse * 0.45);
        let sh = ctx.createLinearGradient(0, 0, 0, 90); sh.addColorStop(0, 'rgba(0,0,0,0.85)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sh; ctx.fillRect(0, 0, G.W, 90);
        sh = ctx.createLinearGradient(0, 140, 0, G.H); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.9)'); ctx.fillStyle = sh; ctx.fillRect(0, 140, G.W, G.H - 140);
        ctx.fillStyle = 'rgba(80,0,10,' + (0.08 + pulse * 0.06) + ')'; ctx.fillRect(0, 0, G.W, G.H);
      } else {
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
      }
      // brasas
      for (let i = 0; i < 30; i++) { const x = (i * 71 + t * (0.2 + (i % 5) * 0.08)) % G.W, y = G.H - ((i * 43 + t * (0.3 + (i % 3) * 0.2)) % G.H); ctx.fillStyle = i % 3 ? '#ff5a2a' : '#ffcf6a'; ctx.globalAlpha = 0.5; ctx.fillRect(x, y, 1, 1); }
      ctx.globalAlpha = 1;
      G.text(ctx, 'KRAVENOX', G.W / 2, 22, '#e8d8c0', 30, 'center', true);
      G.text(ctx, 'O REINO QUEBRADO', G.W / 2, 56, '#c9a24a', 12, 'center', true);
      G.text(ctx, 'Parte 1 — A Fonte', G.W / 2, 71, '#a07a6a', 8, 'center');
      const v = +window.KRAVENOX_V; if (v > 1e9) { const d = new Date(v * 1000), z = n => String(n).padStart(2, '0'); G.text(ctx, 'versão ' + z(d.getDate()) + '/' + z(d.getMonth() + 1) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()), G.W - 4, G.H - 22, '#8a7078', 6, 'right'); }
      G.text(ctx, 'baseado no romance "Reino Quebrado — A Lenda dos Irmãos Espinhos"', G.W / 2, G.H - 11, '#5a3a40', 6.5, 'center');
    },
  };

  // Easter egg: ↑↑↓↓←→←→ B na tela título liga o "Modo Caderno" — o jogo vira caneta azul em papel,
  // como o primeiro desenho do Kravenox, há 45 anos.
  const CODE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b'];
  let codeI = 0;
  G.applyCaderno = function () {
    let on = false; try { on = localStorage.getItem('kravenox_caderno') === '1'; } catch (e) {}
    G.canvas.style.filter = on ? 'invert(1) grayscale(1) sepia(0.6) hue-rotate(180deg) saturate(3) contrast(1.1)' : '';
    return on;
  };
  // Vídeo de abertura: se ninguém mexer na tela título por 25 s, passa o vídeo de apresentação.
  let idle = 0;
  function attract() {
    const cv = G.canvas.getBoundingClientRect();
    const v = document.createElement('video');
    for (const [ext, type] of [['mp4', 'video/mp4'], ['webm', 'video/webm']]) { const so = document.createElement('source'); so.src = 'video/abertura.' + ext + '?v=' + (window.KRAVENOX_V || ''); so.type = type; v.appendChild(so); }
    v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    const sound = G.Audio.ctx && G.Audio.ctx.state === 'running';
    v.muted = !sound;
    Object.assign(v.style, { position: 'fixed', left: cv.left + 'px', top: cv.top + 'px', width: cv.width + 'px', height: cv.height + 'px', objectFit: 'contain', background: '#000', zIndex: 20 });
    document.body.appendChild(v);
    if (sound) G.Audio.stop();
    let done = false;
    const ov = { update() { const I = G.Input; if (I.pressed.a || I.pressed.b || I.pressed.up || I.pressed.down || I.pressed.left || I.pressed.right) end(); }, draw(ctx) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, G.H); } };
    function end() {
      if (done) return; done = true;
      v.pause(); v.remove(); G.pop(ov); idle = 0;
      G.Audio.unlock(); G.Audio.play('title');
    }
    G.push(ov);
    v.addEventListener('ended', end);
    v.addEventListener('error', end);
    for (const ev of ['touchstart', 'mousedown']) v.addEventListener(ev, e => { e.preventDefault(); end(); }, { passive: false });
    const p = v.play(); if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(end); });
  }
  Title.tick = function () {
    const I = G.Input;
    if (I.any || Object.values(I.pressed).some(Boolean) || Object.values(I.held).some(Boolean)) idle = 0;
    I.any = false;
    if (G.scene === Title && ++idle > 60 * 25 && !G.debug.auto && !location.search.includes('debug')) { idle = 0; attract(); }
    for (const k of ['up', 'down', 'left', 'right', 'a', 'b']) if (I.pressed[k]) {
      if (k === CODE[codeI]) codeI++; else codeI = k === CODE[0] ? 1 : 0;
      if (codeI === CODE.length) {
        codeI = 0;
        let on = false; try { on = localStorage.getItem('kravenox_caderno') !== '1'; localStorage.setItem('kravenox_caderno', on ? '1' : '0'); } catch (e) {}
        G.applyCaderno(); G.Audio.sfx('memory');
        G.toast(on ? 'Modo Caderno: como era há 45 anos.' : 'Modo Caderno desligado.');
      }
    }
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
    // quem terminou a Parte 1 continua direto na Parte 2
    if (st.flags.fim && !st.flags.p2) { G.run(() => G.story.parte2()); return; }
    if (l.mode === 'dungeon') G.enterDungeon(l.map, l.x, l.y, l.dir); else G.enterField(l.map, l.x, l.y, l.dir);
    G.run(() => G.fade(0, 30));
  };
  G.credits = async function (part = 1) {
    const lines = part === 2 ? [
      ['FIM DA PARTE 2', '#ffcf6a', 16],
      ['Kravenox: O Reino Quebrado', '#e8d8c0', 11],
      ['', '', 8],
      ['Capítulos 14 a 25 de', '#a89a8a', 8],
      ['"Reino Quebrado"', '#e8d8c0', 9],
      ['', '', 8],
      ['A história continua na Parte 3:', '#a89a8a', 8],
      ['Além do Reino', '#c9a24a', 12],
      ['A Primeira Cidade · O Rei dos Espinhos · O Rei do Vazio', '#8a7a8a', 8],
      ['', '', 8],
      ['"O Primeiro era apenas o guardião da porta."', '#c9bfd8', 8],
    ] : [
      ['FIM DA PARTE 1', '#ffcf6a', 16],
      ['Kravenox: O Reino Quebrado', '#e8d8c0', 11],
      ['', '', 8],
      ['Capítulos 1 a 13 de', '#a89a8a', 8],
      ['"Reino Quebrado — A Lenda dos Irmãos Espinhos"', '#e8d8c0', 9],
      ['', '', 8],
      ['A história continua na Parte 2:', '#a89a8a', 8],
      ['O Reino em Guerra', '#c9a24a', 12],
      ['Valdora · Seraphyne · O Kravenox do Futuro · O Primeiro', '#8a7a8a', 8],
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
      if (this.t > 200) G.text(ctx, part === 1 ? 'A: continuar' : 'A: voltar ao título', G.W / 2, G.H - 14, '#5a4a5a', 7, 'center');
    } };
    G.fadeA = 0;
    await new Promise(r => { ov.done = r; G.push(ov); });
    if (G.gfx.imgs.desenho) await G.showImage(G.gfx.imgs.desenho, 'Kravenox nasceu de um desenho de escola, há 45 anos.');
    if (part === 1) {
      const i = await G.choose('A história continua. Começar a Parte 2 agora?', ['Começar a Parte 2', 'Voltar ao título']);
      if (i === 0) { await G.story.parte2(); return; }
    }
    G.titleScreen();
  };

  // Atualização automática: de tempos em tempos (e ao voltar para o jogo) confere se saiu versão nova.
  // Só recarrega num momento seguro — título, ou andando pelo mapa/masmorra sem diálogo — e salva antes.
  let newV = null;
  async function checkVersion() {
    if (newV || location.search.includes('debug')) return;
    try { const j = await (await fetch('version.json?t=' + Date.now(), { cache: 'no-store' })).json(); if (window.KRAVENOX_V && j.v !== window.KRAVENOX_V) newV = j.v; } catch (e) {}
  }
  setInterval(checkVersion, 90000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkVersion(); });
  setInterval(() => {
    if (!newV) return;
    const onTitle = G.scene === Title;
    const safe = onTitle || (G.state && G.lock === 0 && !G.overlays.length && (G.scene === G.Field || G.scene === G.Dungeon) && !(G.scene.mv || G.scene.anim));
    if (!safe) return;
    if (!onTitle) D.save();
    G.toast('Nova versão do jogo! Atualizando...');
    const v = newV; newV = null;
    setTimeout(() => location.replace(location.pathname + '?v=' + v), 1200);
  }, 1000);
  // contador de tempo de jogo
  setInterval(() => { if (G.state && G.scene !== Title) G.state.time += 60; }, 1000);
  // salva ao fechar/ocultar (só se já houver jogo em andamento fora de roteiros)
  addEventListener('visibilitychange', () => { if (document.hidden && G.state && G.lock === 0 && G.scene !== Title && G.scene !== G.Battle) D.save(); });

  async function boot() {
    await G.gfx.loadImages();
    G.start();
    G.setupTouch();
    if (location.search.includes('debug')) { window.__G = G; G.debug.showPos = true; }
    G.applyCaderno();
    G.titleScreen();
  }
  const ready = document.fonts && document.fonts.load ? Promise.race([document.fonts.load('10px "Pixelify Sans"'), new Promise(r => setTimeout(r, 1500))]) : Promise.resolve();
  ready.then(boot, boot);
})();
