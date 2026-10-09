// Kravenox andando — exatamente como no jogo "Kravenox: O Reino Quebrado".
// Sem dependências. Uso:
//   const k = new Kravenox('img/');            // pasta com os PNGs
//   await k.load();
//   k.update(dt, andando, direcao);            // dt em segundos; direcao: 'down'|'up'|'left'|'right'
//   k.draw(ctx, x, y, escala);                 // (x,y) = ponto dos PÉS no canvas
//   Kravenox.dirFromHeading(graus)            // rumo do GPS (0=norte, 90=leste) -> direção
//
// Regras do jogo (60 quadros/s):
//  - troca de quadro a cada 8 quadros (≈ 0,133 s); um passo de 1 tile leva 16 quadros
//  - de lado (left/right): 4 quadros de passo k_<dir>_w0..w3 em ciclo
//  - de frente/costas (down/up): alterna k_<dir>_1 e k_<dir>_0
//  - parado: k_<dir>_0
//  - pixel art: desenhar SEM suavização e com escala inteira
class Kravenox {
  constructor(base = 'img/') {
    this.base = base; this.imgs = {}; this.dir = 'down'; this.moving = false;
    this.t = 0; this.walkF = 0;
  }
  load() {
    const names = [];
    for (const d of ['down', 'up', 'left', 'right']) for (const f of [0, 1]) names.push(`k_${d}_${f}`);
    for (const d of ['left', 'right']) for (const f of [0, 1, 2, 3]) names.push(`k_${d}_w${f}`);
    return Promise.all(names.map(n => new Promise(res => {
      const im = new Image(); im.onload = () => { this.imgs[n] = im; res(); }; im.onerror = res; im.src = this.base + n + '.png';
    })));
  }
  update(dt, moving, dir) {
    if (dir) this.dir = dir;
    if (moving && !this.moving) { this.t = 0; this.walkF++; }   // no jogo o passo começa já trocando o pé
    this.moving = moving;
    if (!moving) return;
    this.t += dt * 60;
    while (this.t >= 8) { this.t -= 8; this.walkF++; }
  }
  frame() {
    const d = this.dir;
    if (!this.moving) return this.imgs[`k_${d}_0`];
    if (d === 'left' || d === 'right') return this.imgs[`k_${d}_w${this.walkF & 3}`];
    return this.imgs[`k_${d}_${[1, 0, 1, 0][this.walkF & 3]}`];
  }
  draw(ctx, x, y, scale = 3, shadow = true) {
    const im = this.frame(); if (!im) return;
    ctx.imageSmoothingEnabled = false;
    if (shadow) {   // sombra igual à do jogo (elipse 5x2 sob os pés)
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath();
      ctx.ellipse(x, y, 5 * scale, 2 * scale, 0, 0, 7); ctx.fill();
    }
    ctx.drawImage(im, Math.round(x - im.width * scale / 2), Math.round(y - im.height * scale), im.width * scale, im.height * scale);
  }
  static dirFromHeading(deg) {   // rumo de bússola -> uma das 4 direções do sprite
    const a = ((deg % 360) + 360) % 360;
    if (a >= 45 && a < 135) return 'right';
    if (a >= 135 && a < 225) return 'down';
    if (a >= 225 && a < 315) return 'left';
    return 'up';
  }
}
if (typeof module !== 'undefined') module.exports = Kravenox;
