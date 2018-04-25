import { SpeechContext } from '../providers/speech/speech-provider';
import { WSContext } from '../providers/connection-provider';

const Consumers = ({ children }) => (
  <SpeechContext.Consumer>
    {speech => (
      <WSContext.Consumer>
        {broker => children({speech, broker})}
      </WSContext.Consumer>
    )}
  </SpeechContext.Consumer>
);

export default Consumers;
