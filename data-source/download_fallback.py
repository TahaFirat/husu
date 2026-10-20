import json
from pathlib import Path
import requests

BASE = "https://api.alquran.cloud/v1"
OUT = Path(__file__).parent
selected = [1, 2, 59, *range(93, 115)]
windows = {2: {255, 285, 286}, 59: set(range(22, 25)), 96: set(range(1, 6))}

def get(path):
    r = requests.get(BASE + path, timeout=60)
    r.raise_for_status()
    obj = r.json()
    if obj.get("code") != 200:
        raise RuntimeError(obj)
    return obj["data"]

meta = get("/meta")
(OUT / "index.json").write_text(json.dumps({"source": BASE + "/meta", "data": meta}, ensure_ascii=False, indent=2), encoding="utf-8")

surahs = []
for sid in selected:
    editions = get(f"/surah/{sid}/editions/quran-uthmani,tr.diyanet,ar.alafasy")
    arabic, turkish, audio = editions
    allowed = windows.get(sid)
    verses = []
    for i, ar in enumerate(arabic["ayahs"]):
        n = ar["numberInSurah"]
        if allowed is not None and n not in allowed:
            continue
        tr = turkish["ayahs"][i]
        au = audio["ayahs"][i]
        verses.append({
            "number": n,
            "globalNumber": ar["number"],
            "arabic": ar["text"],
            "translation": tr["text"],
            "transliteration": None,
            "audio": au.get("audio"),
            "words": None,
        })
    surahs.append({"id": sid, "name": arabic["name"], "englishName": arabic["englishName"], "numberOfAyahs": arabic["numberOfAyahs"], "verses": verses})

core = {
    "source": BASE,
    "editions": ["quran-uthmani", "tr.diyanet", "ar.alafasy"],
    "wordSource": None,
    "transliterationSource": None,
    "surahs": surahs,
}
(OUT / "core.json").write_text(json.dumps(core, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({"surahs": len(surahs), "verses": sum(len(s["verses"]) for s in surahs), "audio": sum(v["audio"] is not None for s in surahs for v in s["verses"])}, ensure_ascii=False))
