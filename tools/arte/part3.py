# Arte da Parte 3 (caps. 26–35): o pai vivo, Arkan, a primeira filha, Devoradores e o Rei do Vazio.
import sys, math, random
from PIL import Image
from painter import Canvas, hexc
from portraits import person, render as prender
from chars import robed, save as csave
from enemies import ghost, root, crystalman, shards, hands, colossus, recolor
OUT = sys.argv[1]
R = lambda c, n: c.render(seed=3, tex=0.06).save(f'{OUT}/e_{n}.png')
base = '/home/user/kravenox-jogar/rpg/img/'

# --- retratos ---
PAI = {'hair': ['#8e8a96', '#d4d0dc', '#f4f2f8'], 'hairD': ['#a8a4b0'], 'skin': ['#a88a78', '#d6b8a4', '#ecd6c6'], 'skinD': ['#a88a78'],
       'robe': ['#e0dcd0', '#f4f0e6', '#ffffff'], 'eye': ['#ffc830'], 'eyeD': ['#5a3a08'], 'white': ['#fff6c0'], 'mouth': ['#7a5050'],
       'beard': ['#6a6672', '#9a96a4', '#c4c0cc'], 'gold': ['#8a6020', '#e0b048', '#fff0a0']}
c = person(PAI, hair=False)
c.ell(24, 13, 14, 6, 'hair', only=[None]); c.ell(24, 12, 13, 5, 'hair')
c.rect(9, 12, 13, 34, 'hair'); c.rect(35, 12, 39, 34, 'hair')
c.line([(14, 21), (19, 20)], 'hairD'); c.line([(29, 20), (34, 21)], 'hairD')
c.poly([(17, 31), (31, 31), (29, 37), (24, 39), (19, 37)], 'beard'); c.rect(22, 31, 26, 32, 'mouth')
c.line([(16, 42), (32, 42)], 'gold')
prender(c, 'paiVivo', OUT)
ARK = {'hair': ['#7a7a80', '#b8b8c0', '#e0e0e8'], 'hairD': ['#8a8a94'], 'skin': ['#8a7468', '#b49c8e', '#d0bcae'], 'skinD': ['#8a7468'],
       'robe': ['#c8c4b8', '#e8e4d8', '#fafaf2'], 'eye': ['#000000'], 'eyeD': ['#000000'], 'white': ['#3a3a3a'], 'mouth': ['#6a4a40'], 'beard': ['#9a9aa2', '#c8c8d0', '#ececf2']}
c = person(ARK, hair=False, small_eyes=True)
c.ell(24, 12, 12, 5, 'hair'); c.rect(10, 12, 13, 28, 'hair'); c.rect(35, 12, 38, 28, 'hair')
c.poly([(15, 29), (33, 29), (31, 44), (24, 47), (17, 44)], 'beard'); c.rect(22, 31, 26, 32, 'mouth')
c.line([(16, 20), (21, 21)], 'hairD'); c.line([(27, 21), (32, 20)], 'hairD')
prender(c, 'arkan', OUT)
MEN = {'hair': ['#a8a8b4', '#e4e4ee', '#ffffff'], 'hairD': ['#c0c0cc'], 'skin': ['#c8b0a8', '#f0dcd4', '#fff0ea'], 'skinD': ['#c8b0a8'], 'blush': ['#f0a8a0'],
       'robe': ['#8a8a9a', '#c8c8d8', '#eeeef8'], 'eye': ['#7a8aa0'], 'eyeD': ['#2a3040'], 'white': ['#ffffff'], 'mouth': ['#b06060'], 'tear': ['#9ad8ff']}
