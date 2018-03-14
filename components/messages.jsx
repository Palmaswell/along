import React from 'react';
import PubNub from 'pubnub';
import superagent from 'superagent';
import pubNubConfig from '../pubnub.config';

export default class Messages extends React.Component {
  static async getInitialProps({ req }) {
    if (req) {
      return req.state;
    }
    const { messages } = await superagent.get(`http://localhost:3000/message`).then(res => res.body);

    return { messages };
  }

  constructor() {
    super();
    this.state = { input: ''};
  }

  componentDidMount() {
    this.pubnub = new PubNub({
      subscribeKey: pubNubConfig.subscribeKey
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
    console.log(this.state, '🌈');
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
