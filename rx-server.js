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
      observer.error(console.log('error'));
      observer.next(ws);
  });
});

const broadcastMessages = (message, broker) => {
  switch(message.action) {
    case 'SUBSCRIBE':
      broker.on('message', (channel, message) => {
        ws.send(JSON.stringify({
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
  }
}

const messages = Rx.Observable.create(observer => {
  connection.subscribe(ws => {
    ws.on('message', message => {
      observer.error(console.log('error'));
      observer.next(JSON.parse(message))
    })
  })
});

const broadcast = Rx.Observable.merge(connection, messages);

broadcast.subscribe((test, error) => {
  if(error) {
    console.log(error)
  }
  console.log(test, '&****')
})

// messages.subscribe(message => {
//   console.log('this is the test', message);
//   // broadcastMessages(message, redis.createClient())
// })

server.listen(3001, () => {
  console.log(`
  > Reactive - Redis - Websocket server is running ✌️
  > Server started on port: ${server.address().port}
  `);
})
