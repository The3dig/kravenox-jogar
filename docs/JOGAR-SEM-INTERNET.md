# Jogos do Kravenox sem internet

Guia para deixar **todos** os jogos do Kravenox funcionando sem internet e sem
gastar dados toda vez que abrem. Vale para os que já existem e para os que
vierem.

## A regra

> **Um jogo do Kravenox baixa tudo uma vez (no Wi-Fi) e depois abre sem
> internet. Abrir de novo não pode gastar dados. Versão nova só baixa o que
> mudou.**

Para isso, todo jogo da web precisa de três coisas:

1. **Um service worker** que guarda no aparelho tudo o que o jogo precisa.
2. **A página abre pela cópia guardada.** A versão nova é buscada por trás, ou
   com um prazo curto de 2,5 s. Nunca deixar o jogo esperando a internet.
3. **Arquivos grandes com a "impressão digital" no nome** (por exemplo,
   `kx-8e15a4e598.wasm`). O nome só muda quando o conteúdo muda, então o
   aparelho sabe o que já tem e não baixa de novo.

## O que aconteceu (5 de novembro de 2026)

A franquia de internet do Rone acabou 15 dias antes. E, sem internet, ele não
conseguiu jogar.

| Causa | Quanto gastava |
|---|---|
| O Quadros do Cisma estava **sem cache** (ele tinha sido desligado em 2/11 para as versões novas aparecerem). O Safari baixava o motor do Godot inteiro a cada abertura. | **~42 MB por abertura** |
| RPG, Plataforma e Cratera buscavam a página **na internet antes** da cópia guardada, sem prazo. Com a franquia acabada, a internet fica travada e o jogo ficava esperando para sempre. | pouco, mas o jogo **não abria** |

## Como cada jogo ficou

Todos estão no repositório `The3dig/kravenox-jogar`, publicados pelo GitHub
Pages em `https://the3dig.github.io/kravenox-jogar/`.

| Jogo | Pasta | O que foi feito | Primeira vez (Wi-Fi) | Depois |
|---|---|---|---|---|
| Cratera do Cisma (Godot) | raiz `/` | Service worker próprio (`sw.js`) no lugar do PWA do Godot; arquivos com impressão digital | ~38 MB | não gasta |
| RPG Reino Quebrado (HTML) | `rpg/` | Já guardava tudo (`rpg/sw.js` + `precache.json`). Agora a página e o `version.json` esperam no máximo 2,5 s e depois usam a cópia guardada | ~70 MB | não gasta |
| Plataforma (HTML + three.js) | `plataforma/` | A página espera no máximo 2,5 s e depois usa a cópia guardada. O three.js fica dentro da pasta e as 9 músicas que ela usa são guardadas na primeira abertura, numa caixa que não é apagada quando sai versão nova | ~6,5 MB | não gasta |
| Quadros do Cisma (Godot) | `quadros/` | Service worker próprio; arquivos com impressão digital; a página sai da cópia guardada na hora | ~42 MB | não gasta |

