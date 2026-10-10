# Mapas do Livro II (O Reino da Escolha). Gera rpg/js/l2mapdata.js e confere cada mapa:
# linhas do mesmo tamanho e todos os pontos de evento alcançáveis a partir da entrada.
import json, sys
from collections import deque

FIELD_SOLID = set('^T*~XgwhoWsHqYkc')
M = {}
START = {}

# ---------------- CAMPOS ----------------
M['ESCOLHA'] = [  # o Reino da Escolha: a cidade em construção, a árvore negra e as planícies
    "^^^^^^^^^^^^^^^^R^^^^^^^^^^^^^^^^^",
    "^TT.,..,...,....=..,...,.,..TTT.^^",
    "^T..wwwwwwwwwwww=wwwwwwwwwwww.,.T^",
    "^..,wpooooopppppppppppooooopw.,..^",
    "^.,.wphhdhhppppppppppphhdhhpw..,.^",
    "^...wppppppppoooooooppppppppw.,..^",
    "^.,.wpppppppphhhDhhhppppppppw.X..^",
    "^..,wppooopppppppppppppoooppw....^",
    "^.,.wpphdhpppppkpAkpppphdhppw.,..^",
    "^...wpppppppppppSpppppppppppw..,.^",
    "^.,.wpppppppppppppppppppppppw.,..^",
    "^...wwwwwwwwwwww11wwwwwwwwwww..,.^",
    "^..,..,...,.....==...,...,...,..^^",
    "^.,..TT..,..,...==..,..,..TT..,..^",
    "^..,TffT...,....==...,...TffT..,.^",
    "^.,..TT..,....,.==..,..,..TT..,..^",
    "^..,..,....,....==...,....,..,...^",
    "^.,..,..*..,..,.==..,..*..,..,.,.^",
    "^..,..,....,....==...,....,..,...^",
    "^.,..,..,..,..,.==..,..,..,..,.,.^",
    "^^^^^^^^^^^^^^^^==^^^^^^^^^^^^^^^^",
]
START['ESCOLHA'] = (16, 19)

M['PRIMEIROMUNDO'] = [  # a cidade colossal, perfeita e vazia
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "w.W...ooooo..oooDooo..ooooo..W.w",
    "w.....hhhhh..hhhDhhh..hhhhh....w",
    "w..pppppppppppppppppppppppppp..w",
    "w..p..~~~~~~..p...p..~~~~~~.p..w",
    "w..p..~~~~~~..p...p..~~~~~~.p..w",
    "w..p..........ppppp.........p..w",
    "w..p.ooooo....p.2.p...ooooo.p..w",
    "w..p.hhhhh....ppppp...hhhhh.p..w",
    "w..p..........p...p.........p..w",
    "w..pppppppppppp...pppppppppppp.w",
    "w.....~~~~....p...p....~~~~....w",
    "w.W...~~~~....p...p....~~~~.W..w",
    "w.....ooooo...p...p...ooooo....w",
    "w.....hhhhh...p.S.p...hhhhh....w",
    "w.............ppppp............w",
    "w...............1..............w",
    "wwwwwwwwwwwwwwww.wwwwwwwwwwwwwww",
]
START['PRIMEIROMUNDO'] = (16, 16)

M['NORTE'] = [  # as terras sem Essência
    "^^^^^^^^^^^^^^^^^^V^^^^^^^^^^^^^^^^^",
    "^^^..,..*...,..,..4..,...*..,...^^^^",
    "^^..*..,...,....,.=.,....,..*..,.^^^",
    "^^.,...,..*..,....=...,..,....,..^^^",
    "^^..,....,....,...=,..*....,..,..,^^",
    "^^.*..,...,..,..,.=..,...,..*.....^^",
    "^^..,..*....,.....3...,.....,..,..^^",
    "^^.,......,..,....=.,..,..*...,..,^^",
    "^^..,..,..*....,..=....,....,.....^^",
    "^^.*.....,....,...2s..*..,...,..*.^^",
    "^^..,..,....,..,..=...,....,..,...^^",
    "^^.,..*..,....,...=..,....*....,..^^",
    "^^..,....,..*...,.1.,...,....,..,.^^",
    "^^.,..,....,......=....,..,..*....^^",
    "^^^..,..*..,..,...=.,..,......,.^^^^",
    "^^^^^^^^^^^^^^^^^^R^^^^^^^^^^^^^^^^^",
]
START['NORTE'] = (18, 14)

