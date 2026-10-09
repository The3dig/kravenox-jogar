# Inimigos e figurantes da Parte 2 (caps. 14–25).
import sys, math, random
from painter import Canvas, hexc
from enemies import ghost, root, crystalman, shards, recolor, ramp, hx
from chars import robed, save as csave
OUT = sys.argv[1]
R = lambda c, n: c.render(seed=3, tex=0.06).save(f'{OUT}/e_{n}.png')
base = '/home/user/kravenox-jogar/rpg/img/'

# fantasmas e raízes recoloridos
R(ghost(58, 62, '#6a6460', '#ff8a3a', seed=11), 'cinzento')
R(ghost(56, 62, '#141018', '#c18bff', seed=12), 'sombraRua')
R(ghost(60, 66, '#0a0a0e', '#ffffff', seed=13), 'respiracao')
R(ghost(60, 66, '#1a2a40', '#ffffff', crystal=True, seed=14), 'olhoBranco')
R(ghost(60, 66, '#c8a040', '#fff6c0', crystal=True, seed=15), 'simbolo')
R(root(70, 70, '#1a0808', '#3a1010', '#ff3020', thick=5, eyes=2, seed=21), 'raizGuerra')
R(root(72, 74, '#c8c0b0', '#8a8478', '#ffffff', thick=5, eyes=1, seed=22), 'raizAntiga')
R(root(70, 70, '#3a3a40', '#24242a', '#a0a0b0', thick=4, eyes=2, seed=23), 'raizMorta')

def shardsC(w, h, mats, seed):
    c = shards(w, h, seed); c.mats.update({k: [tuple(hexc(x)) for x in v] for k, v in mats.items()}); return c
R(shardsC(64, 64, {'crys': ['#0a0612', '#241238', '#5a2a8a', '#c8a0ff'], 'core': ['#000000', '#b26bff']}, 31), 'cristalVazio')
R(shardsC(64, 64, {'crys': ['#3a2a08', '#6a5420', '#a08a40', '#f0e0a0'], 'core': ['#806020', '#fff0b0']}, 32), 'luzApagada')

gm = crystalman(64, 80); gm.mats.update({'armor': [hexc(x) for x in ['#3a2a10', '#6a5020', '#9a7a34', '#c8a850']], 'crys': [hexc(x) for x in ['#6a4a10', '#c8a040', '#ffe8a0', '#ffffff']], 'eye': [hexc('#fff0c0')]})
R(gm, 'guardaAntigo')

# sentinelas recoloridos
def rc(src, dst, eye, f):
    def g(r, gg, b):
        if b > r + 30 and b > 120: return eye
        L = (r + gg + b) / 3; return f(L)
    recolor(base + src, f'{OUT}/e_{dst}.png', g)
rc('e_sentinela.png', 'sentinelaG', (255, 60, 40), lambda L: (int(L * 0.95 + 6), int(L * 0.9), int(L * 0.9)))
rc('e_sentinela.png', 'sentinelaV', (255, 150, 60), lambda L: (int(L * 1.1 + 10), int(L * 0.95 + 4), int(L * 0.8)))
rc('e_sentinela1.png', 'guardiaoAzul', (120, 200, 255), lambda L: (int(L * 0.6), int(L * 0.8 + 6), int(L * 1.25 + 16)))
rc('e_sentinela1.png', 'escolhido', (255, 250, 220), lambda L: (int(L * 1.3 + 30), int(L * 1.25 + 26), int(L * 1.1 + 20)))

# Casca de Ossos: armadura de ossos negros, oca, com um buraco no peito
def ossos(w=66, h=86):
    M = {'bone': ['#0a080c', '#1e1a22', '#3a343e', '#5a5260'], 'hole': ['#000000'], 'eye': ['#ffffff'], 'mist': ['#141018', '#2a2430']}
    c = Canvas(w, h, M); cx = w / 2
    c.rect(cx - 9, h * 0.62, cx - 4, h * 0.97, 'bone'); c.rect(cx + 4, h * 0.62, cx + 9, h * 0.97, 'bone')
    for k in range(5): c.line([(cx - 14, h * (0.3 + k * 0.07)), (cx + 14, h * (0.3 + k * 0.07))], 'bone', 2)   # costelas
    c.line([(cx, h * 0.26), (cx, h * 0.64)], 'bone', 3)
    c.ell(cx, h * 0.45, 6, 7, 'hole')
    c.poly([(cx - 14, h * 0.3), (cx - 24, h * 0.6), (cx - 20, h * 0.62), (cx - 11, h * 0.36)], 'bone')
    c.poly([(cx + 14, h * 0.3), (cx + 22, h * 0.62), (cx + 18, h * 0.64), (cx + 11, h * 0.36)], 'bone')
    for f in range(3): c.line([(cx - 23 + f * 2, h * 0.6), (cx - 27 + f * 2, h * 0.7)], 'bone')
    c.ell(cx, h * 0.17, 9, 10, 'bone'); c.ell(cx, h * 0.18, 6, 6, 'hole')
    c.px(cx - 3, h * 0.17, 'eye'); c.px(cx + 3, h * 0.17, 'eye')
    for (x, y) in ((cx - 8, h * 0.08), (cx + 8, h * 0.08), (cx, h * 0.03)): c.poly([(x - 2, y + 4), (x, y - 5), (x + 2, y + 4)], 'bone')
    return c
