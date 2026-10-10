# Arte do Livro II (O Reino da Escolha): retratos, personagens do mapa e inimigos.
# Uso: python3 part4.py ../../rpg/img
import sys, math, random
from PIL import Image
from painter import Canvas, hexc
from portraits import person, render as prender
from chars import robed, save as csave
from enemies import ghost, root, crystalman, shards, hands, colossus, recolor, ramp, hx
OUT = sys.argv[1]
base = '/home/user/kravenox-jogar/rpg/img/'
R = lambda c, n: c.render(seed=5, tex=0.06).save(f'{OUT}/e_{n}.png')
def M(**kw): return {k: (v if isinstance(v, list) else [v]) for k, v in kw.items()}

# ======================= RETRATOS =======================
SK = ['#c99a86', '#efd0bd', '#fbe6d8']
# Erya: criança de oito anos, cabelos escuros, olhos brancos, a quinta marca (verde)
c = person(M(hair=['#08060a', '#16121a', '#2a2430'], hairD='#000000', skin=SK, skinD='#c99a86', robe=['#1a2a20', '#2a4030', '#3a5a44'],
             eye='#ffffff', eyeD='#a0a0a8', white='#ffffff', mouth='#b06060', blush='#f0a8a0', mark=['#3aa060', '#8affb0', '#e0fff0']), long=True, blush=True)
for x, y in ((24, 42), (22, 44), (26, 44), (24, 46), (24, 44)): c.px(x, y, 'mark')
prender(c, 'erya', OUT)
# a Origem criança: olhos com estrelas
c = person(M(hair=['#6a70a0', '#a8b0e0', '#e0e4ff'], hairD='#8a90c0', skin=['#c8c0d8', '#ece4f4', '#fff8ff'], skinD='#c8c0d8', robe=['#06061a', '#10102a', '#20204a'],
             eye='#04041a', eyeD='#04041a', white='#ffffff', mouth='#8a6a8a', star=['#ffffff']), long=True)
for x, y in ((16, 25), (18, 27), (30, 25), (32, 27), (10, 40), (36, 42), (20, 44), (28, 40)): c.px(x, y, 'star')
prender(c, 'origem', OUT)
# a Origem humana
c = person(M(hair=['#6a70a0', '#a8b0e0', '#e0e4ff'], hairD='#8a90c0', skin=SK, skinD='#c99a86', robe=['#9aa0c0', '#d0d4ec', '#f4f6ff'],
             eye='#5a6aa0', eyeD='#20284a', white='#ffffff', mouth='#b06060', blush='#f0b0a8'), long=True, blush=True)
prender(c, 'origemH', OUT)
# Aster: trinta anos, cabelos escuros, olhos dourados, sem armadura
c = person(M(hair=['#0a0806', '#1a1410', '#2e241c'], hairD='#000000', skin=['#9a7a60', '#c8a888', '#e0c4a8'], skinD='#9a7a60', robe=['#2a2418', '#3e3626', '#5a4e38'],
             eye='#ffcf3a', eyeD='#5a3a08', white='#fff6c0', mouth='#7a5040'))
prender(c, 'aster', OUT)
# a Rainha da Memória: túnica branca, cabelos totalmente prateados
c = person(M(hair=['#a8acbc', '#dfe2ee', '#ffffff'], hairD='#b8bccc', skin=['#c8c0c8', '#ece6ec', '#ffffff'], skinD='#c8c0c8', robe=['#c8c8d4', '#ececf4', '#ffffff'],
             eye='#a0a8c0', eyeD='#4a5068', white='#ffffff', mouth='#a07080', silver=['#c0c8e0', '#ffffff']), long=True)
c.rect(18, 7, 30, 8, 'silver')
prender(c, 'rainha', OUT)
# o Último Rei: elmo branco, quatro olhos
c = Canvas(48, 48, M(robe=['#a8a8b0', '#d8d8e0', '#f8f8ff'], helm=['#b8b8c0', '#e8e8f0', '#ffffff'], slit=['#000000'], eye=['#000000']))
c.poly([(4, 48), (9, 38), (18, 35), (30, 35), (39, 38), (44, 48)], 'robe'); c.ell(24, 22, 14, 16, 'helm'); c.rect(14, 18, 34, 30, 'helm')
for x in (17, 21, 27, 31): c.rect(x - 1, 22, x + 1, 24, 'slit')
c.rect(23, 4, 25, 34, 'robe'); prender(c, 'ultimoRei', OUT)
# o Thornox Coroado: Thornox velho, armadura negra, coroa de ossos
c = person(M(hair=['#5a4a30', '#7a6a48', '#9a8a68'], hairD='#3a3020', skin=['#6a5a4a', '#8a7868', '#a89888'], skinD='#6a5a4a', robe=['#0a080c', '#16121a', '#2a2430'],
             eye='#3a3a40', eyeD='#1a1a1e', white='#5a5a60', mouth='#4a3a34', bone=['#9a9080', '#d0c8b4', '#f4ecd8'], scar='#4a2a2a'))
