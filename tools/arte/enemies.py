# Inimigos redesenhados (pixel art sombreada). Desenhados virados para a esquerda; o jogo espelha.
import sys, math, random
from painter import Canvas, hexc
from PIL import Image

def hx(c): return '#%02x%02x%02x' % tuple(max(0, min(255, int(v))) for v in c)
def ramp(base, n=4):
    r, g, b = hexc(base)
    ks = [0.45, 0.75, 1.0, 1.35][:n] if n == 4 else [0.55, 1.0, 1.4]
    return [hx((r * k + (12 if k > 1 else 0), g * k + (12 if k > 1 else 0), b * k + (14 if k > 1 else 0))) for k in ks]

def ghost(w, h, c1, eye, crystal=False, seed=1):
    rnd = random.Random(seed)
    M = {'cloak': ramp(c1), 'cloakD': [hx([v * 0.55 for v in hexc(c1)])], 'hole': ['#06040a'], 'eye': [eye], 'eyeG': [eye, '#ffffff'], 'bone': ['#8a8478', '#c8c0b0', '#eee8dc'],
         'crys': ['#3a1e5a', '#8a5ac8', '#d8b8ff', '#ffffff'], 'wisp': ramp(c1, 3)}
    c = Canvas(w, h, M)
    cx = w * 0.5
    # corpo: capuz + manto que se alarga e se desfaz em farrapos
    c.ell(cx, h * 0.24, w * 0.24, h * 0.2, 'cloak')
    pts = [(cx - w * 0.2, h * 0.28), (cx + w * 0.2, h * 0.28), (cx + w * 0.38, h * 0.82), (cx - w * 0.38, h * 0.82)]
    c.poly(pts, 'cloak')
    x = cx - w * 0.38; i = 0
    while x < cx + w * 0.38:   # farrapos
        L = h * (0.06 + rnd.random() * 0.14); c.poly([(x, h * 0.8), (x + 4, h * 0.8), (x + 2 + rnd.random() * 2 - 1, h * 0.8 + L)], 'cloak'); x += 4; i += 1
    for k in range(5): xx = cx - w * 0.3 + k * w * 0.15; c.line([(xx, h * 0.34), (xx + (k - 2) * 1.5, h * 0.8)], 'cloakD')
    # braços estendidos para a frente (esquerda) com dedos ossudos
    c.poly([(cx - w * 0.12, h * 0.38), (cx - w * 0.42, h * 0.5), (cx - w * 0.4, h * 0.58), (cx - w * 0.1, h * 0.5)], 'cloak')
    for k in range(4): c.line([(cx - w * 0.42, h * (0.52 + k * 0.018)), (cx - w * 0.49, h * (0.49 + k * 0.03))], 'bone')
    # rosto: buraco escuro do capuz, olhos e boca escancarada
    c.ell(cx - w * 0.03, h * 0.27, w * 0.15, h * 0.13, 'hole')
    for sx in (-1, 1):
        ex, ey = cx - w * 0.03 + sx * w * 0.07, h * 0.24
        c.ell(ex, ey, 2.2, 2.6, 'eye'); c.px(ex - 1, ey - 1, 'eyeG')
    c.ell(cx - w * 0.03, h * 0.33, w * 0.05, h * 0.05, 'eye' if eye.lower() in ('#ffffff', '#fff') else 'hole')
    c.ell(cx - w * 0.03, h * 0.33, w * 0.035, h * 0.035, 'hole')
    if crystal:
        for (x0, y0, hh) in ((cx - w * 0.2, h * 0.3, 10), (cx + w * 0.16, h * 0.28, 13), (cx + w * 0.26, h * 0.4, 8)):
            c.poly([(x0 - 3, y0 + 2), (x0, y0 - hh), (x0 + 3, y0 + 2)], 'crys')
    return c

