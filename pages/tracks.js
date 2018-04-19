import Cookie from 'js-cookie';
import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { hydrate, injectGlobal } from 'react-emotion';
import { getCookie } from '../utils/cookies';
import { render } from 'react-dom';


export default class Tracks extends React.Component {
  static getInitialProps = async ctx => {
    const { playid } = ctx.query;
    const res = await fetch(`https://api.spotify.com/v1/users/${getCookie('user_id', ctx)}/playlists/${playid}/tracks`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access', ctx)}`,
        'Content-Type': 'application/json',
      })
    });
    const tracks = await res.json();
    console.log('444444444', tracks)
    return {
      tracks: tracks ? tracks :  []
    }
  }

  render() {
    console.log('this props tracks', this.props.tracks)
    return (
      this.props.tracks.items.map((playlist, i) => (
        <div key={i}>
          <img src={playlist.track.album.images[0].url} alt={`${playlist.track.album.name} track name`} />
          <div>{playlist.added_at}</div>
          <div>{playlist.track.name}</div>
          <div>{playlist.track.duration_ms}</div>
          <div>{playlist.track.explicit}</div>
        </div>
      ))
    )
  }
}


