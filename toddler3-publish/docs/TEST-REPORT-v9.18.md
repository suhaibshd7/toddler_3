# v9.18 Test Report

## Change under test

- Home launcher redesigned around the large existing kitten companion and five activity cards.
- Game screen redesigned around the kitten and answer grid; secondary panels/counters are removed from the visible layout.
- Answer artwork scales to the card dimensions for animals, colors, shapes, numbers and letters. The speaker replay control remains available as a compact button.
- No game logic, media, data, storage keys, or network dependencies were changed.

## Verified

- `node --check` passed for `js/app.js`, `js/audio.js` and `js/sfx.js`.
- `tinycss2` parsed the stylesheet with zero top-level or nested at-rule syntax errors.
- HTML structure checks passed for the persistent cat slots, companion, choice host, speaker control and sound-effects toggle.
- HTML application-version metadata and both visible build labels are synchronized to 9.18.
- Existing local asset paths referenced by the HTML and game data were checked for presence.

## Not verified

- A Chromium visual smoke test could not be completed in this environment: browser navigation to both the local HTTP server and `file://` was blocked by the runtime policy (`ERR_BLOCKED_BY_ADMINISTRATOR`).
- Real-device layout, touch target feel, and the look of each answer type still need a visual check on desktop and Android/iOS.
- No claim is made here that the responsive appearance has been physically tested on a tablet or phone.

## Preserved

- All five activities and their current vocabulary.
- All supplied MP3 recordings, cat artwork, blink/mouth/wave assets, and offline relative paths.
- Prompt replay, correct/wrong feedback, cat reactions and animations, adaptive difficulty, local saved progress, 15-round session end, fullscreen, and sound-effects preference.
