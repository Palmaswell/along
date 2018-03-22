import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

const WSContext = React.createContext([]);
export class WSProvider extends React.Component {
  state = { messages: []};
  componentDidMount = () => {
    this.connection = Rx.Observable.create(observer => {
      this.ws = new WebSocket (`ws://${this.props.hostName}:3001`);

      this.ws.addEventListener('open', () => {
        this.ws.send(JSON.stringify({
          action: 'SUBSCRIBE',
          channels: ['Hamster']
        }));
      })

      this.ws.addEventListener('message', e => {
        observer.next(e);
      });
    });

    this.connection.subscribe(e => {
      const message = JSON.parse(e.data);
      switch (message.action) {
        case 'SUBSCRIBEMSG':
          this.state.messages.push(message);
          this.setState(this.state);
      }
      console.log(e, '?????////////')
    })
  };

  render() {
    return (
      <WSContext.Provider>
        { this.props.children }
      </WSContext.Provider>
    )
  }
}
console.log(WSContext, 'context, &&&');


export default class Test extends React.Component {
  static propTypes = {
    hostName: propTypes.string.isRequired,
  }

  constructor() {
    super();
    this.state = {
      channel: 'Hamster',
      messages: []
    };
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://${this.props.hostName}:3001`);
    const connection = Rx.Observable.create(observer => {
      ws.addEventListener('open', () => {
        ws.send(JSON.stringify({
          action: 'SUBSCRIBE',
          channels: ['Mouse']
        }));
      });
      ws.addEventListener('message', e => {
        console.log(e);
      });
    });
    connection.subscribe(ws => {
      console.log(ws, '&&&&&&&');
    })
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>Hello World</div>
    )
  }
}


