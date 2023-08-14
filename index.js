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
const PHOTO_ROOT = process.env.PHOTO_ROOT || "./public/images";

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

function getFile(pathname, response) {
  let filepath = WEB_ROOT + (pathname.slice(-1)[0] === '/' ? pathname + "index.html" : pathname);

  if(!fs.existsSync(filepath)) {
    sendError(response, 404, "the file you were looking for could not be found");
    return;
  }

  fs.readFile(filepath, (err, data) => {
    if(err) {
      sendError(response, 500, `something actually went wrong. here's the error:
      ${err}`)
      return;
    }

    response.writeHead(200, {
      "Content-Type": CONTENT_TYPE_MAP[filepath.split('.').slice(-1)[0]],
    });
    response.write(data);
    response.end();
  });
}

function getPhotoSubset(start, end, response) {
  let photos = {};

  response.writeHead(200, {"Content-Type": CONTENT_TYPE_MAP["json"]});
  response.write(JSON.stringify(fs.readdirSync(PHOTO_ROOT).slice(start,end)));
  response.end();
}

function onRequest(request, response) {
  let reqBody = "";
  let reqUrl = new URL(request.url, WEB_URL);

  request.on("data", (chunk) => {
    reqBody += chunk;
  });

  request.on("end", () => {
    if(request.method === "GET") {
      switch(reqUrl.pathname){
        case("/api/v0/images"):
          getPhotoSubset(reqUrl.searchParams.get("start"),
                         reqUrl.searchParams.get("end"),
                         response,);
          break;
        default:
          getFile(decodeURIComponent(reqUrl.pathname), response);
      }
    } else {
      sendError(response, 501, "method not implemented");
    }
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
