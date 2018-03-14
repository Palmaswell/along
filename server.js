const body = require('body-parser');
const express = require('express');
const next = require('next');
const PubNub = require('pubnub');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev: true });
const handle = app.getRequestHandler();

const { port, publishKey, subscribeKey } = require('./pubnub.config');
const pubnub = new PubNub({ publishKey, subscribeKey });

async function start() {
  await app.prepare();
  const server = express();
  const messages = [];

  server.use(body.json());
  server.use((req, res, next) => {
    req.state = { messages };
    next();
  });

  server.get('/message', (req, res) => {
    res.json({ messages });
  });

  server.post('/message/:client', (req, res) => {
    const message = {
      client: req.params.client,
      content: req.body.message
    };

    messages.push(message);
    pubnub.publish({
      channel: 'messages',
      message
    });
    res.json({ message });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port);

  console.log(`> Ready on http://localhost:${port}`);
}

start().catch(error => console.error(error.stack));
