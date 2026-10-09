# Personagens chibi (28x36) no estilo dos irmãos: cabeça grande, contorno escuro, luz do noroeste.
import sys
from painter import Canvas

W, H = 28, 36

def legs(c, dir, frame, mat, y=31, spread=3):
    o = (1 if frame else 0)
    if dir in ('down', 'up'):
        c.rect(14 - spread - 2, y - (o if frame else 0), 14 - spread + 1, y + 3 - (1 if frame else 0), mat)
        c.rect(14 + spread - 1, y, 14 + spread + 2, y + 3, mat)
    else:
        c.rect(11 - o, y, 14 - o, y + 3, mat); c.rect(15 + o, y, 18 + o, y + 3, mat)

# ---------------- LYRA ----------------
LYRA = {'hair': ['#8d93a8', '#cfd4e2', '#eef0f8'], 'hairD': ['#9ca2b8'], 'skin': ['#c99a86', '#efd0bd', '#fbe6d8'], 'blush': ['#f0a8a0'],
        'dress': ['#a99f8e', '#e8e0cf', '#fbf7ee'], 'dressD': ['#b8ae9a'],
        'gold': ['#8a6020', '#e0b048', '#fff0a0'], 'eye': ['#d09028'], 'eyeD': ['#3a2410'], 'white': ['#ffffff'], 'root': ['#2a1a1a'],
        'shoe': ['#4a3a34', '#6a5a50', '#7a6a60'], 'crys': ['#8af0ff'], 'mouth': ['#b06060']}
def lyra(dir, frame):
    c = Canvas(W, H, LYRA)
    oy = -1 if frame else 0
    # pés aparecendo sob o vestido, alternando no passo
    if dir in ('down', 'up'):
        c.rect(10, 31, 13, 34 - (1 if frame else 0), 'shoe'); c.rect(15, 31 - (0 if frame else 1), 18, 34, 'shoe')
    else:
        c.rect(10 - (1 if frame else 0), 31, 13 - (1 if frame else 0), 34, 'shoe'); c.rect(15 + (1 if frame else 0), 31, 18 + (1 if frame else 0), 34, 'shoe')
    if dir == 'left':
        c.poly([(10, 9 + oy), (21, 9 + oy), (24, 27 + oy), (17, 28 + oy)], 'hair')
        c.line([(19, 12 + oy), (22, 26 + oy)], 'hairD'); c.line([(17, 13 + oy), (19, 26 + oy)], 'hairD')
        c.poly([(10, 18 + oy), (17, 18 + oy), (20, 32), (8, 32)], 'dress')
        c.line([(13, 24), (12, 31)], 'dressD')
        c.line([(9, 31), (11, 29), (12, 32)], 'root'); c.line([(18, 30), (19, 32)], 'root')
        c.rect(11, 22 + oy, 17, 23 + oy, 'gold')
        c.ell(12.5, 24 + oy, 1.6, 2.2, 'skin')
        c.ell(14, 11 + oy, 8, 8, 'hair')
        c.ell(11.5, 12.5 + oy, 5.5, 6, 'skin')
        c.poly([(6, 7 + oy), (17, 4 + oy), (20, 10 + oy), (9, 10 + oy)], 'hair')
        c.rect(6, 9 + oy, 8, 11 + oy, 'hair')
        c.line([(12, 6 + oy), (18, 9 + oy)], 'hairD')
        c.px(8, 13 + oy, 'eyeD'); c.px(9, 13 + oy, 'eyeD'); c.px(8, 14 + oy, 'eye'); c.px(9, 14 + oy, 'white'); c.px(8, 15 + oy, 'eye')
        c.px(10, 16 + oy, 'blush'); c.px(7, 17 + oy, 'mouth')
        c.px(13, 20 + oy, 'crys')
    elif dir == 'up':
        c.poly([(9, 18 + oy), (19, 18 + oy), (22, 32), (6, 32)], 'dress')
        c.line([(14, 22), (14, 31)], 'dressD')
        c.line([(7, 31), (9, 29), (10, 32)], 'root'); c.line([(19, 29), (20, 32)], 'root')
        c.ell(6.5, 24 + oy, 1.6, 2.2, 'skin'); c.ell(21.5, 24 + oy, 1.6, 2.2, 'skin')
        c.ell(14, 11 + oy, 9, 8.5, 'hair')
        c.poly([(6, 12 + oy), (22, 12 + oy), (21, 28 + oy), (14, 30 + oy), (7, 28 + oy)], 'hair')
        for x0, x1 in ((10, 9), (14, 14), (18, 19), (12, 11), (16, 17)): c.line([(x0, 6 + oy), (x1, 27 + oy)], 'hairD')
        c.rect(12, 9 + oy, 16, 10 + oy, 'gold')  # tiara/fita
    else:  # down
        c.poly([(5, 10 + oy), (23, 10 + oy), (24, 28 + oy), (4, 28 + oy)], 'hair')
        c.line([(5, 14 + oy), (5, 27 + oy)], 'hairD'); c.line([(23, 14 + oy), (23, 27 + oy)], 'hairD')
        c.poly([(9, 18 + oy), (19, 18 + oy), (22, 32), (6, 32)], 'dress')
        c.line([(11, 24), (10, 31)], 'dressD'); c.line([(17, 24), (18, 31)], 'dressD')
        c.line([(7, 31), (9, 29), (10, 32)], 'root'); c.line([(20, 29), (19, 32)], 'root'); c.line([(13, 31), (14, 29)], 'root')
        c.rect(9, 22 + oy, 19, 23 + oy, 'gold')
        c.ell(7, 24 + oy, 1.6, 2.2, 'skin'); c.ell(21, 24 + oy, 1.6, 2.2, 'skin')
        c.ell(14, 11 + oy, 9, 8.5, 'hair')
        c.ell(14, 13 + oy, 6.5, 6.2, 'skin')
        c.poly([(5, 9 + oy), (23, 9 + oy), (21, 11.5 + oy), (18.5, 9.5 + oy), (16, 11.5 + oy), (14, 10 + oy), (12, 11.5 + oy), (9.5, 9.5 + oy), (7, 11.5 + oy)], 'hair')
        c.rect(5, 9 + oy, 8, 22 + oy, 'hair'); c.rect(20, 9 + oy, 23, 22 + oy, 'hair')
        c.line([(9, 4 + oy), (11, 10 + oy)], 'hairD'); c.line([(18, 4 + oy), (16, 10 + oy)], 'hairD')
        for x in (10, 16):
            c.px(x, 13 + oy, 'eyeD'); c.px(x + 1, 13 + oy, 'eyeD'); c.px(x + 2, 13 + oy, 'eyeD')
            c.px(x, 14 + oy, 'eye'); c.px(x + 1, 14 + oy, 'white'); c.px(x + 2, 14 + oy, 'eye')
            c.px(x, 15 + oy, 'eye'); c.px(x + 1, 15 + oy, 'eye'); c.px(x + 2, 15 + oy, 'eyeD')
        c.px(9, 16 + oy, 'blush'); c.px(19, 16 + oy, 'blush')
        c.px(14, 17 + oy, 'mouth')
        c.px(14, 20 + oy, 'crys'); c.px(14, 19 + oy, 'gold')
        c.rect(12, 6 + oy, 16, 7 + oy, 'gold')
    return c

