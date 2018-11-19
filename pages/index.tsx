import * as React from 'react';
import {inject, observer} from 'mobx-react';
import Head from 'next/head';
import fetch, { Headers }  from 'node-fetch';

import { SpeechContext, SpeechProvider } from '../speech/provider';
import { Language, languages, setLanguage } from '../speech/languages';
import { WSContext, WSProvider } from '../websocket/provider';

// import * as Store from '../store';

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

@inject('store')
@observer
export default class Index extends React.Component<IndexProps> {
  private userName = this.props.spotify.display_name.replace(/\s(.*)/g, '');
  private lang: Language;

  public state = {
    isOverlayOpen: false,
    lang: Language.english
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
    console.log(this.props.store.langStore, '*******fdff***');
  }

  private handleOverlay = (): void => {
    this.setState({...this.state, isOverlayOpen: !this.state.isOverlayOpen})
  }

  private handleLanguage = (lang): void => {
    this.setState({...this.state, lang: setLanguage(lang)})
  }

  render() {
    const { langStore } = this.props.store;
    return (
    <WSProvider
      channel="Home">
      <WSContext.Consumer>
        {wsBroker => (
          <SpeechProvider
            channel="Home"
            lang={this.lang}
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
                      {langStore.availableLang.map((language: Language, i: number) => (
                        <Component.SelectItem
                          active={this.state.lang === Language[language]}
                          key={`${language}-${i}`}
                          onClick={() => this.handleLanguage(Language[language])}>
                          { language }
                        </Component.SelectItem>
                      ))}
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
