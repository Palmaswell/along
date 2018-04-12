import Consumers from '../components/consumers';
import { hydrate, injectGlobal } from 'react-emotion';
import Providers from '../components/providers';
import React from 'react';
import { render } from 'react-dom';
import Router from 'next/router';

export default class extends React.Component {
  static getInitialProps({ req }) {
    console.log(req.cookies, 'on the client, _______')
    if (!req.headers.host.match(/(:1337)/)) {
      return {
        cookies: req.cookies
      };
    } else {
      return {
        cookies: req.cookies,
        hostName: req.headers.host.replace(/(:1337)/, '')
      }
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
            // if (speech.stream) {
            //   // speech.stream.subscribe(result => {
            //   //   console.log(result[0][0], 'final________');
            //   //   broker.send(result[0][0].transcript)
            //   // })
            //   console.log(speech.stream, 'final________');
            // }
            return (
              <div>
                {/* <div>COOKIES {JSON.stringify(this.props.cookies)}</div> */}
                <button
                  name="Start Speech"
                  onClick={speech.start}
                  type="button">
                  Talk !
                </button>
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



