import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';
import { WSContext, WSProvider } from '../components/connection-provider';

const languages = Rx.Observable.from(
  [
    [
      'English',
      ['en-AU', 'Australia'],
      ['en-CA', 'Canada'],
      ['en-IN', 'India'],
      ['en-NZ', 'New Zealand'],
      ['en-ZA', 'South Africa'],
      ['en-GB', 'United Kingdom'],
      ['en-US', 'United States']
    ],
    [
      'Español',
      ['es-AR', 'Argentina'],
      ['es-CL', 'Chile'],
      ['es-CO', 'Colombia'],
      ['es-CR', 'Costa Rica'],
      ['es-EC', 'Ecuador'],
      ['es-SV', 'El Salvador'],
      ['es-ES', 'España'],
      ['es-US', 'Estados Unidos']
      ['es-MX', 'México'],
    ],
    [
      'Deutsch',
      ['de-DE']
    ],
  ]
);

export default class WebSpeech extends React.Component {
  static propTypes = {
    hostName: propTypes.string.isRequired
  }

  state = {
    transcript: '',
    recognizing: false,
    timeStamp: 0
  }

  speechRecognition = Rx.Observable.create(observer => {
    try {
      const webSpeechRecognition = new webkitSpeechRecognition();
      webSpeechRecognition.lang = languages[0][1][6];
      webSpeechRecognition.continuous = true;
      webSpeechRecognition.interimResults = true;

      observer.next(webSpeechRecognition);
      observer.complete();
    } catch(err) {
      observer.error(err);
    }
  })

  // recognition.onstart = function() {
  //   recognizing = true;
  //   showInfo('info_speak_now');
  //   start_img.src = 'mic-animate.gif';
  // };

  handleStart = () => {
    // const onStart = this.speechRecognition.map(recognition => recognition);
    // onStart.subscribe(x => {
    //   console.log(x, 'it is actually working')
    // })
    console.log('it definitely goes in here');
  }

  startSpeech = e => {
    e.persist();

    this.speechRecognition.subscribe(recognition => {
      if (this.state.recognizing) {
        recognition.stop();
        return;
      }
      recognition.start();
      this.updateTimestamp(e);
      this.handleStart();
      return recognition;
    },
      (err) => console.warn(err),
      () => console.log('completed')
    );
  }

  updateRecognition = () => {
    this.setState(({recognizing}) => {
      recognizing = !recognizing
    });
    console.log(this.state.recognizing);
  }

  updateTimestamp = e => {
    this.setState(({timeStamp}) => {
      timeStamp = e.timeStamp;
    });
  }

  render () {
    return (
      <WSProvider
        channel="Hamster"
        hostName={this.props.hostName}>
        <WSContext.Consumer>
          {broker => {
            return (
              <div>
                <button
                  name="Start Speech"
                  onClick={this.startSpeech}
                  type="button">
                  Talk !
                </button>
                <input onChange={broker.send} type="text" />
                <ul>
                  {broker.messages.map((message, i) => {
                    return (
                      <li key={i}>
                        This is the message {message.channel}: {message.message}
                      </li>
                    )
                  })}
                </ul>
              </div>
             )
          }}
        </WSContext.Consumer>
      </WSProvider>
    );
  }
}
