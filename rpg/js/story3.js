'use strict';
// Roteiros da Parte 3 — Capítulos 26 a 35 de "Reino Quebrado": Além do Reino. Fecha o Livro I.
(function () {
  const S = G.story;
  const D = G.data;
  const F = () => G.state.flags;
  const say = (n, t) => G.say(n, t);
  const nar = t => G.say(null, t);
  const K = 'Kravenox', T = 'Thornox', L = 'Lyra', SE = 'Seraphyne', PAI = 'O Pai', MAE = 'A Mãe', AR = 'Arkan', RE = 'O Rei dos Espinhos', RV = 'O Rei do Vazio', DV = 'O Devorador';
  const C = () => G.Cine, X = G.gfx;

  async function vision(lines, music = 'memoria') {
    const prev = G.Audio.cur; G.Audio.play(music); G.Audio.sfx('memory');
    G.flash('#ffffff', 0.9);
    await G.narrate(lines, { color: '#f0e6c8', bg: '#0a0806', backdrop: (ctx, t) => { X.glow(ctx, G.W / 2, G.H / 2, 140, 'rgba(255,220,140,0.25)', 0.6 + 0.2 * Math.sin(t / 30)); } });
    G.Audio.cur = null; G.Audio.play(prev);
  }
  const chapter = (n, title, extra = [], hold = 100) => G.narrate(['Capítulo ' + n + '\n' + title, ...extra], { hold, color: '#ffcf6a' });
  async function warpField(id, x, y, dir) { await G.fade(1, 16); G.enterField(id, x, y, dir); await G.fade(0, 16); }
  async function warpDungeon(id, x, y, dir) { await G.fade(1, 16); G.enterDungeon(id, x, y, dir); await G.fade(0, 16); }
  const saved = () => { D.save(); G.toast('Jogo salvo.'); };
  const learn = async (who, key) => { F()['tec_' + key] = 1; G.Audio.sfx('level'); await nar(who + ' aprendeu ' + D.TECHS[key].name + '!'); };
  async function bell(n) { G.Audio.sfx('bell'); G.shake = 12; await nar('O ' + ['primeiro', 'segundo', 'terceiro'][n - 1] + ' sino tocou. BOOOOM. A cidade inteira estremeceu.'); }
  // um herói sozinho (os quatro caminhos, a torre negra) e depois o grupo de volta, na mesma ordem
  function solo(id) { if (!G.state.fullParty) G.state.fullParty = G.state.party.map(h => h.id); const h = G.state.party.find(x => x.id === id) || (G.state.bench && G.state.bench[id]); G.state.bench = G.state.bench || {}; for (const x of G.state.party) G.state.bench[x.id] = x; G.state.party = [h]; }
  function regroup() { const ids = G.state.fullParty || ['kravenox', 'thornox', 'lyra', 'seraphyne']; const all = Object.assign({}, G.state.bench || {}); for (const x of G.state.party) all[x.id] = x; G.state.party = ids.map(id => all[id]).filter(Boolean); G.state.fullParty = null; for (const h of G.state.party) { if (!h.alive) { h.alive = true; h.hp = 1; } } }

  const evDone2 = S.evDone;
  S.evDone = function (map, c) {
    const f = F(); const m = { caminhos: { a: 'camK', e: 'camT', l: 'camL', r: 'camS' }, torreNegra: { e: 'topoNegra' } }[map];
    if (m) return !!(m[c] && f[m[c]]);
    return evDone2(map, c);
  };

  // ===================== INÍCIO DA PARTE 3 =====================
  S.parte3 = async function () {
    const f = F(); f.p3 = 1; f.prata = 1; f.desperto = 0;
    if (G.state.fullParty) regroup();
    for (const id of ['thornox', 'lyra']) D.restoreHero(id);
    if (f.seraJunta && !G.state.party.find(h => h.id === 'seraphyne')) D.restoreHero('seraphyne');
    D.healAll();
    G.fadeA = 1;
    G.Audio.play('novoReino');
    await G.narrate(['PARTE 3\nAlém do Reino'], { hold: 160, color: '#c9a24a' });
    await chapter(26, 'Depois do Fim');
    const Cn = C();
    G.fadeA = 0;
    await Cn.begin('fonteViva', 'memoria');
    Cn.dim = 0;
    await Cn.caption('O silêncio parecia impossível. Depois de séculos de guerra, o Reino finalmente não gritava. Apenas vento.');
    await Cn.caption('Pequenas folhas começaram a surgir entre os galhos da Fonte, e uma delas caiu diante de Kravenox. Era a primeira folha viva que tocava desde que despertara no Abismo Carmesim.');
    await say(T, '— Bonita.');
    await say(K, '— Eu não lembrava que o Reino era assim.');
    await say(T, '— Eu lembro. Lembro de você correndo atrás de mim quando éramos crianças.');
    await say(K, '— Eu sempre te alcançava.');
    await say(T, '— Não.');
    await say(K, '— Alcançava sim.');
    await say(T, '— Você tropeçava antes.');
    await Cn.caption('Lyra riu, e Seraphyne observou os três. Por alguns instantes, pareciam apenas uma família. Não guerreiros, não herdeiros. Apenas irmãos.', 70);
    await Cn.end();
    G.enterField('estrada', 7, 18, 'up');
    await G.fade(0, 30);
    await nar('Horas depois, deixaram a Fonte. Raízes cobriam as antigas ruínas, o ar estava mais leve, o céu começava a clarear.');
    await say(T, '— Está diferente?');
    await say(K, '— Não ouço mais nada. É estranho.');
    await say(L, '— Talvez você precise aprender a ouvir a si mesmo agora.');
    await say(K, '— E se eu não gostar do que ouvir?');
    await say(L, '— Então você muda.');
    await say(K, '— Seraphyne. Para onde vamos?');
    await say(SE, '— Não sei. Pela primeira vez.');
    await say(K, '— Então estamos iguais.');
    saved();
  };
  S.voltaFonte = async () => { await nar('O caminho de volta à Fonte está coberto de raízes novas. Ela está bem. Agora o caminho é para frente.'); G.Field.py -= 1; };
  S.ruinaVila = async () => nar(G.pick(['As ruínas de uma vila antiga. Alguém plantou flores na soleira.', 'Uma casa sem teto. Dentro, raízes jovens.']));
  S.fogueiraNoite = async () => nar('O fogo estala. Ninguém dorme muito por aqui.');
  S.mascateEstrada = async function () {
    if (!F().mascateE) {
      F().mascateE = 1;
      await say('Mascate de Cinzas', '— Além das montanhas? Ótimo. Ninguém vende nada lá. Ou seja: só eu.');
      await say(T, '— Você não tem medo de nada?');
      await say('Mascate de Cinzas', '— Tenho medo de prejuízo.');
    }
    await G.shop('Mascate de Cinzas', ['nectar', 'elixir', 'agua', 'cristalM', 'cristalG', 'raiz', 'nevoa', 'garraAntiga', 'cajadoArkan', 'cristalCidade', 'mantoCidade'], 40);
  };
  S.colinaEstrela = async function () {
    if (F().estrela) return; F().estrela = 1;
    const Cn = C();
    await Cn.begin('estrelaNegra', 'alem');
    await Cn.caption('Do alto de uma colina, avistaram o Reino. Ainda havia ruínas e sombras. Mas havia luz: pequenos pontos entre as montanhas. Fogueiras. Sobreviventes.');
    await say(T, '— Eles vão reconstruir.');
    await say(L, '— E nós?');
    await Cn.caption('A vida inteira, alguém lhe dissera para onde ir. Agora não havia nenhuma voz, nenhum destino escrito. Ele finalmente podia escolher.');
    await say(K, '— Vamos descobrir o que existe além das montanhas.');
    await say(T, '— Sabia que você diria isso.');
    await say(SE, '— Há uma coisa que vocês precisam saber.');
    await Cn.caption('Muito longe, além das nuvens, havia uma estrela negra.');
    await say(K, '— Aquilo não estava lá antes.');
    await say(SE, '— Não. É a porta. Para o lugar que existia antes do Reino.');
    G.Audio.sfx('memory');
    await Cn.caption('A estrela brilhou uma vez, e Kravenox ouviu uma voz distante. Não entendeu as palavras, mas reconheceu uma: seu próprio nome.');
    await say(K, '— Estão me chamando.');
    await say(T, '— Quem?');
    await say(K, '— Ainda não sei.');
    await Cn.end();
    saved();
  };
  S.acampamentoNoite = async function () {
    if (F().noite) return; F().noite = 1;
    await G.fade(0.7, 30, '#000010');
    await nar('Naquela noite, acamparam nas ruínas de uma antiga vila. Kravenox ficou acordado diante do fogo. Levou a mão ao peito. Nenhuma marca, nenhuma energia. Apenas o coração. Pela primeira vez, era o bastante.');
    await say(T, '— Não consegue dormir?');
    await say(K, '— Não. Se você tivesse que escolher entre salvar o Reino e salvar a nossa família?');
    await say(T, '— Escolheria os dois.');
    await say(K, '— Não é possível.');
    await say(T, '— Então encontraria uma terceira opção.');
    await say(K, '— Você sempre acredita que existe uma saída.');
    await say(T, '— E você sempre acredita que não existe.');
    await say(K, '— Talvez por isso a gente funcione.');
    await say(T, '— Você se arrepende?');
    await say(K, '— Sim. Mas não mudaria nada. Porque tudo me trouxe até aqui.');
    await say(T, '— Então amanhã começamos de novo.');
    const Cn = C();
    await Cn.begin('tronoAntigo', 'primeiro');
    const fig = Cn.actor('fig', { img: () => X.imgs.e_escolhido, x: 160, y: 168, z: 2, scale: 1, alpha: 0.9, glow: 'rgba(240,240,255,0.6)', glowA: 0.3 });
    await Cn.caption('Muito acima deles, além do céu conhecido, uma porta se abriu no próprio espaço. Do outro lado, alguém observava, sentado num trono antigo.');
    await say('???', '— Então o Primeiro falhou.');
    await say('Segunda Figura', '— Sim.');
    await say('???', '— E os filhos?');
    await say('Segunda Figura', '— Vivos.');
    await say('???', '— Interessante.');
    await Cn.tween(fig, { y: 176 }, 30);
    await Cn.caption('A primeira figura se levantou. Vestia uma armadura branca com o símbolo de um espinho no centro do peito.');
    await say('???', '— Deixe-os acreditar que venceram. Quando Kravenox descobrir a verdade...');
    await say('Segunda Figura', '— Qual verdade?');
    await say('???', '— Que o Reino Quebrado nunca foi o mundo inteiro.');
    await Cn.end();
    G.fadeA = 0;
    await nar('Na manhã seguinte, os quatro partiram.');
    await say(K, '— Prontos?');
    await say(T, '— Não.');
    await say(L, '— Nunca estaremos.');
    await say(SE, '— Então vamos mesmo assim.');
    D.healAll(); saved();
  };
  S.estradaAntiga = async function () {
    if (F().estrada2) return; F().estrada2 = 1;
    await chapter(27, 'Além das Montanhas', ['Durante três dias, os quatro caminharam sem encontrar uma única cidade.']);
    await nar('Árvores mortas davam lugar a florestas jovens, e a terra negra começava a recuperar a cor. Mas nenhum animal, nenhum pássaro, nenhum som além dos próprios passos.');
    await say(K, '— Estamos sendo observados.');
    await say(T, '— De novo?');
    await say(SE, '— Não são criaturas. É memória. Este lugar se lembra de quem passou por aqui.');
    await nar('A estrada de pedra era muito antiga, coberta de símbolos. Kravenox se ajoelhou e passou a mão sobre um deles: um espinho. Embaixo dele, outro símbolo: um círculo atravessado por três linhas.');
    await say(L, '— Eu já vi isso. No coração do Primeiro.');
    await say(K, '— Então estamos no caminho certo.');
    saved();
  };
  S.portaoFimReino = async function () {
    if (!F().estrada2) { await nar('Uma muralha imensa ao norte. A estrada antiga, ao sul, parece levar até ela.'); G.Field.py += 1; return; }
    if (F().portaoFim) { await warpField('mar', 13, 12, 'up'); return; }
    const Cn = C();
    await Cn.begin('portaoFim', 'alem');
    Cn.gateOpen = 0;
    await Cn.caption('A estrada os levou a uma enorme muralha. Atrás dela não havia cidade, apenas um portão fechado e uma inscrição.');
    await say(T, '— Aqui termina o Reino.');
    await say(K, '— E o que existe depois?');
    await say(SE, '— Ninguém sabe. Eu nunca atravessei. Mas meu pai atravessou. Antes do Cisma.');
    await say(T, '— E voltou?');
    await Cn.caption('Seraphyne fez que não. Kravenox tocou o portão. Nada. Thornox, Lyra — nada. Quando Seraphyne se aproximou, o portão se abriu na hora.');
    G.Audio.sfx('door'); await Cn.tween(Cn, { gateOpen: 1 }, 60);
    await say(K, '— Você disse que nunca atravessou.');
    await say(SE, '— Nunca. Ele estava esperando por mim.');
    await Cn.end();
    F().portaoFim = 1;
    await G.fade(1, 20); G.enterField('mar', 13, 12, 'up'); await G.fade(0, 30);
    await nar('Do outro lado havia um oceano gigantesco e sem fim, de ondas negras, e três luas no horizonte.');
    await say(T, '— Isso não está no Reino.');
    await say(SE, '— Estamos fora dele.');
    saved();
  };
  S.voltarPortao = async () => { await warpField('estrada', 33, 2, 'down'); };
  S.olharMar = async () => nar(G.pick(['Ondas negras, sem espuma.', 'Uma sombra enorme passa sob a água. Depois outra.', 'As três luas se refletem no mar como três olhos.']));
  S.serpente = async function () {
    if (F().serpente) return; F().serpente = 1;
    const Cn = C();
    await Cn.begin('tresLuas', 'mar');
    await say(L, '— Tem alguma coisa na água.');
    await say(K, '— Não ataquem. Não parecem hostis.');
    G.Audio.sfx('boom'); Cn.serpent = 1;
    const sp = Cn.actor('serpe', { img: () => X.imgs.e_servo, x: 160, y: 150, z: 2, scale: 1.6, alpha: 1 });
    await Cn.caption('A água se agitou, e uma criatura emergiu: um corpo de serpente gigantesco, com a cabeça coberta de cristais.');
    await say('A Serpente', '— Finalmente.');
    await say(K, '— Você fala.');
    await say('A Serpente', '— Vocês também. A pergunta correta é outra. Quem são vocês?');
    await say(K, '— Somos os Irmãos Espinhos.');
    G.Audio.sfx('boom'); await Cn.tween(sp, { y: 240, alpha: 0 }, 40);
    await say('A Serpente', '— Não. Vocês eram os Irmãos Espinhos. O mundo de onde vocês vieram já não existe.');
    await say(T, '— Então onde estamos?');
    await Cn.tween(Cn, { city: 1 }, 80);
    await Cn.caption('Entre a neblina surgiu uma cidade gigantesca construída sobre o oceano, com torres brancas que atravessavam as nuvens e milhares de luzes.');
    await say('A Serpente', '— A Primeira Cidade.');
    await say(SE, '— É a cidade onde o Primeiro nasceu.');
    await Cn.end();
    await nar('No fim do píer de pedra, uma pequena embarcação abandonada balança. Intacta.');
  };
  S.embarcacao = async function () {
    if (!F().serpente) return;
    await say(T, '— Tem água.');
    await say(L, '— E comida.');
    await say(K, '— Você não vem?');
    await say(SE, '— Eu não gosto de água.');
    await say(L, '— Você é literalmente feita de Vazio.');
    await say(SE, '— E?');
    await say(L, '— Nada.');
    const Cn = C();
    await Cn.begin('tresLuas', 'mar');
    Cn.city = 0.4;
    await Cn.caption('Seraphyne entrou, e a embarcação começou a se mover sozinha, sem que ninguém tocasse no leme.');
    await say(T, '— Você acha que vamos voltar?');
    await say(K, '— Sim.');
    await say(T, '— Tem certeza?');
    await say(K, '— Não.');
    await say(T, '— Melhor resposta.');
    await Cn.tween(Cn, { city: 1 }, 60);
    await Cn.caption('As torres traziam o mesmo símbolo do coração do Primeiro — o círculo, as três linhas — e, no centro, um espinho.');
    await say(K, '— Você sabe o que vamos encontrar.');
    await say(SE, '— Sim. Nosso pai.');
    await say(T, '— Isso é impossível.');
    await say(SE, '— Não. Ele nunca morreu.');
    await Cn.caption('No alto da Primeira Cidade, uma torre se iluminou, e uma figura apareceu diante de uma janela. Seu pai. Vivo. Esperando.', 70);
    await say(K, '— Então é aqui que começa a verdadeira história.');
    G.fadeA = 1;
    await Cn.end();
    await chapter(28, 'A Primeira Cidade');
    G.enterField('cidade', 15, 19, 'up');
    await G.fade(0, 30);
    await nar('As águas negras deram lugar a um canal cercado por muralhas brancas. Torres que sumiam entre as nuvens, cristais flutuando sobre os edifícios. Mas não havia pessoas. Nenhuma.');
    F().chegouCidade = 1;
    saved();
  };

  // ===================== A PRIMEIRA CIDADE (cap. 28) =====================
  S.cais = async () => { if (!F().cidadeViva) { await nar('A embarcação espera no cais, imóvel. Não há para onde voltar agora.'); G.Field.py -= 1; } };
  S.casaBranca = async () => nar(G.pick(['A porta está aberta. Lá dentro, velas acesas. Ninguém.', 'Uma casa branca, limpa demais para estar vazia.']));
  S.torreBranca = async () => nar('A torre mais alta da Primeira Cidade. Lá em cima, uma janela iluminada.');
  S.canal = async () => nar('Água escura e parada. Ela reflete torres que não estão lá.');
  S.mesaQuente = async function () {
    if (F().cidadeViva) { await nar('As mesas agora têm gente em volta. Alguém oferece pão a Kravenox. Ele aceita.'); return; }
    await nar('Mesas com comida, velas acesas e livros abertos. Kravenox tocou um prato. A comida ainda estava quente.');
  };
  S.pracaVazia = async function () {
    if (F().cidadeViva && !F().ch31) return S.exercitoSombras();
    if (F().arkan) return;
    await nar('Numa praça havia mesas com comida, velas acesas e livros abertos, como se todos tivessem simplesmente desaparecido.');
    await say(K, '— Isso aconteceu há pouco tempo.');
    await say(SE, '— Não. Esta cidade está vazia há milhares de anos.');
    await say(T, '— Então como a comida está quente?');
    await say(SE, '— Porque a cidade não está vazia.');
    await nar('Um homem estava parado na entrada da praça: muito velho, de túnica branca e olhos negros.');
    await say(K, '— Quem é você?');
    await say('Velho', '— Um sobrevivente. Do primeiro mundo. De antes de tudo o que vocês conhecem.');
    await say(K, '— Onde está nosso pai?');
    await say('Velho', '— Vocês ainda o chamam assim? Ele está na torre. Esperando.');
    await say('Velho', '— Kravenox. Eu conheci você antes de você nascer. Meu nome era Arkan.');
    await say(SE, '— Arkan... o primeiro guardião.');
    await say(AR, '— O último.');
    G.Audio.sfx('boom'); G.shake = 14;
    await nar('Um estrondo atravessou a cidade. Todas as portas se fecharam ao mesmo tempo, e as luzes se apagaram.');
    await say(AR, '— Ele acordou. Vocês precisam chegar à torre. A cidade está escolhendo quem pode atravessar.');
    await say(T, '— E se ela decidir que não podemos?');
    await say(AR, '— Então ela mata vocês.');
    await say(K, '— Finalmente alguém falando claramente.');
    F().arkan = 1;
    saved();
  };
  S.arkanFala = async function () {
    if (!F().arkan) { await S.pracaVazia(); return; }
    await say(AR, '— A torre. Antes que o sino toque três vezes.');
  };
  S.portaTorre = async function () {
    if (!F().arkan || F().torreTopo) return;
    await nar('A rua terminava numa ponte, e as pedras começaram a sumir quando Kravenox pisou nela. Uma inscrição surgiu com quatro nomes: THORNOX. LYRA. KRAVENOX. E, abaixo deles, SERAPHYNE.');
    await nar('A ponte brilhou e se dividiu em quatro caminhos separados.');
    await say(L, '— Temos que nos separar.');
    await say(K, '— Não.');
    await say(AR, '— A cidade exige isso. Até o sino tocar três vezes. Depois, a cidade se fecha para sempre.');
    await say(K, '— Então nos encontramos na torre.');
    await nar('Thornox estendeu a mão, e Kravenox a segurou. Lyra pôs a sua por cima. Seraphyne hesitou e, enfim, juntou a dela às deles. Quatro irmãos, quatro caminhos, uma promessa.');
    await say(K, '— Na torre.');
    await say(T, '— Na torre.');
    solo('kravenox');
    await warpDungeon('caminhos', 1, 1, 1);
    await nar('Kravenox caminhou sozinho por um corredor que parecia infinito. Nas paredes havia pinturas.');
    saved();
  };
  S.caminhoKravenox = async function () {
    if (F().camK) return; F().camK = 1;
    await nar('Quatro crianças diante de um trono: ele, Thornox, Lyra e Seraphyne. Mas havia uma quinta figura: uma criança menor.');
    await say(K, '— Quem é você?');
    await vision(['Uma menina pequena, de cabelos brancos, correndo pelos corredores, chorando.', 'Kravenox, criança, correu até ela.\n— Não chora.', '— Eles vão me levar.\n— Quem?\n— O pai.']);
    await say(K, '— Havia outra.');
    await say(AR, '— Sim. Sua irmã.');
    await say(K, '— Minha mãe disse que éramos quatro.');
    await say(AR, '— Sua mãe mentiu. Porque ela morreu. Seu pai a sacrificou para abrir a primeira porta.');
    await nar('Na pintura: a menina diante do trono, o pai atrás dela, e uma luz negra atravessando seu corpo.');
    await say(K, '— Ele matou a própria filha.');
    await say(AR, '— Para criar o mundo que vocês conhecem.');
    await bell(1);
    await nar('Do outro lado da cidade, Thornox também caminhava sozinho.');
    solo('thornox');
    await warpDungeon('caminhos', 23, 1, 3);
    saved();
  };
  S.caminhoThornox = async function () {
    if (F().camT) return; F().camT = 1;
    await nar('Uma sala cheia de estátuas de guerreiros, todos com espinhos. No centro havia uma diferente: seu pai. A estátua abriu os olhos.');
    await say(T, '— Quem é você?');
    await say('A Estátua', '— Seu criador.');
    await say(T, '— Você não é meu pai.');
    await say('A Estátua', '— Sou ambos. Venha.');
    await say(T, '— Não.');
    await say('A Estátua', '— Então você será igual ao seu irmão.');
    await say(T, '— Não use Kravenox contra mim.');
    await say('A Estátua', '— Você ainda acredita que pode salvá-lo. Porque você ainda não percebeu.');
    G.Audio.sfx('crack'); G.shake = 10;
    await nar('A cabeça da estátua caiu, e atrás dela havia uma inscrição:');
    await nar('THORNOX FOI CRIADO PARA MATAR KRAVENOX.');
    await bell(2);
    await nar('E, pela primeira vez, Thornox teve medo do próprio destino.');
    solo('lyra');
    await warpDungeon('caminhos', 1, 8, 1);
    await nar('Lyra descia pelos túneis, e o cristal brilhava cada vez mais.');
    saved();
  };
  S.caminhoLyra = async function () {
    if (F().camL) return; F().camL = 1;
    await nar('Encontrou uma porta e, ao tocá-la, ouviu vozes de crianças, muitas, falando ao mesmo tempo.');
    await say('Vozes', '— Não nos esqueça.');
    await say(L, '— Quem são vocês?');
    await say('Vozes', '— Aqueles que vieram antes.');
    await nar('Lá dentro havia milhares de pequenos cristais, cada um com uma memória, uma vida, uma pessoa. A Primeira Cidade não estava vazia: estava cheia de memórias.');
    await say(PAI, '— Minha filha.');
    await say(L, '— Pai... Você nos abandonou.');
    await say(PAI, '— Não. Estava tentando impedir que vocês descobrissem a verdade. Que vocês não foram criados para salvar o Reino. Foram criados para substituir o mundo.');
    await say(L, '— E o que isso significa?');
    await say(PAI, '— Você descobrirá na torre.');
    await nar('E ele desapareceu.');
    solo('seraphyne');
    await warpDungeon('caminhos', 23, 8, 3);
    await nar('Seraphyne subia sozinha, e cada degrau trazia uma memória.');
    saved();
  };
  S.caminhoSeraphyne = async function () {
    if (F().camS) return; F().camS = 1;
    await vision(['O pai pousando a mão sobre a cabeça de uma menina.\n— Você será a chave.', '— Para quê?\n— Para abrir o mundo.']);
    await say(SE, '— Eu era a chave.');
    await say('A Primeira Filha', '— Ainda é.');
    await say(SE, '— Você... você morreu.');
    await say('A Primeira Filha', '— Eu nunca fui embora. Sou a primeira filha.');
    await say(SE, '— Minha irmã.');
    await say('A Primeira Filha', '— E você é a última.');
    await bell(3);
    await say('A Primeira Filha', '— Venha.');
    await nar('Seraphyne segurou a mão dela, e as duas desapareceram.');
    regroup();
    await S.torreTopo();
  };
  // a torre: o pai vivo, a verdade e o mundo que virá (caps. 28–29)
  S.torreTopo = async function () {
    const Cn = C();
    G.fadeA = 0;
    await Cn.begin('torreTopo', 'pai');
    const pai = Cn.actor('pai', { img: () => X.sprite('pai', 'down', 0), x: 160, y: 170, z: 3, scale: 1.6, glow: 'rgba(255,230,160,0.8)', glowA: 0.3 });
    Cn.actor('k', { img: () => X.sprite('kravenoxP', 'up', 0), x: 130, y: 232, z: 6, scale: 1.25, silhouette: '#dfe8ff' });
    Cn.actor('t', { img: () => X.sprite('thornox', 'up', 0), x: 92, y: 230, z: 5, scale: 1.2, silhouette: '#ffd36a' });
    Cn.actor('l', { img: () => X.sprite('lyra', 'up', 0), x: 190, y: 230, z: 5, scale: 1.15, silhouette: '#bfe0ff' });
    Cn.actor('s', { img: () => X.sprite('seraphyne', 'up', 0), x: 232, y: 228, z: 5, scale: 1.2, silhouette: '#c8a8ff' });
    await Cn.caption('No alto da torre, quatro portas se abriram ao mesmo tempo, e os quatro irmãos se encontraram. No centro da sala, o pai deles se levantou com calma, os olhos cheios de tristeza.');
    await say(PAI, '— Meus filhos.');
    await say(K, '— Não somos mais crianças.');
    await say(PAI, '— Eu sei.');
    await say(T, '— Você matou nossa irmã.');
    await say(PAI, '— Sim.');
    await say(L, '— Transformou milhões de pessoas em memórias.');
    await say(PAI, '— Sim.');
    await say(SE, '— E me criou.');
    await say(PAI, '— Sim.');
    await say(K, '— Então diga. Por que criou o Reino?');
    await say(PAI, '— Porque o mundo anterior estava morrendo. Decidi criar vocês. Vocês não são os herdeiros do Reino. São a chave para o próximo.');
    G.Audio.sfx('dark');
    await Cn.tween(Cn, { door: 1 }, 60);
    await Cn.caption('Atrás do trono, uma porta gigantesca se abriu para uma escuridão absoluta.');
    await say(PAI, '— E agora que derrotaram o Primeiro... podemos finalmente começar.');
    await Cn.end();
    F().torreTopo = 1;
    await chapter(29, 'O Mundo que Virá');
    await say(K, '— O que existe ali?');
    await say(PAI, '— O mundo que deveria ter existido. O Primeiro criou o Reino Quebrado para substituir um mundo que estava morrendo. Não conseguiu. Então criou a Fonte. E depois criou vocês.');
    await nar('Ele abriu a mão, e quatro pequenas luzes surgiram: uma dourada, uma prateada, uma negra e uma branca.');
    await say(PAI, '— Criação. Memória. Vazio. E escolha. A única parte que eu nunca consegui criar.');
    await say(K, '— Então por que eu tenho?');
    await say(PAI, '— Porque você a desenvolveu sozinho. O Primeiro não podia escolher algo que contrariasse sua própria natureza.');
    await say(K, '— Por isso ele tinha medo de mim.');
    await Cn.begin('mundoAntigo', 'antigo');
    Cn.ruin = 0;
    await Cn.caption('A escuridão se abriu e uma paisagem surgiu: céu branco, montanhas flutuando, rios correndo para cima, cidades suspensas e, no centro, uma gigantesca árvore negra.');
    await say(K, '— Você quer criá-lo. Usando nós. E o que acontece com o Reino?');
    await say(PAI, '— Ele deixa de existir.');
    await say(L, '— Ainda existem pessoas lá.');
    await say(PAI, '— Você ainda pensa como uma criança.');
    await say(L, '— Talvez. Mas essas pessoas ainda estão vivas.');
    await say(K, '— Então você não é diferente do Primeiro. Quer fazer exatamente a mesma coisa. Só mudou o nome.');
    await say(PAI, '— Porque você ainda não viu o que existe além.');
    G.Audio.sfx('boom');
    await Cn.tween(Cn, { ruin: 1 }, 100);
    await Cn.caption('O céu rachou, montanhas desapareceram, oceanos evaporaram. A vida morreu.');
    await say(K, '— Então o Reino não foi um mundo novo. Foi um abrigo. E nós fomos criados para reconstruir o mundo quando ele pudesse voltar.');
    await say(PAI, '— Exatamente. Mas algo está vindo. O mesmo que destruiu o primeiro mundo. Os Devoradores.');
    await Cn.end();
    await S.primeiroDevorador();
  };

  // ===================== O PRIMEIRO DEVORADOR (caps. 29–30) =====================
  S.primeiroDevorador = async function () {
    const Cn = C();
    await Cn.begin('ceuFerido', 'devorador');
    Cn.rift = 0.1;
    await Cn.caption('No horizonte, uma linha negra atravessava o céu. A linha cresceu, o céu se abriu.');
    await Cn.tween(Cn, { rift: 1 }, 80);
    const dv = Cn.actor('dv', { img: () => X.imgs.e_devorador, x: 160, y: 150, z: 2, scale: 1.2, alpha: 0, glow: 'rgba(255,40,40,0.6)', glowA: 0.3 });
    await Cn.tween(dv, { alpha: 1, y: 176 }, 70);
    await say(PAI, '— Impossível. Eu pensei que tivesse destruído isso há milhares de anos. O primeiro Devorador.');
    G.Audio.sfx('dark'); G.shake = 14;
    await say(DV, '— Encontramos vocês.');
    await say(K, '— Então era isso. A verdadeira guerra.');
    await say(PAI, '— Agora vocês entendem.');
    await say(K, '— Não. Agora nós decidimos.');
    await Cn.caption('As luzes da cidade começaram a se acender, uma por uma, e milhares de pessoas surgiram nas ruas. Não eram fantasmas. Eram sobreviventes. A Primeira Cidade estava acordando.');
    await Cn.end();
    await chapter(30, 'A Queda da Primeira Cidade');
    D.healAll();
    await say(K, '— Então esse é o fim de um mundo.');
    await say(T, '— Não. É o começo da nossa luta.');
    await G.battle(['devorador'], { bg: 'cidade', music: 'devorador', noEscape: true, intro: 'O primeiro Devorador desce sobre a Primeira Cidade!', events: [
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.8, run: async () => {
        G.Audio.sfx('light'); G.flash('#ffe8a0', 0.6);
        await nar('Thornox ergueu uma muralha de luz sobre a Primeira Cidade. Lyra ergueu o cristal, e a memória coletiva da cidade virou uma barreira.');
        for (const h of G.state.party) if (h.alive) h.status.shield = 3;
        await say(DV, '— Vocês não podem impedir o fim.');
        await say(L, '— NÃO PRECISAMOS IMPEDIR O FIM! PRECISAMOS ESCOLHER O QUE SOBREVIVE!');
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.5, run: async () => {
        await say(SE, '— Eu tenho uma ideia. Não para o Vazio. Para dentro dele mesmo.');
        await say(K, '— Você quer fazer o Vazio refletir a criatura.');
        F().tec_espelho = 1; G.Audio.sfx('level');
        await nar('Seraphyne aprendeu Espelho do Vazio!');
        await say(DV, '— Filhos da Essência. Eu conheço todos os mundos que ele destruiu.');
        await say(T, '— Ele não destruiu esses mundos.');
        await say(DV, '— Ele escolheu quais deveriam sobreviver. E agora escolherá de novo.');
        await say(K, '— Não. Dessa vez não será ele.');
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.2, run: async () => {
        await say(K, '— Estou começando a gostar disso.');
        await say(T, '— Você é louco.');
        await say(K, '— Sempre fui. AGORA!');
        G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 24;
        await nar('Thornox lançou toda a sua energia, Lyra liberou as memórias, Seraphyne abriu o Vazio por inteiro. O Devorador foi puxado e sua forma começou a se desfazer.');
        await say(DV, '— Você ainda não entende. Eu não sou o Primeiro. Sou apenas o primeiro a chegar.');
        return 'end'; } }] });
    const Cn2 = C();
    await Cn2.begin('ceuFerido', 'cidade');
    Cn2.rift = 0.6;
    await Cn2.caption('Então a Primeira Cidade começou a desmoronar.');
    await say(PAI, '— A cidade não pode permanecer. Foi construída sobre a antiga ruptura.');
    await say(K, '— Então vamos salvá-la. Me dê uma chance.');
    await say(PAI, '— Agora você está entendendo.');
    G.Audio.sfx('heal'); G.flash('#ffe8a0', 0.6);
    await Cn2.caption('Ele pousou a mão sobre o trono. As raízes da cidade se soltaram, as torres se uniram, e no centro surgiu uma praça enorme. No coração dela, uma nova Fonte — menor, mais fraca, mas viva.');
    await say(L, '— Você conseguiu.');
    await say(PAI, '— Não. Vocês conseguiram.');
    G.Audio.sfx('dark');
    await Cn2.caption('O céu escureceu, e quatro silhuetas surgiram na abertura — muito maiores e mais antigas que a primeira.');
    await say(K, '— Preparem o Reino.');
    await say(L, '— Para quê?');
    await say(K, '— Para a guerra que vem.');
    await Cn2.end();
    F().cidadeViva = 1; F().ch30 = 1;
    G.enterField('cidade', 15, 12, 'up');
    await G.fade(0, 30);
    await nar('A cidade agora tem gente nas ruas. A praça central, com as mesas, é onde todos se reúnem.');
    saved();
  };
  S.sobrevivente1 = async () => { await say('Sobrevivente', '— Dormimos por milhares de anos, eles dizem. Eu só lembro de ter fechado os olhos ontem.'); };
  S.sobrevivente2 = async () => { await say('Mulher da Cidade', '— Meu filho diz que você é o monstro das histórias. Eu disse a ele que monstros não salvam cidades.'); };
  S.sobrevivente3 = async () => { await say('Garoto da Cidade', '— Quando o céu abrir de novo, eu vou ficar perto de você.'); };
  S.mascateCidade = async function () {
    if (!F().mascateCid) { F().mascateCid = 1; await say('Mascate de Cinzas', '— Uma cidade inteira acordando com fome e sem dinheiro. Sabe o que é isso? Freguesia.'); }
    await G.shop('Mascate de Cinzas', ['elixir', 'agua', 'cristalM', 'cristalG', 'raiz', 'nevoa', 'garraAntiga', 'cajadoArkan', 'cristalCidade', 'mantoCidade'], 40);
  };
  // ===================== O EXÉRCITO DAS SOMBRAS (cap. 31) =====================
  S.exercitoSombras = async function () {
    if (F().ch31) return;
    await chapter(31, 'O Exército das Sombras');
    await say(K, '— Eles estão vindo.');
    await say(PAI, '— A primeira criatura levou milhares de anos para atravessar o vazio. As outras já estão aqui.');
    await say(SE, '— Portas. Centenas. Estão entrando por todos os caminhos.');
    G.Audio.sfx('dark'); G.shake = 10;
    await nar('O primeiro portal se abriu sobre as muralhas. Uma criatura caiu, depois outra, depois dezenas. As flechas atingiam os monstros e simplesmente desapareciam.');
    await say(K, '— Não ataquem os corpos! Ataquem as sombras! Não mate o monstro. Mate aquilo que está usando o monstro.');
    await G.battle(['sombraQuatro', 'sementeVazio', 'sombraQuatro'], { bg: 'cidade', music: 'devorador', noEscape: true, intro: 'Criaturas de quatro braços caem dos portais!' });
    await say(K, '— Eles não querem a cidade. Querem os sobreviventes.');
    await say(L, '— Kravenox! As criaturas estão levando pessoas! Uma criança desapareceu da praça!');
    await nar('Um portal negro pulsa no meio da praça, entre as mesas.');
    F().ch31 = 1;
    saved();
  };
  S.portalColheita = async function () {
    if (!F().ch31 || F().colheitaFim) return;
    await warpField('colheita', 15, 12, 'up');
    if (!F().colheita) {
      F().colheita = 1;
      await nar('Do outro lado não havia céu nem chão, só uma imensa planície negra. Milhares de pessoas estavam presas por correntes de sombra, e no centro erguia-se uma torre gigantesca que pulsava como um coração.');
      await say(K, '— O que é isso?');
      await say('???', '— Uma colheita.');
      saved();
    }
  };
  S.portalVolta = async () => { if (!F().colheitaFim) await nar('O portal de volta pulsa atrás de vocês. Ainda não: as pessoas estão presas.'); G.Field.py -= 1; };
  S.preso = async () => nar(G.pick(['Correntes de sombra prendem os pulsos. Os olhos estão abertos, mas não veem nada.', 'Alguém sussurra um nome. Depois esquece qual era.']));
  S.torreNegraOlhar = async () => nar('A torre negra pulsa como um coração. Não tem janelas.');
  S.fendaColheita = async () => nar('Uma fenda no chão negro. Lá embaixo, mais correntes.');
  S.torreColheita = async function () {
    if (F().entregou) return;
    await nar('Atrás dele havia uma criatura muito maior que as outras, coberta por uma armadura, com dois olhos vermelhos no rosto.');
    await say(K, '— Solte-os.');
    await say('Carcereiro', '— Você ainda acredita que pode ordenar alguma coisa.');
    await say(K, '— Não. Vim negociar. Você me dá todos eles. E recebe... eu.');
    await say('Carcereiro', '— Interessante.');
    await say(T, '— Kravenox...');
    await say(K, '— Eu tenho um plano. Preciso descobrir para onde estão levando essas pessoas.');
    await say(L, '— E se o plano falhar?');
    await say(K, '— Então vocês vêm me buscar.');
    await say(SE, '— E se não conseguirmos?');
    await say(K, '— Então destruam tudo.');
    await nar('Kravenox se entregou, e correntes negras envolveram seus braços. Antes de ser arrastado, olhou para os irmãos. Thornox ergueu discretamente dois dedos — o sinal: duas horas. Kravenox assentiu.');
    F().entregou = 1;
    solo('kravenox');
    await warpDungeon('torreNegra');
    await nar('A criatura o levou até a torre negra. Subiram um andar, dois, dez, cem; a torre parecia não ter fim. Em algum momento, as correntes afrouxaram. Ninguém vigiava um prisioneiro que já tinha se entregado.');
    saved();
  };

  // ===================== A TORRE NEGRA (caps. 31–32) =====================
  S.topoTorreNegra = async function () {
    if (F().topoNegra) return;
    await nar('No topo, uma porta se abriu para uma sala com dezenas de criaturas que não atacaram. Todas olhavam para uma figura sentada no centro: humanoide, alta, de armadura negra e sem rosto.');
    await say('O Sem Rosto', '— Kravenox. Conheço todos os nomes que carregaram a Essência. Você é diferente. Você escolheu a si mesmo. É por isso que o Primeiro tinha medo de você.');
    await say(K, '— E por que vocês querem os sobreviventes?');
    await say('O Sem Rosto', '— Eles não são sobreviventes. São sementes. De um novo mundo. Queremos usar as memórias delas. O Reino é uma cópia. Nós queremos o original. E agora você vai nos ajudar.');
    await say(K, '— Não. Eu disse que viria. Não disse que obedeceria.');
    G.Audio.sfx('silver'); G.flash('#dfe8ff', 0.9); G.shake = 20;
    await nar('As correntes começaram a rachar, e uma energia prateada surgiu em torno de Kravenox. A primeira corrente explodiu, depois a segunda, depois todas.');
    await say(K, '— Vocês cometeram um erro. Me trouxeram para dentro.');
    await chapter(32, 'O Rei dos Espinhos');
    D.healAll();
    await G.battle(['guardiaoTorre'], { bg: 'torreNegra', music: 'devorador', noEscape: true, intro: 'O guardião de olhos vermelhos avança. A torre rui ao redor.', events: [{
      when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.25,
      run: async () => { await say('Carcereiro', '— Você não deveria possuir esse poder.'); await say(K, '— Eu também achava.'); return 'end'; } }] });
    F().topoNegra = 1;
    await S.nucleoTorre();
  };
  S.nucleoTorre = async function () {
    const Cn = C();
    await Cn.begin('nucleo', 'pai');
    Cn.release = 0;
    await Cn.caption('Kravenox chegou ao núcleo: um enorme cristal negro com milhares de rostos dentro. Não era uma prisão. Era uma máquina, construída para transformar memórias em matéria.');
    await say(PAI, '— Não faça isso. A cidade inteira está ligada à minha essência.');
    await say(K, '— Você sabia dessa máquina. E deixou acontecer.');
    await say(PAI, '— Eu não sabia que eles a encontrariam.');
    await say(K, '— Você sempre tem uma desculpa. Você passou milhares de anos decidindo o destino de mundos. Tentando controlá-los. E agora acabou.');
    G.Audio.sfx('crack');
    await say(PAI, '— Se destruir o núcleo, as memórias serão perdidas.');
    await Cn.caption('Kravenox parou. Era a única coisa que podia fazê-lo hesitar: aquelas memórias, aquelas pessoas, aquelas vidas.');
    await say(MAE, '— Kravenox.');
    await say(K, '— Mãe?');
    await say(MAE, '— Não carregue aquilo que não é seu. Algumas memórias precisam morrer para que as pessoas possam viver.');
    await Cn.caption('Não era possível salvar tudo, mas era possível escolher o que preservar. Em vez de destruir o cristal, ele o abriu.');
    G.Audio.sfx('memory');
    await Cn.tween(Cn, { release: 1 }, 140);
    await Cn.caption('Milhares de luzes escaparam, subiram, atravessaram a torre e desapareceram no céu, voltando para aqueles que ainda estavam vivos.');
    await say(K, '— Descansem.');
    G.Audio.sfx('boom'); G.shake = 30; Cn.whiteColor = '#ffffff'; Cn.holdWhite = true; await Cn.tween(Cn, { white: 1.1 }, 16);
    Cn.cap = { text: 'E então destruiu o núcleo. A torre começou a cair.', t: 0 }; await Cn.wait(90);
    Cn.holdWhite = false;
    await Cn.end();
    regroup(); D.healAll();
    F().colheitaFim = 1;
    G.enterField('cidade', 15, 12, 'up');
    await G.fade(0, 30);
    await say(T, '— KRAVENOX!');
    await nar('Uma sombra surgiu na poeira, e Kravenox apareceu. Os três atravessaram o portal no instante em que a torre desabou atrás deles.');
    await say(L, '— Você está vivo!');
    await nar('Ela o abraçou. Kravenox ficou surpreso, e depois retribuiu.');
    await say(T, '— Você demorou.');
    await say(K, '— Tive alguns problemas.');
    await say(SE, '— Temos um problema maior.');
    await S.reiDosEspinhos();
  };

  // ===================== O REI DOS ESPINHOS (caps. 32–33) =====================
  S.reiDosEspinhos = async function () {
    G.Audio.play('primeiro');
    await nar('A fenda no céu era agora gigantesca, e algo descia por ela: uma figura humanoide, alta, de armadura negra, com uma coroa de espinhos na cabeça. Milhares de criaturas se ajoelharam.');
    await say('???', '— Kravenox.');
    await say(K, '— Quem é você?');
    await nar('A figura tirou a coroa devagar e revelou o rosto. Era o rosto de Kravenox — muito mais velho, coberto de cicatrizes, com olhos vermelhos.');
    if (X.imgs.k_futuro) await G.showImage(X.imgs.k_futuro, 'O Rei dos Espinhos.');
    await say(RE, '— Sou você.');
    await say(K, '— Você não existe.');
    await say(RE, '— Ainda não. Você está prestes a cometer o mesmo erro que eu. Acreditar que salvar o mundo significa preservar aquilo que já existe.');
    await say(K, '— O que aconteceu comigo?');
    await say(RE, '— Você venceu. Depois tentou reconstruir tudo. E destruí tudo.');
    const Cn = C();
    await Cn.begin('mundoMorto', 'primeiro');
    await Cn.caption('O céu se abriu atrás dele, e um segundo Reino apareceu: um mundo morto, sem vida. No centro, Kravenox sentado num trono, cercado por milhões de cadáveres.');
    await say(T, '— Isso é...');
    await say(K, '— Meu futuro.');
    await say(RE, '— Agora escolha. Salvar o mundo ou salvar aqueles que você ama.');
    await Cn.end();
    await chapter(33, 'O Peso da Escolha');
    await say(K, '— Você está esperando que eu tenha medo.');
    await say(RE, '— Não. Quero que você compreenda.');
    await say(T, '— Já entendemos o suficiente.');
    await say(RE, '— Não, Thornox. Você ainda acredita que pode salvá-lo.');
    await say(T, '— Posso.');
    await say(RE, '— Foi exatamente isso que eu disse.');
    await say(K, '— Você se tornou o rei. Por quê?');
    await say(RE, '— Porque alguém precisava decidir.');
    await say(T, '— Não. Você decidiu porque teve medo de perder.');
    await say(K, '— Você perdeu alguém.');
    await say(RE, '— Todos.');
    await say(K, '— Quem matou Thornox?');
    await say(RE, '— Você. Porque ele tentou me impedir. De salvar vocês. Destruindo tudo o que ameaçava vocês.');
    await say(K, '— Você virou aquilo que jurou destruir. Você perdeu todos porque tentou salvar tudo. Eu não vou fazer isso.');
    await say(RE, '— Então o que fará?');
    await say(K, '— Ainda não sei.');
    await say(RE, '— Essa é a resposta certa. Eu demorei séculos para perceber. O futuro não é uma prisão. É uma advertência.');
    await nar('Ele pousou a coroa no chão, e ela virou cinzas.');
    await say(RE, '— Existe uma coisa que eu não consegui destruir. A escolha. Use-a antes que seja tarde.');
    await say(T, '— O que aconteceu com você?');
    await say(RE, '— Eu ainda estou aqui.');
    await nar('E desapareceu. O exército das sombras começou a se mover.');
    await say(K, '— Não vamos defender a cidade. Vamos tirar todo mundo daqui. Para o Reino Quebrado. É o único lugar onde a Fonte ainda está estável.');
    await say(T, '— Essa é a pior estratégia que já ouvi.');
    await say(K, '— Mas é uma estratégia.');
    D.healAll();
    await G.battle(['sombraQuatro', 'carcereiro', 'sombraQuatro'], { bg: 'cidade', music: 'devorador', noEscape: true, intro: 'A vanguarda do exército das sombras avança sobre os sobreviventes!' });
    await say(PAI, '— O Reino não suportará tantas pessoas.');
    await say(K, '— Então aumentaremos o Reino. Confie em mim.');
    await say(PAI, '— Você está escolhendo unir duas Essências incompatíveis. Pode destruir tudo.');
    await say(K, '— Também pode salvar.');
    await say(PAI, '— Finalmente. Você deixou de tentar vencer. Agora está tentando criar.');
    await say(SE, '— Não vai funcionar. A passagem precisa de uma âncora. Uma consciência. Alguém precisa ficar.');
    await say(K, '— Então eu fico.');
    await say(T, '— Não vou deixar.');
    await say(K, '— Eu vi meu futuro. Vi você morrer porque eu tentei salvar todos sozinho. Não vou repetir.');
    await say(T, '— Então não faça isso sozinho.');
    await say(L, '— Nós quatro.');
    await say(SE, '— Nós quatro.');
    await say(K, '— Juntos.');
    const Cn2 = C();
    await Cn2.begin('passagemMundos', 'novoReino');
    Cn2.portal = 0;
    await Cn2.tween(Cn2, { portal: 1 }, 80);
    await Cn2.caption('A Fonte pulsou, e a passagem se abriu. Os quatro atravessaram primeiro, e depois vieram os sobreviventes — milhares, dezenas de milhares — enquanto a Primeira Cidade desaparecia atrás deles.');
    G.Audio.sfx('dark'); G.shake = 16;
    await say(SE, '— Esse não é um Devorador. É aquele que os comanda.');
    await say('???', '— Filhos da Essência. Agora conhecerão o verdadeiro Rei do Vazio.');
    G.fadeA = 1;
    await Cn2.end();
    F().evacuou = 1;
    await S.reiDoVazio();
  };

  // ===================== O REI DO VAZIO (cap. 34) =====================
  S.reiDoVazio = async function () {
    await chapter(34, 'O Rei do Vazio', ['O céu desapareceu. Não escureceu: desapareceu.']);
    await say(PAI, '— Não pode ser. O Rei do Vazio. A primeira coisa que existiu antes da criação.');
    await say(T, '— Então como podemos derrotá-lo?');
    await say(PAI, '— Não podemos.');
    await say(K, '— Ótimo. Só significa que teremos que descobrir como.');
    await say(RV, '— Vocês fogem.');
    await say(K, '— Estamos recuando.');
    await say(RV, '— Você é a única coisa que não deveria existir. Ele não é seu irmão. Ele é a primeira escolha.');
    await say(K, '— Você sabia o que eu era.');
    await say(PAI, '— Desde antes do seu nascimento.');
    D.healAll();
    const kh = () => G.state.party.find(h => h.id === 'kravenox');
    await G.battle(['reiVazio'], { bg: 'fonte', music: 'reiVazio', noEscape: true, noRewards: true, intro: 'O Rei do Vazio desce sobre a Fonte.',
      setup: b => { b.enemies[0].immune = true; },
      events: [
        { when: b => b.round >= 3, run: async (b) => {
          await nar('Os Devoradores não queriam apenas matar: queriam apagar. Lyra espalhou as memórias dos sobreviventes pela Fonte, de modo que cada pessoa passou a carregar a lembrança de outra.');
          F().tec_memoriaColetiva = 1; G.Audio.sfx('level');
          await nar('Lyra aprendeu Memória Coletiva!');
          await say(T, '— Aquilo nem sentiu.');
          await say(K, '— Eu sei. Precisamos de outra coisa. A primeira escolha.');
          await say(T, '— Você.');
          await say(K, '— Eu.');
          await say(PAI, '— Não faça isso. Não existe controle sobre isso.');
          await say(K, '— Então não vou controlar. Vou escolher.');
          G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 30;
          await nar('Kravenox pousou a mão sobre a Fonte. A Fonte explodiu. Sua pele rachou, os espinhos cresceram, e a energia ao redor dele mudou. Já não era apenas Essência corrompida. Era algo novo, sem nome.');
          await vision(['Dentro da mente de Kravenox havia silêncio.', 'Quatro portas — dourada, negra, branca e vazia. Atrás de cada uma, uma versão dele: o guerreiro, o rei, o destruidor, o salvador.', '— Nenhum de vocês sou eu.\n— Então quem é você?\n— Ainda estou descobrindo.'], 'reiVazio');
          const h = kh(); F().desperto = 1; F().tec_primeiraEscolha = 1;
          if (h) { h.alive = true; h.hp = h.maxhp; h.ep = h.mep; h.atk = Math.round(h.atk * 1.4); h.def = Math.round(h.def * 1.3); h.agi += 8; h.status = {}; }
          for (const x of G.state.party) { if (!x.alive) { x.alive = true; x.hp = Math.round(x.maxhp * 0.5); } x.ep = x.mep; }
          b.enemies[0].immune = false;
          await say(RV, '— Não.');
          await say(K, '— Agora você entendeu.');
          await nar('Pela primeira vez, o Rei do Vazio recuou. Kravenox pode usar A Primeira Escolha.');
          return null; } },
        { when: b => !b.enemies[0].immune && b.enemies[0].hp < b.enemies[0].maxhp * 0.45, run: async () => {
          await say(SE, '— Aquilo não está lutando.');
          await say(RV, '— Esperando. Eu não vim destruir seu mundo. Vim mostrar o que acontece com todos os mundos.');
          await nar('O céu do Reino se abriu, e dentro de milhares de portais havia mundos — centenas, milhares. Todos mortos.');
          await say(RV, '— Vocês não são os primeiros. Não serão os últimos. Mas podem ser os primeiros a escolher um destino diferente. Destrua a Fonte.');
          await say(T, '— NÃO!');
          await say(RV, '— O ciclo termina. O Reino será livre. Os Devoradores desaparecerão.');
          const c = await G.choose('O que Kravenox escolhe?', ['Destruir a Fonte', 'Preservar a Fonte', 'Mudar a regra'], { w: 150 });
          if (c < 2) await nar('Kravenox dá um passo... e para. Salvar ou destruir. Preservar ou libertar. Pela primeira vez, percebeu que seu maior inimigo era a necessidade de escolher entre dois males.');
          await say(K, '— Não. Eu não vou destruir. Também não vou preservar. Vou mudar a regra.');
          G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 30;
          await say(RV, '— Impossível.');
          await say(K, '— Você disse que eu era a primeira escolha. Então veja o que uma escolha pode fazer.');
          return 'end'; } }] });
    const h = kh(); F().desperto = 0; delete F().tec_primeiraEscolha; if (h) D.recalc(h);
    await S.novaEssencia();
  };

  // ===================== A NOVA ESSÊNCIA (cap. 35) =====================
  S.novaEssencia = async function () {
    await chapter(35, 'A Nova Essência', ['A explosão não fez barulho, e foi isso que assustou Kravenox.']);
    const Cn = C();
    await Cn.begin('essencia', 'pai');
    await Cn.caption('Ele já não estava no Reino. Estava dentro da Essência. Ao redor flutuavam fragmentos de mundos, todos ligados por fios de energia.');
    const tI = Cn.actor('t', { img: () => X.sprite('thornox', 'down', 0), x: 200, y: 150, z: 3, scale: 1.3, glow: 'rgba(255,230,150,0.9)', glowA: 0.7 });
    Cn.actor('k', { img: () => X.sprite('kravenoxP', 'down', 0), x: 130, y: 150, z: 3, scale: 1.3, glow: 'rgba(223,232,255,0.9)', glowA: 0.4 });
    await say(K, '— Onde estamos?');
    await say(T, '— No coração da Essência.');
    const pai = Cn.actor('pai', { img: () => X.sprite('pai', 'down', 0), x: 165, y: 120, z: 2, scale: 1.3, alpha: 0.55, glow: 'rgba(255,240,200,0.8)', glowA: 0.3 });
    await say(K, '— O que aconteceu com você?');
    await say(PAI, '— A Fonte não precisa mais de mim. Não estou morrendo. Estou finalmente terminando.');
    G.Audio.sfx('dark');
    await say(RV, '— Estou sendo expulso. Por você. Você alterou a regra. A Fonte não pertence mais a um único mundo. Agora todos os mundos estão conectados.');
    await say(K, '— Se um mundo cair...');
    await say(RV, '— Todos sentirão.');
    await say(SE, '— Mas, se um mundo sobreviver, todos poderão sobreviver.');
    await say(K, '— Então acabou?');
    await say(RV, '— Não. Agora começou. Existem outros reis.');
    await say(K, '— Quantos?');
    await say(PAI, '— Não sei. Existem outros mundos ligados à Essência. Milhares. Alguns lutando contra coisas diferentes.');
    await Cn.caption('Um mundo coberto de oceanos. Um deserto infinito. Uma floresta onde as árvores caminhavam. Uma cidade construída sobre uma criatura colossal. Um mundo congelado. Céus vermelhos.', 70);
    await say(L, '— E nós podemos chegar até eles.');
    await say(SE, '— Então temos um universo inteiro para explorar.');
    await say(K, '— E provavelmente destruir.');
    await say(PAI, '— Você está aprendendo. Você fundiu a Essência do Reino Quebrado com a memória da Primeira Cidade. Um novo Reino.');
    await say(SE, '— Um mundo que não deveria existir.');
    await say(K, '— Parece familiar.');
    await say(K, '— E você?');
    await say(PAI, '— Eu fico. Meu papel terminou. Passei milhares de anos tentando decidir o destino de vocês. Agora é a sua vez.');
    await say(K, '— Eu não sei fazer isso.');
    await say(PAI, '— Ninguém sabe.');
    await say(K, '— E se eu errar?');
    await say(PAI, '— Você vai errar.');
    await say(K, '— E então?');
    await say(PAI, '— Escolherá de novo.');
    await Cn.tween(pai, { alpha: 0.2 }, 80);
    await say(K, '— Pai...');
    await say(PAI, '— Vá.');
    void tI;
    G.Audio.sfx('silver'); Cn.whiteColor = '#ffffff'; Cn.holdWhite = true; await Cn.tween(Cn, { white: 1.1 }, 40);
    Cn.holdWhite = false; await Cn.end();
    await Cn.begin('novoReino', 'novoReino');
    await Cn.caption('Ele acordou no chão e respirou. Ar. Vento. Terra. O céu estava diferente: em tons de azul profundo e violeta, com duas luas no horizonte.');
    await say(T, '— Bem-vindo ao novo Reino.');
    await say(L, '— Precisamos dar um nome a ele.');
    await say(K, '— Não. O nome será dado por quem viver aqui.');
    await say(SE, '— Finalmente uma boa escolha.');
    await say(T, '— Você também sente?');
    await say(K, '— Sim. Eles sabem que existimos.');
    G.Audio.sfx('dark');
    await say('???', '— A primeira porta foi aberta.');
    await say('???', '— Então enviem o segundo Rei.');
    await say(K, '— Não sei quem era. Mas ele sabe quem somos.');
    await say(K, '— Parece que nosso primeiro dia acabou.');
    await say(T, '— E o segundo começou.');
    await say(K, '— Então vamos descobrir quem está esperando por nós.');
    await Cn.end();
    await Cn.begin('arvoreMarcas', 'novoReino');
    Cn.fifth = 0;
    await Cn.caption('Atrás deles, uma pequena raiz negra rompeu o solo e formou uma árvore que ninguém havia plantado. No tronco havia quatro marcas: uma de luz, uma de sombra, uma de memória e uma vazia.');
    G.Audio.sfx('heart');
    await Cn.tween(Cn, { fifth: 1 }, 120);
    await Cn.caption('E, no centro delas, uma quinta marca, que não pertencia a nenhum dos quatro. A marca de algo que ainda estava por nascer.', 90);
    G.fadeA = 1;
    await Cn.end();
    F().fimLivro = 1;
    D.healAll(); G.enterField('cidade', 15, 12, 'up'); D.save();
    await G.narrate(['Este volume é a fundação do universo de Reino Quebrado.', 'O mundo ainda guarda segredos.\nNem todas as respostas estarão neste primeiro volume.', 'E nem toda lenda contará a verdade.'], { hold: 160, color: '#c9bfd8' });
    G.Audio.play('fim');
    await G.credits(3);
  };
})();
