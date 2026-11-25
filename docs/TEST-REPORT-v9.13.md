# v9.13 Cat Art Audit and Cleanup Report

## Method
Pixel-level checks with Python (Pillow, NumPy, SciPy) on the files in `assets/cat/`. No real-device or listening tests were possible in this environment, and the game was not run in a browser.

## Findings (measured)
1. **Wave frames are independently drawn, not copies.** The mouth region differs between wave frames (244–959 of 3,342 overlay-mask pixels differ from frame 1 by more than a small tolerance). The v9.12 report's "identical across all nine frames" claim was wrong.
2. **Overlay alignment is acceptable.** The mouth-interior centroid moves only about 2–4 px (x 180.8–184.7, y 197.4–199.4) across the nine wave frames on the 418 px canvas. Rows of the closed overlay composited on all nine frames show no leftover remnant of any frame's own open mouth.
3. **Stray speckles (fixed).** 22 disconnected pale fragments (~385 px) sat in the top-left of wave frame 1 and the six full frames. They were present in the supplied original sprite sheet and are not part of the approved mascot. They were cleared; frames 2–9 never had them.
4. **The six mouth states are distinct** at 4× zoom. Wide and happy are the most similar pair (happy is wider and flatter).
5. **A faint dark smudge below the nose (philtrum)** is visible in the open-mouth states at high zoom. It is subtle at game size and was left as is.
6. **`audio.js` timeout.** A fixed 10 s per-clip timeout does not pause audio when it fires, but the longest local clip is 2.19 s, so it cannot trigger with current files. Left unchanged per the no-audio-changes constraint.

## Changes
- `wave/frame-01.png`, `mouth/full-01..06-*.png`: specks removed (only x 0–75, y 10–60 changed).
- Regenerated `sprite-sheet-3x2.png`, `preview-six-expressions.jpg`, `animation-preview.gif`; synced `final-mouth-assets/`.
- Version bumped to v9.13; docs corrected.

## Still needs real-device checking
Mouth/audio feel, paw-wave plus speech together at actual display size, and Android tablet touch behavior.
