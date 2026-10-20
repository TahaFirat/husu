import type { MeaningGroup } from './types';
// Phrase-level reading aids. Negations and their predicates stay together.
const phrases:Record<string,string>={
subhaneke:`سبحانك اللهم وبحمدك|Sübhâneke Allâhümme ve bi-hamdik|Allah’ım! Seni her türlü eksiklikten uzak tutar, sana hamd ederim.
وتبارك اسمك|Ve tebârekesmük|Senin adın mübarektir.
وتعالى جدك|Ve teâlâ ceddük|Senin şanın yücedir.
ولا إله غيرك|Ve lâ ilâhe ğayrük|Senden başka ilah yoktur.`,
tahiyyat:`التحيات لله والصلوات والطيبات|Ettehiyyâtü lillâhi ves-salevâtü vet-tayyibât|Bütün saygılar, ibadetler ve güzel sözler Allah içindir.
السلام عليك أيها النبي ورحمة الله وبركاته|Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berekâtüh|Ey Peygamber! Allah’ın selamı, rahmeti ve bereketleri senin üzerine olsun.
السلام علينا وعلى عباد الله الصالحين|Esselâmü aleynâ ve alâ ibâdillâhis-sâlihîn|Selam bize ve Allah’ın iyi kullarına olsun.
أشهد أن لا إله إلا الله|Eşhedü en lâ ilâhe illallâh|Şahitlik ederim ki Allah’tan başka ilah yoktur.
وأشهد أن محمدا عبده ورسوله|Ve eşhedü enne Muhammeden abdühû ve resûlüh|Yine şahitlik ederim ki Muhammed O’nun kulu ve elçisidir.`,
salli:`اللهم صل على محمد وعلى آل محمد|Allâhümme salli alâ Muhammedin ve alâ âli Muhammed|Allah’ım! Muhammed’e ve Muhammed’in ailesine rahmet eyle.
كما صليت على إبراهيم وعلى آل إبراهيم|Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm|İbrahim’e ve İbrahim’in ailesine rahmet ettiğin gibi.
إنك حميد مجيد|İnneke hamîdün mecîd|Şüphesiz sen övgüye layıksın, şanın yücedir.`,
barik:`اللهم بارك على محمد وعلى آل محمد|Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed|Allah’ım! Muhammed’e ve Muhammed’in ailesine bereket ver.
كما باركت على إبراهيم وعلى آل إبراهيم|Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm|İbrahim’e ve İbrahim’in ailesine bereket verdiğin gibi.
إنك حميد مجيد|İnneke hamîdün mecîd|Şüphesiz sen övgüye layıksın, şanın yücedir.`,
atina:`ربنا آتنا في الدنيا حسنة|Rabbenâ âtinâ fid-dünyâ haseneten|Rabbimiz! Bize dünyada iyilik ver.
وفي الآخرة حسنة|Ve fil-âhireti haseneten|Ahirette de iyilik ver.
وقنا عذاب النار|Ve kınâ azâben-nâr|Bizi ateş azabından koru.`,
igfirli:`ربنا اغفر لي ولوالدي وللمؤمنين|Rabbenağfir lî ve li-vâlideyye ve lil-mü’minîn|Rabbimiz! Beni, annemi, babamı ve bütün müminleri bağışla.
يوم يقوم الحساب|Yevme yekûmül-hisâb|Hesabın görüleceği gün.`,
kunut1:`اللهم إنا نستعينك|Allâhümme innâ nesteînüke|Allah’ım! Senden yardım dileriz.
ونستغفرك|Ve nestağfirüke|Senden bağışlanma dileriz.
ونستهديك|Ve nestehdîk|Senden hidayet dileriz.
ونؤمن بك|Ve nü’minü bike|Sana inanırız.
ونتوب إليك|Ve netûbü ileyk|Sana tövbe ederiz.
ونتوكل عليك|Ve netevekkelü aleyk|Sana güveniriz.
ونثني عليك الخير كله|Ve nüsnî aleykel-hayra külleh|Seni bütün hayırlarla överiz.
نشكرك|Neşküruke|Sana şükrederiz.
ولا نكفرك|Ve lâ nekfüruk|Sana nankörlük etmeyiz.
ونخلع ونترك من يفجرك|Ve nahleu ve netrükü men yefcüruk|Sana isyan edeni terk eder, ondan uzaklaşırız.`,
kunut2:`اللهم إياك نعبد|Allâhümme iyyâke na‘büdü|Allah’ım! Yalnız sana kulluk ederiz.
ولك نصلي ونسجد|Ve leke nüsallî ve nescüd|Senin için namaz kılar ve secde ederiz.
وإليك نسعى ونحفد|Ve ileyke nes‘â ve nahfid|Sana yönelir ve gayret ederiz.
نرجو رحمتك|Nercû rahmetek|Rahmetini umarız.
ونخشى عذابك|Ve nahşâ azâbek|Azabından korkarız.
إن عذابك بالكفار ملحق|İnne azâbeke bil-küffâri mülhık|Şüphesiz azabın inkârcılara ulaşır.`
};
export const canonicalArabic=(text:string)=>text.normalize('NFD').replace(/[\u0610-\u061a\u0640\u064b-\u065f\u0670\u06d6-\u06ed]/g,'').replace(/ٱ/g,'ا');
export function prayerGroups(id:string,arabic:string):MeaningGroup[]{
  const rows=phrases[id]?.split('\n');if(!rows)return[];
  const tokens=arabic.split(/\s+/);let start=0;const groups:MeaningGroup[]=[];
  for(const row of rows){const [phrase,transliteration,meaning]=row.split('|'),end=start+phrase.split(/\s+/).length;
    if(canonicalArabic(tokens.slice(start,end).join(' '))!==canonicalArabic(phrase))return[];
    groups.push({start,end,transliteration,meaning});start=end;
  }
  return start===tokens.length?groups:[];
}
