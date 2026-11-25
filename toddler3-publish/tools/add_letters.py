#!/usr/bin/env python3
"""Wire recorded letter MP3s into js/game-data.js.

Drop one MP3 per letter into assets/audio/letters/ using the file names in
docs/LETTER-RECORDING-CHECKLIST.md (for example `taa.mp3`), then run:

    python tools/add_letters.py --dry-run     # show what would change
    python tools/add_letters.py               # update js/game-data.js
    python tools/build_mouth_envelopes.py     # REQUIRED afterwards (mouth sync)

The script is idempotent. It regenerates the letters `items` list and the
`letter.*` audio entries from whichever known letter MP3s exist, always in
alphabetical (abjadi) order, so running it twice changes nothing. Letters
without an MP3 are never added, so the game cannot reference a missing clip.
Unknown MP3 names in the folder are reported and ignored.

Pure standard library; no ffmpeg needed.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'js' / 'game-data.js'
AUDIO_DIR = ROOT / 'assets' / 'audio' / 'letters'

# (file id, spoken name shown as `word`, glyph) in alphabetical order.
LETTERS = [
    ('alif', 'ألف', 'ا'), ('baa', 'باء', 'ب'), ('taa', 'تاء', 'ت'),
    ('thaa', 'ثاء', 'ث'), ('jeem', 'جيم', 'ج'), ('haa', 'حاء', 'ح'),
    ('khaa', 'خاء', 'خ'), ('dal', 'دال', 'د'), ('dhal', 'ذال', 'ذ'),
    ('raa', 'راء', 'ر'), ('zay', 'زاي', 'ز'), ('seen', 'سين', 'س'),
    ('sheen', 'شين', 'ش'), ('sad', 'صاد', 'ص'), ('dad', 'ضاد', 'ض'),
    ('tah', 'طاء', 'ط'), ('zah', 'ظاء', 'ظ'), ('ayn', 'عين', 'ع'),
    ('ghayn', 'غين', 'غ'), ('faa', 'فاء', 'ف'), ('qaf', 'قاف', 'ق'),
    ('kaf', 'كاف', 'ك'), ('lam', 'لام', 'ل'), ('meem', 'ميم', 'م'),
    ('noon', 'نون', 'ن'), ('ha', 'هاء', 'ه'), ('waw', 'واو', 'و'),
    ('yaa', 'ياء', 'ي'),
]


def main():
    dry = '--dry-run' in sys.argv
    known = {lid for lid, _, _ in LETTERS}
    present = {p.stem for p in AUDIO_DIR.glob('*.mp3')}
    unknown = sorted(present - known)
    chosen = [(lid, word, glyph) for lid, word, glyph in LETTERS if lid in present]
    if not chosen:
        sys.exit('No known letter MP3s found in assets/audio/letters/.')

    text = DATA.read_text(encoding='utf-8')

    # 1) letters items array
    m = re.search(r"(letters:\s*\{.*?items:\s*\[)(.*?)(\n\s*\]\s*\n\s*\})", text, re.S)
    if not m:
        sys.exit('Could not find the letters items block in game-data.js.')
    indent = re.search(r"\n(\s*)\{ id:", m.group(2)).group(1)
    items = ',\n'.join(
        f"{indent}{{ id: '{lid}', word: '{word}', letter: '{glyph}', audioId: 'letter.{lid}' }}"
        for lid, word, glyph in chosen)
    text = text[:m.start(2)] + '\n' + items + text[m.end(2):]

    # 2) letter.* audio entries (replace the contiguous block)
    am = re.search(r"((?:[ \t]*'letter\.[\w]+':\s*'[^']+',?\n?)+)", text)
    if not am:
        sys.exit('Could not find the letter.* audio entries in game-data.js.')
    a_indent = re.match(r"[ \t]*", am.group(1)).group(0)
    lines = ',\n'.join(
        f"{a_indent}'letter.{lid}': 'assets/audio/letters/{lid}.mp3'" for lid, _, _ in chosen)
    # the block is the last entry of the audio map, so no trailing comma
    text = text[:am.start(1)] + lines + '\n' + text[am.end(1):]

    before = DATA.read_text(encoding='utf-8')
    print(f"Letters wired: {len(chosen)} -> {', '.join(l for l, _, _ in chosen)}")
    if unknown:
        print('Ignored unknown MP3 names:', ', '.join(unknown))
    missing = [l for l, _, _ in LETTERS if l not in present]
    print(f"Not yet recorded: {len(missing)}")
    if text == before:
        print('game-data.js already up to date.')
        return
    if dry:
        print('(dry run: nothing written)')
        return
    DATA.write_text(text, encoding='utf-8')
    print('Updated js/game-data.js. Now run: python tools/build_mouth_envelopes.py')


if __name__ == '__main__':
    main()
