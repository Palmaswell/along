import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

import { abstractCommandFactory, cmdGrammar } from './speech-commands';

export const SpeechContext = React.createContext({
  transcript: '',
  confidence: 0
});

export class SpeechProvider extends React.Component {
  static propTypes = {
    id: propTypes.string,
    channel: propTypes.string.isRequired,
    wsBroker: propTypes.object.isRequired
  }

  state = {
    recognizing: false,
    speechResult: {
      transcript: '',
      confidence: 0
    }
  }

  ws = this.props.wsBroker.ws

  speechRecognition = Rx.Observable.create(observer => {
    const  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    observer.next(new SpeechRecognition());
  })

  handleRecognition = recognition => {
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

    recognition.onstart = () => {
      this.setState({recognizing: true });
    };

    recognition.onresult = e => {
      this.updateState(e.results);
      this.ws.subscribe(messageStream => {
        console.log('subscribed message stream', messageStream.data)
        const filteredIntents = abstractCommandFactory.match(e.results[0][0]);
        filteredIntents.forEach(cbIntent => cbIntent.execute());
      })
    }

    recognition.onend = e => {
      this.ws.next({
        action: 'PUBLISH',
        channels:[this.props.channel],
        message: this.state.speechResult.transcript
      });
      this.setState({recognizing: false});
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

      const SpeechGrammarList = window.SpeechGrammarList ||window.webkitSpeechGrammarList;
      const recognitionList = new SpeechGrammarList();

      const grammarStream = abstractCommandFactory.getGrammarStream();

      grammarStream.subscribe(grammars => {
        console.log(grammars, '%%% grammars stream');
        return recognitionList.addFromString(grammars, 1);
      })

      recognition.maxAlternatives = 1; // which is actually default
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.grammar = recognitionList;
      recognition.start();
      this.handleRecognition(recognition);
    });
  }

  updateState = result => {
    this.setState(({ speechResult }) => {
      speechResult.transcript = result[0][0].transcript;
      speechResult.confidence = result[0][0].confidence;
    });
  }

  render () {
    // console.log('speech provider 🎤 results', this.state.speechResult)
    return (
      <SpeechContext.Provider
        id={this.props.id}
        value={{
          recognizing: this.state.recognizing,
          result: this.state.speechResult,
          start: e => this.start(e)
        }}
        wsBroker={this.props.wsBroker}>
        {this.props.children}
      </SpeechContext.Provider>
    );
  }
}
