import { abstractCommandFactory } from './commands';

interface SpeechInit {
    maxAlternatives: number;
    interimResults: boolean;
    lang: string;
}

export interface SpeechResultProps {
    confidence: number;
    transcript: string | string[];
}

export const createRecognition = (init: SpeechInit): SpeechRecognition => {
    const SpeechRecognition = (window as any).SpeechRecognition
      || (window as any).webkitSpeechRecognition;
    const SpeechGrammarList = (window as any).SpeechGrammarList
      || (window as any).webkitSpeechGrammarList;

    const recognition = new SpeechRecognition();
    const recognitionList = new SpeechGrammarList();

    recognition.maxAlternatives = init.maxAlternatives;
    recognition.interimResults = init.interimResults;
    recognition.lang = init.lang;
    console.log(init.lang, 'language it is being reinitiated on action, 8888')

    abstractCommandFactory.getGrammarStream()
    .subscribe((grammars: string) => {
        console.log(`
        > ⚡️ This is our currently registered grammar stream:
        >    It uses the JSpeech Grammar Format (JSGF.)
        > 📚 ${grammars}
        `)
        return recognitionList.addFromString(grammars, 1);
    });
    recognition.grammar = recognitionList;
    return recognition;
};

export default createRecognition;