M['CIDADEASTER'] = [  # a Cidade que Não Existia
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "w.W..ppppppppppppppppppppppp.W.w",
    "w....p..ooooo...W...ooooo..p...w",
    "w.oooop.hhdhh..pDp..hhdhh..pooow",
    "w.hhdhp........ppp.........phhdw",
    "w....pppppppppppppppppppppppp..w",
    "w....p...~~~....p....~~~...p...w",
    "w.W..p...~~~....p....~~~...p.W.w",
    "w....p..........p..........p...w",
    "w.ooooo..ppppppp5ppppppp..ooooow",
    "w.hhdhh..p......p......p..hhdhhw",
    "w........p..oooopoooo..p.......w",
    "w..pppppppp.hhhhDhhhh.pppppppp.w",
    "w..p......p..........p......p..w",
    "w..p.ooo..pppppppppppp..ooo.p..w",
    "w..p.hdh.......S.........hdh.p.w",
    "w..p...........p.............p.w",
    "w..ppppppppppppppppppppppppppp.w",
    "wwwwwwwwwwwwwwwRwwwwwwwwwwwwwwww",
]
START['CIDADEASTER'] = (15, 17)

M['MUNDONOVO'] = [  # o primeiro mundo novo: duas luas, mar verde, montanhas que flutuam
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^^..,..TT..,..^^^..,..,...,..^^^...V..^^",
    "^..,..TffT.,..^^..,...,..,...^^...=...,^",
    "^.,...TffT..,....,..,...,........=2.,..^",
    "^..,...TT..,..,..======================^",
    "^.,..,....,.....=..,..,..,..,..,...,..,^",
    "^..,..,..,....,.=..,..TT..,..,..,..,...^",
    "^.,..,....,.....1...,TffT..,..^^...,..,^",
    "^..,..,..,....,.=..,..TT..,..^^^...,...^",
    "^.,..^^...,.....=...,..,..,...^...,..,.^",
    "^..,.^^^..,..,..=..,..,..S...,..,..,...^",
    "^.,...^...,.....=...,..,..,..,..,..,..,^",
    "^..,..,..,....,.=..,..,..,..,..,..,....^",
    "^.,..,....,.....=...,....~~~~~~~~~..,..^",
    "^..,..,..,..===R=..,..~~~~~~~~~~~~~~...^",
    "^~~~..,....,......~~~~~~~~~~~~~~~~~~~~~^",
    "^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
]
START['MUNDONOVO'] = (14, 14)

M['ESPINHOS'] = [  # a Cidade dos Espinhos, sobre a montanha
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^^wwwwwwwwwwwwwwwwwwwwwwwwww^^",
    "^^w..ooooo...HHHHHH...ooooow^^",
    "^^w..hhdhh...HHHDHH...hhdhhw^^",
    "^^w..p.......pppppp.......pw^^",
    "^^w..ppppppppppppppppppppppw^^",
    "^^w..p....p....s.....p....pw^^",
    "^^w..p....p.....1....p....pw^^",
    "^^w.......pppppppppppp...oow^^",
    "^^w.......p..........p...hdw^^",
    "^^w.ooooo.p..........p.....w^^",
    "^^w.hhdhh.p..........p.S...w^^",
    "^^wwwwwwwwwwwwwppwwwwwwwwwww^^",
    "^^^^^^^^^^^^^^.=.^^^^^^^^^^^^^",
    "^^^^^^^^^^^^^.,=,.^^^^^^^^^^^^",
    "^^^^^^^^^^..,..=..,.^^^^^^^^^^",
    "^^^^^^^^^.,..,.=....^^^^^^^^^^",
    "^^^^^^^^..,..,.=,..,.^^^^^^^^^",
    "^^^^^^^.,..2...=...,..^^^^^^^^",
    "^^^^^^^..,.....=..,...^^^^^^^^",
    "^^^^^^^^^^^^^^^R^^^^^^^^^^^^^^",
]
START['ESPINHOS'] = (15, 19)

M['VILA2'] = [  # a vila que não estava em nenhum mapa
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^TTTTTTTTTTTWTTTTTTTTTTTTTT^",
    "^TTfffTTTTff3ffTTTffffTTTTT^",
    "^TffffffTfff.fffffffffffTTT^",
    "^Tff.,...,.....,....,..fTT^^",
    "^T..,..ooooo..,...ooooo..,.^",
    "^...,..hhDhh....,.hhdhh....^",
    "^..,....p..............,...^",
    "^R=1==.pppppppppppppp..,...^",
    "^..,....p....k......p..,.T.^",
    "^.,..ooooo..,..,.ooooo....,^",
    "^...,hhdhh...S...hhdhh..,..^",
    "^..,...,.....,......,..,...^",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
]
START['VILA2'] = (2, 8)