def root(w, h, c1, c2, eye, thick=4, eyes=1, seed=3):
    rnd = random.Random(seed)
    M = {'bark': ramp(c2 if c2 else c1), 'barkD': [hx([v * 0.5 for v in hexc(c1)])], 'knot': ramp(c1, 3), 'eye': [eye, '#ffffff'], 'thorn': ['#0a0608', '#2a1a1a', '#4a3a34'], 'ground': ['#0a0608', '#1a1214']}
    c = Canvas(w, h, M)
    cx = w * 0.5
    c.ell(cx, h * 0.95, w * 0.42, h * 0.07, 'ground')
    # tronco retorcido
    for y in range(int(h * 0.25), int(h * 0.95)):
        t = (y - h * 0.25) / (h * 0.7); x = cx + math.sin(t * 4 + seed) * w * 0.06; ww = w * (0.11 + 0.1 * t) + thick
        c.rect(x - ww / 2, y, x + ww / 2, y + 1, 'bark')
    # cabeça-nó com olhos
    c.ell(cx, h * 0.25, w * 0.2, h * 0.17, 'knot')
    for k in range(eyes):
        ex = cx - w * 0.08 + (k * w * 0.16 if eyes > 1 else w * 0.04); ey = h * 0.24
        c.ell(ex, ey, 2.5, 2, 'eye'); c.px(ex, ey - 1, 'eye')
    c.line([(cx - w * 0.12, h * 0.33), (cx + w * 0.1, h * 0.33)], 'barkD')
    # tentáculos de raiz curvando para a frente e para cima
    for k in range(5):
        a0 = -2.4 + k * 0.6 + rnd.random() * 0.3; L = w * (0.3 + rnd.random() * 0.2)
        x, y = cx + math.cos(a0) * w * 0.12, h * (0.4 + k * 0.08); pts = [(x, y)]
        for s in range(8):
            a = a0 + math.sin(s * 0.9 + k) * 0.5 - s * 0.08; x += math.cos(a) * L / 8; y += math.sin(a) * L / 8; pts.append((x, y))
        for i, (p0, p1) in enumerate(zip(pts, pts[1:])): c.line([p0, p1], 'bark', max(1, int(thick * (1 - i / 9)) + 1))
        tx, ty = pts[-1]; c.poly([(tx - 2, ty), (tx, ty - 4), (tx + 2, ty)], 'thorn')
    for _ in range(14):   # espinhos e veios
        y = h * (0.3 + rnd.random() * 0.6); x = cx + (rnd.random() - 0.5) * w * 0.3
        c.poly([(x, y), (x - 3 if x < cx else x + 3, y - 2), (x, y + 2)], 'thorn')
        c.line([(x, y), (x + rnd.random() * 2 - 1, y + 5)], 'barkD')
    return c

def hands(w, h, c1, c2, seed=5):
    rnd = random.Random(seed)
    M = {'mist': ['#3a4250', '#5a6474', '#8a94a4', '#b8c4d4'], 'skin': ramp(c1), 'nail': ['#2a3038'], 'eye': ['#cfe8ff', '#ffffff']}
    c = Canvas(w, h, M)
    for (x, y, hh) in ((w * 0.22, h * 0.32, 0.5), (w * 0.5, h * 0.16, 0.66), (w * 0.76, h * 0.36, 0.46), (w * 0.38, h * 0.48, 0.3)):
        # antebraço longo e mão de dedos compridos
        c.poly([(x - 3, h * 0.85), (x + 3, h * 0.85), (x + 2.5, y + 8), (x - 2.5, y + 8)], 'skin')
        c.ell(x, y + 6, 5, 4.5, 'skin')
        for f in range(4):
            fx = x - 4 + f * 2.7; c.line([(fx, y + 4), (fx - 1 + f * 0.5, y - 5 + abs(f - 1.5) * 1.5)], 'skin', 2); c.px(fx - 1 + f * 0.5, y - 6 + abs(f - 1.5) * 1.5, 'nail')
        c.line([(x + 5, y + 7), (x + 8, y + 3)], 'skin', 2)
    for k in range(22):  # névoa
        c.ell(rnd.random() * w, h * (0.78 + rnd.random() * 0.16), 5 + rnd.random() * 9, 3 + rnd.random() * 3, 'mist')
    c.px(w * 0.5 - 2, h * 0.82, 'eye'); c.px(w * 0.5 + 3, h * 0.82, 'eye')
    return c

