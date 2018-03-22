import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';


console.log(React.createContext);

export default class WSContainer extends React.Component {
  static propTypes = {
    hostName: propTypes.string.isRequired,
  }
  componentDidMount() {
    const connection = Rx.Observable.create(observer => {
      const ws = new WebSocket(`ws://${this.props.hostName}:3001`);
      ws.addEventListener('message', e => {

      })
      observer.next({ws})
    });
    connection.subscribe(ws => {
      console.log('$$$$$', ws)
    })
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>Hello World</div>
    )
  }
}


