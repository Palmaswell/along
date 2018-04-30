import React from 'react';
import Rx from 'rxjs';
import { cmdGrammar } from './speech-commands';
import { abstractCommandFactory } from './speech-commands';


export const SpeechContext = React.createContext({
  transcript: '',
  confidence: 0
});


export class SpeechProvider extends React.Component {
  SpeechGrammarList() {
    const x = window.SpeechGrammarList ||window.webkitSpeechGrammarList;
    return new x();
  }
  SpeechRecognition() {
    const x = window.SpeechRecognition || window.webkitSpeechRecognition;
    return new x();
  }

  constructor (props) {
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

  // getResultStream = stream => {
  //   stream.subscribe(result => {
  //     this.updateState(result);
  //   });
  // }

  handleRecognition() {
    console.log("handler");
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

    this.speechRecognition.onend = (e) => {
      console.log("onEnd");
      this.speechRecognition = null;
      this.setState({...this.state, recognizing: false});
      // this.toggleRecognizing();
    }

    this.speechRecognition.onresult = e => {
      // console.log(e.results);
      const fintents = abstractCommandFactory.match(e.results[0][0]);
      console.log(fintents, 'match on');
      // fintents.forEach(fi => fi.publish());
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
    this.speechRecognition = this.SpeechRecognition() ;

    this.recognitionList = this.SpeechGrammarList();
    this.recognitionList.addFromString(cmdGrammar, 1);

    this.speechRecognition.maxAlternatives = 1; // which is actually default
    this.speechRecognition.interimResults = false;
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.grammar = this.recognitionList;
    this.speechRecognition.start();
    // this.updateTimestamp(e);
    this.handleRecognition();

    this.setState({...this.state, recognizing: true});

      // if (this.state.recognizing) {
      //   this.speechRecognition.stop();
      //   return;
      // }
      // Todo: new SpeechGrammarList() and the
      // grammars list should be delivered in the
      // start parameter.


    // };
  }

  // toggleRecognizing = () => {
  //   this.setState(({ recognizing }) => (
  //     recognizing = !recognizing
  //   ));
  // }

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
