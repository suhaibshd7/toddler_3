# Architecture

## Runtime

Static browser app using HTML, CSS and classic JavaScript. Serve from the project folder with Python's built-in HTTP server on port 8010. All runtime assets are local.

## Scripts

1. `js/game-data.js` defines `window.LEARNING_GAME`: the activity definitions for animals, colors, shapes, numbers and Arabic letters, praise words, and the audio-path table.
2. `js/audio.js` defines `window.LocalAudio`, a small single-channel player. Starting another clip stops the previous clip so voice clips do not overlap.
3. `js/app.js` runs the shared listening-and-selection engine for all five activities, handles answers and gentle retries, controls the persistent cat companion, tracks separate adaptive progress, and stores settings locally.

Script order in `index.html` is intentional. These are classic scripts, not ES modules.

## Activities

### Animals

Five items: قطة، كلب، أرنب، دب، بطة. Each answer card uses its own transparent PNG illustration from `assets/animals/`. The cat illustration is also used by the persistent cat companion. Bear, rabbit, dog and duck illustrations remain answer-card artwork. If an animal image fails to load, the matching emoji remains as a fallback.

### Colors

Six items: أحمر، أزرق، أصفر، أخضر، برتقالي، بنفسجي. Each answer card displays an unlabeled color swatch; showing labels is a reserved preference, but the parent settings panel is hidden in the current release.

All five activities use the same engine and the same short-word prompt / spoken-praise behavior.


### Shapes

Four items: دائرة، مربع، مثلث، نجمة. Each answer card uses an inline SVG shape, with simple distinct colors and no external image dependency. Shape progress is independent from animal and color progress. The four-choice layout stays in a balanced two-column grid on both desktop and mobile.

## Learning flow

- Choose an activity from the home screen.
- Select a target from that activity using an activity-specific shuffled deck: every item appears once before the deck is reshuffled, and the first target of a new deck cannot repeat the previous deck’s final target.
- Begin with two choices; add random distractors from the same activity up to that activity's total item count.
- Play the target word. The speaker button replays it.
- A wrong tap identifies the tapped item, then gives the existing retry line on the first mistake or `feedback.second_mistake` on the second mistake, before repeating the target word. The child can keep trying the same round.
- Answer cards stay disabled while target/feedback audio plays and become available only after the target prompt finishes successfully.
- A correct tap plays one random single-word praise clip and completes the round.
- Evaluate the first-try results over the latest five completed rounds: 4–5 successes adds one choice; 0–2 successes removes one choice if above two. The result window resets after a level change.
- Progress is separate for animals, colors, shapes, numbers and Arabic letters. The global label preference is shared.
- Existing v1 storage (single animal progress) is migrated into the v2 `activities.animals` shape on the next save; its animal rounds and choice level are preserved.

## Persistence

Storage key remains `arabic-learning-game-progress-v1` for backward compatibility. Current schema (new activity keys are added on read; previously saved animal, color and shape progress is retained):

```json
{
  "showLabels": false,
  "activities": {
    "animals": { "roundsCompleted": 0, "choiceCount": 2, "recentResults": [] },
    "colors": { "roundsCompleted": 0, "choiceCount": 2, "recentResults": [] },
    "shapes": { "roundsCompleted": 0, "choiceCount": 2, "recentResults": [] },
    "numbers": { "roundsCompleted": 0, "choiceCount": 2, "recentResults": [] },
    "letters": { "roundsCompleted": 0, "choiceCount": 2, "recentResults": [] }
  }
}
```

Only activity counters, recent first-try results, choice counts and the label preference are saved. No names or personal data are collected.

## Audio

`assets/audio-manifest.json` provides stable IDs and relative local paths. The app uses the five animal-word clips, six color-word clips, four shape-word clips, five number-word clips, three letter-name clips and five short praise-word clips. Other supplied clips remain packaged but are not required during the core activities.


### Numbers

Five spoken number names are available: واحد، اثنان، ثلاثة، أربعة، خمسة. Each answer card displays the corresponding Arabic-Indic numeral (١–٥) and a matching number of visual dots. Number progress is independent and adaptive from two to five choices.

### Arabic letters

The current user-provided recording batch includes ألف (ا)، باء (ب)، جيم (ج). The card displays the Arabic glyph while the audio speaks its letter name. Letter progress is independent and adaptive from two to three choices for this initial batch. Additional letters can be added later without changing other activity progress.


## Cat companion

Historical v0.7–v9.10 builds used an inline SVG companion with separate pupil groups. In v9.11 the current companion is a frame-based PNG image; pupil gaze and SVG facial animation are paused until matching raster poses are available. The companion remains a visual cue only and never indicates which answer is correct.
 (v0.6)

