python3 -c "
import json,glob,os
f='/home/user/kravenox-jogar/rpg/music/index.json'
d=json.load(open(f)) if os.path.exists(f) else {}
d.update({os.path.basename(p)[:-5]:json.load(open(p)) for p in sorted(glob.glob('$(dirname $0)/idx/*.json'))})
json.dump(d,open(f,'w'),separators=(',',':')); print(len(d),'faixas')"