def crystalman(w, h, seed=7):
    M = {'armor': ['#1a1a2a', '#2e2e46', '#4a4a6a', '#6a6a8a'], 'crys': ['#3a1e5a', '#8a5ac8', '#c8a8ff', '#ffffff'], 'eye': ['#e0c8ff'], 'slit': ['#05040a'], 'skin': ['#7a72a0', '#b0a8c8', '#e0dcf0']}
    c = Canvas(w, h, M); cx = w * 0.5
    c.rect(cx - 8, h * 0.62, cx - 3, h * 0.97, 'armor'); c.rect(cx + 3, h * 0.62, cx + 8, h * 0.97, 'armor')
    c.poly([(cx - 12, h * 0.3), (cx + 12, h * 0.3), (cx + 10, h * 0.66), (cx - 10, h * 0.66)], 'armor')
    c.ell(cx, h * 0.2, 8, 9, 'armor'); c.rect(cx - 6, h * 0.18, cx + 6, h * 0.23, 'slit'); c.rect(cx - 4, h * 0.195, cx - 1, h * 0.215, 'eye'); c.rect(cx + 2, h * 0.195, cx + 5, h * 0.215, 'eye')
    c.poly([(cx - 12, h * 0.32), (cx - 18, h * 0.55), (cx - 14, h * 0.57), (cx - 9, h * 0.38)], 'armor')
    c.poly([(cx - 17, h * 0.52), (cx - 26, h * 0.92), (cx - 21, h * 0.92), (cx - 14, h * 0.55)], 'crys')   # lâmina de cristal
    c.poly([(cx + 12, h * 0.32), (cx + 17, h * 0.58), (cx + 13, h * 0.6), (cx + 9, h * 0.38)], 'armor')
    for (x, y, hh) in ((cx - 10, h * 0.3, 12), (cx - 4, h * 0.28, 9), (cx + 9, h * 0.3, 15), (cx + 14, h * 0.4, 10), (cx + 5, h * 0.5, 8), (cx - 6, h * 0.7, 7), (cx + 7, h * 0.12, 9)):
        c.poly([(x - 3, y + 2), (x + 1, y - hh), (x + 3, y + 2)], 'crys')
    return c

def colossus(w, h, seed=9):
    rnd = random.Random(seed)
    M = {'stone': ['#141210', '#24221c', '#383428', '#4e4a38'], 'moss': ['#1e2614', '#2e3a1e', '#465430'], 'crack': ['#ff3020', '#ff8a50'], 'eye': ['#ff2010', '#ffd0a0'],
         'claw': ['#2a1a40', '#6a3ac0', '#b08aff'], 'hole': ['#050404']}
    c = Canvas(w, h, M); cx = w * 0.5
    c.ell(cx, h * 0.52, w * 0.36, h * 0.36, 'stone')                      # tronco curvado
    c.ell(cx - w * 0.3, h * 0.4, w * 0.16, h * 0.18, 'stone'); c.ell(cx + w * 0.3, h * 0.4, w * 0.16, h * 0.18, 'stone')   # ombros
    for sx in (-1, 1):   # braços até o chão
        x0 = cx + sx * w * 0.36
        c.poly([(x0 - 8, h * 0.45), (x0 + 8, h * 0.45), (x0 + sx * 4 + 7, h * 0.9), (x0 + sx * 4 - 7, h * 0.9)], 'stone')
        for f in range(4): fx = x0 + sx * 4 - 6 + f * 4; c.poly([(fx - 1.5, h * 0.89), (fx + 1.5, h * 0.89), (fx + sx * 2, h * 0.99)], 'claw')
    c.rect(cx - 16, h * 0.8, cx - 5, h * 0.98, 'stone'); c.rect(cx + 5, h * 0.8, cx + 16, h * 0.98, 'stone')
    for sx in (-1, 1): c.poly([(cx + sx * 10, h * 0.2), (cx + sx * 24, h * 0.02), (cx + sx * 16, h * 0.22)], 'claw')   # chifres
    c.ell(cx, h * 0.25, w * 0.16, h * 0.14, 'stone')                      # cabeça
    c.ell(cx, h * 0.21, 8, 6, 'hole'); c.ell(cx, h * 0.21, 5.5, 4, 'eye'); c.ell(cx - 1, h * 0.2, 2, 1.5, 'crack')
    c.poly([(cx - 13, h * 0.3), (cx + 13, h * 0.3), (cx + 9, h * 0.38), (cx - 9, h * 0.38)], 'hole')    # boca
    for k in range(7): x = cx - 11 + k * 3.6; c.poly([(x - 1.2, h * 0.3), (x + 1.2, h * 0.3), (x, h * 0.34)], 'claw')
    c.ell(cx, h * 0.55, 7, 7, 'hole'); c.ell(cx, h * 0.55, 4, 4, 'crack')                                   # núcleo no peito
    for k in range(9):                                                    # rachaduras brilhando
        x = cx + (rnd.random() - 0.5) * w * 0.5; y = h * (0.35 + rnd.random() * 0.4); pts = [(x, y)]
        for s in range(5): x += rnd.random() * 4 - 2; y += 2 + rnd.random() * 2; pts.append((x, y))
        c.line(pts, 'crack')
    for k in range(18): c.ell(cx + (rnd.random() - 0.5) * w * 0.7, h * (0.3 + rnd.random() * 0.25), 2 + rnd.random() * 4, 1.5 + rnd.random() * 2, 'moss', only=['stone'])
    return c

