# Development roadmap

## Current prototype
- [x] Separate project folder and offline-first static structure.
- [x] Integrate the uploaded Arabic audio library.
- [x] First playable animal listening-and-selection activity.
- [x] Add color recognition using the same game engine.
- [x] Add shape recognition with inline SVG artwork and independent adaptive progress.
- [x] Start each activity with two choices and track adaptive progression separately.
- [x] Preserve legacy animal progress when migrating the local progress format.
- [x] Replace animal emoji answer art and home mascots with consistent transparent illustrations.
- [x] Local progress summary and per-activity reset control.
- [x] Add numbers (١–٥) with count-dot visuals.
- [x] Add the currently recorded Arabic letters (ا، ب، ج).
- [x] Move the interactive cat to the center of the home and activity screens.
- [x] Add a more expressive, sympathetic wrong-answer cat reaction.

## Next
1. Final performance, accessibility and offline checks on the user's PC and Android tablet.
2. Add English only when an English voice/audio pack is ready; Arabic remains the primary experience.

## Product constraints
- Separate from Toddler Keyboard.
- Target approximately ages 2–3 initially.
- Arabic first; English later.
- Free, offline-capable, and lightweight for low-end PCs and Android tablets.
- Use local MP3 recordings for speech; no cloud TTS or runtime internet dependency.
- Encourage curiosity; no punishment, lives or countdowns.


## v0.5 completed

- Number recognition added for واحد، اثنان، ثلاثة، أربعة، خمسة. Cards pair Arabic-Indic numerals with matching dot quantities.
- Initial Arabic letter recognition added for ألف، باء، جيم. Cards show glyphs ا، ب، ج.
- Independent adaptive progress for numbers (2–5 choices) and letters (2–3 choices with current audio batch).
- Existing animal, color and shape activities and progress schema are preserved.


## v0.6 completed — One speaking cat companion

- One cat guide is always visible on home and activity screens.
- Cat speech/reaction beats: initial greeting, activity introduction, target-word prompting, positive celebration, and gentle retry encouragement.
- Reuses existing local voice recordings; no new audio recordings were necessary for this first implementation.
- Uses lightweight CSS transforms only; no animation library or remote assets.


## v0.7 completed — Interactive cat character

- Replaced the old static character image with a lightweight inline SVG cat made from independently animated parts.
- Added idle breathing/blinking/tail motion, wave greeting, speech mouth movement, celebration jump/paw raise, encouraging head tilt/paw offer, curiosity and petting reactions.
- Added direct tap interaction: greeting on home; replay current vocabulary word during an available round.
- Reused existing audio only; no new voice recordings, external assets or animation dependencies.
- Left all answer-choice illustrations and learning activities unchanged.


## v0.8 completed — Center-stage cat guide

- The cat now occupies a centered position in the home and activity layouts instead of a fixed corner overlay.
- Its speech bubble is centered above the character; the character remains large and tappable.
- Wrong answers trigger a distinct expressive `oops` face and sympathetic gesture. Existing audio is reused.
- Answer-card illustrations, learning data, audio files and adaptive progression are unchanged.

## Next
1. Refine gameplay pacing and short-session flow without adding required settings screens.
2. Complete performance, accessibility and offline checks on the user's PC and Android tablet.
3. Add English only when an English voice/audio pack is ready; Arabic remains the primary experience.


## v0.9 completed — Responsive cat attention

- The cat's pupils now track the answer area during word playback and follow pointer/touch movement and keyboard focus over answer cards.
- After selection, the cat briefly looks at the selected card during its sympathetic retry or celebration response, then returns to neutral.
- Pupil movement is independent from the eye whites, limited to a subtle range, and respects reduced-motion preferences.
- Existing choice artwork, five learning activities, audio pack, adaptive difficulty, and progress storage are unchanged.


## v9.01 completed — Short-session pacing and visible version

- Added a five-star progress strip for each play session.
- After five completed correct answers, the child reaches a friendly pause point and chooses to continue or return home. This is optional, has no timer and does not count as failure or a score.
- Session stars reset on continue or when changing activities; long-term adaptive progress remains stored independently per activity.
- Added a persistent lower-corner `v9.01` label on every screen.
- No new recordings, external dependencies, network requirements or changes to answer artwork.

## Remaining
- [ ] Verify PC and Android performance, offline operation, touch controls, accessibility and audio behavior on the user's devices.
- [ ] Add English support only when the user supplies an English audio pack.


## v9.02 completed — Screen fit, fullscreen and 15-round sessions

- [x] Fit home and activity screens to the viewport on tested PC/tablet layouts without normal page scrolling.
- [x] Add fullscreen for the active game screen only, keeping the visible version label inside fullscreen.
- [x] Change sessions to fifteen successfully completed rounds; wrong attempts do not count.
- [x] Add a session-end celebration with continue (preserve current activity learning progress) and restart (reset only the current activity and return to two choices).
- [x] Add an optional sound hook at `assets/audio/instructions/game-ended.mp3` for `انتهت اللعبة`; the file is not included until supplied.

## v9.03 completed — Cat personality and smoother gameplay