M['AUREN'] = [  # Auren: uma cidade normal num mundo que quase terminou
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^.,..,..TT..,..^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^..,..,TffT.,...,..,..,...,..,..,...,..^",
    "^.,..,..TT...,..,.....,..,....,..,..,..^",
    "^..=========..,..wwwwwwwwwwwwwwwwwwwww.^",
    "^..,..,....=..,..wooooo.ppppppp.oooooow^",
    "^.,..,..,..=.,...whhdhh.p.W...p.hhdhhw.^",
    "^..,..,....=..,..wpppppppppppppppppppw.^",
    "^.,..,..,..=.,...wooooopp.kqk.ppoooooww^",
    "^..,..,....=..,..whhDhhpp.....pphhdhhw.^",
    "^.,..,..,..=.,...wppppppppppppppppppppw^",
    "^..,..,....=..,..wpooooop.ooooo.poooopw^",
    "^.,..,..,..=.,...wphhdhhp.hhdhh.phhdhpw^",
    "^..,..,....=..,..wpppppppppSpppppppppw.^",
    "^.,..,..,..=======pppppppppppppppppppR.^",
    "^..,..,..,..,..,.wwwwwwwwwwwwwwwwwwwww.^",
    "^.,..,....,..,..,..,..,..,....,..,..,..^",
    "^..,..TT..,...,..,..,..,..,..1..,..,...^",
    "^.,..TffT..,..,..,..,....,..,..,..,..,.^",
    "^..,..TT...,..,..,..,..,..,..,....,..,.^",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
]
START['AUREN'] = (3, 3)

M['ESTRELAS'] = [  # a estrada entre as estrelas e a Cidade dos Nomes
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~.ooooo..oooooo..ooooo.~~~~~",
    "~~~.hhdhh..hhDhhh..hhdhh.~~~~~",
    "~~~.pppppppppppppppppppp.~~~~~",
    "~~~.p.......p...p......p.~~~~~",
    "~~~.p...ooo.p.s.p.ooo..p.~~~~~",
    "~~~.p...hdh.p.2.p.hdh..p.~~~~~",
    "~~~.ppppppppppppppppppppp~~~~~",
    "~~~~~~~~~~~~~~=~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~1~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~=~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~==~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~==~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~==~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~==~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~=~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~=~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~==S~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~==~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~=~~~~~~~~~~~~~~~~~",
]
START['ESTRELAS'] = (12, 19)

M['CAMINHOFIM'] = [  # o caminho até o fim
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^^..,..,TT..,..,..^^^..,..,..,..,..^^..,.^",
    "^..,..,TffT.,..~~~~~..,..,ooooo.,..,...,.^",
    "^.,..,..TT..,..~~~~~...,..hhDhh...,..,...^",
    "^R=====1======BBBBB========2===========3^^",
    "^..,..,..,..,..~~~~~..,..,..,..,..,..,..^^",
    "^.,..,..,..,...~~~~~.,..,..,..,..TT..,..,^",
    "^..,..TT..,..,..,..,..,..,..S..,TffT..,..^",
    "^.,..TffT..,..,..,..,..,..,..,..,TT..,..,^",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
]
START['CAMINHOFIM'] = (2, 4)

M['SEMNOME'] = [  # um mundo sem nome: o rio, a cidade pequena, a colina
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^^^..,..,..,.1..,..,..,..^^^^^^^",
    "^^.,..TT..,..=..,..,..TT..,..^^^",
    "^..,.TffT.,..=,..,..,TffT.,..,.^",
    "^.,...TT..,..=..,..,..TT..,..,.^",
    "^..,..ooooo..=..ooooo..,..,..,.^",
    "^.,...hhdhh..=..hhdhh..,..ooooo^",
    "^..,....p....=....p....,..hhdhh^",
    "^.,..pppppppppppppppppppp....p.^",
    "^..,.p......p.s.p......p..,..p.^",
    "^.,..p..ooo.p...p.ooo..pppppppR^",
    "^..,.p..hdh.ppppp.hdh..p..,..,.^",
    "^.,..pppppppp.S.ppppppppp..,...^",
    "^..,..,..,...=..,..,..,..,..,..^",
    "^~~~~~~~~~~~~B~~~~~~~~~~~~~~~~~^",
    "^~~~~~~~~~~~~B~~~~~~~~~~~~~~~~~^",
    "^..,..,..,...=..,..,..,..,..,..^",
    "^.,..,..,..,.=.,..,..,..,..,..,^",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
]
START['SEMNOME'] = (13, 16)

