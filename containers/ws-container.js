import PropTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

export default class WSContainer extends React.Component {
  componentDidMount() {
    const connection = Rx.Observable.create(observer => {
      const ws = new WebSocket(`ws://${this.props.host}:3001`);
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

WSContainer.PropTypes = {
  host: PropTypes.string.isRequired,
};
