const http = require("http");
const fs = require("fs/promises");
const pt = require("path");

const hostname = "localhost";
const port = 8080;

async function getFile(filename) {
  try {
    const data = await fs.readFile(`.${filename}`, { encoding: "utf8" });
    return data;
  } catch (err) {
    return err;
  }
}

const server = http.createServer(async (req, res) => {
  let path = req.url;
  let data;
  let contentType;
  if (path === '/') {
    path += 'index.html';
    contentType = 'html';
  }
  else if (pt.extname(path) === '') {
    path += '.html';
    contentType = pt.extname(path).slice(1);
  }
  else {
    contentType = pt.extname(path).slice(1);
  }
  data = await getFile(path);
  if (data.code === 'ENOENT') {
    data = await getFile('/404.html');
    contentType = 'html';
    res.statusCode = 404;
    res.setHeader("Content-Type", `text/${contentType}`);
    return res.end(data);
  }
  else {
    res.statusCode = 200;
    res.setHeader("Content-Type", `text/${contentType}`);
    return res.end(data);
  }
});

server.listen(port, hostname, async () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

