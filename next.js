const { createServer } = require('http');
const dotenv = require('dotenv').config();
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const { NEXT_PORT } = process.env;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    handle(req, res, parsedUrl);

  }).listen(NEXT_PORT, '0.0.0.0', err => {
    if (err) {
      throw err;
    }
    console.log(`
      > ▲ Next Js server is running
      > ▲ Server started on port: ${ NEXT_PORT }
    `);
  })
})
