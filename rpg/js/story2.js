'use strict';
// Roteiros da Parte 2 — Capítulos 14 a 25 de "Reino Quebrado": O Reino em Guerra.
(function () {
  const S = G.story;
  const D = G.data;
  const F = () => G.state.flags;
  const say = (n, t) => G.say(n, t);
  const nar = t => G.say(null, t);
  const K = 'Kravenox', T = 'Thornox', L = 'Lyra', SE = 'Seraphyne', PAI = 'O Pai', MAE = 'A Mãe', PR = 'O Primeiro', KF = 'Kravenox do Futuro';
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
  async function heal(text) { D.healAll(); G.Audio.sfx('heal'); G.flash('#ffe8a0', 0.5); if (text) await nar(text); }
  const saved = () => { D.save(); G.toast('Jogo salvo.'); };
  const learn = async (who, key) => { F()['tec_' + key] = 1; G.Audio.sfx('level'); await nar(who + ' aprendeu ' + D.TECHS[key].name + '!'); };
  // Kravenox sozinho por um momento (o beco, o duelo consigo mesmo)
  function alone() { for (const id of ['seraphyne', 'lyra', 'thornox']) D.removeHero(id); }
  function together() { for (const id of ['thornox', 'lyra', 'seraphyne']) if (id !== 'seraphyne' || F().seraJunta) D.restoreHero(id); }

  // auras dos eventos nas masmorras da Parte 2
  const evDone1 = S.evDone;
  S.evDone = function (map, c) {
    const f = F(); const m = {
      escadaria: { d: 'portaPai', e: 'pai' }, passagem: { l: 'simbolos', a: 'criatura', r: 'seraJunta', d: 'portaCoracao', e: 'coracao' },
      fortaleza: { l: 'memParede', d: 'entrem', e: 'futuro' }, raizes: { e: 'mae2', d: 'portaCircular', r: 'escolhidos', l: 'raizQ', f: 'fonte2' } }[map];
    if (m) return !!(m[c] && f[m[c]]);
    return evDone1(map, c);
  };

  // ===================== INÍCIO DA PARTE 2 =====================
  S.parte2 = async function () {
    const f = F(); f.p2 = 1; f.prata = 1;
    for (const id of ['thornox', 'lyra']) D.restoreHero(id);
    D.healAll();
    G.Audio.play('guerra');
    G.fadeA = 1;
    await G.narrate(['PARTE 2\nO Reino em Guerra'], { hold: 160, color: '#c9a24a' });
    await chapter(14, 'O Reino em Guerra');
    G.enterField('guerra', 4, 3, 'down');
    await G.fade(0, 40);
    await nar('A primeira coisa que Kravenox sentiu ao atravessar a passagem foi o frio. Não o frio do Abismo Carmesim, mas outro, mais profundo — o frio que não vem do ar, e sim da ausência de vida.');
    await nar('Uma névoa negra cobria as colinas. As árvores mortas tinham voltado a crescer, com folhas escuras e retorcidas. No horizonte, dezenas de colunas de fumaça subiam ao céu.');
    await nar('E havia algo pior: silêncio. Nenhum pássaro, nenhum animal, nenhum vento. Só o som distante de tambores.');
    await say(K, '— Quanto tempo ficamos lá dentro?');
    await say(L, '— Não importa. O Reino não percebe o tempo como nós. Para nós podem ter passado horas. Para eles, meses.');
    await nar('Numa torre distante, uma bandeira tremulava com o símbolo dos Sentinelas do Vazio.');
    await say(K, '— Eles chegaram.');
    await say(T, '— Não. Eles já estavam aqui.');
    D.save(); G.toast('Jogo salvo.');
  };
  S.passagemFechada = async () => { await nar('A passagem por onde saíram se fechou. Atrás deles, só pedra fria.'); };
  S.torreBandeira = async () => { await nar('Uma torre distante. No alto, a bandeira dos Sentinelas do Vazio tremula sem vento.'); };
  S.fendaGuerra = async () => nar(G.pick(['Uma fenda na terra. Lá embaixo, raízes negras se mexem devagar.', 'O chão rachou aqui há pouco tempo. Ainda está quente.']));
  S.fogueiraCampo = async () => nar(G.pick(['Uma fogueira pequena. Ninguém fala alto perto dela.', 'O fogo estala. Alguém deixou um pão pela metade ao lado das brasas.']));

  S.refugiados = async function () {
    if (F().refugiados) return;
    await nar('Um grito veio da estrada. Três pessoas corriam na direção deles: um homem carregando uma criança, uma mulher logo atrás e um garoto coberto de poeira.');
    await nar('Atrás deles, coisas rastejavam pela névoa.');
    await G.battle(['larvaFogo', 'cinzento', 'larvaFogo'], { bg: 'guerra', intro: 'As criaturas que perseguiam a família avançam!' });
    await nar('Ao ver os irmãos, as pessoas pararam, e o homem ergueu uma espada.');
    await say('Homem', '— Não se aproximem!');
    await say(K, '— Não queremos machucar vocês.');
    await nar('O homem olhou para Thornox e arregalou os olhos.');
    await say('Homem', '— Guardião...');
    await say(T, '— Você me conhece?');
    await say('Homem', '— Todo mundo conhece.');
    await say('Mulher', '— Pensávamos que você estava morto.');
    await say(T, '— Eu estive.');
    await say('Homem', '— E eles?');
    await say(K, '— Família.');
    G.Audio.sfx('boom'); G.shake = 18;
    await nar('Antes que o homem pudesse perguntar mais, um estrondo veio das montanhas. Uma torre caiu, levantando uma nuvem de poeira.');
    await say('Homem', '— Eles chegaram.');
    await say(T, '— Quantos?');
    await say('Homem', '— Muitos. Na cidade. Valdora.');
    await nar('O nome despertou algo em Kravenox: uma cidade antiga, que ele conhecera antes do Cisma, onde os irmãos costumavam treinar.');
    await say(K, '— Valdora ainda existe?');
    await say('Homem', '— Existia.');
    await say(T, '— Temos que ir.');
    await say('Homem', '— É suicídio.');
    await say(K, '— Já fiz coisas piores.');
    await say(T, '— Não transforme isso em hábito.');
    await say('Homem', '— Por que estão indo para lá?');
    await say(K, '— Porque quem está atacando Valdora está procurando por nós.');
    await say('Homem', '— Então por que não fogem?');
    await say(K, '— Porque já fugimos por tempo demais.');
    await say('Mulher', '— Há um acampamento ao sul, junto ao poço velho. Alguns sobreviventes. Um mascate também, se ainda estiver vivo.');
    await nar('O homem hesitou. Depois, enquanto a mulher levava as crianças para o sul, ele seguiu os três de longe.');
    F().refugiados = 1;
    saved();
  };
  S.refugiada = async function () {
    if (!F().valdora) await say('Mulher', '— Meu marido foi atrás de vocês. Ele é teimoso. Como vocês.');
    else await say('Mulher', '— Ouvi dizer que os portões de Valdora se fecharam. Se encontrarem meu marido... digam que o garoto está bem.');
  };
  S.menino = async function () {
    F().meninoN = (F().meninoN || 0) + 1;
    if (F().meninoN === 1) { await say('Garoto', '— Você é o monstro das histórias?'); await say(K, '— Depende de quem conta.'); return; }
    await say('Garoto', '— Quando eu crescer, vou ser Guardião. Igual a ele.');
    await nar('O garoto aponta para Thornox. Thornox finge que não ouviu. Mas sorri.');
  };
  S.mascateGuerra = async function () {
    if (!F().mascateG) {
      F().mascateG = 1;
      await say('Mascate de Cinzas', '— Você de novo. Sabia que voltaria. Gente como você sempre volta.');
      await say(K, '— E gente como você sempre sobrevive.');
      await say('Mascate de Cinzas', '— A guerra é ruim pra todo mundo. Menos pra quem vende.');
    }
    await G.shop('Mascate de Cinzas', ['seiva', 'nectar', 'elixir', 'cristal', 'cristalM', 'raiz', 'nevoa', 'garraPrata', 'cajadoValdora', 'cristalLuz', 'cotaValdora'], 20);
  };

  S.conversaEstrada = async function () {
    if (F().estrada) return; F().estrada = 1;
    await nar('A estrada estava destruída: casas queimadas, carroças abandonadas, corpos cobertos por panos, trechos inteiros tomados por raízes negras. Lyra caminhava em silêncio.');
    await say(K, '— Você está bem?');
    await say(L, '— Estou.');
    await say(K, '— Tem certeza?');
    await say(L, '— Não.');
    await say(K, '— Melhor resposta.');
    await say(L, '— Você também não está bem.');
    await say(K, '— Estou ótimo.');
    await say(L, '— Mentiroso.');
    await nar('Ele não respondeu. Depois de alguns minutos, Lyra chamou o irmão mais velho.');
    await say(L, '— Thornox. Você sabia que nossa mãe estava viva?');
    await nar('Ele ficou calado.');
    await say(L, '— Sabia?');
    await say(T, '— Suspeitava. Sabia que uma parte dela tinha sobrevivido.');
    await say(L, '— E nunca me procurou?');
    await say(T, '— Procurei. Na Fonte.');
    await say(L, '— Eu estava lá.');
    await say(T, '— Eu sei.');
    await say(L, '— Então por que não me encontrou?');
    await say(T, '— Porque ela não queria ser encontrada.');
    await nar('Lyra falava com Thornox como quem ainda esperava algo dele. Thornox respondia como quem já sabia que não tinha o que dar.');
  };

  // Valdora vista do alto da colina; Seraphyne no topo da torre
  S.colinaValdora = async function () {
    if (F().colina) return;
    const Cn = C();
    await Cn.begin('valdoraColina', 'valdora');
    const ser = Cn.actor('ser', { img: () => X.imgs.e_seraphyne, x: 160, y: 88, z: 2, scale: 0.42, alpha: 0, glow: 'rgba(154,96,255,0.9)', glowA: 0.4 });
    const pai = Cn.actor('pai', { img: () => X.imgs.p_pai, x: 200, y: 82, z: 3, scale: 0.7, alpha: 0, glow: 'rgba(255,208,96,0.9)', glowA: 0.6 });
    await Cn.caption('Do alto da colina, Valdora apareceu, irreconhecível. As muralhas estavam destruídas, as torres queimavam, criaturas percorriam as ruas.');
    await Cn.caption('No centro, um símbolo gigantesco desenhado com sangue: três espinhos.');
    G.Audio.sfx('heart'); G.flash('#dfe8ff', 0.4);
    await Cn.caption('A luz no peito de Kravenox pulsou. Lyra segurou seu braço.');
    await say(L, '— Eles querem você.');
    await say(T, '— Não apenas ele. Olhem.');
    await Cn.caption('No alto da torre central havia outro símbolo: um círculo dividido em três partes, uma para cada irmão.');
    await say(L, '— Eles sabem sobre nós.');
    await say(K, '— Então sabem onde estamos.');
    G.Audio.sfx('bell');
    await Cn.caption('Um sino tocou dentro da cidade, e uma voz ecoou pelas muralhas.');
    await say('???', '— Kravenox.'); await say('???', '— Thornox.'); await say('???', '— Lyra.');
    await Cn.tween(ser, { alpha: 1 }, 50);
    await Cn.caption('A mulher da fortaleza apareceu no topo da torre. Já não usava capuz: vestia uma armadura negra, e longos cabelos prateados caíam sobre seus ombros. Na testa trazia a mesma marca que Kravenox carregara.');
    await say('Mulher de Armadura Negra', '— Finalmente.');
    await say(T, '— Quem é você?');
    await say('Mulher de Armadura Negra', '— Você realmente não se lembra?');
    await say('Mulher de Armadura Negra', '— Ele deveria lembrar.');
    G.Audio.sfx('memory'); await Cn.tween(pai, { alpha: 1 }, 40);
    await Cn.caption('Ela ergueu a mão, e um cristal surgiu com a imagem de um homem.');
    await say(K, '— Nosso pai.');
    await Cn.caption('Lyra ficou imóvel. Thornox baixou os olhos.');
    await say('Mulher de Armadura Negra', '— Agora vocês estão começando a entender.');
    await say(K, '— O que você tem a ver com ele?');
    await say(SE, '— Tudo. Meu nome é Seraphyne.');
    await Cn.tween(pai, { alpha: 0 }, 30);
    await say(K, '— E por que está atacando Valdora?');
    await say(SE, '— Porque Valdora guarda o último segredo do seu pai.');
    await say(T, '— Você não vai tocar nele.');
    await say(SE, '— Não preciso. Ele vai abrir para mim. Seu pai escondeu uma coisa nesta cidade.');
    await say(L, '— O quê?');
    await say(SE, '— A arma que matou o primeiro deus.');
    await Cn.caption('O vento voltou, as nuvens se moveram, e pela primeira vez desde o Abismo Carmesim Kravenox sentiu medo. Não por si mesmo, mas pelo que poderia encontrar.');
    G.Audio.sfx('dark'); G.shake = 10;
    await Cn.caption('Seraphyne abriu os braços, e milhares de Sentinelas surgiram nas muralhas atrás dela.');
    await say(SE, '— Entrem.');
    await Cn.tween(ser, { alpha: 0 }, 40);
    await Cn.caption('Kravenox olhou para Thornox, Thornox para Lyra, e Lyra firmou o cristal. Então Kravenox sorriu.');
    await say(K, '— Vamos.');
    await Cn.end();
    F().colina = 1;
    saved();
  };
  S.refugiado = async function () {
    await say('Homem', '— Vocês realmente vão entrar?');
    await say(K, '— Se quiser sobreviver, não entre.');
    await say('Homem', '— Boa sorte.');
    await say(K, '— Vamos precisar.');
  };
  S.entrarValdora = async function () {
    if (!F().colina) { await S.colinaValdora(); return; }
    if (F().valdoraFim) { await nar('Onde antes existia Valdora, resta apenas uma cratera.'); G.Field.px -= 1; return; }
    await G.fade(1, 20);
    if (!F().valdora) await chapter(15, 'A Cidade das Cinzas');
    G.enterField('valdora', 13, 19, 'up');
    await G.fade(0, 20);
    if (!F().valdora) {
      F().valdora = 1;
      G.Audio.sfx('door'); G.shake = 8;
      await nar('Os portões de Valdora estavam abertos. Nenhum guarda, nenhuma resistência. Apenas fumaça. Os portões se fecharam atrás deles, e o som ecoou pelas ruas vazias.');
      await nar('Valdora parecia abandonada havia séculos, mas não estava. Kravenox sentia olhos acompanhando cada passo — nas janelas quebradas, nos telhados, nas torres, nos becos.');
      await say(T, '— Eles estão nos deixando passar.');
      await say(K, '— Eu sei.');
      await say(T, '— Isso é uma armadilha.');
      await say(K, '— Também sei.');
      await say(L, '— Então por que continuamos?');
      await say(K, '— Porque quero saber qual é a armadilha.');
      saved();
    }
  };

  // ===================== VALDORA =====================
  S.portaoValdora = async function () {
    await nar('Os portões estão fechados. Do outro lado, ninguém responde.');
    G.Field.py -= 1; G.Field.dir = 'up';
  };
  S.casaQueimada = async () => nar(G.pick(['A porta está queimada. Lá dentro, uma mesa posta para quatro pessoas.', 'Marcas de garras na madeira. E, mais embaixo, marcas de mãos pequenas.', 'Uma casa vazia. Um brinquedo de madeira no chão, intacto.']));
  S.fogoValdora = async () => nar(G.pick(['O fogo não é natural. Tem cor de Vazio nas bordas.', 'Brasas. A cidade inteira cheira a cinza.']));
  S.torreCeus = async function () {
    if (F().valdoraFim) return;
    if (F().fuga) await say(SE, '— A Ponte dos Céus começa no alto daquela torre. A plataforma fica na base, do lado norte.');
    else await nar('Uma torre alta, mais antiga que as muralhas. No topo, uma plataforma circular.');
  };
  S.estatuaPai = async function () {
    if (F().pai) { await nar('A estátua do pai, partida. A escadaria abaixo dela desabou na explosão.'); return; }
    if (!F().escadaria) {
      await nar('Na praça central havia uma estátua: um homem segurando uma espada. Kravenox parou.');
      await say(K, '— Nosso pai.');
      await say(T, '— Ele não tinha uma estátua aqui.');
      await say(L, '— Foi colocada há pouco tempo.');
      await nar('Kravenox tocou a espada de pedra, que começou a rachar. Um mecanismo se ativou e a praça inteira tremeu.');
      await say(T, '— Tire a mão.');
      G.Audio.sfx('door'); G.shake = 18;
      await nar('Tarde demais. O chão se abriu e uma escadaria surgiu sob a estátua, descendo para as profundezas.');
      await say(K, '— Parece que encontramos o segredo.');
      F().escadaria = 1;
    }
    const i = await G.choose('A escadaria desce para as profundezas de Valdora. Descer?', ['Descer', 'Ainda não']);
    if (i === 0) {
      await warpDungeon('escadaria');
      if (!F().descida) { F().descida = 1; await nar('Quanto mais desciam, mais quente ficava. As paredes eram muito mais antigas que Valdora, cobertas de símbolos que Kravenox nunca tinha visto.'); }
    }
  };

  // ===================== ESCADARIA SOB VALDORA =====================
  S.portaTresMaos = async function () {
    if (F().portaPai) return;
    await nar('No fim da escadaria havia uma porta com quatro figuras gravadas: uma mulher, um homem e três crianças.');
    await say(K, '— Ele deixou isso aqui.');
    await say(T, '— Não. Essa porta é anterior a ele. Nosso pai encontrou este lugar e escondeu o que encontrou.');
    await nar('Kravenox pousou a mão na porta. Nada. Lyra tentou ao lado. Nada. Thornox também. Os três se entreolharam.');
    await say(K, '— Juntos.');
    for (const c of ['#ffd36a', '#bfe0ff', '#dfe8ff']) { G.Audio.sfx('light'); G.flash(c, 0.4); await G.wait(30); }
    await nar('Quando as três mãos tocaram a pedra, as marcas começaram a brilhar — primeiro a de Thornox, depois a de Lyra, por último a de Kravenox — e a porta se abriu.');
    G.Audio.sfx('door'); G.shake = 12;
    await nar('Um vento quente atravessou o corredor, e algo sussurrou:');
    await say('???', '— Filhos.');
    await nar('Os olhos de Lyra se encheram de lágrimas.');
    await say(L, '— É ele.');
    F().portaPai = 1;
    saved();
  };
  S.salaDoPai = async function () {
    if (F().pai) return;
    if (!F().portaPai) { await nar('Uma parede lisa. Parece que algo do outro lado espera que vocês cheguem pela porta certa.'); return; }
    await S.cenaPai();
    await S.sangueEssencia();
  };
  // Cap. 15: o encontro com o pai — acorrentado, metade carne, metade cristal
  S.cenaPai = async function () {
    const Cn = C();
    await Cn.begin('camaraPai', 'pai');
    const pai = Cn.actor('pai', { img: () => X.imgs.p_pai, x: 160, y: 166, z: 2, scale: 2, alpha: 1, glow: 'rgba(255,200,90,0.9)', glowA: 0.35, bob: 0.6 });
    const tI = Cn.actor('thornox', { img: () => X.sprite('thornox', 'up', 0), x: 110, y: 228, z: 5, scale: 1.25, silhouette: '#ffd36a', glow: 'rgba(255,211,106,0.9)', glowA: 0.35 });
    const kI = Cn.actor('kravenox', { img: () => X.sprite('kravenoxP', 'up', 0), x: 160, y: 230, z: 6, scale: 1.25, silhouette: '#dfe8ff', glow: 'rgba(223,232,255,0.9)', glowA: 0.35 });
    const lI = Cn.actor('lyra', { img: () => X.sprite('lyra', 'up', 0), x: 210, y: 228, z: 5, scale: 1.2, silhouette: '#bfe0ff', glow: 'rgba(160,215,255,0.9)', glowA: 0.35 });
    const R = [[-40, -60, 0, 30, -20], [40, -60, G.W, 40, 20], [-44, -20, 0, 120, -10], [44, -20, G.W, 130, 10], [-30, 0, 10, 200, -20], [30, 0, 310, 200, 20], [-10, -90, 60, 0, -10], [10, -90, 260, 0, 10]];
    Cn.roots = R.map(([ox, oy, ex, ey, bend]) => ({ on: 'pai', ox, oy, ex, ey, bend, w: 2, color: '#5a5048' }));
    await Cn.caption('Do outro lado havia uma sala gigantesca. No centro, sobre uma plataforma, estava um homem — ou o que restava dele.');
    await Cn.caption('Dezenas de correntes prendiam seu corpo, metade carne, metade cristal. Lyra deixou o cristal cair. O homem abriu os olhos dourados.');
    await say(PAI, '— Meus filhos.');
    await say(K, '— Pai?');
    await say(PAI, '— Kravenox.');
    await Cn.caption('O nome atravessou a sala, e Kravenox não conseguiu respirar. Durante séculos imaginara aquele rosto e acreditara que aquele homem estava morto.', 70);
    await Cn.caption('Agora o tinha diante de si — e algo estava muito errado.');
    await say(K, '— Você está vivo.');
    await say(PAI, '— Não. Sou uma lembrança.');
    await say(T, '— O que aconteceu?');
    await say(PAI, '— Eu descobri o que existia abaixo da Fonte.');
    await say(T, '— O Vazio?');
    await say(PAI, '— Não. Algo mais antigo. O Primeiro.');
    await say(K, '— Primeiro o quê?');
    await say(PAI, '— Primeiro ser.');
    await say(T, '— A criatura que criou a Essência?');
    await say(PAI, '— Não. A Essência criou a criatura.');
    await say(T, '— Então quem criou a Essência?');
    await say(PAI, '— Ninguém. Ela sempre existiu.');
    await Cn.tween(lI, { y: 222 }, 20);
    await Cn.caption('Lyra recolheu o cristal.', 30);
    await say(L, '— Então o que é o Primeiro?');
    await say(PAI, '— O primeiro pensamento da Essência.');
    await say(K, '— Nossa mãe.');
    await say(PAI, '— Sua mãe foi apenas a primeira pessoa a receber uma parte dele.');
    await say(T, '— E o que aconteceu com o resto?');
    await say(PAI, '— Foi separado. Por mim. Eu tentei impedir que ele despertasse por completo.');
    await Cn.caption('A raiva cresceu em Kravenox.', 30);
    kI.shake = 1;
    await say(K, '— Você sabia de tudo. E deixou que nós três crescêssemos acreditando que éramos irmãos comuns.');
    await say(PAI, '— Eu tentei dar uma vida normal a vocês.');
    await say(K, '— E falhou.');
    pai.bob = 0;
    await Cn.caption('O homem baixou a cabeça.', 30);
    await say(PAI, '— Sim.');
    kI.shake = 0;
    await say(L, '— Por que nos levou até a Fonte?');
    await say(PAI, '— Porque ela chamou vocês. E eu sabia que isso aconteceria.');
    await Cn.caption('Os dedos de Thornox se fecharam no cajado.', 30);
    await say(T, '— Então você causou o Cisma.');
    await say(PAI, '— Não. Eu tentei impedir.');
    await say(T, '— Você estava lá!');
    pai.shake = 2; G.shake = 6;
    await say(PAI, '— Sim. E foi exatamente por isso que perdi vocês.');
    pai.shake = 0;
    G.Audio.sfx('dark');
    for (const r of Cn.roots) r.color = '#8a7a6a';
    pai.shake = 1.5;
    await Cn.caption('As correntes começaram a tremer.');
    await say(PAI, '— Ela sabe que vocês estão aqui.');
    await say(K, '— Quem?');
    await say(PAI, '— Seraphyne.');
    await say(K, '— Quem é ela?');
    await Cn.caption('O homem hesitou.', 30);
    await say(PAI, '— Minha filha.');
    await Cn.caption('Ninguém se mexeu.', 40);
    await say(K, '— Nossa irmã?');
    await say(PAI, '— Não. Seraphyne é filha da Fonte.');
    // as luzes se apagam; ela está na entrada
    G.Audio.sfx('dark'); await Cn.tween(Cn, { white: 0 }, 1);
    Cn.whiteColor = '#000000'; Cn.holdWhite = true; await Cn.tween(Cn, { white: 0.75 }, 20);
    const ser = Cn.actor('ser', { img: () => X.imgs.e_seraphyne, x: 268, y: 196, z: 4, scale: 1, alpha: 0, glow: 'rgba(154,96,255,0.9)', glowA: 0.5 });
    await say(SE, '— Finalmente alguém contou a verdade.');
    Cn.holdWhite = false; await Cn.tween(ser, { alpha: 1 }, 30);
    await Cn.caption('Seraphyne estava parada na entrada. Sozinha, sem Sentinelas, sem armas. Apenas sorrindo.');
    await say(SE, '— Pai.');
    await say(PAI, '— Seraphyne.');
    await Cn.tween(ser, { x: 220, y: 200 }, 60);
    await say(SE, '— Você mentiu para eles por tempo demais.');
    await Cn.tween(kI, { x: 180 }, 20);
    await Cn.caption('Kravenox se colocou entre ela e os irmãos.', 30);
    await say(K, '— Você é filha da Fonte?');
    await say(SE, '— Sou aquilo que nasceu quando sua mãe tentou criar uma sucessora.');
    await say(L, '— Por que atacar o Reino?');
    await say(SE, '— Porque ele nunca foi nosso.');
    await say(T, '— Então o que você quer?');
    await say(SE, '— O que ele roubou.');
    await say(K, '— O que você roubou?');
    await Cn.caption('O homem não respondeu. Seraphyne estendeu a mão e o chão começou a rachar.', 40);
    G.shake = 8; G.Audio.sfx('crack');
    await say(SE, '— A última parte da Essência. E ela está dentro de você.');
    G.Audio.sfx('heart'); G.flash('#dfe8ff', 0.5); kI.glowA = 0.9;
    await Cn.caption('A luz no peito de Kravenox reagiu. Thornox e Lyra o encararam.');
    await say(SE, '— É por isso que você sobreviveu ao Abismo. É por isso que a Fonte o reconheceu. É por isso que você é diferente.');
    await say(K, '— O que existe dentro de mim?');
    await say(SE, '— A única coisa capaz de matar a Fonte.');
    await say(PAI, '— Não escute.');
    await say(SE, '— Você não precisa acreditar em mim. Pergunte a ele.');
    await say(K, '— É verdade?');
    await Cn.caption('Silêncio.', 40);
    await say(K, '— É verdade?');
    await say(PAI, '— Sim.');
    await Cn.caption('O mundo desabou para Kravenox.', 50);
    await say(SE, '— Agora você entende.');
    G.Audio.sfx('light'); kI.glow = 'rgba(230,240,255,1)';
    await say(K, '— Não. Agora eu entendo que todos vocês estavam mentindo.');
    await say(SE, '— E é por isso que você é o único que pode escolher.');
    // as correntes se rompem
    const brk = (i) => { const rt = Cn.roots[i]; G.Audio.sfx('hit'); G.shake = 6; Cn.burst(160 + rt.ox, 166 + rt.oy, 14, '#c8b8a0', { speed: 2.5, life: 35, grav: 0.05 }); Cn.tween(rt, { broken: 1 }, 30); };
    for (let i = 0; i < 4; i++) { brk(i); await Cn.wait(12); }
    await say(PAI, '— CORRAM!');
    for (let i = 4; i < 8; i++) brk(i);
    G.Audio.sfx('boom'); G.shake = 30; Cn.whiteColor = '#ffffff'; Cn.holdWhite = true; await Cn.tween(Cn, { white: 1.2 }, 14);
    Cn.cap = { text: 'A sala explodiu.', t: 0 }; await Cn.wait(80);
    Cn.holdWhite = false; G.fadeColor = '#000'; G.fadeA = 1;
    await Cn.end();
    F().pai = 1;
  };
  // Cap. 16: o sangue da Essência, os olhos prateados e o olho no céu
  S.sangueEssencia = async function () {
    await chapter(16, 'O Sangue da Essência');
    await G.fade(0, 30);
    await nar('A explosão arremessou os três irmãos contra as paredes. Kravenox atravessou uma coluna de pedra e caiu entre os destroços. Por alguns segundos não ouviu nada. Depois, a voz de Lyra.');
    await say(L, '— Kravenox!');
    await nar('Thornox, de joelhos, segurava o braço ferido; Lyra continuava de pé. E, no centro da destruição, Seraphyne caminhava sem pressa, sem ferimento algum.');
    await say(SE, '— Agora você sabe.');
    await say(K, '— Sei que você mente.');
    await say(SE, '— Então pergunte.');
    await say(K, '— O que existe dentro de mim?');
    await say(SE, '— O sangue da Essência. Seu irmão recebeu a luz. Sua irmã recebeu a memória. Você recebeu o núcleo.');
    await say(T, '— Nosso pai nunca teria feito isso.');
    await say(SE, '— Seu pai não teve escolha.');
    await say(K, '— Pai! É verdade?');
    await say(PAI, '— Sim. Eu tentei esconder o núcleo. Você era o único capaz de suportá-lo.');
    await say(K, '— E quando eu morresse?');
    await say(PAI, '— O núcleo morreria com você.');
    await nar('Kravenox riu, sem nenhum humor.');
    await say(K, '— Então esse era o plano.');
    await say(T, '— Kravenox...');
    await say(K, '— Não. Não diga que está tudo bem. Porque não está.');
    G.Audio.sfx('silver'); G.flash('#dfe8ff', 0.8); G.shake = 12;
    await nar('A energia prateada explodiu e as pedras começaram a flutuar. Os olhos de Kravenox perderam o vermelho de sempre e se tornaram prateados.');
    await say(SE, '— Finalmente. Está despertando.');
    await say(K, '— Eu consigo ouvir. Tudo.');
    await nar('Ouvia o coração de Lyra, o metal das correntes, a respiração de Thornox, as raízes sob o chão.');
    await say(K, '— Eu consigo sentir o Reino. Está com medo. Você também sente.');
    await say(SE, '— Não.');
    await say(K, '— Sente.');
    await nar('A energia prateada avançou pelo chão. As raízes negras recuaram, as pedras começaram a se reconstruir, até as chamas diminuíram.');
    await say(SE, '— Você não deveria conseguir fazer isso.');
    await say(K, '— Talvez eu não devesse existir.');
    G.Audio.sfx('dark');
    await nar('Ela ergueu a mão, e um exército de sombras atravessou as paredes: dezenas, depois centenas de Sentinelas.');
    await say(T, '— Agora!');
    await G.battle(['sentinelaV', 'sentinelaG', 'sentinelaV'], { bg: 'escadaria', noEscape: true, intro: 'Centenas de Sentinelas atravessam as paredes!', events: [{
      when: b => b.enemies.filter(e => e.alive).length <= 1 || b.round >= 5,
      run: async () => {
        await say(T, '— Você está ficando melhor!');
        await say(K, '— Eu sei.');
        await say(T, '— Convencido.');
        await say(K, '— Sempre fui.');
        await nar('Lyra riu. Por alguns segundos, os três lutaram como uma única criatura, como faziam quando crianças. Seraphyne ergueu a mão e os Sentinelas pararam.');
        return 'end';
      } }] });
    await learn(T, 'onda');
    await say(SE, '— Vocês ainda não entenderam. A guerra não é contra vocês.');
    await say(T, '— Então contra quem?');
    await say(SE, '— Contra aquilo que está vindo.');
    await S.olhoNoCeu();
  };
  S.olhoNoCeu = async function () {
    const Cn = C();
    G.Audio.sfx('boom'); G.shake = 30;
    await Cn.begin('olhoCeu', 'primeiro');
    Cn.eyeOpen = 0.05;
    await Cn.caption('O teto explodiu. Uma sombra gigantesca passou sobre a fortaleza, e algo caiu do céu — não uma criatura, mas um pedaço de montanha.');
    await Cn.caption('No céu havia uma abertura, e dentro dela, um olho imenso e dourado.');
    await Cn.tween(Cn, { eyeOpen: 0.4 }, 50);
    await say(L, '— Não.');
    await say(T, '— O Primeiro.');
    await say(K, '— Achei que ele estava dentro da Fonte.');
    await say(SE, '— Não. A Fonte estava dentro dele.');
    G.Audio.sfx('heart');
    await Cn.tween(Cn, { eyeOpen: 1 }, 70);
    await Cn.caption('O olho se abriu por inteiro, e uma voz atravessou o mundo.');
    G.shake = 16;
    await say(PR, '— Filhos. Eu estou acordado.');
    await Cn.caption('Todos os ossos de Kravenox tremeram. As muralhas de Valdora começaram a desmoronar. Até Seraphyne parecia assustada.');
    await say(K, '— Você sabia que ele estava acordando.');
    await say(SE, '— Eu sabia que ele estava procurando por vocês. Porque o núcleo dentro de você é a única coisa que ele não possui.');
    await say(K, '— Então você não quer me matar. Quer me entregar.');
    await say(SE, '— Sim.');
    await say(K, '— E se eu não for?');
    await say(SE, '— Ele virá até você.');
    await say(K, '— Então que venha.');
    await say(T, '— Nós enfrentaremos juntos.');
    await say(L, '— Juntos.');
    await Cn.caption('Dessa vez não havia dúvida: ele não estava sozinho.');
    G.shake = 12;
    await say(PR, '— Kravenox.');
    await say(K, '— Estou aqui.');
    await say(PR, '— Entregue-me o Núcleo.');
    await say(K, '— Venha pegar.');
    await Cn.tween(Cn, { eyeOpen: 0 }, 40);
    await Cn.caption('O olho desapareceu. Então, no horizonte, uma montanha inteira começou a se mover. Não era uma montanha: era uma criatura cujo corpo cobria o céu.');
    await say(T, '— Temos um problema.');
    G.Audio.sfx('silver'); G.flash('#dfe8ff', 0.8);
    await say(K, '— Não. Temos uma guerra.');
    await Cn.caption('O Primeiro havia acordado. E estava vindo atrás de seu filho.', 70);
    G.fadeA = 1;
    await Cn.end();
    await S.gigante();
  };

  // Cap. 17: a chuva de cristais e a cúpula prateada
  S.gigante = async function () {
    await chapter(17, 'O Gigante do Vazio');
    G.enterField('valdora', 17, 7, 'up');
    await G.fade(0, 30);
    await nar('A primeira coisa que desapareceu foi o horizonte. A criatura havia se erguido além das montanhas, e seu corpo era tão imenso que parecia parte do próprio céu.');
    await say(L, '— Isso não é um ser.');
    await say(T, '— O que é, então?');
    await say(L, '— Uma vontade.');
    await say(K, '— Você não esperava isso. Sabia que ele estava acordando, mas não sabia quando.');
    await say(SE, '— Não.');
    await say(K, '— Você também está com medo.');
    await say(SE, '— Eu nunca disse que não estava.');
    await say(T, '— Então pare de lutar contra nós.');
    await say(SE, '— Você ainda acha que pode escolher seus inimigos?');
    await say(PR, '— Kravenox.');
    await say(L, '— Não responda. Ele quer saber onde você está.');
    await say(K, '— Ele já sabe.');
    G.shake = 10; G.Audio.sfx('dark');
    await nar('O gigante ergueu um braço, e milhares de cristais negros surgiram sobre Valdora.');
    await say(T, '— TODOS PARA DENTRO!');
    await G.battle(['cristalVazio', 'cristalVazio', 'cristalVazio'], { bg: 'valdora', noEscape: true, noRewards: false, intro: 'A chuva começa. Não é água: são fragmentos de Vazio!', events: [{
      when: b => b.round >= 3 || b.enemies.filter(e => e.alive).length === 0,
      run: async () => { await nar('São muitos. Para cada cristal destruído, cem caem do céu.'); return 'end'; } }] });
    const Cn = C();
    await Cn.begin('cupula', 'chefe');
    Cn.dome = 0;
    await Cn.caption('Cada cristal que tocava o solo apagava a vida ao redor — árvores viravam cinzas, pedras se desfaziam, pessoas corriam desesperadas.');
    G.Audio.sfx('silver'); G.flash('#ffffff', 0.7);
    await Cn.tween(Cn, { dome: 0.75 }, 50);
    await Cn.caption('Kravenox abriu os braços, e a quarta Essência explodiu ao seu redor, erguendo uma cúpula prateada sobre a cidade. Um, dez, cem, mil. Ele gritou. A pressão era absurda.');
    await say(T, '— Eu ajudo.');
    await say(K, '— Não!');
    await say(T, '— Você não consegue sozinho.');
    await say(L, '— Nenhum de nós consegue.');
    G.Audio.sfx('light'); Cn.domeColor = '#ffe8a0'; await Cn.wait(30);
    G.Audio.sfx('memory'); Cn.domeColor = '#e8f0ff';
    await Cn.tween(Cn, { dome: 1.15 }, 60);
    await Cn.caption('A luz dourada de Thornox entrou na barreira, e a memória de Lyra veio logo depois. As três forças se uniram, a cúpula cresceu até cobrir Valdora inteira.');
    await say(K, '— Quanto tempo?');
    await say(T, '— Não muito.');
    await say(L, '— Ele não está vindo até nós. Ele está indo para a Fonte.');
    await say(T, '— Se ele chegar até ela...');
    await say(L, '— O Reino acaba.');
    await say(K, '— Você sabia disso. Então por que queria o núcleo?');
    await say(SE, '— Porque só o núcleo pode abrir o caminho até ele.');
    await say(K, '— Você queria me usar para chegar ao Primeiro. E depois?');
    await say(SE, '— Eu pretendia destruí-lo. Com vocês.');
    await say(T, '— Por que deveríamos confiar em você?');
    await say(SE, '— Não deveriam. Mas não têm tempo para desconfiar.');
    G.Audio.sfx('crack'); G.shake = 10;
    await Cn.caption('Um estrondo atravessou o Reino, e a barreira prateada começou a rachar.');
    await say(SE, '— Existe uma passagem. Debaixo de Valdora. A última. Para o coração do Reino.');
    await say(K, '— A Fonte.');
    await say(SE, '— Não. O lugar onde a Fonte nasceu. A entrada fica sob o antigo salão, a oeste da praça.');
    await Cn.end();
    await learn(K, 'cupula');
    F().cupula = 1;
    await nar('A porta do antigo salão, a sudoeste da praça, brilha com uma luz dourada.');
    saved();
  };
  S.entrarPassagem = async function () {
    if (!F().cupula) return;
    if (F().coracao) { await nar('A passagem desabou. Não há caminho de volta.'); G.Field.py += 1; return; }
    if (!F().desceuPassagem) {
      F().desceuPassagem = 1;
      await nar('Eles desceram. Kravenox ia à frente, porque ninguém mais quis ir. Thornox mantinha o cajado baixo, mas nunca guardado. Lyra caminhava no meio, de olho nos dois.');
      await nar('Seraphyne fechava o grupo, sempre a três passos. Nenhum deles confiava nos outros. Mas o Reino estava morrendo.');
    }
    await warpDungeon('passagem');
  };
  // ===================== A ÚLTIMA PASSAGEM (caps. 17–19) =====================
  S.simbolosAntigos = async function () {
    if (F().simbolos) return; F().simbolos = 1;
    await nar('A passagem era estreita e as paredes estavam cobertas de símbolos. Lyra parou diante de um deles.');
    await say(L, '— Esperem. Este lugar é antigo. Mais antigo que a Fonte.');
    await say(T, '— O que está escrito?');
    await say(L, '— Antes da Essência havia o silêncio.');
    await say(SE, '— E antes do silêncio havia aquele que observava.');
    await say(K, '— O Primeiro.');
    await say(SE, '— Não. Algo anterior a ele.');
    await say(L, '— O vazio. Não o Vazio que conhecemos. O verdadeiro vazio, que existia antes de qualquer coisa. Que não queria destruir. Que simplesmente esperava.');
    G.Audio.sfx('dark');
    await nar('Do fundo do corredor veio um som baixo, como uma respiração. Todos congelaram. Outra respiração, mais próxima.');
    await say(SE, '— Isso não deveria estar aqui. Este é o lugar onde o Primeiro nasceu.');
  };
  S.criaturaOlhos = async function () {
    if (F().criatura) return; F().criatura = 1;
    await nar('Uma sombra apareceu no fim do corredor. Não tinha rosto nem corpo definido; era só uma silhueta com dois olhos brancos no escuro.');
    await say(K, '— Quem é você?');
    await say('A Criatura', '— Finalmente encontrei você.');
    await say(K, '— Quem?');
    await say('A Criatura', '— O último pedaço.');
    G.Audio.sfx('dark'); G.flash('#000000', 1);
    await nar('E apagou todas as luzes.');
  };
  S.confrontoSeraphyne = async function () {
    if (F().seraJunta) return;
    if (!F().criatura) return;
    await chapter(18, 'O que Existia Antes', ['A escuridão tomou o corredor. Kravenox não enxergava os próprios dedos.\nEntão uma mão tocou seu ombro.']);
    await say(T, '— Kravenox.');
    await say(K, '— Estou aqui.');
    await say(L, '— Eu também.');
    await say(K, '— Seraphyne!');
    await say('A Criatura', '— Ela não pode ajudá-los. Você carrega o último fragmento.');
    await say(K, '— Fragmento de quê?');
    await say('A Criatura', '— Do princípio.');
    G.Audio.sfx('light');
    await nar('Thornox ergueu o cajado e uma pequena chama dourada se acendeu. A criatura recuou. Pela primeira vez, puderam ver seu corpo: uma armadura de ossos negros, oca por dentro, com um buraco no centro do peito.');
    if (X.imgs.e_ossoNegro) await G.showImage(X.imgs.e_ossoNegro, 'O que restou quando o Primeiro tentou criar um mundo.');
    await say('A Criatura', '— Eu sou o que restou quando o Primeiro tentou criar um mundo. E criou vocês.');
    await say(L, '— Isso não é verdade.');
    await say('A Criatura', '— Sua mãe contou o que conseguia lembrar.');
    await vision(['Um vazio absoluto e, nele, uma pequena luz. A primeira luz. A Essência.', 'Então uma segunda presença apareceu, escura e sem forma. A luz tentou afastá-la, mas a escuridão permaneceu.', 'O Primeiro surgiu, gigantesco, observando o vazio. Depois começou a criar: estrelas, vida e, por fim, o Reino.', 'E três crianças.\nKravenox, Thornox, Lyra.'], 'antigo');
    await say('A Criatura', '— Vocês foram criados como recipientes para carregar três partes do Primeiro.');
    await say(K, '— A luz. A memória. E o núcleo. Nós fomos criados para dividir o Primeiro.');
    await say('A Criatura', '— E funcionou.');
    await say(K, '— Então nosso pai...');
    await say('A Criatura', '— Era um guardião.');
    await say(K, '— E nossa mãe?');
    await say('A Criatura', '— A primeira hospedeira.');
    await say(L, '— E Seraphyne?');
    await say('A Criatura', '— O erro.');
    await say(SE, '— Eu ouvi isso.');
    await nar('Seraphyne surgiu da escuridão, ferida, com sangue escorrendo pela testa.');
    await say(SE, '— Eu fui criada para substituir vocês. Quando o Primeiro percebeu que os três não seriam suficientes, criou outra possibilidade. Eu deveria absorver os três fragmentos.');
    await say(T, '— E por que não fez isso?');
    await say(SE, '— Porque comecei a gostar de vocês. Passei séculos procurando uma maneira de quebrar o destino que me deram.');
    await say('A Criatura', '— Mentira. Você nunca procurou uma saída. Procurou uma forma de tomar o lugar deles.');
    await say(K, '— É verdade?');
    await nar('Seraphyne não respondeu. Foi o bastante. Thornox atacou.');
    await G.battle(['seraphyne'], { bg: 'passagem', music: 'seraphyne', noEscape: true, noRewards: true, intro: 'Luz contra sombra. Seraphyne conhece cada movimento!', events: [
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.7, run: async () => {
        await say(K, '— Vocês já lutaram antes.');
        await say(SE, '— Muitas vezes. Você ainda luta como naquela época, Thornox.');
        await say(T, '— E você ainda foge.');
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.4, run: async () => {
        await say(K, '— Chega.');
        G.Audio.sfx('silver'); G.flash('#dfe8ff', 0.9); G.shake = 16;
        await nar('Seraphyne atacou, e Kravenox segurou o golpe com uma mão. A energia prateada explodiu e a arremessou para trás.');
        await say(SE, '— Você está despertando rápido demais.');
        await say(K, '— Eu não sou uma arma.');
        await say(SE, '— Ainda não.');
        await say(K, '— Nunca.');
        return 'end'; } }] });
    await vision(['A energia prateada envolveu Seraphyne — mas, em vez de destruí-la, atravessou seu corpo.', 'Kravenox viu algo dentro dela: uma pequena luz, uma memória.\nUma criança.', 'Seraphyne, sozinha, esperando.']);
    await say(K, '— Você também foi usada.');
    await say(SE, '— Não tenha pena de mim.');
    await say(K, '— Não tenho. Mas não quero ser seu inimigo.');
    await nar('Kravenox estendeu a mão. Seraphyne olhou para ela por muito tempo. Então a segurou.');
    D.addHero('seraphyne'); F().seraJunta = 1;
    G.Audio.sfx('level');
    await nar('Seraphyne se junta ao grupo!');
    await say('A Criatura', '— Interessante.');
    await say(K, '— Você queria que brigássemos.');
    await say('A Criatura', '— Sim. Porque, enquanto vocês lutam, o Primeiro cresce. Está se alimentando do medo dele. Você tem medo de se tornar aquilo que todos dizem que você é. Monstro. Destruidor. Herdeiro do Vazio.');
    G.Audio.sfx('dark'); G.flash('#200010', 0.6);
    await nar('A cada palavra, a energia negra voltava a surgir em torno de Kravenox.');
    await say(T, '— Kravenox.');
    await say(K, '— Estou bem.');
    await say(T, '— Não está.');
    await nar('Kravenox fechou os olhos e respirou. A energia negra se dissipou. Quando os abriu, estavam prateados de novo.');
    await say(K, '— Então ele vai ficar esperando. Eu decidir quem sou.');
    await say('A Criatura', '— Quando descobrir, eu estarei esperando.');
    await nar('A criatura desapareceu. Mais adiante, as pedras que fechavam o corredor se afastaram sozinhas.');
    await say(T, '— Ela nos deixou passar.');
    await say(K, '— Porque quer que cheguemos ao fim.');
    await say(SE, '— E o fim está próximo.');
    F().passagemAberta = 1; G.Audio.sfx('door');
    D.healAll();
    saved();
  };
  S.portaDoCoracao = async function () {
    if (F().portaCoracao) return; F().portaCoracao = 1;
    await nar('No final do corredor havia uma porta, muito maior que a anterior, com uma única inscrição:');
    await nar('QUANDO OS TRÊS SE UNIREM, O PRIMEIRO DESPERTARÁ.');
    G.Audio.sfx('door'); G.shake = 8;
    await nar('Kravenox a tocou, e ela se abriu na hora. Do outro lado havia uma câmara enorme. No centro, suspenso no vazio, um coração gigantesco pulsava devagar.');
    await say(L, '— O coração do Primeiro.');
    G.Audio.sfx('heart');
    await say('???', '— Filho. Você está aqui. Venha.');
    await nar('Pela primeira vez, Kravenox percebeu que aquela voz não queria matá-lo. Estava chamando por ele, como um pai que chama o filho de volta para casa.');
  };
  S.coracaoPrimeiro = async function () {
    if (F().coracao) return;
    if (!F().portaCoracao) return;
    await chapter(19, 'O Coração do Primeiro');
    const Cn = C();
    await Cn.begin('coracao', 'primeiro');
    Cn.actor('heart', { img: () => X.imgs.e_coracao, x: 160, y: 150, z: 2, scale: 1.1, glow: 'rgba(200,30,60,0.9)', glowA: 0.3, bob: 1 });
    await Cn.caption('O coração pulsava no centro da câmara. Era enorme, feito de cristal, raízes e uma matéria escura que parecia engolir a luz ao redor.');
    await say(T, '— Não toque.');
    await say(K, '— Você sabia que ele estava aqui?');
    await say(SE, '— Sabia. Se contasse, você viria até aqui.');
    await say(K, '— Então por que me trouxe?');
    await say(SE, '— Porque agora não posso mais impedir.');
    await say('???', '— Kravenox. Volte.');
    await Cn.end();
    await vision(['Uma casa numa floresta. Três crianças brincando.', 'Uma mulher observando de longe. Um homem sentado perto de uma fogueira.', 'Kravenox tropeçava, Thornox ria, Lyra o ajudava a levantar.', '— Um dia vocês vão precisar escolher.']);
    await say(K, '— Eu não lembrava disso.');
    await say(T, '— Nem eu.');
    await say(L, '— Você lembra?');
    await say(K, '— Você estava lá.');
    await say(SE, '— Sim. Conheci vocês antes do Cisma. Seu pai apagou as memórias. Para proteger vocês.');
    await say(K, '— Essa frase está ficando velha.');
    await nar('O coração começou a se abrir. No centro surgiu uma pequena esfera prateada, que flutuou devagar na direção de Kravenox. Thornox segurou seu braço.');
    await say(T, '— E se for uma armadilha?');
    await say(K, '— Então descobriremos juntos.');
    // a imensidão branca: o homem que Kravenox poderia ser
    G.flash('#ffffff', 1);
    await Cn.begin('branco', 'memoria');
    const fut = Cn.actor('fut', { img: () => X.imgs.e_kfuturo, x: 196, y: 176, z: 2, scale: 1.3, alpha: 0 });
    const kI = Cn.actor('k', { img: () => X.sprite('kravenoxP', 'right', 0), x: 110, y: 178, z: 3, scale: 1.4 });
    await Cn.caption('Ele estava sozinho numa imensidão branca, sem chão e sem céu.');
    await say(K, '— Thornox? Lyra?');
    await Cn.tween(fut, { alpha: 1 }, 50);
    await Cn.caption('Caminhou até encontrar um homem de costas. Ele se virou. Era o próprio Kravenox — muito mais velho, muito mais ferido, vestindo uma armadura que ele nunca tinha visto.');
    await say(KF, '— Você chegou. Você escolheu o caminho errado. O poder.');
    await say(K, '— Eu nunca escolhi isso.');
    await say(KF, '— Ainda. Faria, quando percebesse que todos que você ama vão morrer.');
    await say(K, '— Existe outra possibilidade.');
    await say(KF, '— Existe. Perder. Às vezes, salvar o mundo significa aceitar que você não pode salvar todos.');
    await say(K, '— Então você perdeu. E agora está tentando me impedir?');
    await say(KF, '— Não. Estou tentando garantir que você escolha diferente. Quando chegar o momento... não escolha pelo medo.');
    await Cn.tween(fut, { alpha: 0 }, 60);
    await say(KF, '— Escolha pelo que você quer construir.');
    void kI;
    await Cn.end();
    await say(L, '— Kravenox! Você ficou imóvel.');
    await say(K, '— Eu vi alguma coisa. Eu. Uma versão de mim. Ele disse que o maior inimigo que vamos enfrentar não é o Primeiro. Somos nós mesmos.');
    G.Audio.sfx('heart'); G.shake = 10;
    await say(L, '— Ele está acordando.');
    await nar('Uma pressão esmagou o peito de Kravenox. Uma linha prateada ligava seu peito ao coração.');
    D.healAll();
    await G.battle(['coracao'], { bg: 'passagem', music: 'chefe', noEscape: true, intro: 'O Coração do Primeiro puxa o núcleo!', events: [
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.6, run: async () => {
        await say(SE, '— Vocês não entendem! O núcleo não está só dentro dele. Está conectado!');
        await nar('Thornox tentou cortar a linha prateada e foi arremessado. O cristal de Lyra rachou.');
        await say(L, '— Não consigo!');
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.3, run: async () => {
        G.Audio.sfx('heart'); G.shake = 8; await nar('Uma vez. Duas vezes, e Kravenox começou a flutuar. Três vezes, e seu corpo foi puxado em direção ao coração.');
        await say(SE, '— Está começando. A fusão.');
        await say(PR, '— Você é meu.');
        G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 30;
        await say(K, '— NÃO. EU SOU MEU.');
        return 'end'; } }] });
    await nar('A conexão se rompeu, o coração rachou, e uma onda de energia jogou todos ao chão. Quando o silêncio voltou, Kravenox estava de pé. No centro de seu peito havia uma nova marca: quatro espinhos.');
    await say(L, '— O que é isso?');
    await say(K, '— Uma escolha.');
    await say(T, '— E o que você escolheu?');
    await say(K, '— Não ser parte dele.');
    await say(SE, '— Você acabou de fazer algo que ninguém conseguiu em milhares de anos. Separou o Primeiro de sua própria Essência.');
    await learn(K, 'quatro');
    F().coracao = 1;
    await S.quedaPassagem();
  };

  // ===================== A QUEDA DE VALDORA (cap. 20) =====================
  S.quedaPassagem = async function () {
    G.Audio.sfx('boom'); G.shake = 24;
    await say(T, '— Temos que sair.');
    await say(L, '— A passagem está fechando.');
    await say(K, '— Você vem.');
    await say(SE, '— Por quê?');
    await say(K, '— Porque conhece o caminho.');
    await G.fade(1, 20);
    await chapter(20, 'A Queda de Valdora', ['A passagem começou a desmoronar antes que alcançassem a saída.\n— MAIS RÁPIDO! — gritou Thornox.', 'A saída surgiu: uma luz vermelha, o ar frio do lado de fora. Seraphyne saiu por último no instante em que a passagem desabou.']);
    G.enterField('valdora', 10, 11, 'down');
    await G.fade(0, 30);
    await nar('Valdora estava em chamas, e o céu havia mudado. O gigante estava muito mais perto — seu corpo ocupava metade do horizonte, cercado por nuvens negras que giravam como um furacão.');
    await say(L, '— Quanto tempo temos?');
    await say(SE, '— Menos de uma hora.');
    await say(K, '— Então vamos. Para a Fonte.');
    await say(SE, '— Não podemos chegar lá a pé. Existe uma antiga passagem aérea.');
    await say(T, '— A Ponte dos Céus? Ela foi destruída.');
    await say(SE, '— Não completamente. Começa no alto da torre ao norte.');
    await nar('Atravessando as ruas em caos, Kravenox viu crianças escondidas num beco a oeste. E parou.');
    F().fuga = 1;
    saved();
  };
  S.becoCriancas = async function () {
    if (!F().fuga || F().criancas) return;
    await say(T, '— Kravenox.');
    await say(K, '— Continuem.');
    await say(T, '— Você vai voltar?');
    await say(K, '— Vou.');
    await say(L, '— Não faça promessas que talvez não possa cumprir.');
    await say(K, '— Essa eu pretendo cumprir.');
    await nar('Ele entrou no beco sozinho. Duas sombras rondavam a carroça onde as crianças se escondiam.');
    alone();
    await G.battle(['sombraRua', 'sombraRua'], { bg: 'valdora', noEscape: true, intro: 'Kravenox enfrenta as sombras sozinho!' });
    await nar('Eram quatro crianças. Um garoto segurava uma pequena espada de madeira.');
    await say('Garoto', '— Você é um Sentinela?');
    await say(K, '— Não.');
    await say('Garoto', '— Então quem é você?');
    await say(K, '— Ainda estou descobrindo.');
    await say('Garoto', '— Você parece um monstro.');
    await nar('A frase atingiu algo dentro de Kravenox. Ele se ajoelhou.');
    await say(K, '— Talvez eu pareça. Mas monstros também podem salvar pessoas.');
    await nar('O garoto hesitou, e então segurou a mão dele. Kravenox levou as crianças para fora do beco até um grupo de sobreviventes.');
    await say(K, '— Levem eles para longe daqui. Pela estrada do leste.');
    await say('Mulher', '— Quem é você?');
    await say(K, '— Alguém que chegou tarde demais.');
    together();
    F().criancas = 1;
    await nar('A torre ao norte espera.');
    saved();
  };
  S.torrePonte = async function () {
    if (!F().fuga) return;
    if (!F().criancas) { await say(L, '— As crianças, Kravenox. No beco a oeste. Você prometeu.'); return; }
    if (F().valdoraFim) return;
    await say(T, '— Você voltou.');
    await say(K, '— Eu disse que voltaria.');
    await nar('No alto da torre havia uma plataforma circular e, no centro, um cristal destruído.');
    await say(SE, '— A ponte precisa de energia. Mais do que temos. A ponte não aceita Essência. Aceita Vazio.');
    await say(K, '— Finalmente alguma coisa que eu tenho de sobra.');
    G.Audio.sfx('dark'); G.flash('#200018', 0.7);
    await nar('Pousou a mão no cristal e deixou a energia negra escorrer. As runas da plataforma se acenderam, e uma ponte surgiu no céu — pedra escura e luz prateada atravessando as nuvens.');
    await say(L, '— Funciona.');
    await say(SE, '— Por enquanto.');
    const Cn = C();
    await Cn.begin('esfera', 'primeiro');
    Cn.sphereR = 0;
    await Cn.caption('Um rugido atravessou o Reino. O gigante havia parado, e seu rosto enorme estava voltado para Valdora.');
    await say(PR, '— Filho.');
    await Cn.caption('Não sou seu, respondeu ele em pensamento.');
    G.Audio.sfx('dark'); G.shake = 12;
    await Cn.tween(Cn, { sphereR: 34 }, 80);
    await Cn.caption('O gigante ergueu a mão, o céu se abriu, e uma esfera negra surgiu sobre a cidade.');
    await say(T, '— Isso vai destruir tudo.');
    await say(K, '— Não. Vou impedir.');
    await say(T, '— Sozinho?');
    await say(K, '— Não.');
    await say(L, '— Eu sabia.');
    await say(SE, '— Vocês são completamente insanos.');
    await say(T, '— Sim.');
    const sx = [70, 130, 190, 250];
    Cn.beams = [['#dfe8ff', 'silver'], ['#ffd36a', 'light'], ['#9fd8ff', 'memory'], ['#b26bff', 'dark']].map(([c], i) => ({ x1: sx[i], y1: 200, x2: 160, y2: 64, color: c, a: 0, len: 0, w: 3, ph: i * 2 }));
    await Cn.caption('Kravenox abriu os braços, e a quarta Essência despertou. Thornox ergueu o cajado, Lyra o cristal, Seraphyne as mãos.');
    for (const [i, sfx] of [[1, 'light'], [2, 'memory'], [3, 'dark'], [0, 'silver']]) { G.Audio.sfx(sfx); Cn.beams[i].a = 1; await Cn.tween(Cn.beams[i], { len: 1 }, 22); Cn.burst(160, 64, 20, Cn.beams[i].color, { speed: 2, life: 40 }); }
    Cn.sphereShake = 4; Cn.sphereCrack = 0;
    await Cn.tween(Cn, { sphereCrack: 1 }, 40);
    await say(K, '— AGORA!');
    G.Audio.sfx('boom'); G.shake = 30; Cn.whiteColor = '#ffffff'; Cn.holdWhite = true; await Cn.tween(Cn, { white: 1.2 }, 16);
    Cn.sphereR = 0; Cn.beams = [];
    Cn.cap = { text: 'Uma explosão iluminou o Reino inteiro. Por um instante, tudo ficou branco.', t: 0 }; await Cn.wait(110);
    Cn.holdWhite = false; Cn.cap = { text: 'Depois veio o silêncio.', t: 0 }; await Cn.wait(80);
    await Cn.caption('A esfera havia desaparecido. Valdora também. Onde antes existia a cidade restava apenas uma enorme cratera.');
    await say(K, '— Quantos?');
    await Cn.caption('Thornox não respondeu, e ele entendeu. Kravenox procurou a estrada do leste, por onde mandara as crianças. Estava vazia. Não soube dizer se aquilo era uma boa notícia.', 80);
    await say(PR, '— Você não pode salvar todos.');
    await say(K, '— Eu sei.');
    await say(PR, '— Então desista.');
    await say(K, '— Não. Agora eu tenho ainda mais motivos para continuar.');
    await say(T, '— Vamos.');
    await Cn.caption('Kravenox não ia até a Fonte para destruí-la. Ia descobrir por que ela precisava ser protegida. E, pela primeira vez, o destino dos Irmãos Espinhos não seria decidido por profecias. Seria decidido por eles.', 90);
    G.fadeA = 1;
    await Cn.end();
    F().valdoraFim = 1;
    await chapter(21, 'A Sala da Fonte', ['A Ponte dos Céus não tinha corrimão nem fim visível. Abaixo, só nuvens.']);
    G.enterField('ceus', 12, 22, 'up');
    await G.fade(0, 30);
    await say(L, '— Ela vai aguentar?');
    await say(SE, '— Não sei.');
    await say(K, '— Ótimo.');
    await say(T, '— Você está ficando parecido comigo.');
    await say(K, '— Espero que não.');
    await say(T, '— Eu também.');
    saved();
  };
  // ===================== PONTE DOS CÉUS (cap. 21) =====================
  S.olharNuvens = async () => nar(G.pick(['Só nuvens lá embaixo. E sombras que se movem dentro delas.', 'Um vento frio sobe das nuvens. Muito abaixo, alguma coisa bate asas.']));
  S.mascateCeus = async function () {
    if (!F().mascateC) {
      F().mascateC = 1;
      await say('Mascate de Cinzas', '— Não me olhe assim. Eu sigo quem dá lucro. E vocês dão muito trabalho às criaturas.');
      await say(K, '— Como você chegou aqui?');
      await say('Mascate de Cinzas', '— Do mesmo jeito que sempre: antes de todo mundo.');
    }
    await G.shop('Mascate de Cinzas', ['nectar', 'elixir', 'cristalM', 'raiz', 'nevoa', 'garraPrata', 'cajadoValdora', 'cristalLuz', 'laminaSilencio', 'cotaValdora', 'mantoCeus'], 30);
  };
  S.batalhaServos = async function () {
    if (F().servos) return;
    await say(L, '— Tem alguma coisa nas nuvens.');
    await nar('Uma sombra atravessou o branco, depois outra, depois outra. Criaturas enormes emergiram — corpos alongados, asas de cristal, olhos vazios.');
    await say(K, '— Servos do Primeiro.');
    await G.battle(['servo', 'servo', 'servo'], { bg: 'ceus', noEscape: true, events: [
      { when: b => b.enemies.filter(e => !e.alive).length === 1, run: async () => { await say(K, '— Uma!'); return null; } },
      { when: b => b.enemies.filter(e => !e.alive).length === 2, run: async () => { await say(SE, '— Duas.'); await say(T, '— Está contando?'); await say(K, '— Gosto de números.'); return null; } }] });
    await nar('Mais criaturas surgiram. Dez, vinte, centenas.');
    await say(L, '— São muitas.');
    await say(K, '— Então não podemos ficar aqui. Corram!');
    F().servos = 1;
    saved();
  };
  S.fimDaPonte = async function () {
    if (F().fimPonte) return;
    if (!F().servos) return;
    await nar('Dispararam pela ponte enquanto as criaturas mergulhavam e a estrutura ruía atrás deles, bloco por bloco, caindo no vazio.');
    await nar('Thornox quase perdeu o equilíbrio, e Lyra o segurou pelo braço.');
    await say(L, '— Peguei você!');
    await say(T, '— Obrigado.');
    G.Audio.sfx('boom'); G.shake = 20;
    await nar('O último bloco despencou; Kravenox saltou, e os outros três logo atrás. Alcançaram a margem no instante em que a ponte desabou.');
    await say(K, '— Isso foi perto.');
    await say(SE, '— Agora começa a parte difícil.');
    await say(K, '— Essa não era a parte difícil?');
    await nar('Entre as montanhas havia uma enorme fortaleza de torres negras, com uma luz azul pulsando no topo. O cristal de Lyra vibrou.');
    await say(SE, '— A Fortaleza dos Guardiões. Alguém a reconstruiu. O Primeiro. Ele está criando um exército.');
    await say(K, '— Então vamos entrar.');
    await say(T, '— Você nunca pensa em outra coisa?');
    await say(K, '— Penso. Em como sair.');
    await nar('Lyra riu.');
    F().fimPonte = 1;
    await warpDungeon('fortaleza');
    G.Audio.sfx('door');
    await nar('A entrada da fortaleza estava aberta. Nenhum soldado, nenhuma armadilha. As portas se fecharam atrás deles. No escuro, uma luz azul se acendeu no fim do corredor, depois outra, e outra, formando um caminho.');
    saved();
  };

  // ===================== FORTALEZA DOS GUARDIÕES (caps. 21–22) =====================
  S.memoriaParede = async function () {
    if (F().memParede) return; F().memParede = 1;
    await nar('Enquanto avançavam, as paredes começaram a mostrar imagens: a história dos Irmãos Espinhos. O nascimento, a infância, o treinamento, o Cisma, a batalha, a separação.');
    await nar('Kravenox parou diante de uma delas. Era ele, mais jovem, coberto de sombras, lutando contra Thornox. Mas agora via de fora: Thornox não tentava matá-lo. Tentava alcançá-lo antes que a sombra o tomasse por inteiro.');
    await say(K, '— Thornox.');
    await say(T, '— Eu lembro.');
    await say(K, '— Por que nunca me contou?');
    await say(T, '— Porque você não estava pronto.');
    await say(K, '— Você tentou me salvar. E eu ataquei você. Por quê?');
    await say(T, '— Porque você tinha medo.');
    await say(K, '— Eu sempre tive.');
    await say(T, '— Eu também.');
    await nar('Pela primeira vez, não havia culpa entre os dois. Apenas compreensão.');
    await nar('A imagem mudou. Lyra, sozinha, sentada diante da Fonte — e alguém atrás dela: a versão futura de Kravenox. Mas agora acompanhada por uma criatura gigantesca. O Primeiro.');
    await say(L, '— Essa memória não deveria existir. Eu nunca vi isso.');
    await nar('A imagem mostrou o Kravenox mais velho pousando a mão sobre a Fonte. Então tudo escureceu.');
  };
  S.portaEntrem = async function () {
    if (F().entrem) return;
    if (!F().memParede) { await nar('Uma porta enorme. Uma voz, do outro lado, espera que vocês vejam as paredes primeiro.'); return; }
    F().entrem = 1;
    G.Audio.sfx('door');
    await say('???', '— Entrem.');
    await say(K, '— Chegamos.');
    await say(SE, '— Não. Fomos esperados.');
  };
  S.tronoFuturo = async function () {
    if (F().futuro2) return;
    if (!F().entrem) return;
    const Cn = C();
    await Cn.begin('trono', 'chefe');
    Cn.eyes = 0;
    const fut = Cn.actor('fut', { img: () => X.imgs.e_kfuturo, x: 160, y: 140, z: 2, scale: 1.2, glow: 'rgba(255,255,255,0.6)', glowA: 0.3 });
    await Cn.caption('A sala era gigantesca. No centro havia um trono, e sobre ele um homem de armadura negra, com os mesmos espinhos de Kravenox. Mas seus olhos eram brancos.');
    await say(K, '— Você.');
    await Cn.tween(fut, { y: 158, scale: 1.4 }, 50);
    await say(KF, '— Finalmente.');
    await say(T, '— Quem é ele?');
    await say(K, '— Eu vi você. No coração. Você é meu futuro.');
    await say(KF, '— Não. Sou o seu destino. Sou aquilo que você será quando perder tudo.');
    await say(K, '— Então vou mudar o caminho.');
    await say(KF, '— É exatamente isso que eu esperava que você dissesse.');
    G.Audio.sfx('dark'); G.shake = 8;
    await Cn.tween(Cn, { eyes: 60 }, 60);
    await Cn.caption('As portas se fecharam, as paredes tremeram, e centenas de olhos brancos se abriram na escuridão.');
    await say(KF, '— Mostre-me, Kravenox. Mostre-me se realmente consegue mudar o seu destino.');
    await Cn.end();
    await chapter(22, 'O Homem que Kravenox Seria');
    D.healAll();
    await G.battle(['kfuturo'], { bg: 'fortaleza', music: 'chefe', noEscape: true, noRewards: true, intro: 'O Kravenox do Futuro desce os degraus do trono.', events: [{
      when: b => b.round >= 2 || b.enemies[0].hp < b.enemies[0].maxhp * 0.85,
      run: async () => {
        await nar('Thornox avançou, e o futuro Kravenox bloqueou o cajado com uma só mão. Lyra tentou atacá-lo, e ele desviou; Seraphyne disparou uma rajada, e ele simplesmente atravessou a explosão.');
        await say(T, '— Você é forte demais.');
        await say(KF, '— Tive séculos para aprender.');
        await say(K, '— Parem. Ele é meu.');
        await say(T, '— Você não precisa enfrentar isso sozinho.');
        await say(K, '— Preciso.');
        await say(KF, '— Essa é a primeira coisa certa que você disse.');
        return 'end';
      } }] });
    alone();
    D.healAll();
    await nar('Os dois colidiram, e a explosão destruiu parte do salão.');
    await G.battle(['kfuturoD'], { bg: 'fortaleza', music: 'chefe', noEscape: true, intro: 'Kravenox contra o Kravenox que ele poderia ser!', events: [
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.55, run: async (b) => {
        await say(KF, '— Você ainda luta com raiva.');
        await say(K, '— E você luta sem nada.');
        await say(KF, '— Exatamente.');
        await say(K, '— Então já perdeu. Porque não tem mais nada para proteger.');
        await nar('Pela primeira vez, algo mudou no rosto do outro: raiva. O outro atacou e perdeu a precisão.');
        await say(K, '— Acertei.');
        const e = b.enemies[0]; e.atk = Math.round(e.atk * 0.8); e.agi = Math.round(e.agi * 0.7);
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.2, run: async () => {
        G.Audio.sfx('crack'); G.flash('#dfe8ff', 0.8);
        await say(K, '— Você ainda sente. Ainda se importa. Então ainda existe alguma coisa de mim aí dentro.');
        G.Audio.sfx('boom'); G.shake = 24;
        return 'end'; } }] });
    together();
    await nar('O futuro Kravenox gritou, e uma explosão negra lançou Kravenox ao chão. Quando ergueu os olhos, viu o outro ajoelhado, a armadura quebrada. Por baixo dela havia a mesma marca de quatro espinhos. Mas negra.');
    await say(K, '— O que aconteceu com você?');
    await say(KF, '— Eu venci. A guerra. Salvei o Reino. Salvei minha família. Destruí o Primeiro.');
    await say(K, '— Então por que está assim?');
    await say(KF, '— Porque, para conseguir tudo isso, eu me tornei pior que ele. Absorvi o Primeiro. Eu me tornei ele.');
    await say(K, '— E por que voltou?');
    await say(KF, '— Para impedir que você cometa meu erro. Para salvar o Reino de você.');
    await say(T, '— Não acredito nisso.');
    await say(KF, '— Deveria. Você foi o primeiro a morrer. Na minha linha do tempo, Thornox morreu protegendo a Fonte.');
    await say(K, '— E Lyra?');
    await say(KF, '— Também.');
    await nar('Lyra não conteve o choro.');
    await say(K, '— E Seraphyne?');
    await say(KF, '— Foi ela quem me matou. Tentou impedir que eu absorvesse o Primeiro.');
    await say(SE, '— Eu?');
    G.Audio.sfx('dark'); G.shake = 14;
    await say('???', '— Você não deveria ter voltado.');
    await say(KF, '— Eu sei. Mas ele pode. Você ainda tem uma coisa que eu perdi. Escolha.');
    await say(K, '— Então me diga o que fazer.');
    await say(KF, '— Não. Porque, se eu disser, você fará exatamente o que eu fiz. Quando chegar à Fonte, não confie no que ela mostrar.');
    await nar('E desapareceu. Uma pequena rachadura de luz se abrira no ar, e por ela uma voz sussurrou:');
    await say('???', '— Ele voltou para o lugar de onde veio.');
    await say(K, '— O futuro.');
    await say(SE, '— Não. O passado.');
    await nar('O passado ainda estava vivo. E alguém estava tentando reescrevê-lo.');
    F().futuro2 = 1;
    D.healAll();
    await chapter(23, 'As Ruínas do Passado', ['A fortaleza começou a desmoronar.']);
    await say(L, '— A saída está bloqueada.');
    await say(SE, '— Por ali. A escada logo abaixo do trono.');
    await nar('Mas algo estava errado. Kravenox sentia uma presença — não do Primeiro, nem do Vazio. Algo familiar.');
    await say(K, '— Esperem. Tem alguém aqui. Minha mãe.');
    await say(L, '— Você também sentiu? Desde que entramos na fortaleza.');
    await say(SE, '— Então ela finalmente acordou. Abaixo de nós.');
    saved();
  };
  S.descerRaizes = async function () {
    if (!F().futuro2) { await nar('Uma escada para baixo, bloqueada por uma força invisível que vem do trono.'); G.Dungeon.x = 5; G.Dungeon.y = 15; return; }
    await warpDungeon('raizes');
    if (!F().desceuRaizes) { F().desceuRaizes = 1; await nar('Desceram por corredores de raízes brancas. O ar ficou quente, e cheirava a terra depois da chuva.'); }
  };

  // ===================== O CORAÇÃO DO REINO (caps. 23–25) =====================
  S.arvoreMae = async function () {
    if (F().mae2) return;
    const Cn = C();
    await Cn.begin('arvoreBranca', 'despedida');
    const mae = Cn.actor('mae', { img: () => X.imgs.p_mae, x: 160, y: 150, z: 2, scale: 1.3, alpha: 0.85, glow: 'rgba(240,244,255,0.9)', glowA: 0.4, bob: 0.5 });
    const tI = Cn.actor('thornox', { img: () => X.sprite('thornox', 'up', 0), x: 92, y: 228, z: 5, scale: 1.2, silhouette: '#ffd36a', glow: 'rgba(255,211,106,0.9)', glowA: 0.3 });
    const kI = Cn.actor('kravenox', { img: () => X.sprite('kravenoxP', 'up', 0), x: 140, y: 230, z: 6, scale: 1.25, silhouette: '#dfe8ff', glow: 'rgba(223,232,255,0.9)', glowA: 0.3 });
    const lI = Cn.actor('lyra', { img: () => X.sprite('lyra', 'up', 0), x: 186, y: 228, z: 5, scale: 1.15, silhouette: '#bfe0ff', glow: 'rgba(160,215,255,0.9)', glowA: 0.3 });
    const sI = Cn.actor('ser', { img: () => X.sprite('seraphyne', 'up', 0), x: 236, y: 226, z: 5, scale: 1.2, silhouette: '#c8a8ff', glow: 'rgba(154,96,255,0.9)', glowA: 0.3 });
    await Cn.caption('Chegaram a uma câmara subterrânea cujo teto se perdia na escuridão. No centro havia uma árvore de tronco de cristal branco. E, dentro do tronco, havia uma mulher.');
    await Cn.caption('Thornox prendeu a respiração. Lyra começou a chorar. Seraphyne apenas observava. Kravenox se aproximou devagar.');
    await Cn.tween(kI, { y: 206 }, 50);
    await say(K, '— Mãe.');
    mae.alpha = 1; G.Audio.sfx('memory');
    await Cn.caption('Os olhos da mulher se abriram, e o mundo pareceu parar. Ela olhou primeiro para Thornox, depois para Lyra, por último para Kravenox.');
    await say(MAE, '— Meus filhos.');
    await say(K, '— Você está viva.');
    await say(MAE, '— Por enquanto.');
    await say(T, '— O que fizeram com você?');
    await say(MAE, '— Eu mesma fiz isso. Quando percebi que o Primeiro estava despertando, prendi minha essência à Fonte. Para proteger vocês.');
    await say(K, '— Você sabia o que nós éramos. E nunca nos contou.');
    await say(MAE, '— Porque queria que vocês tivessem uma infância.');
    kI.shake = 1;
    await say(K, '— Todos disseram que era para nos proteger.');
    await say(MAE, '— Eu não queria protegê-los apenas do Primeiro. Queria protegê-los de mim. Fui a primeira pessoa a tocar a Essência. Ela entrou em mim, e uma parte nunca saiu.');
    kI.shake = 0;
    await say(K, '— Seraphyne. Ela é sua filha.');
    await say(MAE, '— Sim.');
    await say(L, '— Então somos irmãos.');
    await say(SE, '— Não exatamente.');
    await say(MAE, '— Seraphyne nasceu da Essência. Vocês nasceram de mim. Ela é irmã de vocês também.');
    await Cn.caption('Seraphyne desviou os olhos. Pela primeira vez, Kravenox percebeu que talvez ela também estivesse perdida.');
    await say(MAE, '— Tudo começou antes. O verdadeiro Vazio. Ele não é uma criatura. É uma ausência. Não pensa, não deseja, não odeia. Apenas ocupa aquilo que deixou de existir.');
    await say(K, '— Então precisamos destruir o Primeiro antes que ele destrua o Reino.');
    await say(MAE, '— Não. Destruir o Primeiro destruirá a Essência. E sem a Essência...');
    await say(L, '— O Reino morre.');
    await say(K, '— Então não podemos matá-lo. Precisamos separá-lo. Eu tenho o núcleo. Thornox tem a luz. Lyra tem as memórias. E ela?');
    await say(MAE, '— Seraphyne possui aquilo que vocês não têm. Vazio.');
    await say(K, '— Ela pode absorver o que sobrar. Qual é o preço?');
    await Cn.caption('A mãe ficou em silêncio.', 40);
    await say(MAE, '— Alguém terá que permanecer ligado à Fonte.');
    await say(K, '— Você. Não.');
    G.Audio.sfx('hit'); G.shake = 6;
    await Cn.caption('Ele bateu a mão no cristal.', 30);
    await say(K, '— Já perdi você uma vez. Então venha conosco.');
    await say(MAE, '— Não posso. Enquanto eu estiver aqui, a Fonte permanece estável.');
    await say(K, '— Então estamos destinados a perder você de novo.');
    G.Audio.sfx('light');
    await say(MAE, '— Não. Desta vez vocês podem escolher.');
    G.Audio.sfx('dark'); G.shake = 14;
    await Cn.caption('O chão tremeu. Um rugido atravessou a montanha.');
    await say(PR, '— Vocês não podem se esconder de mim.');
    await say(MAE, '— Ele chegou. Quando ele entrar na Fonte, tudo começará. Vão.');
    await Cn.tween(tI, { y: 260 }, 30); await Cn.tween(lI, { y: 260 }, 20); await Cn.tween(sI, { y: 260 }, 20);
    await Cn.tween(kI, { y: 228 }, 30);
    await say(MAE, '— Filho.');
    await Cn.caption('Ele parou e se virou.', 30);
    await say(MAE, '— Não tenha medo de quem você é. Tenha medo apenas de esquecer por quem você luta.');
    await Cn.caption('Ele assentiu e partiu. Sozinha dentro da árvore de cristal, a mãe sorriu pela primeira vez em milhares de anos.', 80);
    await Cn.end();
    F().mae2 = 1;
    await chapter(24, 'O Último Caminho');
    await say(SE, '— Ele não está só vindo atrás de nós. Está entrando no Reino. O Primeiro está drenando a Essência direto da Fonte.');
    await say(T, '— Quanto tempo?');
    await say(SE, '— Talvez vinte minutos.');
    await say(K, '— Nunca contei com sorte.');
    saved();
  };
  S.portaCircularEv = async function () {
    if (F().portaCircular) return;
    if (!F().mae2) { await nar('Kravenox sente uma presença familiar ao norte. Não consegue seguir sem descobrir o que é.'); return; }
    await nar('A passagem terminava numa porta circular, lisa, sem símbolos. Kravenox a tocou. Nada. Thornox tentou, depois Lyra. Nada. Quando Seraphyne se aproximou, a porta se abriu.');
    G.Audio.sfx('door');
    await say(K, '— Por que você consegue?');
    await say(SE, '— Porque a porta reconhece o Vazio.');
    await nar('Do outro lado havia uma ponte natural de raízes gigantes sobre uma escuridão sem fundo.');
    await say(L, '— Isso não parece seguro.');
    await say(T, '— Não é.');
    F().portaCircular = 1;
  };
  S.escolhidosPonte = async function () {
    if (F().escolhidos) return;
    await say(SE, '— Estamos sendo seguidos.');
    await nar('Uma criatura surgiu, depois outra, depois dezenas. Sentinelas — mas maiores que os anteriores, e com luz dentro dos olhos.');
    await say(K, '— Foram corrompidos pela Essência.');
    await say(SE, '— Não. Foram escolhidos.');
    await G.battle(['escolhido', 'escolhido', 'escolhido'], { bg: 'raizes', noEscape: true, intro: 'Sentinelas Escolhidos! Seus corpos se refazem.', events: [{
      when: b => b.round >= 2,
      run: async (b) => {
        await say(K, '— Eles não morrem!');
        await say(SE, '— Porque não são corpos. São pensamentos. A mente do Primeiro.');
        await say(T, '— Então destruam a conexão!');
        G.Audio.sfx('memory');
        await nar('Lyra fechou os olhos, e o cristal pulsou. Ela apontou para uma das criaturas.');
        await say(L, '— Ali!');
        G.Audio.sfx('silver'); G.flash('#dfe8ff', 0.6);
        await nar('Kravenox golpeou o chão, e uma onda prateada percorreu as raízes. A conexão se rompeu: as criaturas já não se refazem.');
        b.noRegen = true;
        return null;
      } }] });
    F().escolhidos = 1;
    await nar('A última tentou fugir, e Seraphyne abriu a mão: o Vazio a consumiu.');
    await say(L, '— Conseguimos.');
    saved();
  };
  S.raizQuebra = async function () {
    if (F().raizQ) return; F().raizQ = 1;
    G.Audio.sfx('crack'); G.shake = 8;
    await nar('A cada passo as raízes brilhavam — mas algumas estavam mortas e se partiam sob o peso. Uma raiz desapareceu sob os pés de Lyra.');
    await say(K, '— Peguei. Não solta.');
    await say(L, '— Não vou.');
    await learn(L, 'milMemorias');
  };
  S.aFonte = async function () {
    if (F().fonte2) return;
    if (!F().escolhidos) { await nar('A ponte de raízes ainda está cheia de olhos acesos.'); return; }
    D.healAll();
    const Cn = C();
    await Cn.begin('fonteViva', 'memoria');
    Cn.dim = 0;
    await Cn.caption('A ponte terminou diante de uma porta gigantesca, com uma luz branca do outro lado. Kravenox sentiu calor, paz, memórias. A Fonte.');
    await Cn.caption('O coração do Reino: uma árvore gigantesca com tronco de luz. Milhares de pequenas luzes flutuavam ao redor, cada uma parecendo conter uma vida.');
    await say(L, '— É lindo.');
    await Cn.tween(Cn, { dim: 0.4 }, 60);
    await say(SE, '— Ela está morrendo.');
    G.Audio.sfx('heart');
    await Cn.caption('Kravenox deu alguns passos, e a marca em seu peito queimou. Ele viu o mundo antes do Cisma. Viu a mãe, o pai, Thornox, Lyra, Seraphyne. Depois viu o Primeiro. E, por fim, o futuro.');
    await say(K, '— Eu entendi. Nós não precisamos matar o Primeiro. Precisamos separá-lo. Cada um de nós devolve aquilo que recebeu, e a Fonte recupera o equilíbrio.');
    await say(SE, '— E o Primeiro? Se ele for colocado no Vazio, poderá voltar.');
    await say(K, '— Então teremos que garantir que não volte.');
    G.Audio.sfx('boom'); G.shake = 20;
    await Cn.tween(Cn, { dim: 0.8 }, 40);
    await say(T, '— Ele chegou.');
    const pr = Cn.actor('pr', { img: () => X.imgs.e_primeiro, x: 160, y: 120, z: 3, scale: 1.4, alpha: 0, glow: 'rgba(255,176,32,0.9)', glowA: 0.5 });
    await Cn.tween(pr, { alpha: 1 }, 60);
    await Cn.caption('Uma sombra enorme cobriu a árvore. O corpo do Primeiro atravessou o teto, e seu rosto gigantesco surgiu acima deles. Os olhos dourados se fixaram em Kravenox.');
    await say(PR, '— Filho.');
    await Cn.caption('Kravenox não recuou.', 30);
    await say(K, '— Pai.');
    await say(PR, '— Você me chamou de pai.');
    await say(K, '— Você me criou.');
    await say(PR, '— Eu criei tudo.');
    G.Audio.sfx('silver');
    await say(K, '— Não. Você apenas aprendeu a criar.');
    await say(PR, '— Vocês são meus.');
    await say(K, '— Não somos de ninguém.');
    await Cn.caption('A Fonte brilhou, e as quatro forças começaram a se unir: luz, memória, Vazio, Essência. Pela primeira vez, o Primeiro demonstrou medo.');
    await say(K, '— Agora começa.');
    G.fadeA = 1;
    await Cn.end();
    await chapter(25, 'A Última Batalha', ['Quatro caminhos.\nUma única escolha.']);
    await S.batalhaFinal();
  };
  // Cap. 25: o Primeiro, em fases; no meio da luta, Kravenox desperta a armadura
  S.batalhaFinal = async function () {
    D.healAll();
    const kh = () => G.state.party.find(h => h.id === 'kravenox');
    await G.battle(['primeiro'], { bg: 'fonte', music: 'final', noEscape: true, noRewards: true, intro: 'O Primeiro abre os braços. "Vocês não entendem o que estão fazendo."', events: [
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.85, run: async () => {
        await say(PR, '— Vocês não entendem o que estão fazendo.');
        await say(K, '— Talvez não. Mas entendemos o que não queremos ser.');
        G.Audio.sfx('light'); G.flash('#ffe8a0', 0.7);
        await nar('Uma onda negra varreu a câmara, e Thornox ergueu uma muralha de luz. O impacto fez o chão tremer.');
        for (const h of G.state.party) if (h.alive) h.status.shield = 4;
        F().tec_muralha = 1;
        await nar('Thornox aprendeu Muralha de Luz!');
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.68, run: async (b) => {
        G.Audio.sfx('memory'); G.flash('#bfe0ff', 0.8);
        await nar('Lyra fechou os olhos e o cristal brilhou. Milhares de memórias atravessaram a câmara: a infância dos irmãos, as guerras, as perdas, as pessoas que tinham conhecido.');
        await say(L, '— VOCÊ NÃO PODE TIRAR O QUE É NOSSO!');
        const e = b.enemies[0]; e.hp = Math.max(1, e.hp - Math.round(e.maxhp * 0.06));
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.5, run: async (b) => {
        G.Audio.sfx('dark'); G.flash('#140820', 0.9);
        await nar('Seraphyne abriu os braços, e o Vazio surgiu — não como explosão, mas como silêncio. A escuridão começou a envolver a energia do Primeiro.');
        await say(PR, '— VOCÊ!');
        await say(SE, '— Sim.');
        await nar('Kravenox avançou. A marca em seu peito se abriu, e a quarta Essência começou a deixar seu corpo.');
        await say(T, '— Kravenox! Você vai perder o núcleo!');
        await say(K, '— Talvez.');
        await say(T, '— Então eu vou com você. Dessa vez você não decide sozinho.');
        await nar('Thornox pousou a mão no ombro do irmão, e sua luz entrou no corpo de Kravenox.');
        await say(K, '— O que está fazendo?');
        await say(T, '— Dividindo o peso.');
        await say(L, '— Então somos quatro.');
        await say(SE, '— Sempre fomos.');
        await S.despertar2(b);
        return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.15, run: async () => {
        await say(PR, '— Vocês foram criados por mim!');
        await say(K, '— E, mesmo assim, escolhemos ser diferentes.');
        return null; } }] });
    const h = kh(); F().desperto = 0; delete F().tec_quarta; if (h) D.recalc(h);
    await S.finalParte2();
  };
  // a Forma Desperta: a armadura prateada, a mesma silhueta do homem que ele poderia ser
  S.despertar2 = async function (b) {
    const h = G.state.party.find(x => x.id === 'kravenox');
    G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 30;
    await G.wait(20);
    F().desperto = 1; F().tec_quarta = 1;
    if (h) { h.alive = true; h.hp = h.maxhp; h.ep = h.mep; h.atk = Math.round(h.atk * 1.45); h.def = Math.round(h.def * 1.3); h.agi += 8; h.status = {}; }
    for (const x of G.state.party) { if (!x.alive) { x.alive = true; x.hp = Math.round(x.maxhp * 0.5); } x.ep = x.mep; }
    G.Audio.sfx('level');
    await nar('As quatro forças se uniram em Kravenox. Espinhos de prata se fecharam sobre seu corpo como uma armadura — a mesma silhueta do homem que ele poderia ser. Mas os olhos não eram brancos. E a luz não era negra.');
    await nar('FORMA DESPERTA! Kravenox pode usar a Quarta Essência.');
    void b;
  };
  S.finalParte2 = async function () {
    const Cn = C();
    await Cn.begin('essencia', 'despedida');
    await Cn.caption('A Fonte explodiu em luz. Kravenox sentiu o próprio corpo desaparecer. Não havia chão nem som. Estava dentro da Essência.');
    await Cn.caption('Viu milhares de mundos, de vidas, de possibilidades, e em todas elas estavam os irmãos. Em algumas, Thornox vencia; em outras, Kravenox. Em algumas, os dois morriam; em outras, nunca chegavam a se conhecer.');
    await Cn.caption('Mas havia uma possibilidade diferente: uma em que permaneciam juntos. Não como guerreiros. Como irmãos.');
    const kI = Cn.actor('k', { img: () => X.sprite('kravenoxP', 'down', 0), x: 130, y: 150, z: 3, scale: 1.3, glow: 'rgba(223,232,255,0.9)', glowA: 0.5 });
    const tI = Cn.actor('t', { img: () => X.sprite('thornox', 'down', 0), x: 190, y: 150, z: 3, scale: 1.3, alpha: 0, glow: 'rgba(255,211,106,0.9)', glowA: 0.5 });
    const lI = Cn.actor('l', { img: () => X.sprite('lyra', 'down', 0), x: 100, y: 166, z: 3, scale: 1.2, alpha: 0, glow: 'rgba(160,215,255,0.9)', glowA: 0.5 });
    const sI = Cn.actor('s', { img: () => X.sprite('seraphyne', 'down', 0), x: 220, y: 166, z: 3, scale: 1.2, alpha: 0, glow: 'rgba(154,96,255,0.9)', glowA: 0.5 });
    await Cn.tween(tI, { alpha: 1 }, 30);
    await say(K, '— Você também está vendo?');
    await say(T, '— Sim.');
    await Cn.tween(lI, { alpha: 1 }, 30);
    await say(L, '— Então é isso.');
    await Cn.tween(sI, { alpha: 1 }, 30);
    await say(SE, '— Não. Isso é apenas uma possibilidade.');
    await say(K, '— Então vamos escolhê-la.');
    G.Audio.sfx('silver'); Cn.whiteColor = '#ffffff'; Cn.holdWhite = true; await Cn.tween(Cn, { white: 1.1 }, 40);
    void kI;
    Cn.holdWhite = false; await Cn.end();
    // do lado de fora, o Primeiro se desfaz
    await Cn.begin('fonteViva', 'memoria');
    Cn.dim = 0.7;
    const pr = Cn.actor('pr', { img: () => X.imgs.e_primeiro, x: 160, y: 120, z: 3, scale: 1.4, alpha: 1, glow: 'rgba(255,176,32,0.9)', glowA: 0.5 });
    await Cn.caption('Do lado de fora, o Primeiro começou a se desfazer. A armadura caiu, a forma gigantesca desapareceu.');
    G.Audio.sfx('die');
    await Cn.tween(pr, { scale: 0.08, y: 110 }, 90);
    await Cn.caption('Restou apenas uma pequena esfera escura. O Vazio a envolveu, e Seraphyne a segurou na mão.');
    await say(PR, '— Eu voltarei.');
    await say(SE, '— Talvez. Mas não hoje.');
    G.Audio.sfx('dark'); pr.alpha = 0;
    await Cn.caption('E fechou a mão. A esfera desapareceu.');
    G.Audio.sfx('heal');
    await Cn.tween(Cn, { dim: 0 }, 120);
    await Cn.caption('O ar ficou parado. A Fonte começou a se recuperar: as raízes mortas voltaram a brilhar, as luzes apagadas retornaram.');
    await Cn.end();
    await Cn.begin('ceuAzul', 'fim');
    Cn.blue = 0;
    await Cn.caption('E o céu do Reino mudou.', 40);
    await Cn.tween(Cn, { blue: 1 }, 220);
    await Cn.caption('Pela primeira vez em séculos, o vermelho desapareceu, e um azul profundo surgiu no horizonte.', 80);
    await Cn.end();
    await G.fade(0.85, 40, '#000');
    await nar('Thornox caiu de joelhos. Lyra se sentou no chão. Kravenox ficou de pé, sentindo algo diferente: a marca em seu peito havia desaparecido.');
    await say(K, '— Acabou.');
    await say(T, '— Não. Agora começa.');
    await say(K, '— Seraphyne?');
    await say(SE, '— Estou bem. O Vazio está selado. Ainda aqui.');
    await nar('Lyra correu até ela, e as duas se abraçaram. Por um instante, tudo parecia enfim terminado.');
    for (let i = 0; i < 3; i++) { G.Audio.sfx('heart'); G.shake = 8; await G.wait(50); }
    await nar('Então a Fonte pulsou. Uma vez. Duas. Três. A Fonte abriu uma pequena fenda, e dentro dela havia uma luz diferente — mais antiga, mais profunda.');
    await say('???', '— A guerra terminou. Agora começa a Era.');
    await say(T, '— O que foi isso?');
    await say(K, '— Não sei.');
    await say(SE, '— Eu sei. O Primeiro era apenas o guardião da porta.');
    await say(K, '— E o que existe do outro lado?');
    await say(SE, '— Aquilo que existia antes dele.');
    await nar('A guerra havia terminado, mas o Reino Quebrado ainda guardava segredos. E, pela primeira vez, os Irmãos Espinhos estavam livres para descobri-los.');
    await nar('Juntos.');
    F().fim2 = 1; F().fonte2 = 1;
    D.healAll(); D.save();
    await G.fade(1, 60);
    G.Audio.play('fim');
    await G.credits(2);
  };
})();
