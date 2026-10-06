'use strict';
// Música chiptune e efeitos com WebAudio (sem arquivos externos).
(function () {
  const A = G.Audio = { ctx: null, master: null, music: null, cur: null, vol: 0.5, muted: false };
  const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  const freq = n => { const m = /^([A-G][#b]?)(\d)$/.exec(n); if (!m) return 0; const midi = 12 * (+m[2] + 1) + NOTE[m[1]]; return 440 * Math.pow(2, (midi - 69) / 12); };

  A.unlock = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    A.ctx = new AC();
    A.master = A.ctx.createGain(); A.master.gain.value = A.vol; A.master.connect(A.ctx.destination);
    A.musicGain = A.ctx.createGain(); A.musicGain.gain.value = 0.55; A.musicGain.connect(A.master);
    A.sfxGain = A.ctx.createGain(); A.sfxGain.gain.value = 0.7; A.sfxGain.connect(A.master);
    setInterval(schedule, 40);
    if (A.want) { const w = A.want; A.want = null; A.play(w); }
  };

  function tone(dest, f, t, dur, wave, vol, opt = {}) {
    const c = A.ctx;
    const o = c.createOscillator(), g = c.createGain();
    o.type = wave === 'noise' ? 'square' : wave;
    o.frequency.setValueAtTime(f, t);
    if (opt.slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, opt.slide), t + dur);
    if (opt.vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.5; lg.gain.value = f * 0.012; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + 0.1); }
    const at = opt.attack || 0.008, rel = opt.release || Math.min(0.12, dur * 0.5);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + at);
    g.gain.setValueAtTime(vol * (opt.sustain || 0.75), t + Math.max(at, dur - rel));
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dest, t, dur, vol, hp = 1000) {
    const c = A.ctx;
    if (!A.nbuf) { const len = c.sampleRate; A.nbuf = c.createBuffer(1, len, c.sampleRate); const d = A.nbuf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; }
    const s = c.createBufferSource(); s.buffer = A.nbuf;
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t); s.stop(t + dur + 0.02);
  }

  // Faixa: {bpm, v:[{w:onda, vol, n:"C4:2 D4:1 r:1 ..."}]}  (duração em colcheias)
  function parse(str) {
    return str.trim().split(/\s+/).map(tok => { const [n, l] = tok.split(':'); return { n, l: +(l || 1) }; });
  }
  A.play = function (name) {
    if (!A.ctx) { A.want = name; return; }
    if (A.cur === name) return;
    A.cur = name;
    const tr = G.TRACKS[name];
    if (A.music) A.music.stop = true;
    if (!tr) { A.music = null; return; }
    const t0 = A.ctx.currentTime + 0.08;
    A.music = { tr, stop: false, voices: tr.v.map(v => ({ ...v, seq: parse(v.n), i: 0, t: t0 })) };
  };
  A.stop = function () { if (A.music) A.music.stop = true; A.music = null; A.cur = null; };
  function schedule() {
    const m = A.music; if (!m || m.stop || !A.ctx) return;
    const ahead = A.ctx.currentTime + 0.25;
    const e = 60 / m.tr.bpm / 2; // colcheia
    for (const v of m.voices) {
      let guard = 0;
      while (v.t < ahead && guard++ < 64) {
        const s = v.seq[v.i];
        const dur = s.l * e;
        if (s.n !== 'r') {
          if (v.w === 'drum') {
            if (s.n === 'k') tone(A.musicGain, 140, v.t, 0.12, 'sine', v.vol, { slide: 45 });
            else if (s.n === 's') noise(A.musicGain, v.t, 0.12, v.vol * 0.8, 1500);
            else if (s.n === 'h') noise(A.musicGain, v.t, 0.04, v.vol * 0.4, 6000);
          } else {
            tone(A.musicGain, freq(s.n), v.t, dur * (v.gate || 0.92), v.w, v.vol, { vib: v.vib, attack: v.att, sustain: v.sus, release: v.rel });
          }
        }
        v.t += dur; v.i = (v.i + 1) % v.seq.length;
      }
    }
  }
  A.sfx = function (name) {
    if (!A.ctx || A.muted) return;
    const t = A.ctx.currentTime + 0.005, d = A.sfxGain;
    switch (name) {
      case 'blip': tone(d, 880, t, 0.04, 'square', 0.12); break;
      case 'ok': tone(d, 660, t, 0.05, 'square', 0.14); tone(d, 990, t + 0.05, 0.07, 'square', 0.14); break;
      case 'back': tone(d, 520, t, 0.05, 'square', 0.12); tone(d, 350, t + 0.05, 0.07, 'square', 0.12); break;
      case 'buzz': tone(d, 110, t, 0.15, 'sawtooth', 0.15); break;
      case 'hit': noise(d, t, 0.12, 0.5, 800); tone(d, 160, t, 0.1, 'square', 0.18, { slide: 60 }); break;
      case 'hurt': noise(d, t, 0.2, 0.5, 300); tone(d, 220, t, 0.18, 'sawtooth', 0.2, { slide: 70 }); break;
      case 'crit': noise(d, t, 0.25, 0.6, 500); tone(d, 400, t, 0.2, 'square', 0.2, { slide: 80 }); break;
      case 'miss': tone(d, 700, t, 0.1, 'triangle', 0.12, { slide: 1200 }); break;
      case 'spines': for (let i = 0; i < 4; i++) { noise(d, t + i * 0.05, 0.08, 0.35, 2500); tone(d, 300 - i * 40, t + i * 0.05, 0.06, 'sawtooth', 0.12); } break;
      case 'light': for (let i = 0; i < 5; i++) tone(d, 660 * Math.pow(1.19, i), t + i * 0.05, 0.18, 'triangle', 0.14); break;
      case 'heal': for (let i = 0; i < 4; i++) tone(d, 523 * Math.pow(1.26, i), t + i * 0.07, 0.2, 'sine', 0.16); break;
      case 'memory': for (let i = 0; i < 6; i++) tone(d, [880, 740, 988, 659, 1175, 880][i], t + i * 0.06, 0.25, 'sine', 0.1, { vib: true }); break;
      case 'dark': tone(d, 90, t, 0.6, 'sawtooth', 0.22, { slide: 40 }); noise(d, t, 0.5, 0.3, 200); break;
      case 'enc': for (let i = 0; i < 6; i++) tone(d, 200 + i * 120, t + i * 0.035, 0.05, 'square', 0.14); break;
      case 'chest': tone(d, 523, t, 0.08, 'square', 0.14); tone(d, 659, t + 0.08, 0.08, 'square', 0.14); tone(d, 784, t + 0.16, 0.2, 'square', 0.14); break;
      case 'door': noise(d, t, 0.3, 0.3, 300); tone(d, 80, t, 0.3, 'triangle', 0.25); break;
      case 'step': noise(d, t, 0.03, 0.12, 2000); break;
      case 'bump': tone(d, 90, t, 0.07, 'square', 0.15); break;
      case 'level': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(d, f, t + i * 0.08, 0.12, 'square', 0.15)); break;
      case 'bell': [0, 0.01].forEach(o => tone(d, 196 + o * 100, t, 2.2, 'sine', 0.25, { attack: 0.005, sustain: 0.4, release: 1.8 })); tone(d, 392 * 1.5, t, 1.6, 'sine', 0.08, { release: 1.4 }); break;
      case 'save': [784, 988, 1175, 1568].forEach((f, i) => tone(d, f, t + i * 0.09, 0.3, 'triangle', 0.13)); break;
      case 'die': tone(d, 300, t, 0.5, 'sawtooth', 0.2, { slide: 50 }); break;
      case 'boom': noise(d, t, 0.8, 0.7, 60); tone(d, 70, t, 0.8, 'sine', 0.4, { slide: 30 }); break;
    }
  };
})();