# ---------------- personagem genérico de túnica ----------------
def robed(dir, frame, M, hood=False, hair_long=True, small=0, eyes='eye', extra=None, bare_face=True):
    c = Canvas(W, H, M)
    oy = (-1 if frame else 0) + small
    sh = 'shoe' if 'shoe' in M else 'robeD'
    if dir in ('down', 'up'):
        c.rect(10, 31, 13, 34 - (1 if frame else 0), sh); c.rect(15, 31 - (0 if frame else 1), 18, 34, sh)
    else:
        c.rect(10 - frame, 31, 13 - frame, 34, sh); c.rect(15 + frame, 31, 18 + frame, 34, sh)
    top = 18 + small
    if dir == 'left':
        if hair_long and not hood: c.poly([(10, 9 + oy), (20, 9 + oy), (22, 24 + oy), (16, 25 + oy)], 'hair')
        c.poly([(10, top + oy), (17, top + oy), (20, 32), (7, 32)], 'robe')
        c.line([(13, 24), (12, 31)], 'robeD')
        c.ell(11.5, 24 + oy, 1.7, 2.2, 'skin' if 'skin' in M else 'robe')
        if hood:
            c.ell(14, 12 + oy, 8.5, 8.5, 'robe'); c.poly([(15, 6 + oy), (23, 14 + oy), (20, 20 + oy)], 'robe')
            c.ell(10.5, 13.5 + oy, 4.5, 5, 'shadow')
            c.px(8, 13 + oy, eyes)
        else:
            c.ell(14, 11 + oy, 8, 8, 'hair'); c.ell(11.5, 12.5 + oy, 5.5, 6, 'skin')
            c.poly([(6, 7 + oy), (17, 4 + oy), (20, 10 + oy), (9, 10 + oy)], 'hair'); c.rect(6, 9 + oy, 8, 11 + oy, 'hair')
            c.px(8, 13 + oy, 'eyeD'); c.px(8, 14 + oy, eyes); c.px(7, 17 + oy, 'mouth')
    elif dir == 'up':
        c.poly([(9, top + oy), (19, top + oy), (22, 32), (6, 32)], 'robe')
        c.line([(14, 22), (14, 31)], 'robeD')
        c.ell(6.5, 24 + oy, 1.7, 2.2, 'skin' if 'skin' in M else 'robe'); c.ell(21.5, 24 + oy, 1.7, 2.2, 'skin' if 'skin' in M else 'robe')
        if hood:
            c.ell(14, 12 + oy, 9, 8.5, 'robe'); c.poly([(8, 14 + oy), (20, 14 + oy), (17, 22 + oy), (11, 22 + oy)], 'robe')
            c.line([(14, 6 + oy), (14, 21 + oy)], 'robeD')
        else:
            c.ell(14, 11 + oy, 9, 8.5, 'hair')
            if hair_long: c.poly([(6, 12 + oy), (22, 12 + oy), (21, 26 + oy), (7, 26 + oy)], 'hair')
            for x0, x1 in ((10, 9), (14, 14), (18, 19)): c.line([(x0, 6 + oy), (x1, 24 + oy)], 'hairD')
    else:
        if hair_long and not hood: c.poly([(5, 10 + oy), (23, 10 + oy), (24, 26 + oy), (4, 26 + oy)], 'hair')
        c.poly([(9, top + oy), (19, top + oy), (22, 32), (6, 32)], 'robe')
        c.line([(11, 24), (10, 31)], 'robeD'); c.line([(17, 24), (18, 31)], 'robeD')
        c.ell(7, 24 + oy, 1.7, 2.2, 'skin' if 'skin' in M else 'robe'); c.ell(21, 24 + oy, 1.7, 2.2, 'skin' if 'skin' in M else 'robe')
        if hood:
            c.ell(14, 12 + oy, 9.5, 9, 'robe'); c.poly([(5, 14 + oy), (23, 14 + oy), (20, 21 + oy), (8, 21 + oy)], 'robe')
            c.ell(14, 14 + oy, 6, 5.5, 'shadow')
            c.px(11, 14 + oy, eyes); c.px(17, 14 + oy, eyes)
            c.line([(14, 5 + oy), (14, 8 + oy)], 'robeD')
        else:
            c.ell(14, 11 + oy, 9, 8.5, 'hair'); c.ell(14, 13 + oy, 6.5, 6.2, 'skin')
            c.poly([(5, 9 + oy), (23, 9 + oy), (21, 11.5 + oy), (18.5, 9.5 + oy), (16, 11.5 + oy), (14, 10 + oy), (12, 11.5 + oy), (9.5, 9.5 + oy), (7, 11.5 + oy)], 'hair')
            if hair_long: c.rect(5, 9 + oy, 8, 22 + oy, 'hair'); c.rect(20, 9 + oy, 23, 22 + oy, 'hair')
            for x in (10, 16):
                c.px(x, 14 + oy, 'eyeD'); c.px(x + 1, 14 + oy, 'eyeD'); c.px(x, 15 + oy, eyes); c.px(x + 1, 15 + oy, 'eyeD')
            c.px(14, 17 + oy, 'mouth')
    if extra: extra(c, dir, frame, oy)
    return c

