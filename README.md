# نتعلّم باللعب — Arabic Kitten Game (v9.18)

This repository is prepared for the static Arabic learning game and GitHub Pages deployment.

## Import status

The GitHub Pages workflow is in place, but the v9.18 application source and binary assets have **not** been imported yet. The repository needs the app files at its root (`index.html`, `css/`, `js/`, and `assets/`) before it can publish the playable game. This README is intentionally clear about that so the repository is not mistaken for a completed deployment.

## Run locally after importing the app

Run `python -m http.server 8010` from the repository root, then open http://localhost:8010. On Windows, `run.bat` starts the local server.

## GitHub Pages

The workflow `.github/workflows/pages.yml` deploys the repository root on every push to `main` and supports manual runs. Once the app files are present, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source. The expected address is https://suhaibshd7.github.io/toddler_3/.

The game is a plain HTML/CSS/JavaScript app and does not need a framework build step. Main edit points are `index.html`, `css/styles.css`, `js/app.js`, `js/game-data.js`, and `assets/`.
