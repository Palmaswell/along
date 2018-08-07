import React from 'react';
import { Subject } from 'rxjs';
import { Loading } from '../components/loading';

type MessageAction = 'WSOPEN' | 'WSCLOSE' | 'PUBLISH';
interface MessageProps {
  action: MessageAction;
}

export interface WSProviderProps {
  channel: string;
}

export class WSProviderSingleton {
  public webSock: WebSocket;
  public ws: Subject<{}>;
  constructor(hostName, channel) {
    this.webSock = new WebSocket(`ws://${hostName}:3001`);
    const ws = this.webSock;
    this.ws = new Subject();
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
  wsSingleton: null
});

export class WSProvider extends React.Component<WSProviderProps> {

  state = {
    wsSingleton: null,
    wsopen: false,
    isTransitioning: false
  };

  componentDidMount() {
    const locationOrigin = window.location.origin.replace(/(http:\/\/)/g, '');
    const hostName = locationOrigin.match(/(:1337)/)
      ? locationOrigin.replace(/(:1337)/g, '')
      : locationOrigin;

    const wsSingleton = new WSProviderSingleton(hostName, this.props.channel);

    wsSingleton.ws.subscribe((message: MessageProps) => {
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
    this.setState({...this.state, wsSingleton, isTransitioning: true });
  }

  componentWillUnmount() {
    this.setState({...this.state, isTransitioning: false });
  }

  renderChildren = () => {
    if (this.state.wsopen) {
      return this.props.children;
    }
    return <Loading isTransitioning={this.state.isTransitioning}/>;
  }

  render() {
    return (
      <WSContext.Provider value={this.state.wsSingleton}>
        {this.renderChildren()}
      </WSContext.Provider>
    );
  }
}

