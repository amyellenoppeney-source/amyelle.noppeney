# Personal portfolio website

Plain HTML, CSS and JavaScript. No build step, no backend, no cost. Works on free GitHub Pages.

## Project layout

| File | Purpose |
|---|---|
| `content.json` | **All your content.** This is the only file you normally edit. |
| `index.html`, `research.html`, `experience.html`, `about.html`, `contact.html` | Page shells. Only the title and description in `<head>` are worth editing. |
| `css/styles.css` | Design system. Colours, fonts and spacing are variables at the top. |
| `js/app.js` | Builds each page from `content.json`. |
| `files/` | Put downloadable PDFs here. |
| `robots.txt` | Search engine instructions. |

## 1. Download and preview locally

1. Download the project folder (or the zip) and unzip it.
2. Install Python from python.org if you do not have it.
3. Open a terminal in the folder and run `python3 -m http.server 8000`
4. Visit http://localhost:8000. Stop with Ctrl+C.

Opening `index.html` by double-click will show an error, because browsers block loading `content.json` from a local file. Use the command above.

## 2. Publish on GitHub Pages

1. Create a free account at github.com.
2. Click **New repository**. Name it `yourusername.github.io` (site at `https://yourusername.github.io`) or any other name (site at `https://yourusername.github.io/name`). Set it to **Public**.
3. Click **uploading an existing file**, drag in the *contents* of the project folder (not the folder itself), and click **Commit changes**.
4. Go to **Settings, Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
5. Wait one to two minutes. The address appears at the top of the Pages screen.

## 3. Update your content

Edit `content.json` on GitHub (open the file, click the pencil icon, then **Commit changes**) and the site updates in about a minute. Rules:

- Keep every quote mark, comma and bracket. A missing comma breaks the site.
- Add an entry by copying an existing one inside the same `[ ... ]` list. Separate entries with a comma.
- Remove `"placeholder": true` once an item is real.
- Set `"featured": true` to show a publication or project on the Home page.
- Download links: upload the PDF to `files/`, then use `"url": "files/name.pdf", "download": true`.
- Validate your edits at jsonlint.com before committing.

## 4. SEO checklist

- Edit `<title>` and `<meta name="description">` in each HTML file.
- After publishing, add your site address to `robots.txt` and register the site in Google Search Console.
- Keep real names and descriptive link text. Add alt text if you ever add images.

## 5. Asking Claude to change the site safely

1. Paste the current file(s) involved and say which file you want changed.
2. Ask for the **smallest change**. Example: "In content.json, add a policy brief titled X, 2026, with this PDF link. Change nothing else."
3. Say: "Do not edit app.js or styles.css unless necessary, and tell me exactly which files changed."
4. For design changes, ask: "Change only the CSS variables at the top of styles.css."
5. Ask for the complete replacement file, then paste it over the old one on GitHub.
6. Before committing, test locally, check all five pages and a phone-width window, and confirm the JSON is valid.
7. GitHub keeps history, so you can always revert a commit if something breaks.
8. Never share passwords or private details with the assistant. Do not publish any contact detail you did not intend to be public.

## Accessibility notes

Skip link, visible keyboard focus, semantic landmarks, AA contrast, system fonts, respects reduced motion and prints cleanly.
