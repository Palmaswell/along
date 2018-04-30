import { SpeechContext } from '../providers/speech/speech-provider';
import { WSContext } from '../providers/connection-provider';

export const Consumers = ({ children }) => (
  <WSContext.Consumer>
    {broker => (
      <SpeechContext.Consumer>
        {speech => children({broker, speech})}
      </SpeechContext.Consumer>
    )}
  </WSContext.Consumer>
);

export default Consumers;
