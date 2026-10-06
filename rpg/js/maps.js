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
})();
