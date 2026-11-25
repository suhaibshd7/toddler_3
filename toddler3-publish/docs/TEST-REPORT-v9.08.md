# v9.08 — Feedback and accessibility polish test report

**Base release:** v9.07 — Learning Experience Refinement  
**Scope:** Correct-answer clarity, keyboard focus, compact toolbar sizing and a technical check of the existing audio pack. No new activity, language, voice or artwork was added.

## Changes

- Correct answer cards show a green check mark in addition to the existing green border/background and cat celebration.
- The selected correct choice's accessible label changes to `إجابة صحيحة: <Arabic target word>` before all choices are disabled.
- Keyboard focus uses a stronger blue outline on buttons, inputs and disclosure controls.
- The in-game toolbar buttons have a 44 px minimum height in the standard layout, 40 px on narrow layouts and 34 px in the shortest-screen layout. The compact overrides remain so the game can preserve its viewport fit.
- All 37 local MP3s were audited with FFmpeg. Mean-volume readings range from approximately -27.7 to -18.7 dBFS (about a 9 dB span). The quietest measured clip was `animals/cat.mp3`; the loudest was `instructions/lets-play.mp3`. These are technical readings, not a substitute for listening tests. The recordings were not changed: some clips have limited peak headroom, so automatic gain changes could clip peaks or change the supplied voice recordings.

## Automated checks completed

| Check | Result | Details |
|---|---|---|
| JavaScript syntax | PASS | `app.js`, `audio.js` and `game-data.js` pass `node --check` |
| CSS parsing | PASS | `tinycss2` parsed the stylesheet with no top-level parse errors |
| Static feature audit | PASS | 21/21 checks passed, including version labels, answer feedback, touch sizing, five activities, session length and offline structure |
| Audio lifecycle tests | PASS | 14/14 checks passed for playback start, end, interruption, optional clip cancellation, failure and stop behavior |
| Target-deck test | PASS | 2,000 selections across 2-, 3-, 4-, 5- and 6-item decks; 100 complete deck cycles per size with no within-deck duplicates or immediate repeats |
| Audio inventory | PASS | All 37 MP3 files decoded with FFmpeg/ffprobe and had valid non-zero durations |
| Audio preservation | PASS | All 37 MP3 files are byte-for-byte identical to v9.07 |
| Animal artwork preservation | PASS | All five animal PNGs and the artwork notes are byte-for-byte identical to v9.07 |
| Learning content | PASS | `game-data.js` is unchanged from v9.07 |
| Progress and rules | PASS | The existing progress key, five independent activities, adaptive thresholds and 15-round session remain in place |
| Archive integrity | PASS | Final ZIP archive passed its integrity test |

## Not tested in this environment

- Interactive browser play and visual review of the updated states.
- Physical touch behavior, keyboard navigation and screen-reader announcements on a Windows PC or Android tablet.
- Perceived loudness by listening to all recordings on the target devices.
- Real toddler engagement.

These still require hands-on testing on the target devices. Automated checks do not establish that the visual timing or perceived volume is ideal.

## Preserved

All five Arabic activities and their vocabulary, the three currently supplied Arabic letters (ا، ب، ج), all 37 human-recorded MP3 files, the five animal illustrations, the single cat companion, adaptive difficulty, shuffled target decks, local progress storage, Continue/Restart behavior, 15-round sessions, fullscreen behavior and offline-first structure.
