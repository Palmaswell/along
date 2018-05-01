import propTypes from 'prop-types';
import React from 'react';

import abstractCommandFactory from './speech-commands';

export default class SpeechBroker extends React.Component {
  static propTypes = {
    registrationList: propTypes.array.isRequired,
    arguments: propTypes.object
  }

  static getDerivedStateFromProps(props) {
    props.registrationList.forEach(registration => {
      const action = registration.action;
      registration.callableIntent.unregister(registeredCallback);

      const registeredCallback = registration.callableIntent.register(action);
    });
    // console.log('speech broker props', props)
    return null;
  }

  state = {};


  render() {
    return this.props.children;
  }
}
