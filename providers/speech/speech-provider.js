import React from 'react';
import Rx from 'rxjs';
import { cmdGrammar } from './speech-commands';

export const SpeechContext = React.createContext({
  transcript: '',
  confidence: 0
});
let onEnd;
export class SpeechProvider extends React.Component {
  state = {
    recognizing: false,
    speechResult: {
      transcript: '',
      confidence: 0
    },
    timeStamp: 0
  }

  speechRecognition = Rx.Observable.create(observer => {
    const  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      observer.complete();
      return;
    }
    observer.next(new SpeechRecognition());
  })

  getResultStream = stream => {
    stream.subscribe(result => {
      this.updateState(result);
    });
  }

  handleRecognition = recognition => {
    recognition.onstart = () => {
      this.toggleRecognizing();
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

    // recognition.onend = (e) => {
    //   console.log('this is the ne', e)
    //   this.toggleRecognizing();
    // }

    recognition.onresult = e => {
      const resultStream = Rx.Observable.create(observer => {
        observer.next(e.results)
      })
      this.getResultStream(resultStream);
    }

    recognition.onspeechend = () => {
      recognition.stop();
    }

    recognition.onend = e => {
      console.log(e, 'this is the end 22222')
      onEnd = e;
      return onEnd;
    };

  }

  start = e => {
    e.persist();

    this.speechRecognition.subscribe(recognition => {
      if (this.state.recognizing) {
        recognition.stop();
        return;
      }
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

  toggleRecognizing = () => {
    this.setState(({ recognizing }) => (
      recognizing = !recognizing
    ));
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
    // console.log(onEnd, '*******')
    return (
      <SpeechContext.Provider value={{
        result: this.state.speechResult,
        start: e => this.start(e),
      }}>
        {this.props.children}
      </SpeechContext.Provider>
    );
  }
}
