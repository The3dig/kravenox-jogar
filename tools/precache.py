# Gera rpg/precache.json: a lista de tudo que o jogo precisa para funcionar sem internet.
import os, json, hashlib
root = os.path.join(os.path.dirname(__file__), '..', 'rpg')
skip = {'sw.js', 'precache.json', 'version.json'}
out = ['./', 'index.html']
for d, _, fs in os.walk(root):
    for f in sorted(fs):
        rel = os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/')
        if rel in skip or rel.startswith('video/'): continue
        # ?h= muda só quando o arquivo muda: o aparelho reaproveita do cache antigo o que não mudou
        h = hashlib.md5(open(os.path.join(d, f), 'rb').read()).hexdigest()[:10]
        out.append(rel if rel == 'index.html' else rel + '?h=' + h)
json.dump(sorted(set(out)), open(os.path.join(root, 'precache.json'), 'w'), indent=0)
print(len(out), 'arquivos')
