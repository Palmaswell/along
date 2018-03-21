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

const subs = redis.createClient(
  REDIS_PORT,
  REDIS_HOST,
  {no_ready_check: true}
);

subs.auth(config.REDIS_PASS, function (err) {
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
function addChannels(channels, ws) {
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
function deleteWSFromChannel(ws) {
  CHANNELS.forEach((wsConnections, channel) => {
    wsConnections.delete(ws);
  })
}

subs.on('message', (channel, message) => {
  console.log('got msg from redis', message);
  //Todo
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
        subs.subscribe(addChannels(message.channels, connection.ws).join(' '));
        console.log(`> Subsbribed to: [${message.channels}]`);
        break;
      case 'PUBLISH':
        subs.subscribe(addChannels(message.channels, connection.ws).join(' '));
        message.channels.forEach(channel => {
          redisPub.publish(channel, message.message);
        });
        console.log(`> PUBLISH to: [${message.channels}]`);
        console.log(`> PUBLISH MSG to: [${message.message}]`);
        break;
      case 'WS_CLOSE':
        deleteWSFromChannel(connection.ws);
        break;
    };
  } catch (e) {
    console.error(e, connection)
  }
})

server.listen(EXPRESS_PORT, '0.0.0.0', () => {
  console.log(`
  > ⚗️ Reactive - Websocket - Redis server is running
  > ✌️ Server started on port: ${server.address().port}
  `);
})
