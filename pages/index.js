import React from 'react';
import { hydrate, injectGlobal } from 'react-emotion';
import Router from 'next/router';
import WSContainer from '../containers/connection-container';

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

  constructor() {
    super();
    this.state = { messages: []};
  }

  componentDidMount() {

    const ws =  new WebSocket (`ws://${this.props.hostName}:3001`);
    ws.addEventListener('message', e => {
      const redisMsg = JSON.parse(e.data);
      switch (redisMsg.action) {
        case 'SUBSCRIBEMSG':
          this.state.messages.push(redisMsg);
          this.setState(this.state);
      }
      console.log(e);
    });
    ws.addEventListener('open', e => {
      ws.send(JSON.stringify({
        action: 'SUBSCRIBE',
        channels: ['Hamster']
      }));
    })
    this.ws = ws;
  }

  componentWillUnmount() {
    // this.pubnub.unsubscribe();
  }

  setInput() {
    return ev => {
      const state = this.state || {};
      this.setState(Object.assign({}, state, {
        input: ev.target.value
      }));
    };
  }

  render() {
    const messages = this.state.messages || this.props.messages;
    return (
      <div id="container">
        <h1>
          Nanochat <WSContainer hostName={this.props.hostName} />
        </h1>
        <div id="messages">
          {
            messages.map(message => {
              return (
                <div className="message">
                  <span style={{color: `#${message.client}`}}>
                    {message.client}
                  </span>
                  <span className="content">
                    {message.content}
                  </span>
                </div>
              );
            })
          }
        </div>
        <div className="message-input">
          <select id="7411">
              <option>Hamster</option>
              <option>Mouse</option>
          </select>
          <textarea  onChange={
            (e) => {
              const options = document.getElementById('7411');
              console.log(e.target.value, '@@@');
              return (
                this.ws.send(JSON.stringify({
                  action: 'PUBLISH',
                  channels: [options.value],
                  message: e.target.value
                }))
              )
            }
          }>
          </textarea>
          <button>Submit</button>
          <ul>
            {this.state.messages.map((message, index) => (
              <li key={index}>{message.channel}: {message.message}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

