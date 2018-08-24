import * as React from 'react';
import { abstractCommandFactory } from './commands';
import { WSSingletonProps } from '../websocket/singleton';

export interface SpeechProviderProps {
  channel: string;
  wsBroker: {
    wsSingleton: WSSingletonProps;
  };
}

export interface SpeechResult {
    transcript: string;
    confidence: number;
}

export interface SpeechContextProps {
  result: SpeechResult;
  start: React.MouseEventHandler<HTMLElement>;

}

export const SpeechContext = React.createContext({
  result: {
    confidence: 0,
    transcript: '',
  },
} as SpeechContextProps);

export class SpeechProvider extends React.Component<SpeechProviderProps, SpeechResult> {
  private isRecognizing;
  private speechRecognition;
  private ws;


  public constructor(props) {
    super(props);

    this.state = {
      transcript: '',
      confidence: 0
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

    recognition.onstart = (): void => {
      this.isRecognizing = true;
      console.log(`
        > Speech Recognition has begun listening 👂🏼
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
      this.isRecognizing = false;
    }

    recognition.onspeechend = () => {
      recognition.stop();
    }
  }

  private start = e => {
    e.persist();
    if (this.isRecognizing) {
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