Commit no `kravenox-jogar`: `9ee3dfa` ("Todos os jogos abrem sem internet e não
gastam dados ao abrir").

### Testes feitos (Chromium imitando um iPhone)

Primeiro cada jogo foi aberto com internet até terminar de guardar. Depois:

| Jogo | Sem internet | Internet travada (franquia acabada) |
|---|---|---|
| Cratera do Cisma | abriu | abriu |
| RPG | abriu | abriu |
| Plataforma | abriu | abriu (em 3,8 s) |
| Quadros do Cisma | abriu | abriu |

Versão nova do Quadros (só o pacote do jogo mudou): baixou **4,6 MB**, não
42 MB.

Versão nova da Plataforma: baixa só a página (~100 KB). O three.js, as músicas
e os ícones ficam guardados entre versões.

## Jogos feitos no Godot (Cratera, Quadros e os próximos)

**Não use o PWA do Godot** (`progressive_web_app/enabled=true`). O service
worker dele busca a página na internet antes da cópia guardada e trava com a
internet lenta.

O jeito certo já está pronto em duas ferramentas:

| Arquivo | O que faz |
|---|---|
| `ferramentas/versionar.py` | Dá nomes com impressão digital a `index.wasm`, `index.js`, aos worklets de áudio e a `index.pck`; ajusta o `index.html` (`executable`, `mainPack`, `fileSizes`, `serviceWorker: ""`); põe na página o registro do `sw.js`; gera o `sw.js` |
| `ferramentas/sw-modelo.js` | O modelo do service worker. Guarda a lista de arquivos, abre a página pela cópia guardada, apaga o que saiu da lista e o cache antigo do Godot |

Estão em:

- `The3dig/kravenox` → `jogos/cratera-do-cisma/ferramentas/` (branch `claude/jogos-offline`)
- `The3dig/kravenox-jogo-casual` → `godot/ferramentas/`

### Passo a passo para um jogo Godot

1. Em `export_presets.cfg`, deixe `progressive_web_app/enabled=false`.
2. Copie `versionar.py` e `sw-modelo.js` para a pasta `ferramentas/` do jogo.
3. No script de publicação, logo depois de exportar:

   ```sh
   "$GODOT" --headless --export-release "Web" build/web/index.html
   # nome da caixa (um por jogo) e o começo do nome do cache antigo do Godot
   python3 ferramentas/versionar.py build/web kravenox-NOMEDOJOGO "Kravenox: Nome"
   cp build/web/sw.js build/web/index.service.worker.js   # só se o jogo já usou o PWA do Godot
   ```

4. Antes de copiar para o `kravenox-jogar`, apague os arquivos velhos:

   ```sh
   find "$DESTINO" -maxdepth 1 \( -name 'index*' -o -name 'kx-*' -o -name 'jogo-*' -o -name 'sw.js' \) -delete
   ```

5. O `cp sw.js index.service.worker.js` serve para os aparelhos que ainda têm
   o service worker antigo do Godot: quando eles procuram atualização, recebem
   o novo.

O nome da caixa tem que ser diferente em cada jogo (`kravenox-cratera`,
`kravenox-quadros`...). O segundo argumento é o começo do nome que o Godot
dava ao cache, que aparece em `CACHE_PREFIX` no `index.service.worker.js`
antigo (por exemplo, `Kravenox: Crater`).

## Jogos em HTML/JavaScript (RPG, Plataforma e os próximos)

1. Tenha um service worker que guarde **tudo** o que o jogo usa, inclusive as
   músicas, as fontes e as bibliotecas de outros sites. O RPG usa
   `precache.json`, gerado por `tools/precache.py`; rode esse script sempre
   que entrar arquivo novo.
2. **Página e `version.json` nunca sem prazo.** O padrão usado no RPG e na
   Plataforma:

   ```js
   // no service worker: a internet tem 2,5 s; depois, a cópia guardada
   const rede = fetch(req, { cache: 'no-store' }).then(async r => {
     if (r.ok) await (await caches.open(CACHE)).put(chave, r.clone());
     return r;
   });
   e.waitUntil(rede.then(() => {}, () => {}));   // chamar aqui, fora do async
   e.respondWith((async () => {
     const guardada = await caches.match(chave);
     if (!guardada) { try { return await rede; } catch (err) { return Response.error(); } }
     const prazo = new Promise(res => setTimeout(() => res(null), 2500));
     try { const r = await Promise.race([rede, prazo]); return (r && r.ok) ? r : guardada; }
     catch (err) { return guardada; }
   })());
   ```

   ```js
   // na página, antes de começar o jogo: não esperar o version.json
   const prazo = (p, ms) => Promise.race([p, new Promise((_, n) => setTimeout(() => n(new Error('lento')), ms))]);
   prazo(fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(r => r.json()), 2500)
     .then(j => comecar(j.v))
     .catch(() => comecar(versaoGuardada || 'offline'));
   ```

3. Arquivos com `?h=<hash>` ou com o hash no nome, para versão nova baixar só
   o que mudou (o RPG já faz isso).

Atenção: chame `e.waitUntil(...)` **na hora do evento**, fora do
`async () => {}` do `respondWith`. Chamado de dentro, no Chromium a página
deu erro quando estava sem internet.

## Como testar antes de publicar (sem gastar internet do celular)

Teste no computador, com o Chromium do Playwright:

1. Sirva a pasta do `kravenox-jogar` em `http://localhost:PORTA`. Precisa ser
   `localhost`, porque o RPG só registra o service worker em `https` ou em
   `localhost`.
2. Abra o jogo e espere o service worker ficar ativo e a página aparecer no
   cache (`caches.keys()`).
3. Use `context.setOffline(true)`, abra de novo e confira se o jogo abre.
4. Simule a internet travada com `context.route('**/*', r => {})`, que nunca
   responde, e confira se abre em poucos segundos.
5. Conte os bytes baixados de fora do service worker
   (`response.fromServiceWorker()`). Na segunda abertura tem que dar perto
   de 0.

O teste está pronto em `jogos/cratera-do-cisma/ferramentas/testar-offline.js`:

```sh
cd kravenox-jogar && python3 -m http.server 8772 &
node testar-offline.js /tmp/perfil-teste Quadros /quadros/
```

Ele mostra "ABRIU" ou "FALHOU" para "sem internet" e para "internet travada".

## No celular (uma vez só, no Wi-Fi)

1. Abra cada jogo no Safari **no Wi-Fi** e deixe aberto um minuto.
2. Feche e abra de novo, ainda no Wi-Fi.
3. Se quiser, use Compartilhar → **Adicionar à Tela de Início**, para abrir
   como app.
4. Depois disso, os jogos abrem sem internet.

Cuidados:

- Se um jogo ficar **semanas sem abrir**, o iPhone pode apagar a cópia
  guardada. Aí é só abrir de novo no Wi-Fi.
- Não apague os dados do site em Ajustes → Safari → Avançado → Dados dos
  Sites (`github.io`). Isso apaga as cópias guardadas e o progresso salvo dos
  jogos.
- Versão nova de um jogo baixa só o que mudou (uns 5 MB no Quadros). Se
  estiver sem Wi-Fi, o jogo abre na versão anterior e atualiza depois.

## Pendências

- [ ] **Juntar a branch `claude/jogos-offline` na `main` do `kravenox`.** Ela
      tem o `publicar.sh` novo do Cratera. Se o Cratera for publicado pelo
      script antigo, ele volta a usar o PWA do Godot e perde a correção.
- [x] **Plataforma:** three.js r128 copiado para `plataforma/three.min.js`;
      as músicas entram na primeira abertura (5/11/2026).
- [ ] Os dois jogos Godot (Cratera e Quadros) guardam cada um a sua cópia do
      motor (~38 MB cada). Daria para os dois usarem uma cópia só, mas isso
      exige mudar a estrutura do site.
- [ ] Todo jogo novo: seguir este guia antes da primeira publicação.
