# Agent guidance

- This is a standalone project. Never edit or import files from Toddler Keyboard.
- Keep the app vanilla HTML, CSS and classic JavaScript unless the user explicitly approves a new dependency.
- Offline-first is mandatory: no CDN, remote fonts, remote scripts, analytics, API calls, or cloud TTS during gameplay.
- Use only the supplied local MP3 files for speech. Keep all activity prompts as individual words and encouragement as short individual words wherever possible.
- Preserve Arabic RTL layout and large touch-friendly controls for ages 2–3.
- Do not add timers, lives, punitive feedback, score pressure, or harsh error sounds.
- Keep progress local to the device. Do not collect names or personal data.
- Increment the app version only for a completed, tested change, not every edit.
- Run `node --check` on changed JavaScript and perform PC/mobile smoke tests when feasible.

- Current activities: animals, colors, shapes, numbers and Arabic letters. Do not assume every alphabet letter is present; the current letter audio batch contains ألف، باء، جيم only.
- Use one persistent cat companion as the only speaking mascot. Keep it visible on both home and activity screens; do not add additional speaking animal characters unless the user explicitly asks.
- Reuse existing local greeting, target, praise and retry audio before asking for new recordings. Do not add speech that depends on online TTS.
- Current build version: v9.25. Keep the visible version label and metadata synchronized for future releases.
- Session length is 15 completed rounds. The optional end clip path is `assets/audio/instructions/game-ended.mp3`; do not assume it exists until supplied.

- Preserve existing local audio playback synchronization, request-token cancellation, loudness-envelope mouth animation, idle blink, reduced-motion handling, and MAX_CHOICES = 6.
- After adding or replacing any MP3, re-run `tools/build_mouth_envelopes.py`. Do not switch to live Web Audio analysis without testing `file://` playback.
- To add letters: record MP3s per `docs/LETTER-RECORDING-CHECKLIST.md`, run `tools/add_letters.py`, then `tools/build_mouth_envelopes.py`.
- Keep synthesized effects behind `GameSfx.isEnabled()`; speech still comes only from local MP3 clips.
- On wrong answers, keep the concerned cat face overlay visible, the mouth neutral during retry speech, and the speaking bars active.

## Source and publishing

- The repository root (the folder containing `index.html`) is the only canonical project source. Do not create or maintain a second project copy under `toddler3-publish/`.
- The publishing helper prefers the root project files and checks the source `application-version` against the cloned repository before copying. It must fail closed when either version is missing or the source is older.
- When retiring obsolete publish snapshots, remove the duplicate tree rather than leaving stale code that can be imported accidentally. Update this file and `IMPORT-INSTRUCTIONS.txt` when the import workflow changes.
