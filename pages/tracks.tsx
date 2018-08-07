import * as React from 'react';
import fetch, { Headers }  from 'node-fetch';
import { TransitionGroup } from 'react-transition-group';

import { getCookie } from '../utils/cookies';
import { formatMilliseconds } from '../utils/readable-time';

import { SpeechContext, SpeechProvider } from '../providers/speech/provider';
import { WSContext, WSProvider } from '../providers/websocket/provider';
import SpeechBroker from '../providers/speech/broker';

import { createIntents } from '../intents/create-intents';
import { tracksIntent } from '../intents/intents';

import ActiveLink from '../components/active-link';
import { ArrowLeft } from '../components/icons';
import Copy from '../components/copy';
import colors from '../components/colors';
import List from '../components/list';
import GridContainer from '../components/grid-container';
import Media from '../components/media';
import GridItem from '../components/grid-item';
import CommandPanel from '../components/command-panel';
import SpeechControl from '../components/speech-controls';
import TransitionComponent from '../components/transition';
import Nav from '../components/nav';

export interface TracksProps {
  devices: any;
  tracks: any[];
  userId: number;
}

export default class Tracks extends React.Component<TracksProps> {
  public devices: string;
  public static async getInitialProps(ctx) {
    const { play_id } = ctx.query;
    const res = await fetch(`https://api.spotify.com/v1/users/${getCookie('user_id', ctx)}/playlists/${play_id}/tracks`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access', ctx)}`,
        'Content-Type': 'application/json',
      })
    });
    const tracks = await res.json();
    return {
      tracks: tracks.items || [],
      userId: getCookie('user_id', ctx)
    }
  }
  public state = {
    isTransitioning: false
  }

  componentDidMount() {
    this.setState({...this.state, isTransitioning: true });
  }

  componentWillUnmount() {
    this.setState({...this.state, isTransitioning: false });
  }

  fetchDevices = async () => {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      })
    });
    const devices = await res.json();
    return devices;
  }

  pauseTrack = async () => {
    const res = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
    });
    try {
      await res.json();
    } catch (err) {
      console.log(`
        > 💥 Spotify pause track: ${err}
      `)
    }
}

  playTrack = async uri => {
    const devices = this.devices ? `?device_id=${this.devices}` : '';
    const res = await fetch(`https://api.spotify.com/v1/me/player/play${devices}`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({'context_uri': `${uri}`})
    });
    try {
      await res.json();
    } catch (err) {
      console.log(`
        > 💥 Spotify play track: ${err}
      `)
    }
  }

  resumeTrack = async () => {
    const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
    });
    try {
      await res.json();
    } catch (err) {
      console.log(`
        > 💥 Spotify resume track: ${err}
      `)
    }
  }

  render() {
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
                      registrationList={createIntents(
                        tracksIntent,
                        this.props.tracks,
                        this.playTrack,
                        this.pauseTrack,
                        this.resumeTrack,
                        this.props.userId)}
                      wsBroker={wsBroker}>
                      <Nav secondary>
                        <ActiveLink
                        href={`/playlists/${this.props.userId}`}>
                          <ArrowLeft />
                        </ActiveLink>
                      </Nav>
                      <CommandPanel transcript={speech.result.transcript} />
                      <TransitionComponent
                          isTransitioning={this.state.isTransitioning}>
                        <List>
                          {this.props.tracks.map((playlist, i) => (
                            <GridContainer
                              handleClick={() => this.playTrack(playlist.track.album.uri)}
                              key={playlist.track.id}>
                              <GridItem align="center">
                                <Copy color={colors.unitedNationsBlue()} tag="div">{i + 1}</Copy>
                              </GridItem>
                              <GridItem>
                                <Media
                                  alt={`${playlist.track.album.name} track name`}
                                  src={playlist.track.album.images[0].url} />
                              </GridItem>
                              <GridItem>
                                <Copy tag="div" weight={'bold'}>{playlist.track.name}</Copy>
                                <Copy size="s" tag="div">
                                  {playlist.track.artists[0].name}
                                </Copy>
                              </GridItem>
                              <GridItem justify="end">
                                <Copy tag="div">{formatMilliseconds(playlist.track.duration_ms)}</Copy>
                                {playlist.track.explicit &&
                                  <Copy tag="div" size="s">{playlist.track.explicit}</Copy>
                                }
                              </GridItem>

                              {/* <button onClick={this.pauseTrack}>pause</button>
                              <button onClick={this.resumeTrack}>resume</button> */}

                            </GridContainer>
                          ))}
                        </List>
                      </TransitionComponent>
                      <SpeechControl handleClick={speech.start} />
                  </SpeechBroker>
                  )}
                </SpeechContext.Consumer>
              </SpeechProvider>
            )}
          </WSContext.Consumer>
          </WSProvider>
        </TransitionGroup>
      </main>
    )
  }
}