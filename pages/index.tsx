import * as React from 'react';
import Head from 'next/head';
import fetch, { Headers }  from 'node-fetch';

import { SpeechContext, SpeechProvider } from '../speech/provider';
// import { Language } from '../speech/languages';
import { WSContext, WSProvider } from '../websocket/provider';

import * as Component from '../components';
import ActiveLink from '../components/active-link';
import * as Utils from '../utils';
import * as Intent from '../intents';

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

  public state = {
    isOverlayOpen: false,
  }

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
    Intent.registerIntent(Intent.overlayIntent, this.handleOverlay);
  }

  private handleOverlay = (): void => {
    this.setState({...this.state, isOverlayOpen: !this.state.isOverlayOpen})
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
                  <Component.Nav type="primary">
                    <Component.TextOverlay
                      active={!this.state.isOverlayOpen}
                      onClick={() => this.handleOverlay()}
                      >
                      Language
                    </Component.TextOverlay>
                    <Component.Layout>
                      <ActiveLink
                        href={`/playlists/${this.props.spotify.id}`}>
                        Playlists
                      </ActiveLink>
                      <Component.Space size={[0, 0, 0, Component.size.xs]}>
                        <Component.Link
                          href={this.props.spotify.external_urls.spotify}
                          target="_blank">
                          <Component.Thumbnail
                            alt={`Spotify profile image from ${this.props.spotify.display_name}`}
                            caption={this.userName}
                            src={this.props.spotify.images[0].url}/>
                        </Component.Link>
                      </Component.Space>
                    </Component.Layout>
                  </Component.Nav>
                  <Component.Panel
                    isRecognizing={speech.result.isRecognizing}
                    transcript={speech.result.transcript} />
                  <Component.SpeechControl
                    isRecognizing={speech.result.isRecognizing}
                    handleClick={speech.start} />
                  <Component.Overlay isOpen={this.state.isOverlayOpen}>
                    <Component.SelectList>
                      <Component.SelectItem active={true}>English</Component.SelectItem>
                      <Component.SelectItem active={false}>Spanish</Component.SelectItem>
                      <Component.SelectItem active={false}>Japanese</Component.SelectItem>
                    </Component.SelectList>
                  </Component.Overlay>
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
