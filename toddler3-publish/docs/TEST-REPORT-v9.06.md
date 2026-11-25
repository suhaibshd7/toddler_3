# v9.06 — Cat speech playback synchronization test report

**Test date:** 24 November 2026  
**Source:** v9.04 release ZIP, with the v9.06 changes applied incrementally.  
**Scope:** Cat audio/mouth synchronization only. No new learning content or categories.

## Changes covered

- `LocalAudio.play(audioId, onStart)` now reports the moment the browser confirms playback has begun, using the media `playing` event and the `play()` promise as a fallback.
- The callback fires at most once for a clip and is detached when the clip ends, errors, times out or is stopped.
- The app's `playCatAudio()` uses a separate request token so an older clip cannot turn off the mouth animation for a newer clip.
- The talking mouth and voice bars are controlled by the actual playback state instead of the requested mood alone.
- Target-word prompts use a quiet thinking pose while the browser prepares audio, then switch to speaking when playback begins.
- Greeting gestures and the optional future `game-ended.mp3` recording use the same playback lifecycle.
- The sympathetic `oops` reaction remains intact during the retry recording.

## Automated checks completed

| Check | Result | Details |
|---|---|---|
| JavaScript syntax | PASS | `app.js`, `audio.js` and `game-data.js` pass `node --check` |
| Static release audit | PASS | 20/20 checks passed |
| Audio lifecycle unit tests | PASS | 14/14 tests passed against the actual `audio.js` module |
| Audio start callback | PASS | Starts on `playing`; duplicate event/promise signals are collapsed to one callback |
| Replacement/interruption | PASS | A stale clip cannot trigger its callback after a newer clip replaces it |
| Stop behavior | PASS | Active playback pauses and resolves as stopped |
| Error behavior | PASS | Failed playback does not start the cat speaking state |
| Optional recording | PASS | Callback waits until optional file check passes and playback begins |
| Delayed optional audio cancellation | PASS | A new request cancels an optional clip still waiting on its local file check |
| Human Arabic MP3 assets | PASS | All 37 files are present, fully decode with FFmpeg and match both manifest and v9.04 hashes |
| Animal artwork | PASS | Five PNG files are valid and unchanged |
| Learning data | PASS | `game-data.js` is byte-identical to v9.04 |
| Activity/session/progress rules | PASS | Five activity buttons, 15-round constant and original progress storage key are unchanged |
| Offline dependencies | PASS | No remote runtime URL dependencies were introduced |
| Visible version | PASS | Both screen labels and metadata show v9.06 |

## Browser and device checks not completed

- A Playwright Chromium navigation attempt was blocked by this workspace with `ERR_BLOCKED_BY_ADMINISTRATOR`; therefore the interactive browser suite was not run for v9.06.
- No physical Windows PC or Android tablet is connected to this session.
- Actual speaker output, perceptual mouth/audio timing, touch response, fullscreen, rotation, real browser storage persistence and low-end-device frame rate still need hands-on verification.

## What was deliberately preserved

- All five activities and their existing vocabulary.
- Adaptive difficulty and independent per-activity progress.
- Fifteen-round sessions, Continue and Restart behavior.
- All 37 original human-generated MP3 recordings and their checksums.
- Existing animal illustrations and the single central cat companion.
- The original local progress key `arabic-learning-game-progress-v1`.
- Game-only fullscreen, visible version label and local/offline asset structure.
- No TTS, online APIs, subscriptions, new mascots or additional learning categories.

## Remaining product limitations

- `assets/audio/instructions/game-ended.mp3` is still not supplied. The end screen works silently without it; v9.06 will animate the cat's mouth with it once the recording is added.
- Android is still accessed through the PC's local server for offline testing; this is not an independently installed APK or standalone offline PWA.
- Progress remains local to each browser/device and is not synchronized between PC and tablet.
