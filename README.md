# نتعلّم باللعب — Arabic Kitten Game (v9.18)

A static Arabic learning game for children, built with plain HTML, CSS and JavaScript.

## Run locally

Run `python -m http.server 8010` from the repository root, then open http://localhost:8010. On Windows, `run.bat` starts the local server.

## GitHub Pages

The workflow `.github/workflows/pages.yml` deploys the repository root on every push to `main` and supports manual runs. Once, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source. The expected address is https://suhaibshd7.github.io/toddler_3/.

The app uses relative asset paths and requires no bundler or package installation. Main edit points: `index.html`, `css/styles.css`, `js/app.js`, `js/game-data.js`, and `assets/`.

Image files are WebP for a smaller deployment; the original Arabic MP3 recordings are preserved byte-for-byte. See `docs/` and `tools/` for project notes and authoring scripts.
