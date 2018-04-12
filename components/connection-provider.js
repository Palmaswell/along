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
      }
    });
  })

  componentDidMount () {
    this.ws.subscribe(ws => {
      ws.addEventListener('message', message => {
        const redisMsg = JSON.parse(message.data);
        if (redisMsg.action === 'SUBSCRIBEMSG') {
          this.updateMessages(redisMsg);
        }
      })
    });
  }

  handleMessageStream = (e) => {
    const messages = Rx.Observable.create(observer => {
      if (e.persist) {
        e.persist();
      }
      observer.next(e);
    });

    messages.subscribe(message => {
      this.sendMessage(message);
    });
  }

  sendMessage = (e) => {
    this.ws.subscribe(ws => {
      if (ws.readyState === 1) {
        return (
          ws.send(JSON.stringify({
            action:'PUBLISH',
            channels: [this.props.channel],
            message: e
          }))
        );
      }
    })
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

