import * as React from 'react';
import Head from 'next/head';
import fetch, { Headers }  from 'node-fetch';
import { TransitionGroup } from 'react-transition-group';

import { SpeechContext, SpeechProvider } from '../speech/provider';
import { WSContext, WSProvider } from '../websocket/provider';

import * as Utils from '../utils';
import * as Intent from '../intents';

import * as Component from '../components';
import ActiveLink from '../components/active-link';

export interface TracksProps {
  devices: any;
  tracks: any[];
  userId: number;
}

export default class Tracks extends React.Component<TracksProps> {
  public devices: string;
  public static async getInitialProps(ctx) {
    const { play_id } = ctx.query;
    const res = await fetch(`https://api.spotify.com/v1/users/${Utils.getCookie('user_id', ctx)}/playlists/${play_id}/tracks`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${Utils.getCookie('access', ctx)}`,
        'Content-Type': 'application/json',
      })
    });
    const tracks = await res.json();
    return {
      tracks: tracks.items || [],
      userId: Utils.getCookie('user_id', ctx)
    }
  }

  public state = {
    isTransitioning: false
  }

  componentDidMount() {
    Intent.registerIntent(
      Intent.tracksIntent,
      this.props.tracks,
      this.playTrack,
      this.pauseTrack,
      this.resumeTrack,
      this.props.userId
    );
    this.setState({...this.state, isTransitioning: true });
  }

  componentWillUnmount() {
    this.setState({...this.state, isTransitioning: false });
  }

  fetchDevices = async () => {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${Utils.getCookie('access')}`,
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
        'Authorization': `Bearer ${Utils.getCookie('access')}`,
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
        'Authorization': `Bearer ${Utils.getCookie('access')}`,
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
        'Authorization': `Bearer ${Utils.getCookie('access')}`,
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
                    <>
                      <Head>
                        <title>Along - Some awesome tracks from my playlist</title>
                        <meta name="description" content="Use this web app voice interface to play, pause and resume any song" />
                      </Head>
                      <Component.Nav type="secondary">
                        <ActiveLink
                        href={`/playlists/${this.props.userId}`}>
                          <Component.ArrowLeft />
                        </ActiveLink>
                      </Component.Nav>
                      <Component.Panel
                        isRecognizing={speech.result.isRecognizing}
                        transcript={speech.result.transcript} />
                      <Component.TransitionComponent
                          isTransitioning={this.state.isTransitioning}>
                        <Component.List>
                          {this.props.tracks.map((playlist, i) => (
                            <Component.GridContainer
                              handleClick={() => this.playTrack(playlist.track.album.uri)}
                              key={playlist.track.id}>
                              <Component.GridItem align="center">
                                <Component.Copy color={Component.Color.UnitedNationsBlue()} tag="div">{i + 1}</Component.Copy>
                              </Component.GridItem>
                              <Component.GridItem>
                                <Component.Media
                                  alt={`${playlist.track.album.name} track name`}
                                  src={playlist.track.album.images[0].url} />
                              </Component.GridItem>
                              <Component.GridItem>
                                <Component.Copy tag="div" weight={'bold'}>{playlist.track.name}</Component.Copy>
                                <Component.Copy size={Component.CopySize.S} tag="div">
                                  {playlist.track.artists[0].name}
                                </Component.Copy>
                              </Component.GridItem>
                              <Component.GridItem justify="end">
                                <Component.Copy tag="div">{Utils.formatMilliseconds(playlist.track.duration_ms)}</Component.Copy>
                                {playlist.track.explicit &&
                                  <Component.Copy tag="div" size={Component.CopySize.S}>{playlist.track.explicit}</Component.Copy>
                                }
                              </Component.GridItem>

                            </Component.GridContainer>
                          ))}
                        </Component.List>
                      </Component.TransitionComponent>
                      <Component.SpeechControl
                        isRecognizing={speech.result.isRecognizing}
                        handleClick={speech.start} />
                  </>
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
