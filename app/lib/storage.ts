export function read<T>(key:string,fallback:T):T {try {return JSON.parse(localStorage.getItem(`husu:v1:${key}`)||'null')??fallback;}catch{return fallback;}}
export function write(key:string,value:unknown){try{localStorage.setItem(`husu:v1:${key}`,JSON.stringify(value));return true;}catch{return false;}}
