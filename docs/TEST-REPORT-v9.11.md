# v9.11 — Frame-based kitten paw-wave test report

## Automated checks
- `node --check js/app.js`: passed.
- HTML structure: companion button contains one image element and all nine frame paths exist locally.
- Animation manifest: nine 418×418 frames and a 13-step return-to-rest sequence.
- Offline asset check: no remote URLs introduced.

## Behavior
- Home-screen cat tap starts the frame-by-frame paw wave and retains the greeting audio behavior.
- In-game cat tap starts the paw wave and replays the current target word through the existing audio flow.
- Backgrounding the document stops the sequence and restores the idle pose.
- Idle remains still for now; blink, ear, tail and mouth poses require additional artwork.

## Manual follow-up
Test actual touch behavior and audio on the target Android tablet and desktop browser before replacing the currently distributed v9.10 build.