for x in (14, 19, 24, 29, 34): c.poly([(x - 2, 10), (x, 3 if x == 24 else 5), (x + 2, 10)], 'bone')
c.rect(12, 9, 36, 11, 'bone'); c.line([(30, 18), (27, 28)], 'scar')
prender(c, 'thornoxC', OUT)
# o Primeiro Rei: cadáver dourado, quatro olhos negros
c = Canvas(48, 48, M(robe=['#6a5010', '#a88020', '#e8c050'], skin=['#4a3a2a', '#6a5a44', '#8a7a60'], eye=['#000000'], gold=['#8a6010', '#e0b040', '#fff0a0'], blade=['#a0a0a8', '#e0e0e8']))
c.poly([(4, 48), (9, 38), (18, 35), (30, 35), (39, 38), (44, 48)], 'robe'); c.ell(24, 23, 12, 13, 'skin')
for x in (17, 21, 27, 31): c.rect(x - 1, 21, x + 1, 23, 'eye')
for x in (14, 19, 24, 29, 34): c.poly([(x - 2, 12), (x, 4), (x + 2, 12)], 'gold')
c.rect(23, 30, 25, 48, 'blade'); prender(c, 'primeiroRei', OUT)
# Caos: raízes e ossos, seis olhos
c = Canvas(48, 48, M(root=['#2a1a10', '#4a3020', '#6a4a30'], bone=['#9a9080', '#d8d0c0'], eye=['#ffffff']))
for k in range(12): a = k / 12 * math.tau; c.line([(24, 26), (24 + math.cos(a) * 22, 26 + math.sin(a) * 22)], 'root', 3)
c.ell(24, 24, 13, 15, 'bone')
for (x, y) in ((18, 18), (24, 16), (30, 18), (18, 26), (24, 28), (30, 26)): c.ell(x, y, 1.6, 1.6, 'eye')
prender(c, 'caos', OUT)
# o Homem de Ossos (o pai dos Devoradores)
c = person(M(hair=['#c8c4bc', '#e8e4dc', '#ffffff'], hairD='#a8a49c', skin=['#8a7a6a', '#b8a898', '#d0c4b4'], skinD='#8a7a6a', robe=['#a8a090', '#d0c8b4', '#f0e8d8'],
             eye='#ffc830', eyeD='#5a3a08', white='#fff6c0', mouth='#6a4a40', rib=['#5a5040']), long=True, fringe=False)
for y in (38, 41, 44): c.line([(12, y), (36, y)], 'rib')
prender(c, 'paiOssos', OUT)
# o Primeiro Irmão: sem boca, olhos vermelhos
c = Canvas(48, 48, M(body=['#060408', '#120c16', '#241a2a'], eye=['#ff3040'], heart=['#000000', '#3a0010']))
c.poly([(0, 48), (6, 34), (18, 32), (30, 32), (42, 34), (48, 48)], 'body'); c.ell(24, 20, 13, 15, 'body')
c.rect(17, 19, 20, 21, 'eye'); c.rect(28, 19, 31, 21, 'eye'); c.ell(24, 42, 4, 4, 'heart')
prender(c, 'irmao', OUT)
# a Velha da Cidade dos Espinhos: olhos extremamente claros
c = person(M(hair=['#a8a4a0', '#dcd8d4', '#f6f4f2'], hairD='#b8b4b0', skin=['#9a8a7a', '#c8b8a8', '#e0d4c4'], skinD='#9a8a7a', robe=['#3e3830', '#5a5048', '#76695e'],
             eye='#d8ecff', eyeD='#6a7a8a', white='#ffffff', mouth='#6a4a40', wr='#8a7a6a'), long=True, fringe=False)
