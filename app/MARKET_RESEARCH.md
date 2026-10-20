# Huşu — ürün ve içerik araştırması

Tarih: 20 Ekim 2026. Kapsam: herkese açık ürün sayfaları ve birincil metin kaynakları. Bu çalışma kullanıcı testi, pazar payı analizi, sosyal medya beğeni ölçümü veya popüler ayet sıralaması değildir.

| İncelenen ürün | Gözlenen yaklaşım | Huşu için karar |
| --- | --- | --- |
| [Quran.com](https://quran.com/) | Okuma, arama, meal, kelime anlamı ve günün ayeti girişleri | Metni önceliklendir; kaynağı ve ayet kimliğini görünür tut; anlam için dokunmayı koru. |
| [Quran.org](https://quran.org/) — aynı ürün ekosistemi | Yazı, meal, düzen ve görünüm tercihlerine vurgu | Mevcut tema/boyut tercihlerini koru; ana sayfada yeni ayar sekmesi oluşturma. |
| [Quranly](https://www.quranly.app/) | Günlük okuma alışkanlığı, hedefler ve oyunlaştırma | Günlük tek ayet ritmini al; kullanıcının kaldırdığı seri sayacını ve ek hedef panellerini geri getirme. |

## Uygulanan tasarım

Tek ana eylem: okumaya başla. Masaüstünde başlık ve eylem solda, günün ayeti sağda; dar ekranda doğal tek sütun. Koyu yeşil ve sıcak açık zemin, belirgin tipografi, az süsleme ve rahat aralıklar. Günün tam meali kartın ana öğesi; Arapçası tek açılır bölümde. Kaynak ve bağlam bağlantıları ikincil ağırlıkta. İlave kategori veya görünüm sekmesi yok.

## Ayet seçimi ve doğruluk sınırı

Seçki: Ra‘d 28, Bakara 152, Hûd 90, Şûrâ 19, İnşirâh 5, Zümer 53, Kâf 16. Umut, Allah’ı anma, rahmet, dönüş ve yakınlık temaları; hiçbiri sosyal medyanın en popüler ayeti olarak sunulmaz. Arapça ve Türkçe metinler AlQuran Cloud `quran-uthmani` / `tr.diyanet` gerçek yanıtlarından bütünüyle alındı. Yanıtlar ve sürüm kimlikleri `outputs/daily-source-audit.json` içinde saklandı. Meal kısaltılmaz ve yapay zekâ yeniden yazımı yapılmaz.

Diyanet sürümleri birbirine karıştırılmaz: [Bakara 152 Kur’an Yolu açıklaması](https://kuran.diyanet.gov.tr/tefsir/Bakara-suresi/159/152-ayet-tefsiri), [Zümer 53 tefsiri](https://kuran.diyanet.gov.tr/tefsir/Z%C3%BCmer-suresi/4111/53-ayet-tefsiri), [İnşirâh 5–8 tefsiri](https://kuran.diyanet.gov.tr/tefsir/%C4%B0n%C5%9Fir%C3%A2h-suresi/6095/5-8-ayet-tefsiri). Özellikle Zümer 53’ün bağlamı tek bir motivasyon sloganına indirgenmez; tam ayet ve bağlama erişim korunur. Bu sayfalardaki güncel meal ile API’nin `tr.diyanet` sürümünün birebir aynı olduğu iddia edilmez.

Dua okunuşlarını karşılaştırmak için [Diyanet müftülüğü namaz duaları belgesi](https://webdosyasp.diyanet.gov.tr/muftuluk/UserFiles/mersin/Ilceler/gulnar/UserFiles/Files/NAMAZ%20DUALARI_59c3c23b-aef6-4619-847d-ed0371415410.pdf) incelendi. Bu, bütün editoryal ifade meallerinin bağımsız uzman tarafından onaylandığı anlamına gelmez. Otomatik testler sıra, kapsam, kaynak eşitliği ve olumsuz ifadelerin bölünmemesini denetler; dinî uzman incelemesinin yerine geçmez.
