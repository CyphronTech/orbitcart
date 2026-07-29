# CyphronTech

Marketing website for **CyphronTech**, a software development agency offering web platforms, mobile apps, AI automation, cloud engineering, and UI/UX design.

The site is a **build-free, static React 18 single-page application**. There is no bundler, transpiler, or `node_modules` — React and Firebase are loaded directly in the browser as ES modules from CDNs. It's hosted on **Firebase Hosting**.

---

## Tech stack

- **React 18.3.1** via `esm.sh` (no JSX — UI is written with `React.createElement`, aliased as `h`)
- **Vanilla CSS** (`styles.css`) — no framework
- **Cloud Firestore** (Firebase Web SDK 12.7.0, lazy-loaded) for contact form submissions
- **Firebase App Check** with reCAPTCHA v3 for abuse protection
- **Firebase Hosting** for deployment (SPA rewrites to `index.html`)

No package manager or build step is required.

---

## Project structure

```
.
├── index.html                  # App shell (mounts #root, loads src/main.mjs)
├── src/main.mjs                # Entire React SPA: routing, pages, contact form
├── script.js                   # Legacy vanilla-JS version of the same behavior (not loaded)
├── styles.css                  # All site styles
│
├── *.html                      # Route shells (identical to index.html) — see Routing
│   ├── web-development.html
│   ├── mobile-app-development.html
│   ├── ai-automation.html
│   ├── cloud-engineering.html
│   ├── ui-ux-design.html
│   └── case-*.html             # Case study pages
│
├── assets/
│   ├── firebase-config.js          # Live Firebase config (git-ignored in practice)
│   ├── firebase-config.example.js  # Template for firebase-config.js
│   ├── tech-logos/                 # Tech stack SVG icons
│   └── *.jpg / *.png / *.svg       # Images, logos, case study mockups
│
├── firebase.json               # Firebase Hosting config (CSP, security headers, rewrites)
├── firestore.rules             # Firestore security rules (create-only contact writes)
├── .firebaserc                 # Firebase project alias (cyphrontech-app-v2)
└── FIREBASE_SETUP.md           # Detailed contact-form / Firebase setup guide
```

---

## Architecture

### Routing

All `*.html` files are **identical shells**. Each loads `src/main.mjs`, which reads `window.location.pathname` and renders the matching page client-side:

- `index.html` → home page (hero, services, solutions, AI approach, case study carousel, tech stack, process, FAQ, contact)
- Service files (e.g. `web-development.html`) → service detail page
- `case-*.html` files → case study detail page
- Anything else → 404 page

Hosting rewrites send unknown paths to `index.html` so the SPA can resolve the route. Page content (services, case studies, tech groups, FAQ) is defined as data arrays at the top of `src/main.mjs`.

### Contact form

The contact form (`ContactForm` in `src/main.mjs`) submits to **Cloud Firestore**:

1. Input is validated and normalized client-side, with a honeypot field for bots.
2. Firebase App + Firestore + App Check modules are **lazy-loaded** on first submit.
3. A validated document is written to the `contactSubmissions` collection.
4. If Firebase/App Check is not configured or the write fails, the form **falls back to a `mailto:` draft** to `cyphrontechllp@gmail.com`.

Firestore rules (`firestore.rules`) allow **public create-only** writes to `contactSubmissions` with strict field validation, and deny all reads/updates/deletes.

> `script.js` is a standalone vanilla-JS implementation of the same header, carousel, and contact-form logic. The current pages use the React version in `src/main.mjs`; `script.js` is not referenced by any HTML.

---

## Running locally

Because the app uses ES modules and Firebase imports, it must be served over HTTP — opening `index.html` via `file://` will not work.

```bash
# Any static server works, e.g.:
npx serve .
# or
python -m http.server 8000
# or
firebase serve
```

Then open the served URL (e.g. `http://localhost:8000`).

---

## Firebase / contact form setup

See **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** for full details. In short:

1. Enable Cloud Firestore in the Firebase Console.
2. Copy `assets/firebase-config.example.js` to `assets/firebase-config.js` and fill in your Firebase Web App config.
3. Set `contactFormSettings.enabled` to `true`.
4. Deploy `firestore.rules`.
5. Register a reCAPTCHA v3 key and add the public site key to `contactFormSettings.appCheck.siteKey`, then enable App Check. Firestore writes are intentionally refused (with `mailto:` fallback) until App Check is configured.
6. Restrict the Firebase Web API key to your domains and keep the Hosting CSP in `firebase.json` aligned with your module sources.

Only the **public** Firebase Web config belongs in the static site. Never commit service-account keys, Admin SDK credentials, or reCAPTCHA secret keys.

---

## Deployment

**Firebase Hosting** (project `cyphrontech-97daa`):

```bash
firebase deploy
```

This serves the repo root as static hosting, applies the CSP and security headers, and rewrites all routes to `index.html`. It ignores config/docs files listed in `firebase.json`.

**Vercel:** deploy the repo directly; `vercel.json` rewrites all routes to `index.html`.
