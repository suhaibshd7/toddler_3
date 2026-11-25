# v9.09 — Spoken-word reinforcement and accessible feedback test report

**Base release:** v9.08 — Feedback and accessibility polish  
**Scope:** Make the just-completed Arabic target word part of the success feedback and accessible status announcement. No new activity, language, audio, illustration or dependency was added.

## Changes

- Correct-answer feedback now combines the existing praise phrase with the Arabic target word (for example, the equivalent of “Well done! cat”), so the child sees the word associated with the answer they selected.
- The silent-audio fallback also includes the target word.
- The feedback element remains a polite live status region and now uses `aria-atomic="true"` so assistive technology is asked to announce the complete updated message together.
- The separate correct-answer button label and green check mark from v9.08 are retained.

## Automated checks completed

| Check | Result | Details |
|---|---|---|
| Static feature audit | PASS | 23/23 checks passed, including version labels, target-word feedback, atomic live status, five activities, session length and offline structure |
| JavaScript syntax | PASS | `app.js`, `audio.js` and `game-data.js` pass `node --check` |
| CSS parsing | PASS | `tinycss2` parsed the stylesheet with no top-level parse errors |
| Audio lifecycle tests | PASS | 14/14 checks passed for playback start, end, interruption, optional clip cancellation, failure and stop behavior |
| Target-deck test | PASS | 2,000 selections across 2-, 3-, 4-, 5- and 6-item decks; 100 complete deck cycles per size with no within-deck duplicates or immediate repeats |
| Audio inventory | PASS | All 37 MP3 files decoded with FFmpeg/ffprobe and had valid non-zero durations |
| Audio preservation | PASS | All 37 MP3 files are byte-for-byte identical to v9.08 |
| Animal artwork preservation | PASS | All five animal PNGs and the artwork notes are byte-for-byte identical to v9.08 |
| Learning content | PASS | `game-data.js` is unchanged from v9.08 |
| Progress and rules | PASS | The existing progress key, five independent activities, adaptive thresholds and 15-round session remain in place |
| Archive integrity | PASS | Final ZIP archive passed its integrity test |

## Not tested in this environment

- Interactive browser play and visual review of the new feedback message.
- Screen-reader announcement quality with a real screen reader.
- Physical touch behavior, keyboard navigation and audio perception on a Windows PC or Android tablet.
- Real toddler engagement.

These still require hands-on testing on the target devices. Automated checks do not establish that the updated announcement is ideal in every screen reader or browser.

## Preserved

All five Arabic activities and their vocabulary, the three currently supplied Arabic letters (ا، ب، ج), all 37 human-recorded MP3 files, the five animal illustrations, the single cat companion, adaptive difficulty, shuffled target decks, local progress storage, Continue/Restart behavior, 15-round sessions, fullscreen behavior and offline-first structure.
