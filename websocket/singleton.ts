import { Subject } from 'rxjs';

export interface WSBroker {
  wsSingleton: WSSingletonProps;
}

export interface  WSSingletonProps {
  ws: WebSocket;
  subject: Subject<{}>;
}

export class WSProviderSingleton {
  public ws: WebSocket;
  public subject: Subject<{}>;
  constructor(hostName, channel) {
    this.ws = new WebSocket(`ws://${hostName}:3001`);
    const ws = this.ws;
    this.subject = new Subject();
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        action: 'SUBSCRIBE',
        channels: [channel]
      }));

      console.log(`
      > ⚗️ Reactive - Websocket client is up and running
      > 📺 Connected to channel: ${channel}
      `);
      this.subject.next({
        action: "WSOPEN",
        ws
      })
    });
    ws.addEventListener('close', () => this.subject.next({
      action: "WSCLOSE"
    }));

    ws.addEventListener('message', message => {
      const redisMsg = JSON.parse(message.data);
      if (redisMsg.action === 'SUBSCRIBEMSG') {
        this.subject.next(message);
      }
    });
  }
}
