import * as React from 'react';
import { abstractCommandFactory } from './commands';
import handleSpeechError from './error';
import { WSSingletonProps } from '../websocket/singleton';

export interface SpeechProviderProps {
  channel: string;
  wsBroker: {
    wsSingleton: WSSingletonProps;
  };
}

export interface SpeechResult {
    transcript: string | null;
    confidence: number;
    isRecognizing: boolean;
}

export interface SpeechContextProps {
  result: SpeechResult;
  start: React.MouseEventHandler<HTMLElement>;
}

export const SpeechContext = React.createContext({
  result: {
    confidence: 0,
    transcript: null,
  }
} as SpeechContextProps);

export class SpeechProvider extends React.Component<SpeechProviderProps, SpeechResult> {

  private speechRecognition;
  private ws;


  public constructor(props) {
    super(props);

    this.state = {
      transcript: null,
      confidence: 0,
      isRecognizing: false
    }
    this.ws = this.props.wsBroker;
  }

  public componentDidMount() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition = (): void => {
    const  SpeechRecognition  = (window as any).SpeechRecognition
      || (window as any).webkitSpeechRecognition;
    const SpeechGrammarList = (window as any).SpeechGrammarList
      || (window as any).webkitSpeechGrammarList;

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

  private handleRecognition = (recognition): void => {
    recognition.onerror = e => handleSpeechError(e.error);
    recognition.onstart = (): void => {
      this.setState({...this.state, isRecognizing: true});
      console.log(`
        > Speech Recognition has begun listening ...
      `);
    };

    recognition.onresult = e => {
      this.setState({
        ...this.state,
        transcript: e.results[0][0].transcript,
        confidence: e.results[0][0].confidence
      })

      const filteredIntents = abstractCommandFactory.match(e.results[0][0]);
      filteredIntents.forEach(cbIntent => cbIntent.execute());
      return filteredIntents;
    }

    recognition.onend = () => {
      this.ws.subject.next({
        action: 'PUBLISH',
        channels:[this.props.channel],
        message: this.state.transcript
      });
      this.setState({...this.state, isRecognizing: false});
    }

    recognition.onspeechend = () => {
      recognition.stop();
    }
  }

  private start = e => {
    e.persist();
    if (this.state.isRecognizing) {
      this.speechRecognition.stop();
    }
    this.speechRecognition.start();
    this.handleRecognition(this.speechRecognition);
  }

  public render(): JSX.Element {
    return (
      <SpeechContext.Provider
        value={{
          result: this.state,
          start: e => this.start(e)
        }}>
        {this.props.children}
      </SpeechContext.Provider>
    );
  }
}
