import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export const WSContext = React.createContext(new Set());

export class WSProvider extends React.Component {
  static propTypes = {
    channel: propTypes.string.isRequired,
    hostName: propTypes.string.isRequired
  };

  state = { messages: new Set() }

  ws = Rx.Observable.create(observer => {
    try {
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
        observer.next(ws);
        if (ws.readyState === 1) {
          console.log(ws.readyState, '1111')
          observer.complete();
        }
      });
      // ws.addEventListener('message', message => {
      //   observer.next({ws, message});
      //   observer.complete();
      // });
    } catch(err) {
      observer.error(err);
    }
  })

  componentDidMount = () => {
    this.ws.subscribe(ws => {
      console.log(ws.readyState, '2222')
      ws.addEventListener('message', message => {
        const redisMsg = JSON.parse(message.data);
        console.log('message.data', message.data);
        if (redisMsg.action === 'SUBSCRIBEMSG') {
          this.updateMessages(redisMsg);
        }
      })
    });
    // this.connection.subscribe(connection => {
    //   console.log('it goes in her&&&&&')
    //   const redisMsg = JSON.parse(connection.message.data);
    //   if (redisMsg.action === 'SUBSCRIBEMSG') {
    //     this.updateMessages(redisMsg);
    //   }
    // });
    // this.ws = ws;
  }

  handleMessageStream = (e) => {
    if (e.persist) {
      e.persist();
    }
    this.sendMessage(e);
  }

  sendMessage = (e) => {
    const connection = this.ws.map(ws => ws);
    const messages = Rx.Observable.create(observer => {
      try {
        observer.next(e);
        observer.complete();
      } catch(err) {
        observer.error(err);
      }
    });

    connection.subscribe(ws => {
      if (ws.readyState === 1) {
        console.log(ws.readyState, '3333')
        return (
          ws.send(JSON.stringify({
            action:'PUBLISH',
            channels: [this.props.channel],
            message: e.target.value
          }))
        );
      }
    },
    (err) => console.log(`> WS PUBLISH 💥: ${err}`),
    () => console.log(`> Completed PUBLISHing messages 💌`))
  }

  updateMessages = redisMsg => {
    this.setState(({ messages }) => (
      messages.add(redisMsg)
    ));
  }

  render() {
    return (
    <WSContext.Provider value={
        {
          messages: Array.from(this.state.messages),
          send: e => this.handleMessageStream(e)
        }
      }>
      {this.props.children}
    </WSContext.Provider>
    );
  }
};

