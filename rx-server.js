const express = require('express');
const http = require('http');
const redis = require('redis');
const Rx = require('rxjs');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app)
const pub = redis.createClient();

const connection = Rx.Observable.create(observer => {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', ws => {
      ws.on('message', message => {
        observer.next({ws, message});
      })
  });
});

connection.subscribe(connection => {
  const message = JSON.parse(connection.message);
  console.log(connection.ws.on);
  console.log(message.action);
  switch(message.action) {
    case 'SUBSCRIBE':
      const broker = redis.createClient();
      broker.on('message', (channel, message) => {
        connection.ws.send(JSON.stringify({
          action: 'SUBSCRIBEMSG',
          channel,
          message
        }));
      })
      broker.subscribe(message.channels.join(' '));
      console.log(`> Subsbribed to: [${message.channels}]`);
      break;
    case 'PUBLISH':
      message.channels.forEach(channel => {
        pub.publish(channel, message.message);
      });
      break;
  };
})

server.listen(3001, () => {
  console.log(`
  > Reactive - Redis - Websocket server is running ✌️
  > Server started on port: ${server.address().port}
  `);
})
