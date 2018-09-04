import * as React from 'react';
import fetch, { Headers }  from 'node-fetch';
import { TransitionGroup } from 'react-transition-group';

import { getCookie } from '../utils/cookies';

import { SpeechContext, SpeechProvider } from '../providers/speech/provider';
import { WSContext, WSProvider } from '../providers/websocket/provider';
import SpeechBroker from '../providers/speech/broker';

import { registerIntent } from '../intents/register';
import { playlistsIntent } from '../intents/intents';

import { ArrowLeft } from '../components/icons';
import ActiveLink from '../components/active-link';
import Copy from '../components/copy';
import CommandPanel from '../components/command-panel';
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
        'Authorization': `Bearer ${getCookie('access', ctx)}`,
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
                    <SpeechBroker
                      registrationList={registerIntent(playlistsIntent, this.props.playlist.items)}
                      wsBroker={wsBroker}>
                      <Nav secondary>
                        <ActiveLink href={`/`}><ArrowLeft /></ActiveLink>
                      </Nav>
                      <CommandPanel transcript={speech.result.transcript} />

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
                                  <Copy tag="div" size="s">
                                    {playlist.tracks.total} tracks
                                  </Copy>
                                </ActiveLink>
                              </ListItem>
                            ))}
                        </List>
                      </TransitionComponent>

                      <SpeechControl isRecognizing={false} handleClick={speech.start} />
                    </SpeechBroker>
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

