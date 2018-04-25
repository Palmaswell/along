import Rx from 'rxjs';
export const cmdGrammar = '#JSGF V1.0; grammar commands; public  = go home | show mixtapes | pause | play | stop;'

class CallBackableIntention {
  constructor(intention) {
    this.intention = intention;
    this.callbacks = [];
    console.log('CallBackableIntention list:', this.callbacks)
  }

  register(callback) {
    this.callbacks.push(callback);
  }
}

class AbstractCommandFactory {
    speechIntentions = [];
    speechObservers = [];

    grammarStream = new Rx.Observable(observer => {
      speechObservers.push(observer);
      grammarStream.next(this.generateGrammar(this.speechIntentions));
    });

    register(intents) {
      this.speechIntentions.push(intents);

      const grammars = this.generateGrammar(this.speechIntentions);
      this.speechObservers.forEach(obs => obs.next(grammars));
    }

    getGrammarStream() {
      return this.grammarStream;
    }

    match(speechResult) {
      return this.speechIntentions.filter(intention => {
        this.speechIntentions.includes(speechResult);
      }).map(int =>  new CallBackableIntention(int)); //every intentio should return a CallBackableIntention
    }

    generateGrammar(speechIntentions) {
      return `#JSGF V1.0; grammar commands; public  = ${speechIntentions.join(" | ")}`
    }
}

export const abstractCommandFactory = new AbstractCommandFactory();
export default abstractCommandFactory;

