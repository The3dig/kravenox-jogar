# Kit Kravenox andando (igual ao jogo)

Kit pronto para usar o Kravenox, com a mesma caminhada do jogo "Kravenox: O Reino Quebrado", em outro programa (por exemplo, um app de mapa tipo Waze).

## Arquivos

| Arquivo | O que é |
|---|---|
| `img/` | Quadros originais em pixel art, no tamanho real (37×34 de lado, 29×34 de frente, 26×34 de costas) |
| `img4x/` | Os mesmos quadros 4× maiores, sem borrar |
| `kravenox_spritesheet.png` | Folha única. Linhas: frente, costas, esquerda, direita. Colunas: parado + 4 quadros de passo. Célula 37×34, com os pés alinhados embaixo |
| `kravenox_spritesheet_4x.png` | A folha 4× maior |
| `kravenox.js` | Classe pronta, sem dependências: carrega, anima e desenha |
| `demo.html` | Demonstração: setas, toque ou rota automática |
| `k_portrait.png` (em `img/`) | Retrato 48×48 |

## Regras da animação (as mesmas do jogo)

- **Velocidade da animação:** troca de quadro a cada **8 quadros a 60 fps**, ou seja, cerca de **0,133 s** por quadro (7,5 quadros por segundo).
- **De lado (esquerda/direita):** 4 quadros em ciclo: `k_<dir>_w0 → w1 → w2 → w3`.
- **De frente/costas:** alterna `k_<dir>_1` e `k_<dir>_0`.
- **Parado:** `k_<dir>_0`.
- **Velocidade de deslocamento no jogo:** 1 pixel por quadro (60 px/s na escala 1). Nessa velocidade, o pé "pisa" certo no chão.
- **Pixel art:** desenhe com `imageSmoothingEnabled = false` (ou `image-rendering: pixelated`) e sempre em escala inteira (2×, 3×, 4×).
- **Âncora:** os pés ficam no centro da borda de baixo do quadro.
- **Sombra:** elipse preta a 35% de opacidade, 5×2 px (vezes a escala), embaixo dos pés.

## Para um app de mapa/GPS

O personagem só tem 4 direções. `Kravenox.dirFromHeading(graus)` converte o rumo do GPS (0 = norte, 90 = leste) na direção do sprite: norte = costas, leste = direita, sul = frente, oeste = esquerda.

```js
const k = new Kravenox('img/');
await k.load();
// a cada quadro:
k.update(dt, velocidade > 0.5, Kravenox.dirFromHeading(rumo));
k.draw(ctx, xTela, yTela, 3);
```

Se o app andar mais rápido que o jogo, você pode acelerar a animação na proporção da velocidade. Basta passar um `dt` multiplicado em `update`.
