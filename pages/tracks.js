import fetch, { Headers }  from 'node-fetch';
import Link from 'next/link';
import { hydrate, injectGlobal } from 'react-emotion';

import { getCookie } from '../utils/cookies';
import { handleRouter } from '../utils/handle-router';

import { abstractCommandFactory } from '../providers/speech/speech-commands';
import {
  SpeechContext,
  SpeechProvider
} from '../providers/speech/speech-provider';
import { WSContext, WSProvider } from '../providers/connection-provider';
import SpeechBroker from '../providers/speech/speech-broker';

import ActiveLink from '../components/active-link';

import Cookie from 'js-cookie';

export default class Tracks extends React.Component {
  componentDidMount() {
    this.fetchDevices();
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
    console.log(devices, 'this are the devices')
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
    const data = await res.json();
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
    const data = await res.json();
  }


  resumeTrack = async () => {
    const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
    });
    const data = await res.json();
  }

  registerCommands = () => {
    const registrations = this.props.tracks.map(playlist => {
      return {
        callableIntent: abstractCommandFactory.register(`play ${playlist.track.name}`),
        action: props => this.playTrack(playlist.track.album.uri)
      };
    });

    registrations.push({
      callableIntent: abstractCommandFactory.register('pause'),
      action: props => this.pauseTrack()
    });
    registrations.push({
      callableIntent: abstractCommandFactory.register('stop'),
      action: props => this.pauseTrack()
    });
    registrations.push({
      callableIntent: abstractCommandFactory.register('continue'),
      action: props => this.resumeTrack()
    });
    registrations.push({
      callableIntent: abstractCommandFactory.register('go back to playlist'),
      action: props => handleRouter(`/playlists/${this.props.userId}`, this.props.userId)
    });
    registrations.push({
      callableIntent: abstractCommandFactory.register('go back'),
      action: props => handleRouter(`/playlists/${this.props.userId}`, this.props.userId)
    });

    return registrations;
  }

  render() {
    // console.log('what is going on', this.props)
    return (
      <main>
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
                    registrationList={this.registerCommands()}
                    wsBroker={wsBroker}>
                    <ActiveLink
                    href={`/playlists/${this.props.userId}`}>
                    Back
                    </ActiveLink>
                    <button
                      name="Start Speech"
                      onClick={speech.start}
                      type="button">
                      Talk !
                    </button>
                    {this.props.tracks.map(playlist => (
                      <div key={playlist.track.id}>
                        <a onClick={() => this.playTrack(playlist.track.album.uri)}>
                        <img src={playlist.track.album.images[0].url} alt={`${playlist.track.album.name} track name`} />
                        <div>{playlist.added_at}</div>
                        <div>{playlist.track.name}</div>
                        <div>{playlist.track.duration_ms}</div>
                        <div>{playlist.track.explicit}</div>
                        </a>
                        <button onClick={this.pauseTrack}>pause</button>
                        <button onClick={this.resumeTrack}>resume</button>
                      </div>
                    ))}
                  </SpeechBroker>
                )}
              </SpeechContext.Consumer>
            </SpeechProvider>
          )}
        </WSContext.Consumer>
        </WSProvider>
      </main>
    )
  }
}

Tracks.getInitialProps = async ctx => {
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
