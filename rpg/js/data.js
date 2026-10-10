'use strict';
// Dados do jogo: heróis, técnicas, itens, equipamentos, inimigos e estado salvo.
(function () {
  const D = G.data = {};

  D.HEROES = {
    kravenox: { name: 'Kravenox', sprite: 'kravenox', base: { hp: 44, ep: 12, atk: 13, def: 6, mag: 10, agi: 8 }, grow: { hp: 10, ep: 3, atk: 3, def: 2, mag: 2.5, agi: 1 },
      weapon: 'garras', armor: 'manto', desc: 'Despertou no Abismo Carmesim. Espinhos negros, fome e perguntas.' },
    thornox: { name: 'Thornox', sprite: 'thornox', base: { hp: 52, ep: 18, atk: 11, def: 9, mag: 12, agi: 7 }, grow: { hp: 11, ep: 4, atk: 2.4, def: 2.6, mag: 3, agi: 1 },
      weapon: 'cajadoRaiz', armor: 'manto', desc: 'O Guardião. Seus espinhos brilham com uma luz suave.' },
    lyra: { name: 'Lyra', sprite: 'lyra', base: { hp: 38, ep: 26, atk: 7, def: 6, mag: 14, agi: 11 }, grow: { hp: 7.5, ep: 5, atk: 1.6, def: 2, mag: 3.5, agi: 1.8 },
      weapon: 'cristalMemoria', armor: 'vestido', desc: 'A irmã esquecida. Guardiã da última memória da Fonte.' },
    seraphyne: { name: 'Seraphyne', sprite: 'seraphyne', base: { hp: 46, ep: 22, atk: 12, def: 8, mag: 13, agi: 12 }, grow: { hp: 9.5, ep: 4.2, atk: 2.6, def: 2.2, mag: 3.1, agi: 1.7 },
      weapon: 'maosVazio', armor: 'armaduraNegra', desc: 'Filha da Essência. Armadura negra, cabelos prateados e o Vazio na palma da mão.' },
  };

  // alvo: inimigo | inimigos | aliado | aliados | aliadoCaido | eu
  D.TECHS = {
    espinhos: { name: 'Espinhos', ep: 3, lv: 1, who: 'kravenox', target: 'inimigo', kind: 'dano', pow: 1.7, stat: 'atk', fx: 'spines', desc: 'Espinhos negros explodem do chão.' },
    vorazes: { name: 'Espinhos Vorazes', ep: 7, lv: 4, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 1.25, stat: 'atk', fx: 'spinesAll', desc: 'Centenas de espinhos atingem todos.' },
    fome: { name: 'Fome do Abismo', ep: 6, lv: 7, who: 'kravenox', target: 'inimigo', kind: 'dreno', pow: 1.6, stat: 'atk', fx: 'dark', desc: 'Devora a Essência do alvo e recupera vida.' },
    furia: { name: 'Modo Fúria', ep: 6, lv: 6, who: 'kravenox', target: 'eu', kind: 'furia', fx: 'fury', desc: 'Ataque +50% por 3 turnos; a defesa cai.' },
    esmagamento: { name: 'Esmagamento', ep: 9, lv: 9, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 1.55, stat: 'atk', fx: 'slam', desc: 'Golpeia o chão; espinhos e abismo atingem todos.' },
    lamina: { name: 'Raio da Essência', ep: 10, lv: 11, who: 'kravenox', target: 'inimigo', kind: 'dano', pow: 2.7, stat: 'atk', fx: 'beam', desc: 'Um raio concentrado de Essência escura.' },
    sombras: { name: 'Pelas Sombras', ep: 9, lv: 13, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 1.8, stat: 'atk', fx: 'spinesAll', desc: '"Thornox pela frente, Kravenox pelas sombras."' },
    prateados: { name: 'Espinhos Prateados', ep: 12, lv: 99, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 3.2, stat: 'atk', fx: 'silver', desc: 'A Quarta Essência.' },

    luz: { name: 'Luz Dourada', ep: 4, lv: 1, who: 'thornox', target: 'aliado', kind: 'cura', pow: 2.4, base: 14, fx: 'heal', desc: 'Cura um aliado.' },
    rajada: { name: 'Rajada Dourada', ep: 5, lv: 1, who: 'thornox', target: 'inimigo', kind: 'dano', pow: 1.9, stat: 'mag', fx: 'light', holy: true, desc: 'Luz contra as trevas. Forte contra o Vazio.' },
    barreira: { name: 'Barreira de Luz', ep: 6, lv: 6, who: 'thornox', target: 'aliados', kind: 'escudo', fx: 'shield', desc: 'Defesa do grupo aumenta por 4 turnos.' },
    pedras: { name: 'Pedras Flutuantes', ep: 8, lv: 9, who: 'thornox', target: 'inimigos', kind: 'dano', pow: 1.4, stat: 'mag', fx: 'light', holy: true, desc: 'A luz ergue escombros contra todos.' },
    aurora: { name: 'Aurora', ep: 10, lv: 12, who: 'thornox', target: 'aliados', kind: 'cura', pow: 2.0, base: 20, fx: 'heal', desc: 'Cura todo o grupo.' },

    memoria: { name: 'Memória', ep: 5, lv: 1, who: 'lyra', target: 'aliados', kind: 'cura', pow: 1.4, base: 10, fx: 'memory', desc: 'Lembranças boas curam o grupo.' },
    prisao: { name: 'Barreira de Memórias', ep: 6, lv: 1, who: 'lyra', target: 'inimigos', kind: 'sono', chance: 0.65, fx: 'memory', desc: 'Prende inimigos em lembranças antigas.' },
    eco: { name: 'Eco da Vida', ep: 9, lv: 1, who: 'lyra', target: 'aliadoCaido', kind: 'reviver', fx: 'heal', desc: 'Traz de volta um aliado caído.' },
    cupula: { name: 'Cúpula Prateada', ep: 10, lv: 99, who: 'kravenox', target: 'aliados', kind: 'escudo', fx: 'shield', desc: 'A Quarta Essência ergue uma cúpula sobre o grupo.' },
    quatro: { name: 'Quatro Espinhos', ep: 16, lv: 99, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 1.9, stat: 'atk', fx: 'silver', desc: '"Uma escolha." A marca dos quatro espinhos atinge todos.' },
    quarta: { name: 'Quarta Essência', ep: 20, lv: 99, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 4.0, stat: 'atk', fx: 'silver', desc: 'Luz, memória, Vazio e Essência num só golpe. Só na Forma Desperta.' },
    onda: { name: 'Onda de Luz', ep: 10, lv: 99, who: 'thornox', target: 'inimigos', kind: 'dano', pow: 1.3, stat: 'mag', fx: 'light', holy: true, desc: 'Uma onda dourada que desfaz as sombras.' },
    muralha: { name: 'Muralha de Luz', ep: 12, lv: 99, who: 'thornox', target: 'aliados', kind: 'escudo', fx: 'shield', desc: 'Uma muralha dourada contra qualquer onda.' },
    milMemorias: { name: 'Mil Memórias', ep: 14, lv: 99, who: 'lyra', target: 'inimigos', kind: 'dano', pow: 1.5, stat: 'mag', fx: 'memory', holy: true, desc: '"Você não pode tirar o que é nosso!"' },
    toque: { name: 'Toque do Vazio', ep: 5, lv: 1, who: 'seraphyne', target: 'inimigo', kind: 'dano', pow: 1.9, stat: 'mag', fx: 'violet', desc: 'O Vazio não explode. Apenas apaga.' },
    portal: { name: 'Portal', ep: 7, lv: 1, who: 'seraphyne', target: 'inimigos', kind: 'sono', chance: 0.55, fx: 'violet', desc: 'Abre portais de Vazio que prendem os inimigos.' },
    absorver: { name: 'Absorver', ep: 8, lv: 1, who: 'seraphyne', target: 'inimigo', kind: 'dreno', pow: 1.6, stat: 'mag', fx: 'dark', desc: 'O Vazio consome o alvo e devolve a força.' },
    silencioV: { name: 'Silêncio', ep: 15, lv: 24, who: 'seraphyne', target: 'inimigos', kind: 'dano', pow: 1.6, stat: 'mag', fx: 'violet', desc: 'Não uma explosão: um silêncio que engole tudo.' },
    espelho: { name: 'Espelho do Vazio', ep: 16, lv: 99, who: 'seraphyne', target: 'inimigos', kind: 'dano', pow: 2.1, stat: 'mag', fx: 'violet', desc: 'O Vazio reflete a criatura para dentro dela mesma.' },
    memoriaColetiva: { name: 'Memória Coletiva', ep: 16, lv: 99, who: 'lyra', target: 'aliados', kind: 'cura', pow: 2.6, base: 40, fx: 'memory', desc: 'Cada um passa a carregar a lembrança do outro.' },
    primeiraEscolha: { name: 'A Primeira Escolha', ep: 24, lv: 99, who: 'kravenox', target: 'inimigos', kind: 'dano', pow: 5.0, stat: 'atk', fx: 'silver', desc: 'Não controlar. Escolher.' },
    lembranca: { name: 'Lembrança Dourada', ep: 8, lv: 14, who: 'lyra', target: 'inimigo', kind: 'dano', pow: 2.6, stat: 'mag', fx: 'light', holy: true, desc: 'Uma memória da Fonte, afiada como luz.' },
  };

  D.ITEMS = {
    seiva: { name: 'Seiva Viva', price: 10, target: 'aliado', heal: 45, desc: 'Recupera 45 HP.' },
    nectar: { name: 'Néctar Dourado', price: 38, target: 'aliado', heal: 150, desc: 'Recupera 150 HP.' },
    cristal: { name: 'Cristal de Essência', price: 30, target: 'aliado', ep: 20, desc: 'Recupera 20 EP.' },
    raiz: { name: 'Raiz da Vida', price: 60, target: 'aliadoCaido', revive: 0.5, desc: 'Revive um aliado com metade da vida.' },
    lagrima: { name: 'Lágrima da Fonte', price: 0, target: 'aliados', heal: 999, ep: 999, desc: 'Restaura totalmente o grupo. Raríssima.' },
    elixir: { name: 'Elixir de Valdora', price: 90, target: 'aliado', heal: 320, desc: 'Recupera 320 HP.' },
    cristalM: { name: 'Cristal Maior', price: 75, target: 'aliado', ep: 50, desc: 'Recupera 50 EP.' },
    agua: { name: 'Água das Três Luas', price: 170, target: 'aliado', heal: 650, desc: 'Recupera 650 HP.' },
    cristalG: { name: 'Cristal Antigo', price: 150, target: 'aliado', ep: 90, desc: 'Recupera 90 EP.' },
    nevoa: { name: 'Véu de Névoa', price: 15, target: 'fuga', desc: 'Garante a fuga de uma batalha.' },
  };

  // equipamentos: slot arma (por herói) ou armadura (todos)
  D.EQUIP = {
    garras: { name: 'Garras de Espinho', slot: 'arma', who: 'kravenox', atk: 2, price: 0 },
    garrasAbismo: { name: 'Garras do Abismo', slot: 'arma', who: 'kravenox', atk: 8, price: 90 },
    laminaNegra: { name: 'Lâmina de Cristal Negro', slot: 'arma', who: 'kravenox', atk: 15, price: 260 },
    espinhoAntigo: { name: 'Espinho do Primeiro', slot: 'arma', who: 'kravenox', atk: 24, price: 0 },
    cajadoRaiz: { name: 'Cajado de Raiz', slot: 'arma', who: 'thornox', atk: 2, mag: 2, price: 0 },
    cajadoOrdem: { name: 'Cajado da Ordem', slot: 'arma', who: 'thornox', atk: 7, mag: 5, price: 150 },
    cajadoSolar: { name: 'Cajado Solar', slot: 'arma', who: 'thornox', atk: 12, mag: 9, price: 300 },
    cristalMemoria: { name: 'Cristal da Memória', slot: 'arma', who: 'lyra', atk: 3, mag: 4, price: 0 },
    cristalVivo: { name: 'Cristal Vivo', slot: 'arma', who: 'lyra', atk: 6, mag: 9, price: 280 },
    garraPrata: { name: 'Garras de Prata', slot: 'arma', who: 'kravenox', atk: 26, price: 640 },
    espinhoQuatro: { name: 'Espinho dos Quatro', slot: 'arma', who: 'kravenox', atk: 36, price: 0 },
    cajadoValdora: { name: 'Cajado de Valdora', slot: 'arma', who: 'thornox', atk: 15, mag: 12, price: 560 },
    cajadoGuardiao: { name: 'Cajado do Guardião', slot: 'arma', who: 'thornox', atk: 24, mag: 22, price: 0 },
    cristalLuz: { name: 'Cristal de Luz', slot: 'arma', who: 'lyra', atk: 8, mag: 13, price: 540 },
    cristalMae: { name: 'Lágrima da Árvore', slot: 'arma', who: 'lyra', atk: 12, mag: 24, price: 0 },
    maosVazio: { name: 'Mãos do Vazio', slot: 'arma', who: 'seraphyne', atk: 10, mag: 10, price: 0 },
    laminaSilencio: { name: 'Lâmina do Silêncio', slot: 'arma', who: 'seraphyne', atk: 16, mag: 14, price: 600 },
    armaduraNegra: { name: 'Armadura Negra', slot: 'armadura', def: 18, price: 0 },
    cotaValdora: { name: 'Cota de Valdora', slot: 'armadura', def: 21, price: 460 },
    mantoCeus: { name: 'Manto dos Céus', slot: 'armadura', def: 27, price: 680 },
    armaduraGuardiao: { name: 'Armadura dos Guardiões', slot: 'armadura', def: 34, price: 0 },
    garraAntiga: { name: 'Garras da Primeira Cidade', slot: 'arma', who: 'kravenox', atk: 46, price: 1150 },
    cajadoArkan: { name: 'Cajado de Arkan', slot: 'arma', who: 'thornox', atk: 30, mag: 28, price: 1100 },
    cristalCidade: { name: 'Cristal das Mil Vozes', slot: 'arma', who: 'lyra', atk: 14, mag: 30, price: 1050 },
    laminaFilha: { name: 'Lâmina da Primeira Filha', slot: 'arma', who: 'seraphyne', atk: 30, mag: 28, price: 0 },
    mantoCidade: { name: 'Manto Branco', slot: 'armadura', def: 40, price: 1250 },
    armaduraEspinho: { name: 'Armadura do Espinho', slot: 'armadura', def: 48, price: 0 },
    manto: { name: 'Manto Rasgado', slot: 'armadura', def: 1, price: 0 },
    vestido: { name: 'Vestido Antigo', slot: 'armadura', def: 2, price: 0 },
    couraca: { name: 'Couraça de Raiz', slot: 'armadura', def: 5, price: 55 },
    placas: { name: 'Placas Cristalinas', slot: 'armadura', def: 10, price: 170 },
    veu: { name: 'Véu da Ordem', slot: 'armadura', def: 15, price: 340 },
  };

  // Inimigos. art = tipo de desenho; o = opções; w/h = tamanho do sprite
  const E = D.ENEMIES = {};
  const en = (id, name, art, o, w, h, st, acts, extra = {}) => { E[id] = { id, name, art, o, w, h, ...st, acts, ...extra }; };
  const atk = (w = 3) => ({ w, type: 'atk' });
  const tech = (w, name, pow, target = 'um', fx = 'dark', extra = {}) => ({ w, type: 'tech', name, pow, target, fx, ...extra });

  const LARVA = { c1: '#5c6650', c2: '#8a9476', core: 'rgba(255,170,90,0.55)', eye: '#ff3a2a' };
  en('larva', 'Larva da Essência', 'larva', LARVA, 60, 54, { hp: 16, atk: 9, def: 3, mag: 6, agi: 5, xp: 6, fr: 4 }, [atk(5), tech(1, 'cospe Essência podre', 1.2)], { void: true });
  en('larvaCristal', 'Larva Cristalina', 'larva', { ...LARVA, c1: '#4e5662', c2: '#7a8496', core: 'rgba(200,140,255,0.8)', crystal: true }, 66, 60, { hp: 30, atk: 13, def: 6, mag: 8, agi: 6, xp: 10, fr: 7 }, [atk(4), tech(1, 'dispara cristais', 1.1, 'todos')], { void: true });
  en('larvaMae', 'Larva-Mãe', 'swarm', { ...LARVA, long: true }, 110, 70, { hp: 120, atk: 15, def: 6, mag: 12, agi: 4, xp: 40, fr: 30 }, [atk(3), tech(2, 'libera o enxame', 1.0, 'todos'), tech(1, 'regenera a carne', 0, 'cura', 'heal', { heal: 25 })], { void: true, boss: true });
  en('eco', 'Eco Faminto', 'ghost', { c1: '#7a6a90', eye: '#ff5a2a' }, 56, 60, { hp: 22, atk: 9, def: 3, mag: 12, agi: 9, xp: 9, fr: 6 }, [atk(2), tech(2, 'sussurra seu nome', 1.2, 'um', 'dark', { drainEp: 4 })], { void: true });
  en('larvaLonga', 'Larva Alongada', 'larva', { ...LARVA, long: true, c1: '#56604a', c2: '#7e8a6a' }, 70, 62, { hp: 38, atk: 16, def: 7, mag: 8, agi: 7, xp: 14, fr: 9 }, [atk(5), tech(1, 'se enrosca', 1.3)], { void: true });
  en('sombra', 'Sombra Errante', 'ghost', { c1: '#2a2030', eye: '#c18bff', mouth: 4 }, 56, 62, { hp: 34, atk: 15, def: 6, mag: 14, agi: 10, xp: 14, fr: 10 }, [atk(3), tech(2, 'toque gelado', 1.3)], { void: true });
  en('sentinela', 'Sentinela do Vazio', 'sentinel', { c1: '#2a2632', c2: '#16131c', eye: '#b26bff', img: 'e_sentinela' }, 64, 84, { hp: 58, atk: 19, def: 10, mag: 10, agi: 7, xp: 22, fr: 16 }, [atk(5), tech(1, 'golpe corroído', 1.5)]);
  en('semRosto', 'Sentinela sem Rosto', 'sentinel', { c1: '#2a2632', c2: '#16131c', eye: '#b26bff', faceless: true }, 80, 100, { hp: 230, atk: 22, def: 11, mag: 18, agi: 9, xp: 90, fr: 60 }, [atk(4), tech(2, 'explode em energia violeta', 1.2, 'todos', 'violet'), tech(1, 'golpe que racha o chão', 1.7)], { boss: true });
  en('raizRast', 'Raiz Rastejante', 'root', { c1: '#1a1214', c2: '#2a1a20', eyes: 1, eye: 'rgba(255,60,60,0.9)', n: 6, thick: 3 }, 64, 64, { hp: 44, atk: 18, def: 9, mag: 10, agi: 6, xp: 18, fr: 12 }, [atk(4), tech(1, 'prende e aperta', 1.4)]);
  en('larvaArmor', 'Larva Encouraçada', 'larva', { ...LARVA, armor: true, long: true }, 72, 62, { hp: 52, atk: 20, def: 13, mag: 8, agi: 6, xp: 20, fr: 14 }, [atk(5), tech(1, 'investida blindada', 1.4)], { void: true });
  en('guardiao1', 'Guardião Branco', 'guardian', {}, 80, 104, { hp: 360, atk: 25, def: 14, mag: 22, agi: 12, xp: 150, fr: 90 }, [atk(4), tech(2, 'arremete a lança', 1.6), tech(1, 'força anterior ao Vazio', 1.15, 'todos', 'white')], { boss: true });
  en('voz', 'Voz Aprisionada', 'ghost', { c1: '#c8a860', eye: '#fff', crystal: true }, 60, 64, { hp: 50, atk: 18, def: 9, mag: 22, agi: 10, xp: 24, fr: 14 }, [atk(1), tech(3, '"Não deixe que ele descubra"', 1.3, 'um', 'dark', { drainEp: 5 })]);
  en('raizPetra', 'Raiz Petrificada', 'root', { c1: '#4a3a30', c2: '#2a201a', n: 8, thick: 5, eyes: 2, eye: 'rgba(224,192,96,0.9)' }, 70, 70, { hp: 76, atk: 25, def: 16, mag: 10, agi: 4, xp: 28, fr: 18 }, [atk(5), tech(1, 'esmaga', 1.5)]);
  en('raizNegra', 'Raiz Negra', 'root', { c1: '#0a0608', c2: '#1a0e14', n: 14, thick: 7, eyes: 3, eye: 'rgba(255,40,40,0.9)', mouth: true, seed: 12 }, 120, 120, { hp: 650, atk: 35, def: 15, mag: 26, agi: 9, xp: 220, fr: 120 }, [atk(3), tech(2, 'chicoteia com espinhos', 1.1, 'todos'), tech(1, 'ri das profundezas', 1.0, 'todos', 'dark', { drainEp: 4 }), tech(1, 'suga a Essência', 1.4, 'um', 'dark', { drain: true })], { boss: true, void: true });
  en('cristalizado', 'Guerreiro Cristalizado', 'crystalman', {}, 64, 80, { hp: 80, atk: 28, def: 15, mag: 16, agi: 9, xp: 32, fr: 20 }, [atk(4), tech(1, 'chora cristais', 1.3, 'todos')]);
  en('ecoGrande', 'Eco da Câmara', 'ghost', { c1: '#5a3a8a', eye: '#ff5a2a', crystal: true }, 60, 64, { hp: 64, atk: 24, def: 11, mag: 26, agi: 12, xp: 30, fr: 18 }, [atk(2), tech(2, 'milhares de sussurros', 1.0, 'todos', 'dark', { drainEp: 3 })], { void: true });
  en('arauto', 'Arauto', 'herald', {}, 84, 100, { hp: 820, atk: 41, def: 17, mag: 30, agi: 12, xp: 300, fr: 150 }, [atk(3), tech(2, 'fala com a voz do Primeiro', 1.2, 'todos', 'dark'), tech(1, 'garras de cristal', 1.7)], { boss: true, void: true });
  en('coisa', 'A Coisa que Dormia', 'colossus', {}, 130, 120, { hp: 1150, atk: 46, def: 19, mag: 34, agi: 8, xp: 420, fr: 200 }, [atk(3), tech(2, 'onda de energia', 1.25, 'todos', 'dark'), tech(1, 'anula seus espinhos', 1.9)], { boss: true, void: true });
  en('maoNevoa', 'Mão da Névoa', 'hands', { c1: '#8a94a4', c2: '#5a6474', n: 4 }, 76, 70, { hp: 86, atk: 32, def: 14, mag: 20, agi: 11, xp: 36, fr: 22 }, [atk(4), tech(1, 'puxa para baixo da terra', 1.5)]);
  en('lembranca', 'Lembrança Faminta', 'ghost', { c1: '#a8b8d0', eye: '#203050' }, 58, 64, { hp: 74, atk: 28, def: 12, mag: 32, agi: 13, xp: 38, fr: 22 }, [atk(1), tech(3, 'usa a voz de alguém que você amou', 1.35, 'um', 'dark', { drainEp: 6 })], { void: true });
  en('sentinelaN', 'Sentinela Veterano', 'sentinel', { c1: '#34303e', c2: '#1c1924', eye: '#d080ff', img: 'e_sentinela1' }, 64, 84, { hp: 110, atk: 36, def: 18, mag: 16, agi: 10, xp: 44, fr: 30 }, [atk(5), tech(1, 'golpe corroído', 1.6)]);
  en('guardiao2', 'O Primeiro Guardião', 'guardian', {}, 84, 108, { hp: 1700, atk: 54, def: 22, mag: 40, agi: 15, xp: 600, fr: 300 }, [atk(3), tech(2, 'arremete a lança', 1.7), tech(2, 'centenas de sombras', 1.2, 'todos', 'dark'), tech(1, '"Poder não é liberdade"', 1.0, 'todos', 'white', { sleep: 0.3 })], { boss: true });
  en('fragmento', 'Fragmento Errante', 'shards', { c1: '#0a3040', c2: '#1a5a6a', core: 'rgba(106,240,224,0.9)' }, 64, 64, { hp: 96, atk: 38, def: 20, mag: 34, agi: 14, xp: 48, fr: 28 }, [atk(3), tech(2, 'chuva de cristais', 1.15, 'todos', 'violet')]);
  en('afogado', 'Sentinela Afogado', 'sentinel', { c1: '#1a3a44', c2: '#0a2028', eye: '#6af0e0', cape: '#06141a' }, 72, 90, { hp: 140, atk: 44, def: 22, mag: 20, agi: 11, xp: 56, fr: 34 }, [atk(5), tech(1, 'lâmina das profundezas', 1.6)]);
  en('raizVazio', 'Raiz do Vazio', 'root', { c1: '#06141a', c2: '#0e2a34', n: 9, thick: 5, eyes: 2, eye: 'rgba(106,240,224,0.9)', seed: 40 }, 72, 72, { hp: 120, atk: 42, def: 20, mag: 30, agi: 9, xp: 52, fr: 30 }, [atk(4), tech(1, 'suga memórias', 1.3, 'um', 'dark', { drainEp: 6 })], { void: true });
  en('primeira', 'A Primeira Consciência', 'mother', {}, 120, 130, { hp: 2600, atk: 57, def: 24, mag: 48, agi: 16, xp: 0, fr: 0 }, [atk(2), tech(2, 'sombra líquida', 1.25, 'todos', 'dark'), tech(2, '"Vocês são meus filhos"', 1.0, 'todos', 'dark', { drainEp: 6 }), tech(1, 'mil espinhos', 1.9)], { boss: true, void: true });
  en('primeira2', 'A Mãe Esquecida', 'mother', { golden: true }, 120, 130, { hp: 1700, atk: 57, def: 22, mag: 46, agi: 15, xp: 1200, fr: 0 }, [atk(2), tech(2, 'a dor transformou o desejo', 1.3, 'todos', 'dark'), tech(1, 'raízes negras', 1.8)], { boss: true, void: true });

  // ---------- Parte 2: O Reino em Guerra (caps. 14–25) ----------
  const S2 = { c1: '#2a2632', c2: '#16131c', eye: '#ff3a2a' };
  en('sentinelaG', 'Sentinela da Guerra', 'sentinel', S2, 64, 84, { hp: 270, atk: 50, def: 28, mag: 22, agi: 12, xp: 70, fr: 36 }, [atk(5), tech(1, 'golpe de guerra', 1.5)]);
  en('cinzento', 'Carniçal de Cinzas', 'ghost', { c1: '#6a6460', eye: '#ff8a3a' }, 58, 62, { hp: 210, atk: 46, def: 22, mag: 38, agi: 15, xp: 62, fr: 32 }, [atk(2), tech(2, 'sopra cinzas quentes', 1.1, 'todos', 'dark')], { void: true });
  en('raizGuerra', 'Raiz Faminta', 'root', { c1: '#1a0808', c2: '#3a1010', n: 9, thick: 5, eyes: 2, eye: 'rgba(255,48,32,0.9)' }, 70, 70, { hp: 300, atk: 52, def: 30, mag: 22, agi: 9, xp: 72, fr: 38 }, [atk(4), tech(1, 'prende e suga', 1.4, 'um', 'dark', { drain: true })]);
  en('larvaFogo', 'Larva Incendiária', 'larva', { ...LARVA, c1: '#5a2a1a', c2: '#8a4a2a', core: 'rgba(255,120,40,0.9)', eye: '#ffd040', long: true }, 72, 62, { hp: 190, atk: 44, def: 22, mag: 34, agi: 12, xp: 56, fr: 30 }, [atk(4), tech(2, 'cospe brasas', 1.05, 'todos', 'dark')], { void: true });
  en('sentinelaV', 'Sentinela de Valdora', 'sentinel', S2, 64, 84, { hp: 340, atk: 56, def: 32, mag: 24, agi: 13, xp: 84, fr: 42 }, [atk(5), tech(1, 'lâmina de cinzas', 1.55)]);
  en('sombraRua', 'Sombra das Ruas', 'ghost', { c1: '#141018', eye: '#c18bff' }, 56, 62, { hp: 240, atk: 50, def: 24, mag: 44, agi: 17, xp: 70, fr: 36 }, [atk(2), tech(2, 'toque de medo', 1.35, 'um', 'dark', { drainEp: 5 })], { void: true });
  en('cristalVazio', 'Fragmento do Vazio', 'shards', {}, 64, 64, { hp: 220, atk: 54, def: 34, mag: 46, agi: 14, xp: 76, fr: 40 }, [atk(2), tech(3, 'apaga a vida ao redor', 1.15, 'todos', 'violet')], { void: true });
  en('guardaAntigo', 'Guarda Antigo', 'crystalman', {}, 64, 80, { hp: 380, atk: 58, def: 36, mag: 26, agi: 11, xp: 92, fr: 46 }, [atk(4), tech(1, 'lâmina de ouro velho', 1.6)]);
  en('simbolo', 'Símbolo Vivo', 'ghost', { c1: '#c8a040', eye: '#fff6c0', crystal: true }, 60, 66, { hp: 260, atk: 48, def: 28, mag: 52, agi: 16, xp: 80, fr: 40 }, [atk(1), tech(3, '"Filhos."', 1.3, 'um', 'dark', { drainEp: 6 })]);
  en('ossoNegro', 'Casca de Ossos', 'herald', {}, 66, 86, { hp: 450, atk: 64, def: 38, mag: 40, agi: 13, xp: 110, fr: 54 }, [atk(4), tech(1, 'aperta com dedos de osso', 1.6), tech(1, 'o vazio do peito', 1.1, 'todos', 'dark')], { void: true });
  en('respiracao', 'Respiração no Escuro', 'ghost', { c1: '#0a0a0e', eye: '#ffffff' }, 60, 66, { hp: 320, atk: 58, def: 30, mag: 58, agi: 18, xp: 100, fr: 50 }, [atk(1), tech(3, 'apaga as luzes', 1.25, 'todos', 'dark', { drainEp: 4 })], { void: true });
  en('raizAntiga', 'Raiz do Princípio', 'root', { c1: '#c8c0b0', c2: '#8a8478', n: 9, thick: 5, eyes: 1, eye: 'rgba(255,255,255,0.9)' }, 72, 74, { hp: 480, atk: 62, def: 40, mag: 34, agi: 9, xp: 112, fr: 56 }, [atk(4), tech(1, 'esmaga contra a pedra', 1.6)]);
  en('servo', 'Servo do Primeiro', 'shards', {}, 96, 70, { hp: 420, atk: 66, def: 34, mag: 50, agi: 20, xp: 124, fr: 60 }, [atk(4), tech(2, 'mergulha das nuvens', 1.5), tech(1, 'asas de cristal', 1.1, 'todos', 'white')], { void: true });
  en('guardiaoAzul', 'Guardião Reconstruído', 'sentinel', { c1: '#1a2432', c2: '#0e141e', eye: '#78c8ff' }, 64, 84, { hp: 530, atk: 70, def: 42, mag: 36, agi: 14, xp: 136, fr: 66 }, [atk(5), tech(1, 'lança de luz azul', 1.6), tech(1, 'chama os outros', 1.0, 'todos', 'white')]);
  en('olhoBranco', 'Olho na Escuridão', 'ghost', { c1: '#1a2a40', eye: '#ffffff', crystal: true }, 60, 66, { hp: 380, atk: 62, def: 34, mag: 66, agi: 19, xp: 128, fr: 62 }, [atk(1), tech(3, 'mostra o que você será', 1.3, 'um', 'dark', { drainEp: 7 })], { void: true });
  en('escolhido', 'Sentinela Escolhido', 'sentinel', { c1: '#c8c0a0', c2: '#8a8470', eye: '#fffae0' }, 64, 84, { hp: 610, atk: 76, def: 44, mag: 44, agi: 15, xp: 150, fr: 72 }, [atk(5), tech(1, 'luz nos olhos', 1.5), tech(1, 'pensamento do Primeiro', 1.05, 'todos', 'white')], { regen: 0.22 });
  en('raizMorta', 'Raiz Morta', 'root', { c1: '#3a3a40', c2: '#24242a', n: 8, thick: 4, eyes: 2, eye: 'rgba(160,160,176,0.9)' }, 70, 70, { hp: 510, atk: 72, def: 42, mag: 40, agi: 10, xp: 140, fr: 68 }, [atk(4), tech(1, 'parte-se e cai', 1.65)]);
  en('luzApagada', 'Luz Apagada', 'shards', {}, 64, 64, { hp: 430, atk: 66, def: 38, mag: 62, agi: 18, xp: 138, fr: 66 }, [atk(2), tech(2, 'apaga uma vida', 1.2, 'todos', 'white', { drainEp: 5 })]);
  // chefes
  en('seraphyne', 'Seraphyne', 'sentinel', {}, 56, 86, { hp: 5200, atk: 66, def: 30, mag: 60, agi: 24, xp: 900, fr: 300 }, [atk(3), tech(2, 'Toque do Vazio', 1.5, 'um', 'violet'), tech(1, 'antecipa cada golpe', 1.2, 'todos', 'violet'), tech(1, '"Você ainda luta como naquela época."', 1.0, 'todos', 'dark', { drainEp: 6 })], { boss: true });
  en('coracao', 'Coração do Primeiro', 'colossus', {}, 120, 120, { hp: 6000, atk: 76, def: 34, mag: 64, agi: 10, xp: 1200, fr: 400 }, [atk(2), tech(2, 'puxa o núcleo', 1.3, 'um', 'dark', { drainEp: 10 }), tech(2, 'bate uma, duas, três vezes', 1.15, 'todos', 'dark'), tech(1, '"Você é meu."', 1.0, 'todos', 'dark', { sleep: 0.25 })], { boss: true, void: true });
  en('kfuturo', 'O Kravenox do Futuro', 'herald', {}, 52, 66, { hp: 4000, atk: 80, def: 34, mag: 56, agi: 22, xp: 1600, fr: 500 }, [atk(4), tech(2, 'conhece cada movimento', 1.45), tech(1, 'espinhos retorcidos', 1.85), tech(1, 'explosão negra', 1.25, 'todos', 'dark')], { boss: true });
  en('kfuturoD', 'O Kravenox do Futuro', 'herald', { img: 'e_kfuturo' }, 52, 66, { hp: 1600, atk: 56, def: 30, mag: 50, agi: 20, xp: 1600, fr: 500 }, [atk(4), tech(2, 'conhece cada movimento', 1.4), tech(1, 'espinhos retorcidos', 1.75), tech(1, 'certeza de quem já viveu tudo', 1.2, 'um', 'dark', { drainEp: 6 })], { boss: true });
  en('primeiro', 'O Primeiro', 'colossus', {}, 150, 112, { hp: 11000, atk: 84, def: 38, mag: 74, agi: 16, xp: 0, fr: 0 }, [atk(2), tech(2, 'onda negra', 1.2, 'todos', 'dark'), tech(1, '"Vocês são meus."', 1.0, 'todos', 'dark', { drainEp: 8 }), tech(1, 'olhar dourado', 1.9), tech(1, 'drena a Fonte', 1.1, 'todos', 'dark', { drain: true })], { boss: true, void: true });

  // ---------- Parte 3: Além do Reino (caps. 26–35) ----------
  en('ecoAntigo', 'Eco do Caminho', 'ghost', { c1: '#5a7a6a', eye: '#c8ffd8' }, 58, 62, { hp: 520, atk: 80, def: 44, mag: 76, agi: 20, xp: 210, fr: 90 }, [atk(2), tech(2, 'lembra quem passou por aqui', 1.2, 'todos', 'dark', { drainEp: 5 })], { void: true });
  en('raizJovem', 'Raiz Jovem', 'root', { c1: '#2a3a1a', c2: '#3a5020', n: 8, thick: 4, eyes: 2, eye: 'rgba(184,255,128,0.9)' }, 70, 70, { hp: 640, atk: 84, def: 48, mag: 40, agi: 12, xp: 220, fr: 96 }, [atk(4), tech(1, 'cresce e aperta', 1.5)]);
  en('estatuaGuerreiro', 'Guerreiro de Pedra', 'crystalman', {}, 64, 80, { hp: 700, atk: 88, def: 54, mag: 30, agi: 12, xp: 236, fr: 104 }, [atk(4), tech(1, 'golpe de pedra antiga', 1.6)]);
  en('fragmentoMar', 'Fragmento do Oceano', 'shards', {}, 64, 64, { hp: 560, atk: 82, def: 50, mag: 80, agi: 21, xp: 228, fr: 100 }, [atk(2), tech(2, 'ondas negras', 1.2, 'todos', 'violet')], { void: true });
  en('afogadoAntigo', 'Guardião Afogado', 'sentinel', { c1: '#0e2a2a', c2: '#061818', eye: '#40ffe0' }, 64, 84, { hp: 760, atk: 90, def: 52, mag: 40, agi: 15, xp: 250, fr: 110 }, [atk(5), tech(1, 'lâmina das três luas', 1.6)]);
  en('pintura', 'Pintura Viva', 'ghost', { c1: '#3a2a1a', eye: '#ffd060', crystal: true }, 60, 64, { hp: 380, atk: 66, def: 36, mag: 66, agi: 18, xp: 190, fr: 80 }, [atk(2), tech(2, 'mostra o que foi pintado', 1.15, 'um', 'dark', { drainEp: 4 })]);
  en('memoriaCrianca', 'Memória de Criança', 'ghost', { c1: '#d8d4c8', eye: '#7a8aa0' }, 52, 58, { hp: 340, atk: 62, def: 34, mag: 70, agi: 22, xp: 180, fr: 76 }, [atk(1), tech(3, '"Não nos esqueça."', 1.2, 'um', 'dark')]);
  en('sombraQuatro', 'Sombra de Quatro Braços', 'herald', {}, 74, 88, { hp: 820, atk: 94, def: 54, mag: 60, agi: 16, xp: 280, fr: 120 }, [atk(4), tech(1, 'quatro braços', 1.25, 'todos'), tech(1, 'a sombra do peito pulsa', 1.6, 'um', 'dark')], { void: true });
  en('sementeVazio', 'Semente do Vazio', 'shards', {}, 64, 64, { hp: 600, atk: 86, def: 50, mag: 86, agi: 22, xp: 260, fr: 110 }, [atk(2), tech(2, 'apaga um nome', 1.3, 'um', 'violet', { drainEp: 6 })], { void: true });
  en('correnteViva', 'Correntes de Sombra', 'hands', {}, 76, 70, { hp: 700, atk: 90, def: 50, mag: 50, agi: 14, xp: 260, fr: 112 }, [atk(4), tech(1, 'prende e arrasta', 1.5)]);
  en('carcereiro', 'Carcereiro Vermelho', 'sentinel', { c1: '#2a1414', c2: '#140808', eye: '#ff2020' }, 64, 84, { hp: 900, atk: 98, def: 56, mag: 50, agi: 16, xp: 300, fr: 130 }, [atk(5), tech(1, 'olhos vermelhos', 1.55), tech(1, 'colheita', 1.15, 'todos', 'dark')]);
  // chefes
  en('devorador', 'O Primeiro Devorador', 'colossus', {}, 160, 120, { hp: 15000, atk: 108, def: 50, mag: 90, agi: 16, xp: 4000, fr: 1500 }, [atk(2), tech(2, 'onda de escuridão', 1.15, 'todos', 'dark'), tech(1, 'asa que cobre o céu', 1.9), tech(1, '"Vocês não podem impedir o fim."', 1.0, 'todos', 'dark', { drainEp: 8 })], { boss: true, void: true });
  en('guardiaoTorre', 'O Guardião da Torre', 'sentinel', { c1: '#2a1414', c2: '#140808', eye: '#ff2020', img: 'e_carcereiro' }, 64, 84, { hp: 2600, atk: 80, def: 44, mag: 50, agi: 18, xp: 2400, fr: 800 }, [atk(4), tech(2, 'golpe de ferro negro', 1.45), tech(1, '"Você não deveria possuir esse poder."', 1.2, 'um', 'dark', { drainEp: 6 })], { boss: true });
  en('reiVazio', 'O Rei do Vazio', 'colossus', {}, 150, 130, { hp: 18000, atk: 112, def: 52, mag: 96, agi: 18, xp: 0, fr: 0 }, [atk(2), tech(2, 'mãos negras atravessam a terra', 1.15, 'todos', 'dark'), tech(1, '"Vocês fogem."', 1.0, 'todos', 'dark', { sleep: 0.2 }), tech(1, 'apaga', 1.9, 'um', 'violet'), tech(1, 'mundos mortos', 1.25, 'todos', 'violet', { drainEp: 8 })], { boss: true, void: true });

  // Tabelas de encontros: listas de grupos possíveis
  D.ENC = {
    abismo: [['larva'], ['larva', 'larva'], ['larva'], ['eco'], ['larva', 'eco']],
    abismo2: [['larva', 'larva'], ['larvaCristal'], ['larvaCristal', 'larva'], ['eco', 'eco']],
    reino: [['larvaLonga'], ['larvaLonga', 'larva'], ['sombra'], ['larvaCristal', 'larvaCristal'], ['sombra', 'larvaLonga']],
    floresta: [['raizRast'], ['raizRast', 'larvaLonga'], ['larvaArmor'], ['larvaArmor', 'raizRast'], ['sombra', 'sombra', 'raizRast']],
    templo: [['voz'], ['raizPetra'], ['voz', 'voz'], ['raizPetra', 'voz'], ['larvaArmor', 'voz']],
    caverna: [['cristalizado'], ['ecoGrande', 'cristalizado'], ['ecoGrande', 'ecoGrande'], ['cristalizado', 'cristalizado'], ['raizPetra', 'ecoGrande']],
    vale: [['maoNevoa'], ['lembranca', 'maoNevoa'], ['sentinelaN'], ['lembranca', 'lembranca'], ['sentinelaN', 'maoNevoa']],
    submersa: [['fragmento'], ['afogado'], ['raizVazio', 'fragmento'], ['afogado', 'fragmento'], ['raizVazio']],
    submersaSolo: [['fragmento'], ['raizVazio'], ['afogado']],
    guerra: [['sentinelaG'], ['cinzento', 'cinzento'], ['raizGuerra'], ['larvaFogo', 'cinzento'], ['sentinelaG', 'larvaFogo'], ['larvaFogo', 'larvaFogo', 'larvaFogo']],
    valdora: [['sentinelaV'], ['sombraRua', 'sombraRua'], ['sentinelaV', 'sombraRua'], ['larvaFogo', 'sentinelaV'], ['sombraRua', 'larvaFogo', 'sombraRua']],
    escadaria: [['guardaAntigo'], ['simbolo', 'simbolo'], ['guardaAntigo', 'simbolo'], ['sentinelaV', 'simbolo']],
    passagem: [['ossoNegro'], ['respiracao', 'respiracao'], ['raizAntiga'], ['ossoNegro', 'respiracao'], ['raizAntiga', 'respiracao']],
    ceus: [['servo'], ['servo', 'cristalVazio'], ['cristalVazio', 'cristalVazio'], ['servo', 'servo']],
    fortaleza: [['guardiaoAzul'], ['olhoBranco', 'olhoBranco'], ['guardiaoAzul', 'olhoBranco'], ['ossoNegro', 'guardiaoAzul'], ['olhoBranco', 'olhoBranco', 'olhoBranco']],
    estrada: [['ecoAntigo'], ['raizJovem'], ['ecoAntigo', 'ecoAntigo'], ['estatuaGuerreiro'], ['raizJovem', 'ecoAntigo']],
    mar: [['fragmentoMar'], ['afogadoAntigo'], ['fragmentoMar', 'fragmentoMar'], ['afogadoAntigo', 'fragmentoMar']],
    caminhos: [['pintura'], ['memoriaCrianca'], ['pintura', 'memoriaCrianca']],
    cidade: [['sombraQuatro'], ['sementeVazio', 'sementeVazio'], ['sombraQuatro', 'sementeVazio'], ['estatuaGuerreiro', 'sementeVazio']],
    colheita: [['correnteViva'], ['carcereiro'], ['correnteViva', 'sementeVazio'], ['sombraQuatro']],
    torreNegra: [['sementeVazio'], ['pintura'], ['pintura', 'memoriaCrianca']],
    raizes: [['escolhido'], ['raizMorta', 'luzApagada'], ['luzApagada', 'luzApagada'], ['raizMorta', 'raizMorta'], ['escolhido', 'luzApagada']],
  };

  // ---------- Estado ----------
  D.newHero = function (id, lv = 1) {
    const H = D.HEROES[id];
    const h = { id, lv, xp: 0, weapon: H.weapon, armor: H.armor, alive: true, status: {} };
    D.recalc(h); h.hp = h.maxhp; h.mep = h.mep; h.ep = h.mep;
    h.xp = D.xpTotal(lv);
    return h;
  };
  D.xpNeed = lv => Math.round(12 + 10 * Math.pow(lv, 1.55));
  D.xpTotal = lv => { let t = 0; for (let l = 1; l < lv; l++) t += D.xpNeed(l); return t; };
  D.recalc = function (h) {
    const H = D.HEROES[h.id], L = h.lv - 1;
    const w = D.EQUIP[h.weapon] || {}, a = D.EQUIP[h.armor] || {};
    h.name = H.name;
    h.maxhp = Math.round(H.base.hp + H.grow.hp * L);
    h.mep = Math.round(H.base.ep + H.grow.ep * L);
    h.atk = Math.round(H.base.atk + H.grow.atk * L) + (w.atk || 0);
    h.def = Math.round(H.base.def + H.grow.def * L) + (a.def || 0) + (w.def || 0);
    h.mag = Math.round(H.base.mag + H.grow.mag * L) + (w.mag || 0);
    h.agi = Math.round(H.base.agi + H.grow.agi * L);
    if (h.hp > h.maxhp) h.hp = h.maxhp; if (h.ep > h.mep) h.ep = h.mep;
  };
  D.techsOf = function (h, st = G.state) {
    return Object.entries(D.TECHS).filter(([k, t]) => t.who === h.id && (t.lv <= h.lv || (st && st.flags['tec_' + k]))).map(([k]) => k);
  };
  D.newState = function () {
    return {
      party: [D.newHero('kravenox', 1)],
      inv: { seiva: 3 },
      fr: 0,
      flags: {},
      chests: {},
      loc: { mode: 'dungeon', map: 'abismo', x: 1, y: 1, dir: 1 },
      time: 0,
      visited: {},
    };
  };
  D.addHero = function (id) {
    const st = G.state;
    if (st.party.find(h => h.id === id)) return;
    const k = st.party[0];
    const h = D.newHero(id, Math.max(1, k.lv - (id === 'lyra' ? 1 : 0)));
    st.party.push(h);
  };
  D.removeHero = function (id) { const st = G.state; const i = st.party.findIndex(h => h.id === id); if (i >= 0) { st.bench = st.bench || {}; st.bench[id] = st.party[i]; st.party.splice(i, 1); } };
  D.restoreHero = function (id) {
    const st = G.state; if (st.party.find(h => h.id === id)) return;
    const h = (st.bench && st.bench[id]) || D.newHero(id, st.party[0].lv);
    // acompanha o nível do líder enquanto esteve fora
    while (h.lv < st.party[0].lv) { h.lv++; }
    h.xp = Math.max(h.xp, D.xpTotal(h.lv)); D.recalc(h); h.hp = h.maxhp; h.ep = h.mep; h.alive = true;
    st.party.splice(id === 'thornox' ? 1 : st.party.length, 0, h);
  };
  D.healAll = function () { for (const h of G.state.party) { h.alive = true; h.hp = h.maxhp; h.ep = h.mep; h.status = {}; } };
  D.give = function (item, n = 1) { const inv = G.state.inv; inv[item] = (inv[item] || 0) + n; };

  D.SAVEKEY = 'kravenox_reino_quebrado_v1';
  D.save = function () {
    try { localStorage.setItem(D.SAVEKEY, JSON.stringify(G.state)); return true; } catch (e) { return false; }
  };
  D.hasSave = function () { try { return !!localStorage.getItem(D.SAVEKEY); } catch (e) { return false; } };
  D.load = function () {
    try { const s = localStorage.getItem(D.SAVEKEY); if (!s) return null; const st = JSON.parse(s); for (const h of st.party) D.recalc(h); return st; } catch (e) { return null; }
  };
})();
