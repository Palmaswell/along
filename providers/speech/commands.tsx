import { Observable } from 'rxjs';
import { sanatizedIntent } from '../../utils/sanatized-intent';
import { IntentProps } from '../../intents/intents';


function CallBackableIntent(intent: IntentProps) {
  return {
    intent,
    callbacks: [],
    execute(...args) {
      this.callbacks.find(cb => cb === cb)(...args);
    },
    register(cb) {
      const callbacks = this.callbacks;
      callbacks.push(cb);
    },
    unregister(cb) {
      const idx = this.callbacks.indexOf(cb);
      this.callbacks.splice(idx, 1);
    }
  }
}

class AbstractCommandFactory {
    speechCallableIntents = [];
    speechObservers = [];

    grammarStream = new Observable(observer => {
      observer.next(this.generateGrammar(this.speechCallableIntents));
    });

    getGrammarStream() {
      return this.grammarStream;
    }

    generateGrammar(speechIntents) {
      return `#JSGF V1.0; grammar commands; public  = ${speechIntents.map(cbIntent => sanatizedIntent(cbIntent.intent)).join(" | ")}`
    }

    match(speechResult) {
      const filteredCallBackableIntents = this.speechCallableIntents
      .filter(cbIntent =>
        speechResult.confidence > 0.75 &&
        cbIntent.intent.includes(speechResult.transcript));

      console.log(`
      > 🎙 Intent ${speechResult.transcript} was heard!
      > We heard with a confidence score of ${speechResult.confidence.toFixed(2)}.
      `);

      return filteredCallBackableIntents;
    }

    register(intent) {
      const callBackableIntent = CallBackableIntent(sanatizedIntent(intent));
      this.speechCallableIntents.push(callBackableIntent);

      this.generateGrammar(this.speechCallableIntents);
      return callBackableIntent;
    }

    unregister(intent) {
      const idx = this.speechCallableIntents.indexOf(intent);
      this.speechCallableIntents.splice(idx, 1);
    }
}

export const abstractCommandFactory = new AbstractCommandFactory();
export default abstractCommandFactory;

