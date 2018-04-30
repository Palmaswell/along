import React from 'react';
import Rx from 'rxjs';
import { cmdGrammar } from './speech-commands';
import { abstractCommandFactory } from './speech-commands';


export const SpeechContext = React.createContext({
  transcript: '',
  confidence: 0
});

export class SpeechProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognizing: false,
      speechResult: {
        transcript: '',
        confidence: 0
      },
      timeStamp: 0
    }
  }

  componentDidMount() {
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.SpeechGrammarList = window.SpeechGrammarList ||window.webkitSpeechGrammarList;
  }

  handleRecognition() {
    this.speechRecognition.onerror = e => {
      console.log("error", e);
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

    this.speechRecognition.onend = () => {
      this.speechRecognition = null;
      this.setState({...this.state, recognizing: false});
    }

    this.speechRecognition.onresult = e => {
      const filteredIntents = abstractCommandFactory.match(e.results[0][0]);
      filteredIntents.forEach(cbIntent => cbIntent.publish(this.props));
      // const resultStream = Rx.Observable.create(observer => {
      //   observer.next(e.results)
      // })
      // this.getResultStream(resultStream);
    }

    this.speechRecognition.onspeechend = () => {
      console.log("onSpEnd");
      // recognition.stop();
    }

  }

  start = e => {
    e.persist();

    if (this.speechRecognition) {
      return;
    }
    this.speechRecognition = new this.SpeechRecognition() ;
    this.recognitionList = new this.SpeechGrammarList();
    this.recognitionList.addFromString(cmdGrammar, 1);

    this.speechRecognition.maxAlternatives = 1; // which is actually default
    this.speechRecognition.interimResults = false;
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.grammar = this.recognitionList;
    this.speechRecognition.start();
    this.handleRecognition();

    this.setState({...this.state, recognizing: true});

      // if (this.state.recognizing) {
      //   this.speechRecognition.stop();
      //   return;
      // }
      // Todo: new SpeechGrammarList() and the
      // grammars list should be delivered in the
      // start parameter.
  }

  updateState = result => {
    this.setState(({ speechResult }) => {
      speechResult.transcript = result[0][0].transcript;
      speechResult.confidence = result[0][0].confidence;
    });
  }

  render () {
    console.log(this.state.speechResult, 'the result from origin speech')
    return (
      <SpeechContext.Provider value={{
        result: this.state.speechResult,
        recognizing: this.state.recognizing,
        start: e => this.start(e),
      }}>
        {this.props.children}
      </SpeechContext.Provider>
    );
  }
}
