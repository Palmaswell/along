import * as React from 'react';
import { WSSingletonProps } from '../websocket/singleton';
export interface SpeechBrokerProps {
  // $todo: this should be either one of the following interfaces:
  // navigateIntent tracksIntent homeIntent playlistsIntent
  registrationList: any;
  wsBroker: {
    wsSingleton: WSSingletonProps;
  };
}


export default class SpeechBroker extends React.Component<SpeechBrokerProps> {
  static getDerivedStateFromProps(props) {
    const { registrationList } = props;

    registrationList.forEach(intent => {
      const action = intent.action;
       // @ts-ignore: Block-scoped variable is used before declaration
      intent.callableIntent.unregister(registeredCallback);

      const registeredCallback = intent.callableIntent.register(action);
    });
    return null;
  }

  state = {};


  render() {
    return this.props.children;
  }
}
