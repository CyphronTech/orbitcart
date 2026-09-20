# Vendored third-party code

`react-bundle.mjs` is a minified ES-module bundle of **React 18.3.1** and **ReactDOM 18.3.1**
(MIT licence, see `LICENSE-react.txt`; copyright Meta Platforms, Inc. and affiliates).

It is served from this site instead of a public CDN so that visitors' browsers do not make
a third-party request (and share their IP address) just to render the page.

Rebuild:

```bash
npm install react@18.3.1 react-dom@18.3.1 esbuild
# entry.mjs re-exports React, the hooks used by the site, and createRoot
npx esbuild entry.mjs --bundle --minify --format=esm --target=es2020 \
  --define:process.env.NODE_ENV=\"production\" --legal-comments=none \
  --outfile=assets/vendor/react-bundle.mjs
```

`lenis.mjs` is a minified ES-module bundle of **Lenis 1.1.20** (MIT licence, see `LICENSE-lenis.txt`; copyright
darkroom.engineering). It adds eased, "inertia" smoothing to mouse-wheel scrolling on desktop. It is loaded only for
visitors who have not asked for reduced motion and are not on a touch device.

Rebuild:

```bash
npm install lenis@1.1.20 esbuild
echo 'export { default } from "lenis";' > lenis-entry.mjs
npx esbuild lenis-entry.mjs --bundle --minify --format=esm --target=es2020 --legal-comments=none --outfile=assets/vendor/lenis.mjs
```
