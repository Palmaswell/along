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
      const  SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      const webSpeechRecognition = new SpeechRecognition();
      // webSpeechRecognition.continuous = true;
      // webSpeechRecognition.interimResults = false;
      console.log('++++++++++', webSpeechRecognition)

      observer.next(webSpeechRecognition);
      // observer.complete();
    } catch(err) {
      observer.error(err);
    }
  })

  handleRecognition = (recognition) => {
    recognition.onstart = () => {
      console.log('Speech recognition service has started');
      this.toggleRecognizing();
      console.log('onstart recognizing', this.state.recognizing);
    };

    recognition.onend = () => {
      this.toggleRecognizing();
      console.log('onend recognizing', this.state.recognizing);
    }

    recognition.onresult = e => {
      console.log(e.results, 'this are the results');
    }

    recognition.onspeechend = () => {
      recognition.stop();
    }
  }

  startSpeech = e => {
    e.persist();

    this.speechRecognition.subscribe(recognition => {
      if (this.state.recognizing) {
        recognition.stop();
        return;
      }

      recognition.lang = 'en-US';
      recognition.start();
      this.updateTimestamp(e);
      this.handleRecognition(recognition);
    },
      (err) => console.log(err),
      () => console.log('completed')
    );
  }

  toggleRecognizing = () => {
    this.setState(({ recognizing }) => {
      recognizing = !recognizing;
    });
  }

  updateTimestamp = e => {
    this.setState(({ timeStamp }) => {
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
