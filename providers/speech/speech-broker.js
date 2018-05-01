import propTypes from 'prop-types';
import React from 'react';

export default class SpeechBroker extends React.Component {
  static propTypes = {
    registrationList:propTypes.array.isRequired
  }

  // static getDerivedStateFromProps(props) {

  // }

  // state = {};


  render() {
    return (
      <React.Fragment>
          {this.props.children}
      </React.Fragment>
    )
  }
}
