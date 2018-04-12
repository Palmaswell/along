import Consumers from '../components/consumers';
import { hydrate, injectGlobal } from 'react-emotion';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';
import Router from 'next/router';

export default class extends React.Component {
  static getInitialProps({ req }) {
    // console.log(req, 'on the client, _______')
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
        channel="Home"
        hostName={this.props.hostName}>
        <Consumers>
          {({speech, broker}) => {
            console.log(speech, broker);
            return (
              <div>
                <input onChange={e => broker.send(e.target.value)} type="text" />
                <ul>
                  {broker.messages.map((message, i) => {
                    return (
                      <li key={i}>
                        This is the message {message.channel}: {message.message}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          }}
        </Consumers>
      </Providers>
    );
  }
}



