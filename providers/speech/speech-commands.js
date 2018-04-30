import Rx from 'rxjs';
export const cmdGrammar = '#JSGF V1.0; grammar commands; public  = go home | show mixtapes | pause | play | stop;'


function CallBackableIntent(intent) {
  return {
    intent,
    callbacks: [],
    publish(...args) {
      this.callbacks.forEach(cb => cb(...args));
    },
    register(cb) {
      this.callbacks.push(cb);
      return cb;
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
      speechObservers.push(observer);
      grammarStream.next(this.generateGrammar(this.speechCallableIntents));
    });

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

    getGrammarStream() {
      return this.grammarStream;
    }

    match(speechResult) {
      const filteredCallBackableIntents = this.speechCallableIntents
      .filter(i =>
        speechResult.confidence > 0.75 &&
        i.intent.includes(speechResult.transcript));
      console.log('filteredIntents 🎤🎤🎤', filteredCallBackableIntents)
      return filteredCallBackableIntents;
    }

    generateGrammar(speechIntents) {
      return `#JSGF V1.0; grammar commands; public  = ${speechIntents.map(i => i.intent).join(" | ")}`
    }
}

export const abstractCommandFactory = new AbstractCommandFactory();
export default abstractCommandFactory;

