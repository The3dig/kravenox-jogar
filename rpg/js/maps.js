'use strict';
// Configuração dos mapas: tema, música, encontros, gatilhos e NPCs.
// Os roteiros (strings) são funções em G.story.
(function () {
  const M = G.MAPS = {};
  const F = () => G.state.flags;

  M.reino = {
    name: 'Reino Quebrado', kind: 'field', tiles: G.MAPSTR.REINO, theme: 'reino', music: 'reino',
    enc: { '.': 'reino', ',': 'reino', 'r': 'reino', '=': 'reino', 'f': 'floresta', '2': 'floresta', '3': 'floresta' },
    encRate: { '=': 40, f: 18 }, defRate: 26,
    bg: ch => (ch === 'f' || ch === '2' || ch === '3') ? 'floresta' : 'planicie',
    sub(ch) { if (ch === 'X') return F().vila ? 'r' : 'X'; if (ch === 'x') return F().guardiao1 ? 'f' : 'X'; if ('123'.includes(ch)) return ch === '1' ? '=' : 'f'; return ch; },
    step: { 'A': 'entrarAbismo', 'V': 'entrarVila', 'R': 'entrarTemplo', '1': 'memoriaEstrada', '2': 'florestaLira', '3': 'florestaGuardiao' },
    look: { 'W': 'torre', '*': 'cristalNegro', 'X': 'raizesBloqueio', 'x': 'raizesBloqueio2', '~': 'abismoOlhar' },
    npcs: [],
  };
  M.vila = {
    name: 'Vila Sem Nome', kind: 'field', tiles: G.MAPSTR.VILA, theme: 'vila', music: 'vila',
    sub(ch) { if (ch === 'D') return F().vila ? 'd' : 'D'; return ch; },
    step: { '=': 'sairVila', 'D': 'entrarCasa' },
    look: { 's': 'estatua', 'd': 'portaVazia', 'k': 'poco', 'c': 'fogueira' },
    npcs: [
      { id: 'mascate', sprite: 'mascate', x: 6, y: 12, dir: 'right', talk: 'mascate' },
    ],
  };
  M.casa = {
    name: 'Casa da Luz Dourada', kind: 'field', tiles: G.MAPSTR.CASA, theme: 'casa', music: 'vila',
    step: { 'e': 'sairCasa' },
    look: { 'q': 'fragmento' },
    npcs: [
      { id: 'ancia', sprite: 'ancia', x: 3, y: 3, dir: 'down', talk: 'ancia', cond: () => !F().vila },
    ],
  };
  M.vale = {
    name: 'Vale dos Mortos', kind: 'field', tiles: G.MAPSTR.VALE, theme: 'vale', music: 'vale',
    enc: { '.': 'vale', 'm': 'vale', '5': 'vale' }, defRate: 22,
    bg: () => 'vale',
    sub(ch) { if (ch === '5') return 'm'; if (ch === '6') return 'B'; return ch; },
    step: { 'A': 'valeCaverna', 'S': 'santuario', '5': 'valeVoz', '6': 'ponteMortos' },
    look: { 'g': 'tumulo' },
    npcs: [
      { id: 'espirito', sprite: 'espirito', x: 9, y: 12, dir: 'down', talk: 'espirito' },
    ],
  };

  // Masmorras em primeira pessoa
  M.abismo = {
    name: 'Abismo Carmesim', kind: 'dungeon', grid: G.MAPSTR.ABISMO, music: 'abismo', bg: 'abismo',
    enc: (x, y) => y > 6 ? 'abismo2' : 'abismo', rate: 15,
    col: { wall: '#3c1519', wallD: '#250b0e', line: '#581c22', ceil: '#0a0204', floor: '#1c0b0d', acc: '#ff3a2a' },
    ev: { a: 'abismoMarca', b: 'abismoEnxame', U: 'sairAbismo' },
    chests: [{ fr: 25 }, { item: 'seiva', n: 2 }],
  };
  M.templo = {
    name: 'Templo da Primeira Raiz', kind: 'dungeon', grid: G.MAPSTR.TEMPLO, music: 'masmorra', bg: 'templo',
    enc: () => 'templo', rate: 14, gate: 'portaoTemplo',
    col: { wall: '#4a3a2a', wallD: '#2e241a', line: '#241a10', ceil: '#140c08', floor: '#2a2016', acc: '#e0c060' },
    ev: { e: 'temploEstatua', b: 'raizNegra' },
    voices: { 1: '— Não deixe que ele descubra.', 2: '— A Fonte não pode ser aberta.', 3: 'Vozes de pessoas que estiveram ali. Todas presas nas paredes.' },
    chests: [{ equip: 'couraca' }, { item: 'cristal', n: 2 }, { item: 'raiz' }],
  };
  M.caverna = {
    name: 'Câmara dos Cristais', kind: 'dungeon', grid: G.MAPSTR.CAVERNA, music: 'masmorra', bg: 'caverna',
    enc: () => 'caverna', rate: 14,
    col: { wall: '#2a1a40', wallD: '#180e28', line: '#120822', ceil: '#06030c', floor: '#140c1e', acc: '#b26bff' },
    ev: { a: 'arauto', e: 'camaraCristais', b: 'coisaQueDormia', U: 'sairCaverna' },
    chests: [{ item: 'nectar' }, { equip: 'placas' }, { fr: 140 }, { item: 'raiz' }],
  };
  M.submersa = {
    name: 'Cidade Submersa', kind: 'dungeon', grid: G.MAPSTR.SUBMERSA, music: 'submersa', bg: 'submersa',
    enc: () => F().lyra ? 'submersa' : 'submersaSolo', rate: 15, gate: 'portaoRio',
    col: { wall: '#0e2a36', wallD: '#081a22', line: '#04121a', ceil: '#01070c', floor: '#082028', acc: '#6af0e0' },
    ev: { l: 'encontraLyra', r: 'rioMemorias', d: 'portaTres', f: 'fonte' },
    chests: [{ item: 'nectar', n: 2 }, { equip: 'veu' }, { item: 'lagrima' }, { equip: 'espinhoAntigo' }],
  };

  // ===================== PARTE 2 — O REINO EM GUERRA =====================
  M.guerra = {
    name: 'O Reino em Guerra', kind: 'field', tiles: G.MAPSTR.GUERRA, theme: 'guerra', music: 'guerra',
    enc: { '.': 'guerra', ',': 'guerra', '=': 'guerra', 'f': 'guerra' }, defRate: 24, encRate: { '=': 36 },
    bg: () => 'guerra',
    sub(ch) { if ('123'.includes(ch)) return '='; return ch; },
    step: { '1': 'refugiados', '2': 'conversaEstrada', '3': 'colinaValdora', 'V': 'entrarValdora', 'R': 'passagemFechada', 'S': 'santuario' },
    look: { 'W': 'torreBandeira', '*': 'cristalNegro', '~': 'fendaGuerra', 'k': 'poco', 'c': 'fogueiraCampo' },
    npcs: [
      { id: 'mascate2', sprite: 'mascate', x: 5, y: 12, dir: 'right', talk: 'mascateGuerra', cond: () => F().refugiados },
      { id: 'refugiada', sprite: 'refugiada', x: 10, y: 12, dir: 'down', talk: 'refugiada', cond: () => F().refugiados },
      { id: 'menino', sprite: 'menino', x: 11, y: 14, dir: 'left', talk: 'menino', cond: () => F().refugiados },
      { id: 'refugiado', sprite: 'refugiado', x: 33, y: 16, dir: 'up', talk: 'refugiado', cond: () => F().colina && !F().valdora },
    ],
  };
  M.valdora = {
    name: 'Valdora', kind: 'field', tiles: G.MAPSTR.VALDORA, theme: 'valdora', music: 'valdora',
    enc: { '.': 'valdora', ',': 'valdora', 'p': 'valdora' }, defRate: 26,
    bg: () => 'valdora',
    sub(ch) { if (ch === '4') return 'p'; if (ch === '5') return '.'; if (ch === 'D') return F().cupula ? 'D' : 'd'; return ch; },
    step: { '=': 'portaoValdora', 'D': 'entrarPassagem', '4': 'torrePonte', '5': 'becoCriancas' },
    look: { 's': 'estatuaPai', 'd': 'casaQueimada', 'c': 'fogoValdora', 'W': 'torreCeus', 'k': 'poco' },
    npcs: [],
  };
  M.ceus = {
    name: 'Ponte dos Céus', kind: 'field', tiles: G.MAPSTR.CEUS, theme: 'ceus', music: 'ceus',
    enc: { 'B': 'ceus', '.': 'ceus', ',': 'ceus' }, defRate: 20,
    bg: () => 'ceus',
    sub(ch) { if (ch === '5') return '.'; if (ch === '6') return 'B'; if (ch === 'Q') return '.'; return ch; },
    step: { '5': 'batalhaServos', '6': 'fimDaPonte', 'S': 'santuario' },
    look: { '~': 'olharNuvens' },
    npcs: [
      { id: 'mascate3', sprite: 'mascate', x: 3, y: 14, dir: 'right', talk: 'mascateCeus' },
    ],
  };
  M.escadaria = {
    name: 'Escadaria sob Valdora', kind: 'dungeon', grid: G.MAPSTR.ESCADARIA, music: 'antigo', bg: 'escadaria',
    enc: () => 'escadaria', rate: 14,
    ev: { d: 'portaTresMaos', e: 'salaDoPai' },
    voices: { 1: 'Símbolos mais antigos que a Fonte. Alguns parecem olhos. Outros, sementes.' },
    chests: [{ item: 'elixir' }, { equip: 'cotaValdora' }, { fr: 300 }],
  };
  M.passagem = {
    name: 'A Última Passagem', kind: 'dungeon', grid: G.MAPSTR.PASSAGEM, music: 'antigo', bg: 'passagem',
    enc: () => 'passagem', rate: 13, gate: 'passagemAberta',
    ev: { l: 'simbolosAntigos', a: 'criaturaOlhos', r: 'confrontoSeraphyne', d: 'portaDoCoracao', e: 'coracaoPrimeiro' },
    voices: { 1: '— Antes da Essência havia o silêncio.', 2: '— E antes do silêncio havia aquele que observava.' },
    chests: [{ equip: 'laminaSilencio' }, { item: 'cristalM', n: 2 }, { item: 'elixir', n: 2 }],
  };
  M.fortaleza = {
    name: 'Fortaleza dos Guardiões', kind: 'dungeon', grid: G.MAPSTR.FORTALEZA, music: 'fortaleza', bg: 'fortaleza',
    enc: () => 'fortaleza', rate: 14,
    ev: { l: 'memoriaParede', d: 'portaEntrem', e: 'tronoFuturo', U: 'descerRaizes' },
    voices: { 1: 'Na pedra, uma imagem: Kravenox jovem, coberto de sombras, lutando contra Thornox. Thornox não tenta matá-lo. Tenta alcançá-lo.', 2: 'Na pedra, Lyra sozinha diante da Fonte. E alguém atrás dela.' },
    chests: [{ equip: 'armaduraGuardiao' }, { item: 'elixir', n: 2 }, { equip: 'cajadoGuardiao' }, { item: 'cristalM', n: 2 }, { fr: 600 }],
  };
  M.raizes = {
    name: 'O Coração do Reino', kind: 'dungeon', grid: G.MAPSTR.RAIZES, music: 'antigo', bg: 'raizes',
    enc: () => 'raizes', rate: 14, gate: 'portaCircular',
    ev: { e: 'arvoreMae', d: 'portaCircularEv', r: 'escolhidosPonte', l: 'raizQuebra', f: 'aFonte' },
    chests: [{ equip: 'cristalMae' }, { item: 'lagrima' }, { equip: 'espinhoQuatro' }],
  };
  // ===================== PARTE 3 — ALÉM DO REINO =====================
  M.estrada = {
    name: 'Além das Montanhas', kind: 'field', tiles: G.MAPSTR.ESTRADA, theme: 'estrada', music: 'alem',
    enc: { '.': 'estrada', ',': 'estrada', '=': 'estrada', 'f': 'estrada' }, defRate: 24, encRate: { '=': 40 },
    bg: () => 'estrada',
    sub(ch) { if ('123'.includes(ch)) return ch === '1' ? '.' : '='; return ch; },
    step: { '1': 'acampamentoNoite', '2': 'estradaAntiga', '3': 'colinaEstrela', 'V': 'portaoFimReino', 'R': 'voltaFonte', 'S': 'santuario' },
    look: { 'c': 'fogueiraNoite', 'k': 'poco', 'h': 'ruinaVila', 'o': 'ruinaVila' },
    npcs: [
      { id: 'mascate4', sprite: 'mascate', x: 26, y: 17, dir: 'left', talk: 'mascateEstrada' },
    ],
  };
  M.mar = {
    name: 'O Oceano das Três Luas', kind: 'field', tiles: G.MAPSTR.MAR, theme: 'mar', music: 'mar',
    enc: { '.': 'mar', ',': 'mar' }, defRate: 22,
    bg: () => 'mar',
    sub(ch) { if (ch === '4') return 'B'; if (ch === 'Q') return 'B'; return ch; },
    step: { '4': 'serpente', 'Q': 'embarcacao', '=': 'voltarPortao', 'S': 'santuario' },
    look: { '~': 'olharMar', '*': 'cristalNegro' },
    npcs: [],
  };
  M.cidade = {
    name: 'A Primeira Cidade', kind: 'field', tiles: G.MAPSTR.CIDADE, theme: 'cidade', music: 'cidade',
    enc: { 'p': 'cidade', '.': 'cidade' }, defRate: 26,
    noEnc: () => !F().cidadeViva || F().fimLivro,
    bg: () => 'cidade',
    sub(ch) { if (ch === '1') return 'p'; if (ch === '5') return F().ch31 && !F().colheitaFim ? 'R' : 'p'; if (ch === 'D') return F().arkan ? 'D' : 'd'; if (ch === 'R') return 'p'; return ch; },
    step: { '1': 'pracaVazia', 'D': 'portaTorre', '5': 'portalColheita', '=': 'cais' },
    look: { 'k': 'mesaQuente', 'd': 'casaBranca', 'W': 'torreBranca', '~': 'canal' },
    npcs: [
      { id: 'arkan', sprite: 'arkan', x: 18, y: 8, dir: 'down', talk: 'arkanFala', cond: () => !F().torreTopo },
      { id: 'sob1', sprite: 'sobrevivente', x: 6, y: 13, dir: 'right', talk: 'sobrevivente1', cond: () => F().cidadeViva },
      { id: 'sob2', sprite: 'refugiada', x: 22, y: 12, dir: 'left', talk: 'sobrevivente2', cond: () => F().cidadeViva },
      { id: 'sob3', sprite: 'menino', x: 9, y: 16, dir: 'up', talk: 'sobrevivente3', cond: () => F().cidadeViva },
      { id: 'mascate5', sprite: 'mascate', x: 24, y: 4, dir: 'down', talk: 'mascateCidade', cond: () => F().cidadeViva },
    ],
  };
  M.colheita = {
    name: 'A Planície da Colheita', kind: 'field', tiles: G.MAPSTR.COLHEITA, theme: 'colheita', music: 'devorador',
    enc: { '.': 'colheita', ',': 'colheita' }, defRate: 22,
    bg: () => 'colheita',
    sub(ch) { if (ch === '4') return '.'; return ch; },
    step: { '4': 'torreColheita', 'R': 'portalVolta' },
    look: { 'W': 'torreNegraOlhar', '*': 'cristalNegro', '~': 'fendaColheita' },
    npcs: [
      { id: 'preso1', sprite: 'sobrevivente', x: 6, y: 5, dir: 'down', talk: 'preso', cond: () => !F().colheitaFim },
      { id: 'preso2', sprite: 'refugiada', x: 20, y: 6, dir: 'down', talk: 'preso', cond: () => !F().colheitaFim },
      { id: 'preso3', sprite: 'refugiado', x: 9, y: 11, dir: 'up', talk: 'preso', cond: () => !F().colheitaFim },
      { id: 'preso4', sprite: 'menino', x: 22, y: 11, dir: 'up', talk: 'preso', cond: () => !F().colheitaFim },
    ],
  };
  M.caminhos = {
    name: 'Os Quatro Caminhos', kind: 'dungeon', grid: G.MAPSTR.CAMINHOS, music: 'cidade', bg: 'caminhos',
    enc: () => 'caminhos', rate: 16,
    ev: { a: 'caminhoKravenox', e: 'caminhoThornox', l: 'caminhoLyra', r: 'caminhoSeraphyne' },
    voices: { 1: 'Uma pintura: o Cisma, o Primeiro, a Fonte.', 2: 'Uma pintura: o pai diante de uma porta. Depois, quatro crianças diante de um trono. E uma quinta, menor.' },
    chests: [],
  };
  M.torreNegra = {
    name: 'A Torre Negra', kind: 'dungeon', grid: G.MAPSTR.TORRENEGRA, music: 'devorador', bg: 'torreNegra',
    enc: () => 'torreNegra', rate: 15,
    ev: { e: 'topoTorreNegra' },
    chests: [{ equip: 'armaduraEspinho' }, { item: 'agua', n: 2 }],
  };
})();
