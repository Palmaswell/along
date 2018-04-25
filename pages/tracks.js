import ActiveLink from '../components/active-link';
import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { hydrate, injectGlobal } from 'react-emotion';
import { getCookie } from '../utils/cookies';
import { render } from 'react-dom';

export default class Tracks extends React.Component {

  componentDidMount() {
    const devices = this.getDevices();

    console.log(devices, 'this are the devices')
  }

  getDevices = async () => {
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

  render() {
    return (
      <main>
        <ActiveLink
          href={`/playlists/${this.props.userId}`}>
          Back
        </ActiveLink>
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
      </main>
    )
  }
}

Tracks.getInitialProps = async ctx => {
  const { play_id, user_id } = ctx.query;
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
    userId: user_id
  }
}
