# Optional authoring tools

`build_mouth_envelopes.py` regenerates `js/mouth-envelopes.js` from the local MP3s (needs `ffmpeg` and `numpy`; run `python tools/build_mouth_envelopes.py --report`). Re-run it whenever clips are added or replaced.

## Mouth-art asset generator

`build_mouth_assets.py` documents/rebuilds the six 418×418 overlay frames from the supplied paw-wave frame-01 artwork.

It is an authoring utility only; the game itself does not require Python or these packages. To regenerate the WebP outputs, install Python packages `Pillow`, `numpy`, `opencv-python` and `CairoSVG`, then run the script from any directory. It resolves the project root relative to its own file location.


## Other tools
- `build_blink_overlay.py` regenerates `assets/cat/blink/eyes-closed.webp` from `wave/frame-01.webp` (needs Pillow, numpy, scipy, opencv-python).
- `add_letters.py` wires dropped-in letter MP3s into `js/game-data.js` (standard library only). See `docs/LETTER-RECORDING-CHECKLIST.md`.
