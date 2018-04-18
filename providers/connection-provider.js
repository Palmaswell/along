import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';


class WSProviderSingleton {
  constructor(hostName, channel) {
    this.webSock = new WebSocket(`ws://${hostName}:3001`);
    const ws = this.webSock;
    this.ws = new Rx.Subject();
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        action: 'SUBSCRIBE',
        channels: [channel]
      }));

      console.log(`
      > ⚗️ Reactive - Websocket client is up and running
      > 📺 Connected to channel: ${channel}
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
  };

  state = {
    wsSingleton: null,
    wsmessages: new Set(),
    wsopen: false
  };

  componentDidMount () {
    const locationOrigin = window.location.origin.replace(/(http:\/\/)/g, '');
    const hostName = locationOrigin.match(/(:1337)/)
      ? locationOrigin.replace(/(:1337)/g, '')
      : locationOrigin;
    const channel = this.props.channel;

    const wsSingleton = new WSProviderSingleton(hostName, channel);

    wsSingleton.ws.subscribe(message => {
      switch(message.action) {
        case 'WSOPEN':
          this.setState({ ...this.state, wsopen: true });
          break;
        case 'WSCLOSE':
          this.setState({ ...this.state, wsopen: false });
          break;
        case 'PUBLISH':
          wsSingleton.ws.next({message});
          wsSingleton.webSock.send(JSON.stringify(message));
      }
    });
    this.setState({...this.state, wsSingleton});
  }

  renderChildren = () => {
    if (this.state.wsopen) {
      return this.props.children;
    }
    return <div>📺  Waiting for Websocket client</div>
  }

  render() {
    return (
      <WSContext.Provider value={this.state.wsSingleton}>
        {this.renderChildren()}
      </WSContext.Provider>
    );
  }
}

