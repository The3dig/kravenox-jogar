'use strict';
// Batalha por turnos no estilo Phantasy Star.
(function () {
  const D = G.data, X = G.gfx;
  const PW_Y = 188;          // janela do grupo
  const VIEW_H = 174;        // altura do quadro da batalha

  const B = G.Battle = { dialogTop: true };

  function mkEnemy(id, i, n) {
    const d = D.ENEMIES[id];
    const e = { ...d, def0: d.def, maxhp: d.hp, hp: d.hp, status: {}, alive: true, flash: 0, shake: 0, dying: 0, idx: i };
    return e;
  }
  function layout() {
    const live = B.enemies;
    const n = live.length;
    // arena isométrica: inimigos numa diagonal no alto à esquerda, olhando para o grupo
    const sum = live.reduce((s, e) => s + e.w, 0);
    const gap = n > 1 ? Math.max(-14, Math.min(10, (190 - sum) / (n - 1))) : 0;
    const total = sum + (n - 1) * gap;
    let d = -total / 2;
    const big = live.some(e => e.h > 70);
    const cx = 104, cy = big ? 118 : 108;
    for (const e of live) { const m = d + e.w / 2; e.x = Math.round(cx + m * 0.894); e.by = Math.round(cy - m * 0.447 + (e.h > 90 ? 20 : 0)); d += e.w + gap; }
  }
  const party = () => G.state.party;
  // posições dos heróis no campo, em diagonal (estilo Super Mario RPG)
  const HOME = [[240, 150], [208, 165], [274, 134]];
  const hs = i => (B.hs[i] || (B.hs[i] = { ox: 0, oy: 0, flash: 0, shake: 0, kb: 0, walk: false, cast: null, jump: 0 }));
  function heroAt(h) { const i = party().indexOf(h), [x, y] = HOME[i] || HOME[0], s = hs(i); return { x: x + s.ox + s.kb, y: y + s.oy, i }; }
  async function moveHero(i, tx, ty, frames) {
    const s = hs(i), [hx, hy] = HOME[i], fx = s.ox, fy = s.oy, dx = tx - hx, dy = ty - hy;
    s.walk = true;
    for (let f = 1; f <= frames; f++) { const k = f / frames; s.ox = fx + (dx - fx) * k; s.oy = fy + (dy - fy) * k - Math.sin(k * Math.PI) * 4; await G.wait(1); }
    s.walk = false;
  }
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
  function numFx(x, y, txt, color) { addFx({ t: 0, life: 50, ui: y >= PW_Y - 10, draw(ctx) {
    const k = this.t / this.life, yy = y - (this.t < 10 ? Math.sin(this.t / 10 * Math.PI) * 8 : 0) - Math.max(0, this.t - 30) * 0.4;
    ctx.globalAlpha = 1 - Math.max(0, k - 0.7) / 0.3;
    ctx.font = G.font(11, true); ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.strokeText(txt, x, yy); ctx.fillStyle = color; ctx.fillText(txt, x, yy);
    ctx.globalAlpha = 1; } }); }
  function slotX(i) { const w = Math.floor((G.W - 12 - 8) / 3); return 6 + i * (w + 4) + w / 2; }
  function playFx(kind, targets, onParty) {
    const n0 = B.fxs.length;
    playFx2(kind, targets, onParty);
    for (let i = n0; i < B.fxs.length; i++) B.fxs[i].ui = false;
  }
  function playFx2(kind, targets, onParty) {
    const pts = targets.map(t => onParty ? { x: heroAt(t).x, y: heroAt(t).y - 16, base: heroAt(t).y, w: 26, h: 32 } : { x: t.x, y: t.by - t.h * 0.5, base: t.by, w: t.w, h: t.h });
    switch (kind) {
      case 'slash': if (X.imgs.fx_garra1) {
        G.Audio.sfx('hit');
        for (const p of pts) addFx({ t: 0, life: 22, draw(ctx) {
          const k = this.t / this.life, im = this.t < 11 ? X.imgs.fx_garra1 : X.imgs.fx_garra2;
          ctx.globalAlpha = 1 - Math.max(0, k - 0.6) / 0.4;
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(im, Math.round(p.x - im.width / 2 + (this.t < 11 ? -4 : 4)), Math.round(p.y - im.height / 2));
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
        } });
        break;
      } // sem a imagem, cai no desenho antigo
      // falls through
      case 'spines': case 'spinesAll': if (X.imgs.fx_espinhos && kind !== 'slash') {
        G.Audio.sfx('spines');
        for (const p of pts) addFx({ t: 0, life: 30, draw(ctx) {
          const k = this.t / this.life, im = X.imgs.fx_espinhos, grow = Math.min(1, k * 3), h = Math.round(im.height * grow);
          if (h < 1) return;
          ctx.globalAlpha = 1 - Math.max(0, k - 0.65) / 0.35;
          const w = Math.min(im.width, p.w * 1.1), x = Math.round(p.x - w / 2);
          ctx.drawImage(im, 0, im.height - h, im.width, h, x, p.base - h + 4, w, h);
          ctx.globalAlpha = 1;
        } });
        break;
      }
      // falls through
      case 'silver':
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
          if (kind === 'slash') {
            const e2 = Math.min(1, k * 3.5);
            for (let c = -1; c <= 1; c++) {
              const ox = c * 9, x1 = p.x - 26 + ox, y1 = p.y - 30, x2 = x1 + 46 * e2, y2 = y1 + 56 * e2;
              ctx.globalAlpha = 1 - Math.max(0, k - 0.5) * 2;
              ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
              ctx.strokeStyle = '#ff3a2a'; ctx.lineWidth = 2; ctx.stroke();
              ctx.strokeStyle = '#ffe0c0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1 + (x2 - x1) * 0.3, y1 + (y2 - y1) * 0.3); ctx.lineTo(x2, y2); ctx.stroke();
            }
            ctx.globalAlpha = 1;
          }
          else for (let i = 0; i < 10; i++) { const a = i * 0.63 + k * 6, r = 30 * (1 - k); ctx.fillStyle = i % 2 ? '#3a0a3a' : '#0a0410'; ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 4, 0, 7); ctx.fill(); }
        } });
        break;
      case 'light': case 'white':
        G.Audio.sfx('light');
        for (const p of pts) addFx({ t: 0, life: 30, draw(ctx) { const k = this.t / this.life; X.glow(ctx, p.x, p.y, 10 + 50 * k, kind === 'white' ? 'rgba(240,240,255,0.95)' : 'rgba(255,224,138,0.95)', 1 - k);
          ctx.strokeStyle = kind === 'white' ? '#fff' : '#ffe08a'; ctx.globalAlpha = 1 - k; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.moveTo(p.x + Math.cos(a) * 8, p.y + Math.sin(a) * 8); ctx.lineTo(p.x + Math.cos(a) * (14 + 40 * k), p.y + Math.sin(a) * (14 + 40 * k)); } ctx.stroke(); ctx.globalAlpha = 1; } });
        break;
      case 'beam': {
        G.Audio.sfx('dark'); G.Audio.sfx('light');
        const im = X.imgs.fx_raio, orb = X.imgs.fx_orbe;
        for (const p of pts) addFx({ t: 0, life: 34, draw(ctx) {
          const k = this.t / this.life;
          if (!im) return;
          const len = Math.max(20, p.x + 20 - 0) * Math.min(1, k * 4);
          ctx.globalAlpha = 1 - Math.max(0, k - 0.7) / 0.3; ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(im, 0, 0, im.width, im.height, p.x + 20 - len, Math.round(p.y - im.height / 2), len, im.height);
          if (orb && k < 0.5) ctx.drawImage(orb, Math.round(p.x - orb.width / 2), Math.round(p.y - orb.height / 2));
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
        } });
        break;
      }
      case 'slam': {
        G.Audio.sfx('boom'); G.shake = 14; G.flash('#ff2a1a', 0.35);
        const ex = X.imgs.fx_explosao, sp = X.imgs.fx_espinhos2;
        for (const p of pts) addFx({ t: 0, life: 32, draw(ctx) {
          const k = this.t / this.life;
          ctx.globalAlpha = 1 - Math.max(0, k - 0.6) / 0.4;
          if (sp) { const h = Math.round(sp.height * Math.min(1, k * 3)); if (h > 0) ctx.drawImage(sp, 0, sp.height - h, sp.width, h, Math.round(p.x - sp.width / 2), p.base - h + 4, sp.width, h); }
          if (ex) { ctx.globalCompositeOperation = 'lighter'; const s = 0.6 + k; ctx.drawImage(ex, p.x - ex.width * s / 2, p.base - ex.height * s * 0.7, ex.width * s, ex.height * s); ctx.globalCompositeOperation = 'source-over'; }
          ctx.globalAlpha = 1;
        } });
        break;
      }
      case 'fury':
        G.Audio.sfx('dark'); G.flash('#ff1a0a', 0.45); G.shake = 8;
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
  const furyAtk = a => (a.status && a.status.fury ? 1.5 : 1);
  const furyDef = d => (d.status && d.status.fury ? 0.8 : 1);
  function physDmg(a, d) {
    const def = d.def * (d.status.shield ? 1.5 : 1) * furyDef(d);
    let dmg = Math.max(1, Math.round((a.atk * furyAtk(a) - def * 0.55) * rnd()));
    if (d.status.guard) dmg = Math.ceil(dmg / 2);
    return dmg;
  }
  function techDmg(a, d, tech) {
    const stat = (tech.stat === 'mag' ? a.mag : a.atk * furyAtk(a));
    let dmg = Math.max(1, Math.round((stat * tech.pow - d.def * furyDef(d) * 0.4) * rnd()));
    if (tech.holy && d.void) dmg = Math.round(dmg * 1.4);
    if (d.status && d.status.guard) dmg = Math.ceil(dmg / 2);
    return dmg;
  }

  async function hurtEnemy(e, dmg, crit) {
    e.hp = Math.max(0, e.hp - dmg); e.flash = 10; e.shake = 12;
    numFx(e.x, e.by - e.h - 4, String(dmg), crit ? '#ffcf6a' : '#ffffff');
    G.Audio.sfx(crit ? 'crit' : 'hit');
    if (e.status.sleep) e.status.sleep = 0;
    if (e.hp <= 0) { e.alive = false; e.dying = 1; G.Audio.sfx('die'); }
  }
  async function hurtHero(h, dmg) {
    h.hp = Math.max(0, h.hp - dmg);
    const hi = party().indexOf(h), at = heroAt(h);
    B.slotFlash[hi] = 12; G.shake = 6; hs(hi).flash = 14; hs(hi).kb = 8;
    numFx(at.x, at.y - 36, String(dmg), '#ff6a5a');
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
          const e = live[i]; const y = e.by - e.h - 14 + Math.sin(G.time / 6) * 2;
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
      let pick = G.debug.auto ? (G.debug.battlePick ? G.debug.battlePick(h, B) : 0) : await G.menu({ x: 238, y: 12, w: 76, items, title: h.name, index: h.lastCmd || 0, cancel: idx > 0 });
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
      B.msg = h.name + ' ataca!';
      const hi = party().indexOf(h);
      await moveHero(hi, tgt.x + tgt.w * 0.36 + 10, tgt.by + 7, 14);
      const miss = Math.random() < 0.04 + Math.max(0, (tgt.agi - h.agi)) * 0.006;
      if (miss) { G.Audio.sfx('miss'); await moveHero(hi, HOME[hi][0], HOME[hi][1], 12); await B.say('Errou!', 24); return; }
      let dmg = physDmg(h, tgt); const crit = Math.random() < 1 / 14; if (crit) dmg = Math.round(dmg * 1.6);
      hs(hi).jump = 10;
      playFx(h.id === 'kravenox' ? 'slash' : 'light', [tgt]);
      await G.wait(8);
      await hurtEnemy(tgt, dmg, crit);
      await G.wait(8);
      await moveHero(hi, HOME[hi][0], HOME[hi][1], 12);
      await B.say(crit ? 'Golpe crítico! ' + dmg + ' de dano.' : tgt.name + ' sofre ' + dmg + ' de dano.', 30);
    } else if (act.type === 'tech') {
      const T = D.TECHS[act.tech];
      if (h.ep < T.ep) { await B.say('EP insuficiente.', 24); return; }
      h.ep -= T.ep;
      const hi2 = party().indexOf(h);
      hs(hi2).cast = { kravenox: 'rgba(255,40,30,0.9)', thornox: 'rgba(255,214,110,0.9)', lyra: 'rgba(170,215,255,0.9)' }[h.id];
      moveHero(hi2, HOME[hi2][0] - 12, HOME[hi2][1] - 6, 10);
      await B.say(h.name + ': ' + T.name + '!', 22);
      (async () => { await G.wait(30); hs(hi2).cast = null; await moveHero(hi2, HOME[hi2][0], HOME[hi2][1], 10); })();
      if (T.kind === 'dano' || T.kind === 'dreno') {
        const ts = tgt === 'all' ? alive(B.enemies) : [tgt];
        playFx(T.fx, ts); await G.wait(14);
        let total = 0;
        for (const e of ts) { const d = techDmg(h, e, T); total += d; await hurtEnemy(e, d, false); await G.wait(4); }
        if (T.kind === 'dreno') { const heal = Math.round(total * 0.5); h.hp = Math.min(h.maxhp, h.hp + heal); numFx(heroAt(h).x, heroAt(h).y - 36, '+' + heal, '#9aff8a'); }
        await B.say(ts.length > 1 ? 'Os espinhos atravessam todos!' : ts[0].name + ' sofre ' + total + ' de dano.', 28);
      } else if (T.kind === 'cura') {
        const ts = tgt === 'all' ? alive(party()) : [tgt];
        playFx(T.fx, ts, true); await G.wait(10);
        for (const p of ts) { const v = Math.round((h.mag * T.pow + T.base) * rnd()); p.hp = Math.min(p.maxhp, p.hp + v); numFx(heroAt(p).x, heroAt(p).y - 36, '+' + v, '#9aff8a'); }
        await B.say(ts.length > 1 ? 'O grupo se recupera.' : ts[0].name + ' se recupera.', 28);
      } else if (T.kind === 'furia') {
        playFx('fury', [h], true);
        h.status.fury = 3;
        await B.say('A Essência do Abismo transborda. Kravenox entra em fúria!', 34);
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
      if (inBattle) { playFx('heal', [p], true); numFx(heroAt(p).x, heroAt(p).y - 36, it.ep && !it.heal ? '+' + it.ep + ' EP' : '+' + Math.min(it.heal || 0, 999), '#9aff8a'); }
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
        let dmg = Math.max(1, Math.round((e.atk * a.pow - t.def * furyDef(t) * (t.status.shield ? 0.82 : 0.55)) * rnd()));
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
    B.fxs = []; B.msg = null; B.bg = opt.bg || 'planicie'; B.slotFlash = [0, 0, 0]; B.turnHero = -1; B.hs = []; B.victory = false;
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
      for (const h of hs) { if (h.status.shield) h.status.shield--; if (h.status.fury) { h.status.fury--; } }
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
    B.victory = true;
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
    for (const st of (B.hs || [])) { if (!st) continue; if (st.flash) st.flash--; if (st.kb) st.kb *= 0.8; if (Math.abs(st.kb) < 0.3) st.kb = 0; if (st.jump) st.jump--; }
  };
  // Moldura do quadro de batalha, com espinhos nos cantos
  function frame(ctx, x, y, w, h) {
    ctx.fillStyle = '#06030a'; ctx.fillRect(x - 3, y - 3, w + 6, 3); ctx.fillRect(x - 3, y + h, w + 6, 3); ctx.fillRect(x - 3, y, 3, h); ctx.fillRect(x + w, y, 3, h);
    ctx.fillStyle = '#7a5a2a'; ctx.fillRect(x - 2, y - 2, w + 4, 1); ctx.fillRect(x - 2, y + h + 1, w + 4, 1); ctx.fillRect(x - 2, y - 2, 1, h + 4); ctx.fillRect(x + w + 1, y - 2, 1, h + 4);
    ctx.fillStyle = '#c9a24a'; ctx.fillRect(x - 1, y - 1, w + 2, 1); ctx.fillRect(x - 1, y + h, w + 2, 1); ctx.fillRect(x - 1, y - 1, 1, h + 2); ctx.fillRect(x + w, y - 1, 1, h + 2);
    for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
      ctx.fillStyle = '#06030a'; ctx.beginPath(); ctx.moveTo(cx - sx * 4, cy - sy * 4); ctx.lineTo(cx + sx * 11, cy - sy * 1); ctx.lineTo(cx - sx * 1, cy + sy * 11); ctx.fill();
      ctx.fillStyle = '#c9a24a'; ctx.beginPath(); ctx.moveTo(cx - sx * 2, cy - sy * 2); ctx.lineTo(cx + sx * 8, cy); ctx.lineTo(cx, cy + sy * 8); ctx.fill();
      ctx.fillStyle = '#ff5a2a'; ctx.fillRect(cx + (sx > 0 ? 0 : -2), cy + (sy > 0 ? 0 : -2), 2, 2);
    }
  }
  // Morte: o inimigo se desfaz em pixels que caem
  function dissolve(e) {
    if (!e.dis) { const img = X.enemyImg(e); const [c, g] = X.canvas(img.width, img.height); g.drawImage(img, 0, 0); e.dis = c; e.disG = g; }
    const n = Math.ceil(e.dis.width * e.dis.height / 26);
    for (let i = 0; i < n; i++) { const x = (Math.random() * e.dis.width) | 0, y = (Math.random() * e.dis.height) | 0; e.disG.clearRect(x, y, 1 + (Math.random() * 2 | 0), 1); }
    if (Math.random() < 0.9 && B.fxs) {
      const px = e.x - e.w / 2 + Math.random() * e.w, py = e.by - e.h + Math.random() * e.h, col = e.void ? '#7a1a2a' : '#c8c0e0';
      B.fxs.push({ t: 0, life: 30, draw(ctx) { ctx.globalAlpha = 1 - this.t / 30; ctx.fillStyle = col; ctx.fillRect(px, py - this.t * 0.8, 1, 1); ctx.globalAlpha = 1; } });
    }
  }
  B.draw = function (ctx) {
    ctx.fillStyle = '#05030a'; ctx.fillRect(0, 0, G.W, G.H);
    const VX = 6, VY = 6, VW = G.W - 12, VH = VIEW_H;
    ctx.save(); ctx.beginPath(); ctx.rect(VX, VY, VW, VH); ctx.clip();
    ctx.translate(0, VY - 2);
    X.drawArena(ctx, B.bg, G.time, VIEW_H);
    for (const e of B.enemies.slice().sort((p, q) => p.by - q.by)) {
      if (!e.alive && e.dying >= 40) continue;
      const img = X.enemyImg(e), BY = e.by;
      const bob = e.dying ? 0 : Math.sin(G.time / 18 + e.idx) * (e.art === 'ghost' || e.art === 'shards' ? 3 : 1);
      const lg = e.lunge ? Math.sin(e.lunge / 12 * Math.PI) : 0;
      const sx = Math.round(e.x - e.w / 2 + (e.shake ? (e.shake % 4 < 2 ? 2 : -2) : 0) + lg * 18) - 1, sy = Math.round(BY - e.h + bob + lg * 9) - 1;
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(e.x + lg * 18, BY + lg * 9, e.w * 0.4, Math.max(3, e.w * 0.12), 0, 0, 7); ctx.fill();
      if (e.boss) X.glow(ctx, e.x, BY - e.h / 2, e.h * 0.7, e.void ? 'rgba(120,0,30,0.5)' : 'rgba(200,200,255,0.3)', 0.6 + 0.2 * Math.sin(G.time / 20));
      // espelhado: os inimigos olham para o grupo, à direita
      const put = (im) => { ctx.save(); ctx.translate(sx + im.width, sy); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0); ctx.restore(); };
      if (e.dying) { dissolve(e); put(e.dis); continue; }
      if (e.status.sleep) ctx.globalAlpha = 0.7;
      put(img);
      if (e.flash && (e.flash & 2)) { ctx.globalCompositeOperation = 'lighter'; put(img); put(img); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = 1;
      if (e.status.sleep && e.alive) G.text(ctx, 'z', e.x + e.w * 0.3, BY - e.h - 6 + Math.sin(G.time / 10) * 3, '#e8ecff', 9);
    }
    drawHeroes(ctx);
    for (const f of B.fxs) if (!f.ui) f.draw(ctx);
    ctx.restore();
    frame(ctx, VX, VY, VW, VH);
    drawParty(ctx);
    for (const f of B.fxs) if (f.ui) f.draw(ctx);
    if (B.msg) { G.win(ctx, 12, 10, G.W - 24, 20); G.text(ctx, B.msg, 20, 15, '#f1e6d2', 9); }
    if (G.fastBattle) G.text(ctx, '» 2x', G.W - 10, PW_Y - 12, '#ffcf6a', 7, 'right');
  };
  // o grupo no campo de batalha
  function drawHeroes(ctx) {
    party().forEach((h, i) => {
      const s = hs(i), at = heroAt(h), x = at.x, y = at.y;
      let im, sc = 1;
      if (h.id === 'kravenox') {
        if (h.status.fury && h.alive && X.imgs.k_furia) { im = X.imgs.k_furia; sc = 0.85; }
        else im = X.sprite(G.state.flags.prata ? 'kravenoxP' : 'kravenox', 'left', s.walk ? 1 : 0, s.walk ? ((G.time >> 2) & 3) : 0);
      } else if (h.id === 'thornox') { if (s.cast && h.alive && X.imgs.t_furia) { im = X.imgs.t_furia; sc = 0.85; } else im = X.sprite('thornox', 'left', s.walk ? 1 : 0, s.walk ? ((G.time >> 2) & 3) : 0); }
      else { im = X.sprite('lyra', 'left', s.walk ? 1 + ((G.time >> 3) & 1) : 0); sc = 1.7; }
      if (!im) return;
      const w = Math.round(im.width * sc), hh = Math.round(im.height * sc);
      const bob = h.alive && !s.walk ? Math.round(Math.sin(G.time / 14 + i * 2) * 0.8) : 0;
      const jump = s.jump ? Math.sin(s.jump / 10 * Math.PI) * 6 : 0;
      const vj = B.victory && h.alive ? Math.abs(Math.sin((G.time + i * 9) / 8)) * 9 : 0;
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(x, y, w * 0.38, 3, 0, 0, 7); ctx.fill();
      if (s.cast) X.glow(ctx, x, y - hh / 2, 28, s.cast, 0.55 + 0.3 * Math.sin(G.time / 4));
      if (h.status.fury && h.alive) X.glow(ctx, x, y - hh / 2, 30, 'rgba(255,30,10,0.9)', 0.3 + 0.2 * Math.sin(G.time / 5));
      const dx = Math.round(x - w / 2), dy = Math.round(y - hh - jump - vj + bob + (h.alive ? 0 : 6));
      if (!h.alive) ctx.globalAlpha = 0.35;
      ctx.drawImage(im, dx, dy, w, hh);
      if (s.flash && (s.flash & 2)) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.8; ctx.drawImage(im, dx, dy, w, hh); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = 1;
      if (B.turnHero === i) {
        const ay = dy - 7 + Math.sin(G.time / 6) * 2;
        ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.moveTo(x - 4, ay); ctx.lineTo(x + 4, ay); ctx.lineTo(x, ay + 5); ctx.fill();
      }
    });
  }
  function drawParty(ctx) {
    const p = party(), n = 3, gap = 4, w = Math.floor((G.W - 12 - gap * (n - 1)) / n), y0 = PW_Y - 2, h = G.H - y0 - 4;
    p.forEach((h0, i) => {
      const hero = h0, x0 = 6 + i * (w + gap);
      const on = B.turnHero === i;
      G.win(ctx, x0, y0, w, h, on ? { border: '#ffcf6a', inner: 'rgba(255,207,106,0.5)', bg: 'rgba(30,18,10,0.96)' } : {});
      if (B.slotFlash[i] & 2) { ctx.fillStyle = 'rgba(255,40,40,0.35)'; ctx.fillRect(x0 + 2, y0 + 2, w - 4, h - 4); }
      // retrato do herói (sprite do mapa)
      const furious = hero.status.fury && hero.alive && X.imgs.k_furia;
      if (furious) { X.glow(ctx, x0 + 19, y0 + h / 2, 30, 'rgba(255,30,10,0.9)', 0.35 + 0.2 * Math.sin(G.time / 6)); }
      const spr = furious ? X.imgs.k_furia : X.sprite(hero.id === 'kravenox' && G.state.flags.prata ? 'kravenoxP' : G.data.HEROES[hero.id].sprite, 'down', on && ((G.time >> 4) & 1) ? 1 : 0);
      const sc = Math.min(1, (furious ? 40 : 26) / spr.height);
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(x0 + 5, y0 + 5, 28, h - 10);
      if (!hero.alive) ctx.globalAlpha = 0.35;
      ctx.drawImage(spr, Math.round(x0 + 19 - spr.width * sc / 2), Math.round(y0 + h - 7 - spr.height * sc), Math.round(spr.width * sc), Math.round(spr.height * sc));
      ctx.globalAlpha = 1;
      const tx = x0 + 37, bw = w - 43;
      const nameCol = !hero.alive ? '#8a4a4a' : hero.hp < hero.maxhp * 0.25 ? '#ff9a6a' : '#ffcf6a';
      G.text(ctx, hero.name, tx, y0 + 4, nameCol, 8, 'left', true);
      let st = ''; if (!hero.alive) st = 'Caído'; else if (hero.status.sleep) st = 'Lembr.'; else if (hero.status.guard) st = 'Defesa'; else if (hero.status.shield) st = 'Barreira'; else if (hero.status.fury) st = 'Fúria';
      G.text(ctx, st || 'Nv' + hero.lv, x0 + w - 6, y0 + 5, st ? '#e0c060' : '#a89a8a', 6.5, 'right');
      G.text(ctx, 'HP', tx, y0 + 16, '#a89a8a', 6.5); G.text(ctx, hero.hp + '', x0 + w - 6, y0 + 15, '#efe3cf', 8, 'right');
      bar(ctx, tx, y0 + 25, bw, hero.hp / hero.maxhp, '#d84a3a', '#3a1214');
      G.text(ctx, 'EP', tx, y0 + 31, '#a89a8a', 6.5); G.text(ctx, hero.ep + '', x0 + w - 6, y0 + 30, '#c8d4f0', 8, 'right');
      bar(ctx, tx, y0 + 40, bw, hero.ep / Math.max(1, hero.mep), '#5a8ad8', '#141c3a');
    });
  }
  function bar(ctx, x, y, w, k, c, bg) {
    const v = Math.max(0, Math.round(w * G.clamp(k, 0, 1)));
    ctx.fillStyle = '#000'; ctx.fillRect(x - 1, y - 1, w + 2, 5);
    ctx.fillStyle = bg; ctx.fillRect(x, y, w, 3);
    ctx.fillStyle = c; ctx.fillRect(x, y, v, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x, y, v, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x, y + 2, v, 1);
  }
  G.bar = bar;
})();
