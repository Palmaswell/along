import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';
import Router from 'next/router';

export default class extends React.Component {
  static getInitialProps =  async ctx => {
    const { tokens } = ctx.req.cookies;
    const { host } = ctx.req.headers;
    if (tokens.access) {
      const res = await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'application/json',
        })
      });
      const data = await res.json();
      return {
        cookies: tokens,
        hostName: host.match(/(:1337)/) ? host.replace(/(:1337)/, '') : host,
        spotify: data
      }
    } else {
      return {
        cookies: tokens,
        hostName: host.match(/(:1337)/) ? host.replace(/(:1337)/, '') : host,
      }
    }
  }

  render() {
    return (
      <Providers
        channel="Home"
        hostName={this.props.hostName}>
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
                <h1>Hi {this.props.spotify.display_name}</h1>
                <Link as={`/user/${this.props.spotify.id}`} href={`/playlists?id=${this.props.spotify}`}>
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