c.line([(15, 20), (19, 21)], 'wr'); c.line([(29, 21), (33, 20)], 'wr')
prender(c, 'velha', OUT)
# o Homem Mascarado (o rosto de Kravenox, olhos negros)
c = Canvas(48, 48, M(robe=['#06040a', '#120e18', '#241c2e'], mask=['#1a1a1e', '#3a3a40', '#5a5a62'], eye=['#000000'], spike=['#2a2030', '#4a3a54']))
c.poly([(4, 48), (9, 38), (18, 35), (30, 35), (39, 38), (44, 48)], 'robe')
for x in (12, 18, 24, 30, 36): c.poly([(x - 3, 14), (x, 2 + abs(x - 24) // 3), (x + 3, 14)], 'spike')
c.ell(24, 23, 12, 13, 'mask'); c.rect(16, 21, 21, 24, 'eye'); c.rect(27, 21, 32, 24, 'eye')
prender(c, 'mascarado', OUT)
# o Bibliotecário
c = person(M(hair=['#4a3a28', '#6a5a40', '#8a7a58'], hairD='#3a2e20', skin=['#9a7a60', '#c8a888', '#e0c4a8'], skinD='#9a7a60', robe=['#3a2a18', '#5a4228', '#7a5a38'],
             eye='#e8d0a0', eyeD='#4a3a20', white='#fff6e0', mouth='#7a5040', lens=['#c8c0a0']))
c.rect(14, 22, 20, 28, 'lens'); c.rect(28, 22, 34, 28, 'lens'); c.ell(17, 25, 2, 2, 'eye'); c.ell(31, 25, 2, 2, 'eye')
prender(c, 'bibliotecario', OUT)
# o Primeiro Leitor: criança de roupas antigas, olhos completamente brancos
prender(person(M(hair=['#2a2018', '#3a3028', '#5a4a3a'], hairD='#1a1410', skin=SK, skinD='#c99a86', robe=['#8a8070', '#b8b0a0', '#e0d8c8'],
             eye='#ffffff', eyeD='#ffffff', white='#ffffff', mouth='#b06060')), 'leitor', OUT)
# o Homem da Estrela: jovem, os olhos de Kravenox
prender(person(M(hair=['#08060a', '#141016', '#241e28'], hairD='#000000', skin=['#a88a78', '#d0b4a0', '#e8d0c0'], skinD='#a88a78', robe=['#2e2e3a', '#4a4a5a', '#6a6a7a'],
             eye='#ff5a2a', eyeD='#3a0a08', white='#ffd0a0', mouth='#7a5050')), 'estranho', OUT)
# Liora: menina com o caderno
c = person(M(hair=['#3a2414', '#5a3a20', '#7a5230'], hairD='#2a1a0e', skin=SK, skinD='#c99a86', robe=['#3a4a6a', '#5a6a8a', '#7a8aaa'],
             eye='#3a2a20', eyeD='#1a1008', white='#ffffff', mouth='#b06060', blush='#f0a8a0', book=['#6a4a2a', '#a07040', '#e8d8b0']), long=True, blush=True)
c.rect(30, 38, 42, 47, 'book'); prender(c, 'liora', OUT)
# Aveline: jovem, capa vermelha, olhos de milhares de anos
c = person(M(hair=['#2a1810', '#3e2418', '#5a3424'], hairD='#1a0e08', skin=SK, skinD='#c99a86', robe=['#5a0a0a', '#8a1a1a', '#b83030'],
             eye='#d8c8a0', eyeD='#5a4a2a', white='#ffffff', mouth='#a05050', ink=['#1a1a2a']), long=True)
c.px(13, 44, 'ink'); c.px(14, 45, 'ink'); prender(c, 'aveline', OUT)
# Azul: a menina que era o Vazio
prender(person(M(hair=['#3a6ac0', '#78b8ff', '#c8e4ff'], hairD='#4a88d0', skin=['#c8c0d0', '#ece6f0', '#fff8ff'], skinD='#c8c0d0', robe=['#1a3060', '#2a4a8a', '#4a6ab0'],
             eye='#203060', eyeD='#0a1430', white='#ffffff', mouth='#a06080', blush='#e0a8c0'), long=True, blush=True), 'azul', OUT)
# o outro Kravenox (vermelho) e o outro Thornox (olhos brancos, ausência)
k = Image.open(base + 'k_futuro.png').convert('RGBA'); head = k.crop((70, 0, 190, 120)).resize((48, 48), Image.LANCZOS); q = head.load()
for y in range(48):
    for x in range(48):
        r, g, b, a = q[x, y]; q[x, y] = (min(255, (r // 24) * 24 + 10), (g // 32) * 24, (b // 32) * 24, 255)
head.save(f'{OUT}/p_kalt.png')
c = person(M(hair=['#0a0a0c', '#16161a', '#24242a'], hairD='#000000', skin=['#8a8a90', '#b0b0b8', '#d0d0d8'], skinD='#8a8a90', robe=['#000000', '#08080a', '#141418'],
             eye='#ffffff', eyeD='#ffffff', white='#ffffff', mouth='#3a3a40'))
prender(c, 'tSilencio', OUT)
# a Senhora da floresta (a do mapa das possibilidades)
prender(person(M(hair=['#9a948e', '#c8c2bc', '#e8e4e0'], hairD='#a8a29c', skin=['#a8887a', '#d0b4a4', '#e8d0c4'], skinD='#a8887a', robe=['#4a3428', '#6a4a3a', '#8a6a54'],
             eye='#4a3a2a', eyeD='#1a1008', white='#ffffff', mouth='#7a5050'), long=True, fringe=False), 'senhora', OUT)
# o Garoto: o primeiro Kravenox
prender(person(M(hair=['#08060a', '#141016', '#241e28'], hairD='#000000', skin=['#3a3440', '#4a4452', '#5e5868'], skinD='#3a3440', robe=['#1a2a3a', '#2a4058', '#3a5a7a'],
             eye='#a8d8ff', eyeD='#203040', white='#ffffff', mouth='#4a3a44')), 'primeiroK', OUT)
# o Homem de Branco: o pai de antes, de máscara erguida
c = person(M(hair=['#c8c4cc', '#e8e4ec', '#ffffff'], hairD='#a8a4ac', skin=['#a88a78', '#d6b8a4', '#ecd6c6'], skinD='#a88a78', robe=['#d8d8e0', '#f0f0f6', '#ffffff'],
             eye='#ffc830', eyeD='#5a3a08', white='#fff6c0', mouth='#7a5050', mask=['#e8e8f0']), fringe=False)
c.rect(14, 8, 34, 14, 'mask'); prender(c, 'paiBranco', OUT)

# ======================= PERSONAGENS DO MAPA =======================
SKS = ['#c99a86', '#efd0bd', '#fbe6d8']
def mk(**kw): return M(**kw)
def mark_x(col):
    def f(c, d, fr, oy):
        if d == 'down': c.px(14, 25 + oy, col); c.px(13, 26 + oy, col); c.px(15, 26 + oy, col)
    return f
ERYA = mk(hair=['#08060a', '#16121a', '#2a2430'], hairD='#000000', skin=SKS, robe=['#1a2a20', '#2a4030', '#3a5a44'], robeD='#122018', eye='#ffffff', eyeD='#9a9aa4', mouth='#b06060', shoe=['#0a0e0a', '#1a221a'], mk2=['#8affb0'])
csave(lambda d, f: robed(d, f, ERYA, hair_long=True, small=3, extra=mark_x('mk2')), 'erya', OUT)
MAE = mk(hair=['#9a8ab8', '#c8b8e0', '#ece4f8'], hairD='#a898c8', skin=SKS, robe=['#c8bca0', '#e8dcc0', '#fff8e8'], robeD='#a89c80', eye='#ffe0a0', eyeD='#4a3a20', mouth='#b07060', shoe=['#5a4a3a', '#7a6a5a'], blade=['#a0a0a8', '#e0e0e8'])
def mae_x(c, d, f, oy):
    if d == 'down': c.line([(22, 20 + oy), (25, 30 + oy)], 'blade')
    elif d == 'left': c.line([(6, 22 + oy), (4, 30 + oy)], 'blade')
csave(lambda d, f: robed(d, f, MAE, hair_long=True, extra=mae_x), 'mae', OUT)
ORI = mk(hair=['#6a70a0', '#a8b0e0', '#e0e4ff'], hairD='#8a90c0', skin=['#c8c0d8', '#ece4f4', '#fff8ff'], robe=['#06061a', '#10102a', '#20204a'], robeD='#04040e', eye='#ffffff', eyeD='#04041a', mouth='#8a6a8a', shoe=['#06061a', '#10102a'], st=['#ffffff'])
def ori_x(c, d, f, oy):
    for x, y in ((9, 24), (17, 28), (12, 30), (19, 22)): c.px(x, y + oy, 'st')
csave(lambda d, f: robed(d, f, ORI, hair_long=True, small=4, extra=ori_x), 'origem', OUT)
ORH = mk(hair=['#6a70a0', '#a8b0e0', '#e0e4ff'], hairD='#8a90c0', skin=SKS, robe=['#9aa0c0', '#d0d4ec', '#f4f6ff'], robeD='#7a80a0', eye='#5a6aa0', eyeD='#20284a', mouth='#b06060', shoe=['#4a4a6a', '#6a6a8a'])
csave(lambda d, f: robed(d, f, ORH, hair_long=True), 'origemH', OUT)
for name, P, kw in (
    ('aster', mk(hair=['#0a0806', '#1a1410', '#2e241c'], hairD='#000000', skin=['#9a7a60', '#c8a888', '#e0c4a8'], robe=['#2a2418', '#3e3626', '#5a4e38'], robeD='#1a160e', eye='#ffcf3a', eyeD='#5a3a08', mouth='#7a5040', shoe=['#1a140c', '#2a2218']), {'hair_long': False}),
    ('rainha', mk(hair=['#a8acbc', '#dfe2ee', '#ffffff'], hairD='#b8bccc', skin=['#c8c0c8', '#ece6ec', '#ffffff'], robe=['#c8c8d4', '#ececf4', '#ffffff'], robeD='#a8a8b8', eye='#a0a8c0', eyeD='#4a5068', mouth='#a07080', shoe=['#c8c8d4', '#ececf4']), {'hair_long': True}),
    ('bibliotecario', mk(robe=['#3a2a18', '#5a4228', '#7a5a38'], robeD='#2a1e10', shadow='#0a0806', eye='#e8d0a0', skin=['#9a7a60', '#c8a888'], shoe=['#1a1208', '#2a2010']), {'hood': True}),
    ('leitor', mk(hair=['#2a2018', '#3a3028', '#5a4a3a'], hairD='#1a1410', skin=SKS, robe=['#8a8070', '#b8b0a0', '#e0d8c8'], robeD='#6a6050', eye='#ffffff', eyeD='#ffffff', mouth='#b06060', shoe=['#4a4030', '#6a6050']), {'hair_long': False, 'small': 4}),
    ('liora', mk(hair=['#3a2414', '#5a3a20', '#7a5230'], hairD='#2a1a0e', skin=SKS, robe=['#3a4a6a', '#5a6a8a', '#7a8aaa'], robeD='#2a3a5a', eye='#3a2a20', eyeD='#1a1008', mouth='#b06060', shoe=['#2a2018', '#3a3028']), {'hair_long': True, 'small': 3}),
    ('aveline', mk(robe=['#5a0a0a', '#8a1a1a', '#b83030'], robeD='#3a0606', shadow='#140404', eye='#d8c8a0', skin=['#c99a86', '#efd0bd'], shoe=['#2a0606', '#4a0a0a']), {'hood': True}),
    ('azul', mk(hair=['#3a6ac0', '#78b8ff', '#c8e4ff'], hairD='#4a88d0', skin=['#c8c0d0', '#ece6f0', '#fff8ff'], robe=['#1a3060', '#2a4a8a', '#4a6ab0'], robeD='#102040', eye='#203060', eyeD='#0a1430', mouth='#a06080', shoe=['#102040', '#1a3060']), {'hair_long': True, 'small': 3}),
    ('velha', mk(hair=['#a8a4a0', '#dcd8d4', '#f6f4f2'], hairD='#b8b4b0', skin=['#9a8a7a', '#c8b8a8', '#e0d4c4'], robe=['#3e3830', '#5a5048', '#76695e'], robeD='#2a241e', eye='#d8ecff', eyeD='#6a7a8a', mouth='#6a4a40', shoe=['#2a241e', '#3e3830']), {'hair_long': True}),
    ('estranho', mk(hair=['#08060a', '#141016', '#241e28'], hairD='#000000', skin=['#a88a78', '#d0b4a0', '#e8d0c0'], robe=['#2e2e3a', '#4a4a5a', '#6a6a7a'], robeD='#1e1e28', eye='#ff5a2a', eyeD='#3a0a08', mouth='#7a5050', shoe=['#1a1a22', '#2a2a34']), {'hair_long': False}),
    ('senhora', mk(hair=['#9a948e', '#c8c2bc', '#e8e4e0'], hairD='#a8a29c', skin=['#a8887a', '#d0b4a4', '#e8d0c4'], robe=['#4a3428', '#6a4a3a', '#8a6a54'], robeD='#3a2418', eye='#4a3a2a', eyeD='#1a1008', mouth='#7a5050', shoe=['#2a1a10', '#3a2a1a']), {'hair_long': True}),
    ('aldeao', mk(hair=['#3a2a1a', '#4a3624', '#5e4630'], hairD='#2a1e12', skin=['#a8886a', '#c8a888', '#e0c4a8'], robe=['#3a4a2a', '#4a5a3a', '#5e6e4a'], robeD='#2a3420', eye='#2a1a10', eyeD='#1a1008', mouth='#7a5040', shoe=['#2a2016', '#3a2e20']), {'hair_long': False}),
    ('aldea', mk(hair=['#4a2a18', '#5a3a24', '#74502e'], hairD='#3a2010', skin=['#c8a088', '#e0c0a8', '#f4dcc8'], robe=['#6a4a3a', '#7a5a4a', '#9a7660'], robeD='#4a3428', eye='#2a1a10', eyeD='#1a1008', mouth='#a06050', shoe=['#2a1a10', '#3a2a1a']), {'hair_long': True}),
    ('crianca', mk(hair=['#3a2414', '#4a2e1a', '#64422a'], hairD='#2a1a0e', skin=SKS, robe=['#7a5a2a', '#8a6a3a', '#a8864e'], robeD='#5a4020', eye='#2a1a10', eyeD='#1a1008', mouth='#b06060', shoe=['#2a1e10', '#3a2a18']), {'hair_long': False, 'small': 4}),
):
    csave(lambda d, f, P=P, kw=kw: robed(d, f, P, **kw), name, OUT)

# ======================= INIMIGOS =======================
def rc(src, dst, f, eye=None):
    def gg(r, g, b):
        if eye and ((r > 200 and g < 120) or (b > r + 30 and b > 120)): return eye
        L = (r + g + b) / 3; return f(L)
    recolor(base + src, f'{OUT}/e_{dst}.png', gg)
def shardsC(w, h, mats, seed):
    c = shards(w, h, seed); c.mats.update({k: [tuple(hexc(x)) for x in v] for k, v in mats.items()}); return c
def cman(w, h, armor, crys, eye, seed=7):
    g = crystalman(w, h, seed); g.mats.update({'armor': [hexc(x) for x in armor], 'crys': [hexc(x) for x in crys], 'eye': [hexc(eye)]}); return g

# Parte 1
R(ghost(60, 66, '#a89060', '#fff6c0', crystal=True, seed=101), 'simboloTunel')
R(cman(64, 80, ['#2a2620', '#4a4438', '#6a6250', '#8a826c'], ['#1a3a2a', '#3a8a5a', '#8affb0', '#e0fff0'], '#8affb0', 102), 'guardaTunel')
R(root(70, 70, '#0a0a10', '#1a1a24', '#a0ffbe', thick=5, eyes=2, seed=103), 'raizNova')
def soldado(w=66, h=82):
    P = {'stone': ramp('#5a5a5a'), 'plate': ramp('#7a7068'), 'eye': ['#ff3020', '#ffd0a0'], 'blade': ['#6a6a70', '#c0c0c8']}
    c = Canvas(w, h, P); cx = w / 2
    c.rect(cx - 9, h * 0.62, cx - 3, h * 0.98, 'stone'); c.rect(cx + 3, h * 0.62, cx + 9, h * 0.98, 'stone')
    c.ell(cx, h * 0.44, 15, 19, 'plate'); c.ell(cx, h * 0.14, 9, 9, 'stone')
    for (y0, s) in ((0.32, -1), (0.32, 1), (0.48, -1), (0.48, 1)): c.line([(cx + s * 12, h * y0), (cx + s * 24, h * (y0 + 0.1)), (cx + s * 28, h * (y0 + 0.24))], 'stone', 4)
    c.line([(cx - 28, h * 0.56), (cx - 32, h * 0.2)], 'blade', 2); c.line([(cx + 28, h * 0.72), (cx + 30, h * 0.98)], 'blade', 2)
    c.ell(cx - 3, h * 0.13, 1.5, 1.5, 'eye'); c.ell(cx + 3, h * 0.13, 1.5, 1.5, 'eye')
    for k in range(6): c.line([(cx - 12 + k * 5, h * 0.36), (cx - 10 + k * 5, h * 0.56)], 'stone')
    return c
R(soldado(), 'soldadoPedra')
R(ghost(58, 64, '#4a4650', '#ffe0a0', seed=104), 'criaturaFumaca')
def alado(w=70, h=86, body='#1a1420', wing='#0a0810', eye='#ff4030', seed=105):
    P = {'body': ramp(body), 'wing': ramp(wing), 'eye': [eye, '#ffffff'], 'blade': ['#5a5a66', '#a0a0b0', '#e0e0f0']}
    c = Canvas(w, h, P); cx = w / 2
    for s in (-1, 1): c.poly([(cx + s * 6, h * 0.3), (cx + s * 34, h * 0.02), (cx + s * 33, h * 0.32), (cx + s * 26, h * 0.6), (cx + s * 8, h * 0.5)], 'wing')
    c.rect(cx - 7, h * 0.62, cx - 2, h * 0.98, 'body'); c.rect(cx + 2, h * 0.62, cx + 7, h * 0.98, 'body')
    c.ell(cx, h * 0.45, 11, 17, 'body'); c.ell(cx, h * 0.18, 8, 9, 'body')
    c.ell(cx - 3, h * 0.17, 1.5, 1.2, 'eye'); c.ell(cx + 3, h * 0.17, 1.5, 1.2, 'eye')
    c.line([(cx - 14, h * 0.46), (cx - 22, h * 0.8)], 'blade', 2)
    return c
R(alado(), 'guerreiroAlado')
R(shardsC(72, 66, {'crys': ['#1a1a20', '#3a3a44', '#6a6a7a', '#c0c0d0'], 'core': ['#000000', '#ff6a3a']}, 106), 'maquinaMundos')
R(ghost(56, 62, '#d8c8a0', '#6a5030', seed=107), 'memoriaErrante')
R(shardsC(64, 64, {'crys': ['#0a0a0c', '#1a1a1e', '#2a2a30', '#5a5a64'], 'core': ['#000000', '#a0a0b0']}, 108), 'cristalSemEss')
rc('e_devorador.png', 'devoradorMenor', lambda L: (int(L * 0.8 + 8), int(L * 0.65 + 4), int(L * 0.7 + 10)))
rc('e_devorador.png', 'devoradorGrande', lambda L: (int(L * 0.9 + 10), int(L * 0.8 + 6), int(L * 0.55)))
R(hands(76, 70, '#3a2a1a', '#1a1208', seed=109), 'garrasMundo')
R(hands(76, 70, '#c8c8d0', '#6a6a74', seed=110), 'correnteEntre')
R(ghost(56, 62, '#8a8a9a', '#000000', seed=111), 'esquecido')
def semRosto(w=70, h=94, body='#0a0a0e', crack='#e8f0ff', seed=112):
    rnd = random.Random(seed)
    P = {'body': ramp(body), 'crack': [crack, '#ffffff']}
    c = Canvas(w, h, P); cx = w / 2
    c.rect(cx - 10, h * 0.6, cx - 3, h * 0.98, 'body'); c.rect(cx + 3, h * 0.6, cx + 10, h * 0.98, 'body')
    c.ell(cx, h * 0.42, 16, 22, 'body'); c.ell(cx, h * 0.13, 10, 11, 'body')
    for s in (-1, 1): c.line([(cx + s * 13, h * 0.3), (cx + s * 22, h * 0.6)], 'body', 5)
    for k in range(7):
        x, y = cx + (rnd.random() - 0.5) * 18, h * (0.08 + rnd.random() * 0.6)
        c.line([(x, y), (x + rnd.random() * 6 - 3, y + 4 + rnd.random() * 6)], 'crack')
    return c
R(semRosto(), 'antigo')
def fera(w=120, h=100, seed=113):
    c = colossus(w, h, seed); return c
R(fera(), 'antigoFera')
# chefes da Parte 1
def armadura(w=84, h=108, plate='#d8d8e0', eyes=4, blade='#f0f0ff', crown=None, seed=114, eyecol='#000000'):
    P = {'plate': ramp(plate), 'dark': ramp('#3a3a44', 3), 'eye': [eyecol], 'blade': [blade, '#ffffff'], 'gold': ['#8a6010', '#e0b040', '#fff0a0']}
    c = Canvas(w, h, P); cx = w / 2
    c.rect(cx - 11, h * 0.62, cx - 3, h * 0.98, 'plate'); c.rect(cx + 3, h * 0.62, cx + 11, h * 0.98, 'plate')
    c.poly([(cx - 20, h * 0.3), (cx + 20, h * 0.3), (cx + 16, h * 0.66), (cx - 16, h * 0.66)], 'plate')
    c.ell(cx, h * 0.18, 11, 12, 'plate'); c.rect(cx - 9, h * 0.15, cx + 9, h * 0.22, 'dark')
    for k in range(eyes): c.rect(cx - 7 + k * (14 / max(1, eyes - 1)) - 1, h * 0.17, cx - 7 + k * (14 / max(1, eyes - 1)) + 1, h * 0.19, 'eye')
    c.line([(cx - 20, h * 0.34), (cx - 28, h * 0.56)], 'plate', 5)
    c.line([(cx - 30, h * 0.6), (cx - 34, h * 0.05)], 'blade', 3)
    if crown:
        for x in (-8, -3, 3, 8): c.poly([(cx + x - 2, h * 0.08), (cx + x, h * 0.0), (cx + x + 2, h * 0.08)], crown)
    return c
R(armadura(), 'ultimoRei')
tc = armadura(60, 78, '#2a2430', 2, '#ffe08a', crown='bone', seed=130, eyecol='#3a3a40'); tc.mats['bone'] = [hexc(x) for x in ['#9a9080', '#d0c8b4', '#f4ecd8']]; R(tc, 'thornoxCoroado')
R(colossus(130, 116, 115), 'reiPedra')
R(ghost(70, 80, '#2a2830', '#ffe080', seed=116), 'reiFumaca')
R(alado(80, 96, '#14101a', '#06040a', '#ffffff', 117), 'reiAsas')
g = armadura(84, 108, '#a88020', 4, '#e0e0e8', crown='gold', seed=118); R(g, 'primeiroRei'); R(g, 'primeiroReiD')
def caos(w=130, h=124, seed=119):
    rnd = random.Random(seed)
    P = {'root': ramp('#3a2a20'), 'bone': ['#8a8478', '#c8c0b0', '#eee8dc'], 'eye': ['#ffffff'], 'w': [['#3a2010', '#8a5020'], ['#204a2a', '#4a8a5a'], ['#20304a', '#4a6a9a'], ['#4a2a4a', '#8a5a8a'], ['#3a3a3a', '#7a7a7a'], ['#5a4a2a', '#c8b060']]}
    P = {k: v for k, v in P.items() if k != 'w'}
    for i, (a, b) in enumerate([('#3a2010', '#8a5020'), ('#204a2a', '#4a8a5a'), ('#20304a', '#4a6a9a'), ('#4a2a4a', '#8a5a8a'), ('#3a3a3a', '#7a7a7a'), ('#5a4a2a', '#c8b060')]): P['w%d' % i] = [a, b, '#ffffff']
    c = Canvas(w, h, P); cx = w / 2
    for k in range(18):
        a = rnd.random() * math.tau; L = 30 + rnd.random() * 30
        c.line([(cx, h * 0.55), (cx + math.cos(a) * L, h * 0.55 + math.sin(a) * L * 0.8)], 'root', 3 + rnd.randint(0, 3))
    c.ell(cx, h * 0.5, 26, 34, 'root'); c.ell(cx, h * 0.24, 18, 16, 'bone')
    for i, (x, y) in enumerate(((-10, 0.19), (0, 0.17), (10, 0.19), (-10, 0.28), (0, 0.3), (10, 0.28))): c.ell(cx + x, h * y, 3, 2.5, 'w%d' % i)
    return c
R(caos(), 'caos')
def irmao(w=150, h=124, seed=120):
    P = {'body': ramp('#120c16'), 'wing': ramp('#0a0610'), 'heart': ['#000000', '#3a0010', '#a01030'], 'eye': ['#ff3040']}
    c = Canvas(w, h, P); cx = w / 2
    for k in range(3):
        for s in (-1, 1): c.poly([(cx + s * 10, h * 0.32), (cx + s * (70 - k * 8), h * (0.0 + k * 0.18)), (cx + s * (64 - k * 8), h * (0.22 + k * 0.18)), (cx + s * 14, h * 0.45)], 'wing')
    c.rect(cx - 12, h * 0.66, cx - 4, h * 0.98, 'body'); c.rect(cx + 4, h * 0.66, cx + 12, h * 0.98, 'body')
    c.ell(cx, h * 0.48, 22, 28, 'body'); c.ell(cx, h * 0.18, 12, 13, 'body')
    for (y0, s) in ((0.38, -1), (0.38, 1), (0.52, -1), (0.52, 1)): c.line([(cx + s * 18, h * y0), (cx + s * 36, h * (y0 + 0.12)), (cx + s * 40, h * (y0 + 0.3))], 'body', 5)
    c.ell(cx, h * 0.46, 7, 8, 'heart'); c.rect(cx - 6, h * 0.17, cx - 3, h * 0.19, 'eye'); c.rect(cx + 3, h * 0.17, cx + 6, h * 0.19, 'eye')
    return c
R(irmao(), 'primeiroIrmao')
def cabecaVazio(w=160, h=124, seed=121):
    rnd = random.Random(seed)
    P = {'v': ['#000000', '#05050a', '#0c0c14', '#16161e'], 'crack': ['#c8d0ff', '#ffffff']}
    c = Canvas(w, h, P); cx = w / 2
    c.ell(cx, h * 0.45, 56, 50, 'v'); c.ell(cx, h * 0.82, 30, 18, 'v')
    for k in range(16):
        x, y = cx + (rnd.random() - 0.5) * 90, h * (0.15 + rnd.random() * 0.6)
        c.line([(x, y), (x + rnd.random() * 10 - 5, y + 6 + rnd.random() * 10)], 'crack')
    return c
R(cabecaVazio(), 'primeiroAntigo')

# Parte 2
R(root(70, 70, '#1a3a2a', '#4a8a6a', '#dcfff0', thick=4, eyes=2, seed=201), 'feraFolhas')
R(shardsC(66, 64, {'crys': ['#2a2a24', '#4a4a40', '#7a7a6a', '#b0b0a0'], 'core': ['#000000', '#a0ffd8']}, 202), 'pedraFlutuante')
R(ghost(58, 64, '#3a8a6a', '#e0fff0', seed=203), 'marVerde')
rc('e_sentinela.png', 'herdeiro', lambda L: (int(L * 0.45), int(L * 0.38), int(L * 0.48)), eye=(255, 50, 30))
R(ghost(60, 66, '#6a2a2a', '#ffd060', crystal=True, seed=204), 'sacerdote')
rc('e_ossoNegro.png', 'herdeiroCap', lambda L: (int(L * 0.55 + 6), int(L * 0.3), int(L * 0.32)))
R(root(72, 74, '#d8d4cc', '#a8a49a', '#ffdc78', thick=5, eyes=1, seed=205), 'raizMemoria')
R(shardsC(66, 66, {'crys': ['#8a8a84', '#c8c8c0', '#e8e8e0', '#ffffff'], 'core': ['#ffffff', '#ffe8a0']}, 206), 'galhoPossib')
rc('e_ossoNegro.png', 'ossoMundo', lambda L: (int(L * 0.9 + 20), int(L * 0.85 + 16), int(L * 0.75 + 10)))
def livro(w=64, h=64, seed=207):
    P = {'cover': ramp('#5a2a1a'), 'page': ['#c8b890', '#e8dcc0', '#fff8e8'], 'ink': ['#1a1410'], 'eye': ['#ffdca0']}
    c = Canvas(w, h, P); cx, cy = w / 2, h / 2
    c.poly([(cx - 28, cy - 4), (cx, cy + 6), (cx, cy + 22), (cx - 28, cy + 12)], 'cover'); c.poly([(cx + 28, cy - 4), (cx, cy + 6), (cx, cy + 22), (cx + 28, cy + 12)], 'cover')
    c.poly([(cx - 25, cy - 8), (cx, cy + 2), (cx, cy + 18), (cx - 25, cy + 8)], 'page'); c.poly([(cx + 25, cy - 8), (cx, cy + 2), (cx, cy + 18), (cx + 25, cy + 8)], 'page')
    for k in range(5): c.line([(cx - 22, cy - 4 + k * 3), (cx - 4, cy + 4 + k * 3)], 'ink'); c.line([(cx + 4, cy + 4 + k * 3), (cx + 22, cy - 4 + k * 3)], 'ink')
    for k in range(4): c.poly([(cx - 20 + k * 12, cy - 12), (cx - 16 + k * 12, cy - 22 - (k % 2) * 4), (cx - 12 + k * 12, cy - 12)], 'page')
    return c
R(livro(), 'livroVoador')
R(ghost(58, 64, '#0a0a14', '#e0e8ff', seed=208), 'tintaViva')
rc('e_escolhido.png', 'personagem', lambda L: (int(L * 0.62 + 30), int(L * 0.58 + 26), int(L * 0.5 + 20)))
rc('e_kfuturo.png', 'mascarado', lambda L: (int(L * 0.5), int(L * 0.5), int(L * 0.55)))
R(armadura(84, 108, '#e8e8f0', 2, '#14101a', seed=209, eyecol='#5a3a08'), 'paiBranco')
def leitor(w=64, h=76):
    P = {'robe': ramp('#a89c88'), 'skin': ['#c99a86', '#efd0bd', '#fbe6d8'], 'hair': ramp('#3a3028', 3), 'eye': ['#ffffff'], 'page': ['#e8dcc0', '#fff8e8'], 'glow': ['#ffffff']}
    c = Canvas(w, h, P); cx = w / 2
    c.poly([(cx - 12, h * 0.45), (cx + 12, h * 0.45), (cx + 16, h * 0.98), (cx - 16, h * 0.98)], 'robe')
    c.ell(cx, h * 0.3, 11, 12, 'skin'); c.ell(cx, h * 0.22, 12, 8, 'hair')
    c.rect(cx - 6, h * 0.3, cx - 3, h * 0.33, 'eye'); c.rect(cx + 3, h * 0.3, cx + 6, h * 0.33, 'eye')
    c.poly([(cx - 22, h * 0.56), (cx - 4, h * 0.6), (cx - 4, h * 0.72), (cx - 22, h * 0.68)], 'page')
    return c
R(leitor(), 'primeiroLeitor')

# Parte 3
R(ghost(58, 64, '#1a1a20', '#ffffff', seed=301), 'apagado')
R(shardsC(66, 66, {'crys': ['#000000', '#0a0a0e', '#1a1a20', '#3a3a44'], 'core': ['#000000', '#ffffff']}, 302), 'fragSilencio')
R(ghost(58, 64, '#3a2a3a', '#ffd060', seed=303), 'medoAntigo')
rc('e_ossoNegro.png', 'culpa', lambda L: (int(L * 0.6 + 10), int(L * 0.5 + 8), int(L * 0.3)))
R(shardsC(64, 64, {'crys': ['#6a5a20', '#c8a840', '#f8e8a0', '#ffffff'], 'core': ['#ffffff', '#ffffff']}, 304), 'estrelaCadente')
rc('e_escolhido.png', 'semRostoNome', lambda L: (int(L * 0.8 + 40), int(L * 0.8 + 40), int(L * 0.82 + 44)))
R(ghost(60, 66, '#06060a', '#ffffff', seed=305), 'sombraSilencio')
def porta(w=76, h=70, seed=306):
    P = {'wood': ramp('#4a2e18'), 'iron': ['#1a1a1e', '#3a3a40', '#6a6a72'], 'eye': ['#ffd86e', '#ffffff'], 'hand': ramp('#2a2026', 3)}
    c = Canvas(w, h, P); cx = w / 2
    c.rect(cx - 16, h * 0.08, cx + 16, h * 0.96, 'wood'); c.ell(cx, h * 0.1, 16, 8, 'wood')
    for y in (0.3, 0.7): c.rect(cx - 16, h * y, cx + 16, h * y + 2, 'iron')
    c.ell(cx + 6, h * 0.52, 2, 2, 'eye')
    for s in (-1, 1): c.line([(cx + s * 16, h * 0.5), (cx + s * 30, h * 0.4), (cx + s * 36, h * 0.6)], 'hand', 4)
    return c
R(porta(), 'portaViva')
R(ghost(58, 64, '#7a9ab0', '#203040', seed=307), 'reflexo')
rc('e_ossoNegro.png', 'possRecusada', lambda L: (int(L * 0.4), int(L * 0.45 + 6), int(L * 0.7 + 20)))
R(cman(66, 82, ['#2a0a0a', '#4a1414', '#6a2020', '#8a3030'], ['#4a0a0a', '#a01a1a', '#ff4040', '#ffc0c0'], '#ff3030', 308), 'pedraVermelha')
rc('e_sentinela1.png', 'versaoPerdida', lambda L: (int(L * 0.8 + 10), int(L * 0.35), int(L * 0.35)), eye=(255, 32, 32))
R(ghost(58, 64, '#f0f0f0', '#a0a0a0', seed=309), 'nomeApagado')
R(root(72, 74, '#e8e8e4', '#b8b8b0', '#78b4ff', thick=5, eyes=2, seed=310), 'galhoBranco')
R(ghost(58, 64, '#1a2a4a', '#78b8ff', seed=311), 'chamaApagada')
R(shardsC(66, 66, {'crys': ['#0a0a1a', '#1a1a3a', '#3a3a6a', '#8a8ac8'], 'core': ['#000000', '#b26bff']}, 312), 'vazioMenor')
def silencio(w=150, h=124, seed=313):
    rnd = random.Random(seed)
    P = {'s': ['#000000', '#05050a', '#0c0c12', '#16161e'], 'face': ['#2a2a32', '#5a5a64', '#a0a0ac'], 'eye': ['#ffffff']}
    c = Canvas(w, h, P); cx = w / 2
    for k in range(36):
        a = rnd.random() * math.tau; d = rnd.random() * 0.4
        c.ell(cx + math.cos(a) * w * d, h * 0.55 + math.sin(a) * h * d * 0.9, 6 + rnd.random() * 16, 6 + rnd.random() * 14, 's')
    c.ell(cx, h * 0.28, 18, 20, 'face'); c.ell(cx - 6, h * 0.26, 2.5, 1.6, 'eye'); c.ell(cx + 6, h * 0.26, 2.5, 1.6, 'eye')
    return c
R(silencio(), 'primeiroSilencio')
R(ghost(80, 90, '#000000', '#ffffff', seed=314), 'sombraThornox')
def tsil(w=60, h=78):
    P = {'robe': ramp('#0a0a0c'), 'skin': ['#8a8a90', '#b0b0b8', '#d0d0d8'], 'hair': ramp('#16161a', 3), 'eye': ['#ffffff'], 'void': ['#000000']}
    c = Canvas(w, h, P); cx = w / 2
    c.poly([(cx - 14, h * 0.36), (cx + 14, h * 0.36), (cx + 18, h * 0.98), (cx - 18, h * 0.98)], 'robe')
    c.ell(cx, h * 0.22, 10, 11, 'skin'); c.ell(cx, h * 0.15, 11, 7, 'hair')
    c.rect(cx - 6, h * 0.22, cx - 3, h * 0.24, 'eye'); c.rect(cx + 3, h * 0.22, cx + 6, h * 0.24, 'eye')
    c.line([(cx + 14, h * 0.4), (cx + 18, h * 0.05)], 'robe', 3)
    for k in range(6): c.ell(cx + (k - 2.5) * 9, h * 0.97, 5, 3, 'void')
    return c
R(tsil(), 'thornoxSilencio')
def aveline(w=120, h=130):
    P = {'cape': ramp('#8a1a1a'), 'skin': ['#c99a86', '#efd0bd', '#fbe6d8'], 'hair': ramp('#3e2418', 3), 'eye': ['#d8c8a0'], 'page': ['#e8dcc0', '#fff8e8'], 'ink': ['#1a1a2a']}
    c = Canvas(w, h, P); cx = w / 2
    c.poly([(cx - 20, h * 0.28), (cx + 20, h * 0.28), (cx + 46, h * 0.98), (cx - 46, h * 0.98)], 'cape')
    c.ell(cx, h * 0.18, 13, 14, 'skin'); c.poly([(cx - 15, h * 0.12), (cx + 15, h * 0.12), (cx + 18, h * 0.4), (cx - 18, h * 0.4)], 'hair'); c.ell(cx, h * 0.2, 10, 11, 'skin')
    c.rect(cx - 6, h * 0.19, cx - 3, h * 0.21, 'eye'); c.rect(cx + 3, h * 0.19, cx + 6, h * 0.21, 'eye')
    c.poly([(cx - 40, h * 0.5), (cx - 12, h * 0.54), (cx - 12, h * 0.7), (cx - 40, h * 0.66)], 'page')
    for k in range(4): c.line([(cx - 36, h * (0.53 + k * 0.035)), (cx - 16, h * (0.57 + k * 0.035))], 'ink')
    return c
R(aveline(), 'aveline')
def vazioCrianca(w=70, h=84):
    P = {'body': ['#c8c8d0', '#e0e0e8', '#f0f0f8', '#ffffff'], 'shade': ['#a0a0b0']}
    c = Canvas(w, h, P); cx = w / 2
    c.poly([(cx - 12, h * 0.4), (cx + 12, h * 0.4), (cx + 16, h * 0.98), (cx - 16, h * 0.98)], 'body')
    c.ell(cx, h * 0.26, 13, 14, 'body'); c.line([(cx - 8, h * 0.32), (cx + 8, h * 0.32)], 'shade')
    return c
R(vazioCrianca(), 'ultimoInimigo')
print('ok')
