# نتعلّم باللعب — Arabic Kitten Game (v9.24)

The v9.24 Arabic learning game is stored as normal, editable project files in this repository. The repository root is the single source of truth; there is no maintained duplicate under a nested publishing folder.

## Run locally

Run `python -m http.server 8010` from the repository root, then open http://localhost:8010. On Windows, run `run.bat`.

## GitHub Pages (free branch publishing)

The site is published from the repository root. In **Settings → Pages**, use:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/(root)`

Site URL: https://suhaibshd7.github.io/toddler_3/.

## Import / publishing helper

Run `push-to-github.bat` (or `toddler3-publish-to-github.ps1`) from the extracted project root. The helper prefers the root `index.html`, compares its `application-version` with the destination branch, and refuses to copy a package whose version is older or missing. It can still recognize the former `toddler3-publish` folder in older transfer archives, but that fallback is also version-checked. The obsolete nested snapshot is not stored in this repository.

The helper needs Git for Windows and a working GitHub sign-in. It updates a local clone using fast-forward-only pulls, then commits and pushes the files to `main`.

## Main edit points

- `index.html` — app structure
- `css/styles.css` — layout and visual design
- `js/app.js` — game flow and interactions
- `js/game-data.js` — activity content
- `js/audio.js` and `js/mouth-envelopes.js` — audio and mouth animation timing
- `assets/` — local character, choice and audio assets
- `docs/` and `tools/` — project notes and authoring utilities

No framework, package manager or build step is required. All asset paths are relative for project Pages hosting.
