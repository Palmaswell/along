import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export const WSContext = React.createContext(new Set());

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  state = { messages: new Set() }

  ws = Rx.Observable.create(observer => {
    try {
      const ws = new WebSocket(`ws://${this.props.hostName}:3001`);
      ws.addEventListener('open', () => {
        ws.send(JSON.stringify({
          action: 'SUBSCRIBE',
          channels: [this.props.channel]
        }));
        console.log(`
        > ⚗️ Reactive - Websocket client is up and running
        > 📺 Connected to channel: ${this.props.channel}
        `);

        if (ws.readyState === 1) {
          observer.next(ws);
          observer.complete();
        }
      });
    } catch(err) {
      observer.error(err);
    }
  })

  componentDidMount () {
    this.ws.subscribe(ws => {
      ws.addEventListener('message', message => {
        const redisMsg = JSON.parse(message.data);
        if (redisMsg.action === 'SUBSCRIBEMSG') {
          this.updateMessages(redisMsg);
        }
      },
      (err) => console.log(`> WS SUBSCRIBEMSG 💥: ${err}`),
      () => console.log(`> Completed SUBSCRIBEMSG  💌`))
    });
  }

  handleMessageStream = (e) => {
    const messages = Rx.Observable.create(observer => {
      try {
        if (e.persist) {
          e.persist();
        }
        observer.next(e);
        observer.complete();
      } catch(err) {
        observer.error(err);
      }
    });

    messages.subscribe(message => {
      this.sendMessage(message);
    },
    (err) => console.log(`> Stream message 💥: ${err}`),
    () => console.log(`> Completed streaming messages 💌💨`));
  }

  sendMessage = (e) => {
    const connection = this.ws.map(ws => ws);

    connection.subscribe(ws => {
      if (ws.readyState === 1) {
        return (
          ws.send(JSON.stringify({
            action:'PUBLISH',
            channels: [this.props.channel],
            message: e
          }))
        );
      }
    },
    (err) => console.log(`> WS PUBLISH 💥: ${err}`),
    () => console.log(`> Completed publishing messages 👩‍💻`))
  }

  updateMessages = redisMsg => {
    this.setState(({ messages }) => (
      messages.add(redisMsg)
    ));
  }

  render() {
    return (
    <WSContext.Provider value={{
        messages: Array.from(this.state.messages),
        send: e => this.handleMessageStream(e)
      }}>
      {this.props.children}
    </WSContext.Provider>
    );
  }
};

