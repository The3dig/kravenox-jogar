python3 -c "
import json,glob,os
d={os.path.basename(f)[:-5]:json.load(open(f)) for f in sorted(glob.glob('$(dirname $0)/idx/*.json'))}
json.dump(d,open('/home/user/kravenox-jogar/rpg/music/index.json','w'),separators=(',',':')); print(d)"
