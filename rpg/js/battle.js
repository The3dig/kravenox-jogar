'use strict';
// Batalha por turnos no estilo Phantasy Star.
(function () {
  const D = G.data, X = G.gfx;
  const BASE = 134;          // linha do chão dos inimigos
  const PW_Y = 168;          // janela do grupo

  const B = G.Battle = { dialogTop: true };

  function mkEnemy(id, i, n) {
    const d = D.ENEMIES[id];
    const e = { ...d, def0: d.def, maxhp: d.hp, hp: d.hp, status: {}, alive: true, flash: 0, shake: 0, dying: 0, idx: i };
    return e;
  }
  function layout() {
    const live = B.enemies;
    const n = live.length;
    // a área à direita do menu de comandos (x 88..316)
    const sum = live.reduce((s, e) => s + e.w, 0);
    const gap = n > 1 ? Math.min(10, (226 - sum) / (n - 1)) : 0;
    const total = sum + (n - 1) * gap;
    let x = 202 - total / 2;
    for (const e of live) { e.x = x + e.w / 2; x += e.w + gap; }
  }
  const party = () => G.state.party;
  const alive = arr => arr.filter(a => a.alive);
  const rnd = () => G.rand(0.88, 1.12);

  B.say = async function (text, frames = 40) {
    B.msg = text;
    if (G.debug.auto) { await G.wait(1); return; }
    let t = 0;
    while (t < frames) { await G.wait(1); t++; if (G.Input.pressed.a && t > 6) break; }
  };

  // ---------- Efeitos ----------
  function addFx(f) { B.fxs.push(f); }
  function numFx(x, y, txt, color) { addFx({ t: 0, life: 50, draw(ctx) { const k = this.t / this.life; ctx.globalAlpha = 1 - Math.max(0, k - 0.7) / 0.3; G.text(ctx, txt, x, y - Math.min(14, this.t * 0.8), color, 10, 'center', true); ctx.globalAlpha = 1; } }); }
  function slotX(i) { const w = (G.W - 12) / 3; return 6 + w * i + w / 2; }
  function playFx(kind, targets, onParty) {
    const pts = targets.map(t => onParty ? { x: slotX(party().indexOf(t)), y: PW_Y + 10 } : { x: t.x, y: BASE - t.h * 0.5, base: BASE, w: t.w, h: t.h });
    switch (kind) {
      case 'spines': case 'spinesAll': case 'silver':
        G.Audio.sfx('spines');
        for (const p of pts) addFx({ t: 0, life: 26, draw(ctx) {
          const k = this.t / this.life, n = 9;
          for (let i = 0; i < n; i++) { const xx = p.x - p.w * 0.45 + (p.w * 0.9) * i / (n - 1), hgt = (14 + (i % 3) * 10) * Math.sin(Math.min(1, k * 2.2) * Math.PI / 2) * (k > 0.75 ? (1 - k) * 4 : 1);
            ctx.fillStyle = kind === 'silver' ? '#dfe8ff' : '#06040a'; ctx.beginPath(); ctx.moveTo(xx - 3, (p.base || p.y)); ctx.lineTo(xx + (i % 2 ? 2 : -2), (p.base || p.y) - hgt * 2.2); ctx.lineTo(xx + 3, (p.base || p.y)); ctx.fill();
            ctx.fillStyle = kind === 'silver' ? '#fff' : '#8a1a2a'; ctx.fillRect(xx, (p.base || p.y) - hgt * 2.2, 1, 3); }
        } });
        break;
      case 'dark': case 'slash':
        G.Audio.sfx('dark');
        for (const p of pts) addFx({ t: 0, life: 30, draw(ctx) {
          const k = this.t / this.life;
          if (kind === 'slash') { ctx.strokeStyle = '#100410'; ctx.lineWidth = 5 * (1 - k); ctx.beginPath(); ctx.moveTo(p.x - 40, p.y - 40); ctx.lineTo(p.x - 40 + 80 * Math.min(1, k * 3), p.y - 40 + 80 * Math.min(1, k * 3)); ctx.stroke(); ctx.strokeStyle = '#ff3a5a'; ctx.lineWidth = 1; ctx.stroke(); }
          else for (let i = 0; i < 10; i++) { const a = i * 0.63 + k * 6, r = 30 * (1 - k); ctx.fillStyle = i % 2 ? '#3a0a3a' : '#0a0410'; ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 4, 0, 7); ctx.fill(); }
        } });
        break;
      case 'light': case 'white':
        G.Audio.sfx('light');
        for (const p of pts) addFx({ t: 0, life: 30, draw(ctx) { const k = this.t / this.life; X.glow(ctx, p.x, p.y, 10 + 50 * k, kind === 'white' ? 'rgba(240,240,255,0.95)' : 'rgba(255,224,138,0.95)', 1 - k);
          ctx.strokeStyle = kind === 'white' ? '#fff' : '#ffe08a'; ctx.globalAlpha = 1 - k; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.moveTo(p.x + Math.cos(a) * 8, p.y + Math.sin(a) * 8); ctx.lineTo(p.x + Math.cos(a) * (14 + 40 * k), p.y + Math.sin(a) * (14 + 40 * k)); } ctx.stroke(); ctx.globalAlpha = 1; } });
        break;
      case 'violet':
        G.Audio.sfx('dark'); G.flash('#b26bff', 0.5); break;
      case 'heal': case 'memory': case 'shield':
        G.Audio.sfx(kind === 'memory' ? 'memory' : kind === 'shield' ? 'light' : 'heal');
        for (const p of pts) addFx({ t: 0, life: 40, draw(ctx) { const k = this.t / this.life;
          for (let i = 0; i < 8; i++) { ctx.fillStyle = kind === 'heal' ? '#c8ffb0' : kind === 'shield' ? '#ffe08a' : '#e8ecff'; ctx.globalAlpha = 1 - k; ctx.fillRect(p.x - 28 + i * 8, p.y + 10 - k * 30 - (i % 3) * 5, 2, 2); }
          ctx.globalAlpha = 1; } });
        break;
    }
  }

  // ---------- Fórmulas ----------
  function physDmg(a, d) {
    const def = d.def * (d.status.shield ? 1.5 : 1);
    let dmg = Math.max(1, Math.round((a.atk - def * 0.55) * rnd()));
    if (d.status.guard) dmg = Math.ceil(dmg / 2);
    return dmg;
  }
  function techDmg(a, d, tech) {
    const stat = (tech.stat === 'mag' ? a.mag : a.atk);
    let dmg = Math.max(1, Math.round((stat * tech.pow - d.def * 0.4) * rnd()));
    if (tech.holy && d.void) dmg = Math.round(dmg * 1.4);
    if (d.status && d.status.guard) dmg = Math.ceil(dmg / 2);
    return dmg;
  }

  async function hurtEnemy(e, dmg, crit) {
    e.hp = Math.max(0, e.hp - dmg); e.flash = 10; e.shake = 12;
    numFx(e.x, BASE - e.h - 4, String(dmg), crit ? '#ffcf6a' : '#ffffff');
    G.Audio.sfx(crit ? 'crit' : 'hit');
    if (e.status.sleep) e.status.sleep = 0;
    if (e.hp <= 0) { e.alive = false; e.dying = 1; G.Audio.sfx('die'); }
  }
  async function hurtHero(h, dmg) {
    h.hp = Math.max(0, h.hp - dmg);
    B.slotFlash[party().indexOf(h)] = 12; G.shake = 8;
    numFx(slotX(party().indexOf(h)), PW_Y - 4, String(dmg), '#ff6a5a');
    G.Audio.sfx('hurt');
    if (h.hp <= 0) { h.alive = false; h.status = {}; await B.say(h.name + ' caiu!', 36); }
  }

  // ---------- Seleção de alvo ----------
  function pickEnemy() {
    return new Promise(res => {
      const live = alive(B.enemies); let i = 0;
      if (G.debug.auto) { res(live[0]); return; }
      const ov = {
        update() {
          const d = G.Input.dirPressed();
          if (d === 'left' || d === 'up') { i = (i + live.length - 1) % live.length; G.Audio.sfx('blip'); }
          if (d === 'right' || d === 'down') { i = (i + 1) % live.length; G.Audio.sfx('blip'); }
          if (G.Input.pressed.a) { G.Audio.sfx('ok'); G.pop(ov); res(live[i]); }
          else if (G.Input.pressed.b) { G.Audio.sfx('back'); G.pop(ov); res(null); }
        },
        draw(ctx) {
          const e = live[i]; const y = BASE - e.h - 14 + Math.sin(G.time / 6) * 2;
          ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.moveTo(e.x - 5, y); ctx.lineTo(e.x + 5, y); ctx.lineTo(e.x, y + 6); ctx.fill();
          G.win(ctx, 6, 4, G.W - 12, 18); G.text(ctx, e.name, 14, 8, '#efe3cf', 8);
          const hpk = e.hp / e.maxhp; ctx.fillStyle = '#3a1418'; ctx.fillRect(G.W - 80, 10, 64, 4); ctx.fillStyle = hpk > 0.5 ? '#c8a050' : hpk > 0.2 ? '#d07030' : '#d03030'; ctx.fillRect(G.W - 80, 10, 64 * hpk, 4);
        },
      };
      G.push(ov);
    });
  }
  async function pickAlly(fallen) {
    const p = party();
    const items = p.map(h => ({ label: h.name, right: h.alive ? h.hp + '/' + h.maxhp : 'caído', disabled: fallen ? h.alive : !h.alive }));
    if (G.debug.auto) { const i = p.findIndex(h => fallen ? !h.alive : h.alive); return i >= 0 ? p[i] : null; }
    const i = await G.menu({ x: 90, y: 86, w: 130, items, title: 'Em quem?' });
    return i < 0 ? null : p[i];
  }

  // ---------- Comandos ----------
  async function chooseCommand(h, idx) {
    for (;;) {
      const cmds = ['Atacar', 'Técnica', 'Item', 'Defender', 'Fugir'];
      const items = cmds.map((c, i) => ({ label: c, disabled: (i === 1 && D.techsOf(h).length === 0) || (i === 2 && !Object.keys(G.state.inv).some(k => G.state.inv[k] > 0)) || (i === 4 && B.opt.noEscape) }));
      let pick = G.debug.auto ? (G.debug.battlePick ? G.debug.battlePick(h, B) : 0) : await G.menu({ x: 6, y: 82, w: 78, items, title: h.name, index: h.lastCmd || 0, cancel: idx > 0 });
      if (typeof pick === 'object' && pick) return pick;
      if (pick < 0) return null; // volta para o anterior
      h.lastCmd = pick;
      if (pick === 0) { const t = await pickEnemy(); if (t) return { type: 'atk', target: t }; }
      else if (pick === 1) {
        const ts = D.techsOf(h);
        const ti = await G.menu({ x: 70, y: 60, w: 168, title: 'Técnicas — EP ' + h.ep + '/' + h.mep,
          items: ts.map(k => ({ label: D.TECHS[k].name, right: D.TECHS[k].ep, disabled: D.TECHS[k].ep > h.ep || D.TECHS[k].target === 'aliadoCaido' && !party().some(p => !p.alive) })),
          help: i => D.TECHS[ts[i]].desc, maxRows: 6 });
        if (ti >= 0) { const tg = await pickTarget(D.TECHS[ts[ti]].target); if (tg) return { type: 'tech', tech: ts[ti], target: tg }; }
      } else if (pick === 2) {
        const keys = Object.keys(G.state.inv).filter(k => G.state.inv[k] > 0 && D.ITEMS[k]);
        const ii = await G.menu({ x: 70, y: 60, w: 168, title: 'Itens', items: keys.map(k => ({ label: D.ITEMS[k].name, right: 'x' + G.state.inv[k], disabled: D.ITEMS[k].target === 'fuga' && B.opt.noEscape })), help: i => D.ITEMS[keys[i]].desc, maxRows: 6 });
        if (ii >= 0) { const it = D.ITEMS[keys[ii]]; const tg = await pickTarget(it.target); if (tg) return { type: 'item', item: keys[ii], target: tg }; }
      } else if (pick === 3) return { type: 'guard' };
      else if (pick === 4) return { type: 'flee' };
    }
  }
  async function pickTarget(kind) {
    if (kind === 'inimigo') return await pickEnemy();
    if (kind === 'inimigos') return 'all';
    if (kind === 'aliado') return await pickAlly(false);
    if (kind === 'aliadoCaido') return await pickAlly(true);
    if (kind === 'aliados' || kind === 'fuga' || kind === 'eu') return 'all';
    return 'all';
  }

  // ---------- Execução ----------
  async function heroAct(h, act) {
    if (!h.alive) return;
    if (h.status.sleep) { h.status.sleep--; await B.say(h.name + ' está preso numa lembrança...', 30); return; }
    let tgt = act.target;
    if (tgt && tgt !== 'all' && tgt.maxhp && D.ENEMIES[tgt.id] && !tgt.alive) { const l = alive(B.enemies); if (!l.length) return; tgt = G.pick(l); }
    if (act.type === 'atk') {
      await B.say(h.name + ' ataca!', 14);
      h.lunge = 10;
      const miss = Math.random() < 0.04 + Math.max(0, (tgt.agi - h.agi)) * 0.006;
      if (miss) { G.Audio.sfx('miss'); await B.say('Errou!', 24); return; }
      let dmg = physDmg(h, tgt); const crit = Math.random() < 1 / 14; if (crit) dmg = Math.round(dmg * 1.6);
      playFx(h.id === 'kravenox' ? 'slash' : 'light', [tgt]);
      await G.wait(8);
      await hurtEnemy(tgt, dmg, crit);
      await B.say(crit ? 'Golpe crítico! ' + dmg + ' de dano.' : tgt.name + ' sofre ' + dmg + ' de dano.', 30);
    } else if (act.type === 'tech') {
      const T = D.TECHS[act.tech];
      if (h.ep < T.ep) { await B.say('EP insuficiente.', 24); return; }
      h.ep -= T.ep;
      await B.say(h.name + ': ' + T.name + '!', 22);
      if (T.kind === 'dano' || T.kind === 'dreno') {
        const ts = tgt === 'all' ? alive(B.enemies) : [tgt];
        playFx(T.fx, ts); await G.wait(14);
        let total = 0;
        for (const e of ts) { const d = techDmg(h, e, T); total += d; await hurtEnemy(e, d, false); await G.wait(4); }
        if (T.kind === 'dreno') { const heal = Math.round(total * 0.5); h.hp = Math.min(h.maxhp, h.hp + heal); numFx(slotX(party().indexOf(h)), PW_Y - 4, '+' + heal, '#9aff8a'); }
        await B.say(ts.length > 1 ? 'Os espinhos atravessam todos!' : ts[0].name + ' sofre ' + total + ' de dano.', 28);
      } else if (T.kind === 'cura') {
        const ts = tgt === 'all' ? alive(party()) : [tgt];
        playFx(T.fx, ts, true); await G.wait(10);
        for (const p of ts) { const v = Math.round((h.mag * T.pow + T.base) * rnd()); p.hp = Math.min(p.maxhp, p.hp + v); numFx(slotX(party().indexOf(p)), PW_Y - 4, '+' + v, '#9aff8a'); }
        await B.say(ts.length > 1 ? 'O grupo se recupera.' : ts[0].name + ' se recupera.', 28);
      } else if (T.kind === 'escudo') {
        playFx('shield', alive(party()), true);
        for (const p of alive(party())) p.status.shield = 4;
        await B.say('Uma barreira de luz envolve o grupo.', 30);
      } else if (T.kind === 'sono') {
        playFx('memory', alive(B.enemies)); let n = 0;
        for (const e of alive(B.enemies)) { if (Math.random() < T.chance * (e.boss ? 0.25 : 1)) { e.status.sleep = 2; n++; } }
        await B.say(n ? 'Os inimigos ficam presos em lembranças antigas.' : 'As lembranças não os alcançam.', 32);
      } else if (T.kind === 'reviver') {
        if (tgt.alive) { await B.say('Nada acontece.', 24); return; }
        playFx('heal', [tgt], true); tgt.alive = true; tgt.hp = Math.round(tgt.maxhp * 0.5);
        await B.say(tgt.name + ' volta a lutar!', 30);
      }
    } else if (act.type === 'item') {
      const it = D.ITEMS[act.item];
      if (!G.state.inv[act.item]) { await B.say('Não há mais.', 24); return; }
      G.state.inv[act.item]--;
      await B.say(h.name + ' usa ' + it.name + '.', 20);
      await G.useItemOn(act.item, tgt, true);
    } else if (act.type === 'guard') {
      // já aplicado no início da rodada
    }
  }
  G.useItemOn = async function (key, tgt, inBattle) {
    const it = D.ITEMS[key];
    const ts = tgt === 'all' ? party().filter(p => it.target === 'aliados' ? true : p.alive) : [tgt];
    for (const p of ts) {
      if (it.revive) { if (!p.alive) { p.alive = true; p.hp = Math.round(p.maxhp * it.revive); } }
      else if (!p.alive && it.target !== 'aliados') continue;
      if (it.target === 'aliados' && !p.alive) { p.alive = true; }
      if (it.heal) p.hp = Math.min(p.maxhp, p.hp + it.heal);
      if (it.ep) p.ep = Math.min(p.mep, p.ep + it.ep);
      if (inBattle) { playFx('heal', [p], true); numFx(slotX(party().indexOf(p)), PW_Y - 4, it.ep && !it.heal ? '+' + it.ep + ' EP' : '+' + Math.min(it.heal || 0, 999), '#9aff8a'); }
      else G.Audio.sfx('heal');
    }
    if (inBattle) await G.wait(20);
  };

  async function enemyAct(e) {
    if (!e.alive) return;
    if (e.status.sleep) { e.status.sleep--; await B.say(e.name + ' está preso nas lembranças.', 26); return; }
    const total = e.acts.reduce((s, a) => s + a.w, 0); let r = Math.random() * total, a = e.acts[0];
    for (const x of e.acts) { r -= x.w; if (r <= 0) { a = x; break; } }
    const targets = alive(party()); if (!targets.length) return;
    e.lunge = 12;
    if (a.type === 'atk') {
      const t = G.pick(targets);
      await B.say(e.name + ' ataca!', 16);
      if (Math.random() < 0.05 + Math.max(0, t.agi - e.agi) * 0.006) { G.Audio.sfx('miss'); await B.say(t.name + ' se esquiva!', 24); return; }
      await hurtHero(t, physDmg(e, t));
    } else if (a.target === 'cura') {
      await B.say(e.name + ' ' + a.name + '.', 24);
      e.hp = Math.min(e.maxhp, e.hp + a.heal); playFx('heal', [e]);
    } else {
      await B.say(e.name + ' ' + a.name + '!', 26);
      if (a.fx === 'violet') G.flash('#b26bff', 0.5); else if (a.fx === 'white') G.flash('#ffffff', 0.6); else G.flash('#3a0010', 0.5);
      G.Audio.sfx('dark');
      const ts = a.target === 'todos' ? targets : [G.pick(targets)];
      for (const t of ts) {
        let dmg = Math.max(1, Math.round((e.atk * a.pow - t.def * (t.status.shield ? 0.82 : 0.55)) * rnd()));
        if (t.status.guard) dmg = Math.ceil(dmg / 2);
        await hurtHero(t, dmg);
        if (a.drainEp && t.alive) { t.ep = Math.max(0, t.ep - a.drainEp); }
        if (a.drain) { e.hp = Math.min(e.maxhp, e.hp + Math.round(dmg * 0.5)); }
        if (a.sleep && t.alive && Math.random() < a.sleep) t.status.sleep = 1;
        await G.wait(6);
      }
      if (a.drainEp) await B.say('A Essência do grupo enfraquece.', 22);
    }
  }

  async function checkEvents() {
    for (const ev of (B.opt.events || [])) {
      if (ev.done) continue;
      if (ev.when(B)) { ev.done = true; const r = await ev.run(B); if (r) return r; }
    }
    return null;
  }

  // ---------- Laço da batalha ----------
  G.battle = async function (ids, opt = {}) {
    const prev = G.scene;
    B.opt = opt; B.enemies = ids.map((id, i) => mkEnemy(id, i, ids.length)); layout();
    B.fxs = []; B.msg = null; B.bg = opt.bg || 'planicie'; B.slotFlash = [0, 0, 0]; B.turnHero = -1;
    for (const h of party()) { h.status = {}; h.lunge = 0; }
    const music = opt.music || (B.enemies.some(e => e.boss) ? 'chefe' : 'batalha');
    G.Audio.sfx('enc');
    if (!opt.noTransition) { await transition(); }
    G.scene = B; G.Audio.play(music);
    await G.fade(0, 12);
    const names = {}; for (const e of B.enemies) names[e.name] = (names[e.name] || 0) + 1;
    await B.say(opt.intro || Object.entries(names).map(([n, c]) => c > 1 ? n + ' x' + c : n).join(', ') + (B.enemies.length > 1 ? ' surgem!' : ' surge!'), 44);
    let result = null;
    for (let round = 1; !result; round++) {
      B.round = round;
      // escolhas do grupo
      const acts = [];
      const hs = party();
      for (let i = 0; i < hs.length; i++) {
        const h = hs[i]; h.status.guard = 0;
        if (!h.alive || h.status.sleep) { acts[i] = null; continue; }
        B.turnHero = i; B.msg = null;
        const a = await chooseCommand(h, i);
        if (a === null) { // voltar
          let j = i - 1; while (j >= 0 && (!hs[j].alive || hs[j].status.sleep)) j--;
          if (j >= 0) { i = j - 1; continue; } i = -1; continue;
        }
        acts[i] = a;
        if (a.type === 'flee') break;
      }
      B.turnHero = -1;
      if (acts.some(a => a && a.type === 'flee')) {
        const pa = alive(hs).reduce((s, h) => s + h.agi, 0) / Math.max(1, alive(hs).length);
        const ea = alive(B.enemies).reduce((s, e) => s + e.agi, 0) / Math.max(1, alive(B.enemies).length);
        await B.say('Kravenox tenta fugir...', 24);
        if (Math.random() < 0.55 + (pa - ea) * 0.04) { G.Audio.sfx('back'); await B.say('Fugiram!', 26); result = 'flee'; break; }
        await B.say('Não conseguiram escapar!', 28);
        acts.length = 0;
      }
      // fuga por item
      const fi = acts.findIndex(a => a && a.type === 'item' && D.ITEMS[a.item].target === 'fuga');
      if (fi >= 0) { G.state.inv[acts[fi].item]--; await B.say('A névoa encobre o grupo. Fugiram!', 32); result = 'flee'; break; }
      hs.forEach((h, i) => { if (acts[i] && acts[i].type === 'guard') { h.status.guard = 1; } });
      // ordem por agilidade
      const order = [];
      hs.forEach((h, i) => { if (acts[i] && acts[i].type !== 'guard') order.push({ hero: h, act: acts[i], s: h.agi * G.rand(0.7, 1.3) + (acts[i].type === 'item' ? 4 : 0) }); });
      B.enemies.forEach(e => { if (e.alive) order.push({ enemy: e, s: e.agi * G.rand(0.7, 1.3) }); });
      order.sort((a, b) => b.s - a.s);
      for (const o of order) {
        if (o.hero) await heroAct(o.hero, o.act); else await enemyAct(o.enemy);
        const evr = await checkEvents(); if (evr) { result = evr; break; }
        if (!alive(B.enemies).length) { result = 'win'; break; }
        if (!alive(hs).length) { result = 'lose'; break; }
      }
      // fim da rodada
      for (const h of hs) { if (h.status.shield) h.status.shield--; }
      if (!result) { const evr = await checkEvents(); if (evr) result = evr; }
    }
    B.turnHero = -1;
    if (result === 'win' && !opt.noRewards) await rewards();
    if (result === 'lose') {
      if (opt.canLose) { G.scene = prev; return 'lose'; }
      await G.gameOver(); throw G.ABORT;
    }
    if (result === 'end') result = 'win';
    await G.fade(1, 14);
    for (const h of party()) { h.status = {}; if (!h.alive) h.hp = 0; }
    G.scene = prev; B.msg = null;
    if (prev && prev.map) G.Audio.play(prev.map.music);
    await G.fade(0, 14);
    return result;
  };
  async function transition() {
    // efeito de "quebra" antes da batalha
    let t = 0;
    const f = { layer: 'top', upd() { return ++t < 24; }, draw(ctx) { ctx.fillStyle = '#000'; for (let i = 0; i < 12; i++) { const w = G.W * Math.min(1, t / 20) * ((i % 2) ? 1 : 0.8); ctx.fillRect(i % 2 ? 0 : G.W - w, i * 20, w, 20); } } };
    G.fx.push(f); await G.wait(24); G.fadeA = 1;
  }
  async function rewards() {
    const xp = B.enemies.reduce((s, e) => s + (e.xp || 0), 0), fr = B.enemies.reduce((s, e) => s + (e.fr || 0), 0);
    G.Audio.play('vitoria');
    await B.say('Vitória!', 40);
    if (xp || fr) { G.state.fr += fr; await B.say('Ganharam ' + xp + ' de experiência e ' + fr + ' fragmentos.', 60); }
    for (const h of party()) {
      h.xp += h.alive ? xp : Math.floor(xp / 2);
      while (h.xp >= D.xpTotal(h.lv + 1) && h.lv < 99) {
        const before = D.techsOf(h);
        h.lv++; const om = h.maxhp, oe = h.mep; D.recalc(h);
        if (h.alive) { h.hp += h.maxhp - om; h.ep += h.mep - oe; }
        G.Audio.sfx('level');
        await B.say(h.name + ' chegou ao nível ' + h.lv + '!', 50);
        for (const t of D.techsOf(h)) if (!before.includes(t)) await B.say(h.name + ' aprendeu ' + D.TECHS[t].name + '!', 56);
      }
    }
    // pequena chance de item
    if (Math.random() < 0.18) { const it = Math.random() < 0.75 ? 'seiva' : 'cristal'; D.give(it); await B.say('Encontraram ' + D.ITEMS[it].name + '.', 40); }
  }

  G.randomBattle = async function (table, bg) {
    const groups = D.ENC[table]; if (!groups) return;
    const grp = G.pick(groups);
    await G.battle(grp, { bg });
  };

  // ---------- Desenho ----------
  B.tick = function () {
    for (const f of (B.fxs || [])) f.t++;
    if (B.fxs) B.fxs = B.fxs.filter(f => f.t < f.life);
    for (const e of (B.enemies || [])) { if (e.flash) e.flash--; if (e.shake) e.shake--; if (e.lunge) e.lunge--; if (e.dying && e.dying < 40) e.dying++; }
    for (let i = 0; i < 3; i++) if (B.slotFlash[i]) B.slotFlash[i]--;
  };
  B.draw = function (ctx) {
    X.drawBG(ctx, B.bg, G.time, 150);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 150, G.W, G.H - 150);
    for (const e of B.enemies) {
      if (!e.alive && e.dying >= 40) continue;
      const img = X.enemyImg(e);
      const bob = Math.sin(G.time / 18 + e.idx) * (e.art === 'ghost' || e.art === 'shards' ? 3 : 1);
      const sx = Math.round(e.x - e.w / 2 + (e.shake ? (e.shake % 4 < 2 ? 2 : -2) : 0)), sy = Math.round(BASE - e.h + bob + (e.lunge ? Math.sin(e.lunge / 12 * Math.PI) * 6 : 0));
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(e.x, BASE, e.w * 0.4, 4, 0, 0, 7); ctx.fill();
      if (e.boss) X.glow(ctx, e.x, BASE - e.h / 2, e.h * 0.7, e.void ? 'rgba(120,0,30,0.5)' : 'rgba(200,200,255,0.3)', 0.6 + 0.2 * Math.sin(G.time / 20));
      if (e.dying) { ctx.globalAlpha = Math.max(0, 1 - e.dying / 40); }
      if (e.status.sleep) ctx.globalAlpha *= 0.7;
      ctx.drawImage(img, sx, e.dying ? sy + e.dying * 0.5 : sy);
      if (e.flash && (e.flash & 2)) { ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(img, sx, sy); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = 1;
      if (e.status.sleep && e.alive) G.text(ctx, 'z', e.x + e.w * 0.3, BASE - e.h - 6 + Math.sin(G.time / 10) * 3, '#e8ecff', 9);
    }
    for (const f of B.fxs) f.draw(ctx);
    drawParty(ctx);
    if (B.msg) { G.win(ctx, 6, 4, G.W - 12, 20); G.text(ctx, B.msg, 14, 9, '#f1e6d2', 9); }
  };
  function drawParty(ctx) {
    const p = party(), w = (G.W - 12) / 3;
    G.win(ctx, 6, PW_Y, G.W - 12, G.H - PW_Y - 4);
    p.forEach((h, i) => {
      const x = 6 + i * w + 8, y = PW_Y + 6;
      if (B.turnHero === i) { ctx.fillStyle = 'rgba(201,162,74,0.18)'; ctx.fillRect(x - 5, y - 3, w - 6, G.H - PW_Y - 14); }
      if (B.slotFlash[i] & 2) { ctx.fillStyle = 'rgba(255,40,40,0.3)'; ctx.fillRect(x - 5, y - 3, w - 6, G.H - PW_Y - 14); }
      const nameCol = !h.alive ? '#8a4a4a' : h.hp < h.maxhp * 0.25 ? '#ff9a6a' : '#ffcf6a';
      G.text(ctx, h.name, x, y, nameCol, 9, 'left', true);
      G.text(ctx, 'Nv ' + h.lv, x + w - 18, y + 1, '#a89a8a', 7, 'right');
      bar(ctx, x, y + 15, w - 22, h.hp / h.maxhp, '#c84040', '#3a1214');
      G.text(ctx, 'HP ' + h.hp + '/' + h.maxhp, x, y + 20, '#efe3cf', 8);
      bar(ctx, x, y + 33, w - 22, h.ep / Math.max(1, h.mep), '#5a8ad8', '#141c3a');
      G.text(ctx, 'EP ' + h.ep + '/' + h.mep, x, y + 38, '#c8d4f0', 8);
      let st = []; if (h.status.shield) st.push('Barreira'); if (h.status.guard) st.push('Defende'); if (h.status.sleep) st.push('Lembrança');
      if (st.length) G.text(ctx, st.join(' '), x, y + 50, '#e0c060', 7);
    });
  }
  function bar(ctx, x, y, w, k, c, bg) { ctx.fillStyle = bg; ctx.fillRect(x, y, w, 3); ctx.fillStyle = c; ctx.fillRect(x, y, Math.max(0, w * G.clamp(k, 0, 1)), 3); }
  G.bar = bar;
})();