Version 0.6 introduced one persistent cat guide, rendered once in `index.html` outside the home/game screen containers so it remained visible on both screens. At that stage it used the existing transparent cat PNG and a live Arabic speech bubble. Speech reused local MP3s: `instruction.hello`, `instruction.lets_play`, each target's audio ID, random `praise.*` clips, and `praise.try_again`. The first activity entered in a page session played the greeting once, then the game-start line and target word. Later activity entries played the game-start line and target word. On a wrong answer, the companion played `praise.try_again` and repeated the target word. On a correct answer it celebrated while the selected praise clip played. Greeting audio begins only after user interaction to comply with browser autoplay restrictions.


## Cat character implementation (v0.7)

The cat is no longer a single PNG. The companion uses a self-contained inline SVG to allow independent movement without sprite sheets or heavy animation libraries. The SVG is decorative inside a labelled button. CSS animates: tail sway, body breathing, subtle head looking, ear twitches, natural blinks, speaking mouth movement, greeting paw wave, celebration bounce/raised paws/stars, encouragement head tilt and offering paw, and a petted response. `interactWithCat()` in `js/app.js` makes the character interactive without introducing new audio: home taps play the existing hello clip; activity taps replay the current target after a short reaction. Target/praise/retry playback already sets companion moods, so mouth movement stays synchronized with the current audio clip lifecycle.


## Cat companion layout and feedback (v0.8)

- `#homeCatSlot` and `#gameCatSlot` are layout destinations. `setScreen(name)` moves the one `#catCompanion` node into the currently visible slot. This avoids duplicating SVG IDs or maintaining multiple cat instances.
- On the home screen the cat is centered between the welcome card and activity cards. During play it sits between the listening panel and the choices, in the middle of the activity flow. The character uses normal document flow and does not cover answer cards. In v9.02, the home and activity screens were refitted to the viewport to remove page scrolling on supported device sizes.
- Incorrect answers use the `oops` mood (not the generic encouraging mood) while the existing retry audio plays. The next target playback returns the cat to its speaking mood. The response remains gentle and does not shame or frighten the child.


## Short-session pacing and build identification (historical v9.01)

- v9.01 introduced five completed-round mini-sessions. This was superseded by v9.02 with 15-round sessions, a session-end card and continue/restart choices.


## Screen fit, fullscreen and 15-round sessions (v9.02)

- `html`, `body`, and `.app-shell` are constrained to the viewport height; the home and game layouts use compact grid rows and `min-height: 0` so normal page scrolling is avoided on tested PC and tablet viewports.
- The active game screen has a `fullscreenButton`. `toggleGameFullscreen()` requests fullscreen on `#gameScreen` only. The home screen and browser chrome are outside the fullscreen element. The in-game `.game-build-version` remains visible while fullscreen is active.
- `.session-progress` contains 15 stars and `#sessionProgressLabel`. A round counts only after a correct answer; a wrong attempt followed by a successful retry counts as one completed round.
- After 15 completed rounds, `#sessionEnd` replaces the prompt/choices with a celebration and two actions. The cat says `انتهت اللعبة!` in its bubble.
- Continue resets the temporary session counter and begins another 15-round block without resetting the current activity's saved adaptive progress. Restart resets only the current activity (`roundsCompleted`, `recentResults`, and `choiceCount` back to two); the other four activities are preserved.
- `LEARNING_GAME.optionalAudio['instruction.game_ended']` points to `assets/audio/instructions/game-ended.mp3`. `LocalAudio.playOptional()` checks for the file only at session end and silently skips it if it is absent. The user can add the recording later without changing JavaScript.
- Version metadata, both visible corner labels and the app banner are synchronized to `v9.02`. The progress storage key remains `arabic-learning-game-progress-v1`.


## Cat choreography and round pacing (v9.03)

- The single inline SVG cat remains the only speaking mascot. Mood state is applied through `setCatMessage()` and the visual choreography is defined in CSS; all speech still uses local MP3 assets.
- After a target word finishes, the cat glances toward the complete answer group and makes a short downward paw gesture. This gesture is deliberately non-specific and must never point to one answer.
- Home-screen taps rotate through greeting, playful, curious and small-wave responses. Occasional idle actions use short non-verbal movements only; they do not add audio or interrupt question playback.
- Correct answers rotate among four celebration styles. The 15th completed answer uses a distinct grand celebration and staggered session-end card.
- New answer cards enter with a brief staggered animation. A short curious transition separates praise playback from the next target word.
- `LocalAudio.stop()` pauses the captured current HTMLAudioElement before resolving its playback promise. This ordering is important: resolving the promise first clears the active reference and could otherwise leave the previous clip playing underneath a new one.
- All choreography respects `prefers-reduced-motion`; layout, fullscreen, session length, saved progress and audio paths are unchanged.


## Stability refinements (v9.04)

- `LocalAudio.playOptional()` now carries a playback request generation across its asynchronous local `HEAD` check. A newer play/stop action invalidates that request, preventing a delayed end-of-session clip from interrupting the next round after Continue or Restart.
- The gameplay cat stage is slightly larger at normal viewport heights. Existing compact rules for short screens remain in force.
- Five- and six-choice grids use three columns only on narrow, short landscape viewports, avoiding very short tap targets.


