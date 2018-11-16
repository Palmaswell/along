export enum SpeechError {
    noSpeach = 'no-speech',
    aborted = 'aborted',
    audioCapture = 'audio-capture',
    network = 'network',
    notAllowed = 'not-allowed',
    serviceNotAllowed = 'service-not-allowed',
    badGrammar = 'bad-grammar'
  }

  export const handleSpeechError = (error: SpeechError): void => {
    switch(error) {
        case SpeechError.noSpeach:
            console.warn(`> 💥 No speech was detected: ${error}`);
            break;
        case SpeechError.aborted:
            console.warn(`> 💥 Speech input was aborted: ${error}`);
            break;
        case SpeechError.audioCapture:
            console.warn(`> 💥 Audio capture failed: ${error}`);
            break;
        case SpeechError.network:
            console.warn(`> 💥 Network communication required: ${error}`);
            break;
        case SpeechError.notAllowed:
            console.warn(`> 💥 User agent disallowed speech input: ${error}`);
            break;
        case SpeechError.serviceNotAllowed:
            console.warn(`> 💥 User agent disallowed the requested speech recognition service: ${error}`);
            break;
        case SpeechError.badGrammar:
            console.warn(`> 💥 Error in the speech recognition grammar: ${error}`);
            break;
        default:
            console.warn(`> 💥 The language was not supported: ${error}`);
    }
  };

  export default handleSpeechError;