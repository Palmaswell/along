import propTypes from 'prop-types';
import React from 'react';
import Rx from 'rxjs';

import { abstractCommandFactory, cmdGrammar } from './speech-commands';
import { WSProviderSingleton } from '../connection-provider';


export const SpeechContext = React.createContext({
  transcript: '',
  confidence: 0
});

export class SpeechProvider extends React.Component {
  static propTypes = {
    id: propTypes.string,
    channel: propTypes.string.isRequired,
    wsBroker: propTypes.instanceOf(WSProviderSingleton).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      recognizing: false,
      speechResult: {
        transcript: '',
        confidence: 0
      }
    }
    this.ws = this.props.wsBroker.ws;
  }

  componentDidMount() {
    this.instantiateSpeechRecognition();
  }

  instantiateSpeechRecognition = () => {
    const  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList ||window.webkitSpeechGrammarList;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.maxAlternatives = 1; // which is actually default
    this.speechRecognition.interimResults = false;
    this.speechRecognition.lang = 'en-US';

    const recognitionList = new SpeechGrammarList();

    const grammarStream = abstractCommandFactory.getGrammarStream();
    grammarStream.subscribe(grammars => {
      console.log(`
      > ⚡️ This is our currently registered grammar stream:
      >    It uses the JSpeech Grammar Format (JSGF.)
      > 📚 ${grammars}
      `)
      return recognitionList.addFromString(grammars, 1);
    })
    this.speechRecognition.grammar = recognitionList;
  }

  handleRecognition = recognition => {
    recognition.onerror = e => {
      switch (e.error) {
        case 'no-speech':
          console.warn(`> 💥 No speech was detected: ${e.error}`);
          break;
        case 'aborted':
          console.warn(`> 💥 Speech input was aborted: ${e.error}`);
          break;
        case 'audio-capture':
          console.warn(`> 💥 Audio capture failed: ${e.error}`);
          break;
        case 'network':
          console.warn(`> 💥 Network communication required: ${e.error}`);
          break;
        case 'not-allowed':
          console.warn(`> 💥 User agent disallowed speech input: ${e.error}`);
          break;
        case 'service-not-allowed':
          console.warn(`> 💥 User agent disallowed the requested speech recognition service: ${e.error}`);
          break;
        case 'bad-grammar':
          console.warn(`> 💥 Error in the speech recognition grammar: ${e.error}`);
          break;
        default:
          console.warn(`> 💥 The language was not supported: ${e.error}`);
      }
    }

    recognition.onstart = () => {
      this.setState({...this.state, recognizing: true });
    };

    recognition.onresult = e => {
      this.setState(({ speechResult }) => {
        speechResult.transcript = e.results[0][0].transcript;
        speechResult.confidence = e.results[0][0].confidence;
      });

      const filteredIntents = abstractCommandFactory.match(e.results[0][0]);
      //-- This might be the place to include in ws
      filteredIntents.forEach(cbIntent => cbIntent.execute());
      return filteredIntents;
    }

    recognition.onend = e => {
      this.ws.next({
        action: 'PUBLISH',
        channels:[this.props.channel],
        message: this.state.speechResult.transcript
      });
      this.setState({...this.state, recognizing: false});
    }

    recognition.onspeechend = () => {
      recognition.stop();
    }
  }

  start = e => {
    e.persist();
    if (this.state.recognizing) {
      recognition.stop();
    }

    this.speechRecognition.start();
    this.handleRecognition(this.speechRecognition);
  }

  render () {
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
