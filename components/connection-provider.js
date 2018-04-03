import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export const WSContext = React.createContext(new Set());

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  static send = (e) => {
    console.log(e, 'from the static method')
    return {
      get: () => e
    };
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

      this.foo = (e) => (
        this.handleMessageStream(ws, props.channel, e)
      );
    });
    const test = WSProvider.send('test+++++');
    this.test = test.get();
  };

  componentDidMount = () => {
    this.connection.subscribe(connection => {
      const redisMsg = JSON.parse(connection.message.data);
      if (redisMsg.action === 'SUBSCRIBEMSG') {
        this.updateMessages(redisMsg);
      }
    });
  };

  handleConnection = ws => {
    ws.send(JSON.stringify({
      action:'PUBLISH',
      channels: [channel],
      message: e.target.value
    }))
  }

  handleMessageStream = (ws, channel, e) => {
    e.persist();
    console.log(e, 'it goes inhere *******');
    ws.send(JSON.stringify({
      action:'PUBLISH',
      channels: [channel],
      message: e.target.value
    }));
  };

  updateMessages = redisMsg => {
    this.setState(({ messages }) => (
      messages.add(redisMsg)
    ));
  };

  render() {
    const connection = {
      messages: Array.from(this.state.messages),
    };
    console.log('this.test is available', this.test)
    return (
    <WSContext.Provider value={ connection }>
      {this.props.children}
    </WSContext.Provider>
    );
  }
};

