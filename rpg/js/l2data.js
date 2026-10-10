'use strict';
// Livro II — O Reino da Escolha: heróis novos, técnicas, itens, equipamentos, inimigos e o estado inicial.
// Tudo aqui é acrescentado aos dados do Livro I, sem mudar nada do primeiro jogo.
(function () {
  const D = G.data, X = G.gfx;

  // ---------- heróis ----------
  Object.assign(D.HEROES, {
    erya: { name: 'Erya', sprite: 'erya', base: { hp: 36, ep: 28, atk: 6, def: 6, mag: 15, agi: 13 }, grow: { hp: 8, ep: 5.2, atk: 1.6, def: 2.1, mag: 3.6, agi: 1.9 },
      weapon: 'marcaEscolha', armor: 'cotaReino', desc: 'A quinta marca. Olhos brancos de quem lembra de antes de tudo existir.' },
    mae: { name: 'Mãe', sprite: 'mae', base: { hp: 50, ep: 22, atk: 12, def: 8, mag: 12, agi: 10 }, grow: { hp: 10.4, ep: 4.2, atk: 2.8, def: 2.4, mag: 2.8, agi: 1.5 },
      weapon: 'laminaVelha', armor: 'mantoEspinhos', desc: 'Passou milênios presa no Entre. Agora carrega de novo a sua lâmina antiga.' },
    origem: { name: 'Origem', sprite: 'origemH', base: { hp: 40, ep: 32, atk: 8, def: 7, mag: 16, agi: 12 }, grow: { hp: 8.8, ep: 5.6, atk: 1.8, def: 2.2, mag: 3.9, agi: 1.8 },
      weapon: 'luzOrigem', armor: 'mantoAuren', desc: 'A primeira. Escolheu ser humana para descobrir quem é sem precisar ser a Origem.' },
  });

  // ---------- técnicas ----------
  Object.assign(D.TECHS, {
    // Kravenox
    asas: { name: 'Asas Negras', ep: 14, lv: 99, who: 'kravenox', target: 'inimigo', kind: 'dano', pow: 3.1, stat: 'atk', fx: 'dark', desc: 'Os espinhos crescem até virar asas.' },
    tresForcas: { name: 'Três Forças', ep: 22, lv: 99, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 2.2, stat: 'atk', fx: 'silver', desc: 'Luz, sombra e vazio numa só onda.' },
    espinhosLivres: { name: 'Espinhos Livres', ep: 16, lv: 46, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 1.9, stat: 'atk', fx: 'spinesAll', desc: 'Espinhos que ninguém mais controla.' },
    toqueOrigem: { name: 'Toque da Origem', ep: 18, lv: 99, who: 'kravenox', target: 'inimigo', kind: 'dano', pow: 3.6, stat: 'atk', fx: 'stars', desc: 'A Origem mostra ao inimigo o que ele era antes de esquecer.' },
    luzSombra: { name: 'Luz e Sombra', ep: 26, lv: 99, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 2.7, stat: 'atk', fx: 'silver', desc: 'Já não metade. Completo.' },
    // Thornox
    luzPropria: { name: 'Luz Própria', ep: 14, lv: 99, who: 'thornox', target: 'inimigo', kind: 'dano', pow: 3.0, stat: 'mag', fx: 'light', holy: true, desc: '"Agora ela pertence a mim."' },
    auroraMaior: { name: 'Aurora Maior', ep: 18, lv: 50, who: 'thornox', target: 'aliados', kind: 'cura', pow: 2.4, base: 40, fx: 'heal', desc: 'Uma aurora inteira sobre o grupo.' },
    luzCompleta: { name: 'Luz Completa', ep: 22, lv: 99, who: 'thornox', target: 'inimigos', kind: 'dano', pow: 2.1, stat: 'mag', fx: 'light', holy: true, desc: 'Luz com tons escuros. Inteira.' },
    paginaBranca: { name: 'Página em Branco', ep: 26, lv: 99, who: 'thornox', target: 'aliados', kind: 'cura', pow: 3.0, base: 90, clear: true, fx: 'heal', desc: '"Agora começa a minha história."' },
    // Lyra
    cristalMem: { name: 'Cristal das Memórias', ep: 14, lv: 99, who: 'lyra', target: 'aliados', kind: 'cura', pow: 1.6, base: 30, epGive: 18, fx: 'memory', desc: 'Cada cristal guarda uma vida, uma história, um nome.' },
    // Seraphyne
    portaisGuerra: { name: 'Portais de Guerra', ep: 16, lv: 99, who: 'seraphyne', target: 'inimigos', kind: 'dano', pow: 1.9, stat: 'mag', fx: 'violet', desc: 'Guerreiros atravessam os portais e surgem atrás do inimigo.' },
    fronteira: { name: 'Fronteira', ep: 14, lv: 46, who: 'seraphyne', target: 'aliados', kind: 'escudo', fx: 'shield', desc: 'O Vazio vira um limite que ninguém atravessa.' },
    // Erya
    quintaMarca: { name: 'Quinta Marca', ep: 8, lv: 1, who: 'erya', target: 'aliados', kind: 'cura', pow: 1.5, base: 24, clear: true, fx: 'choice', desc: 'A marca da Escolha. Cura e acorda o grupo.' },
    possibilidades: { name: 'Mil Possibilidades', ep: 12, lv: 1, who: 'erya', target: 'inimigos', kind: 'dano', pow: 1.6, stat: 'mag', fx: 'choice', desc: 'Em cada possibilidade, o golpe acerta.' },
    novaPorta: { name: 'Nova Porta', ep: 12, lv: 1, who: 'erya', target: 'aliadoCaido', kind: 'reviver', fx: 'choice', desc: 'Cria uma possibilidade que ainda não existia.' },
    escolhaLivre: { name: 'Escolha Livre', ep: 14, lv: 50, who: 'erya', target: 'aliados', kind: 'escudo', fx: 'shield', desc: 'Ninguém escolhe o destino de vocês.' },
    // a Mãe
    laminaAntiga: { name: 'Lâmina Antiga', ep: 6, lv: 1, who: 'mae', target: 'inimigo', kind: 'dano', pow: 2.3, stat: 'atk', fx: 'white', desc: 'A lâmina que ela guardou por milênios.' },
    correntesBrancas: { name: 'Correntes Brancas', ep: 10, lv: 1, who: 'mae', target: 'inimigos', kind: 'sono', chance: 0.6, fx: 'white', desc: 'As correntes que a prendiam, agora a favor dela.' },
    abraco: { name: 'Abraço de Mãe', ep: 12, lv: 1, who: 'mae', target: 'aliado', kind: 'cura', pow: 3.2, base: 70, clear: true, fx: 'heal', desc: '"Você cresceu."' },
    voltem: { name: 'Voltem, os Dois', ep: 18, lv: 52, who: 'mae', target: 'aliados', kind: 'cura', pow: 1.8, base: 50, fx: 'heal', desc: 'Uma promessa que cura.' },
    // a Origem (humana)
    primeiraEstrela: { name: 'Primeira Estrela', ep: 10, lv: 1, who: 'origem', target: 'inimigo', kind: 'dano', pow: 2.7, stat: 'mag', fx: 'stars', desc: 'A primeira coisa que ela criou.' },
    milEstrelas: { name: 'Mil Estrelas', ep: 18, lv: 1, who: 'origem', target: 'inimigos', kind: 'dano', pow: 1.9, stat: 'mag', fx: 'stars', desc: 'Depois criou outra, e outra, até o vazio ficar cheio.' },
    lagrimaOrigem: { name: 'Lágrima da Origem', ep: 20, lv: 1, who: 'origem', target: 'aliados', kind: 'cura', pow: 2.2, base: 60, clear: true, fx: 'heal', desc: 'Das lágrimas dela nasceu a Primeira Essência.' },
    criar: { name: 'Criar', ep: 16, lv: 58, who: 'origem', target: 'aliadoCaido', kind: 'reviver', fx: 'stars', desc: 'Criar de novo, mesmo depois do erro.' },
  });

  // ---------- itens ----------
  Object.assign(D.ITEMS, {
    paoReino: { name: 'Pão do Reino', price: 220, target: 'aliado', heal: 900, desc: 'Recupera 900 HP. Feito por quem decidiu ficar.' },
    orvalho: { name: 'Orvalho Verde', price: 420, target: 'aliado', heal: 1600, desc: 'Recupera 1600 HP.' },
    cristalEsc: { name: 'Cristal da Escolha', price: 260, target: 'aliado', ep: 140, desc: 'Recupera 140 EP.' },
    folha: { name: 'Folha da Fonte', price: 300, target: 'aliadoCaido', revive: 1, desc: 'Revive um aliado com toda a vida.' },
    lanterna: { name: 'Lanterna de Auren', price: 900, target: 'aliados', heal: 1200, ep: 60, desc: 'Recupera 1200 HP e 60 EP de todo o grupo.' },
  });

  // ---------- equipamentos ----------
  Object.assign(D.EQUIP, {
    // começo do Livro II e Reino da Escolha
    garraEscolha: { name: 'Garras da Escolha', slot: 'arma', who: 'kravenox', atk: 58, price: 1900 },
    cajadoEscolha: { name: 'Cajado do Reino Novo', slot: 'arma', who: 'thornox', atk: 38, mag: 36, price: 1800 },
    cristalReino: { name: 'Cristal das Vozes', slot: 'arma', who: 'lyra', atk: 18, mag: 40, price: 1750 },
    laminaPortal: { name: 'Lâmina dos Portais', slot: 'arma', who: 'seraphyne', atk: 38, mag: 36, price: 1800 },
    cotaReino: { name: 'Cota do Reino da Escolha', slot: 'armadura', def: 56, price: 2000 },
    espadaRei: { name: 'Espinho do Último Rei', slot: 'arma', who: 'kravenox', atk: 66, price: 0 },
    mantoMemoria: { name: 'Manto da Rainha da Memória', slot: 'armadura', def: 62, price: 0 },
    // Parte 2
    marcaEscolha: { name: 'Marca da Escolha', slot: 'arma', who: 'erya', atk: 14, mag: 44, price: 0 },
    laminaVelha: { name: 'Lâmina Antiga', slot: 'arma', who: 'mae', atk: 58, mag: 30, price: 0 },
    garraEspinhos: { name: 'Garras da Cidade dos Espinhos', slot: 'arma', who: 'kravenox', atk: 76, price: 3000 },
    cajadoBranco: { name: 'Cajado da Árvore Branca', slot: 'arma', who: 'thornox', atk: 48, mag: 48, price: 2900 },
    laminaFronteira: { name: 'Lâmina da Fronteira', slot: 'arma', who: 'seraphyne', atk: 48, mag: 46, price: 2900 },
    marcaViva: { name: 'Marca Viva', slot: 'arma', who: 'erya', atk: 18, mag: 54, price: 2800 },
    mantoEspinhos: { name: 'Manto dos Herdeiros', slot: 'armadura', def: 72, price: 3200 },
    armaduraBranca: { name: 'Armadura Branca', slot: 'armadura', def: 80, price: 0 },
    laminaPai: { name: 'Lâmina Quebrada do Pai', slot: 'arma', who: 'kravenox', atk: 84, price: 0 },
    // Parte 3
    garraLivre: { name: 'Garras de Auren', slot: 'arma', who: 'kravenox', atk: 94, price: 4600 },
    cajadoLivro: { name: 'Cajado do Livro em Branco', slot: 'arma', who: 'thornox', atk: 60, mag: 62, price: 4500 },
    marcaLivre: { name: 'Marca Livre', slot: 'arma', who: 'erya', atk: 22, mag: 66, price: 4400 },
    laminaAuren: { name: 'Lâmina de Auren', slot: 'arma', who: 'mae', atk: 78, mag: 38, price: 4400 },
    luzOrigem: { name: 'Luz da Origem', slot: 'arma', who: 'origem', atk: 22, mag: 70, price: 0 },
    mantoAuren: { name: 'Manto de Auren', slot: 'armadura', def: 90, price: 4800 },
    espinhoEscolha: { name: 'Espinho da Escolha', slot: 'arma', who: 'kravenox', atk: 110, price: 0 },
    cajadoEstrela: { name: 'Cajado da Estrela Dourada', slot: 'arma', who: 'thornox', atk: 72, mag: 76, price: 0 },
    marcaQuinta: { name: 'Quinta Marca Inteira', slot: 'arma', who: 'erya', atk: 26, mag: 80, price: 0 },
    coroaEstrelas: { name: 'Mãos que Criam', slot: 'arma', who: 'origem', atk: 26, mag: 86, price: 0 },
    mantoEstrelas: { name: 'Manto entre as Estrelas', slot: 'armadura', def: 102, price: 0 },
  });

  // ---------- inimigos ----------
  const E = D.ENEMIES, before = new Set(Object.keys(E));
  const en = (id, name, art, o, w, h, st, acts, extra = {}) => { E[id] = { id, name, art, o, w, h, ...st, acts, ...extra }; };
  const atk = (w = 3) => ({ w, type: 'atk' });
  const tech = (w, name, pow, target = 'um', fx = 'dark', extra = {}) => ({ w, type: 'tech', name, pow, target, fx, ...extra });
  const LARVA = { c1: '#5c6650', c2: '#8a9476', core: 'rgba(255,170,90,0.55)', eye: '#ff3a2a' };

  // Parte 1 — o Reino da Escolha, a Guerra dos Mundos, o Primeiro Mundo, a cidade de Aster, o Entre
  en('simboloTunel', 'Símbolo do Túnel', 'ghost', { c1: '#a89060', eye: '#fff6c0', crystal: true }, 60, 66, { hp: 760, atk: 96, def: 52, mag: 92, agi: 20, xp: 300, fr: 110 }, [atk(1), tech(3, '"Aqui repousa aquilo que não deveria ter sido criado."', 1.2, 'um', 'dark', { drainEp: 6 })]);
  en('guardaTunel', 'Guardião dos Túneis', 'crystalman', {}, 64, 80, { hp: 980, atk: 104, def: 60, mag: 40, agi: 14, xp: 330, fr: 130 }, [atk(4), tech(1, 'lâmina de pedra negra', 1.55)]);
  en('raizNova', 'Raiz da Árvore Negra', 'root', { c1: '#0a0a10', c2: '#1a1a24', n: 9, thick: 5, eyes: 2, eye: 'rgba(160,255,190,0.9)' }, 70, 70, { hp: 900, atk: 100, def: 58, mag: 50, agi: 12, xp: 320, fr: 120 }, [atk(4), tech(1, 'cresce rápido demais', 1.45)]);
  en('soldadoPedra', 'Soldado de Pedra', 'crystalman', {}, 66, 82, { hp: 1150, atk: 110, def: 64, mag: 36, agi: 12, xp: 360, fr: 140 }, [atk(4), tech(1, 'quatro braços, quatro armas', 1.25, 'todos')]);
  en('criaturaFumaca', 'Criatura de Fumaça', 'ghost', { c1: '#4a4650', eye: '#ffe0a0' }, 58, 64, { hp: 820, atk: 98, def: 50, mag: 104, agi: 22, xp: 340, fr: 130 }, [atk(2), tech(2, 'arranca uma lembrança', 1.2, 'um', 'dark', { drainEp: 10 })], { void: true });
  en('guerreiroAlado', 'Guerreiro Alado', 'herald', {}, 70, 86, { hp: 1000, atk: 112, def: 56, mag: 60, agi: 24, xp: 360, fr: 140 }, [atk(4), tech(1, 'mergulha do céu', 1.6)]);
  en('maquinaMundos', 'Máquina dos Mundos', 'shards', {}, 72, 66, { hp: 1100, atk: 106, def: 70, mag: 90, agi: 14, xp: 380, fr: 150 }, [atk(2), tech(2, 'dispara fragmentos de outro mundo', 1.15, 'todos', 'violet')]);
  en('memoriaErrante', 'Memória Errante', 'ghost', { c1: '#d8c8a0', eye: '#6a5030' }, 56, 62, { hp: 880, atk: 100, def: 52, mag: 108, agi: 22, xp: 350, fr: 130 }, [atk(1), tech(3, 'mostra uma criança correndo', 1.25, 'um', 'dark', { drainEp: 6 })]);
  en('guardaDourado', 'Guarda do Primeiro Rei', 'guardian', { golden: true }, 78, 100, { hp: 1300, atk: 116, def: 68, mag: 60, agi: 16, xp: 400, fr: 160 }, [atk(4), tech(1, 'lança dourada', 1.6), tech(1, 'obedece ao trono', 1.1, 'todos', 'white')]);
  en('cristalSemEss', 'Cristal sem Essência', 'shards', {}, 64, 64, { hp: 960, atk: 104, def: 66, mag: 100, agi: 18, xp: 360, fr: 140 }, [atk(2), tech(2, 'apaga a Essência ao redor', 1.15, 'todos', 'violet', { drainEp: 6 })]);
  en('devoradorMenor', 'Devorador Faminto', 'colossus', {}, 110, 96, { hp: 1500, atk: 118, def: 62, mag: 80, agi: 12, xp: 460, fr: 180 }, [atk(3), tech(2, 'devora um pedaço do mundo', 1.2, 'todos', 'dark')], { void: true, regen: 0.12 });
  en('garrasMundo', 'Garras de Mundo Morto', 'hands', {}, 76, 70, { hp: 1150, atk: 114, def: 60, mag: 60, agi: 16, xp: 400, fr: 150 }, [atk(4), tech(1, 'arrasta para dentro da boca', 1.55)]);
  en('correnteEntre', 'Corrente do Entre', 'hands', { c1: '#c8c8d0', c2: '#6a6a74' }, 76, 70, { hp: 820, atk: 100, def: 58, mag: 70, agi: 16, xp: 380, fr: 140 }, [atk(4), tech(1, 'prende a escolha', 1.3, 'um', 'dark', { sleep: 0.35 })]);
  en('esquecido', 'Esquecido', 'ghost', { c1: '#8a8a9a', eye: '#000000' }, 56, 62, { hp: 760, atk: 96, def: 50, mag: 100, agi: 22, xp: 370, fr: 140 }, [atk(1), tech(3, '"Os Reis apagaram meu nome."', 1.25, 'um', 'dark', { drainEp: 7 })], { void: true });
  en('antigo', 'Antigo sem Rosto', 'sentinel', { c1: '#0a0a0e', c2: '#000000', eye: '#e8f0ff', faceless: true }, 70, 94, { hp: 1600, atk: 124, def: 70, mag: 80, agi: 16, xp: 480, fr: 190 }, [atk(4), tech(1, 'uma pressão que curva o mundo', 1.15, 'todos', 'white')]);
  en('antigoFera', 'Antigo de Pedra e Fumaça', 'colossus', {}, 120, 100, { hp: 1900, atk: 128, def: 72, mag: 86, agi: 12, xp: 520, fr: 200 }, [atk(3), tech(2, 'fissuras de luz', 1.2, 'todos', 'white')]);
  // chefes da Parte 1
  en('thornoxCoroado', 'O Thornox Coroado', 'herald', {}, 60, 78, { hp: 9000, atk: 104, def: 54, mag: 100, agi: 22, xp: 2400, fr: 900 }, [atk(3), tech(2, 'antecipa cada passo', 1.4), tech(1, 'luz negra', 1.15, 'todos', 'dark'), tech(1, '"Eu sou aquilo que acontece quando você não consegue salvá-lo."', 1.0, 'todos', 'dark', { drainEp: 8 })], { boss: true });
  en('ultimoRei', 'O Último Rei', 'guardian', {}, 84, 108, { hp: 14000, atk: 116, def: 60, mag: 96, agi: 20, xp: 3200, fr: 1200 }, [atk(3), tech(2, 'a espada que corta Essência', 1.45, 'um', 'white', { drainEp: 14 }), tech(1, 'luta como uma lei', 1.2, 'todos', 'white'), tech(1, '"Posso apagar aquilo que faz você ser você."', 1.0, 'todos', 'white', { drainEp: 8 })], { boss: true });
  en('reiPedra', 'O Rei de Pedra', 'colossus', {}, 130, 116, { hp: 12000, atk: 124, def: 70, mag: 70, agi: 10, xp: 2800, fr: 1000 }, [atk(4), tech(2, 'esmaga a planície', 1.25, 'todos'), tech(1, 'golpe de montanha', 1.9)], { boss: true });
  en('reiFumaca', 'O Rei de Fumaça', 'ghost', { c1: '#2a2830', eye: '#ffe080' }, 70, 80, { hp: 9000, atk: 108, def: 56, mag: 116, agi: 26, xp: 2600, fr: 900 }, [atk(1), tech(2, '"Memórias são fraquezas."', 1.25, 'um', 'dark', { drainEp: 12 }), tech(1, 'cobre o céu', 1.1, 'todos', 'dark', { sleep: 0.25 })], { boss: true, void: true });
  en('reiAsas', 'O Rei das Asas', 'herald', {}, 80, 96, { hp: 13000, atk: 122, def: 62, mag: 90, agi: 28, xp: 3200, fr: 1200 }, [atk(3), tech(2, 'o grito que traz o medo da morte', 1.15, 'todos', 'dark', { sleep: 0.25 }), tech(2, 'espada negra', 1.6)], { boss: true });
  en('primeiroRei', 'O Primeiro Rei', 'guardian', { golden: true, unmasked: true }, 84, 108, { hp: 20000, atk: 128, def: 66, mag: 110, agi: 22, xp: 4200, fr: 1600 }, [atk(3), tech(2, 'força invisível', 1.25, 'todos', 'white'), tech(1, 'a espada atravessada no peito', 1.9), tech(1, '"Criar o mundo perfeito."', 1.0, 'todos', 'white', { drainEp: 10 })], { boss: true });
  en('primeiroReiD', 'O Primeiro Rei', 'guardian', { golden: true, unmasked: true }, 84, 108, { hp: 4200, atk: 100, def: 56, mag: 100, agi: 22, xp: 2400, fr: 800 }, [atk(4), tech(2, 'golpes cada vez mais desesperados', 1.45), tech(1, '"Você não deveria lembrar."', 1.2, 'um', 'white', { drainEp: 8 })], { boss: true });
  en('caos', 'Caos', 'root', { c1: '#3a2a20', c2: '#e0d0c0', n: 16, thick: 6, eyes: 6, eye: 'rgba(255,255,255,0.95)', mouth: true, seed: 66 }, 130, 124, { hp: 30000, atk: 120, def: 70, mag: 110, agi: 18, xp: 4800, fr: 1800 }, [atk(2), tech(2, 'transforma espinhos em árvores', 1.2, 'todos', 'violet'), tech(1, 'o espaço desaparece', 1.15, 'todos', 'dark', { sleep: 0.3 }), tech(1, 'mostra um mundo onde vocês perderam', 1.4, 'um', 'violet', { drainEp: 10 })], { boss: true, void: true });
  en('devoradorGrande', 'Devorador de Mundos', 'colossus', {}, 160, 120, { hp: 26000, atk: 126, def: 66, mag: 96, agi: 12, xp: 4400, fr: 1600 }, [atk(2), tech(2, 'montanhas nas costas', 1.2, 'todos'), tech(1, 'olhos que são portais', 1.8), tech(1, 'luto de mil mundos', 1.0, 'todos', 'dark', { drainEp: 8 })], { boss: true, void: true, regen: 0.06 });
  en('primeiroIrmao', 'O Primeiro Irmão', 'colossus', {}, 150, 124, { hp: 24000, atk: 128, def: 68, mag: 108, agi: 16, xp: 4600, fr: 1700 }, [atk(2), tech(2, 'quatro braços', 1.25, 'todos'), tech(1, 'seis asas', 1.3, 'todos', 'dark'), tech(1, '"VOCÊ CARREGA AQUILO QUE ME PERTENCE."', 1.7, 'um', 'dark', { drainEp: 10 })], { boss: true, void: true });
  en('primeiroAntigo', 'O Primeiro dos Antigos', 'colossus', {}, 160, 124, { hp: 34000, atk: 132, def: 72, mag: 118, agi: 16, xp: 5600, fr: 2000 }, [atk(2), tech(2, '"TUDO MORRE."', 1.25, 'todos', 'white'), tech(1, 'o vazio em forma de cabeça', 1.9), tech(1, '"TUDO QUE VOCÊ AMA VAI DESAPARECER."', 1.0, 'todos', 'white', { drainEp: 10 })], { boss: true });

  // Parte 2 — o mundo novo, a Cidade dos Espinhos, a Árvore Branca, a Biblioteca do Fim
  en('feraFolhas', 'Fera de Folhas Transparentes', 'root', { c1: '#1a3a2a', c2: '#4a8a6a', n: 8, thick: 4, eyes: 2, eye: 'rgba(220,255,240,0.9)' }, 70, 70, { hp: 1500, atk: 126, def: 72, mag: 70, agi: 18, xp: 520, fr: 200 }, [atk(4), tech(1, 'folhas como lâminas', 1.2, 'todos')]);
  en('pedraFlutuante', 'Pedra Flutuante', 'shards', {}, 66, 64, { hp: 1400, atk: 124, def: 80, mag: 110, agi: 18, xp: 520, fr: 200 }, [atk(2), tech(2, 'cai das montanhas do céu', 1.2, 'todos', 'violet')]);
  en('marVerde', 'Espírito do Mar Verde', 'ghost', { c1: '#3a8a6a', eye: '#e0fff0' }, 58, 64, { hp: 1300, atk: 118, def: 66, mag: 128, agi: 26, xp: 500, fr: 190 }, [atk(1), tech(3, 'canta uma onda verde', 1.25, 'um', 'dark', { drainEp: 8 })]);
  en('herdeiro', 'Herdeiro', 'sentinel', { c1: '#14101a', c2: '#06040a', eye: '#ff3a2a', img: null }, 64, 84, { hp: 1700, atk: 132, def: 78, mag: 70, agi: 18, xp: 560, fr: 220 }, [atk(5), tech(1, 'espinho invertido', 1.55)]);
  en('sacerdote', 'Sacerdote dos Espinhos', 'ghost', { c1: '#6a2a2a', eye: '#ffd060', crystal: true }, 60, 66, { hp: 1400, atk: 120, def: 68, mag: 132, agi: 22, xp: 540, fr: 210 }, [atk(1), tech(2, '"Ele será deus. Ele será demônio."', 1.2, 'todos', 'dark', { drainEp: 6 })]);
  en('herdeiroCap', 'Capitão dos Herdeiros', 'herald', {}, 70, 86, { hp: 2100, atk: 138, def: 80, mag: 90, agi: 20, xp: 640, fr: 260 }, [atk(4), tech(1, 'ordem do homem mascarado', 1.25, 'todos'), tech(1, 'lâmina longa', 1.7)]);
  en('raizMemoria', 'Raiz de Memória', 'root', { c1: '#d8d4cc', c2: '#a8a49a', n: 9, thick: 5, eyes: 1, eye: 'rgba(255,220,120,0.9)' }, 72, 74, { hp: 1800, atk: 134, def: 80, mag: 90, agi: 14, xp: 600, fr: 240 }, [atk(4), tech(1, 'carrega um momento', 1.5, 'um', 'white', { sleep: 0.25 })]);
  en('galhoPossib', 'Galho de Possibilidades', 'shards', {}, 66, 66, { hp: 1600, atk: 130, def: 76, mag: 126, agi: 22, xp: 590, fr: 230 }, [atk(2), tech(2, 'mostra o que poderia ter sido', 1.2, 'todos', 'white', { drainEp: 6 })]);
  en('ossoMundo', 'Guarda de Ossos de Mundos', 'herald', {}, 70, 88, { hp: 2000, atk: 140, def: 82, mag: 96, agi: 18, xp: 660, fr: 260 }, [atk(4), tech(1, 'as estrelas se apagam', 1.2, 'todos', 'dark')], { void: true });
  en('livroVoador', 'Livro Voador', 'shards', {}, 64, 64, { hp: 1500, atk: 132, def: 74, mag: 134, agi: 26, xp: 600, fr: 240 }, [atk(2), tech(2, 'páginas cortantes', 1.15, 'todos', 'white')]);
  en('tintaViva', 'Tinta Viva', 'ghost', { c1: '#0a0a14', eye: '#e0e8ff' }, 58, 64, { hp: 1600, atk: 128, def: 70, mag: 138, agi: 24, xp: 610, fr: 240 }, [atk(1), tech(3, 'escreve uma possibilidade ruim', 1.3, 'um', 'dark', { drainEp: 8 })], { void: true });
  en('personagem', 'Personagem Esquecido', 'sentinel', { c1: '#8a8478', c2: '#5a564e', eye: '#000000', faceless: true }, 64, 84, { hp: 2000, atk: 138, def: 82, mag: 80, agi: 18, xp: 650, fr: 250 }, [atk(5), tech(1, '"Ninguém leu minha história."', 1.5)]);
  // chefes da Parte 2
  en('mascarado', 'O Homem Mascarado', 'herald', {}, 60, 78, { hp: 16000, atk: 134, def: 74, mag: 110, agi: 24, xp: 4400, fr: 1600 }, [atk(3), tech(2, 'olhos completamente negros', 1.4), tech(1, 'a espada longa dos Herdeiros', 1.75)], { boss: true });
  en('reiUltimo', 'O Rei do Último Mundo', 'herald', { img: 'k_futuro' }, 52, 66, { hp: 26000, atk: 136, def: 72, mag: 124, agi: 22, xp: 6400, fr: 2400 }, [atk(3), tech(2, 'mundos queimando atrás dele', 1.25, 'todos', 'dark'), tech(1, 'apaga a luz', 1.2, 'um', 'dark', { drainEp: 14 }), tech(1, '"Sou aquilo que acontece quando ele vence."', 1.8)], { boss: true });
  en('paiBranco', 'O Pai de Armadura Branca', 'guardian', { unmasked: true }, 84, 108, { hp: 5600, atk: 112, def: 66, mag: 100, agi: 22, xp: 5000, fr: 1800 }, [atk(4), tech(2, 'a lâmina negra do primeiro conflito', 1.5), tech(1, 'cada golpe abre uma memória', 1.2, 'um', 'dark', { drainEp: 10 })], { boss: true });
  en('primeiroLeitor', 'O Primeiro Leitor', 'ghost', { c1: '#e8e4d8', eye: '#ffffff' }, 64, 76, { hp: 34000, atk: 134, def: 78, mag: 140, agi: 22, xp: 7000, fr: 2600 }, [atk(1), tech(2, 'milhares de livros voam das estantes', 1.2, 'todos', 'white'), tech(2, 'vira uma página', 1.0, 'todos', 'white', { sleep: 0.25 }), tech(1, 'escreve MORTE', 1.9, 'um', 'dark')], { boss: true });

  // Parte 3 — Auren, o destino de Thornox, a estrada entre as estrelas, o Recomeço, o fim
  en('apagado', 'Os Apagados', 'ghost', { c1: '#1a1a20', eye: '#ffffff' }, 58, 64, { hp: 2100, atk: 148, def: 84, mag: 150, agi: 26, xp: 760, fr: 300 }, [atk(1), tech(3, 'esquece o próprio nome', 1.25, 'um', 'dark', { drainEp: 8 })], { void: true });
  en('fragSilencio', 'Fragmento do Silêncio', 'shards', {}, 66, 66, { hp: 2300, atk: 150, def: 90, mag: 144, agi: 22, xp: 780, fr: 300 }, [atk(2), tech(2, 'remove uma possibilidade', 1.2, 'todos', 'violet')], { void: true });
  en('medoAntigo', 'Medo Antigo', 'ghost', { c1: '#3a2a3a', eye: '#ffd060' }, 58, 64, { hp: 1900, atk: 140, def: 80, mag: 150, agi: 24, xp: 740, fr: 280 }, [atk(1), tech(3, '"Seu irmão é mais importante."', 1.3, 'um', 'dark', { drainEp: 8 })]);
  en('culpa', 'A Culpa', 'herald', {}, 70, 88, { hp: 2400, atk: 152, def: 88, mag: 100, agi: 18, xp: 800, fr: 300 }, [atk(4), tech(1, '"Você também escolheu o Cisma."', 1.6)]);
  en('estrelaCadente', 'Estrela Cadente', 'shards', {}, 64, 64, { hp: 2200, atk: 150, def: 88, mag: 150, agi: 28, xp: 780, fr: 300 }, [atk(2), tech(2, 'cai sobre a estrada', 1.2, 'todos', 'white')]);
  en('semRostoNome', 'Habitante sem Rosto', 'sentinel', { c1: '#d8d4cc', c2: '#a8a49c', eye: '#d8d4cc', faceless: true }, 64, 84, { hp: 2500, atk: 154, def: 92, mag: 90, agi: 20, xp: 820, fr: 320 }, [atk(5), tech(1, 'escreve o seu nome errado', 1.5, 'um', 'dark', { drainEp: 8 })]);
  en('sombraSilencio', 'Sombra do Silêncio', 'ghost', { c1: '#06060a', eye: '#ffffff' }, 60, 66, { hp: 2400, atk: 152, def: 86, mag: 160, agi: 26, xp: 820, fr: 320 }, [atk(1), tech(3, '"Eu não queria destruir nada."', 1.3, 'um', 'dark', { drainEp: 9 })], { void: true });
  en('portaViva', 'Porta Viva', 'hands', {}, 76, 70, { hp: 2700, atk: 158, def: 94, mag: 90, agi: 18, xp: 860, fr: 330 }, [atk(4), tech(1, 'puxa para entre duas escolhas', 1.55)]);
  en('reflexo', 'Reflexo do Rio Parado', 'ghost', { c1: '#7a9ab0', eye: '#203040' }, 58, 64, { hp: 2300, atk: 150, def: 84, mag: 158, agi: 28, xp: 820, fr: 320 }, [atk(1), tech(3, 'mostra a vida que poderia ter sido', 1.3, 'um', 'dark', { sleep: 0.25 })]);
  en('possRecusada', 'Possibilidade Recusada', 'herald', {}, 70, 88, { hp: 2800, atk: 160, def: 94, mag: 110, agi: 20, xp: 880, fr: 340 }, [atk(4), tech(1, 'o caminho que vocês não escolheram', 1.25, 'todos')]);
  en('pedraVermelha', 'Guardião da Estrela Vermelha', 'crystalman', {}, 66, 82, { hp: 3000, atk: 164, def: 100, mag: 90, agi: 18, xp: 900, fr: 350 }, [atk(4), tech(1, 'luz vermelha da montanha', 1.6)]);
  en('versaoPerdida', 'Versão Perdida', 'sentinel', { c1: '#2a0a0a', c2: '#140404', eye: '#ff2020' }, 64, 84, { hp: 2900, atk: 166, def: 96, mag: 100, agi: 22, xp: 900, fr: 350 }, [atk(5), tech(1, '"Eu fiquei para trás."', 1.55)]);
  en('nomeApagado', 'Nome que Desaparece', 'ghost', { c1: '#f0f0f0', eye: '#a0a0a0' }, 58, 64, { hp: 2600, atk: 160, def: 90, mag: 170, agi: 28, xp: 900, fr: 350 }, [atk(1), tech(3, 'apaga uma marca da árvore', 1.3, 'um', 'white', { drainEp: 10 })]);
  en('galhoBranco', 'Galho da Árvore dos Nomes', 'root', { c1: '#e8e8e4', c2: '#b8b8b0', n: 10, thick: 5, eyes: 2, eye: 'rgba(120,180,255,0.9)' }, 72, 74, { hp: 3200, atk: 168, def: 102, mag: 96, agi: 16, xp: 940, fr: 360 }, [atk(4), tech(1, 'enrola-se como uma história', 1.6)]);
  en('chamaApagada', 'Chama Apagada', 'ghost', { c1: '#1a2a4a', eye: '#78b8ff' }, 58, 64, { hp: 2800, atk: 164, def: 92, mag: 176, agi: 28, xp: 960, fr: 370 }, [atk(1), tech(3, 'a luz azul se apaga', 1.3, 'um', 'dark', { drainEp: 10 })], { void: true });
  en('vazioMenor', 'Pedaço do Vazio', 'shards', {}, 66, 66, { hp: 3100, atk: 168, def: 100, mag: 170, agi: 24, xp: 980, fr: 380 }, [atk(2), tech(2, 'devolve ao lugar de onde veio', 1.2, 'todos', 'violet')], { void: true });
  // chefes da Parte 3
  en('primeiroSilencio', 'O Primeiro Silêncio', 'colossus', {}, 150, 124, { hp: 30000, atk: 150, def: 84, mag: 150, agi: 20, xp: 7600, fr: 2800 }, [atk(2), tech(2, 'a cidade desaparece por um segundo', 1.2, 'todos', 'dark'), tech(1, '"Estou removendo possibilidades."', 1.9, 'um', 'dark'), tech(1, 'o rosto muda a cada segundo', 1.0, 'todos', 'dark', { drainEp: 12 })], { boss: true, void: true });
  en('sombraThornox', 'A Sombra sobre Thornox', 'ghost', { c1: '#000000', eye: '#ffffff' }, 80, 90, { hp: 9000, atk: 116, def: 80, mag: 120, agi: 24, xp: 5600, fr: 2000 }, [atk(1), tech(3, '"Ele não pertence a você."', 1.35, 'um', 'dark', { drainEp: 10 })], { boss: true, void: true });
  en('kravenoxAlt', 'O Kravenox que Escolheu o Mundo', 'herald', { img: 'k_futuro' }, 52, 66, { hp: 30000, atk: 160, def: 90, mag: 130, agi: 26, xp: 8000, fr: 3000 }, [atk(3), tech(2, 'espada da armadura negra', 1.5), tech(1, '"Alguém precisava pagar o preço."', 1.25, 'todos', 'dark'), tech(1, 'olhos vermelhos', 1.85)], { boss: true });
  en('thornoxSilencio', 'Thornox, o Primeiro Silêncio', 'herald', {}, 60, 78, { hp: 32000, atk: 156, def: 88, mag: 160, agi: 24, xp: 8400, fr: 3200 }, [atk(2), tech(2, 'ausência', 1.25, 'todos', 'dark'), tech(1, '"Eu sou o que foi destruído."', 1.8, 'um', 'dark', { drainEp: 12 })], { boss: true, void: true });
  en('aveline', 'Aveline', 'mother', { golden: true }, 120, 130, { hp: 44000, atk: 160, def: 90, mag: 170, agi: 22, xp: 9000, fr: 3400 }, [atk(1), tech(2, 'a página vira', 1.2, 'todos', 'white', { drainEp: 10 }), tech(2, 'o mundo começa a desaparecer', 1.3, 'todos', 'white'), tech(1, '"Eu sinto muito."', 1.0, 'todos', 'white', { sleep: 0.25 })], { boss: true });
  en('silencioRosto', 'O Primeiro Silêncio com o Rosto de Kravenox', 'herald', { img: 'k_futuro' }, 52, 66, { hp: 9000, atk: 126, def: 86, mag: 130, agi: 24, xp: 6000, fr: 2200 }, [atk(2), tech(2, '"Eu fui a escolha que vocês recusaram."', 1.3, 'um', 'dark', { drainEp: 10 })], { boss: true, void: true });
  en('ultimoInimigo', 'O Último Inimigo', 'ghost', { c1: '#e8e8f0', eye: '#e8e8f0' }, 70, 84, { hp: 60000, atk: 172, def: 96, mag: 180, agi: 26, xp: 0, fr: 0 }, [atk(1), tech(2, 'devolve as possibilidades ao vazio', 1.25, 'todos', 'violet'), tech(2, 'as chamas azuis se apagam', 1.2, 'todos', 'dark', { drainEp: 12 }), tech(1, '"Um mundo precisa de limites."', 1.9, 'um', 'violet')], { boss: true, void: true });

  Object.assign(D.ENC, {
    tuneis: [['simboloTunel'], ['guardaTunel'], ['simboloTunel', 'simboloTunel'], ['raizNova', 'simboloTunel'], ['guardaTunel', 'raizNova']],
    escolha: [['raizNova'], ['raizNova', 'raizNova'], ['criaturaFumaca'], ['soldadoPedra']],
    guerraMundos: [['soldadoPedra'], ['criaturaFumaca', 'criaturaFumaca'], ['guerreiroAlado'], ['maquinaMundos', 'criaturaFumaca'], ['soldadoPedra', 'guerreiroAlado'], ['maquinaMundos']],
    primeiroMundo: [['memoriaErrante'], ['guardaDourado'], ['memoriaErrante', 'memoriaErrante'], ['guardaDourado', 'memoriaErrante']],
    norte: [['cristalSemEss'], ['cristalSemEss', 'cristalSemEss'], ['esquecido'], ['cristalSemEss', 'esquecido']],
    cidadeAster: [['devoradorMenor'], ['garrasMundo', 'garrasMundo'], ['devoradorMenor', 'garrasMundo']],
    entre: [['correnteEntre'], ['esquecido'], ['esquecido']],
    antigos: [['antigo'], ['antigoFera'], ['antigo', 'antigo'], ['antigoFera', 'antigo']],
    mundoNovo: [['feraFolhas'], ['pedraFlutuante'], ['marVerde', 'marVerde'], ['feraFolhas', 'pedraFlutuante'], ['marVerde', 'feraFolhas']],
    espinhos: [['herdeiro'], ['sacerdote', 'herdeiro'], ['herdeiro', 'herdeiro'], ['herdeiroCap'], ['sacerdote', 'sacerdote']],
    arvoreBranca: [['raizMemoria'], ['galhoPossib', 'galhoPossib'], ['raizMemoria', 'galhoPossib'], ['ossoMundo'], ['ossoMundo', 'galhoPossib']],
    biblioteca: [['livroVoador'], ['tintaViva', 'livroVoador'], ['personagem'], ['livroVoador', 'livroVoador', 'livroVoador'], ['personagem', 'tintaViva']],
    auren: [['apagado'], ['fragSilencio'], ['apagado', 'apagado'], ['fragSilencio', 'apagado']],
    destino: [['medoAntigo'], ['culpa'], ['medoAntigo', 'medoAntigo']],
    estrelas: [['estrelaCadente'], ['semRostoNome'], ['estrelaCadente', 'estrelaCadente'], ['semRostoNome', 'estrelaCadente']],
    dentroThornox: [['sombraSilencio'], ['portaViva'], ['sombraSilencio', 'portaViva'], ['sombraSilencio', 'sombraSilencio']],
    dentroSolo: [['sombraSilencio'], ['portaViva']],
    caminhoFim: [['reflexo'], ['possRecusada'], ['reflexo', 'reflexo'], ['possRecusada', 'reflexo']],
    montanhas: [['pedraVermelha'], ['versaoPerdida'], ['pedraVermelha', 'versaoPerdida'], ['versaoPerdida', 'versaoPerdida']],
    arvoreNomes: [['nomeApagado'], ['galhoBranco'], ['nomeApagado', 'nomeApagado'], ['galhoBranco', 'nomeApagado']],
    chamasAzuis: [['chamaApagada'], ['vazioMenor'], ['chamaApagada', 'vazioMenor'], ['chamaApagada', 'chamaApagada', 'vazioMenor']],
  });

  // ---------- estado inicial do Livro II ----------
  // Os quatro saem do fim do Livro I: fortes, com as técnicas que aprenderam na Fonte e na Primeira Cidade.
  D.newState2 = function () {
    const st = { book: 2, party: [], inv: { elixir: 4, agua: 3, cristalG: 3, raiz: 2, nevoa: 2 }, fr: 1200, flags: { prata: 1 }, chests: {}, loc: { mode: 'field', map: 'escolha', x: 20, y: 30, dir: 'up' }, time: 0, visited: {} };
    for (const k of ['cupula', 'quatro', 'onda', 'muralha', 'milMemorias', 'espelho', 'memoriaColetiva']) st.flags['tec_' + k] = 1;
    const prev = G.state; G.state = st;
    const gear = { kravenox: ['garraAntiga', 'mantoCidade'], thornox: ['cajadoArkan', 'mantoCidade'], lyra: ['cristalCidade', 'mantoCidade'], seraphyne: ['laminaFilha', 'mantoCidade'] };
    for (const id of ['kravenox', 'thornox', 'lyra', 'seraphyne']) { const h = D.newHero(id, 38); h.weapon = gear[id][0]; h.armor = gear[id][1]; D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; st.party.push(h); }
    G.state = prev;
    return st;
  };
  // um herói novo entra no nível do grupo
  D.joinHero = function (id) {
    const st = G.state; if (st.party.find(h => h.id === id)) return;
    const lv = Math.max(...st.party.map(h => h.lv));
    const h = (st.bench && st.bench[id]) || D.newHero(id, lv);
    while (h.lv < lv) h.lv++;
    h.xp = Math.max(h.xp, D.xpTotal(h.lv)); D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; h.alive = true; h.status = {};
    st.party.push(h);
  };
  D.leaveHero = function (id) { const st = G.state; const i = st.party.findIndex(h => h.id === id); if (i >= 0) { st.bench = st.bench || {}; st.bench[id] = st.party[i]; st.party.splice(i, 1); } };

  // ---------- retratos e imagens ----------
  X.extraImages = X.extraImages || [];
  const PORTRAITS = { erya: ['#0e2a1a', '#a8ffc8'], origem: ['#0a0a2a', '#c8d8ff'], origemH: ['#14142a', '#e0e8ff'], aster: ['#2a2410', '#ffd860'],
    rainha: ['#1a1a2a', '#e8e8ff'], ultimoRei: ['#1a1a20', '#ffffff'], thornoxC: ['#0a0a10', '#c8a8ff'], primeiroRei: ['#2a2008', '#ffd040'], caos: ['#1a1410', '#ffffff'],
    paiOssos: ['#1a1414', '#e0d0c0'], irmao: ['#0a0004', '#ff3040'], velha: ['#20201a', '#f0f0e0'], mascarado: ['#0a0a0a', '#c0c0c0'], bibliotecario: ['#1a140a', '#e8d0a0'],
    leitor: ['#1a1a1a', '#ffffff'], estranho: ['#0a0a14', '#a0a8ff'], liora: ['#1a1a24', '#ffe8c0'], aveline: ['#2a0808', '#ff6050'], azul: ['#081a3a', '#78b8ff'],
    kalt: ['#1a0404', '#ff2020'], tSilencio: ['#000000', '#ffffff'], senhora: ['#2a2018', '#ffd8a0'], primeiroK: ['#0a1a2a', '#a8d8ff'], paiBranco: ['#1a1a1a', '#ffffff'] };
  for (const [k, [b0, gl]] of Object.entries(PORTRAITS)) { X.extraImages.push('p_' + k); X.addPortrait(k, b0, gl); }
  for (const n of ['erya', 'mae', 'origem', 'origemH', 'aster', 'rainha', 'bibliotecario', 'leitor', 'liora', 'aveline', 'azul', 'velha', 'estranho', 'senhora', 'aldeao', 'aldea', 'crianca'])
    for (const d of ['down', 'up', 'left', 'right']) for (const f of [0, 1]) X.extraImages.push('s_' + n + '_' + d + '_' + f);
  for (const id of Object.keys(E)) if (!before.has(id) && !['guardaDourado', 'reiUltimo', 'kravenoxAlt', 'silencioRosto'].includes(id)) X.extraImages.push('e_' + id);

  // personagens desenhados no mapa (sprites procedurais, caso falte a imagem)
  Object.assign(X.SPEC, {
    erya: { body: '#2a3a30', bodyD: '#1a2620', skin: '#e0d0c4', hair: '#1a1418', hairD: '#0e0a0e', eye: '#ffffff', longHair: true, dress: true, small: true, marks: '#8affb0', outline: '#0b0710' },
    mae: { body: '#e8e0d0', bodyD: '#b8ae9a', skin: '#e0c8b4', hair: '#5a4a3a', hairD: '#3a2e24', eye: '#e8b040', longHair: true, dress: true, sword: true, outline: '#1a1418' },
    origem: { body: '#141428', bodyD: '#0a0a18', skin: '#e8e4f0', hair: '#c8d0ff', hairD: '#8a90c0', eye: '#ffffff', small: true, dress: true, marks: '#ffffff', outline: '#000' },
    origemH: { body: '#d8dcf0', bodyD: '#a8acc8', skin: '#ecdcd0', hair: '#c8d0ff', hairD: '#8a90c0', eye: '#5a6aa0', longHair: true, dress: true, outline: '#1a1418' },
    aster: { body: '#3a3428', bodyD: '#262218', skin: '#c8a888', hair: '#1a1410', hairD: '#0e0a08', eye: '#ffd040', outline: '#0b0710' },
    rainha: { body: '#f0f0f4', bodyD: '#c8c8d0', skin: '#e8e4ec', hair: '#e0e4f0', hairD: '#b0b4c4', eye: '#a0a8c0', longHair: true, dress: true, outline: '#2a2a3a' },
    bibliotecario: { body: '#4a3a24', bodyD: '#2e2416', skin: '#c8a888', hair: '#6a5a40', hairD: '#4a3e2a', eye: '#e8d0a0', hood: true, outline: '#0b0710' },
    leitor: { body: '#c8c0b0', bodyD: '#a09888', skin: '#e8e0d8', hair: '#3a3028', hairD: '#2a2018', eye: '#ffffff', small: true, outline: '#1a1418' },
    liora: { body: '#5a6a8a', bodyD: '#3a4a6a', skin: '#ecd4c4', hair: '#6a4a2a', hairD: '#4a3420', eye: '#3a2a20', small: true, dress: true, longHair: true, outline: '#1a1418' },
    aveline: { body: '#8a1a1a', bodyD: '#5a0e0e', skin: '#ecd8cc', hair: '#3a2018', hairD: '#24140e', eye: '#d8c8a0', hood: true, outline: '#1a0606' },
    azul: { body: '#2a4a8a', bodyD: '#1a3060', skin: '#e8e0e8', hair: '#78b8ff', hairD: '#4a88d0', eye: '#203060', small: true, dress: true, outline: '#0a1430' },
    velha: { body: '#5a5048', bodyD: '#3e3830', skin: '#d8c8b8', hair: '#e8e4e0', hairD: '#b8b4b0', eye: '#c8e0ff', longHair: true, dress: true, outline: '#0b0710' },
    estranho: { body: '#4a4a5a', bodyD: '#2e2e3a', skin: '#d0b8a0', hair: '#141016', hairD: '#0b080d', eye: '#e8f0ff', outline: '#0b0710' },
    senhora: { body: '#6a4a3a', bodyD: '#4a3428', skin: '#d8b8a0', hair: '#b8b0a8', hairD: '#8a847e', eye: '#4a3a2a', dress: true, longHair: true, outline: '#0b0710' },
    aldeao: { body: '#4a5a3a', bodyD: '#34402a', skin: '#c8a888', hair: '#3a2a1a', hairD: '#2a1e12', eye: '#2a1a10', outline: '#0b0710' },
    aldea: { body: '#7a5a4a', bodyD: '#5a4034', skin: '#e0c0a8', hair: '#5a3a24', hairD: '#3a2618', eye: '#2a1a10', dress: true, longHair: true, outline: '#0b0710' },
    crianca: { body: '#8a6a3a', bodyD: '#6a4e28', skin: '#e8c8b0', hair: '#4a2e1a', hairD: '#2e1c10', eye: '#2a1a10', small: true, outline: '#0b0710' },
  });

  // nomes de quem fala → retrato
  const P2 = { 'Erya': 'erya', 'Aster': 'aster', 'A Rainha da Memória': 'rainha', 'O Último Rei': 'ultimoRei', 'O Thornox Coroado': 'thornoxC', 'O Primeiro Rei': 'primeiroRei', 'Caos': 'caos',
    'O Homem de Ossos': 'paiOssos', 'O Primeiro Irmão': 'irmao', 'A Velha': 'velha', 'O Homem Mascarado': 'mascarado', 'O Bibliotecário': 'bibliotecario', 'O Primeiro Leitor': 'leitor',
    'O Homem da Estrela': 'estranho', 'Liora': 'liora', 'Aveline': 'aveline', 'Azul': 'azul', 'O Outro Kravenox': 'kalt', 'O Outro Thornox': 'tSilencio', 'A Senhora': 'senhora',
    'O Garoto': 'primeiroK', 'O Homem de Branco': 'paiBranco', 'O Rei do Último Mundo': 'reiEspinhos', 'O Primeiro Silêncio': 'tSilencio' };
  const base = G.portraitFor;
  G.portraitFor = function (name) {
    if (G.book === 2) {
      if (name === 'Origem' || name === 'A Origem') return X.P[G.state && G.state.flags.origemHumana ? 'origemH' : 'origem'];
      if (name === 'Mãe' || name === 'A Mãe') return X.P.mae;
      if (name === 'O Pai') return X.P.paiVivo;
      if (P2[name]) return X.P[P2[name]];
    }
    return base(name);
  };
})();