ANCIA = {'hair': ['#9a9aa6', '#dcdce4', '#f6f6fa'], 'hairD': ['#a8a8b4'], 'skin': ['#9a8a84', '#c8b8b0', '#e0d4cc'], 'robe': ['#2e2a34', '#4a4452', '#625a6c'],
         'robeD': ['#2a2630'], 'eye': ['#5a6a7a'], 'eyeD': ['#1a1418'], 'mouth': ['#6a4a4a'], 'root': ['#140c0c', '#24160f'], 'shoe': ['#1a1214', '#2a2024']}
def ancia_extra(c, d, f, oy):
    # raízes atravessando os braços e saindo para o chão
    if d == 'down':
        c.line([(4, 20 + oy), (7, 24 + oy), (5, 30), (3, 34)], 'root'); c.line([(24, 20 + oy), (21, 24 + oy), (23, 30), (25, 34)], 'root')
        c.line([(9, 26), (12, 34)], 'root'); c.line([(19, 26), (16, 34)], 'root')
    elif d == 'up':
        c.line([(4, 20 + oy), (7, 24 + oy), (5, 34)], 'root'); c.line([(24, 20 + oy), (21, 24 + oy), (23, 34)], 'root')
    else:
        c.line([(15, 20 + oy), (12, 24 + oy), (10, 30), (8, 34)], 'root'); c.line([(17, 27), (21, 34)], 'root')
