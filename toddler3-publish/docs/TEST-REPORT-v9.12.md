# v9.12 Integration Test Report — Talking Mouth

## Result

**Static integration checks passed.** The mouth animation is layered separately from the existing paw-wave PNG sequence and is still controlled by the existing MP3 playback lifecycle.

## Verified

- `js/app.js` passes `node --check`.
- All six mouth overlay PNGs are 418×418 RGBA with transparency outside the muzzle overlay.
- All six full-character PNGs are 418×418 RGBA.
- The combined full-character sprite sheet is 1254×836 (3 columns × 2 rows; 418×418 per cell).
- The overlay sprite sheet is 1254×836 with alpha transparency.
- The still preview and animated GIF preview contain all six mouth states.
- The nine original paw-wave frame images remain unchanged. *(Correction, v9.13: the earlier claim here that mouth-area pixels are identical across wave frames was incorrect. See TEST-REPORT-v9.13.md for the measured alignment.)*
- The 37 original MP3 files remain present. No audio file or `js/audio.js` playback implementation was changed.
- Runtime files are local; no added external packages, network requests or hosted services are required.

## Integration behavior

- Mouth animation starts only from the existing confirmed audio-start callback.
- It cycles through slight, medium, wide, rounded-O and happy-open states, with occasional closed pauses.
- It returns to the closed state when audio finishes, errors, times out, is interrupted or the page becomes hidden.
- The original paw-wave animation continues on its own image layer while mouth overlays change above it.
- `prefers-reduced-motion: reduce` uses a steady medium-open speaking pose.

## Scope / limitation

The mouth motion is varied visual speech animation. It does not analyze Arabic phonemes or align individual shapes to exact syllable timestamps. Audio files and spoken content are unchanged.

## Manual device checks still recommended

Run `run.bat` and test at least one short word, one instruction and one praise recording on the target Windows PC and Android tablet. Confirm mouth alignment at the actual browser scale and verify the paw wave and mouth layer together on each device.
