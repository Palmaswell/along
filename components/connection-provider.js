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
      this.handleStream = (e) => {
        WSProvider.createMsgStreamHandle(ws, props.channel, e);
      }
      ;
   });
  }

  updateMessages = (redisMsg) => {
    this.setState(state => {
      return {
        messages: state.messages.add(redisMsg)
      };
    });
  }

  componentDidMount = () => {
    this.connection.subscribe(connection => {
      const redisMsg = JSON.parse(connection.message.data);
      //-- to do remove switch with a if condition
      switch (redisMsg.action) {
        case 'SUBSCRIBEMSG':
          this.updateMessages(redisMsg);
          console.log(this.state, 'state in the didmount function')
          // this.state.messages.add(redisMsg);
          // this.setState(this.state);
          // this.setState(({messages}) => {
          //   messages.add(redisMsg);
          // })
          break;
      }
    });
  };

  render() {
    const messages = Array.from(this.state.messages);
    console.log(messages, 'state on the render function');
    return (
      <div>
        <textarea onChange={e => this.handleStream(e)}/>
        <ul>
          {messages.map((message, i) => <li key={i}>{message.channel}:{message.message}</li>)}
        </ul>
      </div>
    )
  }
}



