# v9.17 Test Report

Headless Chromium (Playwright), Web Audio instrumented by wrapping `createOscillator`, clip order logged by wrapping `HTMLMediaElement.play`.

## Verified
- Pop: 1 oscillator per tap on an activity card and per answer-card pointerdown; **0** while the switch is off; the off state survives a reload; turning it back on plays 1 confirming pop. No page errors.
- Wrong answer: clips played in order `[tapped item, praise/try-again, target]` (seen as duck -> try-again -> bear, cat -> try-again -> rabbit).
- Switch layout: fits at 1280x800 and 390x844 with no horizontal overflow; label renders at 12px (explicitly sized because `.quiet-button span` would otherwise force 18px, the same bug fixed in v9.15).
- Leaving to Home during the wrong-answer sequence: no clips start afterwards, speaking flag false, mouth closed.
- Tapped item's clip fails to load (blocked): no stall. Try-again starts ~250 ms after the tap, the target replays ~2.5 s after the tap, speaker re-enabled, no page errors.
- Regression: 8 rounds at 1280x800, 800x1280, 390x844, 844x390 with 0 overflow and 0 errors; blink 4 per ~17 s, 0 over wave frames, 0 under reduced-motion; mouth tracks audio 94% exact / 100% within one 40 ms step on HTTP and file:// (was 97-98% exact in v9.16; likely sampling jitter, not investigated).

## Not verified
- How the pop and the longer wrong-answer sequence feel to a 3-year-old. After a wrong tap the voice runs about 3.5-4.5 s (name, try-again, target) versus about 3.3 s before.
- Real iOS/Android audio unlock behavior: Web Audio can stay silent until a user gesture; the first pop after page load may not sound on some devices.
- Whether the pop is too loud or too quiet on a real tablet speaker (peak gain 0.13, tuned by reasoning, not by listening).

## Findings left unchanged (for discussion)
1. `.parent-panel` is `display: none !important` on home and in the game, so the show-labels switch, progress reset and stats are unreachable. (Likely a deliberate declutter that left the controls orphaned.)
2. If a prompt clip fails to load, answers are ignored until the child presses the speaker (identical in v9.13). Fine with all clips present, e.g. on GitHub Pages, but fragile if a file is missing.
