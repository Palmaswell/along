import React from 'react';

import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { handleRouter } from '../utils/handle-router';

export default class SpeechBroker extends React.Component {
  state = {};
  static getDerivedStateFromProps(props) {
    console.log(props.speech.result, '_______')
    props.broker.ws.next({
      action:'PUBLISH',
      channels: ['Hamster'],
      message: props.speech.result.transcript
    });

    const registrationList = [];
    registrationList.push({
      callableIntent: abstractCommandFactory.register('go to playlist'),
      action: props => handleRouter(`/playlists/${props.id}`, props.id)
    });
    registrationList.push({
      callableIntent: abstractCommandFactory.register('show playlist'),
      action: props =>  handleRouter(`/playlists/${props.id}`, props.id)
    });

    registrationList.forEach(registration => {
      registration.callableIntent.unregister(registeredCallback)
      const registeredCallback = registration.callableIntent.register(registration.action);
    })

    return {};
  }

  render () {
    return this.props.children;
  }
}