M['MONTANHAS'] = [  # as montanhas da estrela vermelha
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "^^^^^^^^^^^^^^^^2^^^^^^^^^^^^^^^^^",
    "^^^^^^^^^^^^^^..=..^^^^^^TTTTTT^^^",
    "^^^^^^^^^^^^..,.=.,..^^^TffffffT^^",
    "^^^^^^^^^^..,...=..,..^^TffoooffT^",
    "^^^^^^^..,..,...=...,....fffhDhfT^",
    "^^^^^..,..*..,..=..,..*...ff.=.fT^",
    "^^^..,..,....,..=.,....,..,...=.T^",
    "^R=1=============================^",
    "^^^..,..,..*..,..,..,..,..,..*.,^^",
    "^^^^..,..,..,..,..,.S,..,..,..^^^^",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
]
START['MONTANHAS'] = (2, 8)

M['ARVORENOMES'] = [  # o mundo branco e a árvore dos nomes
    "~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~...,...,...,...,...~~~~",
    "~~..,...,...XXX...,..,..~~",
    "~~.,...,...XXXXX..,...,.~~",
    "~~..,...,..XXXXX.,...,..~~",
    "~~.,..,....,.1..,..,...,~~",
    "~~..,...,...,=..,...,...~~",
    "~~.,...,..,..=,...,..,..~~",
    "~~~..,..,....=...,...,.~~~",
    "~~~~.,...,...=..,..,..~~~~",
    "~~~~~~..,....D...,..~~~~~~",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~",
]
START['ARVORENOMES'] = (13, 9)

M['CHAMASAZUIS'] = [  # a cidade das chamas azuis
    "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
    "w...ooooo...pp1pp...ooooo....w",
    "w...hhdhh...ppppp...hhdhh....w",
    "w.....p.......p.......p......w",
    "w.ooo.ppppppppppppppppppp.ooow",
    "w.hdh.p.......p.......p...hdhw",
    "w.....p..ooo..p..ooo..p......w",
    "w.....p..hdh..p..hdh..p......w",
    "w..pppppppppppppppppppppppp..w",
    "w..p..........p..........p...w",
    "w..p..ooooo...S...ooooo..p.2.w",
    "w..p..hhdhh...p...hhdhh..p...w",
    "w..ppppppppppppppppppppppp...w",
    "wwwwwwwwwwwwwwRwwwwwwwwwwwwwww",
]
START['CHAMASAZUIS'] = (14, 12)