// ---------- Trilhas ----------
G.TRACKS = {
  // Abertura tensa: ostinato grave, batida de coração e dissonâncias agudas
  title: { bpm: 100, v: [
    { w: 'triangle', vol: 0.26, gate: 0.6, n: 'D2:1 D2:1 D2:1 D2:1 D2:1 D2:1 Eb2:1 D2:1 D2:1 D2:1 D2:1 D2:1 D2:1 D2:1 Eb2:1 D2:1 Bb1:1 Bb1:1 Bb1:1 Bb1:1 Bb1:1 Bb1:1 C2:1 Bb1:1 A1:1 A1:1 A1:1 A1:1 A1:1 A1:1 Bb1:1 C#2:1' },
    { w: 'drum', vol: 0.34, n: 'k:1 k:1 r:6 k:1 k:1 r:4 h:1 h:1 k:1 k:1 r:6 k:1 k:1 r:2 s:1 r:1 h:1 s:1' },
    { w: 'square', vol: 0.035, vib: true, att: 0.35, sus: 0.9, n: 'D5:8 Eb5:8 D5:8 A4:4 Ab4:4' },
    { w: 'sawtooth', vol: 0.045, gate: 0.4, n: 'r:4 F3:1 r:3 r:4 Eb3:1 r:3 r:4 F3:1 r:1 Ab3:1 r:1 r:6 A3:1 C#4:1' },
  ] },
  // Abismo Carmesim: pulso lento, coração e sussurros agudos
  abismo: { bpm: 84, v: [
    { w: 'triangle', vol: 0.26, gate: 0.7, n: 'D2:2 D2:2 D2:2 Eb2:2 D2:2 D2:2 D2:2 C#2:2' },
    { w: 'drum', vol: 0.3, n: 'k:1 k:1 r:6 k:1 k:1 r:6' },
    { w: 'sine', vol: 0.08, vib: true, att: 0.2, n: 'r:8 A5:4 Bb5:4 r:8 G#5:8' },
    { w: 'sawtooth', vol: 0.04, gate: 0.5, n: 'r:14 D3:1 C#3:1 r:12 F3:1 r:1 Eb3:1 r:1' },
  ] },
  reino: { bpm: 96, v: [
    { w: 'square', vol: 0.07, vib: true, n: 'D4:2 F4:1 A4:1 D5:3 C5:1 Bb4:2 A4:2 G4:2 F4:2 E4:2 F4:1 G4:1 A4:4 r:2 D4:2 F4:1 A4:1 C5:3 Bb4:1 A4:2 G4:2 F4:2 E4:2 D4:2 C#4:2 D4:6' },
    { w: 'triangle', vol: 0.2, n: 'D3:1 A3:1 D3:1 A3:1 D3:1 A3:1 D3:1 A3:1 Bb2:1 F3:1 Bb2:1 F3:1 Bb2:1 F3:1 Bb2:1 F3:1 G2:1 D3:1 G2:1 D3:1 A2:1 E3:1 A2:1 E3:1 D3:1 A3:1 D3:1 A3:1 D3:1 A3:1 D3:1 A3:1 F2:1 C3:1 F2:1 C3:1 F2:1 C3:1 F2:1 C3:1 G2:1 D3:1 G2:1 D3:1 A2:1 E3:1 A2:1 C#3:1 D3:2 A2:2 D3:4' },
    { w: 'drum', vol: 0.25, n: 'k:2 h:1 h:1 s:2 h:2' },
  ] },
  vila: { bpm: 72, v: [
    { w: 'triangle', vol: 0.16, n: 'E4:2 G4:1 B4:1 A4:4 G4:2 F#4:2 E4:4 D4:2 E4:1 F#4:1 G4:4 F#4:2 D4:2 E4:4 r:2' },
    { w: 'sine', vol: 0.22, n: 'E3:4 B2:4 C3:4 G2:4 D3:4 A2:4 E3:4 B2:2 r:2' },
  ] },
  floresta: { bpm: 80, v: [
    { w: 'triangle', vol: 0.15, n: 'B3:1 r:1 F4:1 r:1 E4:2 r:2 B3:1 r:1 G4:1 F#4:1 F4:4 r:4 A3:1 r:1 E4:1 r:1 D#4:2 r:2 A3:1 r:1 F4:1 E4:1 D#4:4 r:4' },
    { w: 'sine', vol: 0.25, n: 'E2:8 E2:8 D#2:8 D#2:8' },
    { w: 'square', vol: 0.025, vib: true, att: 0.3, n: 'r:8 B5:6 r:2 r:8 A5:6 r:2' },
  ] },
  masmorra: { bpm: 84, v: [
    { w: 'triangle', vol: 0.18, n: 'C3:1 G3:1 C4:1 Eb4:1 D4:1 C4:1 G3:1 Eb3:1 C3:1 G3:1 C4:1 F4:1 Eb4:1 D4:1 Bb3:1 G3:1 Ab2:1 Eb3:1 Ab3:1 C4:1 Bb3:1 Ab3:1 Eb3:1 C3:1 G2:1 D3:1 G3:1 B3:1 D4:1 B3:1 G3:1 D3:1' },
    { w: 'square', vol: 0.045, vib: true, att: 0.05, n: 'G4:4 Eb4:2 F4:2 G4:6 r:2 Ab4:4 G4:2 F4:2 D4:6 r:2' },
  ] },
  submersa: { bpm: 66, v: [
    { w: 'sine', vol: 0.2, n: 'F#3:1 C#4:1 F#4:1 A4:1 G#4:1 E4:1 C#4:1 B3:1 D3:1 A3:1 D4:1 F#4:1 E4:1 C#4:1 A3:1 G#3:1' },
    { w: 'triangle', vol: 0.12, vib: true, att: 0.1, n: 'C#5:6 B4:2 A4:4 G#4:4 F#4:6 E4:2 F#4:8' },
  ] },
  vale: { bpm: 64, v: [
    { w: 'triangle', vol: 0.15, n: 'A3:2 C4:2 E4:2 D4:2 C4:4 B3:4 A3:2 C4:2 F4:2 E4:2 D#4:8' },
    { w: 'sine', vol: 0.22, n: 'A2:8 F2:8 A2:8 B2:8' },
    { w: 'square', vol: 0.025, vib: true, att: 0.4, n: 'E5:16 F5:8 D#5:8' },
  ] },
  batalha: { bpm: 150, v: [
    { w: 'square', vol: 0.07, n: 'A4:1 A4:1 C5:1 A4:1 E5:2 D5:1 C5:1 B4:1 B4:1 D5:1 B4:1 G5:2 F5:1 E5:1 F4:1 A4:1 C5:1 F5:1 E5:2 D5:1 C5:1 E4:1 G#4:1 B4:1 E5:1 D5:2 B4:2' },
    { w: 'triangle', vol: 0.22, n: 'A2:1 A3:1 A2:1 A3:1 A2:1 A3:1 A2:1 A3:1 G2:1 G3:1 G2:1 G3:1 G2:1 G3:1 G2:1 G3:1 F2:1 F3:1 F2:1 F3:1 F2:1 F3:1 F2:1 F3:1 E2:1 E3:1 E2:1 E3:1 E2:1 E3:1 G#2:1 B2:1' },
    { w: 'drum', vol: 0.3, n: 'k:1 h:1 s:1 h:1 k:1 k:1 s:1 h:1' },
  ] },
  chefe: { bpm: 140, v: [
    { w: 'sawtooth', vol: 0.05, n: 'D4:1 D4:1 F4:1 D4:1 G#4:2 A4:2 D4:1 D4:1 F4:1 D4:1 C5:2 B4:2 Bb4:1 A4:1 G#4:1 A4:1 F4:2 E4:2 D4:1 E4:1 F4:1 G4:1 A4:4' },
    { w: 'triangle', vol: 0.24, n: 'D2:1 D3:1 D2:1 D3:1 D2:1 D3:1 D2:1 D3:1 D2:1 D3:1 D2:1 D3:1 G#2:1 G#3:1 A2:1 A3:1 Bb2:1 Bb3:1 Bb2:1 Bb3:1 A2:1 A3:1 A2:1 A3:1 D2:1 D3:1 D2:1 D3:1 A2:1 A3:1 C#3:1 C#4:1' },
    { w: 'drum', vol: 0.32, n: 'k:1 s:1 k:1 s:1 k:1 k:1 s:1 s:1' },
  ] },
  final: { bpm: 128, v: [
    { w: 'square', vol: 0.06, vib: true, n: 'E5:3 D5:1 C5:2 B4:2 A4:3 B4:1 C5:4 D5:3 C5:1 B4:2 G#4:2 A4:8 F5:3 E5:1 D5:2 C5:2 B4:3 C5:1 D5:4 E5:2 G#4:2 B4:2 E5:2 A5:8' },
    { w: 'triangle', vol: 0.22, n: 'A2:1 E3:1 A3:1 E3:1 A2:1 E3:1 A3:1 E3:1 F2:1 C3:1 F3:1 C3:1 F2:1 C3:1 F3:1 C3:1 D2:1 A2:1 D3:1 A2:1 E2:1 B2:1 E3:1 B2:1 A2:1 E3:1 A3:1 E3:1 A2:1 E3:1 A3:1 E3:1 D2:1 A2:1 D3:1 A2:1 D2:1 A2:1 D3:1 A2:1 F2:1 C3:1 F3:1 C3:1 G2:1 D3:1 G3:1 D3:1 E2:1 B2:1 E3:1 B2:1 E2:1 G#2:1 B2:1 E3:1 A2:1 E3:1 A3:1 E3:1 A2:4' },
    { w: 'drum', vol: 0.3, n: 'k:1 h:1 s:1 h:1 k:1 h:1 s:1 k:1' },
  ] },
  memoria: { bpm: 60, v: [
    { w: 'sine', vol: 0.15, vib: true, att: 0.05, n: 'E5:2 B4:2 G4:2 B4:2 D5:2 A4:2 F#4:2 A4:2 C5:2 G4:2 E4:2 G4:2 B4:2 F#4:2 D#4:2 F#4:2' },
    { w: 'triangle', vol: 0.15, n: 'E3:8 D3:8 C3:8 B2:8' },
  ] },
  vitoria: { bpm: 140, v: [
    { w: 'square', vol: 0.08, n: 'A4:1 C5:1 E5:1 A5:3 G5:1 E5:1 F5:1 G5:1 A5:6 r:16' },
    { w: 'triangle', vol: 0.2, n: 'A2:2 A3:2 F2:2 G2:2 A2:6 r:16' },
  ] },
  fim: { bpm: 76, v: [
    { w: 'triangle', vol: 0.16, n: 'C4:2 E4:2 G4:2 C5:2 B4:4 G4:4 A4:2 G4:2 F4:2 E4:2 D4:8 C4:2 E4:2 G4:2 C5:2 D5:4 E5:4 F5:2 E5:2 D5:2 B4:2 C5:8' },
    { w: 'sine', vol: 0.22, n: 'C3:8 G2:8 F2:8 G2:8 C3:8 G2:8 F2:4 G2:4 C3:8' },
    { w: 'square', vol: 0.025, vib: true, att: 0.3, n: 'E5:16 D5:16 E5:16 G5:16' },
  ] },
  gameover: { bpm: 60, v: [
    { w: 'triangle', vol: 0.18, n: 'A4:2 G4:2 F4:2 E4:2 D4:4 C#4:4 D4:8 r:8' },
    { w: 'sine', vol: 0.2, n: 'D3:8 A2:8 D2:8 r:8' },
  ] },
};
