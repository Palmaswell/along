import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';

export default class PlayLists extends React.Component {
  static getInitialProps = async context => {
    const { id } = context.query;
    const { host } =  context.req.headers;
    const { tokens } =  context.req.cookies;
    const res = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${tokens.access}`,
        'Content-Type': 'application/json',
      })
    });
    const data = await res.json();
    // console.log(data, '_______')
    if (!host.match(/(:1337)/)) {
      return {
        playlists: data
      };
    };
    return {
      hostName: host.replace(/(:1337)/, ''),
      playlists: data
    }
  }

  render() {
    return (
      this.props.playlists.items.map(playlist => {
        console.log(playlist, '🛬🛬🛬🛬🛬🛬')
        return (
          <div>
            <a
              href={playlist.external_urls.spotify}
              target="_blank">
              <img src={playlist.images[0].url} alt={`${playlist.name} cover`} />
            </a>
            <div>{playlist.name}</div>
            <div>{playlist.tracks.total} tracks</div>
            <div>{playlist.tracks.total} tracks</div>
          </div>
        );
      })
    );
  }
}


