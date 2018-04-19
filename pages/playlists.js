import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { getCookie } from '../utils/cookies';

export default class PlayLists extends React.Component {
  static getInitialProps = async ctx => {
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

  render() {
    return (
      this.props.playlist.items.map(playlist => {
        // console.log(playlist, '🛬🛬🛬🛬🛬🛬')
        return (
          <div>
            <Link as={`/tracks/${this.props.id}/${playlist.id}`} href={`/tracks?id=${this.props.id}?playid=${playlist.id}`}>
              <a data-id={playlist.id}>
                <img src={playlist.images[0].url} alt={`${playlist.name} cover`} />
              </a>
            </Link>
            <div>{playlist.name}</div>
            <div>{playlist.tracks.total} tracks</div>
            <div>{playlist.tracks.total} tracks</div>
          </div>
        );
      })
    );
  }
}


