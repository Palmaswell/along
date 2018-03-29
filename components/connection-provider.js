import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  static createMsgStreamHandle(ws, channel) {
    return e => {
      e.persist();
      console.log(e.target.value, 'event, ;;;;;')
      ws.send(JSON.stringify({
        action:'PUBLISH',
        channels: [channel],
        message: e.target.value
      }));
    }
  }

  constructor(props) {
    super(props);
    this.state = { messages: new Set()};
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
        observer.next({ws, message})
      });
      this.handleMsgStream = WSProvider.createMsgStreamHandle(ws, props.channel);
   });
  }

  componentDidMount = () => {
    this.connection.subscribe(connection => {
      console.log('it goes in here')
      const redisMsg = JSON.parse(connection.message);
      console.log(connection.message, 'should go in here ******');
      switch (redisMsg.action) {
        case 'SUBSCRIBEMSG':
          this.state.messages.add(redisMsg);
          this.setState(this.state);
          break;
      }
    });
  };

  render() {
    const messages = Array.from(this.state.messages);
    console.log(this.state.messages, 'empty ________******')
    return (
      <div>
        <textarea onChange={this.handleMsgStream}/>
        <ul>
        {messages.map((message, index) => (
            <li key={index}>{message.channel}: {message.message}</li>
        ))}
        </ul>
      </div>
    )
  }
}



