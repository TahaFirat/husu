# Huşu

React + TypeScript + Tailwind CSS + Lucide; Vinext üzerinden sunuculu web uygulaması.

## Çalıştırma

Node 22.13+ ile `npm install`, `npm run dev`; üretim için `npm run build`.
Bu Windows ortamında npm başlatıcısı bozuksa:
`node "C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js" install`
`node scripts/run-framework.mjs dev`

Gemini için sunucu ortamına `GEMINI_API_KEY` ekleyin. Tarayıcıya anahtar gönderilmez. Anahtarsız durumda ayetler ve editoryal çekirdek çalışır; AI analizi açık bir 503 mesajıyla devre dışıdır.

## İçerik ve kaynaklar

- 114 sure, 6.236 ayet metadata dizini: https://api.alquran.cloud/v1/meta
- 26 çevrimdışı sure/aşır seçimi: 25 sure ID’sinden 156 ayet. Bakara 255 ve 285–286 ayrı seçimlerdir. Haşr yalnız 22–24, Alak yalnız 1–5 gömülüdür; tam sureler canlı servisten yüklenir.
- Arapça: `quran-uthmani`; meal: `tr.diyanet`; ses: `ar.alafasy`, AlQuran Cloud.
- Kelime kelime Türkçe anlam ve kaynak Latin çevriyazısı: https://api.quran.com/api/v4/verses/by_chapter/103?language=tr&words=true&word_fields=text_uthmani
- 8 namaz duası: editoryal Arapça, Türkçe okunuş, anlam ve kelime sözlüğü. Hanefî gelenekteki Kunut 1–2 kullanılır. Diyanet namaz portalı: https://namaz.diyanet.gov.tr/namaz/
- Okuma ekranında tefekkür, öğüt ve yapay zekâ yorumları gösterilmez. Eski analiz kayıtları okunmaz ve otomatik analiz isteği gönderilmez.

## Ana sayfa

`/` sade ana sayfadır; okuma ekranı `/oku` yolundadır. Günün ayeti, kaynak yanıtları saklanmış yedi kısa ve tam ayetten her gün rastgele seçilir (13:28, 2:152, 11:90, 42:19, 94:5, 39:53, 50:16). Seçim cihazda gün/ayet kimliğiyle saklanır; aynı gün yenilenince değişmez, yeni günde önceki seçimin tekrarı önlenir. Sure/ayet numarası, `tr.diyanet` meal sürümü, kaynak yanıtı bağlantısı ve ayeti bağlamıyla okuma bağlantısı gösterilir. Bu sürüm güncel Kur’an Yolu meali olarak etiketlenmez. Kaynak kayıtları `outputs/daily-source-audit.json` içindedir. Ayet kesilmez, ek yorum üretilmez. Açık/koyu tema iki sayfada ortaktır.

## Davranış ve sınırlar

Açık Kuran ilk kaynak, AlQuran Cloud yedektir. İstekler sabit sağlayıcı adreslerine gider ve zaman aşımı içerir. Tam sureler ve eksiksiz Türkçe kelime aralıkları tarayıcı localStorage önbelleğine alınır. Favoriler, son okunanlar, seçilen metin ve görünüm ayarları bu cihazda saklanır. Tarayıcı verileri silinirse kayıtlar da silinir.

Çevrimdışı kabuk ilk başarılı çevrimiçi açılıştan sonra üretimde service worker ile saklanır. Yeni cihazda ilk ziyaret için ağ gerekir. Sesler gömülü değildir ve internet gerektirir. Namaz dualarının tamamı için doğrulanmış ses kaydı eklenmemiştir; düğme bunu açıkça bildirir.

Fâtiha, Asr ve dualarda Türkçe editoryal okunuş vardır. Kaynağın İngilizce etiketli kelime çevriyazısı artık arayüzde gösterilmez. Türkçe editoryal okunuşu bulunmayan ayetlerde okunuş düğmesi gösterilmez. Tam Türkçe okunuş kapsamı tamamlanmış değildir.

Okuma ekranı doğrudan metin seçimi ve ayet/mealle başlar. Sayaç, sabit alt bar, kilit ekranı, vakit rozeti ve seri sayacı kaldırılmıştır.

Üst bardaki A− / A+ / A++ ayarı Normal / Büyük / Çok Büyük boyutlarını seçer; varsayılan Büyük, tercih localStorage içinde kalıcıdır. Koyu temada Arapça ayetler beyaz, açık temada koyu yeşildir; mealler her iki temada yüksek kontrastlıdır. Her ayetin okunuşu ayrı açılır. Arapça kelimeye dokunulduğunda aynı metinde ilgili grup vurgulanır ve altında okunuş/anlam gösterilir. Duanın tam anlamı ayrıca korunur. Olumsuzluklar, özellikle “ve lâ nekfürük” ve şehadet ifadesi, parçalanmadan birlikte ele alınır. Gruplar 8 duanın bütün kelimelerini kapsar ve metinle sıra bazında doğrulanır.

