import * as React from 'react';
import handleSpeechError from './error';
import createRecognition from './recognition';
import { Language } from './languages';
import { abstractCommandFactory } from './commands';
import { WSBroker } from '../websocket/singleton';

interface SpeechProviderProps {
  channel: string;
  lang: Language;
  wsBroker: WSBroker;
}

interface SpeechProviderResult {
    transcript: string | null;
    confidence: number;
    isRecognizing: boolean;
}

interface SpeechContextProps {
  result: SpeechProviderResult;
  start: React.MouseEventHandler<HTMLElement>;
}

export const SpeechContext = React.createContext({
  result: {
    confidence: 0,
    transcript: '',
  }
} as SpeechContextProps);

export class SpeechProvider extends React.Component<SpeechProviderProps, SpeechProviderResult> {
  private recognition;
  private ws;

  public state = {
    transcript: '',
    confidence: 0,
    isRecognizing: false
  }

  public constructor(props) {
    super(props);
    this.ws = this.props.wsBroker;
  }

  public componentDidMount() {
    const { lang } = this.props;
    this.recognition = createRecognition({
      maxAlternatives: 1,
      interimResults: false,
      lang: lang
    })
  }

  private handleRecognition = (recognition): void => {
    recognition.onerror = e => handleSpeechError(e.error);
    recognition.onstart = (): void => {
      this.setState({...this.state, isRecognizing: true});
      console.log(`
        >  🏁 Speech recognition is listening...
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

    recognition.onend = (): void => {
      this.ws.subject.next({
        action: 'PUBLISH',
        channels:[this.props.channel],
        message: this.state.transcript
      });
      this.setState({...this.state, isRecognizing: false});
    }

    recognition.onspeechend = () => recognition.stop();
  }

  private start = (e): void => {
    e.persist();
    if (this.state.isRecognizing) {
      this.recognition.stop();
    }
    this.recognition.start();
    this.handleRecognition(this.recognition);
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
