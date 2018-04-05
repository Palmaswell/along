import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';
import { WSContext, WSProvider } from '../components/connection-provider';

const languages = Rx.Observable.from(
  [
    {
      lang: 'English',
      countries: {
        'Australia': 'en-AU',
        'Canada': 'en-CA',
        'New Zealand': 'en-NZ',
        'South Africa': 'en-ZA',
        'United Kingdom': 'en-GB',
        'United States': 'en-US'
      }
    },
    {
      lang: 'Español',
      countries: {
        'Argentina': 'es-AR',
        'Chile': 'es-CL',
        'Costa Rica': 'es-CR',
        'España': 'es-ES',
        'Estados Unidos': 'es-US',
        'México': 'es-MX'
      }
    },
    {
      lang: 'Deutsch',
      countries: {
        'Austria': 'de-AT',
        'Germany': 'de-DE',
        'Liechtenstein': 'de-LI',
        'Luxembourg': 'de-LU',
        'Switzerland': 'de-CH',
      }
    }
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
      webSpeechRecognition.continuous = true;
      webSpeechRecognition.interimResults = true;
      // webSpeechRecognition.lang = languages[0][1][0];


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
    const onStart = this.speechRecognition.map(recognition => recognition);
    onStart.subscribe(recognition => {
      console.log(recognition, 'it is actually working');
      // recognition.onstart = () => {
      //   console.log('Speech recognition service has started');
      //   this.toggleRecognizing();
      // };
    })
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
      this.toggleRecognizing();
      this.handleStart();
      // return recognition;
    },
      (err) => console.log(err),
      () => console.log('completed')
    );
  }

  toggleRecognizing = () => {
    this.setState(({ recognizing }) => {
      recognizing = !recognizing;
      console.log(recognizing, '!!!!!!!!');
    });
  }

  updateTimestamp = e => {
    this.setState(({ timeStamp }) => {
      timeStamp = e.timeStamp;
    });
  }

  render () {
    console.log('++++++++', this.state.recognizing)
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
