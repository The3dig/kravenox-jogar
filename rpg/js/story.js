'use strict';
// Roteiros da Parte 1 — Capítulos 1 a 13 de "Reino Quebrado".
(function () {
  const S = G.story = {};
  const D = G.data;
  const F = () => G.state.flags;
  const say = (n, t) => G.say(n, t);
  const nar = t => G.say(null, t);
  const K = 'Kravenox', T = 'Thornox', L = 'Lyra';

  async function vision(lines, music = 'memoria') {
    const prev = G.Audio.cur; G.Audio.play(music); G.Audio.sfx('memory');
    G.flash('#ffffff', 0.9);
    await G.narrate(lines, { color: '#f0e6c8', bg: '#0a0806', backdrop: (ctx, t) => { G.gfx.glow(ctx, G.W / 2, G.H / 2, 140, 'rgba(255,220,140,0.25)', 0.6 + 0.2 * Math.sin(t / 30)); } });
    G.Audio.cur = null; G.Audio.play(prev);
  }
  async function warpField(id, x, y, dir) { await G.fade(1, 16); G.enterField(id, x, y, dir); await G.fade(0, 16); }
  async function warpDungeon(id, x, y, dir) { await G.fade(1, 16); G.enterDungeon(id, x, y, dir); await G.fade(0, 16); }
  async function bell(n = 1) { for (let i = 0; i < n; i++) { G.Audio.sfx('bell'); G.shake = 10; await G.wait(50); } }
  async function heal(text) { D.healAll(); G.Audio.sfx('heal'); G.flash('#ffe8a0', 0.5); if (text) await nar(text); }

  S.evDone = function (map, c) {
    const f = F(); const m = {
      abismo: { a: 'marca', b: 'enxame' }, templo: { e: 'thornox', b: 'raizNegra' }, caverna: { a: 'arauto', e: 'camara', b: 'coisa' },
      submersa: { l: 'lyra', r: 'portaoRio', d: 'porta', f: 'fim' } }[map];
    return !!(m && m[c] && f[m[c]]);
  };

  // ===================== PRÓLOGO =====================
  S.prologo = async function () {
    G.Audio.play('title');
    await G.narrate([
      'O mundo não terminou quando o Cisma aconteceu.\nEle apenas começou a morrer.',
      'Antes de o Reino ser quebrado, existia a Essência. Ela não era simplesmente magia. Era a força que fazia as coisas existirem.',
      'No centro do mundo havia a Fonte Pura.',
      'Foi nesse mundo que nasceram dois irmãos.\nThornox e Kravenox.',
      'Thornox aprendeu a proteger.\nKravenox aprendeu a questionar.',
      'Então o Reino começou a adoecer. Kravenox descobriu que a Fonte Pura não estava apenas protegendo o mundo.\nEla estava contendo alguma coisa.',
      'Uma acusação. Uma batalha. Uma escolha.\nE finalmente, o Grande Cisma.',
      'Quando o Cisma terminou, Thornox desapareceu.\nKravenox desapareceu.\nE o Reino nunca mais foi o mesmo.',
      'Séculos se passaram.\nAté que, nas profundezas do Abismo Carmesim, um cristal negro começou a pulsar.',
    ], { hold: 220 });
  };
  // Despertar (Cap. 1): o cristal pulsa, racha e explode; os olhos se abrem na masmorra
  async function anim(obj, key, to, frames) {
    const from = obj[key]; if (G.debug.fast) { obj[key] = to; return; }
    for (let f = 1; f <= frames; f++) { const k = f / frames; obj[key] = from + (to - from) * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2); await G.wait(1); }
  }
  function wakeFx(W) {
    const cracks = [[[160, 66], [156, 84], [163, 98], [158, 118], [164, 140]], [[158, 100], [146, 110], [140, 126]], [[162, 92], [176, 104], [181, 122]], [[157, 124], [148, 146]], [[164, 76], [172, 70]]];
    return {
      upd() { W.t++; for (const p of W.parts) { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.t++; } W.parts = W.parts.filter(p => p.t < p.life); return W.phase !== 'fim'; },
      draw(ctx) {
        const cx = 160, cy = 110;
        if (W.phase === 'cristal' || W.phase === 'escuro') {
          ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, G.H);
          if (W.phase === 'cristal') {
            const beat = Math.max(0, Math.sin(W.t / 12)) ** 8;
            G.gfx.glow(ctx, cx, cy, 90, 'rgba(200,20,30,0.8)', 0.15 + 0.35 * beat + W.crack * 0.3);
            ctx.fillStyle = '#07040a'; ctx.beginPath(); ctx.moveTo(cx, cy - 62); ctx.lineTo(cx + 26, cy - 8); ctx.lineTo(cx + 14, cy + 48); ctx.lineTo(cx, cy + 58); ctx.lineTo(cx - 16, cy + 46); ctx.lineTo(cx - 25, cy - 6); ctx.fill();
            ctx.strokeStyle = 'rgba(120,30,60,' + (0.4 + 0.4 * beat) + ')'; ctx.lineWidth = 1; ctx.stroke();
            ctx.fillStyle = 'rgba(80,40,90,0.5)'; ctx.beginPath(); ctx.moveTo(cx, cy - 62); ctx.lineTo(cx - 25, cy - 6); ctx.lineTo(cx - 6, cy - 4); ctx.fill();
            // rachaduras vermelhas
            const n = W.crack * cracks.length;
            cracks.forEach((pl, i) => {
              const k = Math.max(0, Math.min(1, n - i)); if (!k) return;
              ctx.strokeStyle = '#ff3a1e'; ctx.lineWidth = 1.3; ctx.shadowColor = '#ff2a10'; ctx.shadowBlur = 6;
              ctx.beginPath(); ctx.moveTo(pl[0][0], pl[0][1]);
              const segs = (pl.length - 1) * k;
              for (let s = 1; s <= Math.ceil(segs); s++) { const a = pl[s - 1], b = pl[s], kk = Math.min(1, segs - (s - 1)); ctx.lineTo(a[0] + (b[0] - a[0]) * kk, a[1] + (b[1] - a[1]) * kk); }
              ctx.stroke(); ctx.shadowBlur = 0;
            });
          }
          for (const p of W.parts) { ctx.globalAlpha = 1 - p.t / p.life; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); }
          ctx.globalAlpha = 1;
          return;
        }
        if (W.phase === 'olhos') {
          // visão turva e avermelhada, pálpebras que se abrem
          const k = W.open;
          ctx.fillStyle = 'rgba(110,0,0,' + (0.5 * (1 - Math.min(1, k * 1.2))) + ')'; ctx.fillRect(0, 0, G.W, G.H);
          const g = k * G.H * 0.75;
          ctx.fillStyle = '#000'; ctx.shadowColor = '#000'; ctx.shadowBlur = 14;
          ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(G.W + 20, -20); ctx.lineTo(G.W + 20, cy - g * 0.35); ctx.quadraticCurveTo(cx, cy - g * 1.25, -20, cy - g * 0.35); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-20, G.H + 20); ctx.lineTo(G.W + 20, G.H + 20); ctx.lineTo(G.W + 20, cy + g * 0.35); ctx.quadraticCurveTo(cx, cy + g * 1.25, -20, cy + g * 0.35); ctx.closePath(); ctx.fill();
          ctx.shadowBlur = 0;
        }
      },
    };
  }
  S.despertar = async function () {
    G.fadeA = 1; G.fadeAboveUI = false;
    G.Audio.play('abismo');
    await G.narrate(['Capítulo 1\nO Despertar no Reino Quebrado'], { hold: 120, color: '#ffcf6a' });
    const W = { phase: 'cristal', t: 0, crack: 0, open: 0, parts: [] };
    G.Dungeon.noHud = true; G.Dungeon.dialogTop = false;
    G.fx.push(wakeFx(W));
    G.fadeA = 0;
    let beating = true;
    (async () => { while (beating) { G.Audio.sfx('heart'); await G.wait(G.debug.fast ? 1 : 75); } })();
    await nar('Nas profundezas do Abismo Carmesim, um cristal negro pulsava.');
    await nar('Devagar...');
    beating = false;
    G.Audio.sfx('crack'); G.shake = 6;
    const crk = anim(W, 'crack', 1, 150);
    (async () => { for (let i = 0; i < 4 && !G.debug.fast; i++) { await G.wait(36); G.Audio.sfx('crack'); G.shake = 4; } })();
    await nar('Ele rachou. Uma linha vermelha atravessou sua superfície. Depois outra.');
    await crk;
    await nar('O som parecia pequeno, mas ecoou pelas cavernas como o primeiro sino de uma cerimônia esquecida.');
    // explosão
    G.Audio.sfx('boom'); G.flash('#ff3a2a', 0.9); G.shake = 24;
    for (let i = 0; i < 90; i++) { const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 4; W.parts.push({ x: 160, y: 110, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, t: 0, life: 50 + Math.random() * 40, s: 1 + (Math.random() * 3 | 0), c: Math.random() < 0.25 ? '#ff3a1e' : '#2a1838' }); }
    W.phase = 'escuro';
    await nar('O cristal estremeceu. Então explodiu.');
    await nar('Do interior, uma silhueta espinhosa caiu de joelhos. Por alguns segundos, não houve movimento.');
    // os olhos se abrem: estamos dentro da masmorra, vendo pelos olhos dele
    W.phase = 'olhos'; W.open = 0;
    await G.wait(30);
    await anim(W, 'open', 0.22, 45); await anim(W, 'open', 0, 14); await G.wait(20);
    await anim(W, 'open', 0.45, 40); await anim(W, 'open', 0.12, 10);
    await nar('Então dois olhos se abriram. Brasa.');
    await anim(W, 'open', 1, 60);
    // olha em volta, sem reconhecer nada
    const D2 = G.Dungeon; D2.lookSpeed = 0.035;
    D2.look = -1.1; await G.wait(80);
    D2.look = 1.0; await G.wait(110);
    D2.look = 0; await G.wait(60); D2.lookSpeed = 0;
    W.phase = 'fim'; G.Dungeon.noHud = false; G.Dungeon.dialogTop = true; G.Dungeon.banner = 150;
    await nar('Ele levantou a cabeça. Não reconhecia o lugar. Não reconhecia o próprio corpo. Mas reconhecia uma sensação.');
    await nar('Fome.');
    await nar('Kravenox respirou. O ar entrou em seus pulmões como se o próprio Abismo tivesse esperado séculos por aquele momento.');
    await nar('Ao redor dele, os fungos que cresciam nas fendas da rocha se apagaram, um a um, como se a própria vida recuasse diante de sua presença.');
    await say(K, '— A Essência... ainda vive...');
    await say(K, '— Ainda está fraca.');
    await say(K, '— É hora de terminar o que comecei.');
    await nar('Ele não sabia exatamente o que havia começado. Essa era a parte que o incomodava.');
    await vision(['Um trono feito de raízes vivas.', 'Thornox de pé diante dele, protegendo uma criança envolta em luz dourada.', 'A terra tremendo.\nO grito de algo mais antigo que os dois.']);
    await nar('A visão se desfez, deixando uma dor aguda atrás dos olhos.');
    await nar('Então veio o som. Rastejante. Úmido. Numeroso.');
    await G.battle(['larva', 'larva'], { bg: 'abismo', intro: 'Larvas da Essência saem das rachaduras do chão!', noEscape: true });
    await G.say(null, 'Dica: B abre o menu. Na masmorra, ↑ anda, ← → viram e ↓ dá meia-volta. Cristais dourados restauram e registram o jogo.');
    D.save();
  };

  // ===================== ABISMO CARMESIM =====================
  S.abismoMarca = async function () {
    if (F().marca) return;
    F().marca = 1;
    await nar('A câmara está cheia de restos de uma civilização morta. Em uma parede há duas marcas.');
    await nar('Dois espinhos entrelaçados.');
    G.Audio.sfx('memory');
    await say(K, '— Nós...');
    await nar('A palavra morreu em sua garganta.');
  };
  S.abismoEnxame = async function () {
    if (F().enxame) return;
    await nar('O túnel se alarga. Das rachaduras, dezenas de criaturas deformadas avançam ao mesmo tempo.');
    await say(K, '— Venham.');
    await G.battle(['larva', 'larvaMae', 'larva'], { bg: 'abismo', noEscape: true });
    F().enxame = 1;
    await nar('Kravenox olhou para os restos das criaturas. Não sentiu triunfo. Sentiu preocupação.');
    await say(K, '— Se essas coisas ainda existem...');
    await nar('Então o Reino não estava apenas morto. Estava infectado.');
  };
  S.sairAbismo = async function () {
    await nar('A escadaria parecia não ter fim. A escuridão do Abismo dava lugar a uma bruma tênue. O vento começou a tocar seu rosto.');
    await warpField('reino', 5, 25, 'up');
    if (!F().superficie) {
      F().superficie = 1;
      await nar('O mundo diante dele era irreconhecível. Planícies cinzentas. Montanhas quebradas. Cristais negros espetados no solo como túmulos.');
      await nar('Ao longe, uma torre partida erguia-se contra um céu vermelho.');
      await say(K, '— A antiga fronteira da Ordem da Essência...');
      await nar('Entre as colinas, a nordeste, há uma vila abandonada. De dentro de uma das construções vem uma luz fraca. Dourada.');
      D.save();
    }
  };
  S.entrarAbismo = async function () {
    const i = await G.choose('A escadaria desce de volta ao Abismo Carmesim. Descer?', ['Descer', 'Ficar']);
    if (i === 0) await warpDungeon('abismo', 11, 12, 0);
    else { G.Field.px = 5; G.Field.py = 25; G.Field.dir = 'up'; }
  };

  // ===================== REINO =====================
  S.torre = async () => { await nar('A torre partida ergue-se contra o céu vermelho.'); await nar('Kravenox tem a sensação de que alguém observa seus passos lá do alto. E essa presença conhece seu nome.'); };
  S.cristalNegro = async () => nar(G.pick(['Cristais negros espetados no solo como túmulos.', 'O cristal está frio. Algo pulsa lá dentro, devagar.', 'Um cristal escurecido. A Essência aqui morreu há muito tempo.']));
  S.raizesBloqueio = async () => { if (F().vila) return; await nar('Raízes negras fecham a estrada para a Floresta Morta.'); await nar('A luz dourada na vila parece chamar por ele.'); };
  S.raizesBloqueio2 = async () => { if (F().guardiao1) return; await nar('Raízes antigas, vivas e cheias de espinhos, fecham a trilha. Elas recuam um pouco quando Kravenox se aproxima... mas não cedem.'); };
  S.abismoOlhar = async (x, y) => {
    // a grande cratera do sudeste guarda um segredo
    if (G.Field.id === 'reino' && x >= 26 && y >= 20) return S.crateraSecreta();
    if (G.Field.id === 'reino' && x >= 11 && x <= 12 && y >= 8 && y <= 9) return S.reflexoFuturo();
    return nar('Uma fenda sem fundo. Lá embaixo, algo pulsa em vermelho.');
  };
  S.crateraSecreta = async function () {
    await nar('Uma cratera imensa. No fundo, um redemoinho violeta gira devagar, e o chão ao redor está coberto de larvas e olhos que não piscam.');
    await say(K, '— Isso... é onde o Cisma rasgou o mundo.');
    if (G.gfx.imgs.cratera) await G.showImage(G.gfx.imgs.cratera, 'A Cratera do Cisma');
    const i = await G.choose('Descer até o fundo da cratera? (Abre outro jogo. Seu progresso aqui será salvo.)', ['Descer', 'Ficar']);
    if (i !== 0) return;
    D.save();
    await nar('Kravenox salta. A escuridão o engole.');
    await G.fade(1, 40, '#1a0a2a');
    if (!G.debug.auto) location.href = '../';
  };
  // Easter egg: o Kravenox de outro tempo, que um dia ele será
  S.reflexoFuturo = async function () {
    if (F().futuro) return nar('A fenda mostra apenas escuridão agora. Mas Kravenox sabe o que viu.');
    await nar('Kravenox se inclina sobre a fenda. Lá no fundo, a escuridão é tão lisa que parece um espelho.');
    await nar('O reflexo pisca.\nEle não piscou.');
    const prev = G.Audio.cur; G.Audio.play('abismo');
    G.Audio.sfx('heart'); G.shake = 6; G.flash('#ff2020', 0.6);
    await G.wait(30); G.Audio.sfx('heart');
    if (G.gfx.imgs.k_futuro) await G.showImage(G.gfx.imgs.k_futuro, 'Armadura negra. Garras de fogo. Olhos que já viram o fim.');
    await say(K, '— ...Quem é você?');
    await nar('O reflexo não responde. Só sorri, como quem já sabe como tudo termina.');
    await nar('Então a superfície se quebra, e a fenda volta a ser só uma fenda.');
    await say(K, '— (Aquilo... era eu?)');
    F().futuro = 1;
    G.Audio.cur = null; G.Audio.play(prev);
  };
  S.memoriaEstrada = async function () {
    if (F().mem1) return; F().mem1 = 1;
    await nar('A cada passo, uma memória surgia.');
    await vision(['Uma criança correndo.', 'Uma mão segurando a sua.', 'Uma voz rindo.\nThornox.', 'Depois sangue.\nMuito sangue.']);
    await say(K, '— O que aconteceu conosco?');
    await nar('Não houve resposta. Apenas o vento.');
  };

  // ===================== VILA SEM NOME =====================
  S.entrarVila = async function () {
    await warpField('vila', 10, 14, 'up');
    if (!F().vilaChegou) {
      F().vilaChegou = 1;
      await G.narrate(['Capítulo 2\nEcos do Cisma'], { hold: 100, color: '#ffcf6a' });
      await nar('A vila parecia morta, mas Kravenox sabia que lugares verdadeiramente mortos não guardavam luz.');
      await nar('As casas estavam cobertas por raízes negras. No centro da praça havia uma estátua.');
    }
  };
  S.sairVila = async function () {
    if (F().fragmento && !F().vila) { await nar('Passos pesados cercam a vila. Não há como sair agora.'); G.Field.py -= 1; G.Field.dir = 'up'; return; }
    await warpField('reino', 18, 17, 'down');
  };
  S.estatua = async function () {
    if (F().estatua) { await nar('ESPINHOS. Dois irmãos de pedra, sem rosto.'); return; }
    F().estatua = 1;
    await nar('Dois irmãos de pedra. Um segurava uma lâmina. O outro, um cajado. Os rostos haviam sido destruídos.');
    await nar('Kravenox tocou a base. Uma palavra permanecia gravada.');
    await nar('ESPINHOS.');
    await vision(['Ele viu Thornox diante da estátua.\nViu os dois discutindo.\nViu fogo.', '— Se você atravessar aquela porta, Kravenox, não haverá retorno.']);
    await say(K, '— Que porta?');
    await nar('A luz dourada dentro de uma das casas aumentou.');
  };
  S.portaVazia = async (x, y) => {
    if (x === 4 && y === 3) return S.desenhoAntigo();
    if (x === 18 && y === 11) return S.estatuetaAzul();
    return nar(G.pick(['Portas abertas. Casas vazias. Nenhuma fumaça. Nenhuma voz.', 'Marcas profundas na madeira, como se tivessem sido feitas por garras.', 'Símbolos apagados da Ordem da Essência cobrem a parede.']));
  };
  S.desenhoAntigo = async function () {
    await nar('A porta range. Lá dentro, a casa está vazia. Na parede, preso por um espinho, um papel amarelado.');
    const img = G.gfx.imgs.desenho;
    if (img) await G.showImage(img, 'Um desenho antigo, feito à mão por uma criança, muito antes do Cisma.');
    if (!F().desenho) {
      F().desenho = 1;
      await say(K, '— ...');
      await nar('Kravenox não sabe por quê, mas guarda a imagem na memória.');
    }
  };
  // Easter egg: a estatueta azul do irmão
  S.estatuetaAzul = async function () {
    await nar('A porta está emperrada, mas cede. Numa prateleira coberta de pó há uma estatueta azul, pequena, de um menino cheio de espinhos sorrindo.');
    if (G.gfx.imgs.thornox_fig) await G.showImage(G.gfx.imgs.thornox_fig, 'Na base, letras gastas: THORNOX.');
    if (!F().estatueta) {
      F().estatueta = 1;
      await say(K, '— Ele nunca sorriu assim pra mim.');
      await nar('Kravenox fica olhando por muito tempo. Depois fecha a porta com cuidado, como se alguém ainda dormisse lá dentro.');
    }
  };
  S.poco = async () => nar('Um poço seco.');
  S.fogueira = async () => nar('O fogo estala. É a única coisa quente nesta vila.');
  S.mascate = async function () {
    F().mascateN = (F().mascateN || 0) + 1;
    if (F().mascate && F().mascateN === 7) {
      await say('Mascate de Cinzas', '— Você de novo. Sabe... dizem que você não nasceu do Cisma.');
      await say('Mascate de Cinzas', '— Dizem que, num outro mundo, uma criança te desenhou num caderno. Com caneta azul. Há quarenta e cinco anos.');
      await say(K, '— Isso é absurdo.');
      await say('Mascate de Cinzas', '— É. Mas explica por que você não morre. Desenhos não morrem. Só mudam de mundo.');
    }
    if (!F().mascate) {
      F().mascate = 1;
      await say('Mascate de Cinzas', '— Não olhe para mim assim. Eu só vendo.');
      await say('Mascate de Cinzas', '— Espinhos negros... olhos de brasa. Os velhos contavam histórias sobre alguém assim. Ninguém acreditava nelas.');
      await say(K, '— E você acredita?');
      await say('Mascate de Cinzas', '— Eu acredito em fragmentos. Os cristais que as criaturas carregam valem alguma coisa. Traga-os e eu troco por o que você precisar.');
    }
    await G.shop('Mascate de Cinzas', ['seiva', 'cristal', 'raiz', 'nevoa', 'garrasAbismo', 'couraca', 'cajadoOrdem'], 8);
  };
  S.entrarCasa = async function () { await warpField('casa', 4, 6, 'up'); };
  S.sairCasa = async function () {
    await warpField('vila', 17, 4, 'down');
    if (F().fragmento && !F().vila) await S.sentinelas();
  };
  S.ancia = async function () {
    if (!F().ancia) {
      F().ancia = 1;
      await nar('No interior havia uma mulher idosa. Ou aquilo que um dia fora uma mulher. Raízes atravessavam seus braços e desapareciam sob o chão.');
      await say('Mulher das Raízes', '— Você demorou.');
      await say(K, '— Quem é você?');
      await say('Mulher das Raízes', '— Alguém que esperou muito mais do que você.');
      await say(K, '— Onde está Thornox?');
      await say('Mulher das Raízes', '— Ainda pergunta por ele?');
      await say(K, '— Responda.');
      await say('Mulher das Raízes', '— Se eu soubesse onde ele está, talvez estivesse morta.');
      await nar('A mulher apontou para o fundo da casa. Havia um pequeno fragmento dourado sobre uma mesa.');
      await nar('A Essência.');
    } else if (!F().fragmento) await say('Mulher das Raízes', '— Toque-o. É para isso que você voltou, não é?');
    else await say('Mulher das Raízes', '— Eles encontraram você. Vá.');
  };
  S.fragmento = async function () {
    if (F().vila) { await nar('O fragmento dourado está apagado.'); return; }
    if (!F().ancia) { await nar('Um pequeno fragmento dourado pulsa sobre a mesa. Alguém, no canto escuro da casa, observa você.'); return; }
    if (F().fragmento) { await nar('A luz do fragmento treme.'); return; }
    F().fragmento = 1;
    await nar('Quando seus dedos tocaram o fragmento, o mundo desapareceu.');
    await vision(['E pela primeira vez em séculos, ele lembrou.', 'Thornox não estava tentando destruí-lo.', 'Estava tentando salvá-lo.']);
    await say(K, '— Não...');
    await say('Mulher das Raízes', '— Agora você começa a lembrar.');
    G.Audio.sfx('hurt'); G.shake = 10;
    await nar('Do lado de fora, um grito cortou a noite. Depois outro. E dezenas de passos começaram a cercar a vila.');
    await say('Mulher das Raízes', '— Eles encontraram você.');
    await say(K, '— Quem?');
    await say('Mulher das Raízes', '— Aqueles que nunca esqueceram o Cisma.');
    await nar('Pela primeira vez desde seu despertar, Kravenox sentiu algo diferente da fome. Medo.');
  };
  S.sentinelas = async function () {
    G.Audio.play('chefe');
    await G.narrate(['Capítulo 3\nAs Sentinelas'], { hold: 90, color: '#ffcf6a' });
    await nar('Armaduras negras surgem entre a névoa. Runas apagadas. Espadas corroídas pelo tempo. Dentro dos elmos, pontos violetas brilham na escuridão.');
    await say(K, '— Então venham.');
    await G.battle(['sentinela', 'sentinela'], { bg: 'vila', noEscape: true, intro: 'Sentinelas do Vazio cercam a praça!' });
    await nar('Mas levantaram-se. Não estavam tentando matá-lo. Estavam tentando levá-lo para algum lugar.');
    await say('Mulher das Raízes', '— Eles querem descobrir se você ainda possui a Essência.');
    await say(K, '— E se eu possuir?');
    await say('Mulher das Raízes', '— Então o mundo inteiro saberá que o pesadelo voltou.');
    await say(K, '— Deixe que saibam.');
    await heal('A luz do fragmento atravessa a porta e envolve Kravenox. Suas forças voltam.');
    await nar('Um dos Sentinelas permanece parado. Apenas observa. Então leva a mão ao próprio elmo... e o retira.');
    await nar('Não havia rosto. Apenas uma massa escura, cristalizada, pulsando como um coração.');
    await vision(['— Kravenox! Não toque na Fonte!', 'Então outra voz. Mais profunda. Mais antiga.\n— Deixe-o tocar.']);
    await say('Sentinela sem Rosto', '— Você lembra.');
    await say(K, '— Quem é você?');
    await say('Sentinela sem Rosto', '— Um dos que estavam lá.');
    await say(K, '— No Cisma? Então me diga o que aconteceu.');
    await say('Sentinela sem Rosto', '— Não. Porque você ainda não está pronto.');
    await say(K, '— Não decida isso por mim.');
    await say('Sentinela sem Rosto', '— Você sempre teve esse problema.');
    await G.battle(['semRosto'], { bg: 'vila', noEscape: true, noTransition: false, events: [{
      when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.4,
      run: async () => {
        await say('Sentinela sem Rosto', '— O Cisma não começou entre vocês.');
        await say(K, '— O quê?');
        await say('Sentinela sem Rosto', '— Vocês foram apenas os primeiros a perceber.');
        G.flash('#b26bff', 1); G.Audio.sfx('boom'); G.shake = 20;
        return 'end';
      } }] });
    await nar('O Sentinela explodiu em energia violeta. Quando Kravenox conseguiu se levantar, o guerreiro havia desaparecido. Os outros também.');
    await say('Mulher das Raízes', '— Agora você entende por que não deveria ter voltado.');
    await say(K, '— O que existe dentro da Fonte?');
    await say('Mulher das Raízes', '— Você realmente quer saber?');
    await say(K, '— Quero.');
    await say('Mulher das Raízes', '— Então procure o Templo da Primeira Raiz. Além da Floresta Morta.');
    await say(K, '— E lá encontrarei Thornox?');
    await say('Mulher das Raízes', '— Talvez. Sei onde ele esteve.');
    await say(K, '— Então me leve até lá.');
    await say('Mulher das Raízes', '— Eu não posso. Porque eu nunca saí daqui.');
    await nar('Pela primeira vez, Kravenox percebeu que as raízes não eram parte da criatura. Eram uma prisão.');
    await say(K, '— Quem fez isso?');
    await say('Mulher das Raízes', '— Aquele que vocês chamavam de guardião.');
    await say(K, '— Thornox?');
    await say('Mulher das Raízes', '— Não. O outro. Antes dos irmãos. E foi ele quem encontrou a Fonte primeiro.');
    await nar('Uma presença despertou no fundo de sua mente. Não uma memória. Uma voz.');
    await say('???', 'Volte. Volte para onde tudo começou.');
    await vision(['Uma floresta. Uma árvore colossal.\nThornox diante dela.', 'E atrás de Thornox... uma sombra.\nGrande demais para ser humana.', 'Thornox olhou diretamente para Kravenox, como se pudesse vê-lo através dos séculos.\n— Não confie na Fonte.']);
    await nar('Seu irmão estava vivo. Ou estivera vivo.');
    await say('Mulher das Raízes', '— Agora você entende.');
    await say(K, '— Não. Agora eu tenho perguntas.');
    F().vila = 1;
    await nar('Atrás dele, o fragmento dourado se apagou. E as raízes que fechavam a estrada para a Floresta Morta recuaram.');
    G.Audio.play('vila');
    D.save(); G.toast('Jogo salvo.');
  };

  // ===================== FLORESTA MORTA =====================
  S.florestaLira = async function () {
    if (F().lira) return; F().lira = 1;
    await G.narrate(['Capítulo 4\nA Vila Sem Nome'], { hold: 90, color: '#ffcf6a' });
    await nar('Numa pedra à beira da estrada, um símbolo. Dois espinhos entrelaçados.');
    await vision(['Ele e Thornox eram crianças, diante daquela mesma estrada.', '— O perigo nunca fica onde você está olhando.', '— Você fala como os velhos.\n— E você não escuta ninguém.', '— Porque ninguém sabe mais do que eu.\n— Esse é exatamente o seu problema.']);
    await say(K, '— Você sempre teve razão demais.');
    await nar('A Floresta Morta. Nenhum pássaro. Nenhum inseto. A floresta parecia prender a respiração.');
    await say('Lira', '— Não deveria ter vindo.');
    await nar('Uma pequena criatura está sentada sobre um galho. Seus olhos são negros. A pele é coberta por pequenas marcas luminosas.');
    await say(K, '— Quem é você?');
    await say('Lira', '— Essa pergunta é engraçada vindo de você.');
    await say(K, '— Desça. Estou cansado de olhar para cima.');
    await say('Lira', '— Todos conhecem seu nome. As árvores contaram.');
    await say(K, '— As árvores estão mortas.');
    await say('Lira', '— Algumas coisas continuam falando depois de morrer.');
    await say(K, '— O que você sabe sobre Thornox?');
    await say('Lira', '— Sei que ele ainda procura você. No Templo da Primeira Raiz. Mas o templo não deixa qualquer um entrar.');
    await say(K, '— E o que ele quer?');
    await say('Lira', '— Uma lembrança.');
    await nar('A criatura some entre os galhos. Ao norte, no coração da floresta, algo estala.');
  };
  S.florestaGuardiao = async function () {
    if (F().guardiao1) return;
    await nar('As árvores começaram a tremer. Sombras surgiram entre os troncos. Centenas de larvas, maiores, com fragmentos de armaduras presos ao corpo.');
    await say(K, '— Finalmente alguma coisa interessante.');
    await say('Lira', '— Você ainda não aprendeu. Algumas batalhas não foram feitas para serem vencidas.');
    await G.battle(['larvaArmor', 'larvaLonga', 'larvaArmor'], { bg: 'floresta', noEscape: true });
    await nar('Então todas as criaturas pararam. Simultaneamente. Entre os galhos mortos havia uma figura alta, vestida com uma armadura branca rachada. Na mão, uma lança.');
    await nar('Quando seus pés tocaram o chão, todas as larvas recuaram.');
    await say('Guardião Branco', '— Você não deveria existir.');
    await say(K, '— Ouço isso bastante.');
    await say('Guardião Branco', '— Seu retorno despertou aquilo que deveria permanecer adormecido.');
    await say(K, '— Então talvez seja hora de acordá-lo.');
    await say('Lira', '— O Guardião Branco... Guardião daquilo que está enterrado sob a Fonte.');
    await heal();
    await G.battle(['guardiao1'], { bg: 'floresta', noEscape: true, events: [{
      when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.35,
      run: async () => {
        await say(K, '— Espinhos Vorazes.');
        G.Audio.sfx('spines'); G.flash('#000000', 0.9); G.shake = 24;
        await nar('O chão explodiu. Centenas de espinhos surgiram simultaneamente. O Guardião desapareceu entre eles.');
        return 'end';
      } }] });
    await nar('Quando a poeira baixou, não havia corpo. Apenas a lança, cravada no chão.');
    await vision(['Thornox. Mais velho. Ferido. Segurando aquela mesma lança.', '— Se ele voltar, não o mate.\n— Você sabe o que ele fará.', '— Eu sei.\n— Então por que protegê-lo?', '— Porque ele ainda é meu irmão.']);
    await nar('A lança começou a desaparecer. Antes que sumisse de vez, uma palavra apareceu na lâmina: PRIMEIRA RAIZ.');
    await say('Lira', '— Agora você pode ir.');
    await say(K, '— Quem é você?');
    await say('Lira', '— Meu nome era Lira.');
    await say(K, '— Era?');
    await nar('Ela apontou para o próprio peito. Sob a pele havia um cristal negro pulsando.');
    await say('Lira', '— Eu morri há muito tempo. Mas alguém precisa lembrar.');
    F().guardiao1 = 1;
    await nar('Ao norte, as raízes que fechavam a trilha se desfazem em cinzas.');
    await nar('Muito abaixo da floresta, uma voz antiga sussurrou: — O filho do Vazio voltou. — Não. Ele voltou como chave.');
    D.save(); G.toast('Jogo salvo.');
  };
  S.entrarTemplo = async function () {
    if (!F().temploAberto) {
      await G.narrate(['Capítulo 5\nA Primeira Raiz'], { hold: 90, color: '#ffcf6a' });
      await nar('Não havia templo. Não havia porta. Apenas uma parede de pedra. Entre os símbolos, uma pequena inscrição:');
      await nar('"Somente os que carregam a ruptura podem entrar."');
      await say(K, '— Sempre existe uma porta que exige alguma coisa.');
      await nar('Kravenox pressionou a mão contra a pedra. Sua energia negra escorreu pelos dedos. A marca dos dois espinhos brilhou.');
      G.Audio.sfx('door'); G.shake = 16;
      await nar('Uma fissura surgiu. Pedras enormes começaram a se afastar.');
      F().temploAberto = 1;
    }
    await warpDungeon('templo');
  };

  // ===================== TEMPLO DA PRIMEIRA RAIZ =====================
  S.voz = async function (t) { G.Audio.sfx('memory'); await nar('Um cristal na parede brilha. Uma voz surge dentro de sua cabeça:'); await nar(t); };
  S.portaoFechado = async function (id) {
    if (id === 'templo') await nar('Escombros e raízes petrificadas bloqueiam o caminho. Seria preciso uma força diferente para movê-los.');
    else await nar('Uma correnteza de memórias corre por aqui como uma parede de água. Não dá para atravessar.');
  };
  S.temploEstatua = async function () {
    if (F().thornox) return;
    await nar('Uma sala circular. No centro, uma estátua de dois irmãos. Mas havia algo estranho: os rostos eram iguais. Como se fossem duas versões da mesma criatura.');
    await nar('ANTES DE HAVER DOIS, HOUVE UM.');
    await say(K, '— O que isso significa?');
    await say(T, '— Significa que a história que você conhece está errada.');
    G.Audio.play('memoria');
    await nar('Pela primeira vez em séculos, os dois ficaram frente a frente.');
    await say(K, '— Eu procurei você.');
    await say(T, '— Você procurou a Fonte.');
    await say(K, '— Depois de tudo, você ainda vai esconder a verdade de mim?');
    await say(T, '— Estou tentando impedir que você morra.');
    await say(K, '— O que voltou não morreu.');
    await say(T, '— A Fonte não é uma fonte de poder. Durante milhares de anos, a Essência manteve algo adormecido abaixo do Reino.');
    await say(K, '— Então por que me traiu?');
    await say(T, '— Eu não traí você. Você lembra de uma mentira.');
    await say(T, '— Você foi até a Fonte porque ouviu a voz dela. Porque eu também ouvi. A voz prometeu poder.');
    await say(K, '— Então por que foi comigo?');
    await say(T, '— Porque você era meu irmão.');
    await say(K, '— Por que você não me matou?');
    await say(T, '— Porque ainda havia uma maneira de salvar você.');
    await say(K, '— Me prender no cristal. Você me condenou a séculos de escuridão.');
    await say(T, '— Eu condenei você a continuar existindo. Era a única coisa que eu podia fazer.');
    await nar('Os cristais das paredes começaram a apagar. Algo, muito abaixo, sentiu os dois juntos.');
    await say(T, '— Não estamos sozinhos. Fique perto de mim, irmão.');
    D.addHero('thornox'); F().thornox = 1;
    G.Audio.sfx('level');
    await nar('Thornox se junta ao grupo!');
    await nar('Thornox aponta o cajado. Uma luz dourada percorre os escombros ao norte. As pedras começam a flutuar.');
    F().portaoTemplo = 1; G.Audio.sfx('light');
    G.Audio.play('masmorra');
  };
  S.raizNegra = async function () {
    if (F().raizNegra) return;
    await nar('A sala inteira tremeu. Uma voz atravessou a pedra.');
    await say('???', '— Kravenox...');
    await say(T, '— Como ele sabe seu nome?');
    await say('???', '— Porque eu o conheço.');
    await nar('Uma enorme raiz negra surgiu da pedra.');
    await G.battle(['raizNegra'], { bg: 'templo', noEscape: true });
    F().raizNegra = 1;
    await nar('A raiz começou a rir. Uma fissura abriu-se sob os pés dos dois.');
    await say(T, '— Segure em mim!');
    G.Audio.sfx('boom'); G.shake = 30;
    await nar('O templo começou a desmoronar. A estátua dos irmãos rachou ao meio. E, antes que o teto desabasse, Kravenox ouviu uma última frase:');
    await say('???', '— O Cisma não foi o fim.');
    await G.fade(1, 30);
    await G.narrate(['Capítulo 6\nO Sangue dos Irmãos', 'A queda pareceu durar uma eternidade.\nApenas a mão de Thornox presa ao seu braço.'], { hold: 120, color: '#ffcf6a' });
    G.enterDungeon('caverna');
    await G.fade(0, 30);
    await say(K, '— Você está ferido.');
    await nar('Havia sangue dourado escorrendo de uma ferida no peito de Thornox.');
    await say(T, '— Sua Essência está corrompida.');
    await say(K, '— Eu consigo controlar.');
    await say(T, '— É exatamente isso que me preocupa.');
    await say(K, '— Você continua falando comigo como se eu fosse uma criança.');
    await say(T, '— Porque uma parte de mim ainda enxerga o menino que costumava correr atrás de mim.');
    await say(K, '— Esse menino morreu.');
    await say(T, '— Ele está apenas enterrado.');
    D.save(); G.toast('Jogo salvo.');
  };

  // ===================== CÂMARA DOS CRISTAIS =====================
  S.arauto = async function () {
    if (F().arauto) return;
    await nar('Alguma coisa estava se aproximando. O corpo era coberto por placas negras de cristal. No peito havia uma marca: dois espinhos atravessados por uma linha vertical.');
    await say(T, '— Um Arauto.');
    await nar('A voz que saiu de sua garganta não parecia pertencer a ele.');
    await say('Arauto', '— Finalmente estão juntos novamente.');
    await say(K, '— Quem mandou você?');
    await say('Arauto', '— Aquele que vocês libertaram.');
    await say(T, '— Eu vou pela frente.');
    await say(K, '— E eu pelas sombras. Como antes.');
    await G.battle(['arauto'], { bg: 'caverna', noEscape: true });
    F().arauto = 1;
    await nar('Antes de desaparecer, o Arauto olhou para Kravenox.');
    await say('Arauto', '— Você ainda carrega a marca.');
    await nar('Kravenox puxou parte da proteção que cobria seu torso. Um círculo escuro atravessado por dois espinhos.');
    await say(K, '— Isso estava em mim quando acordei?');
    await say(T, '— Apareceu quando você tocou a Fonte. Significa que a Fonte reconheceu você.');
  };
  S.camaraCristais = async function () {
    if (F().camara) return;
    await nar('Uma enorme câmara subterrânea. Milhares de cristais cobriam as paredes. Dentro deles havia pessoas. Alguns pareciam dormir. Outros tinham os olhos abertos.');
    await say(T, '— Os últimos sobreviventes do Cisma.');
    await say(K, '— Eu conheço esse homem.');
    await nar('Kravenox tocou um cristal. O jovem guerreiro lá dentro abriu os olhos. E começou a chorar.');
    await nar('A câmara inteira despertou. Milhares de olhos se abriram. Milhares de vozes começaram a sussurrar.');
    await say(T, '— Eles sentiram você. Todos eles estavam ligados à Fonte.');
    await G.battle(['cristalizado', 'cristalizado'], { bg: 'caverna', intro: 'Os guerreiros cristalizados se movem!' });
    F().liraDourada = 1;
    await say('Lira', '— Não apenas a Fonte.');
    await nar('Era Lira. Mas não parecia mais a pequena criatura da floresta. Seu corpo estava coberto por luz dourada.');
    await say('Lira', '— Você está começando a lembrar.');
    await say(K, '— O que vocês estão escondendo?');
    await say('Lira', '— O motivo pelo qual o Cisma aconteceu.');
    await say('Lira', '— A Fonte não escolheu você porque você era o mais poderoso. Escolheu você porque você era o único capaz de abrir a prisão.');
    await say(K, '— E o que está preso lá dentro?');
    await say('Lira', '— Algo que nunca deveria ter sido criado.');
    await nar('Lira toca os dois irmãos. A luz dourada fecha as feridas.');
    await heal();
    F().camara = 1;
    await nar('Ao longe, alguma coisa rugiu. E Kravenox percebeu que talvez a maior ameaça do Reino Quebrado não estivesse esperando por ele. Talvez estivesse esperando dentro dele.');
    D.save(); G.toast('Jogo salvo.');
  };
  S.coisaQueDormia = async function () {
    if (F().coisa) return;
    await G.narrate(['Capítulo 7\nA Coisa que Dormia'], { hold: 90, color: '#ffcf6a' });
    await nar('Uma rachadura abriu-se no centro da câmara. De dentro veio uma fumaça negra. Aquela energia era familiar.');
    await say(T, '— O que está abaixo de nós não é um monstro. É uma consequência.');
    await say(T, '— Quando tocamos a Fonte, ela tentou separar a Essência do Vazio. Ela separou nós dois.');
    await say(T, '— Você recebeu uma parte. Eu recebi a outra. Você e eu somos as duas metades daquela ruptura.');
    await nar('Uma mão gigantesca, com dedos cobertos por cristais, agarrou a borda da abertura. O corpo era pedra, sombra e raízes. No lugar do rosto, apenas uma abertura vertical.');
    await say('???', '— Sou aquilo que vocês deixaram para trás.');
    await say(K, '— Então venha buscar.');
    await G.battle(['coisa'], { bg: 'caverna', noEscape: true, events: [{
      when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.3,
      run: async () => {
        await say('???', '— Vocês ainda lutam como crianças.');
        G.flash('#000', 1); G.Audio.sfx('boom'); G.shake = 25;
        await nar('Uma onda de energia atravessou a câmara. Os joelhos de Kravenox cederam.');
        await say('???', '— Você ainda não sabe o que é. Você não é o portador do Vazio.');
        await nar('E a criatura desapareceu.');
        return 'end';
      } }] });
    F().coisa = 1;
    await say(K, '— Então onde está?');
    await nar('Thornox apontou para o peito do irmão. A marca negra começou a se abrir. E, do outro lado, havia uma luz.');
    await vision(['— Se alguma coisa acontecer comigo...\n— Não vai acontecer.', '— Prometa que vai me encontrar.', 'Kravenox sorriu.\n— Prometo.']);
    await say(K, '— Lembro da promessa.');
    G.Audio.sfx('bell');
    await nar('Ao longe, um sino tocou.');
    await say(T, '— Agora todos sabem que você voltou.');
  };
  S.sairCaverna = async function () {
    if (!F().coisa) return;
    await G.fade(1, 20);
    await G.narrate(['Muito acima deles, em uma fortaleza escondida nas montanhas, dezenas de Sentinelas ajoelharam ao mesmo tempo.', 'Diante deles, uma figura encapuzada abriu os olhos. Um cristal negro flutuava diante de seu rosto. Dentro dele, a imagem de Kravenox.'], { hold: 160, color: '#c8c8ff' });
    await say('Sentinela', '— Devemos atacá-lo?');
    await say('Figura Encapuzada', '— Primeiro deixem que ele encontre Thornox. Depois deixem que os dois encontrem a Fonte.');
    await G.narrate(['Capítulo 8\nOs Sinos do Vazio'], { hold: 90, color: '#ffcf6a' });
    G.enterField('vale', 15, 21, 'up');
    await G.fade(0, 30);
    await bell(3);
    await nar('Os sinos tocaram por toda a extensão do Reino Quebrado. Não estavam presos a torres. O som vinha das próprias montanhas.');
    await say(K, '— O que são esses sinos?');
    await say(T, '— Existem sete. O sétimo só toca quando a Fonte começa a morrer.');
    await say(K, '— Então temos pouco tempo. Você sabe onde está a Fonte.');
    await say(T, '— O caminho até a Fonte passa pelo Vale dos Mortos. Ninguém atravessa o vale.');
    await say(K, '— Eu passei séculos preso dentro de um cristal.');
    await say(T, '— E voltou diferente. Ficou mais perigoso.');
    await say(K, '— Isso parece um elogio.');
    await say(K, '— Quantos estão enterrados aqui?');
    await say(T, '— Mais do que o Reino consegue lembrar.');
    D.save(); G.toast('Jogo salvo.');
  };

  // ===================== VALE DOS MORTOS =====================
  S.valeCaverna = async () => { await nar('As pedras desabaram atrás de vocês. Não há volta.'); G.Field.py -= 1; G.Field.dir = 'up'; };
  S.tumulo = async (x, y) => (x === 4 && y === 10) ? S.tumuloLapis() : nar(G.pick(['Um túmulo sem nome.', 'Mais do que o Reino consegue lembrar.', 'Algo toca sua perna sob a névoa. Depois some.']));
  // Easter egg: o túmulo do primeiro rascunho
  S.tumuloLapis = async function () {
    await nar('Uma lápide pequena, mais nova que as outras. Alguém escreveu nela com tinta azul, numa letra de criança:');
    await nar('"AQUI JAZ O KRAVENOX DE LÁPIS.\nELE NUNCA MORRE.\nSÓ MUDA DE MUNDO."');
    if (!F().lapis) { F().lapis = 1; await say(K, '— ...'); await nar('Debaixo da inscrição, um desenho tosco: um bichinho redondo, cheio de espinhos, com dois olhos de brasa.'); }
  };
  S.santuario = async function () {
    const i = await G.choose('Um círculo de pedra ainda guarda luz. Descansar e registrar?', ['Sim', 'Não']);
    if (i === 0) { await G.rest(); D.save(); G.Audio.sfx('save'); G.toast('Jogo salvo.'); }
  };
  S.espirito = async function () {
    if (!F().espirito) {
      F().espirito = 1;
      await say('Espírito do Santuário', '— Vivos... no vale? Faz tanto tempo.');
      await say('Espírito do Santuário', '— O vale alimenta-se das lembranças. Não deixe que ele use as vozes que você ama.');
      await say('Espírito do Santuário', '— Eu guardei coisas dos que passaram. Elas não me servem mais. Fragmentos ainda servem para lembrar.');
    }
    await G.shop('Espírito do Santuário', ['seiva', 'nectar', 'cristal', 'raiz', 'nevoa', 'laminaNegra', 'cajadoSolar', 'placas', 'veu'], null);
  };
  S.valeVoz = async function () {
    if (F().valeVoz) return; F().valeVoz = 1;
    await nar('A névoa cobriu seus pés. Kravenox ouviu um sussurro. Uma memória que ele não possuía. Uma mulher que ele não conseguia visualizar. Mas cuja voz reconhecia.');
    await say('A Mãe', '— Você prometeu voltar.');
    await nar('Kravenox parou de respirar.');
    await say(T, '— Não! O vale alimenta-se das lembranças.');
    await say(K, '— Então por que usou a voz dela?');
    await say(T, '— Porque conhecia você. Ela... nos conhecia quando éramos jovens.');
    await say(K, '— E nunca me contou.');
    await say(T, '— Você estava preso.');
    await nar('Dezenas de mãos surgiram do solo.');
    await G.battle(['lembranca', 'maoNevoa', 'lembranca'], { bg: 'vale' });
    await nar('Então todas as mãos apontaram para a mesma direção. Ao norte, entre a névoa, havia uma construção. Não era de pedra.');
    await say(T, '— A Ponte dos Mortos.');
  };
  S.ponteMortos = async function () {
    if (F().ponte) return;
    await say(T, '— Se atravessarmos, não poderemos voltar.');
    await say(K, '— Depois de tudo que aconteceu... eu não quero voltar.');
    const i = await G.choose('A ponte parece não ter fim. Atravessar agora?', ['Atravessar', 'Ainda não']);
    if (i !== 0) { G.Field.py += 1; G.Field.dir = 'down'; return; }
    await nar('A cada passo, vozes surgiam sob seus pés. Até que uma voz diferente surgiu.');
    await say('Guardião Branco', '— Eu sabia que você viria.');
    await say(T, '— O primeiro Guardião.');
    await say('Guardião Branco', '— Finalmente estamos todos reunidos.');
    await say(K, '— Você é aquele que estava preso sob a Fonte?');
    await say('Guardião Branco', '— Eu sou aquele que colocou vocês dois lá.');
    await say('Guardião Branco', '— Vocês ainda não entenderam. Eu não quero destruir o Reino. Quero libertá-lo.');
    await nar('Centenas de sombras surgiram.');
    await G.battle(['guardiao2'], { bg: 'ponte', noEscape: true, events: [{
      when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.3,
      run: async () => {
        await say('Guardião Branco', '— Vocês ainda não aprenderam. Poder não é liberdade.');
        G.Audio.sfx('boom'); G.shake = 30;
        return 'end';
      } }] });
    F().ponte = 1;
    await nar('A ponte começou a desmoronar. E os dois irmãos caíram juntos no abismo.');
    await G.fade(1, 30);
    await G.narrate(['Capítulo 9\nO Abismo entre os Irmãos', 'A queda não terminou.\nEntão uma mão segurou seu braço.'], { hold: 120, color: '#ffcf6a' });
    G.enterDungeon('submersa');
    await G.fade(0, 30);
    await say(T, '— Não solte!');
    await say(K, '— Você está segurando a pessoa errada!');
    await say(T, '— Você sempre fala demais quando está com medo.');
    await nar('Abaixo deles, torres quebradas flutuavam no vazio. Pontes atravessavam o nada.');
    await say(T, '— A Cidade Submersa. Ela não deveria estar aqui. Nós não estamos mais no Reino.');
    await say('Guardião Branco', '— Entre um lugar e outro. O lugar onde o Reino guarda aquilo que não consegue destruir.');
    await say('Guardião Branco', '— A marca em seu peito é uma chave. E você acabou de usá-la. Ela reage porque está perto da outra metade.');
    await say('Guardião Branco', '— Thornox é a outra metade. Vocês nunca foram separados por acaso.');
    await nar('O Guardião tocou a marca no peito de Kravenox. Uma explosão de memórias. Mas dessa vez havia uma terceira figura.');
    await vision(['Uma criança diante da Fonte, segurando um cristal.', 'O mesmo símbolo dos irmãos estava gravado nele.', 'A criança entregou o cristal a Thornox.\nDepois olhou para Kravenox.']);
    await say(K, '— Nós não tínhamos uma irmã.');
    await say(T, '— Foi exatamente isso que a Fonte tirou de nós. Ela foi a primeira a tocar a Fonte.');
    await say('Guardião Branco', '— Ela foi transformada. Naquilo que está procurando você.');
    await say('???', '— Você prometeu que voltaria.');
    await say(K, '— Ela está viva. Ela está chamando por mim.');
    await say(K, '— Você passou séculos escondendo a verdade. Agora eu vou descobrir sozinho.');
    await say(K, '— Pela primeira vez, você vai ter que confiar em mim.');
    await nar('Thornox ficou onde estava. Então soltou o braço do irmão.');
    D.removeHero('thornox');
    await nar('Kravenox segue sozinho pela escuridão.');
    await say('Guardião Branco', '— Você sabe que ele não vai voltar igual.');
    await say(T, '— Então eu vou até ele.');
    D.save(); G.toast('Jogo salvo.');
  };

  // ===================== CIDADE SUBMERSA =====================
  S.encontraLyra = async function () {
    if (F().lyra) return;
    await G.narrate(['Capítulo 10\nA Filha Esquecida'], { hold: 90, color: '#ffcf6a' });
    await nar('À sua frente surgiu uma pequena luz dourada. Uma menina. Parecia ter pouco mais de dez anos. Vestia um tecido branco antigo, quase coberto por raízes negras. Seus cabelos eram longos e prateados.');
    await say(L, '— Não lembra de mim?');
    await vision(['Ele próprio ainda pequeno. Thornox. E uma menina entre os dois, segurando um cristal.', '— Quando crescermos, vamos proteger a Fonte juntos.\n— Você não pode nem carregar isso.', 'Os três colocavam as mãos sobre o cristal.\nUma luz preenchia a floresta.']);
    await say(K, '— Qual é o seu verdadeiro nome?');
    await say(L, '— Lyra. "Lira" foi o nome que me deram depois.');
    await say(K, '— O que fizeram com você?');
    await say(L, '— Eles me esconderam.');
    await say(K, '— Ele disse que você morreu.');
    await say(L, '— Porque era mais fácil para você esquecer.');
    await say(K, '— Então por que eu deveria confiar em você?');
    await say(L, '— Eu também não confio em você.');
    await say(K, '— Pelo menos é honesta.');
    await say(L, '— A Fonte não era uma prisão. Thornox acreditava nisso. Ela era o coração do Reino.');
    await say(L, '— Quando os antigos tentaram criar vida usando a Fonte, criaram algo que não deveria existir. A Fonte começou a pensar. E pensou que o mundo estava doente.');
    await say(L, '— Vocês tentaram destruir a própria Fonte. E conseguiram: destruíram a consciência. Mas não o corpo.');
    await say(K, '— Então o que está acordando?');
    await say(L, '— A parte que sobrou.');
    F().semMascara = 1;
    await say('Guardião Branco', '— E ela está com fome.');
    await nar('O Guardião Branco apareceu. Dessa vez, sem máscara. Um velho marcado por cicatrizes.');
    await say('Guardião Branco', '— Lyra.');
    await say(L, '— Não me chame assim. Esse nome pertence à menina que eu era. Eu sou a guardiã da última memória da Fonte.');
    await say(K, '— Ela é minha irmã.');
    await say('Guardião Branco', '— O Reino não precisa de um herói. Precisa de uma escolha. Quando chegar à Fonte, você terá duas opções: salvar sua família... ou salvar o Reino.');
    await nar('O Guardião desapareceu. Então Lyra segurou a mão do irmão.');
    await say(L, '— Não escolha ainda. Ele mentiu. Não existem duas escolhas.');
    D.addHero('lyra'); F().lyra = 1;
    G.Audio.sfx('level');
    await nar('Lyra se junta ao grupo!');
    await bell(1);
    await nar('Ao longe, o sétimo sino começou a tocar. E o Reino Quebrado inteiro começou a morrer.');
    D.save(); G.toast('Jogo salvo.');
  };
  S.rioMemorias = async function () {
    if (F().portaoRio) return;
    await G.narrate(['Capítulo 11\nO Sétimo Sino'], { hold: 90, color: '#ffcf6a' });
    await nar('A ponte de pedra rachou. Os dois mergulharam em um lago subterrâneo. Sob a superfície havia milhares de pequenas luzes. Milhares de anos de história.');
    await say(L, '— Este é o Rio das Memórias.');
    await vision(['Três irmãos diante da Fonte.', 'Thornox segurando a mão da irmã.', 'E uma voz: — Quando a Fonte escolher, você terá que escolher também.']);
    await heal('A água das memórias fecha as feridas do grupo.');
    await say(L, '— Você ainda corre muito rápido.');
    await say(K, '— E você ainda não sabe quando parar de falar.');
    F().portaoRio = 1; G.Audio.sfx('light');
    await nar('A correnteza que bloqueava o caminho a sudoeste se desfaz em luz.');
    D.save(); G.toast('Jogo salvo.');
  };
  S.portaTres = async function () {
    if (F().porta) return;
    await nar('Uma porta. Kravenox sentiu a presença de Thornox.');
    await say(K, '— Então estamos quase juntos.');
    await nar('Uma luz dourada surgiu no fim do corredor.');
    D.restoreHero('thornox');
    await say(T, '— Eu disse que viria até você.');
    await say(K, '— Você continua mentindo mal. Você disse que eu não voltaria igual.');
    await say(T, '— E não voltou.');
    await nar('Durante alguns segundos, nenhum dos três falou. Três partes da mesma história.');
    G.Audio.sfx('level');
    await nar('Thornox volta ao grupo!');
    await nar('Os três colocaram as mãos sobre a porta. Lyra colocou a sua por último.');
    G.Audio.sfx('door'); G.shake = 12;
    F().porta = 1;
    await heal();
    D.save(); G.toast('Jogo salvo.');
  };
  S.fonte = async function () {
    if (F().fim) return;
    G.Audio.play('memoria');
    await G.narrate(['Capítulo 12\nA Escolha'], { hold: 90, color: '#ffcf6a' });
    await nar('Do outro lado não havia um corredor. Havia uma enorme árvore. Suas raízes atravessavam o mundo. Seu tronco era feito de cristal. E no lugar de folhas havia milhares de olhos.');
    await nar('Todos aqueles olhos estavam voltados para eles.');
    await bell(1);
    await say(L, '— Ela não sabe o que fazer. Perdeu a consciência há muito tempo. Tudo o que restou são fragmentos. Eu fui um desses fragmentos.');
    await nar('Três caminhos apareceram diante deles.');
    await say(L, '— O dourado: o renascimento. A Fonte usa nossas Essências para reconstruir o Reino.');
    await say(T, '— O branco: tudo continua como está.');
    await say(K, '— E o negro... nós teríamos poder suficiente para reconstruí-lo depois.');
    await nar('A Fonte não estava oferecendo uma solução. Estava oferecendo uma tentação.');
    const c = await G.choose('Qual caminho Kravenox escolhe?', ['Caminho dourado', 'Caminho branco', 'Caminho negro', 'Nenhum deles'], { w: 140 });
    if (c < 3) {
      await nar('Kravenox dá um passo em direção ao caminho... e para. A marca em seu peito começa a queimar.');
    }
    await say(K, '— Eu passei séculos sendo usado. E não vou deixar ninguém escolher meu destino novamente.');
    G.Audio.sfx('dark'); G.flash('#000', 1); G.shake = 20;
    await say(K, '— Eu fiz uma quarta escolha. Não posso destruir a Fonte. Mas posso quebrar as regras dela.');
    await nar('Uma rachadura percorreu o tronco. De dentro surgiu uma luz negra. A mesma energia do Abismo Carmesim.');
    await nar('Uma criatura saiu sem pressa do interior da árvore. Seu corpo parecia feito de sombra líquida. Tinha espinhos semelhantes aos de Kravenox.');
    await say('A Primeira Consciência', '— Seu irmão sempre teve dificuldade em aceitar a verdade.');
    await say('A Primeira Consciência', '— Eu era a primeira consciência criada pela Essência. E vocês são meus filhos.');
    G.state.party.forEach(h => { h.alive = true; h.hp = h.maxhp; h.ep = h.mep; });
    await G.battle(['primeira'], { bg: 'fonte', music: 'final', noEscape: true, noRewards: true, events: [{
      when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.35,
      run: async () => {
        await say('A Primeira Consciência', '— Você é o mais parecido comigo. Você poderia governar tudo.');
        await nar('Uma imagem: Kravenox sozinho sobre um trono. Seus irmãos vivos. Nenhuma perda.');
        await say('A Primeira Consciência', '— Eu não estou oferecendo poder. Estou oferecendo aquilo que você sempre quis.');
        await nar('Por um instante, pareceu ceder. A criatura oferecia exatamente aquilo que eles haviam perdido. Mas não estava oferecendo liberdade. Estava oferecendo uma prisão bonita.');
        await say(K, '— Eu prefiro perder vocês... a viver numa mentira.');
        G.Audio.sfx('boom'); G.flash('#ffffff', 1); G.shake = 30;
        await nar('A marca em seu peito explodiu.');
        return 'end';
      } }] });
    await say(K, '— Nós vamos criar nossa própria escolha.');
    await say(T, '— Então vamos descobrir o que acontece.');
    await G.narrate(['Capítulo 13\nA Quarta Essência', 'Por um instante, tudo desapareceu.\nUma luz formada por três forças que, durante séculos, haviam existido separadas.'], { hold: 130, color: '#e8f0ff' });
    F().prata = 1; F().tec_prateados = 1;
    G.state.party.forEach(h => { h.alive = true; h.hp = h.maxhp; h.ep = h.mep; });
    await nar('A marca no peito de Kravenox havia desaparecido. No lugar dela havia uma pequena luz branca. A energia negra não apareceu. Em seu lugar, uma energia prateada percorreu seus braços.');
    await nar('Kravenox aprendeu Espinhos Prateados!');
    await say(L, '— Não consigo segurar por muito tempo!');
    await G.battle(['primeira2'], { bg: 'fonte', music: 'final', noEscape: true, noTransition: true, events: [{
      when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.4,
      run: async () => {
        await say(L, '— Ela não consegue apagar as memórias. Então é isso que faremos.');
        await say(K, '— Vamos lembrá-la de quem ela era.');
        return 'end';
      } }] });
    await S.final();
  };
  // Cena cinematográfica: a despedida da mãe (Cap. 13), fiel ao texto do livro
  S.despedidaMae = async function () {
    const C = G.Cine, X = G.gfx, M = 'A Mãe', P = 'A Primeira Consciência';
    const cap = (t, n = 50) => C.caption(t, n);
    await C.begin('fonte', 'despedida');
    const mae = C.actor('mae', { img: () => X.enemyImg(D.ENEMIES.primeira), x: 160, y: 158, z: 1, glow: 'rgba(160,10,40,0.9)', glowA: 0.5, bob: 1.5, alpha: 1 });
    const ouro = C.actor('ouro', { img: () => X.enemyImg(D.ENEMIES.primeira2), x: 160, y: 158, z: 2, glow: 'rgba(255,230,150,0.95)', glowA: 0.9, bob: 1, alpha: 0 });
    // os três irmãos, de costas para a câmera, contornados pela própria Essência
    const tI = C.actor('thornox', { img: () => X.sprite('thornox', 'down', 0), x: 92, y: 206, z: 5, scale: 0.8, silhouette: '#ffd36a', glow: 'rgba(255,211,106,0.9)', glowA: 0.45 });
    const kI = C.actor('kravenox', { img: () => X.sprite('kravenoxP', 'up', 0), x: 160, y: 208, z: 6, scale: 1.25, silhouette: '#dfe8ff', glow: 'rgba(223,232,255,0.9)', glowA: 0.45 });
    const lI = C.actor('lyra', { img: () => X.sprite('lyra', 'up', 0), x: 228, y: 206, z: 5, scale: 1.4, silhouette: '#bfe0ff', glow: 'rgba(160,215,255,0.9)', glowA: 0.45 });
    const R = [[-14, -96, 0, 40, -30], [14, -96, G.W, 50, 30], [-24, -60, 0, 120, -20], [24, -60, G.W, 130, 20], [-20, -30, 20, G.H, -40], [20, -30, 300, G.H, 40], [-6, -110, 70, 0, -20], [6, -110, 250, 0, 20]];
    C.roots = R.map(([ox, oy, ex, ey, bend]) => ({ on: 'mae', ox, oy, ex, ey, bend, w: 3, broken: 0 }));

    await say(K, '— Você não pode me controlar.');
    await say(P, '— Eu sou sua mãe.');
    await say(K, '— Talvez. Mas isso não dá a você o direito de decidir quem eu sou.');
    await say(K, '— E não vou destruir você.');
    await say(T, '— O quê?');
    await say(K, '— Ela também está presa.');
    await cap('Kravenox percebeu algo. As raízes que cobriam seu corpo não eram parte dela. Eram correntes.');
    await say(K, '— Lyra.');
    await say(L, '— O cristal.');
    // três forças convergindo
    const tgt = [160, 92];
    C.beams = [
      { x1: 92, y1: 182, x2: tgt[0], y2: tgt[1], color: '#ffd36a', a: 0, len: 0, w: 3, ph: 0 },
      { x1: 228, y1: 182, x2: tgt[0], y2: tgt[1], color: '#9fd8ff', a: 0, len: 0, w: 3, ph: 4 },
      { x1: 160, y1: 176, x2: tgt[0], y2: tgt[1], color: '#e8f0ff', a: 0, len: 0, w: 4, ph: 2 },
    ];
    for (const [i, sfx] of [[1, 'memory'], [0, 'light'], [2, 'dark']]) {
      G.Audio.sfx(sfx); C.beams[i].a = 1; await C.tween(C.beams[i], { len: 1 }, 24);
      C.burst(tgt[0], tgt[1], 24, C.beams[i].color, { speed: 2, life: 40 });
    }
    mae.shake = 3;
    await cap('Os três concentraram suas forças. A luz branca atravessou a criatura.', 30);
    // as raízes se rompem: uma, duas, dez, centenas
    const breakRoot = (i) => { const rt = C.roots[i]; const a = C.actors.mae; G.Audio.sfx('hit'); G.shake = 6;
      C.burst((a.x + rt.ox + rt.ex) / 2, (a.y + rt.oy + rt.ey) / 2, 18, i % 2 ? '#ffe08a' : '#ff6a3a', { speed: 2.5, life: 35, grav: 0.05 }); C.tween(rt, { broken: 1 }, 30); };
    breakRoot(0); C.cap = { text: 'Uma.', t: 0 }; await C.wait(40);
    breakRoot(1); C.cap = { text: 'Duas.', t: 0 }; await C.wait(40);
    for (let i = 2; i < 5; i++) { breakRoot(i); await C.wait(8); } C.cap = { text: 'Dez.', t: 0 }; await C.wait(30);
    for (let k = 0; k < 40; k++) { C.burst(60 + Math.random() * 200, 30 + Math.random() * 170, 3, k % 2 ? '#ffe08a' : '#ff6a3a', { speed: 2, life: 30 }); if (k % 6 === 0) G.Audio.sfx('hit'); await C.wait(2); }
    C.cap = { text: 'Centenas.', t: 0 }; await C.wait(40);
    G.Audio.sfx('die'); mae.shake = 7; G.shake = 16;
    await cap('A criatura gritou. Não de raiva. De dor.');
    await say(K, '— Aguente.');
    await say(P, '— Não consigo.');
    await say(K, '— Consegue.');
    await say(P, '— Eu estou cansada.');
    mae.shake = 1;
    await cap('Por trás dos espinhos, ainda havia a mulher da floresta. A mãe. A primeira pessoa que ele havia esquecido.');
    await C.tween(kI, { y: 196 }, 40);
    await say(K, '— Então descanse.');
    breakRoot(5); breakRoot(6); breakRoot(7);
    G.Audio.sfx('boom'); G.shake = 20; mae.shake = 8;
    C.whiteColor = '#ffffff'; C.holdWhite = true; await C.tween(C, { white: 1.2 }, 18);
    mae.alpha = 0; ouro.alpha = 1; ouro.y = 170; C.beams.forEach(b => (b.a = 0)); C.roots = [];
    C.holdWhite = false; await C.wait(70);
    await cap('A última raiz se rompeu. Mas não havia mais monstro. Havia uma mulher. Frágil. Humana.');
    // Lyra corre primeiro
    await C.tween(lI, { x: 196, y: 196 }, 30);
    await say(L, '— Mãe.');
    await say(M, '— Minha pequena.');
    await C.tween(tI, { x: 126, y: 198 }, 30);
    await say(M, '— Você tentou protegê-los.');
    await say(T, '— Eu falhei.');
    await say(M, '— Não. Você tentou.');
    await cap('Por fim, olhou para Kravenox. Ele não conseguiu se aproximar.');
    await say(M, '— Venha.');
    await C.tween(kI, { y: 186 }, 50);
    await say(M, '— Você ficou muito parecido com seu pai.');
    await say(K, '— Meu pai?');
    await say(M, '— Você não se lembra dele.');
    await say(K, '— Quem era ele?');
    await say(M, '— O homem que iniciou o Cisma.');
    await say(T, '— Não.');
    await say(M, '— Sim.');
    await say(K, '— Por quê?');
    await say(M, '— Porque ele descobriu a verdade antes de todos nós.');
    await say(K, '— Qual verdade?');
    await say(M, '— A Essência não foi criada para dar vida.');
    await cap('Silêncio.', 40);
    await say(M, '— Ela foi criada para escolher quem merecia continuar existindo.');
    await say(K, '— E quem decide isso?');
    await say(M, '— A própria Fonte.');
    G.Audio.sfx('dark'); G.shake = 14;
    await cap('Atrás deles, a árvore começou a rachar.', 30);
    await say(M, '— Vocês precisam ir.');
    await say(L, '— Não.');
    await say(M, '— Minha filha...');
    await say(L, '— Eu não vou deixar você.');
    await say(M, '— Você já me libertou.');
    await say(M, '— Agora precisam libertar o Reino.');
    // ela se desfaz em partículas douradas
    G.Audio.sfx('memory');
    C.tween(ouro, { alpha: 0 }, 300);
    let k = 0;
    const dissolve = async (n) => { for (let i = 0; i < n; i++, k++) { C.burst(160, 110, 7, k % 3 ? '#ffe08a' : '#fff4c8', { w: 60, h: 110, up: true, spread: 0.9, speed: 0.9, life: 110, drag: 0.995 }); await C.wait(4); } };
    C.cap = { text: 'O corpo dela começou a desaparecer em pequenas partículas douradas.', t: 0 };
    await dissolve(24);
    C.tween(kI, { y: 178 }, 20);
    await say(K, '— Não!');
    await dissolve(10);
    await say(M, '— Desta vez eu estou escolhendo partir.');
    await dissolve(36);
    C.cap = { text: 'E desapareceu.', t: 0 }; await C.wait(90);
    await cap('Lyra chorava. Thornox estava ajoelhado. Kravenox permaneceu parado.', 60);
    // a Fonte pulsa três vezes
    C.cap = null;
    for (const [w, txt] of [[0.35, 'Uma vez.'], [0.6, 'Duas.'], [0.9, 'Três.']]) {
      G.Audio.sfx('boom'); G.shake = 12; C.whiteColor = '#ffe8b0'; C.white = w; C.cap = { text: txt, t: 0 };
      C.burst(160, 90, 40, '#ffe08a', { speed: 3, life: 50 });
      await C.wait(55);
    }
    C.whiteColor = '#ffffff'; C.holdWhite = true; await C.tween(C, { white: 1 }, 60);
    G.fadeColor = '#ffffff'; G.fadeA = 1; C.holdWhite = false;
    await C.end();
  };

  S.final = async function () {
    F().fim = 1;
    G.Audio.play('memoria');
    await vision([
      'Muito antes do Reino Quebrado, uma mulher caminhava entre árvores enormes.\nNão havia sombras em seu corpo.',
      'Na memória, os três corriam pela floresta.\nThornox tentava ensinar Kravenox a lutar.',
      'Então a mulher estava diante da Fonte. Os antigos sacerdotes ao seu redor.\n— Você precisa se tornar uma com a Essência.',
      'E, pouco a pouco, eles esqueceram a mulher que havia dado tudo.',
    ]);
    await S.despedidaMae();
    await G.fade(0.85, 60, '#000');
    await nar('A árvore se abriu. Dentro dela surgiu uma passagem. Do outro lado, havia o Reino Quebrado. Mas estava diferente.');
    await nar('As nuvens haviam se tornado negras. As montanhas estavam cobertas por sombras. E milhares de criaturas marchavam em direção às ruínas.');
    await say(L, '— O que está acontecendo?');
    await say(T, '— A guerra começou.');
    await nar('No centro do exército havia uma figura. A mulher da fortaleza. Aquela que observava os três através do cristal. Ela levantou a mão, e todas as criaturas pararam.');
    await nar('Então olhou diretamente para Kravenox. Mesmo a quilômetros de distância, ele sabia que ela conseguia vê-lo. Ela abriu um sorriso.');
    await say(K, '— Quem é ela?');
    await say(T, '— A pessoa que estava esperando pela nossa mãe.');
    await say(L, '— Então ela sabia que nós chegaríamos aqui.');
    await say(T, '— Sim.');
    await say(K, '— Então vamos descobrir por quê.');
    await nar('E, pela primeira vez desde o Grande Cisma, o Reino Quebrado recebeu de volta seus três herdeiros.');
    await nar('Eles não voltaram para terminar uma guerra. Voltaram para descobrir quem havia começado.');
    D.save();
    await G.fade(1, 60);
    G.Audio.play('fim');
    await G.credits();
  };

  // ===================== COMUNS =====================
  S.cristalDescanso = async function () {
    const i = await G.choose('Um cristal dourado pulsa com Essência pura. Descansar e registrar?', ['Sim', 'Não']);
    if (i === 0) { await G.rest(); if (D.save()) { G.Audio.sfx('save'); G.toast('Jogo salvo.'); } }
  };
  S.bau = async function (id, x, y, c) {
    G.state.chests[id + ':' + x + ',' + y] = 1;
    G.Audio.sfx('chest');
    if (!c) { await nar('O baú está vazio.'); return; }
    if (c.fr) { G.state.fr += c.fr; await nar('Dentro do baú: ' + c.fr + ' fragmentos.'); }
    if (c.item) { D.give(c.item, c.n || 1); await nar('Dentro do baú: ' + D.ITEMS[c.item].name + (c.n > 1 ? ' x' + c.n : '') + '.'); }
    if (c.equip) { await nar('Dentro do baú: ' + D.EQUIP[c.equip].name + '!'); await G.receiveEquip(c.equip); }
  };
})();
