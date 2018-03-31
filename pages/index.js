import React from 'react';
import { hydrate, injectGlobal } from 'react-emotion';
import Router from 'next/router';
import { MessagesContext, MessagesProvider } from '../components/connection-provider';

// Adds server generated styles to emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined') {
  hydrate(window.__NEXT_DATA__.ids)
}

injectGlobal`
  html, body {
    padding: 3rem 1rem;
    margin: 0;
    background: papayawhip;
    min-height: 100%;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 24px;
  }
`

export default class extends React.Component {
  static getInitialProps({ req }) {
    if (!req.headers.host.match(/(:1337)/)) {
      return {};
    }
    return {
      hostName: req.headers.host.replace(/(:1337)/, '')
    }
  }


  render() {
    return (
      <MessagesProvider
        channel="Hamster"
        hostName={this.props.hostName}>
        <MessagesContext.Consumer>
          Hi
        </MessagesContext.Consumer>
      </MessagesProvider>
    )
  }
}

