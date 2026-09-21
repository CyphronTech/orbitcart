// Tiny static file server for local development and tests.
// Mirrors Firebase Hosting for this site (see firebase.json):
//   /page.html   -> 301 to /page          (cleanUrls)
//   /page        -> serves page.html
//   unknown URLs -> 404.html with a 404 status
//
// Usage:  npm run serve            (http://localhost:8000)
//         PORT=3000 npm run serve

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT) || 8000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const isFile = (file) => stat(file).then((info) => info.isFile()).catch(() => false);

// Text files are gzipped, like Firebase Hosting does, so local timings are realistic.
const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/;

async function send(request, response, file, status = 200) {
  let body = await readFile(file);
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  const headers = { "Content-Type": type, "Cache-Control": "no-store" };

  if (COMPRESSIBLE.test(type) && (request.headers["accept-encoding"] || "").includes("gzip")) {
    body = gzipSync(body);
    headers["Content-Encoding"] = "gzip";
  }

  response.writeHead(status, headers);
  response.end(body);
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const hidden = pathname.split("/").some((part) => part.startsWith(".") && part !== "");

    // Clean URLs: /page.html redirects to /page (and /index.html to /).
    if (pathname.endsWith(".html") && !hidden) {
      const clean = pathname === "/index.html" ? "/" : pathname.slice(0, -".html".length);
      response.writeHead(301, { Location: clean + url.search });
      response.end();
      return;
    }

    const candidates = pathname === "/" ? ["index.html"] : path.extname(pathname) ? [pathname] : [`${pathname}.html`];

    for (const candidate of candidates) {
      const file = path.join(root, candidate);
      if (!hidden && file.startsWith(root + path.sep) && candidate !== "404.html" && (await isFile(file))) {
        await send(request, response, file);
        return;
      }
    }

    await send(request, response, path.join(root, "404.html"), 404);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end("Server error");
    console.error(error);
  }
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
