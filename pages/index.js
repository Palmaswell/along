import React from 'react';
import Router from 'next/router';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';

import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { getCookie } from '../utils/cookies';
import { safeParse } from '../utils/safe-parse';
import { handleRouter } from '../utils/handle-router';

import ActiveLink from '../components/active-link';
import Consumers from '../components/consumers';
import Providers from '../components/providers';
import SpeechBroker from '../components/speech-broker';
import { runInThisContext } from 'vm';

export default class Index extends React.Component {
  state = { handle: 'unknown'};

  render() {
    return (
      <Providers
        channel="Home"
        id={this.props.spotify.id}>
        <Consumers>
          {({speech, broker}) => {
            console.log(speech.result, 'this is speech in index')
            return (
              <SpeechBroker
                speech={speech}
                broker={broker}
                id={this.props.spotify.id}
                >
                <h1>Hi {this.props.spotify.display_name} 👋</h1>
                <h2>{this.state.handle}</h2>
                <ActiveLink
                  href={`/playlists/${this.props.spotify.id}`}>
                  Playlists
                </ActiveLink>
                <button
                  name="Start Speech"
                  onClick={speech.start}
                  type="button">
                  Talk ! ${speech.recognizing}
                </button>
                <button
                  name="unregister"
                  onClick={() => abstractCommandFactory.unregister()}
                  type="button">
                  unregister !
                </button>
                <div>
                  <input onChange={e => broker.ws.next({
                      action:'PUBLISH',
                      channels: ['Home'],
                      message: e.target.value,
                      id: 'random'
                    })}
                    type="text"/>
                </div>
              </SpeechBroker>
            )
          }}
        </Consumers>
      </Providers>
    );
  }
}

Index.getInitialProps =  async ctx => {
  const res = await fetch(`https://api.spotify.com/v1/me`, {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${getCookie('access', ctx)}`,
      'Content-Type': 'application/json',
    })
  });
  const data = await res.json();
  return {
    spotify: data ? data : null
  }
}
