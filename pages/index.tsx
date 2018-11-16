import * as React from 'react';
import Head from 'next/head';
import fetch, { Headers }  from 'node-fetch';

import { SpeechContext, SpeechProvider } from '../speech/provider';
import { WSContext, WSProvider } from '../websocket/provider';

import * as Utils from '../utils';
import * as Intent from '../intents';

import ActiveLink from '../components/active-link';
import Link from '../components/link';
import Thumbnail from '../components/thumbnail';
import Panel from '../components/panel';
import SpeechControl from '../components/speech-controls';
import Space from '../components/space';
import Nav from '../components/nav';
import { size } from '../components/sizes';

export interface IndexProps {
  userName: string;
  spotify: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    id: string;
    images: [
      {
        url: string;
      }
    ]
  }
}

export default class Index extends React.Component<IndexProps> {
  private userName = this.props.spotify.display_name.replace(/\s(.*)/g, '');

  public static async getInitialProps(ctx): Promise<any> {
    const res = await fetch(`https://api.spotify.com/v1/me`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${Utils.getCookie('access', ctx)}`,
        'Content-Type': 'application/json',
      })
    });
    const data = await res.json();
    return {
      spotify: data ? data : null
    }
  }

  public componentDidMount(): void {
    if (this.props.spotify.id) {
      Intent.registerIntent(Intent.navigateIntent, this.props.spotify.id);
    }
  }

  render() {
    return (
    <WSProvider
      channel="Home">
      <WSContext.Consumer>
        {wsBroker => (
          <SpeechProvider
            channel="Home"
            wsBroker={wsBroker}>
            <SpeechContext.Consumer>
              {speech => (
                <>
                  <Head>
                    <title>Along - Accessibility and The Web Speech API</title>
                    <meta name="description" content="React universal app using the Web Speech API with accessibility as a baseline" />
                  </Head>
                  <Nav type="primary">
                    <ActiveLink
                      href={`/playlists/${this.props.spotify.id}`}>
                      Playlists
                    </ActiveLink>
                    <Space size={[0, 0, 0, size.xs]}>
                      <Link
                        href={this.props.spotify.external_urls.spotify}
                        target="_blank">
                        <Thumbnail
                          alt={`Spotify profile image from ${this.props.spotify.display_name}`}
                          caption={this.userName}
                          src={this.props.spotify.images[0].url}/>
                      </Link>
                    </Space>
                  </Nav>
                  <Panel
                    isRecognizing={speech.result.isRecognizing}
                    transcript={speech.result.transcript} />
                  <SpeechControl
                    isRecognizing={speech.result.isRecognizing}
                    handleClick={speech.start} />
                </>
              )}
            </SpeechContext.Consumer>
          </SpeechProvider>
        )}
      </WSContext.Consumer>
    </WSProvider>
    );
  }
}
