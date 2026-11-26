# v9.23 Test Report

## Change under test

- Use the existing worried-eye face on the first wrong answer as well as subsequent wrong answers.
- Keep the mouth on its neutral closed overlay during retry speech while retaining the speaking bars.
- Preserve the stronger second-mistake reaction, retry recordings, and per-round attempt reset.

## Verified

- JavaScript syntax parsed successfully with the JavaScript engine.
- Confirmed the first and second wrong-answer audio paths both disable the happy mouth animation.
- Confirmed the oops face selector now applies to both first- and second-level feedback.
- Confirmed the next non-oops mood clears the face state.

## Not verified

- Live browser visual/audio behavior and PC/mobile touch smoke tests were not available in this environment.

## Preserved

- Offline-first local assets and audio.
- Existing second-mistake recording and stronger face-pop animation.
- Session, progress, activity, and choice behavior.
