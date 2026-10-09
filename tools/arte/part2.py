# Arte da Parte 2: o pai acorrentado, Seraphyne, o Kravenox do Futuro, a forma desperta e o Primeiro.
import sys, math
from PIL import Image, ImageFilter
from painter import Canvas
from portraits import person, render as prender
from chars import robed, save as csave
import chars
OUT = sys.argv[1]

PAI = {'hair': ['#8e8a96', '#d4d0dc', '#f4f2f8'], 'hairD': ['#a8a4b0'], 'skin': ['#a88a78', '#d6b8a4', '#ecd6c6'], 'skinD': ['#a88a78'],
       'robe': ['#1c1a24', '#33303e', '#4a4658'], 'eye': ['#ffc830'], 'eyeD': ['#5a3a08'], 'white': ['#fff6c0'], 'mouth': ['#7a5050'],
       'crys': ['#3aa0c0', '#8ae8ff', '#e8fcff', '#ffffff'], 'chain': ['#3a3a44', '#7a7a88', '#c0c0cc'], 'beard': ['#6a6672', '#9a96a4', '#c4c0cc']}
c = person(PAI, hair=False)
c.ell(24, 13, 14, 6, 'hair', only=[None]); c.ell(24, 12, 13, 5, 'hair')
c.rect(9, 12, 13, 34, 'hair'); c.rect(35, 12, 39, 34, 'hair')
c.line([(14, 21), (19, 20)], 'hairD'); c.line([(29, 20), (34, 21)], 'hairD')
c.poly([(17, 31), (31, 31), (29, 37), (24, 39), (19, 37)], 'beard')
c.rect(22, 31, 26, 32, 'mouth')
c.poly([(26, 8), (40, 12), (44, 48), (24, 48), (27, 34), (25, 22)], 'crys', only=['skin', 'hair', 'robe', 'hairD', 'beard', 'skinD', 'eye', 'eyeD', 'white', 'mouth'])
for x, y in ((30, 18), (35, 26), (33, 40), (38, 34)): c.px(x, y, 'white')
c.line([(2, 40), (14, 44), (24, 42), (34, 45), (46, 40)], 'chain', w=2)
for x in range(4, 46, 5): c.px(x, 42 + int(math.sin(x) * 1.5), 'chain')
prender(c, 'pai', OUT)

SER = {'hair': ['#8a90a8', '#d0d6e8', '#f6f8ff'], 'hairD': ['#a0a6c0'], 'skin': ['#b4a0a8', '#e2d2d6', '#f6eaec'], 'skinD': ['#b4a0a8'],
       'robe': ['#08070c', '#1a1822', '#34303e', '#56506a'], 'eye': ['#9a60ff'], 'eyeD': ['#24104a'], 'white': ['#e8d8ff'], 'mouth': ['#8a5a6a'],
       'mark': ['#ff3040'], 'blush': ['#d8a0b0']}
c = person(SER, long=True)
c.poly([(4, 48), (8, 38), (15, 36), (24, 40), (33, 36), (40, 38), (44, 48)], 'robe')
c.poly([(8, 38), (14, 34), (16, 39)], 'robe'); c.poly([(40, 38), (34, 34), (32, 39)], 'robe')
for (x, y) in ((24, 42), (24, 44), (22, 43), (26, 43), (24, 46)): c.px(x, y, 'mark')
c.px(24, 19, 'mark')
prender(c, 'seraphyne', OUT)

# sprite de campo da Seraphyne: armadura negra, cabelo prateado, marca vermelha
SERS = {'hair': ['#8a90a8', '#d0d6e8', '#f6f8ff'], 'hairD': ['#a0a6c0'], 'skin': ['#b4a0a8', '#e2d2d6', '#f6eaec'], 'robe': ['#08070c', '#1a1822', '#34303e'],
        'robeD': ['#050408'], 'eye': ['#9a60ff'], 'eyeD': ['#24104a'], 'mouth': ['#8a5a6a'], 'shoe': ['#050408', '#14121a'], 'mark': ['#ff3040']}
def ser_extra(c, d, f, oy):
    if d == 'down': c.px(14, 25, 'mark'); c.px(13, 26, 'mark'); c.px(15, 26, 'mark'); c.px(14, 27, 'mark')
def seraphyne(d, f): return robed(d, f, SERS, hair_long=True, extra=ser_extra)
csave(seraphyne, 'seraphyne', OUT)

