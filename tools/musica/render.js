const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const OUT = process.argv[2], names = process.argv.slice(3);
function wav(pcm, sr = 44100) { const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); return Buffer.concat([h, pcm]); }
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('about:blank'); await p.addScriptTag({ path: __dirname + '/compose.js' }); await p.addScriptTag({ path: __dirname + '/tracks.js' });
  const all = names.length ? names : await p.evaluate(() => Object.keys(window.KTRACKS));
  const idxF = OUT + '/index.json'; const idx = fs.existsSync(idxF) ? JSON.parse(fs.readFileSync(idxF)) : {};
  for (const n of all) {
    const t0 = Date.now();
    const r = await p.evaluate(async n => window.renderTrack(window.KTRACKS[n]), n);
    const w = __dirname + '/wav/' + n + '.wav'; fs.mkdirSync(__dirname + '/wav', { recursive: true });
    fs.writeFileSync(w, wav(Buffer.from(r.b64, 'base64')));
    execSync(`ffmpeg -y -loglevel error -i ${w} -c:a aac -b:a 128k ${OUT}/${n}.m4a`);
    fs.mkdirSync(__dirname + '/idx', { recursive: true }); fs.writeFileSync(__dirname + '/idx/' + n + '.json', JSON.stringify(r.loop ? { loop: 1, a: r.a, b: +(r.a + r.L).toFixed(7) } : { loop: 0 }));
    console.log(n, 'L', r.L.toFixed(1), 'rms', r.rms.toFixed(3), 'peak', r.peak.toFixed(2), 'k', r.k.toFixed(2), ((Date.now() - t0) / 1000).toFixed(1) + 's', fs.statSync(`${OUT}/${n}.m4a`).size);
  }
  console.log(errs.join('\n') || 'no errors'); await b.close();
})();
