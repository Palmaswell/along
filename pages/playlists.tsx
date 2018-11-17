import * as React from 'react';
import Head from 'next/head';
import fetch, { Headers }  from 'node-fetch';
import { TransitionGroup } from 'react-transition-group';
import { SpeechContext, SpeechProvider } from '../speech/provider';
import { WSContext, WSProvider } from '../websocket/provider';

import * as Component from '../components';
import ActiveLink from '../components/active-link';
import * as Utils from '../utils';
import * as Intent from '../intents';

export interface PlayListsProps {
  playlist: {
    items: any[]
  };
}

export default class PlayLists extends React.Component<PlayListsProps> {
  public static async getInitialProps(ctx) {
    const { id } = ctx.query;
    const res = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${Utils.getCookie('access', ctx)}`,
        'Content-Type': 'application/json',
      })
    });
    const data = await res.json();
    return {
      id: id,
      playlist: data
    }
  }

  public state = {
    isTransitioning: false,
    isOverlayOpen: false,
  }

  public componentDidMount(): void {
    this.setState({...this.state, isTransitioning: true });
    Intent.registerIntent(Intent.playlistsIntent, this.props.playlist.items);
    Intent.registerIntent(Intent.overlayIntent, this.handleOverlay);
  }

  public componentWillUnmount(): void {
    this.setState({...this.state, isTransitioning: false });
  }

  private handleOverlay = (): void => {
    this.setState({...this.state, isOverlayOpen: !this.state.isOverlayOpen})
  }

  public render(): JSX.Element {
    return (
      <main>
        <TransitionGroup
          component={null}>
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
                        <title>Along - My Spotify playlists</title>
                        <meta name="description" content="Use this web app voice interface to visit a playlist" />
                      </Head>
                      <Component.Nav type="secondary">
                        <Component.TextOverlay
                          active={!this.state.isOverlayOpen}
                          onClick={() => this.handleOverlay()}>
                          Language
                        </Component.TextOverlay>
                        <ActiveLink href={`/`}><Component.ArrowLeft /></ActiveLink>
                      </Component.Nav>
                      <Component.Panel
                        isRecognizing={speech.result.isRecognizing}
                        transcript={speech.result.transcript} />

                      <Component.TransitionComponent
                          isTransitioning={this.state.isTransitioning}>
                        <Component.List flex>
                            {this.props.playlist.items.map((playlist, i) => (
                              <Component.ListItem key={playlist.id} flex>
                                <ActiveLink
                                  href={`/tracks/${playlist.id}`}
                                  index={i}
                                  key={playlist.id}>
                                  <Component.Media
                                    alt={`Playlist: ${playlist.name} cover`}
                                    src={playlist.images[0].url}
                                    large />
                                  <Component.Space size={[Component.size.xxxs, 0, 0]}>
                                    <Component.Copy tag="div">{playlist.name}</Component.Copy>
                                  </Component.Space>
                                  <Component.Copy tag="div" size={Component.CopySize.S}>
                                    {playlist.tracks.total} tracks
                                  </Component.Copy>
                                </ActiveLink>
                              </Component.ListItem>
                            ))}
                        </Component.List>
                      </Component.TransitionComponent>

                      <Component.SpeechControl
                        isRecognizing={speech.result.isRecognizing}
                        handleClick={speech.start}/>
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
        </TransitionGroup>
      </main>
    );
  }
}

