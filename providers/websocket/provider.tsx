import React from 'react';
import { WSProviderSingleton, WSSingletonProps } from './singleton';
import { Loading } from '../../components/loading';

type MessageAction = 'WSOPEN' | 'WSCLOSE' | 'PUBLISH';
interface MessageProps {
  action: MessageAction;
}

export interface WSProviderProps {
  channel: string;
}

export interface WSProviderState {
  isTransitioning: boolean;
  wsopen: boolean;
  wsSingleton?: WSSingletonProps;
}

export const WSContext = React.createContext({
  wsSingleton: null as WSSingletonProps
});

export class WSProvider extends React.Component<WSProviderProps> {
  public state = {
    isTransitioning: false,
    wsopen: false,
    wsSingleton: null
  };

  public componentDidMount(): void {
    const locationOrigin = window.location.origin.replace(/(http:\/\/)/g, '');
    const hostName = locationOrigin.match(/(:1337)/)
      ? locationOrigin.replace(/(:1337)/g, '')
      : locationOrigin;

    const wsSingleton = new WSProviderSingleton(hostName, this.props.channel);

    wsSingleton.subject.subscribe((message: MessageProps) => {
      switch(message.action) {
        case 'WSOPEN':
          this.setState({ ...this.state, wsopen: true });
          break;
        case 'WSCLOSE':
          this.setState({ ...this.state, wsopen: false });
          break;
        case 'PUBLISH':
          wsSingleton.subject.next({message});
          wsSingleton.ws.send(JSON.stringify(message));
      }
    });
    this.setState({...this.state, wsSingleton, isTransitioning: true });
  }

  public componentWillUnmount(): void {
    this.setState({...this.state, isTransitioning: false });
  }
  private renderChildren = (): React.ReactNode | JSX.Element => {
    if (this.state.wsopen) {
      return this.props.children;
    }
    return <Loading isTransitioning={this.state.isTransitioning}/>;
  }

  public render(): JSX.Element {
    return (
      <WSContext.Provider value={this.state.wsSingleton}>
        {this.renderChildren()}
      </WSContext.Provider>
    );
  }
}

