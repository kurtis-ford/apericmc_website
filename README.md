# Aperi CMC Website

The marketing site for Aperi CMC. This document explains where everything lives
and how to work on the site. If you can use git and the command line, you have
everything you need to modify and ship the site.

> **Status:** Cloudflare setup in progress. Items marked _TODO_ will be filled in
> once the Cloudflare Pages project and R2 public URL exist.

---

## The big picture

The site is split into two parts that are stored and updated separately:

| Part | What it is | Where it's stored | How you update it |
|------|------------|-------------------|-------------------|
| **Code** | The Astro site — pages, layout, styles | Git repo → Cloudflare Pages | `git push` (auto-deploys) |
| **Media** | Images and videos | Cloudflare R2 bucket | `rclone sync` (no git) |

**Why the split:** git is great for text/code but bad at large, frequently-changing
binary files (it keeps every version forever and bloats the repo). So media is kept
out of git entirely and served from Cloudflare's CDN. The code just holds **URLs**
that point at the media in R2 (see `src/media.js`).

```
Your laptop                     Cloud
-----------                     -----
src/  (code) ---- git push ----> Git repo ----> Cloudflare Pages (builds & serves the site)
media/ (assets) - rclone sync -> Cloudflare R2 (serves images/videos via CDN)
```

---

## Repo structure

```
apericmc_website/
├── src/                  # The site's source code (lives in git)
│   ├── pages/            # One file per page (index, team, aperi-mech)
│   ├── layouts/          # Base.astro — shared header/footer/nav
│   ├── styles/           # global.css
│   └── media.js          # MEDIA_BASE + media() helper — the ONE place the R2 URL is set
├── public/               # Tiny structural assets kept in git (logo.svg, favicon)
├── media/                # Images & videos — NOT in git, synced to R2 (see .gitignore)
├── astro.config.mjs      # Astro config
├── package.json          # Dependencies & scripts
└── README.md             # This file
```

`media/` and all image/video file types are listed in `.gitignore` so they never get
committed. You get those files by pulling them down from R2 (see below), not from git.

---

## Hosting

- **Code / site:** Cloudflare Pages, connected to this git repo. Every push to the
  `main` branch triggers an automatic build and deploy. No manual upload step.
- **Media:** Cloudflare R2 bucket `apericmc-media`, served over the CDN.
- **Live site URL:** _TODO_
- **Media base URL (set in `src/media.js`):** `https://pub-e31ea5e787264887a5f04d62c1e6e4da.r2.dev` (R2 dev URL; swap for `https://media.apericmc.com` later)
- **Git repo:** https://github.com/kurtis-ford/apericmc_website

---

## Getting set up (new developer)

You need: `git`, `node`/`npm`, and `rclone` (for media).

### 1. Get the code
```bash
git clone https://github.com/kurtis-ford/apericmc_website.git
cd apericmc_website
npm install
```

### 2. Get the media
```bash
# One-time: configure rclone with the R2 credentials (ask Kurtis for keys)
# rclone config   ->  set up an S3-compatible remote named "r2"

# Then pull the media down into the local media/ folder:
rclone sync r2:apericmc-media ./media
```

### 3. Run it locally
```bash
npm run dev        # live preview at the URL it prints
```
Because media URLs are absolute (point at R2), local preview shows the same images
and video as the live site.

---

## Making changes

### Changing the site (code, text, layout)
1. Edit files in `src/`.
2. `git add . && git commit -m "describe the change"`
3. `git push`
4. Cloudflare Pages rebuilds and deploys automatically (~1 min).

### Adding or replacing media (images, video)
1. Put the file in the local `media/` folder.
2. Push it to R2:
   ```bash
   rclone sync ./media r2:apericmc-media
   ```
3. Reference it in the code via the `media()` helper, e.g.:
   ```jsx
   import { media } from '../media.js';
   <img src={media('/new-figure.png')} />
   ```
4. Commit & push the code change.

**Keep media web-sized.** Compress videos before adding them (a short clip should be
a few MB, not tens of MB).

---

## Rules of thumb

- **Code goes in git. Media goes in R2.** Never commit images/videos to the repo.
- The R2 URL is set in exactly one place: `src/media.js` (`MEDIA_BASE`).
- **Never commit secrets** (API keys, R2 credentials, tokens) — git history is forever.
- Media changes don't require a code deploy; code changes don't touch media.

---

## TODO checklist (setup progress)

- [x] Create R2 bucket (`apericmc-media`) and upload media
- [x] Enable the bucket's Public Development URL and paste it into `src/media.js`
- [ ] Create Cloudflare Pages project, connect this repo (build: `npm run build`, output: `dist`)
- [ ] Fill in live site URL + media base URL above
- [ ] (Later) add custom domain apericmc.com to Pages and a `media.apericmc.com` domain to R2
