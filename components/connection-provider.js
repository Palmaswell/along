import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export const MessagesContext = React.createContext(new Set());
console.log(MessagesContext , 'this works so far fine')

export class MessagesProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  static createMsgStreamHandle(ws, channel, e) {
    e.persist();
    ws.send(JSON.stringify({
      action:'PUBLISH',
      channels: [channel],
      message: e.target.value
    }));
  }

  constructor(props) {
    super(props);

    this.state = { messages: new Set() };

    this.connection = Rx.Observable.create(observer => {
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
      });
      ws.addEventListener('message', message => {
        observer.next({ws, message});
      });
      this.handleStream = (e) => {
        MessagesProvider.createMsgStreamHandle(ws, props.channel, e);
      }
      ;
   });
  }

  componentDidMount = () => {
    this.connection.subscribe(connection => {
      const redisMsg = JSON.parse(connection.message.data);
      if (redisMsg.action === 'SUBSCRIBEMSG') {
        this.updateMessages(redisMsg);
      }
    });
  };

  updateMessages = (redisMsg) => {
    this.setState(({ messages }) => (
      messages.add(redisMsg)
    ));
  };

  render() {
    const messages = Array.from(this.state.messages);
    return (
    <MessagesContext.Provider value={messages}>
      {this.props.children}
    </MessagesContext.Provider>
    );
  }
}



