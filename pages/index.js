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

export default class Index extends React.Component {
  componentWillMount() {
    // abstractCommandFactory.register('playlist');
    // abstractCommandFactory.register('go to playlist');
    // abstractCommandFactory.register('show playlist');
    // abstractCommandFactory.register('show the playlist');
  }
  render() {
    return (
      <Providers
        channel="Home">
        <Consumers>
          {({speech, wsBroker}) => {
            // wsBroker.ws.subscribe(messageStream => {
            //   console.log('subscribed message stream', messageStream.data)
            //   abstractCommandFactory
            //     .match(safeParse(messageStream.data).message)
            //     .map(callbackableIntent => {
            //       callbackableIntent.register(handleRouter);
            //       callbackableIntent.execute(handleRouter, `/playlists/${this.props.spotify.id}`, this.props.spotify.id);
            //       return callbackableIntent;
            //     })
            // })
            // wsBroker.ws.next({
            //   action:'PUBLISH',
            //   channels: ['Home'],
            //   message: speech.result.transcript
            // })
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
                <button
                  name="navigate"
                  onClick={e => handleRouter( `/playlists/${this.props.spotify.id}`, this.props.spotify.id)}
                  type="button">
                  navigate !
                </button>

                <input onChange={e => wsBroker.ws.next({
                    action:'PUBLISH',
                    channels: ['Home'],
                    message: e.target.value
                  })}
                  type="text"/>
                  {`/playlists/${this.props.spotify.id}`}
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
