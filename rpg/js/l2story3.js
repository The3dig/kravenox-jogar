'use strict';
// Livro II — O Reino da Escolha. Parte 3: capítulos 23 a 41 (O que Fica Depois do Fim). O FIM.
(function () {
  const S = G.story, D = G.data, X = G.gfx, L2 = S.L2;
  const F = () => G.state.flags;
  const say = (n, t) => G.say(n, t);
  const nar = t => G.say(null, t);
  const C = () => G.Cine;
  const K = 'Kravenox', T = 'Thornox', L = 'Lyra', SE = 'Seraphyne', ER = 'Erya', PAI = 'O Pai', MAE = 'A Mãe', AS = 'Aster', OR = 'A Origem',
    BI = 'O Bibliotecário', PL = 'O Primeiro Leitor', PS = 'O Primeiro Silêncio', HE = 'O Homem da Estrela', LI = 'Liora', AV = 'Aveline', AZ = 'Azul',
    KA = 'O Outro Kravenox', TA = 'O Outro Thornox';
  const th = () => G.state.party.find(h => h.id === 'thornox');

  // ===================== INÍCIO DA PARTE 3 =====================
  S.l2parte3 = async function () {
    const f = F(); f.l2p3 = 1;
    if (G.state.fullParty) L2.regroup();
    L2.setParty(['kravenox', 'thornox', 'erya', 'mae']);
    L2.heal();
    G.fadeA = 1;
    G.Audio.play('auren');
    await G.narrate(['PARTE 3\nO que Fica Depois do Fim'], { hold: 160, color: '#c9a24a' });
    await L2.chapter(23, 'O Mundo Depois do Fim', ['O vento tocou o rosto de Kravenox. Tinha cheiro de chuva, de terra molhada, de folhas.']);
    G.enterField('auren', 3, 3, 'down');
    await G.fade(0, 30);
    await say(K, '— É real.');
    await say(T, '— Parece que sim.');
    await say(K, '— Então acabou.');
    await say(OR, '— Uma parte.');
    await say(K, '— Sempre existe uma parte.');
    await nar('O mundo parecia absurdamente normal. Pássaros, árvores, um rio, e ao longe uma cidade. Kravenox sentiu algo estranho. Paz. E aquilo o incomodou mais do que qualquer batalha.');
    await say(K, '— Não sei o que fazer quando ninguém está tentando me matar.');
    await say(T, '— Podemos começar com comida.');
    await G.fade(1, 20);
    G.enterField('auren', 18, 14, 'right');
    await G.fade(0, 20);
    await say('Guarda', '— Viajantes? De onde?');
    await say(K, '— De muito longe.');
    await say('Guarda', '— Essa resposta costuma significar problemas. Mercenários? Aventureiros?');
    await say(T, '— Pessoas tentando descobrir quem são.');
    await say('Guarda', '— Então provavelmente estão no lugar certo. Bem-vindos a Auren.');
    await nar('Mercados, oficinas, templos. Crianças correndo, comerciantes gritando preços, músicos nas praças. Era quase doloroso: exatamente aquilo que o Reino Quebrado deveria ter sido.');
    await say(T, '— Não podemos recuperar o que perdemos. Mas podemos não perder isso.');
    await nar('Há uma hospedaria pequena, mas limpa, a oeste da praça.');
    F().aurenChegou = 1;
    L2.saved();
  };

  // ---------- Auren: gente e lugares ----------
  S.guardaAuren = async () => { await say('Guarda', F().silencio ? '— Ninguém sabe o que aconteceu naquela noite. Só sei que vocês estavam lá fora quando todo mundo estava escondido.' : '— Auren não tem muralha alta. Nunca precisou. Até agora, pelo menos.'); };
  S.donaHospedaria = async () => { await say('Dona da Hospedaria', F().ch25 ? '— Seu irmão não comeu de novo. Guardei pão. Leva pra ele.' : '— Comam primeiro. Depois vocês me contam a longa história.'); };
  S.mercadorAuren = async function () {
    await say('Comerciante de Auren', '— Melhor preço da praça! Ah, vocês têm cara de quem atravessou uma guerra. Melhor preço da praça mesmo.');
    await G.shop('Comerciante de Auren', ['orvalho', 'paoReino', 'cristalEsc', 'folha', 'lanterna', 'nevoa', 'garraLivre', 'cajadoLivro', 'marcaLivre', 'laminaAuren', 'mantoAuren'], 100);
  };
  S.musicoAuren = async () => { await say('Músico', F().silencio ? '— Fiz uma música sobre a noite das lanternas. Ainda não sei o final.' : '— Toco aqui todos os dias. Hoje alguém parou para ouvir. Foi você.'); };
  S.criancaAuren = async () => { await say('Criança de Auren', F().silencio ? '— Minha mãe sumiu por um segundo naquela noite. Depois voltou. Ela não lembra. Eu lembro.' : '— Seus espinhos são de verdade?'); };
  S.casaAuren = async () => nar(G.pick(['Uma janela com flores. Lá dentro, alguém ri.', 'Cheiro de pão quente.', 'Uma oficina. Um homem conserta uma cadeira e assobia.']));
  S.fonteAuren = async () => nar('Um poço de pedra no meio da praça. A água é limpa.');
  S.muralhaAuren = async () => nar('Uma muralha baixa. Auren nunca precisou de outra.');
  S.torreAuren = async () => nar(F().silencio ? 'A torre onde Kravenox e Thornox ficaram acordados, olhando a estrela negra.' : 'A torre mais alta de Auren. Dela se vê o céu inteiro.');

  // ===================== A NOITE (caps. 23–24) =====================
  S.hospedaria = async function () {
    G.Field.py += 1;
    if (!F().jantar) return S.jantarAuren();
    if (F().estrelaCaiu && !F().silencio) { await nar('As luzes da cidade estão apagadas. A luz caiu fora da cidade, ao sul.'); return; }
    if (F().ch26 && !F().ch27) return;
    const i = await G.choose('A hospedaria. Descansar?', ['Sim', 'Não']);
    if (i === 0) { await G.rest(); L2.saved(); }
  };
  S.jantarAuren = async function () {
    F().jantar = 1;
    await say('Dona da Hospedaria', '— Não precisam pagar hoje. Vocês parecem cansados. Parecem ter atravessado uma guerra.');
    await say(T, '— Longa história.');
    await say('Dona da Hospedaria', '— Tenho tempo.');
    await say(K, '— Nós também.');
    await say('Dona da Hospedaria', '— Então comam primeiro.');
    await G.fade(0.8, 30, '#000010');
    F().noiteAuren = 1;
    await nar('Naquela noite, ninguém falou de profecias. Eles apenas comeram, riram e dormiram. Kravenox acordou no meio da madrugada e não havia ninguém gritando. Saiu para a varanda. A Origem estava sentada no telhado.');
    await say(K, '— Você está diferente. Mais tranquila.');
    await say(OR, '— Porque ninguém está me obrigando a ser alguma coisa. E você? O que você quer ser?');
    await say(K, '— Não sei.');
    await say(OR, '— Ótimo.');
    await say(K, '— Aquela estrela negra estava aqui ontem?');
    await say(OR, '— Não. Agora você precisa descobrir algumas coisas sozinho. Ela está se aproximando. Não é uma pessoa. Nem um monstro. Uma lembrança.');
    G.Audio.sfx('bell'); G.shake = 10;
    await nar('Na mesma hora, todas as luzes da cidade se apagaram. Os sinos tocaram, todos. A estrela negra descia.');
    await say(ER, '— Não é uma estrela. É uma porta.');
    G.Audio.sfx('boom'); G.shake = 18;
    await nar('Uma luz escura atingiu o chão fora da cidade, ao sul. A terra tremeu.');
    await G.fade(0, 20);
    F().estrelaCaiu = 1;
    L2.saved();
  };
  S.crateraEstrela = async function () {
    if (!F().estrelaCaiu || F().silencio) return;
    L2.checkpoint('aqueleQueExistia');
    await S.aqueleQueExistia();
  };
  S.aqueleQueExistia = async function () {
    await nar('No centro da cratera havia um homem jovem, humano, sem armadura, sem marcas. Mas tinha os olhos de Kravenox. E carregava o livro que o Primeiro Leitor havia entregado: KRAVENOX. Abaixo, outra palavra: PRIMEIRO.');
    await say(HE, '— Você demorou. A pergunta certa não é quem eu sou. É quando você nasceu. Quando escolheu existir.');
    await say(T, '— Chega de enigmas.');
    await say(HE, '— Você ainda não deveria estar aqui. Nesta versão da história, você morreu.');
    await nar('Uma frase apareceu no livro: THORNOX NÃO DEVERIA TER SOBREVIVIDO. A tinta se espalhou, e Thornox caiu de joelhos.');
    await say(HE, '— Não fui eu quem escreveu.');
    G.Audio.sfx('dark'); G.shake = 14;
    await say('???', '— Eu. E agora que a Fonte morreu, ninguém mais pode me impedir.');
    await say(OR, '— Eu conheço essa voz. O único ser que eu nunca consegui controlar. Ele voltou.');
    await L2.chapter(24, 'Aquele que Existia Antes');
    const Cn = C();
    await Cn.begin('silencioDesce', 'silencio');
    await Cn.caption('Algo atravessou a abertura no céu. Às vezes parecia um homem, às vezes uma criatura, às vezes apenas uma sombra gigantesca. O rosto mudava a cada segundo.');
    await say(PS, '— Kravenox. Sou a primeira coisa que existiu antes da primeira coisa.');
    await say(T, '— Antes da Fonte. Antes da Origem. Antes do Primeiro Leitor. Havia apenas duas vontades. Uma queria criar. A outra queria permanecer.');
    await say(PS, '— Vazio é ausência. Eu sou aquilo que existia antes da ausência. O Primeiro Silêncio. Ela me expulsou quando criou o primeiro mundo. Quero devolver tudo ao estado anterior. Libertar os mundos da existência.');
    await say(K, '— E se eles não quiserem?');
    await say(PS, '— Eles não terão escolha.');
    await say(K, '— Então teremos um problema.');
    await Cn.end();
    L2.heal();
    const t0 = th(); if (t0) { t0.hp = Math.round(t0.maxhp * 0.25); t0.ep = 0; }
    let todos = false;
    await G.battle(['primeiroSilencio'], { bg: 'auren', music: 'silencio', noEscape: true, intro: 'O Primeiro Silêncio estende a mão. A cidade desaparece por um segundo.',
      setup: b => { b.enemies[0].immune = true; },
      choose: { who: 'kravenox', when: b => b.round >= 3, prompt: 'O ataque simplesmente deixa de existir.', options: [
        { label: 'Atacar até ele cair', run: async () => { await say(PS, '— Eu existia antes das regras que você usa para lutar.'); return null; } },
        { label: 'Deixar a Origem falar', run: async () => {
          await say(OR, '— Eu vou falar com ele. Foi assim que tudo começou.');
          await say(PS, '— Filha. Meu erro.');
          await say(OR, '— Eu fui criada para impedir você. Falhei. Então me deixe escolher se a existência continua. ...Não. Eu não vou decidir.');
          await say(PS, '— Então quem decidirá?');
          await say(K, '— Todos.'); todos = true; return 'end'; } }],
        hints: [{ round: 4, who: OR, text: '— Não ataque. Ele está tentando fazer você acreditar que perdeu.' }] },
      events: [
        { when: b => b.round >= 2, run: async () => {
          G.Audio.sfx('dark'); G.flash('#000000', 0.9);
          await nar('Por um segundo, só escuridão. Depois tudo voltou, mas algumas pessoas haviam desaparecido. Uma criança chorava na rua. Um guarda olhava para as mãos, sem lembrar o próprio nome.');
          await say(PS, '— Estou removendo possibilidades. Seu irmão já morreu. Numa versão. Em outra também.');
          await say(T, '— Ela está certa. Infelizmente, estou vivo.');
          await nar('Kravenox riu. Uma risada curta, quase desesperada, mas verdadeira.');
          await say(PS, '— Interessante. Você ainda ri.'); return null; } }] });
    const Cn2 = C();
    await Cn2.begin('lanternasAuren', 'auren');
    G.Audio.sfx('memory');
    await Cn2.tween(Cn2, { lights: 1 }, 140);
    await Cn2.caption('Uma luz surgiu no céu. Não era a Fonte, nem a Origem. Cada pessoa da cidade começou a emitir uma pequena luz. Depois outras cidades, outros mundos. Milhões. Bilhões. Cada escolha, cada vida, começou a brilhar.');
    await say(PS, '— VOCÊS NÃO ENTENDEM!');
    await say(K, '— Talvez não. Mas não precisamos entender tudo para escolher.');
    await Cn2.caption('Erya segurou a mão da Origem. A mãe segurou a mão do pai. As pessoas de Auren fizeram o mesmo. O Primeiro Silêncio começou a desaparecer — cercado por algo que nunca havia existido antes. Possibilidades.', 80);
    await say(PS, '— Eu voltarei.');
    await say(K, '— Talvez. E vamos descobrir o que acontece.');
    await Cn2.caption('Naquela noite, Auren acendeu milhares de lanternas. Para as pessoas, havia apenas amanhecido depois de uma noite estranha.', 70);
    await Cn2.end();
    F().silencio = 1; F().noiteAuren = 0;
    G.enterField('auren', 26, 7, 'up');
    await G.fade(0, 20);
    await say(T, '— Em que está pensando?');
    await say(K, '— Na primeira vez que acordei. Eu achava que precisava conquistar tudo. Agora quero construir alguma coisa. Um lugar. Para quem não tem lugar.');
    await say(T, '— Então já temos um primeiro objetivo. Encontrar um terreno.');
    await say(K, '— Depois de salvar o universo... vamos procurar um terreno.');
    await nar('Muito além dos mundos conhecidos, uma mão escreveu numa página: O Primeiro Silêncio não foi destruído. Ele apenas escolheu esperar. E, na última linha: THORNOX.');
    L2.done();
    await L2.chapter(25, 'O Livro de Thornox', ['Na manhã seguinte, Auren acordou devagar.']);
    await nar('Thornox pegou um pedaço de pão e não comeu. Os dedos dele tremiam. O homem da estrela saiu antes do amanhecer, mas deixou um livro aberto sobre o banco da praça, junto ao poço.');
    F().ch25 = 1;
    L2.saved();
  };

  // ===================== CAP. 25 — O LIVRO DE THORNOX =====================
  S.bancoLivro = async function () {
    if (!F().ch25 || F().livroThornox) { await nar('Um banco de pedra junto ao poço da praça.'); return; }
    F().livroThornox = 1;
    await nar('O livro com o nome de Kravenox na capa. A página aberta está quase vazia. Apenas uma linha: THORNOX.');
    await say(T, '— Você leu isso ontem. Eu sonhei com essa página.');
    await say(OR, '— Quando você começou a ouvir?');
    await say(T, '— Uma voz. Desde que ele me tocou.');
    await nar('Thornox puxou a gola da roupa. No centro do peito havia uma marca pequena e escura, como uma gota de tinta que se recusava a secar.');
    await say(K, '— Ele deixou uma parte dentro de você. O que ela diz?');
    await say(T, '— Que eu não terminei.');
    await nar('O pai está sozinho no alto da muralha, a leste.');
    L2.saved();
  };
  S.paiMuralhaAuren = async function () {
    if (!F().livroThornox) { await say(PAI, '— Vá ver o livro na praça. Depois conversamos.'); return; }
    F().paiAurenFalou = 1;
    await say(K, '— Você sabia que isso aconteceria?');
    await say(PAI, '— Sabia que podia acontecer. Disse a mim mesmo que talvez não acontecesse.');
    await say(K, '— Isso é pior.');
    await say(PAI, '— Eu sei. Quando o Primeiro Silêncio tocou seu irmão, não estava tentando matá-lo. Estava escrevendo. Um destino. Thornox sempre carregou uma porta, Kravenox.');
    await nar('O pai não explicou. Apenas tocou o próprio peito, no mesmo lugar onde estava a marca de Thornox.');
    L2.checkpoint('noiteThornox');
    await S.noiteThornox();
  };
  S.noiteThornox = async function () {
    await G.fade(0.8, 30, '#000010');
    await nar('Naquela noite, Thornox não conseguiu ficar de pé. Kravenox o carregou até o quarto. A mãe segurou a mão do filho.');
    await say(T, '— A voz está mais alta. Existe um lugar onde o meu nome foi escrito antes de mim. E eu preciso ir até lá.');
    await say(OR, '— É uma biblioteca. Não existe outra.');
    await say(T, '— Se eu me perder lá dentro, você vai ter que entrar no meu destino para me buscar.');
    await say(K, '— Então eu entro.');
    await nar('Três batidas, lentas, vindas da parede. A parede não estava mais lá. No lugar dela havia uma porta alta e escura, feita da mesma madeira das estantes da Biblioteca do Fim.');
    await say(T, '— Ela chegou.');
    await L2.chapter(26, 'O Destino de Thornox');
    await say(BI, '— Kravenox. Se entrar agora, vai alterar a história. Se não entrar, também. Você pode escolher qual consequência aceita.');
    await say(T, '— Dessa vez, não. Eu vou sozinho. Confia em mim.');
    await nar('Era a primeira vez que Thornox dizia aquilo sem medo. Kravenox soltou o braço do irmão.');
    await say(K, '— Volte.');
    await say(T, '— Pretendo.');
    await say(MAE, '— Apenas estamos cansados de cometer os mesmos erros. Esperamos.');
    L2.solo('thornox'); L2.heal();
    await G.fade(1, 20);
    G.enterDungeon('destino');
    await G.fade(0, 30);
    await nar('Do outro lado, Thornox estava sozinho. Um espaço branco.');
    L2.done(); L2.saved();
  };

  // ===================== O DESTINO DE THORNOX (cap. 26) =====================
  S.primeiroPersonagem = async function () {
    if (F().personagemVisto) return; F().personagemVisto = 1;
    await nar('Uma criança, a mesma do primeiro encontro com o Primeiro Leitor. Mas agora parecia mais velha, mais triste.');
    await say('A Criança', '— Não sou o Primeiro Leitor. Sou o primeiro personagem. Da sua história. Você a escreveu antes de nascer. E escolheu esquecer, para descobrir se ainda escolheria as mesmas coisas sem saber o motivo.');
    await say(T, '— E escolhi? Quantas vezes errei?');
    await say('A Criança', '— Todas. Mas você continuou. Há portas por aqui. Abra-as.');
  };
  S.memoriaPais = async function () {
    if (F().memPais) return; F().memPais = 1;
    await L2.vision(['Thornox criança, com Kravenox ao lado, brincando perto da Fonte. A mãe observava; o pai estava distante.', '— Ele vai carregar a Origem — dizia o pai.\n— Não — respondeu a mãe. — Vou dar a escolha ao outro.', 'Ao outro. A Kravenox.']);
  };
  S.memoriaFonteK = async function () {
    if (F().memFonte) return; F().memFonte = 1;
    await L2.vision(['Kravenox diante da Fonte. A Origem ainda era apenas uma luz.', '— Se você fizer isso, vai perder tudo.\n— Talvez. Mas alguém precisa escolher.', 'Thornox tentou impedir. Mas ele escolheu. O Cisma foi escolha dos dois.']);
    await say(T, '— Passei séculos acreditando que fui vítima. E também escolhi. Finalmente entendi.');
  };
  S.silencioChora = async function () {
    if (F().silencioVisto) return;
    if (!F().memPais || !F().memFonte) { await nar('Uma porta que ainda não se abre. As outras memórias primeiro.'); return; }
    F().silencioVisto = 1;
    await nar('O Primeiro Silêncio estava diante dele, mas não como o monstro. Pequeno, quase humano. Chorando.');
    await say(PS, '— Eu não queria destruir nada. Ninguém me deixava existir. Ela. E quando ninguém me viu, comecei a apagar tudo que existia.');
    await say(T, '— Para que todos sentissem o que você sentia. Eu conheço esse sentimento. Passei a vida inteira acreditando que meu irmão era mais importante. Agora sei que não preciso ser.');
  };
  S.escolhaThornox = async function () {
    if (F().ch26) return;
    if (!F().silencioVisto || !F().personagemVisto) { await nar('O fim do espaço branco. Ainda falta lembrar alguma coisa.'); return; }
    await say('A Criança', '— Você está pronto para escolher se quer continuar sendo o que escreveu. Antes você precisava cumprir a história. Agora a história precisa acompanhar você.');
    for (;;) {
      const c = await G.choose('Thornox escolhe:', ['Continuar sendo Thornox', 'Começar de novo, como outro']);
      if (c === 0) break;
      await nar('Thornox pensa em Kravenox, esperando do outro lado da porta. Ele prometeu voltar.');
    }
    await nar('Thornox segurou a mão da criança, e tudo ficou escuro.');
    F().ch26 = 1;
    L2.regroup(); L2.heal();
    await G.fade(1, 20);
    G.enterField('auren', 20, 10, 'up');
    await G.fade(0, 30);
    await nar('A porta se abriu. Thornox apareceu: a marca no peito havia desaparecido, e ele segurava um livro.');
    await say(T, '— Descobri quem sou.');
    await nar('Na capa: THORNOX. Todas as páginas estavam vazias.');
    await say(T, '— Porque agora começa a minha história.');
    await L2.learn(T, 'paginaBranca');
    await say(OR, '— O Primeiro Leitor não estava escrevendo sobre nós. Sobre quem está vindo.');
    await nar('No céu surgiu uma estrela dourada, depois milhares, formando uma linha, como se alguém desenhasse uma estrada entre as constelações. E, no fim dela, uma enorme porta.');
    await say(K, '— Você ainda quer começar sua história?');
    await say(T, '— Mais do que nunca.');
    L2.checkpoint('estradaEstrelas');
    await S.estradaEstrelas();
  };

  // ===================== CAP. 27 — A ESTRADA ENTRE AS ESTRELAS =====================
  S.estradaEstrelas = async function () {
    await L2.chapter(27, 'A Estrada entre as Estrelas');
    await G.fade(1, 20);
    G.enterField('estrelas', 12, 19, 'up');
    await G.fade(0, 30);
    await nar('A estrada começava no chão e continuava para o céu, atravessando as nuvens e seguindo entre as estrelas. Auren tornou-se um pequeno ponto e depois desapareceu.');
    await say(K, '— Isso não deveria ser possível. Porque parece bonito.');
    await say(T, '— Você realmente mudou.');
    F().ch27 = 1; L2.done(); L2.saved();
  };
  S.estrelasPerto = async () => nar(G.pick(['As estrelas estão tão perto que dá para ouvir.', 'Lá embaixo, nuvens. Lá em cima, mais estrelas.']));
  S.portaFicar = async function () {
    if (F().portaFicar) return;
    await nar('Uma porta flutuava sozinha no meio da estrada. Thornox abriu o livro, e uma frase apareceu: PARA CONTINUAR, UM DE VOCÊS PRECISA FICAR.');
    const c = await G.choose('Quem fica?', ['Thornox', 'A Mãe', 'Ninguém'], { w: 140 });
    if (c !== 2) await say(K, '— Não. Já tivemos testes demais. Não vou deixar ninguém para trás.');
    await say('Uma Voz', '— Então ninguém passará.');
    await say(K, '— Ótimo. Então ficamos todos.');
    G.Audio.sfx('door');
    await nar('A estrada tremeu, e a porta voltou a aparecer. Dessa vez estava aberta. Do outro lado, uma cidade sobre o céu. Milhares de pessoas. Nenhuma possuía rosto.');
    F().portaFicar = 1; F().cidadeNomes = 1;
    await say('Mulher sem Rosto', '— Visitantes. Esta é a Cidade dos Nomes. Aqui vocês descobrem quem podem ser. É uma armadilha, sim. Toda escolha é. Algumas precisam ser atravessadas.');
    L2.saved();
  };
  S.casaNomes = async () => nar('Uma casa sem número. Lá dentro, alguém escreve o próprio nome num espelho.');
  S.semRostoFala = async () => { await say('Habitante sem Rosto', '— Qual é o seu nome? ...Ah. Ainda está escolhendo. Leva tempo.'); };
  S.semRostoFala2 = async () => { await say('Habitante sem Rosto', '— A cidade só responde quando alguém pergunta.'); };
  S.mulherSemRosto = async () => { await say('Mulher sem Rosto', F().chaveNomes ? '— A última porta está dentro dele.' : '— A praça. A estátua. Foi o primeiro a chegar aqui.'); };
  S.estatuaUltimo = async function () {
    if (!F().cidadeNomes || F().chaveNomes) { if (F().chaveNomes) await nar('Os pedaços da estátua quebrada. KRAVENOX, O ÚLTIMO.'); return; }
    L2.checkpoint('estatuaUltimo2');
    await S.estatuaUltimo2();
  };
  S.estatuaUltimo2 = async function () {
    await nar('No centro da praça havia uma estátua. Era Kravenox — o Kravenox do trono. Na base: KRAVENOX, O ÚLTIMO.');
    await say('Mulher sem Rosto', '— Ele foi o primeiro a chegar. Escolheu seu nome. E acreditou nisso por tanto tempo que se tornou verdade.');
    G.Audio.sfx('crack');
    await nar('Kravenox tocou a estátua, e ela se partiu. Dentro havia um livro: EU NÃO ERA O ÚLTIMO. EU APENAS ACREDITEI QUE ERA. E FOI ASSIM QUE O FIM COMEÇOU.');
    await say(K, '— Não é uma história. É um aviso.');
    await say(OR, '— Eu conheço essa história. Fui eu quem contou a ele. O Rei era apenas uma parte do meu irmão. O Primeiro Leitor.');
    await say(K, '— Então eu pergunto. Quem é o Primeiro Leitor?');
    await say('Todas as Vozes', '— Aquele que escreveu a primeira história. Ninguém escreveu a dele. Ele escolheu existir.');
    await say(T, '— Como nós.');
    await nar('A cidade começou a desaparecer. A mulher sem rosto entregou uma pequena chave a Kravenox.');
    await say('Mulher sem Rosto', '— Para a última porta. Dentro dele.');
    await nar('O livro de Thornox se abriu sozinho: um coração, e dentro dele, uma porta.');
    await say(T, '— Tem alguma coisa dentro de mim.');
    await say(K, '— Então vamos descobrir o que é. Juntos.');
    F().chaveNomes = 1;
    await L2.chapter(28, 'A Porta Dentro de Thornox');
    await G.fade(1, 20);
    G.enterDungeon('dentro');
    await G.fade(0, 30);
    await nar('Escuridão. Então, ao longe, uma pequena luz.');
    L2.done(); L2.saved();
  };

  // ===================== CAPS. 28–29 — DENTRO DE THORNOX =====================
  S.doisBebes = async function () {
    if (F().bebes) return; F().bebes = 1;
    await nar('Dois bebês lado a lado. Kravenox e Thornox. Entre eles, uma pequena esfera negra.');
  };
  S.leitorExplica = async function () {
    if (F().leitorExplicou) return;
    if (!F().bebes) { await nar('Alguém espera mais adiante. Primeiro, a luz.'); return; }
    F().leitorExplicou = 1;
    await say(PL, '— Você demorou. Thornox nasceu como uma porta. Para separar existência e esquecimento. Para permitir que a Origem e o Primeiro Silêncio existissem sem destruir um ao outro.');
    await L2.vision(['A Origem queria criar; o Primeiro Silêncio queria apagar. Entre eles surgiu uma pequena luz. A Origem tocou a luz; o Silêncio também. E a luz se dividiu.', 'Uma metade tornou-se Thornox. A outra, Kravenox.'], 'estrelas');
    await say(PL, '— Vocês dois eram uma única escolha. A marca não era uma marca. Era uma promessa: se um de vocês esquecesse, o outro lembraria.');
    await say(T, '— Nossa mãe sabia que um dia teríamos que escolher entre nós. E escolheu não escolher.');
    await say(K, '— Isso parece mesmo uma coisa que ela faria.');
    await say(PL, '— O Primeiro Silêncio quer se tornar Thornox. Se destruírem o Silêncio, vocês também serão destruídos. Existe outra maneira: abrir a porta.');
  };
  S.portaAbre = async function () {
    if (F().thornoxSumiu) return;
    if (!F().leitorExplicou) { await nar('Uma porta no fundo da escuridão. Ainda não.'); return; }
    await say(T, '— Então vamos desaparecer.');
    await say(K, '— Não. Passei a vida inteira tentando impedir que alguém decidisse meu destino. Não vou deixar você decidir o seu sozinho.');
    await say(T, '— Você é impossível.');
    await say(K, '— Aprendi com você. Nós dois escolhemos.');
    await say(PS, '— Finalmente. Ele vai abrir a porta sozinho.');
    G.Audio.sfx('dark'); G.flash('#ffffff', 1); G.shake = 20;
    await L2.vision(['Uma memória de antes do primeiro mundo: o pai, muito mais jovem, diante de uma fogueira. Conversando com a própria Fonte, ainda viva.', '— Se eles descobrirem a verdade...\n— Eles precisam descobrir.\n— E se não conseguirem?\n— Então talvez estivesse esperando por eles desde o começo.'], 'entre');
    await nar('Quando Kravenox abriu os olhos, Thornox não estava mais ao seu lado.');
    F().thornoxSumiu = 1;
    L2.solo('kravenox');
    await L2.chapter(29, 'O que a Fonte Escondeu');
    await say(K, '— THORNOX!');
    L2.saved();
  };
  S.luzFonte = async function () {
    if (F().fonteFalou) return;
    if (!F().thornoxSumiu) { await nar('Uma luz fraca, quase apagada.'); return; }
    F().fonteFalou = 1;
    await say('A Fonte', '— Ele não consegue ouvir você. Ele está entre duas escolhas. E é por isso que você foi criado. Sua mãe criou seu corpo. Sua essência, Thornox criou.');
    await L2.vision(['Um Thornox muito jovem diante da Fonte:\n— Quero que ele tenha uma vida própria.\n— Vocês nunca poderão ser completamente separados. Ele sentirá suas dores. E você, as dele.', '— Por que fazer isso?\n— Porque não quero que meu irmão seja apenas uma parte de mim.'], 'despedida');
    await say(K, '— Ele escolheu me criar. Para que eu pudesse ser livre. E eu passei a vida inteira achando que precisava salvá-lo.');
    await say('A Fonte', '— Ele precisa escolher: continuar sendo apenas Thornox, ou aceitar tudo que existe dentro dele. Se aceitar, o Silêncio nascerá de novo. Se recusar, morrerá.');
    await say(K, '— Então existe uma terceira opção. Eu entro.');
    await say('A Fonte', '— Kravenox. Quando encontrar seu irmão, não tente salvá-lo. Lembre-o de quem ele é.');
  };
  S.thornoxAjoelhado = async function () {
    if (F().ch29) return;
    if (!F().fonteFalou) { await nar('Uma porta trancada. Uma luz mais atrás ainda tem algo a dizer.'); return; }
    L2.checkpoint('thornoxAjoelhado2');
    await S.thornoxAjoelhado2();
  };
  S.thornoxAjoelhado2 = async function () {
    if (G.state.party.length > 1) L2.solo('kravenox');
    await nar('Thornox estava ajoelhado, com a sombra do Primeiro Silêncio envolvendo seu corpo. Ainda consciente.');
    await say(T, '— Você não deveria ter vindo. Eu não sou seu irmão. Eu fui criado para ser uma parte de você. Eu criei você.');
    await say(K, '— E você existe por minha causa também. Porque você me escolheu.');
    await say(PS, '— Não dê ouvidos a ele. Uma parte dele pertence a mim.');
    await say(K, '— Talvez. Mas uma parte de mim também pertence a ele.');
    L2.heal();
    let lembrou = false;
    await G.battle(['sombraThornox'], { bg: 'dentro', music: 'chefe', noEscape: true, intro: 'A sombra do Primeiro Silêncio envolve Thornox.',
      choose: { who: 'kravenox', when: b => b.round >= 2, prompt: 'A sombra aperta Thornox cada vez mais.', options: [
        { label: 'Arrancar Thornox à força', run: async (b) => { await say('A Fonte', '— Não tente salvá-lo.'); for (const h of G.state.party) h.hp = Math.max(1, h.hp - Math.round(h.maxhp * 0.15)); return null; } },
        { label: 'Segurar a mão dele e lembrá-lo de quem ele é', run: async () => { lembrou = true; return 'end'; } }],
        hints: [{ round: 3, text: '"Quando encontrar seu irmão, não tente salvá-lo. Lembre-o de quem ele é."' }] } });
    await say(K, '— Thornox! Não deixe ele decidir quem você é! Escolha!');
    await say(T, '— Eu escolho ser Thornox. Você pode fazer parte de mim. Mas não será tudo o que eu sou.');
    G.Audio.sfx('silver'); G.flash('#ffffff', 1); G.shake = 16;
    await nar('A sombra se partiu. Uma metade entrou em Thornox; a outra permaneceu diante deles. Pela primeira vez, o Silêncio não parecia furioso. Parecia perdido.');
    await say(PS, '— Eu não sei existir sozinho. Vocês me aceitariam?');
    await say(K, '— Não sabemos.');
    await say(T, '— Mas podemos tentar.');
    await nar('A criatura tocou a mão de Thornox, e a escuridão desapareceu.');
    F().ch29 = 1;
    L2.regroup(); L2.heal();
    await G.fade(1, 20);
    G.enterField('auren', 26, 9, 'up');
    await G.fade(0, 30);
    await say(OR, '— Ainda não acabou.');
    await nar('A estrela dourada havia desaparecido. No lugar, um círculo, como um eclipse. No centro, uma silhueta: o Primeiro Leitor, observando.');
    await say(OR, '— Ele não queria destruir a história. Queria chegar ao fim dela. E o fim já foi escrito. Por você.');
    await nar('Thornox abriu o livro, e as páginas viraram sozinhas até a última: NO FIM, KRAVENOX TERÁ QUE ESCOLHER ENTRE O MUNDO E O IRMÃO.');
    await say(K, '— Eu não aceito essa escolha.');
    await say(PL, '— Venham até o fim.');
    await say(T, '— Juntos.');
    L2.done();
    await S.caminhoAteOFim();
  };

  // ===================== CAP. 30 — O CAMINHO ATÉ O FIM =====================
  S.caminhoAteOFim = async function () {
    await L2.chapter(30, 'O Caminho até o Fim');
    await say(T, '— Fecha o livro. Você está com medo?');
    await say(K, '— Estou.');
    await say(T, '— Eu também.');
    await nar('Uma estrada surgiu diante de Auren, na direção do horizonte, a leste. Parecia não ter fim.');
    const Cn = C();
    await Cn.begin('maeVolte', 'despedida');
    Cn.actor('mae', { img: () => X.sprite('mae', 'down', 0), x: 160, y: 156, z: 3, scale: 1.7, glow: 'rgba(255,240,200,0.7)', glowA: 0.4 });
    await say(MAE, '— Filho.');
    await Cn.caption('Ela ficou alguns segundos em silêncio.');
    await say(MAE, '— Volte.');
    await say(K, '— Eu vou.');
    await Cn.caption('Ela apertou a mão dele.');
    await say(MAE, '— Os dois.');
    await say(K, '— Os dois.');
    await Cn.end();
    F().ch30 = 1;
    await nar('Partiram ao amanhecer: Kravenox, Thornox, Erya, a Origem e os pais. A saída leste de Auren agora leva à estrada.');
    L2.saved();
  };
  S.sairAuren = async function () {
    if (!F().ch30) return;
    await L2.warpField('caminhoFim', 2, 4, 'right');
    if (!F().caminhoEntrou) { F().caminhoEntrou = 1; await say(T, '— Você acredita que o fim foi realmente escrito?'); await say(K, '— Não. Se estivesse escrito, não estaríamos escolhendo.'); await say(T, '— Boa resposta.'); }
  };
  S.voltarAuren = async function () { await L2.warpField('auren', 36, 14, 'left'); };
  S.ponteRio = async function () {
    if (F().ponteRio) return; F().ponteRio = 1;
    await nar('Uma ponte adiante. Abaixo dela, um rio completamente imóvel. A água parece um espelho.');
    await say(ER, '— Não olhem. Esse rio mostra aquilo que poderia ter sido.');
    await say(T, '— Tarde demais. Nós dois. Vivendo uma vida normal. Uma casa. Eu trabalhando numa oficina.');
    await say(K, '— Você destruiria metade da oficina.');
    await say(T, '— Só no primeiro dia.');
  };
  S.rioParado = async function () {
    await nar('Kravenox olha para a água e vê a si mesmo numa varanda, sem espinhos, sem cicatrizes. Ao lado dele, Thornox. Os dois envelhecem juntos.');
    await say(K, '— É bonito. Mas não é nosso.');
  };
  S.casaAbandonada = async function () {
    if (F().casaFim) return;
    L2.checkpoint('casaAbandonada2');
    await S.casaAbandonada2();
  };
  S.casaAbandonada2 = async function () {
    await nar('Ao anoitecer, uma pequena casa abandonada. Uma mesa, duas cadeiras e uma vela, que se acendeu sozinha. Na parede: VOCÊS JÁ ESTIVERAM AQUI.');
    await L2.vision(['Duas crianças muito pequenas: Kravenox e Thornox. O pequeno Kravenox chorava, e Thornox segurava sua mão.', '— Qual de vocês quer viver?\n— Os dois.\n— Só existe uma escolha.', '— Então fazemos outra.\nE os dois disseram juntos: — Nós dois.']);
    await say(T, '— O problema começou quando alguém percebeu que não conseguia nos separar.');
    G.Audio.sfx('door');
    await nar('A vela se apagou. A porta se abriu sozinha. O Primeiro Leitor estava do outro lado, sem sorriso.');
    await say(PL, '— Vocês chegaram longe demais. Estou cansado de ver histórias repetirem os mesmos erros. E não posso mudar. Porque eu também estou dentro da história. Sou o primeiro personagem.');
    await say(PL, '— Alguém precisa chegar à última página e escrever a última frase. Quem escrever decide como todos continuarão. Se você se recusar, Thornox morrerá.');
    await say(K, '— Você continua oferecendo duas opções. Nós sempre escolhemos uma terceira.');
    await say(PL, '— Alguém precisa ficar aqui. Nos encontramos no fim. Talvez.');
    F().casaFim = 1; L2.done();
    L2.heal(); L2.saved();
  };
  S.ultimaPagina = async function () {
    if (!F().casaFim) { await nar('A estrada continua. Ainda é cedo para o fim.'); G.Field.px -= 1; return; }
    if (F().ch31) return;
    L2.checkpoint('ultimaPagina2');
    await S.ultimaPagina2();
  };
  S.ultimaPagina2 = async function () {
    await nar('Uma porta sem maçaneta. ÚLTIMA PÁGINA. Do outro lado, uma mesa, e sobre ela um livro aberto na última página, vazia. Uma palavra surgiu sem que mão alguma a escrevesse: ESCOLHA.');
    await say(PS, '— Agora vocês entendem. O verdadeiro inimigo nunca foi o fim. Era o medo de escolher o que vem depois.');
    await nar('No centro da página surgiu outra palavra: COMEÇO.');
    await L2.chapter(31, 'O Começo Depois do Fim');
    await say(OR, '— A última página fechou o caminho. Estamos dentro da escolha.');
    await nar('Uma pergunta surgiu: O QUE VOCÊ DESEJA SALVAR?');
    await say(K, '— Meu irmão.');
    await nar('E O MUNDO? ...ENTÃO ESCOLHA.');
    await say(T, '— Não responda. É uma armadilha.');
    await say(PL, '— Não existe escolha sem consequência. O que eu não sabia era o que vocês fariam quando chegassem ao fim.');
    await nar('A página mostrou três caminhos.');
    for (;;) {
      const c = await G.choose('A última página:', ['SALVAR O MUNDO', 'SALVAR THORNOX', 'RECOMEÇAR']);
      if (c === 2) break;
      await say(T, c === 0 ? '— E eu? Você ia me deixar? Não. Olha a terceira.' : '— E o mundo? Você ia deixá-lo? Não. Olha a terceira. Esse é o nosso.');
    }
    await say(OR, '— Talvez o mundo que conhecemos não sobreviva.');
    await say(T, '— Se pudermos escolher o que vem depois.');
    const Cn = C();
    await Cn.begin('ultimaLuz', 'despedida');
    Cn.actor('mae', { img: () => X.sprite('mae', 'down', 0), x: 130, y: 156, z: 3, scale: 1.5, glow: 'rgba(255,240,200,0.7)', glowA: 0.4 });
    Cn.actor('pai', { img: () => X.sprite('pai', 'down', 0), x: 190, y: 156, z: 3, scale: 1.5, glow: 'rgba(255,230,160,0.7)', glowA: 0.3 });
    await Cn.caption('Antes da luz, a mãe segurou a mão de Kravenox, e o pai a de Thornox. Ninguém disse adeus.');
    await say(PAI, '— Eu escolhi tentar. Agora é a vez de vocês.');
    await say(MAE, '— Os dois.');
    await Cn.end();
    await say(PL, '— Esperem! Vocês não sabem o que estão fazendo.');
    await say(K, '— Pela primeira vez, isso é exatamente o que queremos.');
    G.Audio.sfx('silver'); G.flash('#ffffff', 1);
    await G.fade(1, 60, '#ffffff');
    await G.narrate(['A luz tomou tudo.\nA Origem. Erya. A mãe, o pai. Thornox. Kravenox.', 'Nem tempo, nem espaço, nem história, nem memória.\nApenas silêncio.', 'Então um coração bateu.\nUma vez. Duas. Três.'], { hold: 160, color: '#3a3a4a', bg: '#ffffff' });
    G.Audio.sfx('heart');
    F().ch31 = 1; F().origemHumana = 1;
    L2.setParty(['kravenox', 'thornox', 'erya', 'origem']);
    L2.heal();
    G.enterField('semNome', 13, 16, 'up');
    await G.fade(0, 60);
    G.Audio.play('semNome');
    await nar('Kravenox abriu os olhos. Estava deitado sobre a grama. O céu era azul, e o vento era suave.');
    await say(K, '— THORNOX!');
    await say(T, '— Estou aqui! ...Acho que sim. Lembro de algumas coisas. De você.');
    await say(K, '— Então é suficiente.');
    await nar('Thornox parecia mais jovem: sem cicatrizes, sem marcas, sem sombras.');
    await say(T, '— Você percebeu que não sabemos quase nada? E não está com medo?');
    await say(K, '— Estou.');
    await say(T, '— Ótimo. Significa que estamos vivos.');
    await say(ER, '— Tecnicamente... não deveriam estar. Lembro apenas o suficiente.');
    await say(K, '— E nossos pais?');
    await say(ER, '— Não sei.');
    await say(OR, '— Não estamos sozinhos.');
    await nar('A Origem estava atrás deles. Parecia humana. Completamente humana.');
    await say(OR, '— Escolhi. Agora descubro quem sou sem precisar ser a Origem.');
    await nar('A Origem entrou no grupo.');
    await nar('No céu, uma estrela negra, pequena e distante, mas viva. E, ao lado dela, uma estrela dourada. No livro de Erya: ALGUMAS HISTÓRIAS TERMINAM. OUTRAS APENAS MUDAM DE NOME. ESTA AINDA NÃO TERMINOU.');
    L2.done();
    await L2.chapter(32, 'Um Mundo sem Nome', ['O primeiro amanhecer daquele mundo chegou devagar.']);
    await say(ER, '— O mundo não tem nome. Não existe nenhum mapa. As pessoas chamam o lugar onde vivem de... casa.');
    await say(K, '— Talvez seja suficiente.');
    F().semNomeCidade = 1;
    L2.saved();
  };

  // ===================== CAP. 32 — UM MUNDO SEM NOME =====================
  S.senhoraSemNome = async () => { await say('Uma Senhora', F().ch41 ? '— Vocês voltaram! Os viajantes das estrelas. Fiz pão.' : '— Viajantes? De onde vieram? ...Ninguém aqui sabe de onde veio. Então somos parecidos.'); };
  S.homemEstatua = async () => { await say('Um Homem', '— A estátua? Ninguém sabe quem é. Ela sempre esteve aqui.'); };
  S.mercadorSemNome = async function () {
    await say('Mascate de Cinzas', '— Não lembro de onde vim. Mas lembro dos preços. Engraçado, né?');
    await G.shop('Mascate de Cinzas', ['orvalho', 'paoReino', 'cristalEsc', 'folha', 'lanterna', 'nevoa', 'garraLivre', 'cajadoLivro', 'marcaLivre', 'mantoAuren'], 100);
  };
  S.casaSemNome = async () => nar(G.pick(['Uma casa sem número, sem nome na porta.', 'Lá dentro, alguém conta uma história para uma criança. A história não tem começo.']));
  S.rioSemNome = async () => nar('O rio onde eles acordaram. A água corre tranquila.');
  S.estatuaLivro = async function () {
    if (F().estatuaToque) { await nar('A estátua de alguém segurando um livro.'); return; }
    F().estatuaToque = 1;
    await nar('Na praça, a estátua de uma pessoa segurando um livro. Kravenox tocou a pedra e sentiu uma energia familiar.');
    await nar('Uma página apareceu no livro de Erya: QUANDO O PASSADO FOR ESQUECIDO, O FUTURO PODERÁ ESCOLHER.');
    await say(OR, '— Quem escreveu fomos nós. Não nesta vida. Na primeira.');
    await say(K, '— Eu sabia que tinha uma pegadinha.');
  };
  S.meninaDesenho = async function () {
    if (F().estrelaVermelha) return;
    if (!F().estatuaToque) { await say('Uma Menina', '— ...'); await nar('Ela desenha em silêncio. Talvez fale com vocês depois.'); return; }
    await G.fade(0.6, 30, '#000020');
    F().noiteSemNome = 1;
    await nar('Naquela noite, as pessoas acenderam lanternas na praça. Ninguém esperava que Kravenox fosse um rei. Ele era apenas um homem sentado numa praça.');
    await say(T, '— Você está feliz?');
    await say(K, '— Sim. Talvez justamente por não saber quem fomos.');
    await say('Uma Menina', '— Você é o homem das estrelas?');
    await nar('Ela mostrou um desenho: duas estrelas, uma negra e uma dourada, e duas pessoas embaixo.');
    await say('Uma Menina', '— Eu sonho com elas. Vocês estão correndo. De uma coisa que ainda não chegou.');
    await nar('No céu, ao lado das duas estrelas, havia uma terceira. Vermelha. No livro de Erya: O RECOMEÇO CRIOU ALGO QUE NÃO EXISTIA ANTES. UMA HISTÓRIA SEM AUTOR.');
    G.Audio.sfx('boom'); G.shake = 8;
    await nar('A estrela vermelha desceu como uma semente e caiu além das montanhas, a leste.');
    await say(T, '— Nós acabamos de chegar. Na verdade, eu esperava uma vida tranquila.');
    await say(K, '— Então escolheu o irmão errado.');
    await say(T, '— Isso eu já sabia.');
    await G.fade(0, 30);
    F().noiteSemNome = 0; F().estrelaVermelha = 1;
    await nar('A menina abriu um caderno: EU LEMBRO DO MUNDO ANTERIOR. E LEMBRO DE COMO ELE TERMINOU. Na última página havia apenas um nome: KRAVENOX.');
    L2.saved();
  };
  S.irMontanhas = async function () {
    if (!F().estrelaVermelha) { await nar('A estrada para leste vai até as montanhas. Ainda não há motivo para ir.'); G.Field.px -= 1; return; }
    await L2.warpField('montanhas', 2, 8, 'right');
    if (!F().ch33) { F().ch33 = 1; await L2.chapter(33, 'A Menina que Lembrava', ['A estrada até as montanhas levou dois dias.']); }
  };
  S.voltarSemNome = async function () { await L2.warpField('semNome', 30, 10, 'left'); };
  S.cristalVermelho = async () => nar('Um cristal vermelho. Pulsa como se respondesse a alguém dentro da montanha.');
  S.casaFloresta = async () => nar('Uma casinha no meio da floresta. Sai fumaça da chaminé. Ninguém atende.');

  // ===================== CAPS. 33–35 — AS MONTANHAS =====================
  S.lioraSegue = async function () {
    if (F().lioraVeio) return; F().lioraVeio = 1;
    await say(T, '— Kravenox. Alguém está nos seguindo.');
    await nar('No livro de Erya: NÃO OLHE PARA TRÁS. Tarde demais. No alto de uma colina estava a menina do caderno.');
    await say(LI, '— Eu precisava encontrar vocês. Meu nome é Liora. Eu lembro. De tudo. Do mundo antigo. Eu fui a última pessoa que vocês encontraram antes de o mundo acabar.');
    await say(OR, '— Quem pediu que você lembrasse?');
    await say(LI, '— Você. Antes do recomeço. E eu devia dizer: o Primeiro Leitor mentiu. O mundo não recomeçou. Nós atravessamos para outro. O último mundo. Onde as possibilidades que vocês recusaram continuam existindo.');
    await say(K, '— E a estrela vermelha?');
    await say(LI, '— Não é uma possibilidade. É uma pessoa. A que vocês deixaram para trás. Kravenox.');
    await nar('Liora acompanha o grupo. A montanha da estrela vermelha fica ao norte da estrada.');
    L2.saved();
  };
  S.montanhaAbre = async function () {
    if (!F().lioraVeio) { await nar('A montanha tremeu. Uma luz vermelha pulsa lá dentro. Mas há alguém chamando na estrada, atrás de vocês.'); G.Field.py += 1; return; }
    if (F().ch35) { await nar('A montanha está quieta agora.'); G.Field.py += 1; return; }
    L2.checkpoint('outroKravenox');
    await S.outroKravenox();
  };
  S.outroKravenox = async function () {
    if (F().kalt) return S.aveline();
    G.Audio.sfx('boom'); G.shake = 14;
    await nar('A terra se abriu, e uma luz vermelha surgiu no interior da montanha. No topo, uma figura: Kravenox, mas não o que estava ali. Armadura negra, olhos vermelhos, uma espada.');
    await say(KA, '— Finalmente encontrei vocês. Sou o Kravenox que escolheu o mundo. Enquanto vocês escolheram recomeçar, eu escolhi ficar. Alguém precisava pagar o preço.');
    await say(T, '— O que você quer?');
    await say(KA, '— Meu lugar. Este mundo. O único onde ele ainda pode ser feliz. Meu irmão. No meu mundo, Thornox morreu. Eu tentei impedir. Quero impedir que ele tenha o mesmo destino.');
    L2.heal();
    let falou = false;
    await G.battle(['kravenoxAlt'], { bg: 'montanhas', music: 'chefe', noEscape: true, intro: 'O outro Kravenox desce a montanha com a espada erguida.',
      choose: { who: 'thornox', when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.6, prompt: 'Thornox olha para o outro Kravenox.', options: [
        { label: 'Lutar ao lado do irmão', run: async () => { await say(KA, '— Você não entende.'); return null; } },
        { label: '"Você não precisa ser a versão que perdeu."', run: async () => { falou = true; return 'end'; } }],
        hints: [{ round: 4, who: LI, text: '— Ele não veio para matar. Veio porque perdeu o irmão. Thornox... fala com ele.' }] } });
    await say(T, '— Você não precisa lutar. Você não precisa continuar sendo a versão que perdeu.');
    await nar('Pela primeira vez, o outro Kravenox hesitou. No caderno de Liora: A ESCOLHA AINDA NÃO TERMINOU.');
    await say(K, '— Então escolha.');
    await nar('A espada começou a desaparecer. Mas, antes que ele respondesse, uma voz surgiu atrás de todos: — Não.');
    F().kalt = 1;
    L2.checkpoint('aveline');
    await S.aveline();
  };
  S.aveline = async function () {
    await L2.chapter(34, 'Aveline');
    await nar('O Primeiro Leitor estava ali, e não estava sozinho. Ao lado dele havia uma figura de capa vermelha. Ela retirou o capuz: jovem, muito jovem, mas com olhos de milhares de anos.');
    await say(LI, '— Não pode ser. A pessoa que escreveu o primeiro mundo.');
    await say(AV, '— Meu nome é Aveline. A primeira pessoa que existiu. Escrevi o primeiro mundo. E todos vocês. Foram personagens. Agora não. Porque vocês quebraram a história. Criaram um mundo onde o destino não existe.');
    await say(K, '— Isso parece bom.');
    await say(AV, '— É. E é exatamente por isso que é perigoso. E você, outro Kravenox, é a primeira coisa que nasceu fora da minha história. Agora outros também poderão nascer.');
    await nar('No caderno de Liora, uma lista de nomes. No final: THORNOX, O PRIMEIRO SILÊNCIO.');
    G.Audio.sfx('dark'); G.shake = 14;
    await nar('Uma figura apareceu no alto da montanha. Era Thornox, completamente diferente: olhos brancos, roupa negra, e ao redor dele não havia luz. Havia ausência.');
    await say(TA, '— Então você é o irmão que escolheu viver. Eu sou o que foi destruído. Quero aquilo que me tiraram. Uma escolha. Quero que você seja eu.');
    await say(AV, '— Não deixem que eles se toquem! Se as duas versões se unirem, o Primeiro Silêncio terá um corpo.');
    await say(T, '— Dessa vez, eu vou.');
    L2.heal();
    let escolheu = false;
    await G.battle(['thornoxSilencio'], { bg: 'montanhas', music: 'chefe', noEscape: true, intro: 'Thornox, o Primeiro Silêncio, desce a montanha.',
      choose: { who: 'thornox', when: b => b.round >= 2, prompt: 'O outro Thornox espera.', options: [
        { label: 'Apagar a ausência com luz', run: async () => { await say(TA, '— Você escolheu existir. E eu não.'); return null; } },
        { label: 'Estender a mão: "Escolha quem quer ser."', run: async () => { escolheu = true; return 'end'; } }],
        hints: [{ round: 3, who: K, text: '— Thornox. Ele não quer vencer. Quer uma escolha.' }] } });
    await say(TA, '— E se eu não souber?');
    await say(T, '— Então começa por uma coisa simples. Não seja eu. Seja você.');
    await nar('A ausência ao redor da criatura começou a diminuir. O céu clareou, e a estrela vermelha perdeu força.');
    await say(AV, '— NÃO!');
    await nar('Uma página gigantesca se abriu no céu: SE ELES FOREM LIVRES, O AUTOR MORRERÁ.');
    await say(AV, '— Chegou a hora da última escolha. Minha.');
    L2.checkpoint('ultimaEscolhaAveline');
    await S.ultimaEscolhaAveline();
  };
  S.ultimaEscolhaAveline = async function () {
    await L2.chapter(35, 'A Última Escolha de Aveline');
    await nar('O mundo começou a desaparecer. Primeiro as montanhas, depois o rio. As casas da cidade ficaram transparentes.');
    await say(AV, '— Eu sinto muito. Criei este mundo. E por isso sou a única que pode encerrá-lo. No começo, eu tive medo. De criar algo que eu não pudesse controlar.');
    L2.heal();
    let escreveu = false;
    await G.battle(['aveline'], { bg: 'montanhas', music: 'aveline', noEscape: true, intro: 'A página no céu vira. O mundo desaparece um pouco mais.',
      setup: b => { b.enemies[0].immune = true; },
      choose: { who: 'kravenox', when: b => b.round >= 2, prompt: 'Uma única página branca resta no livro de Erya.', options: [
        { label: 'Atacar Aveline', run: async () => { await say(LI, '— Você começou a história. Mas eles começaram a liberdade!'); return null; } },
        { label: 'Escrever na página', run: async () => {
          await say(T, '— Escreve.'); await say(K, '— O quê?'); await say(T, '— Não sei.'); await say(K, '— Ótimo. Então será nosso.');
          for (let tent = 0; ; tent++) { const c = await G.choose('Kravenox escreve uma palavra:', ['FIM', 'RECOMEÇAR', 'CONTINUAR']); if (c === 2) break; await nar('A página vira e a palavra some. O mundo desaparece mais um pouco.'); if (tent === 1) await say(LI, '— Não é o fim. E nem é começar de novo. É só... seguir.'); }
          escreveu = true; return 'end'; } }],
        hints: [{ round: 3, who: T, text: '— A história não precisa de um autor. Porque nós estamos escrevendo agora.' }] },
      events: [{ when: b => b.round >= 2 && !b.vira, run: async (b) => { b.vira = 1; await nar('A cada página, uma parte do mundo some. Os golpes atravessam Aveline como se ela fosse só tinta.'); return null; } }] });
    G.Audio.sfx('memory'); G.flash('#ffffff', 1);
    await nar('CONTINUAR. O mundo parou. A página no céu deixou de virar. O rio voltou, as montanhas reapareceram, e as pessoas respiraram de novo.');
    await say(AV, '— Você não sabe o que vem depois.');
    await say(K, '— Ninguém sabe.');
    await say(T, '— Pode criar alguma coisa melhor.');
    await say(LI, '— Pela primeira vez, você não precisa saber.');
    await say(PL, '— A história deixou de precisar de nós.');
    await say(K, '— Você pode ficar. Como você quiser.');
    await say(AV, '— Eu não sei como fazer isso.');
    await say(T, '— Aprende.');
    await say(KA, '— E eu?');
    await say(K, '— Fica.');
    await nar('O outro Kravenox apertou a mão de Thornox, e a energia vermelha desapareceu. Já não havia duas versões disputando o mesmo mundo. Havia duas pessoas, dois caminhos.');
    F().ch35 = 1; L2.done();
    await G.fade(1, 20);
    G.enterField('semNome', 14, 12, 'up');
    F().noiteSemNome = 1;
    await G.fade(0, 30);
    await nar('Naquela noite, todos ficaram juntos na cidade. Aveline perto do fogo, conversando com o Primeiro Leitor. Erya escrevia. Liora desenhava. Os dois Kravenox conversavam com Thornox.');
    await say(T, '— Você acha que acabou?');
    await say(K, '— Não.');
    await nar('Então uma nova estrela apareceu — pequena, azul. Ela parece estar sobre a floresta, a leste, além das montanhas.');
    F().noiteSemNome = 0; F().estrelaAzul = 1;
    L2.saved();
  };

  // ===================== CAPS. 36–38 — A ESTRELA AZUL =====================
  S.casaSenhora = async function () {
    if (!F().estrelaAzul) { G.Field.py += 1; return S.casaFloresta(); }
    if (F().ch38fim) { G.Field.py += 1; await nar('A casa da senhora está vazia. Sobre a mesa, o mapa das possibilidades, aberto.'); return; }
    if (!F().ch36) {
      F().ch36 = 1;
      await L2.chapter(36, 'A Estrela Azul');
      await say('A Senhora', '— Finalmente. Vocês chegaram. Sei quem vocês escolheram ser. Entrem.');
      await nar('Sobre a mesa, um mapa de mundos — centenas, talvez milhares. Alguns brilhavam; outros estavam apagados. E um pequeno ponto azul.');
      await say('A Senhora', '— A primeira história que nunca foi contada. Alguém a viveu. Você, a primeira versão. Antes do rei, do guerreiro, de todas as escolhas.');
      await say(K, '— Por que nunca encontramos esse mundo?');
      await say('A Senhora', '— Porque vocês estavam ocupados tentando chegar ao fim. Agora vocês não têm fim. Esta chave abre uma porta que não existe. Escolhendo onde ela fica.');
      await say(K, '— Onde você quer que seja?');
      await say(T, '— Aqui.');
      await say('A Senhora', '— Quando encontrarem a primeira versão dele, não tentem mudá-lo. Talvez vocês tenham sido criados por ele.');
      G.Audio.sfx('door');
      await nar('Kravenox girou a chave no ar, e uma porta azul apareceu, sem parede, sem casa.');
    }
    await L2.warpField('arvoreNomes', 13, 9, 'up');
    if (!F().mundoBranco) { F().mundoBranco = 1; await nar('O céu era branco, o chão parecia feito de vidro, e não havia cidades nem pessoas. Apenas uma árvore enorme no centro daquele mundo.'); L2.saved(); }
  };
  S.portaAzulVolta = async function () { await L2.warpField('montanhas', 29, 6, 'down'); };
  S.ceuBranco = async () => nar('Nada além do branco. Nem céu, nem chão de verdade.');
  S.troncoNomes = async () => nar(F().ch38fim ? 'Onde estava a árvore, agora começa uma ponte entre os mundos.' : 'Milhares de pequenas marcas no tronco. Cada uma parece um nome. Ali: THORNOX. E ali: KRAVENOX.');
  S.arvoreDosNomes = async function () {
    if (F().ch38fim) return;
    L2.checkpoint('primeiroKravenox');
    await S.primeiroKravenox();
  };
  S.primeiroKravenox = async function () {
    if (!F().garoto) {
      await say(ER, '— Achou mesmo que eu deixaria vocês irem sozinhos?');
      await say(OR, '— Nós também.');
      await nar('Um garoto saiu de trás da árvore. Muito jovem, mas com o rosto de Kravenox.');
      await say('O Garoto', '— Então você é a versão que escolheu continuar. Eu sou a primeira. Preciso devolver uma coisa.');
      G.Audio.sfx('memory'); G.flash('#ffffff', 0.8);
      await nar('Uma pequena luz saiu da árvore e entrou no peito de Kravenox. Ele lembrou de tudo: da primeira vez que existiu, da primeira vez que segurou a mão de Thornox, e de uma promessa feita antes de qualquer mundo existir.');
      await say(K, '— Foi você. Você escreveu minha primeira escolha.');
      await say('O Garoto', '— Porque eu sabia que um dia você chegaria até aqui. Agora vocês descobrem por que foram escolhidos.');
      G.Audio.sfx('dark'); G.shake = 12;
      await nar('Uma das marcas da árvore começou a desaparecer. Era o nome de Kravenox. Uma sombra gigantesca apareceu: VOCÊ NÃO DEVERIA TER SOBREVIVIDO AO PRIMEIRO FIM.');
      F().garoto = 1;
      await L2.chapter(37, 'O Primeiro Kravenox');
      await nar('Uma luz. No centro, um homem alto, vestido de branco, com o rosto coberto por uma máscara. Ele a retirou: era o pai. O de antes, muito antes.');
      await say('O Homem de Branco', '— Eu sou aquele que criou a primeira escolha de vocês. Alguém está tentando apagar a primeira escolha. A versão que nunca escolheu Thornox. Ela se tornou o Primeiro Silêncio.');
      await nar('O Primeiro Silêncio surgiu, agora com um rosto: o rosto de Kravenox.');
      await say(PS, '— Eu fui a escolha que vocês recusaram. Quero que ele escolha. Entre ser seu irmão... ou ser a razão pela qual você existe.');
      await say(T, '— Kravenox, a vida inteira você tentou me proteger. Agora eu preciso proteger você. Confia em mim.');
      await nar('O pai segurou Kravenox: — Pela primeira vez, deixe que ele escolha sozinho.');
    }
    L2.solo('thornox'); L2.heal();
    let crianca = false;
    await G.battle(['silencioRosto'], { bg: 'arvoreNomes', music: 'silencio', noEscape: true, intro: 'Thornox toca a mão do Primeiro Silêncio. O mundo inteiro treme.',
      choose: { who: 'thornox', when: b => b.round >= 2, prompt: 'Dentro da luz, uma criança. Ele mesmo, completamente sozinho.', options: [
        { label: 'Afastar a criança', run: async () => { await nar('A criança chora. A sombra cresce.'); return null; } },
        { label: 'Ajoelhar e ficar com ela', run: async () => { crianca = true; return 'end'; } }],
        hints: [{ round: 3, text: '— Eu não quero ficar sozinho — diz a criança.' }] } });
    L2.regroup(); L2.heal();
    await say(T, '— Você está com medo? Então não fica. Eu vou ficar.');
    await nar('A criança segurou sua mão, e a sombra desapareceu.');
    await say(T, '— Não consegui sozinho. Quem estava comigo? Eu.');
    await say(K, '— Então você finalmente se encontrou.');
    await nar('A árvore voltou a brilhar, e o nome de Kravenox reapareceu. Agora havia dois nomes, KRAVENOX e THORNOX, ligados por uma única linha.');
    await say(OR, '— Você ainda precisa dizer a verdade. Quem criou a Fonte?');
    await say('O Homem de Branco', '— Eu. Mas a Fonte não foi o começo. Vocês foram. A primeira escolha de vocês criou a possibilidade da Fonte. Vocês não foram criados pela história. A história nasceu porque vocês escolheram existir.');
    await nar('No tronco, uma última inscrição: AINDA FALTA UMA ESCOLHA.');
    await L2.chapter(38, 'A Escolha que Faltava');
    await nar('O homem de branco havia desaparecido. No caderno de Liora, uma página preta: O QUE VOCÊ FARÁ COM O PODER DE ESCREVER?');
    for (;;) {
      const c = await G.choose('O que fazer com o poder de escrever?', ['Escrever um destino perfeito', 'Não escrever nada']);
      if (c === 1) break;
      await say(T, '— Se escrevermos, voltamos a ter um destino.');
    }
    await say(K, '— Finalmente temos uma escolha que não precisa ser feita.');
    await say(LI, '— As possibilidades estão acabando! Se a árvore desaparecer, todos os mundos possíveis desaparecem com ela!');
    await say(OR, '— Ela não precisa ser salva. Precisa ser libertada. O problema nunca foi escolher o caminho certo. Foi acreditar que existia apenas um.');
    await say(K, '— Então libertamos todos.');
    const Cn = C();
    await Cn.begin('arvoreLiberta', 'estrelas');
    await Cn.caption('Kravenox pôs a mão no tronco. Thornox, Erya, Liora e a Origem também. Milhares de portas começaram a aparecer: mundos, possibilidades, vidas.');
    await say('Uma Voz', '— Kravenox!');
    await say('Outra Voz', '— Thornox!');
    await say(T, '— Eles estão todos aqui.');
    await say(K, '— Não. Eles estão em algum lugar. E isso é diferente.');
    G.Audio.sfx('silver'); G.flash('#ffffff', 1);
    await Cn.tween(Cn, { bridge: 1 }, 120);
    await Cn.caption('A árvore explodiu em luz, mas não destruiu nada. As folhas viraram estrelas, e o tronco se transformou numa ponte gigantesca entre os mundos.');
    await say(AV, '— Vocês fizeram o que eu nunca consegui. Agora eu posso descansar.');
    await say(PL, '— Eu vou ler.');
    await say(T, '— Finalmente está fazendo o que deveria desde o começo.');
    await Cn.caption('Os dois atravessaram uma das portas e desapareceram.');
    await say(OR, '— A estrela dourada, a negra... e a azul. Tudo que vocês poderiam ter sido. E tudo que vocês ainda podem ser.');
    await say(T, '— O fim que estávamos procurando nunca foi um lugar.');
    await say(K, '— Era uma escolha. E nós já fizemos.');
    await Cn.end();
    F().ch38fim = 1; L2.done();
    L2.checkpoint('ultimoInimigoVem');
    await S.ultimoInimigoVem();
  };

  // ===================== CAP. 39 — O ÚLTIMO INIMIGO =====================
  S.ultimoInimigoVem = async function () {
    await L2.chapter(39, 'O Último Inimigo');
    await G.fade(1, 20);
    G.enterField('chamasAzuis', 14, 12, 'up');
    await G.fade(0, 30);
    await nar('Uma cidade. As ruas estavam vazias, as portas abertas, e em cada janela havia uma pequena chama azul.');
    await say(OR, '— Moram aqui. Dentro das chamas.');
    G.Audio.sfx('dark');
    await nar('Uma das chamas se apagou. Depois outra. E outra. Uma voz ecoou pelas ruas, vinda do norte da cidade: — Vocês não deveriam ter vindo.');
    F().ch39 = 1; L2.done();
    L2.saved();
  };
  S.janelaChama = async () => nar(F().azulNasce ? 'Uma chama azul na janela. Lá dentro, uma família janta.' : F().ch39 ? 'A chama azul treme, como se tivesse medo.' : 'Uma janela.');
  S.ultimoInimigoAparece = async function () {
    if (!F().ch39 || F().azulNasce) return;
    L2.checkpoint('ultimoInimigoLuta');
    await S.ultimoInimigoLuta();
  };
  S.ultimoInimigoLuta = async function () {
    await nar('Todas as portas se fecharam, as chamas se apagaram, e a cidade mergulhou na escuridão. No fim da rua, uma figura pequena, como uma criança, mas sem olhos, sem boca. Uma superfície completamente lisa.');
    await say(LI, '— O último inimigo.');
    await say('O Último Inimigo', '— Inimigo? Eu não sou inimigo. Sou o que sobra quando uma história perde todos os personagens.');
    await say(ER, '— O Vazio.');
    await say('O Último Inimigo', '— Vocês trouxeram tudo até mim. Todas as possibilidades. Estou devolvendo-as ao lugar de onde vieram. Aqui. Um mundo precisa de limites.');
    L2.heal();
    let separou = false;
    await G.battle(['ultimoInimigo'], { bg: 'chamasAzuis', music: 'ultimo', noEscape: true, intro: 'A cidade inteira começa a desaparecer.',
      choose: { who: 'kravenox', when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.5, prompt: 'Infinitos mundos tentam ocupar o mesmo espaço.', options: [
        { label: 'Fechar algumas portas', run: async () => { await say(K, '— Não. Quem decidiria quais mundos ficam?'); return null; } },
        { label: 'Destruir o Vazio', run: async () => { await say(T, '— Kravenox. Talvez ela esteja certa. Não podemos deixar todos os mundos ocuparem o mesmo espaço.'); return null; } },
        { label: 'Separar: cada mundo decide por si', run: async () => { separou = true; return 'end'; } }],
        hints: [{ round: 3, who: T, text: '— Ela não quer destruir os mundos. Quer impedir que eles se misturem.' }, { round: 6, who: OR, text: '— Fronteiras. Não para prender. Para que cada um tenha o seu caminho.' }] },
      events: [
        { when: b => b.round >= 2, run: async () => { G.Audio.sfx('dark'); await nar('A cidade inteira começou a desaparecer. Kravenox tentou avançar, mas era como se o próprio mundo o impedisse.'); for (const h of G.state.party) if (h.alive) h.ep = Math.max(0, h.ep - 15); return null; } },
        { when: b => b.round >= 5, run: async () => { await nar('Mais uma rua some. Mais chamas se apagam.'); for (const h of G.state.party) if (h.alive) h.ep = Math.max(0, h.ep - 15); return null; } }] });
    await say(K, '— Não vamos fechar. Vamos separar. Ninguém decide. Cada mundo decide por si.');
    await say('O Último Inimigo', '— Isso não existe.');
    await say(K, '— Agora existe.');
    const Cn = C();
    await Cn.begin('tresLuzes', 'livre');
    await Cn.caption('Kravenox abriu a mão, e uma luz dourada surgiu. Thornox fez o mesmo, e uma luz negra apareceu. As duas se encontraram, e uma terceira luz, azul, nasceu entre elas.');
    await Cn.tween(Cn, { k: 1 }, 100);
    await Cn.caption('A ponte começou a se dividir. Cada mundo ganhou seu próprio caminho; nenhum invadia o outro, nenhum era apagado.');
    await say('O Último Inimigo', '— Vocês encontraram uma solução. Mas eu também tenho uma escolha. Existir. Eu não sei como.');
    await say(T, '— Então aprenda. Do mesmo jeito que nós. Escolhendo.');
    await Cn.caption('A criatura ganhou olhos, depois uma boca, depois um rosto. Era uma menina, pequena e assustada.', 70);
    await say('A Menina', '— Eu existo.');
    await say(K, '— Agora você escolhe um nome. Qualquer um.');
    await say('A Menina', '— Azul. Sempre gostei dessa cor.');
    await say(T, '— Azul?');
    await say(LI, '— Então seu nome será Azul.');
    await Cn.end();
    F().azulNasce = 1;
    G.enterField('chamasAzuis', 14, 8, 'down');
    await G.fade(0, 20);
    await nar('A cidade voltou a existir. As chamas reapareceram, e agora havia pessoas nas ruas.');
    await say(OR, '— Você transformou o vazio em alguém.');
    await say(K, '— Ela fez isso sozinha.');
    await say(T, '— Esse é o verdadeiro significado de liberdade.');
    await G.fade(0.7, 30, '#000010');
    await nar('Naquela noite, Azul sentou-se perto do fogo, observando as chamas como se fossem algo novo.');
    await say(AZ, '— Estou tentando entender como é existir.');
    await say(K, '— Demora. Ainda estou aprendendo.');
    await say(T, '— E ele não é muito bom.');
    await nar('Azul riu. Pela primeira vez, o som do seu riso ecoou pela cidade, e nenhuma história tentou controlar aquilo. No céu, uma nova estrela começava a nascer. Verde.');
    await say(AZ, '— Meu primeiro mundo.');
    await G.fade(0, 30);
    L2.done();
    await L2.chapter(40, 'O Mundo Verde', ['A estrela verde ainda estava no céu quando o dia nasceu — pequena, trêmula.']);
    F().ch40 = 1;
    await say(AZ, '— Ela está apagando. Eu escolhi um mundo. Mas não sei como fazer ele existir. Eu era o vazio até ontem.');
    await say(K, '— E agora quer começar uma. Bem-vinda ao problema.');
    await say(T, '— Quando eu era pequeno, plantei uma árvore. Ela morreu na primeira semana. Chorei. Depois plantei outra.');
    await say(AZ, '— Essa história não ajudou nada.');
    await nar('Kravenox começou a rir. Thornox também. Azul riu junto. Então Kravenox se lembrou do pequeno bolso de couro que carregava desde o dia em que a Fonte morreu.');
    await say(T, '— Você ainda tem isso.');
    await say(K, '— Eu disse que ia plantar. Em algum lugar onde ninguém soubesse o que ela seria. Acho que encontrei o lugar.');
    await nar('Azul segura a semente com as duas mãos. (Leve-a até a borda da cidade, a leste.)');
    L2.saved();
  };
  S.azulCidade = async () => { await say(AZ, F().semPlantada ? '— Ela voltou! A estrela voltou!' : '— Onde eu planto? ...Onde eu quiser. Na borda da cidade, a leste.'); };
  S.lioraCidade = async () => { await say(LI, '— Eu desenho a primeira folha quando ela nascer.'); };
  S.habitanteChamas = async () => { await say('Morador', '— Dormimos e acordamos dentro das chamas. Agora estamos fora. É bom.'); };
  S.plantarSemente = async function () {
    if (!F().ch40 || F().semPlantada) return;
    L2.checkpoint('plantarSemente2');
    await S.plantarSemente2();
  };
  S.plantarSemente2 = async function () {
    await say(AZ, '— O que é isso?');
    await say(K, '— O que sobrou da Fonte. Não. O que a Fonte deixou para quem viesse depois.');
    await say(AZ, '— E se eu plantar errado?');
    await say(T, '— Então planta outra.');
    await nar('Azul ajoelhou-se e cavou a terra fria com os dedos. Colocou a semente, cobriu, e ficou olhando. Nada aconteceu.');
    await say(AZ, '— Viu? Errado.');
    await say(OR, '— Quanto tempo você esperou? Eu esperei uma eternidade antes de criar a primeira estrela. E não deu certo. Continuei porque queria ver o que vinha depois do erro.');
    const Cn = C();
    await Cn.begin('broto', 'livre');
    await Cn.tween(Cn, { sprout: 1 }, 140);
    await Cn.caption('Uma respiração. Duas. Dez. Então a terra se moveu. Um broto saiu do chão — verde, tão pequeno que quase não fazia sombra. No céu, a estrela verde brilhou mais forte que antes.');
    await say(AZ, '— Viu?! Ela voltou!');
    await Cn.caption('Azul começou a rir, depois a chorar, depois as duas coisas ao mesmo tempo. Erya abriu o livro: uma página nova, em branco. Fechou-o com cuidado. — Acho que essa não é para nós escrevermos.', 80);
    await Cn.end();
    F().semPlantada = 1;
    await nar('Ao meio-dia, uma porta apareceu no meio da praça. Ninguém se assustou; àquela altura, ninguém em lugar nenhum se assustava mais com portas.');
    await say(K, '— Vocês foram embora ontem. Disseram que iam descansar.');
    await say(AV, '— Tentamos.');
    await say(PL, '— Mas um mundo novo começou a ser escrito. E, pela primeira vez, eu não sei como ele começa.');
    await say(AV, '— Eu quis aprender.');
    F().leitorVolta = 1;
    G.Audio.sfx('door');
    await nar('À tarde, o vento mudou. Duas figuras caminhavam pela estrada da cidade — uma alta, de passos tranquilos; a outra com as mãos fechadas, como quem segura algo que não pode soltar.');
    await say(T, '— Não acredito.');
    const Cn2 = C();
    await Cn2.begin('seraVolta', 'seraphyne');
    Cn2.actor('se', { img: () => X.sprite('seraphyne', 'down', 0), x: 145, y: 156, z: 3, scale: 1.6, glow: 'rgba(170,110,255,0.7)', glowA: 0.4 });
    Cn2.actor('as', { img: () => X.sprite('aster', 'down', 0), x: 180, y: 156, z: 3, scale: 1.6 });
    await say(SE, '— Vocês fizeram uma bagunça.');
    await say(K, '— Bom te ver também.');
    await say(T, '— Você disse que voltaria quando a fronteira aguentasse sozinha.');
    await Cn2.caption('Seraphyne abriu a mão. A pequena escuridão sobre a palma estava quieta. Pela primeira vez, quieta.');
    await say(SE, '— Desde ontem. Você separou os mundos. Cada mundo agora segura a própria fronteira.');
    await say(K, '— Foi difícil?');
    await say(SE, '— Houve uma noite em que quase caiu. Em Auren. Quando o Primeiro Silêncio entrou. Não consegui impedir que ele passasse. Só consegui impedir que o resto passasse junto.');
    await say(T, '— Você segurou o resto sozinha.');
    await say(SE, '— Aster ajudou.');
    await say(AS, '— Um pouco.');
    await say(SE, '— Muito.');
    await say(T, '— Você não fugiu.');
    await say(SE, '— Não dessa vez.');
    await Cn2.end();
    F().seraVoltou = 1;
    await G.fade(0.7, 30, '#000010');
    await nar('Naquela noite, a cidade acendeu suas chamas azuis. Seraphyne dormiu sentada, com a cabeça encostada no ombro de Aster. Kravenox e Thornox ficaram acordados, como sempre.');
    await say(T, '— Ainda falta alguém.');
    await say(K, '— Ela prometeu. Ela vai estar no fim do caminho.');
    await say(T, '— Então vamos precisar encontrar o caminho.');
    await say(K, '— Amanhã.');
    await nar('Antes de dormir, Azul escreveu uma única frase, com letra torta, e enterrou o papel ao lado do broto. Ninguém viu o que estava escrito. Mas a estrela verde brilhou como se tivesse lido.');
    await G.fade(0, 30);
    await nar('Ao amanhecer, os viajantes começaram a voltar para casa. Para a cidade sem nome. Para o rio. (A saída ao sul da cidade leva de volta.)');
    F().ch41 = 1; L2.done();
    L2.saved();
  };
  S.seraphyneVolta = async () => { await say(SE, '— A fronteira aguenta. Eu também. Agora vou dormir uns cem anos. Ou uma noite.'); };
  S.asterVolta = async () => { await say(AS, '— Andamos na borda de todas as coisas. É bom ver o meio, para variar.'); };
  S.avelineCidade = async () => { await say(AV, '— Estou com as mãos sujas de tinta. Mas não escrevi nada. É estranho. É bom.'); };
  S.leitorCidade = async () => { await say(PL, '— Primeira página vazia. Estou lendo devagar.'); };

  // ===================== CAP. 41 — O QUE FICA DEPOIS DO FIM =====================
  S.voltarParaCasa = async function () {
    if (!F().ch41) return;
    if (F().ch41casa) { await L2.warpField('semNome', 13, 16, 'up'); return; }
    L2.checkpoint('oQueFica');
    await S.oQueFica();
  };
  S.oQueFica = async function () {
    await L2.chapter(41, 'O que Fica Depois do Fim', ['O dia nasceu tranquilo.']);
    F().ch41casa = 1;
    await G.fade(1, 20);
    G.enterField('semNome', 13, 16, 'up');
    await G.fade(0, 30);
    await nar('Nenhum céu se abriu, nenhuma voz chamou por Kravenox, nenhum mundo estava prestes a desaparecer. E, pela primeira vez, era exatamente isso que ele queria.');
    await say(T, '— Você está pensando demais.');
    await say(K, '— Sobre como tudo começou. Começou quando escolhemos existir. Depois escolhemos ficar juntos. E depois passamos o resto do caminho aprendendo que nenhuma dessas escolhas precisava ser perfeita.');
    await say(K, '— Vamos caminhar?');
    await say(T, '— Para onde?');
    await say(K, '— Não sei.');
    await say(T, '— Finalmente uma resposta de que eu gosto.');
    await nar('As pessoas os reconheciam — não como reis, nem como salvadores, apenas como aqueles dois irmãos que um dia chegaram sem saber de onde vinham. Kravenox não precisava mais ser lembrado por aquilo que havia feito. Bastava estar ali. (A colina fica ao norte da cidade.)');
    L2.done(); L2.saved();
  };
  S.colinaFinal = async function () {
    if (!F().ch41casa || F().lyraVoltou) return;
    L2.checkpoint('colinaFinal2');
    await S.colinaFinal2();
  };
  S.colinaFinal2 = async function () {
    await say(T, '— Olha.');
    await nar('No céu havia quatro estrelas: a dourada, a negra, a azul e a verde.');
    await say(K, '— Azul conseguiu. Criou seu próprio mundo.');
    await say(T, '— Kravenox.');
    const Cn = C();
    await Cn.begin('lyraVolta', 'livre');
    const ly = Cn.actor('ly', { img: () => X.sprite('lyra', 'down', 0), x: 160, y: 120, z: 3, scale: 1.6, alpha: 0, glow: 'rgba(200,220,255,0.9)', glowA: 0.6 });
    await Cn.tween(ly, { alpha: 1, y: 150 }, 90);
    await Cn.caption('Alguém subia a estrada, devagar, carregando uma pequena luz nas mãos, como quem segura uma lanterna. Kravenox conhecia aquele jeito de andar. Desde antes de qualquer mundo.');
    await say(K, '— Lyra.');
    await say(L, '— Vocês demoraram.');
    await Cn.caption('Thornox foi o primeiro a correr; Kravenox veio logo atrás. Os três se abraçaram no meio da estrada, e ninguém disse nada por muito tempo.', 90);
    await say(K, '— Como você nos encontrou?');
    await Cn.caption('Lyra ergueu o cristal. Dentro dele, milhares de luzes: o Abismo, a Vila sem Nome, Valdora, a Primeira Cidade, Thornox criança correndo na frente.');
    await say(L, '— Eu guardei tudo. Cada vez que vocês esqueciam alguma coisa, ela vinha parar aqui.');
    await say(T, '— Então você lembrou por nós.');
    await say(L, '— Eu prometi. Disse que estaria no fim do caminho.');
    await say(K, '— Mas isso não é o fim.');
    await say(L, '— Eu sei. É por isso que eu vim.');
    await Cn.end();
    F().lyraVoltou = 1;
    await S.finalLivro2();
  };
  S.finalLivro2 = async function () {
    const Cn = C();
    await Cn.begin('pracaFinal', 'livre');
    await Cn.caption('Quando voltaram para a cidade, Azul estava esperando, segurando um livro contra o peito.');
    await say(AZ, '— Vocês querem ver? "Era uma vez um mundo que não tinha nome. Nesse mundo, ninguém sabia de onde tinha vindo. Até que duas pessoas chegaram."');
    await say(K, '— Duas?');
    await Cn.caption('Ela virou a página: um desenho de dois irmãos, Kravenox e Thornox. Atrás deles, centenas de estrelas e uma pequena menina segurando um livro.');
    await say(AZ, '— Acho que essa história também é de vocês.');
    await say(AV, '— Não é. Essa história não é de vocês. É de quem a estiver lendo.');
    await Cn.caption('Durante toda a jornada, eles haviam procurado o autor: a Fonte, a Origem, o Primeiro Leitor, o primeiro Kravenox. Mas uma história não pertencia apenas a quem a escrevia. Pertencia também a quem escolhia continuar ouvindo.', 100);
    await say(K, '— Acho que agora acabou mesmo.');
    await say(T, '— Finalmente. ...Um pouco triste. Mas está tudo bem.');
    await say(K, '— Está.');
    await Cn.caption('Os dois se abraçaram. Não havia batalha, nem magia, nem profecia. Apenas dois irmãos, depois de tudo, ainda juntos.', 80);
    await Cn.caption('Naquela noite, todos se reuniram uma última vez. Liora guardou seu caderno. Erya fechou o livro. Aveline deixou a caneta sobre a mesa. O Primeiro Leitor fechou sua última página. A Origem olhou para o céu. Seraphyne fechou a mão, e a pequena escuridão adormeceu. Lyra colocou o cristal entre os dois irmãos.', 120);
    await say(K, '— O que você escreveu?');
    await say(AZ, '— Querem saber o final? "E talvez eles estivessem esperando por ele desde o começo."');
    await say(T, '— Bonito.');
    await say(K, '— Quem é "ele"?');
    await say(AZ, '— Isso cada pessoa que ler decide.');
    await Cn.caption('Kravenox riu. E, naquele instante, percebeu que não precisava de outra resposta.', 80);
    await Cn.end();
    G.Audio.play('livre');
    await G.narrate(['As estrelas continuaram brilhando. O mundo continuou girando. Novas histórias começaram; outras terminaram.', 'Algumas seriam felizes; outras, difíceis. Mas todas teriam algo em comum: uma escolha.', 'Porque foi assim que tudo começou. E foi assim que tudo terminou.\nNão com uma batalha, nem com uma morte, nem com um herói derrotando o último inimigo.', 'Mas com uma escolha simples:\ncontinuar.', 'Kravenox olhou uma última vez para o céu. Thornox estava ao seu lado.\nE os dois começaram a caminhar — sem destino, sem profecia, sem autor.', 'Apenas irmãos.\nE livres.'], { hold: 220, color: '#e8e0ff' });
    F().l2fim = 1; L2.done();
    L2.heal();
    G.enterField('semNome', 13, 3, 'down');
    D.save();
    await G.credits2(3);
  };
  // depois do fim: quem continuar acha o grupo inteiro em paz, na cidade sem nome
  S.azulFinal = async () => { await say(AZ, F().l2fim ? '— Estou escrevendo outra. Ainda não posso mostrar.' : '— Ainda não terminei.'); };
  S.lioraFinal = async () => { await say(LI, '— Eu não preciso mais lembrar sozinha.'); };
  S.avelineFinal = async () => { await say(AV, '— De quem a estiver lendo.'); };
  S.lyraFinal = async () => { await say(L, '— O cristal está mais leve. Acho que vocês finalmente estão lembrando sozinhos.'); };
  S.seraFinal = async () => { await say(SE, '— Se a fronteira cair, você vem me buscar. Eu sei. Mas ela não vai cair.'); };
  S.asterFinal = async () => { await say(AS, '— Uma cidade sem nome. Parece a minha. Gosto daqui.'); };
})();
