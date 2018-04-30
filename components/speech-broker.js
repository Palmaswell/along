import React from 'react';
import { abstractCommandFactory } from '../providers/speech/speech-commands';

export default class SpeechBroker extends React.Component {
  state = {};
  static getDerivedStateFromProps(props) {
    console.log('xxxx', props);

    const callableIntents = [];
    callableIntents.push(abstractCommandFactory.register('playlist'));
    callableIntents.push(abstractCommandFactory.register('show playlist'))

    // const registrationList = [];
    // registrationList.push({
    //   callableIntent: abstractCommandFactory.register('playlist'),
    //   action: () => console.log("playlist", props)
    // });
    // registrationList.push({
    //   callableIntent: abstractCommandFactory.register('go to playlist'),
    //   action: () => console.log('go to playlist', props)
    // });
    // registrationList.push({
    //   callableIntent: abstractCommandFactory.register('show playlist'),
    //   action: () => console.log('show playlist', props)
    // });
    // registrationList.push({
    //   callableIntent: abstractCommandFactory.register('show the playlist'),
    //   action: () => console.log('show the playlist', props)
    // });

    callableIntents.forEach(callableIntent => {
      console.log(callableIntent, '((((((((');

      callableIntent.unregister(registeredCallback)
      const registeredCallback = callableIntent.register(console.log('playlist', props))
      // const registeredCallback = registration.callableIntent.register(registration.action);

    })


    return {};
     // broker.ws.next({
            //   action:'PUBLISH',
            //   channels: ['Home'],
            //   message: speech.result.transcript,
            //   id: this.props.spotify.id
            // })
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
