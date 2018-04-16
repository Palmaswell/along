import Consumers from '../components/consumers';
import fetch, { Headers }  from 'node-fetch';
import { hydrate, injectGlobal } from 'react-emotion';
import Link from 'next/link';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';

export default class PlayLists extends React.Component {
  static async getInitialProps(req) {
    // const headers = new Headers({
    //   'Authorization': `Bearer ${req.cookies.sp_token}`,
    //   'Content-Type': 'application/json',
    // });
    // const res = await fetch(`https://api.spotify.com/v1/me`, {
    //   method: 'GET',
    //   headers: headers
    // });
    // const data = await res.json();
    const { id } = req.query;
    console.log(req, '_______')
    return {};
  }
  render() {
    return (
      <h1>Hi</h1>
    );
  }
}
