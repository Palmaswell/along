import * as React from 'react';
import { inject, observer } from 'mobx-react';
import handleSpeechError from './error';
import createRecognition from './recognition';
import * as Store from '../store'
import { abstractCommandFactory } from './commands';
import { WSBroker } from '../websocket/singleton';

interface SpeechProviderProps {
  channel: string;
  wsBroker: WSBroker;
  store?: Store.StoreProps;
}

interface SpeechProviderResult {
    transcript: string | null;
    confidence: number;
    isRecognizing: boolean;
}

interface SpeechContextProps {
  result: SpeechProviderResult;
  start: React.MouseEventHandler<HTMLElement>;
  setLanguage: (lang: Store.Language) => void;
}

export const SpeechContext = React.createContext({
  result: {
    confidence: 0,
    transcript: '',
  }
} as SpeechContextProps);

@inject('store')
@observer
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

  public componentDidMount(): void {
    const { store } = this.props;
    store.setLanguage(store.lang);
    this.recognition = createRecognition({
      maxAlternatives: 1,
      interimResults: false,
      lang: store.lang
    });
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

  private setLanguage = (lang: Store.Language): void => {
    const { store } = this.props;
    store.setLanguage(lang);
    this.recognition = createRecognition({
      maxAlternatives: 1,
      interimResults: false,
      lang: store.lang,
    });
  }

  public render(): JSX.Element {
    return (
      <SpeechContext.Provider
        value={{
          result: this.state,
          start: e => this.start(e),
          setLanguage: (lang: Store.Language) => this.setLanguage(lang),
        }}>
        {this.props.children}
      </SpeechContext.Provider>
    );
  }
}
