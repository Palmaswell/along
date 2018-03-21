const http = require('http');
const dotenv = require('dotenv').config();
const express = require('express');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const { NEXT_PORT } = process.env;

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);

  app.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    handle(req, res, parsedUrl);

  })
  server.listen(NEXT_PORT, '0.0.0.0', err => {
    if (err) {
      throw err;
    }
    console.log(`
      > ▲ Next Js server is running
      > ▲ Server started on port: ${ NEXT_PORT }
    `);
  })
})
