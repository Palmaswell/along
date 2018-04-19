import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';
import { getCookie } from '../utils/cookies';

export default class Tracks extends React.Component {
  static getInitialProps = async ctx => {
    const { id, playListId } = ctx.query;
    const res = await fetch(`https://api.spotify.com/v1/users/${id}/playlists/${playListId}/tracks`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${getCookie('access', ctx)}`,
        'Content-Type': 'application/json',
      })
    });
    const data = await res.json();
    console.log(data, '_______')
    return {
      playlists: data
    }
  }

  render() {
    return (
      <div>
      Hallo WOrld
      </div>
    );
  }
}


