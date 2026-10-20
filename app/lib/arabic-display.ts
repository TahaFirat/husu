// Presentation only: show alif-wasla as plain alif. Keep the source string,
// consonants, hamza, vowels, shadda and Quranic signs intact for matching/audio.
export function displayArabic(text:string){
  return text.replace(/\u0671/g,'ا');
}
