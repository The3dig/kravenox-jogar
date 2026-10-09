# Retratos 48x48 (fundo transparente; o jogo pinta o fundo e o brilho, como nos irmãos).
import sys
from painter import Canvas
S = 48

def eyes(c, y, mat='eye', big=True, gap=7, x0=24):
    for sgn in (-1, 1):
        cx = x0 + sgn * gap
        if big:
            c.rect(cx - 2, y, cx + 2, y + 1, 'eyeD')
            c.rect(cx - 2, y + 1, cx + 2, y + 5, mat)
            c.rect(cx - 2, y + 4, cx + 2, y + 5, 'eyeD')
            c.px(cx - 1, y + 1, 'white'); c.px(cx - 1, y + 2, 'white')
        else:
            c.rect(cx - 2, y, cx + 2, y + 2, mat)

def person(M, hair=True, long=False, hood=False, fringe=True, mouth=True, blush=False, eyes_mat='eye', eye_y=24, small_eyes=False, body='robe'):
    c = Canvas(S, S, M)
    # ombros/corpo
    c.poly([(4, 48), (9, 38), (18, 35), (30, 35), (39, 38), (44, 48)], body)
    if hood:
        c.ell(24, 22, 19, 20, 'robe'); c.poly([(6, 30), (42, 30), (40, 44), (8, 44)], 'robe')
        c.ell(24, 25, 12, 12, 'shadow')
        c.line([(24, 3), (24, 8)], 'robeD')
        if eyes_mat: c.rect(17, 24, 21, 26, eyes_mat); c.rect(27, 24, 31, 26, eyes_mat)
        return c
    if hair and long: c.poly([(8, 16), (40, 16), (43, 46), (5, 46)], 'hair')
    c.rect(20, 32, 28, 37, 'skinD' if 'skinD' in M else 'skin')
    c.ell(24, 23, 13, 13, 'skin')
    if hair:
        c.ell(24, 16, 15, 11, 'hair', only=[None, 'hair'])
        c.ell(24, 14, 15, 10, 'hair')
        if fringe:
            c.poly([(9, 15), (39, 15), (37, 21), (33, 17), (29, 21), (25, 17), (21, 21), (17, 17), (13, 21), (10, 19)], 'hair')
        c.rect(9, 15, 13, 30 if long else 24, 'hair'); c.rect(35, 15, 39, 30 if long else 24, 'hair')
        c.line([(16, 6), (19, 15)], 'hairD'); c.line([(30, 6), (28, 15)], 'hairD'); c.line([(24, 4), (24, 13)], 'hairD')
    if eyes_mat: eyes(c, eye_y, eyes_mat, big=not small_eyes)
    if blush: c.rect(14, 30, 17, 31, 'blush'); c.rect(31, 30, 34, 31, 'blush')
    if mouth: c.rect(22, 31, 26, 32, 'mouth')
    return c

def render(c, name, out): c.render(seed=7, tex=0.03).save(f'{out}/p_{name}.png')

