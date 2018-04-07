import { hydrate, injectGlobal } from 'react-emotion';
import React from 'react';
import { render } from 'react-dom';
import Router from 'next/router';
import { WSContext, WSProvider } from '../components/connection-provider';
import WebSpeech from '../components/web-speech';


// Adds server generated styles to emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined') {
  hydrate(window.__NEXT_DATA__.ids)
}

injectGlobal`
  html, body {
    min-height: 100%;
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
    return <WebSpeech hostName={this.props.hostName} />
  }
}

