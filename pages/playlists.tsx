import * as React from 'react';
import Head from 'next/head';
import fetch, { Headers }  from 'node-fetch';
import { TransitionGroup } from 'react-transition-group';
import { SpeechContext, SpeechProvider } from '../speech/provider';
import { WSContext, WSProvider } from '../websocket/provider';

import * as Utils from '../utils';
import * as Intent from '../intents';

import { ArrowLeft } from '../components/icons';
import ActiveLink from '../components/active-link';
import Copy, { CopySize } from '../components/copy';
import Panel from '../components/panel';
import List from '../components/list';
import ListItem from '../components/list-item';
import Media from '../components/media';
import Nav from '../components/nav';
import SpeechControl from '../components/speech-controls';
import Space from '../components/space';
import TransitionComponent from '../components/transition';
import { size } from '../components/sizes';

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
    isTransitioning: false
  }

  public componentDidMount(): void {
    this.setState({...this.state, isTransitioning: true });
    Intent.registerIntent(Intent.playlistsIntent, this.props.playlist.items);
  }

  public componentWillUnmount(): void {
    this.setState({...this.state, isTransitioning: false });
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
                      <Nav type="secondary">
                        <ActiveLink href={`/`}><ArrowLeft /></ActiveLink>
                      </Nav>
                      <Panel
                        isRecognizing={speech.result.isRecognizing}
                        transcript={speech.result.transcript} />

                      <TransitionComponent
                          isTransitioning={this.state.isTransitioning}>
                        <List flex>
                            {this.props.playlist.items.map((playlist, i) => (
                              <ListItem key={playlist.id} flex>
                                <ActiveLink
                                  href={`/tracks/${playlist.id}`}
                                  index={i}
                                  key={playlist.id}>
                                  <Media
                                    alt={`Playlist: ${playlist.name} cover`}
                                    src={playlist.images[0].url}
                                    large />
                                  <Space size={[size.xxxs, 0, 0]}>
                                    <Copy tag="div">{playlist.name}</Copy>
                                  </Space>
                                  <Copy tag="div" size={CopySize.S}>
                                    {playlist.tracks.total} tracks
                                  </Copy>
                                </ActiveLink>
                              </ListItem>
                            ))}
                        </List>
                      </TransitionComponent>

                      <SpeechControl
                        isRecognizing={speech.result.isRecognizing}
                        handleClick={speech.start}/>
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

