// Partituras das trilhas de Kravenox. Composição original.
// Tema do Kravenox (leitmotiv): Ré – Fá – Lá – Sol# – Lá – Fá – Mi – Ré (Ré menor, com o trítono escondido).
window.KTRACKS = {
  // Tela título: abertura de metal ópera — coral, tímpanos e coração; depois guitarras e o tema.
  title: { bpm: 92, reverb: 3.5, wet: 0.45, rms: 0.15,
    chords: ['Dm', 'Dm', 'Bb', 'Bb', 'Gm', 'Gm', 'A', 'A', 'Dm', 'Dm', 'Bb', 'C', 'Gm', 'A', 'Dm', 'A'],
    layers: [
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.14, every: 2, to: 8, wet: 0.6 },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.18, from: 8, voicing: [0, 1, 2, 3], wet: 0.6 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.1, every: 2, wet: 0.45 },
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.18, every: 2, wet: 0.2 },
      { type: 'drums', vol: 0.55, to: 8, bus: 'heart', wet: 0.2, pat: { b: 'x...' } },
      { type: 'timp', vol: 0.6, every: 2, oct: 2, wet: 0.5 },
      { type: 'hits', vol: 0.14, bus: 'bells', wet: 0.7, list: [[0, 0, 'bell', ['D5']], [2, 0, 'bell', ['F5']], [4, 0, 'bell', ['D5']], [6, 0, 'bell', ['C#5']]] },
      { type: 'drums', vol: 0.4, from: 6, to: 8, bus: 'roll', wet: 0.3, pat: { s: '....', t: '....' }, fillEvery: 2, fill: { s: 'xxxxxxxxXXXXXXXX', T: 'x.......x...x.x.' } },
      { type: 'chug', inst: 'guitar', vol: 0.4, from: 8, oct: 2, pat: 'x.xxx.xxx.xxx.xx', pan: -0.6, bus: 'gL', wet: 0.1 },
      { type: 'chug', inst: 'guitar', vol: 0.4, from: 8, oct: 2, pat: 'x.xxx.xxx.xxx.xx', pan: 0.6, bus: 'gR', wet: 0.1 },
      { type: 'bass', inst: 'bass', vol: 0.4, from: 8, oct: 1, pat: 'x.x.x.x.' },
      { type: 'drums', vol: 0.6, from: 8, bus: 'kit', wet: 0.15, pat: { k: 'X.x.X.x.X.x.X.x.', s: '....X.......X...', h: 'x.x.x.x.x.x.x.x.' }, fillEvery: 4, fill: { s: '....X.......XxXX', c: 'X...............' } },
      { type: 'melody', inst: 'lead', vol: 0.22, from: 8, wet: 0.4, notes: 'D5:2 F5:1 A5:1 | G#5:1.5 A5:0.5 F5:1 E5:1 | D5:3 r:1 | r:4 | Bb4:2 D5:1 F5:1 | E5:1.5 F5:0.5 D5:1 C#5:1 | D5:4 | E5:2 C#5:2' },
      { type: 'melody', inst: 'choir', vol: 0.12, from: 8, wet: 0.6, shift: -12, notes: 'D5:2 F5:1 A5:1 | G#5:1.5 A5:0.5 F5:1 E5:1 | D5:3 r:1 | r:4 | Bb4:2 D5:1 F5:1 | E5:1.5 F5:0.5 D5:1 C#5:1 | D5:4 | E5:2 C#5:2' },
    ] },

  // Abismo: escuridão, coração lento, sussurros e um piano distante.
  abismo: { bpm: 64, reverb: 5, wet: 0.6, rms: 0.11,
    chords: ['Dm', 'Dm', 'Eb', 'Dm', 'Dm', 'Bbm', 'A', 'A', 'Dm', 'Dm', 'Eb', 'Dm', 'Gm', 'Bbm', 'A', 'A'],
    layers: [
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.28, every: 4, wet: 0.3 },
      { type: 'pad', inst: 'pad', oct: 3, vol: 0.13, every: 2, wet: 0.6 },
      { type: 'drums', vol: 0.5, bus: 'heart', wet: 0.25, pat: { b: 'x.......' } },
      { type: 'drums', vol: 0.5, bus: 'wind', wet: 0.8, pat: { w: '........' }, fillEvery: 3, fill: { w: 'x.......' } },
      { type: 'melody', inst: 'piano', vol: 0.2, wet: 0.75, notes: 'A4:1 r:1 D5:1 r:1 | C#5:2 r:2 | r:4 | r:4 | F4:1 r:1 Bb4:1 r:1 | A4:3 r:1 | r:4 | r:4 | A4:1 r:1 D5:1 r:1 | F5:2 E5:2 | r:4 | r:4 | Bb4:1 r:1 Db5:1 r:1 | C#5:4 | r:4 | r:4' },
      { type: 'hits', vol: 0.08, bus: 'bells', wet: 0.8, list: [[3, 2, 'bell', ['A3']], [7, 0, 'bell', ['G#3']], [11, 2, 'bell', ['A3']], [15, 0, 'bell', ['C#4']]] },
    ] },

  // Reino Quebrado (mapa): aventura épica e sombria, marcha com metais e cordas.
  reino: { bpm: 100, reverb: 3, wet: 0.4, rms: 0.14,
    chords: ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'C', 'A', 'Gm', 'Dm', 'Bb', 'F', 'Gm', 'A', 'Dm', 'A'],
    layers: [
      { type: 'arp', inst: 'pluck', oct: 3, vol: 0.13, div: 2, pat: [0, 2, 3, 2, 1, 2, 3, 2], wet: 0.3 },
      { type: 'pad', inst: 'strings', oct: 4, vol: 0.1, wet: 0.45 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.3, pat: 'x.x.x.5.' },
      { type: 'drums', vol: 0.45, bus: 'kit', wet: 0.25, pat: { k: 'X.......x.......', s: '....x..x....x.xx', t: '................' }, fillEvery: 4, fill: { s: '....x..x..xxXXXX', T: 'X...............' } },
      { type: 'timp', vol: 0.45, every: 4, oct: 2 },
      { type: 'melody', inst: 'horn', vol: 0.2, wet: 0.4, notes: 'D4:1.5 A4:0.5 A4:1 G4:0.5 F4:0.5 | F4:1 G4:1 A4:2 | A4:1.5 C5:0.5 C5:1 Bb4:0.5 A4:0.5 | G4:4 | D4:1.5 A4:0.5 A4:1 G4:0.5 F4:0.5 | F4:1 G4:1 Bb4:2 | A4:1 G4:1 F4:1 E4:1 | E4:2 C#4:2 | D5:2 C5:1 Bb4:1 | A4:2 F4:2 | Bb4:1.5 A4:0.5 G4:1 F4:1 | A4:4 | Bb4:1.5 A4:0.5 G4:1 Bb4:1 | A4:2 E4:2 | F4:1 E4:1 D4:2 | C#4:2 E4:2' },
      { type: 'melody', inst: 'strings', vol: 0.09, from: 8, wet: 0.5, shift: 12, notes: 'D5:2 C5:1 Bb4:1 | A4:2 F4:2 | Bb4:1.5 A4:0.5 G4:1 F4:1 | A4:4 | Bb4:1.5 A4:0.5 G4:1 Bb4:1 | A4:2 E4:2 | F4:1 E4:1 D4:2 | C#4:2 E4:2' },
    ] },

  // Vila Sem Nome: valsa triste, harpa e flauta.
  vila: { bpm: 84, beats: 3, reverb: 3, wet: 0.45, rms: 0.12,
    chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'B', 'B', 'Am', 'Em', 'C', 'G', 'Am', 'B', 'Em', 'Em'],
    layers: [
      { type: 'arp', inst: 'harp', oct: 3, vol: 0.13, div: 2, pat: [0, 1, 2, 3, 2, 1], wet: 0.4 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.06, wet: 0.5 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.16, pat: 'x-----' },
      { type: 'melody', inst: 'flute', vol: 0.18, wet: 0.45, notes: 'B4:2 G4:1 | E5:2 D5:1 | D5:2 B4:1 | A4:3 | B4:2 G4:1 | E4:2 G4:1 | F#4:3 | F#4:3 | A4:2 C5:1 | B4:2 G4:1 | E4:2 G4:1 | D4:3 | C4:2 E4:1 | D#4:2 F#4:1 | E4:3 | E4:3' },
    ] },

  // Floresta Morta: pizzicatos e uma flauta perdida.
  floresta: { bpm: 78, reverb: 4, wet: 0.5, rms: 0.12,
    chords: ['Bm', 'G', 'Bm', 'F#', 'Bm', 'G', 'Em', 'F#', 'Bm', 'G', 'Bm', 'F#', 'Em', 'G', 'F#', 'F#'],
    layers: [
      { type: 'arp', inst: 'pluck', oct: 3, vol: 0.12, div: 2, pat: [0, null, 2, null, 1, null, 2, 3], wet: 0.4 },
      { type: 'pad', inst: 'pad', oct: 3, vol: 0.1, every: 2, wet: 0.6 },
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.18, every: 4, wet: 0.3 },
      { type: 'drums', vol: 0.3, bus: 'toms', wet: 0.4, pat: { t: 'x.....x.........' } },
      { type: 'melody', inst: 'flute', vol: 0.16, wet: 0.55, repeat: true, notes: 'F#4:3 E4:1 | D4:2 B3:2 | F#4:3 G4:1 | A#4:4 | B4:3 A4:1 | G4:2 D4:2 | E4:2 G4:2 | F#4:4' },
    ] },

  // Templo/Câmara: órgão, harpa em semicolcheias e tambores rituais.
  masmorra: { bpm: 84, reverb: 4.5, wet: 0.55, rms: 0.13,
    chords: ['Cm', 'Cm', 'Ab', 'Ab', 'Fm', 'Fm', 'G', 'G', 'Cm', 'Cm', 'Ab', 'Bb', 'Fm', 'G', 'Cm', 'G'],
    layers: [
      { type: 'pad', inst: 'organ', oct: 3, vol: 0.09, wet: 0.6 },
      { type: 'arp', inst: 'harp', oct: 4, vol: 0.08, div: 4, pat: [0, 1, 2, 3, 2, 1], wet: 0.5 },
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.2, every: 2, wet: 0.3 },
      { type: 'drums', vol: 0.4, bus: 'toms', wet: 0.4, pat: { T: 'X.....x...x.....', t: '........x.....x.' } },
      { type: 'melody', inst: 'horn', vol: 0.15, from: 8, wet: 0.55, notes: 'G4:2 Eb4:1 F4:1 | G4:3 r:1 | Ab4:2 G4:1 F4:1 | Eb4:3 r:1 | F4:2 Ab4:1 G4:1 | D4:3 r:1 | Eb4:1 D4:1 C4:2 | B3:4' },
      { type: 'melody', inst: 'choir', vol: 0.09, to: 8, wet: 0.7, vow: 'o', notes: 'C5:8 | Eb5:8 | C5:8 | B4:8' },
    ] },

  // Cidade Submersa: piano em eco, sinos de vidro.
  submersa: { bpm: 66, reverb: 6, wet: 0.7, rms: 0.11,
    chords: ['F#m', 'D', 'A', 'E', 'F#m', 'D', 'Bm', 'C#', 'F#m', 'D', 'A', 'E', 'F#m', 'D', 'Bm', 'C#'],
    layers: [
      { type: 'arp', inst: 'piano', oct: 3, vol: 0.12, div: 2, pat: [0, 1, 2, 4, 3, 2, 1, 2], wet: 0.6 },
      { type: 'pad', inst: 'pad', oct: 4, vol: 0.08, every: 2, wet: 0.7 },
      { type: 'melody', inst: 'musicbox', vol: 0.12, wet: 0.8, repeat: true, notes: 'C#6:3 B5:1 | A5:2 F#5:2 | E5:3 A5:1 | G#5:4 | C#6:3 E6:1 | D6:2 B5:2 | A5:2 F#5:1 G#5:1 | F5:4' },
    ] },

  // Vale dos Mortos: coral "ô", harpa lenta e sino.
  vale: { bpm: 60, reverb: 5, wet: 0.6, rms: 0.11,
    chords: ['Am', 'F', 'C', 'E', 'Am', 'F', 'Dm', 'E', 'Am', 'F', 'C', 'E', 'Am', 'F', 'Dm', 'E'],
    layers: [
      { type: 'pad', inst: 'choir', oct: 3, vol: 0.14, vow: 'o', wet: 0.7 },
      { type: 'arp', inst: 'harp', oct: 3, vol: 0.1, div: 1, pat: [0, 1, 2, 1], wet: 0.5 },
      { type: 'hits', vol: 0.12, bus: 'bells', wet: 0.8, list: [[0, 0, 'bell', ['A3']], [4, 0, 'bell', ['A3']], [8, 0, 'bell', ['A3']], [12, 0, 'bell', ['A3']]] },
      { type: 'melody', inst: 'flute', vol: 0.14, from: 4, wet: 0.6, notes: 'E5:3 D5:1 | C5:2 A4:2 | G4:3 C5:1 | B4:4 | A4:3 B4:1 | C5:2 A4:2 | D5:2 C5:1 B4:1 | G#4:4 | E5:3 D5:1 | C5:2 A4:2 | G4:3 C5:1 | B4:4' },
    ] },

  // Batalha: metal veloz em galope.
  batalha: { bpm: 168, reverb: 2, wet: 0.25, rms: 0.17,
    chords: ['Am', 'Am', 'F', 'G', 'Am', 'Am', 'F', 'E', 'Dm', 'Dm', 'Am', 'Am', 'F', 'G', 'E', 'E'],
    layers: [
      { type: 'chug', inst: 'guitar', vol: 0.42, oct: 2, pat: 'x.xxx.xxx.xxx.xx', pan: -0.6, bus: 'gL', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.42, oct: 2, pat: 'x.xxx.xxx.xxx.xx', pan: 0.6, bus: 'gR', wet: 0.08 },
      { type: 'bass', inst: 'bass', oct: 1, vol: 0.38, pat: 'x.xxx.xxx.xxx.xx' },
      { type: 'drums', vol: 0.62, bus: 'kit', wet: 0.12, pat: { k: 'XxXxXxXxXxXxXxXx', s: '....X.......X...', h: 'x.x.x.x.x.x.x.x.' }, fillEvery: 8, fill: { s: '....X...XxXxXXXX', c: 'X...............' } },
      { type: 'pad', inst: 'strings', oct: 4, vol: 0.06, every: 2, wet: 0.35 },
      { type: 'melody', inst: 'lead', vol: 0.22, wet: 0.3, harm: -5, notes: 'A4:0.5 C5:0.5 E5:1 D5:0.5 C5:0.5 B4:1 | C5:1.5 A4:0.5 A4:2 | F4:0.5 A4:0.5 C5:1 B4:0.5 A4:0.5 G4:1 | B4:1.5 G4:0.5 G4:2 | A4:0.5 C5:0.5 E5:1 D5:0.5 E5:0.5 F5:1 | E5:1.5 C5:0.5 A4:2 | F5:1 E5:1 D5:1 C5:1 | B4:2 G#4:2 | D5:1.5 E5:0.5 F5:1 E5:1 | D5:1 C5:1 A4:2 | E5:1.5 D5:0.5 C5:1 B4:1 | A4:4 | A4:1 C5:1 F5:2 | D5:1 G5:1 B4:2 | G#4:1 B4:1 E5:1 G#5:1 | E5:4' },
    ] },

  // Chefe: metal ópera — riff, coral e o tema do Kravenox.
  chefe: { bpm: 150, reverb: 3, wet: 0.35, rms: 0.17,
    chords: ['Dm', 'Dm', 'Bb', 'Bb', 'C', 'C', 'A', 'A', 'Dm', 'Dm', 'Gm', 'Gm', 'Bb', 'A', 'Dm', 'A'],
    layers: [
      { type: 'chug', inst: 'guitar', vol: 0.42, oct: 2, to: 8, pat: 'x.x.x.x.xxx.x.x.', pan: -0.6, bus: 'gL', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.42, oct: 2, to: 8, pat: 'x.x.x.x.xxx.x.x.', pan: 0.6, bus: 'gR', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.36, oct: 2, from: 8, open: true, pat: 'O-------O---O---', pan: -0.6, bus: 'gL', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.36, oct: 2, from: 8, open: true, pat: 'O-------O---O---', pan: 0.6, bus: 'gR', wet: 0.08 },
      { type: 'bass', inst: 'bass', oct: 1, vol: 0.38, pat: 'x.x.x.x.x.x.x.x.' },
      { type: 'drums', vol: 0.62, bus: 'kit', wet: 0.12, pat: { k: 'XxXxXxXxXxXxXxXx', s: '....X.......X...', h: 'x...x...x...x...' }, fillEvery: 4, fill: { s: '....X.......XXXX', c: 'X...............' } },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.15, from: 8, voicing: [0, 1, 2, 3], wet: 0.6 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.08, to: 8, wet: 0.4 },
      { type: 'timp', vol: 0.5, every: 2, oct: 2 },
      { type: 'melody', inst: 'lead', vol: 0.21, to: 8, wet: 0.3, notes: 'D5:1 A4:1 F5:1 E5:1 | D5:1 C#5:1 D5:2 | F5:1 D5:1 Bb5:1 A5:1 | G5:1 F5:1 G5:2 | E5:1 C5:1 G5:1 F5:1 | E5:1 D5:1 E5:2 | C#5:1 E5:1 A5:1 G5:1 | F5:1 E5:1 C#5:2' },
      { type: 'melody', inst: 'lead', vol: 0.22, from: 8, wet: 0.35, harm: -12, notes: 'D5:2 F5:1 A5:1 | G#5:1.5 A5:0.5 F5:1 E5:1 | D5:2 Bb4:1 D5:1 | G5:4 | F5:1.5 E5:0.5 D5:1 F5:1 | E5:2 C#5:2 | D5:2 A4:1 F5:1 | E5:2 C#5:2' },
    ] },

  // Batalha final: coral e orquestra, depois metal com tudo.
  final: { bpm: 140, reverb: 3.5, wet: 0.4, rms: 0.17,
    chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'E', 'E', 'Dm', 'Am', 'F', 'C', 'Dm', 'E', 'Am', 'E',
      'F', 'G', 'Am', 'Am', 'F', 'G', 'E', 'E', 'Dm', 'C', 'Bb', 'A', 'Dm', 'E', 'Am', 'E'],
    layers: [
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.17, voicing: [0, 1, 2, 3], wet: 0.6 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.1, wet: 0.45 },
      { type: 'arp', inst: 'pluck', oct: 4, vol: 0.08, to: 16, div: 4, pat: [0, 1, 2, 1], wet: 0.3 },
      { type: 'timp', vol: 0.55, to: 16, oct: 2 },
      { type: 'drums', vol: 0.5, to: 16, bus: 'orch', wet: 0.3, pat: { T: 'X.......X.......', s: '............x.x.' }, fillEvery: 8, fill: { s: 'xxxxxxxxXXXXXXXX' } },
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, from: 16, pat: 'x.xxx.xxx.xxx.xx', pan: -0.6, bus: 'gL', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, from: 16, pat: 'x.xxx.xxx.xxx.xx', pan: 0.6, bus: 'gR', wet: 0.08 },
      { type: 'bass', inst: 'bass', oct: 1, vol: 0.36, from: 16, pat: 'x.xxx.xxx.xxx.xx' },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.3, to: 16, pat: 'x-------x-------' },
      { type: 'drums', vol: 0.6, from: 16, bus: 'kit', wet: 0.12, pat: { k: 'XxXxXxXxXxXxXxXx', s: '....X.......X...', h: 'x.x.x.x.x.x.x.x.' }, fillEvery: 8, fill: { s: '....X...XxXxXXXX', c: 'X...............' } },
      { type: 'melody', inst: 'choir', vol: 0.15, to: 16, wet: 0.6, notes: 'E5:3 D5:1 | C5:2 A4:2 | G4:3 C5:1 | B4:4 | A4:2 C5:1 E5:1 | F5:2 E5:1 D5:1 | E5:3 G#4:1 | B4:4 | A4:2 D5:1 F5:1 | E5:2 C5:2 | A4:2 C5:1 F5:1 | E5:4 | F5:2 E5:1 D5:1 | E5:2 B4:2 | C5:2 B4:1 A4:1 | G#4:4' },
      { type: 'melody', inst: 'horn', vol: 0.12, to: 16, wet: 0.5, shift: -12, notes: 'E5:3 D5:1 | C5:2 A4:2 | G4:3 C5:1 | B4:4 | A4:2 C5:1 E5:1 | F5:2 E5:1 D5:1 | E5:3 G#4:1 | B4:4 | A4:2 D5:1 F5:1 | E5:2 C5:2 | A4:2 C5:1 F5:1 | E5:4 | F5:2 E5:1 D5:1 | E5:2 B4:2 | C5:2 B4:1 A4:1 | G#4:4' },
      { type: 'melody', inst: 'lead', vol: 0.22, from: 16, wet: 0.35, harm: -12, notes: 'A5:2 G5:1 F5:1 | G5:2 D5:2 | E5:3 C5:1 | A4:4 | A5:2 G5:1 F5:1 | G5:2 B5:2 | G#5:4 | E5:4 | F5:2 E5:1 D5:1 | E5:2 C5:2 | D5:2 C5:1 Bb4:1 | C#5:4 | D5:2 E5:1 F5:1 | E5:2 G#5:2 | A5:4 | E5:4' },
    ] },

  // Despedida da mãe: piano, cordas e uma voz.
  despedida: { bpm: 54, reverb: 5, wet: 0.6, rms: 0.12,
    chords: ['Bm', 'G', 'D', 'A', 'Bm', 'G', 'Em', 'F#', 'G', 'A', 'Bm', 'Bm'],
    layers: [
      { type: 'arp', inst: 'piano', oct: 3, vol: 0.13, div: 2, pat: [0, 2, 3, 2, 1, 2, 3, 2], wet: 0.5 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.09, voicing: [0, 1, 2, 3], wet: 0.6 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.14, pat: 'x-------' },
      { type: 'melody', inst: 'flute', vol: 0.17, wet: 0.6, notes: 'F#5:3 E5:1 | D5:2 C#5:2 | B4:4 | A4:2 B4:2 | D5:3 C#5:1 | B4:2 A4:2 | F#4:4 | r:4 | G4:3 A4:1 | B4:2 D5:2 | C#5:2 E5:2 | B4:4' },
      { type: 'melody', inst: 'choir', vol: 0.08, from: 8, wet: 0.7, vow: 'o', notes: 'D5:4 | E5:4 | F#5:4 | F#5:4' },
    ] },

  // Visões de memória: caixinha de música.
  memoria: { bpm: 72, beats: 3, reverb: 4, wet: 0.6, rms: 0.11,
    chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'B', 'B'],
    layers: [
      { type: 'pad', inst: 'pad', oct: 4, vol: 0.1, wet: 0.7 },
      { type: 'melody', inst: 'musicbox', vol: 0.16, wet: 0.6, notes: 'E5:1 B4:1 G4:1 | C5:2 E5:1 | D5:1 B4:1 G4:1 | A4:3 | E5:1 B4:1 G4:1 | C5:2 E5:1 | D#5:1 B4:1 F#4:1 | B4:3' },
      { type: 'arp', inst: 'harp', oct: 3, vol: 0.07, div: 1, pat: [0, 1, 2], wet: 0.5 },
    ] },

  // Final da Parte 1: esperança.
  fim: { bpm: 76, reverb: 4, wet: 0.5, rms: 0.13,
    chords: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G', 'Am', 'Em', 'F', 'C', 'F', 'G', 'C', 'C'],
    layers: [
      { type: 'arp', inst: 'piano', oct: 3, vol: 0.11, div: 2, pat: [0, 1, 2, 3, 2, 1, 2, 1], wet: 0.45 },
      { type: 'pad', inst: 'strings', oct: 4, vol: 0.09, wet: 0.5 },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.08, from: 8, vow: 'o', wet: 0.6 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.15, pat: 'x---x---' },
      { type: 'timp', vol: 0.3, every: 4, oct: 2 },
      { type: 'melody', inst: 'horn', vol: 0.17, wet: 0.45, notes: 'C5:2 E5:1 G5:1 | B4:2 G4:2 | A4:2 C5:1 E5:1 | F5:4 | E5:2 D5:1 C5:1 | D5:2 G4:2 | A4:2 B4:1 C5:1 | D5:4 | C5:2 B4:1 A4:1 | G4:2 E4:2 | F4:2 A4:1 C5:1 | E5:4 | F5:2 E5:1 D5:1 | D5:2 G5:2 | E5:4 | C5:4' },
    ] },

  // Vitória (toca uma vez).
  vitoria: { bpm: 140, loop: false, tail: 3, reverb: 2.5, wet: 0.35, rms: 0.16,
    chords: ['A', 'F', 'G', 'A'],
    layers: [
      { type: 'melody', inst: 'lead', vol: 0.24, harm: -9, notes: 'A4:0.5 C#5:0.5 E5:0.5 A5:2.5 | F5:1 G5:1 A5:2 | G5:0.5 F5:0.5 G5:0.5 B5:2.5 | A5:4' },
      { type: 'hits', vol: 0.4, bus: 'gt', wet: 0.15, dur: 1.6, list: [[0, 0, 'guitar', ['A2', 'E3', 'A3']], [1, 0, 'guitar', ['F2', 'C3', 'F3']], [2, 0, 'guitar', ['G2', 'D3', 'G3']], [3, 0, 'guitar', ['A2', 'E3', 'A3']]] },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.15, wet: 0.5 },
      { type: 'drums', vol: 0.55, bus: 'kit', wet: 0.2, to: 3, pat: { k: 'X.......X.x.....', s: '....X.......X...', c: 'X...............' } },
      { type: 'hits', vol: 0.6, bus: 'end', wet: 0.3, list: [[3, 0, 'c'], [3, 0, 'k'], [3, 0, 'T']] },
    ] },

  // Fim de jogo (toca uma vez).
  gameover: { bpm: 60, loop: false, tail: 4, reverb: 5, wet: 0.6, rms: 0.12,
    chords: ['Dm', 'Gm', 'A', 'Dm'],
    layers: [
      { type: 'pad', inst: 'choir', oct: 3, vol: 0.16, vow: 'o', wet: 0.7 },
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.2, wet: 0.4 },
      { type: 'melody', inst: 'piano', vol: 0.18, wet: 0.6, notes: 'A4:2 G4:2 | Bb4:2 G4:2 | E4:2 C#4:2 | D4:4' },
      { type: 'hits', vol: 0.15, bus: 'bells', wet: 0.8, list: [[0, 0, 'bell', ['D4']], [3, 0, 'bell', ['D3']]] },
    ] },
  // ===================== PARTE 2 =====================
  // O Reino em Guerra: tambores distantes, cordas graves e uma trompa que lembra o tema do Kravenox.
  guerra: { bpm: 92, reverb: 4, wet: 0.45, rms: 0.14,
    chords: ['Dm', 'Dm', 'Bb', 'C', 'Dm', 'Dm', 'Gm', 'A', 'Bb', 'F', 'Gm', 'Dm', 'Bb', 'C', 'A', 'A'],
    layers: [
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.2, every: 4, wet: 0.3 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.09, every: 2, wet: 0.5 },
      { type: 'drums', vol: 0.5, bus: 'war', wet: 0.45, pat: { T: 'X.....x.X.......', t: '....x.......x.x.' }, fillEvery: 4, fill: { T: 'X.....x.X...x.x.', s: '............xxxx' } },
      { type: 'timp', vol: 0.4, every: 2, oct: 2, wet: 0.5 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.22, pat: 'x...x...x...x.x.' },
      { type: 'melody', inst: 'horn', vol: 0.18, wet: 0.5, notes: 'D4:3 F4:1 | A4:2 G#4:1 A4:1 | F4:2 E4:2 | D4:4 | D4:3 F4:1 | A4:2 Bb4:1 A4:1 | G4:3 Bb4:1 | A4:4 | Bb4:2 A4:1 G4:1 | F4:2 C5:2 | Bb4:1.5 A4:0.5 G4:2 | A4:4 | D5:2 C5:1 Bb4:1 | C5:2 E4:2 | E4:2 C#4:2 | A3:4' },
      { type: 'melody', inst: 'choir', vol: 0.07, from: 8, wet: 0.7, vow: 'o', notes: 'D5:4 | C5:4 | D5:4 | D5:4 | F5:4 | E5:4 | E5:4 | C#5:4' },
    ] },
  // Valdora em chamas: ostinato nervoso de cordas, coral e sinos de alarme.
  valdora: { bpm: 112, reverb: 3.5, wet: 0.4, rms: 0.15,
    chords: ['Cm', 'Cm', 'Ab', 'Ab', 'Fm', 'Fm', 'G', 'G', 'Cm', 'Cm', 'Ab', 'Bb', 'Fm', 'Ab', 'G', 'G'],
    layers: [
      { type: 'arp', inst: 'pluck', oct: 3, vol: 0.12, div: 4, pat: [0, 2, 1, 2], wet: 0.25 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.1, wet: 0.4 },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.1, from: 8, voicing: [0, 1, 2], wet: 0.6 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.28, pat: 'x.x.x.x.x.x.x.x.' },
      { type: 'drums', vol: 0.45, bus: 'kit', wet: 0.25, pat: { k: 'X.......X.x.....', s: '....X.......X...', h: 'x.x.x.x.x.x.x.x.' }, fillEvery: 4, fill: { s: '....X.....xxXXXX' } },
      { type: 'hits', vol: 0.12, bus: 'bells', wet: 0.7, list: [[0, 0, 'bell', ['C5']], [4, 0, 'bell', ['C5']], [8, 0, 'bell', ['Eb5']], [12, 0, 'bell', ['D5']]] },
      { type: 'melody', inst: 'strings', vol: 0.12, wet: 0.45, shift: 12, notes: 'G4:2 Ab4:1 G4:1 | Eb4:2 C4:2 | Ab4:2 Bb4:1 C5:1 | Eb5:2 C5:2 | C5:2 Bb4:1 Ab4:1 | G4:2 F4:2 | G4:4 | B3:2 D4:2 | G4:2 Ab4:1 G4:1 | Eb5:2 D5:2 | C5:2 Bb4:1 Ab4:1 | Bb4:2 D5:2 | C5:1.5 Bb4:0.5 Ab4:1 G4:1 | F4:2 Ab4:2 | G4:2 D5:2 | B4:4' },
    ] },
  // Ruínas antigas sob Valdora: drone, sinos e harpa num modo antigo.
  antigo: { bpm: 60, reverb: 6, wet: 0.7, rms: 0.11,
    chords: ['Fm', 'Gb', 'Fm', 'Fm', 'Db', 'Gb', 'C', 'C', 'Fm', 'Gb', 'Ebm', 'Fm', 'Db', 'Gb', 'C', 'C'],
    layers: [
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.26, every: 4, wet: 0.35 },
      { type: 'pad', inst: 'choir', oct: 3, vol: 0.08, every: 2, wet: 0.8, vow: 'o' },
      { type: 'arp', inst: 'harp', oct: 3, vol: 0.1, div: 2, pat: [0, 2, 1, 3], wet: 0.6 },
      { type: 'drums', vol: 0.35, bus: 'heart', wet: 0.3, pat: { b: 'x.......' } },
      { type: 'hits', vol: 0.1, bus: 'bells', wet: 0.8, list: [[1, 2, 'bell', ['C4']], [5, 0, 'bell', ['Db4']], [9, 2, 'bell', ['C4']], [13, 0, 'bell', ['E4']]] },
      { type: 'melody', inst: 'flute', vol: 0.13, wet: 0.7, from: 4, notes: 'C5:3 Db5:1 | C5:2 Ab4:2 | Bb4:3 Ab4:1 | G4:4 | F4:2 Ab4:1 C5:1 | Db5:2 C5:2 | E4:4 | r:4 | C5:3 Db5:1 | Bb4:2 Gb4:2 | Ab4:4 | Bb4:2 C5:2 | E4:4 | r:4' },
    ] },
  // A Ponte dos Céus: vento, flauta e cordas; aventura acima das nuvens.
  ceus: { bpm: 96, reverb: 5, wet: 0.55, rms: 0.13,
    chords: ['F', 'G', 'Em', 'Am', 'F', 'G', 'C', 'C', 'Dm', 'Em', 'F', 'G', 'Am', 'F', 'G', 'G'],
    layers: [
      { type: 'arp', inst: 'harp', oct: 4, vol: 0.1, div: 4, pat: [0, 1, 2, 3], wet: 0.6 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.1, wet: 0.55 },
      { type: 'drums', vol: 0.4, bus: 'wind', wet: 0.9, pat: { w: 'x...............' } },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.18, pat: 'x.......x...x...' },
      { type: 'timp', vol: 0.3, every: 4, oct: 2, wet: 0.6 },
      { type: 'melody', inst: 'flute', vol: 0.18, wet: 0.55, notes: 'A4:1 B4:1 C5:1 E5:1 | D5:3 B4:1 | G4:2 B4:1 E5:1 | C5:4 | A4:1 B4:1 C5:1 F5:1 | E5:2 D5:1 B4:1 | C5:4 | r:2 G4:2 | F4:2 A4:1 D5:1 | E5:2 B4:2 | C5:2 F5:2 | D5:3 B4:1 | C5:2 E5:1 A5:1 | A5:2 F5:2 | G5:4 | D5:4' },
      { type: 'melody', inst: 'horn', vol: 0.1, from: 8, wet: 0.5, shift: -12, notes: 'F4:4 | G4:4 | A4:4 | B4:4 | C5:4 | C5:4 | B4:4 | B4:4' },
    ] },
  // Fortaleza dos Guardiões: órgão, pulsação de cordas e coral em mi menor.
  fortaleza: { bpm: 84, reverb: 5, wet: 0.55, rms: 0.13,
    chords: ['Em', 'Em', 'C', 'D', 'Em', 'Em', 'Am', 'B', 'C', 'G', 'Am', 'Em', 'C', 'D', 'B', 'B'],
    layers: [
      { type: 'pad', inst: 'organ', oct: 3, vol: 0.12, every: 2, wet: 0.6 },
      { type: 'arp', inst: 'pluck', oct: 3, vol: 0.09, div: 4, pat: [0, 0, 2, 0], wet: 0.3 },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.09, from: 8, wet: 0.7 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.2, pat: 'x.x.x.x.' },
      { type: 'drums', vol: 0.35, bus: 'kit', wet: 0.35, pat: { k: 'X.......X.......', s: '........x.......' } },
      { type: 'melody', inst: 'strings', vol: 0.12, wet: 0.55, shift: 12, notes: 'E4:2 G4:1 B4:1 | A4:2 G4:1 F#4:1 | E4:3 G4:1 | F#4:4 | E4:2 G4:1 B4:1 | C5:2 B4:1 A4:1 | B4:3 A4:1 | D#4:4 | E4:2 C5:1 B4:1 | B4:2 D4:2 | C4:2 E4:1 A4:1 | G4:4 | E4:2 G4:1 C5:1 | A4:2 F#4:2 | F#4:2 D#4:2 | B3:4' },
    ] },
  // Tema do pai: piano e violoncelos, o tema do Kravenox em maior, cansado.
  pai: { bpm: 58, reverb: 5, wet: 0.6, rms: 0.12,
    chords: ['Gm', 'Eb', 'Bb', 'F', 'Gm', 'Eb', 'Cm', 'D', 'Eb', 'F', 'Gm', 'Gm'],
    layers: [
      { type: 'arp', inst: 'piano', oct: 3, vol: 0.13, div: 2, pat: [0, 1, 2, 1, 3, 1, 2, 1], wet: 0.5 },
      { type: 'pad', inst: 'strings', oct: 2, vol: 0.1, voicing: [0, 1, 2], wet: 0.55 },
      { type: 'bass', inst: 'bass', oct: 1, vol: 0.12, pat: 'x-------' },
      { type: 'melody', inst: 'strings', vol: 0.12, wet: 0.6, notes: 'G4:3 Bb4:1 | D5:2 C#5:1 D5:1 | Bb4:2 A4:2 | G4:4 | G4:3 Bb4:1 | Eb5:2 D5:1 C5:1 | C5:2 Bb4:1 A4:1 | F#4:4 | Bb4:3 C5:1 | D5:2 F4:2 | G4:4 | G4:4' },
      { type: 'melody', inst: 'choir', vol: 0.06, from: 8, wet: 0.7, vow: 'o', notes: 'G4:4 | A4:4 | Bb4:4 | Bb4:4' },
    ] },
  // O Primeiro: o olho no céu e o gigante — metais graves, tímpanos e coral imenso.
  primeiro: { bpm: 66, reverb: 6, wet: 0.6, rms: 0.14,
    chords: ['Bbm', 'Bbm', 'Gb', 'F', 'Bbm', 'Bbm', 'Db', 'C', 'Bbm', 'Gb', 'Ebm', 'F', 'Bbm', 'Gb', 'F', 'F'],
    layers: [
      { type: 'pad', inst: 'drone', oct: 1, vol: 0.28, every: 2, wet: 0.3 },
      { type: 'pad', inst: 'choir', oct: 3, vol: 0.14, voicing: [0, 1, 2, 3], wet: 0.7 },
      { type: 'pad', inst: 'horn', oct: 2, vol: 0.08, every: 2, wet: 0.5 },
      { type: 'timp', vol: 0.6, every: 1, oct: 2, wet: 0.6 },
      { type: 'drums', vol: 0.5, bus: 'heart', wet: 0.3, pat: { b: 'x.....x.' } },
      { type: 'melody', inst: 'horn', vol: 0.16, wet: 0.6, shift: -12, notes: 'Bb4:3 Db5:1 | F5:2 E5:1 F5:1 | Db5:2 C5:2 | Bb4:4 | Bb4:3 Db5:1 | F5:2 Gb5:1 F5:1 | Eb5:3 Db5:1 | C5:4 | Db5:2 C5:1 Bb4:1 | Db5:2 Gb4:2 | Gb4:2 Bb4:2 | A4:4 | Bb4:3 Db5:1 | F5:2 Gb5:2 | F5:2 E5:2 | F5:4' },
    ] },
  // Seraphyne: duelo — metal em dó menor, coral e o tema dela em contraponto ao do Kravenox.
  seraphyne: { bpm: 156, reverb: 3, wet: 0.35, rms: 0.17,
    chords: ['Cm', 'Cm', 'Ab', 'Bb', 'Cm', 'Cm', 'Fm', 'G', 'Ab', 'Bb', 'Cm', 'Cm', 'Ab', 'Fm', 'G', 'G'],
    layers: [
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, pat: 'x.xxx.x.x.xxx.x.', pan: -0.6, bus: 'gL', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, pat: 'x.xxx.x.x.xxx.x.', pan: 0.6, bus: 'gR', wet: 0.08 },
      { type: 'bass', inst: 'bass', oct: 1, vol: 0.36, pat: 'x.xxx.x.x.xxx.x.' },
      { type: 'drums', vol: 0.6, bus: 'kit', wet: 0.12, pat: { k: 'XxXxXxXxXxXxXxXx', s: '....X.......X...', h: 'x.x.x.x.x.x.x.x.' }, fillEvery: 4, fill: { s: '....X...XxXxXXXX', c: 'X...............' } },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.13, from: 8, voicing: [0, 1, 2, 3], wet: 0.6 },
      { type: 'melody', inst: 'lead', vol: 0.21, wet: 0.35, harm: -12, notes: 'G5:1 Eb5:1 C5:1 G4:1 | Ab4:1 C5:1 Eb5:1 D5:1 | C5:2 Ab4:2 | Bb4:4 | G5:1 Eb5:1 C5:1 G4:1 | Ab4:1 C5:1 F5:1 Eb5:1 | D5:2 Ab4:2 | B4:4 | C5:1.5 D5:0.5 Eb5:1 F5:1 | G5:2 Bb5:2 | Ab5:1 G5:1 F5:1 Eb5:1 | G5:4 | Ab5:1.5 G5:0.5 F5:1 Eb5:1 | D5:2 C5:2 | B4:2 D5:2 | G5:4' },
    ] },
  // ===================== PARTE 3 =====================
  // Além das Montanhas: estrada, esperança cansada; violão de cordas (harpa), flauta e cordas.
  alem: { bpm: 88, reverb: 4, wet: 0.5, rms: 0.13,
    chords: ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'Em', 'Bm', 'G', 'D', 'Em', 'G', 'A', 'A'],
    layers: [
      { type: 'arp', inst: 'harp', oct: 3, vol: 0.12, div: 2, pat: [0, 2, 1, 3, 2, 1, 0, 2], wet: 0.5 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.09, wet: 0.5 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.18, pat: 'x.......x...x...' },
      { type: 'drums', vol: 0.3, bus: 'kit', wet: 0.4, pat: { k: 'X.......X.......', t: '......x.......x.' } },
      { type: 'melody', inst: 'flute', vol: 0.17, wet: 0.5, notes: 'F#4:2 A4:1 D5:1 | C#5:2 E5:2 | D5:3 B4:1 | B4:4 | F#4:2 A4:1 D5:1 | E5:2 C#5:1 A4:1 | B4:2 G4:2 | A4:4 | G4:2 B4:1 E5:1 | D5:2 F#5:2 | E5:2 D5:1 B4:1 | A4:4 | G4:2 B4:1 E5:1 | D5:2 B4:2 | C#5:2 E5:2 | A4:4' },
    ] },
  // O oceano negro e as três luas: pad etéreo, sinos e coro distante.
  mar: { bpm: 56, reverb: 7, wet: 0.75, rms: 0.11,
    chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'E', 'F', 'C', 'Dm', 'Am', 'F', 'G', 'E', 'E'],
    layers: [
      { type: 'pad', inst: 'pad', oct: 3, vol: 0.13, wet: 0.7 },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.08, every: 2, wet: 0.85, vow: 'o' },
      { type: 'drums', vol: 0.4, bus: 'wind', wet: 0.9, pat: { w: 'x.......' } },
      { type: 'hits', vol: 0.12, bus: 'bells', wet: 0.85, list: [[0, 0, 'bell', ['E5']], [2, 2, 'bell', ['C5']], [4, 0, 'bell', ['A4']], [6, 2, 'bell', ['B4']], [8, 0, 'bell', ['F5']], [10, 2, 'bell', ['D5']], [12, 0, 'bell', ['C5']], [14, 0, 'bell', ['G#4']]] },
      { type: 'melody', inst: 'piano', vol: 0.12, wet: 0.8, from: 4, notes: 'A4:2 r:2 | F4:2 r:2 | A4:1 B4:1 C5:2 | D5:4 | E5:2 r:2 | C5:2 r:2 | A4:2 B4:2 | G#4:4 | A4:2 r:2 | F4:2 E4:2 | E4:4 | E4:4' },
    ] },
  // A Primeira Cidade: majestosa e antiga, órgão e trompas, um pouco triste.
  cidade: { bpm: 72, reverb: 5, wet: 0.6, rms: 0.13,
    chords: ['C', 'G', 'Am', 'Em', 'F', 'C', 'Dm', 'G', 'C', 'G', 'Am', 'F', 'Dm', 'Em', 'F', 'G'],
    layers: [
      { type: 'pad', inst: 'organ', oct: 3, vol: 0.11, every: 2, wet: 0.65 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.09, wet: 0.55 },
      { type: 'arp', inst: 'musicbox', oct: 5, vol: 0.07, div: 2, pat: [0, 1, 2, 1], wet: 0.7 },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.16, pat: 'x-------' },
      { type: 'melody', inst: 'horn', vol: 0.15, wet: 0.55, notes: 'E4:2 G4:1 C5:1 | B4:2 D5:2 | C5:3 A4:1 | G4:4 | A4:2 C5:1 F5:1 | E5:2 C5:2 | D5:2 B4:1 G4:1 | G4:4 | E5:2 D5:1 C5:1 | B4:2 G4:2 | A4:2 C5:1 E5:1 | F5:4 | D5:2 C5:1 A4:1 | B4:2 G4:2 | A4:2 C5:2 | B4:4' },
    ] },
  // O Devorador e o exército das sombras: guerra épica, coral e metal pesado.
  devorador: { bpm: 132, reverb: 3.5, wet: 0.4, rms: 0.17,
    chords: ['Em', 'Em', 'C', 'D', 'Em', 'Em', 'Am', 'B', 'C', 'D', 'Em', 'Em', 'C', 'Am', 'B', 'B'],
    layers: [
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, pat: 'x.x.xxx.x.x.xxx.', pan: -0.6, bus: 'gL', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, pat: 'x.x.xxx.x.x.xxx.', pan: 0.6, bus: 'gR', wet: 0.08 },
      { type: 'bass', inst: 'bass', oct: 1, vol: 0.36, pat: 'x.x.xxx.x.x.xxx.' },
      { type: 'drums', vol: 0.6, bus: 'kit', wet: 0.12, pat: { k: 'X.x.X.x.X.x.X.x.', s: '....X.......X...', h: 'x.x.x.x.x.x.x.x.' }, fillEvery: 4, fill: { s: '....X...XxXxXXXX', c: 'X...............' } },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.15, voicing: [0, 1, 2, 3], wet: 0.6 },
      { type: 'timp', vol: 0.5, every: 2, oct: 2 },
      { type: 'melody', inst: 'horn', vol: 0.15, wet: 0.45, notes: 'E5:2 B4:1 G4:1 | C5:2 E5:2 | D5:2 F#5:1 D5:1 | B4:4 | E5:2 G5:1 E5:1 | F#5:2 B4:2 | A4:2 C5:1 E5:1 | D#5:4 | E5:2 B4:1 G4:1 | A4:2 F#4:2 | G4:2 B4:2 | E5:4 | G5:2 E5:1 C5:1 | A4:2 C5:2 | B4:2 D#5:2 | F#5:4' },
    ] },
  // O Rei do Vazio: final do Livro I — coral gigantesco, órgão, metal e o tema do Kravenox transformado.
  reiVazio: { bpm: 144, reverb: 4, wet: 0.45, rms: 0.17,
    chords: ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'C', 'A', 'Dm', 'F', 'Bb', 'C', 'Gm', 'Bb', 'A', 'A',
      'Bb', 'C', 'Dm', 'Dm', 'Bb', 'C', 'A', 'A', 'Gm', 'F', 'Eb', 'D', 'Gm', 'A', 'D', 'A'],
    layers: [
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.17, voicing: [0, 1, 2, 3], wet: 0.6 },
      { type: 'pad', inst: 'organ', oct: 2, vol: 0.08, every: 2, wet: 0.5 },
      { type: 'timp', vol: 0.55, oct: 2 },
      { type: 'drums', vol: 0.5, to: 16, bus: 'orch', wet: 0.3, pat: { T: 'X.......X.......', s: '............x.x.' }, fillEvery: 8, fill: { s: 'xxxxxxxxXXXXXXXX' } },
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, from: 16, pat: 'x.xxx.xxx.xxx.xx', pan: -0.6, bus: 'gL', wet: 0.08 },
      { type: 'chug', inst: 'guitar', vol: 0.4, oct: 2, from: 16, pat: 'x.xxx.xxx.xxx.xx', pan: 0.6, bus: 'gR', wet: 0.08 },
      { type: 'bass', inst: 'bass', oct: 1, vol: 0.36, from: 16, pat: 'x.xxx.xxx.xxx.xx' },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.3, to: 16, pat: 'x-------x-------' },
      { type: 'drums', vol: 0.6, from: 16, bus: 'kit', wet: 0.12, pat: { k: 'XxXxXxXxXxXxXxXx', s: '....X.......X...', h: 'x.x.x.x.x.x.x.x.' }, fillEvery: 8, fill: { s: '....X...XxXxXXXX', c: 'X...............' } },
      { type: 'melody', inst: 'choir', vol: 0.15, to: 16, wet: 0.6, notes: 'D5:2 F5:1 A5:1 | G#5:1.5 A5:0.5 F5:1 E5:1 | D5:3 r:1 | E5:4 | D5:2 F5:1 A5:1 | Bb5:2 A5:1 G5:1 | A5:4 | C#5:4 | D5:2 A4:1 D5:1 | F5:2 C5:2 | D5:2 F5:1 Bb5:1 | G5:4 | Bb4:2 D5:1 G5:1 | F5:2 D5:2 | E5:2 C#5:2 | A4:4' },
      { type: 'melody', inst: 'lead', vol: 0.22, from: 16, wet: 0.35, harm: -12, notes: 'F5:2 G5:1 A5:1 | G5:2 E5:2 | F5:1 E5:1 D5:1 A5:1 | A5:4 | F5:2 G5:1 A5:1 | C6:2 G5:2 | E5:4 | C#5:4 | Bb4:2 D5:1 G5:1 | A5:2 C5:2 | Bb4:2 G5:1 Bb5:1 | A5:4 | Bb5:2 A5:1 G5:1 | E5:2 C#5:2 | D5:4 | E5:4' },
    ] },
  // O novo Reino: céu violeta, duas luas. Fim do Livro I.
  novoReino: { bpm: 70, reverb: 5, wet: 0.6, rms: 0.13,
    chords: ['F', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C', 'Dm', 'Am', 'Bb', 'F', 'Gm', 'Bb', 'C', 'C'],
    layers: [
      { type: 'arp', inst: 'piano', oct: 3, vol: 0.12, div: 2, pat: [0, 1, 2, 3, 2, 1, 2, 1], wet: 0.55 },
      { type: 'pad', inst: 'strings', oct: 3, vol: 0.1, wet: 0.55 },
      { type: 'pad', inst: 'choir', oct: 4, vol: 0.08, from: 8, wet: 0.7, vow: 'o' },
      { type: 'bass', inst: 'bass', oct: 2, vol: 0.15, pat: 'x-------' },
      { type: 'timp', vol: 0.3, every: 4, oct: 2, wet: 0.6 },
      { type: 'melody', inst: 'flute', vol: 0.17, wet: 0.55, notes: 'A4:2 C5:1 F5:1 | E5:2 G5:2 | F5:3 D5:1 | D5:4 | A4:2 C5:1 F5:1 | G5:2 E5:1 C5:1 | D5:2 Bb4:2 | C5:4 | F5:2 E5:1 D5:1 | C5:2 A4:2 | Bb4:2 D5:1 F5:1 | A5:4 | G5:2 F5:1 D5:1 | F5:2 D5:2 | E5:2 G5:2 | F5:4' },
    ] },
};
