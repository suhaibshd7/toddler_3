# نتعلّم باللعب — Arabic Kitten Game (v9.23)

The v9.23 Arabic learning game is stored as normal, editable project files in this repository.

## Run locally

Run `python -m http.server 8010` from the repository root, then open http://localhost:8010. On Windows, run `run.bat`.

## GitHub Pages (free branch publishing)

The site is published from the repository root. In **Settings → Pages**, use:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/(root)`

Site URL: https://suhaibshd7.github.io/toddler_3/.

## Main edit points

- `index.html` — app structure
- `css/styles.css` — layout and visual design
- `js/app.js` — game flow and interactions
- `js/game-data.js` — activity content
- `js/audio.js` and `js/mouth-envelopes.js` — audio and mouth animation timing
- `assets/` — local character, choice and audio assets
- `docs/` and `tools/` — project notes and authoring utilities

No framework, package manager or build step is required. All asset paths are relative for project Pages hosting.
