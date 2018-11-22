import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import fetch, { Headers }  from 'node-fetch';
import Cookie from 'js-cookie';

import { SpeechContext, SpeechProvider } from '../speech/provider';
import { WSContext, WSProvider } from '../websocket/provider';

import * as Store from '../store';

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
  };
  store: Store.StoreProps;
}

@inject('store')
@observer
export default class Index extends React.Component<IndexProps> {
  public state = {
    isOverlayOpen: false,
    lang: this.props.store.lang
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
    Intent.registerIntent(Intent.langIntent, this.handleLanguage);
  }

  private handleOverlay = (): void => {
    this.setState({...this.state, isOverlayOpen: !this.state.isOverlayOpen});
  }

  private handleLanguage = (speech, language): void => {
    const { store } = this.props;
    speech.setLanguage(Store.Language[language]);
    Cookie.set('lang', store.lang);
    store.getTranslatedLabels();
  }

  public render(): JSX.Element {
    const { store } = this.props;
    store.getLanguage();
    return (
    <WSProvider
      channel="Home">
      <WSContext.Consumer>
        {wsBroker => (
          <SpeechProvider
            channel="Home"
            wsBroker={wsBroker}>
            <SpeechContext.Consumer>
              {speech => {
                return (
                <>
                  <Head>
                    <title>Along - Accessibility and The Web Speech API</title>
                    <meta name="description" content="React universal app using the Web Speech API with accessibility as a baseline" />
                  </Head>
                  <Component.Nav type="primary">
                    <Component.Layout>
                        <Component.Link
                          href={this.props.spotify.external_urls.spotify}
                          target="_blank">
                          <Component.Thumbnail
                            alt={`Spotify profile image from ${this.props.spotify.display_name}`}
                            src={this.props.spotify.images[0].url}/>
                        </Component.Link>
                        <ActiveLink
                          href={`/playlists/${this.props.spotify.id}`}>
                          Playlists
                        </ActiveLink>
                    </Component.Layout>
                    <Component.TextOverlay
                      active={!this.state.isOverlayOpen}
                      onClick={() => this.handleOverlay()}
                      >
                      Language
                    </Component.TextOverlay>
                  </Component.Nav>
                  <Component.Panel
                    isRecognizing={speech.result.isRecognizing}
                    transcript={speech.result.transcript} />
                  <Component.SpeechControl
                    isRecognizing={speech.result.isRecognizing}
                    handleClick={speech.start} />
                  <Component.Overlay isOpen={this.state.isOverlayOpen}>
                    <Component.SelectList>
                      {store.languages.map((language: Store.Language, i: number) => (
                        <Component.SelectItem
                          active={store.getLanguage() === Store.Language[language]}
                          key={`${language}-${i}`}
                          onClick={() => this.handleLanguage(speech, language)}>
                          { store.intLabels[i] }
                        </Component.SelectItem>
                      ))}
                    </Component.SelectList>
                  </Component.Overlay>
                </>
                )
              }}
            </SpeechContext.Consumer>
          </SpeechProvider>
        )}
      </WSContext.Consumer>
    </WSProvider>
    );
  }
}