- [x] Add four varied success celebrations and a distinct 15-round grand finale.
- [x] Add playful cat-tap reactions and occasional non-verbal idle moments.
- [x] Add a general gesture toward the answer group after the target word, without indicating a particular answer.
- [x] Add smoother mood transitions, staggered answer-card entrances and a short pause between rounds.
- [x] Prevent old audio from continuing under newer speech when the child taps quickly; current audio is paused before its playback promise is resolved.
- [x] Preserve v9.02 screen fitting, game-only fullscreen, fifteen-round sessions, end-screen choices, all five activities, saved progress and the visible version label.

## User testing still needed

- [ ] Check actual MP3 playback and interruption on PC and Android tablet.
- [ ] Check the cat's new reactions and round pacing feel natural in real play.
- [ ] Check fullscreen and the 15-round end/restart/continue flow on both devices.
- [ ] Check offline operation after the project has been extracted locally.


## v9.04 completed — stability polish

- [x] Cancel delayed optional audio requests when newer playback begins.
- [x] Increase the cat's gameplay display size without disturbing compact short-screen rules.
- [x] Preserve more usable answer-card height for five- and six-choice rounds on short landscape screens.
- [x] Keep session-end buttons more touch-friendly on short landscape screens.
- [ ] Complete real-device PC and Android tablet checks; automated browser tests do not replace listening and touch testing on the target devices.


## v9.06 completed — Cat speech playback synchronization

- [x] Start mouth/voice-bar movement only when HTML audio playback has actually started.
- [x] Stop mouth movement immediately on end, error, timeout or interruption, using request tokens to prevent stale completion callbacks.
- [x] Keep a quiet thinking pose during target-audio startup and begin greeting gestures with their recordings.
- [x] Preserve the sympathetic wrong-answer pose, all five activities and all existing audio files.
- [ ] Confirm the visual/audio timing by listening on a real Windows PC and Android tablet.


## v9.07 completed — Balanced question variety

- [x] Replace unrestricted random target selection with a shuffled per-activity target deck.
- [x] Ensure each activity item appears once per deck before any target repeats.
- [x] Prevent a repeat across deck boundaries.
- [x] Reset the deck on activity entry and explicit activity restart; preserve the current sequence on Continue.
- [x] Keep all five activities, distractor selection, adaptive thresholds, audio, 15-round sessions and saved-progress format unchanged.
- [ ] Verify question variety feels natural during real toddler use on PC and Android.


## v9.08 completed — Feedback and accessibility polish

- [x] Add an unmistakable check mark to the selected correct answer.
- [x] Announce the selected correct answer and its Arabic target word in its accessible label.
- [x] Increase keyboard-focus outline contrast.
- [x] Raise in-game toolbar controls to 44 px in the standard layout, 40 px on narrow screens and 34 px in the shortest viewport mode.
- [x] Measure all 37 MP3 levels and document the findings without altering the supplied voice files.
- [ ] Listen to the audio on the target Windows PC and Android tablet; decide on any future normalization only after reviewing the original recordings.
- [ ] Verify touch feel, keyboard navigation and screen-reader announcements on actual devices.


## v9.09 completed — Spoken-word reinforcement and accessible status

- [x] Include the correct Arabic target word in the success feedback alongside the existing praise phrase.
- [x] Include the target word when the praise recording is unavailable.
- [x] Mark the feedback status region atomic so assistive technology receives the full updated announcement.
- [x] Preserve all activities, recordings, artwork, progress and session behavior.
- [ ] Confirm announcement quality with a screen reader and touch/keyboard use on the target devices.


## v9.10 completed — Cat art and movement refinement

- [x] Refine the articulated cat SVG with warm amber eyes, forehead tuft, tabby markings, inner-ear highlights, whisker freckles and clearer paws.
- [x] Add secondary movement to tail tip, whiskers, paws/legs and ears without replacing the existing independently animated head, body, arms, eyes and mouth.
- [x] Preserve mouth/audio synchronization, tap reactions, pointing, celebrations, gentle retry reaction and reduced-motion support.
- [x] Keep the established orange-and-cream cat with its blue collar and gold tag.
- [x] Preserve all learning activities, voice recordings, question decks, adaptive progress, saved-progress format and 15-round sessions.
- [ ] Review the new mascot design and timing on an actual Windows PC and Android tablet.


## v9.11 completed — First approved kitten animation

- Replaced the old companion artwork with the approved kitten's frame art.
- Integrated the nine-frame paw-wave into home taps, greeting/celebration reactions and in-game cat taps.
- Kept the game offline-first and preserved local audio, progress storage and activity logic.
- Next art set: natural idle (blink, ear flick, tail swish), facial expressions and speech-mouth poses.


## v9.12 completed — Six-state talking mouth overlays

- Added six fixed 418×418 transparent mouth overlays aligned to the existing kitten PNG artwork.
- The overlays run in a separate image layer, allowing the existing paw-wave image sequence to continue independently.
- Speech movement is bound to the actual local MP3 `playing` lifecycle and closes on completion/cancellation.
- Assets include individual mouth PNGs, full-character samples, sprite sheets, a still preview, an animated preview and a manifest.
- Mouth cycles are varied visual speech shapes, not phoneme-timed lip-sync.