def shards(w, h, seed=11):
    M = {'crys': ['#0a3040', '#1a5a6a', '#4ab0c0', '#c0ffff'], 'core': ['#6af0e0', '#ffffff']}
    c = Canvas(w, h, M); rnd = random.Random(seed); cx, cy = w * 0.5, h * 0.48
    for k in range(9):
        a = k / 9 * math.tau + rnd.random() * 0.3; d = w * (0.18 + rnd.random() * 0.14); x, y = cx + math.cos(a) * d, cy + math.sin(a) * d * 0.9; L = 7 + rnd.random() * 8
        c.poly([(x - 3, y + 3), (x + math.cos(a) * L, y + math.sin(a) * L), (x + 3, y - 3)], 'crys')
    c.ell(cx, cy, 7, 7, 'crys'); c.ell(cx, cy, 3.5, 3.5, 'core')
    return c

def recolor(src, dst, f):
    im = Image.open(src).convert('RGBA'); P = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = P[x, y]
            if a: P[x, y] = f(r, g, b) + (a,)
    im.save(dst)

def main(out):
    R = lambda c, n: c.render(seed=3, tex=0.06).save(f'{out}/e_{n}.png')
    R(ghost(56, 60, '#7a6a90', '#ff5a2a', seed=1), 'eco')
    R(ghost(56, 62, '#2a2030', '#c18bff', seed=2), 'sombra')
    R(ghost(60, 64, '#c8a860', '#ffffff', crystal=True, seed=3), 'voz')
    R(ghost(60, 64, '#5a3a8a', '#ff5a2a', crystal=True, seed=4), 'ecoGrande')
    R(ghost(58, 64, '#a8b8d0', '#203050', seed=5), 'lembranca')
    R(root(64, 64, '#1a1214', '#2a1a20', '#ff3c3c', thick=3, eyes=1, seed=3), 'raizRast')
    R(root(70, 70, '#4a3a30', '#3a2e26', '#e0c060', thick=5, eyes=2, seed=4), 'raizPetra')
    R(root(72, 72, '#06141a', '#0e2a34', '#6af0e0', thick=5, eyes=2, seed=40), 'raizVazio')
    R(hands(76, 70, '#8a94a4', '#5a6474'), 'maoNevoa')
    R(crystalman(64, 80), 'cristalizado')
    R(colossus(130, 120), 'coisa')
    R(shards(64, 64), 'fragmento')
    base = '/home/user/kravenox-jogar/rpg/img/'
    # Sentinela Veterano: armadura cor de vinho e olhos rosados
    def vet(r, g, b):
        if b > r + 30 and b > 120: return (255, 120, 200)
        L = (r + g + b) / 3; return (int(L * 1.25 + 10), int(L * 0.7), int(L * 0.8))
    recolor(base + 'e_sentinela1.png', f'{out}/e_sentinelaN.png', vet)
    def afog(r, g, b):
        if b > r + 30 and b > 120: return (106, 240, 224)
        L = (r + g + b) / 3; return (int(L * 0.45), int(L * 1.0 + 8), int(L * 1.05 + 14))
    recolor(base + 'e_sentinela.png', f'{out}/e_afogado.png', afog)

if __name__ == '__main__':
    main(sys.argv[1])
