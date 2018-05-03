import propTypes from 'prop-types';
import React from 'react';

import abstractCommandFactory from './speech-commands';
import { WSProviderSingleton } from '../connection-provider';

export default class SpeechBroker extends React.Component {
  static propTypes = {
    registrationList: propTypes.array.isRequired,
    wsBroker: propTypes.instanceOf(WSProviderSingleton).isRequired
  }

  static getDerivedStateFromProps(props) {
    props.registrationList.forEach(registration => {
      const action = registration.action;
      registration.callableIntent.unregister(registeredCallback);

      const registeredCallback = registration.callableIntent.register(action);
    });
    return null;
  }

  state = {};


  render() {
    return this.props.children;
  }
}
