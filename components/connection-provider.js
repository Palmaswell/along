import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

const WSContext = React.createContext([]);
console.log(WSContext, 'initial context')
export class WSProvider extends React.Component {
  static propTypes = {
    hostName: propTypes.string.isRequired,
  };

  state = { messages: new Set() };

  componentDidMount = () => {
    console.log(this.state, 'initial state')
    this.messages = [];
    this.ws = new WebSocket (`ws://${this.props.hostName}:3001`);
    this.ws.addEventListener('open', () => {
      this.ws.send(JSON.stringify({
        action: 'SUBSCRIBE',
        channels: ['Hamster']
      }));
      console.log(`> WS client connection is open`);
    });
    this.ws.addEventListener('message', message => {
      const redisMsg = JSON.parse(message.data);
      switch(redisMsg.action) {
        case 'SUBSCRIBEMSG':
        this.messages.push(JSON.parse(message.data));
      }
    });
  };

  onStream = () => {
    return e => {
      Rx.Observable.from(this.messages).subscribe(redisMsg => {
        this.setState(({ messages }) => {
          messages.add(redisMsg);
        })
        console.log(`> Redis client message: ${this.state}`);
      });
      this.ws.send(JSON.stringify({
        action: 'PUBLISH',
        channels: ['Hamster'],
        message: e.target.value
      }));
    }
  }

  render() {
    const messages = Array.from(this.state.messages);
    console.log(messages, 'now theya r')
    return (
      <div>
        <textarea  onChange={this.onStream()} />
        <ul>
        {messages.map((message, index) => (
            <li key={index}>{message.channel}: {message.message}</li>
        ))}
        </ul>
      </div>
    )
  }
}



