import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  state = { messages: new Set()};

  connection = Rx.Observable.create(observer => {
    const ws = new WebSocket(`ws://${this.props.hostName}:3001`);
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        action: 'SUBSCRIBE',
        channels: [this.props.channel]
      }));
      console.log(`
      > ⚗️ Reactive - Websocket client is up and running
      > 📺 Connected to channel: ${this.props.channel}
      `);
      observer.next({ws})
    });
    ws.addEventListener('message', message => {
      observer.next({ws, message})
    });
  });

  componentDidMount = () => {
    console.log('component did mount =======', this.connection)
    this.connection.subscribe(connection => {
      console.log(connection.message, '******');
      const redisMsg = JSON.parse(connection.message);
      switch (redisMsg.action) {
        case 'SUBSCRIBEMSG':
          this.state.messages.add(redisMsg);
          this.setState(this.state);
          connection.next(connection);
          break;
      }
    });
    // console.log(this.state, 'initial state')
    // this.messages = [];
    // this.ws = new WebSocket(`ws://${this.props.hostName}:3001`);
    // this.ws.addEventListener('open', () => {
    //   this.ws.send(JSON.stringify({
    //     action: 'SUBSCRIBE',
    //     channels: ['Hamster']
    //   }));
    //   console.log(`> WS client connection is open`);
    // });
    // this.ws.addEventListener('message', message => {
    //   const redisMsg = JSON.parse(message.data);
    //   switch(redisMsg.action) {
    //     case 'SUBSCRIBEMSG':
    //     this.messages.push(JSON.parse(message.data));
    //   }
    // });
  };

  handleMsgStream = () => {
    return e => {
      e.persist();
      // Rx.Observable.from(this.messages).subscribe(redisMsg => {
      //   this.setState(({ messages }) => {
      //     messages.add(redisMsg);
      //   })
      //   console.log(`> Redis client message: ${this.state}`);
      // });
      // this.ws.send(JSON.stringify({
      //   action: 'PUBLISH',
      //   channels: ['Hamster'],
      //   message: e.target.value
      // }));
      console.log(e.target.value, 'event, ;;;;;')
      this.connection.subscribe(connection => {
        connection.ws.send(JSON.stringify({
          action:'PUBLISH',
          channels: [this.props.channel],
          message: e.target.value
        }))
      })
    }
  }

  render() {
    const messages = Array.from(this.state.messages);
    console.log(messages)
    return (
      <div>
        <textarea onChange={this.handleMsgStream()}/>
        <ul>
        {messages.map((message, index) => (
            <li key={index}>{message.channel}: {message.message}</li>
        ))}
        </ul>
      </div>
    )
  }
}