def main(out):
    W_ = ['#ffffff']
    L = {'hair': ['#8d93a8', '#cfd4e2', '#eef0f8'], 'hairD': ['#9ca2b8'], 'skin': ['#c99a86', '#efd0bd', '#fbe6d8'], 'skinD': ['#c99a86'], 'blush': ['#f0a8a0'],
         'robe': ['#a99f8e', '#e8e0cf', '#fbf7ee'], 'eye': ['#d09028'], 'eyeD': ['#3a2410'], 'white': W_, 'mouth': ['#b06060'], 'gold': ['#8a6020', '#e0b048', '#fff0a0'], 'root': ['#1a1214'], 'crys': ['#8af0ff']}
    c = person(L, long=True, blush=True)
    c.rect(20, 9, 28, 10, 'gold'); c.poly([(24, 39), (27, 43), (24, 47), (21, 43)], 'crys')
    c.line([(6, 48), (10, 42), (14, 41), (17, 37)], 'root'); c.line([(42, 48), (38, 42), (34, 41), (31, 37)], 'root')
    render(c, 'lyra', out)

    LI = {'hair': ['#06040a', '#121018', '#2a2434'], 'hairD': ['#000000'], 'skin': ['#9a8e9e', '#c8c0c8', '#e0dae0'], 'skinD': ['#9a8e9e'], 'robe': ['#141420', '#2a2a36', '#3e3e4c'],
          'eye': ['#000000'], 'eyeD': ['#000000'], 'white': ['#6af0e0'], 'mouth': ['#5a4a5a'], 'mark': ['#6af0e0']}
    c = person(LI, long=True)
    for x, y in ((14, 40), (33, 42), (19, 45), (29, 38), (16, 28), (33, 27)): c.px(x, y, 'mark')
    render(c, 'lira', out)
    LI2 = {'hair': ['#c0a040', '#ffe080', '#fff4c0'], 'hairD': ['#d0b050'], 'skin': ['#e0c080', '#ffe8a0', '#fff8d8'], 'skinD': ['#e0c080'], 'robe': ['#c0a040', '#f0d070', '#fff0b0'],
           'eye': ['#ffffff'], 'eyeD': ['#8a6010'], 'white': ['#fffbe0'], 'mouth': ['#c08040'], 'blush': ['#ffc080']}
    render(person(LI2, long=True, blush=True), 'lira2', out)

    AN = {'hair': ['#9a9aa6', '#dcdce4', '#f6f6fa'], 'hairD': ['#a8a8b4'], 'skin': ['#9a8a84', '#c8b8b0', '#e0d4cc'], 'skinD': ['#9a8a84'], 'robe': ['#2e2a34', '#4a4452', '#625a6c'],
          'eye': ['#5a6a7a'], 'eyeD': ['#1a1418'], 'white': ['#c0c8d0'], 'mouth': ['#6a4a4a'], 'root': ['#140c0c'], 'wr': ['#8a7a74']}
    c = person(AN, long=True, fringe=False)
    c.line([(15, 20), (19, 21)], 'wr'); c.line([(29, 21), (33, 20)], 'wr'); c.line([(18, 34), (21, 33)], 'wr'); c.line([(27, 33), (30, 34)], 'wr')
    for pts in ([(4, 48), (9, 40), (14, 38), (18, 33)], [(44, 48), (39, 40), (34, 38), (30, 33)], [(12, 48), (16, 42), (20, 41)], [(36, 48), (33, 43)]): c.line(pts, 'root', 2)
    render(c, 'ancia', out)

    GU = {'robe': ['#a8a49c', '#d8d4cc', '#f4f0e8'], 'skin': ['#c8c4bc', '#f2eee6', '#ffffff'], 'skinD': ['#c8c4bc'], 'hair': ['#b8b4ac', '#e0dcd4', '#f8f4ec'], 'hairD': ['#c8c4bc'],
          'eye': ['#101010'], 'eyeD': ['#101010'], 'white': ['#101010'], 'mouth': ['#a8a49c'], 'gold': ['#8a6020', '#c9a24a', '#f0d080'], 'crack': ['#6a6460'], 'lance': ['#8a8478', '#c8c0b0', '#f0f0ff']}
    c = person(GU, fringe=False, small_eyes=True, mouth=False)
    c.rect(23, 9, 25, 36, 'gold'); c.rect(15, 20, 33, 21, 'gold'); c.line([(31, 12), (28, 20), (32, 27)], 'crack')
    c.rect(42, 0, 44, 48, 'lance'); c.poly([(43, 0), (47, 7), (39, 7)], 'lance')
    render(c, 'guardiao', out)
    G2 = dict(GU); G2.update({'skin': ['#8a7a6a', '#b8a898', '#d0c4b4'], 'skinD': ['#8a7a6a'], 'hair': ['#b8b8b8', '#e8e8e8', '#ffffff'], 'eye': ['#c0d8ff'], 'eyeD': ['#202830'], 'white': ['#ffffff'], 'mouth': ['#6a4a40'], 'scar': ['#6a3a3a']})
    c = person(G2, long=True, fringe=False)
    c.line([(16, 16), (20, 31)], 'scar'); c.line([(31, 17), (28, 25)], 'scar'); c.line([(26, 34), (31, 35)], 'scar')
    render(c, 'guardiao2', out)

    SE = {'robe': ['#141218', '#24212c', '#3a3646'], 'robeD': ['#3a3646'], 'skin': ['#1a1820', '#2e2a38', '#4a4458'], 'helm': ['#1a1820', '#2e2a38', '#4a4458'], 'slit': ['#0a080c'], 'eye': ['#b26bff'], 'ridge': ['#5a5470']}
    c = Canvas(S, S, SE)
    c.poly([(4, 48), (9, 38), (18, 35), (30, 35), (39, 38), (44, 48)], 'robe')
    c.ell(24, 22, 14, 16, 'helm'); c.rect(12, 20, 36, 30, 'helm')
    c.rect(14, 21, 34, 27, 'slit'); c.rect(17, 23, 21, 25, 'eye'); c.rect(27, 23, 31, 25, 'eye'); c.rect(23, 6, 25, 34, 'ridge')
    render(c, 'sentinela', out)
    c = Canvas(S, S, {**SE, 'void': ['#1a0a2a', '#3a1a5a', '#5a2a8a'], 'spark': ['#b26bff']})
    c.poly([(4, 48), (9, 38), (18, 35), (30, 35), (39, 38), (44, 48)], 'robe')
    c.ell(24, 22, 14, 16, 'helm'); c.ell(24, 23, 9, 11, 'void')
    for i in range(9): c.px(17 + (i * 7) % 14, 15 + (i * 5) % 16, 'spark')
    render(c, 'semrosto', out)

    MA = {'robe': ['#3a2618', '#5a3e28', '#7a5a3a'], 'robeD': ['#3e2a1c'], 'shadow': ['#0a0608'], 'eye': ['#ffcf6a'], 'lantern': ['#8a5a10', '#ffcf6a', '#fff4c0'], 'frame': ['#2a2018']}
    c = person(MA, hood=True); c.rect(36, 36, 44, 46, 'lantern'); c.rect(36, 35, 44, 36, 'frame'); c.rect(38, 32, 42, 35, 'frame')
    render(c, 'mascate', out)
    ES = {'robe': ['#4a7aa8', '#7ab0d8', '#bfe4ff'], 'robeD': ['#6a9ac8'], 'shadow': ['#10243a'], 'eye': ['#ffffff']}
    render(person(ES, hood=True), 'espirito', out)
    FI = {'robe': ['#0e0a14', '#1a1626', '#2a2438'], 'robeD': ['#2a2438'], 'shadow': ['#05040a'], 'eye': ['#c0c8ff'], 'hairw': ['#b8bccc', '#dfe4f0', '#ffffff'], 'mark': ['#8a4aff']}
    c = person(FI, hood=True); c.rect(16, 30, 18, 44, 'hairw'); c.rect(30, 30, 32, 44, 'hairw'); c.rect(23, 17, 25, 19, 'mark')
    render(c, 'figura', out)

    AR = {'robe': ['#08060c', '#120e18', '#241c2e'], 'helm': ['#0a080e', '#1a1424', '#2e2440'], 'slit': ['#000000'], 'eye': ['#ff3a5a'], 'spike': ['#2a1a34', '#4a2a5a', '#6a3a7a'], 'rune': ['#ff3a5a']}
    c = Canvas(S, S, AR)
    c.poly([(2, 48), (8, 36), (18, 34), (30, 34), (40, 36), (46, 48)], 'robe')
    for x in (12, 18, 24, 30, 36): c.poly([(x - 3, 12), (x, 0 + abs(x - 24) // 2), (x + 3, 12)], 'spike')
    c.ell(24, 22, 14, 15, 'helm'); c.rect(14, 21, 34, 26, 'slit'); c.rect(17, 22, 21, 24, 'eye'); c.rect(27, 22, 31, 24, 'eye')
    c.rect(23, 38, 25, 46, 'rune'); c.rect(19, 41, 29, 42, 'rune')
    render(c, 'arauto', out)

    MAE = {'hair': ['#9a8ab8', '#c8b8e0', '#ece4f8'], 'hairD': ['#a898c8'], 'skin': ['#d0b8a0', '#f0d8c0', '#fff0e0'], 'skinD': ['#d0b8a0'], 'robe': ['#c8bca0', '#e8dcc0', '#fff8e8'],
           'eye': ['#ffe0a0'], 'eyeD': ['#4a3a20'], 'white': ['#ffffff'], 'mouth': ['#b07060'], 'blush': ['#f0b0a0'], 'gold': ['#c09030', '#ffe08a', '#fff8d0']}
    c = person(MAE, long=True, blush=True); c.rect(18, 7, 30, 9, 'gold'); c.px(24, 6, 'gold')
    render(c, 'mae', out)
    PR = {'hair': ['#000000', '#0a060c', '#1a0e1e'], 'hairD': ['#000000'], 'skin': ['#08040a', '#140a18', '#24142a'], 'skinD': ['#08040a'], 'robe': ['#000000', '#08050a', '#140a18'],
          'eye': ['#ffffff'], 'eyeD': ['#5a0a20'], 'white': ['#ff4060'], 'mouth': ['#5a0a20'], 'thorn': ['#000000', '#100810', '#2a1424']}
    c = person(PR, long=True)
    for x, y, dx, dy in ((14, 12, 6, 0), (20, 7, 1, -9), (28, 7, -1, -9), (34, 12, -6, 0)): c.poly([(x - 3, y + 2), (x + dx, y + dy - 3), (x + 3, y + 2)], 'thorn')
    render(c, 'primeira', out)
    GW = {'hair': ['#2a2050', '#4a3a80', '#7a6ac0'], 'hairD': ['#3a3060'], 'skin': ['#7a72a0', '#b0a8c8', '#e0dcf0'], 'skinD': ['#7a72a0'], 'robe': ['#3a3a5a', '#4a4a6a', '#7a7aa0'],
          'eye': ['#202030'], 'eyeD': ['#202030'], 'white': ['#ffffff'], 'mouth': ['#5a5070'], 'crys': ['#8a6ac8', '#c8a8ff', '#ffffff']}
    c = person(GW, fringe=True)
    for x, y in ((12, 40), (36, 39), (30, 44), (17, 45)): c.poly([(x - 2, y + 3), (x, y - 4), (x + 2, y + 3)], 'crys')
    render(c, 'guerreiro', out)

if __name__ == '__main__':
    main(sys.argv[1])
