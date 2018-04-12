import Consumers from '../components/consumers';
import { hydrate, injectGlobal } from 'react-emotion';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';
import Router from 'next/router';

export default class extends React.Component {
  static getInitialProps({ req }) {
    console.log(req.cookies.access_token, 'on the client, _______')
    if (!req.headers.host.match(/(:1337)/)) {
      return {};
    }
    return {
      hostName: req.headers.host.replace(/(:1337)/, '')
    }
  }

  render() {
    return (
      <Providers
        channel="Hamster"
        hostName={this.props.hostName}>
        <Consumers>
          {({speech, broker}) => {
            console.log(speech, broker);
            return (
              <div>Hi</div>
            )
          }}
        </Consumers>
      </Providers>
    );
  }
}



