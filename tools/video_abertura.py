# Junta os quadros gravados por tools/video_abertura.js com as músicas do jogo e gera
# rpg/video/abertura.mp4 e .webm (o vídeo que passa na tela título).
#   python3 tools/video_abertura.py <pasta-dos-quadros>   (marcas.json fica na pasta acima dela)
import json, os, subprocess, sys
Q = sys.argv[1]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
music = os.path.join(root, 'rpg', 'music')
info = json.load(open(os.path.join(Q, '..', 'marcas.json')))
m, total = dict(info['marks']), info['total']
# trilha por trecho: (início, fim, música)
segs = [
    (0, m['batalha1'], 'title'),
    (m['batalha1'], m['livro2'], 'batalha'),
    (m['livro2'], m['batalha2'], 'escolha'),
    (m['batalha2'], m['chefe'], 'guerraMundos'),
    (m['chefe'], m['final'], 'chefe'),
    (m['final'], total, 'final'),
]
args, filt, labels = [], [], []
for i, (a, b, name) in enumerate(segs):
    a2, b2 = max(0, a - 0.3), min(total, b + 0.5)
    dur = b2 - a2
    args += ['-i', os.path.join(music, name + '.m4a')]
    fin = 0.05 if i == 0 else 0.6
    filt.append(f'[{i + 1}:a]atrim=0:{dur:.2f},asetpts=PTS-STARTPTS,afade=t=in:d={fin},afade=t=out:st={dur - 0.9:.2f}:d=0.9,'
                f'adelay={int(a2 * 1000)}|{int(a2 * 1000)},volume=1.25[s{i}]')
    labels.append(f'[s{i}]')
filt.append(''.join(labels) + f'amix=inputs={len(segs)}:normalize=0,alimiter=limit=0.89,afade=t=out:st={total - 2:.2f}:d=2[aout]')
out = os.path.join(root, 'rpg', 'video')
base = ['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', os.path.join(Q, '%05d.jpg')] + args + ['-filter_complex', ';'.join(filt), '-map', '0:v', '-map', '[aout]', '-t', f'{total:.2f}']
subprocess.run(base + ['-vf', 'scale=640:480:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p',
                       '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(out, 'abertura.mp4')], check=True)
subprocess.run(base + ['-vf', 'scale=640:480:flags=lanczos', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4',
                       '-c:a', 'libopus', '-b:a', '96k', os.path.join(out, 'abertura.webm')], check=True)
for f in ('abertura.mp4', 'abertura.webm'):
    print(f, round(os.path.getsize(os.path.join(out, f)) / 1e6, 2), 'MB')
