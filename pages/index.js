import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';
import Router from 'next/router';

export default class Home extends React.Component {
  static getInitialProps =  async ctx => {
    const { host } = ctx.req.headers;
    const { tokens } = ctx.req.cookies;
    const res = await fetch(`https://api.spotify.com/v1/me`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${tokens.access}`,
        'Content-Type': 'application/json',
      })
    });
    const data = await res.json();
    console.log(data, '&*&**&')

    if (!host.match(/(:1337)/)) {
      return {
        cookies: tokens,
        spotify: data
      };
    }
    return {
      cookies: tokens,
      hostName: host.replace(/(:1337)/, ''),
      spotify: data
    }
  }
  render() {
    return (
      <Providers
        channel="Home"
        hostName={this.props.hostName}>
        <Consumers>
          {({speech, broker}) => {
            console.log(speech, broker);
            // if (speech.stream) {
            //   // speech.stream.subscribe(result => {
            //   //   console.log(result[0][0], 'final________');
            //   //   broker.send(result[0][0].transcript)
            //   // })
            //   console.log(speech.stream, 'final________');
            // }
            return (
              <div>
                <h1>Hi {this.props.spotify.display_name}</h1>
                <Link prefetch as={`/user/${this.props.spotify.id}`} href={`/playlists?id=${this.props.spotify}`}>
                  <a>Dummy link make it readable</a>
                </Link>
                {/* <div>COOKIES {JSON.stringify(this.props.cookies)}</div> */}
                <button
                  name="Start Speech"
                  onClick={speech.start}
                  type="button">
                  Talk !
                </button>
                <input onChange={e => broker.send(e.target.value)} type="text" />
                <ul>
                  {broker.messages.map((message, i) => {
                    return (
                      <li key={i}>
                        This is the message {message.channel}: {message.message}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          }}
        </Consumers>
      </Providers>
    );
  }
}

