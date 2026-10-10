# Gera rpg/precache.json: a lista de tudo que o jogo precisa para funcionar sem internet.
import os, json
root = os.path.join(os.path.dirname(__file__), '..', 'rpg')
skip = {'sw.js', 'precache.json', 'version.json'}
out = ['./', 'index.html']
for d, _, fs in os.walk(root):
    for f in sorted(fs):
        rel = os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/')
        if rel in skip or rel.startswith('video/'): continue
        out.append(rel)
json.dump(sorted(set(out)), open(os.path.join(root, 'precache.json'), 'w'), indent=0)
print(len(out), 'arquivos')
