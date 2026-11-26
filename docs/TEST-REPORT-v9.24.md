# v9.24 Test Report

## Reason for release

The v9.23 source was merged into `main`, but the user still saw the old app on GitHub Pages. This release changes the HTML document's visible version and all stylesheet/script/concerned-face query keys so browsers must request the updated assets instead of reusing cached v9.23 files. It also creates a fresh commit on the Pages publishing branch.

## Preserved behavior

- The home-screen header shows the current version, v9.24.
- The worried-eye overlay is visible on the first wrong answer and on later wrong answers.
- Retry speech keeps the mouth on its closed overlay while the speaking bars remain visible.
- The stronger second-mistake animation and local retry recording remain in place.
- Existing activity, session, audio and locally saved progress behavior is unchanged.

## Verified before release

- JavaScript syntax parses.
- The root HTML points to v9.24 CSS and JS URLs.
- The root HTML displays v9.24 beside the app name and in application metadata.
- The first- and second-mistake face-state logic remains present in `js/app.js`.
- The CSS face overlay selector continues to show the worried eyes for either mistake state.

## Deployment verification

The Pages source is confirmed by the repository owner as `main / (root)`. GitHub Pages' live serving response could not be fetched in this session, so a successful public deployment is not claimed until the live site is checked.
