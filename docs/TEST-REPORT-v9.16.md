# v9.16 Test Report

Headless Chromium (Playwright) unless stated.

## Blink
- Idle on home for ~17 s: 4 blinks, each ~120 ms.
- Six taps on the cat (waves): 282 samples on non-idle wave frames, **0** with the blink visible.
- Emulated `prefers-reduced-motion: reduce`, ~10 s: **0** blinks.
- Live close-up at 192 px: overlay aligned with the idle pose, no seams or offset visible.
- Not verified: how natural the blink timing feels to a viewer; the eye overlay was fitted automatically from one frame and only checked visually at 5x, real-size and in-game.

## Choice cap and letters tooling (tested on a throwaway copy with 25 synthetic tone MP3s, not real recordings)
- `add_letters.py`: wires 28 letters; second run changes nothing (idempotent); with only the current 3 letters the output is byte-identical to the existing `game-data.js`; all `audioId`s registered and every referenced file exists.
- `build_mouth_envelopes.py` processed 62 clips (37 existing + 25 synthetic).
- With 28 letters and a saved progress `choiceCount: 28`, the game showed exactly **6** cards at 1280x800 and 390x844 with no overflow and no errors.
- Not verified: how real recordings of the new letters sound or how their mouth envelopes look; glyph rendering depends on the device's Arabic font (rendered correctly in the test Chromium).

## Regression
- Mouth vs audio clock: 98% exact / 100% within one 40 ms step over HTTP (130 samples), 97% / 100% over `file://` (123 samples); no errors.
- 8 rounds at 1280x800, 800x1280, 390x844, 844x390: 0 overflow events, 0 errors.

## Corrections to earlier notes
- The progress counter shows "0 / 15" correctly (earlier "15 / 0" reports were misreadings of downscaled screenshots).
