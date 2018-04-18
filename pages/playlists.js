import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';

export default class PlayLists extends React.Component {
  static getInitialProps = async ctx => {
    const { id } = ctx.query;
    const { host } =  ctx.req.headers;
    const { tokens } =  ctx.req.cookies;
    const res = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${tokens.access}`,
        'Content-Type': 'application/json',
      })
    });
    const data = await res.json();
    if (!host.match(/(:1337)/)) {
      return {
        playlists: data
      };
    };
    return {
      hostName: host.replace(/(:1337)/, ''),
      id: id,
      playlists: data
    }
  }

  render() {
    return (
      this.props.playlists.items.map(playlist => {
        // console.log(playlist, '🛬🛬🛬🛬🛬🛬')
        return (
          <div>
            <Link as={`/playlist/${this.props.id}/${playlist.id}`} href={`/playlist?id=${this.props.id}?playid=${playlist.id}`}>
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


