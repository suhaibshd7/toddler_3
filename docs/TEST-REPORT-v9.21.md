# v9.21 Test Report

## Change under test

- The first incorrect answer in a round keeps the existing retry recording.
- The second, third, and every later incorrect answer in the same round use the dedicated `feedback.second_mistake` recording.
- The worried-eye cat overlay appears for the second-and-later feedback recording.
- The wrong-attempt count still resets at the beginning of each new round.
- CSS, scripts, and the second-mistake face/audio URLs use the v9.21 cache key.

## Verified

- The condition is `state.wrongAttempts >= 2`, rather than an exact equality check.
- `js/app.js` and `js/game-data.js` passed JavaScript syntax compilation.
- The HTML and audio asset references were updated to `?v=9.21`.
- The release metadata and project notes describe the new second-and-later behavior.

## Not verified

- Browser/device playback, touch interaction, and visual positioning have not been re-tested in a live browser during this update.

## Preserved

- The first-mistake feedback.
- The existing second-mistake MP3 and worried-eye face artwork.
- The automatic target replay after the feedback recording.
- Offline-only gameplay audio and all existing activity/progress behavior.
