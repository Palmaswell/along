const WebSocket = require('ws');
const redis = require("redis");

const pub = redis.createClient();


const wss = new WebSocket.Server({ port: 3001 });
// const channels = new Set();
// let subs;

wss.on('connection', (ws, req) => {

  ws.on('message', (message) => {
    const redisMsg = JSON.parse(message);
    console.log('it is connected', redisMsg)
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
          console.log(channel, message);
          ws.send(JSON.stringify({
            action: 'SUBSCRIBEMSG',
            channel,
            message
          }));
        })
        subs.subscribe(redisMsg.channels.join(' '));
        console.log(redisMsg.channels);
        // if (toCloseSubs) {
        //   toCloseSubs.quit();
        // }
        break;
      case 'PUBLISH':
        redisMsg.channels.forEach(channel => {
          // const wss  = channels.get(channel) || new Set();
          // wss.forEach(ws => {

          // })
          pub.publish(channel, redisMsg.message);

        });

    }
  })

})
