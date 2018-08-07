import { Subject } from 'rxjs';

type MessageActionType = 'SUBSCRIBE' | 'PUBLISH' | 'SUBSCRIBEMSG';
interface MessageProps {
  action: MessageActionType;
  channel?: string;
}

export interface WSSingletonProps {
  subject: Subject<{}>;
  ws: WebSocket;
}

export class WSProviderSingleton {
  public subject: Subject<{}>;
  public ws: WebSocket;
  public constructor(hostName: string, channel: string) {
    this.ws = new WebSocket(`ws://${hostName}:3001`);
    this.subject = new Subject();
    const ws = this.ws;

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
      const redisMsg: MessageProps = JSON.parse(message.data);
      if (redisMsg.action === 'SUBSCRIBEMSG') {
        this.subject.next(message);
      }
    });
  }
}
