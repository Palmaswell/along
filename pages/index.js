const PubNub = require('pubnub');
const React = require('react');
const superagent = require('superagent');


import styled, {
  hydrate,
  injectGlobal
} from 'react-emotion';

const config = require('../config.client.json');

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
const clientColors = ['FF0B69', '1DACCC', '1195B2', 'FFEB25', 'ccbc1d'];


export default class extends React.Component {
  static async getInitialProps({ req }) {
    if (req) {
      return req.state;
    }

    const { messages } = await superagent.get('http://localhost:3000/message').
      then(res => res.body);
    return { messages };
  }

  constructor() {
    super();
    this.state = { messages: []};
    this.client = clientColors[Math.floor(Math.random() * clientColors.length)];
  }

  componentDidMount() {
    // const wso = (function(){return this}).WebSocket;

    const ws =  new WebSocket (`ws://localhost:${3001}`);
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
        channels: ['hamster']
      }));
    })
    this.ws = ws;

    this.pubnub = new PubNub({
      subscribeKey: config.subscribeKey
    });

    this.pubnub.subscribe({
      channels: ['messages']
    });

    this.pubnub.addListener({
      message: ({ message }) => {
        this.setState(Object.assign({}, this.state, {
          messages: (this.state.messages || this.props.messages).concat([message])
        }));
      }
    });
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe();
  }

  setInput() {
    return ev => {
      const state = this.state || {};
      this.setState(Object.assign({}, state, {
        input: ev.target.value
      }));
    };
  }

  submitMessage() {
    return ev => {
      superagent.post(`/message/${this.client}`, { message: this.state.input }).
        then(() => {
          this.setState(Object.assign({}, this.state, { input: '' }));
        })
    }
  }

  render() {
    const messages = this.state.messages || this.props.messages;
    console.log(messages, 'sfdfd');
    return (
      <div id="container">
        <h1>
          Nanochat
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
          <textarea  onChange={
            (e) => {
              console.log(e.target.value, '@@@');
              return (
                this.ws.send(JSON.stringify({
                  action: 'PUBLISH',
                  channels: ['hamster'],
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

