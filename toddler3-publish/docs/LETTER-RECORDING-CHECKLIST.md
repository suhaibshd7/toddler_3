# Letter recording checklist

Goal: finish the alphabet (28 letters). Three clips already exist (ا ب ج). Each new letter is **one short MP3** saved in `assets/audio/letters/` with the exact file name below.

## Technical spec (measured from the existing clips)
- Format: **MP3, mono, 44.1 kHz, 128 kbps**
- Length: aim for about 1–1.5 s (existing letter clips are 1.1–2.0 s)
- Level: peaks near **-3 dB**, average about **-22 dB** (jeem is quieter: peak -8.7 dB, average -25 dB, so aim for the alif/baa level)
- One clip = one letter, no extra words. Keep leading silence short (under ~150 ms); long trailing silence is harmless but wasteful.
- Same voice, speed and warmth as the existing clips, so the cat sounds like one character.
- Naming assumption: the game data labels these clips with the letter *name* (e.g. باء), so these are written as names. I cannot listen to audio, so please check this matches how alif, baa and jeem were recorded and tell me if they use the letter *sound* instead.

## Letters
| # | Letter | Name | File name | Status |
|---|--------|------|-----------|--------|
| 1 | ا | ألف | `alif.mp3` | ✅ recorded |
| 2 | ب | باء | `baa.mp3` | ✅ recorded |
| 3 | ت | تاء | `taa.mp3` | ☐ |
| 4 | ث | ثاء | `thaa.mp3` | ☐ |
| 5 | ج | جيم | `jeem.mp3` | ✅ recorded |
| 6 | ح | حاء | `haa.mp3` | ☐ |
| 7 | خ | خاء | `khaa.mp3` | ☐ |
| 8 | د | دال | `dal.mp3` | ☐ |
| 9 | ذ | ذال | `dhal.mp3` | ☐ |
| 10 | ر | راء | `raa.mp3` | ☐ |
| 11 | ز | زاي | `zay.mp3` | ☐ |
| 12 | س | سين | `seen.mp3` | ☐ |
| 13 | ش | شين | `sheen.mp3` | ☐ |
| 14 | ص | صاد | `sad.mp3` | ☐ |
| 15 | ض | ضاد | `dad.mp3` | ☐ |
| 16 | ط | طاء | `tah.mp3` | ☐ |
| 17 | ظ | ظاء | `zah.mp3` | ☐ |
| 18 | ع | عين | `ayn.mp3` | ☐ |
| 19 | غ | غين | `ghayn.mp3` | ☐ |
| 20 | ف | فاء | `faa.mp3` | ☐ |
| 21 | ق | قاف | `qaf.mp3` | ☐ |
| 22 | ك | كاف | `kaf.mp3` | ☐ |
| 23 | ل | لام | `lam.mp3` | ☐ |
| 24 | م | ميم | `meem.mp3` | ☐ |
| 25 | ن | نون | `noon.mp3` | ☐ |
| 26 | ه | هاء | `ha.mp3` | ☐ |
| 27 | و | واو | `waw.mp3` | ☐ |
| 28 | ي | ياء | `yaa.mp3` | ☐ |

## After recording (any number of letters at a time)
1. Copy the MP3s into `current-project/assets/audio/letters/`.
2. `python tools/add_letters.py --dry-run` (shows what will change), then `python tools/add_letters.py`.
3. `python tools/build_mouth_envelopes.py` (**required**: makes the cat's mouth follow the new clips; needs `ffmpeg` and `numpy`).
4. Open the game and play the letters activity. Letters without an MP3 are never added, so partial batches are safe.

The game never shows more than 6 choices at once, so a full alphabet does not break the layout.

## Also still missing
- `assets/audio/instructions/game-ended.mp3`: optional end-of-session clip, played after the 15th round. Same format and level as above; the game skips it silently until the file exists.
