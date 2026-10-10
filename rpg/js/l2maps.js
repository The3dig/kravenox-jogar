'use strict';
// Livro II: configuração dos mapas (tema, música, encontros, gatilhos, NPCs), temas dos campos,
// das masmorras e das arenas de batalha.
(function () {
  const M = G.MAPS, F = () => G.state.flags;
  const Wd = G.World, TH = Wd.TH, ramp = Wd.ramp, rgb = Wd.rgb, X = G.gfx;

  // ---------- temas dos campos (herdam o desenho de um tema-base) ----------
  TH.escolha = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#2a2636', '#332e40', '#3c364a', '#463f55', '#514960']), grass: ramp(['#2e3a30', '#384638', '#425240', '#4e5e4a', '#5a6a54']),
    stone: ramp(['#3a3846', '#444250', '#4e4c5a', '#5a5866', '#666472', '#72707e']), road: ramp(['#3a3440', '#454050', '#514a5c', '#5e5668']), ash: false });
  TH.primeiroMundo = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#4a4a52', '#55555e', '#60606a', '#6c6c76', '#787882']), stone: ramp(['#8a8a94', '#9a9aa4', '#aaaab4', '#babac4', '#cacad4', '#dadae4']),
    road: ramp(['#9a9aa4', '#aaaab4', '#babac4', '#cacad4']), pitWall: ramp(['#2a3a5a', '#34466a', '#3e527a', '#485e8a']),
    pitDeep: ramp(['#5a7ab0', '#7a9ac8', '#9ab8e0', '#bad4f0', '#daeaff', '#ffffff']), rim: rgb('#e8ecf4'), vein: rgb('#9ab8e0'), ash: false });
  TH.norte = Object.assign({}, TH.reino, { base: 'reino',
    ground: ramp(['#18181c', '#1e1e24', '#25252c', '#2c2c34', '#34343c']), grass: ramp(['#222226', '#2a2a2e', '#323236', '#3a3a40', '#42424a']),
    road: ramp(['#2a2a30', '#34343a', '#3e3e46', '#484850', '#52525a']), ash: false });
  TH.cidadeAster = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#16141c', '#1c1a24', '#22202c', '#282634', '#2e2c3c']), stone: ramp(['#26242e', '#302e3a', '#3a3846', '#444252', '#4e4c5e', '#58566a']),
    road: ramp(['#2a2834', '#34323e', '#3e3c4a', '#484656']), pitWall: ramp(['#1a1030', '#22163c', '#2a1c48', '#322254']),
    pitDeep: ramp(['#2a1a5a', '#3a2a7a', '#4a3a9a', '#6a5ab8', '#8a7ad8', '#c8b8ff']), rim: rgb('#8a7ad8'), vein: rgb('#4a3a9a'), ash: false });
  TH.mundoNovo = Object.assign({}, TH.reino, { base: 'reino',
    ground: ramp(['#1e3028', '#243a30', '#2c4438', '#344e40', '#3c584a']), grass: ramp(['#2a4a34', '#32583e', '#3c6848', '#467852', '#50885c']),
    leaves: ramp(['#5a9a7a', '#7ab89a', '#9ad8ba', '#bae8d0', '#d8fff0']), road: ramp(['#4a4a3a', '#565644', '#62624e', '#6e6e58', '#7a7a62']),
    pitWall: ramp(['#0a3a2a', '#0e4a36', '#125a42', '#166a4e']), pitDeep: ramp(['#0a4a3a', '#106a50', '#188a68', '#22aa80', '#3ac8a0', '#8affd8']),
    rim: rgb('#8ad8b8'), vein: rgb('#2a8a6a'), pit: 'rio', ash: false });
  TH.espinhos = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#2a2224', '#33292b', '#3d3133', '#473a3b', '#524445']), stone: ramp(['#4a3a3a', '#564444', '#624e4e', '#6e5a5a', '#7a6666', '#867272']),
    road: ramp(['#4a3634', '#56403c', '#624a46', '#6e5450']), ash: false });
  TH.vila2 = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#2e3226', '#363b2c', '#3f4432', '#484e3a', '#525842']), grass: ramp(['#3a4a2a', '#445632', '#4e623a', '#5a6e44', '#667a4e']),
    road: ramp(['#4a3e2e', '#564836', '#62523e', '#6e5c48']), ash: false });
  TH.auren = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#3a3a2e', '#444436', '#4e4e3e', '#585846', '#62624e']), grass: ramp(['#3e5a32', '#486a3a', '#527a42', '#5c8a4a', '#669a52']),
    stone: ramp(['#6a5e4e', '#786a58', '#867664', '#948270', '#a28e7c', '#b09a88']), road: ramp(['#7a6a52', '#88765c', '#968266', '#a48e70']), ash: false });
  TH.estrelas = Object.assign({}, TH.vale, { base: 'vale',
    ground: ramp(['#c8ccd8', '#d0d4e0', '#d8dce8', '#e0e4f0', '#e8ecf8']), grass: ramp(['#b8bcc8', '#c4c8d4', '#d0d4e0']),
    road: ramp(['#e0c880', '#e8d090', '#f0d8a0', '#f8e0b0']), pitWall: ramp(['#04061a', '#060a22', '#080e2a', '#0a1232']),
    pitDeep: ramp(['#02030c', '#040614', '#060a1c', '#0a1028', '#101a3a', '#ffffff']), rim: rgb('#a8b0d0'), vein: rgb('#3a4a8a'), pit: 'rio', mist: false });
  TH.caminhoFim = Object.assign({}, TH.reino, { base: 'reino',
    ground: ramp(['#2e2a2a', '#363130', '#3e3836', '#47403e', '#504846']), grass: ramp(['#3a3a2e', '#444436', '#4e4e3e', '#585846']),
    pitWall: ramp(['#2a3a4a', '#344656', '#3e5262', '#485e6e']), pitDeep: ramp(['#6a8aa0', '#7a9ab0', '#8aaac0', '#9abad0', '#aacae0', '#c8e0f0']),
    rim: rgb('#a8c0d0'), vein: rgb('#5a7a90'), pit: 'rio', ash: false });
  TH.semNome = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#2e3a2a', '#364432', '#3e4e3a', '#465842', '#4e624a']), grass: ramp(['#3a5a32', '#44683a', '#4e7642', '#58844a', '#629252']),
    stone: ramp(['#5a5a52', '#66665e', '#72726a', '#7e7e76', '#8a8a82', '#96968e']), road: ramp(['#6a5e4a', '#766a54', '#82765e', '#8e8268']),
    pitWall: ramp(['#1a3a4a', '#204656', '#265262', '#2c5e6e']), pitDeep: ramp(['#2a5a7a', '#3a6a8a', '#4a7a9a', '#5a8aaa', '#6a9aba', '#9acae0']),
    rim: rgb('#8ab0c0'), vein: rgb('#3a6a8a'), ash: false });
  TH.montanhas = Object.assign({}, TH.reino, { base: 'reino',
    ground: ramp(['#2a1e1e', '#322424', '#3a2a2a', '#433030', '#4c3636']), grass: ramp(['#3a2e26', '#44362c', '#4e3e32', '#584638']),
    rock: ramp(['#120a0a', '#1c1010', '#261616', '#321c1c', '#3e2424', '#4c2c2c', '#5e3838', '#744646']), ash: true });
  TH.arvoreNomes = Object.assign({}, TH.vale, { base: 'vale',
    ground: ramp(['#d8dce4', '#e0e4ec', '#e8ecf2', '#f0f2f8', '#f8f8fc']), grass: ramp(['#c8ccd8', '#d4d8e2', '#e0e4ec']),
    road: ramp(['#c8d8f0', '#d0e0f8', '#d8e8ff', '#e0f0ff']), rock: ramp(['#8a8e98', '#9a9ea8', '#aaaeb8', '#babec8', '#cacdd6', '#dadde4', '#e8eaf0', '#f4f6fa']),
    pitWall: ramp(['#b8c0d0', '#c4ccdc', '#d0d8e8', '#dce4f4']), pitDeep: ramp(['#e8eef8', '#eef2fa', '#f2f6fc', '#f6f8fe', '#fafcff', '#ffffff']),
    rim: rgb('#ffffff'), vein: rgb('#a8b8d8'), pit: 'rio', mist: true });
  TH.chamasAzuis = Object.assign({}, TH.vila, { base: 'vila',
    ground: ramp(['#141a2a', '#1a2234', '#202a3e', '#263248', '#2c3a52']), stone: ramp(['#2a3448', '#343e54', '#3e4860', '#48526c', '#525c78', '#5c6684']),
    road: ramp(['#2e3a52', '#38445e', '#424e6a', '#4c5876']), ash: false });

  // ---------- encontros que mudam com a história ----------
  const encGetter = (chars, fn) => { const o = {}; for (const c of chars) Object.defineProperty(o, c, { get: fn, enumerable: true }); return o; };

  // ===================== PARTE 1 =====================
  M.escolha = {
    name: 'O Reino da Escolha', kind: 'field', tiles: G.MAPSTR.ESCOLHA, theme: 'escolha', music: 'escolha',
    enc: encGetter('.,f', () => F().guerra && !F().ch5 ? 'guerraMundos' : 'escolha'), defRate: 26, encRate: {},
    noEnc: () => !F().chegada || F().l2fim,
    bg: () => (F().guerra && !F().ch5 ? 'guerraMundos' : 'escolha'),
    tint: () => F().solNegro && !F().ch5 ? 'rgba(20,0,30,0.18)' : 'rgba(60,40,120,0.07)',
    weather: () => (F().guerra && !F().ch5 ? { ash: 1.6, haze: 'rgba(30,10,40,0.14)', storm: true } : { ash: 0, fog: 'rgba(180,160,255,0.04)' }),
    sub(ch) { if (ch === '1') return '='; if (ch === 'R') return F().ch8fim ? '=' : '^'; if (ch === 'A') return F().sino ? 'A' : 'p'; return ch; },
    step: { '1': 'portoesEscolha', 'A': 'entrarTuneis', 'R': 'sairNorteEscolha', 'S': 'santuario' },
    look: { 'D': 'salaoSemTrono', 'X': 'arvoreQuinta', 'k': 'poco', 'd': 'casaConstrucao', '*': 'cristalNegro', 'w': 'muralhaEscolha' },
    npcs: [
      { id: 'mascateE', sprite: 'mascate', x: 9, y: 9, dir: 'right', talk: 'mascateEscolha', cond: () => F().chegada },
      { id: 'construtor', sprite: 'aldeao', x: 22, y: 9, dir: 'left', talk: 'construtor', cond: () => F().chegada },
      { id: 'mae1', sprite: 'aldea', x: 12, y: 7, dir: 'down', talk: 'maeFilha', cond: () => F().chegada },
      { id: 'menino1', sprite: 'crianca', x: 20, y: 7, dir: 'down', talk: 'criancaEscolha', cond: () => F().chegada },
      { id: 'soldado', sprite: 'sentinela', x: 15, y: 12, dir: 'down', talk: 'soldadoPortao', cond: () => F().chegada && !F().l2p1fim },
    ],
  };
  M.tuneis = {
    name: 'Túneis sob a Cidade', kind: 'dungeon', grid: G.MAPSTR.TUNEIS, music: 'entre', bg: 'tuneis',
    enc: () => 'tuneis', rate: 15,
    ev: { a: 'simbolosTunel', e: 'portaQuinta', U: 'sairTuneis' },
    voices: { 1: 'Símbolos que nem Thornox conhece. Um deles se repete em toda parte: uma marca que não é luz, nem sombra, nem memória, nem Vazio.' },
    chests: [{ equip: 'cotaReino' }, { item: 'paoReino', n: 2 }, { item: 'cristalEsc', n: 2 }],
  };
  M.primeiroMundo = {
    name: 'O Primeiro Mundo', kind: 'field', tiles: G.MAPSTR.PRIMEIROMUNDO, theme: 'primeiroMundo', music: 'primeiroMundo',
    enc: { '.': 'primeiroMundo', 'p': 'primeiroMundo' }, defRate: 26,
    bg: () => 'primeiroMundo', tint: 'rgba(255,255,255,0.05)', weather: () => ({ ash: 0, fog: 'rgba(255,255,255,0.05)' }),
    sub(ch) { if (ch === '1' || ch === '2') return 'p'; return ch; },
    step: { '1': 'chegadaPrimeiroMundo', '2': 'encontroPaiMemoria', 'D': 'entrarPalacio', 'S': 'santuario' },
    look: { 'h': 'paredeMemoria', 'd': 'paredeMemoria', 'W': 'torreVazia', '~': 'rioLuz' },
    npcs: [{ id: 'paiM', sprite: 'pai', x: 17, y: 6, dir: 'down', talk: 'paiMemoria', cond: () => F().paiMemoria && !F().primeiroRei }],
  };
  M.palacio = {
    name: 'O Palácio do Primeiro Rei', kind: 'dungeon', grid: G.MAPSTR.PALACIO, music: 'primeiroMundo', bg: 'palacio',
    enc: () => 'primeiroMundo', rate: 15,
    ev: { e: 'tronoPrimeiroRei' },
    voices: { 1: 'Uma porta de centenas de metros. Do outro lado, um salão vazio. E, ao fundo, um trono.' },
    chests: [{ equip: 'espadaRei' }, { item: 'cristalEsc', n: 2 }],
  };
  M.norte = {
    name: 'As Terras sem Essência', kind: 'field', tiles: G.MAPSTR.NORTE, theme: 'norte', music: 'entre',
    enc: { '.': 'norte', ',': 'norte', '=': 'norte' }, defRate: 24, encRate: { '=': 40 },
    bg: () => 'norte', tint: 'rgba(0,0,0,0.12)', weather: () => ({ ash: 0, fog: 'rgba(120,120,130,0.06)', haze: 'rgba(0,0,0,0.1)' }),
    sub(ch) { if ('123'.includes(ch)) return '='; if (ch === '4') return F().criatura ? '=' : '.'; if (ch === 'V') return F().criatura ? 'V' : '^'; return ch; },
    step: { '1': 'semEssencia', '2': 'colunaSozinha', '3': 'criaturaCinzenta', '4': 'cidadeAparece', 'V': 'entrarCidadeAster', 'R': 'voltarEscolha' },
    look: { 's': 'colunaSozinha', '*': 'cristalNegro' },
    npcs: [{ id: 'cinza', sprite: 'estranho', x: 19, y: 5, dir: 'down', talk: 'criaturaFala', cond: () => F().criatura && !F().asterChegou }],
  };
  M.cidadeAster = {
    name: 'A Cidade que Não Existia', kind: 'field', tiles: G.MAPSTR.CIDADEASTER, theme: 'cidadeAster', music: 'aster',
    enc: encGetter('.p', () => (F().ataqueDev && !F().devoradores ? 'cidadeAster' : F().antigosVem && !F().l2p1fim ? 'antigos' : null)), defRate: 22,
    noEnc: () => !((F().ataqueDev && !F().devoradores) || (F().antigosVem && !F().l2p1fim)),
    bg: () => (F().antigosVem ? 'antigos' : 'cidadeAster'), tint: 'rgba(30,10,60,0.1)',
    weather: () => ({ ash: 0, fog: 'rgba(160,140,255,0.04)' }),
    sub(ch) { if (ch === '5') return F().l2p1fim && !F().partiuL2 ? 'R' : 'p'; return ch; },
    step: { 'D': 'torreAster', 'R': 'saidaCidadeAster', '5': 'portalMundoNovo', 'S': 'santuario' },
    look: { 'W': 'torreNegraAster', '~': 'rioParaCima', 'd': 'casaAster' },
    npcs: [
      { id: 'astE', sprite: 'aster', x: 16, y: 4, dir: 'down', talk: 'asterFala', cond: () => F().asterChegou && !F().partiuL2 },
      { id: 'hab1', sprite: 'aldeao', x: 6, y: 8, dir: 'right', talk: 'habitanteAster', cond: () => F().asterChegou },
      { id: 'hab2', sprite: 'estranho', x: 24, y: 8, dir: 'left', talk: 'habitanteAster2', cond: () => F().asterChegou },
      { id: 'mercAster', sprite: 'mascate', x: 9, y: 13, dir: 'right', talk: 'mercadorAster', cond: () => F().asterChegou },
      { id: 'cri', sprite: 'crianca', x: 20, y: 13, dir: 'down', talk: 'criancaMonstro', cond: () => F().l2p1fim },
      { id: 'paiW', sprite: 'pai', x: 28, y: 1, dir: 'down', talk: 'paiNaMuralha', cond: () => F().l2p1fim && !F().perdaoPai },
      { id: 'maeA', sprite: 'mae', x: 14, y: 8, dir: 'down', talk: 'maeAster', cond: () => F().maeLivre && !F().partiuL2 },
      { id: 'lyraA', sprite: 'lyra', x: 18, y: 8, dir: 'down', talk: 'lyraAster', cond: () => F().l2p1fim && !F().partiuL2 },
    ],
  };
  M.entre = {
    name: 'O Entre', kind: 'dungeon', grid: G.MAPSTR.ENTRE, music: 'entre', bg: 'entre',
    enc: () => 'entre', rate: 30,
    ev: { e: 'irmaoCrianca', l: 'maeCorrentes' },
    voices: { 1: 'Cada passo faz surgir uma lembrança: uma infância, uma batalha, uma vida que nunca viveu.', 2: 'Thornox criança. A mãe segurando os dois. O pai observando de longe.' },
    chests: [{ item: 'folha', n: 2 }, { equip: 'mantoMemoria' }, { item: 'elixir', n: 3 }],
  };

  // ===================== PARTE 2 =====================
  M.mundoNovo = {
    name: 'O Mundo Novo', kind: 'field', tiles: G.MAPSTR.MUNDONOVO, theme: 'mundoNovo', music: 'escolha',
    enc: { '.': 'mundoNovo', ',': 'mundoNovo', '=': 'mundoNovo', 'f': 'mundoNovo' }, defRate: 24, encRate: { '=': 40 },
    bg: () => 'mundoNovo', tint: 'rgba(40,120,90,0.06)', weather: () => ({ ash: 0, fog: 'rgba(200,255,230,0.04)' }),
    sub(ch) { if (ch === '1') return '='; if (ch === '2') return '='; if (ch === 'V') return F().cidadeEspinhos ? 'V' : '^'; if (ch === 'R') return '='; return ch; },
    step: { '1': 'pegadasEstrada', '2': 'cidadeMontanha', 'V': 'entrarEspinhos', 'S': 'santuario', 'R': 'portalVoltaMN' },
    look: { '~': 'marVerde', '^': 'montanhaFlutua' },
    npcs: [],
  };
  M.espinhos = {
    name: 'A Cidade dos Espinhos', kind: 'field', tiles: G.MAPSTR.ESPINHOS, theme: 'espinhos', music: 'espinhos',
    enc: { ',': 'espinhos', '.': 'espinhos', '=': 'espinhos' }, defRate: 22, encRate: { '=': 30 },
    noEnc: () => !F().herdeiros || F().arvoreBrancaNasce,
    bg: () => 'espinhos', tint: 'rgba(80,20,20,0.06)',
    sub(ch) { if (ch === '1') return 'p'; if (ch === '2') return '='; if (ch === 's') return F().arvoreBrancaNasce ? 'A' : 's'; return ch; },
    step: { 'D': 'temploEspinhos', '1': 'pracaEspinhos', '2': 'estradaMontanha', 'S': 'santuario', 'R': 'voltarMundoNovo', 'A': 'entrarArvoreBranca' },
    look: { 's': 'estatuaEspinhos', 'H': 'temploParede', 'd': 'casaEspinhos' },
    npcs: [
      { id: 'velha', sprite: 'velha', x: 16, y: 5, dir: 'down', talk: 'velhaFala', cond: () => F().espinhosChegou && !F().arvoreBrancaNasce },
      { id: 'fiel1', sprite: 'aldeao', x: 8, y: 6, dir: 'right', talk: 'fielEspinhos', cond: () => F().espinhosChegou && !F().arvoreBrancaNasce },
      { id: 'fiel2', sprite: 'aldea', x: 23, y: 6, dir: 'left', talk: 'fielEspinhos2', cond: () => F().espinhosChegou && !F().arvoreBrancaNasce },
      { id: 'mercE', sprite: 'mascate', x: 6, y: 9, dir: 'right', talk: 'mercadorEspinhos', cond: () => F().espinhosChegou },
    ],
  };
  M.arvoreBranca = {
    name: 'A Árvore Branca', kind: 'dungeon', grid: G.MAPSTR.ARVOREBRANCA, music: 'espinhos', bg: 'arvoreBranca',
    enc: () => 'arvoreBranca', rate: 15,
    ev: { e: 'portaUltimoMundo' },
    voices: { 1: 'Cada raiz carrega um momento. Esta guarda Thornox e Kravenox crianças, correndo perto da Fonte.', 2: 'Cada galho guarda uma possibilidade. Neste, o Grande Cisma nunca aconteceu.' },
    chests: [{ equip: 'armaduraBranca' }, { item: 'orvalho', n: 2 }],
  };
  M.vila2 = {
    name: 'A Vila sem Mapa', kind: 'field', tiles: G.MAPSTR.VILA2, theme: 'vila2', music: 'semNome',
    enc: encGetter('f', () => 'biblioteca'), defRate: 30, noEnc: () => true,
    bg: () => 'vila2',
    sub(ch) { if (ch === '1') return '='; if (ch === '3') return F().ch21 ? '.' : 'f'; if (ch === 'R') return '='; return ch; },
    step: { '1': 'despedidaSeraphyne', 'D': 'casaAcolhe', '3': 'torreBiblioteca', 'S': 'santuario', 'R': 'estradaSemDestino' },
    look: { 'W': 'torreSemJanela', 'k': 'poco', 'd': 'casaVila2' },
    npcs: [
      { id: 'acolhe', sprite: 'senhora', x: 11, y: 7, dir: 'down', talk: 'mulherVila', cond: () => F().vilaChegou },
      { id: 'semS1', sprite: 'crianca', x: 14, y: 9, dir: 'down', talk: 'semSombra', cond: () => F().vilaChegou },
      { id: 'semS2', sprite: 'aldeao', x: 20, y: 7, dir: 'left', talk: 'semSombra2', cond: () => F().vilaChegou },
      { id: 'mercV', sprite: 'mascate', x: 5, y: 9, dir: 'right', talk: 'mercadorVila', cond: () => F().vilaChegou },
    ],
  };
  M.biblioteca = {
    name: 'A Biblioteca do Fim', kind: 'dungeon', grid: G.MAPSTR.BIBLIOTECA, music: 'biblioteca', bg: 'biblioteca',
    enc: () => 'biblioteca', rate: 15,
    ev: { a: 'bibliotecario', l: 'livrosIrmaos', r: 'livroKravenox', e: 'primeiroLeitorChega' },
    voices: { 1: 'Toda história precisa de alguém que a escreva.', 2: 'Na lombada de um livro antigo: AQUELE QUE CARREGA A ORIGEM RETORNARÁ.' },
    chests: [{ equip: 'laminaFronteira' }, { item: 'folha', n: 2 }],
  };

  // ===================== PARTE 3 =====================
  M.auren = {
    name: 'Auren', kind: 'field', tiles: G.MAPSTR.AUREN, theme: 'auren', music: 'auren',
    enc: encGetter('.,', () => 'auren'), defRate: 26, noEnc: () => !F().estrelaCaiu || F().silencio,
    bg: () => 'auren', tint: () => F().noiteAuren && !F().silencio ? 'rgba(0,0,30,0.28)' : 'rgba(255,220,160,0.03)',
    weather: () => ({ ash: 0 }),
    sub(ch) { if (ch === '1') return F().estrelaCaiu ? 'r' : '.'; if (ch === 'R') return F().ch30 ? 'R' : 'p'; return ch; },
    step: { 'D': 'hospedaria', '1': 'crateraEstrela', 'R': 'sairAuren', 'S': 'santuario' },
    look: { 'W': 'torreAuren', 'q': 'bancoLivro', 'k': 'fonteAuren', 'd': 'casaAuren', 'w': 'muralhaAuren' },
    npcs: [
      { id: 'guarda1', sprite: 'sentinela', x: 19, y: 13, dir: 'down', talk: 'guardaAuren', cond: () => true },
      { id: 'donaH', sprite: 'senhora', x: 22, y: 10, dir: 'down', talk: 'donaHospedaria', cond: () => F().aurenChegou },
      { id: 'mercA', sprite: 'mascate', x: 26, y: 7, dir: 'down', talk: 'mercadorAuren', cond: () => F().aurenChegou },
      { id: 'musico', sprite: 'aldeao', x: 30, y: 10, dir: 'left', talk: 'musicoAuren', cond: () => F().aurenChegou },
      { id: 'cri2', sprite: 'crianca', x: 21, y: 13, dir: 'up', talk: 'criancaAuren', cond: () => F().aurenChegou },
      { id: 'paiAur', sprite: 'pai', x: 36, y: 7, dir: 'down', talk: 'paiMuralhaAuren', cond: () => F().ch25 && !F().paiAurenFalou },
    ],
  };
  M.destino = {
    name: 'O Destino de Thornox', kind: 'dungeon', grid: G.MAPSTR.DESTINO, music: 'estrelas', bg: 'destino',
    enc: () => 'destino', rate: 16,
    ev: { e: 'primeiroPersonagem', a: 'memoriaPais', l: 'memoriaFonteK', r: 'silencioChora', d: 'escolhaThornox' },
    voices: { 1: 'Um espaço branco. Não há biblioteca, nem corredor, nem chão.' },
    chests: [],
  };
  M.estrelas = {
    name: 'A Estrada entre as Estrelas', kind: 'field', tiles: G.MAPSTR.ESTRELAS, theme: 'estrelas', music: 'estrelas',
    enc: { '=': 'estrelas', '.': 'estrelas' }, defRate: 26, encRate: { '=': 30 }, noEnc: () => F().cidadeNomes && !F().chaveNomes ? true : false,
    bg: () => 'estrelas', tint: 'rgba(0,0,30,0.12)', weather: () => ({ ash: 0, fog: 'rgba(200,210,255,0.05)' }),
    sub(ch) { if (ch === '1') return '='; if (ch === '2') return 'p'; return ch; },
    step: { '1': 'portaFicar', '2': 'estatuaUltimo', 'S': 'santuario' },
    look: { '~': 'estrelasPerto', 's': 'estatuaUltimo', 'D': 'casaNomes', 'd': 'casaNomes' },
    npcs: [
      { id: 'semR', sprite: 'aldea', x: 13, y: 3, dir: 'down', talk: 'mulherSemRosto', cond: () => F().cidadeNomes },
      { id: 'semR2', sprite: 'aldeao', x: 6, y: 4, dir: 'down', talk: 'semRostoFala', cond: () => F().cidadeNomes },
      { id: 'semR3', sprite: 'aldea', x: 20, y: 4, dir: 'down', talk: 'semRostoFala2', cond: () => F().cidadeNomes },
    ],
  };
  M.dentro = {
    name: 'A Porta Dentro de Thornox', kind: 'dungeon', grid: G.MAPSTR.DENTRO, music: 'entre', bg: 'dentro',
    enc: () => (F().thornoxSumiu ? 'dentroSolo' : 'dentroThornox'), rate: 15,
    ev: { a: 'doisBebes', e: 'leitorExplica', d: 'portaAbre', f: 'luzFonte', r: 'thornoxAjoelhado' },
    voices: { 1: 'Uma pequena luz ao longe. Não é uma luz. É uma memória.' },
    chests: [],
  };
  M.caminhoFim = {
    name: 'O Caminho até o Fim', kind: 'field', tiles: G.MAPSTR.CAMINHOFIM, theme: 'caminhoFim', music: 'estrelas',
    enc: { '.': 'caminhoFim', ',': 'caminhoFim', '=': 'caminhoFim' }, defRate: 24, encRate: { '=': 34 },
    bg: () => 'caminhoFim', weather: () => ({ ash: 0, fog: 'rgba(220,220,230,0.05)' }),
    sub(ch) { if ('123'.includes(ch)) return '='; if (ch === 'R') return '='; return ch; },
    step: { '1': 'ponteRio', '2': 'casaAbandonada', '3': 'ultimaPagina', 'D': 'casaAbandonada', 'S': 'santuario', 'R': 'voltarAuren' },
    look: { '~': 'rioParado' },
    npcs: [],
  };
  M.semNome = {
    name: 'Um Mundo sem Nome', kind: 'field', tiles: G.MAPSTR.SEMNOME, theme: 'semNome', music: 'semNome',
    enc: {}, defRate: 99, noEnc: () => true,
    bg: () => 'semNome',
    tint: () => F().noiteSemNome ? 'rgba(0,0,40,0.25)' : null, weather: () => ({ ash: 0, fog: 'rgba(220,235,255,0.04)' }),
    sub(ch) { if (ch === '1') return '='; if (ch === 'R') return F().estrelaVermelha ? 'R' : '='; return ch; },
    step: { '1': 'colinaFinal', 'R': 'irMontanhas', 'S': 'santuario' },
    look: { 's': 'estatuaLivro', '~': 'rioSemNome', 'd': 'casaSemNome' },
    npcs: [
      { id: 'sen', sprite: 'senhora', x: 9, y: 7, dir: 'down', talk: 'senhoraSemNome', cond: () => F().semNomeCidade },
      { id: 'hom', sprite: 'aldeao', x: 17, y: 9, dir: 'left', talk: 'homemEstatua', cond: () => F().semNomeCidade },
      { id: 'lio', sprite: 'liora', x: 20, y: 11, dir: 'left', talk: 'meninaDesenho', cond: () => F().semNomeCidade && !F().estrelaVermelha },
      { id: 'mercS', sprite: 'mascate', x: 6, y: 11, dir: 'right', talk: 'mercadorSemNome', cond: () => F().semNomeCidade },
      { id: 'azulF', sprite: 'azul', x: 15, y: 13, dir: 'down', talk: 'azulFinal', cond: () => F().ch41casa },
      { id: 'lioF', sprite: 'liora', x: 11, y: 13, dir: 'right', talk: 'lioraFinal', cond: () => F().ch41casa },
      { id: 'aveF', sprite: 'aveline', x: 18, y: 12, dir: 'left', talk: 'avelineFinal', cond: () => F().ch41casa },
      { id: 'lyraF', sprite: 'lyra', x: 12, y: 9, dir: 'down', talk: 'lyraFinal', cond: () => F().l2fim },
      { id: 'seraF', sprite: 'seraphyne', x: 16, y: 9, dir: 'down', talk: 'seraFinal', cond: () => F().l2fim },
      { id: 'astF', sprite: 'aster', x: 17, y: 11, dir: 'left', talk: 'asterFinal', cond: () => F().l2fim },
      { id: 'leiF', sprite: 'leitor', x: 9, y: 12, dir: 'right', talk: 'leitorCidade', cond: () => F().l2fim },
    ],
  };
  M.montanhas = {
    name: 'As Montanhas da Estrela Vermelha', kind: 'field', tiles: G.MAPSTR.MONTANHAS, theme: 'montanhas', music: 'aveline',
    enc: { '.': 'montanhas', ',': 'montanhas', '=': 'montanhas', 'f': 'montanhas' }, defRate: 24, encRate: { '=': 34 },
    noEnc: () => F().aveline && !F().ch36,
    bg: () => 'montanhas', tint: 'rgba(80,0,0,0.08)', weather: () => ({ ash: 1.2, haze: 'rgba(60,0,0,0.08)' }),
    sub(ch) { if (ch === '1') return '='; if (ch === '2') return '='; if (ch === 'D') return F().ch36 ? 'D' : 'd'; if (ch === 'R') return '='; return ch; },
    step: { '1': 'lioraSegue', '2': 'montanhaAbre', 'D': 'casaSenhora', 'S': 'santuario', 'R': 'voltarSemNome' },
    look: { '*': 'cristalVermelho', 'd': 'casaFloresta' },
    npcs: [],
  };
  M.arvoreNomes = {
    name: 'O Mundo Branco', kind: 'field', tiles: G.MAPSTR.ARVORENOMES, theme: 'arvoreNomes', music: 'estrelas',
    enc: { '.': 'arvoreNomes', ',': 'arvoreNomes', '=': 'arvoreNomes' }, defRate: 28, encRate: { '=': 40 }, noEnc: () => F().ch38fim,
    bg: () => 'arvoreNomes', weather: () => ({ ash: 0, fog: 'rgba(255,255,255,0.08)' }),
    sub(ch) { if (ch === '1') return '='; return ch; },
    step: { '1': 'arvoreDosNomes', 'D': 'portaAzulVolta' },
    look: { 'X': 'troncoNomes', '~': 'ceuBranco' },
    npcs: [],
  };
  M.chamasAzuis = {
    name: 'A Cidade das Chamas Azuis', kind: 'field', tiles: G.MAPSTR.CHAMASAZUIS, theme: 'chamasAzuis', music: 'ultimo',
    enc: encGetter('p.', () => 'chamasAzuis'), defRate: 24, noEnc: () => !F().ch39 || F().azulNasce,
    bg: () => 'chamasAzuis', tint: () => F().azulNasce ? 'rgba(40,80,160,0.06)' : 'rgba(0,10,40,0.18)',
    weather: () => ({ ash: 0, fog: 'rgba(120,180,255,0.05)' }),
    sub(ch) { if (ch === '1' || ch === '2') return 'p'; if (ch === 'R') return F().ch41 ? 'R' : 'p'; return ch; },
    step: { '1': 'ultimoInimigoAparece', '2': 'plantarSemente', 'S': 'santuario', 'R': 'voltarParaCasa' },
    look: { 'd': 'janelaChama', 'h': 'janelaChama' },
    npcs: [
      { id: 'azulC', sprite: 'azul', x: 26, y: 9, dir: 'down', talk: 'azulCidade', cond: () => F().azulNasce && !F().ch41 },
      { id: 'lioC', sprite: 'liora', x: 25, y: 11, dir: 'right', talk: 'lioraCidade', cond: () => F().azulNasce && !F().ch41 },
      { id: 'serC', sprite: 'seraphyne', x: 12, y: 9, dir: 'down', talk: 'seraphyneVolta', cond: () => F().seraVoltou && !F().ch41 },
      { id: 'astC', sprite: 'aster', x: 13, y: 9, dir: 'down', talk: 'asterVolta', cond: () => F().seraVoltou && !F().ch41 },
      { id: 'aveC', sprite: 'aveline', x: 16, y: 9, dir: 'down', talk: 'avelineCidade', cond: () => F().leitorVolta && !F().ch41 },
      { id: 'leiC', sprite: 'leitor', x: 17, y: 9, dir: 'down', talk: 'leitorCidade', cond: () => F().leitorVolta && !F().ch41 },
      { id: 'habC', sprite: 'aldeao', x: 6, y: 9, dir: 'right', talk: 'habitanteChamas', cond: () => F().azulNasce },
    ],
  };

  // ---------- masmorras: texturas ----------
  Object.assign(G.DUN_THEMES, {
    tuneis: { stone: [86, 78, 66], stoneVar: 0.2, mortar: [22, 18, 14], floor: [58, 52, 44], ceil: [26, 22, 18], acc: [180, 255, 200], kind: 'veias', light: [235, 220, 190] },
    palacio: { stone: [150, 130, 80], stoneVar: 0.14, mortar: [60, 48, 24], floor: [110, 92, 56], ceil: [50, 40, 20], acc: [255, 214, 90], kind: 'veias', light: [255, 230, 170] },
    entre: { stone: [70, 70, 80], stoneVar: 0.12, mortar: [20, 20, 26], floor: [30, 30, 36], ceil: [8, 8, 10], acc: [240, 240, 255], kind: 'veias', light: [210, 210, 230] },
    arvoreBranca: { stone: [196, 192, 182], stoneVar: 0.1, mortar: [120, 114, 104], floor: [150, 144, 132], ceil: [80, 76, 70], acc: [255, 240, 180], kind: 'raizes', light: [255, 250, 235] },
    biblioteca: { stone: [92, 64, 40], stoneVar: 0.2, mortar: [36, 24, 14], floor: [66, 46, 28], ceil: [24, 16, 10], acc: [255, 220, 150], kind: 'veias', light: [255, 220, 170] },
    destino: { stone: [214, 214, 220], stoneVar: 0.06, mortar: [170, 170, 180], floor: [200, 200, 208], ceil: [230, 230, 236], acc: [255, 230, 150], kind: 'veias', light: [255, 255, 255] },
    dentro: { stone: [36, 30, 40], stoneVar: 0.14, mortar: [10, 8, 12], floor: [24, 20, 26], ceil: [6, 4, 8], acc: [255, 214, 110], kind: 'veias', light: [230, 210, 170] },
  });

  // ---------- cenários de batalha ----------
  Object.assign(X.BG, {
    escolha: { sky: ['#1a1440', '#5a4a9a'], ground: ['#3a3646', '#1a1822'], deco: 'houses', acc: '#c8a8ff' },
    guerraMundos: { sky: ['#0a0614', '#3a1a3a'], ground: ['#2a2430', '#100c14'], deco: 'smoke', acc: '#ff6a4a' },
    tuneis: { sky: ['#0e0c08', '#2a2418'], ground: ['#3a3226', '#120e0a'], deco: 'roots', acc: '#b8ffc8' },
    primeiroMundo: { sky: ['#8a8a96', '#e0e0e8'], ground: ['#7a7a84', '#3a3a42'], deco: 'whiteTowers', acc: '#ffffff' },
    palacio: { sky: ['#2a2008', '#6a5420'], ground: ['#6a5a3a', '#2a2010'], deco: 'crystalwall', acc: '#ffd860' },
    norte: { sky: ['#0a0a0e', '#2a2a32'], ground: ['#24242a', '#0c0c10'], deco: 'crystals', acc: '#a0a0b0' },
    cidadeAster: { sky: ['#06040e', '#2a1a4a'], ground: ['#24202e', '#0c0a12'], deco: 'towers', acc: '#b8a8ff' },
    entre: { sky: ['#000000', '#14141a'], ground: ['#1a1a20', '#050508'], deco: 'void', acc: '#f0f0ff' },
    antigos: { sky: ['#000000', '#101018'], ground: ['#1a1a22', '#050508'], deco: 'stalac', acc: '#e0e8ff' },
    mundoNovo: { sky: ['#1a4a5a', '#8ad8c8'], ground: ['#2a4a38', '#10201a'], deco: 'trees', acc: '#c8fff0' },
    espinhos: { sky: ['#2a0a0a', '#7a3a2a'], ground: ['#4a3a3a', '#1a1414'], deco: 'houses', acc: '#ff6a4a' },
    arvoreBranca: { sky: ['#a8a49a', '#f4f2ea'], ground: ['#8a8478', '#3a3630'], deco: 'roots', acc: '#fff0b0' },
    ultimoMundo: { sky: ['#1a0402', '#8a2a10'], ground: ['#2a1412', '#0a0404'], deco: 'burning', acc: '#ff5a2a' },
    vila2: { sky: ['#2a3a4a', '#8a9a7a'], ground: ['#3a4430', '#1a1e14'], deco: 'trees', acc: '#ffe8a0' },
    biblioteca: { sky: ['#0e0a06', '#2a1e10'], ground: ['#3a2a1a', '#120c06'], deco: 'crystalwall', acc: '#ffdca0' },
    auren: { sky: ['#3a6a9a', '#c8d8e8'], ground: ['#4a5a3a', '#1e2416'], deco: 'houses', acc: '#ffe8a0' },
    destino: { sky: ['#e8e8ee', '#ffffff'], ground: ['#c8c8d0', '#8a8a94'], deco: 'clouds', acc: '#ffd890' },
    estrelas: { sky: ['#02030c', '#141a3a'], ground: ['#c8ccd8', '#5a5e6a'], deco: 'void', acc: '#ffffff' },
    dentro: { sky: ['#000000', '#140e08'], ground: ['#1a1410', '#050302'], deco: 'stalac', acc: '#ffd86e' },
    caminhoFim: { sky: ['#3a4a5a', '#a8b8c8'], ground: ['#3e3836', '#161412'], deco: 'trees', acc: '#e8f0ff' },
    semNome: { sky: ['#4a7aa8', '#d8e8f0'], ground: ['#3e4e3a', '#161e14'], deco: 'trees', acc: '#ffffff' },
    montanhas: { sky: ['#1a0404', '#6a1a1a'], ground: ['#3a2a2a', '#140c0c'], deco: 'crystals', acc: '#ff3030' },
    arvoreNomes: { sky: ['#e8ecf4', '#ffffff'], ground: ['#d8dce4', '#9a9ea8'], deco: 'tree', acc: '#a8c8ff' },
    chamasAzuis: { sky: ['#02040e', '#14244a'], ground: ['#1e2638', '#080c14'], deco: 'towers', acc: '#78b8ff' },
  });
  Object.assign(X.ARENA, {
    escolha: { floor: [70, 64, 84], cob: true }, guerraMundos: { floor: [60, 52, 66], grass: [70, 60, 56] }, tuneis: { floor: [80, 72, 60], stone: [90, 80, 66], vein: [180, 255, 200], indoor: true },
    primeiroMundo: { floor: [150, 150, 160], cob: true }, palacio: { floor: [130, 110, 70], stone: [150, 130, 80], vein: [255, 214, 90], indoor: true }, norte: { floor: [44, 44, 50], grass: [50, 50, 56] },
    cidadeAster: { floor: [52, 48, 64], cob: true }, entre: { floor: [40, 40, 48], stone: [60, 60, 70], vein: [240, 240, 255], indoor: true }, antigos: { floor: [40, 40, 50], cob: true },
    mundoNovo: { floor: [56, 84, 66], grass: [70, 120, 84] }, espinhos: { floor: [96, 76, 74], cob: true }, arvoreBranca: { floor: [170, 166, 156], stone: [196, 192, 182], vein: [255, 240, 180], indoor: true },
    ultimoMundo: { floor: [60, 30, 26], stone: [80, 40, 34], vein: [255, 90, 40], indoor: true }, vila2: { floor: [80, 86, 60], grass: [90, 110, 66] },
    biblioteca: { floor: [86, 62, 40], stone: [92, 64, 40], vein: [255, 220, 150], indoor: true }, auren: { floor: [130, 116, 92], cob: true },
    destino: { floor: [200, 200, 208], stone: [214, 214, 220], vein: [255, 230, 150], indoor: true }, estrelas: { floor: [200, 204, 216], plank: true },
    dentro: { floor: [36, 30, 40], stone: [46, 40, 50], vein: [255, 214, 110], indoor: true }, caminhoFim: { floor: [80, 72, 70], grass: [86, 86, 66] },
    semNome: { floor: [90, 100, 80], grass: [90, 130, 76] }, montanhas: { floor: [80, 58, 58], grass: [86, 64, 52] },
    arvoreNomes: { floor: [216, 220, 228], plank: true }, chamasAzuis: { floor: [50, 60, 86], cob: true },
  });
})();
