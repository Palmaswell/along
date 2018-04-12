import React from 'react';
import Rx from 'rxjs';
import { cmdGrammar } from './speech-commands';

export const SpeechContext = React.createContext({
  transcript: '',
  confidence: 0
});

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

  handleRecognition = (recognition) => {
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

  updateTimestamp = e => {
    this.setState(({ timeStamp }) => (
      timeStamp = e.timeStamp
    ));
  }

  render () {
    return (
      <SpeechContext.Provider value={{
        result: this.state.speechResult,
        start: e => this.start(e)
      }}>
        {this.props.children}
      </SpeechContext.Provider>
    );
  }
}
