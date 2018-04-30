import ActiveLink from '../components/active-link';
import Consumers from '../components/consumers';
import Providers from '../components/providers';
import React from 'react';
import Router from 'next/router';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import { getCookie } from '../utils/cookies';
import { abstractCommandFactory } from '../providers/speech/speech-commands';
import { safeParse } from '../utils/safe-parse';

export default class Index extends React.Component {
  componentWillMount() {
    abstractCommandFactory.register('playlist');
    abstractCommandFactory.register('go to playlist');
    abstractCommandFactory.register('show playlist');
    abstractCommandFactory.register('show the playlist');
  }
  render() {
    return (
      <Providers
        channel="Home">
        <Consumers>
          {({speech, broker}) => {
            broker.ws.subscribe(messageStream => {
              console.log('subscribed message stream', messageStream.data)
              abstractCommandFactory
                .match(safeParse(messageStream.data).message)
                .map(callbackableIntent => {
                  console.log('1234 map index intent', callbackableIntent)
                });
            })
            broker.ws.next({
              action:'PUBLISH',
              channels: ['Home'],
              message: speech.result.transcript
            })
            return (
              <div>
                <h1>Hi {this.props.spotify.display_name} 👋</h1>
                <ActiveLink
                  href={`/playlists/${this.props.spotify.id}`}>
                  Playlists
                </ActiveLink>
                <button
                  name="Start Speech"
                  onClick={speech.start}
                  type="button">
                  Talk !
                </button>
                <input onChange={e => broker.ws.next({
                    action:'PUBLISH',
                    channels: ['Home'],
                    message: e.target.value
                  })}
                  type="text"/>
              </div>
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
