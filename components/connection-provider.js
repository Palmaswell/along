import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  static createMsgStreamHandle(ws, channel, e) {
    e.persist();
    console.log(e.target.value)
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
      this.handleMsgStream = (e) => {
        WSProvider.createMsgStreamHandle(ws, props.channel, e);
      }
      ;
   });
  }

  componentDidMount = () => {
    this.connection.subscribe(connection => {
      console.log('you are subscribed')
      const redisMsg = JSON.parse(connection.message.data);
      switch (redisMsg.action) {
        case 'SUBSCRIBEMSG':
          this.setState(({messages}) => {
            messages.add(redisMsg);
          })
          console.log(this.state, 'this is the state dfdfdf');
          break;
      }
    });
  };

  render() {
    const messages = Array.from(this.state.messages);
    console.log(messages);
    return (
      <div>
        <textarea onChange={e => this.handleMsgStream(e)}/>
        <ul>
        {messages.map((message, index) => (
            console.log(message, 'iifuiduifd')
        ))}
        </ul>
      </div>
    )
  }
}



