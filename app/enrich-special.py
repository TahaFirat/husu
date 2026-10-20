import json
from pathlib import Path
p=Path('lib/enrichment.json');d=json.loads(p.read_text(encoding='utf8'));c=json.loads(Path('lib/core.json').read_text(encoding='utf8'));v=next(s for s in c['surahs'] if s['id']==2)['verses'];ks=[]
for n,a,t,m,match,note in [(285,'سَمِعْنَا','Semi‘nâ','İşittik','işittik','Dinlediğin hakikatin hayatında bir karşılığı olsun.'),(285,'وَأَطَعْنَا','Ve eta‘nâ','İtaat ettik','itaat ettik','Yönelişini yalnız söze değil, davranışına da taşı.'),(286,'وَٱغْفِرْ','Vağfir','Bağışla','bağışla','Eksiklerinle birlikte Rabbine yönelmeye cesaret et.')]:
 verse=next(x for x in v if x['number']==n);assert a in verse['arabic'] and match in verse['translation'];ks.append(dict(arabic=a,transliteration=t,meaning=m,match=match,deepNote=note,verse=n))
d['2-285']=dict(husuMessage='İşittik ve itaat ettik diyerek kalbini Rabbine yöneltiyorsun. Gücünü aşan yükler için yardım, eksiklerin için bağışlanma iste.',keyWords=ks);p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
