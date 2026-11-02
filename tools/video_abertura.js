// Grava o vídeo de abertura (o que passa na tela título depois de 25 s parado) direto do jogo atual.
// O laço do jogo é parado e cada quadro é avançado à mão (2 atualizações por quadro = 30 fps), então
// o vídeo sai liso mesmo numa máquina lenta. Depois tools/video_abertura.sh junta quadros + músicas.
//   python3 -m http.server 8765   (na raiz do repositório)
//   NODE_PATH=/opt/node-tools/node_modules node tools/video_abertura.js <pasta-dos-quadros>
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2] || 'quadros';
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(OUT + '/' + f);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 960, height: 720 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/rpg/?debug');
  await p.waitForFunction(() => window.__G && window.__G.data);
  await p.waitForTimeout(2500);
  await p.evaluate(() => {
    const G = window.__G;
    window.requestAnimationFrame = () => 0;      // para o laço; daqui em diante quem avança é o gravador
    G.Audio.muted = true; G.Audio.play = () => {}; G.Audio.sfx = () => {};
    G.fastBattle = true; G.S = 3;
    const I = G.Input;
    // limpa tudo o que estiver rodando (roteiros pendentes ficam esquecidos)
    window.__reset = () => { G.waiters.length = 0; G.overlays.length = 0; G.fx.length = 0; G.lock = 0; G.fadeA = 0; G.flashA = 0; G.debug.auto = false; I.held = {}; };
    window.__cap = async n => {
      const out = [];
      for (let i = 0; i < n; i++) {
        if (window.__hold) for (const k of window.__hold) I.held[k] = true;
        if (window.__tick) window.__tick();
        G.update(); G.update(); G.draw();
        await new Promise(r => setTimeout(r, 0));
        out.push(G.canvas.toDataURL('image/jpeg', 0.9).slice(23));
      }
      return out;
    };
    // cartões de texto (abertura e final)
    window.__card = (lines, opt = {}) => {
      const ov = { t: 0, update() { this.t++; }, draw(ctx) {
        ctx.fillStyle = '#05020a'; ctx.fillRect(0, 0, G.W, G.H);
        if (opt.bg) opt.bg(ctx, this.t);
        let y = opt.y || 92;
        lines.forEach(([s, c, sz, bold], i) => {
          const a = G.clamp((this.t - i * 16) / 24, 0, 1) * G.clamp(((opt.len || 9999) - this.t) / 18, 0, 1);
          ctx.globalAlpha = a; if (s) G.text(ctx, s, G.W / 2, y, c, sz, 'center', bold); y += sz + 7;
        });
        ctx.globalAlpha = 1;
      } };
      G.overlays.length = 0; G.overlays.push(ov); return ov;
    };
    window.__party1 = () => {
      const D = G.data; G.book = 1; G.state = D.newState(); D.addHero('thornox'); D.addHero('lyra');
      for (const h of G.state.party) { h.lv = 32; D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; }
      G.debug.noEnc = true;
    };
    window.__party2 = (ids, lv) => {
      const D = G.data; G.book = 2; G.state = D.newState2();
      G.state.party = G.state.party.filter(h => ids.includes(h.id));
      for (const id of ids) if (!G.state.party.some(h => h.id === id)) D.addHero(id);
      G.state.party.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      for (const h of G.state.party) { h.lv = lv; D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; }
      G.debug.noEnc = true;
    };
    // batalha que se joga sozinha, variando entre ataque e técnicas para mostrar os golpes
    window.__autoBattle = (ids, opt) => {
      G.debug.auto = true;
      let n = 0;
      G.debug.menuPick = (o, items) => {
        const labels = items.map(it => it.label);
        if (labels.includes('Atacar')) { n++; const t = labels.indexOf('Técnica'); return t >= 0 && !items[t].disabled && n % 3 !== 1 ? t : 0; }
        const ok = items.map((it, i) => it.disabled ? -1 : i).filter(i => i >= 0);
        if (o.title && /Técnicas/.test(o.title)) { const atk = ok.filter(i => !/Cura|Bênção|Escudo|Luz que|Remédio/.test(items[i].label)); return (atk.length ? atk : ok)[n % (atk.length || ok.length)]; }
        return ok[0] || 0;
      };
      G.run(() => G.battle(ids, Object.assign({ noEscape: true }, opt)));
    };
  });

  let frame = 0;
  async function rec(n) {
    while (n > 0) {
      const k = Math.min(n, 30); n -= k;
      const imgs = await p.evaluate(k => window.__cap(k), k);
      for (const s of imgs) fs.writeFileSync(`${OUT}/${String(frame++).padStart(5, '0')}.jpg`, Buffer.from(s, 'base64'));
    }
  }
  const ev = (fn, arg) => p.evaluate(fn, arg);
  const marks = [];
  const mark = name => marks.push([name, +(frame / 30).toFixed(2)]);

  // 1) abertura: o desenho de escola
  mark('abertura');
  await ev(() => { __reset(); __card([['Há 45 anos, numa brincadeira de escola,', '#e8d8c0', 10], ['nasceu um personagem.', '#ffcf6a', 10]], { y: 100, len: 120 }); });
  await rec(120);
  await ev(() => { const G = __G, im = G.gfx.imgs.desenho; __card([['', '', 120], ['Um desenho de caneta azul, cheio de espinhos.', '#c9bfd8', 8]], { y: 40, len: 135, bg(ctx, t) {
    if (!im) return; const a = G.clamp(t / 20, 0, 1) * G.clamp((135 - t) / 18, 0, 1), h = 132, w = im.width * h / im.height;
    ctx.globalAlpha = a; ctx.fillStyle = '#c9a24a'; ctx.fillRect(G.W / 2 - w / 2 - 3, 26, w + 6, h + 6); ctx.drawImage(im, G.W / 2 - w / 2, 29, w, h); ctx.globalAlpha = 1; } }); });
  await rec(135);
  await ev(() => { __card([['Ele virou uma história em dois livros.', '#e8d8c0', 10], ['', '', 6], ['REINO QUEBRADO', '#c9a24a', 16, true], ['O REINO DA ESCOLHA', '#b8a8ff', 13, true]], { y: 78, len: 135 }); });
  await rec(135);

  // 2) tela título (Livro I, depois Livro II)
  mark('titulo');
  await ev(() => { __reset(); const G = __G; G.book = 1; G.titleScreen(); });
  await rec(100);
  await ev(() => { __G.book = 2; });
  await rec(80);

  // 3) Livro I: andando pelo mapa e conversa
  mark('mapa');
  await ev(() => { __reset(); __party1(); const G = __G; G.enterField('vila', 13, 14, 'right'); G.fadeA = 1; G.run(() => G.fade(0, 20)); window.__hold = ['right']; });
  await rec(55);
  await ev(() => { window.__hold = ['down']; });
  await rec(30);
  await ev(() => { window.__hold = null; __G.Input.held = {}; const G = __G; G.run(async () => { await G.say('Thornox', '— Irmão, o Reino está quebrado. Mas a gente ainda está aqui.'); }); });
  await rec(95);
  await ev(() => { __G.Input.hit('a'); });
  await rec(6);
  await ev(() => { __G.Input.held = {}; });

  // 4) masmorra em 3D
  mark('masmorra');
  await ev(() => { __reset(); const G = __G; G.enterDungeon('abismo'); if (G.Dungeon) G.Dungeon.banner = 0; });
  await rec(40);
  await ev(() => { __G.Input.hit('right'); }); await rec(2); await ev(() => { __G.Input.held = {}; });
  await rec(26);
  await ev(() => { window.__hold = ['up']; });
  await rec(40);
  await ev(() => { window.__hold = null; __G.Input.held = {}; });

  // 5) batalhas do Livro I
  mark('batalha1');
  await ev(() => { __reset(); __party1(); __autoBattle(['devorador'], { bg: 'cidade', noTransition: true }); });
  await rec(330);
  mark('batalha1b');
  await ev(() => { __reset(); __party1(); __autoBattle(['sombraQuatro', 'carcereiro'], { bg: 'colheita', noTransition: true }); });
  await rec(240);

  // 6) Livro II
  mark('livro2');
  await ev(() => { __reset(); __card([['LIVRO II', '#b8a8ff', 10], ['O Reino da Escolha', '#e8d8c0', 16, true], ['', '', 6], ['Novos heróis. Novos mundos.', '#a89a8a', 8], ['Às vezes, vencer não é lutar.', '#c9bfd8', 8]], { y: 84, len: 120 }); });
  await rec(120);
  mark('mapa2');
  await ev(() => { __reset(); __party2(['kravenox', 'thornox', 'erya', 'mae'], 60); const G = __G; G.MAPS.escolha.step = {}; G.enterField('escolha', 16, 19, 'up'); G.fadeA = 1; G.run(() => G.fade(0, 20)); window.__hold = ['up']; });
  await rec(50);
  await ev(() => { window.__hold = null; __G.Input.held = {}; const G = __G; G.run(async () => { await G.say('Erya', '— Aqui, cada caminho é uma escolha. E nem toda escolha se vence com a espada.'); }); });
  await rec(90);
  await ev(() => { __G.Input.hit('a'); });
  await rec(4);
  await ev(() => { __G.Input.held = {}; });
  mark('batalha2');
  await ev(() => { __reset(); __party2(['kravenox', 'thornox', 'erya', 'mae'], 60); __autoBattle(['mascarado', 'herdeiro', 'herdeiro'], { bg: 'espinhos', noTransition: true }); });
  await rec(300);
  mark('chefe');
  await ev(() => { __reset(); __party2(['kravenox', 'thornox', 'erya', 'mae'], 70); __autoBattle(['reiUltimo'], { bg: 'ultimoMundo', noTransition: true, intro: 'O Rei do Último Mundo se levanta do trono de ossos.' }); });
  await rec(300);

  // 7) final
  mark('final');
  await ev(() => { __reset(); const G = __G; G.book = 1; __card([
    ['KRAVENOX', '#e8d8c0', 30, true], ['', '', 4],
    ['Livro I — O Reino Quebrado', '#c9a24a', 10], ['Livro II — O Reino da Escolha', '#b8a8ff', 10], ['', '', 10],
    ['Jogue grátis no navegador e no celular', '#a89a8a', 8], ['the3dig.github.io/kravenox-jogar/rpg', '#ffcf6a', 8],
  ], { y: 50, bg(ctx, t) { G.gfx.glow(ctx, G.W / 2, 70, 140, 'rgba(255,90,60,' + (0.12 + 0.05 * Math.sin(t / 20)) + ')'); } }); });
  await rec(240);

  fs.writeFileSync(OUT + '/../marcas.json', JSON.stringify({ marks, total: +(frame / 30).toFixed(2) }));
  console.log('quadros:', frame, (frame / 30).toFixed(1) + 's', JSON.stringify(marks));
  console.log(errs.length ? 'ERROS:\n' + errs.join('\n') : 'sem erros');
  await b.close();
})();