## Cat speech synchronization (v9.06)

`LocalAudio.play(audioId, onStart)` accepts an optional callback fired from the HTML media `playing` event. The `play()` promise is also used as a fallback for engines that resolve playback without dispatching the event. The callback is invoked at most once.

`playCatAudio()` in `js/app.js` uses a separate UI token to bind the speaking mouth and voice bars to the currently active clip. A newer playback request or explicit stop invalidates older UI callbacks. The audio module removes its `playing` listener when a clip finishes, errors, times out or is stopped. The target prompt begins in a quiet `thinking` mood and changes to `speaking` only when playback starts. The `oops` mood is intentionally not overridden by mouth-flap animation during the gentle retry recording.


## Balanced target rotation (v9.07)

`state.targetDeck` is an in-memory shuffled queue for the active activity. `chooseTarget()` draws one item at a time. When the queue empties, it shuffles the activity's complete item list and swaps the first two positions when the first item would repeat `lastTargetId`. This keeps each full cycle balanced without persisting question order or changing the saved-progress schema. Entering an activity and choosing Restart clear the queue; Continue leaves the current queue intact.


## Answer feedback and accessibility polish (v9.08)

The correct choice receives the existing `.correct` state plus a CSS-generated green check mark. `answer()` also changes that button's accessible label to `إجابة صحيحة: <target word>` before disabling all choices. This exposes the result in the accessible name without changing the activity data or progress model. The shared `:focus-visible` treatment uses a darker blue outline for keyboard navigation, and in-game toolbar buttons use a 44 px minimum height in the standard layout, with 40 px and 34 px compact overrides for narrow and very short screens.

The 37 local MP3s were measured with FFmpeg `volumedetect` and `loudnorm` as an audit. Their mean-volume readings range from approximately -27.7 to -18.7 dBFS. No MP3 was modified: some recordings have limited peak headroom, so blanket amplification or normalization would risk clipping or altering the supplied recordings. A dedicated recording/normalization pass should be considered only with a reviewed audio master set.


## Spoken-word reinforcement and status announcements (v9.09)

The gameplay feedback element is a polite live status region with `aria-atomic="true"`. After a correct answer, its text combines the existing praise phrase with `state.target.word`, keeping the correct Arabic vocabulary visible and included in the complete announcement. The same target-word reinforcement is used when the praise recording cannot be played. The existing target audio, cat speech, answer locking and progress logic are unchanged.


## Articulated cat art and motion refinement (v9.10)

The single inline SVG companion remains the rendered character so the existing part-by-part animation and audio-synchronized mouth continue to work. The SVG now has warmer amber eyes, a forehead tuft, tabby marks, ear highlights, whisker freckles and clearer paw detail. Secondary motion is added to the tail tip, whiskers, legs/paws and ears. Mood-specific choreography reuses the existing greeting, thinking, speaking, playful, curious, petted and celebration states. The reduced-motion media query continues to shorten SVG animations and transitions.


## Frame-based companion artwork (v9.11)

The companion image is now rendered from local PNG poses in `assets/cat/wave/`. `js/app.js` preloads the nine frames and plays the sequence `[1,2,3,4,5,6,7,6,5,4,3,2,1]` using the frame durations in `animation.json`. The first frame is the still idle pose. This is frame-by-frame art animation, not a skeletal SVG rig. Idle blink/ear/tail poses and speech-mouth artwork are intentionally deferred; the voice activity indicator continues to reflect local audio playback.


## v9.11 current character implementation

The one persistent companion uses a still seated PNG pose at rest and a nine-frame PNG paw-wave sequence on taps and greeting/celebration states. Frames are preloaded from local assets and switched with timer-driven sequence playback. The full image is not translated, scaled or rotated to imitate an animation. The speech bubble and audio activity bars remain, while mouth-sync, pupil gaze and expressive eye states wait for matching face artwork.


## Second-mistake facial reaction (v9.19)

The cat uses the local transparent 418×418 `assets/cat/faces/oops-eyes.webp` overlay during the second and every subsequent incorrect answer in a round. The app applies `data-oops-level="second"` to the persistent companion while the distinct second-mistake audio plays. The first incorrect answer retains the regular retry feedback. The supplied face art covers only the eye/brow area and keeps the mouth transparent, so `#catMouthImage` continues to follow the active local audio. The normal blink overlay is hidden during this brief reaction to avoid competing eye artwork. The overlay is local and offline-safe.


## Raster-cat oops animation (v9.22)

The old oops choreography targeted separate SVG parts (head, body, ears, paw and tail). The current companion uses one frame-based WebP pose instead, so those selectors no longer animate visible elements. v9.22 ports the reaction to the current layers: the base cat image performs a small startled dip/tilt, while the transparent worried-eye overlay pops into place. Reflow the `oops` mood on every feedback beat so repeated second-and-later wrong answers replay the motion. The eye art remains local; the mouth overlay remains independently audio-synchronized.
