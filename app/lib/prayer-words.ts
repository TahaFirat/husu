// Conventional editorial word meanings; these are not a provider response.
const entries=`سبحانك|Sübhâneke|Seni eksikliklerden uzak tutarım
اللهم|Allâhümme|Allah’ım
وبحمدك|Ve bi-hamdik|Sana hamd ederek
وتبارك|Ve tebâreke|Mübarektir
اسمك|İsmük|Senin adın
وتعالى|Ve teâlâ|Yücedir
جدك|Ceddük|Senin şanın
ولا|Ve lâ|Ve yoktur / değildir
إله|İlâhe|İlah
غيرك|Ğayrük|Senden başka
التحيات|Ettehiyyâtü|Bütün saygılar
لله|Lillâhi|Allah içindir
والصلوات|Ves-salevâtü|İbadetler
والطيبات|Vet-tayyibâtü|Güzel sözler ve işler
السلام|Esselâmü|Selam
عليك|Aleyke|Senin üzerine
أيها|Eyyühe|Ey
النبي|En-nebiyyü|Peygamber
ورحمة|Ve rahmetü|Ve rahmeti
الله|Allâh|Allah
وبركاته|Ve berekâtüh|Ve O’nun bereketleri
علينا|Aleynâ|Bizim üzerimize
وعلى|Ve alâ|Ve üzerine
عباد|İbâd|Kullar
الصالحين|Es-sâlihîn|İyi olanlar
أشهد|Eşhedü|Şahitlik ederim
أن|En|Ki
لا|Lâ|Yoktur
إلا|İllâ|Ancak, dışında
وأشهد|Ve eşhedü|Ve şahitlik ederim
أن|En|Ki
محمدا|Muhammeden|Muhammed
عبده|Abdühû|O’nun kulu
ورسوله|Ve resûlüh|Ve O’nun elçisi
صل|Salli|Rahmet eyle
على|Alâ|Üzerine
محمد|Muhammed|Muhammed
آل|Âl|Aile, yakınlar
كما|Kemâ|Gibi
صليت|Salleyte|Rahmet ettiğin
إبراهيم|İbrâhîm|İbrahim
إنك|İnneke|Şüphesiz sen
حميد|Hamîd|Övgüye layık
مجيد|Mecîd|Şanı yüce
بارك|Bârik|Bereket ver
باركت|Bârekte|Bereket verdin
ربنا|Rabbenâ|Rabbimiz
آتنا|Âtinâ|Bize ver
في|Fî|İçinde, -de
الدنيا|Ed-dünyâ|Dünya
حسنة|Haseneten|İyilik
وفي|Ve fî|Ve içinde, -de
الآخرة|El-âhireti|Ahiret
وقنا|Ve kınâ|Ve bizi koru
عذاب|Azâbe|Azap
النار|En-nâr|Ateş
اغفر|İğfir|Bağışla
لي|Lî|Beni, benim için
ولوالدي|Ve li-vâlideyye|Ve anne babamı
وللمؤمنين|Ve lil-mü’minîn|Ve müminleri
يوم|Yevme|Gün
يقوم|Yekûmü|Gerçekleşir, kurulur
الحساب|El-hisâb|Hesap
إنا|İnnâ|Şüphesiz biz
نستعينك|Nesteînüke|Senden yardım isteriz
ونستغفرك|Ve nestağfirüke|Senden bağışlanma isteriz
ونستهديك|Ve nestehdîke|Senden hidayet isteriz
ونؤمن|Ve nü’minü|Ve inanırız
بك|Bike|Sana
ونتوب|Ve netûbü|Ve tövbe ederiz
إليك|İleyke|Sana
ونتوكل|Ve netevekkelü|Ve güveniriz
ونثني|Ve nüsnî|Ve överiz
الخير|El-hayra|Hayır, iyilik
كله|Külleh|Hepsini
نشكرك|Neşküruke|Sana şükrederiz
نكفرك|Nekfüruke|Sana nankörlük ederiz
ونخلع|Ve nahleu|Ve ayrılırız
ونترك|Ve netrükü|Ve terk ederiz
من|Men|Kimse
يفجرك|Yefcüruke|Sana isyan eder
إياك|İyyâke|Yalnız sana
نعبد|Na‘büdü|Kulluk ederiz
ولك|Ve leke|Ve senin için
نصلي|Nüsallî|Namaz kılarız
ونسجد|Ve nescüdü|Ve secde ederiz
وإليك|Ve ileyke|Ve sana
نسعى|Nes‘â|Yönelir, çalışırız
ونحفد|Ve nahfidü|Ve gayret ederiz
نرجو|Nercû|Umarız
رحمتك|Rahmeteke|Senin rahmetini
ونخشى|Ve nahşâ|Ve korkarız
عذابك|Azâbeke|Senin azabından
إن|İnne|Şüphesiz
بالكفار|Bil-küffâri|İnkârcılara
ملحق|Mülhık|Ulaşan`;
export const unvowel=(s:string)=>s.replace(/[\u064b-\u065f\u0670]/g,'');
const dictionary=Object.fromEntries(entries.split('\n').map(row=>{const [arabic,transliteration,meaning]=row.split('|');return [arabic,{transliteration,meaning}];}));
export function prayerWords(arabic:string){return arabic.split(/\s+/).flatMap(word=>{const entry=dictionary[unvowel(word)];return entry?[{arabic:word,...entry}]:[];});}