# Kravenox armadurado, pintado à mão a partir do desenho do autor (48x64)
def armored(pal, name):
    c = Canvas(52, 66, pal)
    # capa rasgada atrás
    c.poly([(12, 18), (40, 18), (46, 60), (40, 56), (36, 62), (30, 56), (24, 62), (18, 56), (12, 62), (6, 58)], 'cape')
    # pernas
    c.poly([(17, 40), (24, 40), (23, 58), (25, 64), (14, 64), (17, 57)], 'armor'); c.poly([(28, 40), (35, 40), (35, 57), (38, 64), (27, 64), (29, 58)], 'armor')
    c.line([(20, 46), (20, 56)], 'vein'); c.line([(32, 46), (32, 56)], 'vein')
    # tronco
    c.poly([(15, 20), (37, 20), (35, 34), (33, 42), (19, 42), (17, 34)], 'armor')
    c.poly([(19, 42), (33, 42), (36, 50), (16, 50)], 'cape')
    c.line([(26, 22), (26, 40)], 'armorD'); c.line([(19, 30), (33, 30)], 'armorD')
    # marca de quatro espinhos no peito
    for dx, dy in ((0, -3), (0, 3), (-3, 0), (3, 0), (0, -2), (0, 2), (-2, 0), (2, 0), (0, 0)): c.px(26 + dx, 27 + dy, 'eye')
    # ombreiras com espinhos
    c.ell(13, 21, 6, 5, 'armor'); c.ell(39, 21, 6, 5, 'armor')
    for x0, y0, x1, y1 in ((9, 18, 4, 10), (13, 16, 11, 7), (43, 18, 48, 10), (39, 16, 41, 7)): c.line([(x0, y0), (x1, y1)], 'spike', w=2)
    # braços e garras
    c.poly([(9, 24), (15, 24), (13, 38), (8, 38)], 'armor'); c.poly([(37, 24), (43, 24), (44, 38), (39, 38)], 'armor')
    for i in range(3): c.line([(9 + i * 2, 38), (6 + i * 2, 46)], 'claw'); c.line([(39 + i * 2, 38), (42 + i * 2, 46)], 'claw')
    c.line([(10, 28), (11, 36)], 'vein'); c.line([(41, 28), (41, 36)], 'vein')
    # cabeça com elmo e crista de espinhos
    c.ell(26, 13, 7, 7, 'armor'); c.poly([(21, 14), (31, 14), (29, 20), (23, 20)], 'armor')
    for x, h in ((19, 4), (21, 1), (24, -1), (27, -2), (30, 0), (33, 3)): c.line([(x + 1, 9), (x, h)], 'hair', w=2)
    c.px(23, 13, 'eye'); c.px(24, 13, 'eye'); c.px(28, 13, 'eye'); c.px(29, 13, 'eye')
    c.line([(24, 17), (28, 17)], 'armorD')
    c.render(seed=4, tex=0.07).save(f'{OUT}/{name}.png')
armored({'armor': ['#0a0a10', '#1c1c26', '#34343f', '#50505c'], 'armorD': ['#000000'], 'cape': ['#120406', '#260a0e', '#3a1016'], 'vein': ['#e8e8f0'],
         'eye': ['#ffffff'], 'spike': ['#141418', '#2c2c34', '#46464e'], 'claw': ['#d0d0dc'], 'hair': ['#3a3a44', '#6a6a76', '#9a9aa6']}, 'e_kfuturo')
armored({'armor': ['#3a4258', '#7a86a4', '#b8c4dc', '#eef4ff'], 'armorD': ['#262c3c'], 'cape': ['#140a2a', '#2a1650', '#40227a'], 'vein': ['#80e8ff'],
         'eye': ['#ff3040'], 'spike': ['#6a7490', '#aab4cc', '#e0e8f8'], 'claw': ['#e0f4ff'], 'hair': ['#8a90a8', '#d0d6e8', '#ffffff']}, 'k_desperto')

# O Primeiro: o olho dourado no céu
c = Canvas(96, 72, {'lid': ['#1a1008', '#3a2810', '#5a4018'], 'white': ['#c8b890', '#f0e4c0', '#fff8e0'], 'iris': ['#a06010', '#ffb020', '#ffe080', '#ffffff'],
                    'pupil': ['#000000'], 'vein': ['#a02010'], 'glow': ['#ffd040']})
c.ell(48, 36, 46, 22, 'lid'); c.ell(48, 36, 40, 16, 'white'); c.ell(48, 36, 15, 15, 'iris'); c.ell(48, 36, 4, 12, 'pupil')
for a in range(0, 360, 30):
    t = math.radians(a); c.line([(48 + math.cos(t) * 16, 36 + math.sin(t) * 15), (48 + math.cos(t) * 22, 36 + math.sin(t) * 14)], 'vein')
c.ell(48, 36, 15, 15, 'iris', only=['vein'])
c.px(43, 30, 'glow'); c.px(44, 30, 'glow')
c.render(seed=5, tex=0.05).save(f'{OUT}/e_primeiro.png')
