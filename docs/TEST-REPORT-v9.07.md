# v9.07 — Balanced question variety test report

**Source:** v9.06 release project in the working directory.  
**Scope:** Target-question selection only. No new categories, languages, audio or artwork.

## Change

Each activity now uses an in-memory shuffled deck of its existing target items. Every item is presented once before the deck is reshuffled. When a new deck begins, its first item is swapped if necessary to avoid repeating the previous deck's final target. The deck is reset on activity entry and explicit Restart; Continue preserves the current sequence.

## Automated checks completed

| Check | Result | Details |
|---|---|---|
| JavaScript syntax | PASS | `app.js`, `audio.js` and `game-data.js` pass `node --check` |
| Target rotation unit test | PASS | 100 complete deck cycles each for 2, 3, 4, 5 and 6 items (2,000 target selections total) |
| No immediate repeats | PASS | Checked across all tested deck boundaries |
| Every item once per deck | PASS | Every tested complete deck contained all items exactly once |
| Existing activity data | PASS | `game-data.js` unchanged from v9.06 |
| Existing audio inventory | PASS | All 37 MP3 paths, bytes and manifest hashes unchanged from v9.06 |
| Existing artwork | PASS | All five animal illustrations unchanged from v9.06 |
| Session length | PASS | 15-round constant unchanged |
| Progress storage | PASS | Original `arabic-learning-game-progress-v1` key unchanged |
| Adaptive rules | PASS | Existing 4-of-5 increase and 2-or-fewer decrease logic unchanged |
| Offline structure | PASS | No remote runtime dependencies added |
| Version labels | PASS | Metadata and both visible labels show v9.07 |

## Not tested in this environment

- Interactive browser play was not available because Chromium navigation is blocked in this workspace.
- No physical Windows PC or Android tablet was available.
- Real toddler engagement and perceived question variety require hands-on observation.

## Preserved

All five activities and their vocabulary, adaptive difficulty, independent saved progress, first-try scoring, 15-round sessions, Continue/Restart behavior, 37 human-generated Arabic MP3 recordings, animal artwork, cat companion, fullscreen behavior and local-only asset loading.
