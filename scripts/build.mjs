// Pre-renders every page to static HTML so search engines, link previews and
// visitors without JavaScript get real content. The browser still loads
// src/main.mjs and takes over (client render replaces the static markup).
//
// Usage:  npm install   (once)   then   npm run build
//
// Generates: every *.html page, 404.html, sitemap.xml

import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptsDir, "..");
const buildDir = path.join(root, ".build");
const shimPath = path.join(scriptsDir, "react-shim.mjs");

const { SITE } = await import(pathToFileURL(path.join(root, "src/site-config.mjs")).href);
const { legalPages } = await import(pathToFileURL(path.join(root, "src/legal.mjs")).href);

// Cache-busting token for CSS/JS query strings. Bump when assets change.
const ASSET_VERSION = "small-1";
const OG_IMAGE = "assets/og-image.jpg";
const FONT = "assets/fonts/inter-latin-wght-normal.woff2";

mkdirSync(buildDir, { recursive: true });

// --- Bundle the app for Node ------------------------------------------------
await build({
  stdin: {
    contents: `
      import React from "react";
      import { renderToString } from "react-dom/server";
      export { React, renderToString };
      export * from "../src/main.mjs";
    `,
    resolveDir: scriptsDir,
    loader: "js",
  },
  bundle: true,
  platform: "node",
  packages: "external",
  format: "esm",
  outfile: path.join(buildDir, "ssr.mjs"),
  logLevel: "warning",
  plugins: [
    {
      name: "ssr-shims",
      setup(b) {
        // The browser gets the vendored React bundle; Node uses the npm packages.
        b.onResolve({ filter: /react-bundle\.mjs/ }, () => ({ path: shimPath }));
        // Firebase config only sets a window global for the browser.
        b.onResolve({ filter: /firebase-config\.js/ }, () => ({ path: "firebase-config", namespace: "stub" }));
        b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "", loader: "js" }));
        // Runtime-only vendor code is loaded by the browser, never during pre-rendering.
        b.onResolve({ filter: /vendor\/lenis\.mjs/ }, (args) => ({ path: args.path, external: true }));
        // Strip ?v=... cache-busting queries from module imports.
        b.onResolve({ filter: /\.mjs\?v=/ }, (args) => ({ path: path.resolve(args.resolveDir, args.path.split("?")[0]) }));
      },
    },
  ],
});

const ssr = await import(pathToFileURL(path.join(buildDir, "ssr.mjs")).href + `?t=${Date.now()}`);
const { App, React, renderToString, getRoute, services, caseStudies } = ssr;

// --- Page list ---------------------------------------------------------------
const pages = [
  { file: "index.html", kind: "home" },
  ...services.map((service) => ({ file: service.file, kind: "service", service })),
  ...caseStudies.map((study) => ({ file: study.file, kind: "case", study })),
  ...Object.values(legalPages).map((page) => ({ file: page.file, kind: "legal", page })),
  { file: "privacy-request.html", kind: "privacy-request" },
  { file: "404.html", kind: "not-found" },
];

// --- Helpers -----------------------------------------------------------------
const esc = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pageUrl = (file) => `${SITE.url}/${file === "index.html" ? "" : file}`;
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const organization = () => ({
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.brand,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/assets/logo-mark.png`,
  email: SITE.email,
  telephone: SITE.phone,
  sameAs: [SITE.linkedin],
  ...(SITE.registeredAddress ? { address: { "@type": "PostalAddress", streetAddress: SITE.registeredAddress } } : {}),
});

function structuredData(page, title) {
  if (page.kind === "home") {
    return jsonLd({
      "@context": "https://schema.org",
      "@graph": [
        organization(),
        { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.brand, publisher: { "@id": `${SITE.url}/#organization` } },
      ],
    });
  }

  if (page.kind === "not-found") {
    return "";
  }

  const crumbTitle = page.service?.title || page.study?.title || page.page?.title || title.split("|")[0].trim();
  const graph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.brand, item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: crumbTitle, item: pageUrl(page.file) },
      ],
    },
  ];

  if (page.service) {
    graph.push({
      "@type": "Service",
      name: page.service.title,
      description: page.service.detailLead,
      url: pageUrl(page.file),
      provider: { "@id": `${SITE.url}/#organization` },
    });
  }

  return jsonLd({ "@context": "https://schema.org", "@graph": graph });
}

function renderPage(page) {
  globalThis.__SSR_FILE__ = page.file;
  const route = getRoute();
  const { title, description } = route.meta;
  const body = renderToString(React.createElement(App));
  const isNotFound = page.kind === "not-found";
  const url = pageUrl(page.file);
  const socialTitle = title;

  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    isNotFound ? '<base href="/">' : "",
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    '<meta name="theme-color" content="#0e1115">',
    isNotFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`,
    isNotFound
      ? ""
      : [
          '<meta property="og:type" content="website">',
          `<meta property="og:site_name" content="${esc(SITE.brand)}">`,
          `<meta property="og:title" content="${esc(socialTitle)}">`,
          `<meta property="og:description" content="${esc(description)}">`,
          `<meta property="og:url" content="${url}">`,
          `<meta property="og:image" content="${SITE.url}/${OG_IMAGE}">`,
          '<meta property="og:image:width" content="1200">',
          '<meta property="og:image:height" content="630">',
          `<meta property="og:image:alt" content="${esc(SITE.brand)}: custom software, mobile apps and AI automation">`,
          '<meta name="twitter:card" content="summary_large_image">',
          `<meta name="twitter:title" content="${esc(socialTitle)}">`,
          `<meta name="twitter:description" content="${esc(description)}">`,
          `<meta name="twitter:image" content="${SITE.url}/${OG_IMAGE}">`,
        ].join("\n    "),
    '<link rel="icon" href="assets/logo-mark.png?v=logo-favicon" type="image/png">',
    '<link rel="apple-touch-icon" href="assets/logo-mark.png?v=logo-favicon">',
    `<link rel="preload" href="${FONT}" as="font" type="font/woff2" crossorigin>`,
    `<link rel="stylesheet" href="styles.css?v=${ASSET_VERSION}">`,
    structuredData(page, title),
  ]
    .filter(Boolean)
    .join("\n    ");

  return `<!doctype html>
<html lang="en">
  <head>
    ${head}
  </head>
  <body>
    <div id="root">${body}</div>
    <noscript>
      <p class="noscript-notice">Some parts of this website, such as the contact form and the cookie choices, need JavaScript. You can still reach ${esc(SITE.legalName)} at <a href="mailto:${SITE.email}">${SITE.email}</a> or on <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a>.</p>
    </noscript>
    <script type="module" src="src/main.mjs?v=${ASSET_VERSION}"></script>
  </body>
</html>
`;
}

// --- Write pages + sitemap ---------------------------------------------------
const built = [];

for (const page of pages) {
  writeFileSync(path.join(root, page.file), renderPage(page), "utf8");
  built.push(page.file);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((page) => page.kind !== "not-found")
  .map((page) => `  <url><loc>${pageUrl(page.file)}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");

console.log(`Built ${built.length} pages + sitemap.xml`);
console.log(built.join("\n"));