Çarpıcı kelimeler, özet/hatırlatma kartları, görünüm sekmeleri ve ana ekrandaki kategori sekmeleri kaldırılmıştır. Tek “Sure veya dua seç” penceresi ortak arama, içerik filtresi, favoriler ve son okunanları sunar.

Cihazda Türkçe konuşma sesi varsa seçilen Türkçe anlamı dinleme düğmesi görünür. Bu bir tilavet değildir. Ses listesi geç yüklenebilir; destek henüz yokken düğme gizlenir, Türkçe ses yüklendiğinde görünür. Bu oturumda ilk denemede ses bulunmadığı durum doğrulandı; daha sonra Türkçe ses desteği algılandı. Sesin gerçekten duyulduğu doğrulanmış değildir.

Rekat sekmeleri ve rekatlara bağlı Tam Akış kaldırılmıştır. Uygulama tek sure/dua ve ayet aralığı seçimiyle çalışır. Eski favori çiftlerinin her metni tekil favoriye taşınır; eski saklama anahtarları silinmez. Önceki seçimler artık başlangıçta açılmaz; okuma Fâtiha ile başlar. Son okunan sekiz farklı metin/aralık kalıcı olarak saklanır.

Açık / Koyu tema düğmeleri üst bardadır. Tema tercihi cihazda saklanır; ilk açılışta cihazın renk tercihi izlenir. Tema ilk boyamadan önce uygulanır. Açık tema okuma kartları, Arapça, meal, okunuş, kelime kutuları, arama, favoriler, seçim penceresi ve hata durumlarını kapsar.

Uzun surelerde 1–5 / 6–10 / Son 3 Ayet çipleri seçimi doğrudan uygular. Özel aralık en fazla 15 ayettir. Canlı seçimin eksik kelime verisi Quran.com sabit kaynaklı sunucu uç noktasından alınır ve aralık bazında önbelleklenir. Kelime anlamları doğrudan kaynak veriden, dua ifade grupları editoryal anlam eşlemesinden gelir; yeni yorum üretilmez.

Eski AI uç noktası geriye uyumluluk için korunur; arayüzde kullanılmaz. Bu uç noktada seçili en fazla 15 ayetten JSON şemasıyla analiz üretilir. Arapça anahtarlar ile Türkçe eşleşmelerin aynı kaynak ayette gerçekten bulunması sunucuda denetlenir; serbest HTML basılmaz. Model önerileri ayrıca etiketlenir. Anahtar sağlanmadan canlı model üretimi test edilmiş sayılmaz.

## Doğrulama

- `node node_modules/typescript/bin/tsc --noEmit`
- `node scripts/validate-data.mjs` — 114/6236 dizin bütünlüğü, 156 ayet ve kelime verisi, 26 seçkinin anahtar eşleşmeleri, 8 duanın tam kelime kapsamı.
- `node scripts/validate-daily-verse.mjs` — kısa tam ayetler, kaynak eşitliği, gün içi kararlılık ve gün değişimi.
- `node scripts/validate-word-interaction.mjs` — 8 duanın tam grup kapsamı, olumsuz ifadelerin korunması, Arapça token eşleştirme ve eksik eşleşmede anlam uydurulmaması.
- `node scripts/validate-library.mjs` — eski favorilerin taşınması, yinelenenlerin ayıklanması, son okunanlar sınırı ve kaynak kelime seçkisi.
- `node scripts/smoke-live.mjs` — çalışan localhost:5173 ile gerçek sure servisleri ve hata durumları.
- `node scripts/run-framework.mjs build`

API ilk kaynak, AI üretimi, çevrimdışı yeniden yükleme ve sesin gerçekten duyulması ayrı doğrulama düzeyleridir. Kaynak dosyalarındaki veri kontrolleri bağımsız dinî içerik incelemesinin yerine geçmez.

## 20 Ekim 2026 tasarım ve veri denetimi

Ana sayfa açık/koyu temada yenilendi: masaüstünde iki sütun, dar ekranda tek sütun; tam meal öncelikli kart, isteğe bağlı Arapça metin ve tek okuma eylemi. Araştırma kapsamı ve kararlar `MARKET_RESEARCH.md` içindedir. Sosyal medya popülerliği ölçülmedi; ayetler umut, rahmet, anma ve yakınlık temalarına göre editoryal seçildi.

