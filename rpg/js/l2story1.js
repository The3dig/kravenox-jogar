'use strict';
// Livro II — O Reino da Escolha. Parte 1: capítulos 1 a 14.
(function () {
  const S = G.story, D = G.data, X = G.gfx;
  const F = () => G.state.flags;
  const say = (n, t) => G.say(n, t);
  const nar = t => G.say(null, t);
  const C = () => G.Cine;
  const K = 'Kravenox', T = 'Thornox', L = 'Lyra', SE = 'Seraphyne', ER = 'Erya', RM = 'A Rainha da Memória', PAI = 'O Pai', MAE = 'A Mãe', AS = 'Aster', OR = 'A Origem';

  // ---------- ferramentas comuns do Livro II (usadas também nas Partes 2 e 3) ----------
  const L2 = S.L2 = {};
  L2.vision = async function (lines, music = 'memoria') {
    const prev = G.Audio.cur; G.Audio.play(music); G.Audio.sfx('memory');
    G.flash('#ffffff', 0.9);
    await G.narrate(lines, { color: '#f0e6c8', bg: '#0a0806', backdrop: (ctx, t) => { X.glow(ctx, G.W / 2, G.H / 2, 140, 'rgba(255,220,140,0.25)', 0.6 + 0.2 * Math.sin(t / 30)); } });
    G.Audio.cur = null; G.Audio.play(prev);
  };
  // pensamentos e vozes dentro da cabeça (a Origem, a mãe, o terceiro espinho)
  L2.mind = async function (lines, color = '#c8e8ff') { G.Audio.sfx('memory'); await G.narrate(lines, { color, bg: '#04040a', hold: 120 }); };
  L2.chapter = (n, title, extra = [], hold = 100) => G.narrate(['Capítulo ' + n + '\n' + title, ...extra], { hold, color: '#ffcf6a' });
  L2.warpField = async (id, x, y, dir) => { await G.fade(1, 16); G.enterField(id, x, y, dir); await G.fade(0, 16); };
  L2.warpDungeon = async (id, x, y, dir) => { await G.fade(1, 16); G.enterDungeon(id, x, y, dir); await G.fade(0, 16); };
  L2.saved = () => { D.save(); G.toast('Jogo salvo.'); };
  L2.learn = async (who, key) => { if (F()['tec_' + key]) return; F()['tec_' + key] = 1; G.Audio.sfx('level'); await nar(who + ' aprendeu ' + D.TECHS[key].name + '!'); };
  // um ponto de retorno: se o grupo cair, o jogo volta para cá e o roteiro recomeça
  L2.checkpoint = name => { G.state.pend = name; D.save(); G.toast('Jogo salvo.'); };
  L2.done = () => { G.state.pend = null; };
  L2.kh = () => G.state.party.find(h => h.id === 'kravenox');
  // um herói sozinho e depois o grupo de volta, na mesma ordem
  L2.solo = function (id) {
    const st = G.state; if (!st.fullParty) st.fullParty = st.party.map(h => h.id);
    st.bench = st.bench || {}; for (const x of st.party) st.bench[x.id] = x;
    const h = st.bench[id]; st.party = [h]; if (!h.alive) { h.alive = true; h.hp = Math.round(h.maxhp * 0.5); }
  };
  L2.regroup = function () {
    const st = G.state; const ids = st.fullParty || st.party.map(h => h.id);
    const all = Object.assign({}, st.bench || {}); for (const x of st.party) all[x.id] = x;
    st.party = ids.map(id => all[id]).filter(Boolean); st.fullParty = null;
    const lv = Math.max(...st.party.map(h => h.lv));
    for (const h of st.party) { while (h.lv < lv) h.lv++; h.xp = Math.max(h.xp, D.xpTotal(h.lv)); D.recalc(h); if (!h.alive) { h.alive = true; h.hp = 1; } }
  };
  // o grupo passa a ser exatamente estes (quem sai fica guardado; quem entra chega no nível do grupo)
  L2.setParty = function (ids) {
    const st = G.state; st.fullParty = null; st.bench = st.bench || {};
    for (const x of st.party) st.bench[x.id] = x;
    const lv = Math.max(...Object.values(st.bench).map(h => h.lv));
    st.party = ids.map(id => { let h = st.bench[id] || D.newHero(id, lv); while (h.lv < lv) h.lv++; h.xp = Math.max(h.xp, D.xpTotal(h.lv)); D.recalc(h); if (!h.alive) { h.alive = true; h.hp = h.maxhp; } return h; });
  };
  L2.heal = () => D.healAll();

  // ao carregar: se um roteiro ficou pela metade, ele recomeça do ponto de retorno
  S.resume2 = function (st) {
    if (st.pend && S[st.pend]) {
      const l = st.loc;
      if (l.mode === 'dungeon') G.enterDungeon(l.map, l.x, l.y, l.dir); else G.enterField(l.map, l.x, l.y, l.dir);
      G.run(async () => { await G.fade(0, 20); await S[st.pend](); });
      return true;
    }
    return false;
  };

  // a memória roubada pelo Rei de Fumaça: a técnica some até Lyra recuperá-la
  const techsOf0 = D.techsOf;
  D.techsOf = function (h, st = G.state) { let r = techsOf0(h, st); if (G.book === 2 && st && st.flags.memRoubada && h.id === 'kravenox') r = r.filter(k => k !== st.flags.memRoubada); return r; };

  const evDone1 = S.evDone;
  S.evDone = function (map, c) {
    const f = F(); const m = {
      tuneis: { a: 'simbolos', e: 'ch2' }, palacio: { e: 'primeiroRei' }, entre: { e: 'irmaoVisto', l: 'maeLivre' },
      arvoreBranca: { e: 'ch19' }, biblioteca: { a: 'bibliotecarioVisto', l: 'livrosVistos', r: 'livroLido', e: 'ch22' },
      destino: { e: 'personagemVisto', a: 'memPais', l: 'memFonte', r: 'silencioVisto', d: 'ch26' },
      dentro: { a: 'bebes', e: 'leitorExplicou', d: 'thornoxSumiu', f: 'fonteFalou', r: 'ch29' } }[map];
    if (m) return !!(m[c] && f[m[c]]);
    return evDone1(map, c);
  };

  // ===================== COMEÇO DO LIVRO II =====================
  S.livro2 = async function () {
    G.fadeA = 1;
    G.Audio.play('novoReino');
    await G.narrate(['No fim do primeiro livro, a regra mudou.\nA Fonte deixou de pertencer a um único mundo.', 'O Reino Quebrado e a Primeira Cidade viraram uma coisa só: um Reino novo, de céu violeta e duas luas.', 'E, atrás dos quatro irmãos, uma árvore que ninguém plantou nasceu com cinco marcas.\nA quinta não pertencia a nenhum deles.'], { hold: 200, color: '#c9bfd8' });
    await G.narrate(['LIVRO II\nO Reino da Escolha'], { hold: 180, color: '#b8a8ff' });
    await G.narrate(['PARTE 1\nO Reino da Escolha'], { hold: 140, color: '#c9a24a' });
    await L2.chapter(1, 'A Cidade sem Nome', ['A estrada até a cidade parecia curta. Não era.']);
    G.enterField('escolha', 16, 19, 'up');
    await G.fade(0, 40);
    await nar('A cada passo, o mundo mudava: onde antes havia só areia surgiam pequenas plantas; entre pedras quebradas nasciam flores negras. E, por baixo de tudo, Kravenox sentia algo pulsando. A nova Essência.');
    await say(L, '— Está crescendo rápido demais.');
    await say(K, '— O mundo está tentando se reconstruir.');
    await say(T, '— Não. Está tentando se descobrir.');
    await say(SE, '— Parece que alguém aprendeu alguma coisa.');
    await nar('Thornox ignorou. Kravenox seguiu andando, mas não conseguia esquecer a marca que vira na árvore que ninguém plantara. A quinta marca.');
    L2.saved();
  };

  // ===================== CAP. 1 — OS PORTÕES =====================
  S.portoesEscolha = async function () {
    const f = F();
    if (!f.chegada) return S.chegadaCidade();
    if (f.ch3 && !f.guerra) return S.guerraComeca();
    if (f.ch4a && !f.ch5) return S.reiDasAsas();
    if (f.guerra && !f.ch4a) return;
  };
  S.chegadaCidade = async function () {
    const Cn = C();
    await Cn.begin('portoesEscolha', 'escolha');
    await Cn.caption('Nos portões, centenas de pessoas esperavam: sobreviventes da Primeira Cidade, habitantes do antigo Reino, guerreiros, famílias, crianças. Todos olhavam para os quatro.');
    await say('Um Homem', '— Vocês nos salvaram.');
    await say(K, '— Ainda não. Ainda não sabemos se estamos salvos.');
    await say('Uma Mulher', '— Então o que devemos fazer?');
    await Cn.caption('Antes, Kravenox teria respondido com uma ordem. Agora não.');
    await say(K, '— Construir.');
    await say('Uma Mulher', '— O quê?');
    await say(K, '— Tudo. Casas. Defesas. Comida. E uma vida que não dependa de nós.');
    await say(T, '— Essa foi boa.');
    await say(K, '— Estou tentando.');
    G.Audio.sfx('door');
    await Cn.caption('Os portões se abriram e a multidão entrou. Pela primeira vez em séculos, aquela terra voltou a ouvir vozes: martelos, crianças, animais, risos, choro. Vida.', 70);
    await Cn.end();
    await nar('Kravenox observava tudo do alto da muralha quando Lyra se aproximou.');
    await say(L, '— Está feliz?');
    await say(K, '— Não sei. Passei tanto tempo tentando destruir aquilo que me prendia... Agora tenho algo que pode ser perdido.');
    await say(L, '— É isso que significa estar vivo.');
    await say(K, '— Você ficou sábia.');
    await say(L, '— Conviver com vocês tem efeitos colaterais.');
    await nar('Os dois riram. Por alguns segundos, tudo parecia normal. Até o sino tocar. Uma vez. Depois outra.');
    G.Audio.sfx('bell'); G.shake = 8;
    await say('Soldado', '— Encontramos alguma coisa! Nos túneis abaixo da cidade. A entrada fica no centro, entre os dois poços.');
    F().chegada = 1; F().sino = 1;
    L2.saved();
  };
  S.entrarTuneis = async function () {
    if (!F().sino) return;
    if (F().ch2) { await nar('Os túneis desabaram. Não há mais nada lá embaixo.'); G.Field.py += 1; return; }
    await L2.warpDungeon('tuneis');
    await nar('Os túneis eram muito mais antigos que a Primeira Cidade, e as paredes estavam cobertas de símbolos.');
  };
  S.sairTuneis = async function () { await L2.warpField('escolha', 17, 10, 'down'); };
  S.simbolosTunel = async function () {
    if (F().simbolos) return; F().simbolos = 1;
    await say(T, '— Não conheço essa escrita.');
    await say(SE, '— Eu conheço. "Aqui repousa aquilo que não deveria ter sido criado."');
    await say(K, '— Parece promissor.');
    await say(T, '— Você precisa parar de dizer isso.');
  };
  S.portaQuinta = async function () {
    if (F().ch2) return;
    if (!F().erya) {
      await nar('Chegaram a uma porta enorme de pedra negra com a mesma quinta marca da árvore no centro. Quando Kravenox se aproximou, a marca brilhou e a porta se abriu.');
      const Cn = C();
      await Cn.begin('salaErya', 'entre');
      const er = Cn.actor('er', { img: () => X.sprite('erya', 'down', 0), x: 160, y: 150, z: 3, scale: 1.6, glow: 'rgba(160,255,190,0.7)', glowA: 0.3 });
      await Cn.caption('Uma sala circular. No centro, sentada no chão, imóvel, havia uma criança. Teria uns oito anos, cabelos escuros e olhos brancos.');
      await say(SE, '— Não. Ela não deveria existir.');
      await say(ER, '— Você demorou.');
      await say(K, '— Quem é você?');
      await say(ER, '— Eu estava esperando. Porque você abriu a porta.');
      await say(K, '— Eu não abri.');
      await say(ER, '— Abriu sim. Você mudou a Essência.');
      G.Audio.sfx('dark'); G.flash('#a8ffc8', 0.7); G.shake = 10;
      await Cn.tween(er, { y: 170 }, 30);
      await Cn.caption('Ela tocou o peito dele. Todos os espinhos de Kravenox reagiram, uma energia desconhecida percorreu seu corpo, e ele caiu de joelhos.');
      await say(T, '— Afaste-se dele!');
      await say(ER, '— Você ainda tenta protegê-lo. Eu lembro. De quando vocês ainda não existiam.');
      await say(ER, '— Meu nome é Erya. Eu sou a quinta.');
      await Cn.caption('Erya apontou para a parede, onde surgiram quatro símbolos: luz, sombra, memória, Vazio. Depois um quinto: escolha.');
      await say(K, '— Você é...');
      await say(ER, '— Aquilo que você criou. O começo do sexto mundo.');
      await say(L, '— Sexto?');
      await say(ER, '— O mundo de vocês é apenas o quinto. O sexto ainda não nasceu. Algumas coisas precisam ser protegidas. Porque alguém vai tentar matá-las.');
      G.Audio.sfx('boom'); G.shake = 8;
      await Cn.caption('As paredes tremeram. As tochas se apagaram uma por uma. Então uma voz subiu do túnel.');
      await say('???', '— Kravenox. Irmão...');
      await Cn.caption('Uma silhueta surgiu. Era Thornox — mas não o que estava ao seu lado. Este vestia armadura negra, já não tinha luz nos olhos, e trazia uma coroa de ossos na cabeça.');
      await say('O Thornox Coroado', '— Sentiu minha falta? Sou o seu futuro.');
      await say(ER, '— É o homem que matou o sexto mundo.');
      await say('O Thornox Coroado', '— Ainda não. Mas vou.');
      await Cn.end();
      F().erya = 1;
      L2.checkpoint('irmaoQueMorreu');
    }
    await S.irmaoQueMorreu();
  };

  // ===================== CAP. 2 — O IRMÃO QUE MORREU =====================
  S.irmaoQueMorreu = async function () {
    await L2.chapter(2, 'O Irmão que Morreu');
    await say(T, '— Você não é meu futuro.');
    await say('O Thornox Coroado', '— Sou aquilo que acontece quando você não consegue salvá-lo. O problema é que nenhum de vocês percebe que são a mesma prisão.');
    L2.heal();
    await G.battle(['thornoxCoroado'], { bg: 'tuneis', music: 'chefe', noEscape: true, intro: 'O Thornox Coroado antecipa cada passo antes que ele seja dado.', events: [
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.75, run: async () => {
        await say(K, '— Erya! Você disse que ele matou o sexto mundo. Como?');
        await say(ER, '— A coroa permite que ele escolha o que deve existir.');
        await say(K, '— Então não é força. É escolha. Você só está usando uma escolha que não é sua.');
        await say(T, '— Kravenox. Não tente vencê-lo sozinho.');
        await say(K, '— Não vou. Juntos.'); return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.45, run: async (b) => {
        G.Audio.sfx('crack'); G.flash('#c8d8ff', 0.6);
        await nar('Lyra entrou pela retaguarda e acertou a coroa com o cristal. Uma rachadura apareceu.');
        b.enemies[0].def = Math.round(b.enemies[0].def * 0.6);
        await say('O Thornox Coroado', '— NÃO!'); return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.15, run: async () => {
        await nar('Seraphyne abriu um portal, Kravenox agarrou a criatura, e Thornox concentrou toda a sua luz.');
        await say(T, '— KRAVENOX!'); await say(K, '— Agora!');
        G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 20;
        await nar('A explosão atingiu a coroa, que se partiu. A criatura gritou — não de dor, mas de medo.'); return 'end'; } }] });
    await nar('Sob a armadura negra havia um homem: um Thornox muito mais velho, cansado, ferido, com lágrimas nos olhos.');
    await say('O Thornox Coroado', '— Eu tentei. Tudo. Tentei salvar vocês. Vim para impedir que vocês cometam o meu erro. Quatro Reis... cada um controla uma parte do próximo mundo.');
    await say(K, '— Não toque nela.');
    await say('O Thornox Coroado', '— Então é isso. Você já escolheu. E foi exatamente assim que tudo começou. Não confie na menina. Ela não é a quinta parte. É a primeira.');
    await nar('O corpo dele sumiu, e a coroa quebrada caiu no chão. Erya chorava.');
    await say(ER, '— Eu fui criada antes de vocês. Pela primeira Essência. Mas antes da Fonte existia a vontade. Da própria existência.');
    await say(ER, '— O Primeiro Rei dos Mundos começou tudo. Está morto. Quem o matou foi você. O você de antes.');
    await L2.vision(['Kravenox pegou a coroa quebrada e, no instante em que a tocou, viu tudo:', 'Um mundo antigo, um trono, um rei, quatro guerreiros, uma criança e uma guerra.', 'E viu a si mesmo, muito mais velho, coberto de espinhos, com uma espada nas mãos. Diante dele, o Primeiro Rei.', 'Kravenox ergueu a espada e matou o rei.']);
    await say(K, '— Eu já vivi isso. A guerra. Antes de nascer.');
    G.Audio.sfx('boom'); G.shake = 16;
    await say(SE, '— Temos que sair!');
    F().ch2 = 1;
    await G.fade(1, 20);
    G.enterField('escolha', 17, 10, 'down');
    await S.solNegro();
  };
  S.solNegro = async function () {
    G.state.pend = 'solNegro';
    const Cn = C();
    G.fadeA = 0;
    await Cn.begin('solNegro', 'primeiro');
    await Cn.caption('Na superfície, o céu estava diferente: sem nuvens, com as duas luas alinhadas e, entre elas, uma terceira luz. Um sol negro.');
    await say(ER, '— Uma porta. Para o primeiro mundo.');
    await say(T, '— Então finalmente vamos descobrir a verdade.');
    await say(K, '— Não. A verdade é que vai descobrir a gente.');
    const rei = Cn.actor('rei', { img: () => X.enemyImg(D.ENEMIES.ultimoRei), x: 160, y: 60, z: 2, scale: 0.9, alpha: 0, glow: 'rgba(255,255,255,0.7)', glowA: 0.3 });
    await Cn.tween(rei, { alpha: 1, y: 120 }, 80);
    await Cn.caption('O sol negro se abriu, e uma figura surgiu no centro: armadura branca, uma espada, quatro olhos.');
    await say('O Último Rei', '— KRAVENOX. Eu sou o último Rei. Porque, depois de você, não haverá mais mundos.');
    await Cn.end();
    F().solNegro = 1;
    L2.checkpoint('ultimoReiLuta');
    await S.ultimoReiLuta();
  };

  // ===================== CAP. 3 — O ÚLTIMO REI =====================
  S.ultimoReiLuta = async function () {
    await L2.chapter(3, 'O Último Rei', ['O céu tinha se tornado uma ferida aberta.']);
    await say('O Último Rei', '— Essa espada. Foi com ela que você matou o Primeiro Rei.');
    await say(K, '— Você fala demais.');
    L2.heal();
    const th = () => G.state.party.find(h => h.id === 'thornox');
    await G.battle(['ultimoRei'], { bg: 'escolha', music: 'chefe', noEscape: true, intro: 'O Último Rei não luta como um guerreiro. Luta como uma lei.', events: [
      { when: b => b.round >= 2, run: async () => {
        G.Audio.sfx('dark'); G.flash('#ffffff', 0.6);
        await nar('A espada branca tocou o cajado de Thornox. A luz se apagou.');
        const t = th(); if (t) t.ep = 0;
        await say(T, '— Minha Essência...');
        await say('O Último Rei', '— Não estou tentando matar seu irmão. Estou tentando impedir que você exista. Você é a única variável que nenhum Rei conseguiu controlar.');
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.55, run: async () => {
        await say(ER, '— Pare! Você não pode me matar. Porque você também é uma parte de mim.');
        await say('O Último Rei', '— Fui criado para impedir que você criasse o sexto mundo. Porque o sexto mundo não terá Reis. Controle é a única forma de impedir o caos.');
        await say(K, '— Não. É a escolha. É isso que vocês temem.');
        G.Audio.sfx('heart'); G.shake = 14; G.flash('#a8ffc8', 0.7);
        await nar('O chão rachou. Árvores cresceram, cristais brotaram, rios mudaram de curso. O Reino estava escolhendo — não Kravenox, nem Thornox, nem os Reis. O próprio Reino.');
        await nar('No horizonte, a árvore negra cresceu até atravessar as nuvens, e cada folha parecia uma pequena estrela. Uma voz surgiu na mente de Kravenox: "Você me criou. Quando escolheu não destruir."');
        await say(T, '— Você não consegue mais apagar minha Essência. Porque agora ela pertence a mim.');
        const t = th(); if (t) { t.ep = t.mep; }
        await L2.learn(T, 'luzPropria');
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.15, run: async () => {
        await say(K, '— Thornox. Mais uma vez.');
        await say(T, '— Com prazer.');
        G.Audio.sfx('crack'); G.flash('#ffffff', 1); G.shake = 20;
        await nar('Os irmãos atacaram juntos, sombra e luz, e a espada branca se partiu. O Último Rei caiu de joelhos e, pela primeira vez, pareceu humano.');
        return 'end'; } }] });
    await say(K, '— Acabou.');
    await say('O Último Rei', '— Não. Eu ganhei no momento em que vocês começaram a lutar.');
    const Cn = C();
    await Cn.begin('portaisCeu', 'guerra');
    await Cn.caption('Atrás do sol negro surgiu uma segunda abertura, depois uma terceira, depois centenas. Portais se abriam no céu, e por eles desciam exércitos — mundos inteiros.');
    await say('???', '— O SEXTO MUNDO NASCEU.');
    await say('???', '— E OS REIS VIERAM BUSCÁ-LO.');
    await say(K, '— Então é isso. A guerra que o meu futuro tentou evitar.');
    await say(T, '— E nós?');
    await say(K, '— Nós vamos fazer diferente.');
    await Cn.caption('Pela primeira vez desde o Grande Cisma, os sobreviventes não fugiram. Ficaram. Pegaram armas, fecharam os portões e olharam para o céu.');
    await say(K, '— Eu não vou prometer que todos sobreviverão. Não vou prometer que venceremos. Mas prometo uma coisa: ninguém escolherá nosso destino por nós.');
    await say(T, '— Irmãos Espinhos.');
    await say(K, '— Juntos.');
    await Cn.caption('E, naquele momento, o Reino ganhou seu nome. Não veio de um rei, nem de um deus. Veio daqueles que decidiram ficar.');
    await say('A Multidão', '— REINO DA ESCOLHA! REINO DA ESCOLHA!');
    await Cn.end();
    F().ch3 = 1; L2.done();
    G.enterField('escolha', 16, 10, 'down');
    await G.fade(0, 20);
    await nar('A guerra começa ao amanhecer. Ainda há tempo de se preparar na cidade. Quando estiverem prontos, saiam pelos portões.');
    L2.saved();
  };

  // ===================== CAP. 4 — A GUERRA DOS MUNDOS =====================
  S.guerraComeca = async function () {
    const ok = await G.choose('Sair pelos portões para a Guerra dos Mundos?', ['Sim', 'Ainda não']);
    if (ok !== 0) { G.Field.py -= 1; return; }
    L2.checkpoint('guerraComeca2');
    await S.guerraComeca2();
  };
  S.guerraComeca2 = async function () {
    await L2.chapter(4, 'A Guerra dos Mundos', ['O primeiro exército atravessou o céu ao amanhecer. Sem trombetas, sem tambores.']);
    F().guerra = 1;
    await say(T, '— Eles estão chegando.');
    await say(K, '— Quantos?');
    await say(T, '— Não conseguimos contar.');
    await say(K, '— Então não precisamos. Só precisamos saber onde eles vão morrer.');
    await nar('Os primeiros inimigos chegaram à planície: enormes, de corpos cobertos por placas de pedra, quatro braços, olhos vermelhos. Atrás deles vinham criaturas menores, depois guerreiros, depois máquinas. E, por último, reis.');
    await say(ER, '— Quatro deles. São seis, na verdade. Eu nunca disse que eram apenas cinco.');
    await nar('As muralhas se abriram — não para deixar o inimigo entrar, mas para deixar a floresta sair. Raízes gigantes romperam o chão.');
    await G.battle(['soldadoPedra', 'criaturaFumaca', 'soldadoPedra'], { bg: 'guerraMundos', music: 'guerraMundos', noEscape: true, intro: 'Kravenox salta da muralha para o meio do exército!' });
    await nar('Os inimigos continuavam vindo, e Kravenox logo percebeu por quê: cada criatura carregava a marca de um dos Reis. Estavam ligadas.');
    await say('O Rei de Pedra', '— Você entende rápido.');
    L2.heal();
    await G.battle(['reiPedra'], { bg: 'guerraMundos', music: 'chefe', noEscape: true, intro: 'O Rei de Pedra avança. É enorme, mas lento.', events: [
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.6, run: async () => {
        G.Audio.sfx('dark'); G.flash('#2a2830', 0.8);
        await nar('Uma sombra surgiu atrás de Kravenox: o segundo Rei. A fumaça atravessou seu corpo, e ele sentiu algo sendo arrancado. Uma memória.');
        await say('O Rei de Fumaça', '— Memórias são fraquezas.');
        F().memRoubada = 'lamina';
        await nar('Kravenox esqueceu como usar o Raio da Essência.');
        await say(T, '— Ele não está sozinho.'); return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.12, run: async () => {
        G.Audio.sfx('crack'); G.shake = 14;
        await nar('Kravenox desviou, atacou as pernas, e a pedra rachou. O Rei de Pedra caiu sobre um joelho e recuou para trás dos portais.'); return 'end'; } }] });
    await say(T, '— Você está bem?');
    await say(K, '— Ele tirou uma memória. Não sei qual.');
    await say(T, '— Então nós lembramos por você. Você nunca esteve sozinho.');
    await nar('Lyra descobriu que os cristais da cidade conseguiam guardar memórias e começou a recolher os fragmentos dos que eram atingidos. Cada cristal guardava uma vida, uma história, um nome.');
    F().memRoubada = 0;
    await say(L, '— Kravenox. Toque aqui.');
    G.Audio.sfx('memory');
    await nar('Kravenox recuperou o Raio da Essência.');
    await L2.learn(L, 'cristalMem');
    await say(ER, '— A cidade está aprendendo. Cada memória acrescenta alguma coisa. Identidade.');
    await say(K, '— O Reino está lutando conosco.');
    await say(T, '— Não. Está lutando por si mesmo.');
    await nar('Seraphyne abria portais sobre as muralhas, e guerreiros surgiam atrás do inimigo.');
    await L2.learn(SE, 'portaisGuerra');
    F().ch4a = 1; L2.done();
    L2.heal();
    G.enterField('escolha', 16, 12, 'down');
    await G.fade(0, 20);
    await nar('O exército recuou por um instante para trás dos portais. A planície ainda está cheia de inimigos. Quando estiverem prontos, voltem aos portões: o terceiro Rei ainda não desceu.');
    L2.saved();
  };
  S.reiDasAsas = async function () {
    const ok = await G.choose('Voltar à planície e enfrentar o terceiro Rei?', ['Sim', 'Ainda não']);
    if (ok !== 0) { G.Field.py -= 1; return; }
    L2.checkpoint('reiDasAsas2');
    await S.reiDasAsas2();
  };
  S.reiDasAsas2 = async function () {
    await nar('O terceiro Rei desceu e abriu as asas negras. Seu grito atravessou o campo, e todos os soldados sentiram o medo da morte.');
    await say('O Rei das Asas', '— Você não pode vencer. Você ainda não entendeu o que está defendendo. Uma possibilidade. Se ela sobreviver, nenhum Rei poderá controlar o que vier depois.');
    await say(K, '— Agora entendi. É exatamente por isso que ela vai sobreviver.');
    await nar('Kravenox atacou, e o Rei das Asas subiu. Kravenox saltou atrás dele, e os dois atravessaram as nuvens até a cidade ficar pequena lá embaixo.');
    L2.solo('kravenox'); L2.heal();
    await G.battle(['reiAsas'], { bg: 'ceus', music: 'chefe', noEscape: true, intro: 'Acima das nuvens, sozinho contra o Rei das Asas.',
      setup: b => { b.enemies[0].hp = b.enemies[0].maxhp = 7400; },
      events: [
        { when: b => b.round >= 3 && !F().tec_asas, run: async () => {
          await nar('A criatura desviava, atacava, sumia, voltava. Kravenox percebeu que não o venceria no ar. Então parou de atacar.');
          await say('O Rei das Asas', '— Desistiu?');
          await say(K, '— Não.');
          G.Audio.sfx('dark'); G.flash('#000000', 0.9); G.shake = 12;
          await nar('Kravenox fechou os olhos, e seus espinhos cresceram muito além do normal, até se transformarem em enormes asas negras.');
          await say('O Rei das Asas', '— Isso não é possível.');
          await say(K, '— Estou começando a gostar dessa frase.');
          await L2.learn(K, 'asas'); return null; } },
        { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.2, run: async () => {
          await say('O Rei das Asas', '— Você está aprendendo.');
          await say(K, '— Não. Estou lembrando. De quem eu quero ser.');
          G.Audio.sfx('boom'); G.flash('#000000', 1); G.shake = 20;
          await nar('O Rei das Asas ergueu a espada, Kravenox avançou, e os dois desapareceram numa explosão negra.'); return 'end'; } }] });
    L2.regroup();
    await nar('Quando a fumaça se dissipou, Kravenox estava de pé e o Rei das Asas, ajoelhado, com a espada quebrada.');
    await say('O Rei das Asas', '— Você está procurando um rei. Mas o sexto Rei está procurando você.');
    const Cn = C();
    await Cn.begin('rainhaMemoria', 'memoria');
    const ra = Cn.actor('ra', { img: () => X.sprite('rainha', 'down', 0), x: 160, y: 150, z: 3, scale: 1.6, glow: 'rgba(240,240,255,0.8)', glowA: 0.4 });
    await Cn.caption('Uma mulher de túnica branca e cabelos completamente prateados caminhava tranquila pelo campo de batalha. Nenhum inimigo a atacava. Nenhum soldado conseguia se aproximar.');
    await say('???', '— Finalmente. A primeira pessoa que você matou. E a última que você vai precisar matar.');
    await Cn.caption('Naquele instante, Kravenox lembrou: uma criança, uma aldeia, um incêndio, uma espada. E uma promessa.');
    await say(K, '— Você... você morreu.');
    await say('???', '— Morri. Mas você me trouxe de volta.');
    await say(ER, '— Ela é a primeira memória.');
    G.Audio.sfx('dark');
    await Cn.tween(ra, { scale: 1.8 }, 30);
    await say(RM, '— E eu sou a Rainha da Memória. Não vim lutar. Vim mostrar a verdade.');
    await Cn.end();
    await L2.vision(['O nascimento dos Irmãos Espinhos. O Grande Cisma.', 'Thornox e Kravenox antes de serem inimigos. O Primeiro Rei. Erya.', 'E algo que jamais deveria ter existido: um terceiro irmão, apagado da história.']);
    await say(K, '— Os Irmãos Espinhos eram três. Onde ele está?');
    await say(RM, '— Dentro de você.');
    G.Audio.sfx('heart'); await G.wait(30); G.Audio.sfx('heart'); await G.wait(30); G.Audio.sfx('heart'); G.shake = 10;
    await nar('Kravenox tocou o próprio peito. Uma batida. Outra. E uma terceira, que não era dele.');
    await say(RM, '— O terceiro Irmão Espinho acordou.');
    await S.terceiroEspinho();
  };

  // ===================== CAP. 5 — O TERCEIRO ESPINHO =====================
  S.terceiroEspinho = async function () {
    await L2.chapter(5, 'O Terceiro Espinho');
    G.Audio.sfx('dark'); G.flash('#ff2020', 0.7); G.shake = 18;
    await nar('A terceira batida veio, e uma explosão de energia negra atravessou o corpo de Kravenox. Seus espinhos se dividiram: negros do lado esquerdo, brancos do lado direito. E, no centro do peito, uma terceira marca. Vermelha.');
    await L2.mind(['— Finalmente.', 'Kravenox estava num lugar escuro, diante de um jovem muito parecido com ele: olhos vermelhos, cabelos brancos, espinhos que formavam uma coroa natural ao redor do corpo.', '— Meu irmão?\n— Nosso irmão.\n— Qual é o seu nome?\n— Eu não tenho nome. Não quem foi apagado.', '— Eu sou aquilo que nasceu quando o Vazio tentou criar vida.'], '#ffb0b0');
    await say(T, '— Eu não tenho outro irmão.');
    await say(RM, '— Teve. Você o matou. Não se lembra porque eu apaguei. Ele descobriu que a Essência não era uma fonte. Era uma prisão.');
    await say(RM, '— A Essência cria vida. Mas também decide quanto tempo essa vida pode existir. Os Reis estão tentando tomar o lugar dela. E Erya é a primeira criatura capaz de escolher sem depender da Essência.');
    await L2.mind(['— Eles mentiram para você. Todos. Nosso pai escondeu o seu nascimento.', 'Três crianças, uma luz, uma sombra, um coração. Depois, uma lâmina.', 'Thornox recebeu a luz; Kravenox, a sombra; e o terceiro, o vazio.\n— Nós não somos irmãos. Somos um.'], '#ffb0b0');
    await say(K, '— Nós três somos partes da mesma criatura. Você é a luz. Eu sou a sombra. E ele é o vazio.');
    await say(RM, '— E existe uma quarta parte. A escolha.');
    await say(ER, '— Eu não quero isso.');
    await say(K, '— Você não escolheu nascer. Nós também não. Então talvez possamos escolher o que fazer agora.');
    G.Audio.sfx('memory'); G.flash('#a8ffc8', 0.6);
    await nar('Ela segurou a mão dele, e a quinta marca surgiu entre os dois.');
    G.Audio.sfx('boom'); G.shake = 14;
    await nar('Os Reis atacaram todos ao mesmo tempo, e a batalha voltou com violência.');
    L2.heal();
    await G.battle(['reiPedra', 'reiAsas'], { bg: 'guerraMundos', music: 'chefe', noEscape: true, intro: 'Os Reis atacam juntos. Cada golpe tenta separar os irmãos.',
      setup: b => { for (const e of b.enemies) { e.hp = e.maxhp = Math.round(e.maxhp * 0.5); } },
      events: [
        { when: b => b.round >= 2, run: async () => {
          await say(K, '— Thornox! Não deixe que nos separem!');
          await say(T, '— Entendi!');
          G.Audio.sfx('silver'); G.flash('#ffffff', 0.8);
          await nar('Os dois se aproximaram, e a luz e a sombra começaram a se misturar. O terceiro espinho reagiu, e o vazio surgiu. As três forças se uniram numa onda.');
          await L2.learn(K, 'tresForcas'); return null; } },
        { when: b => b.enemies.every(e => !e.alive || e.hp < e.maxhp * 0.45), run: async () => {
          G.Audio.sfx('memory'); G.flash('#a8ffc8', 1); G.shake = 10;
          await nar('Erya ergueu a mão, e a quinta marca brilhou. Escolha. A onda mudou: já não era destruição, era conexão. Por um instante, todos os soldados souberam exatamente por que estavam lutando.');
          await say('O Rei de Pedra', '— NÃO! Eles não têm escolha.');
          await say(K, '— Agora têm. Dei a eles o que vocês sempre roubaram.');
          await nar('Milhares de guerreiros largaram as armas, e os portais começaram a se fechar. O Rei de Pedra caiu de joelhos.');
          return 'end'; } }] });
    await say('O Último Rei', '— Então é isso. Vocês finalmente estão completos. Agora posso morrer. Abrindo a última porta.');
    const Cn = C();
    await Cn.begin('fissuraMundo', 'primeiroMundo');
    await Cn.caption('O chão tremeu, e uma enorme fissura se abriu atrás do Rei, de onde saía uma luz negra. Do outro lado surgiu uma cidade antiga: torres, florestas, um palácio e, no centro, um trono vazio.');
    await say(RM, '— Ele está abrindo o caminho para o Primeiro Mundo. O lugar onde tudo começou.');
    await nar('O terceiro coração bateu no peito de Kravenox, e da passagem veio a mesma voz que ele ouvira dentro de si: "Volte para casa."');
    await say(K, '— Você vem?');
    await say(T, '— Sempre.');
    await say(ER, '— Eu também.');
    await say(L, '— Então vamos descobrir quem apagou nossa história.');
    await Cn.caption('Seraphyne abriu o último portal. Kravenox olhou uma última vez para o Reino da Escolha e atravessou. E, muito abaixo da terra, algo antigo abriu os olhos.', 70);
    G.fadeA = 1;
    await Cn.end();
    F().ch5 = 1; L2.done();
    await S.primeiroMundoChega();
  };

  // ===================== CAP. 6 — O PRIMEIRO MUNDO =====================
  S.primeiroMundoChega = async function () {
    await L2.chapter(6, 'O Primeiro Mundo', ['O ar daquele lugar era tão antigo que parecia ter esquecido como respirar.']);
    G.enterField('primeiroMundo', 16, 15, 'up');
    await G.fade(0, 30);
    await say(T, '— Onde estamos?');
    await say(ER, '— Em casa. O lugar onde tudo começou.');
    await nar('Torres negras que sumiam nas nuvens, pontes ligando construções impossíveis, rios de luz correndo pelas ruas. Mas não havia ninguém. A cidade parecia ter sido abandonada no instante em que nasceu.');
    await say(K, '— Não gosto daqui.');
    await say(ER, '— É porque vocês se lembram. Da morte.');
    await nar('Kravenox passou a mão numa parede, e uma imagem surgiu: uma criança correndo, depois outra, depois centenas.');
    await say(ER, '— O Primeiro Mundo não morreu. Estão todos aqui. Transformados em memória.');
    L2.saved();
  };
  S.chegadaPrimeiroMundo = async () => { await nar('A passagem se fechou atrás deles. Não há volta por aqui.'); };
  S.paredeMemoria = async () => nar(G.pick(['Ao toque, a parede mostra uma criança correndo. Depois outra. Depois centenas.', 'Uma mulher pendura roupas numa janela que já não existe.', 'Dois meninos brincam perto de uma árvore branca. Um deles brilha. O outro tem sombra.']));
  S.torreVazia = async () => nar('Uma torre negra sem porta. Ela vai até as nuvens.');
  S.rioLuz = async () => nar('Um rio de luz corre pela rua, sem fazer barulho.');
  S.encontroPaiMemoria = async function () {
    if (F().paiMemoria) return; F().paiMemoria = 1;
    await say('???', '— Por mim. Fui eu que transformei este mundo em memória.');
    await nar('Um homem alto caminhava devagar em direção a eles. Os cabelos eram completamente brancos, e os olhos eram iguais aos de Kravenox. O terceiro espinho reagiu com tanta força que Kravenox quase caiu.');
    await say(PAI, '— Finalmente. Você me chamava de pai. Não por respeito. Porque eu era.');
    await say(K, '— Nosso pai morreu.');
    await say(PAI, '— O homem que vocês conheciam morreu. Sou a memória dele. Neste mundo, isso é suficiente. Vocês destruíram tudo aqui. Só não tinham os corpos que têm agora.');
    await L2.vision(['Três crianças diante de uma enorme árvore branca: uma que brilhava, outra envolta em sombras, a terceira feita de vazio.', 'Os três cresceram, aprenderam, lutaram, construíram, criaram vida.', 'Depois, o terceiro irmão desapareceu. Foi para dentro de Kravenox. Porque pediu.']);
    await say(PAI, '— A Essência nunca obrigou ninguém a viver. Ele não queria destruí-la. Queria libertá-la.');
    G.Audio.sfx('boom'); G.shake = 10;
    await say(PAI, '— Ele está chegando. O verdadeiro Primeiro Rei. Os Reis mentem. Ele está no trono. O palácio fica ao norte.');
    L2.saved();
  };
  S.paiMemoria = async () => { await say(PAI, '— O palácio. As portas vão se abrir para vocês. Para mim, não.'); };
  S.entrarPalacio = async function () {
    if (!F().paiMemoria) { await nar('As portas, de centenas de metros, não se movem.'); G.Field.py += 1; return; }
    if (F().primeiroRei) { await nar('O palácio está ruindo. Não há nada lá dentro além de pó.'); G.Field.py += 1; return; }
    await L2.warpDungeon('palacio');
  };
  S.tronoPrimeiroRei = async function () {
    if (F().primeiroRei) return;
    if (!F().reiAcordou) {
      const Cn = C();
      await Cn.begin('salaoTrono', 'primeiro');
      await Cn.caption('O palácio revelou um salão vazio e, ao fundo, um trono. Sobre ele havia um cadáver muito antigo, numa armadura dourada, com uma espada atravessada no peito.');
      await say(K, '— Então ele realmente morreu.');
      await say(PAI, '— O corpo morreu.');
      G.Audio.sfx('dark'); G.flash('#000000', 0.6);
      await Cn.caption('O cadáver abriu os olhos — quatro olhos negros — e sorriu.');
      await say('O Primeiro Rei', '— Meu filho. Você voltou. Chegou a hora de terminar o que começamos. Criar o mundo perfeito.');
      await say(K, '— Não existe mundo perfeito.');
      await say('O Primeiro Rei', '— Você dizia isso antes. Muitas vezes. Todas.');
      await Cn.caption('A memória voltou: uma vida, depois outra, depois outra. Milhares de vezes, sempre tentando quebrar o ciclo, sempre falhando, sempre retornando.');
      await say(T, '— Eu lembro. Eu matei você. Todas as vezes.');
      await say('O Primeiro Rei', '— Precisava descobrir se finalmente aprenderiam que não existe liberdade sem consequência.');
      await say(ER, '— Você não vai tocar neles.');
      await Cn.end();
      F().reiAcordou = 1;
      L2.checkpoint('tronoPrimeiroRei');
    }
    L2.heal();
    let lembrou = false;
    await G.battle(['primeiroRei'], { bg: 'palacio', music: 'chefe', noEscape: true, intro: 'O Primeiro Rei se levanta do trono, a espada ainda atravessada no peito.',
      setup: b => { b.enemies[0].regen = 0.07; },
      choose: { who: 'kravenox', when: b => b.round >= 2 && !lembrou, prompt: 'O Rei se refaz a cada golpe. O que fazer?', options: [
        { label: 'Atacar com toda a força', run: async () => { await say(PAI, '— Não adianta. Ele se alimenta do esquecimento.'); return null; } },
        { label: 'Chamar o mundo inteiro para lembrar', run: async (b) => {
          lembrou = true; b.enemies[0].regen = 0;
          G.Audio.sfx('memory'); G.flash('#fff0c0', 0.9);
          await nar('Lyra e Seraphyne ficaram ao lado deles. A Rainha da Memória apareceu. E todos os habitantes daquele mundo começaram a surgir — não como corpos, mas como memórias. Milhares. Milhões.');
          await say(K, '— Ele se alimenta do esquecimento. Então vamos fazer o contrário.');
          await say('Todas as Vozes', '— LEMBRAR.');
          const e = b.enemies[0]; e.hp = Math.max(1, e.hp - Math.round(e.maxhp * 0.35)); e.def = Math.round(e.def * 0.7); e.flash = 20;
          await say('O Primeiro Rei', '— NÃO!'); return null; } }],
        hints: [{ round: 3, text: 'Cada golpe parece fazer o Rei mais forte, e ninguém aqui consegue lembrar dos próprios nomes. (Kravenox pode Escolher.)' }] },
      events: [{ when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.12, run: async () => {
        await say('O Primeiro Rei', '— Vocês ainda não entenderam. O terceiro irmão não está dentro de você. Ele é você.'); return 'end'; } }] });
    F().primeiroRei = 1;
    L2.checkpoint('aquiloQueSou');
    await S.aquiloQueSou();
  };

  // ===================== CAP. 7 — AQUILO QUE SOU =====================
  S.aquiloQueSou = async function () {
    await L2.chapter(7, 'Aquilo que Sou');
    await nar('A terceira batida parou. Kravenox caiu de joelhos. E, pela primeira vez, o terceiro espinho falou pela sua própria boca: — Finalmente.');
    await nar('Seus olhos tinham mudado: um brilhava em vermelho, o outro em branco.');
    await say(K, '— Não. Agora eu lembro. Você passou milhares de anos tentando me convencer de que eu era uma parte. Uma sombra. Um fragmento. Mas eu nunca fui uma parte. Eu era a união.');
    await L2.vision(['A Primeira Essência existia sozinha. Então surgiu a primeira escolha: ela decidiu criar. Criou mundos, vida, os primeiros seres. E criou o Primeiro Rei.', 'O Rei tinha medo de perder o controle. Criou três filhos — três possibilidades: luz, sombra, vazio — e queria escolher qual governaria.', 'Mas a Essência fez outra escolha. Uma quarta possibilidade. União. Escolha.\nKravenox.', 'Ele criou a mentira. Disse a cada irmão que o outro era seu inimigo. A mentira funcionou: o Grande Cisma, o Reino Quebrado, até aquele momento.']);
    await say(K, '— Você tentou salvar o seu controle sobre eles.');
    await say(K, '— Somos escolhas diferentes da mesma Essência. O Grande Cisma foi uma mentira.');
    await say(K, '— Não, Thornox. Esse é meu.');
    L2.solo('kravenox'); L2.heal();
    await G.battle(['primeiroReiD'], { bg: 'palacio', music: 'chefe', noEscape: true, intro: 'Kravenox conhece os movimentos dele, as memórias, a origem. E o medo.',
      events: [{ when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.3, run: async () => {
        await say(K, '— Você tem medo de uma coisa. Que alguém escolha sem você.'); return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.08, run: async () => {
        await nar('O primeiro golpe rachou a armadura; o segundo abriu o peito; o terceiro arrancou a espada da mão do Rei.'); return 'end'; } }] });
    L2.regroup();
    await nar('O Primeiro Rei caiu de joelhos, e Kravenox o segurou pelo pescoço. Os espinhos cresceram.');
    await say('O Primeiro Rei', '— Você realmente acredita que acabou? Então me mate.');
    for (;;) {
      const c = await G.choose('O que Kravenox faz?', ['Matar o Primeiro Rei', 'Acabar com o trono']);
      if (c === 1) break;
      await say(T, '— Kravenox! Ele quer que você o mate. Porque isso completa o ciclo.');
      await say('O Primeiro Rei', '— Se você me matar, se torna o próximo Rei. Esse sempre foi o plano.');
    }
    await say(K, '— Não. Eu não vou ocupar o seu lugar. Vou acabar com o trono. Nenhum mundo precisa de um Rei.');
    G.Audio.sfx('crack'); G.shake = 16; G.flash('#a8ffc8', 0.8);
    await nar('A coroa do Primeiro Rei caiu. Erya tocou a pedra do trono, e a quinta marca apareceu. O trono se desfez, a coroa virou pó, e a Essência deixou de obedecer ao Primeiro Rei.');
    await say('O Primeiro Rei', '— Você acha que libertou os mundos. Então descubra o que existe do outro lado da liberdade.');
    await nar('E desapareceu. Os portais já não eram controlados. Simplesmente existiam, abertos para qualquer um.');
    await say(K, '— Pela primeira vez, o futuro não pertence a ninguém.');
    G.Audio.sfx('heart'); G.shake = 8;
    await nar('No lugar onde o Primeiro Rei desaparecera havia uma pequena rachadura vermelha. De dentro dela vinha um som. Uma batida. Duas. Três. Quatro. Cinco. Seis.');
    await S.nascimentoCaos();
  };

  // ===================== CAP. 8 — O NASCIMENTO DO CAOS =====================
  S.nascimentoCaos = async function () {
    G.state.pend = 'nascimentoCaos'; D.save();
    await L2.chapter(8, 'O Nascimento do Caos');
    await nar('Uma criatura saiu da rachadura: um corpo de raízes e ossos, seis olhos no rosto, cada um mostrando um mundo diferente.');
    await say('Caos', '— Finalmente. Sou aquilo que nasceu quando os mundos deixaram de ter Reis. A Essência cria possibilidades. Eu sou o que acontece quando todas elas acontecem ao mesmo tempo.');
    await say(RM, '— Agora começa a verdadeira guerra.');
    L2.heal();
    let parados = false;
    await G.battle(['caos'], { bg: 'primeiroMundo', music: 'caos', noEscape: true, intro: 'Caos. Espinhos viram árvores, sombras viram luz, lâminas viram água.',
      setup: b => { b.enemies[0].absorb = 0.5; },
      choose: { who: 'kravenox', when: b => b.round >= 2, prompt: 'Nada do que fazem permanece igual. Escolher...', options: [
        { label: 'Atacar com tudo, de uma vez', run: async () => { await say(ER, '— Se escolhermos vencer, ele encontrará uma possibilidade em que perdemos!'); return null; } },
        { label: 'Prendê-lo numa forma', run: async () => { await say(SE, '— Uma coisa com forma pode ser derrotada... mas ele precisa ser obrigado a escolher uma. E ele prevê qualquer escolha que a gente faça.'); return null; } },
        { label: 'Não escolher nada', run: async () => { parados = true; return 'end'; } }],
        hints: [{ round: 3, who: ER, text: '— Ele existe porque todas as possibilidades precisam acontecer. Precisamos escolher algo que não seja vitória nem derrota.' },
          { round: 5, who: ER, text: '— Escolher não vencer. Ele precisa das nossas escolhas.' }] } });
    await nar('Kravenox abriu os braços. Thornox também. Lyra guardou o cristal. Seraphyne fechou os portais. Erya apagou a quinta marca.');
    await say('Caos', '— O que estão fazendo?');
    await say(K, '— Nada. Você precisa que escolhamos alguma coisa. Então não vamos escolher.');
    await say('Caos', '— ESCOLHAM!');
    await say(K, '— Não.');
    G.Audio.sfx('crack'); G.shake = 14;
    await nar('O corpo de Caos começou a rachar. Milhares de possibilidades escapavam dele, mas nenhuma se concretizava, porque ninguém escolhia. A criatura encolheu até assumir a forma de um homem comum. Apenas um homem caído no chão.');
    await say(K, '— Agora você pode escolher.');
    await say('Caos', '— O que eu sou?');
    await say(K, '— Finalmente... você.');
    await nar('Kravenox estendeu a mão. O homem olhou para ela por muito tempo. Mas a segurou.');
    const Cn = C();
    await Cn.begin('mundoFloresta', 'despedida');
    await Cn.caption('O Primeiro Mundo começou a morrer — mas não como antes. Dessa vez, era uma morte natural. As memórias se apagaram devagar, e a cidade começou a se transformar em floresta.');
    const ra = Cn.actor('ra', { img: () => X.sprite('rainha', 'down', 0), x: 160, y: 150, z: 3, scale: 1.5, glow: 'rgba(240,240,255,0.8)', glowA: 0.5 });
    await say(RM, '— É hora. Eu sou a memória deste mundo. E vocês não precisam mais lembrar por mim.');
    await say(T, '— Obrigado.');
    await say(RM, '— Kravenox. Não deixe que eles escrevam a sua história de novo.');
    await say(K, '— Não vou.');
    G.Audio.sfx('memory');
    await Cn.tween(ra, { alpha: 0, y: 120 }, 90);
    await Cn.caption('A Rainha se desfez em pequenas partículas de luz, e o Primeiro Mundo finalmente descansou.', 70);
    await Cn.end();
    await say(T, '— Está pensando nele. No nosso pai.');
    await say(K, '— Passei muito tempo odiando ele. Ainda odeio algumas coisas que ele fez. Mas finalmente entendo. Ele também tinha medo.');
    await say(T, '— Então precisamos ensinar as pessoas a escolher apesar dele.');
    F().ch8 = 1; L2.done();
    await G.fade(1, 20);
    G.enterField('escolha', 16, 9, 'down');
    await G.fade(0, 30);
    await nar('Quando voltaram ao Reino da Escolha, a cidade tinha crescido. E, no centro, havia uma construção nova: um salão sem trono, sem coroa, sem rei.');
    await say('Uma Criança', '— Quem construiu isso? Todo mundo!');
    await nar('Kravenox sorriu. Pela primeira vez desde o Abismo Carmesim, sentiu que talvez pudesse descansar.');
    await say('Mensageiro', '— Kravenox! Encontramos alguma coisa no norte. Uma cidade. Ela não pertence a nenhum dos mundos.');
    await L2.vision(['Ao tocar o fragmento de cristal, Kravenox viu uma cidade enorme e, no centro dela, um edifício com um símbolo — o mesmo que ele carregava no peito.'], 'escolha');
    await say(K, '— Não é coincidência. É um chamado.');
    await say(T, '— Achei que você queria descansar.');
    await say(K, '— Eu queria. Agora quero descobrir quem está chamando.');
    await nar('Atrás deles, Erya observava em silêncio. A cidade ao norte não tinha sido descoberta. Tinha aparecido. (A saída norte da cidade agora está aberta.)');
    F().ch8fim = 1;
    L2.saved();
  };

  // ---------- Reino da Escolha: lugares e gente ----------
  S.salaoSemTrono = async function () {
    if (!F().ch8) { await nar('Um prédio em construção no centro da cidade. Ninguém sabe ainda o que ele vai ser.'); return; }
    await nar('Um salão sem trono, sem coroa, sem rei. Na entrada, uma única inscrição:');
    await nar('NINGUÉM ESCREVE O DESTINO DE OUTRO.');
  };
  S.arvoreQuinta = async function () {
    await nar('A árvore negra que ninguém plantou. No tronco, quatro marcas: luz, sombra, memória e Vazio. E uma quinta, que não pertence a nenhum deles.');
    if (F().ch3) await nar('Desde a batalha com o Último Rei, ela atravessa as nuvens. Cada folha parece uma pequena estrela.');
  };
  S.casaConstrucao = async () => nar(G.pick(['Uma casa nova. Ainda cheira a madeira cortada.', 'Lá dentro, alguém martela. Uma criança canta junto.', 'A porta está aberta. Ninguém tranca mais nada por aqui.']));
  S.muralhaEscolha = async () => nar(F().guerra && !F().ch5 ? 'Arqueiros nas muralhas. As flechas atravessam os inimigos e somem.' : 'A muralha nova. Ainda há andaimes por toda parte.');
  S.mascateEscolha = async function () {
    if (!F().mascateL2) {
      F().mascateL2 = 1;
      await say('Mascate de Cinzas', '— Kravenox! Um reino novo, um nome novo, preços novos. Os mesmos fregueses, felizmente.');
      await say(T, '— Você não morreu?');
      await say('Mascate de Cinzas', '— Morrer dá prejuízo.');
    }
    await G.shop('Mascate de Cinzas', ['elixir', 'agua', 'paoReino', 'cristalG', 'cristalEsc', 'raiz', 'folha', 'nevoa', 'garraEscolha', 'cajadoEscolha', 'cristalReino', 'laminaPortal', 'cotaReino'], 60);
  };
  S.construtor = async () => { await say('Construtor', F().ch3 ? '— Reino da Escolha. Fui eu que gritei primeiro, sabia? Bem, acho que fui.' : '— Casas, muralhas, campos. Você disse "tudo". Estamos levando a sério.'); };
  S.maeFilha = async () => { await say('Uma Mãe', F().guerra && !F().ch5 ? '— Minha filha não chora mais quando o céu abre. Ela diz que vocês estão lá fora.' : '— Perguntei o que devíamos fazer e você disse: construir. Foi a primeira vez que alguém não me mandou fugir.'); };
  S.criancaEscolha = async () => { await say('Uma Criança', F().ch8 ? '— O salão é de todo mundo! Até meu.' : '— Você é o dos espinhos? Posso tocar? Não pica?'); };
  S.soldadoPortao = async () => { await say('Soldado', !F().ch3 ? '— Os túneis ficam entre os dois poços, no centro da cidade.' : !F().ch5 ? '— Quando quiserem sair, os portões abrem para vocês.' : '— A saída norte está aberta. Dizem que há uma cidade lá que não estava ali ontem.'); };
  S.sairNorteEscolha = async function () {
    if (!F().ch8fim) return;
    await L2.warpField('norte', 18, 14, 'up');
    if (!F().ch9) { F().ch9 = 1; await L2.chapter(9, 'A Cidade que Não Existia', ['A viagem para o norte começou antes do amanhecer.']); }
  };
  S.voltarEscolha = async function () { await L2.warpField('escolha', 16, 1, 'down'); };

  // ===================== CAP. 9 — AS TERRAS SEM ESSÊNCIA =====================
  S.semEssencia = async function () {
    if (F().semEss) return; F().semEss = 1;
    await nar('As árvores diminuíam, a terra escurecia, e cristais negros começavam a aparecer entre as pedras.');
    await say(K, '— Não consigo sentir a Essência.');
    await say(ER, '— Porque ela não existe aqui. Este lugar está fora do ciclo.');
    await say(K, '— Então o que mantém este lugar vivo?');
    await nar('Erya não respondeu.');
  };
  S.colunaSozinha = async function () {
    if (F().coluna) { await nar('A coluna solitária. Fria. Sem memória.'); return; }
    F().coluna = 1;
    await nar('Uma coluna, sozinha, sem ruínas ao redor, sem estrada. Kravenox tocou a pedra. Não havia memória, nenhuma marca de Essência. Nada.');
    await say(SE, '— Não consigo abrir portal aqui.');
    await nar('Thornox tentou usar a luz. Uma pequena chama apareceu e logo morreu.');
  };
  S.criaturaCinzenta = async function () {
    if (F().criatura) return;
    await nar('Passos. Uma criatura saiu de entre as pedras: pequena, parecida com uma pessoa, de pele completamente cinzenta e olhos dourados.');
    await say('Habitante', '— Vocês não deveriam estar aqui. Sou um habitante. Da cidade.');
    await say(K, '— Que cidade?');
    await say('Habitante', '— Vocês ainda não conseguem vê-la. Sigam-me. Para o norte.');
    F().criatura = 1;
  };
  S.criaturaFala = async () => { await say('Habitante', '— Para o norte. Ela aparece quando quer.'); };
  S.cidadeAparece = async function () {
    if (F().cidadeViu) return; F().cidadeViu = 1;
    const Cn = C();
    await Cn.begin('cidadeAster', 'aster');
    await Cn.caption('Não houve transição. Num instante havia pedras; no seguinte, havia uma cidade. Torres negras atravessavam as nuvens. Pontes flutuavam, rios corriam para cima. E a cidade possuía seu próprio céu.');
    await say('Habitante', '— Ninguém a construiu. Ela construiu a si mesma.');
    await say(ER, '— Esta cidade existia antes do Primeiro Mundo. Antes da primeira Essência.');
    await Cn.end();
  };
  S.entrarCidadeAster = async function () {
    if (!F().criatura) return;
    await L2.warpField('cidadeAster', 15, 17, 'up');
    if (!F().cidadeEntrou) {
      F().cidadeEntrou = 1;
      await nar('Ninguém os impediu, mas todos observavam: criaturas com asas, seres feitos de pedra, pessoas de olhos negros, figuras que pareciam sombras vestindo roupas. Apenas curiosidade.');
      await say('Habitante', '— Vocês foram esperados. Por ele. Na torre do centro.');
      L2.saved();
    }
  };
  S.saidaCidadeAster = async function () {
    if (F().maeLivre && !F().l2p1fim) { await nar('Não há para onde fugir. O céu inteiro está descendo sobre a cidade.'); G.Field.py -= 1; return; }
    await L2.warpField('norte', 18, 1, 'down');
  };
  S.casaAster = async () => nar(G.pick(['Uma casa construída de dentro para fora.', 'A janela mostra um céu que não é o mesmo lá de fora.', 'Lá dentro, alguém feito de pedra lê um livro.']));
  S.rioParaCima = async () => nar('A água corre para cima, até sumir no céu da cidade.');
  S.torreNegraAster = async () => nar('Uma torre negra. No alto, o mesmo símbolo que Kravenox carrega no peito.');
  S.habitanteAster = async () => { await say('Habitante de Pedra', F().devoradores ? '— Você tocou neles e eles foram embora. Nunca vi um Devorador ir embora.' : '— Aqui ninguém governa. Também ninguém obedece. A gente escolhe.'); };
  S.habitanteAster2 = async () => { await say('Habitante Alado', F().antigosVem ? '— O céu inteiro escureceu. Mas a cidade está se refazendo. Está escolhendo continuar.' : '— Esta cidade aparece e desaparece. Hoje decidiu aparecer para vocês.'); };
  S.mercadorAster = async function () {
    await say('Mercador sem Sombra', '— Aqui não se usa Essência para pagar. Fragmentos servem. Fragmentos de qualquer mundo.');
    await G.shop('Mercador sem Sombra', ['agua', 'paoReino', 'cristalEsc', 'folha', 'nevoa', 'garraEscolha', 'cajadoEscolha', 'cristalReino', 'laminaPortal', 'cotaReino'], 60);
  };
  S.asterFala = async function () {
    if (!F().devoradores) { await say(AS, '— Venham até a torre.'); return; }
    if (F().maeLivre) { await say(AS, '— A cidade está se refazendo. E vocês trouxeram de volta alguém que não deveria poder sair do Entre.'); return; }
    await say(AS, '— Liberte bilhões de mortos é uma coisa. Impedir que todos eles voltem ao mesmo tempo é outra.');
  };

  // ===================== A TORRE DE ASTER (caps. 9–11) =====================
  S.torreAster = async function (x, y) {
    if (y > 8) {   // a casa de descanso
      const i = await G.choose('Uma casa de descanso. "Aqui ninguém cobra de quem vem de longe." Descansar?', ['Sim', 'Não']);
      if (i === 0) { await G.rest(); L2.saved(); }
      G.Field.py += 1; return;
    }
    if (!F().asterChegou) return S.asterTorre();
    if (F().devoradores && !F().ch11) return S.prisaoEntreMundos();
    await nar('A sala do mapa. Centenas de esferas flutuam: algumas brilham, outras estão apagadas.');
    G.Field.py += 1;
  };
  S.asterTorre = async function () {
    const Cn = C();
    await Cn.begin('salaMapa', 'aster');
    const as = Cn.actor('as', { img: () => X.sprite('aster', 'down', 0), x: 160, y: 150, z: 3, scale: 1.5 });
    await Cn.caption('A porta da torre se abriu. Um homem esperava: talvez trinta anos, cabelos escuros e olhos dourados, sem armadura e sem armas.');
    await say(AS, '— Você demorou. Meu nome é Aster.');
    await say(T, '— Você é o governante daqui?');
    await say(AS, '— Não existe governante. Ninguém obedece. Escolhem. Seu Reino aprendeu a escolher. Nós nunca aprendemos a obedecer.');
    await Cn.caption('Numa sala subterrânea havia um mapa dos mundos: centenas de esferas flutuando. Aster tocou uma delas, completamente negra, e ela se abriu.');
    await L2.vision(['O Abismo Carmesim. O cristal negro.', 'Antes de Kravenox abrir os olhos, alguém estava diante do cristal. Uma mulher.\nEla pôs a mão sobre a pedra e disse: — Ainda não.', 'A mulher saiu, e o cristal permaneceu fechado.']);
    await say(K, '— Quem é ela?');
    await say(AS, '— Sua mãe.');
    await say(T, '— Nossa mãe morreu antes do Grande Cisma.');
    await say(AS, '— Essa é a história que vocês conhecem. Ela está num lugar entre mundos. Onde aqueles que não podem morrer são colocados. Quem os colocou foi o Primeiro Rei.');
    await say(K, '— Quero ir até ela.');
    await say(AS, '— Se entrar naquele lugar agora, não voltará. Sua mãe não está sozinha. Todos os seres que os Reis apagaram estão lá. Bilhões.');
    G.Audio.sfx('bell'); G.shake = 8;
    await Cn.caption('Um alarme começou a tocar. No céu da cidade havia uma enorme abertura, e algo atravessava: uma criatura feita de vários mundos mortos. Montanhas nas costas, florestas nos braços, rios escorrendo da boca, olhos que eram portais.');
    await say(AS, '— Devoradores. Não trabalham para ninguém. Querem mundos. E esse não veio sozinho.');
    await Cn.caption('Atrás dele, outros começaram a surgir. Dezenas. Centenas. Milhares. E, no meio deles, um Devorador diferente: humanoide, numa armadura feita de ossos.');
    await say('O Homem de Ossos', '— Filho. Não vai reconhecer seu próprio pai?');
    await Cn.end();
    F().asterChegou = 1;
    L2.checkpoint('paiDevoradores');
    await S.paiDevoradores();
  };

  // ===================== CAP. 10 — O PAI DOS DEVORADORES =====================
  S.paiDevoradores = async function () {
    await L2.chapter(10, 'O Pai dos Devoradores');
    await say(T, '— Você não é nosso pai.');
    await nar('A criatura ergueu a mão, e uma marca apareceu no peito de Thornox. A memória veio: uma voz, uma mulher, um bebê e uma promessa. "Um dia, eles voltarão."');
    await say(T, '— Mãe...');
    await say(K, '— Então você a abandonou.');
    await say('O Homem de Ossos', '— Não. Eu não consegui salvá-la. E eles não vieram por mim. Vieram pelo que existe dentro de você. A última parte da Primeira Essência.');
    await say(AS, '— Se ele possui a última parte, pode recriar a Primeira Essência. Todos os mundos seriam puxados para um só. Sem fronteiras. Sem escolha.');
    await say('O Homem de Ossos', '— Eu só quero minha família de volta.');
    await say(AS, '— TODOS PARA AS MURALHAS!');
    L2.heal();
    let mao = false;
    await G.battle(['devoradorMenor', 'devoradorGrande', 'garrasMundo'], { bg: 'cidadeAster', music: 'devorador', noEscape: true, intro: 'O primeiro Devorador cai sobre a muralha!',
      choose: { who: 'kravenox', when: b => b.round >= 2, prompt: 'Eles se refazem. Cada um carrega mundos mortos.', options: [
        { label: 'Mirar na cabeça do maior', run: async () => { await say(L, '— Eles não param!'); await say(K, '— Então parem de tentar matar!'); return null; } },
        { label: 'Baixar a arma e estender a mão', run: async () => { mao = true; return 'end'; } }],
        hints: [{ round: 3, text: 'Kravenox percebe: cada Devorador carrega centenas de memórias. Não atacam por ódio. Estão famintos porque perderam seus próprios mundos.' }] } });
    await say(K, '— Eles não querem nos destruir. Querem voltar para casa.');
    const Cn = C();
    await Cn.begin('devoradorMao', 'despedida');
    await Cn.caption('Kravenox caminhou até o maior dos Devoradores e estendeu a mão. Uma memória surgiu: um mundo verde, crianças correndo, um sol azul. Depois, fogo. O mundo morreu, e a criatura absorveu os restos. Depois outro. E outro.');
    await say(K, '— Eu entendo. Você não precisa carregar todos eles.');
    G.Audio.sfx('memory'); G.flash('#a8ffc8', 0.7);
    await Cn.tween(Cn, { freed: 1 }, 140);
    await Cn.caption('As memórias saíram do corpo dele: milhares de pequenas luzes subindo ao céu, cada uma encontrando seu próprio caminho. No lugar do monstro havia uma criatura pequena, assustada. Viva.');
    await say(T, '— Eles nunca foram monstros. Só estavam perdidos.');
    await Cn.caption('Os outros Devoradores pararam. Um. Dez. Cem. Milhares. Não morreram: foram libertados. O céu se encheu de luz.', 70);
    await Cn.end();
    await say(K, '— Você sabia que isso aconteceria.');
    await say('O Homem de Ossos', '— Porque você sempre teve essa capacidade. Eu tinha medo de você. Você não nasceu para destruir. Nasceu para escolher. E eu sabia que um dia você escolheria contra mim.');
    await say(T, '— Pai.');
    await say('O Homem de Ossos', '— Não me chame assim. Eu não mereço. Sua mãe descobriu o que vocês eram. A chave. Para abrir a prisão.');
    G.Audio.sfx('dark'); G.shake = 10;
    await nar('Uma pequena rachadura apareceu no céu. Além dela, um olho gigantesco observava todos eles. Uma voz feita de muitas vozes atravessou o céu.');
    await say('???', '— KRAVENOX. DEVOLVA-ME O QUE É MEU. VOCÊ FOI CRIADO PARA ME ABRIR.');
    await L2.vision(['A Primeira Essência nunca havia sido uma prisão.', 'Era uma fechadura.', 'E Kravenox era a chave.'], 'entre');
    await say(K, '— Precisamos encontrar nossa mãe. Ela sabe como me impedir de abrir a porta.');
    await say('O Homem de Ossos', '— Não. Sua mãe vai pedir que você abra. Porque ela acredita que o que está atrás da porta pode ser salvo.');
    F().devoradores = 1; L2.done();
    L2.heal();
    await nar('Kravenox sentiu medo. Não de morrer, nem de perder, mas da possibilidade de que sua mãe estivesse certa. (Quando estiverem prontos, voltem à torre de Aster.)');
    L2.saved();
  };

  // ===================== CAP. 11 — A PRISÃO ENTRE MUNDOS =====================
  S.prisaoEntreMundos = async function () {
    const ok = await G.choose('Subir a torre e decidir o que fazer?', ['Sim', 'Ainda não']);
    if (ok !== 0) { G.Field.py += 1; return; }
    L2.checkpoint('prisaoEntre2');
    await S.prisaoEntre2();
  };
  S.prisaoEntre2 = async function () {
    await L2.chapter(11, 'A Prisão entre Mundos');
    await say(AS, '— O lugar onde sua mãe está é chamado de Entre. Não pertence a lugar nenhum. E muda de lugar. Ela encontra vocês. Quando ela chamar.');
    await G.fade(0.7, 30, '#000010');
    await nar('Naquela noite, Kravenox não dormiu. Ficou sozinho no alto da torre, observando as estrelas artificiais da cidade, até que Thornox apareceu.');
    await say(T, '— Você sempre fica acordado quando está com medo.');
    await say(K, '— Você está ficando irritante.');
    await say(T, '— Aprendi com você. E se ela estiver certa? Sobre aquilo atrás da porta?');
    await say(K, '— Então talvez tenhamos que abrir. Saber o que pode acontecer não significa que devemos ter medo.');
    await say(T, '— Você não pode simplesmente escolher e esperar que o mundo aceite.');
    await say(K, '— Foi exatamente isso que os Reis fizeram. E nós os destruímos por isso. Então não vou fazer igual. Vou descobrir a verdade antes de escolher.');
    await G.fade(0, 30);
    await say(ER, '— Ela chamou. Aqui.');
    G.Audio.sfx('heart');
    await L2.mind(['Meu filho.', 'Não confie no que viu.\n— Onde você está?\nPerto. Não venha. Porque ele está acordado.', '— Quem?\nAquele que existe antes de vocês. Meu primeiro filho.', 'Ele nasceu da primeira morte. Quando a Primeira Essência criou a primeira vida, descobriu que poderia morrer.\nEle não é a morte. Ele é a vontade de nunca morrer.'], '#fff0c8');
    await say(K, '— Temos outro irmão.');
    G.Audio.sfx('dark'); G.shake = 14;
    await nar('As estrelas artificiais desapareceram, uma por uma, até restar só uma: vermelha. O céu se abriu, e uma sombra gigantesca apareceu: quatro braços, seis asas, um rosto sem boca. No centro do peito, um coração negro.');
    await say('O Primeiro Irmão', '— KRAVENOX. VOCÊ CARREGA AQUILO QUE ME PERTENCE.');
    await say(K, '— Venha buscar. Estou cansado de fugir.');
    L2.heal();
    let baixou = false;
    await G.battle(['primeiroIrmao'], { bg: 'cidadeAster', music: 'chefe', noEscape: true, intro: 'O Primeiro Irmão desce sobre a cidade. A torre explode.',
      setup: b => { b.enemies[0].absorb = 0.6; },
      choose: { who: 'kravenox', when: b => b.round >= 2 || (b.absorbed || 0) >= 2, prompt: 'Cada golpe o torna mais forte...', options: [
        { label: 'Atacar junto com Thornox', run: async () => { await say(T, '— Nada! Ele absorve tudo!'); return null; } },
        { label: 'Baixar as armas', run: async () => { baixou = true; return 'end'; } }],
        hints: [{ round: 3, who: ER, text: '— Ele se alimenta das escolhas! Então não escolham!' }] } });
    await say(K, '— Você precisa que lutemos.');
    await say('O Primeiro Irmão', '— EU PRECISO DE VOCÊ.');
    await say(K, '— Não. Você precisa do que está aqui.');
    G.Audio.sfx('dark'); G.flash('#000000', 1);
    await nar('A criatura avançou. Kravenox esperou, e no último instante não atacou. A criatura atravessou seu corpo, e tudo ficou escuro.');
    const Cn = C();
    await Cn.begin('casaMae', 'despedida');
    const mae = Cn.actor('mae', { img: () => X.sprite('mae', 'down', 0), x: 170, y: 160, z: 3, scale: 1.6, glow: 'rgba(255,230,180,0.6)', glowA: 0.3 });
    await Cn.caption('Uma casa pequena e quente. Havia uma lareira, uma mesa, e uma mulher de cabelos longos, olhos cansados e um sorriso triste.');
    await say(MAE, '— Você cresceu.');
    await say(K, '— Mãe.');
    await Cn.caption('Ela o abraçou. Pela primeira vez em milhares de anos, Kravenox sentiu o que era estar em casa.');
    await say(MAE, '— Eu sinto muito. Não posso ficar. Eu não estou presa atrás da porta. Eu sou a porta. Quem está preso é o seu primeiro irmão. E ele quer nascer.');
    void mae;
    await Cn.end();
    await say(K, '— Você não quer me matar. Você quer nascer. Nossa mãe é a prisão. E eu sou a chave.');
    await say('O Primeiro Irmão', '— SIM.');
    await say(T, '— Não faça isso.');
    await say(K, '— Erya. Escolha.');
    await nar('A quinta marca apareceu, mas dessa vez não brilhou. Apagou-se.');
    await say(K, '— Eu escolho abrir. Mas não para libertá-lo. Para libertar nossa mãe.');
    F().ch11 = 1; L2.done();
    await S.aPorta();
  };

  // ===================== CAP. 12 — A PORTA =====================
  S.aPorta = async function () {
    await L2.chapter(12, 'A Porta');
    await nar('A primeira rachadura apareceu no céu. Não havia luz atrás dela, nem escuridão. Havia silêncio.');
    await say(ER, '— Você pretende separar os dois. Talvez eu consiga.');
    await say(K, '— Então vamos fazer funcionar.');
    await nar('Do outro lado havia um lugar impossível: nem chão nem céu, apenas milhares de correntes. No centro, presa por correntes negras, a mãe.');
    await say(T, '— Não vou deixar você sozinho.');
    await say(K, '— Você não vai. Vai cuidar deles. Fique.');
    await say(T, '— Volte.');
    await say(K, '— Pretendo.');
    L2.solo('kravenox');
    F().noEntre = 1;
    await L2.warpDungeon('entre');
    await nar('O Entre era silencioso. Cada passo fazia surgir uma lembrança.');
    L2.saved();
  };
  S.irmaoCrianca = async function () {
    if (F().irmaoVisto) return; F().irmaoVisto = 1;
    await nar('Uma criança muito pequena, deitada dentro de uma esfera, abriu os olhos.');
    await say('O Primeiro Irmão', '— Finalmente. Nunca tive permissão para crescer. Nosso pai tinha medo do que eu me tornaria.');
    await say(K, '— E o que você se tornaria?');
    await say('O Primeiro Irmão', '— Livre.');
    await nar('A mãe chama de mais adiante, no fundo das correntes.');
  };
  S.maeCorrentes = async function () {
    if (F().maeLivre) return;
    if (!F().irmaoVisto) { await nar('A voz da mãe vem de algum lugar mais adiante, mas as correntes não deixam passar. Primeiro, a esfera.'); return; }
    await say(MAE, '— Kravenox. Não pode me tirar daqui. Se quebrar as correntes, ele será libertado. E ele quer que todos voltem ao momento anterior à primeira morte. Um mundo parado. Nada terminaria. Nenhuma dor. Nenhuma perda. Nenhum nascimento.');
    await say('O Primeiro Irmão', '— Eu posso acabar com a dor. Tudo que termina machuca.');
    await say(K, '— Algumas coisas precisam terminar. Eu morri. Muitas vezes. E cada vez que voltei, tive outra oportunidade de escolher.');
    await say(MAE, '— As correntes não prendem meu corpo. Prendem minha escolha. Enquanto eu estiver presa, ele permanece dormindo.');
    await nar('Pela primeira vez, não havia inimigos. Havia apenas uma família, presa por uma decisão tomada milhares de anos antes.');
    const c = await G.choose('Kravenox se senta no chão. Sempre existe uma terceira escolha.', ['Prender', 'Libertar', 'Transformar']);
    if (c !== 2) await say(K, '— Não. Nem prender. Nem libertar.');
    await say(K, '— Transformar. A morte. A prisão. E a mim. Eu preciso do meu irmão.');
    await say(T, '— Estou aqui.');
    L2.regroup();
    await say(ER, '— E você precisava de mim.');
    await say(K, '— Precisava.');
    const Cn = C();
    await Cn.begin('transformacao', 'entre');
    await Cn.caption('Luz, sombra, escolha — e, no centro, a morte. As correntes ficaram brancas. Uma energia atravessou o Entre, e todos os mundos sentiram.');
    G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 20;
    await Cn.tween(Cn, { white: 0.8 }, 60);
    await Cn.caption('As árvores pararam, os rios congelaram, os mortos sonharam. E, durante um único instante, todo ser vivo sentiu a própria morte — não como ameaça, mas como parte da existência.', 80);
    Cn.white = 0;
    await Cn.caption('As correntes desapareceram, e a mãe caiu. Kravenox a segurou.');
    await say(MAE, '— Você conseguiu.');
    await say(K, '— Nós conseguimos.');
    await say(MAE, '— Ainda não.');
    await Cn.caption('No lugar onde o irmão estivera havia uma porta pequena e antiga. A inscrição dizia: PRIMEIRA ORIGEM. Do outro lado, algo bateu. E uma voz infantil falou: — Mãe?');
    await Cn.end();
    F().maeLivre = 1;
    L2.checkpoint('primeiraOrigem');
    await S.primeiraOrigem();
  };

  // ===================== CAP. 13 — A PRIMEIRA ORIGEM =====================
  S.primeiraOrigem = async function () {
    await L2.chapter(13, 'A Primeira Origem');
    const Cn = C();
    await Cn.begin('origemEstrelas', 'origem');
    const ch = Cn.actor('or', { img: () => X.sprite('origem', 'down', 0), x: 160, y: 150, z: 3, scale: 1.6, glow: 'rgba(220,230,255,0.9)', glowA: 0.5 });
    await Cn.caption('Uma criança estava sentada no chão. Pequena, frágil, quase humana. Mas seus olhos continham todas as estrelas do universo.');
    await say(OR, '— Vocês demoraram. Todos. Eu estava aqui antes de vocês. Antes dos mundos. Antes da luz. Antes da sombra. Antes da escolha.');
    await say(K, '— Qual é o seu nome?');
    await say(OR, '— Nunca tive um. Escolha um para mim.');
    await Cn.end();
    await L2.vision(['No começo não havia céu, nem terra, nem tempo. Depois surgiu um ponto, e nasceu uma consciência: a criança, sozinha.', 'Ela tentou criar — e criou uma pequena esfera de luz. Depois outra, e outra, até que o vazio ficou cheio. Nasceram os primeiros mundos.', 'Ela criou a primeira criatura viva. A criatura abriu os olhos e morreu.', 'A criança chorou. E de suas lágrimas nasceu a Primeira Essência.'], 'origem');
    await say(K, '— A Essência nasceu do medo. Medo de perder.');
    await say(OR, '— Foi criada para impedir que eu sentisse aquilo de novo. Vocês foram a tentativa final: de ensinar a Essência a escolher. E você, Erya, foi a resposta.');
    await say(MAE, '— Precisamos sair. Ela não pode sair: se a origem voltar, tudo que nasceu depois será refeito.');
    await say(OR, '— Eu sei. Estou aqui porque estou cansada de ficar sozinha.');
    await say(K, '— Eu sei como é.');
    await say(T, '— Todos nós estivemos.');
    await say(K, '— Você não precisa sair. Venha conosco. Não para o mundo. Para dentro de nós. Assim como fizeram conosco.');
    await say(MAE, '— Isso pode destruir vocês.');
    await say(K, '— Já tentaram.');
    await say(OR, '— Quero ter irmãos.');
    G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 18;
    await nar('As quatro forças se encontraram: Origem, Luz, Sombra, Escolha. Uma explosão atravessou o Entre, e a criança desapareceu.');
    await L2.mind(['Agora não estou mais sozinha.'], '#e0e8ff');
    await G.fade(1, 20);
    G.enterField('cidadeAster', 16, 9, 'down');
    await G.fade(0, 30);
    await say(MAE, '— Conseguiram. Ela está aqui. No seu peito. E eu vou com vocês. Estou livre.');
    await nar('Kravenox abraçou a mãe, e Thornox se aproximou. Por alguns segundos, foram apenas uma família.');
    await say(AS, '— Kravenox! A cidade está desaparecendo!');
    await L2.mind(['Eles estão vindo.\n— Quem?\nOs primeiros.'], '#e0e8ff');
    await say(MAE, '— As criaturas que existiam antes dos mundos. Eles querem a criança. E querem você. Porque ela está em você.');
    G.Audio.sfx('dark'); G.shake = 12;
    await say('???', '— DEVOLVAM A ORIGEM.');
    await nar('A mãe pegou uma antiga lâmina.');
    await say(K, '— Dessa vez não estamos lutando pelo mundo. Estamos lutando uns pelos outros.');
    F().antigosVem = 1; L2.done();
    L2.checkpoint('osAntigos');
    await S.osAntigos();
  };

  // ===================== CAP. 14 — OS ANTIGOS =====================
  S.osAntigos = async function () {
    await L2.chapter(14, 'Os Antigos');
    await nar('O primeiro deles tocou o chão, e a cidade inteira tremeu. Não possuía rosto, apenas uma superfície lisa e negra atravessada por fissuras de luz. Para eles, os mundos eram apenas cópias.');
    await say(AS, '— Não podemos vencer isso.');
    await say(K, '— Então não vamos vencer. Vamos sobreviver.');
    await say(T, '— Finalmente uma estratégia que combina com você.');
    L2.heal();
    await G.battle(['antigo', 'antigoFera', 'antigo'], { bg: 'antigos', music: 'chefe', noEscape: true, intro: 'Os Antigos descem do céu.',
      events: [{ when: b => b.round >= 2 && !F().tec_toqueOrigem, run: async () => {
        await nar('Kravenox tocou a perna de um Antigo, e a pequena presença em seu peito reagiu. A criatura congelou, e uma rachadura surgiu em seu corpo.');
        await say(ER, '— Para eles, a Origem não é uma energia. É uma autoridade.');
        await L2.mind(['Posso ajudá-los. Fazendo-os lembrar. Do que eram antes de esquecer.'], '#e0e8ff');
        await L2.learn(K, 'toqueOrigem'); return null; } }] });
    await nar('Kravenox não lutava para destruir: tocava cada criatura e mostrava memórias. Algumas recuavam, outras simplesmente desapareciam.');
    await say(K, '— Vocês não querem a Origem. Querem voltar para quando nada podia morrer. Então nunca entenderam: foi justamente a morte que criou tudo.');
    await say(MAE, '— Thornox recebeu a luz. Kravenox recebeu a sombra. E nenhum dos dois recebeu o que realmente precisava. Liberdade.');
    G.Audio.sfx('boom'); G.shake = 16;
    await nar('Um rugido atravessou o céu, e os Antigos recuaram. Uma forma colossal surgiu acima da cidade: uma cabeça formada pelo próprio vazio.');
    await L2.mind(['Eu lembro dele. Meu irmão. O primeiro que ficou com medo.'], '#e0e8ff');
    await say('O Primeiro dos Antigos', '— ORIGEM. VOCÊ VOLTOU. ELA NÃO SABE ESCOLHER.');
    await say(ER, '— Então ensine. Vocês sentiram medo da morte. Fugiram dela. Criaram mundos para esquecê-la. E quando alguém finalmente escolheu aceitá-la, vieram tomar tudo.');
    await say('O Primeiro dos Antigos', '— A MORTE É UM ERRO.');
    await say(ER, '— Não. É uma escolha.');
    L2.heal();
    let juntos = false;
    await G.battle(['primeiroAntigo'], { bg: 'antigos', music: 'chefe', noEscape: true, intro: 'O Primeiro dos Antigos desce. Metade da cidade é destruída.',
      choose: { who: 'kravenox', when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.65, prompt: '"TUDO QUE VOCÊ AMA VAI DESAPARECER."', options: [
        { label: 'Destruí-lo de uma vez', run: async () => { await say('O Primeiro dos Antigos', '— VOCÊS NÃO PODEM ME DERROTAR.'); await say(T, '— Kravenox... acho que não precisamos.'); return null; } },
        { label: 'Ficar juntos: luz, sombra, escolha e origem', run: async () => { juntos = true; return 'end'; } }],
        hints: [{ round: 4, who: T, text: '— A luz não existe para derrotar a sombra. Existe para mostrar o caminho.' }] } });
    await say(K, '— Enquanto estiverem aqui, terão significado.');
    await say('O Primeiro dos Antigos', '— SIGNIFICADO NÃO IMPEDE A MORTE.');
    await say(K, '— Nunca disse que impedia.');
    await say(ER, '— E a escolha não existe para garantir que escolheremos certo. Existe para garantir que podemos escolher.');
    await say(K, '— E a sombra existe para lembrar que toda luz precisa de contraste. Vamos escolher.');
    const Cn = C();
    await Cn.begin('origemEstrelas', 'origem');
    const ch = Cn.actor('or', { img: () => X.sprite('origem', 'down', 0), x: 160, y: 160, z: 3, scale: 1.5, alpha: 0, glow: 'rgba(220,230,255,0.9)', glowA: 0.5 });
    await Cn.tween(ch, { alpha: 1, y: 150 }, 40);
    await Cn.caption('O peito de Kravenox se abriu em luz, e uma pequena criança apareceu entre eles. Segurou a mão de Kravenox, de Thornox, de Erya e, por último, a da própria mãe. Então olhou para o Primeiro.');
    await say(OR, '— Você pode vir também. Você não precisa gostar. Só precisa escolher.');
    await Cn.caption('Durante milhares de anos, ele havia esperado aquela palavra. Escolher. Ele abaixou a cabeça, e os Antigos foram embora, de volta ao lugar onde existiam antes dos mundos. A cidade começou a se reconstruir.', 80);
    await say('O Primeiro dos Antigos', '— O que acontece agora?');
    await say(K, '— Não sei.');
    await say(T, '— Finalmente ele admitiu.');
    await Cn.end();
    await say(ER, '— Não terminou.');
    await nar('Uma nova luz surgia ao longe: verde. Depois outra. E outra.');
    await say(ER, '— Mundos novos. Infinitos.');
    await say(T, '— Então temos muito trabalho.');
    await nar('Pela primeira vez desde o despertar, Kravenox não sentiu que caminhava para o passado. Caminhava para algo que ainda não existia. Porque, pela primeira vez, ninguém havia escrito o final.');
    F().l2p1fim = 1; L2.done();
    L2.heal(); D.save();
    G.Audio.play('fim');
    await G.credits2(1);
  };

  // ---------- créditos entre as partes e no fim do Livro II ----------
  G.credits2 = async function (part) {
    const lines = part === 3 ? [
      ['FIM', '#ffcf6a', 18],
      ['Kravenox II: O Reino da Escolha', '#e8d8c0', 11],
      ['', '', 6],
      ['Os 41 capítulos de', '#a89a8a', 8],
      ['"Reino Quebrado II — O Reino da Escolha"', '#e8d8c0', 9],
      ['', '', 6],
      ['Uma história de Rone Ignacio da Silva', '#c9bfd8', 8],
      ['Kravenox nasceu de um desenho de escola, há 45 anos.', '#8a7a8a', 7],
      ['', '', 6],
      ['"Apenas irmãos. E livres."', '#c9bfd8', 8],
    ] : part === 2 ? [
      ['FIM DA PARTE 2', '#ffcf6a', 16],
      ['Kravenox II: O Reino da Escolha', '#e8d8c0', 11],
      ['', '', 8],
      ['Capítulos 15 a 22', '#a89a8a', 8],
      ['', '', 8],
      ['A história continua na Parte 3:', '#a89a8a', 8],
      ['O que Fica Depois do Fim', '#c9a24a', 12],
      ['Auren · O Livro de Thornox · Aveline · A Estrela Azul', '#8a7a8a', 8],
      ['', '', 8],
      ['"O homem que criou a Biblioteca não fui eu."', '#c9bfd8', 8],
    ] : [
      ['FIM DA PARTE 1', '#ffcf6a', 16],
      ['Kravenox II: O Reino da Escolha', '#e8d8c0', 11],
      ['', '', 8],
      ['Capítulos 1 a 14', '#a89a8a', 8],
      ['', '', 8],
      ['A história continua na Parte 2:', '#a89a8a', 8],
      ['O Homem Antes do Rei', '#c9a24a', 12],
      ['A Cidade dos Espinhos · O Rei do Último Mundo · A Biblioteca do Fim', '#8a7a8a', 7],
      ['', '', 8],
      ['"Pela primeira vez, ninguém havia escrito o final."', '#c9bfd8', 8],
    ];
    const ov = { t: 0, update() { this.t++; if (G.debug.auto) { G.pop(ov); ov.done(); return; } if (this.t > 200 && (G.Input.pressed.a || G.Input.pressed.b)) { G.pop(ov); ov.done(); } }, draw(ctx) {
      ctx.fillStyle = '#05030c'; ctx.fillRect(0, 0, G.W, G.H);
      X.glow(ctx, G.W / 2, 60, 120, 'rgba(180,170,255,0.15)');
      let y = 26;
      lines.forEach(([s, c, sz], i) => { ctx.globalAlpha = G.clamp((this.t - i * 14) / 30, 0, 1); if (s) G.text(ctx, s, G.W / 2, y, c, sz, 'center', i === 0); y += sz + 7; });
      ctx.globalAlpha = 1;
      if (this.t > 200) G.text(ctx, part < 3 ? 'A: continuar' : 'A: voltar ao título', G.W / 2, G.H - 14, '#5a4a5a', 7, 'center');
    } };
    G.fadeA = 0;
    await new Promise(r => { ov.done = r; G.push(ov); });
    if (part < 3) {
      const i = await G.choose('A história continua. Começar a Parte ' + (part + 1) + ' agora?', ['Começar a Parte ' + (part + 1), 'Voltar ao título']);
      if (i === 0) { await S['l2parte' + (part + 1)](); return; }
      G.titleScreen(); return;
    }
    if (X.imgs.desenho) await G.showImage(X.imgs.desenho, 'Kravenox nasceu de um desenho de escola, há 45 anos.');
    G.titleScreen();
  };
  // quem parou entre as partes continua direto na próxima ao carregar
  const resumeBase = S.resume2;
  S.resume2 = function (st) {
    if (st.flags.l2p1fim && !st.flags.l2p2) { G.run(() => S.l2parte2()); return true; }
    if (st.flags.l2p2fim && !st.flags.l2p3) { G.run(() => S.l2parte3()); return true; }
    return resumeBase(st);
  };
})();
