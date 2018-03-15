import React from 'react';
import PubNub from 'pubnub';
import config from '../config.client.json';
import superagent from 'superagent';

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
    this.state = { input: '' };
    this.client = clientColors[Math.floor(Math.random() * clientColors.length)];
  }

  componentDidMount() {
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
    console.log(messages, '🌈!');
    console.log(this.pubnub, '$$$$')
    return (
      <div>
        <h1>
          Nanochat
        </h1>
        <div className="message-input">
          <textarea value={this.state.input} onChange={this.setInput()}>
          </textarea>
          <button onClick={this.submitMessage()}>Submit</button>
        </div>
      </div>
    )
  }
}
