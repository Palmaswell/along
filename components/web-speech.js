import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';
import { WSContext, WSProvider } from '../components/connection-provider';

//-- $todo: language selection
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
    recognizing: false,
    speechResult: {
      transcript: '',
      confidence: 0
    },
    timeStamp: 0
  }

  speechRecognition = Rx.Observable.create(observer => {
    const  SpeechRecognition = window.SpeechRecognition ||
                              window.webkitSpeechRecognition ||
                              window.mozSpeechRecognition ||
                              window.msSpeechRecognition ||
                              window.oSpeechRecognition;
    if (!SpeechRecognition) {
      observer.complete();
      return;
    }
    const webSpeechRecognition = new SpeechRecognition();
    webSpeechRecognition.interimResults = false;

    observer.next(webSpeechRecognition);

  })

  displayMesage = brokerSend => {
    brokerSend(this.state.speechResult.transcript);
  }

  handleRecognition = (recognition) => {
    recognition.onstart = () => {
      this.toggleRecognizing();
    };

    recognition.onerror = e => {
      console.warn(`> 💥 Recognition error: ${e}`)
    }

    recognition.onend = () => {
      this.toggleRecognizing();
    }

    recognition.onresult = e => {
      const speechResults = Rx.Observable.from(e.results);
      speechResults.subscribe(result => {
        this.setResultsState(result);
      });
    }

    recognition.onspeechend = () => {
      recognition.stop();
    }
  }

  setResultsState = results => {
    this.setState(({ speechResult }) => {
      speechResult.transcript = results[0].transcript;
      speechResult.confidence = results[0].confidence;
    });
  }

  start = e => {
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
      (err) => console.log(`> Start speech recognition 💥: ${err}`),
      () => console.log(`> Completed start speech recognition 👏`)
    );
  }

  toggleRecognizing = () => {
    this.setState(({ recognizing }) => (
      recognizing = !recognizing
    ));
  }

  updateTimestamp = e => {
    this.setState(({ timeStamp }) => (
      timeStamp = e.timeStamp
    ));
  }

  render () {
    console.log(this.state.speechResult, '******');
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
                  onClick={this.start}
                  type="button">
                  Talk !
                </button>
                <input onChange={e => broker.send(e.target.value)} type="text" />
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
