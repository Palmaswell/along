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

  state = { playState: false }

  pauseTrack = async () => {
    if (this.state.playState) {
      const res = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
        method: 'PUT',
        headers: new Headers({
          'Authorization': `Bearer ${getCookie('access')}`,
          'Content-Type': 'application/json',
        }),
      });
      const data = await res.json();
      this.updatePlayState();
    }
  }

  playTrack = async uri => {
    const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access')}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({'context_uri': `${uri}`})
    });
    const data = await res.json();
    this.setState({ playState: true })
  }

  resumeTrack = async () => {
    if (!this.state.playState) {
      const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: new Headers({
          'Authorization': `Bearer ${getCookie('access')}`,
          'Content-Type': 'application/json',
        }),
      });
      const data = await res.json();
      this.updatePlayState();
    }
  }

  updatePlayState = () => this.setState({ playState: !this.state.playState });

  render() {
    return (
      <main>
        <ActiveLink
          href={`/`}>
          Back
        </ActiveLink>
        {this.props.tracks.map(playlist => (
          <div key={playlist.track.id}>
            <a onClick={e => this.playTrack(playlist.track.album.uri)}>
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
    tracks: tracks.items || []
  }
}
