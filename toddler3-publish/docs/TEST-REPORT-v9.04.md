# v9.04 automated stability test report

**Test date:** 24 November 2026  
**Source:** the supplied v9.03 ZIP, extracted and tested before making changes.  
**Browser:** headless Chromium, using the release's exact HTML, CSS and JavaScript source.

## Automated checks completed

- JavaScript syntax check passed for `app.js`, `audio.js` and `game-data.js`.
- All 37 MP3 files listed by the manifest are present, decodable by `ffprobe`, and match their recorded SHA-256 hashes. Recorded durations match within 0.10 seconds.
- The five existing activities were exercised: animals, colors, shapes, numbers and Arabic letters. Correct selections advanced rounds; a wrong selection did not count and the retry flow returned to the target prompt.
- Adaptive choice progression was exercised. Each activity keeps separate saved progress. Continue starts a new 15-round block without resetting that activity's adaptive progress; Restart returns only the current activity to two choices and leaves the other four untouched.
- A 15/15 session reached its completion screen. Continue and Restart actions were exercised.
- Rapid playback replacement was simulated; no more than one audio clip was active at once.
- A deliberately delayed optional end-audio file check was released only after Continue began. The stale `game-ended.mp3` clip did not start in the new round.
- Fullscreen was requested on the game screen and exited again. The in-game v9.04 label was visible while fullscreen was active.
- At 640 × 360 (short landscape), six choices render in three columns. The six choice cards measured 55 px high; both session-end buttons measured 48 px high. The document remained 640 × 360 with no page overflow.
- Additional responsive checks covered 1365 × 768, 1920 × 1080, 800 × 1280, 1280 × 800, 360 × 800 and 1024 × 600; the page fitted the tested viewport dimensions.
- No JavaScript page errors were observed during the automated Chromium runs.

## What these tests do not prove

- The browser suite used a mocked `Audio` object and simulated `ended` events. It did **not** listen to the real MP3 recordings through PC speakers or an Android tablet speaker.
- The suite used an in-memory `localStorage` test shim. It verified save/continue/restart logic, but it did **not** prove that progress survives closing and reopening a real browser profile.
- No physical Windows PC or Android tablet was available for touch, fullscreen gesture, speaker, battery, CPU or frame-rate testing.
- Low-end hardware frame rate was not benchmarked. The project is small and has no animation/audio framework or external runtime dependency, but real-device smoothness still needs checking.
- This is a local web app, not an installed Android APK or PWA. To test on Android without internet, use the PC's `run.bat` server over the same local Wi-Fi/hotspot as documented in the README; the PC must remain on and serving the files.
- The optional end-of-session recording `assets/audio/instructions/game-ended.mp3` is still absent. The session-end screen works without it.

## Follow-up device checks

On the Windows PC and Android tablet, play at least one full 15-round session and test: audible prompt/praise/retry quality; rapid taps during each sound; cat mouth and expression timing; wrong-answer retry; six-choice layouts; fullscreen entry/exit; Continue and Restart; and progress after closing and reopening the same browser at the same URL. On Android, also rotate between portrait and landscape and tap every answer card near its edges.
