// Compositor das trilhas de Kravenox (renderiza no navegador com OfflineAudioContext).
// Cada faixa: andamento, compasso, acordes por compasso e camadas (pad, arpejo, baixo, bateria,
// guitarras, melodia...). Faixas em loop são renderizadas com a iteração anterior e a seguinte,
// para que o ponto de emenda soe exatamente como a continuação natural.
(function () {
  const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  const midi = n => { const m = /^([A-G][#b]?)(-?\d)$/.exec(n); if (!m) throw new Error('nota ' + n); return 12 * (+m[2] + 1) + NOTE[m[1]]; };
  const mhz = m => 440 * Math.pow(2, (m - 69) / 12);
  const QUAL = { '': [0, 4, 7], m: [0, 3, 7], dim: [0, 3, 6], sus: [0, 5, 7], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], 5: [0, 7] };
  function chord(sym, oct) { const m = /^([A-G][#b]?)(m7|m|dim|sus|7|5)?$/.exec(sym); const root = 12 * (oct + 1) + NOTE[m[1]]; return { root, tones: QUAL[m[2] || ''].map(i => root + i) }; }
  const parseMel = s => s.trim().split(/[\s|]+/).filter(Boolean).map(t => { const [n, l] = t.split(':'); return { n, l: +l }; });

  window.renderTrack = async function (tr) {
    let seed = 1; const R = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const sr = 44100, bpm = tr.bpm, beat = 60 / bpm, bb = tr.beats || 4, bar = bb * beat;
    const bars = tr.chords.length, L = bars * bar;
    const loop = tr.loop !== false;
    const P = loop ? 16 : 0, tail = loop ? 0.6 : (tr.tail || 4);
    const total = P + L + tail;
    const ctx = new OfflineAudioContext(2, Math.ceil(sr * total), sr);

    // ---------- mixagem ----------
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3.5; comp.attack.value = 0.005; comp.release.value = 0.25;
    const master = ctx.createGain(); master.gain.value = 0.8; master.connect(comp); comp.connect(ctx.destination);
    const rev = ctx.createConvolver(); const rl = tr.reverb || 3; const ir = ctx.createBuffer(2, Math.floor(sr * rl), sr);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp = lp * 0.6 + (R() * 2 - 1) * 0.4; d[i] = lp * Math.pow(1 - i / d.length, 2.6); } }
    rev.buffer = ir; const revG = ctx.createGain(); revG.gain.value = tr.wet || 0.4; rev.connect(revG); revG.connect(master);
    const buses = {};
    const bus = (key, vol, wet, pan = 0) => { if (buses[key]) return buses[key]; const g = ctx.createGain(); g.gain.value = vol; const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(master); const s = ctx.createGain(); s.gain.value = wet; g.connect(s); s.connect(rev); return (buses[key] = g); };
    const curve = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i / 1024 - 1; curve[i] = Math.tanh(x * 8) * 0.9; }
    let nbuf = null;
    const nb = () => { if (!nbuf) { nbuf = ctx.createBuffer(1, sr * 3, sr); const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; } return nbuf; };
    const env = (g, t, dur, vol, a, r, s = 1) => { g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.setValueAtTime(vol * s, t + Math.max(a, dur - r)); g.gain.linearRampToValueAtTime(0.0001, t + dur); };
    const osc = (type, f, t, dur, dest, det = 0, gain = 1) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; const g = ctx.createGain(); g.gain.value = gain; o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05); return o; };

    // ---------- instrumentos ----------
    const INST = {
      strings(d, ns, t, dur, v) { const g = ctx.createGain(); env(g, t, dur, v, Math.min(0.35, dur * 0.3), Math.min(0.5, dur * 0.3)); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.connect(g); g.connect(d);
        for (const n of ns) for (const det of [-9, 0, 8]) { const o = osc('sawtooth', mhz(n), t, dur, lp, det, 0.1); const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5 + R(); lg.gain.value = 4; l.connect(lg); lg.connect(o.detune); l.start(t); l.stop(t + dur); } },
      pad(d, ns, t, dur, v) { const g = ctx.createGain(); env(g, t, dur, v, Math.min(0.8, dur * 0.4), Math.min(1, dur * 0.4)); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.5; lp.connect(g); g.connect(d);
        for (const n of ns) for (const det of [-7, 6]) osc('sawtooth', mhz(n), t, dur, lp, det, 0.12); },
      choir(d, ns, t, dur, v, vow) { const g = ctx.createGain(); env(g, t, dur, v, Math.min(0.5, dur * 0.35), Math.min(0.6, dur * 0.3)); const [a, b] = vow === 'o' ? [450, 800] : [800, 1150];
        const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = a; f1.Q.value = 3; const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = b; f2.Q.value = 4;
        f1.connect(g); f2.connect(g); g.connect(d);
        for (const n of ns) for (const det of [-12, -4, 5, 13]) { const o = osc('sawtooth', mhz(n), t, dur, f1, det, 0.16); o.connect(f2); const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 4.6 + R(); lg.gain.value = 7; l.connect(lg); lg.connect(o.detune); l.start(t); l.stop(t + dur); } },
      organ(d, ns, t, dur, v) { const g = ctx.createGain(); env(g, t, dur, v, 0.06, 0.15); g.connect(d); for (const n of ns) for (const [h, a] of [[1, 0.5], [2, 0.3], [3, 0.12], [4, 0.1], [0.5, 0.3]]) osc('sine', mhz(n) * h, t, dur, g, 0, a * 0.5); },
      harp(d, ns, t, dur, v) { for (const n of ns) { const g = ctx.createGain(); g.gain.value = v; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(1.2, dur * 3)); g.connect(d); osc('triangle', mhz(n), t, Math.max(1.2, dur * 3), g, 0, 0.8); osc('sine', mhz(n) * 2, t, 0.6, g, 3, 0.25); } },
      pluck(d, ns, t, dur, v) { for (const n of ns) { const g = ctx.createGain(); g.gain.value = v; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.3); lp.connect(g); g.connect(d); osc('sawtooth', mhz(n), t, 0.5, lp, 0, 0.5); } },
      piano(d, ns, t, dur, v) { for (const n of ns) { const f = mhz(n), len = Math.min(4, Math.max(1, dur * 1.6)); const g = ctx.createGain(); g.gain.value = 0; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.004); g.gain.exponentialRampToValueAtTime(v * 0.3, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + len); g.connect(d);
        for (const [h, a] of [[1, 0.6], [2, 0.25], [3, 0.12], [4.02, 0.06]]) osc(h === 1 ? 'triangle' : 'sine', f * h, t, len, g, 0, a); } },
      bell(d, ns, t, dur, v) { for (const n of ns) for (const [m, a, dd] of [[1, 1, 3.5], [2.76, 0.35, 2], [5.4, 0.15, 1.2], [8.9, 0.06, 0.6]]) { const g = ctx.createGain(); g.gain.value = v * a; g.gain.setValueAtTime(v * a, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dd); g.connect(d); osc('sine', mhz(n) * m, t, dd, g); } },
      musicbox(d, ns, t, dur, v) { for (const n of ns) for (const [m, a, dd] of [[1, 1, 1.6], [3, 0.2, 0.5], [6.1, 0.08, 0.25]]) { const g = ctx.createGain(); g.gain.value = v * a; g.gain.setValueAtTime(v * a, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dd); g.connect(d); osc('sine', mhz(n) * m, t, dd, g); } },
      flute(d, ns, t, dur, v) { for (const n of ns) { const g = ctx.createGain(); env(g, t, dur, v, 0.08, Math.min(0.2, dur * 0.4), 0.9); g.connect(d); const o = osc('sine', mhz(n), t, dur, g, 0, 0.9); osc('triangle', mhz(n) * 2, t, dur, g, 0, 0.08);
        const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.2; lg.gain.value = 0; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(mhz(n) * 0.008, t + Math.min(0.5, dur)); l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur);
        const s = ctx.createBufferSource(); s.buffer = nb(); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = mhz(n) * 2; bp.Q.value = 8; const ng = ctx.createGain(); ng.gain.value = 0.05; s.connect(bp); bp.connect(ng); ng.connect(g); s.start(t, R()); s.stop(t + dur); } },
      horn(d, ns, t, dur, v) { for (const n of ns) { const g = ctx.createGain(); env(g, t, dur, v, 0.06, Math.min(0.25, dur * 0.3), 0.85); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 400; lp.frequency.setValueAtTime(400, t); lp.frequency.linearRampToValueAtTime(1600, t + 0.12); lp.frequency.linearRampToValueAtTime(1100, t + dur); lp.connect(g); g.connect(d);
        for (const det of [-5, 5]) osc('sawtooth', mhz(n), t, dur, lp, det, 0.35); } },
      lead(d, ns, t, dur, v) { for (const n of ns) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mhz(n);
        const vb = ctx.createOscillator(), vg = ctx.createGain(); vb.frequency.value = 5.6; vg.gain.value = 0; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(mhz(n) * 0.014, t + Math.min(0.35, dur)); vb.connect(vg); vg.connect(o.frequency);
        const pre = ctx.createGain(); pre.gain.value = 0.5; const sh = ctx.createWaveShaper(); sh.curve = curve; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3800;
        const g = ctx.createGain(); env(g, t, dur, v, 0.015, Math.min(0.08, dur * 0.3), 0.95); o.connect(pre); pre.connect(sh); sh.connect(lp); lp.connect(g); g.connect(d); o.start(t); o.stop(t + dur + 0.02); vb.start(t); vb.stop(t + dur + 0.02); } },
      guitar(d, ns, t, dur, v, mute) { const pre = ctx.createGain(); const sh = ctx.createWaveShaper(); sh.curve = curve; sh.oversample = '2x'; const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 90;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = mute ? 1300 : 3000; const g = ctx.createGain(); env(g, t, dur, v, 0.004, Math.min(0.05, dur * 0.3), mute ? 0.5 : 0.9);
        pre.connect(sh); sh.connect(hp); hp.connect(lp); lp.connect(g); g.connect(d); for (const n of ns) for (const det of [-6, 7]) osc('sawtooth', mhz(n), t, dur, pre, det, 0.35); },
      bass(d, ns, t, dur, v) { for (const n of ns) { const g = ctx.createGain(); env(g, t, dur, v, 0.008, Math.min(0.06, dur * 0.3), 0.85); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650; lp.connect(g); g.connect(d); osc('sawtooth', mhz(n), t, dur, lp, 0, 0.5); osc('sine', mhz(n), t, dur, g, 0, 0.6); } },
      drone(d, ns, t, dur, v) { const g = ctx.createGain(); env(g, t, dur, v, Math.min(2, dur * 0.4), Math.min(2, dur * 0.4)); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; lp.connect(g); g.connect(d); for (const n of ns) for (const det of [-10, 0, 11]) osc('sawtooth', mhz(n), t, dur, lp, det, 0.2); },
    };
    const noise = (d, t, dur, v, type, f, q = 1) => { const s = ctx.createBufferSource(); s.buffer = nb(); const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = ctx.createGain(); g.gain.value = v; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(fl); fl.connect(g); g.connect(d); s.start(t, R() * 2); s.stop(t + dur + 0.02); };
    const DR = {
      k(d, t, v) { const o = ctx.createOscillator(); o.frequency.value = 150; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); const g = ctx.createGain(); g.gain.value = v; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25); o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.27); noise(d, t, 0.015, v * 0.35, 'highpass', 3000); },
      s(d, t, v) { noise(d, t, 0.18, v, 'bandpass', 1900, 0.8); const o = ctx.createOscillator(); o.frequency.value = 230; o.frequency.setValueAtTime(230, t); o.frequency.exponentialRampToValueAtTime(150, t + 0.08); const g = ctx.createGain(); g.gain.value = v * 0.55; g.gain.setValueAtTime(v * 0.55, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12); o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.14); },
      h(d, t, v) { noise(d, t, 0.035, v * 0.5, 'highpass', 8000); },
      o(d, t, v) { noise(d, t, 0.25, v * 0.4, 'highpass', 7000); },
      c(d, t, v) { noise(d, t, 2.2, v * 0.7, 'highpass', 5000); },
      t(d, t, v) { const o = ctx.createOscillator(); o.frequency.value = 120; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.25); const g = ctx.createGain(); g.gain.value = v; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4); o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.42); noise(d, t, 0.06, v * 0.2, 'lowpass', 600); },
      T(d, t, v) { const o = ctx.createOscillator(); o.frequency.value = 80; o.frequency.setValueAtTime(80, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.3); const g = ctx.createGain(); g.gain.value = v; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6); o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.62); noise(d, t, 0.08, v * 0.25, 'lowpass', 400); },
      b(d, t, v) { // batida de coração (duas)
        for (const [o, a] of [[0, 1], [0.2, 0.75]]) { const x = ctx.createOscillator(); x.frequency.value = 70; x.frequency.setValueAtTime(70, t + o); x.frequency.exponentialRampToValueAtTime(38, t + o + 0.15); const g = ctx.createGain(); g.gain.value = v * a; g.gain.setValueAtTime(v * a, t + o); g.gain.exponentialRampToValueAtTime(0.0001, t + o + 0.3); x.connect(g); g.connect(d); x.start(t + o); x.stop(t + o + 0.32); } },
      w(d, t, v) { noise(d, t, 1.4, v * 0.3, 'bandpass', 900 + R() * 900, 6); }, // sussurro/vento
    };
    DR.timp = (d, n, t, v) => { const f = mhz(midi(n)); const o = ctx.createOscillator(); o.frequency.value = f * 1.03; o.frequency.setValueAtTime(f * 1.03, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.25); const g = ctx.createGain(); g.gain.value = v; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6); o.connect(g); g.connect(d); o.start(t); o.stop(t + 1.65); noise(d, t, 0.08, v * 0.3, 'lowpass', 400); };

    // ---------- eventos (tempo dentro do loop) ----------
    const ev = [];
    const push = (t, fn) => ev.push({ t, fn });
    const chordAt = (b, oct) => chord(tr.chords[b % bars], oct);
    for (const ly of tr.layers) {
      const vol = ly.vol || 0.3, d = bus(ly.bus || ly.inst || ly.type, ly.gain || 1, ly.wet != null ? ly.wet : 0.35, ly.pan || 0);
      const from = ly.from || 0, to = ly.to || bars;
      const I = INST[ly.inst];
      if (ly.type === 'pad') {
        const every = ly.every || 1;
        for (let b = from; b < to; b += every) { const c = chordAt(b, ly.oct || 4); const ns = (ly.voicing || [0, 1, 2]).map(i => i < c.tones.length ? c.tones[i] : c.tones[i % c.tones.length] + 12 * Math.floor(i / c.tones.length)); const dur = Math.min(every, to - b) * bar + 0.05; push(b * bar, (o) => I(d, ns, o, dur, vol, ly.vow)); }
      } else if (ly.type === 'arp') {
        const step = beat / (ly.div || 2), pat = ly.pat || [0, 1, 2, 1];
        for (let b = from; b < to; b++) { const c = chordAt(b, ly.oct || 4); const n = Math.round(bar / step);
          for (let i = 0; i < n; i++) { const p = pat[i % pat.length]; if (p == null || p < 0) continue; const tn = c.tones[p % c.tones.length] + 12 * Math.floor(p / c.tones.length); const acc = (i % (ly.div || 2) === 0 ? 1 : 0.8); push(b * bar + i * step, (o) => I(d, [tn], o, step * (ly.gate || 1), vol * acc)); } }
      } else if (ly.type === 'bass') {
        const pat = ly.pat || 'x.......';
        for (let b = from; b < to; b++) { const c = chordAt(b, ly.oct || 2); const n = pat.length, st = bar / n;
          for (let i = 0; i < n; i++) { const ch = pat[i]; if (ch === '.' || ch === '-') continue; let len = 1; while (i + len < n && pat[i + len] === '-') len++; const note = ch === '5' ? c.root + 7 : ch === 'o' ? c.root + 12 : c.root; push(b * bar + i * st, (o) => I(d, [note], o, st * len * 0.95, vol)); } }
      } else if (ly.type === 'chug') {
        const pat = ly.pat || 'x.x.x.x.x.x.x.x.';
        for (let b = from; b < to; b++) { const c = chordAt(b, ly.oct || 2); const ns = ly.open ? [c.root, c.root + 7, c.root + 12] : [c.root, c.root + 7]; const n = pat.length, st = bar / n;
          for (let i = 0; i < n; i++) { const ch = pat[i]; if (ch === '.' || ch === '-') continue; let len = 1; while (i + len < n && pat[i + len] === '-') len++; const mute = ch === 'x'; push(b * bar + i * st, (o) => I(d, ns, o, st * len * (mute ? 0.9 : 0.98), vol, mute)); } }
      } else if (ly.type === 'drums') {
        for (let b = from; b < to; b++) {
          const isLast = (b + 1) % (ly.fillEvery || 1e9) === 0;
          for (const k of new Set([...Object.keys(ly.pat), ...Object.keys(ly.fill || {})])) { const p = isLast && ly.fill && ly.fill[k] != null ? ly.fill[k] : ly.pat[k]; if (!p) continue; const n = p.length, st = bar / n;
            for (let i = 0; i < n; i++) { const ch = p[i]; if (ch === '.') continue; const a = ch === 'X' ? 1 : ch === 'x' ? 0.75 : 0.45; push(b * bar + i * st, (o) => DR[k](d, o, vol * a)); } }
        }
      } else if (ly.type === 'timp') {
        for (let b = from; b < to; b += ly.every || 1) { const c = chordAt(b, ly.oct || 2); const nn = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][c.root % 12] + (Math.floor(c.root / 12) - 1); push(b * bar, (o) => DR.timp(d, nn, o, vol)); }
      } else if (ly.type === 'melody') {
        const mel = parseMel(ly.notes); let t = from * bar; const end = to * bar; let i = 0, guard = 0;
        while (t < end - 1e-6 && guard++ < 4000) { const m = mel[i % mel.length]; const len = m.l * beat; if (m.n !== 'r') { const ns = [midi(m.n) + (ly.shift || 0)]; if (ly.harm) ns.push(ns[0] + ly.harm); const dd = Math.min(len, end - t) * (ly.gate || 0.96); push(t, (o) => I(d, ns, o, dd, vol, ly.vow)); } t += len; i++; if (!ly.repeat && i >= mel.length) break; }
      } else if (ly.type === 'hits') { // eventos soltos: [compasso, tempo, instrumento/drum, notas]
        for (const [b, bt, what, ns, v] of ly.list) push(b * bar + bt * beat, (o) => what in DR ? DR[what](d, o, (v || 1) * vol) : INST[what](d, ns.map(midi), o, ly.dur || 2, (v || 1) * vol));
      }
    }
    // notas nos instrumentos chegam em MIDI; converte as dos pads (já MIDI) — melodias já convertidas
    nb();
    ev.forEach((e, ei) => {
      for (const k of loop ? [-1, 0, 1] : [0]) { const o = P + e.t + k * L; if (o < 0 || o > total - 0.05) continue; seed = (ei * 7919 + 12345) >>> 0; e.fn(o); }
    });
    const buf = await ctx.startRendering();
    const a = loop ? Math.floor((P - 0.5) * sr) : 0, len = loop ? Math.floor((L + 1) * sr) : buf.length;
    const Lc = buf.getChannelData(0).subarray(a, a + len), Rc = buf.getChannelData(1).subarray(a, a + len);
    let peak = 0, sq = 0; for (let i = 0; i < len; i++) { peak = Math.max(peak, Math.abs(Lc[i]), Math.abs(Rc[i])); sq += Lc[i] * Lc[i] + Rc[i] * Rc[i]; }
    const rms = Math.sqrt(sq / (2 * len)); const target = tr.rms || 0.14;
    const k = Math.min(target / rms, 0.97 / peak);
    const pcm = new Int16Array(len * 2); for (let i = 0; i < len; i++) { pcm[2 * i] = Math.max(-1, Math.min(1, Lc[i] * k)) * 32767; pcm[2 * i + 1] = Math.max(-1, Math.min(1, Rc[i] * k)) * 32767; }
    const bytes = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return { b64: btoa(bin), L, loop, a: loop ? 0.5 : 0, rms, peak, k };
  };
})();
