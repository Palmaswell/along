import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';


export class WSProviderSingleton {
  constructor(hostName) {
    this.webSock = new WebSocket(`ws://localhost:3001`);
    const ws = this.webSock;
    this.ws = new Rx.Subject();
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        action: 'SUBSCRIBE',
        channels: ['Home']
      }));
      console.log(`
      > ⚗️ Reactive - Websocket client is up and running
      > 📺 Connected to channel: ${4711}
      `);
      this.ws.next({
        action: "WSOPEN",
        ws
      })
    });
    ws.addEventListener('close', () => this.ws.next({
      action: "WSCLOSE"
    }));

    ws.addEventListener('message', message => {
        const redisMsg = JSON.parse(message.data);
        console.log("ws", message);
        if (redisMsg.action === 'SUBSCRIBEMSG') {
          this.ws.next(message);
        }
    });
  }
}

export const WSContext = React.createContext({
  wsProviderSingleton: null
});

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  state = { wsProviderSingleton: null, wsopen: false };

  componentDidMount () {
    const wsProviderSingleton = new WSProviderSingleton();
    wsProviderSingleton.ws.subscribe(message => {
      console.log("jjjj!!!!!", message);
      if (message.action == "WSOPEN") {
        this.setState({ ...this.state, wsopen: true });
      }
      if (message.action == "WSCLOSE") {
        this.setState({ ...this.state, wsopen: false });
      }
      if (message.action == "PUBLISH") {
        console.log("ggggg", message);
        wsProviderSingleton.webSock.send(JSON.stringify(message));
      }
    });
    this.setState({...this.state, wsProviderSingleton});
  }

  renderChildren = () => {
    if (this.state.wsopen) {
      return this.props.children;
    }
    return <div>waiting for Websocket</div>
  }

  render() {
    return (
      <WSContext.Provider value={this.state.wsProviderSingleton}>
        {this.props.children}
      </WSContext.Provider>
    );
  }
}

