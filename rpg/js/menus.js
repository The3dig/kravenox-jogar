'use strict';
// Menus fora de batalha: menu de campo, loja, descanso, fim de jogo.
(function () {
  const D = G.data;

  function partyPanel() {
    return {
      update() {},
      draw(ctx) {
        const p = G.state.party;
        const x = 104, w = G.W - x - 6;
        G.win(ctx, x, 6, w, 8 + p.length * 44);
        p.forEach((h, i) => {
          const y = 12 + i * 44;
          { const im = G.gfx.sprite(h.id === 'kravenox' && G.state.flags.prata ? 'kravenoxP' : D.HEROES[h.id].sprite, 'down', 0); const sc = Math.min(1, 26 / im.height); ctx.drawImage(im, x + 15 - im.width * sc / 2, y + 2, im.width * sc, im.height * sc); }
          G.text(ctx, h.name, x + 30, y, h.alive ? '#ffcf6a' : '#8a4a4a', 9, 'left', true);
          G.text(ctx, 'Nv ' + h.lv, x + w - 10, y, '#a89a8a', 8, 'right');
          G.bar(ctx, x + 30, y + 13, w - 44, h.hp / h.maxhp, '#c84040', '#3a1214');
          G.text(ctx, 'HP ' + h.hp + '/' + h.maxhp, x + 30, y + 17, '#efe3cf', 8);
          G.bar(ctx, x + 30, y + 28, w - 44, h.ep / Math.max(1, h.mep), '#5a8ad8', '#141c3a');
          G.text(ctx, 'EP ' + h.ep + '/' + h.mep, x + 30, y + 31, '#c8d4f0', 8);
        });
        G.win(ctx, 6, G.H - 40, 92, 34);
        G.text(ctx, 'Fragmentos', 12, G.H - 35, '#a89a8a', 7);
        G.text(ctx, String(G.state.fr), 92, G.H - 26, '#ffcf6a', 9, 'right', true);
        const t = Math.floor(G.state.time / 60), hh = Math.floor(t / 3600), mm = Math.floor(t / 60) % 60;
        G.text(ctx, hh + 'h' + String(mm).padStart(2, '0'), 12, G.H - 25, '#6d5a66', 7);
      },
    };
  }

  G.fieldMenu = async function () {
    G.Audio.sfx('ok');
    const panel = partyPanel(); G.overlays.push(panel);
    let idx = 0;
    for (;;) {
      const i = await G.menu({ x: 6, y: 6, w: 100, index: idx, items: ['Itens', 'Técnicas', 'Status', 'Equipar', 'Salvar', G.Audio.muted ? 'Som: não' : 'Som: sim', G.fastBattle ? 'Batalha: 2x' : 'Batalha: 1x', 'Fechar'] });
      idx = Math.max(0, i);
      if (i < 0 || i === 7) break;
      if (i === 0) await itemsMenu();
      if (i === 1) await techMenu();
      if (i === 2) await statusMenu();
      if (i === 3) await equipMenu();
      if (i === 4) { if (D.save()) { G.Audio.sfx('save'); await G.say(null, 'O Reino lembrará deste momento. (Jogo salvo)'); } else await G.say(null, 'Não foi possível salvar neste navegador.'); }
      if (i === 6) { G.fastBattle = !G.fastBattle; try { localStorage.setItem('kravenox_vel', G.fastBattle ? '2' : '1'); } catch (e) {} G.toast(G.fastBattle ? 'Batalhas na velocidade rápida (2x).' : 'Batalhas na velocidade normal (1x).'); }
      if (i === 5) { G.Audio.muted = !G.Audio.muted; if (G.Audio.musicGain) G.Audio.musicGain.gain.value = G.Audio.muted ? 0 : 0.55; }
    }
    G.pop(panel);
  };
  async function pickHero(title, filter) {
    const p = G.state.party;
    const i = await G.menu({ x: 30, y: 50, w: 130, title, items: p.map(h => ({ label: h.name, right: h.alive ? h.hp + '/' + h.maxhp : 'caído', disabled: filter ? !filter(h) : false })) });
    return i < 0 ? null : p[i];
  }
  async function itemsMenu() {
    for (;;) {
      const keys = Object.keys(G.state.inv).filter(k => G.state.inv[k] > 0);
      if (!keys.length) { await G.say(null, 'A bolsa está vazia.'); return; }
      const i = await G.menu({ x: 20, y: 30, w: 190, title: 'Itens', maxRows: 7, items: keys.map(k => ({ label: D.ITEMS[k].name, right: 'x' + G.state.inv[k], disabled: D.ITEMS[k].target === 'fuga' })), help: i => D.ITEMS[keys[i]].desc });
      if (i < 0) return;
      const k = keys[i], it = D.ITEMS[k];
      let tgt = 'all';
      if (it.target === 'aliado') tgt = await pickHero('Usar em quem?', h => h.alive);
      else if (it.target === 'aliadoCaido') tgt = await pickHero('Usar em quem?', h => !h.alive);
      if (!tgt) continue;
      G.state.inv[k]--;
      await G.useItemOn(k, tgt, false);
      G.toast(it.name + ' usado.');
    }
  }
  async function techMenu() {
    const h = await pickHero('Quem?', h => h.alive && D.techsOf(h).some(k => ['cura', 'reviver'].includes(D.TECHS[k].kind)));
    if (!h) return;
    for (;;) {
      const ts = D.techsOf(h).filter(k => ['cura', 'reviver'].includes(D.TECHS[k].kind));
      const i = await G.menu({ x: 20, y: 30, w: 190, title: h.name + ' — EP ' + h.ep + '/' + h.mep, items: ts.map(k => ({ label: D.TECHS[k].name, right: D.TECHS[k].ep, disabled: D.TECHS[k].ep > h.ep })), help: i => D.TECHS[ts[i]].desc });
      if (i < 0) return;
      const T = D.TECHS[ts[i]];
      let tgt = 'all';
      if (T.target === 'aliado') tgt = await pickHero('Em quem?', x => x.alive);
      if (T.target === 'aliadoCaido') tgt = await pickHero('Em quem?', x => !x.alive);
      if (!tgt) continue;
      h.ep -= T.ep; G.Audio.sfx('heal');
      const ts2 = tgt === 'all' ? G.state.party.filter(x => x.alive) : [tgt];
      for (const p of ts2) {
        if (T.kind === 'reviver') { p.alive = true; p.hp = Math.round(p.maxhp * 0.5); }
        else p.hp = Math.min(p.maxhp, p.hp + Math.round(h.mag * T.pow + T.base));
      }
      G.toast(T.name + '!');
    }
  }
  async function statusMenu() {
    const h = await pickHero('Status de quem?');
    if (!h) return;
    const H = D.HEROES[h.id];
    const ov = { update() { if (G.Input.pressed.a || G.Input.pressed.b) { G.pop(ov); ov.done(); } }, draw(ctx) {
      G.win(ctx, 14, 14, G.W - 28, G.H - 28);
      const por = G.portraitFor(h.name); if (por) { ctx.fillStyle = '#000'; ctx.fillRect(24, 24, 48, 48); por(ctx, 24, 24, G.time); }
      G.text(ctx, h.name, 82, 24, '#ffcf6a', 12, 'left', true);
      G.text(ctx, 'Nível ' + h.lv, 82, 40, '#efe3cf', 9);
      const next = D.xpTotal(h.lv + 1) - h.xp;
      G.text(ctx, 'Exp. ' + h.xp + '   próximo nível: ' + next, 82, 53, '#a89a8a', 8);
      const lines = G.wrap(ctx, H.desc, G.W - 70, 8); lines.forEach((l, i) => G.text(ctx, l, 82, 64 + i * 10, '#c9bfd8', 8));
      const st = [['HP', h.hp + '/' + h.maxhp], ['EP', h.ep + '/' + h.mep], ['Ataque', h.atk], ['Defesa', h.def], ['Essência', h.mag], ['Agilidade', h.agi]];
      st.forEach(([k, v], i) => { G.text(ctx, k, 28, 96 + i * 12, '#a89a8a', 9); G.text(ctx, String(v), 130, 96 + i * 12, '#efe3cf', 9, 'right'); });
      G.text(ctx, 'Arma', 150, 96, '#a89a8a', 8); G.text(ctx, D.EQUIP[h.weapon].name, 150, 106, '#efe3cf', 8);
      G.text(ctx, 'Proteção', 150, 122, '#a89a8a', 8); G.text(ctx, D.EQUIP[h.armor].name, 150, 132, '#efe3cf', 8);
      G.text(ctx, 'Técnicas', 150, 148, '#a89a8a', 8);
      D.techsOf(h).forEach((k, i) => G.text(ctx, D.TECHS[k].name, 150 + (i % 2) * 70, 158 + Math.floor(i / 2) * 10, '#e0c060', 7));
    } };
    await new Promise(r => { ov.done = r; G.push(ov); });
  }
  async function equipMenu() {
    const h = await pickHero('Equipar quem?');
    if (!h) return;
    const owned = Object.keys(G.state.inv).filter(k => D.EQUIP[k] && G.state.inv[k] > 0 && (!D.EQUIP[k].who || D.EQUIP[k].who === h.id));
    if (!owned.length) { await G.say(null, 'Nada guardado que ' + h.name + ' possa usar.'); return; }
    const i = await G.menu({ x: 20, y: 30, w: 220, title: h.name + ' — guardados', items: owned.map(k => ({ label: D.EQUIP[k].name, right: statTxt(D.EQUIP[k]) })) });
    if (i < 0) return;
    equip(h, owned[i]);
    G.toast(h.name + ' equipou ' + D.EQUIP[owned[i]].name + '.');
  }
  function statTxt(e) { return e.slot === 'arma' ? 'Atq+' + e.atk + (e.mag ? ' Ess+' + e.mag : '') : 'Def+' + e.def; }
  function equip(h, key) {
    const e = D.EQUIP[key];
    const slot = e.slot === 'arma' ? 'weapon' : 'armor';
    const old = h[slot];
    if (old && D.EQUIP[old].price > 0) D.give(old, 1);
    h[slot] = key; if (G.state.inv[key]) G.state.inv[key]--;
    D.recalc(h);
  }
  G.equip = equip;
  // recebe um equipamento (baú/loja): equipa se for melhor, senão guarda
  G.receiveEquip = async function (key) {
    const e = D.EQUIP[key];
    const cands = G.state.party.filter(h => !e.who || e.who === h.id);
    const val = (k) => { const x = D.EQUIP[k]; return (x.atk || 0) + (x.def || 0) + (x.mag || 0); };
    let best = null;
    for (const h of cands) { const cur = h[e.slot === 'arma' ? 'weapon' : 'armor']; if (val(key) > val(cur) && (!best || val(h[e.slot === 'arma' ? 'weapon' : 'armor']) < val(best[e.slot === 'arma' ? 'weapon' : 'armor']))) best = h; }
    D.give(key, 1);
    if (best) { equip(best, key); await G.say(null, best.name + ' equipou ' + e.name + '. (' + statTxt(e) + ')'); }
    else await G.say(null, e.name + ' foi guardado. (Menu → Equipar)');
  };

  // ---------- Loja ----------
  G.shop = async function (who, goods, innPrice) {
    const panel = { update() {}, draw(ctx) { G.win(ctx, G.W - 96, 6, 90, 20); G.text(ctx, G.state.fr + ' frag.', G.W - 12, 11, '#ffcf6a', 8, 'right', true); } };
    G.overlays.push(panel);
    for (;;) {
      const opts = ['Comprar', innPrice != null ? 'Descansar (' + innPrice + ')' : null, 'Sair'].filter(Boolean);
      const i = await G.menu({ x: 6, y: 6, w: 120, items: opts, title: who });
      if (i < 0 || opts[i] === 'Sair') break;
      if (opts[i] === 'Comprar') {
        for (;;) {
          const items = goods.map(k => { const it = D.ITEMS[k] || D.EQUIP[k]; return { label: it.name, right: it.price, disabled: it.price > G.state.fr }; });
          const j = await G.menu({ x: 6, y: 30, w: 210, items, title: 'Mercadorias', maxRows: 8, help: j => { const k = goods[j]; if (D.ITEMS[k]) return D.ITEMS[k].desc + '  (tem ' + (G.state.inv[k] || 0) + ')'; const e = D.EQUIP[k]; return statTxt(e) + ' — ' + (e.who ? D.HEROES[e.who].name : 'todos'); } });
          if (j < 0) break;
          const k = goods[j];
          if (D.ITEMS[k]) {
            const it = D.ITEMS[k]; G.state.fr -= it.price; D.give(k); G.Audio.sfx('chest'); G.toast('Comprou ' + it.name + '.');
          } else {
            const e = D.EQUIP[k];
            const h = await pickHero('Para quem?', x => !e.who || e.who === x.id);
            if (!h) continue;
            G.state.fr -= e.price; G.Audio.sfx('chest');
            D.give(k, 1); equip(h, k);
            G.toast(h.name + ' equipou ' + e.name + '.');
          }
        }
      } else {
        if (G.state.fr < innPrice) { await G.say(who, 'Sem fragmentos, sem fogueira.'); continue; }
        G.state.fr -= innPrice;
        await G.rest();
      }
    }
    G.pop(panel);
  };
  G.rest = async function () {
    await G.fade(1, 20);
    D.healAll(); G.Audio.sfx('heal');
    await G.wait(30);
    await G.fade(0, 20);
    await G.say(null, 'O grupo descansou. HP e EP restaurados.');
  };

  // ---------- Fim de jogo ----------
  G.gameOver = async function () {
    G.Audio.play('gameover');
    await G.fade(1, 40, '#1a0000');
    const ov = { update() {}, draw(ctx) {
      ctx.fillStyle = '#0a0000'; ctx.fillRect(0, 0, G.W, G.H);
      G.gfx.glow(ctx, G.W / 2, 90, 80, 'rgba(120,0,20,0.6)');
      G.text(ctx, 'O Abismo reclama o que é seu.', G.W / 2, 70, '#d8b0a8', 11, 'center');
      G.text(ctx, '"O que voltou não morreu."', G.W / 2, 92, '#8a6a68', 9, 'center');
    } };
    G.overlays.push(ov); G.fadeA = 0;
    const has = D.hasSave();
    const i = await G.menu({ x: G.W / 2 - 80, y: 130, w: 160, items: [{ label: 'Voltar ao último registro', disabled: !has }, 'Voltar ao título'], cancel: false, index: has ? 0 : 1 });
    G.pop(ov);
    G.overlays.length = 0;
    if (i === 0) G.loadGame(); else G.titleScreen();
  };
})();
