# نتعلّم باللعب — Arabic Kitten Game (v9.18)

A static Arabic learning game built with plain HTML, CSS and JavaScript.

## Import status

The GitHub repository is not yet a complete copy of the app. The v9.18 application source and assets still need to be added at the repository root (`index.html`, `css/`, `js/`, and `assets/`). This README records that clearly so the repository is not mistaken for a finished, playable deployment.

## Run locally after importing the app

Run `python -m http.server 8010` from the repository root, then open http://localhost:8010. On Windows, `run.bat` can start the local server.

## GitHub Pages (free branch publishing)

After importing the app files, open **Settings → Pages** and set:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/(root)`

The expected site address is https://suhaibshd7.github.io/toddler_3/.

The app needs no bundler or framework build step. Main edit points are `index.html`, `css/styles.css`, `js/app.js`, `js/game-data.js`, and `assets/`. The `.nojekyll` file is included in the repository.
