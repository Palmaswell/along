import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

const WSContext = React.createContext([]);
export class WSProvider extends React.Component {
  static propTypes = {
    hostName: propTypes.string.isRequired,
  }

  state = { messages: []};

  componentDidMount = () => {
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

  publish = (channel, message) => (
    this.ws.send(JSON.stringify({
      actions: 'PUBLISH',
      channels: [channel],
      message: message
    }))
  )

  onStream = () => {
    return e => {
      Rx.Observable.from(this.messages).subscribe(redisMsg => {
        this.setState(({ messages }) => {
          messages.push(redisMsg);
          console.log(`> Redis message: ${redisMsg}`);
        })
      })
      this.ws.send(JSON.stringify({
        action: 'PUBLISH',
        channels: ['Hamster'],
        message: e.target.value
      }))
    }
  }

  render() {
    return (
      <div>
        <textarea  onChange={this.onStream()} />
        <ul>
            {this.state.messages.map((message, index) => (
              <li key={index}>{message.channel}: {message.message}</li>
            ))}
          </ul>
      </div>
    )
  }
}