# ---------------- MASMORRAS ----------------
DUN = {}
DUN['TUNEIS'] = [  # os túneis sob a cidade
    "#####################",
    "#S..#.....1.....#..C#",
    "#U#.#.###.#.###.#.#.#",
    "#...#...#...#.#...#.#",
    "###.###.#####.#####.#",
    "#.....#...H...#.....#",
    "#.###.#####.###.###.#",
    "#.#C#...a.....#.#...#",
    "#.#.#####.#####.#.###",
    "#...#...#.#...#.#...#",
    "#.###.#.#.#.#.#.###.#",
    "#.....#...#C#.....#e#",
    "#####################",
]
DUN['PALACIO'] = [  # o palácio do Primeiro Rei
    "#################",
    "#.......e.......#",
    "#.#####.#.#####.#",
    "#.#C..#.#.#..C#.#",
    "#.#.#.#.#.#.#.#.#",
    "#...#...1...#...#",
    "###.#########.###",
    "#.....#.H.#.....#",
    "#.###.#.#.#.###.#",
    "#.#.....#.....#.#",
    "#.#.###.#.###.#.#",
    "#...#...S...#...#",
    "#################",
]
DUN['ENTRE'] = [  # o Entre: correntes sem chão nem céu
    "###################",
    "#S....#.....#....C#",
    "#.###.#.###.#.###.#",
    "#.#...1.#...#.#...#",
    "#.#.#####.###.#.###",
    "#...#.....#e#...#.#",
    "###.#.###.#.#.###.#",
    "#...#.#C#...#.....#",
    "#.###.#.##2##.###.#",
    "#.....#.........H.#",
    "#.#####.#####.#.#.#",
    "#.#....C#...#.#.#.#",
    "#.#.#####.#.#.#.#.#",
    "#...#.....#...#..l#",
    "###################",
]
DUN['ARVOREBRANCA'] = [  # subindo a árvore branca: cada galho guarda uma possibilidade
    "#####################",
    "#........e..........#",
    "#.#######.#########.#",
    "#.#C....#.#.......#.#",
    "#.#.###.#.#.#####.#.#",
    "#...#...1...#...#...#",
    "###.#.#######.#.#####",
    "#...#.....H...#.....#",
    "#.#######.###.#####.#",
    "#.#.....#...#.....#.#",
    "#.#.###.###.###.#.#.#",
    "#...#C......2...#...#",
    "#####.###########.###",
    "#.........S.........#",
    "#####################",
]
DUN['BIBLIOTECA'] = [  # a Biblioteca do Fim
    "#######################",
    "#S....#.......#......C#",
    "#.###.#.#####.#.####..#",
    "#.#.....#...#.#.#.....#",
    "#.#.#####.#.#.#.#.###.#",
    "#.#.....#.#...#...#.a.#",
    "#.#####.#.#########.###",
    "#...#...#.....l.....#.#",
    "###.#.#######.#####.#.#",
    "#...#.....H...#...#...#",
    "#.#####.#####.#.#.###.#",
    "#.#C....#.....2.#...#.#",
    "#.#.#########.###.#.#.#",
    "#...#.......r.....#..e#",
    "#######################",
]
DUN['DESTINO'] = [  # o destino de Thornox: um espaço branco
    "#################",
    "#S......#......e#",
    "#.#####.#.#####.#",
    "#.#...#.a.#...#.#",
    "#.#.#.#####.#.#.#",
    "#...#...1...#...#",
    "###.#.#.#.#.#.###",
    "#...#.#.l.#.#...#",
    "#.###.#####.###.#",
    "#.#.....r.....#.#",
    "#.#.#.#####.#.#.#",
    "#...#...d...#..H#",
    "#################",
]
DUN['DENTRO'] = [  # a porta dentro de Thornox
    "###################",
    "#S....#.....#.....#",
    "#.###.#.###.#.###.#",
    "#.#.a...#.....#.#.#",
    "#.#.#####.###.#.#.#",
    "#...#...#.#e#...#.#",
    "###.#.#.#.#.#####.#",
    "#...#.#...#.....d.#",
    "#.###.#####.#####.#",
    "#...#...H...#.....#",
    "#.#.###.###.#.#####",
    "#.#...#.#f..#.....#",
    "#.###.#.#.#######.#",
    "#.....#.1........r#",
    "###################",
]

def bfs(grid, start, solid, walk_extra=None):
    H, W = len(grid), len(grid[0])
    seen = {start}; q = deque([start])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and (nx, ny) not in seen and grid[ny][nx] not in solid:
                seen.add((nx, ny)); q.append((nx, ny))
    return seen

ok = True
for name, g in M.items():
    w = len(g[0])
    for i, r in enumerate(g):
        if len(r) != w: print('LARGURA', name, i, len(r), w, r); ok = False
    if not ok: continue
    sx, sy = START[name]
    if g[sy][sx] in FIELD_SOLID: print('INÍCIO SÓLIDO', name); ok = False
    seen = bfs(g, (sx, sy), FIELD_SOLID)
    for y, r in enumerate(g):
        for x, c in enumerate(r):
            if (c.isdigit() or c in 'SADRVB') and (x, y) not in seen:
                print('INALCANÇÁVEL', name, c, x, y); ok = False
for name, g in DUN.items():
    w = len(g[0])
    for i, r in enumerate(g):
        if len(r) != w: print('LARGURA', name, i, len(r), w, r); ok = False
    st = [(x, y) for y, r in enumerate(g) for x, c in enumerate(r) if c == 'S'][0]
    seen = bfs(g, st, set('#0123456789'))
    for y, r in enumerate(g):
        for x, c in enumerate(r):
            if c in 'aelrdbfCHU' and (x, y) not in seen: print('INALCANÇÁVEL', name, c, x, y); ok = False
            if c.isdigit() and not any((x + dx, y + dy) in seen for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): print('VOZ ISOLADA', name, x, y); ok = False
if not ok: sys.exit(1)
out = "'use strict';\n// Mapas do Livro II (gerado por tools/mapas_livro2.py: não editar à mão).\nObject.assign(G.MAPSTR, " + json.dumps({**M, **DUN}, indent=1, ensure_ascii=False) + ");\n"
open('/home/user/kravenox-jogar/rpg/js/l2mapdata.js', 'w').write(out)
print('ok', len(M), 'campos e', len(DUN), 'masmorras')
