const express = require('express');
const http = require('http')
const redis = require('redis');
const Rx = require('rxjs');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const pub = redis.createClient();
const wss = new WebSocket.Server({ server });
// const channels = new Set();
// let subs;

const heartBeat = () => {
  this.isAlive = true;
}

wss.on('connection', (ws, req) => {
  ws.isAlive = true;
  ws.on('pong', heartBeat);

  ws.on('message', (message) => {
    const redisMsg = JSON.parse(message);
    switch (redisMsg.action) {
      case 'SUBSCRIBE':
        // redisMsg.channels.forEach(channel => {
        //   let values = channels.get(channel);
        //   if(!values) {
        //     values = new Set();
        //     channels.set(channel, values);
        //   }
        //   values.add(ws);
        // });

        // const toCloseSubs = subs;
        const subs = redis.createClient();

        subs.on('message', (channel, message) => {
          ws.send(JSON.stringify({
            action: 'SUBSCRIBEMSG',
            channel,
            message
          }));
        })
        subs.subscribe(redisMsg.channels.join(' '));
        console.log(`> Subsbribed to: [${redisMsg.channels}]`);
        // if (toCloseSubs) {
        //   toCloseSubs.quit();
        // }
        break;
      case 'PUBLISH':
        redisMsg.channels.forEach(channel => {
          pub.publish(channel, redisMsg.message);
        });
        break;
    }
  })
});

setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) {
      console.log(`> terminate ws connection`);
      return ws.terminate();
    }
    ws.ping(null, false, true);
  });
}, 3000);

server.listen(port, () => {
  console.log(`
  > Redis - Websocket server is running ✌️
  > Server started on port: ${server.address().port}
  `);
})
