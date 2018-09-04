import * as React from 'react';
import fetch, { Headers }  from 'node-fetch';

import { getCookie } from '../utils/cookies';

import { SpeechContext, SpeechProvider } from '../providers/speech/provider';
import { WSContext, WSProvider } from '../providers/websocket/provider';
import SpeechBroker from '../providers/speech/broker';

import { registerIntent } from '../intents/register';
import { navigateIntent } from '../intents/intents';

import ActiveLink from '../components/active-link';
import Link from '../components/link';
import Thumbnail from '../components/thumbnail';
import CommandPanel from '../components/command-panel';
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

interface SpotifyProps {
  spotify: any;
}

export default class Index extends React.Component<IndexProps, {}> {
  private userName = this.props.spotify.display_name.replace(/\s(.*)/g, '');

  public static async getInitialProps(ctx): Promise<SpotifyProps> {
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
    <WSProvider
      channel="Home">
      <WSContext.Consumer>
        {wsBroker => (
          <SpeechProvider
            channel="Home"
            wsBroker={wsBroker}>
            <SpeechContext.Consumer>
              {speech => (
                <SpeechBroker
                  registrationList={registerIntent(navigateIntent, this.props.spotify.id)}
                  wsBroker={wsBroker}>
                  <Nav secondary={false}>
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
                  <CommandPanel
                    isRecognizing={speech.result.isRecognizing}
                    transcript={speech.result.transcript} />
                  <SpeechControl
                    isRecognizing={speech.result.isRecognizing}
                    handleClick={speech.start} />
              </SpeechBroker>
              )}
            </SpeechContext.Consumer>
          </SpeechProvider>
        )}
      </WSContext.Consumer>
    </WSProvider>
    );
  }
}