c = person(MEN, long=True, blush=True)
c.px(14, 30, 'tear'); c.px(14, 31, 'tear')
prender(c, 'menina', OUT)
# o Rei dos Espinhos, a partir do desenho do autor
k = Image.open(base + 'k_futuro.png').convert('RGBA')
head = k.crop((70, 0, 190, 120)).resize((48, 48), Image.LANCZOS)
q = head.load()
for y in range(48):
    for x in range(48):
        r, g, b, a = q[x, y]; q[x, y] = ((r // 24) * 24, (g // 24) * 24, (b // 24) * 24, 255)
head.save(f'{OUT}/p_reiEspinhos.png')

# --- figurantes ---
PAIS = {'hair': ['#8e8a96', '#d4d0dc', '#f4f2f8'], 'hairD': ['#a8a4b0'], 'skin': ['#a88a78', '#d6b8a4', '#ecd6c6'], 'robe': ['#c8c4b8', '#ece8dc', '#ffffff'],
        'robeD': ['#a8a498'], 'eye': ['#ffc830'], 'eyeD': ['#5a3a08'], 'mouth': ['#7a5050'], 'shoe': ['#3a3428', '#56503e']}
csave(lambda d, f: robed(d, f, PAIS, hair_long=True), 'pai', OUT)
ARKS = dict(PAIS, hair=['#7a7a80', '#b8b8c0', '#e0e0e8'], eye=['#000000'], robe=['#b8b4a8', '#dcd8cc', '#f4f0e6'])
csave(lambda d, f: robed(d, f, ARKS, hair_long=False), 'arkan', OUT)
MENS = dict(PAIS, hair=['#a8a8b4', '#e4e4ee', '#ffffff'], skin=['#c8b0a8', '#f0dcd4', '#fff0ea'], eye=['#7a8aa0'], robe=['#8a8a9a', '#c8c8d8', '#eeeef8'], robeD=['#6a6a7a'])
csave(lambda d, f: robed(d, f, MENS, hair_long=True, small=3), 'menina', OUT)
SOB = dict(PAIS, hair=['#3a2a20', '#5a4030', '#7a5a40'], eye=['#2a1a10'], robe=['#5a6a7a', '#7a8a9a', '#a0b0c0'], robeD=['#3a4a5a'])
csave(lambda d, f: robed(d, f, SOB, hair_long=False), 'sobrevivente', OUT)

# --- inimigos ---
R(ghost(58, 62, '#5a7a6a', '#c8ffd8', seed=31), 'ecoAntigo')
R(root(70, 70, '#2a3a1a', '#3a5020', '#b8ff80', thick=4, eyes=2, seed=32), 'raizJovem')
g = crystalman(64, 80); g.mats.update({'armor': [hexc(x) for x in ['#2a2a2a', '#4a4a48', '#6a6a66', '#8a8a84']], 'crys': [hexc(x) for x in ['#3a3a3a', '#7a7a76', '#b0b0aa', '#e0e0d8']], 'eye': [hexc('#ffe080')]})
R(g, 'estatuaGuerreiro')
def shardsC(w, h, mats, seed):
    c = shards(w, h, seed); c.mats.update({k: [tuple(hexc(x)) for x in v] for k, v in mats.items()}); return c
R(shardsC(64, 64, {'crys': ['#04141a', '#0a3038', '#1a6a70', '#80f0f0'], 'core': ['#000000', '#40ffe0']}, 33), 'fragmentoMar')
R(ghost(52, 58, '#d8d4c8', '#7a8aa0', seed=34), 'memoriaCrianca')
R(ghost(60, 64, '#3a2a1a', '#ffd060', crystal=True, seed=35), 'pintura')
R(hands(76, 70, '#141018', '#06040a', seed=36), 'correnteViva')
R(shardsC(64, 64, {'crys': ['#0a0a0a', '#1a1a1a', '#3a3a3a', '#8a8a8a'], 'core': ['#000000', '#ff2020']}, 37), 'sementeVazio')
def rc(src, dst, eye, f):
    def gg(r, g, b):
        if b > r + 30 and b > 120: return eye
        L = (r + g + b) / 3; return f(L)
    recolor(base + src, f'{OUT}/e_{dst}.png', gg)
rc('e_sentinela.png', 'afogadoAntigo', (64, 255, 224), lambda L: (int(L * 0.4), int(L * 0.9 + 6), int(L * 0.95 + 10)))
rc('e_sentinela1.png', 'carcereiro', (255, 30, 30), lambda L: (int(L * 0.7 + 6), int(L * 0.55), int(L * 0.6)))

# criatura de quatro braços, cabeça sem rosto e uma sombra pulsando no peito
def quatro(w=74, h=88):
    M = {'body': ['#08080c', '#18161e', '#2c2834', '#423c4c'], 'shadow': ['#000000', '#3a0a3a', '#a020a0', '#ff60ff'], 'skin': ['#141218', '#24202a', '#3a3440']}
    c = Canvas(w, h, M); cx = w / 2
    c.rect(cx - 9, h * 0.62, cx - 3, h * 0.98, 'body'); c.rect(cx + 3, h * 0.62, cx + 9, h * 0.98, 'body')
    c.ell(cx, h * 0.45, 15, 18, 'body'); c.ell(cx, h * 0.14, 10, 10, 'skin')
    for (y0, dx) in ((0.32, 1), (0.46, 1)):
        for s in (-1, 1): c.line([(cx + s * 12, h * y0), (cx + s * 26, h * (y0 + 0.08)), (cx + s * 30, h * (y0 + 0.22))], 'body', 4)
    c.ell(cx, h * 0.44, 6, 7, 'shadow')
    return c
R(quatro(), 'sombraQuatro')
# o primeiro Devorador: asas enormes, corpo de matéria e sombra, olhos que são mundos mortos
def devorador(w=160, h=120, seed=71):
    rnd = random.Random(seed)
    M = {'body': ['#06040a', '#120c18', '#22182c', '#382a44'], 'wing': ['#0a0810', '#1a1424', '#2c2238', '#40344e'], 'world': ['#3a2010', '#8a5020', '#c08040', '#f0c080'], 'dead': ['#202020', '#505050', '#808080', '#b0b0b0'], 'mouth': ['#000000']}
    c = Canvas(w, h, M); cx = w / 2
    for s in (-1, 1):
        c.poly([(cx + s * 14, h * 0.4), (cx + s * 78, h * 0.02), (cx + s * 74, h * 0.4), (cx + s * 60, h * 0.7), (cx + s * 20, h * 0.6)], 'wing')
        for k in range(4): c.line([(cx + s * 16, h * 0.42), (cx + s * (40 + k * 10), h * (0.06 + k * 0.12))], 'body', 2)
    c.ell(cx, h * 0.58, 26, 34, 'body'); c.ell(cx, h * 0.26, 18, 16, 'body')
    for s in (-1, 1): c.poly([(cx + s * 10, h * 0.16), (cx + s * 22, h * -0.02), (cx + s * 16, h * 0.2)], 'wing')
    for s in (-1, 1): c.ell(cx + s * 8, h * 0.23, 6, 4, 'dead' if s < 0 else 'world')
    c.poly([(cx - 12, h * 0.31), (cx - 8, h * 0.36), (cx - 4, h * 0.31), (cx, h * 0.37), (cx + 4, h * 0.31), (cx + 8, h * 0.36), (cx + 12, h * 0.31), (cx + 9, h * 0.44), (cx - 9, h * 0.44)], 'mouth')
    for k in range(14): c.ell(cx + (rnd.random() - 0.5) * 40, h * (0.45 + rnd.random() * 0.35), 1.5, 1.5, 'world' if k % 3 else 'dead')
    return c
R(devorador(), 'devorador')
# o Rei do Vazio: forma indefinida — às vezes humano, às vezes fera — com dois olhos brancos
def reiVazio(w=150, h=130, seed=81):
    rnd = random.Random(seed)
    M = {'s0': ['#000000', '#050308', '#0c0812', '#16101e'], 'eye': ['#c8c8d0', '#ffffff', '#ffffff', '#ffffff'], 'edge': ['#2a1a40', '#5a3a8a', '#8a6ac0']}
    c = Canvas(w, h, M); cx = w / 2
    for k in range(40):
        a = rnd.random() * math.tau; d = rnd.random() * 0.42
        c.ell(cx + math.cos(a) * w * d, h * 0.5 + math.sin(a) * h * d * 0.9, 8 + rnd.random() * 18, 8 + rnd.random() * 16, 's0')
    c.ell(cx, h * 0.3, 22, 24, 's0')
    for k in range(12):
        x = rnd.random() * w; y = rnd.random() * h
        if c.get(int(x), int(y)) == 's0': c.ell(x, y, 2, 2, 'edge')
    for s in (-1, 1): c.ell(cx + s * 9, h * 0.3, 4, 2.5, 'eye')
    return c
R(reiVazio(), 'reiVazio')
