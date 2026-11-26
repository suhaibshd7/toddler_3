# v9.22 Test Report

## Change under test

- Restore visible cat motion during the oops feedback mood using the current raster/WebP character layers.
- Animate the base cat image with a small startled dip and tilt.
- Animate the transparent worried-eye overlay as it appears on the second and later wrong answers.
- Reflow the oops mood so the motion restarts on repeated wrong-answer feedback.
- Bump app metadata and local asset cache keys to v9.22.

## Verified

- Confirmed the previous oops CSS targeted SVG-only parts that are no longer present in the current image-based cat markup.
- Added animation selectors for the actual `.cat-companion-image` and `.cat-oops-face-overlay` elements.
- Changed `setCatMessage` so an existing `oops` mood is reflowed and its CSS animation can replay.
- `js/app.js` passed JavaScript syntax compilation.
- CSS selectors and v9.22 cache-key replacements were verified in the source.

## Not verified

- A live browser/device visual and audio test was not available during this change.

## Preserved

- The second-and-later wrong-answer audio logic.
- The first-mistake retry feedback.
- The transparent eye artwork and independent synchronized mouth overlay.
- Offline-only assets and existing game progress behavior.
