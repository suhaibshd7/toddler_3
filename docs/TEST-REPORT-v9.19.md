# v9.19 Test Report

## Change under test

- Target audio must finish successfully before answer cards can be tapped.
- Answer cards are disabled while the prompt or wrong-answer feedback audio is playing.
- The first incorrect tap retains the existing retry recording.
- The second incorrect tap plays `feedback.second_mistake`, mapped to `assets/audio/feedback/second-mistake.mp3`.
- Wrong-attempt count resets for every new round.
- The new clip is preloaded with the other local audio assets.
- The supplied worried-eye art is installed as `assets/cat/faces/oops-eyes.webp` (418×418, transparent background) and is shown only during the second-mistake state.
- The mouth overlay remains separate; the new eye artwork does not contain mouth pixels.

## Verified

- The original uploaded MP3 was found at the repository root and moved within this feature branch to the dedicated feedback folder.
- The second-mistake audio ID is registered in `js/game-data.js` and the asset manifest.
- The face overlay is 418×418 with alpha transparency; the uploaded image's grey background was removed before placement on the mascot canvas.
- HTML, CSS and JS use `data-oops-level="second"` so the expression is exclusive to the second mistake.
- Changed JavaScript passed syntax compilation and the manifest passed JSON parsing.

## Not verified

- Actual browser/device audio playback, touch response, and responsive visuals still need a live smoke test.
- Exact face alignment needs a visual check in the running game on desktop and mobile.
- The wording of the recording has not been independently checked; its original filename is `خطأ.mp3`.

## Preserved

- Existing first-mistake retry wording and target replay behavior.
- First-try accuracy calculation and adaptive difficulty.
- All other activities, local storage keys, and offline-only gameplay audio.
