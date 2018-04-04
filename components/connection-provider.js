import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export const WSContext = React.createContext(new Set());

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  state = { messages: new Set() };

  componentDidMount = () => {
    const ws = new WebSocket(`ws://${this.props.hostName}:3001`);
    this.connection = Rx.Observable.create(observer => {
      ws.addEventListener('open', () => {
        ws.send(JSON.stringify({
          action: 'SUBSCRIBE',
          channels: [this.props.channel]
        }));
        console.log(`
        > ⚗️ Reactive - Websocket client is up and running
        > 📺 Connected to channel: ${this.props.channel}
        `);
      });
      ws.addEventListener('message', message => {
        observer.next({ws, message});
      });
    });

    this.connection.subscribe(connection => {
      const redisMsg = JSON.parse(connection.message.data);
      if (redisMsg.action === 'SUBSCRIBEMSG') {
        this.updateMessages(redisMsg);
      }
    });
    this.ws = ws;
  }

  handleMessageStream = (e) => {
    e.persist();
    if (this.ws.readyState === 1) {
      this.sendMessage(e);
    }
  }

  sendMessage = (e) => {
    return (
      this.ws.send(JSON.stringify({
        action:'PUBLISH',
        channels: [this.props.channel],
        message: e.target.value
      }))
    );
  }

  updateMessages = redisMsg => {
    this.setState(({ messages }) => (
      messages.add(redisMsg)
    ));
  }

  render() {
    const broker = {
      messages: Array.from(this.state.messages),
      send: e => this.handleMessageStream(e)
    }

    return (
    <WSContext.Provider value={ broker }>
      {this.props.children}
    </WSContext.Provider>
    );
  }
};

