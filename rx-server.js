const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http');
const redis = require('redis');
const Rx = require('rxjs');
const WebSocket = require('ws');

const app = express();
const config = require('./redis.config');
const server = http.createServer(app);

const {
  EXPRESS_PORT,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASS } = process.env;

const redisSub = redis.createClient(
  REDIS_PORT,
  REDIS_HOST,
  {no_ready_check: true}
);

redisSub.auth(config.REDIS_PASS, function (err) {
  if (err) {
    throw err;
  };
});

const redisPub = redis.createClient(
  REDIS_PORT,
  REDIS_HOST,
  {no_ready_check: true}
);

redisPub.auth(REDIS_PASS, function (err) {
  if (err) {
    throw err;
  };
});

const connection = Rx.Observable.create(observer => {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', ws => {
    const closeMsg = () => {
      observer.next({ ws, message: JSON.stringify({ action: 'WS_CLOSE' })})
    };
    ws.on('message', message => {
      observer.next({ws, message});
    })
    ws.on('error', closeMsg);
    ws.on('close', closeMsg);
  });
});

const CHANNELS = new Map();

const addChannels = (channels, ws) => {
  channels.forEach(channel => {

    let wsConnections = CHANNELS.get(channel);
    if(!wsConnections) {
      wsConnections = new Set();
      CHANNELS.set(channel, wsConnections);
    }
    wsConnections.add(ws);
  });
  return Array.from(CHANNELS.keys());
}

const deleteWSFromChannel = (ws) => {
  CHANNELS.forEach((wsConnections, channel) => {
    wsConnections.delete(ws);
  });
}

redisSub.on('message', (channel, message) => {
  console.log(`> Redis message 📩: ${message}`);
  const wsConnections = CHANNELS.get(channel);
  if(wsConnections) {
    wsConnections.forEach(ws => {
      ws.send(JSON.stringify({
        action: 'SUBSCRIBEMSG',
        channel,
        message
      }));
    });
  }

});

connection.subscribe(connection => {
  try {
    const message = JSON.parse(connection.message);
    switch(message.action) {
      case 'SUBSCRIBE':
        redisSub.subscribe(
          addChannels(message.channels, connection.ws).join(' ')
        );
        console.log(`> SUBSCRIBE to: [${message.channels}]`);
        break;
      case 'PUBLISH':
        redisSub.subscribe(
          addChannels(message.channels, connection.ws).join(' ')
        );
        message.channels.forEach(channel => {
          redisPub.publish(channel, message.message);
        });
        console.log(`> PUBLISH to: [${message.channels}]`);
        console.log(`> PUBLISH 📩: ${message.message}`);
        break;
      case 'WS_CLOSE':
        deleteWSFromChannel(connection.ws);
        break;
    };
  }
  catch (err) {
    console.error(`👻 x ${connection}: ${err}`)
  }
})

server.listen(EXPRESS_PORT, '0.0.0.0', () => {
  console.log(`
  > ⚗️ Reactive - Websocket - Redis server is running
  > ✌️ Server started on port: ${server.address().port}
  `);
})
