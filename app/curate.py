import json,re
from pathlib import Path
core=json.loads(Path('lib/core.json').read_text(encoding='utf8'))
def norm(s):return re.sub(r'[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\ufeff]','',s).replace('ٱ','ا').replace('ٰ','')
rows={
1:('Her yönelişinde yeniden bir yol istiyorsun. Kalbini de dilinle birlikte dosdoğru yola çağır.',[(2,'الحمد','El-hamd','Bütün övgü','Hamd'),(2,'رب','Rabb','Rab','Rabbi'),(3,'الرحيم','Er-Rahîm','Merhameti sonsuz','Rahim')]),
2:('Seni ayakta tutanın hiç uyumadığını hatırla. Kaygılarını, gökleri ve yeri gözetene emanet et.',[(255,'الحى','El-Hayy','Daima diri','diri'),(255,'القيوم','El-Kayyûm','Her şeyi ayakta tutan','gözetip durandır'),(255,'العظيم','El-Azîm','Pek büyük','büyüktür')]),
59:('Görüneni de kalbinde saklı olanı da bilen Rabbine yöneliyorsun. O’nun isimlerini düşünürken kalbine bir sükûnet davet et.',[(22,'علم','Âlim','Bilen','bilen'),(23,'السلم','Es-Selâm','Esenlik veren','esenlik veren'),(24,'الخلق','El-Hâlık','Yaratan','vareden')]),
93:('Kuşluk aydınlığını ve gecenin sükûnetini hatırla. Rabbinin Peygamberine tesellisi üzerine düşünürken umudunu tazele.',[(1,'والضحى','Ved-duhâ','Kuşluk vakti','Kuşluk'),(2,'واليل','Vel-leyl','Gece','geceye'),(3,'ربك','Rabbüke','Rabbin','Rabbin')]),
94:('Omuzlarında taşıdığın yükü bir an fark et. Gönlünün ferahlığını Rabbinden iste.',[(1,'صدرك','Sadrak','Göğsün, gönlün','gönlünü'),(2,'وزرك','Vizrak','Yükün','yükünü'),(3,'ظهرك','Zahrak','Sırtın','Belini')]),
95:('İncirden zeytine, güvenli beldeye uzanan işaretleri düşünüyorsun. Hayatın içindeki nimetlere dikkatle bak.',[(1,'والتين','Vet-tîn','İncir','İncir'),(1,'والزيتون','Vez-zeytûn','Zeytin','zeytine'),(3,'الأمين','El-emîn','Güvenli','güvenli')]),
96:('Okumayı, seni yaratanın adıyla başlatıyorsun. Bildiklerinin de bilmediklerinin de önünde tevazuyla dur.',[(1,'اقرأ','İkra','Oku','oku'),(1,'ربك','Rabbike','Rabbin','Rabbinin'),(2,'الإنسن','El-insân','İnsan','insanı')]),
97:('Bir gecenin bin aydan hayırlı oluşunu düşün. Bu kısa anı da kalbinle yaşayabileceğini hatırla.',[(1,'أنزلنه','Enzelnâhü','Onu indirdik','indirmişizdir'),(2,'القدر','El-kadr','Kadir','Kadir'),(3,'خير','Hayr','Daha hayırlı','hayırlıdır')]),
98:('Açık delili ve arınmış sahifeleri dinliyorsun. Kalbini hakikati arayan bir dikkatle hazırla.',[(1,'البينة','El-beyyine','Apaçık delil','apaçık bir belge'),(2,'رسول','Resûl','Elçi','Peygamber'),(2,'مطهرة','Mutahhara','Arınmış','arınmış')]),
99:('Dünyanın sarsıldığı anı düşünüyorsun. Bugünkü küçük iyiliklerinin kıymetini hatırla.',[(1,'زلزلت','Zülzilet','Sarsıldı','sarsıldığı'),(2,'أثقالها','Eskâlehâ','Ağırlıkları','ağırlıklarını'),(3,'الإنسن','El-insân','İnsan','insanın')]),
100:('Koşanların gücünü ve hareketini dinliyorsun. Kendi gayretinin hangi yöne aktığını düşün.',[(1,'والعديت','Vel-âdiyât','Koşanlar','koştukça koşanlara'),(2,'قدحا','Kadhan','Kıvılcım çıkararak','kıvılcımlar'),(3,'صبحا','Subhan','Sabahleyin','Sabah sabah')]),
101:('Büyük sarsıntının sorusu seni durup düşünmeye çağırıyor. Günlük telaşın içinde ahirete de yer aç.',[(1,'القارعة','El-kâria','Sarsıcı hadise','Gürültü koparacak olan'),(2,'ما','Mâ','Nedir','Nedir'),(3,'أدرىك','Edrâke','Sana bildirdi','bilir misin')]),
102:('Çoğaltma yarışının seni ne kadar meşgul ettiğini düşün. Kalbine, sahip olduklarından daha geniş bir alan aç.',[(1,'التكاثر','Et-tekâsür','Çokluk yarışı','Çoğunluk olmak iddianız'),(2,'المقابر','El-mekâbir','Kabirler','mezarları'),(3,'تعلمون','Ta‘lemûn','Bileceksiniz','bileceksiniz')]),
103:('Şu an Rabbine, hızla eriyen ömrünün ziyan olmaması için iman ve sabır sözü veriyorsun. Bu kısa anı, kalbinin yeniden yönelişine dönüştür.',[(1,'والعصر','Vel-asr','Akıp giden ömür','İkindi vaktine (Asra; çağa)'),(2,'خسر','Husr','Ziyana uğramak','hüsran'),(3,'بالصبر','Bis-sabr','Sabırda buluşmak','sabırlı olmayı')]),
104:('Dilinle incitmenin ve mala sığınmanın sonunu düşünüyorsun. Bugün bir insanın onurunu korumaya niyet et.',[(1,'همزة','Hümeze','Çekiştiren','çekiştirip'),(2,'مالا','Mâlen','Mal','Mal'),(3,'أخلده','Ahledeh','Ölümsüz kıldı','ölümsüz kılacağını')]),
105:('Görünürdeki büyük gücün her şeye yetmediğini hatırla. Sığınağını, gücün gerçek sahibinde ara.',[(1,'الفيل','El-fîl','Fil','Fil'),(2,'كيدهم','Keydehüm','Düzenleri','düzenlerini'),(3,'طيرا','Tayran','Kuşlar','kuşlar')]),
106:('Doymak ve güvende olmak ne büyük nimet. Şükrünü, bu nimetlerin Rabbine yönelterek dile getir.',[(1,'قريش','Kureyş','Kureyş','Kureyş'),(2,'الشتاء','Eş-şitâ','Kış','kış'),(3,'فليعبدوا','Fel-ya‘büdû','Kulluk etsinler','kulluk etsinler')]),
107:('İbadetinle merhametin arasındaki bağı düşünüyorsun. Namazdan sonra da bir ihtiyaç sahibini görmeye niyet et.',[(1,'بالدين','Bid-dîn','Din, hesap günü','Dini'),(2,'اليتيم','El-yetîm','Yetim','Öksüzü'),(3,'المسكين','El-miskîn','Yoksul','yoksulu')]),
108:('Sana verilen nimetleri hatırla. Şükrünü, yalnız Rabbine yönelerek ifade et.',[(1,'الكوثر','El-kevser','Bol hayır','pek çok nimet'),(2,'فصل','Fe-salli','Namaz kıl','namaz kıl'),(2,'وانحر','Venhar','Kurban kes','kurban kes')]),
109:('Kulluğunun yönünü berraklaştırıyorsun. Kalbini, inandığın hakikate sadakatle hazırla.',[(1,'قل','Kul','Söyle','De ki'),(2,'أعبد','A‘büdü','Kulluk ederim','tapmam'),(3,'عبدون','Âbidûn','Kulluk edenler','tapmazsınız')]),
110:('Başarı ve yardım geldiğinde de Rabbini hatırlıyorsun. Şükrü ve bağışlanma dileğini birlikte taşı.',[(1,'نصر','Nasr','Yardım','yardımı'),(1,'والفتح','El-feth','Fetih, zafer','zafer'),(3,'واستغفره','Vestağfirh','Bağışlanma dile','bağışlama dile')]),
111:('Malın ve kazancın tek başına kurtarmadığını düşünüyorsun. Kalbinin neye yaslandığını gözden geçir.',[(1,'تبت','Tebbet','Kurusun','kurusun'),(2,'ماله','Mâlüh','Malı','Malı'),(3,'نارا','Nâran','Ateş','ateşe')]),
112:('Kalbinin yönünü tek olana çeviriyorsun. Her ihtiyaçta sığınacağın kapının O olduğunu hatırla.',[(1,'أحد','Ehad','Bir ve tek','bir tektir'),(2,'الصمد','Es-Samed','Her şey O’na muhtaç','her şey O\'na muhtaçtır'),(3,'يلد','Yelid','Doğurmak','doğurmamış')]),
113:('Karanlığın ve kıskançlığın şerrinden Rabbine sığınıyorsun. Endişelerini, tan yerini ağartana emanet et.',[(1,'أعوذ','Eûzü','Sığınırım','sığınırım'),(1,'الفلق','El-felak','Tan yeri','tan yerini'),(2,'شر','Şerr','Kötülük','şerrinden')]),
114:('Kalbinin içindeki sessiz vesveseleri fark ediyorsun. İnsanların Rabbine sığınarak dikkatini yeniden topla.',[(1,'برب','Rabb','Rab','Rabbi'),(2,'ملك','Melik','Hükümran','Hükümranı'),(3,'إله','İlâh','İlah','Tanrısı')])}
# Uthmani spellings differ from ordinary Arabic; preserve the exact source token.
out={}
for s in core['surahs']:
 msg,ks=rows[s['id']];words=[]
 for number,base,latin,meaning,match in ks:
  v=next(v for v in s['verses'] if v['number']==number)
  candidates=v['arabic'].split();hits=[w for w in candidates if norm(w)==base]
  if not hits:
   print('MISSING',s['id'],base,[norm(w) for w in candidates]);continue
  assert match in v['translation'],(s['id'],match)
  words.append(dict(arabic=hits[0],transliteration=latin,meaning=meaning,match=match,verse=number,deepNote=f'{meaning}: Bu anlamı okurken bir an dur ve kalbinde hisset.'))
 out[str(s['id'])]=dict(husuMessage=msg,keyWords=words)
Path('lib/enrichment.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