Kelime etkileşimi bütün ayetin kaynak sırasını karşılaştırır; herhangi bir kelime uyuşmazsa tahmini/atlamalı eşleştirme yapılmaz. Hamza harfi korunur; yalnız hareke, vakıf işareti ve bilinen yazım sunumu farkları karşılaştırmada sadeleştirilir. Eksik besmeleye yalnız birinci ayetin tam dört kelimelik besmele ön eki olduğunda izin verilir. Gösterilen Arapça değiştirilmez. 156 gömülü ayetin ve 8 duanın token/grup kapsamı fixture testiyle denetlenir; bu semantik uzman onayı değildir.

Canlı kaynakta ayet kimliği, kelime sırası ve Türkçe dil etiketi kontrol edilir. Sağlayıcının tek kelimede bile İngilizceye dönmesi durumunda o ayetin tüm kelime etkileşimi kapatılır; diğer ayetler ve tam meal çalışır. Boş dizi bu açık eksiklik durumudur; kısmi Türkçe sonuç kalıcı önbelleğe yazılmaz. Eski filtrelenmiş kelime önbelleği `words:v2` anahtarıyla devre dışı kalır. Sure ve kelime önbellekleri kimlik/aralık/sıra/boş metin açısından doğrulanır. Mülk 28 canlı denemesinde İngilizce `a punishment` karşılığı nedeniyle bu koruma devreye girmiştir.

Tam canlı kelime taraması: 156 ayetin tamamına yanıt alındı; 107 ayette saklanan karşılıklar kaynakla birebir aynı ve bütün kelimeler Türkçe etiketliydi. 49 ayette toplam 67 İngilizce geri dönüş bulundu. Bunlar `lib/verified-word-sources.json` izin listesine alınmadı; gömülü anlam etkileşimi kapalıdır. Ham eski veri karşılaştırma/geriye uyumluluk için korunur; bu verinin varlığı arayüzde gösterildiği anlamına gelmez. Kaynak eksikleri güncel canlı istekle yeniden kontrol edilir. Rapor `outputs/word-source-audit.json` içindedir. İlk turdaki kısa zaman aşımı hataları ikinci turda gerçek 12 saniyelik süreyle tekrar denendi; son durumda başarısız istek yoktur. Bu sayılar kaynak ve dil eşitliği denetimidir, anlamların dinî uzman tarafından doğrulandığı iddiası değildir.

## Fâtiha başlangıcı ve Arapça görünüm

Okuma ekranı her yeni açılışta Fâtiha 1–7 ile başlar. Önceki seçim otomatik açılmaz; favoriler ve son okunanlar korunur. Ana sayfa ve günlük ayet kalır; okumaya geçiş Fâtiha’yı açar.

Arapça sunumda yalnız U+0671 vasıl işaretli elif (`ٱ`), sade elif (`ا`) olarak gösterilir. Kaynak dizeleri, meal, kelime eşleştirmesi ve ses değiştirilmez. Şedde, harekeler, asli hemzeler ve vakıf işaretleri korunur. Aynı sunum ayet satırı, seçilen kelime paneli ve günün ayetinde uygulanır. Arapça kelimelerin dekoratif alt çizgileri kaldırılmıştır; hareke görünümü için Noto Naskh Arabic kullanılır. Bu bir bütüncül imla dönüşümü veya yeni Türkçe okunuş üretimi değildir; kaynak Latin çevriyazısı Türkçe telaffuz olarak etiketlenmez.

## Çevriyazı sadeleştirmesi — 21 Ekim 2026

`l-lahi`, `l-rahmani` gibi kaynak kelime çevriyazıları bütün Kur’an kelime panellerinden kaldırıldı. Arapça ve Türkçe anlam korunur. Dua ifade gruplarının Türkçe editoryal okunuşları kalır. Ayet düzeyinde yalnız Fâtiha ve Asr için mevcut Türkçe editoryal kayıtlar kullanılır; API veya önbellekteki Latin metinleri birleştirilerek Türkçe okunuş yapılmaz. Diğer ayetlerde okunuş düğmesi yoktur. Ham kaynak alanları API/veri uyumluluğu için saklanır, arayüzde kullanılmaz.

Araştırma: [Quranic Arabic Corpus çevriyazı açıklaması](https://corpus.quran.com/documentation/phonetic.jsp), vasıl hemzesinin bu sistemde `l-`, ayet başında `al-` ile yazıldığını belirtir. Bu, Türkçe telaffuz kılavuzu değildir; harfleri tahminen değiştirerek yeni okunuş üretilmedi.
