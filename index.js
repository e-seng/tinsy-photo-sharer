/**
 * Small photo sharing server!
 *
 * created by e-seng on GitHub!
 */
const http = require("http");
const fs = require("fs");

const PORT = process.env.APP_PORT || 8080;
const WEB_ROOT = process.env.APP_ROOT || "./public";
const WEB_URL = process.env.APP_URL || "http://localhost";
const PHOTO_ROOT = process.env.PHOTO_ROOT || "./images";

const CONTENT_TYPE_MAP = {
  "html": "text/html",
  "css": "text/css",
  "txt": "text/plain",
  "js": "application/javascript",
  "json": "application/json",
  "svg": "image/svg+xml",
  "png": "image/png",
  "jpg": "image/jpg",
  "jpeg": "image/jpg",
  "webp": "image/webp",
}

function sendError(response, code, reason) {
  response.writeHead(code, {"Content-Type": "text/html"});
  response.write(`
<!doctype html>
<html>
  <head>
    <title>✨ tinsy photo sharer ✨</title>
    <link rel="stylesheet" href="/css/styles.css" />
    <meta lang="en" />
    <meta charset="utf-8" />
  </head>
  <body>
    <h1>error ${code}</h1>
    <i>${reason}</i>
    <p>if this is unexpected, please let me know!</p>
  </body>
  <footer>
    <i>
      using the tinsy photo sharer made by
      <a href="https://github.com/e-seng">e-seng on GitHub</a>
    </i>
  </footer>
</html>
  `);
  response.end();
}

function onRequest(request, response) {
  let reqBody = "";
  let reqUrl = new URL(request.url, WEB_URL);

  request.on("data", (chunk) => {
    reqBody += chunk;
  });

  request.on("end", () => {
    sendError(response, 418, "i am a teapot and the site is barely started");
  });

  response.on("close", () => {
    console.log(
      `[${new Date().toISOString()}] ${request.method} request made to ${request.url}... ${response.statusCode}`);
    if(reqBody) {
      console.log(reqBody);
    }
  });
}

http.createServer(onRequest).listen(PORT);
console.log(`[${new Date().toISOString()}] server started on port "${PORT}" and web root "${WEB_ROOT}" hosting images from "${PHOTO_ROOT}"`);
