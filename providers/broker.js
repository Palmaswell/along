import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

import { SpeechProvider, SpeechContext } from './speech/speech-provider';
import { WSProvider, WSContext } from './connection-provider';
import { abstractCommandFactory } from './speech/speech-commands';

import { safeParse } from '../utils/safe-parse';

export default class Broker extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
  };
  static getDerivedStateFromProps(props) {
    return {}
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <WSProvider
        channel={this.props.channel}>
        <SpeechProvider>
          <WSContext.Consumer>
            {broker => (
              <SpeechContext.Consumer>
                {speech => {
                   broker.ws.next({
                    action:'PUBLISH',
                    channels: ['Home'],
                    message: speech.result.transcript
                  })
                  broker.ws.subscribe(messageStream => {
                    console.log('subscribed message stream', messageStream.data)
                    abstractCommandFactory
                      .match(safeParse(messageStream.data).message)
                      .map(callbackableIntent => {
                        callbackableIntent.register(handleRouter);
                        callbackableIntent.execute(handleRouter, `/playlists/${this.props.spotify.id}`, this.props.spotify.id);
                        return callbackableIntent;
                      })
                    })

                  return this.props.children
                }}
              </SpeechContext.Consumer>
            )}
          </WSContext.Consumer>

        </SpeechProvider>
      </WSProvider>
    )
  }
}
