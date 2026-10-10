'use strict';
// Livro II — O Reino da Escolha. Parte 2: capítulos 15 a 22 (O Homem Antes do Rei).
(function () {
  const S = G.story, D = G.data, X = G.gfx, L2 = S.L2;
  const F = () => G.state.flags;
  const say = (n, t) => G.say(n, t);
  const nar = t => G.say(null, t);
  const C = () => G.Cine;
  const K = 'Kravenox', T = 'Thornox', L = 'Lyra', SE = 'Seraphyne', ER = 'Erya', PAI = 'O Pai', MAE = 'A Mãe', AS = 'Aster', OR = 'A Origem', BI = 'O Bibliotecário', PL = 'O Primeiro Leitor';

  // ===================== INÍCIO DA PARTE 2 =====================
  S.l2parte2 = async function () {
    const f = F(); f.l2p2 = 1;
    if (G.state.fullParty) L2.regroup();
    L2.setParty(['kravenox', 'thornox', 'lyra', 'seraphyne']);
    L2.heal();
    G.fadeA = 1;
    G.Audio.play('aster');
    await G.narrate(['PARTE 2\nO Homem Antes do Rei'], { hold: 160, color: '#c9a24a' });
    await L2.chapter(15, 'O Mundo sem Nome', ['Durante três dias, ninguém partiu. A cidade precisava ser reconstruída.']);
    G.enterField('cidadeAster', 16, 13, 'down');
    await G.fade(0, 30);
    await nar('Pela primeira vez em milhares de anos, aquela cidade parecia viva — não porque suas construções estavam inteiras, mas porque seus habitantes tinham deixado de esperar pelo fim.');
    await say('Uma Criança', '— Você é o monstro?');
    await say(K, '— Depende de quem está contando a história.');
    await say('Uma Criança', '— Você parece cansado. Então você não é um monstro. Monstros não ficam cansados.');
    await nar('Thornox começou a rir.');
    await say(K, '— E você? Ainda me considera seu inimigo?');
    await say(T, '— Nunca considerei.');
    const Cn = C();
    await Cn.begin('salaMapa', 'aster');
    Cn.green = 1;
    await Cn.caption('No quarto dia, Aster os chamou à sala do mapa e pôs sobre a mesa uma esfera que brilhava em verde. Dentro dela havia oceanos, florestas, montanhas, desertos. E vida. Nenhuma criatura parecia humana.');
    await say(AS, '— O primeiro mundo novo. Desde o nascimento da Origem.');
    await say(ER, '— Elas nasceram sozinhas.');
    await L2.mind(['— O que são?\nFilhos.\n— Filhos de quem?\nDeles mesmos.'], '#e0e8ff');
    await say(ER, '— A Origem não está mais criando mundos. Os mundos estão começando a criar a si mesmos.');
    await say(AS, '— E o que faremos?');
    await say(K, '— Nada. Pela primeira vez, podemos deixar alguma coisa existir sem tentar controlá-la.');
    await say(T, '— Você está aprendendo.');
    await say(K, '— Não exagera.');
    await Cn.end();
    await nar('Naquela noite, o pai estava sozinho no alto da muralha, ao norte. Agora parecia completamente humano. Apenas um homem velho.');
    L2.saved();
  };
  S.criancaMonstro = async () => { await say('Uma Criança', '— Monstros não ficam cansados. Você fica. Então tá tudo bem.'); };
  S.maeAster = async () => { await say(MAE, F().perdaoPai ? '— Ele falou com você. Eu vi pela janela. Obrigada.' : '— Seu pai está na muralha. Eu sei. Ainda não consigo ir até lá.'); };
  S.lyraAster = async () => { await say(L, '— Eu estou bem. Só estou pensando nas memórias. Alguém precisa cuidar delas.'); };
  S.paiNaMuralha = async function () {
    if (F().perdaoPai) return;
    await say(K, '— Você sabia que isso aconteceria?');
    await say(PAI, '— Não. Você sempre parece saber tudo... Era apenas medo. De perder vocês.');
    await say(K, '— E por isso tentou controlar tudo. Prendeu nosso primeiro irmão. Abandonou nossa mãe.');
    await say(PAI, '— Sim.');
    await say(K, '— Você se arrepende?');
    await say(PAI, '— Todos os dias.');
    await say(K, '— Então faça alguma coisa. Vá até ela.');
    await say(PAI, '— E se ela não me perdoar?');
    await say(K, '— Então aceite.');
    await say(PAI, '— Você consegue me perdoar?');
    await say(K, '— Ainda não. Mas posso parar de odiar.');
    await nar('O pai começou a chorar. Kravenox colocou a mão em seu ombro.');
    await say(K, '— Talvez seja um começo.');
    await nar('Thornox o encontrou pouco depois.');
    await say(T, '— Você falou com ele?');
    await say(K, '— Sim. Ainda está vivo. Thornox. O que acontece quando a guerra termina?');
    await say(T, '— Não sei. Então descobrimos. Juntos.');
    F().perdaoPai = 1;
    await nar('Na manhã seguinte, Erya apareceu correndo: um portal verde se abriu no meio da praça.');
    L2.saved();
  };
  S.portalMundoNovo = async function () {
    if (!F().l2p1fim || F().partiuL2) return;
    if (!F().perdaoPai) { await nar('Antes de partir, Kravenox sente que precisa falar com o pai. Ele está na muralha, ao norte.'); G.Field.py += 1; return; }
    L2.checkpoint('partidaMundoNovo');
    await S.partidaMundoNovo();
  };
  S.partidaMundoNovo = async function () {
    await say(ER, '— Kravenox! Encontramos uma coisa. No novo mundo. Enterrado no primeiro continente.');
    await nar('Ela entregou um fragmento de pedra verde. No centro havia uma marca negra que Kravenox reconheceu na hora: o seu próprio símbolo.');
    await L2.vision(['Uma cidade grande e antiga, construída sobre uma montanha. No centro, uma estátua.\nA estátua de Kravenox.', 'Templos, exércitos, crianças, sacerdotes, todos venerando o mesmo símbolo. Depois a cidade em guerra, em chamas, vazia.', 'Um livro. Um homem escrevendo:\n"Aquele que carrega a Origem retornará. Ele será chamado de Rei dos Espinhos."', '"Ele salvará os mundos. Ele destruirá os mundos. Ele será deus. Ele será demônio."']);
    await say(K, '— Eles estão criando uma religião. E eu ainda nem cheguei lá.');
    await L2.mind(['— Quem está escrevendo isso?\nAlguém que lembra.\n— Lembra do quê?\nDe você.'], '#e0e8ff');
    await say(K, '— Vamos. Para o novo mundo. É exatamente por não sabermos o que existe lá que vamos.');
    await say(MAE, '— Eu vou também. Agora é minha vez de conhecer o mundo.');
    await say(PAI, '— Eu também. Tenho certeza? Não.');
    await say(K, '— Ótimo.');
    await say(T, '— Essa família tem um problema sério com certeza.');
    await nar('Lyra não riu. Segurava o cristal contra o peito.');
    await say(L, '— Eu não vou.');
    await say(T, '— Como assim?');
    await say(L, '— Alguém precisa ficar. A cidade não precisa mais de nós. Mas as memórias precisam. Todos os lugares por onde vocês passaram tentaram apagar alguma coisa. A Fonte. Os Reis. O Primeiro. Se esse novo mundo tentar apagar vocês, alguém precisa lembrar quem vocês são.');
    await say(T, '— Nós acabamos de nos encontrar.');
    await say(L, '— Eu sei. Eu fui a primeira coisa que a Fonte tirou de vocês. Não vou deixar que tirem mais nada.');
    await say(K, '— Então isso é uma despedida?');
    const Cn = C();
    await Cn.begin('lyraFica', 'despedida');
    const ly = Cn.actor('ly', { img: () => X.sprite('lyra', 'down', 0), x: 160, y: 156, z: 3, scale: 1.7, glow: 'rgba(200,220,255,0.8)', glowA: 0.5 });
    await say(L, '— Não. É uma promessa.');
    await Cn.caption('Ela colocou o cristal nas mãos dele por um instante. Estava quente.');
    await say(L, '— Quando vocês esquecerem o caminho de casa, eu vou estar no fim dele.');
    await say(T, '— Você continua mentindo mal.');
    await say(L, '— E você continua chorando fácil.');
    await Cn.caption('O portal foi aberto. Dessa vez não havia medo, nem guerra, nem exército. Apenas uma estrada. As crianças acenaram. Lyra ficou na margem, com o cristal erguido como quem segura uma lanterna.', 90);
    void ly;
    await Cn.end();
    L2.setParty(['kravenox', 'thornox', 'seraphyne', 'erya']);
    await nar('Erya entrou no grupo.');
    F().partiuL2 = 1;
    G.state.bench.lyra && (G.state.bench.lyra.alive = true);
    await G.fade(1, 20);
    G.enterField('mundoNovo', 15, 14, 'up');
    await G.fade(0, 30);
    await nar('O novo mundo era silencioso. O céu tinha duas luas, o mar era verde, as árvores tinham folhas transparentes e montanhas flutuavam no horizonte.');
    await say(K, '— Bonito.');
    await say(T, '— Nunca ouvi você dizer isso.');
    await say(K, '— Não se acostume.');
    L2.done(); L2.saved();
  };

  // ===================== O MUNDO NOVO (caps. 15–16) =====================
  S.portalVoltaMN = async () => { await nar('O portal de volta já se fechou. Lyra ficou do outro lado, com as memórias.'); G.Field.py -= 1; };
  S.marVerde = async () => nar('O mar é verde. As ondas não fazem barulho.');
  S.montanhaFlutua = async () => nar('Uma montanha inteira flutua alguns palmos acima do chão.');
  S.pegadasEstrada = async function () {
    if (F().pegadas) return; F().pegadas = 1;
    await nar('A primeira estrada. Era antiga, muito antiga. Kravenox se ajoelhou: havia pegadas humanas.');
    await say(T, '— Mas ninguém esteve aqui.');
    await L2.vision(['A mesma estrada, milhares de anos antes. Uma criança caminhando sozinha, carregando um livro.', 'Era a criança da Primeira Origem. Mas ali ela não estava dentro dele. Estava caminhando. Viva.']);
    await L2.mind(['— Isso não aconteceu.\nAconteceu.\n— Mas você estava comigo.\nUma parte estava.\n— Então onde está a outra?\nNa cidade.'], '#e0e8ff');
  };
  S.cidadeMontanha = async function () {
    if (F().cidadeEspinhos) return;
    if (!F().pegadas) { await nar('A estrada continua para o norte, até as montanhas.'); return; }
    F().cidadeEspinhos = 1;
    const Cn = C();
    await Cn.begin('cidadeEspinhosLonge', 'espinhos');
    await Cn.caption('Ao longe, uma montanha começou a surgir onde antes não havia nada. Sobre ela, uma cidade — a mesma da visão, com a estátua dos Espinhos no centro.');
    G.Audio.sfx('dark');
    await Cn.tween(Cn, { head: 1 }, 60);
    await Cn.caption('No topo da montanha, a estátua virou a cabeça e olhou diretamente para ele.');
    await L2.mind(['Ela acordou.\n— Quem?\nA parte de mim que escolheu ficar fora.'], '#e0e8ff');
    await Cn.end();
    L2.saved();
  };
  S.entrarEspinhos = async function () {
    if (!F().cidadeEspinhos) return;
    await L2.warpField('espinhos', 15, 19, 'up');
    if (!F().ch16) {
      F().ch16 = 1;
      await L2.chapter(16, 'A Cidade dos Espinhos');
      await say(T, '— A estátua se mexeu.');
      await say(ER, '— Não é uma estátua.');
      await L2.mind(['Uma lembrança. Minha. Eu estive aqui antes.'], '#e0e8ff');
      await nar('A estrada parecia ter sido construída para eles. Mas soldados de armadura negra patrulham a subida.');
      L2.saved();
    }
  };
  S.voltarMundoNovo = async function () { await L2.warpField('mundoNovo', 35, 2, 'down'); };
  S.estradaMontanha = async function () {
    if (F().patrulha) return; F().patrulha = 1;
    await nar('Soldados de armadura negra barram a estrada. No peito, o símbolo dos Espinhos — mas invertido.');
    await say('Herdeiro', '— Ninguém sobe sem a permissão dos Herdeiros.');
    await say(K, '— Herdeiros de quê?');
    await say('Herdeiro', '— De você.');
    await G.battle(['herdeiro', 'herdeiroCap'], { bg: 'espinhos', intro: 'Os Herdeiros atacam!', noEscape: true });
    F().herdeiros = 1;
  };
  S.estatuaEspinhos = async () => nar(F().templo ? 'A estátua não se mexe mais. Mas parece esperar.' : 'A estátua de Kravenox. Os olhos de pedra acompanham cada passo.');
  S.temploParede = async () => nar('O templo central. As paredes estão cobertas de pinturas.');
  S.casaEspinhos = async () => nar(G.pick(['O símbolo dos Espinhos está pintado na porta.', 'Lá dentro, uma vela acesa diante de um espinho de pedra.']));
  S.fielEspinhos = async () => { await say('Fiel', '— Quatrocentos e vinte e sete anos. Minha avó esperou. A avó dela esperou. E você chegou num dia comum.'); };
  S.fielEspinhos2 = async () => { await say('Fiel', '— O livro diz que você será deus. E demônio. Eu só queria saber qual dos dois vem jantar.'); };
  S.mercadorEspinhos = async function () {
    await say('Mercador da Montanha', '— Relíquias dos Espinhos! Garras abençoadas, cajados... ah, é você. Desconto para o santo.');
    await G.shop('Mercador da Montanha', ['agua', 'paoReino', 'orvalho', 'cristalEsc', 'folha', 'nevoa', 'garraEspinhos', 'cajadoBranco', 'laminaFronteira', 'marcaViva', 'mantoEspinhos'], 80);
  };
  S.pracaEspinhos = async function () {
    if (F().espinhosChegou) return; F().espinhosChegou = 1;
    await nar('Do outro lado dos portões havia centenas de pessoas, todas ajoelhadas, em silêncio. Uma mulher muito velha, de olhos extremamente claros, levantou a cabeça e começou a chorar.');
    await say('A Velha', '— Finalmente. Você voltou. Há quatrocentos e vinte e sete anos esperamos. Porque você deixou a profecia.');
    await say(K, '— Eu nunca estive aqui.');
    await say('A Velha', '— Este você, não. Mas aquele que vive dentro de você esteve. Venham ao templo.');
    await nar('Kravenox sentiu a presença da Origem. Pela primeira vez, ela estava com medo.');
  };
  S.velhaFala = async () => { await say('A Velha', F().templo ? '— A última linha ainda não foi escrita.' : '— O templo. Lá em cima.'); };
  S.temploEspinhos = async function () {
    if (!F().espinhosChegou) { await nar('As portas do templo estão fechadas. Na praça, pessoas ajoelhadas esperam alguém.'); G.Field.py += 1; return; }
    if (F().templo) { await nar('O templo está vazio. Só restou o altar.'); G.Field.py += 1; return; }
    L2.checkpoint('temploEspinhos2');
    await S.temploEspinhos2();
  };
  S.temploEspinhos2 = async function () {
    const Cn = C();
    await Cn.begin('temploPinturas', 'espinhos');
    await Cn.caption('As paredes estavam cobertas de pinturas: uma criança sozinha; a criança criando estrelas, mundos, a Primeira Essência; quatro figuras de luz, sombra, uma marca e uma criança no centro.');
    await say(T, '— Somos nós.');
    await say(K, '— Éramos nós.');
    await Cn.caption('A quarta pintura mostrava a criança diante de uma porta, e do outro lado uma figura enorme. Não parecia ameaçadora. Parecia triste.');
    await say('A Velha', '— O Pai de todos. O ser que criou a possibilidade da Origem. Quem ensinou o Primeiro a existir? Ele mesmo não sabe.');
    await say(K, '— Achei que finalmente tivéssemos chegado ao começo.');
    await say('A Velha', '— Vocês chegaram ao primeiro começo. Nunca foi o suficiente.');
    await Cn.caption('No altar, um livro se abriu sozinho. Palavras começaram a aparecer.');
    await nar('Quando o portador da sombra retornar, a cidade despertará.\nQuando a luz caminhar ao lado dele, a prisão será quebrada.\nQuando a Escolha aceitar a Origem, o ciclo terminará.');
    await say('A Velha', '— O ciclo não termina quando vocês escolhem. Termina quando o mundo escolher vocês. ...Eles chegaram.');
    await Cn.end();
    await nar('Lá embaixo, milhares de soldados de armadura negra cercavam o templo. Um homem mascarado surgiu à frente do exército, com uma espada longa. Retirou a máscara: era o rosto de Kravenox. Mais velho, mais marcado, com olhos completamente negros.');
    await say('O Homem Mascarado', '— Bem-vindo de volta, Rei dos Espinhos. Sou aquilo que você será. Você também, Thornox. Você ainda não se lembra.');
    L2.heal();
    await G.battle(['mascarado', 'herdeiro', 'herdeiro'], { bg: 'espinhos', music: 'chefe', noEscape: true, intro: 'Os Herdeiros sobem a escadaria do templo!',
      events: [{ when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.35, run: async () => {
        await say('A Velha', '— Não lute contra ele! Ele não veio para matar você. Veio entregar uma mensagem.'); return 'end'; } }] });
    const Cn2 = C();
    await Cn2.begin('reinoIntacto', 'memoria');
    await Cn2.caption('O homem apontou a espada para o céu, e uma rachadura se abriu. Do outro lado havia o Reino Quebrado — inteiro, vivo, próspero. E no centro, uma enorme árvore branca. A Fonte Pura, antes do Grande Cisma.');
    await say('O Homem Mascarado', '— O futuro que vocês conhecem não é o único possível. Quero que você escolha qual passado merece existir.');
    await L2.mind(['Não escute. Ele está mentindo. Eu lembro.'], '#e0e8ff');
    await say(K, '— Então me diga a verdade.');
    await say('O Homem Mascarado', '— A verdade é que você já fez essa escolha. Na primeira vez que morreu.');
    await Cn2.caption('E desapareceu, com o exército inteiro. Sem batalha, sem sangue, sem explicação.');
    await Cn2.end();
    await say(K, '— A Origem sabe quem eu era antes de despertar no Abismo. Mãe. Você sabia.');
    await say(MAE, '— Sim. Você não era o Rei dos Espinhos. Você era o homem que criou o Grande Cisma. E o mais terrível é que você não se arrependeu.');
    await L2.mind(['Agora você pode lembrar.'], '#e0e8ff');
    F().templo = 1;
    await S.homemAntesDoRei();
  };

  // ===================== CAP. 17 — O HOMEM ANTES DO REI =====================
  S.homemAntesDoRei = async function () {
    await L2.chapter(17, 'O Homem Antes do Rei');
    await say(T, '— Isso não significa que seja verdade.');
    await say(MAE, '— Eu estava lá. Achei que você precisava de uma chance. Para escolher quem seria desta vez.');
    await say(K, '— Desta vez. Então já aconteceu antes.');
    await L2.mind(['Você sempre esquece.\n— Por que nunca me contou?\nPorque você não perguntou. E porque essa foi a primeira vez em que você teve liberdade.', '— Faça. Abra a memória.\nVocê tem certeza?\n— Faça.'], '#e0e8ff');
    await L2.vision(['Uma árvore gigantesca e branca, viva. A Fonte Pura. Diante dela, os dois irmãos, muito antes da guerra. E a mãe, segurando um bebê com uma marca negra no peito.', '— Ele nasceu com a Origem dentro dele.\n— Então vamos protegê-lo — disse Thornox.', 'E a voz do Kravenox de antes, mais velho, mais frio:\n— Não. Vou transformá-lo numa arma. Se a Origem estiver dentro de uma pessoa, ela poderá escolher por todos.', 'Thornox tentou impedi-lo. Não estava tentando matá-lo. Estava tentando impedi-lo de fazer algo terrível.', 'O antigo Kravenox ergueu a mão, e a Fonte Pura começou a rachar.\n— Já é tarde.\nE então ele fez a primeira escolha.'], 'memoria');
    await say(K, '— Eu comecei. O Cisma. Eu toquei a Fonte. E você tentou me impedir.');
    await say(T, '— Porque eu sabia que você não estava mais pensando como meu irmão.');
    await say(MAE, '— A Fonte reagiu. Separou vocês. Thornox recebeu a luz. Você, a sombra.');
    await say(K, '— Nós nunca fomos inimigos. Fomos uma coisa só.');
    await say(ER, '— A Fonte nunca tentou destruir vocês. Tentou dividir o conflito. E agora vocês estão juntos novamente.');
    await L2.mind(['— O que acontece quando luz e sombra voltam a ser uma só?\nO ciclo termina.'], '#e0e8ff');
    G.Audio.sfx('boom'); G.shake = 16;
    const Cn = C();
    await Cn.begin('arvoreBrancaNasce', 'espinhos');
    await Cn.tween(Cn, { grow: 1 }, 120);
    await Cn.caption('A montanha inteira começou a se transformar em raízes. Uma gigantesca árvore branca surgiu sob a cidade, engolindo as construções, crescendo em direção ao céu. No topo, uma porta.');
    await say(ER, '— Essa não leva ao começo. Leva ao fim.');
    await L2.mind(['O último mundo. O mundo que existe depois de todos os outros. Lá está o que você será.\nO homem que encontramos não é você. É uma possibilidade. E veio para impedir que você faça.'], '#e0e8ff');
    await say(MAE, '— Se você atravessar aquela porta, talvez não consiga voltar.');
    await say(K, '— Então não temos escolha.');
    await say(ER, '— Temos. Podemos escolher não fugir.');
    await say(T, '— Essa eu gostei.');
    await Cn.end();
    F().arvoreBrancaNasce = 1; L2.done();
    G.enterField('espinhos', 15, 7, 'up');
    await G.fade(0, 20);
    await nar('Onde estava a estátua, agora há uma abertura entre as raízes da árvore branca.');
    L2.saved();
  };
  S.entrarArvoreBranca = async function () {
    if (!F().arvoreBrancaNasce) return;
    await L2.warpDungeon('arvoreBranca');
    await nar('A árvore parecia infinita. Cada passo mostrava uma memória; cada raiz carregava um momento; cada galho guardava uma possibilidade.');
  };

  // ===================== CAP. 18 — O REI DO ÚLTIMO MUNDO =====================
  S.portaUltimoMundo = async function () {
    if (F().ch19) return;
    if (!F().ch18) {
      await nar('A porta no topo: branca, sem fechadura, sem maçaneta. A inscrição dizia:\nAQUI TERMINA A HISTÓRIA DAQUELE QUE TENTOU CONTROLAR O DESTINO.');
      await say(K, '— Agora descobrimos se eu aprendi.');
      L2.checkpoint('reiUltimoMundo');
    }
    await S.reiUltimoMundo();
  };
  S.reiUltimoMundo = async function () {
    if (F().ch18) return S.escolhaNaoFoiSua();
    await L2.chapter(18, 'O Rei do Último Mundo');
    const Cn = C();
    await Cn.begin('tronoOssos', 'primeiro');
    if (X.imgs.k_futuro) Cn.actor('rei', { img: () => X.imgs.k_futuro, x: 160, y: 168, z: 2, scale: 0.55, glow: 'rgba(255,60,20,0.5)', glowA: 0.3 });
    await Cn.caption('Diante dele estava o próprio rosto — mais velho, mais marcado, mais vazio —, sentado num trono construído com ossos de mundos mortos. Atrás dele, milhares de estrelas desapareciam.');
    await say('O Rei do Último Mundo', '— Sou aquilo que acontece quando ele vence. A si mesmo. Não destruí nenhum mundo. Não consegui salvá-los.');
    await say('O Rei do Último Mundo', '— Thornox morreu primeiro. Na primeira tentativa de salvar o Reino Quebrado. Vocês não deveriam lembrar. Mas você sempre foi o último.');
    await Cn.caption('Kravenox viu o Reino antigo, verde e vivo. Depois os Antigos, os Reis, a guerra, a morte. O mundo voltou, e tudo se repetiu. Outra vez. E outra. Até que restou apenas ele.');
    await say(K, '— Quantas vezes?');
    await say('O Rei do Último Mundo', '— Mais do que consegue imaginar. Não o deixe morrer. Não permita que ela escolha por você. E não confie nela.');
    await say(MAE, '— Não escute.');
    await say('O Rei do Último Mundo', '— Em todas as vezes que ela contou, você tentou me destruir. Porque não suporta a ideia de se tornar aquilo que odeia.');
    await say(T, '— Basta. Dessa vez, não.');
    await Cn.end();
    L2.heal();
    await G.battle(['reiUltimo'], { bg: 'ultimoMundo', music: 'chefe', noEscape: true, intro: 'O Rei do Último Mundo se levanta do trono de ossos.', events: [
      { when: b => b.round >= 2, run: async () => {
        G.Audio.sfx('dark'); G.flash('#000000', 0.8);
        await nar('O Rei ergueu a mão, e a luz de Thornox morreu.');
        const t = G.state.party.find(h => h.id === 'thornox'); if (t && t.alive) { t.ep = 0; t.hp = Math.max(1, Math.round(t.hp * 0.3)); }
        await say('O Rei do Último Mundo', '— Vai fazer o quê? Me matar? Foi assim que começou.'); return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.4, run: async (b) => {
        G.Audio.sfx('memory'); G.flash('#e0e8ff', 0.8);
        await nar('A Origem despertou, e a criança apareceu ao lado de Kravenox. Agora parecia um pouco mais velha — talvez dez anos, talvez mil.');
        await say(OR, '— Você ainda está com medo. Você não venceu o medo. Você virou o medo.');
        await say('O Rei do Último Mundo', '— Alguns escolherão errado. Alguns morrerão. Mundos serão destruídos. ENTÃO QUAL É O SENTIDO?');
        await say(OR, '— Eles terão sido deles mesmos.');
        const e = b.enemies[0]; e.def = Math.round(e.def * 0.6); e.atk = Math.round(e.atk * 0.8); return null; } },
      { when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.1, run: async () => {
        await say('O Rei do Último Mundo', '— Se eu desaparecer, você terá que viver sem saber o que acontecerá.');
        await say(K, '— Esse é o objetivo. Eu não entendi. Eu escolhi.'); return 'end'; } }] });
    await say('O Rei do Último Mundo', '— Você precisa saber quem criou o primeiro Cisma. Alguém colocou a escolha diante de você. Aquele que está usando a Origem como uma criança.');
    await nar('E desapareceu. No lugar dele surgiu uma porta negra: O VERDADEIRO INIMIGO NUNCA PRECISOU VENCER. As letras mudaram: APENAS PRECISAVA FAZER VOCÊ ACREDITAR QUE ESCOLHEU.');
    await say(K, '— Quem fez isso?');
    await say(OR, '— Eu. Eu criei o primeiro Cisma. Porque eu precisava descobrir se vocês realmente podiam escolher.');
    F().ch18 = 1;
    L2.checkpoint('escolhaNaoFoiSua');
    await S.escolhaNaoFoiSua();
  };

  // ===================== CAP. 19 — A ESCOLHA QUE NÃO FOI SUA =====================
  S.escolhaNaoFoiSua = async function () {
    await L2.chapter(19, 'A Escolha que Não Foi Sua');
    await say(K, '— Você dividiu Thornox e eu. Destruiu a Fonte. Fez todos acreditarem que eu era o responsável. Sacrificou milhões. Nosso pai. Nossa mãe. E Thornox.');
    await say(OR, '— Sim. Não chamo de escolha. Chamo de experimento. Todos dizem que escolheriam o bem quando ninguém está olhando.');
    await nar('A escuridão atrás da porta respirava. Uma figura atravessou: armadura branca, o símbolo da Origem na testa, uma lâmina negra na mão. Retirou o capacete. Era o rosto do pai, mais jovem.');
    await say(MAE, '— Não pode ser.');
    await say('O Pai de Armadura Branca', '— Fui eu quem iniciou o Cisma. Ela apagou suas memórias e escreveu outras no lugar. Precisava que você acreditasse que lutava contra mim. Estava lutando por ela.');
    await say('O Pai de Armadura Branca', '— Ela não é uma criança, nem uma deusa. É uma vontade. De existir. E para existir, precisava de histórias. Vocês são experiências.');
    await say(K, '— Então nada disso foi real?');
    await say(OR, '— Foi. Tudo. Sua infância. Seu irmão. O ódio. A morte. O falso foi a ideia de que vocês precisavam seguir um destino.');
    await say(K, '— Você tem medo de deixar de existir.');
    await say(OR, '— Tenho.');
    await say(K, '— Então existe. Sem controlar ninguém. Se você morrer, terá vivido.');
    await say(OR, '— Eu não sei fazer isso.');
    await say(K, '— Nós também não sabíamos.');
    await say(T, '— Ainda não sabemos.');
    await say('O Pai de Armadura Branca', '— Não. Se ela deixar de controlar os mundos, haverá guerras. Mortes. Sofrimento. Você está escolhendo o caos.');
    await say(K, '— Estou escolhendo a liberdade.');
    await nar('Não houve exércitos, nem monstros. Apenas dois homens, pai e filho.');
    L2.solo('kravenox'); L2.heal();
    let quebrou = false;
    await G.battle(['paiBranco'], { bg: 'ultimoMundo', music: 'pai', noEscape: true, intro: 'Pai e filho. Cada golpe abre uma memória.',
      choose: { who: 'kravenox', when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.4, prompt: 'A lâmina atravessou seu ombro. Kravenox pode segurá-la.', options: [
        { label: 'O golpe final', run: async () => { await nar('Kravenox ergueu os espinhos... e parou. Matá-lo seria decidir por ele. Exatamente o que o pai sempre fez.'); return null; } },
        { label: 'Segurar a lâmina e quebrá-la', run: async () => { quebrou = true; return 'end'; } }] },
      events: [{ when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.7, run: async () => {
        await say('O Pai de Armadura Branca', '— Você não pode vencer.');
        await say(K, '— Eu não estou tentando vencer. Estou escolhendo.'); return null; } }] });
    L2.regroup();
    G.Audio.sfx('crack'); G.flash('#000000', 0.7);
    await nar('A sombra envolveu a mão de Kravenox, e ele quebrou a espada. Poderia matá-lo. A lâmina quebrada estava no chão.');
    await say(K, '— Você me deu a vida. E depois tentou controlar o que eu faria com ela. Eu não vou fazer o mesmo com você. Você vai escolher. Ficar ou partir. Sem que eu o obrigue a nada.');
    await say(OR, '— Se a porta fechar, ele ficará preso aqui.');
    await nar('O pai olhou para a saída, depois para a família. Por muito tempo, não disse nada. Então se levantou e caminhou para fora. A porta permaneceu aberta.');
    await say(K, '— Você escolheu ficar.');
    await say(PAI, '— Não. Escolhi tentar.');
    await nar('E, pela primeira vez, Kravenox percebeu que talvez essa fosse a única escolha que realmente importava. Não escolher o resultado. Escolher tentar.');
    if (!G.state.chests['pai:espada']) { G.state.chests['pai:espada'] = 1; await nar('Kravenox guardou um pedaço da lâmina quebrada.'); await G.receiveEquip('laminaPai'); }
    await say(OR, '— Posso ir com vocês?');
    await say(K, '— Pode.');
    F().ch19 = 1; L2.done();
    L2.checkpoint('quandoFonteMorreu');
    await S.quandoFonteMorreu();
  };

  // ===================== CAP. 20 — QUANDO A FONTE MORREU =====================
  S.quandoFonteMorreu = async function () {
    await L2.chapter(20, 'Quando a Fonte Morreu');
    const Cn = C();
    await Cn.begin('fonteMorre', 'despedida');
    Cn.fall = 0;
    await Cn.caption('A porta negra desapareceu, o último mundo desapareceu, e eles estavam de novo diante da árvore branca. As folhas da Fonte Pura começaram a cair. Uma. Duas. Milhares.');
    await say(OR, '— Ela não está morrendo. Está terminando. Morrer é perder algo. Terminar é deixar algo ir.');
    await say(MAE, '— Durante milhares de anos, todos tentaram manter a Fonte viva. Principalmente eu. Talvez tenhamos confundido criação com dependência.');
    await say(OR, '— O medo de deixar os filhos crescerem.');
    await Cn.tween(Cn, { fall: 1 }, 160);
    await Cn.caption('Cada partícula que subia se transformava numa estrela; cada raiz que desaparecia deixava para trás um rio; cada galho virava nuvem. A Fonte Pura não estava sendo destruída. Estava sendo devolvida ao universo.', 80);
    await say(ER, '— Não existe mais uma Fonte. Agora existem milhões.');
    G.Audio.sfx('silver'); G.flash('#ffffff', 1);
    await Cn.caption('A sombra nos espinhos de Kravenox ganhou pequenas partículas de luz. A luz de Thornox ganhou tons escuros. Nenhum dos dois era mais apenas luz ou sombra.');
    await say(MAE, '— Finalmente. Vocês deixaram de ser metades.');
    await Cn.caption('Thornox estendeu a mão, e Kravenox a segurou. Nada explodiu. Foi apenas um aperto de mãos. Mas as memórias vieram — todas, sem cortes, sem versões. Os dois caíram de joelhos e choraram. De alívio.', 90);
    await say(T, '— Eu lembro. Tudo.');
    await say(K, '— Tudo.');
    await Cn.end();
    await L2.learn(K, 'luzSombra');
    await L2.learn(T, 'luzCompleta');
    await say(OR, '— Eu sinto muito. Por tudo.');
    await say(T, '— Você faria de novo?');
    await say(OR, '— Não sei.');
    await say(T, '— Essa foi uma resposta honesta.');
    await nar('No lugar onde a árvore existira havia apenas uma pequena semente: negra de um lado, branca do outro, com a marca da Escolha no centro. Kravenox a guardou.');
    await say(K, '— Vou plantar. Em algum lugar onde ninguém saiba o que ela será.');
    F().semente = 1;
    await nar('O portal de volta não existia mais. Mas uma estrada começava a surgir. Não havia sido construída; simplesmente apareceu. Uma estrada sem destino.');
    await say(ER, '— Para onde ela vai?');
    await say(K, '— Não sei. Antes isso me incomodava. Agora não.');
    F().ch20 = 1; L2.done();
    await G.fade(1, 20);
    G.enterField('vila2', 2, 8, 'right');
    await G.fade(0, 30);
    await nar('Caminharam durante horas, até chegar a uma pequena vila que não existia em nenhum mapa. Sem muralhas, sem exército, sem templos. Apenas casas, pessoas, crianças, animais. Vida.');
    L2.saved();
  };
  S.estradaSemDestino = async () => { await nar('A estrada sem destino continua para trás, mas não leva mais a lugar nenhum que eles conheçam.'); G.Field.px += 1; };
  S.despedidaSeraphyne = async function () {
    if (!F().ch20 || F().seraPartiu) return;
    F().vilaChegou = 1;
    await say('Uma Mulher', '— Vocês vieram do norte? Estão perdidos? Então podem ficar. Temos comida.');
    await say(K, '— Você não sabe quem somos. Não tem medo?');
    await say('Uma Mulher', '— Deveria?');
    await nar('Seraphyne não entrou na vila. Ficou parada na estrada, olhando para trás, para o lugar onde o portal havia desaparecido.');
    await say(K, '— Você não vem?');
    await say(SE, '— Não.');
    await say(AS, '— Nós dois não.');
    await nar('Seraphyne abriu a mão. Uma pequena escuridão girava sobre a palma, inquieta.');
    await say(SE, '— O Vazio. Sem a Fonte, ele não tem mais limite. Durante milhares de anos, a Fonte segurou a fronteira entre os mundos. Agora ninguém segura. Eu sou a única que nasceu dele.');
    await say(K, '— Você disse que gostava de números. Não de sacrifícios.');
    await say(SE, '— Não é sacrifício. É trabalho.');
    await say(AS, '— Minha cidade viveu fora do ciclo a vida inteira. Sabemos andar na borda das coisas. Ela vai precisar de alguém que conheça o caminho.');
    await say(T, '— Vocês vão embora sem jantar? Você sempre foge.');
    await say(SE, '— E você ainda luta como naquela época.');
    await say(K, '— Volte.');
    await say(SE, '— Quando a fronteira aguentar sozinha.');
    await say(K, '— E se nunca aguentar?');
    await say(SE, '— Então você vem me buscar.');
    await say(K, '— Eu vou.');
    await say(SE, '— Eu sei. É por isso que posso ir.');
    const Cn = C();
    await Cn.begin('estradaPartida', 'despedida');
    await Cn.caption('A escuridão desenhou uma trilha no chão. Não era um portal; era apenas um caminho. Os dois partiram, e Kravenox ficou olhando até que desaparecessem. Depois voltou para a vila, onde havia comida e alguém guardando um lugar para ele à mesa.', 90);
    await Cn.end();
    L2.setParty(['kravenox', 'thornox', 'erya', 'mae']);
    await nar('A mãe entrou no grupo, com a sua lâmina antiga.');
    F().seraPartiu = 1;
    L2.saved();
  };
  S.mulherVila = async function () {
    if (F().ch20 && F().seraPartiu && !F().noiteVila) return S.noiteVila();
    await say('Uma Mulher', '— Temos comida. E camas. Fiquem quanto quiserem.');
  };
  S.casaAcolhe = async function () {
    if (F().seraPartiu && !F().noiteVila) { G.Field.py += 1; return S.noiteVila(); }
    const i = await G.choose('A casa da mulher que acolhe viajantes. Descansar?', ['Sim', 'Não']);
    if (i === 0) { await G.rest(); L2.saved(); }
    G.Field.py += 1;
  };
  S.noiteVila = async function () {
    await G.fade(0.8, 30, '#000010');
    await nar('Naquela noite, pela primeira vez em milhares de anos, Kravenox dormiu sem sonhar com guerra. Erya observava a pequena Origem dormindo.');
    await say(OR, '— Erya. Você ainda acredita que tudo isso foi uma escolha?');
    await say(ER, '— Não sei. Mas, mesmo que a escolha tenha começado como uma mentira... o que fazemos com ela agora é nosso.');
    await say(OR, '— Essa era a resposta que eu queria. Ainda existe uma coisa que vocês não sabem.');
    const Cn = C();
    await Cn.begin('bibliotecaInfinita', 'biblioteca');
    await Cn.caption('Muito longe dali, uma porta permanecia fechada. Atrás dela havia um homem, sentado sozinho, esperando. Na mão, uma pequena semente, metade branca, metade negra.');
    await say('???', '— Eles acreditam que venceram. Deixe que acreditem.');
    await Cn.caption('Do outro lado havia uma biblioteca infinita, cheia de livros. Cada livro contava uma história. E numa das prateleiras havia um título recém-escrito: KRAVENOX.', 80);
    await say('???', '— Agora começa a verdadeira história.');
    await Cn.end();
    D.healAll();
    F().noiteVila = 1;
    await L2.chapter(21, 'A Biblioteca do Fim');
    await G.fade(0, 30);
    await say(T, '— Tive um sonho. Sobre uma biblioteca. Todos os livros tinham nossas vidas dentro deles. Abri um. O seu. Era antes de todos nós.');
    await say(ER, '— Vocês precisam ir embora. A vila não é segura. Ninguém aqui tem sombra.');
    await nar('As pessoas saíam de suas casas, sorridentes. Nenhuma possuía sombra. Entre as árvores, ao norte, havia uma torre negra que não estava ali na noite anterior.');
    F().ch21 = 1;
    L2.saved();
  };
  S.semSombra = async () => { await say('Criança sem Sombra', F().ch21 ? '— Bom dia. Nome? Não preciso de um. Quem ensinou? O homem da biblioteca.' : '— Bom dia!'); };
  S.semSombra2 = async () => { await say('Aldeão sem Sombra', F().ch21 ? '— A torre? Sempre esteve aí. Desde hoje.' : '— Viajantes! Que bom. Ninguém nunca vem.'); };
  S.mercadorVila = async function () {
    await say('Mascate de Cinzas', '— Uma vila sem mapa e sem sombra. Mas com fregueses. Isso eu reconheço em qualquer mundo.');
    await G.shop('Mascate de Cinzas', ['agua', 'orvalho', 'cristalEsc', 'folha', 'nevoa', 'garraEspinhos', 'cajadoBranco', 'marcaViva', 'mantoEspinhos', 'laminaAuren'], 80);
  };
  S.casaVila2 = async () => nar(G.pick(['Uma casa simples. Pão no forno.', 'Lá dentro, alguém canta sem saber a letra.']));
  S.torreSemJanela = async () => nar(F().ch21 ? 'Uma torre negra, sem janelas. Acima da entrada: TODA HISTÓRIA PRECISA DE ALGUÉM QUE A ESCREVA.' : 'Só floresta.');
  S.torreBiblioteca = async function () {
    if (!F().ch21) return;
    if (F().ch22) { await nar('A torre desapareceu. Ficou só a floresta.'); return; }
    await say(K, '— Eu não gosto disso.');
    await say(T, '— Finalmente concordamos em alguma coisa.');
    await L2.warpDungeon('biblioteca');
    await nar('A porta se fechou atrás deles. O interior era muito maior do que deveria ser. Milhares de livros, talvez milhões. Todos tinham nomes.');
    L2.saved();
  };

  // ===================== A BIBLIOTECA (caps. 21–22) =====================
  S.livrosIrmaos = async function () {
    if (F().livrosVistos) return; F().livrosVistos = 1;
    await nar('Numa estante, dois livros lado a lado: THORNOX. KRAVENOX.');
    await say('???', '— Não toque. Ainda não.');
    await nar('A voz veio do fundo da biblioteca. Calma.');
  };
  S.bibliotecario = async function () {
    if (F().bibliotecarioVisto) return;
    if (!F().livrosVistos) { await nar('Um homem lê em silêncio. Não levanta os olhos.'); return; }
    F().bibliotecarioVisto = 1;
    await say(BI, '— Eu sou o Bibliotecário. Meu nome? Escolha. Todos os nomes são escolhas. Sou aquilo que observa quando a escolha acontece.');
    await say(T, '— Você escreveu nossas histórias?');
    await say(BI, '— Algumas. As que precisavam ser lembradas. As outras foram esquecidas. Por vocês.');
    await say(K, '— Erya. Você conhece este lugar.');
    await say(ER, '— Conheço. Estive aqui antes de você nascer.');
    await say(K, '— Não podia ou não queria contar?');
    await say(BI, '— As duas coisas. Seu livro está mais adiante, se quiser a verdade.');
  };
  S.livroKravenox = async function () {
    if (F().livroLido) return;
    if (!F().bibliotecarioVisto) { await nar('Uma estante com um único livro, pesado. A capa parece feita de pele. Melhor não tocar sem saber de quem é esta biblioteca.'); return; }
    F().livroLido = 1;
    await say(BI, '— Verdades são perigosas.');
    await say(K, '— Eu já descobri que mentiras são piores.');
    await L2.vision(['NASCIMENTO.', 'Uma noite, uma cabana, a mãe segurando um bebê. Uma figura encapuzada coloca uma pequena marca negra no peito do bebê.', 'A imagem muda: a figura agora é a Origem.', 'Uma nova palavra aparece na página: VOCÊ.'], 'biblioteca');
    await say(BI, '— Antes de ser dividido, você escolheu carregar a Origem.');
    await say(K, '— Então meu pai estava errado. E a Origem. E minha mãe. Ninguém conhece a história inteira.');
    await say(BI, '— Finalmente.');
    G.Audio.sfx('bell'); G.shake = 8;
    await nar('Uma sirene ecoou pela biblioteca, e uma voz feminina ecoou por todos os corredores: O PRIMEIRO LEITOR CHEGOU. As luzes se apagaram, uma a uma, até restar apenas uma, iluminando um corredor no fundo.');
    L2.saved();
  };
  S.primeiroLeitorChega = async function () {
    if (F().ch22) return;
    if (!F().livroLido) { await nar('Um corredor escuro, no fundo da biblioteca. Ainda não há nada aqui.'); return; }
    L2.checkpoint('primeiroLeitorLuta');
    await S.primeiroLeitorLuta();
  };
  S.primeiroLeitorLuta = async function () {
    await nar('Uma criança muito pequena, de roupas antigas, carregando um livro vazio. Os olhos completamente brancos. O Bibliotecário ajoelhou-se.');
    await say(BI, '— Meu senhor.');
    await say(PL, '— Você finalmente voltou. Sou o primeiro ser que aprendeu a escrever uma história. E agora vou escrever a sua última.');
    await L2.chapter(22, 'O Primeiro Leitor');
    await say(K, '— Feche esse livro. Não estou dando uma ordem. Estou avisando.');
    await say(PL, '— Vocês ainda acreditam que estão juntos por escolha? Então vamos descobrir.');
    L2.heal();
    let rasgou = 0;
    await G.battle(['primeiroLeitor'], { bg: 'biblioteca', music: 'chefe', noEscape: true, intro: 'O Primeiro Leitor abre o livro vazio.',
      choose: { who: 'kravenox', when: b => b.enemies[0].hp < b.enemies[0].maxhp * 0.55, prompt: 'As páginas viram sozinhas: rei, monstro, salvador, tirano...', options: [
        { label: 'Rasgar a página', run: async (b) => {
          rasgou++; G.Audio.sfx('crack'); G.shake = 12;
          const e = b.enemies[0]; e.hp = Math.max(1, e.hp - Math.round(e.maxhp * 0.12)); e.flash = 16;
          if (rasgou === 1) { await say(K, '— Se todas podem ser verdadeiras, nenhuma delas pode decidir quem eu sou.'); await nar('A biblioteca gritou. As estantes começaram a sangrar tinta.'); }
          else { await say(T, '— Pare! Você está fazendo exatamente o que fez antes. Está tentando controlar o resultado.'); await nar('Aquelas palavras atingiram mais fundo do que qualquer golpe.'); }
          return null; } },
        { label: 'Soltar o papel', run: async () => rasgou ? 'end' : (await say(PL, '— Você ainda nem tentou destruir. Como sabe que não quer?'), null) }],
        hints: [{ round: 6, when: b => rasgou >= 2, text: 'Kravenox olha para a página em sua mão. Depois para Thornox.' }] },
      events: [
        { when: b => b.round >= 2, run: async () => {
          G.Audio.sfx('dark'); G.flash('#000000', 0.9);
          await nar('Uma palavra apareceu no papel: MORTE. Thornox caiu, com sangue escorrendo da boca.');
          const t = G.state.party.find(h => h.id === 'thornox'); if (t) { t.hp = 0; t.alive = false; }
          await say(K, '— THORNOX! Apague isso!');
          await say(PL, '— Eu apenas escrevi uma possibilidade. E isso deveria ser suficiente?'); return null; } },
        { when: b => b.round >= 3, run: async () => {
          G.Audio.sfx('memory'); G.flash('#a8ffc8', 0.8);
          await nar('A palavra MORTE começou a desaparecer, e no lugar dela surgiu outra: ESCOLHA.');
          await say(K, '— Você precisa escolher. Se quer continuar.');
          await say(T, '— Eu já escolhi.');
          const t = G.state.party.find(h => h.id === 'thornox'); if (t) { t.alive = true; t.hp = t.maxhp; t.ep = t.mep; }
          await say(K, '— Você escreveu uma possibilidade. Nós escolhemos outra.'); return null; } }] });
    await say(PL, '— Finalmente. Você percebeu. Liberdade não significa destruir todas as possibilidades. Significa aceitar que elas existem.');
    await say(OR, '— Eu também esqueci.');
    await say(PL, '— Eu fui o primeiro a escrever. Descobri a possibilidade de dar significado ao caos. Para impedir que tudo fosse esquecido. Eu não controlo as histórias. Apenas registro. A última página ainda está vazia. E será você quem decidirá o que colocar nela.');
    for (;;) {
      const c = await G.choose('O que Kravenox escreve na última página?', ['SALVAR TODOS', 'VENCER', 'NÃO SEI']);
      if (c === 2) break;
      await nar('A tinta não pega. As letras escorrem e somem. Kravenox pensa em tudo aquilo que havia tentado controlar.');
    }
    G.Audio.sfx('memory'); G.flash('#ffffff', 0.7);
    await nar('NÃO SEI. A tinta brilhou. O Primeiro Leitor começou a rir — não de deboche, mas de alívio.');
    await say(PL, '— Finalmente.');
    const Cn = C();
    await Cn.begin('ceuLivre', 'semNome');
    await Cn.caption('A biblioteca desapareceu, e restou um salão branco com uma única porta. Do outro lado havia um céu azul — verdadeiro, sem rachaduras. Montanhas verdes, rios, cidades, e pessoas vivendo sem saber que um dia o mundo quase terminou.');
    await say(K, '— É o Reino Quebrado?');
    await say(OR, '— Não mais.');
    await say(T, '— Reino Livre.');
    await say(ER, '— Sim.');
    await say(BI, '— Ainda não vou. Alguém precisa guardar o que aconteceu.');
    await say(PL, '— Kravenox. Existe uma coisa que você ainda não sabe. O homem que criou a Biblioteca não fui eu.');
    await Cn.caption('A porta se fechou. Muito acima deles, uma estrela negra acabava de nascer.', 70);
    await say(K, '— Não sei.');
    await Cn.caption('E, pela primeira vez, não sentiu necessidade de descobrir imediatamente. Mas, além das estrelas, uma mão virou a primeira página de um livro que não deveria existir: — Agora podemos começar.', 90);
    G.fadeA = 1;
    await Cn.end();
    F().ch22 = 1; F().l2p2fim = 1; L2.done();
    L2.heal(); D.save();
    G.Audio.play('fim');
    await G.credits2(2);
  };
})();
