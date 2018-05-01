import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

import { cmdGrammar } from './speech-commands';

export const SpeechContext = React.createContext({
  transcript: '',
  confidence: 0
});

export class SpeechProvider extends React.Component {
  static propTypes = {
    ws: propTypes.object
  }

  state = {
    recognizing: false,
    speechResult: {
      transcript: '',
      confidence: 0
    },
    timeStamp: 0
  }
  constructor(props) {
    super(props);
    console.log('speech provider 🎤', this.props)
  }
  speechRecognition = Rx.Observable.create(observer => {
    const  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    observer.next(new SpeechRecognition());
  })

  handleRecognition = recognition => {
    recognition.onstart = () => {
      this.setState({recognizing: true });
    };

    recognition.onerror = e => {
      switch (e.error) {
        case 'network':
          console.warn(`> 💥 Network recognition error: ${e.error}`);
          break;
        case 'not-allowed':
        case 'service-not-allowed':
          console.warn(`> 💥 Service-Not-Allowed recognition error: ${e.error}`);
          break;
      }
    }

    recognition.onend = (e) => {
      this.setState({recognizing: false});
    }

    recognition.onresult = e => {
      this.updateState(e.results)
    }

    recognition.onspeechend = () => {
      recognition.stop();
    }
  }

  start = e => {
    e.persist();

    this.speechRecognition.subscribe(recognition => {
      if (this.state.recognizing) {
        recognition.stop();
      }
      // Todo: new SpeechGrammarList() and the
      // grammars list should be delivered in the
      // start parameter.
      const SpeechGrammarList = window.SpeechGrammarList ||window.webkitSpeechGrammarList;
      const recognitionList = new SpeechGrammarList();
      recognitionList.addFromString(cmdGrammar, 1);

      recognition.maxAlternatives = 1; // which is actually default
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.grammar = recognitionList;
      recognition.start();
      this.updateTimestamp(e);
      this.handleRecognition(recognition);
    });
  }

  updateState = result => {
    this.setState(({ speechResult }) => {
      speechResult.transcript = result[0][0].transcript;
      speechResult.confidence = result[0][0].confidence;
    });
  }

  updateTimestamp = e => {
    this.setState(({ timeStamp }) => (
      timeStamp = e.timeStamp
    ));
  }

  render () {
    console.log('speech provider 🎤 results', this.state.speechResult)
    return (
      <SpeechContext.Provider
        value={{
          recognizing: this.state.recognizing,
          result: this.state.speechResult,
          start: e => this.start(e)
        }}
        ws={this.props.ws}>
        {this.props.children}
      </SpeechContext.Provider>
    );
  }
}
