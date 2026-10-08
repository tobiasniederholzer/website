# tobiasniederholzer.xyz

Static website hosted on GitHub Pages. No build step: edit the HTML files and push.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `website-design.html` | Website design |
| `game-design.html` | Game design |
| `catering.html` | Catering |
| `portfolio.html` | Portfolio (with filters) |
| `contact.html` | Contact form |
| `imprint.html` | Imprint (Impressum) |
| `404.html` | Not-found page |

Styles live in `assets/style.css`, scripts in `assets/main.js`.

## Before going live

1. **Contact form:** create a free form at https://formspree.io and replace `YOUR_FORM_ID` in `contact.html`.
2. **Email address:** `hello@tobiasniederholzer.xyz` is a placeholder. Set up that address with your domain provider, or replace it in `contact.html` and `imprint.html`.
3. **Imprint:** fill in the bracketed fields in `imprint.html`. Austrian law requires an Impressum on business websites.
4. **Portfolio:** add images to `assets/projects/` and edit the projects in `portfolio.html` (instructions are in a comment in the file).

## Publishing

1. Upload all files in this folder to the root of your GitHub repository.
2. Repository → Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
3. The `CNAME` file already sets the custom domain to `tobiasniederholzer.xyz`.
