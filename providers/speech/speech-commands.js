import Rx from 'rxjs';
export const cmdGrammar = '#JSGF V1.0; grammar commands; public  = go home | show mixtapes | pause | play | stop;'

function Foo(intent) {
  const callbacks = [];
  return {
    register(cb) {
      callbacks.push(cb);
      console.log(' 📞 CallBackableIntention list:', callbacks)
    },
    execute() {
      return;
    }
  }
}

class CallBackableIntent {
  constructor(intention) {
    this.intention = intention;
    this.callbacks = [];
    console.log(' 📞 CallBackableIntention list:', this.callbacks)
  }
  register(callback) {
    this.callbacks.push(callback);
  }
  execute() {
    return;
  }
}

class AbstractCommandFactory {
    speechIntents = [];
    speechObservers = [];

    grammarStream = new Rx.Observable(observer => {
      speechObservers.push(observer);
      grammarStream.next(this.generateGrammar(this.speechIntents));
    });

    register(intents) {
      this.speechIntents.push(intents);
      const grammars = this.generateGrammar(this.speechIntents);
      this.speechObservers.forEach(obs => obs.next(grammars));
    }

    getGrammarStream() {
      return this.grammarStream;
    }

    match(speechResult) {
      const filteredCallBackableIntent = this.speechIntents
      .filter(intent =>  this.speechIntents.includes(speechResult))
      .map(int => new CallBackableIntention(int));
      console.log('** registered intents', this.speechIntents)
      return filteredCallBackableIntent;
    }

    generateGrammar(speechIntents) {
      return `#JSGF V1.0; grammar commands; public  = ${speechIntents.join(" | ")}`
    }
}

export const abstractCommandFactory = new AbstractCommandFactory();
export default abstractCommandFactory;