R(ossos(), 'ossoNegro')

# Servo do Primeiro: corpo alongado, asas de cristal, olhos vazios
def servo(w=96, h=70, seed=41):
    rnd = random.Random(seed)
    M = {'body': ['#141824', '#283044', '#46506a', '#6a7894'], 'wing': ['#2a4a6a', '#5a90c0', '#a8d8ff', '#ffffff'], 'hole': ['#000000'], 'eye': ['#d8e8ff']}
    c = Canvas(w, h, M)
    pts = []
    for i in range(14):
        t = i / 13; pts.append((w * (0.15 + t * 0.75), h * (0.45 + math.sin(t * 5) * 0.12)))
    for i, (p0, p1) in enumerate(zip(pts, pts[1:])): c.line([p0, p1], 'body', max(2, 9 - i // 2))
    hx0, hy0 = pts[0]; c.ell(hx0, hy0, 8, 6, 'body'); c.ell(hx0 - 3, hy0, 3, 2.5, 'hole'); c.px(hx0 - 3, hy0, 'eye')
    c.poly([(hx0 - 9, hy0 + 2), (hx0 - 16, hy0 + 4), (hx0 - 8, hy0 + 5)], 'body')
    for side in (-1, 1):
        x0, y0 = pts[4]
        c.poly([(x0, y0), (x0 + 12, y0 + side * 34), (x0 + 30, y0 + side * 28), (x0 + 24, y0 + side * 6)], 'wing')
        for k in range(3): c.line([(x0 + 4, y0), (x0 + 10 + k * 8, y0 + side * (30 - k * 3))], 'body')
    return c
R(servo(), 'servo')

# Coração do Primeiro: cristal, raízes e matéria escura
def coracao(w=120, h=120, seed=51):
    rnd = random.Random(seed)
    M = {'dark': ['#050308', '#120a18', '#22122a', '#36203e'], 'crys': ['#5a3a10', '#c08a30', '#ffd88a', '#ffffff'], 'root': ['#0a0606', '#1e1210', '#342018'], 'vein': ['#ff3040'], 'silver': ['#c8d8f0']}
    c = Canvas(w, h, M); cx, cy = w / 2, h * 0.52
    for k in range(10):
        a = rnd.random() * math.tau; x, y = cx, cy; pts = [(x, y)]
        for s in range(10): a += (rnd.random() - 0.5) * 0.6; x += math.cos(a) * 6; y += math.sin(a) * 6; pts.append((x, y))
        c.line(pts, 'root', 3)
    c.ell(cx - 12, cy - 8, 26, 26, 'dark'); c.ell(cx + 12, cy - 8, 26, 26, 'dark'); c.poly([(cx - 36, cy), (cx + 36, cy), (cx, cy + 42)], 'dark')
    for (x, y, hh) in ((cx - 18, cy - 20, 14), (cx + 8, cy - 26, 18), (cx + 22, cy - 6, 12), (cx - 4, cy + 10, 10), (cx - 26, cy + 2, 9)):
        c.poly([(x - 4, y + 4), (x, y - hh), (x + 4, y + 4)], 'crys')
    for k in range(6):
        x, y = cx + (rnd.random() - 0.5) * 50, cy - 20 + rnd.random() * 40; pts = [(x, y)]
        for s in range(5): x += rnd.random() * 4 - 2; y += 3; pts.append((x, y))
        c.line(pts, 'vein')
    c.line([(cx, cy), (cx - 50, cy + 30)], 'silver')
    return c
R(coracao(), 'coracao')

# Seraphyne (chefe): armadura negra, cabelos prateados, marca vermelha na testa, Vazio na mão
def seraph(w=56, h=86):
    M = {'armor': ['#06050a', '#16141e', '#2a2836', '#46425a'], 'hair': ['#8a90a8', '#d0d6e8', '#f6f8ff'], 'skin': ['#b4a0a8', '#e2d2d6', '#f6eaec'], 'eye': ['#9a60ff'],
         'mark': ['#ff3040'], 'void': ['#000000', '#24104a', '#6a3ac0', '#c8a8ff'], 'cape': ['#08060c', '#14101c', '#221a2e']}
    c = Canvas(w, h, M); cx = w / 2
    c.poly([(cx - 10, h * 0.22), (cx + 14, h * 0.22), (cx + 20, h * 0.95), (cx - 18, h * 0.95)], 'cape')
    c.poly([(cx - 9, h * 0.08), (cx + 11, h * 0.08), (cx + 13, h * 0.55), (cx - 11, h * 0.55)], 'hair')
    c.rect(cx - 6, h * 0.6, cx - 1, h * 0.97, 'armor'); c.rect(cx + 2, h * 0.6, cx + 7, h * 0.97, 'armor')
    c.poly([(cx - 9, h * 0.26), (cx + 10, h * 0.26), (cx + 8, h * 0.62), (cx - 8, h * 0.62)], 'armor')
    c.ell(cx - 12, h * 0.28, 5, 4, 'armor'); c.ell(cx + 12, h * 0.28, 5, 4, 'armor')
    c.poly([(cx - 12, h * 0.3), (cx - 22, h * 0.45), (cx - 19, h * 0.48), (cx - 9, h * 0.36)], 'armor')
    c.ell(cx - 23, h * 0.47, 6, 6, 'void')
    c.poly([(cx + 11, h * 0.3), (cx + 13, h * 0.56), (cx + 9, h * 0.56), (cx + 8, h * 0.34)], 'armor')
    c.ell(cx, h * 0.15, 7, 8, 'skin')
    c.poly([(cx - 8, h * 0.07), (cx + 9, h * 0.07), (cx + 8, h * 0.13), (cx - 7, h * 0.13)], 'hair')
    c.px(cx - 3, h * 0.16, 'eye'); c.px(cx + 3, h * 0.16, 'eye'); c.px(cx, h * 0.12, 'mark')
    for (dx, dy) in ((0, 0), (0, -1), (0, 1), (-1, 0), (1, 0)): c.px(cx + dx, h * 0.4 + dy, 'mark')
    return c
R(seraph(), 'seraphyne')

# O Primeiro: rosto gigantesco de pedra e sombra, olhos dourados
def primeiro(w=150, h=112, seed=61):
    rnd = random.Random(seed)
    M = {'stone': ['#0a080c', '#1a161e', '#2e2834', '#46404e'], 'eye': ['#a06010', '#ffb020', '#ffe080', '#ffffff'], 'pupil': ['#000000'], 'crack': ['#ffd040'], 'cloud': ['#14101a', '#241e2c', '#3a3242']}
    c = Canvas(w, h, M); cx = w / 2
    for k in range(16): c.ell(rnd.random() * w, h * (0.7 + rnd.random() * 0.3), 10 + rnd.random() * 16, 6 + rnd.random() * 8, 'cloud')
    c.ell(cx, h * 0.48, w * 0.36, h * 0.44, 'stone')
    for k in range(7): x = cx - 30 + k * 10; c.poly([(x - 4, h * 0.14), (x, h * (0.0 if k % 2 else 0.05)), (x + 4, h * 0.14)], 'stone')
    for sx in (-1, 1):
        ex = cx + sx * 22; c.ell(ex, h * 0.42, 15, 9, 'eye'); c.ell(ex, h * 0.42, 3, 8, 'pupil'); c.line([(ex - 16, h * 0.33), (ex + 14, h * 0.36)], 'stone', 3)
    c.line([(cx, h * 0.08), (cx - 2, h * 0.3), (cx + 2, h * 0.5), (cx, h * 0.7)], 'crack')
    c.poly([(cx - 22, h * 0.64), (cx - 10, h * 0.62), (cx, h * 0.66), (cx + 10, h * 0.62), (cx + 22, h * 0.64), (cx + 12, h * 0.8), (cx, h * 0.76), (cx - 12, h * 0.8)], 'pupil')
    for k in range(10):
        x, y = cx + (rnd.random() - 0.5) * w * 0.5, h * (0.15 + rnd.random() * 0.6); pts = [(x, y)]
        for s in range(4): x += rnd.random() * 4 - 2; y += 3; pts.append((x, y))
        c.line(pts, 'crack')
    return c
R(primeiro(), 'primeiro')

# figurantes: refugiados e crianças de Valdora
HOMEM = {'hair': ['#2a1e16', '#3e2c20', '#56402e'], 'hairD': ['#1e140e'], 'skin': ['#9a7a64', '#c8a48a', '#e0c4ac'], 'robe': ['#3a3428', '#56503e', '#706850'],
         'robeD': ['#2a2620'], 'eye': ['#2a1a10'], 'eyeD': ['#1a1008'], 'mouth': ['#6a4a3a'], 'shoe': ['#1a1410', '#2a2018'], 'blade': ['#8a8a94', '#c8c8d0', '#ffffff']}
def homem_x(c, d, f, oy):
    if d == 'down': c.line([(22, 20), (24, 30)], 'blade')
    elif d == 'left': c.line([(5, 21), (2, 29)], 'blade')
def homem(d, f): return robed(d, f, HOMEM, hair_long=False, extra=homem_x)
csave(homem, 'refugiado', OUT)
MULHER = dict(HOMEM, hair=['#3a1e14', '#5a3020', '#7a4a30'], robe=['#4a2a2a', '#6a3a3a', '#8a5050'], robeD=['#3a2020'])
csave(lambda d, f: robed(d, f, MULHER, hair_long=True), 'refugiada', OUT)
MENINO = dict(HOMEM, hair=['#5a4020', '#7a5a30', '#9a7a48'], robe=['#2a3440', '#3a4a5a', '#506478'], robeD=['#1e2630'])
def menino_x(c, d, f, oy):
    if d == 'down': c.line([(21, 22), (23, 28)], 'blade')
csave(lambda d, f: robed(d, f, dict(MENINO, blade=['#5a3a20', '#8a6038', '#b08a58']), hair_long=False, small=4, extra=menino_x), 'menino', OUT)
