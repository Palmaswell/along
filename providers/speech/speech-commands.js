import Rx from 'rxjs';
export const cmdGrammar = '#JSGF V1.0; grammar commands; public  = go home | show mixtapes | pause | play | stop;'


function CallBackableIntent(intent) {
  return {
    intent,
    callbacks: [],
    execute(cb, ...args) {
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

    grammarStream = new Rx.Observable(observer => {
      this.speechObservers.push(observer);
      observer.next(this.generateGrammar(this.speechCallableIntents));
    });

    getGrammarStream() {
      return this.grammarStream;
    }

    generateGrammar(speechIntents) {
      return `#JSGF V1.0; grammar commands; public  = ${speechIntents.map(cbIntent => cbIntent.intent).join(" | ")}`
    }

    match(speechResult) {
      const filteredCallBackableIntents = this.speechCallableIntents
      .filter(cbIntent =>
        speechResult.confidence > 0.75 &&
        cbIntent.intent.includes(speechResult.transcript));

      console.log(`
      > 🎙 Intent ${speechResult.transcript} was heard!
      > We heard with confidence score of ${speechResult.confidence.toFixed(2)}.
      `);

      return filteredCallBackableIntents;
    }

    register(intent) {
      const callBackableIntent = CallBackableIntent(intent);
      this.speechCallableIntents.push(callBackableIntent);

      const grammars = this.generateGrammar(this.speechCallableIntents);
      this.speechObservers.forEach(obs => obs.next(grammars));
      return callBackableIntent;
    }

    unregister(intent) {
      const idx = this.speechCallableIntents.indexOf(intent);
      this.speechCallableIntents.splice(idx, 1);
    }
}

export const abstractCommandFactory = new AbstractCommandFactory();
export default abstractCommandFactory;

