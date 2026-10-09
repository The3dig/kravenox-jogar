# Pintor de pixel art: desenha por "materiais" num mapa de índices e depois aplica
# rampa de cor, luz do noroeste, textura pontilhada e contorno escuro.
from PIL import Image
import math, random

def hexc(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

class Canvas:
    def __init__(s, w, h, mats):
        s.w, s.h = w, h
        s.m = [[None] * w for _ in range(h)]
        s.mats = {k: [hexc(c) for c in v] for k, v in mats.items()}  # [sombra, base, luz] (+ opcional brilho)
        s.flat = set()
    def put(s, x, y, mat):
        x, y = int(round(x)), int(round(y))
        if 0 <= x < s.w and 0 <= y < s.h: s.m[y][x] = mat
    def get(s, x, y):
        if 0 <= x < s.w and 0 <= y < s.h: return s.m[y][x]
        return None
    def ell(s, cx, cy, rx, ry, mat, only=None):
        for y in range(s.h):
            for x in range(s.w):
                if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1:
                    if only is None or s.m[y][x] in only: s.m[y][x] = mat
    def rect(s, x0, y0, x1, y1, mat):
        for y in range(int(y0), int(y1)):
            for x in range(int(x0), int(x1)): s.put(x, y, mat)
    def poly(s, pts, mat, only=None):
        n = len(pts)
        for y in range(s.h):
            yy = y + 0.5; xs = []
            for i in range(n):
                (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % n]
                if (y0 <= yy < y1) or (y1 <= yy < y0):
                    xs.append(x0 + (yy - y0) * (x1 - x0) / (y1 - y0))
            xs.sort()
            for a, b in zip(xs[::2], xs[1::2]):
                for x in range(int(math.ceil(a - 0.5)), int(math.floor(b - 0.5)) + 1):
                    if only is None or s.get(x, y) in only: s.put(x, y, mat)
    def line(s, pts, mat, w=1):
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = int(max(abs(x1 - x0), abs(y1 - y0)) * 2) + 1
            for i in range(n + 1):
                t = i / n; x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t
                for dx in range(w):
                    s.put(x + dx - (w - 1) / 2, y, mat)
    def px(s, x, y, mat): s.put(x, y, mat); s.flat.add((int(x), int(y)))
    def mirror(s):
        s.m = [row[::-1] for row in s.m]; s.flat = {(s.w - 1 - x, y) for x, y in s.flat}

    def render(s, outline='#0b0710', seed=1, tex=0.08, scale=1):
        rnd = random.Random(seed)
        im = Image.new('RGBA', (s.w, s.h), (0, 0, 0, 0)); P = im.load()
        for y in range(s.h):
            for x in range(s.w):
                k = s.m[y][x]
                if k is None: continue
                R = s.mats[k]
                if (x, y) in s.flat or len(R) == 1: c = R[min(1, len(R) - 1)] if len(R) > 1 else R[0]; P[x, y] = c + (255,); continue
                # luz do noroeste: borda de cima/esquerda clara, de baixo/direita escura
                up, lf, dn, rt = s.get(x, y - 1), s.get(x - 1, y), s.get(x, y + 1), s.get(x + 1, y)
                lvl = 1.0
                if up != k or lf != k: lvl = 2.0
                if (dn != k or rt != k) and lvl < 2: lvl = 0.0
                if up != k and lf != k and len(R) > 3: lvl = 3.0
                n = rnd.random()
                if lvl == 1.0 and n < tex: lvl = 0.0 if n < tex / 2 else 2.0
                i = int(min(lvl, len(R) - 1))
                P[x, y] = R[i] + (255,)
        if outline:
            oc = hexc(outline); A = im.copy().load(); out = im.load()
            for y in range(s.h):
                for x in range(s.w):
                    if A[x, y][3]: continue
                    if any(0 <= x + dx < s.w and 0 <= y + dy < s.h and A[x + dx, y + dy][3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                        out[x, y] = oc + (255,)
        if scale != 1: im = im.resize((s.w * scale, s.h * scale), Image.NEAREST)
        return im