def ancia(d, f): return robed(d, f, ANCIA, hood=False, hair_long=True, extra=ancia_extra)

MASCATE = {'robe': ['#3a2618', '#5a3e28', '#7a5a3a'], 'robeD': ['#3e2a1c'], 'shadow': ['#0a0608'], 'eye': ['#ffcf6a'], 'skin': ['#6a5040', '#8a7060', '#a08878'],
           'lantern': ['#8a5a10', '#ffcf6a', '#fff4c0'], 'frame': ['#2a2018'], 'pack': ['#4a3020', '#6a4a30', '#8a6a48'], 'strap': ['#2a1a10'], 'shoe': ['#1a1210', '#2a201a']}
def mascate_extra(c, d, f, oy):
    if d == 'down':
        c.rect(21, 22 + oy, 25, 27 + oy, 'lantern'); c.rect(21, 21 + oy, 25, 22 + oy, 'frame'); c.rect(22, 19 + oy, 24, 21 + oy, 'frame')
        c.line([(9, 18 + oy), (13, 26 + oy)], 'strap')
    elif d == 'up':
        c.ell(14, 23 + oy, 6, 6, 'pack'); c.rect(10, 20 + oy, 18, 21 + oy, 'strap'); c.rect(12, 25 + oy, 16, 26 + oy, 'strap')
    else:
        c.ell(19, 22 + oy, 4, 5.5, 'pack'); c.rect(18, 19 + oy, 19, 26 + oy, 'strap')
        c.rect(6, 22 + oy, 10, 27 + oy, 'lantern'); c.rect(6, 21 + oy, 10, 22 + oy, 'frame'); c.rect(7, 19 + oy, 9, 21 + oy, 'frame')
def mascate(d, f): return robed(d, f, MASCATE, hood=True, extra=mascate_extra)

ESPIRITO = {'robe': ['#4a7aa8', '#7ab0d8', '#bfe4ff'], 'robeD': ['#6a9ac8'], 'shadow': ['#10243a'], 'eye': ['#ffffff'], 'shoe': ['#7ab0d8']}
def espirito(d, f):
    c = robed(d, f, ESPIRITO, hood=True)
    for y in range(31, 36):   # sem pés: a túnica se desfaz em fiapos
        for x in range(W):
            if c.get(x, y) is not None: c.m[y][x] = None
    for x in (8, 11, 14, 17, 20): c.line([(x, 30), (x + (1 if f else -1), 33)], 'robe')
    return c

LIRA = {'hair': ['#06040a', '#121018', '#2a2434'], 'hairD': ['#000000'], 'skin': ['#9a8e9e', '#c8c0c8', '#e0dae0'], 'robe': ['#141420', '#2a2a36', '#3e3e4c'], 'robeD': ['#1a1a24'],
        'eye': ['#6af0e0'], 'eyeD': ['#000000'], 'mouth': ['#5a4a5a'], 'mark': ['#6af0e0'], 'shoe': ['#0a0a10', '#1a1a20']}
LIRA2 = {'hair': ['#c0a040', '#ffe080', '#fff4c0'], 'hairD': ['#d0b050'], 'skin': ['#e0c080', '#ffe8a0', '#fff8d8'], 'robe': ['#c0a040', '#f0d070', '#fff0b0'], 'robeD': ['#d8b858'],
         'eye': ['#ffffff'], 'eyeD': ['#8a6010'], 'mouth': ['#c08040'], 'mark': ['#ffffff'], 'shoe': ['#c0a040', '#f0d070']}
def lira_extra(c, d, f, oy):
    if d == 'down': c.px(11, 24 + oy, 'mark'); c.px(16, 26 + oy, 'mark'); c.px(13, 29, 'mark')
    elif d == 'left': c.px(12, 25 + oy, 'mark'); c.px(15, 28, 'mark')
def lira(d, f): return robed(d, f, LIRA, hair_long=True, small=2, extra=lira_extra)
def lira2(d, f): return robed(d, f, LIRA2, hair_long=True, small=2, extra=lira_extra)

def save(fn, name, out, mirror_right=True):
    for d in ('down', 'up', 'left'):
        for f in (0, 1):
            c = fn(d, f)
            c.render(seed=f + 3, tex=0.03).save(f'{out}/s_{name}_{d}_{f}.png')
            if d == 'left' and mirror_right:
                c.mirror(); c.render(seed=f + 3, tex=0.03).save(f'{out}/s_{name}_right_{f}.png')

if __name__ == '__main__':
    out = sys.argv[1]
    for n, fn in (('lyra', lyra), ('ancia', ancia), ('mascate', mascate), ('espirito', espirito), ('lira', lira), ('lira2', lira2)): save(fn, n, out)
