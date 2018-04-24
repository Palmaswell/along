import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import Router from 'next/router';
import { getCookie } from '../utils/cookies';

export default class extends React.Component {
  static getInitialProps =  async ctx => {
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

  render() {
    return (
      <Providers
        channel="Home">
        <Consumers>
          {({speech, broker}) => {
            broker.ws.subscribe(foo => console.log(foo, '^^^^^'))
            broker.ws.next({
              action:'PUBLISH',
              channels: ['Home'],
              message: speech.result.transcript
            })
            return (
              <div>
                <h1>Hi {"this.props.spotify.display_name"}</h1>
                <Link as={`/playlists/${this.props.spotify.id}`} href={`/playlists?id=${this.props.spotify.id}`}>
                  <a>Go to playlists</a>
                </Link>
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

