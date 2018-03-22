const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http');
const next = require('next');

const { parse } = require('url');
const { NEXT_PORT } = process.env;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();


nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);

  app.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    handle(req, res, parsedUrl);

  })
  server.listen(NEXT_PORT, err => {
    if (err) {
      throw err;
    }
    console.log(`
      > ▲ Next Js server is running
      > ▲ Server started on port: ${ NEXT_PORT }
    `);
  })
})
