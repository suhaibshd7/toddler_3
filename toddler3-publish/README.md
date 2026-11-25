# نتعلّم باللعب — Arabic Kitten Game (v9.18)

A small, offline-first Arabic learning game for children, built with plain HTML, CSS and JavaScript. No framework build step or external runtime dependency is required.

## Run locally

From this folder, run:

```bash
python -m http.server 8010
```

Then open http://localhost:8010. On Windows, `run.bat` starts the local server.

## GitHub Pages

This repository is configured for GitHub Pages **Deploy from a branch**. In **Settings → Pages**, use:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

The site URL is https://suhaibshd7.github.io/toddler_3/. Push updates to `main` and GitHub Pages republishes the root automatically. No GitHub Actions deployment workflow is needed.

## Editable source

- `index.html` — screen structure and app entry point
- `css/styles.css` — layout and visual styling
- `js/app.js` — gameplay, character behavior, and interactions
- `js/game-data.js` — activities, choices, and audio paths
- `js/audio.js`, `js/sfx.js`, `js/mouth-envelopes.js` — playback and speaking animation
- `assets/` — WebP character/choice artwork and local MP3 audio
- `tools/` and `docs/` — authoring tools and project notes

The app uses relative file paths and works below the `/toddler_3/` project URL path. Runtime images are WebP to reduce download size; original MP3 recordings are retained byte-for-byte.
