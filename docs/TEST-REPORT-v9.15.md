# v9.15 Layout Test Report

Headless Chromium (Playwright) at 1280×800, 800×1280, 390×844, 844×390.

## Measured
- Fullscreen label font: 18px → matches Home label (12px / 12px / 10px / 9px by breakpoint).
- Two-choice card height: 208→288px (1280×800), 240→380px (800×1280); unchanged on both phone sizes.
- Played 8 rounds per viewport: 0 overflow events (choices never overlap the feedback line; page never scrolls), 0 console/page errors.
- Forced 3/4/6 choice counts at each size: grid heights unchanged by this version's rules (rule targets `data-choice-count="2"` only).

## Corrections to earlier review notes
- The progress counter renders "0 / 15" correctly at all sizes (zoomed check); the earlier "15 / 0" report was a misreading of a downscaled screenshot.
- The empty space below the cards was a deliberate design cap, not a defect; this release only relaxes it on tablets.

## Not verified
Real-device touch feel; very small or unusual window sizes; how a child perceives the larger cards. The bottom ~30% of an 800×1280 portrait screen is still empty by design.
