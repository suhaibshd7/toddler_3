# v9.14 Audio-driven Mouth Test Report

## Automated checks run (headless Chromium, Playwright)
- `node --check` passes for `app.js`, `audio.js`, `mouth-envelopes.js`.
- Mouth vs audio clock, sampled every ~25 ms while clips played: **97% exact / 100% within ±1 step (40 ms)** over HTTP (127 samples, clips: animal.rabbit, instruction.hello, instruction.lets_play); **99% / 100%** over `file://` (124 samples). No page or console errors in either.
- Eight rapid cat taps on the home screen: speaking flag and mouth end closed, no errors.
- Leaving an activity mid-speech: the cat still reports speaking shortly after. v9.13 behaves identically, so this is not a regression; the cause was not investigated.

## Envelope statistics (37 clips)
State share: closed 28% (real leading/trailing silence), slight 9%, medium 27%, wide 23%, rounded-O 2%, happy 10%. About 4.4 state changes per second (min 2.2, max 6.6).

## Not verified
- Whether the movement *looks right* to a child or adult watching and listening. Thresholds were set from measured loudness, not by ear.
- Android tablet behavior; real speaker/headphone latency (the mouth is locked to `currentTime`, which can lead the audible sound slightly on some Bluetooth devices).
- Rounded-O is chosen by a spectral-centroid heuristic and may not match actual Arabic vowel shapes.
